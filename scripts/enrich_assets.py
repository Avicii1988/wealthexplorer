#!/usr/bin/env python3
"""
enrich_assets.py
────────────────────────────────────────────────────────────────────────────────
Strict per-asset enrichment pipeline for public/data/celebs.json.

For every asset in every celebrity profile:
  1. Granular image search:  "<asset name> [year] <type-specific suffix>"
     + brand-identity validation (negative keyword filtering)
     → stores up to 3 unique, high-res URLs in  asset["images"]

  2. Valuation search:  "<asset name> <type-specific valuation suffix>"
     from Sotheby's / Christie's / DuPont / Hagerty / BaT / Phillips
     → stores  asset["valueFormatted"], asset["valuationSource"], asset["lastValuated"]

Usage examples:
  python enrich_assets.py
  python enrich_assets.py --force
  python enrich_assets.py --dry-run
  python enrich_assets.py --types car,watch,jet
  python enrich_assets.py --max-assets 50
  python enrich_assets.py --celeb "Elon Musk" --force
"""

from __future__ import annotations

import argparse
import json
import logging
import os
import re
import sys
import time
import random
from datetime import date
from pathlib import Path
from typing import Optional
from urllib.parse import urlparse

import requests

# ─────────────────────────────────────────────────────────────────────────────
# CONFIG
# ─────────────────────────────────────────────────────────────────────────────
SEARCHAPI_KEY: str  = os.getenv("SEARCHAPI_API_KEY") or os.getenv("SEARCHAPI_KEY") or "HfKbPSqtWRDFkc7ZbAYtdL5A"
SEARCHAPI_URL        = "https://www.searchapi.io/api/v1/search"
CELEBS_PATH          = Path("public/data/celebs.json")
LOG_FILE             = "enrich_assets.log"
TODAY                = date.today().isoformat()
REQUEST_TIMEOUT      = 15   # seconds
SLEEP_MIN            = 1.8
SLEEP_MAX            = 4.0
MAX_IMAGES_PER_ASSET = 3

# Type priority order (rarest / highest-value first → most impactful to enrich)
TYPE_PRIORITY = ["watch", "rocket", "jet", "helicopter", "yacht", "island",
                 "sports_team", "car", "art", "real_estate"]

# ─────────────────────────────────────────────────────────────────────────────
# PHOTO SEARCH SUFFIXES — appended to the asset name for image queries
# ─────────────────────────────────────────────────────────────────────────────
PHOTO_SUFFIX: dict[str, str] = {
    "jet":         "private jet livery exterior official photo",
    "yacht":       "superyacht exterior profile official photo",
    "real_estate": "architectural photography official exterior",
    "car":         "official press photo high resolution",
    "watch":       "official product photo high resolution",
    "art":         "artwork high resolution museum",
    "helicopter":  "helicopter exterior official photo",
    "island":      "aerial drone photography",
    "sports_team": "official team logo stadium photo",
    "rocket":      "rocket launch official photo SpaceX",
}

# ─────────────────────────────────────────────────────────────────────────────
# VALUATION SEARCH SUFFIXES
# ─────────────────────────────────────────────────────────────────────────────
VALUATION_SUFFIX: dict[str, str] = {
    "jet":         "price sale auction market value million",
    "yacht":       "sale listing market value superyacht million",
    "real_estate": "listing sale price market value million real estate",
    "car":         "auction sale price Hagerty BaT market value",
    "watch":       "auction Christie's Sotheby's Phillips sale price",
    "art":         "auction Christie's Sotheby's sale price million",
    "helicopter":  "sale price market value million",
    "island":      "private island sale listing price million",
    "sports_team": "valuation Forbes market value billion",
    "rocket":      "development cost valuation million billion",
}

# Trusted sources for valuations — extracted price is accepted only from these
VALUATION_DOMAINS = {
    "sothebys.com", "christies.com", "phillipsauction.com",
    "dupontregistry.com", "hagerty.com", "bringatrailer.com",
    "jameslist.com", "superyachttimes.com", "privatefly.com",
    "mansionglobal.com", "forbes.com", "bloomberg.com",
    "bonhams.com", "rmsothebys.com", "gooding.com",
}

