import { lazy, Suspense } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import ConfigBanner from './components/ConfigBanner'
import ScrollToTop from './components/ScrollToTop'
import Spinner from './components/Spinner'

const Landing = lazy(() => import('./pages/Landing'))
const Auth = lazy(() => import('./pages/Auth'))
const Pricing = lazy(() => import('./pages/Pricing'))
const Dashboard = lazy(() => import('./pages/Dashboard'))

export default function App() {
  const { pathname } = useLocation()
  const hideNav = pathname.startsWith('/dashboard')
  return (
    <>
      <ScrollToTop />
      {!hideNav && <Navbar />}
      <Suspense fallback={<Spinner full />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Auth mode="login" />} />
          <Route path="/signup" element={<Auth mode="signup" />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="*" element={<Landing />} />
        </Routes>
      </Suspense>
      <ConfigBanner />
    </>
  )
}
