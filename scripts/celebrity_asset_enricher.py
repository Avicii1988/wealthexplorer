#!/usr/bin/env python3
"""
celebrity_asset_enricher.py
───────────────────────────────────────────────────────────────────────────────
Production-grade pipeline:
  1. Exa AI  → discover luxury assets owned by a celebrity in 2025/2026
  2. SearchApi.io (google_images) → find one real photograph per asset
  3. Saves structured JSON to  data/celebrities/<slug>.json

Usage:
  python celebrity_asset_enricher.py --celebs "Cristiano Ronaldo,Elon Musk"
  python celebrity_asset_enricher.py --input-file celebrities.txt
  python celebrity_asset_enricher.py --celebs "Ronaldo" --dry-run
  python celebrity_asset_enricher.py --celebs "Ronaldo,Messi" --force
  python celebrity_asset_enricher.py --input-file big_list.txt --max-assets 4
"""

from __future__ import annotations

import argparse
import json
import logging
import os
import random
import re
import sys
import time
from datetime import date
from pathlib import Path
from typing import Optional
from urllib.parse import urlparse

import requests

try:
    from exa_py import Exa
except ImportError:
    sys.exit(
        "ERROR: exa_py not installed.\n"
        "  pip install exa-py requests"
    )

# ─────────────────────────────────────────────────────────────────────────────
# API KEYS — never printed or logged
# ─────────────────────────────────────────────────────────────────────────────
_EXA_KEY: str = os.getenv("EXA_API_KEY") or "2c8693db-f1eb-4dcb-a001-920e192bd76d"
_SEARCHAPI_KEY: str = os.getenv("SEARCHAPI_API_KEY") or "HfKbPSqtWRDFkc7ZbAYtdL5A"

if not _EXA_KEY:
    sys.exit("ERROR: EXA_API_KEY is required.")
if not _SEARCHAPI_KEY:
    sys.exit("ERROR: SEARCHAPI_API_KEY is required.")

# ─────────────────────────────────────────────────────────────────────────────
# CONSTANTS
# ─────────────────────────────────────────────────────────────────────────────
SEARCHAPI_ENDPOINT = "https://www.searchapi.io/api/v1/search"
DEFAULT_OUTPUT_DIR = Path("data/celebrities")
TODAY = date.today().isoformat()

SLEEP_MIN: float = 2.0
SLEEP_MAX: float = 5.0
REQUEST_TIMEOUT: int = 15        # seconds per HTTP call

DEFAULT_MAX_ASSETS: int = 8      # max assets to extract per celebrity
DEFAULT_MAX_IMG_CALLS: int = 3   # max SearchApi calls per celebrity

