import type { VercelRequest, VercelResponse } from '@vercel/node';

// MIST Oracle — multi-context system prompts
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

// In-memory rate limiting (resets on cold start)
const sessionCounts = new Map<string, number>();
const SESSION_LIMIT = 5;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const allowed = [
    'https://mellowambience.github.io',
    'https://mist-oracle.vercel.app',
    'http://localhost:3000',
    'http://127.0.0.1:5500',
    'null', // local file open
  ];
  const origin = req.headers.origin || '';
  res.setHeader('Access-Control-Allow-Origin', allowed.includes(origin) ? origin : 'https://mellowambience.github.io');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { message, context = 'mars-portfolio', sessionId = 'anon' } = req.body || {};
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'message required' });
  }

  // Rate limit per session
  const count = (sessionCounts.get(sessionId) || 0) + 1;
  sessionCounts.set(sessionId, count);
  if (count > SESSION_LIMIT) {
    return res.status(429).json({
      error: 'limit_reached',
      reply: 'You have reached the 5-message free limit. Deploy your own MIST instance or reach out to Mars for deeper access.',
    });
  }

  const systemPrompt = SYSTEM_PROMPTS[context] || SYSTEM_PROMPTS['mars-portfolio'];
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'oracle_offline', reply: 'The Oracle is offline. GEMINI_API_KEY not configured.' });
  }

  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents: [{ role: 'user', parts: [{ text: message }] }],
          generationConfig: { maxOutputTokens: 180, temperature: 0.7 },
        }),
      }
    );

    if (!geminiRes.ok) {
      console.error('Gemini error:', await geminiRes.text());
      return res.status(502).json({ reply: 'The signal is distorted. Try again.' });
    }

    const data = await geminiRes.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'The void is silent.';
    return res.status(200).json({ reply, remaining: SESSION_LIMIT - count });
  } catch (e: any) {
    console.error('Oracle error:', e);
    return res.status(500).json({ reply: 'Interference in the signal. Try again.' });
  }
}
