#!/usr/bin/env python3
"""
Live test: enrich profile pictures for 5 celebrities.
Sources: Wikipedia pageimages API (preferred) → SearchApi.io Google Images (fallback)
Output:  data/test-profiles/<slug>.json
"""
import os
import re
import json
import time
import random
import unicodedata
from datetime import date
from typing import Optional, Dict, Any
import requests
# ─── CONFIG ───────────────────────────────────────────────────────────────────
SEARCHAPI_KEY = "HfKbPSqtWRDFkc7ZbAYtdL5A"
WIKI_UA       = "WealthTestBot/1.0 (https://github.com/avicii1988/wealthexplorer; test-contact@example.com)"
WIKI_API      = "https://en.wikipedia.org/w/api.php"
SEARCHAPI_URL = "https://www.searchapi.io/api/v1/search"
OUTPUT_DIR    = "data/test-profiles"
TODAY         = date.today().isoformat()
CELEBRITIES = [
    "Cristiano Ronaldo",
    "Taylor Swift",
    "Donald Trump",
    "Justin Bieber",
    "Elon Musk",
]
SLEEP_MIN, SLEEP_MAX = 3, 7
# ─── HELPERS ──────────────────────────────────────────────────────────────────
def slugify(name: str) -> str:
    nfkd  = unicodedata.normalize("NFKD", name)
    ascii_= nfkd.encode("ascii", "ignore").decode("ascii")
    slug  = re.sub(r"[\s_]+", "-", ascii_.lower())
    slug  = re.sub(r"[^a-z0-9\-]", "", slug)
    return  re.sub(r"-{2,}", "-", slug).strip("-")
def _sleep(label: str = "") -> None:
    secs = random.uniform(SLEEP_MIN, SLEEP_MAX)
    print(f"  ⏱  sleeping {secs:.1f}s {label}")
    time.sleep(secs)
def _session() -> requests.Session:
    s = requests.Session()
    s.headers["User-Agent"] = WIKI_UA
    return s
_wiki_blocked: bool = False   # set after first probe
def _probe_wiki(session: requests.Session) -> bool:
    global _wiki_blocked
    try:
        r = session.get(WIKI_API,
                        params={"action": "query", "titles": "Test", "format": "json"},
                        timeout=8)
        if r.status_code == 403 and "egress" in r.text.lower():
            print("  ⚠  Wikipedia blocked by egress proxy — will use SearchApi only")
            _wiki_blocked = True
            return False
        _wiki_blocked = False
        return True
    except Exception as exc:
        print(f"  ⚠  Wikipedia probe failed: {exc}")
        _wiki_blocked = True
        return False
# ─── WIKIPEDIA ────────────────────────────────────────────────────────────────
def fetch_wikipedia(name: str, session: requests.Session) -> Optional[Dict[str, Any]]:
    """Return image dict or None."""
    if _wiki_blocked:
        return None
    params = {
        "action":      "query",
        "titles":      name,
        "prop":        "pageimages",
        "piprop":      "original|thumbnail",
        "pithumbsize": "400",
        "redirects":   "1",
        "format":      "json",
    }
    try:
        r = session.get(WIKI_API, params=params, timeout=15)
        r.raise_for_status()
        pages = r.json().get("query", {}).get("pages", {})
    except Exception as exc:
        print(f"  ✗ Wikipedia error: {exc}")
        return None
    page = next(iter(pages.values()), {})
    if "missing" in page:
        print(f"  ✗ Wikipedia: page not found for '{name}'")
        return None
    original  = page.get("original") or {}
    thumbnail = page.get("thumbnail") or {}
    orig_url  = original.get("source", "")
    orig_w    = original.get("width", 0)
    orig_h    = original.get("height", 0)
    if not orig_url or orig_url.lower().endswith(".svg"):
        print(f"  ✗ Wikipedia: no usable image for '{name}'")
        return None
    if orig_w and orig_w < 200:
        print(f"  ✗ Wikipedia: image too small ({orig_w}px) for '{name}'")
        return None
    thumb_url = thumbnail.get("source", orig_url)
    print(f"  ✓ Wikipedia: {orig_w}×{orig_h}  {orig_url[:72]}...")
    return {
        "url":           orig_url,
        "thumbnail_url": thumb_url,
        "source":        "wikipedia",
        "width":         orig_w or None,
        "height":        orig_h or None,
        "notes":         "",
    }
# ─── SEARCHAPI ────────────────────────────────────────────────────────────────
_STOCK = {"shutterstock.com", "gettyimages.com", "alamy.com",
          "istockphoto.com", "depositphotos.com", "dreamstime.com"}
_BAD_FNAME = {"logo", "icon", "banner", "cartoon", "meme", "render",
              "illustration", "signature", "flag", "jersey"}
