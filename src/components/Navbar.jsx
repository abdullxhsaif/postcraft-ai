import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Sparkles, Menu, X, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = async () => { await logout(); navigate('/') }

  return (
    <nav className="fixed top-0 inset-x-0 z-40 border-b border-white/5 bg-[#07070b]/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 font-display font-bold text-lg no-underline text-white">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <Sparkles size={16} />
          </div>
          PostCraft AI
        </Link>

        <div className="hidden sm:flex items-center gap-6">
          <Link to="/#features" className="text-gray-400 hover:text-white text-sm transition-colors">Features</Link>
          <Link to="/pricing" className="text-gray-400 hover:text-white text-sm transition-colors">Pricing</Link>
          {user ? (
            <div className="flex items-center gap-3">
              <Link to="/dashboard" className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-sm font-medium text-white transition-colors no-underline">Dashboard</Link>
              <button onClick={handleLogout} aria-label="Log out" className="text-gray-400 hover:text-white transition-colors"><LogOut size={18} /></button>
            </div>
          ) : (
            <>
              <Link to="/login" className="text-gray-300 hover:text-white text-sm transition-colors no-underline">Sign in</Link>
              <Link to="/signup" className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-sm font-medium text-white transition-colors no-underline">Get Started</Link>
            </>
          )}
        </div>

        <button className="sm:hidden text-gray-300" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="sm:hidden border-t border-white/5 bg-[#07070b] px-4 py-4 flex flex-col gap-3">
          <Link to="/pricing" onClick={() => setOpen(false)} className="text-gray-300 text-sm py-2 no-underline">Pricing</Link>
          {user ? (
            <>
              <Link to="/dashboard" onClick={() => setOpen(false)} className="w-full text-center py-3 rounded-xl bg-indigo-600 text-sm font-medium text-white no-underline">Dashboard</Link>
              <button onClick={handleLogout} className="w-full py-3 rounded-xl glass text-sm text-white">Log out</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setOpen(false)} className="w-full text-center py-3 rounded-xl glass text-sm text-white no-underline">Sign in</Link>
              <Link to="/signup" onClick={() => setOpen(false)} className="w-full text-center py-3 rounded-xl bg-indigo-600 text-sm font-medium text-white no-underline">Get Started</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
