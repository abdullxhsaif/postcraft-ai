import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Sparkles, PenLine, CreditCard, Crown, LogOut, Menu, X, User, ArrowUpRight, Zap } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const FREE_LIMIT = 5

function Brand() {
  return (
    <Link to="/" className="flex items-center gap-2.5 font-display font-bold text-[17px] no-underline text-white px-1">
      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
        <Sparkles size={17} />
      </div>
      PostCraft<span className="text-indigo-400">AI</span>
    </Link>
  )
}

function NavItem({ to, icon, label, onNavigate }) {
  const { pathname } = useLocation()
  const active = (to === '/dashboard' && pathname.startsWith('/dashboard')) || (to !== '/dashboard' && pathname === to)
  return (
    <Link to={to} onClick={onNavigate}
      className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium no-underline transition-all duration-200 ${active ? 'bg-white/[0.06] text-white' : 'text-gray-400 hover:text-white hover:bg-white/[0.03]'}`}>
      {active && <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-full bg-gradient-to-b from-indigo-400 to-fuchsia-500" />}
      <span className={`transition-colors ${active ? 'text-indigo-300' : 'text-gray-500 group-hover:text-gray-300'}`}>{icon}</span>
      {label}
    </Link>
  )
}

function UsageCard({ onNavigate }) {
  const { profile } = useAuth()
  const navigate = useNavigate()
  const plan = profile?.plan || 'free'
  const isPaid = plan === 'pro' || plan === 'team'
  const credits = profile?.credits ?? 0
  const pct = Math.max(0, Math.min(100, (credits / FREE_LIMIT) * 100))

  if (isPaid) {
    return (
      <div className="rounded-2xl p-4 bg-gradient-to-br from-indigo-600/25 to-fuchsia-600/15 border border-indigo-500/25">
        <div className="flex items-center gap-2 text-white text-sm font-semibold"><Crown size={16} className="text-amber-300" /> {plan === 'team' ? 'Team' : 'Pro'} plan</div>
        <p className="text-xs text-gray-300 mt-1 flex items-center gap-1"><Zap size={12} className="text-indigo-300" /> Unlimited AI posts</p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl p-4 bg-white/[0.03] border border-white/[0.07]">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-gray-300">AI Credits</span>
        <span className="text-xs font-semibold text-white">{credits}<span className="text-gray-500"> / {FREE_LIMIT}</span></span>
      </div>
      <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden mb-3">
        <div className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-fuchsia-500 transition-all" style={{ width: `${pct}%` }} />
      </div>
      <button onClick={() => { onNavigate && onNavigate(); navigate('/pricing') }}
        className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl text-sm font-semibold btn-grad text-white">
        <Crown size={15} /> Upgrade to Pro
      </button>
    </div>
  )
}

function Inner({ onNavigate }) {
  const { user, profile, logout } = useAuth()
  const navigate = useNavigate()
  const plan = profile?.plan || 'free'
  const handleLogout = async () => { onNavigate && onNavigate(); await logout(); navigate('/') }

  return (
    <>
      <div className="pt-1 pb-2"><Brand /></div>

      <nav className="flex flex-col gap-1 mt-5">
        <p className="px-3 pb-1.5 text-[10px] font-bold tracking-[0.12em] text-gray-600 uppercase">Workspace</p>
        <NavItem to="/dashboard" icon={<PenLine size={18} />} label="Generator" onNavigate={onNavigate} />
        <NavItem to="/pricing" icon={<CreditCard size={18} />} label="Billing & Plans" onNavigate={onNavigate} />
      </nav>

      <div className="mt-auto flex flex-col gap-3">
        <UsageCard onNavigate={onNavigate} />

        <div className="h-px bg-white/[0.06]" />

        <div className="flex items-center gap-2.5 px-1">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500/30 to-fuchsia-500/20 flex items-center justify-center flex-shrink-0 border border-white/10">
            <User size={15} className="text-indigo-200" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm text-white truncate font-medium">{user?.email?.split('@')[0] || 'User'}</p>
            <p className="text-[11px] text-gray-500 capitalize">{plan} plan</p>
          </div>
          <button onClick={handleLogout} aria-label="Sign out" title="Sign out"
            className="text-gray-500 hover:text-white p-1.5 rounded-lg hover:bg-white/[0.06] transition-colors">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </>
  )
}

export default function Sidebar() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <div className="lg:hidden fixed top-0 inset-x-0 z-40 h-14 flex items-center justify-between px-4 border-b border-white/[0.06] bg-[#08080e]/90 backdrop-blur-md">
        <Brand />
        <button onClick={() => setOpen(true)} aria-label="Open menu" className="text-gray-300 p-2 -mr-2"><Menu size={22} /></button>
      </div>

      <aside className="hidden lg:flex flex-col w-[260px] shrink-0 h-screen sticky top-0 border-r border-white/[0.06] bg-gradient-to-b from-[#0c0c16] to-[#08080e] p-4">
        <Inner />
      </aside>

      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/65 backdrop-blur-sm animate-fade-in" onClick={() => setOpen(false)} />
          <aside className="relative flex flex-col w-[280px] max-w-[84%] h-full border-r border-white/10 bg-gradient-to-b from-[#0c0c16] to-[#08080e] p-4 animate-fade-in">
            <button onClick={() => setOpen(false)} aria-label="Close menu" className="absolute top-4 right-4 text-gray-400 p-1"><X size={20} /></button>
            <Inner onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      )}
    </>
  )
}
