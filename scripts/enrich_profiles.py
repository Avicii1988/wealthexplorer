#!/usr/bin/env python3
"""
Celebrity Profile Picture Enrichment Script
============================================
Fetches the best available portrait image for each celebrity from:
  1. English Wikipedia (MediaWiki pageimages API)
  2. Wikimedia Commons (file search fallback)
  3. SearchApi.io Google Images (final fallback)

Writes one JSON file per celebrity to data/profiles/<slug>.json

Usage:
  python enrich_profiles.py                          # run on built-in sample list
  python enrich_profiles.py --limit 10 --dry-run     # test first 10, no files written
  python enrich_profiles.py --input-file names.txt   # full 500-name run
  python enrich_profiles.py --input-file names.txt --force  # overwrite existing
"""

import os
import re
import sys
import json
import time
import random
import argparse
import unicodedata
from datetime import date
from typing import Optional, Dict, Any

import requests

# ─── CONFIGURATION ────────────────────────────────────────────────────────────

SEARCHAPI_API_KEY = "HfKbPSqtWRDFkc7ZbAYtdL5A"

WIKIPEDIA_UA = (
    "WealthExplorerBot/1.0 "
    "(https://github.com/yourusername/wealth-explorer; your.email@example.com)"
)

OUTPUT_DIR    = "data/profiles"
MIN_WIDTH_PX  = 300          # reject images narrower than this
SLEEP_MIN     = 2.0          # seconds — between individual HTTP requests
SLEEP_MAX     = 6.0
EXTRA_MIN     = 1.0          # extra inter-celebrity pause (stacks on top)
EXTRA_MAX     = 3.0

# ─── SAMPLE CELEBRITY LIST ────────────────────────────────────────────────────
# Replace / extend this list, or use --input-file for the full 500-name run.

SAMPLE_CELEBRITIES: list = [
    "Cristiano Ronaldo",
    "Lionel Messi",
    "LeBron James",
    "Tiger Woods",
    "Serena Williams",
    "Elon Musk",
    "Jeff Bezos",
    "Mark Zuckerberg",
    "Warren Buffett",
    "Oprah Winfrey",
    "Rihanna",
    "Taylor Swift",
    "Beyoncé",
    "Jay-Z",
    "Kanye West",
    "Drake",
    "Kim Kardashian",
    "Kylie Jenner",
    "Dwayne Johnson",
    "Tom Hanks",
    "Meryl Streep",
    "Brad Pitt",
    "Angelina Jolie",
    "Leonardo DiCaprio",
    "Will Smith",
    "Denzel Washington",
    "Jennifer Lopez",
    "Shakira",
    "Michael Jordan",
    "Floyd Mayweather",
]

# ─── LOGGING ──────────────────────────────────────────────────────────────────

_COLORS = {
    "INFO":    "\033[94m",   # blue
    "SUCCESS": "\033[92m",   # green
    "WARN":    "\033[93m",   # yellow
    "ERROR":   "\033[91m",   # red
    "RESET":   "\033[0m",
}


def log(level: str, msg: str) -> None:
    ts    = time.strftime("%H:%M:%S")
    color = _COLORS.get(level, "")
    reset = _COLORS["RESET"]
    print(f"{color}{ts} [{level:<7}] {msg}{reset}", flush=True)


# ─── UTILITIES ────────────────────────────────────────────────────────────────

def slugify(name: str) -> str:
    """
    'Beyoncé Knowles-Carter' → 'beyonce-knowles-carter'
    Handles unicode, accents, apostrophes, dots.
    """
    nfkd   = unicodedata.normalize("NFKD", name)
    ascii_ = nfkd.encode("ascii", "ignore").decode("ascii")
    lower  = ascii_.lower()
    hyphen = re.sub(r"[\s_]+", "-", lower)
    clean  = re.sub(r"[^a-z0-9\-]", "", hyphen)
    return  re.sub(r"-{2,}", "-", clean).strip("-")


