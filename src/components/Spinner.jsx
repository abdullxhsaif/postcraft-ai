import { Loader2 } from 'lucide-react'

export default function Spinner({ full = false, size = 22 }) {
  if (full) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#07070b]">
        <Loader2 size={28} className="animate-spin text-indigo-400" />
      </div>
    )
  }
  return <Loader2 size={size} className="animate-spin" />
}
