import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, Sparkles, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

const PAYMENT_LINKS = {
  proMonthly: 'https://buy.stripe.com/8x200j4ZwgZw0kq2tZe3e01',
  proYearly: 'https://buy.stripe.com/14AdR91NkbFcc385Gbe3e02',
  teamMonthly: 'https://buy.stripe.com/4gM4gz0JggZw1ou7Oje3e03',
  teamYearly: 'https://buy.stripe.com/fZucN54ZwgZwc381pVe3e04',
}

export default function Pricing() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [yearly, setYearly] = useState(false)
  const [loadingPlan, setLoadingPlan] = useState(null)

  const plans = [
    { id: 'free', name: 'Free', monthly: 0, yearly: 0, desc: 'Try PostCraft AI with no commitment.',
      features: ['5 free AI posts', '2 tone options', 'Basic post types', 'Copy to clipboard'], cta: 'Start Free' },
    { id: 'pro', name: 'Pro', monthly: 19, yearly: 15, desc: 'For creators serious about LinkedIn growth.',
      features: ['Unlimited AI posts', 'All 6 tone options', 'All post types', 'Post history', 'Priority generation'],
      cta: 'Get Pro', highlight: true, badge: 'Most Popular',
      link: () => yearly ? PAYMENT_LINKS.proYearly : PAYMENT_LINKS.proMonthly },
    { id: 'team', name: 'Team', monthly: 49, yearly: 39, desc: 'For agencies and teams.',
      features: ['Everything in Pro', 'Up to 5 seats', 'Team post library', 'Brand voice settings', 'Priority support'],
      cta: 'Get Team', link: () => yearly ? PAYMENT_LINKS.teamYearly : PAYMENT_LINKS.teamMonthly },
  ]

  const handleSelect = (plan) => {
    if (plan.id === 'free') { navigate(user ? '/dashboard' : '/signup'); return }
    if (!user) { navigate('/login'); return }
    setLoadingPlan(plan.id)
    const url = plan.link()
    const email = user?.email ? `?prefilled_email=${encodeURIComponent(user.email)}` : ''
    window.location.href = url + email
  }

  return (
    <div className="min-h-screen bg-[#07070b] text-white pt-28 pb-24 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-display font-bold mb-4">Simple, transparent pricing</h1>
          <p className="text-gray-400 text-lg">Start free. Upgrade when you're ready to scale.</p>
        </div>

        <div className="flex justify-center mb-12">
          <div className="inline-flex p-1 rounded-xl bg-white/5 border border-white/10">
            <button onClick={() => setYearly(false)} aria-pressed={!yearly}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${!yearly ? 'btn-grad text-white' : 'text-gray-400 hover:text-white'}`}>
              Monthly
            </button>
            <button onClick={() => setYearly(true)} aria-pressed={yearly}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 ${yearly ? 'btn-grad text-white' : 'text-gray-400 hover:text-white'}`}>
              Yearly <span className={`text-xs ${yearly ? 'text-indigo-100' : 'text-indigo-400'}`}>-20%</span>
            </button>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-5">
          {plans.map(p => (
            <div key={p.id} className={`relative rounded-2xl p-6 border flex flex-col ${p.highlight ? 'bg-indigo-600/10 border-indigo-500/40' : 'glass'}`}>
              {p.badge && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-indigo-600 text-xs font-semibold">{p.badge}</div>}
              <h3 className="font-display font-bold text-lg mb-1">{p.name}</h3>
              <div className="flex items-end gap-1 mb-2">
                <span className="text-4xl font-display font-bold">${yearly ? p.yearly : p.monthly}</span>
                <span className="text-gray-400 mb-1">/mo</span>
              </div>
              {yearly && p.monthly > 0 && (
                <p className="text-xs text-indigo-300 mb-2">Billed ${p.yearly * 12}/year</p>
              )}
              <p className="text-gray-400 text-sm mb-5">{p.desc}</p>
              <ul className="flex flex-col gap-2.5 mb-6 flex-1">
                {p.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                    <Check size={15} className="text-indigo-400 flex-shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <button onClick={() => handleSelect(p)} disabled={loadingPlan === p.id}
                className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200 disabled:opacity-50 ${p.highlight ? 'btn-grad text-white' : 'glass glass-hover text-white'}`}>
                {loadingPlan === p.id ? <Loader2 size={16} className="animate-spin" /> : p.id !== 'free' ? <Sparkles size={15} /> : null}
                {p.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