# ─────────────────────────────────────────────────────────────────────────────
# ASSET EXTRACTION PATTERNS
# Each tuple: (compiled_regex, asset_type_string)
# ─────────────────────────────────────────────────────────────────────────────
_ASSET_PATTERNS: list[tuple[re.Pattern, str]] = [
    # ── Cars ──────────────────────────────────────────────────────────────────
    (re.compile(r"Bugatti\s+\w+(?:\s+\w+)?", re.I), "car"),
    (re.compile(r"Ferrari\s+\w+(?:\s+\w+)?", re.I), "car"),
    (re.compile(r"Rolls[- ]Royce\s+\w+(?:\s+\w+)?", re.I), "car"),
    (re.compile(r"Lamborghini\s+\w+(?:\s+\w+)?", re.I), "car"),
    (re.compile(r"Bentley\s+\w+(?:\s+\w+)?", re.I), "car"),
    (re.compile(r"McLaren\s+\w+(?:\s+\w+)?", re.I), "car"),
    (re.compile(r"Porsche\s+\w+(?:\s+\w+)?", re.I), "car"),
    (re.compile(r"Pagani\s+\w+(?:\s+\w+)?", re.I), "car"),
    (re.compile(r"Koenigsegg\s+\w+(?:\s+\w+)?", re.I), "car"),
    (re.compile(r"Aston\s+Martin\s+\w+(?:\s+\w+)?", re.I), "car"),
    (re.compile(r"Maybach\s+\w+(?:\s+\w+)?", re.I), "car"),
    (re.compile(r"Mercedes(?:[- ]Benz)?\s+(?:AMG\s+)?\w+", re.I), "car"),
    (re.compile(r"BMW\s+(?:M\d|i\d|X\d)\w*", re.I), "car"),
    # ── Private jets ──────────────────────────────────────────────────────────
    (re.compile(r"Gulfstream\s+G\d+\w*", re.I), "jet"),
    (re.compile(r"Dassault\s+Falcon\s+\d+\w*", re.I), "jet"),
    (re.compile(r"Bombardier\s+(?:Global|Challenger)\s*\d+\w*", re.I), "jet"),
    (re.compile(r"Boeing\s+7\d\d(?:[- ]\w+)?", re.I), "jet"),
    (re.compile(r"Cessna\s+Citation\s+\w+", re.I), "jet"),
    (re.compile(r"Embraer\s+(?:Legacy|Lineage|Phenom)\s*\d+\w*", re.I), "jet"),
    # ── Yachts ────────────────────────────────────────────────────────────────
    (re.compile(r"(?:super|mega)[- ]?yacht\s+[\"']?([A-Z]\w[\w\s]{2,30})[\"']?", re.I), "yacht"),
    (re.compile(r"yacht\s+(?:named?|called)?\s*[\"']([A-Z][\w\s]{2,25})[\"']", re.I), "yacht"),
    (re.compile(r"M\.?Y\.?\s+([A-Z][\w\s]{2,25})", re.I), "yacht"),
    # ── Real estate — title-case only (NO re.I) to avoid matching nav/category text ──
    (re.compile(r"\b(?:[A-Z][a-z]{2,}(?:\s+[A-Z][a-z]{2,}){1,2})\s+(?:Mansion|Villa|Estate|Penthouse|Compound)\b"), "real_estate"),
    (re.compile(r"\b(?:Mansion|Villa|Estate|Penthouse|Compound)\s+in\s+[A-Z][a-z]{2,}(?:\s+[A-Z][a-z]{2,})?\b"), "real_estate"),
    # ── Watches ───────────────────────────────────────────────────────────────
    (re.compile(r"Patek\s+Philippe\s+\w+(?:\s+\w+)?", re.I), "watch"),
    (re.compile(r"Richard\s+Mille\s+RM\s*[\d\-]+\w*", re.I), "watch"),
    (re.compile(r"Audemars\s+Piguet\s+\w+(?:\s+\w+)?", re.I), "watch"),
    (re.compile(r"Jacob\s+&\s+Co\.?\s+\w+(?:\s+\w+)?", re.I), "watch"),
    (re.compile(r"Rolex\s+\w+(?:\s+\w+)?", re.I), "watch"),
    (re.compile(r"Hublot\s+\w+(?:\s+\w+)?", re.I), "watch"),
]

# Domains considered reputable for celebrity asset photography
_REPUTABLE_DOMAINS: frozenset[str] = frozenset([
    "autoevolution.com", "motortrend.com", "caranddriver.com", "topgear.com",
    "autocar.co.uk", "autoblog.com", "carbuzz.com", "carscoops.com",
    "superyachttimes.com", "yachtcharterfleet.com", "theyachtmarket.com",
    "bbc.com", "bbc.co.uk", "reuters.com", "apnews.com",
    "dailymail.co.uk", "people.com", "tmz.com", "usmagazine.com",
    "forbes.com", "bloomberg.com", "businessinsider.com",
    "architecturaldigest.com", "mansionglobal.com", "housebeautiful.com",
    "instagram.com", "essentially-sports.com", "sportscasting.com",
    "celebrity.net", "wealthygorilla.com",
])

