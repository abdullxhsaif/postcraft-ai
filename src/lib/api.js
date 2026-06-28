import { auth } from './firebase'

async function authedFetch(path, body, extraHeaders) {
  const token = auth?.currentUser ? await auth.currentUser.getIdToken() : null
  const res = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(extraHeaders || {}) },
    body: JSON.stringify(body || {}),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`)
  return data
}

export const startCheckout = (priceId) => authedFetch('/api/create-checkout-session', { priceId })
export const openBillingPortal = () => authedFetch('/api/create-portal-session', {})
export const generatePost = (notes, tone, type) => authedFetch('/api/generate', { notes, tone, type }, {
  'x-gemini-key': (typeof localStorage !== 'undefined' && localStorage.getItem('gemini_key')) || '',
})
