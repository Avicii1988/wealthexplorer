#!/usr/bin/env python3
"""
fetch-photos.py
Uses subprocess curl (not Node fetch) to populate src/data/photosCache.json via TMDb.
Usage: python3 scripts/fetch-photos.py [--limit N] [--force]
"""
import json, os, re, subprocess, sys, time
from pathlib import Path
from urllib.parse import quote

ROOT = Path(__file__).parent.parent
CACHE_PATH = ROOT / "src/data/photosCache.json"
TMDB_IMG = "https://image.tmdb.org/t/p/w400"

# Load .env
env_path = ROOT / ".env"
if env_path.exists():
    for line in env_path.read_text().splitlines():
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        if "=" in line:
            k, _, v = line.partition("=")
            v = v.strip().strip("'\"")
            os.environ.setdefault(k.strip(), v)

TMDB_TOKEN = os.environ.get("TMDB_READ_ACCESS_TOKEN", "")
if not TMDB_TOKEN:
    print("❌  TMDB_READ_ACCESS_TOKEN not set")
    sys.exit(1)

# CLI args
args = sys.argv[1:]
limit = int(args[args.index("--limit") + 1]) if "--limit" in args else 999999
force = "--force" in args

# Extract celebrities from TS source files
ASSET_KEYWORDS = re.compile(r"-(jet|car|yacht|house|watch|art|heli|island|sport|rocket|main|estate|asset|ring|villa|plane|tower|penthouse|condo|manor|castle|ranch|compound|\d+)")

def extract_celebs(src: str):
    celebs = []
    # id/name object style
    for m in re.finditer(r"id:\s*['\"]([^'\"]+)['\"][\s\S]{0,400}?name:\s*['\"]([^'\"]+)['\"]", src):
        cid, name = m.group(1), m.group(2)
        if not ASSET_KEYWORDS.search(cid):
            celebs.append({"id": cid, "name": name})
    # mk() call style
    for m in re.finditer(r"mk\(\s*'([^']+)'\s*,\s*'([^']+)'", src):
        celebs.append({"id": m.group(1), "name": m.group(2)})
    return celebs

all_celebs = []
seen_ids: set = set()
for src_file in [ROOT / "src/data/celebrities.ts", ROOT / "src/data/extraCelebrities.ts"]:
    if src_file.exists():
        for c in extract_celebs(src_file.read_text()):
            if c["id"] not in seen_ids:
                seen_ids.add(c["id"])
                all_celebs.append(c)

print(f"📋  Found {len(all_celebs)} celebrities")

# Load existing cache
cache = json.loads(CACHE_PATH.read_text()) if CACHE_PATH.exists() else {}

# Filter
to_enrich = [c for c in all_celebs if force or c["id"] not in cache][:limit]
print(f"🔍  Enriching {len(to_enrich)} celebrities…\n")

def tmdb_search(name: str):
    url = f"https://api.themoviedb.org/3/search/person?query={quote(name)}&include_adult=false&language=en-US"
    try:
        result = subprocess.run(
            ["curl", "-s", "--max-time", "8",
             "-H", f"Authorization: Bearer {TMDB_TOKEN}",
             "-H", "Accept: application/json",
             url],
            capture_output=True, text=True, timeout=12
        )
        data = json.loads(result.stdout)
        results = data.get("results", [])
        if results and results[0].get("profile_path"):
            return TMDB_IMG + results[0]["profile_path"]
    except Exception as e:
        pass
    return None

updated = 0
failed = 0

for i, celeb in enumerate(to_enrich):
    url = tmdb_search(celeb["name"])
    if url:
        cache[celeb["id"]] = url
        updated += 1
        print(f"  ✅  [{i+1}/{len(to_enrich)}] {celeb['name']:<30} → tmdb")
    else:
        failed += 1
        print(f"  ⚠️   [{i+1}/{len(to_enrich)}] {celeb['name']:<30} → not found")

    time.sleep(0.15)

    if (i + 1) % 50 == 0:
        CACHE_PATH.write_text(json.dumps(cache, indent=2))
        print(f"  💾  Progress saved ({i+1} processed)")

CACHE_PATH.write_text(json.dumps(cache, indent=2))
print(f"""
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅  Done — {updated} found, {failed} not found
   Cache total: {len(cache)} entries
   Written to:  src/data/photosCache.json
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━""")
