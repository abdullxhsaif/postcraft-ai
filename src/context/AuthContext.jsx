import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth'
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db, isFirebaseConfigured } from '../lib/firebase'

const AuthContext = createContext(null)
export const useAuth = () => useContext(AuthContext)

const FREE_CREDITS = 5

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadProfile = useCallback(async (u) => {
    if (!db || !u) { setProfile(null); return null }
    const ref = doc(db, 'users', u.uid)
    let snap = await getDoc(ref)
    if (!snap.exists()) {
      const data = {
        email: u.email,
        plan: 'free',
        credits: FREE_CREDITS,
        subscriptionStatus: 'none',
        createdAt: serverTimestamp(),
      }
      await setDoc(ref, data)
      snap = await getDoc(ref)
    }
    const p = { id: u.uid, ...snap.data() }
    setProfile(p)
    return p
  }, [])

  useEffect(() => {
    if (!isFirebaseConfigured) { setLoading(false); return }
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u)
      if (u) await loadProfile(u)
      else setProfile(null)
      setLoading(false)
    })
    return unsub
  }, [loadProfile])

  const signup = async (email, password) => {
    const { user: u } = await createUserWithEmailAndPassword(auth, email, password)
    await loadProfile(u)
    return u
  }
  const login = async (email, password) => {
    const { user: u } = await signInWithEmailAndPassword(auth, email, password)
    await loadProfile(u)
    return u
  }
  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider()
    const { user: u } = await signInWithPopup(auth, provider)
    await loadProfile(u)
    return u
  }
  const logout = () => signOut(auth)
  const consumeCredit = async () => {
    if (!db || !user || !profile) return
    if (profile.plan === 'pro' || profile.plan === 'team') return
    const next = Math.max(0, (profile.credits ?? 0) - 1)
    await updateDoc(doc(db, 'users', user.uid), { credits: next })
    setProfile(p => ({ ...p, credits: next }))
  }
  const refreshProfile = () => user && loadProfile(user)

  const value = { user, profile, loading, signup, login, loginWithGoogle, logout, consumeCredit, refreshProfile, isFirebaseConfigured }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
