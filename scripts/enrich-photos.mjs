#!/usr/bin/env node
/**
 * enrich-photos.mjs
 *
 * Enriches celebrity avatar / photo URLs by chaining three sources:
 *   1. Wikipedia REST API  (api/rest_v1/page/summary)
 *   2. Wikipedia Search API (w/api.php search → summary)
 *   3. TMDb person search   (api.themoviedb.org/3/search/person)
 *
 * Writes results to src/data/photosCache.json  { [celebrity-id]: string }
 * The app reads this file at startup and uses it to override avatar URLs.
 *
 * Usage:
 *   node scripts/enrich-photos.mjs            # enrich all
 *   node scripts/enrich-photos.mjs --limit 50 # enrich first 50 (useful for testing)
 *
 * Requires:  TMDB_READ_ACCESS_TOKEN in .env (or exported in shell)
 * Node 18+   (uses built-in fetch)
 */

import { readFileSync, writeFileSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')

// ── Load .env manually (no dotenv dependency needed) ──────────────────────────
const envPath = resolve(ROOT, '.env')
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    const val = trimmed.slice(eq + 1).trim().replace(/^['"]|['"]$/g, '')
    if (!process.env[key]) process.env[key] = val
  }
}

const TMDB_TOKEN = process.env.TMDB_READ_ACCESS_TOKEN
if (!TMDB_TOKEN) {
  console.error('❌  TMDB_READ_ACCESS_TOKEN not set. Add it to .env')
  process.exit(1)
}

const TMDB_IMG = 'https://image.tmdb.org/t/p/w400'
const CACHE_PATH = resolve(ROOT, 'src/data/photosCache.json')

// ── Parse celebrity list from TypeScript source files ─────────────────────────
function extractCelebrities(source) {
  const celebrities = []

  // Match: id: 'some-id', ... name: 'Some Name'  (within ~500 chars of each other)
  // Works for both object literal style and mk() call style
  const idNameRegex = /id:\s*['"]([^'"]+)['"][\s\S]{0,400}?name:\s*['"]([^'"]+)['"]/g
  let m
  while ((m = idNameRegex.exec(source)) !== null) {
    const [, id, name] = m
    // Skip asset IDs (they contain hyphens and asset keywords)
    if (/-(jet|car|yacht|house|watch|art|heli|island|sport|rocket|main|estate|asset|ring|villa|plane|tower|penthouse|condo|manor|castle|ranch|compound|1|2|3)/.test(id)) continue
    celebrities.push({ id, name })
  }

  // Also match mk() helper calls: mk('id', 'Name', ...)
  const mkRegex = /mk\(\s*['"]([^'"]+)['"]\s*,\s*['"]([^'"]+)['"]/g
  while ((m = mkRegex.exec(source)) !== null) {
    const [, id, name] = m
    celebrities.push({ id, name })
  }

  // Deduplicate by id
  const seen = new Set()
  return celebrities.filter(c => {
    if (seen.has(c.id)) return false
    seen.add(c.id)
    return true
  })
}

// ── Fetch helpers ──────────────────────────────────────────────────────────────
async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms))
}

async function safeFetch(url, opts = {}) {
  try {
    const r = await fetch(url, { ...opts, signal: AbortSignal.timeout(8000) })
    if (!r.ok) return null
    return r.json()
  } catch {
    return null
  }
}

function isGenericUrl(url) {
  return !url || url.includes('ui-avatars.com') || url.includes('placeholder')
}

