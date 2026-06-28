import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, Copy, RefreshCw, Check, ChevronRight, User, Linkedin, Loader2, CreditCard } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { generatePost, openBillingPortal } from '../lib/api'

const TONES = [
  { value: 'professional', label: 'Professional' },
  { value: 'storytelling', label: 'Storytelling' },
  { value: 'motivational', label: 'Motivational' },
  { value: 'educational', label: 'Educational' },
  { value: 'humorous', label: 'Humorous' },
  { value: 'controversial', label: 'Hot Take' },
]
const TYPES = [
  { value: 'story', label: 'Personal Story' },
  { value: 'lesson', label: 'Lesson Learned' },
  { value: 'listicle', label: 'Listicle' },
  { value: 'opinion', label: 'Opinion' },
  { value: 'howto', label: 'How-To' },
  { value: 'question', label: 'Question Post' },
]

export default function Dashboard() {
  const { profile, refreshProfile } = useAuth()
  const navigate = useNavigate()
  const [notes, setNotes] = useState('')
  const [tone, setTone] = useState('professional')
  const [type, setType] = useState('story')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [portalLoading, setPortalLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  const isPaid = profile && (profile.plan === 'pro' || profile.plan === 'team')
  const credits = profile?.credits ?? 0

  const handleGenerate = async () => {
    if (!notes.trim()) { setError('Add some notes first.'); return }
    setLoading(true); setError('')
    try {
      const { post } = await generatePost(notes, tone, type)
      setOutput(post)
      await refreshProfile()
    } catch (err) {
      if (/limit|credit/i.test(err.message)) setError(err.message)
      else setError('Generation failed: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(output)
    setCopied(true)
    toast.success('Copied to clipboard')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleBilling = async () => {
    setPortalLoading(true)
    try {
      const { url } = await openBillingPortal()
      window.location.href = url
    } catch {
      navigate('/pricing')
    } finally { setPortalLoading(false) }
  }

  return (
    <div className="min-h-screen bg-[#07070b] text-white pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-display font-bold">Post Generator</h1>
            <p className="text-gray-400 text-sm mt-0.5">Turn your ideas into LinkedIn gold</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="glass rounded-xl px-4 py-2 text-sm">
              <span className="text-gray-400">Plan: </span>
              <span className="text-indigo-400 font-semibold capitalize">{profile?.plan || 'free'}</span>
            </div>
            <div className="glass rounded-xl px-4 py-2 text-sm">
              <span className="text-gray-400">Credits: </span>
              <span className="text-indigo-400 font-semibold">{isPaid ? '∞' : credits}</span>
            </div>
            <button onClick={handleBilling} disabled={portalLoading}
              className="glass glass-hover rounded-xl px-4 py-2 flex items-center gap-2 text-sm text-gray-300">
              {portalLoading ? <Loader2 size={15} className="animate-spin" /> : <CreditCard size={15} />} Billing
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="glass rounded-2xl p-5 flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">Your rough notes</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={7}
                placeholder="Paste your ideas or rough draft here... e.g. 'Failed 3 startups. Learned customer discovery is everything.'"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 resize-none transition-colors text-sm" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">Tone</label>
                <select value={tone} onChange={e => setTone(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-indigo-500 text-sm">
                  {TONES.map(t => <option key={t.value} value={t.value} className="bg-[#16161f]">{t.label}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">Post Type</label>
                <select value={type} onChange={e => setType(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-indigo-500 text-sm">
                  {TYPES.map(t => <option key={t.value} value={t.value} className="bg-[#16161f]">{t.label}</option>)}
                </select>
              </div>
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button onClick={handleGenerate} disabled={loading}
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl btn-grad text-white font-semibold transition-all duration-200 disabled:opacity-50 hover:scale-[1.02]">
              {loading ? <><RefreshCw size={18} className="animate-spin" /> Generating...</> : <><Sparkles size={18} /> Generate Post</>}
            </button>
          </div>

          <div className="glass rounded-2xl p-5 flex flex-col min-h-[320px]">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-gray-300">Generated Post</label>
              {output && (
                <div className="flex gap-2">
                  <button onClick={handleGenerate} disabled={loading} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass glass-hover text-xs text-gray-300"><RefreshCw size={13} /> Regenerate</button>
                  <button onClick={handleCopy} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/30 text-xs text-indigo-300 transition-colors">
                    {copied ? <><Check size={13} /> Copied!</> : <><Copy size={13} /> Copy</>}
                  </button>
                </div>
              )}
            </div>
            {loading ? (
              <div className="flex-1 flex flex-col gap-3 animate-pulse pt-2">
                {[...Array(5)].map((_, i) => <div key={i} className="h-3 rounded bg-white/5" style={{ width: `${90 - i * 12}%` }} />)}
              </div>
            ) : output ? (
              <div className="flex-1 overflow-y-auto">
                <p className="text-gray-200 text-sm leading-relaxed whitespace-pre-line">{output}</p>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-4"><Linkedin size={28} className="text-indigo-400" /></div>
                <p className="text-gray-400 text-sm">Your AI-crafted post will appear here.</p>
                <p className="text-gray-600 text-xs mt-1">Add your notes and hit Generate.</p>
              </div>
            )}
          </div>
        </div>

        {!isPaid && credits <= 2 && (
          <div className="mt-6 rounded-2xl bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/20 p-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-white">{credits === 0 ? 'You’re out of credits' : 'Running low on credits'}</p>
              <p className="text-gray-400 text-sm mt-0.5">Upgrade to Pro for unlimited AI posts every month.</p>
            </div>
            <button onClick={() => navigate('/pricing')} className="flex items-center gap-2 px-5 py-2.5 rounded-xl btn-grad text-sm font-semibold text-white transition-colors whitespace-nowrap">
              Upgrade <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
