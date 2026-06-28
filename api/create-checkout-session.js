import Stripe from 'stripe'
import { verifyRequest, adminDb } from './_lib/firebaseAdmin.js'
import { planForPrice } from './_lib/plans.js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  try {
    const user = await verifyRequest(req)
    const { priceId } = req.body || {}
    if (!priceId) return res.status(400).json({ error: 'Missing priceId' })

    const db = adminDb()
    const ref = db.collection('users').doc(user.uid)
    const snap = await ref.get()
    let customerId = snap.exists ? snap.data().stripeCustomerId : null

    if (!customerId) {
      const customer = await stripe.customers.create({ email: user.email, metadata: { uid: user.uid } })
      customerId = customer.id
      await ref.set({ stripeCustomerId: customerId }, { merge: true })
    }

    const appUrl = process.env.VITE_APP_URL || `https://${req.headers.host}`
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      allow_promotion_codes: true,
      subscription_data: { metadata: { uid: user.uid, plan: planForPrice(priceId) } },
      metadata: { uid: user.uid, plan: planForPrice(priceId) },
      success_url: `${appUrl}/dashboard?checkout=success`,
      cancel_url: `${appUrl}/pricing?checkout=cancelled`,
    })
    return res.status(200).json({ url: session.url })
  } catch (err) {
    const code = err.message === 'Unauthorized' ? 401 : 500
    return res.status(code).json({ error: err.message })
  }
}
