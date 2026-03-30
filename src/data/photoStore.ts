/**
 * photoStore.ts — runtime photo cache loader
 *
 * Moves the three large JSON data files (~542 KB) out of the JS bundle by
 * fetching them from /data/ at startup.  getAvatar() / getAssetImage() read
 * from this store instead of static imports.
 */

interface CelebPhoto { image: string; photo_source?: string }
export type AssetCacheEntry = { url: string; thumbnail: string } | string

interface Store {
  photosCache:     Record<string, string>
  celebsPhotos:    Record<string, CelebPhoto>
  assetPhotosCache: Record<string, AssetCacheEntry>
}

const store: Store = { photosCache: {}, celebsPhotos: {}, assetPhotosCache: {} }

/** URL domains that frequently expire / block hotlinking — skip these and
 *  fall through to the celebsPhotos / hardcoded avatar fallback. */
const UNRELIABLE = [
  'lookaside.instagram.com',
  'lookaside.fbsbx.com',
  'scontent.',           // Facebook CDN
]

export function isReliableUrl(url: string): boolean {
  if (!url || url.length < 20) return false
  return !UNRELIABLE.some(d => url.includes(d))
}

export function getStore(): Store { return store }

/** Fetch all three caches in parallel.  Call this before mounting React. */
export async function initPhotoStore(): Promise<void> {
  const base = import.meta.env.BASE_URL   // e.g. '/wealthexplorer/'
  try {
    const [pc, cp, apc] = await Promise.all([
      fetch(`${base}data/photosCache.json`).then(r => r.json()),
      fetch(`${base}data/celebs_photos.json`).then(r => r.json()),
      fetch(`${base}data/assetPhotosCache.json`).then(r => r.json()),
    ])
    store.photosCache      = pc
    store.celebsPhotos     = cp
    store.assetPhotosCache = apc
  } catch (e) {
    console.warn('[photoStore] failed to load photo caches:', e)
  }
}
