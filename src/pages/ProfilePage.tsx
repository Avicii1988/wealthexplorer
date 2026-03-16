import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Heart, MapPin } from 'lucide-react'
import { celebrities, assetTypeIcons, assetTypeLabels, formatValue, formatNetWorth, type AssetType } from '../data/celebrities'

const ALL = 'All'

export default function ProfilePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [activeType, setActiveType] = useState<AssetType | typeof ALL>(ALL)
  const [likedAssets, setLikedAssets] = useState<Set<string>>(new Set())
  const [expandedAsset, setExpandedAsset] = useState<string | null>(null)

  const celeb = celebrities.find(c => c.id === id)

  if (!celeb) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center gap-4">
        <p className="text-gray-400 font-serif text-2xl">Profile not found</p>
        <button onClick={() => navigate('/')} className="text-sm text-gray-500 hover:text-white transition-colors">
          ← Back to home
        </button>
      </div>
    )
  }

  const assetTypes = [ALL, ...Array.from(new Set(celeb.assets.map(a => a.type)))] as (AssetType | typeof ALL)[]

  const filteredAssets = activeType === ALL ? celeb.assets : celeb.assets.filter(a => a.type === activeType)

  const totalAssetValue = celeb.assets.reduce((sum, a) => sum + a.estimatedValue, 0)

  const toggleLike = (assetId: string) => {
    setLikedAssets(prev => {
      const next = new Set(prev)
      next.has(assetId) ? next.delete(assetId) : next.add(assetId)
      return next
    })
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0a0a0a]/90 backdrop-blur-sm border-b border-white/8 px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
        >
          <ArrowLeft size={16} />
          <span className="font-serif" style={{ color: '#c9a84c' }}>Wealth Explorer</span>
        </button>
        <span className="text-sm text-gray-500">{celeb.category}</span>
      </header>

      {/* Profile hero */}
      <section className="max-w-4xl mx-auto px-6 pt-12 pb-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8">
          {/* Avatar */}
          <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden border border-white/10 flex-shrink-0">
            <img
              src={celeb.avatar}
              alt={celeb.name}
              className="w-full h-full object-cover"
              onError={e => {
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(celeb.name)}&background=1a1a1a&color=c9a84c&size=144`
              }}
            />
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <span className="text-xs tracking-widest text-gray-500 uppercase">{celeb.category}</span>
              {celeb.trending && (
                <span className="text-xs px-2 py-0.5 rounded-full border border-[#c9a84c]/40 text-[#c9a84c]">
                  Trending
                </span>
              )}
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-white mb-2">
              {celeb.name}
            </h1>
            <p className="text-gray-400 text-sm leading-relaxed mb-4 max-w-lg">
              {celeb.bio}
            </p>

            {/* Stats row */}
            <div className="flex items-center gap-8">
              <div>
                <p className="text-xl font-semibold" style={{ color: '#c9a84c' }}>
                  {formatNetWorth(celeb.netWorth)}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">Net Worth</p>
              </div>
              <div>
                <p className="text-xl font-semibold text-white">{celeb.assets.length}</p>
                <p className="text-xs text-gray-500 mt-0.5">Assets</p>
              </div>
              <div>
                <p className="text-xl font-semibold text-white">{formatValue(totalAssetValue)}</p>
                <p className="text-xs text-gray-500 mt-0.5">Total Asset Value</p>
              </div>
              <div className="flex items-center gap-1 text-gray-500 text-sm">
                <MapPin size={12} />
                <span>{celeb.nationality}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Asset type filter */}
      <div className="border-y border-white/8 bg-[#0d0d0d]">
        <div className="max-w-4xl mx-auto px-6 flex items-center gap-0 overflow-x-auto scrollbar-hide">
          {assetTypes.map(type => (
            <button
              key={type}
              onClick={() => setActiveType(type)}
              className={`flex items-center gap-2 px-5 py-4 text-sm font-medium border-b-2 transition-all flex-shrink-0 ${
                activeType === type
                  ? 'border-[#c9a84c] text-[#c9a84c]'
                  : 'border-transparent text-gray-500 hover:text-gray-300'
              }`}
            >
              {type !== ALL && <span>{assetTypeIcons[type]}</span>}
              <span>{type === ALL ? 'All Assets' : assetTypeLabels[type]}</span>
              {type === ALL ? (
                <span className="text-xs bg-white/10 px-1.5 py-0.5 rounded-full">{celeb.assets.length}</span>
              ) : (
                <span className="text-xs bg-white/10 px-1.5 py-0.5 rounded-full">
                  {celeb.assets.filter(a => a.type === type).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Asset grid — Instagram style */}
      <section className="max-w-4xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5">
          {filteredAssets.map(asset => (
            <div
              key={asset.id}
              className="bg-[#0a0a0a] group cursor-pointer"
              onClick={() => setExpandedAsset(expandedAsset === asset.id ? null : asset.id)}
            >
              {/* Image */}
              <div className="aspect-square relative overflow-hidden">
                <img
                  src={asset.image}
                  alt={asset.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={e => {
                    (e.target as HTMLImageElement).style.display = 'none'
                  }}
                />
                <div className="absolute top-3 left-3">
                  <span className="text-xl">{assetTypeIcons[asset.type]}</span>
                </div>
                <div className="absolute top-3 right-3">
                  <span className="text-xs bg-black/70 px-2 py-1 rounded-full font-semibold" style={{ color: '#c9a84c' }}>
                    {formatValue(asset.estimatedValue)}
                  </span>
                </div>
              </div>

              {/* Caption */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                      {assetTypeLabels[asset.type]}{asset.year ? ` · ${asset.year}` : ''}
                    </p>
                    <h3 className="font-serif text-white font-normal leading-tight">{asset.name}</h3>
                  </div>
                  <button
                    onClick={e => { e.stopPropagation(); toggleLike(asset.id) }}
                    className="flex-shrink-0 mt-1"
                  >
                    <Heart
                      size={18}
                      className={`transition-colors ${likedAssets.has(asset.id) ? 'fill-red-500 text-red-500' : 'text-gray-600 hover:text-gray-400'}`}
                    />
                  </button>
                </div>

                {/* Expanded detail */}
                {expandedAsset === asset.id && (
                  <div className="mt-3 space-y-2 border-t border-white/8 pt-3">
                    <p className="text-sm text-gray-400 leading-relaxed">{asset.description}</p>
                    {asset.specs && (
                      <p className="text-xs text-gray-500">{asset.specs}</p>
                    )}
                    {asset.location && (
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <MapPin size={10} /> {asset.location}
                      </p>
                    )}
                  </div>
                )}

                {/* Likes */}
                <div className="flex items-center gap-1 mt-3 text-xs text-gray-600">
                  <Heart size={11} />
                  <span>{(asset.likes + (likedAssets.has(asset.id) ? 1 : 0)).toLocaleString()} likes</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/8 py-8 text-center">
        <button onClick={() => navigate('/')} className="text-xs text-gray-600 hover:text-gray-400 transition-colors">
          ← Back to Wealth Explorer
        </button>
      </footer>
    </div>
  )
}
