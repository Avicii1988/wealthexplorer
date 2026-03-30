// Photo cache populated by scripts/enrich-photos.mjs (Wikipedia → TMDb chain)
// NOTE: photosCache, celebsPhotos and assetPhotosCache are no longer bundled —
// they are fetched at runtime from public/data/ by src/data/photoStore.ts.
import { getStore, isReliableUrl, type AssetCacheEntry } from './photoStore'

export type AssetType = 'jet' | 'yacht' | 'real_estate' | 'car' | 'watch' | 'art' | 'helicopter' | 'island' | 'sports_team' | 'rocket';
export type Category = 'All' | 'Athletes' | 'Actors' | 'Musicians' | 'Entrepreneurs' | 'Politicians' | 'Models';

export interface Asset {
  id: string;
  type: AssetType;
  name: string;
  description: string;
  estimatedValue: number; // millions USD
  image?: string;
  photos?: string[]; // up to 3 gallery images shown in asset card
  images?: string[]; // enriched: up to 3 validated high-res URLs (from enrich_assets.py)
  valueFormatted?: string; // enriched: e.g. "$4.2M" from valuation search
  valuationSource?: string; // enriched: domain that provided the valuation
  lastValuated?: string; // enriched: ISO date of last valuation search
  year?: number;
  location?: string;
  specs?: string;
  likes: number;
  isNew?: boolean | string;
}

export interface Celebrity {
  id: string;
  name: string;
  category: Exclude<Category, 'All'>;
  netWorth: number; // billions
  avatar: string;
  coverImage: string; // wide hero image
  nationality: string;
  bio: string;
  assets: Asset[];
  trending: boolean;
  isNew?: string; // ISO date the profile was added — shown as NEW badge for 24 h
  lastUpdated?: string; // ISO date e.g. '2026-03-20'
  // Bio overview fields
  birthdate: string;
  birthplace: string;
  gender: 'Male' | 'Female';
  height: string;
  profession: string;
  photos: string[];
  relationships?: {
    parents?: string[]
    spouse?: string
    exSpouse?: string[]
    partner?: string
    exPartner?: string[]
    fiancé?: string
    siblings?: string[]
    children?: string[]
    grandchildren?: string[]
  }
  gossip?: {
    title: string
    summary: string
    type?: 'gossip' | 'controversy'
    date?: string
    isNew?: boolean | string
  }[]
}

// Deceased celebrity IDs — used to show (†) next to names in the UI
export const DECEASED_IDS = new Set<string>([
  'ayrton-senna',        // died 1994
  'freddie-mercury',     // died 1991
  'grace-kelly',         // died 1982
  'hank-aaron',          // died 2021
  'charlie-chaplin',     // died 1977
  'jacqueline-onassis',  // died 1994
  'chadwick-boseman',    // died 2020
  'dean-martin',         // died 1995
  'chuck-berry',         // died 2017
  'michael-jackson',     // died 2009
  'prince',              // died 2016
  'kobe-bryant',         // died 2020
  'marilyn-monroe',      // died 1962
  'audrey-hepburn',      // died 1993
  'bruce-lee',           // died 1973
  'pablo-escobar',       // died 1993
])


export const categories: Category[] = ['All', 'Athletes', 'Actors', 'Musicians', 'Entrepreneurs', 'Politicians', 'Models'];

export const assetTypeLabels: Record<AssetType, string> = {
  jet: 'Private Jet',
  yacht: 'Yacht',
  real_estate: 'Real Estate',
  car: 'Car',
  watch: 'Watch',
  art: 'Art',
  helicopter: 'Helicopter',
  island: 'Island',
  sports_team: 'Sports Team',
  rocket: 'Rocket',
};

export const assetTypeIcons: Record<AssetType, string> = {
  jet: '✈',
  yacht: '⛵',
  real_estate: '🏛',
  car: '🚗',
  watch: '⌚',
  art: '🎨',
  helicopter: '🚁',
  island: '🏝',
  sports_team: '🏆',
  rocket: '🚀',
};

export function formatValue(millions: number): string {
  if (millions >= 1000) return `$${(millions / 1000).toFixed(1)}B`;
  if (millions >= 1) return `$${millions % 1 === 0 ? millions.toFixed(0) : millions.toFixed(1)}M`;
  return `$${(millions * 1000).toFixed(0)}K`;
}

