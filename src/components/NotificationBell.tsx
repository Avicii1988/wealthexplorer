import { useState, useEffect, useRef } from 'react'
import { Bell } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getNewAssets, formatValue } from '../data/celebrities'

const STORAGE_KEY = 'we_seen_notifications'

function getSeenIds(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return new Set(raw ? JSON.parse(raw) : [])
  } catch {
    return new Set()
  }
}

function saveSeenIds(ids: Set<string>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]))
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false)
  const [seenIds, setSeenIds] = useState<Set<string>>(getSeenIds)
  const ref = useRef<HTMLDivElement>(null)

  const allNew = getNewAssets()
  const unseen = allNew.filter(({ asset }) => !seenIds.has(asset.id))

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  function markAllRead() {
    const next = new Set([...seenIds, ...allNew.map(({ asset }) => asset.id)])
    setSeenIds(next)
    saveSeenIds(next)
  }

  function markRead(assetId: string) {
    const next = new Set([...seenIds, assetId])
    setSeenIds(next)
    saveSeenIds(next)
  }

  if (allNew.length === 0) return null

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="relative flex items-center justify-center w-9 h-9 rounded-full border border-white/10 text-gray-400 hover:border-white/20 hover:text-gray-200 transition-all"
        aria-label="Notifications"
      >
        <Bell size={15} />
        {unseen.length > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-[#c9a84c] text-[#0a0a0a] text-[9px] font-bold flex items-center justify-center leading-none">
            {unseen.length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-[#141414] border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-50">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/8">
            <p className="text-xs font-semibold text-white tracking-wide">New Assets</p>
            {unseen.length > 0 && (
              <button
                onClick={markAllRead}
                className="text-[10px] text-[#c9a84c] hover:text-[#e0bb6a] transition-colors tracking-wide"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto">
            {allNew.length === 0 ? (
              <p className="px-4 py-6 text-xs text-gray-600 text-center">No new assets</p>
            ) : (
              allNew.map(({ celeb, asset }) => {
                const isSeen = seenIds.has(asset.id)
                return (
                  <Link
                    key={asset.id}
                    to={`/celebrities/${celeb.id}`}
                    onClick={() => { markRead(asset.id); setOpen(false) }}
                    className={`flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors group ${isSeen ? 'opacity-50' : ''}`}
                  >
                    {/* Avatar */}
                    <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 border border-white/10">
                      <img
                        src={celeb.avatar}
                        alt={celeb.name}
                        className="w-full h-full object-cover object-top"
                        onError={e => {
                          (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(celeb.name)}&background=1a1a1a&color=c9a84c&size=36`
                        }}
                      />
                    </div>
                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-white group-hover:text-[#c9a84c] transition-colors truncate">
                        {asset.name}
                      </p>
                      <p className="text-[10px] text-gray-600 truncate">{celeb.name}</p>
                    </div>
                    {/* Value + badge */}
                    <div className="flex flex-col items-end flex-shrink-0 gap-1">
                      <span className="text-xs font-semibold" style={{ color: '#c9a84c' }}>
                        {formatValue(asset.estimatedValue)}
                      </span>
                      {!isSeen && (
                        <span className="text-[9px] font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-[#c9a84c]/15 text-[#c9a84c] uppercase">
                          NEW
                        </span>
                      )}
                    </div>
                  </Link>
                )
              })
            )}
          </div>

          {/* Footer */}
          {allNew.length > 0 && (
            <div className="px-4 py-2.5 border-t border-white/8">
              <p className="text-[10px] text-gray-700 text-center">
                {unseen.length === 0 ? 'All caught up' : `${unseen.length} unread · click to dismiss`}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
