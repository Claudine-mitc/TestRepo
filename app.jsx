// app.jsx — Beru AI Mental Wellness Companion
// Single-file React app. No build step — Babel transpiles JSX in-browser.

(function () {
  'use strict';

  var useState = React.useState;
  var useEffect = React.useEffect;
  var useRef = React.useRef;

  // ── CSS ────────────────────────────────────────────────────────────────────────

  var CSS = [
    ':root{',
    '--bg:#1A1008;--bg2:#231508;--card:#2A1C0F;--border:#3D2A18;',
    '--text:#F5ECD7;--text2:#C4A882;--accent:#C87840;--accent2:#E09050;',
    '--safe:#4CAF7D;--warn:#E8A020;--danger:#E05040;--radius:16px;',
    '--font:"Nunito",sans-serif;--serif:"Playfair Display",serif;}',
    '.light{--bg:#FFF8F0;--bg2:#FFF1E0;--card:#FFE8CC;--border:#DEB887;--text:#2A1A08;--text2:#6B4C2A;}',
    '*{box-sizing:border-box;margin:0;padding:0;}',
    'body{font-family:var(--font);background:var(--bg);color:var(--text);min-height:100vh;}',
    '#root{min-height:100vh;display:flex;flex-direction:column;}',
    'button{cursor:pointer;border:none;background:none;font-family:var(--font);color:inherit;}',
    'input,textarea,select{font-family:var(--font);color:var(--text);background:var(--card);border:1px solid var(--border);border-radius:8px;padding:10px 14px;font-size:15px;width:100%;outline:none;}',
    'input:focus,textarea:focus,select:focus{border-color:var(--accent);}',
    'textarea{resize:vertical;min-height:80px;}',
    '.screen{min-height:100vh;display:flex;flex-direction:column;background:var(--bg);}',
    '.screen-center{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;background:var(--bg);}',
    '.topbar{display:flex;align-items:center;justify-content:space-between;padding:14px 18px;background:var(--bg);border-bottom:1px solid var(--border);position:sticky;top:0;z-index:10;}',
    '.card{background:var(--card);border:1px solid var(--border);border-radius:var(--radius);padding:16px;}',
    '.btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:12px 20px;border-radius:50px;font-size:15px;font-weight:600;transition:opacity .15s,transform .1s;}',
    '.btn:active{transform:scale(.97);}',
    '.btn-primary{background:var(--accent);color:#fff;}',
    '.btn-primary:hover{opacity:.9;}',
    '.btn-ghost{border:1px solid var(--border);color:var(--text2);}',
    '.btn-ghost:hover{border-color:var(--accent);color:var(--accent);}',
    '.btn-full{width:100%;}',
    '.btn-danger{background:var(--danger);color:#fff;}',
    '.mode-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;padding:16px;}',
    '.mode-card{background:var(--card);border:1.5px solid var(--border);border-radius:var(--radius);padding:18px 14px;cursor:pointer;transition:border-color .15s,transform .1s;display:flex;flex-direction:column;gap:8px;}',
    '.mode-card:hover{border-color:var(--accent);transform:scale(1.02);}',
    '.mode-card:active{transform:scale(.97);border-color:var(--accent);}',
    '.mode-icon{font-size:26px;}',
    '.mode-label{font-size:13px;font-weight:600;color:var(--text2);}',
    '.chat-messages{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:12px;}',
    '.msg{max-width:85%;}',
    '.msg-user{align-self:flex-end;background:var(--accent);color:#fff;border-radius:18px 18px 4px 18px;padding:10px 14px;font-size:15px;}',
    '.msg-assistant{align-self:flex-start;background:var(--card);border-radius:18px 18px 18px 4px;padding:10px 14px;font-size:15px;border:1px solid var(--border);}',
    '.msg-welcome{align-self:center;background:transparent;border:1.5px dashed var(--border);border-radius:12px;padding:10px 16px;font-size:14px;color:var(--text2);font-style:italic;max-width:90%;text-align:center;}',
    '.chat-dock{padding:12px 14px;background:var(--bg2);border-top:1px solid var(--border);display:flex;gap:8px;align-items:flex-end;}',
    '.chat-input{flex:1;border-radius:20px;padding:10px 16px;min-height:42px;max-height:120px;resize:none;}',
    '.send-btn{width:42px;height:42px;border-radius:50%;background:var(--accent);color:#fff;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:18px;}',
    '.mood-bar{display:flex;justify-content:space-between;padding:8px 16px;background:var(--bg2);border-bottom:1px solid var(--border);}',
    '.mood-btn{font-size:22px;opacity:.5;transition:opacity .1s,transform .1s;cursor:pointer;padding:8px;min-width:44px;min-height:44px;display:flex;align-items:center;justify-content:center;}',
    '.mood-btn.active{opacity:1;transform:scale(1.3);}',
    '.breathe-screen{position:relative;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;background:var(--bg);gap:28px;padding:24px;}',
    '.orb{border-radius:50%;background:radial-gradient(circle,var(--accent2),var(--accent));cursor:pointer;transition:width 1.5s ease-in-out,height 1.5s ease-in-out;}',
    '.breath-label{font-size:22px;font-weight:700;color:var(--text);letter-spacing:2px;text-transform:uppercase;}',
    '.drawer-overlay{position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:100;display:flex;align-items:flex-end;}',
    '.drawer{width:100%;max-width:600px;margin:0 auto;background:var(--bg);border-radius:20px 20px 0 0;padding:20px;max-height:80vh;overflow-y:auto;}',
    '.drawer-handle{width:40px;height:4px;background:var(--border);border-radius:2px;margin:0 auto 20px;}',
    '.sidebar-overlay{position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:200;display:flex;}',
    '.sidebar{width:300px;background:var(--bg);height:100vh;overflow-y:auto;padding:20px;display:flex;flex-direction:column;gap:16px;}',
    '.sidebar-tab-bar{display:flex;gap:4px;border-bottom:1px solid var(--border);padding-bottom:12px;flex-wrap:wrap;}',
    '.sidebar-tab{padding:6px 10px;border-radius:8px;font-size:13px;font-weight:600;color:var(--text2);}',
    '.sidebar-tab.active{background:var(--accent);color:#fff;}',
    '.onboarding{min-height:100vh;background:var(--bg);display:flex;flex-direction:column;padding:32px 24px;max-width:480px;margin:0 auto;width:100%;}',
    '.progress-dots{display:flex;gap:8px;margin-bottom:28px;}',
    '.dot{width:8px;height:8px;border-radius:50%;background:var(--border);}',
    '.dot.active{background:var(--accent);}',
    '.fullscreen-overlay{position:fixed;inset:0;z-index:300;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:32px;background:var(--bg);}',
    '@keyframes shimmer{0%{opacity:.4}50%{opacity:.8}100%{opacity:.4}}',
    '.shimmer{animation:shimmer 1.2s ease-in-out infinite;background:var(--card);border-radius:8px;}',
    '@keyframes bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-6px)}}',
    '.typing-dot{width:7px;height:7px;border-radius:50%;background:var(--text2);display:inline-block;animation:bounce 1.2s ease-in-out infinite;}',
    '.typing-dot:nth-child(2){animation-delay:.15s;}',
    '.typing-dot:nth-child(3){animation-delay:.3s;}',
    '.sos-btn{background:var(--danger);color:#fff;border-radius:50px;padding:8px 16px;font-weight:700;font-size:14px;animation:pulse-red 1.5s ease-in-out infinite;}',
    '@keyframes pulse-red{0%,100%{box-shadow:0 0 0 0 rgba(224,80,64,.4)}50%{box-shadow:0 0 0 8px rgba(224,80,64,0)}}',
    '@keyframes confetti-fall{0%{transform:translateY(-20px) rotate(0deg);opacity:1}100%{transform:translateY(100vh) rotate(720deg);opacity:0}}',
    '.confetti-piece{position:fixed;top:0;width:10px;height:10px;border-radius:2px;animation:confetti-fall linear forwards;z-index:400;}',
    '.wrapup{min-height:100vh;overflow-y:auto;display:flex;flex-direction:column;align-items:center;justify-content:center;background:var(--bg);padding:32px 24px;gap:24px;text-align:center;}',
    '::-webkit-scrollbar{width:4px;}',
    '::-webkit-scrollbar-thumb{background:var(--border);border-radius:2px;}'
  ].join('');

  // ── Constants ──────────────────────────────────────────────────────────────────

  var MODES = [
    { id: 'anxious', icon: '🌀', label: "I'm feeling anxious", color: '#5B7FD4', placeholder: "What's going on right now?", welcome: "You're safe here. Let's slow things down together." },
    { id: 'sad', icon: '🌧', label: "I'm feeling low", color: '#7B6BA8', placeholder: "Tell me what's weighing on you...", welcome: "I'm glad you're here. You don't have to carry this alone." },
    { id: 'talk', icon: '💬', label: "I need to talk", color: '#C87840', placeholder: "What's on your mind?", welcome: "I'm listening. Say whatever you need to." },
    { id: 'angry', icon: '🔥', label: "I'm frustrated", color: '#D45C3A', placeholder: "Tell me what happened...", welcome: "Your feelings make sense. Let it out." },
    { id: 'lost', icon: '🧭', label: "I feel lost", color: '#4A9B7F', placeholder: "What feels unclear right now?", welcome: "Being lost doesn't mean you're stuck. Let's think together." },
    { id: 'stress', icon: '⚡', label: "I'm overwhelmed", color: '#C8A020', placeholder: "What's piling up?", welcome: "One thing at a time. Start wherever you are." },
    { id: 'celebrate', icon: '✨', label: "Something good happened", color: '#4CAF7D', placeholder: "Tell me the good news!", welcome: "Tell me everything — I want to hear it." },
    { id: 'reflect', icon: '📝', label: "I want to reflect", color: '#9B7BB8', placeholder: "What are you thinking about?", welcome: "Reflection takes courage. I'm here to think alongside you." }
  ];

  var BEAR_PALETTES = [
    { id: 'warm', body: '#C87840', belly: '#E8A870', eye: '#3D1A00' },
    { id: 'slate', body: '#607080', belly: '#8899AA', eye: '#1A2530' },
    { id: 'rose', body: '#C06080', belly: '#E090A8', eye: '#3A0A20' },
    { id: 'sage', body: '#5A8060', belly: '#85B090', eye: '#0A2010' },
    { id: 'midnight', body: '#3A3060', belly: '#5A5090', eye: '#100820' },
    { id: 'honey', body: '#D4A020', belly: '#ECC050', eye: '#3A2000' }
  ];

  var BREATH_PATTERNS = [
    { id: 'calm', label: '4-4-6', in: 4, hold: 4, out: 6, description: 'Calm & ground' },
    { id: 'box', label: 'Box', in: 4, hold: 4, out: 4, description: 'Box breathing' },
    { id: '478', label: '4-7-8', in: 4, hold: 7, out: 8, description: 'Deep relaxation' }
  ];

  var MOOD_LABELS = ['Really low', 'Not great', 'Okay', 'Better', 'Good'];
  var MOOD_EMOJIS = ['😔', '😟', '😐', '🙂', '😊'];

  var JOURNAL_PROMPTS = [
    'What made you smile today, even a little?',
    'What\'s something you\'re carrying that you haven\'t talked about?',
    'Describe one moment from today in detail.',
    'What do you wish someone understood about how you\'re feeling?',
    'What would you tell yourself from one year ago?',
    'What are three things you\'re grateful for right now?',
    'What\'s something you\'re afraid to want?',
    'How has your body been feeling lately?',
    'What boundary do you need to set — and haven\'t?',
    'What would rest look like for you right now?',
    'What\'s something you\'ve been avoiding? Why?',
    'Write about a recent moment of connection.',
    'What is your inner critic saying lately?',
    'What does your ideal tomorrow look like?',
    'Who in your life makes you feel safe?',
    'What are you learning about yourself lately?',
    'What have you outgrown?',
    'What does loneliness feel like for you?',
    'What do you need more of? Less of?',
    'Write about someone you miss.',
    'What\'s a small act of self-care you keep putting off?',
    'What are you most proud of from the last month?',
    'What emotion are you struggling to name?',
    'Write about a time you surprised yourself.',
    'What does "home" mean to you right now?',
    'What stories are you telling yourself that might not be true?',
    'What does your gut say about a decision you\'re wrestling with?',
    'What do you wish you could say out loud?',
    'What memory keeps returning to you lately?',
    'What does the version of you that feels okay look like?'
  ];

  var COUNTRIES = [
    { code: 'AU', name: 'Australia' },
    { code: 'BR', name: 'Brazil' },
    { code: 'CA', name: 'Canada' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'GH', name: 'Ghana' },
    { code: 'IN', name: 'India' },
    { code: 'KE', name: 'Kenya' },
    { code: 'NG', name: 'Nigeria' },
    { code: 'NZ', name: 'New Zealand' },
    { code: 'PH', name: 'Philippines' },
    { code: 'SG', name: 'Singapore' },
    { code: 'TZ', name: 'Tanzania' },
    { code: 'UG', name: 'Uganda' },
    { code: 'US', name: 'United States' },
    { code: 'ZA', name: 'South Africa' },
    { code: 'ZM', name: 'Zambia' },
    { code: 'ZW', name: 'Zimbabwe' },
    { code: 'INTL', name: 'Other / International' }
  ];

  // ── Helpers ────────────────────────────────────────────────────────────────────

  function LS(key) {
    try { return localStorage.getItem('beru_' + key); } catch (e) { return null; }
  }
  function LSset(key, val) {
    try { localStorage.setItem('beru_' + key, val); } catch (e) {}
  }
  function LSclear() {
    try {
      Object.keys(localStorage).filter(function (k) { return k.startsWith('beru_'); })
        .forEach(function (k) { localStorage.removeItem(k); });
    } catch (e) {}
  }

  // Sanitise a string read from localStorage or external API before rendering.
  // React already escapes JSX text nodes, but this removes control characters
  // and limits length so malformed storage data can't cause layout issues.
  function sanitiseText(val, maxLen) {
    if (val == null) return '';
    return String(val).replace(/[\x00-\x1F\x7F]/g, '').slice(0, maxLen || 120);
  }

  // Allowed ISO country codes — validate before trusting any external source.
  var VALID_COUNTRY_CODES = new Set([
    'AU','BR','CA','DE','FR','GB','GH','IN','KE','NG','NZ','PH',
    'SG','TZ','UG','US','ZA','ZM','ZW','INTL'
  ]);

  function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

  async function fetchWithRetry(url, opts, retries) {
    retries = retries || 3;
    for (var i = 0; i < retries; i++) {
      try { return await fetch(url, opts); } catch (e) {
        if (i < retries - 1) await sleep(1000 * Math.pow(2, i)); else throw e;
      }
    }
  }

  var CB = { failures: 0, openUntil: 0 };
  function isCircuitOpen() { return Date.now() < CB.openUntil; }
  function recordFailure() { CB.failures++; if (CB.failures >= 5) CB.openUntil = Date.now() + 30000; }
  function recordSuccess() { CB.failures = 0; CB.openUntil = 0; }

  async function detectCountry() {
    var stored = LS('country');
    // Validate stored value before trusting it — defence against tampered localStorage
    if (stored && VALID_COUNTRY_CODES.has(stored.toUpperCase())) return stored.toUpperCase();
    try {
      var r = await fetch('https://ipapi.co/json/');
      if (!r.ok) return 'INTL';
      var d = await r.json();
      var raw  = typeof d.country_code === 'string' ? d.country_code.toUpperCase() : '';
      // Only accept a code from our known-safe list
      var code = VALID_COUNTRY_CODES.has(raw) ? raw : 'INTL';
      LSset('country', code);
      // Sanitise the city string before storing — external data, not user-entered
      if (typeof d.city === 'string') LSset('city', sanitiseText(d.city, 80));
      return code;
    } catch (e) { return 'INTL'; }
  }

  function geoLocate(onSuccess, onError) {
    if (!navigator.geolocation) { onError && onError(); return; }
    navigator.geolocation.getCurrentPosition(
      async function (pos) {
        try {
          var lat = pos.coords.latitude;
          var lon = pos.coords.longitude;
          // URLSearchParams prevents any injection via coordinate values
          var params = new URLSearchParams({ lat: lat, lon: lon, format: 'json' });
          var r = await fetch('https://nominatim.openstreetmap.org/reverse?' + params.toString());
          if (!r.ok) { onError && onError(); return; }
          var d = await r.json();
          var raw  = (d.address && typeof d.address.country_code === 'string')
            ? d.address.country_code.toUpperCase() : '';
          // Only accept a code from our known-safe list
          var code = VALID_COUNTRY_CODES.has(raw) ? raw : 'INTL';
          LSset('country', code);
          LSset('geo_consent', 'granted');
          onSuccess && onSuccess(code);
        } catch (e) { onError && onError(); }
      },
      function () { onError && onError(); }
    );
  }

  function detectKeywords(text) {
    var t = text.toLowerCase();
    var l3 = ['kill myself', 'end my life', 'want to die', 'suicidal', 'suicide', 'take my own life', 'no reason to live'];
    var l2 = ['hit me', 'hurting me', 'abuse', 'domestic violence', 'rape', 'assault', 'attacked'];
    var l1 = ['drinking too much', 'drugs', 'overdose', 'self harm', 'cutting', 'substance'];
    if (l3.some(function (w) { return t.includes(w); })) return { level: 3 };
    if (l2.some(function (w) { return t.includes(w); })) return { level: 2 };
    if (l1.some(function (w) { return t.includes(w); })) return { level: 1 };
    return { level: 0 };
  }

  function isBirthday() {
    var raw = LS('birthday');
    if (!raw) return false;
    try {
      var bd = JSON.parse(raw);
      var now = new Date();
      return bd.day === now.getDate() && bd.month === (now.getMonth() + 1);
    } catch (e) { return false; }
  }

  function getTodayPrompt() {
    var idx = parseInt(LS('prompt_index') || '0', 10);
    var lastDate = LS('prompt_date');
    var today = new Date().toDateString();
    if (lastDate !== today) {
      idx = (idx + 1) % JOURNAL_PROMPTS.length;
      LSset('prompt_index', String(idx));
      LSset('prompt_date', today);
    }
    return JOURNAL_PROMPTS[idx];
  }

  function freeCount() {
    var key = 'msgs_' + new Date().toISOString().slice(0, 7);
    return parseInt(LS(key) || '0', 10);
  }

  function incrementFreeCount() {
    var key = 'msgs_' + new Date().toISOString().slice(0, 7);
    LSset(key, String(freeCount() + 1));
  }

  // ── SVG Components ─────────────────────────────────────────────────────────────

  function BearFull({ palette, size }) {
    size = size || 160;
    var p = palette || BEAR_PALETTES[0];
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
        <circle cx="22" cy="26" r="14" fill={p.body} />
        <circle cx="78" cy="26" r="14" fill={p.body} />
        <circle cx="50" cy="60" r="32" fill={p.body} />
        <ellipse cx="50" cy="68" rx="16" ry="11" fill={p.belly} />
        <circle cx="38" cy="53" r="5" fill={p.eye} />
        <circle cx="62" cy="53" r="5" fill={p.eye} />
        <circle cx="39.5" cy="51.5" r="1.8" fill="white" />
        <circle cx="63.5" cy="51.5" r="1.8" fill="white" />
        <ellipse cx="50" cy="63" rx="5.5" ry="3.5" fill={p.eye} opacity="0.7" />
        <path d="M44 71 Q50 76 56 71" stroke={p.eye} strokeWidth="2" strokeLinecap="round" fill="none" />
      </svg>
    );
  }

  function BearHead({ palette, size }) {
    size = size || 36;
    var p = palette || BEAR_PALETTES[0];
    return (
      <svg width={size} height={size} viewBox="0 0 60 60" fill="none">
        <circle cx="11" cy="13" r="9" fill={p.body} />
        <circle cx="49" cy="13" r="9" fill={p.body} />
        <circle cx="30" cy="34" r="22" fill={p.body} />
        <ellipse cx="30" cy="40" rx="9" ry="6" fill={p.belly} />
        <circle cx="22" cy="28" r="4" fill={p.eye} />
        <circle cx="38" cy="28" r="4" fill={p.eye} />
        <circle cx="23.5" cy="26.5" r="1.5" fill="white" />
        <circle cx="39.5" cy="26.5" r="1.5" fill="white" />
        <ellipse cx="30" cy="37" rx="4" ry="2.5" fill={p.eye} opacity="0.7" />
      </svg>
    );
  }

  function BearMood({ level, palette, size }) {
    size = size || 56;
    var p = palette || BEAR_PALETTES[0];
    var mouths = [
      'M22 44 Q30 39 38 44',
      'M24 43 Q30 41 36 43',
      'M24 43 Q30 44 36 43',
      'M22 41 Q30 46 38 41',
      'M20 40 Q30 48 40 40'
    ];
    return (
      <svg width={size} height={size} viewBox="0 0 60 60" fill="none">
        <circle cx="11" cy="13" r="9" fill={p.body} />
        <circle cx="49" cy="13" r="9" fill={p.body} />
        <circle cx="30" cy="34" r="22" fill={p.body} />
        <ellipse cx="30" cy="40" rx="9" ry="6" fill={p.belly} />
        <circle cx="22" cy="28" r="4" fill={p.eye} />
        <circle cx="38" cy="28" r="4" fill={p.eye} />
        <path d={mouths[level != null ? level : 2]} stroke={p.eye} strokeWidth="2.5" strokeLinecap="round" fill="none" />
      </svg>
    );
  }

  function BearBirthday({ palette }) {
    var p = palette || BEAR_PALETTES[0];
    return (
      <svg width="160" height="185" viewBox="0 0 100 115" fill="none">
        <circle cx="22" cy="26" r="14" fill={p.body} />
        <circle cx="78" cy="26" r="14" fill={p.body} />
        <circle cx="50" cy="60" r="32" fill={p.body} />
        <ellipse cx="50" cy="68" rx="16" ry="11" fill={p.belly} />
        <circle cx="38" cy="53" r="5" fill={p.eye} />
        <circle cx="62" cy="53" r="5" fill={p.eye} />
        <circle cx="39.5" cy="51.5" r="1.8" fill="white" />
        <circle cx="63.5" cy="51.5" r="1.8" fill="white" />
        <path d="M44 71 Q50 77 56 71" stroke={p.eye} strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <rect x="34" y="88" width="32" height="20" rx="3" fill="#E8C84A" />
        <rect x="34" y="82" width="32" height="9" rx="3" fill="#F0D878" />
        <line x1="42" y1="82" x2="42" y2="76" stroke="#E05A3A" strokeWidth="2" />
        <line x1="50" y1="82" x2="50" y2="74" stroke="#E05A3A" strokeWidth="2" />
        <line x1="58" y1="82" x2="58" y2="76" stroke="#E05A3A" strokeWidth="2" />
        <circle cx="42" cy="75" r="2" fill="#FFC830" />
        <circle cx="50" cy="73" r="2" fill="#FFC830" />
        <circle cx="58" cy="75" r="2" fill="#FFC830" />
      </svg>
    );
  }

  // ── UI Primitives ──────────────────────────────────────────────────────────────

  function TypingIndicator() {
    return (
      <div className="msg msg-assistant" style={{ display: 'flex', gap: 5, alignItems: 'center', padding: '12px 16px' }}>
        <span className="typing-dot" />
        <span className="typing-dot" />
        <span className="typing-dot" />
      </div>
    );
  }

  function BottomDrawer({ open, onClose, children }) {
    if (!open) return null;
    return (
      <div className="drawer-overlay" onClick={onClose}>
        <div className="drawer" onClick={function (e) { e.stopPropagation(); }}>
          <div className="drawer-handle" />
          {children}
        </div>
      </div>
    );
  }

  function FullScreenOverlay({ children }) {
    return <div className="fullscreen-overlay">{children}</div>;
  }

  function Confetti() {
    var colors = ['#C87840', '#E8A870', '#4CAF7D', '#7B6BA8', '#5B7FD4', '#D45C3A'];
    return (
      <div style={{ pointerEvents: 'none' }}>
        {Array.from({ length: 28 }, function (_, i) {
          return (
            <div key={i} className="confetti-piece" style={{
              left: (i * 3.6) + 'vw',
              background: colors[i % colors.length],
              animationDuration: (1.5 + (i % 5) * 0.4) + 's',
              animationDelay: ((i % 7) * 0.15) + 's',
              width: (8 + (i % 3) * 4) + 'px',
              height: (8 + (i % 3) * 4) + 'px'
            }} />
          );
        })}
      </div>
    );
  }

  // ── Boot Skeleton ──────────────────────────────────────────────────────────────

  function BootSkeleton() {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div className="shimmer" style={{ height: 48, width: '55%', borderRadius: 8 }} />
        <div className="shimmer" style={{ height: 200, borderRadius: 16 }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[1, 2, 3, 4].map(function (i) { return <div key={i} className="shimmer" style={{ height: 100, borderRadius: 16 }} />; })}
        </div>
      </div>
    );
  }

  // ── Onboarding ─────────────────────────────────────────────────────────────────

  function Onboarding({ onComplete, detectedCountry }) {
    var [step, setStep] = useState(1);
    var [firstName, setFirstName] = useState('');
    var [surname, setSurname] = useState('');
    var [gender, setGender] = useState('');
    var [race, setRace] = useState('');
    var [bdDay, setBdDay] = useState('');
    var [bdMonth, setBdMonth] = useState('');
    var [country, setCountry] = useState(detectedCountry || 'INTL');
    var [city, setCity] = useState('');
    var [consented, setConsented] = useState(false);

    var months = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];

    var maxDays = bdMonth
      ? new Date(2000, parseInt(bdMonth, 10), 0).getDate()
      : 31;

    function canContinue() {
      if (step === 1) return firstName.trim() && surname.trim() && gender;
      if (step === 2) return country && city.trim();
      return consented;
    }

    function next() {
      if (step < 3) { setStep(step + 1); return; }
      LSset('name', firstName.trim());
      LSset('surname', surname.trim());
      LSset('gender', gender);
      LSset('race', race);
      LSset('country', country);
      LSset('city', city.trim());
      if (bdDay && bdMonth) LSset('birthday', JSON.stringify({ day: parseInt(bdDay, 10), month: parseInt(bdMonth, 10) }));
      LSset('onboarded', '1');
      onComplete(country);
    }

    var titles = ['Nice to meet you', 'Where are you?', 'A few things first'];
    var subtitles = [
      'Tell me a little about yourself.',
      'This helps me show you local support if you ever need it.',
      'Beru is a safe space. Let\'s set some ground rules.'
    ];

    return (
      <div className="onboarding">
        <div style={{ marginBottom: 12 }}>
          <BearHead palette={BEAR_PALETTES[0]} size={40} />
        </div>
        <h1 style={{ fontFamily: 'var(--serif)', fontSize: 28, marginBottom: 6 }}>{titles[step - 1]}</h1>
        <p style={{ color: 'var(--text2)', marginBottom: 20, fontSize: 15 }}>{subtitles[step - 1]}</p>
        <div className="progress-dots">
          {[1, 2, 3].map(function (s) { return <div key={s} className={'dot' + (s === step ? ' active' : '')} />; })}
        </div>

        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, flex: 1 }}>
            <div>
              <label style={{ fontSize: 13, color: 'var(--text2)', display: 'block', marginBottom: 4 }}>First name *</label>
              <input value={firstName} onChange={function (e) { setFirstName(e.target.value); }} placeholder="Your first name" maxLength={60} />
            </div>
            <div>
              <label style={{ fontSize: 13, color: 'var(--text2)', display: 'block', marginBottom: 4 }}>Surname *</label>
              <input value={surname} onChange={function (e) { setSurname(e.target.value); }} placeholder="Your surname" maxLength={60} />
            </div>
            <div>
              <label style={{ fontSize: 13, color: 'var(--text2)', display: 'block', marginBottom: 4 }}>Gender *</label>
              <select value={gender} onChange={function (e) { setGender(e.target.value); }}>
                <option value="">Select...</option>
                <option>Female</option><option>Male</option>
                <option>Non-binary</option><option>Prefer not to say</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: 13, color: 'var(--text2)', display: 'block', marginBottom: 4 }}>
                Race <span style={{ fontSize: 11, color: 'var(--accent)' }}>(private, optional)</span>
              </label>
              <select value={race} onChange={function (e) { setRace(e.target.value); }}>
                <option value="">Prefer not to say</option>
                <option>African</option><option>Coloured</option>
                <option>Indian / Asian</option><option>White</option><option>Other</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: 13, color: 'var(--text2)', display: 'block', marginBottom: 4 }}>
                Birthday <span style={{ fontSize: 11, color: 'var(--accent)' }}>(for your special day 🐻)</span>
              </label>
              <div style={{ display: 'flex', gap: 8 }}>
                <select value={bdDay} onChange={function (e) { setBdDay(e.target.value); }} style={{ flex: 1 }}>
                  <option value="">Day</option>
                  {Array.from({ length: maxDays }, function (_, i) { return <option key={i + 1} value={i + 1}>{i + 1}</option>; })}
                </select>
                <select value={bdMonth} onChange={function (e) {
                  var m = e.target.value;
                  setBdMonth(m);
                  if (m && bdDay) {
                    var cap = new Date(2000, parseInt(m, 10), 0).getDate();
                    if (parseInt(bdDay, 10) > cap) setBdDay('');
                  }
                }} style={{ flex: 2 }}>
                  <option value="">Month</option>
                  {months.map(function (m, i) { return <option key={i + 1} value={i + 1}>{m}</option>; })}
                </select>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, flex: 1 }}>
            <div>
              <label style={{ fontSize: 13, color: 'var(--text2)', display: 'block', marginBottom: 4 }}>Country *</label>
              <select value={country} onChange={function (e) { setCountry(e.target.value); }}>
                {COUNTRIES.map(function (c) { return <option key={c.code} value={c.code}>{c.name}</option>; })}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 13, color: 'var(--text2)', display: 'block', marginBottom: 4 }}>City / Town *</label>
              <input value={city} onChange={function (e) { setCity(e.target.value); }} placeholder="Where are you based?" maxLength={80} />
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1 }}>
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>🐻</div>
              <p style={{ fontSize: 15, lineHeight: 1.7 }}>You matter. Whatever you bring here — Beru holds it with care, not judgment.</p>
            </div>
            <div className="card" style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--text2)' }}>
              <strong style={{ color: 'var(--text)' }}>Honesty:</strong> Beru is an AI, not a therapist. I can listen and support — but I'm not a substitute for professional care.
            </div>
            <div className="card" style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--text2)' }}>
              <strong style={{ color: 'var(--text)' }}>Privacy:</strong> Everything stays on your device. Nothing is stored on our servers.
            </div>
            <label style={{ display: 'flex', gap: 12, alignItems: 'flex-start', cursor: 'pointer', padding: 14, background: 'var(--card)', borderRadius: 12, border: consented ? '1.5px solid var(--accent)' : '1.5px solid var(--border)' }}>
              <input type="checkbox" checked={consented} onChange={function (e) { setConsented(e.target.checked); }} style={{ width: 20, height: 20, marginTop: 2, flexShrink: 0 }} />
              <span style={{ fontSize: 14, lineHeight: 1.5 }}>I understand Beru is an AI support tool. In a crisis, I'll reach out to a real person or emergency services.</span>
            </label>
          </div>
        )}

        <div style={{ marginTop: 24 }}>
          <button className="btn btn-primary btn-full" style={{ opacity: canContinue() ? 1 : 0.5 }} disabled={!canContinue()} onClick={next}>
            {step === 3 ? "Let's begin" : 'Continue'}
          </button>
          {step > 1 && (
            <button className="btn btn-ghost btn-full" style={{ marginTop: 8 }} onClick={function () { setStep(step - 1); }}>Back</button>
          )}
        </div>
      </div>
    );
  }

  // ── Warm Welcome ───────────────────────────────────────────────────────────────

  function WarmWelcome({ name, palette, onDone }) {
    var msgs = [
      'Hey ' + name + '. I\'m really glad you\'re here.',
      'This is your space. No rush, no judgment.',
      'Whenever you\'re ready — I\'m listening. 🐻'
    ];
    var [idx, setIdx] = useState(0);

    useEffect(function () {
      var t1 = setTimeout(function () { setIdx(1); }, 2000);
      var t2 = setTimeout(function () { setIdx(2); }, 4000);
      var t3 = setTimeout(function () { onDone && onDone(); }, 6000);
      return function () { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }, []);

    return (
      <FullScreenOverlay>
        <BearFull palette={palette} size={140} />
        <p key={idx} style={{ fontSize: 22, fontFamily: 'var(--serif)', lineHeight: 1.6, maxWidth: 320, textAlign: 'center', marginTop: 24 }}>
          {msgs[idx]}
        </p>
      </FullScreenOverlay>
    );
  }

  // ── Birthday Screen ────────────────────────────────────────────────────────────

  function BirthdayScreen({ name, palette, onDone }) {
    return (
      <FullScreenOverlay>
        <Confetti />
        <BearBirthday palette={palette} />
        <h1 style={{ fontFamily: 'var(--serif)', fontSize: 28, marginTop: 8, marginBottom: 12, textAlign: 'center' }}>
          Happy Birthday, {name}! 🎉
        </h1>
        <p style={{ color: 'var(--text2)', fontSize: 16, maxWidth: 300, lineHeight: 1.6, marginBottom: 28, textAlign: 'center' }}>
          Today is your day. I hope it's filled with people who love you and moments that make you smile.
        </p>
        <button className="btn btn-primary" onClick={onDone}>Thank you, Beru 🐻</button>
      </FullScreenOverlay>
    );
  }

  // ── Home Screen ────────────────────────────────────────────────────────────────

  function HomeTopbar({ palette, dark, safetyLevel, onMenu, onToggleDark, onSupport }) {
    return (
      <div className="topbar">
        <button onClick={onMenu} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <BearHead palette={palette} size={32} />
          <span style={{ fontWeight: 700, fontSize: 16 }}>Beru</span>
        </button>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button onClick={onToggleDark} style={{ fontSize: 18 }}>{dark ? '☀️' : '🌙'}</button>
          <button
            className="btn btn-ghost"
            style={{ padding: '6px 14px', fontSize: 14, borderColor: safetyLevel >= 3 ? 'var(--danger)' : undefined, color: safetyLevel >= 3 ? 'var(--danger)' : undefined }}
            onClick={onSupport}
          >
            {safetyLevel >= 3 ? '🆘 Help' : '🤝 Support'}
          </button>
        </div>
      </div>
    );
  }

  function Home({ name, palette, dark, safetyLevel, onStartChat, onBreath, onMenu, onToggleDark, onSupport }) {
    var hour = new Date().getHours();
    var greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
    return (
      <div className="screen">
        <HomeTopbar palette={palette} dark={dark} safetyLevel={safetyLevel} onMenu={onMenu} onToggleDark={onToggleDark} onSupport={onSupport} />
        <div style={{ padding: '24px 20px 12px', textAlign: 'center' }}>
          <BearFull palette={palette} size={120} />
          <h2 style={{ fontFamily: 'var(--serif)', fontSize: 22, marginTop: 10 }}>{greeting}, {name}.</h2>
          <p style={{ color: 'var(--text2)', fontSize: 14, marginTop: 4 }}>How can I be here for you today?</p>
        </div>
        <div style={{ display: 'flex', gap: 10, padding: '0 20px 12px' }}>
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={function () { onStartChat(MODES[2]); }}>💬 Let's talk</button>
          <button className="btn btn-ghost" style={{ flex: 1 }} onClick={onBreath}>🌬 Breathe</button>
        </div>
        <div className="mode-grid">
          {MODES.map(function (m) {
            return (
              <div key={m.id} className="mode-card" onClick={function () { onStartChat(m); }}>
                <span className="mode-icon">{m.icon}</span>
                <span className="mode-label">{m.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ── Chat Screen ────────────────────────────────────────────────────────────────

  function ChatTopbar({ mode, safetyLevel, onBack, onSupport, onDone }) {
    return (
      <div className="topbar">
        <button onClick={onBack} style={{ fontSize: 20, padding: 4 }}>←</button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 18 }}>{mode.icon}</span>
          <span style={{ fontWeight: 700, fontSize: 14 }}>{mode.label}</span>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {safetyLevel >= 3 && <button className="sos-btn" onClick={onSupport}>SOS</button>}
          <button className="btn btn-ghost" style={{ padding: '6px 12px', fontSize: 13 }} onClick={onDone}>Done</button>
        </div>
      </div>
    );
  }

  function MoodBar({ selected, onChange }) {
    return (
      <div className="mood-bar">
        {MOOD_EMOJIS.map(function (emoji, i) {
          return (
            <button key={i} className={'mood-btn' + (selected === i ? ' active' : '')} onClick={function () { onChange(i); }}>{emoji}</button>
          );
        })}
      </div>
    );
  }

  function Chat({ mode, messages, moodBefore, safetyLevel, sending, circuitOpen, onSend, onChangeMood, onBack, onDone, onSupport }) {
    var [text, setText] = useState('');
    var bottomRef = useRef(null);

    useEffect(function () {
      if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }, [messages, sending]);

    function handleKey(e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (text.trim()) { onSend(text.trim()); setText(''); }
      }
    }

    return (
      <div className="screen" style={{ height: '100vh' }}>
        <ChatTopbar mode={mode} safetyLevel={safetyLevel} onBack={onBack} onDone={onDone} onSupport={onSupport} />
        <MoodBar selected={moodBefore} onChange={onChangeMood} />
        {circuitOpen && (
          <div style={{ background: 'var(--warn)', color: '#fff', padding: '8px 16px', fontSize: 13, textAlign: 'center' }}>
            I'm resting for a moment. Try again in 30 seconds.
          </div>
        )}
        <div className="chat-messages">
          <div className="msg msg-welcome">{mode.welcome}</div>
          {messages.map(function (m, i) {
            return (
              <div key={i} className={'msg msg-' + m.role} style={{ whiteSpace: 'pre-wrap' }}>{m.content}</div>
            );
          })}
          {sending && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>
        <div className="chat-dock">
          <textarea
            className="chat-input"
            value={text}
            onChange={function (e) { setText(e.target.value); }}
            onInput={function (e) { e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'; }}
            onKeyDown={handleKey}
            placeholder={mode.placeholder}
            rows={1}
            maxLength={2000}
          />
          <button className="send-btn" onClick={function () { if (text.trim()) { onSend(text.trim()); setText(''); } }} disabled={!text.trim() || sending}>↑</button>
        </div>
        <div style={{ textAlign: 'center', padding: '2px 0 6px', fontSize: 11, color: 'var(--text2)' }}>
          Enter to send · Shift+Enter for new line
        </div>
      </div>
    );
  }

  // ── Breathe Screen ─────────────────────────────────────────────────────────────

  function Breathe({ palette, onBack }) {
    var [pattern, setPattern] = useState(BREATH_PATTERNS[0]);
    var [phase, setPhase] = useState('ready');
    var [count, setCount] = useState(0);
    var [running, setRunning] = useState(false);
    var timerRef = useRef(null);

    function stop() {
      clearTimeout(timerRef.current);
      setRunning(false);
      setPhase('ready');
      setCount(0);
    }

    function runPhase(pat, phaseIdx, remaining) {
      var phases = [
        { name: 'in', dur: pat.in },
        { name: 'hold', dur: pat.hold },
        { name: 'out', dur: pat.out }
      ];
      var p = phases[phaseIdx];
      setPhase(p.name);
      setCount(remaining);
      if (remaining > 0) {
        timerRef.current = setTimeout(function () { runPhase(pat, phaseIdx, remaining - 1); }, 1000);
      } else {
        var nextIdx = (phaseIdx + 1) % phases.length;
        timerRef.current = setTimeout(function () { runPhase(pat, nextIdx, phases[nextIdx].dur); }, 200);
      }
    }

    function start() {
      setRunning(true);
      runPhase(pattern, 0, pattern.in);
    }

    useEffect(function () { return function () { clearTimeout(timerRef.current); }; }, []);

    var orbSize = (phase === 'in' || phase === 'hold') ? 200 : 120;
    var phaseLabels = { ready: 'Tap to begin', in: 'Breathe in', hold: 'Hold', out: 'Breathe out' };

    return (
      <div className="breathe-screen">
        <div className="topbar" style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
          <button onClick={onBack} style={{ fontSize: 20 }}>←</button>
          <span style={{ fontWeight: 700 }}>Breathe</span>
          <div style={{ width: 40 }} />
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 60 }}>
          {BREATH_PATTERNS.map(function (p) {
            return (
              <button key={p.id} className={'btn ' + (pattern.id === p.id ? 'btn-primary' : 'btn-ghost')} style={{ padding: '6px 14px', fontSize: 13 }} onClick={function () { stop(); setPattern(p); }}>
                {p.label}
              </button>
            );
          })}
        </div>
        <p style={{ color: 'var(--text2)', fontSize: 13 }}>{pattern.description}</p>
        <div className="orb" style={{ width: orbSize, height: orbSize }} onClick={running ? stop : start} />
        <div className="breath-label">{phaseLabels[phase]}</div>
        {running && <div style={{ fontSize: 15, color: 'var(--text2)' }}>{count}</div>}
        {!running && <p style={{ color: 'var(--text2)', fontSize: 14, textAlign: 'center', maxWidth: 240 }}>Tap the orb to start</p>}
      </div>
    );
  }

  // ── End Mood Picker ────────────────────────────────────────────────────────────

  function EndMoodPicker({ palette, onSelect }) {
    return (
      <FullScreenOverlay>
        <BearHead palette={palette} size={60} />
        <h3 style={{ fontFamily: 'var(--serif)', fontSize: 22, margin: '20px 0 8px', textAlign: 'center' }}>How are you feeling now?</h3>
        <p style={{ color: 'var(--text2)', marginBottom: 28, textAlign: 'center', fontSize: 14 }}>Be honest — there's no wrong answer.</p>
        <div style={{ display: 'flex', gap: 16 }}>
          {MOOD_EMOJIS.map(function (emoji, i) {
            return (
              <button key={i} onClick={function () { onSelect(i); }} style={{ fontSize: 38, background: 'none', border: 'none', cursor: 'pointer', transition: 'transform .15s' }}
                onMouseEnter={function (e) { e.currentTarget.style.transform = 'scale(1.3)'; }}
                onMouseLeave={function (e) { e.currentTarget.style.transform = 'scale(1)'; }}>
                {emoji}
              </button>
            );
          })}
        </div>
        <p style={{ color: 'var(--text2)', fontSize: 12, marginTop: 12 }}>{MOOD_LABELS.join(' · ')}</p>
      </FullScreenOverlay>
    );
  }

  // ── Wrap-Up Screen ─────────────────────────────────────────────────────────────

  function MoodStat({ label, level, palette }) {
    return (
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 6 }}>{label}</div>
        <BearMood level={level} palette={palette} size={52} />
        <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 4 }}>{MOOD_LABELS[level]}</div>
      </div>
    );
  }

  function WrapUp({ name, palette, moodBefore, moodAfter, reflection, onHome }) {
    return (
      <div className="wrapup">
        <BearFull palette={palette} size={110} />
        <h2 style={{ fontFamily: 'var(--serif)', fontSize: 24 }}>Nice work, {name}.</h2>
        <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
          <MoodStat label="Before" level={moodBefore} palette={palette} />
          <span style={{ fontSize: 24, color: 'var(--text2)' }}>→</span>
          <MoodStat label="After" level={moodAfter} palette={palette} />
        </div>
        {reflection && (
          <div className="card" style={{ maxWidth: 340, textAlign: 'center', fontStyle: 'italic', color: 'var(--text2)', fontSize: 15 }}>
            "{reflection}"
          </div>
        )}
        <button className="btn btn-primary btn-full" style={{ maxWidth: 300 }} onClick={onHome}>Back to home</button>
      </div>
    );
  }

  // ── Support Drawer ─────────────────────────────────────────────────────────────

  var CRISIS_LABELS = {
    mentalHealth:  '🧠 Mental Health',
    gbv:           '🛡 GBV Support',
    sexualAssault: '💙 Sexual Assault',
    childSafety:   '🌱 Child Safety',
    substance:     '🫶 Substance Support',
    emergency:     '🚨 Emergency'
  };

  function CrisisItem({ item }) {
    return (
      <a href={'tel:' + item.phone} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)', textDecoration: 'none', color: 'var(--text)' }}>
        <span style={{ fontSize: 14, fontWeight: item.urgent ? 600 : 400 }}>{item.name}</span>
        <span style={{ color: 'var(--accent)', fontSize: 14, fontWeight: 700 }}>{item.phone}</span>
      </a>
    );
  }

  function CrisisCategory({ catKey, items }) {
    return (
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text2)', marginBottom: 8 }}>{CRISIS_LABELS[catKey] || catKey}</div>
        {items.map(function (item, i) { return <CrisisItem key={i} item={item} />; })}
      </div>
    );
  }

  function SupportDrawer({ country, open, onClose, safetyLevel }) {
    var data = getCrisisData(country);
    var cats = data.categories;
    return (
      <BottomDrawer open={open} onClose={onClose}>
        <h3 style={{ fontFamily: 'var(--serif)', fontSize: 20, marginBottom: 4 }}>Support Resources</h3>
        <p style={{ color: 'var(--text2)', fontSize: 13, marginBottom: 16 }}>{data.name} — tap any number to call</p>
        {safetyLevel >= 3 && (
          <div style={{ background: 'rgba(224,80,64,.12)', border: '1px solid var(--danger)', borderRadius: 12, padding: 14, marginBottom: 16, fontSize: 14, lineHeight: 1.6 }}>
            <strong style={{ color: 'var(--danger)' }}>I hear you.</strong> You don't have to face this alone. Someone is there right now.
          </div>
        )}
        {Object.keys(cats).map(function (cat) {
          return <CrisisCategory key={cat} catKey={cat} items={cats[cat]} />;
        })}
        <button className="btn btn-ghost btn-full" style={{ marginTop: 8 }} onClick={onClose}>Close</button>
      </BottomDrawer>
    );
  }

  // ── Location Consent ───────────────────────────────────────────────────────────

  function LocationConsent({ onAllow, onSkip }) {
    return (
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.7)', zIndex: 250, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div className="card" style={{ maxWidth: 340, textAlign: 'center', padding: 28 }}>
          <div style={{ fontSize: 40, marginBottom: 14 }}>📍</div>
          <h3 style={{ fontFamily: 'var(--serif)', fontSize: 20, marginBottom: 10 }}>Allow location access?</h3>
          <p style={{ color: 'var(--text2)', fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>
            This lets me show you the most relevant local support if you ever need it. Your location is never sent to our servers.
          </p>
          <button className="btn btn-primary btn-full" style={{ marginBottom: 10 }} onClick={onAllow}>Allow location</button>
          <button className="btn btn-ghost btn-full" onClick={onSkip}>Not now</button>
        </div>
      </div>
    );
  }

  // ── Sidebar Tabs ───────────────────────────────────────────────────────────────

  var SIDEBAR_TABS = [
    { id: 'menu',    label: '☰' },
    { id: 'you',     label: '🐻 You' },
    { id: 'journal', label: '📝 Journal' },
    { id: 'mood',    label: '💭 Mood' },
    { id: 'usage',   label: '📊 Usage' }
  ];

  function JournalTab() {
    var [prompt, setPrompt] = useState('');
    var [entry, setEntry] = useState('');
    var [saved, setSaved] = useState(false);
    var [showHistory, setShowHistory] = useState(false);
    var [entries, setEntries] = useState(function () { return JSON.parse(LS('journal') || '[]'); });

    useEffect(function () { setPrompt(getTodayPrompt()); }, []);

    function save() {
      if (!entry.trim()) return;
      var updated = [{ date: new Date().toDateString(), text: entry.trim(), prompt: prompt }].concat(entries).slice(0, 60);
      LSset('journal', JSON.stringify(updated));
      setEntries(updated);
      setSaved(true);
      setTimeout(function () { setSaved(false); setEntry(''); }, 2000);
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ fontStyle: 'italic', color: 'var(--text2)', fontSize: 14, lineHeight: 1.6, background: 'var(--card)', borderRadius: 12, padding: 14 }}>{prompt}</div>
        <textarea value={entry} onChange={function (e) { setEntry(e.target.value); }} placeholder="Write anything..." rows={5} />
        <button className="btn btn-primary btn-full" disabled={!entry.trim()} onClick={save}>{saved ? '✓ Saved' : 'Save entry'}</button>
        <button className="btn btn-ghost btn-full" onClick={function () { setShowHistory(!showHistory); }}>
          {showHistory ? 'Hide history' : 'View past entries'}
        </button>
        {showHistory && entries.map(function (e, i) {
          return (
            <div key={i} className="card" style={{ fontSize: 13 }}>
              <div style={{ color: 'var(--text2)', marginBottom: 4 }}>{e.date}</div>
              <p style={{ lineHeight: 1.6 }}>{e.text}</p>
            </div>
          );
        })}
      </div>
    );
  }

  function MoodHistoryTab({ palette }) {
    var history = JSON.parse(LS('mood_history') || '[]');
    if (!history.length) return <p style={{ color: 'var(--text2)', fontSize: 14 }}>No sessions yet. Start chatting to track your mood.</p>;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {history.slice(0, 20).map(function (entry, i) {
          return (
            <div key={i} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: 'var(--text2)' }}>{entry.date}</span>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <BearMood level={entry.before} palette={palette} size={32} />
                <span style={{ color: 'var(--text2)' }}>→</span>
                <BearMood level={entry.after} palette={palette} size={32} />
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  function ProfileTab({ name, country, city, palette, onPaletteChange, onQuickExit }) {
    var surname = sanitiseText(LS('surname') || '', 60);
    var safeCity = sanitiseText(city, 80);
    var safeCountry = VALID_COUNTRY_CODES.has((country || '').toUpperCase()) ? country : '';
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <BearFull palette={palette} size={80} />
          <div style={{ fontWeight: 700, fontSize: 18, marginTop: 8 }}>{name} {surname}</div>
          {safeCity && <div style={{ color: 'var(--text2)', fontSize: 14 }}>{safeCity}{safeCountry && safeCountry !== 'INTL' ? ', ' + safeCountry : ''}</div>}
        </div>
        <div>
          <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 8 }}>Bear colour</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {BEAR_PALETTES.map(function (p) {
              return (
                <button key={p.id} onClick={function () { onPaletteChange(p); }} style={{ width: 36, height: 36, borderRadius: '50%', background: p.body, border: palette.id === p.id ? '3px solid var(--accent)' : '3px solid transparent' }} />
              );
            })}
          </div>
        </div>
        <button className="btn btn-danger btn-full" style={{ marginTop: 8 }} onClick={onQuickExit}>🚪 Quick Exit (clears all data)</button>
      </div>
    );
  }

  function UsageTab() {
    var count = freeCount();
    var pct = Math.min(100, (count / 10) * 100);
    return (
      <div className="card">
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Free messages this month</div>
        <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--accent)', marginBottom: 8 }}>{count} / 10</div>
        <div style={{ height: 8, background: 'var(--border)', borderRadius: 4, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: pct + '%', background: pct >= 100 ? 'var(--danger)' : 'var(--accent)', borderRadius: 4, transition: 'width .4s' }} />
        </div>
        {count >= 10 && <p style={{ color: 'var(--danger)', fontSize: 13, marginTop: 8 }}>You've reached the free limit. Resets next month.</p>}
      </div>
    );
  }

  function Sidebar({ open, tab, onTabChange, onClose, name, palette, country, city, dark, onToggleDark, onPaletteChange, onQuickExit, onViewHistory }) {
    if (!open) return null;

    return (
      <div className="sidebar-overlay" onClick={onClose}>
        <div className="sidebar" onClick={function (e) { e.stopPropagation(); }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <BearHead palette={palette} size={32} />
              <span style={{ fontWeight: 700 }}>Beru</span>
            </div>
            <button onClick={onClose} style={{ fontSize: 20, color: 'var(--text2)' }}>✕</button>
          </div>
          <div className="sidebar-tab-bar">
            {SIDEBAR_TABS.map(function (t) {
              return (
                <button key={t.id} className={'sidebar-tab' + (tab === t.id ? ' active' : '')} onClick={function () { onTabChange(t.id); }}>{t.label}</button>
              );
            })}
          </div>
          <div style={{ flex: 1, overflow: 'auto' }}>
            {tab === 'menu' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <button className="btn btn-ghost btn-full" onClick={function () { onClose(); onViewHistory(); }}>📚 Conversation history</button>
                <button className="btn btn-ghost btn-full" onClick={onToggleDark}>{dark ? '☀️ Light mode' : '🌙 Dark mode'}</button>
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12, fontSize: 12, color: 'var(--text2)', lineHeight: 1.7 }}>
                  Beru v1.0 · Made with care<br />
                  <a href="https://heyberu.com" target="_blank" rel="noopener" style={{ color: 'var(--accent)' }}>heyberu.com</a>
                </div>
              </div>
            )}
            {tab === 'you' && <ProfileTab name={name} country={country} city={city} palette={palette} onPaletteChange={onPaletteChange} onQuickExit={onQuickExit} />}
            {tab === 'journal' && <JournalTab />}
            {tab === 'mood' && <MoodHistoryTab palette={palette} />}
            {tab === 'usage' && <UsageTab />}
          </div>
        </div>
      </div>
    );
  }

  // ── Conversation History ───────────────────────────────────────────────────────

  function ConversationHistory({ onClose, palette }) {
    var sessions = JSON.parse(LS('sessions') || '[]');
    return (
      <div className="screen">
        <div className="topbar">
          <button onClick={onClose} style={{ fontSize: 20 }}>←</button>
          <span style={{ fontWeight: 700 }}>History</span>
          <div style={{ width: 40 }} />
        </div>
        <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12, overflowY: 'auto' }}>
          {!sessions.length && <p style={{ color: 'var(--text2)', textAlign: 'center', marginTop: 40 }}>No sessions yet.</p>}
          {sessions.slice(0, 30).map(function (s, i) {
            return (
              <div key={i} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>{s.mode || 'Chat'}</span>
                  <span style={{ color: 'var(--text2)', fontSize: 13 }}>{s.date}</span>
                </div>
                {s.reflection && <p style={{ fontSize: 13, color: 'var(--text2)', fontStyle: 'italic', marginBottom: 8 }}>"{s.reflection}"</p>}
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <BearMood level={s.moodBefore || 2} palette={palette} size={28} />
                  <span style={{ color: 'var(--text2)', fontSize: 12 }}>→</span>
                  <BearMood level={s.moodAfter || 2} palette={palette} size={28} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ── Rating Screen ──────────────────────────────────────────────────────────────

  function RatingScreen({ onSubmit, onLater }) {
    var [rating, setRating] = useState(null);
    var [feedback, setFeedback] = useState('');
    var faces = ['😞', '😕', '😐', '🙂', '😄'];
    return (
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.7)', zIndex: 280, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div className="card" style={{ maxWidth: 340, width: '100%', textAlign: 'center', padding: 28 }}>
          <BearHead palette={BEAR_PALETTES[0]} size={48} />
          <h3 style={{ fontFamily: 'var(--serif)', fontSize: 20, margin: '16px 0 6px' }}>How's Beru doing?</h3>
          <p style={{ color: 'var(--text2)', marginBottom: 20, fontSize: 14 }}>Your honest feedback helps me get better.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 16 }}>
            {faces.map(function (f, i) {
              return (
                <button key={i} onClick={function () { setRating(i); }} style={{ fontSize: 32, background: 'none', border: 'none', cursor: 'pointer', opacity: rating === i ? 1 : 0.45, transform: rating === i ? 'scale(1.25)' : 'scale(1)', transition: 'all .1s' }}>{f}</button>
              );
            })}
          </div>
          <textarea value={feedback} onChange={function (e) { setFeedback(e.target.value); }} placeholder="Tell me more (optional)..." rows={3} style={{ marginBottom: 14 }} />
          <button className="btn btn-primary btn-full" disabled={rating === null} style={{ opacity: rating === null ? 0.5 : 1, marginBottom: 8 }} onClick={function () { onSubmit(rating, feedback); }}>Submit</button>
          <button className="btn btn-ghost btn-full" onClick={onLater}>Maybe later</button>
        </div>
      </div>
    );
  }

  // ── Error Boundary ─────────────────────────────────────────────────────────────

  function CrashScreen({ onReload }) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32, textAlign: 'center', background: 'var(--bg)' }}>
        <BearHead palette={BEAR_PALETTES[0]} size={60} />
        <h2 style={{ fontFamily: 'var(--serif)', fontSize: 24, margin: '20px 0 12px' }}>Something went wrong</h2>
        <p style={{ color: 'var(--text2)', marginBottom: 28, maxWidth: 280 }}>Beru hit an unexpected snag. Your data is safe.</p>
        <button className="btn btn-primary" onClick={onReload}>Reload</button>
      </div>
    );
  }

  class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { crashed: false };
    }
    static getDerivedStateFromError() { return { crashed: true }; }
    componentDidCatch(err) {
      try {
        var log = JSON.parse(localStorage.getItem('beru_error_log') || '[]');
        log.push({ ts: Date.now(), msg: String(err) });
        if (log.length > 50) log.shift();
        localStorage.setItem('beru_error_log', JSON.stringify(log));
      } catch (e) {}
    }
    render() {
      if (this.state.crashed) return React.createElement(CrashScreen, { onReload: function () { window.location.reload(); } });
      return this.props.children;
    }
  }

  // ── Main App ───────────────────────────────────────────────────────────────────

  function App() {
    var [phase, setPhase] = useState('boot');
    var [dark, setDark] = useState(LS('dark') !== '0');
    var [palette, setPalette] = useState(BEAR_PALETTES[parseInt(LS('palette') || '0', 10)] || BEAR_PALETTES[0]);
    var [country, setCountry] = useState(LS('country') || 'INTL');
    var [sidebarOpen, setSidebarOpen] = useState(false);
    var [sidebarTab, setSidebarTab] = useState('menu');
    var [supportOpen, setSupportOpen] = useState(false);
    var [historyOpen, setHistoryOpen] = useState(false);
    var [showRating, setShowRating] = useState(false);
    var [showLocationConsent, setShowLocationConsent] = useState(false);
    var [mode, setMode] = useState(MODES[2]);
    var [messages, setMessages] = useState([]);
    var [moodBefore, setMoodBefore] = useState(2);
    var [moodAfter, setMoodAfter] = useState(2);
    var [safetyLevel, setSafetyLevel] = useState(0);
    var [sending, setSending] = useState(false);
    var [circuitOpen, setCircuitOpen] = useState(false);
    var [reflection, setReflection] = useState('');
    var [showEndMood, setShowEndMood] = useState(false);
    var [showWrapup, setShowWrapup] = useState(false);

    var name = sanitiseText(LS('name') || 'friend', 60);

    // Inject CSS once
    useEffect(function () {
      var el = document.getElementById('beru-css');
      if (!el) { el = document.createElement('style'); el.id = 'beru-css'; document.head.appendChild(el); }
      el.textContent = CSS;
    }, []);

    // Apply dark/light theme
    useEffect(function () {
      document.body.className = dark ? '' : 'light';
      document.body.style.background = dark ? '#1A1008' : '#FFF8F0';
      LSset('dark', dark ? '1' : '0');
    }, [dark]);

    // Boot sequence
    useEffect(function () {
      var t = setTimeout(async function () {
        var detected = await detectCountry();
        setCountry(detected);
        if (!LS('onboarded')) { setPhase('onboarding'); return; }
        if (isBirthday()) {
          var yr = String(new Date().getFullYear());
          if (LS('last_bday_shown') !== yr) { LSset('last_bday_shown', yr); setPhase('birthday'); return; }
        }
        setPhase('home');
        if (window.plausible) window.plausible('open');
      }, 650);
      return function () { clearTimeout(t); };
    }, []);

    // Ctrl/Cmd+K sidebar toggle
    useEffect(function () {
      function handler(e) {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setSidebarOpen(function (s) { return !s; }); }
      }
      window.addEventListener('keydown', handler);
      return function () { window.removeEventListener('keydown', handler); };
    }, []);

    function handleOnboardingComplete(c) {
      setCountry(c);
      setPhase('welcome');
      if (window.plausible) window.plausible('signup_complete');
    }

    function handleWelcomeDone() {
      setPhase('home');
      if (window.plausible) window.plausible('home');
    }

    function startChat(m) {
      setMode(m);
      setMessages([]);
      setSafetyLevel(0);
      setMoodBefore(2);
      setPhase('chat');
      if (window.plausible) window.plausible('chat_start', { props: { mode: m.id } });
    }

    async function sendMessage(text) {
      if (isCircuitOpen()) { setCircuitOpen(true); return; }
      if (freeCount() >= 10) {
        setMessages(function (prev) { return prev.concat([{ role: 'assistant', content: "You've reached the free message limit for this month. I'll be here when it resets. 🐻" }]); });
        return;
      }
      var kw = detectKeywords(text);
      var newLevel = Math.max(kw.level, safetyLevel);
      if (newLevel > safetyLevel) setSafetyLevel(newLevel);
      if (kw.level >= 3) setSupportOpen(true);
      var updated = messages.concat([{ role: 'user', content: text }]);
      setMessages(updated);
      setSending(true);
      incrementFreeCount();
      if (window.plausible) window.plausible('message_sent');
      var iKey = (crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2));
      try {
        var r = await fetchWithRetry('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Idempotency-Key': iKey },
          body: JSON.stringify({ messages: updated, country: country, mode: mode.label, safetyLevel: newLevel })
        });
        if (!r.ok) {
          var errBody = await r.json().catch(function () { return {}; });
          // Use server-provided message only if it's a short string — never render arbitrary JSON
          var errMsg = (typeof errBody.error === 'string' && errBody.error.length < 200)
            ? errBody.error : "Something got in the way. Let's try that again.";
          setMessages(function (prev) { return prev.concat([{ role: 'assistant', content: errMsg }]); });
          recordFailure();
        } else {
          var data = await r.json();
          // Validate that reply is a non-empty string before rendering
          var reply = (data && typeof data.reply === 'string' && data.reply.trim())
            ? data.reply.trim() : "I'm here — something went quiet on my end. Try again?";
          setMessages(function (prev) { return prev.concat([{ role: 'assistant', content: reply }]); });
          recordSuccess();
          setCircuitOpen(false);
        }
      } catch (e) {
        recordFailure();
        if (isCircuitOpen()) setCircuitOpen(true);
        setMessages(function (prev) { return prev.concat([{ role: 'assistant', content: "I'm having a little trouble right now. Give me a moment." }]); });
      } finally {
        setSending(false);
      }
    }

    function endSession() {
      if (window.plausible) window.plausible('session_complete');
      setShowEndMood(true);
    }

    function handleEndMoodSelect(afterMood) {
      setMoodAfter(afterMood);
      setShowEndMood(false);
      setShowWrapup(true);
      var sessions = JSON.parse(LS('sessions') || '[]');
      var moodHistory = JSON.parse(LS('mood_history') || '[]');
      var entry = { date: new Date().toLocaleDateString(), mode: mode.label, moodBefore: moodBefore, moodAfter: afterMood, reflection: '' };
      sessions.unshift(entry);
      if (sessions.length > 30) sessions.pop();
      LSset('sessions', JSON.stringify(sessions));
      moodHistory.unshift({ date: new Date().toLocaleDateString(), before: moodBefore, after: afterMood });
      if (moodHistory.length > 60) moodHistory.pop();
      LSset('mood_history', JSON.stringify(moodHistory));
      // Async reflection
      var summary = messages.slice(-6).map(function (m) { return m.role + ': ' + m.content; }).join(' ');
      fetch('/api/reflect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ summary: summary, mode: mode.label, moodBefore: moodBefore, moodAfter: afterMood })
      }).then(function (r) { return r.json(); }).then(function (d) {
        if (d.reflection) {
          setReflection(d.reflection);
          var updated = JSON.parse(LS('sessions') || '[]');
          if (updated[0]) { updated[0].reflection = d.reflection; LSset('sessions', JSON.stringify(updated)); }
        }
      }).catch(function () {});
      // Rating check
      var lastRated = LS('last_rated');
      var daysSince = lastRated ? Math.floor((Date.now() - parseInt(lastRated, 10)) / 86400000) : 9999;
      if (sessions.length === 3 || daysSince >= 30) setShowRating(true);
    }

    function handleWrapupHome() {
      setShowWrapup(false);
      setMessages([]);
      setReflection('');
      setMoodAfter(2);
      setSafetyLevel(0);
      setPhase('home');
    }

    function quickExit() {
      LSclear();
      document.body.innerHTML = '<p style="font-family:sans-serif;padding:48px;color:#333;font-size:18px">You\'ve left safely. Close this tab when you\'re ready.</p>';
    }

    function openSupport() {
      setSupportOpen(true);
      if (!LS('geo_consent')) setShowLocationConsent(true);
    }

    function handleGeoAllow() {
      geoLocate(
        function (code) { setCountry(code); setShowLocationConsent(false); },
        function () { LSset('geo_consent', 'denied'); setShowLocationConsent(false); }
      );
    }

    function handleGeoSkip() {
      LSset('geo_consent', 'skipped');
      setShowLocationConsent(false);
    }

    function handlePaletteChange(p) {
      setPalette(p);
      LSset('palette', String(BEAR_PALETTES.indexOf(p)));
    }

    // ── Phase routing ────────────────────────────────────────────────────────────

    if (phase === 'boot') return <BootSkeleton />;
    if (phase === 'onboarding') return <Onboarding onComplete={handleOnboardingComplete} detectedCountry={country} />;
    if (phase === 'welcome') return <WarmWelcome name={name} palette={palette} onDone={handleWelcomeDone} />;
    if (phase === 'birthday') return <BirthdayScreen name={name} palette={palette} onDone={function () { setPhase('home'); }} />;
    if (historyOpen) return <ConversationHistory onClose={function () { setHistoryOpen(false); }} palette={palette} />;
    if (showEndMood) return <EndMoodPicker palette={palette} onSelect={handleEndMoodSelect} />;

    if (showWrapup) {
      return (
        <>
          <WrapUp name={name} palette={palette} moodBefore={moodBefore} moodAfter={moodAfter} reflection={reflection} onHome={handleWrapupHome} />
          {showRating && <RatingScreen onSubmit={function () { LSset('last_rated', String(Date.now())); setShowRating(false); }} onLater={function () { setShowRating(false); }} />}
        </>
      );
    }

    if (phase === 'breathe') return <Breathe palette={palette} onBack={function () { setPhase('home'); }} />;

    var sharedOverlays = (
      <>
        <SupportDrawer country={country} open={supportOpen} onClose={function () { setSupportOpen(false); }} safetyLevel={safetyLevel} />
        {showLocationConsent && <LocationConsent onAllow={handleGeoAllow} onSkip={handleGeoSkip} />}
        <Sidebar open={sidebarOpen} tab={sidebarTab} onTabChange={setSidebarTab} onClose={function () { setSidebarOpen(false); }} name={name} palette={palette} country={country} city={LS('city') || ''} dark={dark} onToggleDark={function () { setDark(function (d) { return !d; }); }} onPaletteChange={handlePaletteChange} onQuickExit={quickExit} onViewHistory={function () { setHistoryOpen(true); }} />
      </>
    );

    if (phase === 'chat') {
      return (
        <>
          <Chat mode={mode} messages={messages} moodBefore={moodBefore} safetyLevel={safetyLevel} sending={sending} circuitOpen={circuitOpen} onSend={sendMessage} onChangeMood={setMoodBefore} onBack={function () { setPhase('home'); }} onDone={endSession} onSupport={openSupport} />
          {sharedOverlays}
        </>
      );
    }

    return (
      <>
        <Home name={name} palette={palette} dark={dark} safetyLevel={safetyLevel} onStartChat={startChat} onBreath={function () { setPhase('breathe'); }} onMenu={function () { setSidebarOpen(true); }} onToggleDark={function () { setDark(function (d) { return !d; }); }} onSupport={openSupport} />
        {sharedOverlays}
      </>
    );
  }

  // ── Mount ──────────────────────────────────────────────────────────────────────

  var root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(React.createElement(ErrorBoundary, null, React.createElement(App, null)));

})();
