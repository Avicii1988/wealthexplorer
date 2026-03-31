import { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Heart, MapPin, ChevronDown, ChevronUp, Bell, BellOff, ArrowUp, ChevronLeft, ChevronRight } from 'lucide-react'
import {
  assetTypeIcons,
  assetTypeLabels,
  formatValue,
  formatNetWorth,
  getNationalityFlag,
  getAssetImage,
  DECEASED_IDS,
  type AssetType,
  type Asset,
  type Celebrity,
} from '../data/celebrities'
import { useCelebrities } from '../hooks/useCelebrityData'
import CelebrityAvatar from '../components/CelebrityAvatar'
import AssetImage from '../components/AssetImage'
import NotificationBell from '../components/NotificationBell'
import ThemeToggle from '../components/ThemeToggle'
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
    <div className="flex items-center gap-2.5">
      {/* Crown + W monogram — small version */}
      <svg width="30" height="27" viewBox="0 0 40 36" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
        <defs>
          <linearGradient id="logoGoldSm" x1="0" y1="0" x2="40" y2="36" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#f5e070"/>
            <stop offset="48%" stopColor="#c9a84c"/>
            <stop offset="100%" stopColor="#8a6218"/>
          </linearGradient>
          <linearGradient id="logoShineSm" x1="0" y1="0" x2="40" y2="36" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fff8d0" stopOpacity="0.6"/>
            <stop offset="100%" stopColor="#c9a84c" stopOpacity="0"/>
          </linearGradient>
        </defs>
        <rect x="1" y="24" width="38" height="7" rx="1.5" fill="url(#logoGoldSm)"/>
        <rect x="1" y="24" width="38" height="2.5" rx="1" fill="url(#logoShineSm)" opacity="0.55"/>
        <polygon points="1,24 1,8 10,17 20,2 30,17 39,8 39,24" fill="url(#logoGoldSm)"/>
        <polygon points="1,24 1,13 10,20 20,7 30,20 39,13 39,24" fill="url(#logoShineSm)" opacity="0.3"/>
        <polygon points="20,2 22.5,7 20,12 17.5,7" fill="#fff8d0" opacity="0.95"/>
        <line x1="1" y1="34.5" x2="39" y2="34.5" stroke="url(#logoGoldSm)" strokeWidth="0.4" opacity="0.5"/>
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <span style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          background: 'linear-gradient(135deg, #f5e070 0%, #c9a84c 48%, #8a6218 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          fontSize: '11px',
          letterSpacing: '0.35em',
          textTransform: 'uppercase' as const,
          fontWeight: 700,
          lineHeight: 1,
        }}>
          Wealth
        </span>
        <span style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          background: 'linear-gradient(135deg, #f5e070 0%, #c9a84c 48%, #8a6218 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          fontSize: '8px',
          letterSpacing: '0.42em',
          textTransform: 'uppercase' as const,
          fontWeight: 400,
          lineHeight: 1,
        }}>
          Explorer
        </span>
        <div style={{ height: '1px', marginTop: '2px', background: 'linear-gradient(90deg, rgba(201,168,76,0.7), rgba(201,168,76,0.25), transparent)' }} />
      </div>
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
function GlanceTable({ celeb }: { celeb: Celebrity }) {
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
  const { celebrities } = useCelebrities()
  const match = celebrities.find(c => c.name?.toLowerCase() === name.toLowerCase())
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

function RelationshipsSection({ celeb }: { celeb: Celebrity }) {
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
function GossipSection({ celeb }: { celeb: Celebrity }) {
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

// ── LIGHTBOX ──────────────────────────────────────────────────────────────────
function Lightbox({ photos, startIndex, onClose }: { photos: string[]; startIndex: number; onClose: () => void }) {
  const [idx, setIdx] = useState(startIndex)
  const prev = () => setIdx(i => (i - 1 + photos.length) % photos.length)
  const next = () => setIdx(i => (i + 1) % photos.length)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [photos.length])

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      <button className="absolute top-4 right-5 text-white/70 hover:text-white text-3xl leading-none" onClick={onClose}>✕</button>

      {photos.length > 1 && (
        <button className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-2" onClick={e => { e.stopPropagation(); prev() }}>
          <ChevronLeft size={36} />
        </button>
      )}

      <img
        src={photos[idx]}
        alt=""
        className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg shadow-2xl"
        onClick={e => e.stopPropagation()}
      />

      {photos.length > 1 && (
        <button className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-2" onClick={e => { e.stopPropagation(); next() }}>
          <ChevronRight size={36} />
        </button>
      )}

      {photos.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {photos.map((_, i) => (
            <button key={i} onClick={e => { e.stopPropagation(); setIdx(i) }}
              className={`w-2 h-2 rounded-full transition-all ${i === idx ? 'bg-[#c9a84c] scale-125' : 'bg-white/40'}`}
            />
          ))}
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
  const [lightboxOpen, setLightboxOpen] = useState(false)

  // Build the lightbox gallery: enriched images > legacy photos > primary only
  const primary = getAssetImage(asset)
  const extraSources: string[] = asset.images
    ? asset.images.filter(p => p && p !== primary)
    : (asset.photos?.filter(p => p && p !== primary) ?? [])
  const lightboxPhotos = [primary, ...extraSources]
    .filter(Boolean).slice(0, 3) as string[]
  const hasMultiple = lightboxPhotos.length > 1

  return (
    <>
      {lightboxOpen && (
        <Lightbox photos={lightboxPhotos} startIndex={0} onClose={() => setLightboxOpen(false)} />
      )}
      <article className="bg-[#111] rounded-2xl overflow-hidden group hover:bg-[#161616] transition-colors duration-300">

        {/* ── Single image — 16:9, object-cover, click for lightbox ── */}
        <div
          className={`relative aspect-video overflow-hidden bg-[#1a1a1a] ${hasMultiple ? 'cursor-zoom-in' : ''}`}
          onClick={() => hasMultiple && setLightboxOpen(true)}
        >
          <AssetImage
            asset={asset}
            className="group-hover:scale-105 transition-transform duration-700 ease-out"
          />

          {/* Type badge + NEW + value */}
          <div className="absolute top-4 left-4 right-4 flex items-start justify-between pointer-events-none">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-medium tracking-widest uppercase px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm" style={{ color: '#fff' }}>
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

          {/* Photo count hint — only when lightbox has extra images */}
          {hasMultiple && (
            <div className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm pointer-events-none">
              <span className="text-[10px] text-gray-300">+{lightboxPhotos.length - 1} photos</span>
            </div>
          )}
        </div>

        {/* ── Content ── */}
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
    </>
  )
}

// ── ASSETS SECTION ────────────────────────────────────────────────────────────
function AssetsSection({ celeb }: { celeb: Celebrity }) {
  const { t } = useLang()
  const [activeType, setActiveType] = useState<AssetType | typeof ALL>(ALL)

  const safeAssets = (celeb.assets ?? []).filter(a => a.id && a.type)
  const assetTypes = Array.from(new Set(safeAssets.map(a => a.type))) as AssetType[]
  const tabs: (AssetType | typeof ALL)[] = [ALL, ...assetTypes]
  const filtered = (activeType === ALL ? safeAssets : safeAssets.filter(a => a.type === activeType))
    .slice().sort((a, b) => (b.estimatedValue ?? 0) - (a.estimatedValue ?? 0))

  return (
    <div className="rounded-2xl overflow-hidden bg-[#111]">
      <div className="px-5 py-4 bg-[#161616] flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-white" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
          {t('assets')}
        </h2>
        <span className="text-[11px] text-gray-600">{safeAssets.length} total</span>
      </div>

      {assetTypes.length > 1 && (
        <div className="flex items-center gap-2 flex-wrap px-4 py-3 border-b border-white/5 bg-[#111]">
          {tabs.map(type => {
            const count = type === ALL ? safeAssets.length : safeAssets.filter(a => a.type === type).length
            const isActive = activeType === type
            return (
              <button
                key={type}
                onClick={() => setActiveType(type)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium rounded-full border transition-all duration-200 whitespace-nowrap ${
                  isActive
                    ? 'bg-[#c9a84c]/15 border-[#c9a84c]/50 text-[#c9a84c]'
                    : 'bg-white/4 border-white/8 text-gray-500 hover:text-gray-300 hover:border-white/16 hover:bg-white/8'
                }`}
              >
                {type !== ALL && <span className="text-sm leading-none">{assetTypeIcons[type]}</span>}
                <span>{type === ALL ? t('allAssets') : assetTypeLabels[type]}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${isActive ? 'bg-[#c9a84c]/25 text-[#c9a84c]' : 'bg-white/8 text-gray-600'}`}>
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

// ── MORE PROFILES — content-width carousel with arrow navigation ───────────────
function MoreProfilesCarousel({ pool }: { pool: Celebrity[] }) {
  const { t } = useLang()
  const trackRef = useRef<HTMLDivElement>(null)
  const touchStartX = useRef(0)
  const touchScrollLeft = useRef(0)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const CARD_W = 104  // card width px
  const STEP = (CARD_W + 12) * 4  // scroll 4 cards at a time

  const updateArrows = () => {
    const el = trackRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 4)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4)
  }

  const scrollBy = (dir: 1 | -1) => {
    const el = trackRef.current
    if (!el) return
    el.scrollBy({ left: dir * STEP, behavior: 'smooth' })
    setTimeout(updateArrows, 350)
  }

  return (
    <section className="py-10">
      <div className="max-w-5xl mx-auto px-5">
        {/* Header row — label + arrows */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-gray-500">{t('moreProfiles')}</p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => scrollBy(-1)}
              disabled={!canScrollLeft}
              aria-label="Scroll left"
              className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-200 ${
                canScrollLeft
                  ? 'border-[#c9a84c]/40 text-[#c9a84c] hover:bg-[#c9a84c]/10 hover:border-[#c9a84c]/60'
                  : 'border-white/8 text-gray-700 cursor-not-allowed'
              }`}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 11L5 7l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <button
              onClick={() => scrollBy(1)}
              disabled={!canScrollRight}
              aria-label="Scroll right"
              className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-200 ${
                canScrollRight
                  ? 'border-[#c9a84c]/40 text-[#c9a84c] hover:bg-[#c9a84c]/10 hover:border-[#c9a84c]/60'
                  : 'border-white/8 text-gray-700 cursor-not-allowed'
              }`}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
        </div>

        {/* Scrollable track — no fade, content-constrained */}
        <div
          ref={trackRef}
          className="flex gap-3 overflow-x-auto scrollbar-hide"
          style={{ cursor: 'grab', touchAction: 'pan-x' }}
          onScroll={updateArrows}
          onTouchStart={e => {
            touchStartX.current = e.touches[0].clientX
            touchScrollLeft.current = trackRef.current?.scrollLeft ?? 0
          }}
          onTouchMove={e => {
            if (!trackRef.current) return
            const delta = touchStartX.current - e.touches[0].clientX
            trackRef.current.scrollLeft = touchScrollLeft.current + delta
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
              <div className="relative bg-[#111] rounded-2xl border border-gray-800 group-hover:border-[#c9a84c]/40 group-hover:shadow-[0_0_18px_rgba(201,168,76,0.13)] transition-all duration-300 group-hover:bg-[#131107] flex flex-col items-center text-center pt-4 pb-3 px-2 gap-2 h-[136px]">
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{ background: 'linear-gradient(135deg, rgba(201,168,76,0.07) 0%, rgba(201,168,76,0.01) 50%, rgba(201,168,76,0.05) 100%)' }}
                />
                <div className="rounded-full overflow-hidden border-2 border-gray-700 group-hover:border-[#c9a84c]/60 group-hover:shadow-[0_0_10px_rgba(201,168,76,0.3)] transition-all duration-300 flex-shrink-0" style={{ width: 56, height: 56 }}>
                  <CelebrityAvatar celeb={c} size={56} />
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
      </div>
    </section>
  )
}

// ── PROFILE PAGE ──────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { t } = useLang()
  const { celebrities, loading } = useCelebrities()
  const [followed, setFollowed] = useState<Set<string>>(getFollowed)

  // Scroll to top whenever the profile changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <p className="text-gray-500 text-sm tracking-widest uppercase">Loading celebrities…</p>
      </div>
    )
  }

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

  const totalValue = (celeb.assets ?? []).reduce((s, a) => s + (a.estimatedValue ?? 0), 0)
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
      <header className="sticky top-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-md border-b" style={{ borderBottomColor: 'rgba(201,168,76,0.18)' }}>
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
            <ThemeToggle />
            <LanguageSelector />
          </div>
        </div>
      </header>

      {/* ── HERO ────────────────────────────────────────────────── */}
      <section className="relative" data-hero-dark>
        {/* Mobile: full-width portrait image */}
        <div className="sm:hidden w-full relative overflow-hidden" style={{ aspectRatio: '3/4', maxHeight: '70vh' }}>
          <CelebrityAvatar celeb={celeb} size={400} />
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
              <span className="text-[10px] tracking-widest uppercase px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm" style={{ color: '#fff' }}>
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
              <CelebrityAvatar celeb={celeb} size={192} />
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
                  {(celeb.assets ?? []).length}
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
        {(celeb.assets ?? []).filter(a => a.id && a.type).length > 0 && <AssetsSection key={celeb.id} celeb={celeb} />}
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
      <footer className="py-14 px-5" style={{ borderTop: '1px solid rgba(201,168,76,0.18)' }}>
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
