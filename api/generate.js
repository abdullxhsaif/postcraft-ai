import { verifyRequest, adminDb } from './_lib/firebaseAdmin.js'

const FREE_TONES = ['professional', 'storytelling']
const MODEL = 'gemini-2.0-flash'

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

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  try {
    const user = await verifyRequest(req)
    const { notes, tone = 'professional', type = 'story' } = req.body || {}
    if (!notes || !notes.trim()) return res.status(400).json({ error: 'Notes are required' })

    const db = adminDb()
    const ref = db.collection('users').doc(user.uid)

    // Atomically check plan + credits, decrement for free users.
    const remaining = await db.runTransaction(async (tx) => {
      const snap = await tx.get(ref)
      const data = snap.exists ? snap.data() : { plan: 'free', credits: 0 }
      const paid = data.plan === 'pro' || data.plan === 'team'

      if (!paid) {
        if (!FREE_TONES.includes(tone)) throw new Error('LIMIT: That tone is a Pro feature. Upgrade to unlock all tones.')
        if ((data.credits ?? 0) <= 0) throw new Error('LIMIT: No credits left. Upgrade to Pro for unlimited posts.')
        tx.set(ref, { credits: (data.credits ?? 0) - 1 }, { merge: true })
        return (data.credits ?? 0) - 1
      }
      return null // unlimited
    })

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) return res.status(500).json({ error: 'AI is not configured (missing GEMINI_API_KEY)' })

    const aiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: buildPrompt(notes, tone, type) }] }],
          generationConfig: { temperature: 0.8, maxOutputTokens: 800 },
        }),
      }
    )
    const data = await aiRes.json()
    if (data.error) {
      if (remaining !== null) await ref.set({ credits: remaining + 1 }, { merge: true }) // refund on failure
      return res.status(502).json({ error: data.error.message })
    }

    const post = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || ''
    if (!post) {
      if (remaining !== null) await ref.set({ credits: remaining + 1 }, { merge: true })
      return res.status(502).json({ error: 'AI returned an empty response. Try again.' })
    }
    return res.status(200).json({ post, creditsRemaining: remaining })
  } catch (err) {
    if (err.message?.startsWith('LIMIT:')) return res.status(402).json({ error: err.message.replace('LIMIT: ', '') })
    const code = err.message === 'Unauthorized' ? 401 : 500
    return res.status(code).json({ error: err.message })
  }
}
