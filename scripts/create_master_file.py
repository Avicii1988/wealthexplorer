"""
create_master_file.py  –  single source of truth builder
========================================================
Merges ALL celebrity sources into data/celebs.json:
  1. src/data/extraCelebrities.ts  (615 slim profiles, parsed from mk() calls)
  2. data/profiles/*.json          (30 richer profile files)
  3. data/celebrities/*.json       (3 detailed celebrity files)
  4. src/data/photosCache.json     (keyed by slug → URL)
  5. src/data/celebs_photos.json   (keyed by name → {image, photo_source})

Photo priority: photosCache > celebs_photos > profile_image.url > extraCelebrity avatar
"""

import json, os, re, sys

# ── paths ──────────────────────────────────────────────────────────────────────
EXTRA_CELEBS_TS  = "src/data/extraCelebrities.ts"
PROFILES_DIR     = "data/profiles"
CELEBRITIES_DIR  = "data/celebrities"
PHOTOS_CACHE     = "src/data/photosCache.json"
CELEBS_PHOTOS    = "src/data/celebs_photos.json"
OUTPUT_FILE      = "data/celebs.json"

BAD_PHOTO_KW = ["ui-avatars", "placeholder", "silhouette", "unknown", "default-avatar"]


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
    # 1. photosCache – keyed by slug (Wikipedia/TMDB quality)
    if slug in photos_cache:
        url = photos_cache[slug]
        if isinstance(url, str) and is_good_photo(url):
            return url, "photosCache"
    # 2. celebs_photos – keyed by name (SearchAPI enriched)
    if name in celebs_photos:
        url = celebs_photos[name].get("image", "")
        src = celebs_photos[name].get("photo_source", "celebs_photos")
        if is_good_photo(url):
            return url, src
    # 3. fallback (avatar/profile_image from source file)
    if is_good_photo(fallback_url):
        return fallback_url, "source_file"
    return "", "none"


# ── tokeniser for mk() calls in TypeScript ────────────────────────────────────

def _next_token(s, pos):
    """Return (value, new_pos) for the next JS/TS value token starting at pos."""
    n = len(s)
    # skip whitespace & commas
    while pos < n and s[pos] in " \t\n,":
        pos += 1
    if pos >= n:
        return None, pos

    ch = s[pos]

    # single-quoted string (with backslash escapes)
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

    # template literal or double-quoted string (just skip them)
    if ch in ('"', "`"):
        closing = ch
        i = pos + 1
        while i < n and s[i] != closing:
            if s[i] == "\\" :
                i += 2
            else:
                i += 1
        return s[pos + 1:i], i + 1

    # object literal { … } – return None (too complex to parse here)
    if ch == "{":
        depth, i = 1, pos + 1
        while i < n and depth:
            if s[i] == "{": depth += 1
            elif s[i] == "}": depth -= 1
            i += 1
        return None, i   # signal: skip

    # function call  av('…')  or  encodeURIComponent(…)
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
            return None, i  # skip function calls
        # bare word (true / false / identifier)
        word = s[pos:end]
        if word == "true": return True, end
        if word == "false": return False, end
        return word, end

    # number (int or float, possibly negative)
    if ch.isdigit() or (ch == "-" and pos + 1 < n and s[pos + 1].isdigit()):
        end = pos
        if s[end] == "-": end += 1
        while end < n and (s[end].isdigit() or s[end] == "."):
            end += 1
        raw = s[pos:end]
        return (float(raw) if "." in raw else int(raw)), end

    # skip anything else
    return None, pos + 1


def parse_mk_args(arg_string):
    """Tokenise the arguments string of a mk(...) call."""
    tokens, pos = [], 0
    while pos < len(arg_string):
        val, pos = _next_token(arg_string, pos)
        if val is not None or (pos > 0 and arg_string[pos - 1] == "}"):
            tokens.append(val)
        if len(tokens) >= 18:   # we only need the first 16 positional args
            break
    return tokens


