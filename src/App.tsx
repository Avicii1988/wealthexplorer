import { useState, useMemo } from 'react'
import { celebrities, categories, type Category, type Celebrity } from './data/celebrities'
import Header from './components/Header'
import HeroSection from './components/HeroSection'
import StatsBar from './components/StatsBar'
import FilterBar from './components/FilterBar'
import CelebrityCard from './components/CelebrityCard'
import CelebrityModal from './components/CelebrityModal'
import LeaderboardPanel from './components/LeaderboardPanel'
import Footer from './components/Footer'
import './index.css'

function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<Category>('All')
  const [sortBy, setSortBy] = useState<'netWorth' | 'name' | 'change'>('netWorth')
  const [selectedCelebrity, setSelectedCelebrity] = useState<Celebrity | null>(null)
  const [compareList, setCompareList] = useState<Celebrity[]>([])

  const filtered = useMemo(() => {
    let list = [...celebrities]

    if (activeCategory !== 'All') {
      list = list.filter(c => c.category === activeCategory)
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter(
        c =>
          c.name.toLowerCase().includes(q) ||
          c.title.toLowerCase().includes(q) ||
          c.knownFor.some(k => k.toLowerCase().includes(q)) ||
          c.category.toLowerCase().includes(q)
      )
    }

    list.sort((a, b) => {
      if (sortBy === 'netWorth') return b.netWorth - a.netWorth
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      if (sortBy === 'change') return b.netWorthChange - a.netWorthChange
      return 0
    })

    return list
  }, [searchQuery, activeCategory, sortBy])

  const toggleCompare = (celebrity: Celebrity) => {
    setCompareList(prev => {
      if (prev.find(c => c.id === celebrity.id)) {
        return prev.filter(c => c.id !== celebrity.id)
      }
      if (prev.length >= 2) {
        return [prev[1], celebrity]
      }
      return [...prev, celebrity]
    })
  }

  const isCompared = (celebrity: Celebrity) => compareList.some(c => c.id === celebrity.id)

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-950 via-navy-900 to-[#0d1530]">
      {/* Background grid pattern */}
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(251,191,36,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(251,191,36,0.5) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <main className="relative">
        <HeroSection />
        <StatsBar celebrities={celebrities} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <FilterBar
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            sortBy={sortBy}
            onSortChange={setSortBy}
            resultCount={filtered.length}
          />

          <div className="flex gap-8">
            {/* Main grid */}
            <div className="flex-1 min-w-0">
              {filtered.length === 0 ? (
                <div className="text-center py-24">
                  <div className="text-5xl mb-4">🔍</div>
                  <p className="text-xl text-gray-400 font-medium">No results found</p>
                  <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {filtered.map(celebrity => (
                    <CelebrityCard
                      key={celebrity.id}
                      celebrity={celebrity}
                      onClick={() => setSelectedCelebrity(celebrity)}
                      onCompare={() => toggleCompare(celebrity)}
                      isCompared={isCompared(celebrity)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar leaderboard */}
            <div className="hidden lg:block w-72 flex-shrink-0">
              <LeaderboardPanel
                celebrities={celebrities}
                onSelect={setSelectedCelebrity}
                compareList={compareList}
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Celebrity detail modal */}
      {selectedCelebrity && (
        <CelebrityModal
          celebrity={selectedCelebrity}
          compareWith={compareList.find(c => c.id !== selectedCelebrity.id) ?? null}
          onClose={() => setSelectedCelebrity(null)}
          onCompare={() => toggleCompare(selectedCelebrity)}
          isCompared={isCompared(selectedCelebrity)}
        />
      )}
    </div>
  )
}

export default App
