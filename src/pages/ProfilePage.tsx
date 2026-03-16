import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Heart, MapPin, Globe, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react'
import {
  celebrities,
  assetTypeIcons,
  assetTypeLabels,
  formatValue,
  formatNetWorth,
  type AssetType,
  type Asset,
} from '../data/celebrities'

const ALL = 'All' as const

function PhotoCarousel({ photos, name }: { photos: string[]; name: string }) {
  const [index, setIndex] = useState(0)
  const [loaded, setLoaded] = useState<boolean[]>(photos.map(() => false))

  const prev = useCallback(() => setIndex(i => (i - 1 + photos.length) % photos.length), [photos.length])
  const next = useCallback(() => setIndex(i => (i + 1) % photos.length), [photos.length])

  // Auto-advance every 4s
  useEffect(() => {
    if (photos.length <= 1) return
    const id = setInterval(next, 4000)
    return () => clearInterval(id)
  }, [next, photos.length])

  const markLoaded = (i: number) =>
    setLoaded(prev => { const n = [...prev]; n[i] = true; return n })

  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-[#111] aspect-[4/5] select-none">
      {/* Slides */}
      {photos.map((src, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === index ? 1 : 0, pointerEvents: i === index ? 'auto' : 'none' }}
        >
          {!loaded[i] && (
            <div className="absolute inset-0 bg-[#1a1a1a] animate-pulse" />
          )}
          <img
            src={src}
            alt={`${name} photo ${i + 1}`}
            className="w-full h-full object-cover object-top"
            onLoad={() => markLoaded(i)}
            onError={() => markLoaded(i)}
          />
          {/* subtle gradient at bottom */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
      ))}

      {/* Arrows */}
      {photos.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:bg-black/70 transition-colors z-10"
            aria-label="Previous photo"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:bg-black/70 transition-colors z-10"
            aria-label="Next photo"
          >
            <ChevronRight size={18} />
          </button>

          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {photos.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className="transition-all duration-300"
                aria-label={`Photo ${i + 1}`}
              >
                <span
                  className="block rounded-full transition-all duration-300"
                  style={{
                    width: i === index ? 20 : 6,
                    height: 6,
                    background: i === index ? '#c9a84c' : 'rgba(255,255,255,0.35)',
                  }}
                />
              </button>
            ))}
          </div>
        </>
      )}

      {/* Photo counter badge */}
      <div className="absolute top-3 right-3 text-[11px] font-medium px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 text-gray-300 z-10">
        {index + 1} / {photos.length}
      </div>
    </div>
  )
}

