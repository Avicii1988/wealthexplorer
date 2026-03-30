import json
import os
import re
import sys
import time
import requests
from datetime import datetime

# ================== CONFIG ==================
CELEBS_FILE = "src/data/celebs_photos.json"
MAX_CELEBS = 1000
SLEEP_BETWEEN_REQUESTS = 1.4

TMDB_API_KEY = os.getenv("TMDB_API_KEY")
SEARCHAPI_KEY = os.getenv("SEARCHAPI_KEY")

HEADERS = {
    "User-Agent": "WealthExplorer/1.0 (https://github.com/avicii1988/wealthexplorer)"
}

def load_celeb_names():
    """Extract celebrity names from extraCelebrities.ts using regex."""
    ts_file = "src/data/extraCelebrities.ts"
    if not os.path.exists(ts_file):
        print(f"❌ {ts_file} not found!")
        return []
    with open(ts_file, "r", encoding="utf-8") as f:
        content = f.read()
    names = re.findall(r"mk\('[^']+','([^']+)'", content)
    print(f"📋 Found {len(names)} celebrity names in extraCelebrities.ts")
    return names

def load_existing_photos():
    if not os.path.exists(CELEBS_FILE):
        return {}
    with open(CELEBS_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

def save_photos(photos):
    os.makedirs(os.path.dirname(CELEBS_FILE), exist_ok=True)
    with open(CELEBS_FILE, "w", encoding="utf-8") as f:
        json.dump(photos, f, ensure_ascii=False, indent=2)
    print(f"✅ Saved {len(photos)} photo entries to {CELEBS_FILE}")

def has_real_photo(name, existing):
    entry = existing.get(name, {})
    img = entry.get("image") or entry.get("photo") or entry.get("avatar") or ""
    if not img:
        return False
    bad_keywords = ["ui-avatars", "placeholder", "default", "silhouette", "unknown"]
    return not any(kw in img.lower() for kw in bad_keywords)

def tmdb_search(name):
    """Try multiple TMDB query strategies, check top 5 results each time."""
    if not TMDB_API_KEY:
        return None
    parts = name.split()
    queries = [name]
    if len(parts) > 1:
        queries.append(f"{parts[-1]} {parts[0]}")  # Lastname Firstname
    for query in queries:
        try:
            r = requests.get(
                "https://api.themoviedb.org/3/search/person",
                params={"api_key": TMDB_API_KEY, "query": query, "language": "en-US"},
                headers=HEADERS, timeout=12
            )
            if r.status_code == 200:
                for person in r.json().get("results", [])[:5]:
                    if person.get("profile_path"):
                        return f"https://image.tmdb.org/t/p/original{person['profile_path']}"
            else:
                print(f"   TMDB status {r.status_code} for '{query}'")
        except Exception as e:
            print(f"   TMDB error for '{query}': {e}")
    return None

def searchapi_image(name):
    """Search Google Images via SearchAPI, accepting any valid image URL."""
    if not SEARCHAPI_KEY:
        return None
    try:
        query = f"{name} celebrity portrait"
        r = requests.get(
            "https://www.searchapi.io/api/v1/search",
            params={"engine": "google_images", "q": query, "api_key": SEARCHAPI_KEY, "num": 10},
            headers=HEADERS, timeout=15
        )
        if r.status_code != 200:
            print(f"   SearchAPI status {r.status_code} for {name}: {r.text[:200]}")
            return None
        bad_hosts = ["gstatic.com", "google.com", "bing.com", "placeholder", "avatar"]
        for img in r.json().get("images", [])[:10]:
            # original field can be a dict with a 'link' key
            link = img.get("original")
            if isinstance(link, dict):
                link = link.get("link") or link.get("url") or link.get("src") or ""
            if not isinstance(link, str) or not link.startswith("http"):
                link = img.get("thumbnail") or img.get("image_url") or ""
            if isinstance(link, dict):
                link = link.get("link") or link.get("url") or link.get("src") or ""
            if not isinstance(link, str) or not link.startswith("http"):
                continue
            if any(bad in link.lower() for bad in bad_hosts):
                continue
            return link
    except Exception as e:
        print(f"   SearchAPI error for {name}: {e}")
    return None

def debug_api_keys():
    tmdb_set = bool(TMDB_API_KEY)
    search_set = bool(SEARCHAPI_KEY)
    print(f"🔑 TMDB_API_KEY set: {'YES (' + str(len(TMDB_API_KEY)) + ' chars)' if tmdb_set else 'NO ❌'}")
    print(f"🔑 SEARCHAPI_KEY set: {'YES (' + str(len(SEARCHAPI_KEY)) + ' chars)' if search_set else 'NO ❌'}")
    if not tmdb_set and not search_set:
        print("❌ No API keys configured! Set TMDB_API_KEY and/or SEARCHAPI_KEY secrets.")
        sys.exit(1)

def main():
    names = load_celeb_names()
    if not names:
        print("❌ No celebrities found — exiting")
        sys.exit(0)

    debug_api_keys()

    existing = load_existing_photos()
    print(f"🚀 Starting enrichment — {len(names)} celebs, {len(existing)} already have photos")

    updated = 0
    for i, name in enumerate(names[:MAX_CELEBS]):
        if has_real_photo(name, existing):
            continue

        print(f"[{i+1}/{len(names)}] {name}")

        photo_url = tmdb_search(name)
        source = "TMDB"
        if not photo_url:
            photo_url = searchapi_image(name)
            source = "SearchAPI"

        if photo_url:
            existing[name] = {
                "image": photo_url,
                "photo_source": source,
                "photo_updated": datetime.utcnow().isoformat()
            }
            updated += 1
            print(f"   ✅ {source}: {photo_url[:80]}")
        else:
            print(f"   ⚠️  No photo found")

        time.sleep(SLEEP_BETWEEN_REQUESTS)

    if updated > 0:
        save_photos(existing)
    print(f"🏁 Done. Added {updated} new photos.")

if __name__ == "__main__":
    main()
