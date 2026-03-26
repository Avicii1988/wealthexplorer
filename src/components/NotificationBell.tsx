import { useState, useEffect, useRef, useCallback } from 'react'
import { Bell, BellOff } from 'lucide-react'
import { Link } from 'react-router-dom'
import { celebrities, getAvatar, formatValue } from '../data/celebrities'

const FOLLOWS_KEY = 'we_followed_celebs'
const SEEN_KEY    = 'we_seen_notifs'

function getFollowed(): Set<string> {
  try { return new Set(JSON.parse(localStorage.getItem(FOLLOWS_KEY) ?? '[]')) }
  catch { return new Set() }
}
function getSeen(): Set<string> {
  try { return new Set(JSON.parse(localStorage.getItem(SEEN_KEY) ?? '[]')) }
  catch { return new Set() }
}
function saveSeen(ids: Set<string>) {
  localStorage.setItem(SEEN_KEY, JSON.stringify([...ids]))
}

type Notif =
  | { kind: 'asset';  id: string; celebId: string; celebName: string; celebAvatar: string; title: string; value: number }
  | { kind: 'gossip'; id: string; celebId: string; celebName: string; celebAvatar: string; title: string; subtype: 'gossip' | 'controversy'; date?: string }

export default function NotificationBell() {
  const [open, setOpen]         = useState(false)
  const [followed, setFollowed] = useState<Set<string>>(getFollowed)
  const [seen, setSeen]         = useState<Set<string>>(getSeen)
  const ref     = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const btnRef   = useRef<HTMLButtonElement>(null)

  // Listen for follow-state changes dispatched by ProfilePage
  useEffect(() => {
    const sync = () => setFollowed(getFollowed())
    window.addEventListener('we_follow_change', sync)
    return () => window.removeEventListener('we_follow_change', sync)
  }, [])

  // Close on outside click
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  // Position dropdown with fixed positioning relative to button — immune to any
  // containing-block, overflow, or backdrop-filter stacking context issues.
  const positionPanel = useCallback(() => {
    if (!panelRef.current || !btnRef.current) return
    const panel = panelRef.current
    const btn   = btnRef.current.getBoundingClientRect()
    const margin = 8
    const panelW = panel.offsetWidth || 320

    // Place below button
    panel.style.top = `${btn.bottom + 6}px`

    // Align right edge to button's right edge, then clamp to viewport
    let left = btn.right - panelW
    if (left < margin) left = margin
    if (left + panelW > window.innerWidth - margin) left = window.innerWidth - margin - panelW
    panel.style.left  = `${left}px`
    panel.style.right = 'auto'
  }, [])

  useEffect(() => {
    if (!open) return
    // Run after the panel is rendered so offsetWidth is available
    requestAnimationFrame(positionPanel)
    window.addEventListener('resize', positionPanel)
    window.addEventListener('scroll', positionPanel, true)
    return () => {
      window.removeEventListener('resize', positionPanel)
      window.removeEventListener('scroll', positionPanel, true)
    }
  }, [open, positionPanel])

  // Build notification list from followed celebrities only
  const followedCelebs = celebrities.filter(c => followed.has(c.id))

  const notifs: Notif[] = []
  for (const c of followedCelebs) {
    for (const a of c.assets) {
      if (a.isNew) {
        notifs.push({
          kind: 'asset',
          id: `asset-${a.id}`,
          celebId: c.id, celebName: c.name,
          celebAvatar: getAvatar(c),
          title: a.name, value: a.estimatedValue,
        })
      }
    }
    for (const g of c.gossip ?? []) {
      if (g.isNew) {
        notifs.push({
          kind: 'gossip',
          id: `gossip-${c.id}-${g.title.replace(/\s+/g, '-')}`,
          celebId: c.id, celebName: c.name,
          celebAvatar: getAvatar(c),
          title: g.title,
          subtype: g.type ?? 'gossip',
          date: g.date,
        })
      }
    }
  }

  const unseen = notifs.filter(n => !seen.has(n.id))

  function markAllRead() {
    const next = new Set([...seen, ...notifs.map(n => n.id)])
    setSeen(next); saveSeen(next)
  }
  function markRead(id: string) {
    const next = new Set([...seen, id])
    setSeen(next); saveSeen(next)
  }

  // ── Empty: user hasn't followed anyone yet ────────────────────────────────
  if (followed.size === 0) {
    return (
      <div ref={ref} className="relative">
        <button
          ref={btnRef}
          onClick={() => setOpen(v => !v)}
          className="relative flex items-center justify-center w-9 h-9 rounded-full border border-white/10 text-gray-600 hover:border-white/20 hover:text-gray-400 transition-all"
          aria-label="Notifications"
        >
          <BellOff size={15} />
        </button>
        {open && (
          <div ref={panelRef} className="fixed w-72 bg-[#141414] border border-white/10 rounded-2xl shadow-2xl z-[9999] p-6 text-center">
            <BellOff size={26} className="text-gray-700 mx-auto mb-3" />
            <p className="text-xs font-medium text-gray-400 mb-1">No followed profiles</p>
            <p className="text-[11px] text-gray-600 leading-relaxed">
              Follow celebrities on their profile page to receive new assets &amp; gossip updates here.
            </p>
          </div>
        )}
      </div>
    )
  }

  // ── Normal bell ────────────────────────────────────────────────────────────
  return (
    <div ref={ref} className="relative">
      <button
        ref={btnRef}
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
        <div ref={panelRef} className="fixed w-80 bg-[#141414] border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-[9999]">

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/8">
            <div>
              <p className="text-xs font-semibold text-white">News Feed</p>
              <p className="text-[10px] text-gray-600">
                {followedCelebs.length} following · {notifs.length} update{notifs.length !== 1 ? 's' : ''}
              </p>
            </div>
            {unseen.length > 0 && (
              <button
                onClick={markAllRead}
                className="text-[10px] text-[#c9a84c] hover:text-[#e0bb6a] transition-colors"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Notification list */}
          <div className="max-h-[340px] overflow-y-auto">
            {notifs.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <Bell size={22} className="text-gray-700 mx-auto mb-2" />
                <p className="text-xs text-gray-500">No updates yet</p>
                <p className="text-[11px] text-gray-700 mt-1">New assets &amp; gossip will appear here</p>
              </div>
            ) : (
              notifs.map(n => {
                const isSeen = seen.has(n.id)
                return (
                  <Link
                    key={n.id}
                    to={`/celebrities/${n.celebId}`}
                    onClick={() => { markRead(n.id); setOpen(false) }}
                    className={`flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors group border-b border-white/5 last:border-0 ${isSeen ? 'opacity-40' : ''}`}
                  >
                    {/* Avatar */}
                    <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 border border-white/10">
                      <img
                        src={n.celebAvatar}
                        alt={n.celebName}
                        className="w-full h-full object-cover"
                        style={{ objectPosition: 'center 15%' }}
                        onError={e => {
                          (e.target as HTMLImageElement).src =
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(n.celebName)}&background=1a1a1a&color=c9a84c&size=36`
                        }}
                      />
                    </div>

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-white group-hover:text-[#c9a84c] transition-colors truncate leading-snug">
                        {n.title}
                      </p>
                      <p className="text-[10px] text-gray-600 truncate">
                        {n.celebName}
                        {n.kind === 'gossip' && n.date ? ` · ${n.date}` : ''}
                      </p>
                    </div>

                    {/* Type badge + unread dot */}
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      {n.kind === 'asset' ? (
                        <span className="text-[11px] font-semibold" style={{ color: '#c9a84c' }}>
                          {formatValue(n.value)}
                        </span>
                      ) : (
                        <span
                          className="text-[9px] px-1.5 py-0.5 rounded-full font-bold"
                          style={
                            n.subtype === 'controversy'
                              ? { background: 'rgba(239,68,68,0.15)', color: '#ef4444' }
                              : { background: 'rgba(201,168,76,0.12)', color: '#c9a84c' }
                          }
                        >
                          {n.subtype === 'controversy' ? '⚡' : '💬'}
                        </span>
                      )}
                      {!isSeen && <span className="w-1.5 h-1.5 rounded-full bg-[#c9a84c]" />}
                    </div>
                  </Link>
                )
              })
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2.5 border-t border-white/8">
            <p className="text-[10px] text-gray-700 text-center">
              {unseen.length === 0
                ? 'All caught up ✓'
                : `${unseen.length} new update${unseen.length !== 1 ? 's' : ''}`}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