def parse_extra_celebrities(ts_path, photos_cache, celebs_photos):
    """Parse mk() calls from extraCelebrities.ts → list of celeb dicts."""
    if not os.path.exists(ts_path):
        print(f"⚠️  {ts_path} not found")
        return []

    content = open(ts_path, encoding="utf-8").read()

    # Each mk() call is on a single (possibly very long) line starting after  mk(
    pattern = re.compile(r"mk\((.+)\)(?:,\s*$|\s*\))", re.MULTILINE)

    # Simpler: find the array body and split by line, then find lines with mk(
    celebs = []
    for line in content.splitlines():
        line = line.strip()
        if not line.startswith("mk("):
            continue
        # strip trailing  ),  or  )
        inner = line[3:]                  # drop leading  mk(
        if inner.endswith("),"):
            inner = inner[:-2]
        elif inner.endswith(")"):
            inner = inner[:-1]

        tokens = parse_mk_args(inner)
        if len(tokens) < 12:
            continue

        # positional mapping
        # 0:id 1:name 2:cat 3:nw 4:nat 5:prof 6:bd 7:bp 8:g 9:ht 10:bio 11:avatar
        # 12:a1type 13:a1name 14:a1val 15:a1desc
        idx   = tokens[0] if isinstance(tokens[0], str) else ""
        name  = tokens[1] if len(tokens) > 1 and isinstance(tokens[1], str) else ""
        cat   = tokens[2] if len(tokens) > 2 and isinstance(tokens[2], str) else ""
        nw    = tokens[3] if len(tokens) > 3 and isinstance(tokens[3], (int, float)) else 0
        nat   = tokens[4] if len(tokens) > 4 and isinstance(tokens[4], str) else ""
        prof  = tokens[5] if len(tokens) > 5 and isinstance(tokens[5], str) else ""
        bd    = tokens[6] if len(tokens) > 6 and isinstance(tokens[6], str) else ""
        bp    = tokens[7] if len(tokens) > 7 and isinstance(tokens[7], str) else ""
        gender= tokens[8] if len(tokens) > 8 and isinstance(tokens[8], str) else ""
        ht    = tokens[9] if len(tokens) > 9 and isinstance(tokens[9], str) else ""
        bio   = tokens[10] if len(tokens) > 10 and isinstance(tokens[10], str) else ""
        # token[11] is the avatar expression – None if it was av() call, URL string otherwise
        raw_avatar = tokens[11] if len(tokens) > 11 else None
        avatar_url = raw_avatar if isinstance(raw_avatar, str) else ""

        a1t   = tokens[12] if len(tokens) > 12 and isinstance(tokens[12], str) else ""
        a1n   = tokens[13] if len(tokens) > 13 and isinstance(tokens[13], str) else ""
        a1v   = tokens[14] if len(tokens) > 14 and isinstance(tokens[14], (int, float)) else 0
        a1d   = tokens[15] if len(tokens) > 15 and isinstance(tokens[15], str) else ""

        if not name:
            continue

        slug = idx if idx else re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")
        photo_url, photo_src = best_photo(slug, name, avatar_url, photos_cache, celebs_photos)

        entry = {
            "name": name,
            "slug": slug,
            "image": photo_url,
            "photo_source": photo_src,
            "category": cat,
            "netWorth": nw,
            "nationality": nat,
            "profession": prof,
            "birthdate": bd,
            "birthplace": bp,
            "gender": gender,
            "height": ht,
            "bio": bio,
            "assets": [],
        }
        if a1t:
            entry["assets"].append({
                "id": f"{slug}-1",
                "type": a1t,
                "name": a1n,
                "estimatedValue": a1v,
                "description": a1d,
            })

        celebs.append(entry)

    print(f"📋 Parsed {len(celebs)} celebrities from {ts_path}")
    return celebs


