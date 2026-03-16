import { Trophy, TrendingUp, TrendingDown, GitCompare } from 'lucide-react'
import type { Celebrity } from '../data/celebrities'
import { formatNetWorth } from '../data/celebrities'

interface LeaderboardPanelProps {
  celebrities: Celebrity[]
  onSelect: (celebrity: Celebrity) => void
  compareList: Celebrity[]
}

export default function LeaderboardPanel({ celebrities, onSelect, compareList }: LeaderboardPanelProps) {
  const top5 = [...celebrities].sort((a, b) => b.netWorth - a.netWorth).slice(0, 5)
  const topGainers = [...celebrities]
    .filter(c => c.netWorthChange > 0)
    .sort((a, b) => b.netWorthChange - a.netWorthChange)
    .slice(0, 4)

  const rankColors = ['text-yellow-400', 'text-gray-300', 'text-amber-600', 'text-gray-500', 'text-gray-500']

  return (
    <div className="space-y-5 sticky top-24">
      {/* Top 5 Richest */}
      <div className="bg-white/[0.04] border border-white/10 rounded-2xl overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
          <Trophy size={14} className="text-amber-400" />
          <h3 className="text-sm font-semibold text-white">Wealthiest 5</h3>
        </div>
        <div className="divide-y divide-white/5">
          {top5.map((celebrity, i) => (
            <button
              key={celebrity.id}
              onClick={() => onSelect(celebrity)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left"
            >
              <span className={`text-sm font-bold w-4 ${rankColors[i]}`}>{i + 1}</span>
              <span className="text-lg">{celebrity.avatar}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate">{celebrity.name}</p>
                <p className="text-xs text-amber-400 font-bold">{formatNetWorth(celebrity.netWorth)}</p>
              </div>
              {compareList.find(c => c.id === celebrity.id) && (
                <GitCompare size={12} className="text-amber-400 flex-shrink-0" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Top Gainers */}
      <div className="bg-white/[0.04] border border-white/10 rounded-2xl overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
          <TrendingUp size={14} className="text-emerald-400" />
          <h3 className="text-sm font-semibold text-white">Top Gainers</h3>
        </div>
        <div className="divide-y divide-white/5">
          {topGainers.map(celebrity => (
            <button
              key={celebrity.id}
              onClick={() => onSelect(celebrity)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left"
            >
              <span className="text-lg">{celebrity.avatar}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate">{celebrity.name}</p>
                <p className="text-xs text-gray-500 truncate">{celebrity.category}</p>
              </div>
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-0.5">
                <TrendingUp size={10} />
                +{celebrity.netWorthChange.toFixed(1)}%
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Compare Panel */}
      {compareList.length > 0 && (
        <div className="bg-amber-500/5 border border-amber-400/20 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <GitCompare size={14} className="text-amber-400" />
            <h3 className="text-sm font-semibold text-white">Comparison</h3>
          </div>
          <div className="space-y-2">
            {compareList.map(c => (
              <div key={c.id} className="flex items-center gap-2 bg-white/5 rounded-lg p-2">
                <span>{c.avatar}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white truncate">{c.name}</p>
                  <p className="text-xs text-amber-400">{formatNetWorth(c.netWorth)}</p>
                </div>
              </div>
            ))}
          </div>
          {compareList.length === 2 && (
            <div className="mt-3 text-xs text-gray-500 text-center">
              Click a profile to see comparison
            </div>
          )}
        </div>
      )}

      {/* Decliners */}
      {celebrities.filter(c => c.netWorthChange < 0).length > 0 && (
        <div className="bg-white/[0.04] border border-white/10 rounded-2xl overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
            <TrendingDown size={14} className="text-red-400" />
            <h3 className="text-sm font-semibold text-white">Decliners</h3>
          </div>
          <div className="divide-y divide-white/5">
            {celebrities
              .filter(c => c.netWorthChange < 0)
              .sort((a, b) => a.netWorthChange - b.netWorthChange)
              .slice(0, 3)
              .map(celebrity => (
                <button
                  key={celebrity.id}
                  onClick={() => onSelect(celebrity)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left"
                >
                  <span className="text-lg">{celebrity.avatar}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-white truncate">{celebrity.name}</p>
                    <p className="text-xs text-gray-500 truncate">{formatNetWorth(celebrity.netWorth)}</p>
                  </div>
                  <span className="text-xs font-bold text-red-400 flex items-center gap-0.5">
                    <TrendingDown size={10} />
                    {celebrity.netWorthChange.toFixed(1)}%
                  </span>
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
