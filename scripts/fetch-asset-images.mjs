#!/usr/bin/env node
/**
 * fetch-asset-images.mjs
 *
 * High-efficiency image enrichment tool for the Celebrity Assets database.
 * Fetches exactly ONE authentic, real-world photo per celebrity asset using
 * the SearchApi.io Google Images engine.
 *
 * Anti-AI query engineering:
 *   "<celebrity> <asset> real photo spotted -ai -generated -midjourney -dalle -render -illustration"
 *
 * Output: src/data/assetPhotosCache.json  { [asset-id]: { url, thumbnail, source, title } }
 *
 * Usage:
 *   node scripts/fetch-asset-images.mjs              # enrich all missing assets
 *   node scripts/fetch-asset-images.mjs --force      # re-fetch all
 *   node scripts/fetch-asset-images.mjs --limit 20   # first 20 only
 *   node scripts/fetch-asset-images.mjs --id cristiano-ronaldo-bugatti  # single asset
 *
 * Requires: SEARCHAPI_KEY in .env (or env) — defaults to the project key.
 * Node 18+
 */

import { readFileSync, writeFileSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')

// ── Load .env ──────────────────────────────────────────────────────────────────
const envPath = resolve(ROOT, '.env')
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const t = line.trim()
    if (!t || t.startsWith('#')) continue
    const eq = t.indexOf('=')
    if (eq === -1) continue
    const key = t.slice(0, eq).trim()
    const val = t.slice(eq + 1).trim().replace(/^['"]|['"]$/g, '')
    if (!process.env[key]) process.env[key] = val
  }
}

const SEARCHAPI_KEY  = process.env.SEARCHAPI_KEY || 'HfKbPSqtWRDFkc7ZbAYtdL5A'
const SEARCHAPI_BASE = 'https://www.searchapi.io/api/v1/search'
const ASSET_CACHE    = resolve(ROOT, 'src/data/assetPhotosCache.json')

// ── Anti-AI search modifiers ───────────────────────────────────────────────────
const ANTI_AI_SUFFIX = 'real photo spotted -ai -generated -midjourney -dalle -render -illustration'

/**
 * Transform "Cristiano Ronaldo Bugatti" → the enriched query string.
 * Keeps the original terms and appends strict anti-AI negative keywords.
 */
function buildQuery(celebrity, asset) {
  const base = `${celebrity} ${asset}`.trim()
  return `${base} ${ANTI_AI_SUFFIX}`
}

// ── Core fetch function ────────────────────────────────────────────────────────
/**
 * Fetches exactly one authentic, real-world photo for a celebrity asset.
 *
 * @param {string} celebrity  - Celebrity name, e.g. "Cristiano Ronaldo"
 * @param {string} asset      - Asset name,     e.g. "Bugatti Chiron"
 * @returns {Promise<{url:string, thumbnail:string, source:string, title:string}|null>}
 */
export async function get_single_asset_image(celebrity, asset) {
  const query = buildQuery(celebrity, asset)

  const params = new URLSearchParams({
    engine: 'google_images',
    q:      query,
    num:    '1',           // ← credits optimisation: fetch exactly one result
    api_key: SEARCHAPI_KEY,
  })

  let response
  try {
    response = await fetch(`${SEARCHAPI_BASE}?${params}`, {
      signal: AbortSignal.timeout(12_000),
    })
  } catch (err) {
    console.error(`[fetch-asset-images] Network error for "${celebrity} ${asset}":`, err.message)
    return null
  }

  // ── Specific HTTP error handling ─────────────────────────────────────────────
  if (response.status === 401) {
    console.error('[fetch-asset-images] ❌ 401 Unauthorized — check your SEARCHAPI_KEY')
    return null
  }
  if (response.status === 429) {
    console.error('[fetch-asset-images] ⚠️  429 Rate Limited — pause and retry later')
    return null
  }
  if (!response.ok) {
    console.error(`[fetch-asset-images] HTTP ${response.status} for "${celebrity} ${asset}"`)
    return null
  }

  let data
  try {
    data = await response.json()
  } catch {
    console.error('[fetch-asset-images] Invalid JSON response')
    return null
  }

  const images = data?.images_results ?? data?.inline_images ?? []
  if (!images.length) {
    console.warn(`[fetch-asset-images] No images found for "${celebrity} ${asset}"`)
    return null
  }

  const first = images[0]

  // Derive a clean domain from the source URL
  let source = ''
  try {
    source = new URL(first.original_url ?? first.link ?? first.url ?? '').hostname
  } catch { /* ignore */ }

  return {
    url:       first.original    ?? first.original_url ?? first.link   ?? '',
    thumbnail: first.thumbnail   ?? first.original    ?? '',    // hotlink safety net
    source,
    title:     first.title ?? '',
  }
}

// ── React / HTML hotlink-safe image snippet (exported for documentation) ──────
export const HOTLINK_SAFE_SNIPPET = /* jsx */ `
/**
 * HotlinkSafeAssetImage — React component
 *
 * Renders the full-resolution original URL.
 * If the host blocks hotlinking (403) the onError handler instantly
 * swaps to the SearchApi thumbnail which is always served from Google's CDN.
 *
 * Usage:
 *   <HotlinkSafeAssetImage result={get_single_asset_image('Ronaldo', 'Bugatti')} />
 */
function HotlinkSafeAssetImage({ result, alt = '', className = '' }) {
  const [src, setSrc] = React.useState(result?.url)

  if (!result) return null

  return (
    <div
      style={{
        backgroundImage: \`url("\${result.thumbnail}")\`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      className={className}
    >
      <img
        src={src}
        alt={alt || result.title}
        className="w-full h-full object-cover"
        onError={() => {
          // Original host blocked hotlinking → fall back to Google thumbnail
          if (src !== result.thumbnail) setSrc(result.thumbnail)
        }}
      />
    </div>
  )
}

/* ── Plain HTML / vanilla JS equivalent ─────────────────────────────────────
<div
  style="background-image:url('THUMBNAIL_URL');background-size:cover"
>
  <img
    src="ORIGINAL_URL"
    alt="Asset photo"
    onerror="if(this.src!=='THUMBNAIL_URL') this.src='THUMBNAIL_URL'"
  />
</div>
─────────────────────────────────────────────────────────────────────────── */
`

// ── CLI entry point ────────────────────────────────────────────────────────────
async function main() {
  const args   = process.argv.slice(2)
  const force  = args.includes('--force')
  const limitI = args.indexOf('--limit')
  const limit  = limitI !== -1 ? parseInt(args[limitI + 1], 10) : Infinity
  const singleI = args.indexOf('--id')
  const singleId = singleI !== -1 ? args[singleI + 1] : null

  // Load existing cache
  const cache = existsSync(ASSET_CACHE)
    ? JSON.parse(readFileSync(ASSET_CACHE, 'utf8'))
    : {}

  // Collect all assets from source data files
  const { celebrities } = await import('../src/data/celebrities.ts').catch(() => ({ celebrities: [] }))

  // Build flat list of { assetId, celebrity, assetName }
  const allAssets = []
  for (const celeb of celebrities) {
    for (const asset of celeb.assets ?? []) {
      allAssets.push({ assetId: asset.id, celebrity: celeb.name, assetName: asset.name })
    }
  }

  // Filter to what needs enriching
  let toEnrich = allAssets.filter(a => {
    if (singleId) return a.assetId === singleId
    if (force) return true
    return !cache[a.assetId]
  }).slice(0, limit)

  console.log(`\n🔍  Celebrity Assets Image Enricher`)
  console.log(`   API: SearchApi.io · engine: google_images · num=1`)
  console.log(`   Anti-AI suffix: "${ANTI_AI_SUFFIX}"`)
  console.log(`   Assets to enrich: ${toEnrich.length}\n`)

  let ok = 0, skipped = 0, failed = 0

  for (let i = 0; i < toEnrich.length; i++) {
    const { assetId, celebrity, assetName } = toEnrich[i]
    const label = `[${i + 1}/${toEnrich.length}] ${celebrity} — ${assetName}`

    const result = await get_single_asset_image(celebrity, assetName)
    if (result) {
      cache[assetId] = result
      ok++
      process.stdout.write(`  ✅  ${label.padEnd(60)} ${result.source}\n`)
    } else {
      failed++
      process.stdout.write(`  ⚠️   ${label.padEnd(60)} not found\n`)
    }

    // Polite rate limiting
    if (i < toEnrich.length - 1) await new Promise(r => setTimeout(r, 300))

    // Save progress every 10 assets
    if ((i + 1) % 10 === 0) {
      writeFileSync(ASSET_CACHE, JSON.stringify(cache, null, 2))
      console.log(`  💾  Progress saved (${i + 1} processed)`)
    }
  }

  writeFileSync(ASSET_CACHE, JSON.stringify(cache, null, 2))

  console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅  Done
   Enriched:   ${ok}
   Failed:     ${failed}
   Cache total: ${Object.keys(cache).length} assets
   Written to:  src/data/assetPhotosCache.json
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`)
}

main().catch(err => {
  console.error('Fatal:', err)
  process.exit(1)
})
