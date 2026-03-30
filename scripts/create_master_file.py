"""
create_master_file.py
Merges data/profiles/*.json + data/celebrities/*.json with photo caches
(src/data/photosCache.json and src/data/celebs_photos.json) into a single
master file at data/celebs.json.

Photo priority: photosCache (Wikipedia/TMDB) > celebs_photos (SearchAPI) > profile_image
"""

import json
import os
import re

PROFILES_DIR = "data/profiles"
CELEBRITIES_DIR = "data/celebrities"
PHOTOS_CACHE = "src/data/photosCache.json"
CELEBS_PHOTOS = "src/data/celebs_photos.json"
OUTPUT_FILE = "data/celebs.json"


def load_json(path):
    if not os.path.exists(path):
        return {}
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def slug_from_name(name):
    return re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")


def load_profiles(directory):
    """Load all JSON files from a directory, keyed by slug."""
    profiles = {}
    if not os.path.exists(directory):
        return profiles
    for fname in sorted(os.listdir(directory)):
        if not fname.endswith(".json"):
            continue
        path = os.path.join(directory, fname)
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
        slug = data.get("slug") or fname.replace(".json", "")
        profiles[slug] = data
    return profiles


def best_photo(slug, name, profile_data, photos_cache, celebs_photos):
    """
    Return (url, source) for the best available photo.
    Priority: photosCache > celebs_photos > profile profile_image
    """
    # 1. photosCache — keyed by slug, value is a plain URL string
    if slug in photos_cache:
        return photos_cache[slug], "photosCache"

    # 2. celebs_photos — keyed by display name
    if name in celebs_photos:
        entry = celebs_photos[name]
        url = entry.get("image") or ""
        if url and "ui-avatars" not in url:
            return url, entry.get("photo_source", "celebs_photos")

    # 3. profile_image from the profile file
    pi = profile_data.get("profile_image", {})
    url = pi.get("url") or ""
    if url:
        return url, "profile_file"

    return "", "none"


def main():
    print("📂 Loading photo caches...")
    photos_cache = load_json(PHOTOS_CACHE)   # {slug: url}
    celebs_photos = load_json(CELEBS_PHOTOS)  # {name: {image, photo_source, ...}}
    print(f"   photosCache: {len(photos_cache)} entries")
    print(f"   celebs_photos: {len(celebs_photos)} entries")

    print("📂 Loading profile files...")
    slim_profiles = load_profiles(PROFILES_DIR)    # 30 profiles
    rich_profiles = load_profiles(CELEBRITIES_DIR)  # 3 rich profiles (with assets etc.)
    print(f"   data/profiles/: {len(slim_profiles)} files")
    print(f"   data/celebrities/: {len(rich_profiles)} files")

    # Merge: start with slim profiles, overlay richer data where available
    all_slugs = set(slim_profiles) | set(rich_profiles)
    master = []

    for slug in sorted(all_slugs):
        slim = slim_profiles.get(slug, {})
        rich = rich_profiles.get(slug, {})

        # Base: slim profile fields, then enrich with rich profile
        entry = {**slim, **rich}

        name = entry.get("name") or slug.replace("-", " ").title()
        entry["name"] = name
        entry["slug"] = slug

        url, source = best_photo(slug, name, slim, photos_cache, celebs_photos)
        if url:
            entry["image"] = url
            entry["photo_source"] = source
        elif "image" not in entry:
            entry["image"] = ""
            entry["photo_source"] = "none"

        # Normalize: remove redundant nested profile_image block (data now in image field)
        entry.pop("profile_image", None)

        master.append(entry)

    # Sort alphabetically by name
    master.sort(key=lambda x: x.get("name", "").lower())

    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(master, f, ensure_ascii=False, indent=2)

    print(f"\n✅ Written {len(master)} celebrities to {OUTPUT_FILE}")

    # Print example entry
    elon = next((c for c in master if "elon" in c.get("slug", "")), master[0])
    print(f"\n📋 Example entry ({elon['name']}):")
    example = {k: v for k, v in elon.items() if k != "assets"}
    print(json.dumps(example, indent=2, ensure_ascii=False))
    if "assets" in elon:
        print(f'  "assets": [{len(elon["assets"])} items]')


if __name__ == "__main__":
    main()
