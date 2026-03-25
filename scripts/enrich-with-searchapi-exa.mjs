#!/usr/bin/env node
/**
 * enrich-with-searchapi-exa.mjs
 *
 * Unified enrichment tool that uses SearchApi.io + Exa to enrich:
 *   1. Profile pictures  → src/data/photosCache.json
 *   2. Asset images      → src/data/assetPhotosCache.json
 *
 * Source priority for PROFILE PHOTOS:
 *   1. Exa neural search  (extracts og:image from Wikipedia, IMDb, biography pages)
 *   2. SearchApi Google Images (portrait-focused query)
 *   3. TMDb person search  (fallback)
 *
 * Source priority for ASSET IMAGES:
 *   1. SearchApi Google Images  (proven, anti-AI approach)
 *   2. Exa image-rich pages     (secondary enrichment)
 *
 * Covers ALL celebrities across:
 *   src/data/celebrities.ts
 *   src/data/extraCelebrities.ts
 *   src/data/extraCelebritiesExtended.ts
 *   src/data/extras_*.ts
 *
 * Usage:
 *   node scripts/enrich-with-searchapi-exa.mjs                   # fill all gaps
 *   node scripts/enrich-with-searchapi-exa.mjs --force           # re-fetch everything
 *   node scripts/enrich-with-searchapi-exa.mjs --photos-only     # profile photos only
 *   node scripts/enrich-with-searchapi-exa.mjs --assets-only     # asset images only
 *   node scripts/enrich-with-searchapi-exa.mjs --limit 20        # first 20 of each
 *   node scripts/enrich-with-searchapi-exa.mjs --id elon-musk    # single celebrity
 *
 * Requires:
 *   EXA_API_KEY            in .env  (get one at https://exa.ai)
 *   SEARCHAPI_KEY          in .env  (get one at https://searchapi.io)
 *   TMDB_READ_ACCESS_TOKEN in .env  (fallback for photos)
 */

