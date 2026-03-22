#!/usr/bin/env node
/**
 * fetch-images-curl.mjs
 * Uses curl instead of fetch to bypass Node.js network issues.
 * Populates src/data/assetPhotosCache.json with real images from SearchAPI.io.
 */
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { execSync } from 'child_process'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const CACHE_PATH = resolve(ROOT, 'src/data/assetPhotosCache.json')
const SEARCHAPI_KEY = process.env.SEARCHAPI_KEY || 'HfKbPSqtWRDFkc7ZbAYtdL5A'
const ANTI_AI = '-ai -generated -midjourney -dalle -render -illustration'

function fetchImage(celebrity, assetName) {
  const q = encodeURIComponent(`${celebrity} ${assetName} real photo spotted ${ANTI_AI}`)
  const url = `https://www.searchapi.io/api/v1/search?engine=google_images&q=${q}&num=3&api_key=${SEARCHAPI_KEY}`
  try {
    const raw = execSync(`curl -s --max-time 15 "${url}"`, { encoding: 'utf8' })
    const data = JSON.parse(raw)
    const images = data?.images_results ?? data?.inline_images ?? data?.images ?? []
    if (!images.length) return null
    const img = images[0]
    const originalLink = img.original?.link ?? img.original_url ?? img.link ?? ''
    const thumbnail = img.thumbnail ?? originalLink
    let source = ''
    try { source = new URL(img.source?.link ?? originalLink).hostname } catch {}
    return { url: originalLink, thumbnail, source, title: img.title ?? '' }
  } catch (e) {
    console.error(`  Error: ${e.message}`)
    return null
  }
}

// Load existing cache
const cache = existsSync(CACHE_PATH) ? JSON.parse(readFileSync(CACHE_PATH, 'utf8')) : {}

// Collect all assets from the compiled data
const { celebrities } = await import('../src/data/celebrities.ts')

const args = process.argv.slice(2)
const force = args.includes('--force')
const limitI = args.indexOf('--limit'); const limit = limitI !== -1 ? parseInt(args[limitI+1]) : Infinity
const idI = args.indexOf('--id'); const onlyId = idI !== -1 ? args[idI+1] : null

const allAssets = []
for (const c of celebrities) {
  for (const a of c.assets ?? []) {
    allAssets.push({ assetId: a.id, celebrity: c.name, assetName: a.name })
  }
}

let toEnrich = allAssets.filter(a => {
  if (onlyId) return a.assetId === onlyId
  if (force) return true
  return !cache[a.assetId]
}).slice(0, limit)

// Deduplicate by assetId (same asset can belong to multiple entries due to spread)
const seen = new Set()
toEnrich = toEnrich.filter(a => { if (seen.has(a.assetId)) return false; seen.add(a.assetId); return true })

console.log(`\n🔍  Asset Image Enricher (curl mode)`)
console.log(`   Assets to enrich: ${toEnrich.length}\n`)

let ok = 0, failed = 0
for (let i = 0; i < toEnrich.length; i++) {
  const { assetId, celebrity, assetName } = toEnrich[i]
  const label = `[${i+1}/${toEnrich.length}] ${celebrity} — ${assetName}`
  const result = fetchImage(celebrity, assetName)
  if (result && result.url) {
    cache[assetId] = result
    ok++
    console.log(`  ✅  ${label.padEnd(58)} ${result.source}`)
  } else {
    failed++
    console.log(`  ⚠️   ${label.padEnd(58)} not found`)
  }
  if (i < toEnrich.length - 1) await new Promise(r => setTimeout(r, 400))
  if ((i+1) % 10 === 0) { writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2)); console.log(`  💾  Saved (${i+1} done)`) }
}

writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2))
console.log(`\n✅  Done — enriched: ${ok}, failed: ${failed}, cache: ${Object.keys(cache).length} total`)
