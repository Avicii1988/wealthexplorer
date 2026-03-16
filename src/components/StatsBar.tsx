import { DollarSign, Users, TrendingUp, Globe } from 'lucide-react'
import type { Celebrity } from '../data/celebrities'

interface StatsBarProps {
  celebrities: Celebrity[]
}

export default function StatsBar({ celebrities }: StatsBarProps) {
  const totalWealth = celebrities.reduce((sum, c) => sum + c.netWorth, 0)
  const avgChange = celebrities.reduce((sum, c) => sum + c.netWorthChange, 0) / celebrities.length
  const countries = new Set(celebrities.map(c => c.nationality)).size
  const gainers = celebrities.filter(c => c.netWorthChange > 0).length

  const stats = [
    {
      icon: DollarSign,
      label: 'Total Combined Wealth',
      value: `$${totalWealth.toFixed(0)}B`,
      sub: 'across all profiles',
      color: 'text-amber-400',
      bg: 'bg-amber-400/10',
    },
    {
      icon: TrendingUp,
      label: 'Avg. Wealth Change',
      value: `+${avgChange.toFixed(1)}%`,
      sub: 'year over year',
      color: 'text-emerald-400',
      bg: 'bg-emerald-400/10',
    },
    {
      icon: Users,
      label: 'Profiles Tracked',
      value: celebrities.length.toString(),
      sub: `${gainers} gaining wealth`,
      color: 'text-blue-400',
      bg: 'bg-blue-400/10',
    },
    {
      icon: Globe,
      label: 'Countries',
      value: countries.toString(),
      sub: 'nationalities represented',
      color: 'text-purple-400',
      bg: 'bg-purple-400/10',
    },
  ]

  return (
    <div className="border-y border-white/8 bg-white/2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/8">
          {stats.map((stat, i) => (
            <div key={i} className="flex items-center gap-4 px-6 py-5">
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center flex-shrink-0`}>
                <stat.icon size={18} className={stat.color} />
              </div>
              <div>
                <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-xs text-gray-500 leading-tight">
                  <span className="block text-gray-400 font-medium text-[11px]">{stat.label}</span>
                  {stat.sub}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
