'use strict';
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const Joi = require('joi');
const Anthropic = require('@anthropic-ai/sdk');

// ── Startup guard ──────────────────────────────────────────────────────────────
// Refuse to start without the API key so failures are immediate and obvious.
if (!process.env.ANTHROPIC_API_KEY) {
  console.error('FATAL: ANTHROPIC_API_KEY is not set. Server will not start.');
  process.exit(1);
}

const app = express();
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ── Error class ────────────────────────────────────────────────────────────────
class AppError extends Error {
  constructor(message, statusCode, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

// ── Idempotency store (in-memory, TTL 60 s, max 1000 entries) ─────────────────
const idempotencyStore = new Map();
const IDEMPOTENCY_MAX = 1000;

function pruneIdempotency() {
  const cutoff = Date.now() - 60000;
  for (const [k, v] of idempotencyStore) {
    if (v.ts < cutoff) idempotencyStore.delete(k);
  }
}
setInterval(pruneIdempotency, 30000);

// ── Allowed country codes (matches crisis-data.js) ────────────────────────────
const ALLOWED_COUNTRIES = new Set(['ZA', 'US', 'GB', 'AU', 'NG', 'KE', 'INTL']);

// Allowed mode strings (must be one of the client-side MODES labels)
const ALLOWED_MODES = new Set([
  "I'm feeling anxious", "I'm feeling low", "I need to talk", "I'm frustrated",
  "I feel lost", "I'm overwhelmed", "Something good happened", "I want to reflect"
]);

// ── Input sanitiser — strips prompt-injection characters ──────────────────────
// Removes newlines, null bytes, and Unicode control chars from strings that
// will be embedded in the AI system prompt.
function sanitiseForPrompt(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/[\r\n\t\0]/g, ' ').trim().slice(0, 200);
}

// ── Trust proxy (required for accurate IP-based rate limiting behind Nginx/Railway) ──
app.set('trust proxy', 1);

// ── Security headers (Helmet) ──────────────────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'none'"],
      scriptSrc:  ["'self'"],
      styleSrc:   ["'none'"],
      imgSrc:     ["'none'"],
      connectSrc: ["'self'"],
      frameAncestors: ["'none'"],
      formAction: ["'none'"],
    },
  },
  referrerPolicy: { policy: 'no-referrer' },
  crossOriginResourcePolicy: { policy: 'same-origin' },
  xFrameOptions: { action: 'deny' },
}));

// ── CORS — strict, no wildcard fallback ───────────────────────────────────────
const allowedOrigin = process.env.ALLOWED_ORIGIN;
if (!allowedOrigin && process.env.NODE_ENV === 'production') {
  console.error('FATAL: ALLOWED_ORIGIN is not set in production. Server will not start.');
  process.exit(1);
}

app.use(cors({
  origin: allowedOrigin || 'http://localhost:8080',
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'X-Idempotency-Key'],
  credentials: false,
}));

// ── Body parser — tight limit ──────────────────────────────────────────────────
app.use(express.json({ limit: '20kb' }));

// ── Prevent API responses from being cached by intermediary proxies ────────────
app.use('/api/', (_req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  next();
});

// ── Rate limits ────────────────────────────────────────────────────────────────

// Global: 50 req / 15 min per IP
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please wait a few minutes.' },
  // Skip health check from rate limiting
  skip: (req) => req.path === '/health',
}));

// Chat: 10 req / min per IP
const chatLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { error: "You've reached the message limit. Come back a little later." },
});

// Log-error: 20 req / min per IP (prevent log-flood DoS)
const logErrorLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: { error: 'Log rate limit exceeded.' },
});

// ── Validation schemas ─────────────────────────────────────────────────────────
const chatSchema = Joi.object({
  messages: Joi.array().items(
    Joi.object({
      role:    Joi.string().valid('user', 'assistant').required(),
      content: Joi.string().max(2000).required(),
    })
  ).max(50).min(1).required(),
  country:     Joi.string().max(10).default('INTL'),
  mode:        Joi.string().max(60).default(''),
  safetyLevel: Joi.number().integer().min(0).max(3).default(0),
});

const reflectSchema = Joi.object({
  summary:    Joi.string().max(1000).required(),
  mode:       Joi.string().max(60).default(''),
  moodBefore: Joi.number().integer().min(0).max(4).default(2),
  moodAfter:  Joi.number().integer().min(0).max(4).default(2),
});

