import { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Heart, MapPin, ChevronDown, ChevronUp, Bell, BellOff } from 'lucide-react'
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
    [t('height'), celeb.height],
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

// ── GOSSIP & CONTROVERSY — Card style ────────────────────────────────────────
function GossipSection({ celeb }: { celeb: NonNullable<typeof celebrities[number]> }) {
  const { t } = useLang()
  const items = celeb.gossip
  if (!items?.length) return null

  return (
    <div className="rounded-2xl overflow-hidden bg-[#111]">
      <div className="px-5 py-4 bg-[#161616] flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-white" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            {t('gossipControversy')}
          </h2>
          <p className="text-[11px] text-gray-600 mt-1">{t('gossipDisclaimer')}</p>
        </div>
        <span className="flex-shrink-0 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 mt-0.5">
          {items.length} {items.length === 1 ? 'item' : 'items'}
        </span>
      </div>
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {items.map((item, i) => (
          <div
            key={i}
            className="rounded-xl bg-[#161616] border border-white/8 p-5 hover:border-red-500/20 hover:bg-[#1a1414] transition-all duration-200"
          >
            <div className="flex items-start gap-2.5 mb-3">
              <span className="text-base leading-none mt-0.5 flex-shrink-0">🔥</span>
              <p className="text-sm font-semibold text-white leading-snug">{item.title}</p>
            </div>
            <p className="text-[13px] text-gray-500 leading-relaxed">{item.summary}</p>
          </div>
        ))}
      </div>
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
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={celeb.coverImage}
            alt=""
            className="w-full h-full object-cover opacity-10 blur-sm scale-105"
            aria-hidden
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/60 via-[#0a0a0a]/80 to-[#0a0a0a]" />
        </div>

        <div className="relative max-w-5xl mx-auto px-5 py-14 flex flex-col sm:flex-row gap-8 items-start sm:items-center">
          {/* Circle Avatar — always full color */}
          <div className="flex-shrink-0">
            <div
              className="w-36 h-36 sm:w-48 sm:h-48 rounded-full overflow-hidden shadow-2xl border-2"
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
            <div className="flex items-center gap-3 mb-3">
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

            <h1
              className="text-4xl sm:text-5xl font-normal text-white mb-2 leading-tight"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              {celeb.name}
            </h1>

            {/* Nationality — only shown here below the name */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl leading-none" title={celeb.nationality}>{getNationalityFlag(celeb.nationality)}</span>
              <span className="text-sm text-gray-400 uppercase tracking-widest">{celeb.nationality}</span>
            </div>

            <p className="text-gray-400 text-sm leading-relaxed mb-7 max-w-lg">
              {celeb.bio}
            </p>

            {/* Stats + Follow button */}
            <div className="flex flex-wrap items-end gap-x-8 gap-y-4">
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

              <button
                onClick={toggleFollow}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium border transition-all duration-200 ${
                  isFollowed
                    ? 'bg-[#c9a84c]/10 border-[#c9a84c]/50 text-[#c9a84c] hover:bg-[#c9a84c]/20'
                    : 'border-white/20 text-gray-300 hover:border-[#c9a84c]/40 hover:text-[#c9a84c]'
                }`}
              >
                {isFollowed ? <Bell size={14} className="fill-[#c9a84c]" /> : <BellOff size={14} />}
                {isFollowed ? t('following') : t('follow')}
              </button>
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

      {/* ── MORE PROFILES ───────────────────────────────────────── */}
      <section className="py-12">
        <div className="max-w-5xl mx-auto px-5">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-gray-500 mb-7">{t('moreProfiles')}</p>
          <div className="flex gap-5 overflow-x-auto scrollbar-hide pb-2">
            {[
              ...celebrities.filter(c => c.id !== celeb.id && c.category === celeb.category),
              ...celebrities.filter(c => c.id !== celeb.id && c.category !== celeb.category),
            ]
              .slice(0, 16)
              .map(c => (
                <Link
                  key={c.id}
                  to={`/celebrities/${c.id}`}
                  className="flex flex-col items-center gap-2.5 flex-shrink-0 group"
                >
                  <div className="w-16 h-16 rounded-full overflow-hidden group-hover:ring-2 group-hover:ring-[#c9a84c]/40 transition-all">
                    <img
                      src={getAvatar(c)}
                      alt={c.name}
                      className="w-full h-full object-cover object-top transition-all duration-300"
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
      <footer className="pt-16 pb-10 px-5 border-t border-white/8">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mb-10">
            <div>
              <p className="text-lg font-normal mb-3" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#c9a84c' }}>
                Wealth Explorer
              </p>
              <p className="text-xs text-gray-600 leading-relaxed mb-4">
                Explore the verified assets of the world's most notable individuals. Jets, yachts, estates, watches and more.
              </p>
              <p className="text-[11px] text-gray-700 leading-relaxed">
                Data updated daily from public sources – Wealth Explorer
              </p>
            </div>
            <div>
              <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-gray-500 mb-4">Explore</p>
              <ul className="space-y-2.5">
                {['Trending Profiles', 'All Celebrities', 'Asset Feed', 'Athletes', 'Musicians', 'Entrepreneurs'].map(item => (
                  <li key={item}>
                    <Link to="/" className="text-xs text-gray-500 hover:text-white transition-colors">{item}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-gray-500 mb-4">Asset Types</p>
              <ul className="space-y-2.5">
                {['Private Jets', 'Yachts', 'Real Estate', 'Cars', 'Watches', 'Art Collections'].map(item => (
                  <li key={item}>
                    <span className="text-xs text-gray-500">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-white/8 pt-6 mb-4">
            <p className="text-[11px] text-gray-700 leading-relaxed max-w-3xl">
              All data sourced from public reports (Forbes, CelebrityNetWorth, Bloomberg, etc.). Net worth estimates are approximate and may vary. Gossip and controversies based on public news; not verified. Images from public domain or fair-use sources. For informational purposes only — not financial advice.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-[11px] text-gray-700">© 2026 Wealth Explorer</p>
            <div className="flex items-center gap-4">
              {['About Us', 'Privacy Policy', 'Contact', 'Terms of Use'].map((item, i) => (
                <span key={item} className="flex items-center gap-4">
                  <Link to="/" className="text-[11px] text-gray-600 hover:text-gray-400 transition-colors">{item}</Link>
                  {i < 3 && <span className="text-gray-800">|</span>}
                </span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
