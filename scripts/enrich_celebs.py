#!/usr/bin/env python3
"""
enrich_celebs.py — "Zuck-Standard" profile enrichment for all celebrities.
===========================================================================
Reads public/data/celebs.json and fills in missing fields:
  • Assigns Unsplash pool images to every asset (no network needed)
  • Fetches bio snippets via SearchAPI Google when keys are available
  • Protects "baseline" celebrities (those with bio + named assets + images)
    unless --force is passed

Run locally:
  python scripts/enrich_celebs.py --limit 50 --dry-run
  python scripts/enrich_celebs.py --limit 50

GitHub Actions (with SEARCH_API_KEY secret):
  python scripts/enrich_celebs.py --limit 100
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import sys
import time
from datetime import date
from pathlib import Path
from typing import Optional

try:
    import requests
    _REQUESTS = True
except ImportError:
    _REQUESTS = False

# ─────────────────────────────────────────────────────────────────────────────
# CONFIG
# ─────────────────────────────────────────────────────────────────────────────
CELEBS_PATH   = Path("public/data/celebs.json")
TODAY         = date.today().isoformat()
SLEEP_BETWEEN = 1.2   # seconds between SearchAPI calls
SEARCHAPI_KEY = (
    os.getenv("SEARCHAPI_API_KEY")
    or os.getenv("SEARCHAPI_KEY")
    or os.getenv("SEARCH_API_KEY")
    or ""
)
SEARCHAPI_URL = "https://www.searchapi.io/api/v1/search"

# ─────────────────────────────────────────────────────────────────────────────
# UNSPLASH POOLS  (mirrors src/data/celebrities.ts  ASSET_IMAGE_POOLS)
# Three distinct images per asset type — used as fallback when no specific
# photo is found by the enrichment pipeline.
# ─────────────────────────────────────────────────────────────────────────────
_POOLS: dict[str, list[str]] = {
    "car": [
        "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=900&h=600&fit=crop&q=85",
        "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?w=900&h=600&fit=crop&q=85",
        "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=900&h=600&fit=crop&q=85",
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&h=600&fit=crop&q=85",
        "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=900&h=600&fit=crop&q=85",
        "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=900&h=600&fit=crop&q=85",
        "https://images.unsplash.com/photo-1542362567-b07e54358753?w=900&h=600&fit=crop&q=85",
        "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=900&h=600&fit=crop&q=85",
        "https://images.unsplash.com/photo-1526726538690-5cbf956ae2fd?w=900&h=600&fit=crop&q=85",
        "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=900&h=600&fit=crop&q=85",
    ],
    "jet": [
        "https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=900&h=600&fit=crop&q=85",
        "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=900&h=600&fit=crop&q=85",
        "https://images.unsplash.com/photo-1474302770737-173ee21bab63?w=900&h=600&fit=crop&q=85",
        "https://images.unsplash.com/photo-1569930784542-c6e1e6ef7ad4?w=900&h=600&fit=crop&q=85",
    ],
    "yacht": [
        "https://images.unsplash.com/photo-1605281317010-fe5ffe798166?w=900&h=600&fit=crop&q=85",
        "https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?w=900&h=600&fit=crop&q=85",
        "https://images.unsplash.com/photo-1505916349660-8d91a99f8901?w=900&h=600&fit=crop&q=85",
        "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=900&h=600&fit=crop&q=85",
        "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=900&h=600&fit=crop&q=85",
    ],
    "real_estate": [
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=900&h=600&fit=crop&q=85",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&h=600&fit=crop&q=85",
        "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=900&h=600&fit=crop&q=85",
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=900&h=600&fit=crop&q=85",
        "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=900&h=600&fit=crop&q=85",
        "https://images.unsplash.com/photo-1583418855144-b6eae5cc4649?w=900&h=600&fit=crop&q=85",
        "https://images.unsplash.com/photo-1416331108676-a22ccb276e35?w=900&h=600&fit=crop&q=85",
        "https://images.unsplash.com/photo-1559494007-9f5847c49d94?w=900&h=600&fit=crop&q=85",
        "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=900&h=600&fit=crop&q=85",
        "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=900&h=600&fit=crop&q=85",
        "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=900&h=600&fit=crop&q=85",
        "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=900&h=600&fit=crop&q=85",
    ],
    "watch": [
        "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=900&h=600&fit=crop&q=85",
        "https://images.unsplash.com/photo-1620625515032-6ed0c1790c75?w=900&h=600&fit=crop&q=85",
        "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=900&h=600&fit=crop&q=85",
        "https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?w=900&h=600&fit=crop&q=85",
    ],
    "art": [
        "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=900&h=600&fit=crop&q=85",
        "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=900&h=600&fit=crop&q=85",
        "https://images.unsplash.com/photo-1533158628620-7e4d40ef1be5?w=900&h=600&fit=crop&q=85",
        "https://images.unsplash.com/photo-1549490349-8643362247b5?w=900&h=600&fit=crop&q=85",
    ],
    "helicopter": [
        "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=900&h=600&fit=crop&q=85",
        "https://images.unsplash.com/photo-1609587312208-cea54be969e7?w=900&h=600&fit=crop&q=85",
    ],
    "island": [
        "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=900&h=600&fit=crop&q=85",
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&h=600&fit=crop&q=85",
        "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=900&h=600&fit=crop&q=85",
    ],
    "sports_team": [
        "https://images.unsplash.com/photo-1565620731385-539de3f57112?w=900&h=600&fit=crop&q=85",
        "https://images.unsplash.com/photo-1598891562936-6e1a75a24d93?w=900&h=600&fit=crop&q=85",
        "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=900&h=600&fit=crop&q=85",
    ],
    "rocket": [
        "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=900&h=600&fit=crop&q=85",
        "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=900&h=600&fit=crop&q=85",
    ],
}


# ─────────────────────────────────────────────────────────────────────────────
# HELPERS
# ─────────────────────────────────────────────────────────────────────────────
def _hash_int(s: str) -> int:
    return int(hashlib.md5(s.encode()).hexdigest(), 16)


def _pick_images(asset: dict, celeb_id: str, n: int = 3) -> list[str]:
    """Deterministically pick n distinct Unsplash images for an asset."""
    atype = asset.get("type", "real_estate")
    pool  = _POOLS.get(atype) or _POOLS["real_estate"]
    seed  = _hash_int(f"{celeb_id}:{asset.get('id', asset.get('name', ''))}")
    size  = len(pool)
    return [pool[(seed + i) % size] for i in range(min(n, size))]


def _is_baseline_protected(celeb: dict) -> bool:
    """
    A celebrity is considered 'baseline protected' if it already has:
      - a non-empty bio
      - at least one asset with a name AND images array
    These records will be skipped unless --force is passed.
    """
    if not celeb.get("bio", "").strip():
        return False
    assets = celeb.get("assets") or []
    return any(
        a.get("name") and a.get("images")
        for a in assets
    )


def _first_sentences(text: str, n: int = 3) -> str:
    """Extract the first n sentences from a blob of text."""
    sentences = re.split(r"(?<=[.!?])\s+", text.strip())
    return " ".join(sentences[:n]).strip()


def _extract_bio_from_snippet(snippet: str, name: str) -> str:
    """Clean a SearchAPI snippet into a usable bio sentence."""
    # Remove date artifacts like "Mar 14, 2024 — "
    text = re.sub(r"^\w{3}\s+\d+,\s+\d{4}\s*[—–-]\s*", "", snippet).strip()
    text = re.sub(r"\s+", " ", text)
    if len(text) < 40:
        return ""
    return _first_sentences(text, 3)


# ─────────────────────────────────────────────────────────────────────────────
# SEARCHAPI
# ─────────────────────────────────────────────────────────────────────────────
def _searchapi_available() -> bool:
    if not SEARCHAPI_KEY or not _REQUESTS:
        return False
    try:
        r = requests.get(
            SEARCHAPI_URL,
            params={"engine": "google", "q": "test", "api_key": SEARCHAPI_KEY},
            timeout=8,
        )
        return r.status_code not in (0, 403, 407)
    except Exception:
        return False


def fetch_bio(name: str) -> Optional[str]:
    """
    Fetch a 2-3 sentence bio for *name* using SearchAPI Google.
    Returns None on any failure.
    """
    if not SEARCHAPI_KEY or not _REQUESTS:
        return None
    query = f'"{name}" biography entrepreneur net worth 2025'
    try:
        r = requests.get(
            SEARCHAPI_URL,
            params={"engine": "google", "q": query, "api_key": SEARCHAPI_KEY, "num": 5},
            timeout=15,
        )
        if r.status_code == 429:
            print(f"    [SearchAPI] 429 rate limit for {name!r} — skipping")
            time.sleep(30)
            return None
        if not r.ok:
            return None
        results = r.json().get("organic_results") or []
        for result in results:
            snippet = result.get("snippet") or ""
            bio = _extract_bio_from_snippet(snippet, name)
            if len(bio) >= 60:
                return bio
    except Exception as e:
        print(f"    [SearchAPI] error for {name!r}: {e}")
    return None


# ─────────────────────────────────────────────────────────────────────────────
# ASSET ENRICHMENT
# ─────────────────────────────────────────────────────────────────────────────
def enrich_assets(celeb: dict, force: bool = False) -> int:
    """
    Assign Unsplash pool images to any asset that lacks them.
    Returns the number of assets updated.
    """
    updated = 0
    celeb_id = celeb.get("id", celeb.get("slug", "unknown"))
    for asset in (celeb.get("assets") or []):
        if not asset.get("images") or force:
            asset["images"] = _pick_images(asset, celeb_id)
            updated += 1
        # Also fill valueFormatted from estimatedValue when missing
        if not asset.get("valueFormatted") and asset.get("estimatedValue"):
            v = float(asset["estimatedValue"])
            if v >= 1000:
                asset["valueFormatted"] = f"${v / 1000:.1f}B"
            elif v >= 1:
                asset["valueFormatted"] = f"${v:g}M"
            else:
                asset["valueFormatted"] = f"${int(v * 1000)}K"
    return updated


# ─────────────────────────────────────────────────────────────────────────────
# PER-CELEBRITY ENRICHMENT
# ─────────────────────────────────────────────────────────────────────────────
def enrich_celeb(
    celeb: dict,
    force: bool = False,
    use_searchapi: bool = False,
) -> bool:
    """
    Enrich one celebrity in-place.
    Returns True if any field was updated.
    """
    changed = False
    name    = celeb.get("name", "")

    # ── 1. Asset images — always fill from Unsplash pools (no network) ────────
    n = enrich_assets(celeb, force=force)
    if n:
        changed = True

    if not use_searchapi:
        return changed

    # ── 2. Bio — only fetch if empty ─────────────────────────────────────────
    if not celeb.get("bio", "").strip() or force:
        bio = fetch_bio(name)
        if bio:
            celeb["bio"] = bio
            changed = True
            print(f"    [bio] {bio[:80]}…")
        time.sleep(SLEEP_BETWEEN)

    return changed


# ─────────────────────────────────────────────────────────────────────────────
# MAIN
# ─────────────────────────────────────────────────────────────────────────────
def main() -> None:
    parser = argparse.ArgumentParser(
        description="Enrich all celebrity profiles with Unsplash asset images and bios."
    )
    parser.add_argument("--force",      action="store_true",
                        help="Re-enrich even baseline-protected celebrities")
    parser.add_argument("--dry-run",    action="store_true",
                        help="Show what would change without writing")
    parser.add_argument("--limit", "-n", type=int, default=0, metavar="N",
                        help="Process only the first N celebrities (0 = all)")
    parser.add_argument("--images-only", action="store_true",
                        help="Only assign Unsplash images, skip SearchAPI bio fetch")
    args = parser.parse_args()

    if not CELEBS_PATH.exists():
        sys.exit(f"ERROR: {CELEBS_PATH} not found — run create_master_file.py first")

    data: list[dict] = json.loads(CELEBS_PATH.read_text(encoding="utf-8"))
    print(f"Loaded {len(data)} celebrities from {CELEBS_PATH}")

    # Sort: trending first, then by netWorth descending
    work = sorted(
        data,
        key=lambda c: (not c.get("trending", False), -(c.get("netWorth") or 0))
    )

    # Check SearchAPI availability once
    use_api = False
    if not args.images_only:
        print("Checking SearchAPI connectivity…", end=" ", flush=True)
        use_api = _searchapi_available()
        print("✓ available" if use_api else "✗ blocked/unavailable — images-only mode")

    if args.limit:
        work = work[:args.limit]

    total = len(work)
    protected = 0
    enriched  = 0
    skipped   = 0

    # Build a fast id→index map so we can update in the original list
    id_map = {c.get("id", c.get("slug", "")): i for i, c in enumerate(data)}

    for idx, celeb in enumerate(work, 1):
        name = celeb.get("name") or f"(id={celeb.get('id')})"

        if not args.force and _is_baseline_protected(celeb):
            print(f"  [{idx}/{total}] ✓ protected  {name}")
            protected += 1
            continue

        print(f"  [{idx}/{total}] → {name}")
        changed = enrich_celeb(celeb, force=args.force, use_searchapi=use_api)

        if changed:
            enriched += 1
            # Update in original list
            key = celeb.get("id", celeb.get("slug", ""))
            orig_idx = id_map.get(key)
            if orig_idx is not None and not args.dry_run:
                data[orig_idx] = celeb
        else:
            skipped += 1

    print(f"\nDone — {enriched} enriched · {protected} protected · {skipped} skipped")

    if args.dry_run:
        print("DRY RUN — no file written")
        return

    if enriched == 0:
        print("No changes — skipping write")
        return

    tmp = CELEBS_PATH.with_suffix(".json.tmp")
    tmp.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    tmp.replace(CELEBS_PATH)
    print(f"Saved {CELEBS_PATH} ({len(data)} celebrities)")


if __name__ == "__main__":
    main()
