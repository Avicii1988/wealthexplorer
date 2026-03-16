import { X, TrendingUp, TrendingDown, GitCompare, MapPin, Calendar, Star } from 'lucide-react'
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
} from 'recharts'
import type { Celebrity } from '../data/celebrities'
import { formatNetWorth, getWealthTier, getCategoryColor } from '../data/celebrities'

interface CelebrityModalProps {
  celebrity: Celebrity
  compareWith: Celebrity | null
  onClose: () => void
  onCompare: () => void
  isCompared: boolean
}

const ASSET_COLORS = {
  realEstate: '#f59e0b',
  stocks: '#3b82f6',
  business: '#8b5cf6',
  entertainment: '#ec4899',
  crypto: '#10b981',
  luxury: '#f97316',
}

const ASSET_LABELS: Record<string, string> = {
  realEstate: 'Real Estate',
  stocks: 'Stocks & Equities',
  business: 'Business Ventures',
  entertainment: 'Entertainment',
  crypto: 'Crypto Assets',
  luxury: 'Luxury Assets',
}

export default function CelebrityModal({
  celebrity,
  compareWith,
  onClose,
  onCompare,
  isCompared,
}: CelebrityModalProps) {
  const tier = getWealthTier(celebrity.netWorth)
  const catColor = getCategoryColor(celebrity.category)
  const isPositive = celebrity.netWorthChange >= 0

  const total = Object.values(celebrity.assets).reduce((sum, v) => sum + v, 0)

  // Radar data
  const radarData = Object.entries(celebrity.assets).map(([key, value]) => ({
    subject: ASSET_LABELS[key] || key,
    [celebrity.name]: Math.round((value / total) * 100),
    ...(compareWith
      ? {
          [compareWith.name]: Math.round(
            (compareWith.assets[key as keyof typeof compareWith.assets] /
              Object.values(compareWith.assets).reduce((s, v) => s + v, 0)) *
              100
          ),
        }
      : {}),
  }))

  // Bar data for asset breakdown
  const barData = Object.entries(celebrity.assets).map(([key, value]) => ({
    name: ASSET_LABELS[key] || key,
    value: Math.round((value / total) * 100),
    amount: (celebrity.netWorth * (value / total)).toFixed(2),
    color: ASSET_COLORS[key as keyof typeof ASSET_COLORS] || '#6b7280',
  }))

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#0f1829] border border-white/10 rounded-2xl shadow-2xl scrollbar-thin">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-gray-400 hover:text-white transition-all"
        >
          <X size={16} />
        </button>

        {/* Header */}
        <div className="relative overflow-hidden p-6 pb-5 border-b border-white/10">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent pointer-events-none" />
          <div className="flex items-start gap-5 relative">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center text-4xl flex-shrink-0 shadow-lg">
              {celebrity.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className={`wealth-badge text-xs ${tier.color} ${tier.bg}`}>
                  {tier.label}
                </span>
                <span className={`wealth-badge text-xs ${catColor}`}>
                  {celebrity.category}
                </span>
                <span className="text-xs text-gray-500">Rank #{celebrity.rank}</span>
              </div>
              <h2 className="text-2xl font-bold text-white">{celebrity.name}</h2>
              <p className="text-sm text-gray-400 mt-0.5">{celebrity.title}</p>

              <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <MapPin size={11} />
                  {celebrity.nationality}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar size={11} />
                  Age {celebrity.age}
                </span>
                <span className="flex items-center gap-1">
                  <Star size={11} />
                  {celebrity.primarySource}
                </span>
              </div>
            </div>

            <div className="text-right flex-shrink-0">
              <div className="text-3xl font-bold text-white">{formatNetWorth(celebrity.netWorth)}</div>
              <div className={`flex items-center justify-end gap-1 text-sm font-semibold mt-1 ${
                isPositive ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                {isPositive ? '+' : ''}{celebrity.netWorthChange.toFixed(1)}% YoY
              </div>

              <button
                onClick={onCompare}
                className={`mt-3 flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all ${
                  isCompared
                    ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                    : 'text-gray-400 hover:text-gray-200 bg-white/5 border border-white/10 hover:bg-white/10'
                }`}
              >
                <GitCompare size={12} />
                {isCompared ? 'Remove from compare' : 'Add to compare'}
              </button>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Charts row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Radar chart */}
            <div className="bg-white/3 border border-white/8 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-white mb-1">Asset Allocation Radar</h3>
              <p className="text-xs text-gray-500 mb-4">
                Percentage breakdown of wealth by category
                {compareWith && ` vs ${compareWith.name}`}
              </p>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="rgba(255,255,255,0.1)" />
                    <PolarAngleAxis
                      dataKey="subject"
                      tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.5)' }}
                    />
                    <PolarRadiusAxis
                      angle={30}
                      domain={[0, 100]}
                      tick={{ fontSize: 9, fill: 'rgba(255,255,255,0.3)' }}
                      axisLine={false}
                    />
                    <Radar
                      name={celebrity.name}
                      dataKey={celebrity.name}
                      stroke="#f59e0b"
                      fill="#f59e0b"
                      fillOpacity={0.25}
                      strokeWidth={2}
                    />
                    {compareWith && (
                      <Radar
                        name={compareWith.name}
                        dataKey={compareWith.name}
                        stroke="#60a5fa"
                        fill="#60a5fa"
                        fillOpacity={0.2}
                        strokeWidth={2}
                      />
                    )}
                    {compareWith && <Legend wrapperStyle={{ fontSize: 11 }} />}
                    <Tooltip
                      contentStyle={{
                        background: '#1a2438',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 8,
                        fontSize: 12,
                      }}
                      formatter={(value) => [`${value}%`, '']}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bar chart */}
            <div className="bg-white/3 border border-white/8 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-white mb-1">Asset Distribution</h3>
              <p className="text-xs text-gray-500 mb-4">Value by asset category (%)</p>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} layout="vertical" margin={{ left: 8, right: 24 }}>
                    <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 9, fill: '#6b7280' }} />
                    <YAxis
                      type="category"
                      dataKey="name"
                      tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.5)' }}
                      width={80}
                    />
                    <Tooltip
                      contentStyle={{
                        background: '#1a2438',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 8,
                        fontSize: 12,
                      }}
                      formatter={(value, _name, props) => [
                        `${value}% (~$${(props as { payload?: { amount: string } }).payload?.amount}B)`,
                        'Allocation',
                      ]}
                    />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                      {barData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Asset breakdown cards */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3">Detailed Asset Breakdown</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {Object.entries(celebrity.assets).map(([key, value]) => {
                const pct = Math.round((value / total) * 100)
                const amount = (celebrity.netWorth * (value / total)).toFixed(2)
                const color = ASSET_COLORS[key as keyof typeof ASSET_COLORS] || '#6b7280'
                return (
                  <div
                    key={key}
                    className="bg-white/3 border border-white/8 rounded-xl p-3"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-400">{ASSET_LABELS[key]}</span>
                      <span className="text-xs font-bold" style={{ color }}>{pct}%</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden mb-1">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${pct}%`, background: color }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">~${amount}B</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Known for */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3">Known For</h3>
            <div className="flex flex-wrap gap-2">
              {celebrity.knownFor.map(item => (
                <span
                  key={item}
                  className="text-sm bg-white/5 border border-white/10 text-gray-300 rounded-lg px-3 py-1.5"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Compare with panel */}
          {compareWith && (
            <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <GitCompare size={14} className="text-blue-400" />
                Comparing with {compareWith.name}
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {[celebrity, compareWith].map((c, i) => (
                  <div key={c.id} className={`p-3 rounded-lg ${i === 0 ? 'bg-amber-500/10 border border-amber-500/20' : 'bg-blue-500/10 border border-blue-500/20'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{c.avatar}</span>
                      <span className="font-semibold text-white text-xs">{c.name}</span>
                    </div>
                    <div className="text-lg font-bold" style={{ color: i === 0 ? '#f59e0b' : '#60a5fa' }}>
                      {formatNetWorth(c.netWorth)}
                    </div>
                    <div className={`text-xs mt-1 ${c.netWorthChange >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {c.netWorthChange >= 0 ? '+' : ''}{c.netWorthChange.toFixed(1)}% YoY
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
