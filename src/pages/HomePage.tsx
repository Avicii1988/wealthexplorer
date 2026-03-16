import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, Globe } from 'lucide-react'
import {
  celebrities,
  categories,
  type Category,
  type Asset,
  assetTypeIcons,
  formatValue,
  formatNetWorth,
} from '../data/celebrities'

type FeedItem = Asset & { ownerName: string; ownerId: string }

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
        c.assets.some(a => a.name.toLowerCase().includes(q) || a.type.includes(q))
      )
    }
    return list
  }, [search, activeCategory])

  const trendingCelebs = celebrities.filter(c => c.trending)

  const assetFeed: FeedItem[] = useMemo(
    () =>
      filteredCelebs
        .flatMap(c => c.assets.map(a => ({ ...a, ownerName: c.name, ownerId: c.id })))
        .sort((a, b) => b.likes - a.likes),
    [filteredCelebs]
  )

  const showTrending = !search && activeCategory === 'All'

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">

      {/* ── HEADER ──────────────────────────────────────────────── */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/8">
        <span
          className="font-serif text-lg"
          style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#c9a84c' }}
        >
          Wealth Explorer
        </span>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <Globe size={13} />
          <span className="tracking-wider">English</span>
        </div>
      </header>

      {/* ── HERO ────────────────────────────────────────────────── */}
      <section className="text-center px-5 pt-20 pb-14 max-w-3xl mx-auto">
        <h1
          className="text-6xl sm:text-7xl font-normal text-white mb-5 leading-tight"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Wealth Explorer
        </h1>
        <p className="text-gray-500 text-lg leading-relaxed mb-10">
          Explore verified yachts, jets, watches, and estates<br className="hidden sm:block" />
          owned by the world's most notable individuals.
        </p>

        {/* Search */}
        <div className="relative max-w-2xl mx-auto">
          <Search size={17} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search a public figure or asset..."
            className="w-full bg-[#161616] border border-white/12 rounded-full pl-12 pr-6 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-white/25 text-sm transition-colors"
          />
        </div>
      </section>

      {/* ── CATEGORY FILTERS ────────────────────────────────────── */}
      <div className="flex items-center justify-center gap-2.5 px-5 pb-12 flex-wrap">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${
              activeCategory === cat
                ? 'border-[#c9a84c] text-[#c9a84c]'
                : 'border-white/15 text-gray-500 hover:border-white/30 hover:text-gray-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ── TRENDING PROFILES ───────────────────────────────────── */}
      {showTrending && (
        <section className="px-5 pb-16 max-w-5xl mx-auto">
          <p className="text-center text-[10px] tracking-[0.25em] text-gray-600 uppercase mb-8">
            Trending Profiles
          </p>
          <div className="flex items-start justify-center gap-7 overflow-x-auto scrollbar-hide pb-1">
            {trendingCelebs.map(celeb => (
              <Link
                key={celeb.id}
                to={`/celebrities/${celeb.id}`}
                className="flex flex-col items-center gap-2.5 flex-shrink-0 group"
              >
                <div className="w-[72px] h-[72px] rounded-full overflow-hidden border-2 border-white/10 group-hover:border-[#c9a84c]/60 transition-all duration-300 shadow-lg">
                  <img
                    src={celeb.avatar}
                    alt={celeb.name}
                    className="w-full h-full object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-500"
                    onError={e => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(celeb.name)}&background=1a1a1a&color=c9a84c&size=72`
                    }}
                  />
                </div>
                <span className="text-[11px] text-gray-500 group-hover:text-white transition-colors text-center w-[72px] leading-tight">
                  {celeb.name}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── ASSET FEED ──────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-5 pb-16">
        <p className="text-[10px] tracking-[0.25em] text-gray-600 uppercase mb-7 text-center">
          {showTrending ? 'Featured Assets' : `${assetFeed.length} assets · ${filteredCelebs.length} profiles`}
        </p>

        {assetFeed.length === 0 ? (
          <div className="text-center py-24 text-gray-700">No results found</div>
        ) : (
          <div
            className="grid gap-px"
            style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}
          >
            {assetFeed.map(asset => (
              <button
                key={asset.id}
                onClick={() => navigate(`/celebrities/${asset.ownerId}`)}
                className="relative aspect-square overflow-hidden bg-[#111] group block"
              >
                <img
                  src={asset.image}
                  alt={asset.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  onError={e => {
                    const el = e.target as HTMLImageElement
                    el.style.display = 'none'
                  }}
                />
                {/* Gradient overlay — always visible at bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />

                {/* Type icon */}
                <div className="absolute top-2.5 left-2.5 text-base leading-none opacity-90">
                  {assetTypeIcons[asset.type]}
                </div>

                {/* Bottom info */}
                <div className="absolute bottom-0 left-0 right-0 p-3 text-left">
                  <p className="text-[10px] text-gray-400 mb-0.5 truncate">{asset.ownerName}</p>
                  <div className="flex items-end justify-between gap-1">
                    <p className="text-xs font-medium text-white leading-tight truncate flex-1">
                      {asset.name}
                    </p>
                    <p
                      className="text-xs font-semibold flex-shrink-0"
                      style={{ color: '#c9a84c' }}
                    >
                      {formatValue(asset.estimatedValue)}
                    </p>
                  </div>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </button>
            ))}
          </div>
        )}
      </section>

      {/* ── PROFILE GRID ────────────────────────────────────────── */}
      <section className="border-t border-white/8 py-14 max-w-5xl mx-auto px-5">
        <p className="text-[10px] tracking-[0.25em] text-gray-600 uppercase mb-8 text-center">
          Profiles
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {filteredCelebs.map(celeb => (
            <Link key={celeb.id} to={`/celebrities/${celeb.id}`} className="group text-left">
              <div className="aspect-square rounded-2xl overflow-hidden bg-[#111] mb-3 border border-white/8 group-hover:border-[#c9a84c]/30 transition-colors duration-300">
                <img
                  src={celeb.avatar}
                  alt={celeb.name}
                  className="w-full h-full object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-500"
                  onError={e => {
                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(celeb.name)}&background=1a1a1a&color=c9a84c&size=200&bold=true`
                  }}
                />
              </div>
              <p className="text-sm font-medium text-white group-hover:text-[#c9a84c] transition-colors truncate">
                {celeb.name}
              </p>
              <p className="text-xs text-gray-600 mt-0.5">
                {formatNetWorth(celeb.netWorth)} · {celeb.assets.length} assets
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/8 py-8 text-center">
        <p
          className="font-serif text-sm mb-2"
          style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#c9a84c' }}
        >
          Wealth Explorer
        </p>
        <p className="text-xs text-gray-700">
          Data and values are estimated and for informational purposes only.
        </p>
      </footer>
    </div>
  )
}
