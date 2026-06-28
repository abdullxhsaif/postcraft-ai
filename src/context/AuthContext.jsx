import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
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
  const logout = () => signOut(auth)
  const refreshProfile = () => user && loadProfile(user)

  const value = { user, profile, loading, signup, login, logout, refreshProfile, isFirebaseConfigured }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