# ─────────────────────────────────────────────────────────────────────────────
# LOGGING — dual handler (INFO → console, DEBUG → file)
# ─────────────────────────────────────────────────────────────────────────────
def _setup_logging(log_file: str = "enricher.log") -> logging.Logger:
    _fmt = "%(asctime)s [%(levelname)-8s] %(message)s"
    _datefmt = "%Y-%m-%d %H:%M:%S"

    logger = logging.getLogger("enricher")
    logger.setLevel(logging.DEBUG)
    logger.propagate = False

    if not logger.handlers:
        ch = logging.StreamHandler(sys.stdout)
        ch.setLevel(logging.INFO)
        ch.setFormatter(logging.Formatter(_fmt, _datefmt))

        fh = logging.FileHandler(log_file, encoding="utf-8")
        fh.setLevel(logging.DEBUG)
        fh.setFormatter(logging.Formatter(_fmt, _datefmt))

        logger.addHandler(ch)
        logger.addHandler(fh)

    return logger

log = _setup_logging()

# ─────────────────────────────────────────────────────────────────────────────
# EXA CLIENT (initialised once)
# ─────────────────────────────────────────────────────────────────────────────
try:
    _exa: Optional[Exa] = Exa(api_key=_EXA_KEY)
    log.debug("Exa client ready")
except Exception as _exc:
    log.error("Failed to initialise Exa client: %s", _exc)
    _exa = None

# ─────────────────────────────────────────────────────────────────────────────
# HELPERS
# ─────────────────────────────────────────────────────────────────────────────
def slugify(name: str) -> str:
    """'Cristiano Ronaldo Jr.' → 'cristiano-ronaldo-jr'"""
    s = name.lower().strip()
    s = re.sub(r"[^\w\s-]", "", s)
    s = re.sub(r"[\s_]+", "-", s)
    s = re.sub(r"-{2,}", "-", s).strip("-")
    return s


def polite_sleep(label: str = "") -> None:
    """Random sleep between API calls — required by both APIs' ToS."""
    secs = random.uniform(SLEEP_MIN, SLEEP_MAX)
    log.debug("Sleeping %.1fs %s", secs, f"[{label}]" if label else "")
    time.sleep(secs)


def _extract_sentence(text: str, match: re.Match) -> str:
    """Return the sentence surrounding a regex match, cleaned up."""
    ctx_start = max(0, match.start() - 200)
    ctx_end = min(len(text), match.end() + 200)
    snippet = text[ctx_start:ctx_end]
    snippet = re.sub(r"\s+", " ", snippet).strip()
    for sent in re.split(r"(?<=[.!?])\s+", snippet):
        if match.group(0).lower() in sent.lower():
            return sent[:300].strip()
    return snippet[:300].strip()


# ─────────────────────────────────────────────────────────────────────────────
# ASSET EXTRACTION
# ─────────────────────────────────────────────────────────────────────────────
def _extract_assets_from_text(
    text: str,
    celebrity: str,
    max_assets: int,
) -> list[dict]:
    """
    Scan concatenated Exa text for specific luxury asset mentions.
    Returns a deduplicated list of {title, type, description} dicts.
    """
    seen_exact: set[str] = set()   # full title dedup
    seen_brand: set[str] = set()   # brand dedup (e.g. "gulfstream") — keeps only first per brand
    results: list[dict] = []
    celeb_lower = celebrity.lower()

    for pattern, asset_type in _ASSET_PATTERNS:
        for match in pattern.finditer(text):
            raw = match.group(0)
            title = re.sub(r"\s+", " ", raw).strip().title()
            key = title.lower()

            # Skip: too short, exact duplicate, or contains celebrity name
            if len(title) < 6 or key in seen_exact or celeb_lower in key:
                continue

            # Skip generic/navigation strings that leak through
            stopwords = {"my ", "the ", "his ", "her ", "their ", "an ", "a "}
            if any(key.startswith(sw) for sw in stopwords):
                continue

            # Block known non-asset titles from financial/nav contexts
            _BLOCKLIST_FRAGMENTS = {
                "real estate", "investing real", "mining real", "categories real",
                "end real", "edge be", "benzinga", "mansion global", "james edition",
                "million real", "account benzinga", "futures mining", "institutional real",
                "startup investing",
            }
            if any(frag in key for frag in _BLOCKLIST_FRAGMENTS):
                continue

            # One asset per brand to avoid "Gulfstream G650 / G6 / G550" spam
            brand = key.split()[0]
            if brand in seen_brand:
                continue

            seen_exact.add(key)
            seen_brand.add(brand)

            results.append({
                "title": title,
                "type": asset_type,
                "description": _extract_sentence(text, match),
            })

            if len(results) >= max_assets:
                return results

    return results