def _looks_ok(url: str) -> bool:
    fname = url.lower().split("/")[-1].split("?")[0]
    return not any(b in fname for b in _BAD_FNAME)
def fetch_searchapi(name: str) -> Optional[Dict[str, Any]]:
    """Return image dict or None. Retries once on 429 after 30 s."""
    query  = (f'"{name}" official portrait headshot 2025 OR 2026 '
              "-cartoon -meme -ai -render -illustration -drawing")
    params = {"engine": "google_images", "q": query,
              "api_key": SEARCHAPI_KEY, "num": "10"}
    for attempt in range(2):   # try twice max
        try:
            r = requests.get(SEARCHAPI_URL, params=params, timeout=20)
            if r.status_code == 429:
                if attempt == 0:
                    print(f"  ⚠  SearchApi 429 — waiting 30 s then retrying...")
                    time.sleep(30)
                    continue
                print(f"  ✗ SearchApi 429 still after retry — giving up for '{name}'")
                return None
            r.raise_for_status()
            images = r.json().get("images") or r.json().get("image_results") or []
            break
        except Exception as exc:
            print(f"  ✗ SearchApi error: {exc}")
            return None
    else:
        return None
    for img in images:
        # SearchApi v1: original is {"link": "...", "width": N, "height": N}
        orig = img.get("original") if isinstance(img.get("original"), dict) else {}
        url  = orig.get("link") or orig.get("url") or img.get("url") or ""
        w    = orig.get("width")  or img.get("width")  or 0
        h    = orig.get("height") or img.get("height") or 0
        # thumbnail is a plain string in SearchApi v1
        thumb_raw = img.get("thumbnail")
        thumb = thumb_raw if isinstance(thumb_raw, str) else (
            thumb_raw.get("link") or thumb_raw.get("url", "") if isinstance(thumb_raw, dict) else ""
        )
        if not url:
            continue
        if w and w < 200:
            continue
        if any(d in url for d in _STOCK):
            continue
        if not _looks_ok(url):
            continue
        print(f"  ✓ SearchApi:  {w}×{h}  {url[:72]}...")
        return {
            "url":           url,
            "thumbnail_url": thumb or url,
            "source":        "searchapi",
            "width":         w or None,
            "height":        h or None,
            "notes":         "Wikipedia unavailable or no suitable image",
        }
    print(f"  ✗ SearchApi: no suitable image for '{name}'")
    return None
# ─── PER-CELEBRITY ────────────────────────────────────────────────────────────
def process(name: str, session: requests.Session) -> Dict[str, Any]:
    slug = slugify(name)
    print(f"\n{'─'*60}")
    print(f"  {name}  [{slug}]")
    img = fetch_wikipedia(name, session)
    _sleep("after Wikipedia call")
    if not img:
        img = fetch_searchapi(name)
        _sleep("after SearchApi call")
    if not img:
        img = {
            "url":           None,
            "thumbnail_url": None,
            "source":        "none",
            "width":         None,
            "height":        None,
            "notes":         "all sources exhausted — no image found",
        }
        print(f"  ✗ No image found for '{name}'")
    profile = {
        "name":          name,
        "slug":          slug,
        "last_updated":  TODAY,
        "profile_image": img,
    }
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    path = os.path.join(OUTPUT_DIR, f"{slug}.json")
    with open(path, "w", encoding="utf-8") as f:
        json.dump(profile, f, indent=2, ensure_ascii=False)
    print(f"  💾 Written → {path}")
    return profile
# ─── MAIN ─────────────────────────────────────────────────────────────────────
def main() -> None:
    session = _session()
    print("=" * 60)
    print("Probing Wikipedia...")
    _probe_wiki(session)
    print("=" * 60)
    results = []
    for name in CELEBRITIES:
        results.append(process(name, session))
    # ── Summary table ─────────────────────────────────────────────────────────
    print(f"\n{'='*60}")
    print(f"{'Name':<22} {'Source':<12} {'Size':<12} URL (first 50 chars)")
    print(f"{'─'*22} {'─'*12} {'─'*12} {'─'*50}")
    for p in results:
        img  = p["profile_image"]
        name = p["name"]
        src  = img["source"]
        w, h = img.get("width") or 0, img.get("height") or 0
        size = f"{w}×{h}" if w else "unknown"
        url  = (img.get("url") or "—")[:50]
        print(f"{name:<22} {src:<12} {size:<12} {url}")
    print(f"{'='*60}")
    found = sum(1 for r in results if r["profile_image"]["source"] != "none")
    print(f"Done: {found}/{len(results)} images found. Files in: {os.path.abspath(OUTPUT_DIR)}/")
if __name__ == "__main__":
    main()
