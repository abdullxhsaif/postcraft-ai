import { Link } from 'react-router-dom'
import { Sparkles, Brain, Target, TrendingUp, Zap, Star, ArrowRight, Check } from 'lucide-react'

const features = [
  { icon: <Brain size={22} />, title: 'AI-Powered Writing', desc: 'Advanced AI turns your rough bullet points into polished, engaging LinkedIn posts in seconds.' },
  { icon: <Target size={22} />, title: 'Multiple Tones', desc: 'Professional, storytelling, motivational, educational and more — match your brand voice.' },
  { icon: <TrendingUp size={22} />, title: 'Viral Hooks', desc: 'Every post opens with a scroll-stopping hook engineered to maximize reach.' },
  { icon: <Zap size={22} />, title: 'Instant Results', desc: 'Generate posts in under 10 seconds. Pick your favorite and copy with one click.' },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#07070b] text-white">
      <section className="relative pt-32 pb-20 px-4 sm:px-6 overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-indigo-700/20 blur-[120px]" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center animate-fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium mb-6">
            <Sparkles size={14} /> AI-Powered LinkedIn Growth
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold leading-[1.1] tracking-tight mb-6">
            Turn rough notes into <span className="text-gradient">viral LinkedIn posts</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Stop staring at a blank screen. Paste your ideas, pick your tone, and let AI craft posts that get likes, comments, and connections.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup" className="flex items-center gap-2 px-8 py-4 rounded-xl btn-grad text-white font-semibold text-lg transition-all duration-200 hover:scale-105 shadow-lg shadow-indigo-500/25 no-underline">
              Start for Free <ArrowRight size={20} />
            </Link>
            <div className="flex items-center gap-1 text-gray-400 text-sm">
              <Star size={14} className="text-yellow-400 fill-yellow-400" />
              <span>4.9/5 from 2,000+ creators</span>
            </div>
          </div>
        </div>

        <div className="relative max-w-2xl mx-auto mt-16 animate-fade-up">
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-green-400 text-xs font-medium">Live Preview</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              <span className="text-white font-semibold">I failed my first 3 startups.</span><br /><br />
              Then I learned something that changed everything.<br /><br />
              It wasn't about working harder.<br />
              It was about <span className="text-indigo-400">who I was talking to</span>.<br /><br />
              I spent 30 days doing nothing but customer interviews. No code. Just listening.<br /><br />
              What's the best lesson failure taught you?<br /><br />
              <span className="text-gray-500 text-xs">#startups #entrepreneurship #founder</span>
            </p>
          </div>
        </div>
      </section>

      <section id="features" className="max-w-6xl mx-auto px-4 sm:px-6 py-24 scroll-mt-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-display font-bold mb-4">Everything you need to go viral</h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">Built for LinkedIn creators who want to post consistently without burning out.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map(f => (
            <div key={f.title} className="glass glass-hover rounded-2xl p-6">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4">{f.icon}</div>
              <h3 className="font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>


      {/* Pricing — all plans on one page */}
      <section id="pricing" className="max-w-5xl mx-auto px-4 sm:px-6 py-24 scroll-mt-20">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-display font-bold mb-4">Simple, transparent pricing</h2>
          <p className="text-gray-400 text-lg">Start free. Upgrade when you're ready to scale.</p>
        </div>
        <div className="grid sm:grid-cols-3 gap-5">
          {[
            { name: 'Free', price: '$0', desc: 'Try it with no commitment.', highlight: false,
              features: ['5 free AI posts', '2 tone options', 'Copy to clipboard'] },
            { name: 'Pro', price: '$19', desc: 'For serious LinkedIn creators.', highlight: true, badge: 'Most Popular',
              features: ['Unlimited AI posts', 'All 6 tones', 'All post types', 'Post history'] },
            { name: 'Team', price: '$49', desc: 'For agencies and teams.', highlight: false,
              features: ['Everything in Pro', 'Up to 5 seats', 'Brand voice', 'Priority support'] },
          ].map(p => (
            <div key={p.name} className={`relative rounded-2xl p-6 border flex flex-col ${p.highlight ? 'bg-indigo-600/10 border-indigo-500/40' : 'glass'}`}>
              {p.badge && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full btn-grad text-xs font-semibold text-white">{p.badge}</div>}
              <h3 className="font-display font-bold text-lg mb-1">{p.name}</h3>
              <div className="flex items-end gap-1 mb-2">
                <span className="text-4xl font-display font-bold">{p.price}</span>
                <span className="text-gray-400 mb-1">/mo</span>
              </div>
              <p className="text-gray-400 text-sm mb-5">{p.desc}</p>
              <ul className="flex flex-col gap-2.5 mb-6 flex-1">
                {p.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                    <Check size={15} className="text-indigo-400 flex-shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <Link to="/pricing" className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200 no-underline ${p.highlight ? 'btn-grad text-white' : 'glass glass-hover text-white'}`}>
                {p.name === 'Free' ? 'Start Free' : `Get ${p.name}`}
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-24">
        <div className="glass rounded-3xl p-10 text-center">
          <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4">Ready to grow on LinkedIn?</h2>
          <p className="text-gray-400 mb-8">Join thousands of creators. Start free, no card required.</p>
          <Link to="/signup" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl btn-grad text-white font-semibold transition-all hover:scale-105 no-underline">
            Get Started Free <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <footer className="border-t border-white/5 py-10 text-center">
        <div className="flex items-center justify-center gap-2 font-display font-bold text-lg mb-3">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center"><Sparkles size={14} /></div>
          PostCraft AI
        </div>
        <p className="text-gray-500 text-sm">© {new Date().getFullYear()} PostCraft AI. All rights reserved.</p>
      </footer>
    </div>
  )
}
