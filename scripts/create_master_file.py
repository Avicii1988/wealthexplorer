"""
create_master_file.py  –  generates public/data/celebs.json (single source of truth)
====================================================================================
Merges ALL celebrity sources:
  1. src/data/extraCelebrities.ts  – 615 slim profiles (parsed from mk() calls)
  2. data/profiles/*.json          – 30 richer profile files
  3. data/celebrities/*.json       – 3 detailed celebrity files
  4. public/data/photosCache.json  – keyed by slug → URL
  5. public/data/celebs_photos.json – keyed by name → {image, photo_source}

Outputs a JSON array whose shape matches the TypeScript Celebrity interface so
the React app can use it directly without any transformation.
"""

import json, os, re, sys

# ── paths ──────────────────────────────────────────────────────────────────────
EXTRA_CELEBS_TS  = "src/data/extraCelebrities.ts"
PROFILES_DIR     = "data/profiles"
CELEBRITIES_DIR  = "data/celebrities"
PHOTOS_CACHE     = "public/data/photosCache.json"
CELEBS_PHOTOS    = "public/data/celebs_photos.json"
OUTPUT_FILE      = "public/data/celebs.json"

BAD_PHOTO_KW = ["ui-avatars", "placeholder", "silhouette", "unknown"]

# Matches the CI constant in extraCelebrities.ts
CATEGORY_COVER = {
    "Athletes":      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&q=80",
    "Actors":        "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&q=80",
    "Musicians":     "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&q=80",
    "Entrepreneurs": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80",
    "Politicians":   "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=1200&q=80",
    "Models":        "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&q=80",
}
DEFAULT_COVER = "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80"


# ── helpers ────────────────────────────────────────────────────────────────────

def load_json(path, default=None):
    if not os.path.exists(path):
        return default if default is not None else {}
    with open(path, encoding="utf-8") as f:
        return json.load(f)

def is_good_photo(url):
    if not url or len(url) < 20:
        return False
    return not any(kw in url.lower() for kw in BAD_PHOTO_KW)

def best_photo(slug, name, fallback_url, photos_cache, celebs_photos):
    """Return (url, source) using priority order."""
    if slug in photos_cache:
        url = photos_cache[slug]
        if isinstance(url, str) and is_good_photo(url):
            return url, "photosCache"
    if name in celebs_photos:
        url = celebs_photos[name].get("image", "")
        src = celebs_photos[name].get("photo_source", "celebs_photos")
        if is_good_photo(url):
            return url, src
    if is_good_photo(fallback_url):
        return fallback_url, "source_file"
    return "", "none"


# ── TypeScript tokeniser ───────────────────────────────────────────────────────

def _next_token(s, pos):
    """Return (value, new_pos) for the next JS/TS value token starting at pos."""
    n = len(s)
    while pos < n and s[pos] in " \t\n,":
        pos += 1
    if pos >= n:
        return None, pos

    ch = s[pos]

    if ch == "'":
        buf, i = [], pos + 1
        while i < n:
            if s[i] == "\\" and i + 1 < n:
                buf.append(s[i + 1])
                i += 2
            elif s[i] == "'":
                return "".join(buf), i + 1
            else:
                buf.append(s[i])
                i += 1
        return "".join(buf), i

    if ch in ('"', "`"):
        closing = ch
        i = pos + 1
        while i < n and s[i] != closing:
            if s[i] == "\\":
                i += 2
            else:
                i += 1
        return s[pos + 1:i], i + 1

    if ch == "{":
        depth, i = 1, pos + 1
        while i < n and depth:
            if s[i] == "{": depth += 1
            elif s[i] == "}": depth -= 1
            i += 1
        return None, i

    if ch.isalpha() or ch == "_":
        end = pos
        while end < n and (s[end].isalnum() or s[end] in "_"):
            end += 1
        if end < n and s[end] == "(":
            depth, i = 1, end + 1
            while i < n and depth:
                if s[i] == "(": depth += 1
                elif s[i] == ")": depth -= 1
                i += 1
            return None, i   # function call → positional placeholder
        word = s[pos:end]
        if word == "true": return True, end
        if word == "false": return False, end
        return word, end

    if ch.isdigit() or (ch == "-" and pos + 1 < n and s[pos + 1].isdigit()):
        end = pos
        if s[end] == "-": end += 1
        while end < n and (s[end].isdigit() or s[end] == "."):
            end += 1
        raw = s[pos:end]
        return (float(raw) if "." in raw else int(raw)), end

    return None, pos + 1