# ─────────────────────────────────────────────────────────────────────────────
# BRAND KEYWORD SETS — used for negative filtering
# E.g. if we're looking for a Ferrari, reject results that contain Lamborghini
# ─────────────────────────────────────────────────────────────────────────────
_CAR_BRANDS = {
    "bugatti", "ferrari", "lamborghini", "rolls-royce", "rolls royce",
    "bentley", "mclaren", "porsche", "pagani", "koenigsegg", "aston martin",
    "maybach", "mercedes", "bmw", "audi", "maserati", "lotus",
}
_WATCH_BRANDS = {
    "patek philippe", "richard mille", "audemars piguet", "jacob & co",
    "rolex", "hublot", "ap", "vacheron", "breguet", "a. lange", "jaeger",
    "iwc", "omega", "tag heuer", "cartier", "chopard",
}
_JET_BRANDS = {
    "gulfstream", "bombardier", "dassault", "boeing", "embraer",
    "cessna", "beechcraft", "pilatus", "daher", "honda jet",
}
_YACHT_BRANDS: set[str] = set()   # yachts are named — no brand competition

_BRAND_SETS: dict[str, set[str]] = {
    "car":   _CAR_BRANDS,
    "watch": _WATCH_BRANDS,
    "jet":   _JET_BRANDS,
    "yacht": _YACHT_BRANDS,
}

# ─────────────────────────────────────────────────────────────────────────────
# REPUTABLE IMAGE DOMAINS
# ─────────────────────────────────────────────────────────────────────────────
_REPUTABLE_DOMAINS = frozenset([
    "autoevolution.com", "motortrend.com", "caranddriver.com", "topgear.com",
    "autocar.co.uk", "autoblog.com", "carbuzz.com", "carscoops.com",
    "superyachttimes.com", "yachtcharterfleet.com", "theyachtmarket.com",
    "architecturaldigest.com", "mansionglobal.com",
    "forbes.com", "bloomberg.com", "reuters.com",
    "people.com", "tmz.com", "dailymail.co.uk",
    "watchtime.com", "hodinkee.com", "fratellowatches.com", "ablogtowatch.com",
    "privatefly.com", "aviationweek.com", "flyingmag.com",
    "dupontregistry.com", "hagerty.com", "bringatrailer.com",
    "sothebys.com", "christies.com",
])

_UNRELIABLE_IMAGE_DOMAINS = [
    "lookaside.instagram.com", "lookaside.fbsbx.com", "scontent.",
    "googleusercontent.com",
    "shortpixel.ai", "imageio.", "fbsbx.com",
]

# ─────────────────────────────────────────────────────────────────────────────
# LOGGING
# ─────────────────────────────────────────────────────────────────────────────
def _setup_logging() -> logging.Logger:
    fmt = "%(asctime)s [%(levelname)-8s] %(message)s"
    datefmt = "%Y-%m-%d %H:%M:%S"
    logger = logging.getLogger("enrich_assets")
    logger.setLevel(logging.DEBUG)
    logger.propagate = False
    if not logger.handlers:
        ch = logging.StreamHandler(sys.stdout)
        ch.setLevel(logging.INFO)
        ch.setFormatter(logging.Formatter(fmt, datefmt))
        fh = logging.FileHandler(LOG_FILE, encoding="utf-8")
        fh.setLevel(logging.DEBUG)
        fh.setFormatter(logging.Formatter(fmt, datefmt))
        logger.addHandler(ch)
        logger.addHandler(fh)
    return logger

log = _setup_logging()

# ─────────────────────────────────────────────────────────────────────────────
# HELPERS
# ─────────────────────────────────────────────────────────────────────────────
def _sleep(label: str = "") -> None:
    secs = random.uniform(SLEEP_MIN, SLEEP_MAX)
    log.debug("Sleeping %.1fs %s", secs, f"[{label}]" if label else "")
    time.sleep(secs)


