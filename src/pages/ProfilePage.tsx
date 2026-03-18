import { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Heart, MapPin, ChevronDown, ChevronUp, Bell, BellOff, ExternalLink } from 'lucide-react'
import {
  celebrities,
  assetTypeIcons,
  assetTypeLabels,
  formatValue,
  formatNetWorth,
  getNationalityFlag,
  getAvatar,
  type AssetType,
  type Asset,
} from '../data/celebrities'
import NotificationBell from '../components/NotificationBell'
import { LANGUAGES, useLang } from '../i18n'

const ALL = 'All' as const

const FOLLOWS_KEY = 'we_followed_celebs'

function getFollowed(): Set<string> {
  try {
    const raw = localStorage.getItem(FOLLOWS_KEY)
    return new Set(raw ? JSON.parse(raw) : [])
  } catch {
    return new Set()
  }
}
function saveFollowed(ids: Set<string>) {
  localStorage.setItem(FOLLOWS_KEY, JSON.stringify([...ids]))
}

// ── CROWN LOGO (small) ────────────────────────────────────────────────────────
function WealthLogoSmall() {
  return (
    <div className="flex items-center gap-2">
      <svg width="26" height="26" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Crown base */}
        <rect x="4" y="22" width="24" height="4" rx="1.2" fill="#c9a84c" opacity="0.95"/>
        {/* Crown body filled */}
        <path d="M4 22L4 13L9.5 18.5L16 6L22.5 18.5L28 13L28 22Z" fill="#c9a84c" opacity="0.15"/>
        {/* Crown body outline */}
        <path d="M4 22L4 13L9.5 18.5L16 6L22.5 18.5L28 13L28 22" stroke="#c9a84c" strokeWidth="1.6" strokeLinejoin="round" fill="none"/>
        {/* Top jewel */}
        <circle cx="16" cy="6.5" r="2.1" fill="#c9a84c"/>
        {/* Side jewels */}
        <circle cx="6" cy="14" r="1.5" fill="#c9a84c" opacity="0.75"/>
        <circle cx="26" cy="14" r="1.5" fill="#c9a84c" opacity="0.75"/>
        {/* Base gems */}
        <circle cx="10" cy="24" r="1" fill="#0a0a0a"/>
        <circle cx="16" cy="24" r="1" fill="#0a0a0a"/>
        <circle cx="22" cy="24" r="1" fill="#0a0a0a"/>
      </svg>
      <span className="font-serif text-base" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#c9a84c' }}>
        Wealth Explorer
      </span>
    </div>
  )
}

// Convert "X ft Y in" → "X ft Y in (Z.ZZ m)"
function addMetres(height: string): string {
  const match = height.match(/(\d+)\s*ft\s*(\d+)?\s*in?/)
  if (!match) return height
  const feet = parseInt(match[1])
  const inches = parseInt(match[2] ?? '0')
  const metres = ((feet * 12 + inches) * 0.0254).toFixed(2)
  return `${height} (${metres} m)`
}

