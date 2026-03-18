#!/usr/bin/env bash
# fetch-photos-curl.sh
# Uses curl (not Node fetch) to populate src/data/photosCache.json via TMDb API
# Usage: bash scripts/fetch-photos-curl.sh [--limit N]

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CACHE="$ROOT/src/data/photosCache.json"
CELEB_LIST="/tmp/celeb_list.json"

# Load TMDB token from .env
if [ -f "$ROOT/.env" ]; then
  export $(grep -v '^#' "$ROOT/.env" | grep TMDB_READ_ACCESS_TOKEN | xargs)
fi

if [ -z "${TMDB_READ_ACCESS_TOKEN:-}" ]; then
  echo "❌  TMDB_READ_ACCESS_TOKEN not set"
  exit 1
fi

TMDB_IMG="https://image.tmdb.org/t/p/w400"
LIMIT="${2:-9999}"
if [ "${1:-}" = "--limit" ]; then
  LIMIT="$2"
fi

# Build celebrity list if not present
if [ ! -f "$CELEB_LIST" ]; then
  echo "📋  Building celebrity list…"
  node -e "
const {readFileSync, writeFileSync} = require('fs');
const extra = readFileSync('$ROOT/src/data/extraCelebrities.ts', 'utf8');
const core = readFileSync('$ROOT/src/data/celebrities.ts', 'utf8');
const mkRegex = /mk\(\s*'([^']+)'\s*,\s*'([^']+)'/g;
let m;
const celebs = [];
const seen = new Set();
const idNameRegex = /id:\s*['\"]([^'\"]+)['\"][\s\S]{0,400}?name:\s*['\"]([^'\"]+)['\"]/g;
while ((m = idNameRegex.exec(core)) !== null) {
  const [, id, name] = m;
  if (!/-(jet|car|yacht|house|watch|art|heli|island|sport|rocket|main|estate|asset|ring|villa|plane|tower|penthouse|condo|manor|castle|ranch|compound|1|2|3)/.test(id) && !seen.has(id)) {
    seen.add(id);
    celebs.push({id, name});
  }
}
while ((m = mkRegex.exec(extra)) !== null) {
  if (!seen.has(m[1])) { seen.add(m[1]); celebs.push({id: m[1], name: m[2]}); }
}
writeFileSync('$CELEB_LIST', JSON.stringify(celebs));
console.log('Total:', celebs.length);
"
fi

# Load existing cache
if [ -f "$CACHE" ]; then
  echo "📂  Loading existing cache…"
else
  echo "{}" > "$CACHE"
fi

# Read celebrities and IDs into bash arrays
mapfile -t IDS < <(python3 -c "import json; d=json.load(open('$CELEB_LIST')); [print(c['id']) for c in d]")
mapfile -t NAMES < <(python3 -c "import json; d=json.load(open('$CELEB_LIST')); [print(c['name']) for c in d]")

TOTAL="${#IDS[@]}"
COUNT=0
UPDATED=0
FAILED=0

echo "📋  Found $TOTAL celebrities"
echo "🔍  Enriching up to $LIMIT celebrities…"
echo ""

for i in "${!IDS[@]}"; do
  if [ "$COUNT" -ge "$LIMIT" ]; then break; fi

  ID="${IDS[$i]}"
  NAME="${NAMES[$i]}"

  # Skip if already in cache
  ALREADY=$(python3 -c "import json; d=json.load(open('$CACHE')); print('yes' if '$ID' in d else 'no')" 2>/dev/null || echo "no")
  if [ "$ALREADY" = "yes" ]; then
    continue
  fi

  COUNT=$((COUNT + 1))

  # Query TMDb
  ENCODED=$(python3 -c "import urllib.parse; print(urllib.parse.quote('$NAME'))")
  RESPONSE=$(curl -s --max-time 8 \
    "https://api.themoviedb.org/3/search/person?query=${ENCODED}&include_adult=false&language=en-US" \
    -H "Authorization: Bearer ${TMDB_READ_ACCESS_TOKEN}" \
    -H "Accept: application/json" 2>/dev/null || echo "{}")

  PROFILE=$(python3 -c "
import json, sys
try:
  d = json.loads('''${RESPONSE}'''.replace(\"'\", \"'\"))
  r = d.get('results', [])
  if r and r[0].get('profile_path'):
    print(r[0]['profile_path'])
except: pass
" 2>/dev/null || true)

  if [ -n "$PROFILE" ]; then
    URL="${TMDB_IMG}${PROFILE}"
    # Add to cache
    python3 -c "
import json
d = json.load(open('$CACHE'))
d['$ID'] = '$URL'
json.dump(d, open('$CACHE', 'w'), indent=2)
"
    UPDATED=$((UPDATED + 1))
    printf "  ✅  [%d] %-30s → tmdb\n" "$COUNT" "$NAME"
  else
    FAILED=$((FAILED + 1))
    printf "  ⚠️   [%d] %-30s → not found\n" "$COUNT" "$NAME"
  fi

  # Rate limit
  sleep 0.15
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅  Done — $UPDATED found, $FAILED not found"
CACHE_COUNT=$(python3 -c "import json; print(len(json.load(open('$CACHE'))))")
echo "   Cache total: $CACHE_COUNT entries"
echo "   Written to:  src/data/photosCache.json"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
