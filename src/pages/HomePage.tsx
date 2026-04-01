import { useState, useMemo, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, ChevronDown, ChevronUp, X } from 'lucide-react'
import {
  categories,
  assetTypeLabels,
  type Category,
  type Asset,
  type AssetType,
  type Celebrity,
  assetTypeIcons,
  formatValue,
  formatNetWorth,
  getAssetImage,
  getAvatar,
  DECEASED_IDS,
} from '../data/celebrities'
import { useCelebrities } from '../hooks/useCelebrityData'
import CelebrityAvatar from '../components/CelebrityAvatar'
import NotificationBell from '../components/NotificationBell'
import ThemeToggle from '../components/ThemeToggle'
import { LANGUAGES, useLang } from '../i18n'

type FeedItem = Asset & { ownerName: string; ownerId: string }

const LETTER_VISIBLE = 11

// ── A-Z PROFILE DIRECTORY ─────────────────────────────────────────────────────
function ProfileDirectory({ filteredCelebs }: { filteredCelebs: Celebrity[] }) {
  const { t } = useLang()
  const letterRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const [expandedLetters, setExpandedLetters] = useState<Set<string>>(new Set())

  const sorted = useMemo(
    () => [...filteredCelebs].sort((a, b) => (a.name ?? '').localeCompare(b.name ?? '')),
    [filteredCelebs]
  )

  const grouped = useMemo(() => {
    const map: Record<string, Celebrity[]> = {}
    for (const c of sorted) {
      const letter = (c.name ?? '#')[0].toUpperCase()
      if (!map[letter]) map[letter] = []
      map[letter].push(c)
    }
    return map
  }, [sorted])

  const presentLetters = Object.keys(grouped).sort()
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

  function scrollToLetter(letter: string) {
    letterRefs.current[letter]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section className="border-t border-white/8 py-14 max-w-5xl mx-auto px-5">
      <div className="flex items-center justify-between mb-8">
        <p className="text-xs font-semibold tracking-[0.25em] text-gray-500 uppercase">
          {t('profiles')}
        </p>
        <p className="text-xs text-gray-700">{sorted.length} profiles · A–Z</p>
      </div>

      {/* A-Z letter bar */}
      <div className="sticky top-[57px] z-30 bg-[#0a0a0a]/95 backdrop-blur-sm -mx-5 px-5 py-2.5 mb-8 border-b border-white/5">
        <div className="flex items-center justify-between w-full">
          {alphabet.map(letter => {
            const hasProfiles = !!grouped[letter]
            return (
              <button
                key={letter}
                onClick={() => hasProfiles && scrollToLetter(letter)}
                disabled={!hasProfiles}
                className={`flex-1 h-7 rounded-lg text-xs font-semibold flex items-center justify-center transition-all ${
                  hasProfiles
                    ? 'text-[#c9a84c] hover:bg-[#c9a84c]/15 cursor-pointer'
                    : 'text-gray-800 cursor-default'
                }`}
              >
                {letter}
              </button>
            )
          })}
        </div>
      </div>

      {/* Grouped profiles */}
      <div className="space-y-10">
        {presentLetters.map(letter => {
          const all = grouped[letter]
          const isExpanded = expandedLetters.has(letter)
          const showAll = isExpanded || all.length <= LETTER_VISIBLE
          const celebsToShow = showAll ? all : all.slice(0, LETTER_VISIBLE)
          const remaining = all.length - LETTER_VISIBLE

          return (
            <div key={letter} ref={el => { letterRefs.current[letter] = el }}>
              <div className="flex items-center gap-4 mb-5">
                <span
                  className="text-3xl font-semibold leading-none"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#c9a84c' }}
                >
                  {letter}
                </span>
                <div className="flex-1 h-px bg-white/6" />
                <span className="text-[10px] text-gray-700">{all.length}</span>
                {!showAll && remaining > 0 && (
                  <button
                    onClick={() => setExpandedLetters(prev => new Set([...prev, letter]))}
                    className="text-[10px] text-gray-500 hover:text-[#c9a84c] transition-colors border border-white/8 hover:border-[#c9a84c]/30 rounded-full px-2.5 py-1 leading-none"
                  >
                    Show all {all.length}
                  </button>
                )}
                {isExpanded && (
                  <button
                    onClick={() => setExpandedLetters(prev => { const s = new Set(prev); s.delete(letter); return s })}
                    className="text-[10px] text-gray-500 hover:text-[#c9a84c] transition-colors border border-white/8 hover:border-[#c9a84c]/30 rounded-full px-2.5 py-1 leading-none"
                  >
                    Collapse
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {celebsToShow.map(celeb => {
                  const isWithin24h = (d?: string) => !!d && (Date.now() - new Date(d).getTime() < 86_400_000)
                  const showNewBadge = isWithin24h(celeb.isNew) || (celeb.assets ?? []).some(a => a.isNew)
                  return (
                    <Link key={celeb.id} to={`/celebrities/${celeb.id}`} className="group">
                      <div className="relative bg-[#111] rounded-2xl border border-gray-800 group-hover:border-[#c9a84c]/40 group-hover:shadow-[0_0_22px_rgba(201,168,76,0.13)] transition-all duration-300 overflow-hidden aspect-[3/4]">
                        {/* Photo fills the entire card */}
                        <CelebrityAvatar
                          celeb={celeb}
                          size={200}
                          className="absolute inset-0 group-hover:scale-105 transition-transform duration-700 ease-out"
                        />

                        {/* Gradient scrim so text is legible over the photo */}
                        <div className="absolute inset-x-0 bottom-0 h-2/5 pointer-events-none"
                          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)' }}
                        />

                        {/* Gold shimmer overlay on hover */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                          style={{ background: 'linear-gradient(180deg, rgba(201,168,76,0.06) 0%, transparent 50%)' }}
                        />

                        {showNewBadge && (
                          <div className="absolute top-2 right-2 flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[#c9a84c] shadow-lg z-10">
                            <span className="w-1 h-1 rounded-full bg-[#0a0a0a] animate-pulse" />
                            <span className="text-[8px] font-bold text-[#0a0a0a] tracking-wider uppercase leading-none">New</span>
                          </div>
                        )}

                        {/* Name + net worth — overlaid at bottom */}
                        <div className="absolute inset-x-0 bottom-0 px-2 pb-2 pt-1 text-center z-10">
                          <p className="text-[11px] font-semibold text-white group-hover:text-[#c9a84c] transition-colors leading-tight line-clamp-2 drop-shadow-sm">
                            {celeb.name}{DECEASED_IDS.has(celeb.id) && <span className="text-gray-500 ml-0.5 text-[10px]"> (†)</span>}
                          </p>
                          <p className="text-[10px] mt-0.5 drop-shadow-sm" style={{ color: '#c9a84c' }}>{formatNetWorth(celeb.netWorth)}</p>
                        </div>
                      </div>
                    </Link>
                  )
                })}

                {/* "Show more" 12th box */}
                {!showAll && remaining > 0 && (
                  <button
                    onClick={() => setExpandedLetters(prev => new Set([...prev, letter]))}
                    className="bg-[#111] rounded-2xl border border-dashed border-gray-800 hover:border-[#c9a84c]/30 transition-all duration-300 hover:bg-[#141414] flex flex-col items-center justify-center text-center gap-2 aspect-[3/4]"
                  >
                    <span className="text-2xl text-gray-700 leading-none">+{remaining}</span>
                    <p className="text-[9px] text-gray-600 tracking-widest uppercase">Show all</p>
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

function WealthLogo() {
  return (
    <div className="flex items-center gap-3.5">
      {/* Crown + W monogram — luxury mark */}
      <svg width="40" height="36" viewBox="0 0 40 36" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
        <defs>
          <linearGradient id="logoGold" x1="0" y1="0" x2="40" y2="36" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#f5e070"/>
            <stop offset="48%" stopColor="#c9a84c"/>
            <stop offset="100%" stopColor="#8a6218"/>
          </linearGradient>
          <linearGradient id="logoShine" x1="0" y1="0" x2="40" y2="36" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fff8d0" stopOpacity="0.6"/>
            <stop offset="100%" stopColor="#c9a84c" stopOpacity="0"/>
          </linearGradient>
        </defs>
        {/* Crown base band */}
        <rect x="1" y="24" width="38" height="7" rx="1.5" fill="url(#logoGold)"/>
        <rect x="1" y="24" width="38" height="2.5" rx="1" fill="url(#logoShine)" opacity="0.55"/>
        {/* Crown body with 3 points */}
        <polygon points="1,24 1,8 10,17 20,2 30,17 39,8 39,24" fill="url(#logoGold)"/>
        <polygon points="1,24 1,13 10,20 20,7 30,20 39,13 39,24" fill="url(#logoShine)" opacity="0.3"/>
        {/* Center crown gem */}
        <polygon points="20,2 22.5,7 20,12 17.5,7" fill="#fff8d0" opacity="0.95"/>
        {/* Bottom rule */}
        <line x1="1" y1="34.5" x2="39" y2="34.5" stroke="url(#logoGold)" strokeWidth="0.4" opacity="0.5"/>
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <span style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          background: 'linear-gradient(135deg, #f5e070 0%, #c9a84c 48%, #8a6218 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          fontSize: '14px',
          letterSpacing: '0.38em',
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
          fontSize: '10px',
          letterSpacing: '0.42em',
          textTransform: 'uppercase' as const,
          fontWeight: 400,
          lineHeight: 1,
        }}>
          Explorer
        </span>
        {/* Decorative gold rule instead of text subtitle */}
        <div style={{ height: '1px', marginTop: '3px', background: 'linear-gradient(90deg, rgba(201,168,76,0.7), rgba(201,168,76,0.25), transparent)' }} />
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
        className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 text-xs text-gray-400 hover:border-white/20 hover:text-gray-200 transition-all"
      >
        <span className="text-base leading-none">{activeLang.flag}</span>
        <span className="tracking-wide hidden sm:inline">{activeLang.label}</span>
        <ChevronDown size={11} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
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

// ── CIRCLE CARD (trending / category profile grids) ──────────────────────────
function CircleCard({ celeb }: { celeb: Celebrity }) {
  return (
    <Link
      to={`/celebrities/${celeb.id}`}
      className="flex flex-col items-center gap-2 group flex-shrink-0"
    >
      <div className="w-[84px] h-[84px] rounded-full overflow-hidden border-2 border-[#c9a84c]/20 group-hover:border-[#c9a84c]/80 group-hover:shadow-[0_0_18px_rgba(201,168,76,0.45)] transition-all duration-300 shadow-lg">
        <CelebrityAvatar celeb={celeb} size={84} className="group-hover:scale-105 transition-transform duration-500" />
      </div>
      <span className="text-[10px] text-gray-500 group-hover:text-white transition-colors text-center w-20 leading-tight">
        {celeb.name}
      </span>
    </Link>
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
      <ChevronUp size={18} style={{ color: '#c9a84c' }} />
    </button>
  )
}

export default function HomePage() {
  const navigate = useNavigate()
  const { t } = useLang()
  const { celebrities, loading } = useCelebrities()
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<Category>('All')
  const [activeAssetType, setActiveAssetType] = useState<AssetType | 'All'>('All')
  const [searchFocused, setSearchFocused] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const filteredCelebs = useMemo(() => {
    let list = [...celebrities]
    if (activeCategory !== 'All') list = list.filter(c => c.category === activeCategory)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(c =>
        (c.name ?? '').toLowerCase().includes(q) ||
        (c.category ?? '').toLowerCase().includes(q) ||
        (c.nationality ?? '').toLowerCase().includes(q) ||
        (c.assets ?? []).some(a => (a.name ?? '').toLowerCase().includes(q) || a.type.includes(q))
      )
    }
    return list
  }, [search, activeCategory])

  const searchResults = useMemo(() => {
    if (!search.trim()) return []
    const q = search.toLowerCase()
    return celebrities
      .filter(c =>
        (c.name ?? '').toLowerCase().includes(q) ||
        (c.category ?? '').toLowerCase().includes(q) ||
        (c.profession ?? '').toLowerCase().includes(q)
      )
      .slice(0, 6)
  }, [search])

  // Trending: show only celebs with a profile picture. Fill 9 slots.
  const trendingCelebs = useMemo(() => {
    const hasPhoto = (c: Celebrity) => !!getAvatar(c)
    if (activeCategory === 'All') {
      const flagged = celebrities.filter(c => c.trending && hasPhoto(c))
      if (flagged.length >= 9) return flagged.slice(0, 9)
      const flaggedIds = new Set(flagged.map(c => c.id))
      const filler = celebrities
        .filter(c => !flaggedIds.has(c.id) && hasPhoto(c))
        .sort((a, b) => b.netWorth - a.netWorth)
      return [...flagged, ...filler].slice(0, 9)
    }
    // category selected: 9 trending for that category, fallback to non-trending
    const fromCategory = celebrities.filter(c => c.category === activeCategory && hasPhoto(c))
    const trending = fromCategory.filter(c => c.trending)
    const rest = fromCategory.filter(c => !c.trending)
    return [...trending, ...rest].slice(0, 9)
  }, [celebrities, activeCategory])

  // Asset feed: top 20 most expensive assets
  const allFeedItems: FeedItem[] = useMemo(
    () =>
      filteredCelebs
        .flatMap(c => (c.assets ?? []).filter(a => a.name && a.type).map(a => ({ ...a, ownerName: c.name, ownerId: c.id })))
        .sort((a, b) => (b.estimatedValue ?? 0) - (a.estimatedValue ?? 0)),
    [filteredCelebs]
  )

  const assetFeed = useMemo(() => {
    const filtered = activeAssetType === 'All' ? allFeedItems : allFeedItems.filter(a => a.type === activeAssetType)
    return filtered.slice(0, 15)
  }, [allFeedItems, activeAssetType])

  const assetTypeCounts = useMemo(() => {
    const counts: Partial<Record<AssetType, number>> = {}
    for (const item of allFeedItems) {
      counts[item.type] = (counts[item.type] ?? 0) + 1
    }
    return counts
  }, [allFeedItems])

  const presentAssetTypes = useMemo(
    () => (Object.keys(assetTypeCounts) as AssetType[]).filter(t => (assetTypeCounts[t] ?? 0) > 0),
    [assetTypeCounts]
  )

  const showTrending = !search && activeCategory === 'All'
  const showCategoryProfiles = !search && activeCategory !== 'All'
  const showSearchDropdown = searchFocused && search.trim().length > 0

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <p className="text-gray-500 text-sm tracking-widest uppercase">Loading celebrities…</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">

      {/* ── HEADER ──────────────────────────────────────────────── */}
      <header className="border-b bg-[#0a0a0a]/95 backdrop-blur-sm sticky top-0 z-40" style={{ borderBottomColor: 'rgba(201,168,76,0.18)' }}>
        <div className="max-w-5xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <Link to="/" onClick={() => window.scrollTo(0, 0)}><WealthLogo /></Link>
          <div className="flex items-center gap-2">
            <NotificationBell />
            <ThemeToggle />
            <LanguageSelector />
          </div>
        </div>
      </header>

      {/* ── HERO ────────────────────────────────────────────────── */}
      <section className="text-center px-5 pt-20 pb-14 max-w-3xl mx-auto">
        <h1
          className="text-4xl sm:text-6xl lg:text-7xl font-semibold mb-5 leading-tight"
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            background: 'linear-gradient(135deg, #ffffff 0%, #f5e070 40%, #c9a84c 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Wealth Explorer
        </h1>
        <p className="text-gray-500 text-base sm:text-lg leading-relaxed mb-10">
          {t('heroSubtitle')}
        </p>

        {/* Search */}
        <div ref={searchRef} className="relative max-w-2xl mx-auto">
          <Search size={17} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none z-10" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setTimeout(() => setSearchFocused(false), 150)}
            placeholder={isMobile ? 'Search profiles & assets…' : t('searchPlaceholder')}
            className="w-full bg-[#161616] border border-white/12 rounded-2xl pl-12 pr-10 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#c9a84c]/40 text-[16px] sm:text-sm transition-colors"
            style={{ WebkitTextSizeAdjust: 'none' }}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-300 transition-colors"
            >
              <X size={15} />
            </button>
          )}

          {/* Live search dropdown */}
          {showSearchDropdown && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[#141414] border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-50">
              {searchResults.length === 0 ? (
                <div className="px-5 py-8 text-center">
                  <p className="text-2xl mb-2">🔍</p>
                  <p className="text-sm font-medium text-gray-400">No billionaires found matching</p>
                  <p className="text-sm text-gray-600 mt-0.5">"{search}"</p>
                </div>
              ) : (
                <>
                  <div className="px-4 pt-3 pb-1.5">
                    <p className="text-[10px] tracking-[0.2em] uppercase text-gray-600">
                      {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  {searchResults.map(celeb => (
                    <Link
                      key={celeb.id}
                      to={`/celebrities/${celeb.id}`}
                      className="flex items-center gap-4 px-4 py-3 hover:bg-white/5 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border border-white/10">
                        <CelebrityAvatar celeb={celeb} size={40} />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-sm font-medium text-white group-hover:text-[#c9a84c] transition-colors leading-snug">{celeb.name}{DECEASED_IDS.has(celeb.id) && <span className="text-gray-600 text-xs ml-0.5"> (†)</span>}</p>
                        <p className="text-xs text-gray-600 leading-snug">{celeb.profession} · {celeb.nationality}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-semibold" style={{ color: '#c9a84c' }}>{formatNetWorth(celeb.netWorth)}</p>
                        <p className="text-[10px] text-gray-700">{celeb.assets.length} assets</p>
                      </div>
                    </Link>
                  ))}
                  {filteredCelebs.length > searchResults.length && (
                    <div className="px-4 py-2.5 border-t border-white/8">
                      <p className="text-[11px] text-gray-600">
                        +{filteredCelebs.length - searchResults.length} more — scroll to Profiles below
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
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

      {/* ── PROFILES — trending (all) or top 8 (category) ───── */}
      {(showTrending || showCategoryProfiles) && (
        <section className="px-5 pb-16 max-w-5xl mx-auto">
          <p className="text-center text-xs font-semibold tracking-[0.25em] text-gray-500 uppercase mb-8">
            {showTrending ? t('trendingProfiles') : `${activeCategory}`}
          </p>
          {/* Circle card grid — centered on all screens */}
          <div className="flex gap-5 pb-2 justify-center flex-wrap">
            {trendingCelebs.map((celeb) => (
              <CircleCard key={celeb.id} celeb={celeb} />
            ))}
          </div>
        </section>
      )}

      {/* Search active — show filtered results banner */}
      {search.trim() && (
        <div className="max-w-5xl mx-auto px-5 pb-4">
          <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-[#c9a84c]/8 border border-[#c9a84c]/15">
            <p className="text-sm text-gray-400">
              <span className="text-[#c9a84c] font-medium">{filteredCelebs.length}</span> profile{filteredCelebs.length !== 1 ? 's' : ''} matching
              <span className="text-white ml-1">"{search}"</span>
            </p>
            <button onClick={() => setSearch('')} className="text-gray-600 hover:text-gray-300 transition-colors">
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* ── ASSET FEED — top 20 most expensive ──────────────────── */}
      <section className="max-w-5xl mx-auto px-5 pb-16">
        <div className="flex items-center justify-center gap-3 mb-6">
          <p className="text-xs font-semibold tracking-[0.25em] text-gray-500 uppercase text-center">
            {showTrending ? t('featuredAssets') : `${t('assets')} · ${filteredCelebs.length} profiles`}
          </p>
        </div>

        {/* Asset type filter tabs */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-4 mb-6 justify-center flex-wrap">
          <button
            onClick={() => setActiveAssetType('All')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex-shrink-0 ${
              activeAssetType === 'All'
                ? 'bg-[#c9a84c]/15 text-[#c9a84c]'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {t('allAssets')}
            <span className={`text-[11px] font-semibold px-1.5 py-0.5 rounded-full ${activeAssetType === 'All' ? 'bg-[#c9a84c]/20 text-[#c9a84c]' : 'bg-white/8 text-gray-600'}`}>
              {Math.min(allFeedItems.length, 15)}
            </span>
          </button>
          {presentAssetTypes.map(type => (
            <button
              key={type}
              onClick={() => setActiveAssetType(type)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex-shrink-0 ${
                activeAssetType === type
                  ? 'bg-[#c9a84c]/15 text-[#c9a84c]'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <span className="text-base leading-none">{assetTypeIcons[type]}</span>
              {assetTypeLabels[type]}
              <span className={`text-[11px] font-semibold px-1.5 py-0.5 rounded-full ${activeAssetType === type ? 'bg-[#c9a84c]/20 text-[#c9a84c]' : 'bg-white/8 text-gray-600'}`}>
                {assetTypeCounts[type]}
              </span>
            </button>
          ))}
        </div>

        {assetFeed.length === 0 ? (
          <div className="text-center py-24 text-gray-700">{t('noResults')}</div>
        ) : (
          <div className="grid gap-px grid-cols-2 sm:grid-cols-3">
            {assetFeed.map(asset => (
              <button
                key={asset.id}
                onClick={() => navigate(`/celebrities/${asset.ownerId}`)}
                className="relative aspect-square overflow-hidden bg-[#111] group block"
              >
                <img
                  src={getAssetImage(asset)}
                  alt={asset.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  onError={e => {
                    const el = e.target as HTMLImageElement
                    el.style.display = 'none'
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                <div className="absolute top-2.5 left-2.5 text-base leading-none opacity-90">
                  {assetTypeIcons[asset.type]}
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3 text-left">
                  <p className="text-[11px] text-gray-300 mb-0.5 truncate font-medium drop-shadow-sm">{asset.ownerName}</p>
                  <div className="flex items-end justify-between gap-1">
                    <p className="text-xs font-semibold text-white leading-tight truncate flex-1 drop-shadow-sm">
                      {asset.name}
                    </p>
                    <p className="text-xs font-semibold flex-shrink-0" style={{ color: '#c9a84c' }}>
                      {formatValue(asset.estimatedValue)}
                    </p>
                  </div>
                </div>
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </button>
            ))}
          </div>
        )}
      </section>

      {/* ── PROFILE GRID — A-Z ──────────────────────────────────── */}
      <ProfileDirectory filteredCelebs={filteredCelebs} />

      <ScrollToTopButton />

      {/* ── FOOTER ──────────────────────────────────────────────── */}
      <footer className="py-14 px-5" style={{ borderTop: '1px solid rgba(201,168,76,0.18)' }}>
        <div className="max-w-2xl mx-auto text-center">

          {/* Logo */}
          <div className="flex justify-center mb-5">
            <Link to="/" onClick={() => window.scrollTo(0, 0)}><WealthLogo /></Link>
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
    </div>
  )
}
