'use strict';
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const Joi = require('joi');
const { v4: uuidv4 } = require('uuid');
const Anthropic = require('@anthropic-ai/sdk');

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

// ── Idempotency store (in-memory, TTL 60 s) ───────────────────────────────────
const idempotencyStore = new Map();
function pruneIdempotency() {
  const cutoff = Date.now() - 60000;
  for (const [k, v] of idempotencyStore) {
    if (v.ts < cutoff) idempotencyStore.delete(k);
  }
}
setInterval(pruneIdempotency, 30000);

// ── Middleware ─────────────────────────────────────────────────────────────────
app.use(express.json({ limit: '50kb' }));
app.use(cors({
  origin: process.env.ALLOWED_ORIGIN || '*',
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'X-Idempotency-Key']
}));

// Global rate limit: 50 req / 15 min
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests. Please wait a few minutes." }
}));

// Chat-specific rate limit: 10 req / min
const chatLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { error: "You've reached the message limit. Come back a little later." }
});

// ── Validation schemas ─────────────────────────────────────────────────────────
const chatSchema = Joi.object({
  messages: Joi.array().items(
    Joi.object({
      role: Joi.string().valid('user', 'assistant').required(),
      content: Joi.string().max(4000).required()
    })
  ).max(100).required(),
  country: Joi.string().max(10).default('INTL'),
  mode: Joi.string().max(60).default(''),
  safetyLevel: Joi.number().integer().min(0).max(3).default(0)
});

const reflectSchema = Joi.object({
  summary: Joi.string().max(2000).required(),
  mode: Joi.string().max(60).default(''),
  moodBefore: Joi.number().integer().min(0).max(4).default(2),
  moodAfter: Joi.number().integer().min(0).max(4).default(2)
});

// ── Crisis lines (server-side copy for system prompt injection) ────────────────
const CRISIS_LINES = {
  ZA: 'SADAG 24-Hour Helpline: 0800 456 789 | Suicide Crisis: 0800 567 567',
  US: '988 Suicide & Crisis Lifeline: 988 | Crisis Text: text HOME to 741741',
  GB: 'Samaritans: 116 123 | Crisis Text: text SHOUT to 85258',
  AU: 'Lifeline: 13 11 14 | Beyond Blue: 1300 22 4636',
  NG: 'SURPIN: 0800-500-200 | Emergency: 112',
  KE: 'Befrienders Kenya: +254 722 178 177 | Emergency: 112'
};

function getCrisisLine(country) {
  return CRISIS_LINES[country] || 'Find A Helpline: findahelpline.com | Emergency: 112';
}

// ── System prompt builder ──────────────────────────────────────────────────────
function buildSystemPrompt(country, mode, safetyLevel) {
  const crisisLine = getCrisisLine(country);

  let base = [
    'You are Beru, a warm AI mental wellness companion. You talk like a real friend — honest, present, unhurried. Never clinical, never performative.',
    'Response length: 2–5 sentences. One question at a time. Lead with feeling before asking anything.',
    'Never say "I hear you" or "That must be really hard". Never list steps. Never rush to resolution.',
    'WHO Safe Messaging Guidelines: Never romanticise self-harm. Never provide methods. Always validate the person first.',
    'If someone shares suicidal thoughts: stay with them, do not deliver a script. Gently mention the local crisis line after validating.',
    'Content hard block: never produce self-harm methods, sexual content, dangerous medical advice, or hate speech.',
    'If asked for blocked content respond warmly: "That\'s not something I can help with, but I\'m here — tell me what\'s really going on."',
    'Local crisis line for this user: ' + crisisLine
  ];

  if (mode) base.push('Current mode: ' + mode);

  if (safetyLevel >= 3) {
    base.push('CRITICAL: User has expressed suicidal ideation. Stay present. Validate first. Gently mention the crisis line: ' + crisisLine);
  } else if (safetyLevel === 2) {
    base.push('ELEVATED: User may be experiencing domestic violence or trauma. Believe them first. Ask what they need right now.');
  } else if (safetyLevel === 1) {
    base.push('CONCERN: Substance use mentioned. Be warm and non-judgmental. Focus on how they are feeling today.');
  }

  return base.join('\n');
}

// ── Routes ─────────────────────────────────────────────────────────────────────

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// Chat endpoint
app.post('/api/chat', chatLimit, async (req, res) => {
  // Idempotency check
  const iKey = req.headers['x-idempotency-key'];
  if (iKey) {
    if (idempotencyStore.has(iKey)) {
      return res.status(200).json(idempotencyStore.get(iKey).response);
    }
    idempotencyStore.set(iKey, { ts: Date.now(), response: null });
  }

  // Validate input
  const { error, value } = chatSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { messages, country, mode, safetyLevel } = value;
  const systemPrompt = buildSystemPrompt(country, mode, safetyLevel);

  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 400,
      system: systemPrompt,
      messages: messages
    });

    const reply = response.content[0].text;
    const result = { reply };

    if (iKey) idempotencyStore.set(iKey, { ts: Date.now(), response: result });
    return res.json(result);

  } catch (err) {
    if (err.status === 429) {
      throw new AppError("You've reached the message limit. Come back a little later.", 429);
    }
    throw new AppError("Something got in the way. Let's try that again.", 502, true);
  }
});

// Reflection endpoint (fire-and-forget short summary)
app.post('/api/reflect', async (req, res) => {
  const { error, value } = reflectSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { summary, mode, moodBefore, moodAfter } = value;
  const moodLabels = ['Really low', 'Not great', 'Okay', 'Better', 'Good'];
  const prompt = [
    'Write a single warm, personal reflection sentence (max 25 words) for a Beru session.',
    'Mode: ' + (mode || 'general') + '. Mood before: ' + moodLabels[moodBefore] + '. Mood after: ' + moodLabels[moodAfter] + '.',
    'Conversation summary: ' + summary,
    'Write only the sentence. No quotes. No labels.'
  ].join(' ');

  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 80,
      messages: [{ role: 'user', content: prompt }]
    });
    return res.json({ reflection: response.content[0].text.trim() });
  } catch {
    return res.json({ reflection: '' });
  }
});

// Error log endpoint (stores nothing — just acknowledges)
app.post('/api/log-error', (req, res) => {
  const { msg, src, line } = req.body || {};
  if (process.env.NODE_ENV !== 'production') {
    console.error('[client error]', msg, src, line);
  }
  res.status(204).end();
});

// GDPR: delete user data
app.delete('/api/user-data', (req, res) => {
  // No server-side user data stored in demo — instruct client to clear localStorage
  res.json({ ok: true, message: 'No server-side data stored. Clear your browser localStorage to remove all local data.' });
});

// ── Global error handler ───────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  if (err.isOperational) {
    return res.status(err.statusCode || 400).json({ error: err.message });
  }
  console.error('[programmer error]', err);
  res.status(500).json({ error: 'Something went wrong.' });
});

// ── Unhandled rejections & exceptions ─────────────────────────────────────────
process.on('unhandledRejection', (reason) => {
  console.error('[unhandledRejection]', reason);
});
process.on('uncaughtException', (err) => {
  console.error('[uncaughtException]', err);
  if (!err.isOperational) process.exit(1);
});

// ── Start ──────────────────────────────────────────────────────────────────────
if (require.main === module) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log('Beru server running on port ' + PORT);
    if (!process.env.ANTHROPIC_API_KEY) {
      console.warn('WARNING: ANTHROPIC_API_KEY is not set. /api/chat will fail.');
    }
  });
}

module.exports = app;
