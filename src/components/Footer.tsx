import { BarChart3 } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-white/10 bg-white/2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center">
              <BarChart3 size={14} style={{ color: '#080d1a' }} />
            </div>
            <div>
              <span className="text-sm font-bold bg-gradient-to-r from-amber-300 to-yellow-500 bg-clip-text text-transparent">
                WealthScape Radar
              </span>
              <span className="text-xs text-gray-600 ml-2">Celebrity Net Worth Explorer</span>
            </div>
          </div>

          <p className="text-xs text-gray-600 text-center">
            Data is estimated and for informational purposes only. Net worth figures may vary.
            <br className="hidden sm:inline" />
            Not financial advice. © {new Date().getFullYear()} WealthScape Radar.
          </p>
        </div>
      </div>
    </footer>
  )
}