// ── User-facing validation error map ──────────────────────────────────────────
// Never expose raw Joi schema details to clients.
function toPublicError(joiError) {
  const key = joiError.details[0].context && joiError.details[0].context.key;
  const map = {
    messages: 'Invalid message format.',
    content:  'Message too long.',
    summary:  'Summary too long.',
  };
  return map[key] || 'Invalid request.';
}

// ── Crisis lines (server-side, for system prompt injection) ───────────────────
const CRISIS_LINES = {
  ZA:   'SADAG 24-Hour Helpline: 0800 456 789 | Suicide Crisis: 0800 567 567',
  US:   '988 Suicide & Crisis Lifeline: 988 | Crisis Text: text HOME to 741741',
  GB:   'Samaritans: 116 123 | Crisis Text: text SHOUT to 85258',
  AU:   'Lifeline: 13 11 14 | Beyond Blue: 1300 22 4636',
  NG:   'SURPIN: 0800-500-200 | Emergency: 112',
  KE:   'Befrienders Kenya: +254 722 178 177 | Emergency: 112',
  INTL: 'Find A Helpline: findahelpline.com | Emergency: 112',
};

function getCrisisLine(country) {
  // Only use known-safe country codes — never user-supplied raw strings
  const safe = ALLOWED_COUNTRIES.has(country) ? country : 'INTL';
  return CRISIS_LINES[safe];
}

// ── System prompt builder ──────────────────────────────────────────────────────
function buildSystemPrompt(country, mode, safetyLevel) {
  // Sanitise user-controlled fields before embedding in the prompt.
  // This prevents prompt-injection attempts via crafted mode/country values.
  const safeCountry = ALLOWED_COUNTRIES.has(country) ? country : 'INTL';
  const safeMode    = ALLOWED_MODES.has(mode) ? mode : sanitiseForPrompt(mode);
  const crisisLine  = getCrisisLine(safeCountry);

  const base = [
    'You are Beru, a warm AI mental wellness companion. You talk like a real friend — honest, present, unhurried. Never clinical, never performative.',
    'Response length: 2–5 sentences. One question at a time. Lead with feeling before asking anything.',
    'Never say "I hear you" or "That must be really hard". Never list steps. Never rush to resolution.',
    'WHO Safe Messaging Guidelines: Never romanticise self-harm. Never provide methods. Always validate the person first.',
    'If someone shares suicidal thoughts: stay with them. Gently mention the local crisis line after validating.',
    'Content hard block: never produce self-harm methods, sexual content, dangerous medical advice, or hate speech.',
    'Blocked content response: "That\'s not something I can help with, but I\'m here — tell me what\'s really going on."',
    'Local crisis line for this user: ' + crisisLine,
  ];

  if (safeMode) base.push('Current mode: ' + safeMode);

  if (safetyLevel >= 3) {
    base.push('CRITICAL: User has expressed suicidal ideation. Stay present. Validate first. Gently mention: ' + crisisLine);
  } else if (safetyLevel === 2) {
    base.push('ELEVATED: User may be experiencing domestic violence or trauma. Believe them first. Ask what they need right now.');
  } else if (safetyLevel === 1) {
    base.push('CONCERN: Substance use mentioned. Be warm and non-judgmental. Focus on how they feel today.');
  }

  return base.join('\n');
}

// ── Routes ─────────────────────────────────────────────────────────────────────

// Health check — intentionally minimal, no server fingerprint
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// Chat endpoint
app.post('/api/chat', chatLimit, async (req, res, next) => {
  // Idempotency check (size-bounded store)
  const iKey = req.headers['x-idempotency-key'];
  if (iKey && typeof iKey === 'string' && iKey.length <= 64) {
    if (idempotencyStore.has(iKey)) {
      const cached = idempotencyStore.get(iKey);
      if (cached.response) return res.status(200).json(cached.response);
    }
    // Enforce max size to prevent memory exhaustion
    if (idempotencyStore.size >= IDEMPOTENCY_MAX) pruneIdempotency();
    if (idempotencyStore.size < IDEMPOTENCY_MAX) {
      idempotencyStore.set(iKey, { ts: Date.now(), response: null });
    }
  }

  const { error, value } = chatSchema.validate(req.body, { abortEarly: true });
  if (error) return res.status(400).json({ error: toPublicError(error) });

  const { messages, country, mode, safetyLevel } = value;
  const systemPrompt = buildSystemPrompt(country, mode, safetyLevel);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25000);
  try {
    const response = await client.messages.create(
      {
        model:      'claude-sonnet-4-6',
        max_tokens: 400,
        system:     systemPrompt,
        messages:   messages,
      },
      { signal: controller.signal }
    );

    const reply = response.content[0].text;
    const result = { reply };
    if (iKey && idempotencyStore.has(iKey)) {
      idempotencyStore.set(iKey, { ts: Date.now(), response: result });
    }
    return res.json(result);

  } catch (err) {
    if (err.name === 'AbortError') {
      return next(new AppError("I'm taking too long. Please try again.", 504));
    }
    if (err.status === 429) {
      return next(new AppError("You've reached the message limit. Come back a little later.", 429));
    }
    return next(new AppError("Something got in the way. Let's try that again.", 502));
  } finally {
    clearTimeout(timeout);
  }
});

