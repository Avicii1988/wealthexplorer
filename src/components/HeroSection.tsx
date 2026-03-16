import { ArrowRight, Zap } from 'lucide-react'

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-16 pb-12">
      {/* Glow orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-8 right-1/4 w-80 h-80 bg-yellow-400/6 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/20 rounded-full px-4 py-1.5 mb-6">
            <Zap size={13} className="text-amber-400" />
            <span className="text-xs text-amber-300 font-medium tracking-wider uppercase">
              Wealth Intelligence Platform
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-5">
            <span className="text-white">Explore the World's</span>
            <br />
            <span className="bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
              Wealthiest Figures
            </span>
          </h1>

          <p className="text-base sm:text-lg text-gray-400 leading-relaxed mb-8 max-w-2xl mx-auto">
            Interactive radar charts, asset breakdowns, and net worth comparisons
            for the world's most influential celebrities, executives, and athletes.
          </p>

          {/* CTA */}
          <div className="flex items-center justify-center gap-4">
            <a
              href="#explore"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-sm font-semibold px-6 py-3 rounded-xl hover:from-amber-300 hover:to-yellow-400 transition-all duration-200 shadow-lg shadow-amber-500/25"
              style={{ color: '#080d1a' }}
            >
              Explore Wealth Data
              <ArrowRight size={15} />
            </a>
            <span className="text-sm text-gray-500">
              {12} profiles tracked
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