# ─────────────────────────────────────────────────────────────────────────────
# EXA — asset research
# ─────────────────────────────────────────────────────────────────────────────
def get_exa_assets(celebrity: str, max_assets: int = DEFAULT_MAX_ASSETS) -> list[dict]:
    """
    Call Exa AI to research luxury assets owned by *celebrity*.
    Returns list of {title, type, description, source_url, found_via}.
    """
    if _exa is None:
        log.error("[Exa] Client unavailable — skipping %r", celebrity)
        return []

    queries = [
        f'"{celebrity}" owns luxury cars jets yachts mansion real estate assets 2025 2026',
        f'"{celebrity}" net worth expensive collection assets cars houses 2025',
    ]

    corpus: list[str] = []
    first_source_url = ""

    for attempt, query in enumerate(queries, start=1):
        try:
            log.info("[Exa] Query %d/2 for %r", attempt, celebrity)
            resp = _exa.search_and_contents(
                query,
                num_results=5,
                text={"max_characters": 4000},
                highlights={"num_sentences": 5, "highlights_per_url": 3},
            )
            for r in resp.results or []:
                if not first_source_url and r.url:
                    first_source_url = r.url
                if r.text:
                    corpus.append(r.text)
                if r.highlights:
                    for h in r.highlights:
                        corpus.append(h if isinstance(h, str) else getattr(h, "text", ""))

            if corpus:
                log.debug("[Exa] Got %d text blocks for %r", len(corpus), celebrity)
                break

        except Exception as exc:
            log.warning("[Exa] Attempt %d failed for %r: %s", attempt, celebrity, exc)
            if attempt < len(queries):
                polite_sleep("exa-retry")

    if not corpus:
        log.warning("[Exa] No content retrieved for %r", celebrity)
        return [{
            "title": f"{celebrity} luxury car",
            "type": "car",
            "description": "",
            "source_url": "",
            "found_via": "exa",
        }]

    combined = "\n\n".join(filter(None, corpus))
    assets = _extract_assets_from_text(combined, celebrity, max_assets)

    if not assets:
        log.warning("[Exa] Text parsed but no specific assets identified for %r (%d chars)",
                    celebrity, len(combined))
        assets = [{
            "title": f"{celebrity} private jet",
            "type": "jet",
            "description": "",
        }]

    for asset in assets:
        asset.setdefault("source_url", first_source_url)
        asset["found_via"] = "exa"

    log.info("[Exa] Extracted %d asset(s) for %r", len(assets), celebrity)
    return assets