export function formatNetWorth(billions: number): string {
  if (billions >= 1) return `$${billions % 1 === 0 ? billions.toFixed(0) : billions.toFixed(1)}B`;
  return `$${(billions * 1000).toFixed(0)}M`;
}

export function getNationalityFlag(nationality: string): string {
  const flags: Record<string, string> = {
    'American': '🇺🇸',
    'British': '🇬🇧',
    'Brazilian': '🇧🇷',
    'Argentine': '🇦🇷',
    'Portuguese': '🇵🇹',
    'Spanish': '🇪🇸',
    'French': '🇫🇷',
    'Australian': '🇦🇺',
    'Canadian': '🇨🇦',
    'Chinese': '🇨🇳',
    'Mexican': '🇲🇽',
    'South African': '🇿🇦',
    'Jamaican': '🇯🇲',
    'Swiss': '🇨🇭',
    'Irish': '🇮🇪',
    'Barbadian': '🇧🇧',
    'German': '🇩🇪',
    'Italian': '🇮🇹',
    'Trinidadian': '🇹🇹',
    'Puerto Rican': '🇵🇷',
    'Senegalese': '🇸🇳',
    'Nigerian': '🇳🇬',
    'Saudi': '🇸🇦',
    'Russian': '🇷🇺',
    'Japanese': '🇯🇵',
    'Korean': '🇰🇷',
    'Indian': '🇮🇳',
    'Swedish': '🇸🇪',
    'Dutch': '🇳🇱',
    'Norwegian': '🇳🇴',
  }
  return flags[nationality] || '🌍'
}


/** Returns the best available avatar URL for a celebrity.
 *  Priority:
 *   1. photosCache[id]       — Wikipedia / TMDB, reliability-checked
 *   2. celebsPhotos[name]    — SearchAPI result, reliability-checked
 *   3. celeb.avatar          — URL stored directly in celebs.json (already enriched)
 */
export function getAvatar(celeb: Celebrity): string {
  const { photosCache, celebsPhotos } = getStore()

  const cached = photosCache[celeb.id]
  if (cached && isReliableUrl(cached)) return cached

  // Apply the same reliability guard to SearchAPI results — CDN URLs
  // like shortpixel / fbsbx often block hotlinking and cause broken images.
  const fromSearch = celebsPhotos[celeb.name]?.image
  if (fromSearch && isReliableUrl(fromSearch)) return fromSearch

  // celeb.avatar comes from celebs.json which is already enriched with the
  // best available Wikipedia / TMDB URL — use it directly as the last resort.
  return celeb.avatar || ''
}

// ── Diverse Unsplash fallback pools per asset type ────────────────────────────
// Used when an asset's hardcoded image URL is one of the known repeated/generic
// placeholders. A deterministic hash of the asset ID picks a unique slot so the
// same asset always gets the same picture, but different assets get different ones.
const REPEATED_URLS = new Set([
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&h=600&fit=crop',
  'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=900&h=600&fit=crop',
])