def parse_mk_args(arg_string):
    """Tokenise mk() arguments, ALWAYS appending (including None) to preserve positions."""
    tokens, pos = [], 0
    while pos < len(arg_string):
        val, new_pos = _next_token(arg_string, pos)
        if new_pos == pos:
            break
        tokens.append(val)   # ← always append; None = placeholder for av()/{}
        pos = new_pos
        if len(tokens) >= 18:
            break
    return tokens


# ── parse extraCelebrities.ts ─────────────────────────────────────────────────

def parse_extra_celebrities(ts_path, photos_cache, celebs_photos):
    if not os.path.exists(ts_path):
        print(f"⚠️  {ts_path} not found")
        return []

    content = open(ts_path, encoding="utf-8").read()
    celebs  = []

    for line in content.splitlines():
        line = line.strip()
        if not line.startswith("mk("):
            continue
        inner = line[3:]
        if inner.endswith("),"):
            inner = inner[:-2]
        elif inner.endswith(")"):
            inner = inner[:-1]

        tokens = parse_mk_args(inner)
        if len(tokens) < 12:
            continue

        # positional mapping
        idx   = tokens[0]  if isinstance(tokens[0],  str)           else ""
        name  = tokens[1]  if len(tokens) > 1  and isinstance(tokens[1],  str)           else ""
        cat   = tokens[2]  if len(tokens) > 2  and isinstance(tokens[2],  str)           else ""
        nw    = tokens[3]  if len(tokens) > 3  and isinstance(tokens[3],  (int, float))  else 0
        nat   = tokens[4]  if len(tokens) > 4  and isinstance(tokens[4],  str)           else ""
        prof  = tokens[5]  if len(tokens) > 5  and isinstance(tokens[5],  str)           else ""
        bd    = tokens[6]  if len(tokens) > 6  and isinstance(tokens[6],  str)           else ""
        bp    = tokens[7]  if len(tokens) > 7  and isinstance(tokens[7],  str)           else ""
        gender= tokens[8]  if len(tokens) > 8  and isinstance(tokens[8],  str)           else ""
        ht    = tokens[9]  if len(tokens) > 9  and isinstance(tokens[9],  str)           else ""
        bio   = tokens[10] if len(tokens) > 10 and isinstance(tokens[10], str)           else ""
        # token[11]: avatar URL string OR None (when av() was used)
        raw_avatar = tokens[11] if len(tokens) > 11 else None
        avatar_url = raw_avatar if isinstance(raw_avatar, str) else ""
        a1t   = tokens[12] if len(tokens) > 12 and isinstance(tokens[12], str)           else ""
        a1n   = tokens[13] if len(tokens) > 13 and isinstance(tokens[13], str)           else ""
        a1v   = tokens[14] if len(tokens) > 14 and isinstance(tokens[14], (int, float))  else 0
        a1d   = tokens[15] if len(tokens) > 15 and isinstance(tokens[15], str)           else ""

        if not name:
            continue

        slug = idx if idx else re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")
        photo_url, photo_src = best_photo(slug, name, avatar_url, photos_cache, celebs_photos)

        entry = {
            "id":          slug,
            "slug":        slug,
            "name":        name,
            "category":    cat,
            "netWorth":    nw,
            "avatar":      photo_url or avatar_url,
            "coverImage":  CATEGORY_COVER.get(cat, DEFAULT_COVER),
            "nationality": nat,
            "bio":         bio,
            "trending":    False,
            "birthdate":   bd,
            "birthplace":  bp,
            "gender":      gender,
            "height":      ht,
            "profession":  prof,
            "photos":      [photo_url or avatar_url] if (photo_url or avatar_url) else [],
            "assets":      [],
            "lastUpdated": "2026-03-20",
        }
        if photo_url:
            entry["photo_source"] = photo_src

        if a1t and a1n:
            entry["assets"].append({
                "id":             f"{slug}-1",
                "type":           a1t,
                "name":           a1n,
                "description":    a1d,
                "estimatedValue": a1v,
            })

        celebs.append(entry)

    print(f"📋 Parsed {len(celebs)} celebrities from {ts_path}")
    return celebs


# ── load profile JSON files ────────────────────────────────────────────────────