def _sleep(label: str = "") -> None:
    secs = random.uniform(SLEEP_MIN, SLEEP_MAX)
    log("INFO", f"Waiting {secs:.1f}s{(' — ' + label) if label else ''}")
    time.sleep(secs)


def _make_wikimedia_thumb(original_url: str, size: int = 300) -> str:
    """
    Convert a Wikimedia original URL to a thumbnail URL.

    Original:  .../commons/a/ab/Filename.jpg
    Thumb:     .../commons/thumb/a/ab/Filename.jpg/300px-Filename.jpg
    """
    pattern = re.compile(
        r"(https://upload\.wikimedia\.org/"
        r"(?:wikipedia/[a-z]+|wikimedia/commons))"
        r"/([a-f0-9]/[a-f0-9]{2})"
        r"/(.+)$"
    )
    m = pattern.match(original_url)
    if not m:
        return original_url   # fallback: return original unchanged
    base, hash_path, filename = m.group(1), m.group(2), m.group(3)
    ext = os.path.splitext(filename)[1].lower()
    if ext not in {".jpg", ".jpeg", ".png", ".webp"}:
        return original_url
    return f"{base}/thumb/{hash_path}/{filename}/{size}px-{filename}"


def _looks_like_portrait_url(url: str) -> bool:
    """Heuristic: reject URLs that clearly are not portrait photographs."""
    bad = {"logo", "icon", "banner", "flag", "cartoon", "meme", "render",
           "illustration", "signature", "trophy", "stadium", "shirt", "jersey"}
    parts = url.lower().split("/")
    filename = parts[-1] if parts else ""
    return not any(b in filename for b in bad)


# ─── WIKIPEDIA / MEDIAWIKI ────────────────────────────────────────────────────

WIKI_API    = "https://en.wikipedia.org/w/api.php"
COMMONS_API = "https://commons.wikimedia.org/w/api.php"

# Set to True automatically when we detect the local environment blocks Wikipedia
_WIKIPEDIA_BLOCKED = False


def _new_session() -> requests.Session:
    s = requests.Session()
    # NOTE: Only set User-Agent — extra Accept headers trigger 403 on some proxies
    s.headers.update({"User-Agent": WIKIPEDIA_UA})
    return s


def _probe_wikipedia(session: requests.Session) -> bool:
    """
    Quick probe to see if Wikipedia is reachable.
    Returns True if reachable, False if blocked by proxy/firewall.
    Sets the global _WIKIPEDIA_BLOCKED flag accordingly.
    """
    global _WIKIPEDIA_BLOCKED
    try:
        r = session.get(
            WIKI_API,
            params={"action": "query", "titles": "Test", "format": "json"},
            timeout=8,
        )
        if r.status_code == 403 and "egress policy" in r.text.lower():
            log("WARN", "Wikipedia is blocked by egress policy — skipping Wikipedia/Commons, using SearchApi only")
            _WIKIPEDIA_BLOCKED = True
            return False
        _WIKIPEDIA_BLOCKED = False
        return True
    except Exception:
        _WIKIPEDIA_BLOCKED = True
        return False


