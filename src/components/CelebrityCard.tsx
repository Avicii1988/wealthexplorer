import { TrendingUp, TrendingDown, GitCompare, ChevronRight } from 'lucide-react'
import type { Celebrity } from '../data/celebrities'
import { formatNetWorth, getWealthTier, getCategoryColor } from '../data/celebrities'
import MiniRadarChart from './MiniRadarChart'

interface CelebrityCardProps {
  celebrity: Celebrity
  onClick: () => void
  onCompare: () => void
  isCompared: boolean
}

export default function CelebrityCard({ celebrity, onClick, onCompare, isCompared }: CelebrityCardProps) {
  const tier = getWealthTier(celebrity.netWorth)
  const catColor = getCategoryColor(celebrity.category)
  const isPositive = celebrity.netWorthChange >= 0

  return (
    <div
      className={`group relative bg-white/[0.04] border rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:bg-white/[0.07] hover:-translate-y-0.5 hover:shadow-2xl ${
        isCompared
          ? 'border-amber-400/50 shadow-lg shadow-amber-500/10'
          : 'border-white/10 hover:border-white/20'
      }`}
      onClick={onClick}
    >
      {/* Top color bar */}
      <div className={`h-0.5 w-full bg-gradient-to-r ${
        celebrity.category === 'Tech' ? 'from-cyan-500 to-blue-500' :
        celebrity.category === 'Music' ? 'from-rose-500 to-pink-500' :
        celebrity.category === 'Sports' ? 'from-emerald-500 to-green-500' :
        celebrity.category === 'Business' ? 'from-purple-500 to-violet-500' :
        celebrity.category === 'Entertainment' ? 'from-pink-500 to-fuchsia-500' :
        'from-indigo-500 to-blue-500'
      }`} />

      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center text-2xl flex-shrink-0">
              {celebrity.avatar}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold text-gray-500">#{celebrity.rank}</span>
                <span className={`wealth-badge text-xs ${tier.color} ${tier.bg}`}>
                  {tier.label}
                </span>
              </div>
              <h3 className="font-bold text-white text-base leading-tight mt-0.5 truncate">
                {celebrity.name}
              </h3>
              <p className="text-xs text-gray-500 truncate">{celebrity.title}</p>
            </div>
          </div>

          {/* Category badge */}
          <span className={`wealth-badge flex-shrink-0 text-xs ${catColor}`}>
            {celebrity.category}
          </span>
        </div>

        {/* Net worth + chart */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-2xl font-bold text-white">
              {formatNetWorth(celebrity.netWorth)}
            </div>
            <div className={`flex items-center gap-1 text-xs font-semibold mt-0.5 ${
              isPositive ? 'text-emerald-400' : 'text-red-400'
            }`}>
              {isPositive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
              <span>{isPositive ? '+' : ''}{celebrity.netWorthChange.toFixed(1)}% YoY</span>
            </div>
          </div>
          <div className="w-20 h-20 opacity-80 group-hover:opacity-100 transition-opacity">
            <MiniRadarChart assets={celebrity.assets} />
          </div>
        </div>

        {/* Primary source */}
        <div className="text-xs text-gray-500 mb-4 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400/60 flex-shrink-0" />
          {celebrity.primarySource}
        </div>

        {/* Known for tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {celebrity.knownFor.slice(0, 3).map(item => (
            <span
              key={item}
              className="text-xs bg-white/5 border border-white/10 text-gray-400 rounded-md px-2 py-0.5"
            >
              {item}
            </span>
          ))}
          {celebrity.knownFor.length > 3 && (
            <span className="text-xs text-gray-600">+{celebrity.knownFor.length - 3}</span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-white/8">
          <button
            onClick={e => { e.stopPropagation(); onCompare() }}
            className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all ${
              isCompared
                ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                : 'text-gray-500 hover:text-gray-300 bg-white/5 border border-white/10 hover:bg-white/10'
            }`}
          >
            <GitCompare size={12} />
            {isCompared ? 'Comparing' : 'Compare'}
          </button>

          <span className="flex items-center gap-1 text-xs text-gray-500 group-hover:text-amber-400 transition-colors">
            View details <ChevronRight size={13} />
          </span>
        </div>
      </div>
    </div>
  )
}