// ── Source 1: Wikipedia REST summary ──────────────────────────────────────────
async function fromWikipediaRest(name) {
  const slug = encodeURIComponent(name.replace(/ /g, '_'))
  const data = await safeFetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${slug}`)
  return data?.thumbnail?.source || data?.originalimage?.source || null
}

// ── Source 2: Wikipedia Search → first result → summary ───────────────────────
async function fromWikipediaSearch(name) {
  const params = new URLSearchParams({
    action: 'query',
    list: 'search',
    srsearch: name,
    srlimit: '1',
    format: 'json',
    origin: '*',
  })
  const data = await safeFetch(`https://en.wikipedia.org/w/api.php?${params}`)
  const title = data?.query?.search?.[0]?.title
  if (!title) return null
  const slug = encodeURIComponent(title.replace(/ /g, '_'))
  const summary = await safeFetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${slug}`)
  return summary?.thumbnail?.source || summary?.originalimage?.source || null
}

// ── Source 3: TMDb person search ───────────────────────────────────────────────
async function fromTmdb(name) {
  const params = new URLSearchParams({ query: name, include_adult: 'false', language: 'en-US' })
  const data = await safeFetch(
    `https://api.themoviedb.org/3/search/person?${params}`,
    { headers: { Authorization: `Bearer ${TMDB_TOKEN}`, Accept: 'application/json' } }
  )
  const person = data?.results?.[0]
  if (!person?.profile_path) return null
  return `${TMDB_IMG}${person.profile_path}`
}

// ── Main enrichment chain ──────────────────────────────────────────────────────
async function enrichOne(name) {
  // TMDb-first (Wikipedia is blocked in this environment)
  const url = await fromTmdb(name)
  if (url) return { url, source: 'tmdb' }

  return null
}

// ── CLI arg parsing ────────────────────────────────────────────────────────────
const args = process.argv.slice(2)
const limitIdx = args.indexOf('--limit')
const limit = limitIdx !== -1 ? parseInt(args[limitIdx + 1], 10) : Infinity
const forceAll = args.includes('--force') // re-fetch even already-cached entries

// ── Load existing cache ────────────────────────────────────────────────────────
const cache = existsSync(CACHE_PATH)
  ? JSON.parse(readFileSync(CACHE_PATH, 'utf8'))
  : {}

// ── Load celebrity list from source files ─────────────────────────────────────
const sources = [
  resolve(ROOT, 'src/data/celebrities.ts'),
  resolve(ROOT, 'src/data/extraCelebrities.ts'),
]

let celebrities = []
for (const src of sources) {
  if (existsSync(src)) {
    celebrities.push(...extractCelebrities(readFileSync(src, 'utf8')))
  }
}

// Deduplicate across files
const seen = new Set()
celebrities = celebrities.filter(c => {
  if (seen.has(c.id)) return false
  seen.add(c.id)
  return true
})

console.log(`📋  Found ${celebrities.length} celebrities across source files`)

// Filter to only those needing enrichment (unless --force)
const toEnrich = celebrities.filter(c => forceAll || !cache[c.id]).slice(0, limit)
console.log(`🔍  Enriching ${toEnrich.length} celebrities…\n`)

// ── Run enrichment ─────────────────────────────────────────────────────────────
let updated = 0
let fromWikiRest = 0
let fromWikiSearch = 0
let fromTmdbCount = 0
let failed = 0

for (let i = 0; i < toEnrich.length; i++) {
  const { id, name } = toEnrich[i]
  const result = await enrichOne(name)

  if (result) {
    cache[id] = result.url
    updated++
    if (result.source === 'wikipedia-rest') fromWikiRest++
    else if (result.source === 'wikipedia-search') fromWikiSearch++
    else fromTmdbCount++
    process.stdout.write(`  ✅  [${i + 1}/${toEnrich.length}] ${name.padEnd(30)} → ${result.source}\n`)
  } else {
    failed++
    process.stdout.write(`  ⚠️   [${i + 1}/${toEnrich.length}] ${name.padEnd(30)} → not found\n`)
  }

  // Polite rate limiting: 150ms between requests
  if (i < toEnrich.length - 1) await sleep(150)

  // Save progress every 25 entries
  if ((i + 1) % 25 === 0) {
    writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2))
    console.log(`  💾  Progress saved (${i + 1} processed)`)
  }
}

// ── Final save ─────────────────────────────────────────────────────────────────
writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2))

console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅  Done — ${updated} / ${toEnrich.length} updated
   Wikipedia REST:   ${fromWikiRest}
   Wikipedia Search: ${fromWikiSearch}
   TMDb:             ${fromTmdbCount}
   Not found:        ${failed}
   Cache total:      ${Object.keys(cache).length} entries
   Written to:       src/data/photosCache.json
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`)