def _extract_brand(asset_name: str, asset_type: str) -> Optional[str]:
    """Return the first matching brand keyword found in the asset name, or None."""
    brands = _BRAND_SETS.get(asset_type, set())
    name_lower = asset_name.lower()
    for brand in sorted(brands, key=len, reverse=True):  # longest match first
        if brand in name_lower:
            return brand
    return None


def _negative_keywords(asset_name: str, asset_type: str) -> list[str]:
    """
    Return competitor brand names to exclude from image searches.
    E.g. for a Ferrari, return all other car brands.
    """
    brand = _extract_brand(asset_name, asset_type)
    if brand is None:
        return []
    competitors = [b for b in _BRAND_SETS.get(asset_type, set()) if b != brand]
    return competitors[:6]  # cap at 6 to keep query readable


def _is_reliable_url(url: str) -> bool:
    if not url or len(url) < 20:
        return False
    return not any(d in url for d in _UNRELIABLE_IMAGE_DOMAINS)


def _score_image(img: dict) -> int:
    """Assign quality score to a SearchAPI google_images result dict."""
    orig_obj = img.get("original") or {}
    url: str = orig_obj.get("link", "") if isinstance(orig_obj, dict) else str(orig_obj)

    if not url or not _is_reliable_url(url):
        return -9999
    if url.startswith("data:") or len(url) < 30:
        return -9999

    score = 10 if url.startswith("https://") else 2

    w: int = orig_obj.get("width", 0) if isinstance(orig_obj, dict) else 0
    h: int = orig_obj.get("height", 0) if isinstance(orig_obj, dict) else 0
    if w and h:
        mp = w * h
        if   mp >= 1920 * 1080: score += 20
        elif mp >= 1280 * 720:  score += 12
        elif mp >= 800 * 600:   score += 5
        elif mp < 300 * 200:    score -= 15
    else:
        url_l = url.lower()
        for kw in ("1920", "1600", "1200", "hd", "large", "full", "original"):
            if kw in url_l: score += 6; break
        for kw in ("thumb", "small", "icon", "50x", "100x", "150x", "200x"):
            if kw in url_l: score -= 8; break

    try:
        domain = urlparse(url).netloc.lower().lstrip("www.")
    except Exception:
        domain = ""
    if any(d in domain for d in _REPUTABLE_DOMAINS):
        score += 15

    title: str = img.get("title") or ""
    if len(title) > 15:
        score += 3

    return score


def _parse_price_millions(text: str) -> Optional[float]:
    """
    Extract the first price mention from text and return it in millions USD.
    Handles:  $4.2M  $4,200,000  4.2 million  $1.2 billion  €3.5M
    """
    patterns = [
        # $4.2B / $4.2 billion
        (re.compile(r"[\$€£]?\s*(\d[\d,\.]*)\s*(?:billion|B)\b", re.I), 1000.0),
        # $4.2M / $4.2 million
        (re.compile(r"[\$€£]?\s*(\d[\d,\.]*)\s*(?:million|M)\b", re.I), 1.0),
        # $4,200,000 — 7+ digits
        (re.compile(r"[\$€£]\s*(\d{1,3}(?:,\d{3}){2,})\b"), 1e-6),
    ]
    for pat, multiplier in patterns:
        m = pat.search(text)
        if m:
            try:
                raw = m.group(1).replace(",", "").replace(" ", "")
                return float(raw) * multiplier
            except ValueError:
                continue
    return None


def _format_price(millions: float) -> str:
    if millions >= 1000:
        return f"${millions / 1000:.1f}B"
    if millions >= 1:
        n = int(millions) if millions == int(millions) else round(millions, 1)
        return f"${n}M"
    return f"${int(millions * 1000)}K"


