import { useState, useMemo, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, ChevronDown, X } from 'lucide-react'
import {
  celebrities,
  categories,
  assetTypeLabels,
  type Category,
  type Asset,
  type AssetType,
  type Celebrity,
  assetTypeIcons,
  formatValue,
  formatNetWorth,
} from '../data/celebrities'
import NotificationBell from '../components/NotificationBell'

type FeedItem = Asset & { ownerName: string; ownerId: string }

// ── A-Z PROFILE DIRECTORY ─────────────────────────────────────────────────────
function ProfileDirectory({ filteredCelebs }: { filteredCelebs: Celebrity[] }) {
  const letterRefs = useRef<Record<string, HTMLDivElement | null>>({})

  // Sort alphabetically
  const sorted = useMemo(
    () => [...filteredCelebs].sort((a, b) => a.name.localeCompare(b.name)),
    [filteredCelebs]
  )

  // Group by first letter
  const grouped = useMemo(() => {
    const map: Record<string, Celebrity[]> = {}
    for (const c of sorted) {
      const letter = c.name[0].toUpperCase()
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
      {/* Header + count */}
      <div className="flex items-center justify-between mb-8">
        <p className="text-xs font-semibold tracking-[0.25em] text-gray-500 uppercase">
          Profiles
        </p>
        <p className="text-xs text-gray-700">{sorted.length} profiles · A–Z</p>
      </div>

      {/* A-Z letter bar */}
      <div className="sticky top-[57px] z-30 bg-[#0a0a0a]/95 backdrop-blur-sm -mx-5 px-5 py-2.5 mb-8 border-b border-white/5">
        <div className="flex items-center gap-0.5 overflow-x-auto scrollbar-hide">
          {alphabet.map(letter => {
            const hasProfiles = !!grouped[letter]
            return (
              <button
                key={letter}
                onClick={() => hasProfiles && scrollToLetter(letter)}
                disabled={!hasProfiles}
                className={`w-7 h-7 rounded-lg text-xs font-semibold flex items-center justify-center flex-shrink-0 transition-all ${
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
        {presentLetters.map(letter => (
          <div
            key={letter}
            ref={el => { letterRefs.current[letter] = el }}
          >
            {/* Letter heading */}
            <div className="flex items-center gap-4 mb-5">
              <span
                className="text-3xl font-semibold leading-none"
                style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#c9a84c' }}
              >
                {letter}
              </span>
              <div className="flex-1 h-px bg-white/6" />
              <span className="text-[10px] text-gray-700">{grouped[letter].length}</span>
            </div>

            {/* Profiles row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
              {grouped[letter].map(celeb => {
                const hasNewAsset = celeb.assets.some(a => a.isNew)
                return (
                <Link key={celeb.id} to={`/celebrities/${celeb.id}`} className="group text-left">
                  <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#111] mb-3 border border-white/8 group-hover:border-[#c9a84c]/30 transition-colors duration-300">
                    <img
                      src={celeb.avatar}
                      alt={celeb.name}
                      className="w-full h-full object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-500"
                      onError={e => {
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(celeb.name)}&background=1a1a1a&color=c9a84c&size=200&bold=true`
                      }}
                    />
                    {hasNewAsset && (
                      <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#c9a84c] shadow-lg">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0a0a0a] animate-pulse" />
                        <span className="text-[9px] font-bold text-[#0a0a0a] tracking-wider uppercase leading-none">New</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-semibold text-white group-hover:text-[#c9a84c] transition-colors truncate flex-1">
                      {celeb.name}
                    </p>
                    {hasNewAsset && <span className="w-2 h-2 rounded-full bg-[#c9a84c] flex-shrink-0 animate-pulse" />}
                  </div>
                  <p className="text-xs text-gray-600 mt-0.5">
                    {formatNetWorth(celeb.netWorth)} · {celeb.assets.length} assets
                  </p>
                </Link>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', label: 'Português', flag: '🇵🇹' },
  { code: 'ar', label: 'العربية', flag: '🇦🇪' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
]

function WealthLogo() {
  return (
    <div className="flex items-center gap-3">
      {/* Emblem */}
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Outer octagon ring */}
        <path
          d="M16 1L22.5 3.5L28.5 9L31 16L28.5 23L22.5 28.5L16 31L9.5 28.5L3.5 23L1 16L3.5 9L9.5 3.5Z"
          stroke="#c9a84c"
          strokeWidth="0.8"
          fill="none"
          opacity="0.5"
        />
        {/* Diamond inner */}
        <path
          d="M16 5L22 12L16 27L10 12Z"
          fill="none"
          stroke="#c9a84c"
          strokeWidth="0.9"
        />
        {/* Horizontal crossbar */}
        <line x1="9" y1="13.5" x2="23" y2="13.5" stroke="#c9a84c" strokeWidth="0.8" />
        {/* Top crown points */}
        <path d="M10 8L13 13.5M22 8L19 13.5M16 6V13.5" stroke="#c9a84c" strokeWidth="0.9" strokeLinecap="round" />
        {/* Center dot */}
        <circle cx="16" cy="13.5" r="1.2" fill="#c9a84c" />
        {/* Bottom small dot */}
        <circle cx="16" cy="23.5" r="0.8" fill="#c9a84c" opacity="0.6" />
      </svg>
      {/* Wordmark */}
      <div className="flex flex-col leading-none">
        <span
          className="text-[10px] tracking-[0.35em] uppercase text-[#c9a84c]/60 font-light"
          style={{ fontFamily: "'Playfair Display', Georgia, serif", letterSpacing: '0.3em' }}
        >
          The
        </span>
        <span
          className="text-[17px] font-normal tracking-wide"
          style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#c9a84c' }}
        >
          Wealth Explorer
        </span>
      </div>
    </div>
  )
}

export default function HomePage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<Category>('All')
  const [activeAssetType, setActiveAssetType] = useState<AssetType | 'All'>('All')
  const [langOpen, setLangOpen] = useState(false)
  const [activeLang, setActiveLang] = useState(LANGUAGES[0])
  const [searchFocused, setSearchFocused] = useState(false)
  const langRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLDivElement>(null)

  // Close lang dropdown on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const filteredCelebs = useMemo(() => {
    let list = [...celebrities]
    if (activeCategory !== 'All') list = list.filter(c => c.category === activeCategory)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.nationality.toLowerCase().includes(q) ||
        c.assets.some(a => a.name.toLowerCase().includes(q) || a.type.includes(q))
      )
    }
    return list
  }, [search, activeCategory])

  // Live search results (top 6 matches by name)
  const searchResults = useMemo(() => {
    if (!search.trim()) return []
    const q = search.toLowerCase()
    return celebrities
      .filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.profession.toLowerCase().includes(q)
      )
      .slice(0, 6)
  }, [search])

  const trendingCelebs = celebrities.filter(c => c.trending).slice(0, 16)

  const allFeedItems: FeedItem[] = useMemo(
    () =>
      filteredCelebs
        .flatMap(c => c.assets.map(a => ({ ...a, ownerName: c.name, ownerId: c.id })))
        .sort((a, b) => b.likes - a.likes),
    [filteredCelebs]
  )

  const assetFeed = useMemo(
    () => activeAssetType === 'All' ? allFeedItems : allFeedItems.filter(a => a.type === activeAssetType),
    [allFeedItems, activeAssetType]
  )

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
  const showSearchDropdown = searchFocused && search.trim().length > 0

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">

      {/* ── HEADER ──────────────────────────────────────────────── */}
      <header className="flex items-center justify-between px-6 py-3.5 border-b border-white/8 bg-[#0a0a0a]/95 backdrop-blur-sm sticky top-0 z-40">
        <WealthLogo />

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <NotificationBell />

        {/* Language selector */}
        <div ref={langRef} className="relative">
          <button
            onClick={() => setLangOpen(v => !v)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 text-xs text-gray-400 hover:border-white/20 hover:text-gray-200 transition-all"
          >
            <span className="text-base leading-none">{activeLang.flag}</span>
            <span className="tracking-wide hidden sm:inline">{activeLang.label}</span>
            <ChevronDown size={11} className={`transition-transform duration-200 ${langOpen ? 'rotate-180' : ''}`} />
          </button>

          {langOpen && (
            <div className="absolute right-0 top-full mt-2 w-44 bg-[#141414] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50">
              {LANGUAGES.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => { setActiveLang(lang); setLangOpen(false) }}
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
        </div>{/* end right actions */}
      </header>

      {/* ── HERO ────────────────────────────────────────────────── */}
      <section className="text-center px-5 pt-20 pb-14 max-w-3xl mx-auto">
        <div className="flex justify-center mb-6">
          <svg width="48" height="48" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-40">
            <path d="M16 1L22.5 3.5L28.5 9L31 16L28.5 23L22.5 28.5L16 31L9.5 28.5L3.5 23L1 16L3.5 9L9.5 3.5Z" stroke="#c9a84c" strokeWidth="0.8" fill="none" />
            <path d="M16 5L22 12L16 27L10 12Z" fill="none" stroke="#c9a84c" strokeWidth="0.9" />
            <line x1="9" y1="13.5" x2="23" y2="13.5" stroke="#c9a84c" strokeWidth="0.8" />
            <path d="M10 8L13 13.5M22 8L19 13.5M16 6V13.5" stroke="#c9a84c" strokeWidth="0.9" strokeLinecap="round" />
            <circle cx="16" cy="13.5" r="1.2" fill="#c9a84c" />
          </svg>
        </div>
        <h1
          className="text-6xl sm:text-7xl font-semibold text-white mb-5 leading-tight"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Wealth Explorer
        </h1>
        <p className="text-gray-500 text-lg leading-relaxed mb-10">
          Explore verified yachts, jets, watches, and estates<br className="hidden sm:block" />
          owned by the world's most notable individuals.
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
            placeholder="Search a public figure, category or asset..."
            className="w-full bg-[#161616] border border-white/12 rounded-2xl pl-12 pr-10 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#c9a84c]/40 text-sm transition-all"
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
                <div className="px-5 py-6 text-sm text-gray-600 text-center">No results for "{search}"</div>
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
                        <img
                          src={celeb.avatar}
                          alt={celeb.name}
                          className="w-full h-full object-cover object-top"
                          onError={e => {
                            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(celeb.name)}&background=1a1a1a&color=c9a84c&size=40`
                          }}
                        />
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <p className="text-sm font-medium text-white group-hover:text-[#c9a84c] transition-colors truncate">{celeb.name}</p>
                        <p className="text-xs text-gray-600 truncate">{celeb.profession} · {celeb.nationality}</p>
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

      {/* ── TRENDING PROFILES — 2 rows of 8 ────────────────────── */}
      {showTrending && (
        <section className="px-5 pb-16 max-w-5xl mx-auto">
          <p className="text-center text-xs font-semibold tracking-[0.25em] text-gray-500 uppercase mb-8">
            Trending Profiles
          </p>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-x-4 gap-y-7">
            {trendingCelebs.map(celeb => (
              <Link
                key={celeb.id}
                to={`/celebrities/${celeb.id}`}
                className="flex flex-col items-center gap-2 group"
              >
                <div className="w-14 h-14 sm:w-[68px] sm:h-[68px] rounded-full overflow-hidden border-2 border-white/10 group-hover:border-[#c9a84c]/60 transition-all duration-300 shadow-lg">
                  <img
                    src={celeb.avatar}
                    alt={celeb.name}
                    className="w-full h-full object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-500"
                    onError={e => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(celeb.name)}&background=1a1a1a&color=c9a84c&size=72`
                    }}
                  />
                </div>
                <span className="text-[10px] text-gray-500 group-hover:text-white transition-colors text-center w-16 leading-tight">
                  {celeb.name}
                </span>
              </Link>
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

      {/* ── ASSET FEED ──────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-5 pb-16">
        <p className="text-xs font-semibold tracking-[0.25em] text-gray-500 uppercase mb-6 text-center">
          {showTrending ? 'Featured Assets' : `Assets · ${filteredCelebs.length} profiles`}
        </p>

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
            All Assets
            <span className={`text-[11px] font-semibold px-1.5 py-0.5 rounded-full ${activeAssetType === 'All' ? 'bg-[#c9a84c]/20 text-[#c9a84c]' : 'bg-white/8 text-gray-600'}`}>
              {allFeedItems.length}
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
                <div className="absolute top-2.5 left-2.5 text-base leading-none opacity-90">
                  {assetTypeIcons[asset.type]}
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3 text-left">
                  <p className="text-[10px] text-gray-400 mb-0.5 truncate">{asset.ownerName}</p>
                  <div className="flex items-end justify-between gap-1">
                    <p className="text-xs font-medium text-white leading-tight truncate flex-1">
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

      {/* ── FOOTER ──────────────────────────────────────────────── */}
      <footer className="pt-16 pb-10 px-5 border-t border-white/8">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mb-10">
            <div>
              <WealthLogo />
              <p className="text-xs text-gray-600 leading-relaxed mt-4 mb-3">
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
                  <li key={item}><span className="text-xs text-gray-500 hover:text-white transition-colors cursor-pointer">{item}</span></li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-gray-500 mb-4">Asset Types</p>
              <ul className="space-y-2.5">
                {['Private Jets', 'Yachts', 'Real Estate', 'Cars', 'Watches', 'Art Collections'].map(item => (
                  <li key={item}><span className="text-xs text-gray-500">{item}</span></li>
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
