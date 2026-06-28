import { verifyToken } from './_lib/verifyToken.js'

const GEMINI_MODEL = 'gemini-2.0-flash'

function buildPrompt(notes, tone, type) {
  return `You are an expert LinkedIn ghostwriter. Transform these rough notes into a high-performing LinkedIn post.

Notes: ${notes}
Tone: ${tone}
Post type: ${type}

Rules:
- Open with a scroll-stopping hook on line one
- Short, punchy sentences with line breaks for readability
- Use emojis sparingly and only where natural
- End with a question or clear CTA
- 150-300 words
- Add 3-5 relevant hashtags on the final line
Return ONLY the post text.`
}

// Preferred: Gemini (if a key exists). Fallback: free keyless provider so the app always works.
async function viaGemini(prompt, key) {
  const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${key}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0.8, maxOutputTokens: 800 } }),
  })
  const d = await r.json()
  if (d.error) throw new Error(d.error.message)
  return d?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || ''
}

async function viaFreeProvider(prompt) {
  // Pollinations — free, no API key required. Try OpenAI-style POST, then plain GET.
  try {
    const r = await fetch('https://text.pollinations.ai/openai', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'openai', messages: [{ role: 'user', content: prompt }], temperature: 0.8 }),
    })
    if (r.ok) {
      const d = await r.json()
      const t = (d?.choices?.[0]?.message?.content || '').trim()
      if (t) return t
    }
  } catch {}
  // Fallback: plain text GET endpoint
  const g = await fetch(`https://text.pollinations.ai/${encodeURIComponent(prompt)}?model=openai`)
  if (!g.ok) throw new Error('AI provider is busy. Please try again in a moment.')
  return (await g.text()).trim()
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  try {
    await verifyToken(req)
    const { notes, tone = 'professional', type = 'story' } = req.body || {}
    if (!notes || !notes.trim()) return res.status(400).json({ error: 'Notes are required' })

    const prompt = buildPrompt(notes, tone, type)
    const key = req.headers['x-gemini-key'] || process.env.GEMINI_API_KEY

    let post = ''
    if (key) {
      try { post = await viaGemini(prompt, key) } catch { post = await viaFreeProvider(prompt) }
    } else {
      post = await viaFreeProvider(prompt)
    }
    if (!post) post = await viaFreeProvider(prompt)
    if (!post) return res.status(502).json({ error: 'AI returned an empty response. Try again.' })
    return res.status(200).json({ post })
  } catch (err) {
    const code = err.message === 'Unauthorized' ? 401 : 500
    return res.status(code).json({ error: err.message })
  }
}
