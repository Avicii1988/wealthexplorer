import { useState } from 'react'
import { getAvatar, type Celebrity } from '../data/celebrities'

interface Props {
  /** The celebrity whose photo to display */
  celeb: Celebrity
  /**
   * Logical render size in CSS pixels.
   * Used to request an appropriately sized initials placeholder from
   * ui-avatars.com (2× for retina screens, capped at 512 px).
   */
  size?: number
  /** Extra Tailwind / CSS classes forwarded to the <img> element */
  className?: string
  /**
   * CSS object-position value.
   * Defaults to 'center 15%' which keeps faces centred in portrait shots.
   */
  position?: string
}

/**
 * Renders a celebrity headshot with a three-level fallback chain:
 *  1. getAvatar() — checks the runtime photo-store caches (Wikipedia / TMDB)
 *  2. celeb.avatar — the URL stored directly in celebs.json
 *  3. ui-avatars.com initials placeholder (coloured circle, never a broken img)
 *
 * Always uses object-fit: cover so the image fills its container without
 * squishing or letterboxing, regardless of the source aspect ratio.
 * Adds loading="lazy" so off-screen images are not fetched on initial load.
 */
export default function CelebrityAvatar({
  celeb,
  size = 100,
  className = '',
  position = 'center 15%',
}: Props) {
  const [errored, setErrored] = useState(false)

  // Build the initials fallback URL for this celebrity
  const initials = `https://ui-avatars.com/api/?name=${encodeURIComponent(celeb.name)}&background=1a1a1a&color=c9a84c&size=${Math.min(size * 2, 512)}&bold=true`

  // getAvatar checks photo-store caches first, then falls back to celeb.avatar
  const primary = getAvatar(celeb)
  const src = errored ? initials : (primary || initials)

  return (
    <img
      src={src}
      alt={celeb.name}
      width={size}
      height={size}
      loading="lazy"
      draggable={false}
      className={`w-full h-full object-cover ${className}`.trim()}
      style={{ objectPosition: position }}
      onError={() => {
        // Guard against infinite loop: only switch to initials once
        if (!errored) setErrored(true)
      }}
    />
  )
}
