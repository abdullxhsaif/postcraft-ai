import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import ConfigBanner from './components/ConfigBanner'
import Landing from './pages/Landing'
import Auth from './pages/Auth'
import Pricing from './pages/Pricing'
import Dashboard from './pages/Dashboard'

export default function App() {
  const { pathname } = useLocation()
  const hideNav = pathname.startsWith('/dashboard')
  return (
    <>
      {!hideNav && <Navbar />}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Auth mode="login" />} />
        <Route path="/signup" element={<Auth mode="signup" />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="*" element={<Landing />} />
      </Routes>
      <ConfigBanner />
    </>
  )
}
