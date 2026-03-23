import { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Heart, MapPin, ChevronDown, ChevronUp, Bell, BellOff, ArrowUp, ChevronLeft, ChevronRight } from 'lucide-react'
import {
  celebrities,
  assetTypeIcons,
  assetTypeLabels,
  formatValue,
  formatNetWorth,
  getNationalityFlag,
  getAvatar,
  getAssetImage,
  DECEASED_IDS,
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

function WealthLogoSmall() {
  return (
    <div className="flex items-center gap-2">
      <span style={{ fontSize: '20px', lineHeight: 1, color: '#c9a84c' }}>◆</span>
      <span style={{
        fontFamily: "'Playfair Display', Georgia, serif",
        color: '#c9a84c',
        fontSize: '11px',
        letterSpacing: '0.28em',
        textTransform: 'uppercase' as const,
        fontWeight: 400,
        lineHeight: 1,
        textShadow: '0 0 16px rgba(201,168,76,0.3)',
      }}>
        Wealth Explorer
      </span>
    </div>
  )
}

// ── SCROLL TO TOP BUTTON (mobile only) ────────────────────────────────────────
function ScrollToTopButton() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    function onScroll() { setVisible(window.scrollY > 400) }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Scroll to top"
      className={`fixed bottom-6 right-5 z-50 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
      style={{ background: 'rgba(10,10,10,0.85)', border: '1px solid rgba(201,168,76,0.45)', backdropFilter: 'blur(10px)', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}
    >
      <ArrowUp size={16} style={{ color: '#c9a84c' }} />
    </button>
  )
}

// Calculate age from a birthdate string like "May 5, 1988"
function calcAge(birthdate: string): number | null {
  const d = new Date(birthdate)
  if (isNaN(d.getTime())) return null
  const today = new Date()
  let age = today.getFullYear() - d.getFullYear()
  const m = today.getMonth() - d.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < d.getDate())) age--
  return age
}

function formatBirthdate(birthdate: string, isDeceased: boolean): string {
  if (isDeceased) return birthdate
  const age = calcAge(birthdate)
  if (age === null || age < 0 || age > 120) return birthdate
  return `${birthdate} (${age} years old)`
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
  const isDeceased = DECEASED_IDS.has(celeb.id)

  const leftCol: [string, string][] = [
    [t('category'), celeb.category],
    [t('netWorth'), formatNetWorth(celeb.netWorth)],
    [t('birthday'), formatBirthdate(celeb.birthdate, isDeceased)],
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
// Link to a celeb profile if this name matches one in the database
function CelebName({ name }: { name: string }) {
  const match = celebrities.find(c => c.name.toLowerCase() === name.toLowerCase())
  if (match) {
    return (
      <Link
        to={`/celebrities/${match.id}`}
        className="inline-flex items-center gap-1 hover:underline"
        style={{ color: '#c9a84c' }}
      >
        {name}
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="opacity-60">
          <path d="M2 2h6v6M8 2 2 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        </svg>
      </Link>
    )
  }
  return <span className="text-gray-200">{name}</span>
}

function NameList({ names }: { names: string[] }) {
  return (
    <span className="flex flex-wrap gap-x-3 gap-y-1">
      {names.map((name, i) => (
        <span key={name} className="flex items-center gap-1">
          <CelebName name={name} />
          {i < names.length - 1 && <span className="text-gray-700">·</span>}
        </span>
      ))}
    </span>
  )
}

function RelationshipsSection({ celeb }: { celeb: NonNullable<typeof celebrities[number]> }) {
  const { t } = useLang()
  const r = celeb.relationships
  if (!r) return null

  type Row = { label: string; names: string[] }
  const rows: Row[] = [
    ...(r.parents?.length ? [{ label: 'Parents', names: r.parents }] : []),
    ...(r.spouse ? [{ label: 'Spouse', names: [r.spouse] }] : []),
    ...(r.fiancé ? [{ label: 'Fiancé/Fiancée', names: [r.fiancé] }] : []),
    ...(r.exSpouse?.length ? [{ label: 'Ex-Spouse', names: r.exSpouse }] : []),
    ...(r.partner ? [{ label: 'Partner', names: [r.partner] }] : []),
    ...(r.exPartner?.length ? [{ label: 'Ex-Partner', names: r.exPartner }] : []),
    ...(r.siblings?.length ? [{ label: 'Siblings', names: r.siblings }] : []),
    ...(r.children?.length ? [{ label: 'Children', names: r.children }] : []),
    ...(r.grandchildren?.length ? [{ label: 'Grandchildren', names: r.grandchildren }] : []),
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
          {rows.map(({ label, names }, i) => (
            <tr key={label} className={i % 2 === 0 ? 'bg-[#111]' : 'bg-[#131313]'}>
              <td className="px-5 py-3.5 text-gray-500 font-medium whitespace-nowrap w-28 sm:w-36 align-top">{label}</td>
              <td className="px-5 py-3.5 text-gray-200 leading-relaxed">
                <NameList names={names} />
              </td>
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
  const allItems = celeb.gossip
  if (!allItems?.length) return null

  const gossipItems = allItems.filter(g => !g.type || g.type === 'gossip')
  const controversyItems = allItems.filter(g => g.type === 'controversy')

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
            <span className="text-[10px] text-gray-700 italic">Based on public news · not verified</span>
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
            <span className="text-[10px] text-gray-700 italic">Based on public news · not verified</span>
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
            src={getAssetImage(asset)}
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
  const filtered = (activeType === ALL ? celeb.assets : celeb.assets.filter(a => a.type === activeType))
    .slice().sort((a, b) => b.estimatedValue - a.estimatedValue)

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

// ── WEALTHSCAPE RADAR ─────────────────────────────────────────────────────────
const RADAR_AXES: { label: string; types: AssetType[]; icon: string }[] = [
  { label: 'Real Estate', types: ['real_estate', 'island'],     icon: '🏛️' },
  { label: 'Aviation',    types: ['jet', 'helicopter'],         icon: '✈️' },
  { label: 'Marine',      types: ['yacht'],                     icon: '⛵' },
  { label: 'Automotive',  types: ['car'],                       icon: '🚗' },
  { label: 'Collectibles',types: ['watch', 'art'],              icon: '💎' },
  { label: 'Enterprise',  types: ['sports_team', 'rocket'],     icon: '🏆' },
]

function WealthscapeRadar({ celeb }: { celeb: NonNullable<typeof celebrities[number]> }) {
  if (celeb.assets.length === 0) return null

  const values = RADAR_AXES.map(axis =>
    celeb.assets
      .filter(a => axis.types.includes(a.type as AssetType))
      .reduce((s, a) => s + a.estimatedValue, 0)
  )

  const maxVal = Math.max(...values)
  if (maxVal === 0) return null

  const norm = values.map(v => v / maxVal)

  const N = RADAR_AXES.length
  const CX = 120, CY = 120, R = 92

  function point(i: number, r: number): [number, number] {
    const angle = (2 * Math.PI * i) / N - Math.PI / 2
    return [CX + r * Math.cos(angle), CY + r * Math.sin(angle)]
  }

  function toPath(pts: [number, number][]) {
    return pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(2)},${p[1].toFixed(2)}`).join(' ') + ' Z'
  }

  const gridLevels = [0.25, 0.5, 0.75, 1]
  const dataPath = toPath(norm.map((v, i) => point(i, v * R)))
  const outerPts = RADAR_AXES.map((_, i) => point(i, R))

  return (
    <div className="rounded-2xl overflow-hidden bg-[#111]">
      <div className="px-5 py-4 bg-[#161616]">
        <h2 className="text-base font-semibold text-white" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
          WealthScape Radar
        </h2>
        <p className="text-[11px] text-gray-600 mt-0.5">Asset portfolio distribution across wealth categories</p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6 px-5 py-6">
        {/* SVG Radar */}
        <div className="flex-shrink-0 relative" style={{ width: 240, height: 240 }}>
          <svg width={240} height={240} viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="radarFill" cx="50%" cy="50%" r="50%">
                <stop offset="0%"   stopColor="#c9a84c" stopOpacity="0.30" />
                <stop offset="100%" stopColor="#c9a84c" stopOpacity="0.06" />
              </radialGradient>
              <filter id="radarGlow">
                <feGaussianBlur stdDeviation="2.5" result="blur" />
                <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
            </defs>

            {/* Grid rings */}
            {gridLevels.map(level => (
              <polygon
                key={level}
                points={RADAR_AXES.map((_, i) => { const [x,y] = point(i, level * R); return `${x.toFixed(2)},${y.toFixed(2)}` }).join(' ')}
                fill="none"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="1"
              />
            ))}

            {/* Axis lines */}
            {outerPts.map(([x, y], i) => (
              <line key={i} x1={CX} y1={CY} x2={x.toFixed(2)} y2={y.toFixed(2)}
                stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
            ))}

            {/* Data fill */}
            <path d={dataPath} fill="url(#radarFill)" />

            {/* Data stroke with glow */}
            <path d={dataPath} fill="none" stroke="#c9a84c" strokeWidth="1.8"
              strokeLinejoin="round" filter="url(#radarGlow)"
              style={{ opacity: 0.9 }} />

            {/* Data point dots */}
            {norm.map((v, i) => {
              const [x, y] = point(i, v * R)
              return (
                <circle key={i} cx={x.toFixed(2)} cy={y.toFixed(2)} r="3.5"
                  fill="#c9a84c" stroke="#0a0a0a" strokeWidth="1.5" />
              )
            })}

            {/* Axis icon labels outside chart */}
            {RADAR_AXES.map((axis, i) => {
              const [x, y] = point(i, R + 22)
              return (
                <text key={i} x={x.toFixed(2)} y={y.toFixed(2)}
                  textAnchor="middle" dominantBaseline="middle"
                  fontSize="16" style={{ userSelect: 'none' }}>
                  {axis.icon}
                </text>
              )
            })}
          </svg>
        </div>

        {/* Legend */}
        <div className="flex-1 w-full grid grid-cols-2 gap-x-6 gap-y-3">
          {RADAR_AXES.map((axis, i) => {
            const val = values[i]
            const pct = maxVal > 0 ? Math.round((val / maxVal) * 100) : 0
            const count = celeb.assets.filter(a => axis.types.includes(a.type as AssetType)).length
            return (
              <div key={axis.label} className="flex flex-col gap-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-gray-400 flex items-center gap-1.5">
                    <span className="text-sm leading-none">{axis.icon}</span>
                    {axis.label}
                  </span>
                  <span className="text-[10px] tabular-nums" style={{ color: pct > 0 ? '#c9a84c' : '#444' }}>
                    {pct}%
                  </span>
                </div>
                <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${pct}%`,
                      background: pct > 0
                        ? 'linear-gradient(90deg, rgba(201,168,76,0.5), #c9a84c)'
                        : 'transparent',
                    }}
                  />
                </div>
                {count > 0 && (
                  <p className="text-[10px] text-gray-700">{count} {count === 1 ? 'asset' : 'assets'}</p>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ── MORE PROFILES — static scrollable carousel ────────────────────────────────
function MoreProfilesCarousel({ pool }: { pool: NonNullable<typeof celebrities[number]>[] }) {
  const { t } = useLang()
  const trackRef = useRef<HTMLDivElement>(null)
  const touchStartX = useRef(0)
  const touchScrollLeft = useRef(0)
  const CARD_W = 96   // card width px
  const CARD_GAP = 12 // gap-3
  const STEP = (CARD_W + CARD_GAP) * 4 // scroll 4 cards at a time

  function canScrollLeft() {
    return (trackRef.current?.scrollLeft ?? 0) > 4
  }
  function canScrollRight() {
    const el = trackRef.current
    if (!el) return false
    return el.scrollLeft + el.clientWidth < el.scrollWidth - 4
  }

  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)

  function updateBounds() {
    setAtStart(!canScrollLeft())
    setAtEnd(!canScrollRight())
  }

  function scrollBy(dir: -1 | 1) {
    trackRef.current?.scrollBy({ left: dir * STEP, behavior: 'smooth' })
  }

  return (
    <section className="py-12 relative overflow-hidden">
      {/* Header row with label + nav buttons */}
      <div className="max-w-5xl mx-auto px-5 mb-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-gray-500">{t('moreProfiles')}</p>
          {/* Subtle scroll hint */}
          <div className="flex items-center gap-0.5 opacity-40">
            <ChevronLeft size={10} className="text-gray-500" />
            <ChevronRight size={10} className="text-gray-500" />
          </div>
        </div>
        {/* Prev / Next buttons */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => scrollBy(-1)}
            disabled={atStart}
            aria-label="Scroll left"
            className="w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-200 disabled:opacity-25 disabled:cursor-not-allowed"
            style={{ borderColor: 'rgba(201,168,76,0.35)', color: '#c9a84c', background: 'rgba(201,168,76,0.06)' }}
          >
            <ChevronLeft size={14} />
          </button>
          <button
            onClick={() => scrollBy(1)}
            disabled={atEnd}
            aria-label="Scroll right"
            className="w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-200 disabled:opacity-25 disabled:cursor-not-allowed"
            style={{ borderColor: 'rgba(201,168,76,0.35)', color: '#c9a84c', background: 'rgba(201,168,76,0.06)' }}
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Fade overlays on edges */}
      <div className="absolute inset-y-0 left-0 pointer-events-none z-10"
        style={{ width: 'calc((100% - min(100%, 1024px)) / 2 + 40px)', background: 'linear-gradient(to right, #0a0a0a 40%, transparent)' }}
      />
      <div className="absolute inset-y-0 right-0 pointer-events-none z-10"
        style={{ width: 'calc((100% - min(100%, 1024px)) / 2 + 40px)', background: 'linear-gradient(to left, #0a0a0a 40%, transparent)' }}
      />

      {/* Scrollable track — no animation, user-controlled */}
      <div
        ref={trackRef}
        onScroll={updateBounds}
        className="flex gap-3 overflow-x-auto scrollbar-hide"
        style={{ paddingLeft: '20px', paddingRight: '20px', cursor: 'grab', touchAction: 'pan-x' }}
        onTouchStart={e => {
          touchStartX.current = e.touches[0].clientX
          touchScrollLeft.current = trackRef.current?.scrollLeft ?? 0
        }}
        onTouchMove={e => {
          if (!trackRef.current) return
          const delta = touchStartX.current - e.touches[0].clientX
          trackRef.current.scrollLeft = touchScrollLeft.current + delta
          updateBounds()
        }}
        onMouseDown={e => {
          const el = e.currentTarget
          el.style.cursor = 'grabbing'
          const startX = e.pageX - el.scrollLeft
          const onMove = (ev: MouseEvent) => { el.scrollLeft = ev.pageX - startX }
          const onUp = () => {
            el.style.cursor = 'grab'
            window.removeEventListener('mousemove', onMove)
            window.removeEventListener('mouseup', onUp)
          }
          window.addEventListener('mousemove', onMove)
          window.addEventListener('mouseup', onUp)
        }}
      >
        {pool.map(c => (
          <Link key={c.id} to={`/celebrities/${c.id}`} className="group flex-shrink-0" style={{ width: CARD_W }}>
            <div className="relative bg-[#111] rounded-2xl border border-gray-800 group-hover:border-[#c9a84c]/40 group-hover:shadow-[0_0_18px_rgba(201,168,76,0.13)] transition-all duration-300 group-hover:bg-[#131107] flex flex-col items-center text-center pt-4 pb-3 px-2 gap-2">
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ background: 'linear-gradient(135deg, rgba(201,168,76,0.07) 0%, rgba(201,168,76,0.01) 50%, rgba(201,168,76,0.05) 100%)' }}
              />
              <div className="rounded-full overflow-hidden border-2 border-gray-700 group-hover:border-[#c9a84c]/60 group-hover:shadow-[0_0_10px_rgba(201,168,76,0.3)] transition-all duration-300 flex-shrink-0" style={{ width: 52, height: 52 }}>
                <img
                  src={getAvatar(c)}
                  alt={c.name}
                  className="w-full h-full object-cover"
                  style={{ objectPosition: 'center 15%' }}
                  onError={e => {
                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&background=1a1a1a&color=c9a84c&size=200&bold=true`
                  }}
                />
              </div>
              <div className="w-full">
                <p className="text-[10px] font-semibold text-white group-hover:text-[#c9a84c] transition-colors leading-tight line-clamp-2">
                  {c.name}{DECEASED_IDS.has(c.id) && <span className="text-gray-600"> (†)</span>}
                </p>
                <p className="text-[9px] mt-0.5" style={{ color: '#c9a84c' }}>{formatNetWorth(c.netWorth)}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

// ── PROFILE PAGE ──────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { t } = useLang()
  const [avatarError, setAvatarError] = useState(false)
  const [followed, setFollowed] = useState<Set<string>>(getFollowed)

  // Scroll to top and reset per-profile UI state whenever the profile changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    setAvatarError(false)
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
    // Notify NotificationBell in same tab
    window.dispatchEvent(new Event('we_follow_change'))
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">

      {/* ── HEADER ──────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/8">
        <div className="max-w-5xl mx-auto px-5 h-14 flex items-center justify-between gap-4">
          <Link
            to="/"
            onClick={() => window.scrollTo(0, 0)}
            className="flex items-center gap-2.5 text-gray-400 hover:text-white transition-colors group flex-shrink-0"
          >
            <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
            <WealthLogoSmall />
          </Link>

          <div className="flex items-center gap-3">
            <NotificationBell />
            <LanguageSelector />
          </div>
        </div>
      </header>

      {/* ── HERO ────────────────────────────────────────────────── */}
      <section className="relative">
        {/* Mobile: full-width portrait image */}
        <div className="sm:hidden w-full relative overflow-hidden" style={{ aspectRatio: '3/4', maxHeight: '70vh' }}>
          <img
            src={avatarError ? fallbackAvatar : getAvatar(celeb)}
            alt={celeb.name}
            className="w-full h-full object-cover"
            style={{ objectPosition: 'center 15%' }}
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

        {/* Desktop: subtle dark gradient background */}
        <div className="hidden sm:block absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#111]/60 via-[#0a0a0a]/90 to-[#0a0a0a]" />
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
                className="w-full h-full object-cover"
                style={{ objectPosition: 'center 15%' }}
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
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h1
                className="text-3xl sm:text-5xl font-normal text-white leading-tight flex-1 min-w-0"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                {celeb.name}{DECEASED_IDS.has(celeb.id) && <span className="text-gray-500 text-2xl sm:text-3xl ml-2 align-middle"> (†)</span>}
              </h1>
              <button
                onClick={toggleFollow}
                className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium border transition-all duration-200 ${
                  isFollowed
                    ? 'bg-[#c9a84c]/10 border-[#c9a84c]/50 text-[#c9a84c] hover:bg-[#c9a84c]/20'
                    : 'border-white/20 text-gray-300 hover:border-[#c9a84c]/40 hover:text-[#c9a84c]'
                }`}
              >
                {isFollowed ? <Bell size={12} className="fill-[#c9a84c]" /> : <BellOff size={12} />}
                <span>{isFollowed ? t('following') : t('follow')}</span>
              </button>
            </div>

            {/* Nationality */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg leading-none" title={celeb.nationality}>{getNationalityFlag(celeb.nationality)}</span>
              <span className="text-sm text-gray-400 uppercase tracking-widest">{celeb.nationality}</span>
            </div>

            <p className="text-gray-400 text-sm leading-relaxed mb-3 max-w-lg">
              {celeb.bio}
            </p>
            <p className="text-[11px] text-gray-600 mb-7">
              {(() => {
                const raw = celeb.lastUpdated ?? '2026-03-20'
                const d = new Date(raw)
                return `Updated ${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
              })()}
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
        <WealthscapeRadar celeb={celeb} />
        <RelationshipsSection celeb={celeb} />
        <GossipSection celeb={celeb} />
        {celeb.assets.length > 0 && <AssetsSection key={celeb.id} celeb={celeb} />}
      </main>

      {/* ── MORE PROFILES — static scrollable carousel ──────────────── */}
      {(() => {
        const pool = [
          ...celebrities.filter(c => c.id !== celeb.id && c.category === celeb.category),
          ...celebrities.filter(c => c.id !== celeb.id && c.category !== celeb.category),
        ].slice(0, 48)

        return <MoreProfilesCarousel pool={pool} />
      })()}

      {/* ── DID WE MAKE A MISTAKE? ──────────────────────────────── */}
      <section className="pt-6 pb-10">
        <div className="max-w-5xl mx-auto px-5 flex flex-col gap-4">
          <div className="rounded-2xl bg-[#111] border border-[#2a2a2a] px-6 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
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
              className="self-center sm:flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-medium border border-[#c9a84c]/50 text-[#c9a84c] hover:bg-[#c9a84c]/10 transition-colors"
            >
              {t('submitSuggestion')}
            </a>
          </div>

        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────── */}
      <footer className="py-14 px-5" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="max-w-2xl mx-auto text-center">

          {/* Logo */}
          <div className="flex justify-center mb-5">
            <Link to="/" onClick={() => window.scrollTo(0, 0)}><WealthLogoSmall /></Link>
          </div>

          {/* Tagline */}
          <p className="text-[11px] text-white/60 mb-6 tracking-wide">
            Data updated daily from public sources
          </p>

          {/* Thin gold divider */}
          <div className="w-12 h-px mx-auto mb-6" style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.35), transparent)' }} />

          {/* Disclaimer */}
          <p className="text-[11px] text-white/40 leading-relaxed mb-6 max-w-xl mx-auto">
            All data sourced from public reports (Forbes, Celebrity News, Bloomberg, etc.). Net worth estimates are approximate and may vary.
            Gossip and controversies based on public news; not verified. Images from public domain or fair-use sources.
            For informational purposes only — not financial advice.
          </p>

          {/* Nav links */}
          <nav className="flex items-center justify-center flex-wrap gap-x-5 gap-y-2 mb-7">
            {[
              { label: 'About Us', to: '/about' },
              { label: 'Privacy Policy', to: '/terms' },
              { label: 'Contact', to: '/about' },
              { label: 'Terms of Use', to: '/terms' },
            ].map((link, i, arr) => (
              <span key={link.label} className="flex items-center gap-5">
                <Link to={link.to} className="text-[11px] text-white hover:text-[#c9a84c] transition-colors font-medium tracking-wide">
                  {link.label}
                </Link>
                {i < arr.length - 1 && <span className="text-white/25 text-[11px]">|</span>}
              </span>
            ))}
          </nav>

          {/* Copyright */}
          <p className="text-[10px] text-white/30 tracking-wide">
            © 2026 Wealth Explorer
          </p>
        </div>
      </footer>

      <ScrollToTopButton />
    </div>
  )
}