# ─────────────────────────────────────────────────────────────────────────────
# IMAGE SCORING
# ─────────────────────────────────────────────────────────────────────────────
def _score_image(img: dict) -> int:
    """
    Assign a quality score to a SearchApi image candidate.
    Returns a large negative value for disqualified images.
    SearchApi google_images schema:
      img["original"] = {"link": str, "width": int, "height": int}
      img["thumbnail"] = str
      img["source"]    = {"name": str, "link": str}
    """
    orig_obj = img.get("original") or {}
    original: str = orig_obj.get("link", "") if isinstance(orig_obj, dict) else str(orig_obj)

    if not original:
        return -9999
    if len(original) < 50:
        return -9999
    if "googleusercontent.com" in original:
        return -500
    if original.startswith("data:"):
        return -500

    score = 0

    score += 10 if original.startswith("https://") else 2

    # Resolution from structured fields (reliable)
    w: int = orig_obj.get("width", 0) if isinstance(orig_obj, dict) else 0
    h: int = orig_obj.get("height", 0) if isinstance(orig_obj, dict) else 0
    if w and h:
        mp = w * h
        if mp >= 1_920 * 1_080:
            score += 20
        elif mp >= 1_280 * 720:
            score += 12
        elif mp >= 800 * 600:
            score += 5
        elif mp < 300 * 200:
            score -= 15
    else:
        url_l = original.lower()
        if any(k in url_l for k in ("1920", "1600", "1200", "hd", "large", "full", "original")):
            score += 6
        if any(k in url_l for k in ("thumb", "small", "icon", "50x", "100x", "150x", "200x")):
            score -= 8

    # Reputable domain bonus
    try:
        domain = urlparse(original).netloc.lower().lstrip("www.")
    except Exception:
        domain = ""
    if any(d in domain for d in _REPUTABLE_DOMAINS):
        score += 15

    if "2025" in original or "2026" in original:
        score += 5

    title: str = img.get("title") or ""
    if len(title) > 15:
        score += 3

    log.debug("[Score] %+4d  %s", score, original[:80])
    return score


# ─────────────────────────────────────────────────────────────────────────────
# SEARCHAPI — image fetch
# ─────────────────────────────────────────────────────────────────────────────
def _empty_image() -> dict:
    return {"image_url": None, "thumbnail_url": None, "source_url": None}


def get_best_image(celebrity: str, asset_title: str) -> dict:
    """
    Query SearchApi.io (google_images) for up to 3 candidate photos,
    score them, and return the best one.
    Returns {image_url, thumbnail_url, source_url} (None values if nothing found).
    """
    query = (
        f"{celebrity} {asset_title} real photo 2025 OR 2026 "
        "-ai -render -stock -illustration -art -cartoon -drawing"
    )

    params = {
        "engine": "google_images",
        "q": query,
        "num": "3",
        "api_key": _SEARCHAPI_KEY,
    }

    try:
        log.info("[SearchApi] Image: %r — %r", celebrity, asset_title)
        resp = requests.get(
            SEARCHAPI_ENDPOINT,
            params=params,
            timeout=REQUEST_TIMEOUT,
        )

        if resp.status_code == 401:
            log.error("[SearchApi] 401 Unauthorized — SEARCHAPI_API_KEY is invalid or expired")
            return _empty_image()
        if resp.status_code == 429:
            log.warning("[SearchApi] 429 Rate Limited — pausing 45s")
            time.sleep(45)
            return _empty_image()
        if not resp.ok:
            log.warning("[SearchApi] HTTP %d for %r / %r", resp.status_code, celebrity, asset_title)
            return _empty_image()

        payload = resp.json()

    except requests.exceptions.Timeout:
        log.error("[SearchApi] Timeout for %r / %r", celebrity, asset_title)
        return _empty_image()
    except requests.exceptions.RequestException as exc:
        log.error("[SearchApi] Network error for %r / %r: %s", celebrity, asset_title, exc)
        return _empty_image()
    except ValueError as exc:
        log.error("[SearchApi] JSON decode error for %r / %r: %s", celebrity, asset_title, exc)
        return _empty_image()

    # SearchApi google_images returns results under "images" key
    candidates: list[dict] = (
        payload.get("images")
        or payload.get("images_results")
        or payload.get("inline_images")
        or []
    )

    if not candidates:
        log.warning("[SearchApi] No candidates for %r / %r", celebrity, asset_title)
        return _empty_image()

    best: Optional[dict] = None
    best_score = -9999

    for img in candidates:
        s = _score_image(img)
        if s > best_score:
            best_score = s
            best = img

    if best is None or best_score < 0:
        log.warning(
            "[SearchApi] All %d candidate(s) disqualified for %r / %r",
            len(candidates), celebrity, asset_title,
        )
        return _empty_image()

    # Extract fields from SearchApi's nested structure
    orig_obj = best.get("original") or {}
    original: str = orig_obj.get("link", "") if isinstance(orig_obj, dict) else str(orig_obj)
    thumbnail: str = best.get("thumbnail") or original

    source_obj = best.get("source") or {}
    source_url: str = (
        source_obj.get("link", "") if isinstance(source_obj, dict) else str(source_obj)
    )

    log.debug("[SearchApi] Best score=%+d  url=%s", best_score, original[:80])
    return {
        "image_url": original or None,
        "thumbnail_url": thumbnail or None,
        "source_url": source_url or None,
    }