import { readFileSync, writeFileSync, existsSync, readdirSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { execFile } from 'child_process'
import { promisify } from 'util'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const execFileAsync = promisify(execFile)

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

const SEARCHAPI_KEY   = process.env.SEARCHAPI_KEY || 'HfKbPSqtWRDFkc7ZbAYtdL5A'
const EXA_API_KEY     = process.env.EXA_API_KEY   || ''
const TMDB_TOKEN      = process.env.TMDB_READ_ACCESS_TOKEN || ''

const SEARCHAPI_BASE  = 'https://www.searchapi.io/api/v1/search'
const EXA_BASE        = 'https://api.exa.ai/search'
const TMDB_IMG        = 'https://image.tmdb.org/t/p/w400'

const PHOTOS_CACHE    = resolve(ROOT, 'src/data/photosCache.json')
const ASSETS_CACHE    = resolve(ROOT, 'src/data/assetPhotosCache.json')

// Anti-AI suffix for asset image queries
const ANTI_AI = 'real photo -ai -generated -midjourney -dalle -render -illustration'

// ── curl-based HTTP (works through env proxy) ──────────────────────────────────
async function curlGet(url, headers = {}) {
  const args = ['-s', '--max-time', '20', '--compressed']
  for (const [k, v] of Object.entries(headers)) {
    args.push('-H', `${k}: ${v}`)
  }
  args.push(url)
  try {
    const { stdout } = await execFileAsync('curl', args, { maxBuffer: 4 * 1024 * 1024 })
    if (!stdout.trim()) return null
    return JSON.parse(stdout)
  } catch {
    return null
  }
}

async function curlPost(url, body, headers = {}) {
  const args = [
    '-s', '--max-time', '20', '--compressed',
    '-X', 'POST',
    '-H', 'Content-Type: application/json',
  ]
  for (const [k, v] of Object.entries(headers)) {
    args.push('-H', `${k}: ${v}`)
  }
  args.push('-d', JSON.stringify(body))
  args.push(url)
  try {
    const { stdout } = await execFileAsync('curl', args, { maxBuffer: 4 * 1024 * 1024 })
    if (!stdout.trim()) return null
    return JSON.parse(stdout)
  } catch {
    return null
  }
}

// ── Helpers ────────────────────────────────────────────────────────────────────
const sleep = ms => new Promise(r => setTimeout(r, ms))

function isValidImageUrl(url) {
  if (!url || typeof url !== 'string') return false
  if (url.includes('ui-avatars.com')) return false
  if (url.includes('placeholder')) return false
  if (url.includes('data:image')) return false
  return url.startsWith('http')
}

// ── PROFILE PHOTO SOURCES ──────────────────────────────────────────────────────

/**
 * Source 1: Exa neural search
 * Searches Wikipedia/IMDb/biography pages and extracts the og:image
 * (portrait photo from page metadata).
 */
async function photoFromExa(name) {
  if (!EXA_API_KEY) return null

  const body = {
    query: `${name} celebrity profile photo biography`,
    numResults: 5,
    type: 'auto',
    useAutoprompt: false,
    includeDomains: [
      'en.wikipedia.org',
      'www.imdb.com',
      'www.britannica.com',
      'biography.com',
      'www.biography.com',
      'people.com',
      'www.forbes.com',
    ],
    contents: {
      summary: false,
      highlights: false,
    },
  }

  const data = await curlPost(EXA_BASE, body, { 'x-api-key': EXA_API_KEY })

  if (!data?.results?.length) return null

  // Prefer results with an image field (og:image set by page)
  for (const result of data.results) {
    const img = result.image
    if (!isValidImageUrl(img)) continue
    // Skip generic site logos / banners
    const lower = img.toLowerCase()
    if (lower.includes('logo') || lower.includes('banner') || lower.includes('icon')) continue
    return { url: img, source: 'exa', pageUrl: result.url }
  }
  return null
}

/**
 * Source 2: SearchApi Google Images — portrait search
 */
async function photoFromSearchApi(name) {
  const params = new URLSearchParams({
    engine: 'google_images',
    q: `${name} portrait photo`,
    num: '3',
    api_key: SEARCHAPI_KEY,
    safe: 'active',
  })

  const data = await curlGet(`${SEARCHAPI_BASE}?${params}`)
  // SearchApi may return results under 'images', 'images_results', or 'inline_images'
  const images = data?.images ?? data?.images_results ?? data?.inline_images ?? []
  if (!images.length) return null

  for (const img of images) {
    // Handle both flat and nested original URL formats
    const url = img.original?.link ?? img.original ?? img.original_url ?? img.link ?? ''
    if (isValidImageUrl(url)) {
      const thumb = img.thumbnail ?? url
      return { url, thumbnail: thumb, source: 'searchapi' }
    }
  }
  return null
}

/**
 * Source 3: TMDb person search (original fallback)
 */
async function photoFromTmdb(name) {
  if (!TMDB_TOKEN) return null
  const params = new URLSearchParams({ query: name, include_adult: 'false', language: 'en-US' })
  const data = await curlGet(
    `https://api.themoviedb.org/3/search/person?${params}`,
    { Authorization: `Bearer ${TMDB_TOKEN}`, Accept: 'application/json' }
  )
  const person = data?.results?.[0]
  if (!person?.profile_path) return null
  return { url: `${TMDB_IMG}${person.profile_path}`, source: 'tmdb' }
}

/**
 * Full profile photo enrichment chain: Exa → SearchApi → TMDb
 */
async function enrichProfilePhoto(name) {
  // 1. Try Exa (best quality og:images from authoritative pages)
  const fromExa = await photoFromExa(name)
  if (fromExa) return fromExa

  // 2. Try SearchApi Google Images
  const fromSearchApi = await photoFromSearchApi(name)
  if (fromSearchApi) return fromSearchApi

  // 3. TMDb fallback
  const fromTmdb = await photoFromTmdb(name)
  if (fromTmdb) return fromTmdb

  return null
}

// ── ASSET IMAGE SOURCES ────────────────────────────────────────────────────────

/**
 * Source 1: SearchApi Google Images (proven, anti-AI queries)
 */
async function assetFromSearchApi(celebrity, assetName) {
  const query = `${celebrity} ${assetName} ${ANTI_AI}`
  const params = new URLSearchParams({
    engine: 'google_images',
    q: query,
    num: '1',
    api_key: SEARCHAPI_KEY,
  })

  const data = await curlGet(`${SEARCHAPI_BASE}?${params}`)
  // Handle both flat and nested response formats
  const images = data?.images ?? data?.images_results ?? data?.inline_images ?? []
  if (!images.length) return null

  const first = images[0]
  // Handle nested original.link format
  const url = first.original?.link ?? first.original ?? first.original_url ?? first.link ?? ''
  if (!isValidImageUrl(url)) return null

  let source = ''
  try { source = new URL(first.source?.link ?? url).hostname } catch {}

  return {
    url,
    thumbnail: first.thumbnail ?? url,
    source,
    title: first.title ?? '',
    enrichedBy: 'searchapi',
  }
}

/**
 * Source 2: Exa — search for articles about the celebrity's asset
 * Extracts og:image from news articles and lifestyle pages.
 */
async function assetFromExa(celebrity, assetName) {
  if (!EXA_API_KEY) return null

  const body = {
    query: `${celebrity} ${assetName} real photo`,
    numResults: 5,
    type: 'auto',
    useAutoprompt: false,
    contents: {
      summary: false,
      highlights: false,
    },
  }

  const data = await curlPost(EXA_BASE, body, { 'x-api-key': EXA_API_KEY })
  if (!data?.results?.length) return null

  for (const result of data.results) {
    const img = result.image
    if (!isValidImageUrl(img)) continue
    const lower = img.toLowerCase()
    if (lower.includes('logo') || lower.includes('avatar') || lower.includes('icon')) continue

    let source = ''
    try { source = new URL(result.url).hostname } catch {}

    return {
      url: img,
      thumbnail: img,
      source,
      title: result.title ?? '',
      enrichedBy: 'exa',
    }
  }
  return null
}

/**
 * Full asset image enrichment chain: SearchApi → Exa
 */
async function enrichAssetImage(celebrity, assetName) {
  // 1. SearchApi Google Images (primary)
  const fromSearchApi = await assetFromSearchApi(celebrity, assetName)
  if (fromSearchApi) return fromSearchApi

  // 2. Exa neural search (secondary)
  const fromExa = await assetFromExa(celebrity, assetName)
  if (fromExa) return fromExa

  return null
}

// ── Extract celebrity data from TypeScript source files ────────────────────────
function extractCelebrities(source) {
  const celebs = []

  // id: 'some-id', ... name: 'Some Name'  (within ~500 chars)
  const idNameRegex = /id:\s*['"]([^'"]+)['"][\s\S]{0,400}?name:\s*['"]([^'"]+)['"]/g
  let m
  while ((m = idNameRegex.exec(source)) !== null) {
    const [, id, name] = m
    if (/-(jet|car|yacht|house|watch|art|heli|island|sport|rocket|main|estate|asset|ring|villa|plane|tower|penthouse|condo|manor|castle|ranch|compound|1|2|3)/.test(id)) continue
    celebs.push({ id, name })
  }

  // mk('id', 'Name', ...) helper calls
  const mkRegex = /mk\(\s*['"]([^'"]+)['"]\s*,\s*['"]([^'"]+)['"]/g
  while ((m = mkRegex.exec(source)) !== null) {
    const [, id, name] = m
    celebs.push({ id, name })
  }

  const seen = new Set()
  return celebs.filter(c => { if (seen.has(c.id)) return false; seen.add(c.id); return true })
}

// ── Load ALL source files ─────────────────────────────────────────────────────
function loadAllCelebrities() {
  const dataDir = resolve(ROOT, 'src/data')
  const sources = [
    resolve(dataDir, 'celebrities.ts'),
    resolve(dataDir, 'extraCelebrities.ts'),
    resolve(dataDir, 'extraCelebritiesExtended.ts'),
    ...readdirSync(dataDir)
      .filter(f => f.startsWith('extras_') && f.endsWith('.ts'))
      .sort()
      .map(f => resolve(dataDir, f)),
  ]

  let all = []
  for (const src of sources) {
    if (existsSync(src)) {
      all.push(...extractCelebrities(readFileSync(src, 'utf8')))
    }
  }

  const seen = new Set()
  return all.filter(c => { if (seen.has(c.id)) return false; seen.add(c.id); return true })
}

function loadAllAssets() {
  const mainFile = resolve(ROOT, 'src/data/celebrities.ts')
  if (!existsSync(mainFile)) return []

  const source = readFileSync(mainFile, 'utf8')
  const allAssets = []
  const seen = new Set()

  // Match celebrity blocks: find celebrity name first, then extract their assets
  const celebBlockRegex = /\{\s*id:\s*['"]([^'"]+)['"][\s\S]*?assets:\s*\[([\s\S]*?)\]/g
  let m
  while ((m = celebBlockRegex.exec(source)) !== null) {
    const [, celebId] = m
    if (/-(jet|car|yacht|house|watch|art|heli|island|sport|rocket)/.test(celebId)) continue

    const nameMatch = source.slice(m.index, m.index + 500).match(/name:\s*['"]([^'"]+)['"]/)
    const celebName = nameMatch?.[1] ?? celebId

    const assetRegex = /id:\s*['"]([^'"]+)['"]\s*,\s*type:\s*['"]([^'"]+)['"][^,]*,\s*name:\s*['"]([^'"]+)['"]/g
    const block = m[0]
    let a
    while ((a = assetRegex.exec(block)) !== null) {
      const [, id, type, name] = a
      const validTypes = ['jet', 'car', 'yacht', 'real_estate', 'watch', 'art', 'helicopter', 'island', 'sports_team', 'rocket']
      if (!validTypes.includes(type) || seen.has(id)) continue
      seen.add(id)
      allAssets.push({ id, type, name, celebrity: celebName })
    }
  }

  // Global scan for any missed assets
  const globalRegex = /id:\s*['"]([^'"]+)['"]\s*,\s*type:\s*['"]([^'"]+)['"]\s*,\s*name:\s*['"]([^'"]+)['"]/g
  while ((m = globalRegex.exec(source)) !== null) {
    const [, id, type, name] = m
    if (seen.has(id)) continue
    const validTypes = ['jet', 'car', 'yacht', 'real_estate', 'watch', 'art', 'helicopter', 'island', 'sports_team', 'rocket']
    if (!validTypes.includes(type)) continue
    seen.add(id)
    allAssets.push({ id, type, name, celebrity: id.split('-')[0].toUpperCase() })
  }

  return allAssets
}

// ── CLI ────────────────────────────────────────────────────────────────────────
const args         = process.argv.slice(2)
const force        = args.includes('--force')
const photosOnly   = args.includes('--photos-only')
const assetsOnly   = args.includes('--assets-only')
const limitIdx     = args.indexOf('--limit')
const limit        = limitIdx !== -1 ? parseInt(args[limitIdx + 1], 10) : Infinity
const singleIdx    = args.indexOf('--id')
const singleId     = singleIdx !== -1 ? args[singleIdx + 1] : null

// ── Load caches ────────────────────────────────────────────────────────────────
const photosCache = existsSync(PHOTOS_CACHE)
  ? JSON.parse(readFileSync(PHOTOS_CACHE, 'utf8'))
  : {}

const assetsCache = existsSync(ASSETS_CACHE)
  ? JSON.parse(readFileSync(ASSETS_CACHE, 'utf8'))
  : {}

// ── Print config ───────────────────────────────────────────────────────────────
console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Wealthscape Radar — Unified SearchApi + Exa Enricher
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Exa API key:     ${EXA_API_KEY ? '✅  set' : '⚠️   not set (EXA_API_KEY missing — Exa disabled)'}
  SearchApi key:   ${SEARCHAPI_KEY ? '✅  set' : '❌  not set'}
  TMDb token:      ${TMDB_TOKEN ? '✅  set' : '⚠️   not set (fallback disabled)'}
  Force re-fetch:  ${force}
  Mode:            ${photosOnly ? 'photos only' : assetsOnly ? 'assets only' : 'photos + assets'}
  Limit per type:  ${limit === Infinity ? 'none' : limit}
`)

// ════════════════════════════════════════════════════════
//  PHASE 1: PROFILE PHOTOS
// ════════════════════════════════════════════════════════
if (!assetsOnly) {
  const allCelebs = loadAllCelebrities()
  const toEnrich = allCelebs.filter(c => {
    if (singleId) return c.id === singleId
    return force ? true : !photosCache[c.id]
  }).slice(0, limit)

  console.log(`📸  Profile Photos`)
  console.log(`   Total celebrities: ${allCelebs.length}`)
  console.log(`   Missing photos:    ${allCelebs.filter(c => !photosCache[c.id]).length}`)
  console.log(`   To enrich now:     ${toEnrich.length}\n`)

  const photoStats = { exa: 0, searchapi: 0, tmdb: 0, failed: 0 }

  for (let i = 0; i < toEnrich.length; i++) {
    const { id, name } = toEnrich[i]
    const label = `[${i + 1}/${toEnrich.length}] ${name.padEnd(32)}`

    const result = await enrichProfilePhoto(name)

    if (result) {
      photosCache[id] = result.url
      const src = result.source
      photoStats[src === 'exa' ? 'exa' : src === 'searchapi' ? 'searchapi' : 'tmdb']++
      process.stdout.write(`  ✅  ${label} → ${src}\n`)
    } else {
      photoStats.failed++
      process.stdout.write(`  ⚠️   ${label} → not found\n`)
    }

    if (i < toEnrich.length - 1) await sleep(200)

    if ((i + 1) % 25 === 0) {
      writeFileSync(PHOTOS_CACHE, JSON.stringify(photosCache, null, 2))
      console.log(`  💾  Progress saved (${i + 1} processed)`)
    }
  }

  writeFileSync(PHOTOS_CACHE, JSON.stringify(photosCache, null, 2))

  console.log(`
  📊  Photo Results:
     Exa:         ${photoStats.exa}
     SearchApi:   ${photoStats.searchapi}
     TMDb:        ${photoStats.tmdb}
     Failed:      ${photoStats.failed}
     Cache total: ${Object.keys(photosCache).length}
`)
}

// ════════════════════════════════════════════════════════
//  PHASE 2: ASSET IMAGES
// ════════════════════════════════════════════════════════
if (!photosOnly) {
  const allAssets = loadAllAssets()
  const toEnrich = allAssets.filter(a => {
    if (singleId) return a.id === singleId
    return force ? true : !assetsCache[a.id]
  }).slice(0, limit)

  console.log(`🏠  Asset Images`)
  console.log(`   Total assets:      ${allAssets.length}`)
  console.log(`   Missing images:    ${allAssets.filter(a => !assetsCache[a.id]).length}`)
  console.log(`   To enrich now:     ${toEnrich.length}\n`)

  const assetStats = { searchapi: 0, exa: 0, failed: 0 }

  for (let i = 0; i < toEnrich.length; i++) {
    const { id, celebrity, name } = toEnrich[i]
    const label = `[${i + 1}/${toEnrich.length}] ${celebrity} — ${name}`.padEnd(60)

    const result = await enrichAssetImage(celebrity, name)

    if (result) {
      assetsCache[id] = result
      assetStats[result.enrichedBy === 'exa' ? 'exa' : 'searchapi']++
      process.stdout.write(`  ✅  ${label} ${result.source}\n`)
    } else {
      assetStats.failed++
      process.stdout.write(`  ⚠️   ${label} not found\n`)
    }

    if (i < toEnrich.length - 1) await sleep(300)

    if ((i + 1) % 10 === 0) {
      writeFileSync(ASSETS_CACHE, JSON.stringify(assetsCache, null, 2))
      console.log(`  💾  Progress saved (${i + 1} processed)`)
    }
  }

  writeFileSync(ASSETS_CACHE, JSON.stringify(assetsCache, null, 2))

  console.log(`
  📊  Asset Results:
     SearchApi:   ${assetStats.searchapi}
     Exa:         ${assetStats.exa}
     Failed:      ${assetStats.failed}
     Cache total: ${Object.keys(assetsCache).length}
`)
}

console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
console.log(`✅  Enrichment complete`)
console.log(`   Photos cache:  src/data/photosCache.json  (${Object.keys(photosCache).length} entries)`)
console.log(`   Assets cache:  src/data/assetPhotosCache.json  (${Object.keys(assetsCache).length} entries)`)
console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`)