def load_profile_files(directory, photos_cache, celebs_photos):
    if not os.path.exists(directory):
        return []
    result = []
    for fname in sorted(os.listdir(directory)):
        if not fname.endswith(".json"):
            continue
        raw  = load_json(os.path.join(directory, fname))
        slug = raw.get("slug") or fname.replace(".json", "")
        name = raw.get("name") or slug.replace("-", " ").title()
        cat  = raw.get("category", "Entrepreneurs")

        pi       = raw.get("profile_image", {})
        fallback = pi.get("url") or raw.get("image") or raw.get("avatar") or ""
        photo_url, photo_src = best_photo(slug, name, fallback, photos_cache, celebs_photos)

        entry = {k: v for k, v in raw.items() if k not in ("profile_image",)}
        entry["id"]          = entry.get("id", slug)
        entry["slug"]        = slug
        entry["name"]        = name
        entry["avatar"]      = photo_url or fallback
        entry["coverImage"]  = entry.get("coverImage", CATEGORY_COVER.get(cat, DEFAULT_COVER))
        entry["trending"]    = entry.get("trending", False)
        entry["photos"]      = entry.get("photos", [photo_url or fallback] if (photo_url or fallback) else [])
        if photo_url:
            entry["photo_source"] = photo_src
        result.append(entry)
    return result


# ── main ───────────────────────────────────────────────────────────────────────

def main():
    print("📂 Loading photo caches…")
    photos_cache   = load_json(PHOTOS_CACHE)
    celebs_photos  = load_json(CELEBS_PHOTOS)
    print(f"   photosCache  : {len(photos_cache)} entries")
    print(f"   celebs_photos: {len(celebs_photos)} entries")

    extra = parse_extra_celebrities(EXTRA_CELEBS_TS, photos_cache, celebs_photos)
    slim  = load_profile_files(PROFILES_DIR,    photos_cache, celebs_photos)
    rich  = load_profile_files(CELEBRITIES_DIR, photos_cache, celebs_photos)
    print(f"   data/profiles/    : {len(slim)} files")
    print(f"   data/celebrities/ : {len(rich)} files")

    master_map: dict = {}

    for c in extra:
        master_map[c["slug"]] = c

    for c in slim:
        slug = c["slug"]
        if slug in master_map:
            ex = master_map[slug]
            ex.update({k: v for k, v in c.items() if v and k not in ("avatar", "photo_source", "photos")})
            if is_good_photo(c.get("avatar", "")) and not is_good_photo(ex.get("avatar", "")):
                ex["avatar"] = c["avatar"]
                ex["photos"] = c.get("photos", [c["avatar"]])
                ex["photo_source"] = c.get("photo_source", "profile_file")
        else:
            master_map[slug] = c

    for c in rich:
        slug = c["slug"]
        if slug in master_map:
            ex = master_map[slug]
            ex.update({k: v for k, v in c.items() if v and k not in ("avatar", "photo_source", "photos")})
            if is_good_photo(c.get("avatar", "")) and not is_good_photo(ex.get("avatar", "")):
                ex["avatar"] = c["avatar"]
                ex["photos"] = c.get("photos", [c["avatar"]])
                ex["photo_source"] = c.get("photo_source", "profile_file")
        else:
            master_map[slug] = c

    master = sorted(master_map.values(), key=lambda x: x.get("name", "").lower())

    # Ensure required fields exist on every entry
    for c in master:
        c.setdefault("id",         c.get("slug", ""))
        c.setdefault("avatar",     "")
        c.setdefault("coverImage", DEFAULT_COVER)
        c.setdefault("trending",   False)
        c.setdefault("photos",     [c["avatar"]] if c.get("avatar") else [])
        c.setdefault("assets",     [])
        c.setdefault("bio",        "")
        c.setdefault("birthdate",  "")
        c.setdefault("birthplace", "")
        c.setdefault("gender",     "")
        c.setdefault("height",     "")
        c.setdefault("profession", "")
        c.setdefault("nationality","")
        c.setdefault("netWorth",   0)

    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(master, f, ensure_ascii=False, indent=2)

    with_photo = sum(1 for c in master if is_good_photo(c.get("avatar", "")))
    print(f"\n✅ Wrote {len(master)} celebrities to {OUTPUT_FILE}")
    print(f"   With real photo : {with_photo}/{len(master)}")

    elon = next((c for c in master if "elon-musk" in c.get("slug", "")), master[0])
    print(f"\n📋 Example – {elon['name']}:")
    print(json.dumps({k: v for k, v in elon.items() if k != "assets"}, indent=2))
    print(f'   "assets": [{len(elon.get("assets", []))} item(s)]')


if __name__ == "__main__":
    main()
