import json
import os
import time
import requests
from datetime import datetime

# ================== CONFIG ==================
DATA_FILE = "data/celebs.json"          # Change only if your main celeb file has a different name/path
MAX_CELEBS = 1000
SLEEP_BETWEEN_REQUESTS = 1.2

TMDB_API_KEY = os.getenv("TMDB_API_KEY")
SEARCHAPI_KEY = os.getenv("SEARCHAPI_KEY")

HEADERS = {
    "User-Agent": "WealthExplorer/1.0 (https://github.com/avicii1988/wealthexplorer)"
}

def load_celebs():
    if not os.path.exists(DATA_FILE):
        print(f"❌ {DATA_FILE} not found!")
        return []
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)
    return data if isinstance(data, list) else data.get("celebs", data)

def save_celebs(celebs):
    os.makedirs(os.path.dirname(DATA_FILE), exist_ok=True)
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(celebs, f, ensure_ascii=False, indent=2)
    print(f"✅ Saved {len(celebs)} celebs to {DATA_FILE}")

def has_real_photo(celeb):
    img = celeb.get("image") or celeb.get("photo") or celeb.get("avatar")
    if not img:
        return False
    bad_keywords = ["avatar", "placeholder", "default", "silhouette", "unknown"]
    return not any(kw in str(img).lower() for kw in bad_keywords)

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
        query = f"{name} high quality portrait photo -avatar -cartoon -drawing -illustration"
        url = f"https://www.searchapi.io/api/v1/search?engine=google_images&q={query}&api_key={SEARCHAPI_KEY}"
        r = requests.get(url, headers=HEADERS, timeout=15)
        if r.status_code == 200:
            images = r.json().get("images", [])
            for img in images[:6]:
                link = img.get("original") or img.get("image_url") or img.get("link")
                if link and any(ext in link.lower() for ext in [".jpg", ".jpeg", ".png"]):
                    return link
    except Exception as e:
        print(f"SearchAPI error for {name}: {e}")
    return None

def main():
    celebs = load_celebs()
    print(f"🚀 Starting real photo enrichment — Current: {len(celebs)} | Target: {MAX_CELEBS}")

    updated = 0
    for i, celeb in enumerate(celebs):
        if len(celebs) >= MAX_CELEBS:
            print("🎯 Reached 1000 celebs — stopping")
            break

        name = celeb.get("name") or celeb.get("full_name") or ""
        if not name or has_real_photo(celeb):
            continue

        print(f"[{i+1}/{len(celebs)}] Processing: {name}")

        photo_url = tmdb_search(name)
        if not photo_url:
            photo_url = searchapi_image(name)

        if photo_url:
            celeb["image"] = photo_url
            celeb["photo_source"] = "TMDB" if "tmdb.org" in photo_url else "SearchAPI"
            celeb["photo_updated"] = datetime.utcnow().isoformat()
            updated += 1
            print(f"   ✅ Added real photo for {name}")
        else:
            print(f"   ⚠️  No good photo found for {name}")

        time.sleep(SLEEP_BETWEEN_REQUESTS)

    save_celebs(celebs)
    print(f"🏁 Finished. Added {updated} new real photos.")

if __name__ == "__main__":
    main()
