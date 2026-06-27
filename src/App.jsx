import { useState, useEffect, useRef } from 'react'
import { Routes, Route, useNavigate, Link } from 'react-router-dom'
import { Sparkles, Zap, Copy, RefreshCw, Check, ChevronRight, Star, Menu, X, LogOut, User, ArrowRight, Linkedin, Brain, Target, TrendingUp } from 'lucide-react'

// ── Supabase client (lazy init) ───────────────────────────────────────────────
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

async function getSupabase() {
  const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm')
  return createClient(supabaseUrl, supabaseKey)
}

// ── AI Post Generator ─────────────────────────────────────────────────────────
async function generatePost(notes, tone, type) {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY
  const prompt = `You are an expert LinkedIn content creator. Transform these rough notes into a viral LinkedIn post.

Notes: ${notes}
Tone: ${tone}
Post type: ${type}

Rules:
- Hook in first line (stop the scroll)
- Short punchy sentences
- Use line breaks for readability
- Add relevant emojis sparingly
- End with a question or CTA
- 150-300 words max
- No hashtags in body (add 3-5 at the end)

Write only the post, nothing else.`

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8,
      max_tokens: 600,
    }),
  })
  const data = await res.json()
  if (data.error) throw new Error(data.error.message)
  return data.choices[0].message.content.trim()
}

