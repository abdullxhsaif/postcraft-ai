import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Sparkles, PenLine, CreditCard, Crown, LogOut, Menu, X, User, ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

function Brand() {
  return (
    <Link to="/" className="flex items-center gap-2.5 font-display font-bold text-lg no-underline text-white px-1">
      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
        <Sparkles size={17} />
      </div>
      PostCraft AI
    </Link>
  )
}

function NavItem({ to, icon, label, onNavigate }) {
  const { pathname } = useLocation()
  const active = (to === '/dashboard' && pathname.startsWith('/dashboard')) || (to !== '/dashboard' && pathname === to)
  return (
    <Link to={to} onClick={onNavigate}
      className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium no-underline transition-colors ${active ? 'bg-white/[0.07] text-white' : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'}`}>
      {active && <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-full bg-gradient-to-b from-indigo-400 to-purple-500" />}
      <span className={active ? 'text-indigo-300' : ''}>{icon}</span>
      {label}
    </Link>
  )
}

function Inner({ onNavigate }) {
  const { user, profile } = useAuth()
  const navigate = useNavigate()
  const plan = profile?.plan || 'free'
  const isPaid = plan === 'pro' || plan === 'team'

  return (
    <>
      <div className="pt-1 pb-2"><Brand /></div>

      <nav className="flex flex-col gap-1 mt-4">
        <p className="px-3 pb-1 text-[11px] font-semibold tracking-wider text-gray-600 uppercase">Menu</p>
        <NavItem to="/dashboard" icon={<PenLine size={18} />} label="Generator" onNavigate={onNavigate} />
        <NavItem to="/pricing" icon={<CreditCard size={18} />} label="Billing & Plans" onNavigate={onNavigate} />
      </nav>

      <div className="mt-auto flex flex-col gap-3">
        {!isPaid && (
          <div className="rounded-2xl p-4 bg-gradient-to-br from-indigo-600/20 to-purple-600/15 border border-indigo-500/25">
            <div className="flex items-center gap-2 mb-1.5">
              <Crown size={16} className="text-amber-300" />
              <span className="text-sm font-semibold text-white">Go Pro</span>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed mb-3">Unlimited AI posts, all tones, and post history.</p>
            <button onClick={() => { onNavigate && onNavigate(); navigate('/pricing') }}
              className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl text-sm font-semibold btn-grad text-white">
              Upgrade <ArrowRight size={15} />
            </button>
          </div>
        )}

        <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl bg-white/[0.04] border border-white/5">
          <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
            <User size={15} className="text-indigo-300" />
          </div>
          <div className="min-w-0">
            <p className="text-sm text-white truncate">{user?.email?.split('@')[0] || 'User'}</p>
            <p className="text-xs text-indigo-300 capitalize">{plan} plan</p>
          </div>
        </div>

        <SignOutButton onNavigate={onNavigate} />
      </div>
    </>
  )
}

function SignOutButton({ onNavigate }) {
  const { logout } = useAuth()
  const navigate = useNavigate()
  return (
    <button onClick={async () => { onNavigate && onNavigate(); await logout(); navigate('/') }}
      className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/[0.04] transition-colors">
      <LogOut size={18} /> Sign out
    </button>
  )
}

export default function Sidebar() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <div className="lg:hidden fixed top-0 inset-x-0 z-40 h-14 flex items-center justify-between px-4 border-b border-white/5 bg-[#07070b]/90 backdrop-blur-md">
        <Brand />
        <button onClick={() => setOpen(true)} aria-label="Open menu" className="text-gray-300 p-2 -mr-2"><Menu size={22} /></button>
      </div>

      <aside className="hidden lg:flex flex-col w-64 shrink-0 h-screen sticky top-0 border-r border-white/5 bg-[#09090f] p-4">
        <Inner />
      </aside>

      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <aside className="relative flex flex-col w-72 max-w-[82%] h-full border-r border-white/10 bg-[#09090f] p-4 animate-fade-in">
            <button onClick={() => setOpen(false)} aria-label="Close menu" className="absolute top-4 right-4 text-gray-400 p-1"><X size={20} /></button>
            <Inner onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      )}
    </>
  )
}
