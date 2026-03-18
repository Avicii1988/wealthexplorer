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
  getAvatar,
} from '../data/celebrities'
import NotificationBell from '../components/NotificationBell'
import { LANGUAGES, useLang } from '../i18n'

type FeedItem = Asset & { ownerName: string; ownerId: string }

// ── A-Z PROFILE DIRECTORY ─────────────────────────────────────────────────────
function ProfileDirectory({ filteredCelebs }: { filteredCelebs: Celebrity[] }) {
  const { t } = useLang()
  const letterRefs = useRef<Record<string, HTMLDivElement | null>>({})

  const sorted = useMemo(
    () => [...filteredCelebs].sort((a, b) => a.name.localeCompare(b.name)),
    [filteredCelebs]
  )

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
      <div className="flex items-center justify-between mb-8">
        <p className="text-xs font-semibold tracking-[0.25em] text-gray-500 uppercase">
          {t('profiles')}
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

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {grouped[letter].map(celeb => {
                const hasNewAsset = celeb.assets.some(a => a.isNew)
                return (
                <Link key={celeb.id} to={`/celebrities/${celeb.id}`} className="group">
                  <div className="relative bg-[#111] rounded-2xl border border-white/8 group-hover:border-[#c9a84c]/30 transition-all duration-300 group-hover:bg-[#141414] flex flex-col items-center text-center pt-5 pb-4 px-3 gap-3">
                    {hasNewAsset && (
                      <div className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#c9a84c] shadow-lg z-10">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0a0a0a] animate-pulse" />
                        <span className="text-[9px] font-bold text-[#0a0a0a] tracking-wider uppercase leading-none">New</span>
                      </div>
                    )}
                    {/* Circle avatar — always in color */}
                    <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-[#c9a84c]/50 transition-all duration-300 flex-shrink-0">
                      <img
                        src={getAvatar(celeb)}
                        alt={celeb.name}
                        className="w-full h-full object-cover object-top transition-all duration-500"
                        onError={e => {
                          (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(celeb.name)}&background=1a1a1a&color=c9a84c&size=200&bold=true`
                        }}
                      />
                    </div>
                    <div className="w-full">
                      <p className="text-sm font-semibold text-white group-hover:text-[#c9a84c] transition-colors truncate leading-tight">
                        {celeb.name}
                      </p>
                      <p className="text-xs mt-1" style={{ color: '#c9a84c' }}>{formatNetWorth(celeb.netWorth)}</p>
                      <p className="text-[11px] text-gray-600 mt-0.5">{celeb.assets.length} asset{celeb.assets.length !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
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

// ── CROWN LOGO ────────────────────────────────────────────────────────────────
function WealthLogo() {
  return (
    <div className="flex items-center gap-3">
      <svg width="34" height="34" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
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
      <div className="w-[68px] h-[68px] rounded-full overflow-hidden border-2 border-white/10 group-hover:border-[#c9a84c]/60 transition-all duration-300 shadow-lg">
        <img
          src={getAvatar(celeb)}
          alt={celeb.name}
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
          onError={e => {
            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(celeb.name)}&background=1a1a1a&color=c9a84c&size=72`
          }}
        />
      </div>
      <span className="text-[10px] text-gray-500 group-hover:text-white transition-colors text-center w-16 leading-tight">
        {celeb.name}
      </span>
    </Link>
  )
}

export default function HomePage() {
  const navigate = useNavigate()
  const { t } = useLang()
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<Category>('All')
  const [activeAssetType, setActiveAssetType] = useState<AssetType | 'All'>('All')
  const [searchFocused, setSearchFocused] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

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

  // Trending: when category is "All" show 16, otherwise show 8 for that category
  const trendingCelebs = useMemo(() => {
    if (activeCategory === 'All') {
      return celebrities.filter(c => c.trending).slice(0, 16)
    }
    // category selected: 8 trending for that category, fallback to non-trending
    const fromCategory = celebrities.filter(c => c.category === activeCategory)
    const trending = fromCategory.filter(c => c.trending)
    const rest = fromCategory.filter(c => !c.trending)
    return [...trending, ...rest].slice(0, 8)
  }, [activeCategory])

  // Asset feed: top 20 most expensive assets
  const allFeedItems: FeedItem[] = useMemo(
    () =>
      filteredCelebs
        .flatMap(c => c.assets.map(a => ({ ...a, ownerName: c.name, ownerId: c.id })))
        .sort((a, b) => b.estimatedValue - a.estimatedValue),
    [filteredCelebs]
  )

  const assetFeed = useMemo(() => {
    const filtered = activeAssetType === 'All' ? allFeedItems : allFeedItems.filter(a => a.type === activeAssetType)
    return filtered.slice(0, 20)
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

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">

      {/* ── HEADER ──────────────────────────────────────────────── */}
      <header className="flex items-center justify-between px-6 py-3.5 border-b border-white/8 bg-[#0a0a0a]/95 backdrop-blur-sm sticky top-0 z-40">
        <WealthLogo />
        <div className="flex items-center gap-2">
          <NotificationBell />
          <LanguageSelector />
        </div>
      </header>

      {/* ── HERO ────────────────────────────────────────────────── */}
      <section className="text-center px-5 pt-20 pb-14 max-w-3xl mx-auto">
        <div className="flex justify-center mb-6">
          <svg width="52" height="52" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-50">
            <rect x="4" y="22" width="24" height="4" rx="1.2" fill="#c9a84c" opacity="0.95"/>
            <path d="M4 22L4 13L9.5 18.5L16 6L22.5 18.5L28 13L28 22Z" fill="#c9a84c" opacity="0.15"/>
            <path d="M4 22L4 13L9.5 18.5L16 6L22.5 18.5L28 13L28 22" stroke="#c9a84c" strokeWidth="1.6" strokeLinejoin="round" fill="none"/>
            <circle cx="16" cy="6.5" r="2.1" fill="#c9a84c"/>
            <circle cx="6" cy="14" r="1.5" fill="#c9a84c" opacity="0.75"/>
            <circle cx="26" cy="14" r="1.5" fill="#c9a84c" opacity="0.75"/>
          </svg>
        </div>
        <h1
          className="text-6xl sm:text-7xl font-semibold text-white mb-5 leading-tight"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Wealth Explorer
        </h1>
        <p className="text-gray-500 text-lg leading-relaxed mb-10">
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
            placeholder={t('searchPlaceholder')}
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
                          src={getAvatar(celeb)}
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

      {/* ── PROFILES — trending (all) or top 8 (category) ───── */}
      {(showTrending || showCategoryProfiles) && (
        <section className="px-5 pb-16 max-w-5xl mx-auto">
          <p className="text-center text-xs font-semibold tracking-[0.25em] text-gray-500 uppercase mb-8">
            {showTrending ? t('trendingProfiles') : `${activeCategory}`}
          </p>
          {/* Circle card grid */}
          <div className="flex gap-5 overflow-x-auto scrollbar-hide pb-2 justify-start sm:justify-center flex-wrap">
            {trendingCelebs.map(celeb => (
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
          {showTrending && (
            <span className="text-[10px] px-2.5 py-1 rounded-full bg-[#c9a84c]/10 text-[#c9a84c] border border-[#c9a84c]/20 font-medium">
              Top 20
            </span>
          )}
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
              {Math.min(allFeedItems.length, 20)}
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
      <footer className="border-t border-white/8 py-10 px-5">
        <div className="max-w-5xl mx-auto">
          {/* Top row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8">
            <WealthLogo />
            <nav className="flex flex-wrap items-center gap-x-6 gap-y-2">
              {[
                { label: 'Home', to: '/' },
                { label: 'Athletes', to: '/' },
                { label: 'Actors', to: '/' },
                { label: 'Musicians', to: '/' },
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