def load_profile_files(directory, photos_cache, celebs_photos):
    """Load JSON profile files → list of normalised dicts."""
    if not os.path.exists(directory):
        return []
    result = []
    for fname in sorted(os.listdir(directory)):
        if not fname.endswith(".json"):
            continue
        raw = load_json(os.path.join(directory, fname))
        slug = raw.get("slug") or fname.replace(".json", "")
        name = raw.get("name") or slug.replace("-", " ").title()

        # profile_image may be nested
        pi = raw.get("profile_image", {})
        fallback = pi.get("url") or raw.get("image") or ""
        photo_url, photo_src = best_photo(slug, name, fallback, photos_cache, celebs_photos)

        entry = {k: v for k, v in raw.items() if k not in ("profile_image",)}
        entry["name"] = name
        entry["slug"] = slug
        entry["image"] = photo_url
        entry["photo_source"] = photo_src
        result.append(entry)
    return result


# ── main ───────────────────────────────────────────────────────────────────────

def main():
    print("📂 Loading photo caches…")
    photos_cache   = load_json(PHOTOS_CACHE)   # {slug: url}
    celebs_photos  = load_json(CELEBS_PHOTOS)  # {name: {image, photo_source}}
    print(f"   photosCache  : {len(photos_cache)} entries")
    print(f"   celebs_photos: {len(celebs_photos)} entries")

    # ── 1. Parse extraCelebrities.ts ──────────────────────────────────────────
    extra = parse_extra_celebrities(EXTRA_CELEBS_TS, photos_cache, celebs_photos)

    # ── 2. Load profile JSON files ────────────────────────────────────────────
    slim   = load_profile_files(PROFILES_DIR,    photos_cache, celebs_photos)
    rich   = load_profile_files(CELEBRITIES_DIR, photos_cache, celebs_photos)
    print(f"   data/profiles/    : {len(slim)} files")
    print(f"   data/celebrities/ : {len(rich)} files")

    # ── 3. Merge (deduplicate by slug, richer data wins) ──────────────────────
    master_map = {}   # slug → entry

    # Start with extra celebrities (least rich)
    for c in extra:
        master_map[c["slug"]] = c

    # Overlay slim profiles (may add fields like last_updated, notes)
    for c in slim:
        slug = c["slug"]
        if slug in master_map:
            existing = master_map[slug]
            existing.update({k: v for k, v in c.items() if v and k not in ("image", "photo_source")})
            # keep better photo
            if is_good_photo(c.get("image", "")) and not is_good_photo(existing.get("image", "")):
                existing["image"] = c["image"]
                existing["photo_source"] = c["photo_source"]
        else:
            master_map[slug] = c

    # Overlay rich celebrities (most detail – assets, etc.)
    for c in rich:
        slug = c["slug"]
        if slug in master_map:
            existing = master_map[slug]
            existing.update({k: v for k, v in c.items() if v and k not in ("image", "photo_source")})
            if is_good_photo(c.get("image", "")) and not is_good_photo(existing.get("image", "")):
                existing["image"] = c["image"]
                existing["photo_source"] = c["photo_source"]
        else:
            master_map[slug] = c

    # ── 4. Sort and write ─────────────────────────────────────────────────────
    master = sorted(master_map.values(), key=lambda x: x.get("name", "").lower())

    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(master, f, ensure_ascii=False, indent=2)

    # stats
    with_photo = sum(1 for c in master if is_good_photo(c.get("image", "")))
    src_counts = {}
    for c in master:
        s = c.get("photo_source", "none")
        src_counts[s] = src_counts.get(s, 0) + 1

    print(f"\n✅ Wrote {len(master)} celebrities to {OUTPUT_FILE}")
    print(f"   With real photo : {with_photo}/{len(master)}")
    print(f"   Photo sources   : {dict(sorted(src_counts.items()))}")

    # example entry
    elon = next((c for c in master if "elon-musk" in c.get("slug", "")), master[0])
    preview = {k: v for k, v in elon.items() if k != "assets"}
    print(f"\n📋 Example – {elon['name']}:")
    print(json.dumps(preview, indent=2, ensure_ascii=False))
    asset_count = len(elon.get("assets", []))
    if asset_count:
        print(f'   "assets": [{asset_count} item(s)]')


if __name__ == "__main__":
    main()