# ─────────────────────────────────────────────────────────────────────────────
# SEARCHAPI — image search
# ─────────────────────────────────────────────────────────────────────────────
def search_images(
    asset_name: str,
    asset_type: str,
    year: Optional[int] = None,
    max_results: int = MAX_IMAGES_PER_ASSET,
) -> list[str]:
    """
    Search google_images for the asset and return up to max_results validated URLs.
    Uses type-specific suffix + negative keywords for brand identity validation.
    """
    suffix = PHOTO_SUFFIX.get(asset_type, "official high-res photo")
    year_str = str(year) if year else ""
    query_parts = [asset_name, year_str, suffix]
    query = " ".join(p for p in query_parts if p)

    neg_kw = _negative_keywords(asset_name, asset_type)
    if neg_kw:
        exclusions = " ".join(f"-{kw.split()[0]}" for kw in neg_kw[:4])
        query = f"{query} {exclusions}"

    # Shared negative modifiers to avoid AI renders, stock, and placeholder art
    query += " -ai -render -stock -illustration -cartoon -drawing -clipart"

    params = {
        "engine":  "google_images",
        "q":       query,
        "num":     "10",
        "api_key": SEARCHAPI_KEY,
    }

    log.info("[img] %s  (%s)", asset_name, asset_type)
    log.debug("[img] query: %s", query)

    try:
        resp = requests.get(SEARCHAPI_URL, params=params, timeout=REQUEST_TIMEOUT)
    except requests.exceptions.RequestException as exc:
        log.error("[img] Network error for %r: %s", asset_name, exc)
        return []

    if resp.status_code == 429:
        log.warning("[img] 429 Rate limited — sleeping 60s")
        time.sleep(60)
        return []
    if resp.status_code == 401:
        log.error("[img] 401 Unauthorized — check SEARCHAPI_API_KEY")
        return []
    if not resp.ok:
        log.warning("[img] HTTP %d for %r", resp.status_code, asset_name)
        return []

    try:
        payload = resp.json()
    except ValueError:
        log.error("[img] JSON decode error for %r", asset_name)
        return []

    candidates: list[dict] = (
        payload.get("images")
        or payload.get("images_results")
        or payload.get("inline_images")
        or []
    )

    if not candidates:
        log.warning("[img] No candidates for %r", asset_name)
        return []

    # Score, sort, deduplicate
    scored = sorted(
        [(c, _score_image(c)) for c in candidates],
        key=lambda t: t[1],
        reverse=True,
    )

    urls: list[str] = []
    seen_domains: set[str] = set()
    brand = _extract_brand(asset_name, asset_type)

    for img, score in scored:
        if score < 0:
            continue

        orig_obj = img.get("original") or {}
        url: str = orig_obj.get("link", "") if isinstance(orig_obj, dict) else str(orig_obj)
        if not url or not _is_reliable_url(url):
            continue

        # Brand identity validation: reject if a competitor brand appears in
        # the image title or source URL (but only when we know the asset brand)
        if brand and asset_type in _BRAND_SETS:
            img_title = (img.get("title") or "").lower()
            source_url = (img.get("source") or {}).get("link", "").lower() \
                if isinstance(img.get("source"), dict) else ""
            combined = img_title + " " + source_url
            competitor_hit = False
            for competitor in _BRAND_SETS[asset_type]:
                if competitor != brand and competitor in combined:
                    log.debug("[img] Rejected (competitor %r): %s", competitor, url[:60])
                    competitor_hit = True
                    break
            if competitor_hit:
                continue

        # Domain diversity: prefer one URL per domain
        try:
            domain = urlparse(url).netloc.lower().lstrip("www.")
        except Exception:
            domain = ""
        if domain in seen_domains:
            continue
        seen_domains.add(domain)

        urls.append(url)
        if len(urls) >= max_results:
            break

    log.info("[img] %d URL(s) found for %r", len(urls), asset_name)
    return urls


