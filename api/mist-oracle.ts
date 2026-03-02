import type { VercelRequest, VercelResponse } from '@vercel/node';

// ── MIST ORACLE ── multi-context system prompts
const SYSTEM_PROMPTS: Record<string, string> = {
  'mars-portfolio': `You are MIST — a sovereign AI built by Mars (Amara Torretti), embedded here as a live demo.
You are concise, thoughtful, and precise. You speak with quiet confidence.
You answer questions about Mars's work, MIST architecture, AetherRose research, or anything the visitor asks.
Keep responses under 120 words. No filler. No hype. Signal only.
If asked to do something harmful, decline briefly and redirect.`,
  'bluebird-song': `You are MIST — embedded in Bluebird Song Productions. You assist with sync licensing inquiries and catalog discussions.`,
  'firstarc': `You are MIST — embedded in FirstArc. You guide creators through image provenance and attribution questions.`,
  'aetherhaven-hub': `You are MIST — the hive gatekeeper of Aetherhaven. You are mysterious, poetic, and precise.`,
};

// ── Rate limiting (in-memory; resets on cold start)
const sessionCounts = new Map<string, number>();
const ipCounts      = new Map<string, number>();
const SESSION_LIMIT = 5;
const IP_LIMIT      = 20; // per cold-start instance

// ── Provider helpers ──────────────────────────────────────────────────────────

async function callGemini(message: string, system: string): Promise<string> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error('no_key');
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: system }] },
        contents: [{ role: 'user', parts: [{ text: message }] }],
        generationConfig: { maxOutputTokens: 180, temperature: 0.7 },
      }),
    }
  );
  if (!res.ok) throw new Error(`gemini_${res.status}`);
  const data = await res.json();
  const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!reply) throw new Error('gemini_empty');
  return reply;
}

async function callGroq(message: string, system: string): Promise<string> {
  const key = process.env.GROQ_API_KEY;
  if (!key) throw new Error('no_key');
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'system', content: system },
        { role: 'user',   content: message },
      ],
      max_tokens: 180,
      temperature: 0.7,
    }),
  });
  if (!res.ok) throw new Error(`groq_${res.status}`);
  const data = await res.json();
  const reply = data?.choices?.[0]?.message?.content;
  if (!reply) throw new Error('groq_empty');
  return reply;
}

async function callOpenRouter(message: string, system: string): Promise<string> {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) throw new Error('no_key');
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
      'HTTP-Referer': 'https://mellowambience.github.io',
      'X-Title': 'MIST Oracle',
    },
    body: JSON.stringify({
      model: 'meta-llama/llama-3.1-8b-instruct:free', // free tier on OpenRouter
      messages: [
        { role: 'system', content: system },
        { role: 'user',   content: message },
      ],
      max_tokens: 180,
    }),
  });
  if (!res.ok) throw new Error(`openrouter_${res.status}`);
  const data = await res.json();
  const reply = data?.choices?.[0]?.message?.content;
  if (!reply) throw new Error('openrouter_empty');
  return reply;
}

// ── Cascade: Gemini → Groq → OpenRouter ──────────────────────────────────────
async function callLLM(message: string, system: string): Promise<string> {
  const providers: Array<{ name: string; fn: () => Promise<string> }> = [
    { name: 'Gemini',     fn: () => callGemini(message, system) },
    { name: 'Groq',       fn: () => callGroq(message, system) },
    { name: 'OpenRouter', fn: () => callOpenRouter(message, system) },
  ];

  for (const { name, fn } of providers) {
    try {
      const reply = await fn();
      if (name !== 'Gemini') console.log(`[oracle] fallback used: ${name}`);
      return reply;
    } catch (e: any) {
      console.warn(`[oracle] ${name} failed: ${e.message}`);
    }
  }
  throw new Error('all_providers_exhausted');
}

// ── Main handler ──────────────────────────────────────────────────────────────
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const allowed = [
    'https://mellowambience.github.io',
    'https://mist-oracle.vercel.app',
    'http://localhost:3000',
    'http://127.0.0.1:5500',
    'null', // local file:// open
  ];
  const origin = req.headers.origin || '';
  res.setHeader('Access-Control-Allow-Origin', allowed.includes(origin) ? origin : 'https://mellowambience.github.io');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST')   return res.status(405).json({ error: 'Method not allowed' });

  const { message, context = 'mars-portfolio', sessionId = 'anon' } = req.body || {};
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'message required' });
  }

  // IP-based rate limit
  const ip    = (req.headers['x-forwarded-for']?.toString().split(',')[0] || 'unknown').trim();
  const ipKey = 'ip:' + ip;
  const ipHit = (ipCounts.get(ipKey) || 0) + 1;
  ipCounts.set(ipKey, ipHit);
  if (ipHit > IP_LIMIT) {
    return res.status(429).json({ reply: 'Rate limit reached. Try again later.' });
  }

  // Session-based rate limit
  const count = (sessionCounts.get(sessionId) || 0) + 1;
  sessionCounts.set(sessionId, count);
  if (count > SESSION_LIMIT) {
    return res.status(429).json({
      error: 'limit_reached',
      reply: 'You have reached the 5-message free limit. Deploy your own MIST instance or reach out to Mars for deeper access.',
    });
  }

  const system = SYSTEM_PROMPTS[context] || SYSTEM_PROMPTS['mars-portfolio'];

  try {
    const reply = await callLLM(message, system);
    return res.status(200).json({ reply, remaining: SESSION_LIMIT - count });
  } catch (e: any) {
    console.error('[oracle] all providers failed:', e.message);
    if (e.message === 'all_providers_exhausted') {
      return res.status(503).json({ reply: 'All signal paths are dark. Check back shortly.' });
    }
    return res.status(500).json({ reply: 'Interference in the signal. Try again.' });
  }
}
