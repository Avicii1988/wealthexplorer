#!/usr/bin/env python3
"""
Enrich all celebrity avatar URLs in src/data/*.ts files using TMDB.
Replaces ui-avatars.com placeholders (and any non-TMDB URLs) with
https://image.tmdb.org/t/p/w400/<profile_path> images.

Run from repo root: python3 scripts/enrich_avatars_tmdb.py
"""
import re
import os
import json
import time
import requests
from typing import Optional

TMDB_TOKEN    = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5MWE3NGQ0OGZiMjMzNmE0MWQ1ZTliOWQwYzkwMjhlNyIsIm5iZiI6MTc3MzcwMTgyMy4yNjcsInN1YiI6IjY5Yjg4YWJmMjNjZmQ2MGEwMWE2NDA2ZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.VwZyK4VkkIEv9QIxjKpHs66BDqxEIv-m7BOOlJC4chE"
TMDB_BASE     = "https://api.themoviedb.org/3"
TMDB_IMG      = "https://image.tmdb.org/t/p/w400"
DATA_DIR      = "src/data"
CACHE_FILE    = "scripts/.tmdb_cache.json"

SESSION = requests.Session()
SESSION.headers.update({
    "Authorization": f"Bearer {TMDB_TOKEN}",
    "Accept": "application/json",
})

# ── Cache (slug → tmdb_url or None) ─────────────────────────────────────────
def load_cache() -> dict:
    if os.path.exists(CACHE_FILE):
        with open(CACHE_FILE) as f:
            return json.load(f)
    return {}

def save_cache(cache: dict) -> None:
    os.makedirs(os.path.dirname(CACHE_FILE), exist_ok=True)
    with open(CACHE_FILE, "w") as f:
        json.dump(cache, f, indent=2)

# ── TMDB helpers ─────────────────────────────────────────────────────────────
def slug_to_name(slug: str) -> str:
    """Convert slug like 'lebron-james-full' → 'LeBron James'."""
    clean = slug.replace("-full", "").replace("-extended", "")
    # Special cases
    specials = {
        "jay-z": "Jay-Z",
        "dr-dre": "Dr. Dre",
        "dr-phil": "Dr. Phil",
        "dj-khaled": "DJ Khaled",
        "50-cent": "50 Cent",
        "cardi-b": "Cardi B",
        "lil-wayne": "Lil Wayne",
        "lil-nas-x": "Lil Nas X",
        "lil-uzi-vert": "Lil Uzi Vert",
        "g-eazy": "G-Eazy",
        "a-ap-rocky": "A$AP Rocky",
        "t-pain": "T-Pain",
        "dua-saleh": "Dua Saleh",
        "dougie-b": "Dougie B",
        "p-diddy": "P. Diddy",
        "yo-yo-ma": "Yo-Yo Ma",
    }
    if clean in specials:
        return specials[clean]
    return " ".join(w.capitalize() for w in clean.split("-"))

def fetch_tmdb_avatar(name: str) -> Optional[str]:
    """Search TMDB for person, return best w400 image URL or None."""
    try:
        r = SESSION.get(f"{TMDB_BASE}/search/person",
                        params={"query": name, "language": "en-US", "page": 1},
                        timeout=15)
        r.raise_for_status()
        results = r.json().get("results", [])
    except Exception as exc:
        print(f"    ✗ search error: {exc}")
        return None

    if not results:
        return None

    person = max(results, key=lambda x: x.get("popularity", 0))
    pid = person["id"]

    # Try full image list for best voted image
    try:
        r2 = SESSION.get(f"{TMDB_BASE}/person/{pid}/images", timeout=15)
        r2.raise_for_status()
        profiles = r2.json().get("profiles", [])
        if profiles:
            profiles.sort(key=lambda x: (x.get("vote_average", 0), x.get("vote_count", 0)), reverse=True)
            return f"{TMDB_IMG}{profiles[0]['file_path']}"
    except Exception:
        pass

    # Fallback to search result's profile_path
    if person.get("profile_path"):
        return f"{TMDB_IMG}{person['profile_path']}"

    return None

# ── Extract celebrities from TS files ────────────────────────────────────────
def extract_celebrities(content: str) -> list[tuple[str, str]]:
    """Return list of (slug, current_avatar_url) found in file content."""
    # Pattern: 'slug': {\n  avatar: 'URL',
    pattern = re.compile(
        r"'([a-z][a-z0-9-]+)':\s*\{[^}]*?avatar:\s*'([^']+)'",
        re.DOTALL
    )
    return pattern.findall(content)

# ── Patch a single file ───────────────────────────────────────────────────────
def patch_file(fpath: str, cache: dict) -> tuple[int, int]:
    """
    Process one TS file. Returns (updated_count, skipped_count).
    Updates avatar lines in-place using the cache.
    """
    content = open(fpath, encoding="utf-8").read()
    matches = extract_celebrities(content)
    if not matches:
        return 0, 0

    updated = 0
    skipped = 0
    new_content = content

    for slug, current_url in matches:
        # Skip if already a TMDB URL
        if "image.tmdb.org" in current_url:
            skipped += 1
            continue

        # Check cache
        if slug in cache:
            tmdb_url = cache[slug]
        else:
            name = slug_to_name(slug)
            print(f"  → {name} ({slug})", end="", flush=True)
            tmdb_url = fetch_tmdb_avatar(name)
            cache[slug] = tmdb_url
            save_cache(cache)
            time.sleep(0.25)  # polite rate limiting

        if not tmdb_url:
            print(f"  ✗ no TMDB image for '{slug}' — keeping existing")
            skipped += 1
            continue

        # Replace avatar URL in content
        old_line = f"avatar: '{current_url}'"
        new_line = f"avatar: '{tmdb_url}'"
        if old_line in new_content:
            new_content = new_content.replace(old_line, new_line, 1)
            updated += 1
            print(f"  ✓ {tmdb_url[:60]}...")
        else:
            skipped += 1

    if new_content != content:
        with open(fpath, "w", encoding="utf-8") as f:
            f.write(new_content)

    return updated, skipped

# ── Main ─────────────────────────────────────────────────────────────────────
def main():
    cache = load_cache()
    print(f"Cache loaded: {len(cache)} entries\n")

    ts_files = [
        f for f in sorted(os.listdir(DATA_DIR))
        if f.endswith(".ts") and not f.endswith(".d.ts")
    ]

    total_updated = 0
    total_skipped = 0

    for fname in ts_files:
        fpath = os.path.join(DATA_DIR, fname)
        content = open(fpath).read()
        # Quick check: does this file have avatar fields?
        if "avatar:" not in content:
            continue

        print(f"\n{'─'*60}")
        print(f"  {fname}")
        u, s = patch_file(fpath, cache)
        total_updated += u
        total_skipped += s
        print(f"  → {u} updated, {s} skipped")

    print(f"\n{'='*60}")
    print(f"Done: {total_updated} avatars updated, {total_skipped} skipped")
    print(f"Cache saved: {len(cache)} entries → {CACHE_FILE}")

if __name__ == "__main__":
    main()