def fetch_wikipedia_image(
    name: str, session: requests.Session
) -> Optional[Dict[str, Any]]:
    """
    Query the English Wikipedia pageimages API.
    Returns image dict on success, None on failure / no suitable image.
    """
    if _WIKIPEDIA_BLOCKED:
        return None

    params: Dict[str, Any] = {
        "action":      "query",
        "titles":      name,
        "prop":        "pageimages",
        "piprop":      "original|thumbnail",
        "pilimit":     "1",
        "pithumbsize": "300",
        "redirects":   "1",
        "format":      "json",
    }
    try:
        resp = session.get(WIKI_API, params=params, timeout=15)
        resp.raise_for_status()
        data = resp.json()
    except requests.RequestException as exc:
        log("ERROR", f"Wikipedia request error for '{name}': {exc}")
        return None
    except ValueError as exc:
        log("ERROR", f"Wikipedia JSON parse error for '{name}': {exc}")
        return None

    pages = data.get("query", {}).get("pages", {})
    if not pages:
        return None

    page = next(iter(pages.values()))

    # Missing page or disambiguation
    if "missing" in page:
        log("WARN", f"Wikipedia: page not found for '{name}'")
        return None

    original  = page.get("original")
    thumbnail = page.get("thumbnail")

    if not original:
        log("WARN", f"Wikipedia: no pageimage for '{name}'")
        return None

    orig_url = original.get("source", "")
    orig_w   = original.get("width", 0)
    orig_h   = original.get("height", 0)

    if not orig_url:
        return None
    if orig_url.lower().endswith(".svg"):
        log("WARN", f"Wikipedia: SVG image, skipping for '{name}'")
        return None
    if orig_w and orig_w < MIN_WIDTH_PX:
        log("WARN", f"Wikipedia: image too small ({orig_w}px) for '{name}'")
        return None
    if not _looks_like_portrait_url(orig_url):
        log("WARN", f"Wikipedia: image URL looks non-portrait, skipping for '{name}'")
        return None

    thumb_url = (
        thumbnail.get("source", "")
        if thumbnail
        else _make_wikimedia_thumb(orig_url, 300)
    )

    log("SUCCESS", f"Wikipedia ✓ {orig_w}×{orig_h} — {orig_url[:80]}")
    return {
        "url":           orig_url,
        "thumbnail_url": thumb_url or orig_url,
        "source":        "wikipedia",
        "width":         orig_w,
        "height":        orig_h,
        "found":         True,
    }


def fetch_commons_image(
    name: str, session: requests.Session
) -> Optional[Dict[str, Any]]:
    """
    Search Wikimedia Commons File namespace for a portrait of this person.
    Uses a scored selection: prefers files with the person's name + 'portrait'
    in the filename, highest resolution wins tie-breaks.
    Skipped automatically when the egress proxy blocks Wikipedia.
    """
    if _WIKIPEDIA_BLOCKED:
        return None

    params: Dict[str, Any] = {
        "action":       "query",
        "generator":    "search",
        "gsrnamespace": "6",                 # File: namespace
        "gsrsearch":    f"{name} portrait",
        "gsrlimit":     "15",
        "prop":         "imageinfo",
        "iiprop":       "url|size|mime",
        "iiurlwidth":   "300",
        "format":       "json",
    }
    try:
        resp = session.get(COMMONS_API, params=params, timeout=15)
        resp.raise_for_status()
        data = resp.json()
    except requests.RequestException as exc:
        log("ERROR", f"Commons request error for '{name}': {exc}")
        return None
    except ValueError as exc:
        log("ERROR", f"Commons JSON parse error for '{name}': {exc}")
        return None

    pages = data.get("query", {}).get("pages", {})
    if not pages:
        log("WARN", f"Commons: no results for '{name}'")
        return None

    name_parts = [p.lower() for p in name.split()]
    good_kw    = {"portrait", "photo", "headshot"} | set(name_parts)
    bad_kw     = {"logo", "icon", "jersey", "shirt", "flag", "banner",
                  "cartoon", "render", "signature", "trophy", "stadium"}

    best: Optional[Dict[str, Any]] = None
    best_score = -1

    for page in pages.values():
        title    = page.get("title", "").lower()   # "File: ..."
        ii_list  = page.get("imageinfo") or []
        if not ii_list:
            continue
        ii = ii_list[0]

        mime = ii.get("mime", "")
        if "svg" in mime or "gif" in mime:
            continue

        url = ii.get("url", "")
        w   = ii.get("width", 0)
        h   = ii.get("height", 0)

        if not url or (w and w < MIN_WIDTH_PX):
            continue
        if any(b in title for b in bad_kw):
            continue
        if not _looks_like_portrait_url(url):
            continue

        score = sum(1 for kw in good_kw if kw in title)
        score += min(w, 2000) / 200.0   # resolution bonus (capped at 2000px)

        if score > best_score:
            best_score = score
            thumb_url  = ii.get("thumburl", "") or _make_wikimedia_thumb(url, 300)
            best = {
                "url":           url,
                "thumbnail_url": thumb_url or url,
                "source":        "wikipedia",   # Commons is Wikimedia
                "width":         w,
                "height":        h,
                "found":         True,
            }

    if best:
        log("SUCCESS", f"Commons ✓ {best['width']}×{best['height']} — {best['url'][:80]}")
    else:
        log("WARN", f"Commons: no suitable image for '{name}'")

    return best