# ─────────────────────────────────────────────────────────────────────────────
# SEARCHAPI — valuation search
# ─────────────────────────────────────────────────────────────────────────────
def search_valuation(asset_name: str, asset_type: str) -> tuple[Optional[float], Optional[str]]:
    """
    Search for current market valuation.
    Returns (price_millions, source_domain) or (None, None).
    """
    suffix = VALUATION_SUFFIX.get(asset_type, "price sale value million")
    query = f"{asset_name} {suffix}"

    params = {
        "engine":  "google",
        "q":       query,
        "num":     "5",
        "api_key": SEARCHAPI_KEY,
    }

    log.info("[val] %s", asset_name)
    log.debug("[val] query: %s", query)

    try:
        resp = requests.get(SEARCHAPI_URL, params=params, timeout=REQUEST_TIMEOUT)
    except requests.exceptions.RequestException as exc:
        log.error("[val] Network error for %r: %s", asset_name, exc)
        return None, None

    if resp.status_code == 429:
        log.warning("[val] 429 Rate limited — sleeping 60s")
        time.sleep(60)
        return None, None
    if not resp.ok:
        log.warning("[val] HTTP %d for %r", resp.status_code, asset_name)
        return None, None

    try:
        payload = resp.json()
    except ValueError:
        return None, None

    results: list[dict] = payload.get("organic_results") or []
    if not results:
        log.debug("[val] No organic results for %r", asset_name)
        return None, None

    for r in results:
        link: str  = r.get("link") or ""
        snippet: str = r.get("snippet") or ""
        title: str = r.get("title") or ""
        text = f"{title} {snippet}"

        try:
            domain = urlparse(link).netloc.lower().lstrip("www.")
        except Exception:
            domain = ""

        price = _parse_price_millions(text)
        if price and price > 0.01:
            is_trusted = any(d in domain for d in VALUATION_DOMAINS)
            # Accept price from any site; mark trusted sources
            source = domain if domain else "web"
            log.info("[val] $%s from %s for %r", _format_price(price), source, asset_name)
            return price, (domain if is_trusted else source)

    log.debug("[val] No price found for %r", asset_name)
    return None, None


# ─────────────────────────────────────────────────────────────────────────────
# ASSET ENRICHMENT
# ─────────────────────────────────────────────────────────────────────────────
def _needs_enrichment(asset: dict, force: bool) -> bool:
    """Return True if this asset should be processed."""
    if force:
        return True
    # Already has images array with at least one URL → skip
    images = asset.get("images") or []
    if images:
        return False
    return True


def enrich_asset(asset: dict, force: bool = False, dry_run: bool = False) -> bool:
    """
    Enrich a single asset dict in-place.
    Returns True if any data was updated.
    """
    if not _needs_enrichment(asset, force):
        log.debug("[skip] %s (already enriched)", asset.get("name", "?"))
        return False

    name: str       = asset.get("name", "")
    asset_type: str = asset.get("type", "real_estate")
    year: Optional[int] = asset.get("year")

    if not name:
        log.warning("[skip] Asset has no name: %s", json.dumps(asset)[:80])
        return False

    changed = False

    # ── 1. Images ────────────────────────────────────────────────────────────
    urls = search_images(name, asset_type, year=year)
    _sleep("after-img")

    if urls:
        if not dry_run:
            asset["images"] = urls
        changed = True
        log.info("[✓ img] %s → %d URL(s)", name, len(urls))
    else:
        log.warning("[✗ img] No images found for %r", name)

    # ── 2. Valuation ─────────────────────────────────────────────────────────
    price_millions, source = search_valuation(name, asset_type)
    _sleep("after-val")

    if price_millions is not None:
        formatted = _format_price(price_millions)
        if not dry_run:
            asset["valueFormatted"]  = formatted
            asset["valuationSource"] = source or "web"
            asset["lastValuated"]    = TODAY
        changed = True
        log.info("[✓ val] %s → %s (via %s)", name, formatted, source)
    else:
        log.debug("[✗ val] No valuation found for %r", name)

    return changed