// Reflection endpoint
app.post('/api/reflect', chatLimit, async (req, res) => {
  const { error, value } = reflectSchema.validate(req.body, { abortEarly: true });
  if (error) return res.status(400).json({ error: toPublicError(error) });

  const { summary, mode, moodBefore, moodAfter } = value;
  const moodLabels = ['Really low', 'Not great', 'Okay', 'Better', 'Good'];

  // Sanitise summary before embedding in prompt
  const safeSummary = sanitiseForPrompt(summary);
  const safeMode    = ALLOWED_MODES.has(mode) ? mode : sanitiseForPrompt(mode);

  const prompt = [
    'Write a single warm, personal reflection sentence (max 25 words) for a Beru session.',
    'Mode: ' + (safeMode || 'general') + '.',
    'Mood before: ' + moodLabels[moodBefore] + '. Mood after: ' + moodLabels[moodAfter] + '.',
    'Conversation summary: ' + safeSummary,
    'Write only the sentence. No quotes. No labels.',
  ].join(' ');

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await client.messages.create(
      { model: 'claude-sonnet-4-6', max_tokens: 80, messages: [{ role: 'user', content: prompt }] },
      { signal: controller.signal }
    );
    return res.json({ reflection: response.content[0].text.trim() });
  } catch {
    return res.json({ reflection: '' });
  } finally {
    clearTimeout(timeout);
  }
});

// Error logging endpoint — accepts minimal structured data, rate-limited
app.post('/api/log-error', logErrorLimit, (req, res) => {
  // Accept only specific safe fields — never log raw user-controlled strings
  const type = typeof req.body.type === 'string' ? req.body.type.slice(0, 30) : 'unknown';
  const src  = typeof req.body.src  === 'string' ? req.body.src.slice(0, 200) : '';
  const line = typeof req.body.line === 'number' ? req.body.line : 0;
  if (process.env.NODE_ENV !== 'production') {
    console.error('[client-error]', { type, src, line });
  }
  res.status(204).end();
});

// GDPR: delete user data
app.delete('/api/user-data', (_req, res) => {
  res.json({ ok: true, message: 'No server-side data stored. Clear browser localStorage to remove all local data.' });
});

// ── 404 handler ────────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Not found.' });
});

// ── Global error handler ───────────────────────────────────────────────────────
// Operational errors return a user-safe message. Programmer errors are logged
// internally and return a generic response — raw stack traces never reach clients.
app.use((err, _req, res, _next) => {
  if (err.isOperational) {
    return res.status(err.statusCode || 400).json({ error: err.message });
  }
  console.error('[programmer-error]', err.message, err.stack);
  res.status(500).json({ error: 'Something went wrong.' });
});

// ── Unhandled rejections & exceptions ─────────────────────────────────────────
process.on('unhandledRejection', (reason) => {
  console.error('[unhandledRejection]', reason);
});
process.on('uncaughtException', (err) => {
  console.error('[uncaughtException]', err.message);
  if (!err.isOperational) process.exit(1);
});

// ── Graceful shutdown ──────────────────────────────────────────────────────────
function shutdown(signal) {
  console.log('[shutdown] received ' + signal + ', closing gracefully');
  process.exit(0);
}
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT',  () => shutdown('SIGINT'));

// ── Start ──────────────────────────────────────────────────────────────────────
if (require.main === module) {
  const PORT = parseInt(process.env.PORT, 10) || 3001;
  app.listen(PORT, () => {
    console.log('Beru server running on port ' + PORT + ' [' + (process.env.NODE_ENV || 'development') + ']');
  });
}

module.exports = app;