# ─── SEARCHAPI.IO FALLBACK ────────────────────────────────────────────────────

SEARCHAPI_URL = "https://www.searchapi.io/api/v1/search"

# Domains that gate images behind paywalls / watermarks
_STOCK_DOMAINS = {
    "shutterstock.com", "gettyimages.com", "alamy.com",
    "istockphoto.com", "depositphotos.com", "dreamstime.com",
    "bigstockphoto.com", "123rf.com",
}


def fetch_searchapi_image(name: str) -> Optional[Dict[str, Any]]:
    """
    Fall back to SearchApi.io Google Images for a portrait photo.
    Picks the first result that passes quality / domain filters.
    Retries up to 3 times on 429 with exponential backoff (15 / 30 / 60 s).
    """
    query = (
        f'"{name}" official portrait headshot 2025 OR 2026 '
        "-cartoon -meme -ai -render -illustration -logo"
    )
    params: Dict[str, Any] = {
        "engine":  "google_images",
        "q":       query,
        "api_key": SEARCHAPI_API_KEY,
        "num":     "10",
    }
    backoff_secs = [15, 30, 60]
    for attempt, wait in enumerate(backoff_secs + [None], start=1):
        try:
            resp = requests.get(SEARCHAPI_URL, params=params, timeout=20)
            if resp.status_code == 429:
                if wait is None:
                    log("ERROR", f"SearchApi 429 — giving up after {attempt - 1} retries for '{name}'")
                    return None
                log("WARN", f"SearchApi 429 (rate limit) — waiting {wait}s before retry {attempt}/{len(backoff_secs)} for '{name}'")
                time.sleep(wait)
                continue
            resp.raise_for_status()
            data = resp.json()
            break   # success — exit retry loop
        except requests.exceptions.HTTPError as exc:
            log("ERROR", f"SearchApi HTTP error for '{name}': {exc}")
            return None
        except requests.RequestException as exc:
            log("ERROR", f"SearchApi request error for '{name}': {exc}")
            return None
        except ValueError as exc:
            log("ERROR", f"SearchApi JSON parse error for '{name}': {exc}")
            return None
    else:
        return None

    # SearchApi uses "images" or "image_results" depending on version
    images = data.get("images") or data.get("image_results") or []
    if not images:
        log("WARN", f"SearchApi: empty results for '{name}'")
        return None

    for img in images:
        # SearchApi format: original = {"link": "...", "width": N, "height": N}
        # thumbnail = "https://encrypted-tbn0..." (plain string)
        # Also handle older flat formats just in case.
        original_val = img.get("original")
        original     = original_val if isinstance(original_val, dict) else {}
        orig_url     = (original.get("link")          # SearchApi v1 uses "link"
                        or original.get("url")
                        or img.get("original_url")
                        or img.get("url") or "")
        orig_w       = (original.get("width")
                        or img.get("original_width")
                        or img.get("width") or 0)
        orig_h       = (original.get("height")
                        or img.get("original_height")
                        or img.get("height") or 0)

        # thumbnail is a plain string URL in SearchApi v1
        thumb_val = img.get("thumbnail")
        if isinstance(thumb_val, dict):
            thumb_url = thumb_val.get("link") or thumb_val.get("url", "")
        elif isinstance(thumb_val, str):
            thumb_url = thumb_val
        else:
            thumb_url = ""

        if not orig_url:
            continue
        if orig_w and orig_w < MIN_WIDTH_PX:
            continue
        if any(dom in orig_url for dom in _STOCK_DOMAINS):
            continue
        if not _looks_like_portrait_url(orig_url):
            continue

        log("SUCCESS", f"SearchApi ✓ {orig_w}×{orig_h} — {orig_url[:80]}")
        return {
            "url":           orig_url,
            "thumbnail_url": thumb_url if isinstance(thumb_url, str) else orig_url,
            "source":        "searchapi",
            "width":         orig_w,
            "height":        orig_h,
            "found":         True,
        }

    log("WARN", f"SearchApi: no suitable image for '{name}'")
    return None


