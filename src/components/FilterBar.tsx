import { SlidersHorizontal } from 'lucide-react'
import type { Category } from '../data/celebrities'

interface FilterBarProps {
  categories: readonly Category[]
  activeCategory: Category
  onCategoryChange: (cat: Category) => void
  sortBy: 'netWorth' | 'name' | 'change'
  onSortChange: (sort: 'netWorth' | 'name' | 'change') => void
  resultCount: number
}

export default function FilterBar({
  categories,
  activeCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  resultCount,
}: FilterBarProps) {
  return (
    <div id="explore" className="mb-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="text-xl font-bold text-white">Wealth Profiles</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Showing <span className="text-amber-400 font-semibold">{resultCount}</span> profiles
          </p>
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={14} className="text-gray-500" />
          <span className="text-xs text-gray-500">Sort:</span>
          {(['netWorth', 'change', 'name'] as const).map(s => (
            <button
              key={s}
              onClick={() => onSortChange(s)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                sortBy === s
                  ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                  : 'text-gray-400 hover:text-gray-300 bg-white/5 border border-white/10'
              }`}
            >
              {s === 'netWorth' ? 'Net Worth' : s === 'change' ? 'Growth' : 'A–Z'}
            </button>
          ))}
        </div>
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
              activeCategory === cat
                ? 'bg-gradient-to-r from-amber-400 to-yellow-500 shadow-lg shadow-amber-500/20'
                : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-gray-200'
            }`}
            style={activeCategory === cat ? { color: '#080d1a' } : undefined}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  )
}
