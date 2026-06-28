import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Sparkles, PenLine, CreditCard, Crown, LogOut, Menu, X, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

function NavItems({ onNavigate, plan }) {
  const item = "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors"
  return (
    <nav className="flex flex-col gap-1">
      <Link to="/dashboard" onClick={onNavigate} className={`${item} btn-grad text-white no-underline`}>
        <PenLine size={18} /> Generator
      </Link>
      <Link to="/pricing" onClick={onNavigate} className={`${item} text-gray-300 hover:bg-white/5 no-underline`}>
        <Crown size={18} /> Plans
      </Link>
      <Link to="/pricing" onClick={onNavigate} className={`${item} text-gray-300 hover:bg-white/5 no-underline`}>
        <CreditCard size={18} /> Billing
      </Link>
    </nav>
  )
}

export default function Sidebar() {
  const { user, profile, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const plan = profile?.plan || 'free'

  const handleLogout = async () => { await logout(); navigate('/') }

  const Brand = (
    <Link to="/" className="flex items-center gap-2 font-display font-bold text-lg no-underline text-white px-3">
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center"><Sparkles size={16} /></div>
      PostCraft AI
    </Link>
  )

  const Footer = (
    <div className="mt-auto">
      <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/5 mb-2">
        <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center"><User size={15} className="text-indigo-300" /></div>
        <div className="min-w-0">
          <p className="text-sm text-white truncate">{user?.email?.split('@')[0] || 'User'}</p>
          <p className="text-xs text-indigo-300 capitalize">{plan} plan</p>
        </div>
      </div>
      <button onClick={handleLogout} className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-gray-300 hover:bg-white/5 transition-colors">
        <LogOut size={18} /> Sign out
      </button>
    </div>
  )

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-40 h-14 flex items-center justify-between px-4 border-b border-white/5 bg-[#07070b]/90 backdrop-blur-md">
        {Brand}
        <button onClick={() => setOpen(true)} aria-label="Open menu" className="text-gray-300"><Menu size={22} /></button>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col gap-6 w-64 shrink-0 h-screen sticky top-0 border-r border-white/5 bg-[#0a0a12] p-4">
        <div className="pt-2">{Brand}</div>
        <NavItems plan={plan} />
        {Footer}
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <aside className="relative flex flex-col gap-6 w-72 h-full border-r border-white/10 bg-[#0a0a12] p-4 animate-fade-in">
            <div className="flex items-center justify-between pt-2">
              {Brand}
              <button onClick={() => setOpen(false)} aria-label="Close menu" className="text-gray-300"><X size={22} /></button>
            </div>
            <NavItems plan={plan} onNavigate={() => setOpen(false)} />
            {Footer}
          </aside>
        </div>
      )}
    </>
  )
}