# ─── PER-CELEBRITY ORCHESTRATION ─────────────────────────────────────────────

def process_celebrity(
    name: str,
    session: requests.Session,
    args: argparse.Namespace,
) -> Dict[str, Any]:
    """
    Run the full enrichment pipeline for one celebrity name.
    Returns the final profile dict (also written to disk unless --dry-run).
    """
    slug     = slugify(name)
    out_path = os.path.join(OUTPUT_DIR, f"{slug}.json")
    today    = date.today().isoformat()
    notes: list = []

    # ── Skip already-processed profiles unless --force ────────────────────────
    if not args.force and os.path.exists(out_path):
        log("INFO", f"Already exists, skipping: {out_path}  (use --force to overwrite)")
        with open(out_path, encoding="utf-8") as fh:
            return json.load(fh)

    log("INFO", f"→ {name}  [{slug}]")
    image_info: Optional[Dict[str, Any]] = None

    # ── Source 1: English Wikipedia pageimages ─────────────────────────────────
    image_info = fetch_wikipedia_image(name, session)
    if not _WIKIPEDIA_BLOCKED:
        _sleep("post-Wikipedia")

    # ── Source 2: Wikimedia Commons (only if Wikipedia failed) ────────────────
    if not image_info:
        if not _WIKIPEDIA_BLOCKED:
            notes.append("Wikipedia pageimage unavailable; tried Wikimedia Commons")
        image_info = fetch_commons_image(name, session)
        if not _WIKIPEDIA_BLOCKED and image_info is None:
            _sleep("post-Commons")

    # ── Source 3: SearchApi.io Google Images (final fallback) ─────────────────
    if not image_info:
        notes.append("Wikipedia/Commons had no suitable image; used SearchApi.io fallback")
        image_info = fetch_searchapi_image(name)
        _sleep("post-SearchApi")

    # ── No image found at all ─────────────────────────────────────────────────
    if not image_info:
        notes.append("All three sources exhausted — no image found")
        log("ERROR", f"No image found for '{name}'")
        image_info = {
            "url":           None,
            "thumbnail_url": None,
            "source":        None,
            "width":         0,
            "height":        0,
            "found":         False,
        }

    profile: Dict[str, Any] = {
        "name":          name,
        "slug":          slug,
        "last_updated":  today,
        "profile_image": image_info,
        "notes":         " | ".join(notes),
    }

    # ── Write or print ────────────────────────────────────────────────────────
    if args.dry_run:
        log("INFO", "[DRY-RUN] Would write: " + out_path)
        print(json.dumps(profile, indent=2, ensure_ascii=False))
    else:
        os.makedirs(OUTPUT_DIR, exist_ok=True)
        with open(out_path, "w", encoding="utf-8") as fh:
            json.dump(profile, fh, indent=2, ensure_ascii=False)
        log("SUCCESS", f"Written → {out_path}")

    return profile


# ─── CLI ──────────────────────────────────────────────────────────────────────

