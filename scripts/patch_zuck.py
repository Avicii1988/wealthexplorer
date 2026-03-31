#!/usr/bin/env python3
"""
patch_zuck.py — one-time curated data patch for Mark Zuckerberg.
Run from project root:  python scripts/patch_zuck.py
"""
import json
from pathlib import Path

CELEBS_PATH = Path("public/data/celebs.json")

# ── Unsplash image pools (same as src/data/celebrities.ts) ───────────────────
POOLS = {
    "jet": [
        "https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=900&h=600&fit=crop&q=85",
        "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=900&h=600&fit=crop&q=85",
        "https://images.unsplash.com/photo-1474302770737-173ee21bab63?w=900&h=600&fit=crop&q=85",
    ],
    "real_estate": [
        [  # slot 0
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=900&h=600&fit=crop&q=85",
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&h=600&fit=crop&q=85",
            "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=900&h=600&fit=crop&q=85",
        ],
        [  # slot 1
            "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=900&h=600&fit=crop&q=85",
            "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=900&h=600&fit=crop&q=85",
            "https://images.unsplash.com/photo-1583418855144-b6eae5cc4649?w=900&h=600&fit=crop&q=85",
        ],
        [  # slot 2
            "https://images.unsplash.com/photo-1416331108676-a22ccb276e35?w=900&h=600&fit=crop&q=85",
            "https://images.unsplash.com/photo-1559494007-9f5847c49d94?w=900&h=600&fit=crop&q=85",
            "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=900&h=600&fit=crop&q=85",
        ],
    ],
}

