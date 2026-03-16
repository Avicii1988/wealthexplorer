import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Globe } from 'lucide-react'
import { celebrities, categories, type Category, type Asset, assetTypeIcons, formatValue, formatNetWorth } from '../data/celebrities'

export default function HomePage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<Category>('All')

  const filteredCelebs = useMemo(() => {
    let list = [...celebrities]
    if (activeCategory !== 'All') list = list.filter(c => c.category === activeCategory)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.assets.some(a => a.name.toLowerCase().includes(q))
      )
    }
    return list
  }, [search, activeCategory])

  const trending = celebrities.filter(c => c.trending)

  // Flat asset feed from all filtered celebs
  const assetFeed: (Asset & { ownerName: string; ownerId: string })[] = useMemo(() => {
    return filteredCelebs
      .flatMap(c => c.assets.map(a => ({ ...a, ownerName: c.name, ownerId: c.id })))
      .sort((a, b) => b.likes - a.likes)
  }, [filteredCelebs])

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/8">
        <div className="font-serif text-xl" style={{ color: '#c9a84c' }}>
          Wealth Explorer
        </div>
        <div className="flex items-center gap-1.5 text-sm text-gray-400">
          <Globe size={14} />
          <span>English</span>
        </div>
      </header>

      {/* Hero */}
      <section className="text-center px-6 pt-20 pb-14">
        <h1 className="font-serif text-6xl md:text-7xl font-normal text-white mb-5 leading-tight">
          Wealth Explorer
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto leading-relaxed mb-10">
          Explore verified yachts, jets, watches, and estates owned<br />
          by the world's most notable individuals.
        </p>

        {/* Search */}
        <div className="relative max-w-2xl mx-auto">
          <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search a public figure..."
            className="w-full bg-[#1a1a1a] border border-white/15 rounded-full pl-12 pr-6 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-white/30 text-base transition-colors"
          />
        </div>
      </section>

      {/* Category filters */}
      <div className="flex items-center justify-center gap-3 px-6 pb-12 flex-wrap">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${
              activeCategory === cat
                ? 'border-[#c9a84c] text-[#c9a84c]'
                : 'border-white/20 text-gray-400 hover:border-white/40 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Trending profiles */}
      {!search && activeCategory === 'All' && (
        <section className="px-6 pb-14 max-w-6xl mx-auto">
          <p className="text-center text-xs tracking-[0.2em] text-gray-500 uppercase mb-8">
            Trending Profiles
          </p>
          <div className="flex items-start justify-center gap-8 overflow-x-auto scrollbar-hide pb-2">
            {trending.map(celeb => (
              <button
                key={celeb.id}
                onClick={() => navigate(`/celebrities/${celeb.id}`)}
                className="flex flex-col items-center gap-2 flex-shrink-0 group"
              >
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-[#c9a84c]/50 transition-colors">
                  <img
                    src={celeb.avatar}
                    alt={celeb.name}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                    onError={e => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(celeb.name)}&background=1a1a1a&color=c9a84c&size=80`
                    }}
                  />
                </div>
                <span className="text-xs text-gray-400 group-hover:text-white transition-colors text-center w-20 leading-tight">
                  {celeb.name}
                </span>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Asset feed */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        {search || activeCategory !== 'All' ? (
          <p className="text-xs tracking-[0.2em] text-gray-500 uppercase mb-8 text-center">
            {filteredCelebs.length} profiles · {assetFeed.length} assets
          </p>
        ) : (
          <p className="text-xs tracking-[0.2em] text-gray-500 uppercase mb-8 text-center">
            Featured Assets
          </p>
        )}

        {assetFeed.length === 0 ? (
          <div className="text-center py-24 text-gray-600">
            No results found
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5">
            {assetFeed.map(asset => (
              <button
                key={asset.id}
                onClick={() => navigate(`/celebrities/${asset.ownerId}`)}
                className="relative aspect-square overflow-hidden bg-[#111] group"
              >
                <img
                  src={asset.image}
                  alt={asset.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 grayscale-[20%]"
                  onError={e => {
                    (e.target as HTMLImageElement).style.display = 'none'
                  }}
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {/* Asset type badge */}
                <div className="absolute top-3 left-3">
                  <span className="text-lg">{assetTypeIcons[asset.type]}</span>
                </div>
                {/* Bottom info — always visible */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="flex items-end justify-between">
                    <div className="text-left">
                      <p className="text-xs text-gray-400 mb-0.5">{asset.ownerName}</p>
                      <p className="text-sm font-medium text-white leading-tight">{asset.name}</p>
                    </div>
                    <div className="text-right flex-shrink-0 ml-2">
                      <p className="text-sm font-semibold" style={{ color: '#c9a84c' }}>
                        {formatValue(asset.estimatedValue)}
                      </p>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* People grid below the asset feed */}
      <section className="max-w-6xl mx-auto px-6 pb-20 border-t border-white/8 pt-12">
        <p className="text-xs tracking-[0.2em] text-gray-500 uppercase mb-8 text-center">Profiles</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredCelebs.map(celeb => (
            <button
              key={celeb.id}
              onClick={() => navigate(`/celebrities/${celeb.id}`)}
              className="group text-left"
            >
              <div className="aspect-square rounded-2xl overflow-hidden bg-[#111] mb-3 border border-white/8 group-hover:border-[#c9a84c]/30 transition-colors">
                <img
                  src={celeb.avatar}
                  alt={celeb.name}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                  onError={e => {
                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(celeb.name)}&background=1a1a1a&color=c9a84c&size=200`
                  }}
                />
              </div>
              <p className="text-sm font-medium text-white group-hover:text-[#c9a84c] transition-colors">{celeb.name}</p>
              <p className="text-xs text-gray-500 mt-0.5">{formatNetWorth(celeb.netWorth)} · {celeb.assets.length} assets</p>
            </button>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/8 py-8 text-center">
        <p className="font-serif text-sm" style={{ color: '#c9a84c' }}>Wealth Explorer</p>
        <p className="text-xs text-gray-600 mt-2">Data is estimated and for informational purposes only.</p>
      </footer>
    </div>
  )
}
