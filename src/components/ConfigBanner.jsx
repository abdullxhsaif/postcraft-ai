import { AlertTriangle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function ConfigBanner() {
  const { isFirebaseConfigured } = useAuth()
  if (isFirebaseConfigured) return null
  return (
    <div className="fixed bottom-0 inset-x-0 z-50 bg-amber-500/15 border-t border-amber-500/30 text-amber-200 text-xs sm:text-sm px-4 py-2.5 flex items-center justify-center gap-2 text-center">
      <AlertTriangle size={15} className="flex-shrink-0" />
      Firebase keys missing — add your <code className="px-1 bg-black/30 rounded">.env</code> values (see README) to enable sign-in.
    </div>
  )
}