PATCH = {
    # ── Meta ──────────────────────────────────────────────────────────────────
    "bio": (
        "Mark Zuckerberg co-founded Facebook from his Harvard dorm room in 2004, "
        "transforming it into Meta Platforms — a $1.4 trillion conglomerate owning "
        "Facebook, Instagram, and WhatsApp. As Chairman and CEO he has steered the "
        "company through landmark regulatory battles and a bold pivot toward AI and "
        "augmented reality. A disciplined practitioner of Brazilian jiu-jitsu, he is "
        "consistently ranked among the world's five wealthiest individuals."
    ),
    "category": "Entrepreneurs",
    "netWorth": 175.0,
    "nationality": "American",
    "birthdate": "May 14, 1984",
    "birthplace": "White Plains, New York, USA",
    "gender": "Male",
    "height": "5'7\" (170 cm)",
    "profession": "Software Developer, Entrepreneur",

    # ── Relationships ─────────────────────────────────────────────────────────
    "relationships": {
        "spouse": "Priscilla Chan",
        "children": ["Maxima Zuckerberg", "August Zuckerberg", "Aurelia Zuckerberg"],
    },

    # ── Gossip & Controversy ──────────────────────────────────────────────────
    "gossip": [
        {
            "title": "Senate Hearing Apology",
            "summary": (
                "In January 2024, Zuckerberg stood up and turned to face a gallery of "
                "parents of child victims during a Senate Judiciary Committee hearing on "
                "social media and child safety, delivering a public apology in one of the "
                "most dramatic moments in recent congressional history."
            ),
            "type": "controversy",
            "date": "Jan 2024",
        },
        {
            "title": "Cage-Fight Challenge to Elon Musk",
            "summary": (
                "After Musk threatened to restrict Threads on X, Zuckerberg challenged "
                "him to a cage fight. Musk accepted on X, but the bout never materialised "
                "despite weeks of trash-talk, sparring clips, and breathless media coverage "
                "that captivated the internet for months."
            ),
            "type": "gossip",
            "date": "Summer 2023",
        },
        {
            "title": "Metaverse: $46 Billion Lost",
            "summary": (
                "Meta's Reality Labs division burned through more than $46 billion between "
                "2019 and 2023 chasing Zuckerberg's metaverse vision, with sluggish headset "
                "sales and internal frustration mounting. Zuckerberg defended the bet, "
                "calling it 'one of the most important things we'll do in our lifetime.'"
            ),
            "type": "controversy",
            "date": "2022–2023",
        },
        {
            "title": "Kauai Ranch Land Dispute",
            "summary": (
                "Zuckerberg faced years of backlash from Native Hawaiian communities and "
                "local advocates over his 1,500-acre Ko'olau Ranch compound on Kauai, "
                "including a bitter legal battle over ancient trails and traditional land "
                "access rights."
            ),
            "type": "controversy",
            "date": "2021–2023",
        },
    ],

    # ── Assets ────────────────────────────────────────────────────────────────
    "assets": [
        {
            "id": "mark-zuckerberg-koolau-ranch",
            "type": "real_estate",
            "name": "Ko'olau Ranch, Kauai",
            "description": (
                "A sprawling 1,500-acre compound on the north shore of Kauai, Hawaii. "
                "The estate features a main mansion, multiple guest houses, its own beach, "
                "an underground bunker, and sustainable farming operations — making it one "
                "of the most expensive private properties ever assembled in Hawaii."
            ),
            "estimatedValue": 270.0,
            "location": "Kauai, Hawaii, USA",
            "images": POOLS["real_estate"][0],
            "valueFormatted": "$270M",
            "valuationSource": "mansionglobal.com",
            "lastValuated": "2026-03-31",
            "likes": 0,
        },
        {
            "id": "mark-zuckerberg-palo-alto",
            "type": "real_estate",
            "name": "Palo Alto Compound",
            "description": (
                "Zuckerberg's primary Silicon Valley residence in Palo Alto, California. "
                "Purchased in 2011, the property has been expanded over the years by "
                "acquiring and demolishing surrounding homes to create a private compound "
                "with extensive security."
            ),
            "estimatedValue": 7.0,
            "location": "Palo Alto, California, USA",
            "images": POOLS["real_estate"][1],
            "valueFormatted": "$7M",
            "valuationSource": "businessinsider.com",
            "lastValuated": "2026-03-31",
            "likes": 0,
        },
        {
            "id": "mark-zuckerberg-lake-tahoe",
            "type": "real_estate",
            "name": "Lake Tahoe Lakefront Estate",
            "description": (
                "A luxury lakefront retreat on the shores of Lake Tahoe offering sweeping "
                "mountain and water views. The estate serves as Zuckerberg's primary "
                "vacation property for skiing and outdoor activities."
            ),
            "estimatedValue": 59.0,
            "location": "Lake Tahoe, Nevada, USA",
            "images": POOLS["real_estate"][2],
            "valueFormatted": "$59M",
            "valuationSource": "businessinsider.com",
            "lastValuated": "2026-03-31",
            "likes": 0,
        },
        {
            "id": "mark-zuckerberg-gulfstream-g650er",
            "type": "jet",
            "name": "Gulfstream G650ER",
            "description": (
                "One of the world's most capable ultra-long-range business jets, able to "
                "fly non-stop from San Francisco to Tokyo. Fitted with a custom interior, "
                "Zuckerberg uses it for global executive travel and his frequent trips "
                "between Silicon Valley and Hawaii."
            ),
            "estimatedValue": 65.0,
            "year": 2022,
            "specs": "Ultra-long-range · seats up to 19 · max speed Mach 0.925 · range 7,500 nm",
            "images": POOLS["jet"],
            "valueFormatted": "$65M",
            "valuationSource": "privatefly.com",
            "lastValuated": "2026-03-31",
            "likes": 0,
        },
    ],
}


def main() -> None:
    data = json.loads(CELEBS_PATH.read_text(encoding="utf-8"))

    idx = next((i for i, c in enumerate(data) if c.get("id") == "mark-zuckerberg"), None)
    if idx is None:
        raise SystemExit("❌  mark-zuckerberg not found in celebs.json")

    data[idx].update(PATCH)
    print(f"✅  Patched mark-zuckerberg (index {idx})")
    print(f"   bio:          {len(PATCH['bio'])} chars")
    print(f"   assets:       {len(PATCH['assets'])}")
    print(f"   gossip items: {len(PATCH['gossip'])}")

    CELEBS_PATH.write_text(
        json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    print(f"✅  Saved {CELEBS_PATH} ({len(data)} total celebrities)")


if __name__ == "__main__":
    main()
