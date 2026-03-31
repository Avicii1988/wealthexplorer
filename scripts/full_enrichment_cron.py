"""
full_enrichment_cron.py  –  ongoing photo + data enrichment
============================================================
Runs as a cron job (see .github/workflows/full-enrichment.yml).

Steps:
  1. Regenerate data/celebs.json from all sources (calls create_master_file logic)
  2. Find celebrities still missing a good photo
  3. Enrich aggressively: TMDB first (multiple query strategies), then SearchAPI
  4. Save updated data/celebs.json
  5. Exit 0 — the workflow handles committing only if the file changed
"""

import json, os, re, sys, time, importlib.util, requests
from datetime import datetime
from pathlib import Path

# ── config ──────────────────────────────────────────────────────────────────
MASTER_FILE   = "public/data/celebs.json"
SLEEP         = 1.4          # seconds between API calls
MAX_PER_RUN   = 200          # max celebrities to enrich per run (avoids timeout)

TMDB_API_KEY  = os.getenv("TMDB_API_KEY")
SEARCHAPI_KEY = os.getenv("SEARCHAPI_KEY")

HEADERS = {"User-Agent": "WealthExplorer/1.0 (https://github.com/avicii1988/wealthexplorer)"}
BAD_KW  = ["ui-avatars", "placeholder", "silhouette", "unknown", "default-avatar", "gstatic"]

# ── helpers ──────────────────────────────────────────────────────────────────

def load_master():
    if not os.path.exists(MASTER_FILE):
        return []
    with open(MASTER_FILE, encoding="utf-8") as f:
        return json.load(f)

def save_master(data):
    os.makedirs(os.path.dirname(MASTER_FILE), exist_ok=True)
    with open(MASTER_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def is_good_photo(url):
    if not url or len(url) < 20:
        return False
    return not any(kw in url.lower() for kw in BAD_KW)

def tmdb_search(name):
    """Try original + reversed name, check top-5 results each."""
    if not TMDB_API_KEY:
        return None, None
    parts = name.split()
    queries = [name] + ([f"{parts[-1]} {' '.join(parts[:-1])}"] if len(parts) > 1 else [])
    for query in queries:
        try:
            r = requests.get(
                "https://api.themoviedb.org/3/search/person",
                params={"api_key": TMDB_API_KEY, "query": query, "language": "en-US"},
                headers=HEADERS, timeout=12,
            )
            if r.status_code == 200:
                for person in r.json().get("results", [])[:5]:
                    if person.get("profile_path"):
                        url = f"https://image.tmdb.org/t/p/original{person['profile_path']}"
                        return url, "TMDB"
            elif r.status_code == 401:
                print("   ⚠️  TMDB: invalid API key")
                return None, None
        except Exception as e:
            print(f"   TMDB error for '{query}': {e}")
    return None, None

def searchapi_image(name):
    """Google Images via SearchAPI — robust field extraction."""
    if not SEARCHAPI_KEY:
        return None, None
    try:
        r = requests.get(
            "https://www.searchapi.io/api/v1/search",
            params={
                "engine": "google_images",
                "q": f"{name} celebrity portrait",
                "api_key": SEARCHAPI_KEY,
                "num": 10,
            },
            headers=HEADERS, timeout=15,
        )
        if r.status_code != 200:
            print(f"   SearchAPI {r.status_code} for {name}")
            return None, None
        bad_hosts = ["gstatic.com", "google.com", "bing.com", "placeholder", "avatar"]
        for img in r.json().get("images", [])[:10]:
            link = img.get("original")
            if isinstance(link, dict):
                link = link.get("link") or link.get("url") or link.get("src") or ""
            if not isinstance(link, str) or not link.startswith("http"):
                link = img.get("thumbnail") or img.get("image_url") or ""
            if isinstance(link, dict):
                link = link.get("link") or link.get("url") or ""
            if isinstance(link, str) and link.startswith("http") and not any(b in link for b in bad_hosts):
                return link, "SearchAPI"
    except Exception as e:
        print(f"   SearchAPI error for {name}: {e}")
    return None, None


# ── regenerate master from all sources ───────────────────────────────────────

def regenerate_master():
    """Import and run create_master_file.main() in-process."""
    spec = importlib.util.spec_from_file_location(
        "create_master_file",
        Path(__file__).parent / "create_master_file.py"
    )
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    mod.main()


# ── main ─────────────────────────────────────────────────────────────────────

def main():
    # Step 1 — rebuild master from all sources (picks up any new TS entries)
    print("🔄 Regenerating master file from all sources…")
    try:
        regenerate_master()
    except Exception as e:
        print(f"⚠️  create_master_file failed: {e} — continuing with existing file")

    # Step 2 — find celebrities still missing good photos
    celebs = load_master()
    if not celebs:
        print("❌ No celebrities in master file — exiting")
        sys.exit(1)

    missing = [c for c in celebs if not is_good_photo(c.get("image", ""))]
    print(f"\n🔍 {len(missing)}/{len(celebs)} celebrities need a photo — enriching up to {MAX_PER_RUN}")

    if not missing:
        print("✅ All celebrities already have photos — nothing to do")
        return

    if not TMDB_API_KEY and not SEARCHAPI_KEY:
        print("❌ No API keys set (TMDB_API_KEY / SEARCHAPI_KEY) — cannot enrich")
        sys.exit(1)

    # Build a quick-lookup map
    celeb_map = {c["slug"]: c for c in celebs}

    updated = 0
    for celeb in missing[:MAX_PER_RUN]:
        name = celeb.get("name", "")
        slug = celeb.get("slug", "")
        if not name:
            continue

        print(f"  [{updated+1}] {name}")

        url, src = tmdb_search(name)
        if not url:
            url, src = searchapi_image(name)

        if url:
            celeb["image"] = url
            celeb["photo_source"] = src
            celeb["photo_updated"] = datetime.utcnow().isoformat()
            updated += 1
            print(f"      ✅ {src}: {url[:80]}")
        else:
            print(f"      ⚠️  no photo found")

        time.sleep(SLEEP)

    # Step 3 — save
    save_master(celebs)
    print(f"\n🏁 Done. Enriched {updated} new photos. Total: {len(celebs)} celebrities.")


if __name__ == "__main__":
    main()