// ── Auth Modal ────────────────────────────────────────────────────────────────
function AuthModal({ onClose, onAuth }) {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const sb = await getSupabase()
      const fn = mode === 'login' ? sb.auth.signInWithPassword : sb.auth.signUp
      const { data, error: err } = await fn.call(sb.auth, { email, password })
      if (err) throw err
      onAuth(data.user)
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-sm rounded-2xl bg-[#111118] border border-white/10 p-8 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold font-display">{mode === 'login' ? 'Welcome back' : 'Get started free'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input type="email" required placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors" />
          <input type="password" required placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors" />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>
        <p className="text-center text-gray-500 text-sm mt-4">
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button onClick={() => setMode(mode === 'login' ? 'signup' : 'login')} className="text-indigo-400 hover:text-indigo-300 font-medium">
            {mode === 'login' ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  )
}

// ── Navbar ────────────────────────────────────────────────────────────────────
function Navbar({ user, onAuthClick, onLogout }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  return (
    <nav className="fixed top-0 inset-x-0 z-40 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 font-display font-bold text-lg no-underline text-white">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <Sparkles size={16} />
          </div>
          PostCraft AI
        </Link>
        <div className="hidden sm:flex items-center gap-6">
          <a href="#features" className="text-gray-400 hover:text-white text-sm transition-colors">Features</a>
          <a href="#pricing" className="text-gray-400 hover:text-white text-sm transition-colors">Pricing</a>
          {user ? (
            <div className="flex items-center gap-3">
              <Link to="/dashboard" className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-sm font-medium text-white transition-colors no-underline">
                Dashboard
              </Link>
              <button onClick={onLogout} className="text-gray-400 hover:text-white transition-colors"><LogOut size={18} /></button>
            </div>
          ) : (
            <button onClick={onAuthClick} className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-sm font-medium text-white transition-all duration-200">
              Get Started
            </button>
          )}
        </div>
        <button className="sm:hidden text-gray-400" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {mobileOpen && (
        <div className="sm:hidden border-t border-white/5 bg-[#0a0a0f] px-4 py-4 flex flex-col gap-3">
          <a href="#features" className="text-gray-300 text-sm py-2">Features</a>
          <a href="#pricing" className="text-gray-300 text-sm py-2">Pricing</a>
          <button onClick={() => { onAuthClick(); setMobileOpen(false) }}
            className="w-full py-3 rounded-xl bg-indigo-600 text-sm font-medium text-white">
            Get Started
          </button>
        </div>
      )}
    </nav>
  )
}

// ── Landing Page ──────────────────────────────────────────────────────────────
function LandingPage({ onAuthClick }) {
  const features = [
    { icon: <Brain size={22} />, title: 'AI-Powered Writing', desc: 'GPT-4o transforms your rough bullet points into polished, engaging LinkedIn posts in seconds.' },
    { icon: <Target size={22} />, title: 'Multiple Tones', desc: 'Choose from professional, storytelling, motivational, or educational tones to match your brand.' },
    { icon: <TrendingUp size={22} />, title: 'Viral Hooks', desc: 'Every post starts with a scroll-stopping hook designed to maximize engagement and reach.' },
    { icon: <Zap size={22} />, title: 'Instant Results', desc: 'Generate 5 post variations in under 10 seconds. Pick your favorite and copy with one click.' },
  ]

  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: '/month',
      desc: 'Try PostCraft AI with no commitment.',
      features: ['5 AI posts per month', '2 tone options', 'Basic post types', 'Copy to clipboard'],
      cta: 'Start Free',
      highlight: false,
    },
    {
      name: 'Pro',
      price: '$19',
      period: '/month',
      desc: 'For creators serious about LinkedIn growth.',
      features: ['Unlimited AI posts', 'All 6 tone options', 'All post types', 'Post history', 'Priority generation', 'LinkedIn analytics tips'],
      cta: 'Get Pro',
      highlight: true,
      badge: 'Most Popular',
    },
    {
      name: 'Team',
      price: '$49',
      period: '/month',
      desc: 'For agencies and teams managing multiple profiles.',
      features: ['Everything in Pro', 'Up to 5 seats', 'Team post library', 'Brand voice settings', 'Bulk generation', 'Priority support'],
      cta: 'Get Team',
      highlight: false,
    },
  ]

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Hero */}
      <div className="relative pt-32 pb-20 px-4 sm:px-6 overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-indigo-700/20 blur-[120px]" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-6">
            <Sparkles size={14} /> AI-Powered LinkedIn Growth
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold leading-[1.1] tracking-tight mb-6">
            Turn rough notes into{' '}
            <span className="text-gradient">viral LinkedIn posts</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Stop staring at a blank screen. Paste your ideas, pick your tone, and let AI craft posts that get likes, comments, and connections.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={onAuthClick}
              className="flex items-center gap-2 px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-lg transition-all duration-200 hover:scale-105 shadow-lg shadow-indigo-500/25">
              Start for Free <ArrowRight size={20} />
            </button>
            <div className="flex items-center gap-1 text-gray-400 text-sm">
              <Star size={14} className="text-yellow-400 fill-yellow-400" />
              <span>4.9/5 from 2,000+ creators</span>
            </div>
          </div>
        </div>

        {/* Demo preview card */}
        <div className="relative max-w-2xl mx-auto mt-16">
          <div className="glass rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-green-400 text-xs font-medium">Live Preview</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              <span className="text-white font-semibold">I failed my first 3 startups. 💀</span>
              <br /><br />
              Then I learned something that changed everything.<br /><br />
              It wasn't about working harder.<br />
              It wasn't about having a better idea.<br />
              It was about <span className="text-indigo-400">who I was talking to</span>.<br /><br />
              Most founders build for themselves. Not for their customer.<br /><br />
              The shift? I spent 30 days doing nothing but customer interviews.<br />
              No code. No design. Just listening.<br /><br />
              What I discovered completely changed the product.<br /><br />
              What's the best lesson failure taught you? 👇
              <br /><br />
              <span className="text-gray-500 text-xs">#startups #entrepreneurship #founder #growthmindset</span>
            </p>
          </div>
        </div>
      </div>

      {/* Features */}
      <div id="features" className="max-w-6xl mx-auto px-4 sm:px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-display font-bold mb-4">Everything you need to go viral</h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">Built for LinkedIn creators who want to post consistently without burning out.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map(f => (
            <div key={f.title} className="glass glass-hover rounded-2xl p-6">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4">
                {f.icon}
              </div>
              <h3 className="font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing */}
      <div id="pricing" className="max-w-5xl mx-auto px-4 sm:px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-display font-bold mb-4">Simple, transparent pricing</h2>
          <p className="text-gray-400 text-lg">Start free. Upgrade when you're ready to scale.</p>
        </div>
        <div className="grid sm:grid-cols-3 gap-5">
          {plans.map(p => (
            <div key={p.name} className={`relative rounded-2xl p-6 border flex flex-col ${p.highlight ? 'bg-indigo-600/10 border-indigo-500/40' : 'glass'}`}>
              {p.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-indigo-600 text-xs font-semibold text-white">
                  {p.badge}
                </div>
              )}
              <div className="mb-4">
                <h3 className="font-display font-bold text-lg mb-1">{p.name}</h3>
                <div className="flex items-end gap-1 mb-2">
                  <span className="text-4xl font-display font-bold">{p.price}</span>
                  <span className="text-gray-400 mb-1">{p.period}</span>
                </div>
                <p className="text-gray-400 text-sm">{p.desc}</p>
              </div>
              <ul className="flex flex-col gap-2.5 mb-6 flex-1">
                {p.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                    <Check size={15} className="text-indigo-400 flex-shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <button onClick={onAuthClick}
                className={`w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${p.highlight ? 'bg-indigo-600 hover:bg-indigo-500 text-white' : 'glass glass-hover text-white'}`}>
                {p.cta}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/5 py-10 text-center">
        <div className="flex items-center justify-center gap-2 font-display font-bold text-lg mb-3">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
            <Sparkles size={14} />
          </div>
          PostCraft AI
        </div>
        <p className="text-gray-500 text-sm">© {new Date().getFullYear()} PostCraft AI. All rights reserved.</p>
      </footer>
    </div>
  )
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
function Dashboard({ user }) {
  const navigate = useNavigate()
  const [notes, setNotes] = useState('')
  const [tone, setTone] = useState('professional')
  const [type, setType] = useState('story')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')
  const [credits, setCredits] = useState(5)

  useEffect(() => {
    if (!user) navigate('/')
  }, [user, navigate])

  const tones = [
    { value: 'professional', label: 'Professional' },
    { value: 'storytelling', label: 'Storytelling' },
    { value: 'motivational', label: 'Motivational' },
    { value: 'educational', label: 'Educational' },
    { value: 'humorous', label: 'Humorous' },
    { value: 'controversial', label: 'Controversial' },
  ]

  const types = [
    { value: 'story', label: 'Personal Story' },
    { value: 'lesson', label: 'Lesson Learned' },
    { value: 'listicle', label: 'Listicle' },
    { value: 'opinion', label: 'Hot Take' },
    { value: 'howto', label: 'How-To' },
    { value: 'question', label: 'Question Post' },
  ]

  async function handleGenerate() {
    if (!notes.trim()) { setError('Add some notes first'); return }
    if (credits <= 0) { setError('No credits left. Upgrade to Pro for unlimited posts.'); return }
    setLoading(true)
    setError('')
    try {
      const post = await generatePost(notes, tone, type)
      setOutput(post)
      setCredits(c => c - 1)
    } catch (err) {
      setError('Generation failed: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-display font-bold">Post Generator</h1>
            <p className="text-gray-400 text-sm mt-0.5">Turn your ideas into LinkedIn gold</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="glass rounded-xl px-4 py-2 text-sm">
              <span className="text-gray-400">Credits: </span>
              <span className="text-indigo-400 font-semibold">{credits}</span>
            </div>
            <div className="glass rounded-xl px-4 py-2 flex items-center gap-2 text-sm text-gray-300">
              <User size={15} /> {user?.email?.split('@')[0] || 'User'}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input panel */}
          <div className="flex flex-col gap-4">
            <div className="glass rounded-2xl p-5 flex flex-col gap-4">
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">Your rough notes</label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Paste your ideas, bullet points, or rough draft here... e.g. 'Failed 3 startups. Learned customer discovery is everything. 30 days interviews changed my product completely.'"
                  rows={7}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 resize-none transition-colors text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Tone</label>
                  <select value={tone} onChange={e => setTone(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-indigo-500 text-sm">
                    {tones.map(t => <option key={t.value} value={t.value} className="bg-[#111118]">{t.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Post Type</label>
                  <select value={type} onChange={e => setType(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-indigo-500 text-sm">
                    {types.map(t => <option key={t.value} value={t.value} className="bg-[#111118]">{t.label}</option>)}
                  </select>
                </div>
              </div>

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <button onClick={handleGenerate} disabled={loading}
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02]">
                {loading ? (
                  <><RefreshCw size={18} className="animate-spin" /> Generating...</>
                ) : (
                  <><Sparkles size={18} /> Generate Post</>
                )}
              </button>
            </div>
          </div>

          {/* Output panel */}
          <div className="glass rounded-2xl p-5 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-gray-300">Generated Post</label>
              {output && (
                <div className="flex gap-2">
                  <button onClick={handleGenerate} disabled={loading}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass glass-hover text-xs text-gray-300">
                    <RefreshCw size={13} /> Regenerate
                  </button>
                  <button onClick={handleCopy}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/30 text-xs text-indigo-400 transition-colors">
                    {copied ? <><Check size={13} /> Copied!</> : <><Copy size={13} /> Copy</>}
                  </button>
                </div>
              )}
            </div>
            {output ? (
              <div className="flex-1 overflow-y-auto">
                <p className="text-gray-200 text-sm leading-relaxed whitespace-pre-line">{output}</p>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-4">
                  <Linkedin size={28} className="text-indigo-400" />
                </div>
                <p className="text-gray-400 text-sm">Your AI-crafted post will appear here.</p>
                <p className="text-gray-600 text-xs mt-1">Add your notes and hit Generate.</p>
              </div>
            )}
          </div>
        </div>

        {/* Upgrade banner */}
        {credits <= 2 && (
          <div className="mt-6 rounded-2xl bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/20 p-5 flex items-center justify-between">
            <div>
              <p className="font-semibold text-white">Running low on credits</p>
              <p className="text-gray-400 text-sm mt-0.5">Upgrade to Pro for unlimited AI posts every month.</p>
            </div>
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-sm font-semibold text-white transition-colors whitespace-nowrap">
              Upgrade <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ── App Root ──────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null)
  const [showAuth, setShowAuth] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // Check existing session
    getSupabase().then(async sb => {
      const { data } = await sb.auth.getSession()
      if (data.session) setUser(data.session.user)
      sb.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user || null)
      })
    }).catch(() => {})
  }, [])

  async function handleLogout() {
    const sb = await getSupabase()
    await sb.auth.signOut()
    setUser(null)
    navigate('/')
  }

  function handleAuth(u) {
    setUser(u)
    navigate('/dashboard')
  }

  return (
    <>
      <Navbar user={user} onAuthClick={() => setShowAuth(true)} onLogout={handleLogout} />
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} onAuth={handleAuth} />}
      <Routes>
        <Route path="/" element={<LandingPage onAuthClick={() => setShowAuth(true)} />} />
        <Route path="/dashboard" element={<Dashboard user={user} />} />
      </Routes>
    </>
  )
        }