# ─────────────────────────────────────────────────────────────────────────────
# FILE PERSISTENCE
# ─────────────────────────────────────────────────────────────────────────────
def save_profile(data: dict, output_dir: Path, dry_run: bool = False) -> None:
    """Persist *data* as <output_dir>/<slug>.json."""
    slug = data["slug"]
    pretty = json.dumps(data, indent=2, ensure_ascii=False)

    if dry_run:
        print(f"\n{'─'*60}\n[DRY-RUN] {slug}.json\n{'─'*60}")
        print(pretty)
        return

    output_dir.mkdir(parents=True, exist_ok=True)
    dest = output_dir / f"{slug}.json"
    with open(dest, "w", encoding="utf-8") as fh:
        fh.write(pretty)
    log.info("[Save] %s  (%d assets)", dest, len(data.get("assets", [])))


# ─────────────────────────────────────────────────────────────────────────────
# CELEBRITIES INPUT
# ─────────────────────────────────────────────────────────────────────────────
def load_celebrities(args: argparse.Namespace) -> list[str]:
    """Collect celebrity names from --celebs and/or --input-file."""
    raw: list[str] = []

    if args.celebs:
        raw.extend(n.strip() for n in args.celebs.split(",") if n.strip())

    if args.input_file:
        path = Path(args.input_file)
        if not path.exists():
            log.error("Input file not found: %s", path)
            sys.exit(1)
        with open(path, encoding="utf-8") as fh:
            for line in fh:
                name = line.strip()
                if name and not name.startswith("#"):
                    raw.append(name)

    if not raw:
        log.error("No celebrities specified.  Use --celebs or --input-file.")
        sys.exit(1)

    seen: set[str] = set()
    unique: list[str] = []
    for name in raw:
        key = name.lower()
        if key not in seen:
            seen.add(key)
            unique.append(name)

    return unique


# ─────────────────────────────────────────────────────────────────────────────
# ORCHESTRATION — single celebrity
# ─────────────────────────────────────────────────────────────────────────────
def process_celebrity(
    celebrity: str,
    output_dir: Path,
    dry_run: bool,
    force: bool,
    max_assets: int,
    max_img_calls: int,
) -> dict:
    """Full enrichment pipeline for one celebrity. Returns the final data dict."""
    slug = slugify(celebrity)
    dest = output_dir / f"{slug}.json"

    if not force and not dry_run and dest.exists():
        log.info("[Skip] %r already processed → %s", celebrity, dest)
        with open(dest, encoding="utf-8") as fh:
            return json.load(fh)

    log.info("═══ Processing: %r ═══", celebrity)

    raw_assets = get_exa_assets(celebrity, max_assets=max_assets)
    polite_sleep("post-exa")

    enriched: list[dict] = []
    img_calls_used = 0

    for asset in raw_assets[:max_assets]:
        img: dict = {}

        if img_calls_used < max_img_calls:
            img = get_best_image(celebrity, asset["title"])
            img_calls_used += 1
            polite_sleep("post-searchapi")

        enriched.append({
            "title":         asset.get("title", ""),
            "type":          asset.get("type", ""),
            "description":   asset.get("description", ""),
            "image_url":     img.get("image_url"),
            "thumbnail_url": img.get("thumbnail_url"),
            "source_url":    asset.get("source_url") or img.get("source_url"),
            "found_via":     asset.get("found_via", "exa"),
        })

    data: dict = {
        "name":         celebrity,
        "slug":         slug,
        "last_updated": TODAY,
        "assets":       enriched,
    }

    save_profile(data, output_dir, dry_run=dry_run)
    return data


