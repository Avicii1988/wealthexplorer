import { Search, TrendingUp, BarChart3 } from 'lucide-react'

interface HeaderProps {
  searchQuery: string
  onSearchChange: (value: string) => void
}

export default function Header({ searchQuery, onSearchChange }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-navy-900/80 backdrop-blur-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
                <BarChart3 size={18} className="text-navy-900" style={{ color: '#080d1a' }} />
              </div>
              <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-navy-900 animate-pulse" />
            </div>
            <div className="hidden sm:block">
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-bold bg-gradient-to-r from-amber-300 to-yellow-500 bg-clip-text text-transparent">
                  WealthScape
                </span>
                <span className="text-lg font-light text-gray-400">Radar</span>
              </div>
              <p className="text-xs text-gray-500 -mt-0.5">Celebrity Net Worth Explorer</p>
            </div>
          </div>

          {/* Search bar */}
          <div className="flex-1 max-w-md mx-6">
            <div className="relative">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => onSearchChange(e.target.value)}
                placeholder="Search celebrities, companies..."
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-amber-400/50 focus:bg-white/8 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Right nav */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-full px-3 py-1.5">
              <TrendingUp size={12} />
              <span className="font-medium">Live Data</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
