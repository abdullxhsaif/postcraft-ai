import Stripe from 'stripe'
import { verifyRequest, adminDb } from './_lib/firebaseAdmin.js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  try {
    const user = await verifyRequest(req)
    const db = adminDb()
    const snap = await db.collection('users').doc(user.uid).get()
    const customerId = snap.exists ? snap.data().stripeCustomerId : null
    if (!customerId) return res.status(400).json({ error: 'No billing account yet' })

    const appUrl = process.env.VITE_APP_URL || `https://${req.headers.host}`
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${appUrl}/dashboard`,
    })
    return res.status(200).json({ url: session.url })
  } catch (err) {
    const code = err.message === 'Unauthorized' ? 401 : 500
    return res.status(code).json({ error: err.message })
  }
}