function GlanceTable({ celeb }: { celeb: NonNullable<typeof celebrities[number]> }) {
  const rows: [string, string][] = [
    ['Category', celeb.category],
    ['Net Worth', celeb.netWorth >= 1
      ? `$${celeb.netWorth % 1 === 0 ? celeb.netWorth.toFixed(0) : celeb.netWorth.toFixed(1)}B`
      : `$${(celeb.netWorth * 1000).toFixed(0)}M`],
    ['Birthdate', celeb.birthdate],
    ['Birthplace', celeb.birthplace],
    ['Gender', celeb.gender],
    ['Height', celeb.height],
    ['Profession', celeb.profession],
    ['Nationality', celeb.nationality],
  ]
  return (
    <div className="bg-[#111111] border border-white/8 rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-white/8">
        <h2
          className="text-base font-normal text-white"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          {celeb.name} at a Glance
        </h2>
      </div>
      <table className="w-full text-sm">
        <tbody>
          {rows.map(([label, value], i) => (
            <tr key={label} className={i % 2 === 0 ? 'bg-[#111]' : 'bg-[#141414]'}>
              <td className="px-5 py-3 text-gray-500 font-medium whitespace-nowrap w-32">{label}</td>
              <td className="px-5 py-3 text-gray-200">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function AssetCard({ asset }: { asset: Asset }) {
  const [liked, setLiked] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [imgError, setImgError] = useState(false)

  return (
    <article className="bg-[#111111] border border-white/8 overflow-hidden group hover:border-white/20 transition-colors duration-300">
      {/* Image */}
      <div className="relative aspect-video overflow-hidden bg-[#1a1a1a]">
        {!imgError ? (
          <img
            src={asset.image}
            alt={asset.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">
            {assetTypeIcons[asset.type]}
          </div>
        )}

        {/* Top badges */}
        <div className="absolute top-4 left-4 right-4 flex items-start justify-between pointer-events-none">
          <span className="text-[11px] font-medium tracking-widest uppercase px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm text-gray-300 border border-white/10">
            {assetTypeIcons[asset.type]}&nbsp; {assetTypeLabels[asset.type]}
          </span>
          <span
            className="text-sm font-semibold px-3 py-1 rounded-full backdrop-blur-sm border"
            style={{ background: 'rgba(0,0,0,0.6)', color: '#c9a84c', borderColor: 'rgba(201,168,76,0.35)' }}
          >
            {formatValue(asset.estimatedValue)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Year */}
        {asset.year && (
          <p className="text-[11px] tracking-widest uppercase text-gray-600 mb-2">{asset.year}</p>
        )}

        {/* Name + like */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3
            className="font-serif text-xl font-normal leading-snug text-white flex-1"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            {asset.name}
          </h3>
          <button
            onClick={() => setLiked(l => !l)}
            className="flex-shrink-0 mt-1 transition-transform active:scale-90"
            aria-label="Like"
          >
            <Heart
              size={19}
              className={`transition-all duration-200 ${liked ? 'fill-red-500 text-red-500 scale-110' : 'text-gray-600 hover:text-gray-400'}`}
            />
          </button>
        </div>

        {/* Location */}
        {asset.location && (
          <p className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
            <MapPin size={11} className="flex-shrink-0" />
            {asset.location}
          </p>
        )}

        {/* Specs pill row */}
        {asset.specs && (
          <p className="text-xs text-gray-500 leading-relaxed mb-3 font-mono">{asset.specs}</p>
        )}

        {/* Description toggle */}
        <button
          onClick={() => setExpanded(e => !e)}
          className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-300 transition-colors mb-1"
        >
          {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          {expanded ? 'Less' : 'More details'}
        </button>

        {expanded && (
          <p className="text-sm text-gray-400 leading-relaxed mt-2 border-t border-white/8 pt-3">
            {asset.description}
          </p>
        )}

        {/* Likes */}
        <div className="flex items-center gap-1.5 mt-4 pt-4 border-t border-white/8">
          <Heart size={11} className="text-gray-600" />
          <span className="text-xs text-gray-600">
            {(asset.likes + (liked ? 1 : 0)).toLocaleString()} likes
          </span>
        </div>
      </div>
    </article>
  )
}

export default function ProfilePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [activeType, setActiveType] = useState<AssetType | typeof ALL>(ALL)
  const [avatarError, setAvatarError] = useState(false)

  const celeb = celebrities.find(c => c.id === id)

  if (!celeb) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center gap-4">
        <p className="font-serif text-2xl text-gray-400">Profile not found</p>
        <button onClick={() => navigate('/')} className="text-sm text-gray-600 hover:text-white transition-colors">
          ← Back to home
        </button>
      </div>
    )
  }

  const assetTypes = Array.from(new Set(celeb.assets.map(a => a.type))) as AssetType[]
  const tabs: (AssetType | typeof ALL)[] = [ALL, ...assetTypes]
  const filteredAssets = activeType === ALL ? celeb.assets : celeb.assets.filter(a => a.type === activeType)
  const totalValue = celeb.assets.reduce((s, a) => s + a.estimatedValue, 0)

  const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(celeb.name)}&background=1a1a1a&color=c9a84c&size=200&bold=true`

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">

      {/* Sticky top nav */}
      <header className="sticky top-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/8">
        <div className="max-w-5xl mx-auto px-5 h-14 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2.5 text-gray-400 hover:text-white transition-colors group"
          >
            <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
            <span
              className="font-serif text-base"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#c9a84c' }}
            >
              Wealth Explorer
            </span>
          </button>
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <Globe size={12} />
            <span className="uppercase tracking-wider">{celeb.nationality}</span>
          </div>
        </div>
      </header>

      {/* ── PROFILE HERO ─────────────────────────────────────────── */}
      <section className="relative border-b border-white/8 overflow-hidden">
        {/* Cover image blur background */}
        <div className="absolute inset-0">
          <img
            src={celeb.coverImage}
            alt=""
            className="w-full h-full object-cover opacity-10 blur-sm scale-105"
            aria-hidden
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/60 via-[#0a0a0a]/80 to-[#0a0a0a]" />
        </div>

        <div className="relative max-w-5xl mx-auto px-5 py-12 flex flex-col sm:flex-row gap-8 items-start sm:items-center">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div
              className="w-32 h-32 sm:w-44 sm:h-44 rounded-2xl overflow-hidden border border-white/12 shadow-2xl"
              style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.7)' }}
            >
              <img
                src={avatarError ? fallbackAvatar : celeb.avatar}
                alt={celeb.name}
                className="w-full h-full object-cover object-top"
                onError={() => setAvatarError(true)}
              />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-3">
              <span
                className="text-[10px] tracking-[0.2em] uppercase px-3 py-1 rounded-full border"
                style={{ borderColor: 'rgba(201,168,76,0.4)', color: '#c9a84c' }}
              >
                {celeb.category}
              </span>
              {celeb.trending && (
                <span className="text-[10px] tracking-widest uppercase px-2.5 py-1 rounded-full bg-white/8 text-gray-400 border border-white/10">
                  Trending
                </span>
              )}
            </div>

            <h1
              className="text-4xl sm:text-5xl font-normal text-white mb-3 leading-tight"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              {celeb.name}
            </h1>

            <p className="text-gray-400 text-sm leading-relaxed mb-7 max-w-lg">
              {celeb.bio}
            </p>

            {/* Stats */}
            <div className="flex flex-wrap gap-x-8 gap-y-4">
              <div>
                <p
                  className="text-2xl font-semibold tabular-nums"
                  style={{ color: '#c9a84c', fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  {formatNetWorth(celeb.netWorth)}
                </p>
                <p className="text-xs text-gray-600 mt-0.5 uppercase tracking-wider">Net Worth</p>
              </div>
              <div>
                <p className="text-2xl font-semibold text-white tabular-nums"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                  {celeb.assets.length}
                </p>
                <p className="text-xs text-gray-600 mt-0.5 uppercase tracking-wider">Assets</p>
              </div>
              <div>
                <p className="text-2xl font-semibold text-white tabular-nums"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                  {formatValue(totalValue)}
                </p>
                <p className="text-xs text-gray-600 mt-0.5 uppercase tracking-wider">Total Asset Value</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CAROUSEL + AT A GLANCE ───────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-5 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <PhotoCarousel photos={celeb.photos} name={celeb.name} />
          <GlanceTable celeb={celeb} />
        </div>
      </section>

      {/* ── ASSET TYPE TABS ──────────────────────────────────────── */}
      <div className="sticky top-14 z-40 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/8">
        <div className="max-w-5xl mx-auto px-5">
          <div className="flex items-center gap-0 overflow-x-auto scrollbar-hide">
            {tabs.map(type => {
              const count = type === ALL
                ? celeb.assets.length
                : celeb.assets.filter(a => a.type === type).length
              const isActive = activeType === type
              return (
                <button
                  key={type}
                  onClick={() => setActiveType(type)}
                  className={`flex items-center gap-2 px-4 py-4 text-sm font-medium border-b-2 transition-all duration-200 flex-shrink-0 whitespace-nowrap ${
                    isActive
                      ? 'border-[#c9a84c] text-[#c9a84c]'
                      : 'border-transparent text-gray-500 hover:text-gray-300'
                  }`}
                >
                  {type !== ALL && <span className="text-base leading-none">{assetTypeIcons[type]}</span>}
                  <span>{type === ALL ? 'All Assets' : assetTypeLabels[type]}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                      isActive ? 'bg-[#c9a84c]/20 text-[#c9a84c]' : 'bg-white/8 text-gray-600'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── ASSET GRID ───────────────────────────────────────────── */}
      <main className="max-w-5xl mx-auto px-5 py-10">
        {filteredAssets.length === 0 ? (
          <div className="text-center py-24 text-gray-600">No assets in this category</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {filteredAssets.map(asset => (
              <AssetCard key={asset.id} asset={asset} />
            ))}
          </div>
        )}
      </main>

      {/* ── OTHER PROFILES ───────────────────────────────────────── */}
      <section className="border-t border-white/8 py-12">
        <div className="max-w-5xl mx-auto px-5">
          <p className="text-xs tracking-[0.2em] uppercase text-gray-600 mb-7">More Profiles</p>
          <div className="flex gap-5 overflow-x-auto scrollbar-hide pb-2">
            {celebrities
              .filter(c => c.id !== celeb.id)
              .slice(0, 8)
              .map(c => (
                <Link
                  key={c.id}
                  to={`/celebrities/${c.id}`}
                  className="flex flex-col items-center gap-2.5 flex-shrink-0 group"
                >
                  <div className="w-16 h-16 rounded-full overflow-hidden border border-white/10 group-hover:border-[#c9a84c]/40 transition-colors">
                    <img
                      src={c.avatar}
                      alt={c.name}
                      className="w-full h-full object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-300"
                      onError={e => {
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&background=1a1a1a&color=c9a84c&size=64`
                      }}
                    />
                  </div>
                  <span className="text-[11px] text-gray-500 group-hover:text-white transition-colors text-center w-20 leading-tight">
                    {c.name}
                  </span>
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/8 py-6 text-center">
        <p className="text-xs text-gray-700">
          Asset values are estimated and for informational purposes only.
        </p>
      </footer>
    </div>
  )
}
