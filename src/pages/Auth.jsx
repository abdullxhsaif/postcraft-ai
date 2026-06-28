import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Sparkles, Loader2, Mail, Lock } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

const PRETTY = {
  'auth/invalid-credential': 'Incorrect email or password.',
  'auth/email-already-in-use': 'That email already has an account. Try signing in.',
  'auth/weak-password': 'Password must be at least 6 characters.',
  'auth/invalid-email': 'Enter a valid email address.',
  'auth/network-request-failed': 'Network error. Check your connection.',
}

export default function Auth({ mode }) {
  const isSignup = mode === 'signup'
  const { login, signup, isFirebaseConfigured } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isFirebaseConfigured) { setError('Firebase is not configured yet. Add your .env keys.'); return }
    setLoading(true); setError('')
    try {
      if (isSignup) await signup(email, password)
      else await login(email, password)
      toast.success(isSignup ? 'Account created!' : 'Welcome back!')
      navigate('/dashboard')
    } catch (err) {
      setError(PRETTY[err.code] || err.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#07070b] relative overflow-hidden">
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-indigo-700/20 blur-[130px]" />
      <div className="relative w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2 font-display font-bold text-xl mb-8 no-underline text-white">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center"><Sparkles size={18} /></div>
          PostCraft AI
        </Link>

        <div className="glass rounded-2xl p-8 animate-fade-up">
          <h1 className="text-2xl font-display font-bold mb-1">{isSignup ? 'Create your account' : 'Welcome back'}</h1>
          <p className="text-gray-400 text-sm mb-6">{isSignup ? 'Start crafting viral posts free — no card required.' : 'Sign in to continue to your dashboard.'}</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="relative">
              <Mail size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
              <input type="email" required autoComplete="email" placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors" />
            </div>
            <div className="relative">
              <Lock size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
              <input type="password" required autoComplete={isSignup ? 'new-password' : 'current-password'} placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors" />
            </div>
            {error && <p className="text-red-400 text-sm" role="alert">{error}</p>}
            <button type="submit" disabled={loading}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? <Loader2 size={18} className="animate-spin" /> : null}
              {loading ? 'Please wait...' : isSignup ? 'Create account' : 'Sign in'}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            {isSignup ? 'Already have an account? ' : "Don't have an account? "}
            <Link to={isSignup ? '/login' : '/signup'} className="text-indigo-400 hover:text-indigo-300 font-medium no-underline">
              {isSignup ? 'Sign in' : 'Sign up free'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
