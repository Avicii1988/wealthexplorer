import json
import os
import sys
import time
import requests
from datetime import datetime

# ================== CONFIG ==================
# Points to the SearchAPI-enriched photo cache used by the React app
DATA_FILE = "src/data/assetPhotosCache.json"
CELEBS_FILE = "src/data/celebs_photos.json"   # output file for celeb profile photos
MAX_CELEBS = 1000
SLEEP_BETWEEN_REQUESTS = 1.2

TMDB_API_KEY = os.getenv("TMDB_API_KEY")
SEARCHAPI_KEY = os.getenv("SEARCHAPI_KEY")

HEADERS = {
    "User-Agent": "WealthExplorer/1.0 (https://github.com/avicii1988/wealthexplorer)"
}

def load_celeb_names():
    """Extract celebrity names from extraCelebrities.ts using regex."""
    import re
    ts_file = "src/data/extraCelebrities.ts"
    if not os.path.exists(ts_file):
        print(f"❌ {ts_file} not found!")
        return []
    with open(ts_file, "r", encoding="utf-8") as f:
        content = f.read()
    # Match mk('id','Name', ...) patterns
    names = re.findall(r"mk\('[^']+','([^']+)'", content)
    print(f"📋 Found {len(names)} celebrity names in extraCelebrities.ts")
    return [{"name": n} for n in names]

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
    bad_keywords = ["avatar", "placeholder", "default", "silhouette", "unknown", "ui-avatars"]
    return not any(kw in img.lower() for kw in bad_keywords)

def tmdb_search(name):
    if not TMDB_API_KEY:
        return None
    try:
        url = f"https://api.themoviedb.org/3/search/person?api_key={TMDB_API_KEY}&query={name}&language=en-US"
        r = requests.get(url, headers=HEADERS, timeout=10)
        if r.status_code == 200:
            results = r.json().get("results", [])
            if results and results[0].get("profile_path"):
                return f"https://image.tmdb.org/t/p/original{results[0]['profile_path']}"
    except Exception as e:
        print(f"TMDB error for {name}: {e}")
    return None

def searchapi_image(name):
    if not SEARCHAPI_KEY:
        return None
    try:
        query = f"{name} celebrity portrait photo site:wikimedia.org OR site:tmdb.org"
        url = f"https://www.searchapi.io/api/v1/search?engine=google_images&q={query}&api_key={SEARCHAPI_KEY}"
        r = requests.get(url, headers=HEADERS, timeout=15)
        if r.status_code == 200:
            images = r.json().get("images", [])
            for img in images[:6]:
                link = img.get("original") or img.get("image_url") or img.get("link")
                if isinstance(link, str) and any(ext in link.lower() for ext in [".jpg", ".jpeg", ".png"]):
                    return link
                # Some responses nest the URL inside a dict
                if isinstance(link, dict):
                    link = link.get("url") or link.get("src") or link.get("href") or ""
                if isinstance(link, str) and any(ext in link.lower() for ext in [".jpg", ".jpeg", ".png"]):
                    return link
    except Exception as e:
        print(f"SearchAPI error for {name}: {e}")
    return None

def main():
    celebs = load_celeb_names()
    if not celebs:
        print("❌ No celebrities found — exiting")
        sys.exit(0)

    existing = load_existing_photos()
    print(f"🚀 Starting real photo enrichment — {len(celebs)} celebs, {len(existing)} already enriched")

    updated = 0
    for i, celeb in enumerate(celebs[:MAX_CELEBS]):
        name = celeb.get("name") or ""
        if not name:
            continue

        if has_real_photo(name, existing):
            continue

        print(f"[{i+1}/{len(celebs)}] Processing: {name}")

        photo_url = tmdb_search(name)
        if not photo_url:
            photo_url = searchapi_image(name)

        if photo_url:
            existing[name] = {
                "image": photo_url,
                "photo_source": "TMDB" if "tmdb.org" in photo_url else "SearchAPI",
                "photo_updated": datetime.utcnow().isoformat()
            }
            updated += 1
            print(f"   ✅ Added real photo for {name}")
        else:
            print(f"   ⚠️  No good photo found for {name}")

        time.sleep(SLEEP_BETWEEN_REQUESTS)

    if updated > 0:
        save_photos(existing)
    print(f"🏁 Finished. Added {updated} new real photos.")

if __name__ == "__main__":
    main()