// ── AT A GLANCE TABLE — 2-column grid ─────────────────────────────────────────
function GlanceTable({ celeb }: { celeb: NonNullable<typeof celebrities[number]> }) {
  const { t } = useLang()

  const leftCol: [string, string][] = [
    [t('category'), celeb.category],
    [t('netWorth'), formatNetWorth(celeb.netWorth)],
    [t('birthday'), celeb.birthdate],
  ]
  const rightCol: [string, string][] = [
    [t('birthplace'), celeb.birthplace],
    [t('height'), addMetres(celeb.height)],
    [t('profession'), celeb.profession],
  ]

  return (
    <div className="rounded-2xl overflow-hidden bg-[#111]">
      <div className="px-5 py-4 bg-[#161616]">
        <h2 className="text-base font-semibold text-white" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
          {celeb.name} {t('atAGlance')}
        </h2>
      </div>
      <div className="grid grid-cols-2 divide-x divide-white/5">
        {/* Left column */}
        <div className="divide-y divide-white/5">
          {leftCol.map(([label, value], i) => (
            <div key={label} className={`px-5 py-3.5 ${i % 2 === 0 ? 'bg-[#111]' : 'bg-[#131313]'}`}>
              <p className="text-[11px] uppercase tracking-wider text-gray-600 mb-1">{label}</p>
              <p className="text-sm text-gray-200 font-medium">{value}</p>
            </div>
          ))}
        </div>
        {/* Right column */}
        <div className="divide-y divide-white/5">
          {rightCol.map(([label, value], i) => (
            <div key={label} className={`px-5 py-3.5 ${i % 2 === 0 ? 'bg-[#111]' : 'bg-[#131313]'}`}>
              <p className="text-[11px] uppercase tracking-wider text-gray-600 mb-1">{label}</p>
              <p className="text-sm text-gray-200 font-medium">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── RELATIONSHIPS ─────────────────────────────────────────────────────────────
function RelationshipsSection({ celeb }: { celeb: NonNullable<typeof celebrities[number]> }) {
  const { t } = useLang()
  const r = celeb.relationships
  if (!r) return null

  const rows: [string, string][] = [
    ...(r.parents?.length ? [['Parents', r.parents.join(' · ')] as [string, string]] : []),
    ...(r.spouse ? [['Spouse', r.spouse] as [string, string]] : []),
    ...(r.partner ? [['Partner', r.partner] as [string, string]] : []),
    ...(r.siblings?.length ? [['Siblings', r.siblings.join(' · ')] as [string, string]] : []),
    ...(r.children?.length ? [['Children', r.children.join(' · ')] as [string, string]] : []),
  ]

  if (rows.length === 0) return null

  return (
    <div className="rounded-2xl overflow-hidden bg-[#111]">
      <div className="px-5 py-4 bg-[#161616]">
        <h2 className="text-base font-semibold text-white" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
          {t('relationships')}
        </h2>
      </div>
      <table className="w-full text-sm">
        <tbody>
          {rows.map(([label, value], i) => (
            <tr key={label} className={i % 2 === 0 ? 'bg-[#111]' : 'bg-[#131313]'}>
              <td className="px-5 py-3 text-gray-500 font-medium whitespace-nowrap w-32">{label}</td>
              <td className="px-5 py-3 text-gray-200 leading-relaxed">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// Extract first sentence (up to first . ! ?)
function firstSentence(text: string): string {
  const m = text.match(/^.*?[.!?](?:\s|$)/)
  return m ? m[0].trim() : text.slice(0, 130) + (text.length > 130 ? '…' : '')
}

// ── GOSSIP & CONTROVERSY — Flat list, two separate sections ──────────────────
function GossipSection({ celeb }: { celeb: NonNullable<typeof celebrities[number]> }) {
  const { t } = useLang()
  const allItems = celeb.gossip
  if (!allItems?.length) return null

  const gossipItems = allItems.filter(g => !g.type || g.type === 'gossip')
  const controversyItems = allItems.filter(g => g.type === 'controversy')

  function searchUrl(title: string) {
    return `https://www.google.com/search?q=${encodeURIComponent(title + ' ' + celeb.name)}`
  }

  function ItemList({ items }: { items: NonNullable<typeof allItems> }) {
    return (
      <div className="divide-y divide-white/5">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-4 py-4 group/row">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <p className="text-sm font-semibold text-white">{item.title}</p>
                {item.date && (
                  <span className="text-[10px] text-gray-600 px-2 py-0.5 rounded-full bg-white/5">
                    {item.date}
                  </span>
                )}
              </div>
              <p className="text-[13px] leading-relaxed" style={{ color: '#888' }}>
                {firstSentence(item.summary)}
              </p>
            </div>
            <a
              href={searchUrl(item.title)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 mt-0.5 text-gray-700 hover:text-[#c9a84c] transition-colors"
              title="Search source"
            >
              <ExternalLink size={14} />
            </a>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      {gossipItems.length > 0 && (
        <div className="rounded-2xl bg-[#111] px-5 py-1">
          <div className="flex items-center justify-between py-4 border-b border-white/8 mb-1">
            <h2 className="text-base font-semibold text-white flex items-center gap-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              <span className="text-base">💬</span> Gossip
            </h2>
            <span className="text-[11px] text-gray-600">{t('gossipDisclaimer')}</span>
          </div>
          <ItemList items={gossipItems} />
        </div>
      )}
      {controversyItems.length > 0 && (
        <div className="rounded-2xl bg-[#111] px-5 py-1">
          <div className="flex items-center justify-between py-4 border-b border-white/8 mb-1">
            <h2 className="text-base font-semibold text-white flex items-center gap-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              <span className="text-base">⚡</span> Controversy
            </h2>
            <span className="text-[11px] text-gray-600">{t('gossipDisclaimer')}</span>
          </div>
          <ItemList items={controversyItems} />
        </div>
      )}
    </div>
  )
}

// ── ASSET CARD ────────────────────────────────────────────────────────────────
function AssetCard({ asset }: { asset: Asset }) {
  const { t } = useLang()
  const [liked, setLiked] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [imgError, setImgError] = useState(false)

  return (
    <article className="bg-[#111] rounded-2xl overflow-hidden group hover:bg-[#161616] transition-colors duration-300">
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

        {/* Badges */}
        <div className="absolute top-4 left-4 right-4 flex items-start justify-between pointer-events-none">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium tracking-widest uppercase px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm text-gray-300">
              {assetTypeIcons[asset.type]}&nbsp;{assetTypeLabels[asset.type]}
            </span>
            {asset.isNew && (
              <span className="text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full bg-[#c9a84c] text-[#0a0a0a]">
                NEW
              </span>
            )}
          </div>
          <span
            className="text-sm font-semibold px-3 py-1 rounded-full backdrop-blur-sm"
            style={{ background: 'rgba(0,0,0,0.6)', color: '#c9a84c' }}
          >
            {formatValue(asset.estimatedValue)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {asset.year && (
          <p className="text-[11px] tracking-widest uppercase text-gray-600 mb-2">{asset.year}</p>
        )}

        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="font-serif text-xl font-normal leading-snug text-white flex-1" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
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

        {asset.location && (
          <p className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
            <MapPin size={11} className="flex-shrink-0" />
            {asset.location}
          </p>
        )}

        {asset.specs && (
          <p className="text-xs text-gray-500 leading-relaxed mb-3 font-mono">{asset.specs}</p>
        )}

        <button
          onClick={() => setExpanded(e => !e)}
          className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-300 transition-colors mb-1"
        >
          {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          {expanded ? t('less') : t('moreDetails')}
        </button>

        {expanded && (
          <p className="text-sm text-gray-400 leading-relaxed mt-2 pt-3">
            {asset.description}
          </p>
        )}

        <div className="flex items-center gap-1.5 mt-4 pt-4">
          <Heart size={11} className="text-gray-600" />
          <span className="text-xs text-gray-600">
            {(asset.likes + (liked ? 1 : 0)).toLocaleString()} {t('likes')}
          </span>
        </div>
      </div>
    </article>
  )
}

// ── ASSETS SECTION ────────────────────────────────────────────────────────────
function AssetsSection({ celeb }: { celeb: NonNullable<typeof celebrities[number]> }) {
  const { t } = useLang()
  const [activeType, setActiveType] = useState<AssetType | typeof ALL>(ALL)

  const assetTypes = Array.from(new Set(celeb.assets.map(a => a.type))) as AssetType[]
  const tabs: (AssetType | typeof ALL)[] = [ALL, ...assetTypes]
  const filtered = activeType === ALL ? celeb.assets : celeb.assets.filter(a => a.type === activeType)

  return (
    <div className="rounded-2xl overflow-hidden bg-[#111]">
      <div className="px-5 py-4 bg-[#161616] flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-white" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
          {t('assets')}
        </h2>
        <span className="text-[11px] text-gray-600">{celeb.assets.length} total</span>
      </div>

      {assetTypes.length > 1 && (
        <div className="flex items-center gap-0 overflow-x-auto scrollbar-hide border-b border-white/5 bg-[#111]">
          {tabs.map(type => {
            const count = type === ALL ? celeb.assets.length : celeb.assets.filter(a => a.type === type).length
            const isActive = activeType === type
            return (
              <button
                key={type}
                onClick={() => setActiveType(type)}
                className={`flex items-center gap-1.5 px-4 py-3 text-xs font-medium border-b-2 transition-all duration-200 flex-shrink-0 whitespace-nowrap ${
                  isActive ? 'border-[#c9a84c] text-[#c9a84c]' : 'border-transparent text-gray-600 hover:text-gray-400'
                }`}
              >
                {type !== ALL && <span className="text-sm leading-none">{assetTypeIcons[type]}</span>}
                <span>{type === ALL ? t('allAssets') : assetTypeLabels[type]}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${isActive ? 'bg-[#c9a84c]/20 text-[#c9a84c]' : 'bg-white/8 text-gray-600'}`}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      )}

      <div className="p-4">
        {filtered.length === 0 ? (
          <p className="text-center py-8 text-gray-600 text-sm">No assets in this category</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filtered.map(asset => (
              <AssetCard key={asset.id} asset={asset} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ── LANGUAGE SELECTOR ─────────────────────────────────────────────────────────
function LanguageSelector() {
  const { activeLang, setLang } = useLang()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 text-xs text-gray-400 hover:border-white/20 hover:text-gray-200 transition-all"
      >
        <span className="text-sm leading-none">{activeLang.flag}</span>
        <span className="hidden sm:inline tracking-wide">{activeLang.label}</span>
        <ChevronDown size={10} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-44 bg-[#141414] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50">
          {LANGUAGES.map(lang => (
            <button
              key={lang.code}
              onClick={() => { setLang(lang.code); setOpen(false) }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors ${
                activeLang.code === lang.code
                  ? 'bg-[#c9a84c]/10 text-[#c9a84c]'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span className="text-base">{lang.flag}</span>
              <span>{lang.label}</span>
              {activeLang.code === lang.code && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#c9a84c]" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ── PROFILE PAGE ──────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { t } = useLang()
  const [avatarError, setAvatarError] = useState(false)
  const [followed, setFollowed] = useState<Set<string>>(getFollowed)

  // Scroll to top whenever the profile changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [id])

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

  const totalValue = celeb.assets.reduce((s, a) => s + a.estimatedValue, 0)
  const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(celeb.name)}&background=1a1a1a&color=c9a84c&size=200&bold=true`
  const isFollowed = followed.has(celeb.id)

  function toggleFollow() {
    const next = new Set(followed)
    if (next.has(celeb!.id)) next.delete(celeb!.id)
    else next.add(celeb!.id)
    setFollowed(next)
    saveFollowed(next)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">

      {/* ── HEADER ──────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/8">
        <div className="max-w-5xl mx-auto px-5 h-14 flex items-center justify-between gap-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2.5 text-gray-400 hover:text-white transition-colors group flex-shrink-0"
          >
            <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
            <WealthLogoSmall />
          </button>

          <div className="flex items-center gap-3">
            <NotificationBell />
            <LanguageSelector />
          </div>
        </div>
      </header>

      {/* ── HERO ────────────────────────────────────────────────── */}
      <section className="relative">
        {/* Mobile: full-width portrait image */}
        <div className="sm:hidden w-full relative overflow-hidden" style={{ aspectRatio: '4/3' }}>
          <img
            src={avatarError ? fallbackAvatar : getAvatar(celeb)}
            alt={celeb.name}
            className="w-full h-full object-cover object-top"
            onError={() => setAvatarError(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/30 to-transparent" />
          {/* Category + trending badges over image */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span
              className="text-[10px] tracking-[0.2em] uppercase px-3 py-1 rounded-full border backdrop-blur-sm"
              style={{ borderColor: 'rgba(201,168,76,0.5)', color: '#c9a84c', background: 'rgba(0,0,0,0.5)' }}
            >
              {celeb.category}
            </span>
            {celeb.trending && (
              <span className="text-[10px] tracking-widest uppercase px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm text-gray-300">
                Trending
              </span>
            )}
          </div>
        </div>

        {/* Desktop: blurred cover background */}
        <div className="hidden sm:block absolute inset-0">
          <img
            src={celeb.coverImage}
            alt=""
            className="w-full h-full object-cover opacity-10 blur-sm scale-105"
            aria-hidden
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/60 via-[#0a0a0a]/80 to-[#0a0a0a]" />
        </div>

        {/* Content row (desktop: avatar + info side by side; mobile: just info) */}
        <div className="relative max-w-5xl mx-auto px-5 py-8 sm:py-14 flex flex-col sm:flex-row gap-6 sm:gap-8 items-start sm:items-center">
          {/* Circle Avatar — desktop only */}
          <div className="hidden sm:flex flex-shrink-0">
            <div
              className="w-48 h-48 rounded-full overflow-hidden shadow-2xl border-2"
              style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.7)', borderColor: 'rgba(201,168,76,0.25)' }}
            >
              <img
                src={avatarError ? fallbackAvatar : getAvatar(celeb)}
                alt={celeb.name}
                className="w-full h-full object-cover object-top"
                onError={() => setAvatarError(true)}
              />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            {/* Category badges — desktop only (mobile shows them over image) */}
            <div className="hidden sm:flex items-center gap-3 mb-3">
              <span
                className="text-[10px] tracking-[0.2em] uppercase px-3 py-1 rounded-full border"
                style={{ borderColor: 'rgba(201,168,76,0.4)', color: '#c9a84c' }}
              >
                {celeb.category}
              </span>
              {celeb.trending && (
                <span className="text-[10px] tracking-widest uppercase px-2.5 py-1 rounded-full bg-white/8 text-gray-400">
                  Trending
                </span>
              )}
            </div>

            {/* Name + Follow button inline */}
            <div className="flex items-start gap-3 mb-2">
              <h1
                className="text-3xl sm:text-5xl font-normal text-white leading-tight flex-1 min-w-0"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                {celeb.name}
              </h1>
              <button
                onClick={toggleFollow}
                className={`flex-shrink-0 flex items-center gap-1.5 mt-1.5 px-4 py-2 rounded-full text-xs font-medium border transition-all duration-200 ${
                  isFollowed
                    ? 'bg-[#c9a84c]/10 border-[#c9a84c]/50 text-[#c9a84c] hover:bg-[#c9a84c]/20'
                    : 'border-white/20 text-gray-300 hover:border-[#c9a84c]/40 hover:text-[#c9a84c]'
                }`}
              >
                {isFollowed ? <Bell size={12} className="fill-[#c9a84c]" /> : <BellOff size={12} />}
                <span className="hidden sm:inline">{isFollowed ? t('following') : t('follow')}</span>
              </button>
            </div>

            {/* Nationality */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg leading-none" title={celeb.nationality}>{getNationalityFlag(celeb.nationality)}</span>
              <span className="text-sm text-gray-400 uppercase tracking-widest">{celeb.nationality}</span>
            </div>

            <p className="text-gray-400 text-sm leading-relaxed mb-7 max-w-lg">
              {celeb.bio}
            </p>

            {/* Stats row */}
            <div className="flex flex-wrap items-end gap-x-8 gap-y-3">
              <div>
                <p className="text-2xl font-semibold tabular-nums" style={{ color: '#c9a84c', fontFamily: "'Playfair Display', Georgia, serif" }}>
                  {formatNetWorth(celeb.netWorth)}
                </p>
                <p className="text-xs text-gray-600 mt-0.5 uppercase tracking-wider">{t('netWorth')}</p>
              </div>
              <div>
                <p className="text-2xl font-semibold text-white tabular-nums" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                  {celeb.assets.length}
                </p>
                <p className="text-xs text-gray-600 mt-0.5 uppercase tracking-wider">{t('assets')}</p>
              </div>
              <div>
                <p className="text-2xl font-semibold text-white tabular-nums" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                  {formatValue(totalValue)}
                </p>
                <p className="text-xs text-gray-600 mt-0.5 uppercase tracking-wider">{t('totalValue')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT ─────────────────────────────────────────── */}
      <main className="max-w-5xl mx-auto px-5 py-10 flex flex-col gap-6">
        <GlanceTable celeb={celeb} />
        <RelationshipsSection celeb={celeb} />
        <GossipSection celeb={celeb} />
        {celeb.assets.length > 0 && <AssetsSection celeb={celeb} />}
      </main>

      {/* ── MORE PROFILES — square cards ────────────────────────── */}
      <section className="py-12">
        <div className="max-w-5xl mx-auto px-5">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-gray-500 mb-6">{t('moreProfiles')}</p>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
            {[
              ...celebrities.filter(c => c.id !== celeb.id && c.category === celeb.category),
              ...celebrities.filter(c => c.id !== celeb.id && c.category !== celeb.category),
            ]
              .slice(0, 16)
              .map(c => (
                <Link
                  key={c.id}
                  to={`/celebrities/${c.id}`}
                  className="flex-shrink-0 group"
                  style={{ width: 100 }}
                >
                  {/* Square image */}
                  <div className="relative overflow-hidden rounded-xl border border-white/8 group-hover:border-[#c9a84c]/40 transition-all duration-300" style={{ aspectRatio: '1/1' }}>
                    <img
                      src={getAvatar(c)}
                      alt={c.name}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      onError={e => {
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&background=1a1a1a&color=c9a84c&size=100`
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <p className="absolute bottom-0 left-0 right-0 p-2 text-[10px] font-medium text-white leading-tight text-center">
                      {c.name}
                    </p>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* ── DID WE MAKE A MISTAKE? ──────────────────────────────── */}
      <section className="pb-10">
        <div className="max-w-5xl mx-auto px-5">
          <div className="rounded-2xl bg-[#111] border border-white/8 px-6 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <div>
              <p className="text-base font-normal text-white mb-1" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                {t('didWeMistake')}
              </p>
              <p className="text-sm text-gray-500 leading-relaxed">
                Submit a correction suggestion for <span className="text-gray-300">{celeb.name}</span> and help us fix it!
              </p>
            </div>
            <a
              href={`mailto:corrections@wealthexplorer.com?subject=Correction for ${encodeURIComponent(celeb.name)}`}
              className="flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-medium border border-[#c9a84c]/50 text-[#c9a84c] hover:bg-[#c9a84c]/10 transition-colors"
            >
              {t('submitSuggestion')}
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────── */}
      <footer className="border-t border-white/8 py-10 px-5">
        <div className="max-w-5xl mx-auto">
          {/* Top row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8">
            <WealthLogoSmall />
            <nav className="flex flex-wrap items-center gap-x-6 gap-y-2">
              {[
                { label: 'Home', to: '/' },
                { label: 'Trending', to: '/' },
                { label: 'About', to: '/' },
                { label: 'Contact', to: '/' },
              ].map(link => (
                <Link key={link.label} to={link.to} className="text-xs text-gray-500 hover:text-white transition-colors">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Disclaimer */}
          <p className="text-[11px] text-gray-700 leading-relaxed mb-6 max-w-3xl">
            All data sourced from public reports (Forbes, CelebrityNetWorth, Bloomberg, etc.). Net worth estimates are approximate. Gossip and controversies are based on public news and not verified. For informational purposes only — not financial advice.
          </p>

          {/* Bottom row */}
          <div className="border-t border-white/5 pt-5 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-[11px] text-gray-700">© 2026 Wealth Explorer · All rights reserved</p>
            <div className="flex items-center gap-5">
              {['Privacy Policy', 'Terms of Use', 'Corrections'].map(item => (
                <Link key={item} to="/" className="text-[11px] text-gray-600 hover:text-gray-400 transition-colors">
                  {item}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
