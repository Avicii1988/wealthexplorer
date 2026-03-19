#!/usr/bin/env node
/**
 * fetch-profiles.mjs
 * ──────────────────
 * Pulls celebrity profiles from public APIs and merges them into
 * src/data/generatedProfiles.json  (imported by extraCelebrities.ts)
 *
 * Usage:
 *   node scripts/fetch-profiles.mjs
 *
 * Cron (run nightly at 02:00):
 *   0 2 * * * cd /path/to/wealthexplorer && node scripts/fetch-profiles.mjs >> logs/fetch.log 2>&1
 *
 * GitHub Actions (add to .github/workflows/fetch-profiles.yml):
 *   schedule:
 *     - cron: '0 2 * * *'
 *   steps:
 *     - uses: actions/checkout@v4
 *     - run: node scripts/fetch-profiles.mjs
 *     - run: git add src/data/generatedProfiles.json && git commit -m "chore: update profiles" || true
 *     - run: git push
 *
 * Environment variables (set in .env or CI secrets):
 *   TMDB_API_KEY     — The Movie Database API key (free at themoviedb.org)
 *   RAPID_API_KEY    — RapidAPI key for sports/celebrity data endpoints
 *
 * Target: up to 5,000 profiles across all categories.
 */

import fs   from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname  = path.dirname(fileURLToPath(import.meta.url))
const OUT_FILE   = path.join(__dirname, '../src/data/generatedProfiles.json')
const MAX_PROFILES = 5000