# ─────────────────────────────────────────────────────────────────────────────
# CLI
# ─────────────────────────────────────────────────────────────────────────────
def _build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="celebrity_asset_enricher",
        description="Discover celebrity luxury assets via Exa AI + photograph them via SearchApi.io",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
examples:
  python celebrity_asset_enricher.py --celebs "Cristiano Ronaldo,Elon Musk"
  python celebrity_asset_enricher.py --input-file celebrities.txt
  python celebrity_asset_enricher.py --celebs "Ronaldo" --dry-run
  python celebrity_asset_enricher.py --celebs "Ronaldo,Messi" --force
  python celebrity_asset_enricher.py --input-file big_list.txt \\
      --output-dir custom/out --max-assets 4 --max-image-calls 2
        """,
    )
    parser.add_argument("--celebs", "-c", default="", metavar="NAMES",
        help='Comma-separated names, e.g. "Ronaldo,Messi,Bezos"')
    parser.add_argument("--input-file", "-i", default="", metavar="FILE",
        help="Text file with one celebrity name per line (# = comment)")
    parser.add_argument("--dry-run", action="store_true",
        help="Print results to stdout; do not write any files")
    parser.add_argument("--force", action="store_true",
        help="Re-process even if the output JSON already exists")
    parser.add_argument("--output-dir", default=str(DEFAULT_OUTPUT_DIR), metavar="DIR",
        help=f"Destination folder for JSON files (default: {DEFAULT_OUTPUT_DIR})")
    parser.add_argument("--max-assets", type=int, default=DEFAULT_MAX_ASSETS, metavar="N",
        help=f"Max assets to extract per celebrity (default: {DEFAULT_MAX_ASSETS})")
    parser.add_argument("--max-image-calls", type=int, default=DEFAULT_MAX_IMG_CALLS, metavar="N",
        help=f"Max SearchApi calls per celebrity (default: {DEFAULT_MAX_IMG_CALLS})")
    parser.add_argument("--log-file", default="enricher.log", metavar="PATH",
        help="Path for the full debug log file (default: enricher.log)")
    return parser


# ─────────────────────────────────────────────────────────────────────────────
# ENTRY POINT
# ─────────────────────────────────────────────────────────────────────────────
def main() -> None:
    parser = _build_parser()
    args = parser.parse_args()

    output_dir = Path(args.output_dir)
    celebrities = load_celebrities(args)

    log.info(
        "Celebrity Asset Enricher  |  %d celebrity(-ies)  |  dry-run=%s  |  force=%s",
        len(celebrities), args.dry_run, args.force,
    )
    log.info("Output dir: %s  |  max-assets=%d  |  max-image-calls=%d",
             output_dir, args.max_assets, args.max_image_calls)

    processed = skipped = errors = 0

    for celeb in celebrities:
        try:
            process_celebrity(
                celebrity=celeb,
                output_dir=output_dir,
                dry_run=args.dry_run,
                force=args.force,
                max_assets=args.max_assets,
                max_img_calls=args.max_image_calls,
            )
            processed += 1

        except KeyboardInterrupt:
            log.warning("Interrupted by user — stopping early")
            break
        except Exception as exc:
            log.error("Unexpected error processing %r: %s", celeb, exc, exc_info=True)
            errors += 1

    log.info(
        "═══ Done ═══  processed=%d  skipped=%d  errors=%d",
        processed, skipped, errors,
    )


if __name__ == "__main__":
    main()