def build_arg_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(
        description=(
            "Enrich celebrity profile pictures from Wikipedia / SearchApi.io.\n"
            "Writes one JSON file per celebrity to data/profiles/<slug>.json"
        ),
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples
--------
  # Test with built-in sample list (dry-run, first 5 only)
  python enrich_profiles.py --limit 5 --dry-run

  # Run full enrichment from a file
  python enrich_profiles.py --input-file celebrities.txt

  # Re-run and overwrite existing files
  python enrich_profiles.py --input-file celebrities.txt --force --limit 20
        """,
    )
    p.add_argument(
        "--input-file", "-i",
        metavar="FILE",
        help="Text file with one celebrity name per line (UTF-8). "
             "If omitted, uses the built-in SAMPLE_CELEBRITIES list.",
    )
    p.add_argument(
        "--limit", "-n",
        type=int,
        default=None,
        metavar="N",
        help="Process only the first N celebrities (useful for smoke-testing).",
    )
    p.add_argument(
        "--dry-run",
        action="store_true",
        help="Print JSON to stdout instead of writing files. No files are created.",
    )
    p.add_argument(
        "--force", "-f",
        action="store_true",
        help="Overwrite existing JSON files (by default already-processed celebs are skipped).",
    )
    return p


# ─── MAIN ─────────────────────────────────────────────────────────────────────

def main() -> None:
    args = build_arg_parser().parse_args()

    # ── Load names ────────────────────────────────────────────────────────────
    if args.input_file:
        try:
            with open(args.input_file, encoding="utf-8") as fh:
                raw = [line.strip() for line in fh if line.strip()]
        except OSError as exc:
            log("ERROR", f"Cannot open input file: {exc}")
            sys.exit(1)
        log("INFO", f"Loaded {len(raw)} names from {args.input_file}")
    else:
        raw = list(SAMPLE_CELEBRITIES)
        log("INFO", f"Using built-in sample list ({len(raw)} names)")

    # Deduplicate while preserving insertion order
    seen: set = set()
    celebrities: list = []
    for n in raw:
        key = n.lower()
        if key not in seen:
            seen.add(key)
            celebrities.append(n)

    if len(celebrities) < len(raw):
        log("WARN", f"Removed {len(raw) - len(celebrities)} duplicate name(s)")

    if args.limit is not None:
        celebrities = celebrities[: args.limit]
        log("INFO", f"Limiting to first {len(celebrities)} celebrities")

    total   = len(celebrities)
    session = _new_session()
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    # Probe Wikipedia reachability once (sets _WIKIPEDIA_BLOCKED global)
    log("INFO", "Probing Wikipedia connectivity...")
    _probe_wikipedia(session)

    counters = {"found": 0, "missing": 0, "skipped": 0}

    log("INFO", "=" * 64)
    log("INFO", f"Starting enrichment  —  {total} celebrities  —  output: {OUTPUT_DIR}")
    log("INFO", "=" * 64)

    start_ts = time.time()

    for idx, name in enumerate(celebrities, 1):
        log("INFO", f"[{idx}/{total}] {'─' * 48}")
        try:
            profile   = process_celebrity(name, session, args)
            img       = profile.get("profile_image", {})
            slug      = slugify(name)
            out_path  = os.path.join(OUTPUT_DIR, f"{slug}.json")
            was_skip  = (
                not args.force
                and os.path.exists(out_path)
                and not args.dry_run
                and "last_updated" not in profile
            )
            if img.get("found"):
                counters["found"] += 1
            elif was_skip:
                counters["skipped"] += 1
            else:
                counters["missing"] += 1
        except Exception as exc:                       # last-resort safety net
            log("ERROR", f"Unhandled exception for '{name}': {exc}")
            counters["missing"] += 1

        # Inter-celebrity pause (in addition to per-request sleeps above)
        if idx < total:
            pause = random.uniform(EXTRA_MIN, EXTRA_MAX)
            time.sleep(pause)

    elapsed  = time.time() - start_ts
    h, rem   = divmod(int(elapsed), 3600)
    m, s     = divmod(rem, 60)

    log("INFO",    "=" * 64)
    log("SUCCESS", f"Finished in {h}h {m}m {s}s")
    log("SUCCESS",
        f"  found={counters['found']}  missing={counters['missing']}  skipped={counters['skipped']}"
    )
    log("INFO", f"Output directory: {os.path.abspath(OUTPUT_DIR)}")


if __name__ == "__main__":
    main()