// ── Helpers ────────────────────────────────────────────────────────────────
async function fetchJSON(url, headers = {}) {
  const res = await fetch(url, { headers })
  if (!res.ok) throw new Error(`HTTP ${res.status} ${url}`)
  return res.json()
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function toCategory(dept) {
  if (!dept) return 'Entrepreneurs'
  const d = dept.toLowerCase()
  if (d.includes('act') || d.includes('direct') || d.includes('film'))   return 'Actors'
  if (d.includes('music') || d.includes('sound') || d.includes('sing'))  return 'Musicians'
  return 'Actors'
}

// ── Source 1: TMDb — actors & directors ──────────────────────────────────
async function fetchTMDbPeople(apiKey, maxPages = 50) {
  const results = []
  for (let page = 1; page <= maxPages; page++) {
    try {
      const data = await fetchJSON(
        `https://api.themoviedb.org/3/person/popular?api_key=${apiKey}&language=en-US&page=${page}`
      )
      for (const p of data.results ?? []) {
        results.push({
          id:          slugify(p.name),
          name:        p.name,
          category:    toCategory(p.known_for_department),
          netWorth:    0.01,   // placeholder — enrich separately
          avatar:      p.profile_path
            ? `https://image.tmdb.org/t/p/w400${p.profile_path}`
            : `https://ui-avatars.com/api/?name=${encodeURIComponent(p.name)}&background=1a1a1a&color=c9a84c&size=200&bold=true`,
          coverImage:  'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&q=80',
          nationality: 'American',
          bio:         `${p.name} is a popular public figure known for their work in entertainment.`,
          trending:    p.popularity > 50,
          birthdate:   'Unknown',
          birthplace:  'Unknown',
          gender:      p.gender === 1 ? 'Female' : 'Male',
          height:      '5 ft 10 in',
          profession:  p.known_for_department ?? 'Actor',
          photos:      p.profile_path ? [`https://image.tmdb.org/t/p/w400${p.profile_path}`] : [],
          assets:      [],
          gossip:      [],
          relationships: {},
        })
      }
      if (page % 10 === 0) process.stdout.write(`  TMDb: fetched page ${page}/${maxPages}\n`)
      await sleep(250)  // respect rate limits
    } catch (err) {
      process.stderr.write(`  TMDb page ${page} error: ${err.message}\n`)
      break
    }
  }
  return results
}

// ── Source 2: Wikipedia — politicians & entrepreneurs (Wikidata SPARQL) ──
async function fetchWikidataPersons(category, limit = 500) {
  const categoryMap = {
    Politicians:   'Q82955',   // politician
    Entrepreneurs: 'Q131524',  // entrepreneur
    Athletes:      'Q2066131', // athlete
    Models:        'Q4610556', // model
  }
  const qid = categoryMap[category] ?? 'Q82955'
  const sparql = `
    SELECT DISTINCT ?item ?name ?image WHERE {
      ?item wdt:P31 wd:Q5 .
      ?item wdt:P106 wd:${qid} .
      ?item wdt:P569 ?birth .
      ?item rdfs:label ?name FILTER(LANG(?name)="en") .
      OPTIONAL { ?item wdt:P18 ?image }
      FILTER(YEAR(?birth) > 1940)
    } LIMIT ${limit}
  `
  const url = `https://query.wikidata.org/sparql?query=${encodeURIComponent(sparql)}&format=json`
  try {
    const data = await fetchJSON(url, { 'User-Agent': 'WealthExplorer/1.0 (fetch-profiles.mjs)' })
    return (data.results?.bindings ?? []).map(b => ({
      id:          slugify(b.name.value),
      name:        b.name.value,
      category,
      netWorth:    0.005,
      avatar:      b.image?.value ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(b.name.value)}&background=1a1a1a&color=c9a84c&size=200&bold=true`,
      coverImage:  'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=1200&q=80',
      nationality: 'Unknown',
      bio:         `${b.name.value} is a notable ${category.slice(0, -1).toLowerCase()}.`,
      trending:    false,
      birthdate:   'Unknown',
      birthplace:  'Unknown',
      gender:      'Male',
      height:      '5 ft 10 in',
      profession:  category.slice(0, -1),
      photos:      b.image?.value ? [b.image.value] : [],
      assets:      [],
      gossip:      [],
      relationships: {},
    }))
  } catch (err) {
    process.stderr.write(`  Wikidata ${category} error: ${err.message}\n`)
    return []
  }
}

// ── Deduplication ──────────────────────────────────────────────────────────
function deduplicate(profiles) {
  const seen = new Set()
  return profiles.filter(p => {
    if (seen.has(p.id)) return false
    seen.add(p.id)
    return true
  })
}

// ── Load existing generated profiles (preserve manual edits) ─────────────
async function loadExisting() {
  try {
    const raw = await fs.readFile(OUT_FILE, 'utf8')
    return JSON.parse(raw)
  } catch {
    return []
  }
}

// ── Main ───────────────────────────────────────────────────────────────────
async function main() {
  const tmdbKey   = process.env.TMDB_API_KEY
  const startTime = Date.now()

  console.log('══════════════════════════════════════════')
  console.log('  Wealth Explorer — Profile Fetcher')
  console.log(`  Target: up to ${MAX_PROFILES} profiles`)
  console.log('══════════════════════════════════════════')

  const existing = await loadExisting()
  console.log(`Loaded ${existing.length} existing generated profiles.`)

  const fresh = []

  // TMDb actors (requires API key)
  if (tmdbKey) {
    console.log('\n[1/5] Fetching actors from TMDb...')
    const tmdb = await fetchTMDbPeople(tmdbKey, 100)
    console.log(`  → ${tmdb.length} people fetched`)
    fresh.push(...tmdb)
  } else {
    console.log('\n[1/5] Skipping TMDb (TMDB_API_KEY not set)')
  }

  // Wikidata — politicians, entrepreneurs, athletes, models
  for (const [i, cat] of ['Politicians', 'Entrepreneurs', 'Athletes', 'Models'].entries()) {
    console.log(`\n[${i + 2}/5] Fetching ${cat} from Wikidata...`)
    const wd = await fetchWikidataPersons(cat, 300)
    console.log(`  → ${wd.length} people fetched`)
    fresh.push(...wd)
    await sleep(1000) // be kind to Wikidata
  }

  // Merge: existing IDs take priority (preserve enriched data)
  const existingIds = new Set(existing.map(p => p.id))
  const merged      = [
    ...existing,
    ...fresh.filter(p => !existingIds.has(p.id)),
  ]

  const final = deduplicate(merged).slice(0, MAX_PROFILES)
  console.log(`\nTotal after merge + dedup: ${final.length} profiles`)

  await fs.writeFile(OUT_FILE, JSON.stringify(final, null, 2), 'utf8')
  console.log(`\n✓ Written to ${path.relative(process.cwd(), OUT_FILE)}`)
  console.log(`  Time: ${((Date.now() - startTime) / 1000).toFixed(1)}s`)
  console.log('══════════════════════════════════════════')
}

main().catch(err => { console.error('Fatal:', err); process.exit(1) })
