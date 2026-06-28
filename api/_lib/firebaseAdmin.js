import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'

let initialized = false
function ensureApp() {
  if (getApps().length) { initialized = true; return }
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT
  if (!raw) throw new Error('FIREBASE_SERVICE_ACCOUNT env var is missing')
  const serviceAccount = JSON.parse(raw)
  if (serviceAccount.private_key) serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n')
  initializeApp({ credential: cert(serviceAccount) })
  initialized = true
}

export function adminDb() { ensureApp(); return getFirestore() }

export async function verifyRequest(req) {
  ensureApp()
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) throw new Error('Unauthorized')
  const decoded = await getAuth().verifyIdToken(token)
  return decoded
}