const ASSET_IMAGE_POOLS: Record<AssetType, string[]> = {
  real_estate: [
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=900&h=600&fit=crop&q=85',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&h=600&fit=crop&q=85',
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=900&h=600&fit=crop&q=85',
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=900&h=600&fit=crop&q=85',
    'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=900&h=600&fit=crop&q=85',
    'https://images.unsplash.com/photo-1583418855144-b6eae5cc4649?w=900&h=600&fit=crop&q=85',
    'https://images.unsplash.com/photo-1416331108676-a22ccb276e35?w=900&h=600&fit=crop&q=85',
    'https://images.unsplash.com/photo-1559494007-9f5847c49d94?w=900&h=600&fit=crop&q=85',
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=900&h=600&fit=crop&q=85',
    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=900&h=600&fit=crop&q=85',
    'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=900&h=600&fit=crop&q=85',
    'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=900&h=600&fit=crop&q=85',
  ],
  car: [
    'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=900&h=600&fit=crop&q=85',
    'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?w=900&h=600&fit=crop&q=85',
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=900&h=600&fit=crop&q=85',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&h=600&fit=crop&q=85',
    'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=900&h=600&fit=crop&q=85',
    'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=900&h=600&fit=crop&q=85',
    'https://images.unsplash.com/photo-1542362567-b07e54358753?w=900&h=600&fit=crop&q=85',
    'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=900&h=600&fit=crop&q=85',
    'https://images.unsplash.com/photo-1526726538690-5cbf956ae2fd?w=900&h=600&fit=crop&q=85',
    'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=900&h=600&fit=crop&q=85',
  ],
  jet: [
    'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=900&h=600&fit=crop&q=85',
    'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=900&h=600&fit=crop&q=85',
    'https://images.unsplash.com/photo-1474302770737-173ee21bab63?w=900&h=600&fit=crop&q=85',
    'https://images.unsplash.com/photo-1569930784542-c6e1e6ef7ad4?w=900&h=600&fit=crop&q=85',
  ],
  yacht: [
    'https://images.unsplash.com/photo-1605281317010-fe5ffe798166?w=900&h=600&fit=crop&q=85',
    'https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?w=900&h=600&fit=crop&q=85',
    'https://images.unsplash.com/photo-1505916349660-8d91a99f8901?w=900&h=600&fit=crop&q=85',
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=900&h=600&fit=crop&q=85',
    'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=900&h=600&fit=crop&q=85',
  ],
  watch: [
    'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=900&h=600&fit=crop&q=85',
    'https://images.unsplash.com/photo-1620625515032-6ed0c1790c75?w=900&h=600&fit=crop&q=85',
    'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=900&h=600&fit=crop&q=85',
    'https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?w=900&h=600&fit=crop&q=85',
  ],
  art: [
    'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=900&h=600&fit=crop&q=85',
    'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=900&h=600&fit=crop&q=85',
    'https://images.unsplash.com/photo-1533158628620-7e4d40ef1be5?w=900&h=600&fit=crop&q=85',
    'https://images.unsplash.com/photo-1549490349-8643362247b5?w=900&h=600&fit=crop&q=85',
  ],
  helicopter: [
    'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=900&h=600&fit=crop&q=85',
    'https://images.unsplash.com/photo-1609587312208-cea54be969e7?w=900&h=600&fit=crop&q=85',
  ],
  island: [
    'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=900&h=600&fit=crop&q=85',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&h=600&fit=crop&q=85',
    'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=900&h=600&fit=crop&q=85',
  ],
  sports_team: [
    'https://images.unsplash.com/photo-1565620731385-539de3f57112?w=900&h=600&fit=crop&q=85',
    'https://images.unsplash.com/photo-1598891562936-6e1a75a24d93?w=900&h=600&fit=crop&q=85',
    'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=900&h=600&fit=crop&q=85',
  ],
  rocket: [
    'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=900&h=600&fit=crop&q=85',
    'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=900&h=600&fit=crop&q=85',
  ],
}

/** Simple djb2-style hash → stable index into the pool for a given asset ID */
function hashId(id: string): number {
  let h = 5381
  for (let i = 0; i < id.length; i++) h = ((h << 5) + h) ^ id.charCodeAt(i)
  return Math.abs(h)
}

/**
 * Returns the best image URL for an asset.
 * Priority:
 *  1. asset.images[0]    — enriched by enrich_assets.py (brand-validated, high-res)
 *  2. assetPhotosCache   — legacy SearchAPI per-asset cache
 *  3. asset.image        — hardcoded URL (if not a known repeated placeholder)
 *  4. Diverse pool       — deterministic per-type fallback
 */
export function getAssetImage(asset: Asset): string {
  // 1. Prefer the enriched images array (strict brand-validated, up to 3 URLs)
  if (asset.images && asset.images.length > 0) return asset.images[0]

  // 2. Use the legacy SearchApi-fetched photo if available
  const apiCache = getStore().assetPhotosCache as Record<string, AssetCacheEntry>
  const cached = apiCache[asset.id]
  if (cached) return typeof cached === 'string' ? cached : cached.url

  // 3. Use the hardcoded image if it's not one of the known repeated placeholders
  if (asset.image && !REPEATED_URLS.has(asset.image)) return asset.image

  // 4. Deterministically pick from the diverse per-type pool
  const pool = ASSET_IMAGE_POOLS[asset.type] ?? ASSET_IMAGE_POOLS.real_estate
  return pool[hashId(asset.id) % pool.length]
}

