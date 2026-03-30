import { useState } from 'react'
import {
  Plane, Ship, Building2, Car, Watch, Palette,
  Wind, MapPin, Trophy, Rocket,
} from 'lucide-react'
import type { LucideProps } from 'lucide-react'
import { getAssetImage, type Asset, type AssetType } from '../data/celebrities'

// ── Type-specific icon fallbacks (lucide-react) ────────────────────────────────
type IconComponent = React.ComponentType<LucideProps>

const ASSET_ICONS: Record<AssetType, IconComponent> = {
  jet:         Plane,
  yacht:       Ship,
  real_estate: Building2,
  car:         Car,
  watch:       Watch,
  art:         Palette,
  helicopter:  Wind,     // lucide has no Helicopter; Wind reads as "rotor"
  island:      MapPin,
  sports_team: Trophy,
  rocket:      Rocket,
}

interface Props {
  asset: Asset
  /** Extra Tailwind / CSS classes forwarded to the <img> element */
  className?: string
}

/**
 * Renders a single asset photo with a three-level fallback chain:
 *  1. getAssetImage()  — checks the SearchAPI / assetPhotosCache first
 *  2. asset.image      — hardcoded URL in the JSON
 *  3. Type-specific lucide icon — never shows a broken img tag
 *
 * Uses object-fit: cover so the image always fills the container without
 * stretching, regardless of the source aspect ratio.
 * Uses loading="lazy" so off-screen asset cards are not fetched eagerly.
 */
export default function AssetImage({ asset, className = '' }: Props) {
  const [errored, setErrored] = useState(false)

  const src = getAssetImage(asset)
  const Icon = ASSET_ICONS[asset.type] ?? Building2

  if (errored || !src) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-[#1a1a1a]">
        <Icon size={36} className="text-gray-700" />
        <span className="text-[10px] text-gray-700 tracking-widest uppercase">
          {asset.type.replace('_', ' ')}
        </span>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={asset.name}
      loading="lazy"
      draggable={false}
      className={`w-full h-full object-cover ${className}`.trim()}
      onError={() => setErrored(true)}
    />
  )
}
