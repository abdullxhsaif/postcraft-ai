import Stripe from 'stripe'
import { adminDb } from './_lib/firebaseAdmin.js'
import { planForPrice } from './_lib/plans.js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

// Stripe needs the raw, unparsed body to verify the signature.
export const config = { api: { bodyParser: false } }

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', (c) => chunks.push(c))
    req.on('end', () => resolve(Buffer.concat(chunks)))
    req.on('error', reject)
  })
}

async function setPlan(uid, fields) {
  if (!uid) return
  await adminDb().collection('users').doc(uid).set(fields, { merge: true })
}

async function uidFromCustomer(customerId) {
  const snap = await adminDb().collection('users').where('stripeCustomerId', '==', customerId).limit(1).get()
  return snap.empty ? null : snap.docs[0].id
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  let event
  try {
    const raw = await readRawBody(req)
    event = stripe.webhooks.constructEvent(raw, req.headers['stripe-signature'], webhookSecret)
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  try {
    const obj = event.data.object
    switch (event.type) {
      case 'checkout.session.completed': {
        const uid = obj.metadata?.uid
        await setPlan(uid, {
          plan: obj.metadata?.plan || 'pro',
          subscriptionStatus: 'active',
          stripeCustomerId: obj.customer,
          stripeSubscriptionId: obj.subscription,
        })
        break
      }
      case 'customer.subscription.updated':
      case 'customer.subscription.created': {
        const uid = obj.metadata?.uid || await uidFromCustomer(obj.customer)
        const priceId = obj.items?.data?.[0]?.price?.id
        const active = ['active', 'trialing'].includes(obj.status)
        await setPlan(uid, {
          plan: active ? planForPrice(priceId) : 'free',
          subscriptionStatus: obj.status,
          stripeSubscriptionId: obj.id,
        })
        break
      }
      case 'customer.subscription.deleted': {
        const uid = obj.metadata?.uid || await uidFromCustomer(obj.customer)
        await setPlan(uid, { plan: 'free', subscriptionStatus: 'canceled', credits: 5 })
        break
      }
      default:
        break
    }
    return res.status(200).json({ received: true })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
