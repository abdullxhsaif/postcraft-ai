import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Sparkles, Menu, X, LogOut, LayoutDashboard, CreditCard, Zap, LogIn, ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = async () => { setOpen(false); await logout(); navigate('/') }
  const close = () => setOpen(false)

  const Logo = (
    <Link to="/" onClick={close} className="flex items-center gap-2.5 font-display font-bold text-lg no-underline text-white">
      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
        <Sparkles size={17} />
      </div>
      PostCraft<span className="text-indigo-400">AI</span>
    </Link>
  )

  const mItem = "flex items-center gap-3 px-3 py-3 rounded-xl text-[15px] font-medium text-gray-300 hover:text-white hover:bg-white/[0.05] no-underline transition-colors"

  return (
    <nav className="fixed top-0 inset-x-0 z-40 border-b border-white/[0.06] bg-[#07070b]/85 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {Logo}

        <div className="hidden sm:flex items-center gap-6">
          {/* <Link to="/#features" className="text-gray-400 hover:text-white text-sm transition-colors no-underline">Features</Link> */}
          <Link to="/pricing" className="text-gray-400 hover:text-white text-sm transition-colors no-underline">Pricing</Link>
          {user ? (
            <div className="flex items-center gap-3">
              <Link to="/dashboard" className="px-4 py-2 rounded-lg btn-grad text-sm font-medium text-white no-underline">Dashboard</Link>
              <button onClick={handleLogout} aria-label="Log out" className="text-gray-400 hover:text-white transition-colors"><LogOut size={18} /></button>
            </div>
          ) : (
            <>
              <Link to="/login" className="text-gray-300 hover:text-white text-sm transition-colors no-underline">Sign in</Link>
              <Link to="/signup" className="px-4 py-2 rounded-lg btn-grad text-sm font-medium text-white no-underline">Get Started</Link>
            </>
          )}
        </div>

        <button className="sm:hidden text-gray-200 p-2 -mr-2" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="sm:hidden border-t border-white/[0.06] bg-[#08080e]/98 backdrop-blur-xl px-4 pt-3 pb-5 animate-fade-in">
          <p className="px-3 pb-1 text-[10px] font-bold tracking-[0.12em] text-gray-600 uppercase">Menu</p>
          <Link to="/#features" onClick={close} className={mItem}><Zap size={18} className="text-gray-500" /> Features</Link>
          <Link to="/pricing" onClick={close} className={mItem}><CreditCard size={18} className="text-gray-500" /> Pricing</Link>
          {user && <Link to="/dashboard" onClick={close} className={mItem}><LayoutDashboard size={18} className="text-gray-500" /> Dashboard</Link>}

          <div className="h-px bg-white/[0.06] my-3" />

          {user ? (
            <button onClick={handleLogout} className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-white/[0.05] border border-white/10 text-sm font-medium text-gray-200 hover:bg-white/[0.08] transition-colors">
              <LogOut size={17} /> Log out
            </button>
          ) : (
            <div className="flex flex-col gap-2.5">
              <Link to="/login" onClick={close} className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-white/[0.05] border border-white/10 text-sm font-semibold text-white no-underline">
                <LogIn size={17} /> Sign in
              </Link>
              <Link to="/signup" onClick={close} className="flex items-center justify-center gap-2 w-full py-3 rounded-xl btn-grad text-sm font-semibold text-white no-underline">
                Get Started Free <ArrowRight size={16} />
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}
