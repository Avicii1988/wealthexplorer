#!/usr/bin/env python3
"""
Enrich profile pictures using TMDB (The Movie Database) API.
Updates existing JSON files in data/test-profiles/ with TMDB image data.
"""
import os
import json
import time
from datetime import date
from typing import Optional, Dict, Any
import requests

TMDB_API_KEY   = "91a74d48fb2336a41d5e9b9d0c9028e7"
TMDB_TOKEN     = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5MWE3NGQ0OGZiMjMzNmE0MWQ1ZTliOWQwYzkwMjhlNyIsIm5iZiI6MTc3MzcwMTgyMy4yNjcsInN1YiI6IjY5Yjg4YWJmMjNjZmQ2MGEwMWE2NDA2ZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.VwZyK4VkkIEv9QIxjKpHs66BDqxEIv-m7BOOlJC4chE"
TMDB_BASE      = "https://api.themoviedb.org/3"
TMDB_IMG_BASE  = "https://image.tmdb.org/t/p"
OUTPUT_DIR     = "data/test-profiles"
TODAY          = date.today().isoformat()

SESSION = requests.Session()
SESSION.headers.update({
    "Authorization": f"Bearer {TMDB_TOKEN}",
    "Accept": "application/json",
})


def search_person(name: str) -> Optional[Dict]:
    """Search TMDB for a person, return best match or None."""
    r = SESSION.get(f"{TMDB_BASE}/search/person",
                    params={"query": name, "language": "en-US", "page": 1},
                    timeout=15)
    r.raise_for_status()
    results = r.json().get("results", [])
    if not results:
        return None
    # Pick most popular result
    return max(results, key=lambda x: x.get("popularity", 0))


def get_best_profile(person_id: int) -> Optional[Dict]:
    """Fetch all profile images for a person, return the best one."""
    r = SESSION.get(f"{TMDB_BASE}/person/{person_id}/images", timeout=15)
    r.raise_for_status()
    profiles = r.json().get("profiles", [])
    if not profiles:
        return None
    # Sort by vote average (desc), then vote count
    profiles.sort(key=lambda x: (x.get("vote_average", 0), x.get("vote_count", 0)), reverse=True)
    return profiles[0]


def enrich(slug: str, name: str) -> Dict[str, Any]:
    path = os.path.join(OUTPUT_DIR, f"{slug}.json")
    with open(path, encoding="utf-8") as f:
        profile = json.load(f)

    print(f"\n  {name}  [{slug}]")

    person = search_person(name)
    if not person:
        print(f"  ✗ TMDB: person not found")
        return profile

    pid        = person["id"]
    popularity = person.get("popularity", 0)
    print(f"  ✓ TMDB person: id={pid}  popularity={popularity:.1f}")

    # Try full image list first for best quality
    best = get_best_profile(pid)
    profile_path = None

    if best:
        profile_path = best["file_path"]
        w = best.get("width", 0)
        h = best.get("height", 0)
        print(f"  ✓ TMDB best image: {w}×{h}  vote_avg={best.get('vote_average',0):.2f}")
    elif person.get("profile_path"):
        profile_path = person["profile_path"]
        print(f"  ✓ TMDB fallback to search result profile_path")

    if not profile_path:
        print(f"  ✗ TMDB: no profile image available")
        return profile

    orig_url  = f"{TMDB_IMG_BASE}/original{profile_path}"
    thumb_url = f"{TMDB_IMG_BASE}/w400{profile_path}"

    profile["profile_image"] = {
        "url":           orig_url,
        "thumbnail_url": thumb_url,
        "source":        "tmdb",
        "width":         best.get("width") if best else None,
        "height":        best.get("height") if best else None,
        "tmdb_person_id": pid,
        "notes":         f"TMDB person id={pid}, popularity={popularity:.1f}",
    }
    profile["last_updated"] = TODAY

    with open(path, "w", encoding="utf-8") as f:
        json.dump(profile, f, indent=2, ensure_ascii=False)
    print(f"  💾 Updated → {path}")
    return profile


def main():
    files = sorted(f for f in os.listdir(OUTPUT_DIR) if f.endswith(".json"))
    print(f"{'='*60}")
    print(f"Enriching {len(files)} profiles with TMDB...")
    print(f"{'='*60}")

    results = []
    for fname in files:
        slug = fname.replace(".json", "")
        path = os.path.join(OUTPUT_DIR, fname)
        with open(path) as f:
            data = json.load(f)
        name = data.get("name", slug)
        try:
            p = enrich(slug, name)
            results.append(p)
        except Exception as exc:
            print(f"  ✗ Error processing {name}: {exc}")
        time.sleep(0.5)   # polite rate limiting

    print(f"\n{'='*60}")
    print(f"{'Name':<22} {'Source':<10} {'Size':<14} URL (first 55 chars)")
    print(f"{'─'*22} {'─'*10} {'─'*14} {'─'*55}")
    for p in results:
        img  = p["profile_image"]
        w    = img.get("width") or 0
        h    = img.get("height") or 0
        size = f"{w}×{h}" if w else "unknown"
        url  = (img.get("url") or "—")[:55]
        print(f"{p['name']:<22} {img['source']:<10} {size:<14} {url}")
    print(f"{'='*60}")
    found = sum(1 for r in results if r["profile_image"]["source"] == "tmdb")
    print(f"Done: {found}/{len(results)} enriched via TMDB. Files in: {os.path.abspath(OUTPUT_DIR)}/")


if __name__ == "__main__":
    main()
