import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts'
import type { AssetBreakdown } from '../data/celebrities'

interface MiniRadarChartProps {
  assets: AssetBreakdown
}

export default function MiniRadarChart({ assets }: MiniRadarChartProps) {
  const total = Object.values(assets).reduce((sum, v) => sum + v, 0)

  const data = [
    { subject: 'Real Est.', value: Math.round((assets.realEstate / total) * 100) },
    { subject: 'Stocks', value: Math.round((assets.stocks / total) * 100) },
    { subject: 'Business', value: Math.round((assets.business / total) * 100) },
    { subject: 'Entmt.', value: Math.round((assets.entertainment / total) * 100) },
    { subject: 'Crypto', value: Math.round((assets.crypto / total) * 100) },
    { subject: 'Luxury', value: Math.round((assets.luxury / total) * 100) },
  ]

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart data={data} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
        <PolarGrid stroke="rgba(255,255,255,0.1)" />
        <PolarAngleAxis
          dataKey="subject"
          tick={{ fontSize: 7, fill: 'rgba(255,255,255,0.3)' }}
        />
        <Radar
          name="assets"
          dataKey="value"
          stroke="#f59e0b"
          fill="#f59e0b"
          fillOpacity={0.25}
          strokeWidth={1.5}
        />
      </RadarChart>
    </ResponsiveContainer>
  )
}