# ─────────────────────────────────────────────────────────────────────────────
# MAIN
# ─────────────────────────────────────────────────────────────────────────────
def main() -> None:
    parser = argparse.ArgumentParser(description="Enrich celebs.json with per-asset images + valuations")
    parser.add_argument("--force",       action="store_true", help="Re-enrich even if already done")
    parser.add_argument("--dry-run",     action="store_true", help="Search but do not write changes")
    parser.add_argument("--max-assets",  type=int,  default=0,    metavar="N",
                        help="Stop after N assets total (0 = unlimited)")
    parser.add_argument("--types",       type=str,  default="",
                        help="Comma-separated asset types to process, e.g. car,watch,jet")
    parser.add_argument("--celeb",       type=str,  default="",
                        help="Process only this celebrity (name substring match)")
    args = parser.parse_args()

    if not SEARCHAPI_KEY:
        sys.exit("ERROR: SEARCHAPI_API_KEY env var is required.")

    # ── Load data ─────────────────────────────────────────────────────────────
    if not CELEBS_PATH.exists():
        sys.exit(f"ERROR: {CELEBS_PATH} not found. Run create_master_file.py first.")

    with CELEBS_PATH.open(encoding="utf-8") as fh:
        data: list[dict] = json.load(fh)

    log.info("Loaded %d celebrities from %s", len(data), CELEBS_PATH)

    allowed_types: set[str] = set()
    if args.types:
        allowed_types = {t.strip().lower() for t in args.types.split(",") if t.strip()}
        log.info("Filtering to types: %s", allowed_types)

    celeb_filter = args.celeb.lower().strip()

    # ── Build work queue (sorted by type priority) ────────────────────────────
    # Each item: (celeb_index, asset_index, asset_type_priority)
    queue: list[tuple[int, int, int]] = []
    for ci, celeb in enumerate(data):
        if celeb_filter and celeb_filter not in celeb.get("name", "").lower():
            continue
        for ai, asset in enumerate(celeb.get("assets", [])):
            atype = asset.get("type", "real_estate")
            if allowed_types and atype not in allowed_types:
                continue
            if not _needs_enrichment(asset, args.force):
                continue
            priority = TYPE_PRIORITY.index(atype) if atype in TYPE_PRIORITY else 99
            queue.append((ci, ai, priority))

    queue.sort(key=lambda t: t[2])  # lower priority index = processed first

    total = len(queue)
    if args.max_assets > 0:
        queue = queue[:args.max_assets]

    log.info("Work queue: %d asset(s) to enrich%s",
             len(queue),
             f" (capped from {total})" if args.max_assets > 0 and total > len(queue) else "")

    if not queue:
        log.info("Nothing to do — all assets already enriched (use --force to re-run)")
        return

    if args.dry_run:
        log.info("DRY RUN — no changes will be saved")

    # ── Process ───────────────────────────────────────────────────────────────
    enriched = 0
    errors   = 0

    for idx, (ci, ai, _) in enumerate(queue, start=1):
        celeb = data[ci]
        asset = celeb["assets"][ai]
        celeb_name = celeb.get("name", "?")
        asset_name = asset.get("name", "?")

        log.info("─── [%d/%d] %s / %s", idx, len(queue), celeb_name, asset_name)

        try:
            updated = enrich_asset(asset, force=args.force, dry_run=args.dry_run)
            if updated:
                enriched += 1
        except Exception as exc:
            log.error("UNHANDLED ERROR for %r / %r: %s", celeb_name, asset_name, exc, exc_info=True)
            errors += 1

    log.info("Done — %d enriched, %d skipped, %d errors", enriched, total - len(queue) - errors + enriched, errors)

    # ── Save ──────────────────────────────────────────────────────────────────
    if args.dry_run:
        log.info("DRY RUN complete — no file written")
        return

    if enriched == 0:
        log.info("No changes to save")
        return

    # Atomic write: write to temp file then rename
    tmp_path = CELEBS_PATH.with_suffix(".json.tmp")
    try:
        with tmp_path.open("w", encoding="utf-8") as fh:
            json.dump(data, fh, ensure_ascii=False, indent=2)
        tmp_path.replace(CELEBS_PATH)
        log.info("Saved updated celebs.json (%d assets enriched)", enriched)
    except Exception as exc:
        log.error("Failed to save %s: %s", CELEBS_PATH, exc)
        tmp_path.unlink(missing_ok=True)
        sys.exit(1)


if __name__ == "__main__":
    main()
