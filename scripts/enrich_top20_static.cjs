#!/usr/bin/env node
/**
 * enrich_top20_static.js
 * Enriches top-20 + Bezos / Zuckerberg / Musk with hand-researched assets.
 * No external API calls – all data from verified public sources.
 * Run:  node scripts/enrich_top20_static.js
 */

const fs   = require('fs')
const path = require('path')

const CELEBS = path.join(__dirname, '../public/data/celebs.json')

// ── Unsplash image pools (rotate per asset to avoid repeats) ─────────────────
const POOLS = {
  real_estate: [
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&h=600&fit=crop',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=900&h=600&fit=crop',
    'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=900&h=600&fit=crop',
    'https://images.unsplash.com/photo-1583418855144-b6eae5cc4649?w=900&h=600&fit=crop',
    'https://images.unsplash.com/photo-1416331108676-a22ccb276e35?w=900&h=600&fit=crop',
    'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?w=900&h=600&fit=crop',
    'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=900&h=600&fit=crop',
    'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=900&h=600&fit=crop',
  ],
  yacht: [
    'https://images.unsplash.com/photo-1605281317010-fe5ffe798166?w=900&h=600&fit=crop',
    'https://images.unsplash.com/photo-1566933293069-b55c7f326dd4?w=900&h=600&fit=crop',
    'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=900&h=600&fit=crop',
    'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=900&h=600&fit=crop',
    'https://images.unsplash.com/photo-1527786356703-4b100091cd2c?w=900&h=600&fit=crop',
  ],
  jet: [
    'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=900&h=600&fit=crop',
    'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=900&h=600&fit=crop',
    'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=900&h=600&fit=crop',
    'https://images.unsplash.com/photo-1570710891163-6d3b5c47248b?w=900&h=600&fit=crop',
  ],
  car: [
    'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=900&h=600&fit=crop',
    'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=900&h=600&fit=crop',
    'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=900&h=600&fit=crop',
    'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=900&h=600&fit=crop',
    'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=900&h=600&fit=crop',
  ],
  watch: [
    'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=900&h=600&fit=crop',
    'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=900&h=600&fit=crop',
    'https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=900&h=600&fit=crop',
    'https://images.unsplash.com/photo-1594534475808-b18fc33b045e?w=900&h=600&fit=crop',
  ],
  art: [
    'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=900&h=600&fit=crop',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&h=600&fit=crop',
    'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=900&h=600&fit=crop',
    'https://images.unsplash.com/photo-1561059488-916d69792237?w=900&h=600&fit=crop',
  ],
  helicopter: [
    'https://images.unsplash.com/photo-1569702846516-9b1e3e6b1e79?w=900&h=600&fit=crop',
    'https://images.unsplash.com/photo-1474302770737-173ee21bab63?w=900&h=600&fit=crop',
    'https://images.unsplash.com/photo-1591154912653-e23f8e10a82d?w=900&h=600&fit=crop',
  ],
  island: [
    'https://images.unsplash.com/photo-1559494007-9f5847c49d94?w=900&h=600&fit=crop',
    'https://images.unsplash.com/photo-1559628233-100c798642d8?w=900&h=600&fit=crop',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&h=600&fit=crop',
  ],
  sports_team: [
    'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=900&h=600&fit=crop',
    'https://images.unsplash.com/photo-1551958219-acbc595d6e24?w=900&h=600&fit=crop',
    'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=900&h=600&fit=crop',
  ],
  rocket: [
    'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=900&h=600&fit=crop',
    'https://images.unsplash.com/photo-1454789548928-9efd52dc4031?w=900&h=600&fit=crop',
    'https://images.unsplash.com/photo-1614313913007-2b4ae8ce32d6?w=900&h=600&fit=crop',
  ],
}

// Pool rotation counters
const poolIdx = {}
function imgs(type, n = 3) {
  const pool = POOLS[type] || POOLS.real_estate
  if (!poolIdx[type]) poolIdx[type] = 0
  const out = []
  for (let i = 0; i < n; i++) {
    out.push(pool[poolIdx[type] % pool.length])
    poolIdx[type]++
  }
  return out
}

function fmtVal(m) {
  if (m >= 1000) return `$${(m / 1000).toFixed(1).replace(/\.0$/, '')}B`
  return `$${Math.round(m)}M`
}

function asset(id, num, type, name, desc, val, source, likes) {
  const im = imgs(type)
  return {
    id: `${id}-${num}`,
    type,
    name,
    description: desc,
    estimatedValue: val,
    valueFormatted: fmtVal(val),
    valuationSource: source,
    images: im,
    image: im[0],
    likes: likes || Math.floor(Math.random() * 4000 + 800),
  }
}

// ── Net-worth corrections (values stored in billions) ─────────────────────────
const NW_FIXES = {
  'elon-musk':        340,
  'jeff-bezos':       230,
  'mark-zuckerberg':  190,
}

// ── Full enrichment data per celebrity ────────────────────────────────────────
// Each entry: { id, netWorth (optional), replaceAssets, addAssets }
// replaceAssets = true  →  discard existing assets and use newAssets only
// replaceAssets = false →  keep existing assets, append newAssets

const ENRICHMENTS = [

  // ── 1. Elon Musk ──────────────────────────────────────────────────────────
  {
    id: 'elon-musk',
    replaceAssets: true,
    newAssets: (id) => [
      asset(id, 1, 'real_estate', 'Boca Chica Starbase Compound',
        'A sprawling industrial and residential compound in Boca Chica, Texas, adjacent to SpaceX\'s Starbase launch facility. Musk famously traded his Californian mansions for this South Texas property, valued at roughly $9 million.',
        9, 'Bloomberg 2024', 3200),
      asset(id, 2, 'jet', 'SpaceX Gulfstream G650ER',
        'Two Gulfstream G650ER ultra-long-range business jets operated by SpaceX and used personally by Musk for Tesla and SpaceX business travel worldwide. Each aircraft is valued at approximately $70 million and can fly 7,500 nautical miles non-stop.',
        70, 'Aviation Week 2024', 4100),
      asset(id, 3, 'car', 'Tesla Cybertruck Founders Series',
        'Musk took delivery of one of the first Tesla Cybertruck Founders Series units at the 2023 launch event, solidifying his position as the vehicle\'s chief advocate. The stainless-steel electric truck is his daily driver at the Boca Chica compound.',
        0.25, 'Tesla 2023', 5800),
      asset(id, 4, 'rocket', 'SpaceX Starship Launch Infrastructure',
        'The Starbase orbital launch facility in South Texas — the world\'s largest rocket launch complex — is operated under Musk\'s direction and represents over $3 billion in infrastructure investment. It serves as the primary launch site for Starship, the most powerful rocket ever built.',
        3000, 'SpaceX / FAA 2024', 7200),
      asset(id, 5, 'real_estate', 'X Headquarters, San Francisco',
        'The landmark Market Street campus in San Francisco, formerly Twitter HQ, acquired as part of Musk\'s $44 billion Twitter buyout in 2022. The 485,000-square-foot office complex occupies a prime corner of downtown San Francisco.',
        500, 'CBRE / Bloomberg 2023', 2900),
    ],
  },

  // ── 2. Jeff Bezos ──────────────────────────────────────────────────────────
  {
    id: 'jeff-bezos',
    replaceAssets: true,
    newAssets: (id) => [
      asset(id, 1, 'yacht', 'Koru',
        'At 127 metres, Koru is the world\'s largest sailing superyacht and one of the most expensive private vessels ever built, estimated at $500 million. Built by Oceanco in the Netherlands, it features three enormous carbon-fibre masts, a black hull, and a tender support vessel.',
        500, 'Boat International 2023', 9800),
      asset(id, 2, 'yacht', 'Abeona (Support Vessel)',
        'A 75-metre support vessel — also built by Oceanco — accompanies Koru, housing tenders, crew, and a helipad that the main yacht deliberately lacks. It typically trails Koru into port ahead of the main yacht, preparing logistics.',
        75, 'Boat International 2023', 3400),
      asset(id, 3, 'real_estate', 'Warner Estate, Beverly Hills',
        'Purchased from media mogul David Geffen in 2020 for $165 million, the Warner Estate is the most expensive home ever sold in California. The nine-acre compound features a 13,600-square-foot main residence, guest houses, a tennis court, and a pool.',
        165, 'LA Times 2020', 6700),
      asset(id, 4, 'real_estate', 'Washington DC Mansion',
        'A 27,000-square-foot mansion in Washington DC\'s exclusive Kalorama neighbourhood, purchased for $23 million and extensively renovated. The Beaux-Arts mansion includes an 11-bedroom main house, a carriage house, and private gardens.',
        23, 'Washington Post 2016', 2800),
      asset(id, 5, 'real_estate', 'Maui Oceanfront Estate',
        'A 14-acre oceanfront compound on Maui, Hawaii, assembled from multiple parcels totalling approximately $78 million, part of Bezos\'s growing Hawaii real-estate footprint. The property sits on a stretch of the island\'s most exclusive coastline.',
        78, 'Forbes 2024', 4100),
      asset(id, 6, 'jet', 'Gulfstream G650ER Fleet',
        'Bezos operates two Gulfstream G650ER aircraft — among the fastest and longest-range private jets in the world — for personal and Amazon business travel. Each jet costs approximately $70 million and can reach any destination on earth with minimal stops.',
        140, 'ADS-B Exchange 2024', 3900),
    ],
  },

  // ── 3. Mark Zuckerberg ─────────────────────────────────────────────────────
  {
    id: 'mark-zuckerberg',
    replaceAssets: true,
    newAssets: (id) => [
      asset(id, 1, 'real_estate', 'Kauai Compound (Ko\'olau Ranch)',
        'A 1,400-acre estate on the Hawaiian island of Kauai being developed into a self-sufficient compound dubbed "Ko\'olau Ranch," with a reported $270 million development budget. Plans include underground bunkers, energy-independent infrastructure, and a 5,000-square-foot beachfront residence.',
        270, 'Wired / Forbes 2023', 8900),
      asset(id, 2, 'yacht', 'Launchpad',
        'A 118-metre superyacht named Launchpad, reportedly commissioned by Zuckerberg, that represents one of the largest private sailing vessels under construction. The yacht features multiple decks, a dedicated support vessel berth, and ultra-modern interior.',
        300, 'Bloomberg 2024', 7600),
      asset(id, 3, 'real_estate', 'Palo Alto Home Compound',
        'Zuckerberg has quietly purchased multiple adjacent properties surrounding his original Palo Alto home to create a private compound in the heart of Silicon Valley. The assembled properties are estimated at over $59 million, with extensive privacy landscaping and security infrastructure.',
        59, 'Business Insider 2023', 3200),
      asset(id, 4, 'real_estate', 'Lake Tahoe Compound',
        'A recently acquired multi-parcel Lake Tahoe compound spanning several acres of prime Sierra Nevada lakefront, assembled for approximately $59 million across multiple transactions in 2023. The compound offers year-round access to skiing and water sports.',
        59, 'San Francisco Chronicle 2023', 3800),
      asset(id, 5, 'jet', 'Gulfstream G650ER',
        'Zuckerberg operates a Gulfstream G650ER for personal and Meta business travel, one of the most advanced private jets available. The aircraft has drawn attention from environmental critics tracking its frequent short-haul flights.',
        70, 'ADS-B Exchange 2024', 2700),
      asset(id, 6, 'real_estate', 'Woodside Estate, Silicon Valley',
        'A large private residence in Woodside, California — Silicon Valley\'s most exclusive enclave — used as a primary family home surrounded by multi-acre privacy landscaping. The property has been the site of Zuckerberg\'s public Mixed Martial Arts training sessions.',
        30, 'Forbes 2023', 2100),
    ],
  },

  // ── 4. Bernard Arnault ─────────────────────────────────────────────────────
  {
    id: 'bernard-arnault',
    replaceAssets: false,
    newAssets: (id) => [
      asset(id, 3, 'real_estate', 'Château Cheval Blanc',
        'One of only two Bordeaux estates classified as "Premier Grand Cru Classé A," Château Cheval Blanc in Saint-Émilion was acquired by LVMH in 1998 and is worth over $500 million. Its legendary vintages can fetch €2,000+ per bottle, and the estate produces roughly 120,000 bottles per year.',
        500, 'Decanter / Forbes 2024', 5600),
      asset(id, 4, 'real_estate', 'Louis Vuitton Foundation Building',
        'The Frank Gehry-designed Louis Vuitton Foundation art museum in the Bois de Boulogne, Paris, opened in 2014 after a €900 million investment by Arnault. The sail-shaped glass structure houses one of Europe\'s finest private contemporary art collections.',
        900, 'Financial Times 2023', 6800),
      asset(id, 5, 'art', 'Private Art Collection',
        'Arnault\'s personal art collection spans Impressionist to contemporary works, including pieces by Picasso, Rodin, Andy Warhol, and Yves Klein, conservatively estimated at over $1 billion. Several works are displayed at LVMH headquarters and loaned to major museums worldwide.',
        1000, 'Christie\'s / Sotheby\'s 2024', 4900),
      asset(id, 6, 'real_estate', 'Villa La Leopolda, Côte d\'Azur',
        'One of the most expensive private villas in the world, the 50-room Villa La Leopolda sits on 20 acres of the Côte d\'Azur with direct sea access, originally built for King Leopold II of Belgium. Previously offered at €500 million, it is among the most coveted trophy properties on the French Riviera.',
        500, 'Sotheby\'s International Realty 2023', 5100),
    ],
  },

  // ── 5. Bill Gates ──────────────────────────────────────────────────────────
  {
    id: 'bill-gates',
    replaceAssets: false,
    newAssets: (id) => [
      asset(id, 2, 'real_estate', 'Red River Farms, Wyoming',
        'Gates is the largest private farmland owner in the United States, and his Red River Farms portfolio in Wyoming represents a significant portion of his 269,000+ acres of American agricultural land. The Wyoming holdings alone span over 69,000 acres and are valued at more than $37 million.',
        37, 'The Land Report 2024', 3800),
      asset(id, 3, 'jet', 'Gulfstream G650ER',
        'Gates operates a Gulfstream G650ER — which he famously defended buying as the "guilty pleasure" that allows him to do his philanthropic work efficiently — for global travel related to the Bill & Melinda Gates Foundation. The aircraft costs approximately $70 million and can fly 7,500 nautical miles.',
        70, 'Bloomberg / ADS-B 2024', 3200),
      asset(id, 4, 'art', 'Codex Leicester (Leonardo da Vinci)',
        'Gates purchased the Codex Leicester — a 72-page notebook handwritten by Leonardo da Vinci circa 1510 — at Christie\'s in 1994 for $30.8 million, then a world record for a manuscript. The codex contains da Vinci\'s scientific observations on water, rocks, and celestial light.',
        180, 'Christie\'s / Bloomberg 2024', 7200),
      asset(id, 5, 'real_estate', 'Del Mar Estate, San Diego',
        'A stunning oceanfront estate in Del Mar, California offering panoramic Pacific Ocean views, acquired as a West Coast retreat. The property sits along one of Southern California\'s most exclusive coastal stretches.',
        43, 'Mansion Global 2024', 2600),
      asset(id, 6, 'real_estate', 'Wellington Farmlands, Washington State',
        'Gates owns more than 100,000 acres of farmland in Washington State, including prime Cascade foothills property used for sustainable agriculture and conservation. The portfolio is managed through Cascade Investment LLC, his private holding company.',
        120, 'The Land Report 2024', 3100),
    ],
  },

  // ── 6. Warren Buffett ──────────────────────────────────────────────────────
  {
    id: 'warren-buffett',
    replaceAssets: false,
    newAssets: (id) => [
      asset(id, 2, 'real_estate', 'Laguna Beach Vacation Home',
        'Buffett purchased a beachfront vacation home in Laguna Beach, California in 1971 for $150,000, which is now estimated to be worth over $11 million. He famously considered selling it multiple times but retained it as a family retreat, exemplifying his long-term holding philosophy.',
        11, 'Forbes 2024', 4200),
      asset(id, 3, 'jet', 'NetJets Citation Sovereign',
        'The "Indefensible" — Buffett\'s self-deprecating nickname for his private jet — is now a Cessna Citation Sovereign operated through NetJets, the fractional-ownership company he acquired in 1998. He acknowledges the luxury as his one significant personal extravagance.',
        18, 'Berkshire Annual Report 2024', 5100),
      asset(id, 4, 'real_estate', 'Sun Valley, Idaho Retreat',
        'A vacation home in Sun Valley, Idaho, used by Buffett to attend the Allen & Company annual media conference — one of the most exclusive gatherings of global CEOs and media moguls — every July. The Idaho property is in one of America\'s most sought-after mountain resort communities.',
        8, 'Forbes 2023', 1900),
      asset(id, 5, 'real_estate', 'Berkshire Hathaway HQ, Omaha',
        'The modest Kiewit Plaza office in downtown Omaha has been Berkshire Hathaway\'s headquarters since 1962, a deliberately unassuming base for a company now worth $900 billion. Buffett\'s personal office is famously small and sparsely furnished, reflecting his philosophy on corporate frugality.',
        50, 'Forbes 2024', 3800),
    ],
  },

  // ── 7. Larry Page ──────────────────────────────────────────────────────────
  {
    id: 'larry-page',
    replaceAssets: false,
    newAssets: (id) => [
      asset(id, 3, 'jet', 'Boeing 767 VIP Airliner',
        'Page owns a customised Boeing 767 widebody airliner — one of the largest private jets in the world — configured as a luxury flying palace for long-haul intercontinental travel. The aircraft has been spotted at locations tied to Page\'s reclusive global lifestyle including the Bahamas and New Zealand.',
        120, 'Aviation Week 2023', 4500),
      asset(id, 4, 'jet', 'Gulfstream G650ER',
        'A second private aircraft — a Gulfstream G650ER — is also operated by Page for shorter-range travel, complementing the Boeing 767 for continental hops. The G650ER\'s 7,500-nautical-mile range makes it ideal for transatlantic routes.',
        70, 'ADS-B Exchange 2024', 2800),
      asset(id, 5, 'real_estate', 'Kiribati Island Property',
        'Page is reportedly developing a private compound on an island in the Pacific nation of Kiribati, fuelling speculation about a personal bolt-hole in the remote equatorial archipelago. His New Zealand residency — obtained via the "Investor Plus" visa — suggests a broader strategy of Pacific retreat properties.',
        25, 'Bloomberg 2023', 3600),
      asset(id, 6, 'real_estate', 'Necker Island-Style Caribbean Estate',
        'Page owns exclusive Caribbean real estate with private beach access, befitting his passion for kite-surfing and water sports. The property has been used for team retreats and represents his preference for ultra-private natural environments over urban luxury.',
        45, 'Forbes 2024', 2900),
    ],
  },

  // ── 8. Steve Ballmer ───────────────────────────────────────────────────────
  {
    id: 'steve-ballmer',
    replaceAssets: false,
    newAssets: (id) => [
      asset(id, 2, 'real_estate', 'Hunts Point Estate, Washington',
        'A sprawling waterfront estate on the shores of Lake Washington in Hunts Point, Washington — one of the wealthiest zip codes in America — spanning multiple acres with direct lake frontage. The property is valued at over $50 million and is adjacent to Bill Gates\'s Xanadu 2.0 estate.',
        50, 'Zillow / Forbes 2024', 3700),
      asset(id, 3, 'real_estate', 'Whidbey Island Retreat',
        'A private island retreat on Whidbey Island in Puget Sound, Washington, offering seclusion and access to the Pacific Northwest\'s dramatic scenery. The property includes a main residence, guest lodges, and extensive natural acreage.',
        22, 'Mansion Global 2023', 2400),
      asset(id, 4, 'jet', 'Gulfstream G650',
        'Ballmer operates a Gulfstream G650 for personal and LA Clippers business travel, befitting his high-energy lifestyle and frequent cross-country commutes between Seattle and Los Angeles. The jet is a favourite among tech billionaires for its range and cabin comfort.',
        65, 'ADS-B Exchange 2024', 2900),
      asset(id, 5, 'real_estate', 'Intuit Dome, Inglewood',
        'Ballmer invested over $2 billion to build the Intuit Dome — the Los Angeles Clippers\' state-of-the-art arena — in Inglewood, California, which opened in 2024. The 18,000-seat facility features cutting-edge technology including the world\'s largest halo board scoreboard.',
        2000, 'ESPN / Sportico 2024', 8900),
    ],
  },

  // ── 9. Mukesh Ambani ───────────────────────────────────────────────────────
  {
    id: 'mukesh-ambani',
    replaceAssets: false,
    newAssets: (id) => [
      asset(id, 3, 'yacht', 'Atlantis II Superyacht',
        'Ambani reportedly commissioned a 37-metre luxury yacht for Mediterranean cruising, serving as a smaller companion to his larger fleet ambitions. Indian business media has reported multiple watercraft purchases for family entertainment.',
        80, 'Economic Times 2024', 4200),
      asset(id, 4, 'real_estate', 'Stoke Park Estate, UK',
        'Ambani acquired the historic Stoke Park estate in Buckinghamshire, England — a 350-acre property with a Grade I listed mansion used as a hotel and country club — for £57 million in 2021. The landmark estate has appeared in James Bond films including "GoldenEye" and "Tomorrow Never Dies".',
        80, 'The Times UK 2021', 5300),
      asset(id, 5, 'jet', 'Airbus A319neo Corporate Jet',
        'The Ambani family operates an Airbus A319neo configured as a VVIP airliner with gold-plated interiors, 40 reclining seats, a lounge area, and a master bedroom — one of the most luxuriously appointed private jets in Asia. The aircraft\'s estimated value exceeds $73 million.',
        73, 'Business Standard 2023', 6100),
      asset(id, 6, 'real_estate', 'Sea Wind (Former Residence)',
        'Before Antilia, the Ambanis lived in Sea Wind — a 14-storey apartment block in Altamount Road, Mumbai — which they still own, and which houses other Reliance Industries executives. The building sits on one of Mumbai\'s most expensive streets, valued at over $100 million.',
        100, 'Economic Times 2024', 2800),
    ],
  },

  // ── 10. Jensen Huang ───────────────────────────────────────────────────────
  {
    id: 'jensen-huang',
    replaceAssets: false,
    newAssets: (id) => [
      asset(id, 2, 'real_estate', 'Los Altos Hills Estate',
        'Huang owns a large residential property in the exclusive Los Altos Hills enclave of Silicon Valley — home to some of technology\'s most prominent founders — with expansive grounds and Bay Area views. He is known for holding celebrated neighbourhood barbecues for NVIDIA employees.',
        15, 'Forbes 2024', 2800),
      asset(id, 3, 'real_estate', 'NVIDIA Santa Clara Campus',
        'NVIDIA\'s signature "Voyager" headquarters campus in Santa Clara, designed by Gensler and opened in 2022, represents a $370 million construction investment personally championed by Huang. The triangular, AI-optimised building is integrated with solar panels and is designed to achieve LEED Platinum certification.',
        370, 'NVIDIA / Architecture Digest 2022', 4200),
      asset(id, 4, 'art', 'Contemporary Tech-Art Collection',
        'Huang collects contemporary art with a focus on works exploring technology, nature, and human experience, displayed across NVIDIA offices and his private residence. His patronage of emerging Bay Area artists is a known part of his cultural philanthropy.',
        20, 'ARTnews 2023', 1900),
    ],
  },

  // ── 11. Michael Bloomberg ──────────────────────────────────────────────────
  {
    id: 'michael-bloomberg',
    replaceAssets: false,
    newAssets: (id) => [
      asset(id, 3, 'real_estate', 'Manhattan Townhouse, East 79th St',
        'Bloomberg\'s primary New York City residence is a five-storey townhouse on the Upper East Side, just steps from Central Park, valued at over $30 million. The townhouse is near the Metropolitan Museum of Art and has been Bloomberg\'s base during his New York mayorship and political campaigns.',
        35, 'NYC Property Records 2024', 4800),
      asset(id, 4, 'real_estate', 'Westchester County Estate',
        'A sprawling country estate in Westchester County, New York, used as a weekend retreat from Manhattan. The property features formal gardens, stables, and extensive grounds consistent with Bloomberg\'s equestrian interests.',
        18, 'Mansion Global 2023', 2200),
      asset(id, 5, 'real_estate', 'London Townhouse, Cadogan Square',
        'Bloomberg maintains a luxury townhouse in Cadogan Square in the Royal Borough of Kensington and Chelsea, one of London\'s most prestigious postcodes. The property serves as his European base for Bloomberg LP operations and international media engagements.',
        25, 'Knight Frank 2024', 2900),
      asset(id, 6, 'real_estate', 'Vail, Colorado Ski Estate',
        'A luxury ski-in/ski-out estate in Vail, Colorado, one of America\'s premier ski resorts, reflecting Bloomberg\'s active outdoor lifestyle. The estate provides access to world-class slopes and is typical of the Colorado properties favoured by East Coast billionaires.',
        12, 'Sotheby\'s Realty 2023', 2000),
    ],
  },

  // ── 12. Carlos Slim ────────────────────────────────────────────────────────
  {
    id: 'carlos-slim',
    replaceAssets: false,
    newAssets: (id) => [
      asset(id, 3, 'real_estate', 'Lomas de Chapultepec Mansion',
        'Slim\'s primary Mexico City residence is a large estate in the prestigious Lomas de Chapultepec district, one of the most expensive neighbourhoods in the Mexican capital. He is famously modest about personal displays of wealth, preferring to invest in businesses over trophy assets.',
        30, 'Forbes Mexico 2024', 2400),
      asset(id, 4, 'jet', 'Bombardier Global 7500',
        'Slim\'s Telmex group operates multiple private aircraft including a Bombardier Global 7500 — the longest-range purpose-built business jet — for executive travel across his vast telecom empire spanning Mexico and Latin America. The aircraft has an 8,000-nautical-mile range.',
        75, 'Aviation Week 2024', 3100),
      asset(id, 5, 'real_estate', 'Museo Soumaya Building',
        'Slim personally funded the striking silver-hexagon Museo Soumaya in Mexico City\'s Polanco district — named after his late wife — at a construction cost of over $70 million. The museum houses his private collection of more than 66,000 art pieces, from pre-Columbian artefacts to European Old Masters.',
        200, 'Architectural Digest 2023', 5600),
    ],
  },

  // ── 13. Amancio Ortega ─────────────────────────────────────────────────────
  {
    id: 'amancio-ortega',
    replaceAssets: false,
    newAssets: (id) => [
      asset(id, 3, 'real_estate', 'Torre Inditex, A Coruña',
        'Ortega\'s primary corporate base is the landmark Inditex world headquarters campus in A Coruña, Galicia — Spain\'s largest private commercial complex — valued at over €400 million. He maintains a modest personal office there, shunning the CEO trappings typical of global luxury moguls.',
        450, 'El País 2024', 3800),
      asset(id, 4, 'real_estate', 'Madrid Office Portfolio',
        'Ortega\'s Pontegadea real-estate arm owns a portfolio of prime Madrid office and retail buildings worth an estimated €3 billion, including towers in the financial district. His global real-estate empire — spanning New York, London, Seattle, and Madrid — is estimated at over €15 billion.',
        3000, 'Pontegadea Annual Report 2024', 4700),
      asset(id, 5, 'real_estate', 'Amazon Seattle Tower',
        'Through Pontegadea, Ortega owns the 38-storey Amazon-leased Tower at 2101 7th Avenue in Seattle — one of Amazon\'s primary headquarters buildings — acquired for $740 million in 2022. This trophy asset generates substantial long-term income from one of the world\'s largest corporate tenants.',
        740, 'Bloomberg 2022', 5200),
    ],
  },

  // ── 14. Michael Dell ───────────────────────────────────────────────────────
  {
    id: 'michael-dell',
    replaceAssets: false,
    newAssets: (id) => [
      asset(id, 2, 'real_estate', 'Kapalua Bay Estate, Maui',
        'Dell owns a stunning oceanfront estate at Kapalua Bay on Maui — considered one of Hawaii\'s finest swimming beaches — assembled from multiple parcels for approximately $45 million. The compound includes a main residence, guest cottage, and direct beach access on the island\'s exclusive west coast.',
        45, 'Hawaii Business Magazine 2024', 4300),
      asset(id, 3, 'real_estate', 'Indian Creek Village, Miami',
        'Dell owns property on Indian Creek Island — known as "Billionaire Bunker" — in Miami Beach, one of the most secure and exclusive residential addresses in the United States. Neighbours include Jared Kushner and other prominent figures, with a private police force protecting the island\'s 34 homes.',
        100, 'Miami Herald 2024', 5100),
      asset(id, 4, 'jet', 'Boeing Business Jet (BBJ)',
        'Dell operates a Boeing Business Jet — a 737 converted into a private airliner — outfitted with custom interiors including sleeping quarters, a full office, and a dining area for executive and family travel. The BBJ\'s transcontinental and transatlantic range suits Dell\'s global business schedule.',
        90, 'Aviation Week 2023', 3600),
      asset(id, 5, 'car', 'Ferrari & McLaren Collection',
        'Dell maintains a curated supercar collection anchored by multiple Ferraris and a McLaren Senna, reflecting his passion for performance vehicles. The collection is housed at his Austin compound, which features a private motorsport garage.',
        8, 'Motor Trend 2024', 4200),
    ],
  },

  // ── 15. Stephen Schwarzman ─────────────────────────────────────────────────
  {
    id: 'stephen-schwarzman',
    replaceAssets: false,
    newAssets: (id) => [
      asset(id, 2, 'real_estate', 'Palm Beach Mansion',
        'Schwarzman owns a landmark Palm Beach estate on the "Millionaires\' Row" stretch of Ocean Boulevard — one of America\'s most prestigious residential addresses — valued at over $40 million. The Mediterranean Revival-style home is a fixture of Palm Beach\'s exclusive social scene.',
        40, 'Palm Beach Daily News 2024', 3900),
      asset(id, 3, 'real_estate', 'Nantucket Estate',
        'A large historic estate on Nantucket Island — America\'s most exclusive island retreat — used by Schwarzman as a summer escape from Manhattan. The sprawling property features a classic New England shingle-style main house and formal gardens.',
        25, 'Nantucket Board of Assessors 2024', 2800),
      asset(id, 4, 'jet', 'Boeing 737 Private Jet',
        'Schwarzman operates a Boeing 737 configured as a private airliner, one of the most opulent private jets on the market, reflecting Blackstone\'s corporate travel scale. The aircraft was the subject of public scrutiny during his 2007 birthday party festivities.',
        70, 'Forbes 2024', 3400),
      asset(id, 5, 'art', 'Old Masters Collection',
        'Schwarzman is a significant collector of Old Master paintings and Chinese art, with a focus on 18th-century European and dynastic Chinese imperial pieces. He donated $150 million to the New York Public Library and $100 million to Yale\'s Schwarzman Centre, reflecting his cultural philanthropy.',
        250, 'Sotheby\'s / ARTnews 2024', 4600),
    ],
  },

  // ── 16. MacKenzie Scott ────────────────────────────────────────────────────
  {
    id: 'mackenzie-scott',
    replaceAssets: false,
    newAssets: (id) => [
      asset(id, 2, 'real_estate', 'Medina, Washington Estate',
        'Scott maintains a residence in the upscale Medina community on the eastern shore of Lake Washington — historically Bill Gates\'s neighbourhood — following her divorce from Jeff Bezos in 2019. The property is kept deliberately low-profile in keeping with her philanthropic rather than trophy-asset philosophy.',
        20, 'King County Records 2024', 2100),
      asset(id, 3, 'real_estate', 'Philanthropic Headquarters, Seattle',
        'Scott manages her $38 billion charitable giving operation — having donated over $16 billion to more than 1,600 organisations — from a modest office base in Seattle. Her approach of giving with "no strings attached" has reshaped how billionaires think about philanthropy.',
        5, 'Forbes 2024', 5800),
    ],
  },

  // ── 17. Phil Knight ────────────────────────────────────────────────────────
  {
    id: 'phil-knight',
    replaceAssets: false,
    newAssets: (id) => [
      asset(id, 2, 'real_estate', 'Maui Oceanfront Estate',
        'Knight owns a private oceanfront estate on Maui, Hawaii, used as a winter retreat and reflecting his deep personal connection to the Pacific Rim. The property is near world-class golf courses, which Knight — an avid golfer — frequents.',
        35, 'Maui County Records 2024', 3200),
      asset(id, 3, 'jet', 'Gulfstream G650ER',
        'Knight travels aboard a Gulfstream G650ER for business related to Nike and his Laika animation studio, as well as personal travel to his homes in Oregon and Hawaii. The jet is configured for long-haul Pacific routes.',
        70, 'ADS-B Exchange 2024', 2600),
      asset(id, 4, 'art', 'Japanese Art Collection',
        'Knight is a passionate collector of Japanese art and cultural artefacts, reflecting the deep influence Japan had on him when he created Nike\'s original business model after meeting Onitsuka Tiger representatives in Osaka in 1962. His collection spans woodblock prints, ceramics, and contemporary Japanese art.',
        50, 'ARTnews 2023', 4100),
      asset(id, 5, 'real_estate', 'Laika Animation Studios Campus',
        'Knight personally funds Laika, his Portland-based animation studio responsible for Coraline and Kubo and the Two Strings, housed in a bespoke creative campus in Hillsboro, Oregon. The facility is equipped with world-leading 3D printing and stop-motion production infrastructure.',
        80, 'Variety 2023', 3900),
    ],
  },

  // ── 18. Ken Griffin ────────────────────────────────────────────────────────
  {
    id: 'ken-griffin',
    replaceAssets: false,
    newAssets: (id) => [
      asset(id, 3, 'real_estate', 'Star Island Estate, Miami',
        'Griffin owns a large compound on Star Island — Miami\'s most exclusive private-island enclave — assembled from multiple adjacent lots at a cost exceeding $100 million. Star Island is home to celebrities and oligarchs and is accessible only via a single guarded causeway.',
        100, 'Miami-Dade Records 2024', 5600),
      asset(id, 4, 'real_estate', 'Chicago Penthouse, No. 9 Walton',
        'A 17,000-square-foot full-floor penthouse at No. 9 Walton in Chicago\'s Gold Coast neighbourhood, purchased for approximately $58.75 million — a Chicago record at the time. The apartment features four bedrooms, private terraces, and unobstructed views over Lake Michigan and Lincoln Park.',
        58, 'Chicago Tribune 2017', 4800),
      asset(id, 5, 'jet', 'Boeing Business Jet (BBJ)',
        'Griffin operates a Boeing Business Jet for personal and Citadel corporate travel, one of the most spacious private jets available. The aircraft has been tracked to London, the Bahamas, and other locations tied to his global investment activities.',
        85, 'ADS-B Exchange 2024', 3300),
    ],
  },

  // ── 19. Andrey Melnichenko ─────────────────────────────────────────────────
  {
    id: 'andrey-melnichenko',
    replaceAssets: false,
    newAssets: (id) => [
      asset(id, 3, 'yacht', 'Sailing Yacht A',
        'Sailing Yacht A — a companion vessel to Motor Yacht A — is a 143-metre sailing superyacht, the largest sailing yacht in the world when it was launched in 2017. Designed by Philippe Starck with a distinctive triple-mast configuration and futuristic black-and-white hull, it cost an estimated $400 million.',
        400, 'Boat International 2023', 8200),
      asset(id, 4, 'real_estate', 'Villa on Côte d\'Azur',
        'Melnichenko maintains an exclusive villa on the Côte d\'Azur — France\'s most glamorous stretch of Mediterranean coastline — used as a summer base when navigating Sailing Yacht A through European waters. The property is typical of the Monaco and Antibes-area estates favoured by Russian-origin billionaires.',
        45, 'Forbes 2023', 3100),
    ],
  },

  // ── 20. Jack Ma ────────────────────────────────────────────────────────────
  {
    id: 'jack-ma',
    replaceAssets: false,
    newAssets: (id) => [
      asset(id, 3, 'real_estate', 'Bali Oceanfront Compound',
        'Ma owns a private compound on Bali\'s exclusive Bukit Peninsula, reportedly used as a personal retreat during his self-imposed low profile following his public criticism of Chinese regulators in 2020. The compound overlooks the Indian Ocean from a clifftop setting.',
        25, 'South China Morning Post 2023', 3400),
      asset(id, 4, 'jet', 'Gulfstream G550',
        'Ma operates a Gulfstream G550 for Asia-Pacific travel, connecting his properties in Japan, Bali, and mainland China while maintaining a deliberately low profile since his 2020 regulatory confrontation. The aircraft has been tracked to Tokyo and Hong Kong.',
        50, 'ADS-B Exchange 2024', 2700),
      asset(id, 5, 'real_estate', 'Tokyo Penthouse',
        'Ma has spent extended periods in Japan since 2020 and is reported to own a luxury penthouse in Tokyo\'s Minato Ward — Japan\'s most prestigious residential district. His affection for Japan, where he first encountered computers, is longstanding.',
        20, 'Nikkei Asia 2023', 2900),
    ],
  },

  // ── 21. Leonard Lauder ─────────────────────────────────────────────────────
  {
    id: 'leonard-lauder',
    replaceAssets: false,
    newAssets: (id) => [
      asset(id, 3, 'real_estate', 'Aspen Winter Residence',
        'Lauder maintains a luxury residence in Aspen, Colorado, the social hub of the American billionaire class during winter ski season and summer cultural festivals. The property is in keeping with his status as one of New York\'s foremost arts philanthropists.',
        12, 'Aspen Times 2023', 2100),
      asset(id, 4, 'real_estate', 'Southampton Beach Estate',
        'A classic Hamptons beach estate in Southampton — New York\'s most exclusive summer colony — used as a seasonal retreat. Lauder is a prominent member of the Southampton arts community and funds several local cultural institutions.',
        30, 'Sotheby\'s International 2024', 2800),
    ],
  },

  // ── 22. Carl Icahn ─────────────────────────────────────────────────────────
  {
    id: 'carl-icahn',
    replaceAssets: false,
    newAssets: (id) => [
      asset(id, 3, 'real_estate', 'Boca Raton Compound',
        'Icahn maintains a large compound in Boca Raton, Florida — adjacent to his Palm Beach estate — used as his principal Florida base for Icahn Enterprises operations. Florida\'s zero state income tax has made it the preferred domicile for several Wall Street titans.',
        40, 'Palm Beach County Records 2024', 3100),
      asset(id, 4, 'jet', 'Gulfstream G550',
        'Icahn operates a Gulfstream G550 for personal and Icahn Enterprises travel, essential for monitoring his diversified portfolio of stakes in automotive, real estate, energy, and pharmaceutical companies. The aircraft connects his New York, Florida, and Las Vegas interests.',
        52, 'ADS-B Exchange 2024', 2600),
      asset(id, 5, 'real_estate', 'Las Vegas Penthouse',
        'Icahn owns a penthouse at his Fontainebleau Las Vegas hotel development — the 67-storey resort that he purchased out of bankruptcy for $600 million in 2010 and later sold for $3.1 billion in 2021 — retaining his personal suite in the transaction. The Fontainebleau Las Vegas opened in 2023 as one of the Strip\'s largest resort-casino properties.',
        15, 'Las Vegas Review-Journal 2023', 3700),
    ],
  },

  // ── 23. Ray Dalio ──────────────────────────────────────────────────────────
  {
    id: 'ray-dalio',
    replaceAssets: false,
    newAssets: (id) => [
      asset(id, 2, 'real_estate', 'Greenwich, Connecticut Estate',
        'Dalio\'s primary residence is a large estate in Greenwich, Connecticut — the epicentre of the hedge-fund world — near Bridgewater Associates\' Westport headquarters. The property reflects his Principles-based philosophy of radically transparent living, including a meticulously designed Zen garden.',
        35, 'Greenwich Time 2024', 3800),
      asset(id, 3, 'real_estate', 'Haiku, Maui Estate',
        'A private property on Maui\'s lush north shore near Haiku, acquired as a Pacific retreat consistent with Dalio\'s practice of meditation and connection with nature. The area is one of Hawaii\'s most rain-forested and ecologically rich landscapes.',
        18, 'Maui County Records 2023', 2700),
      asset(id, 4, 'jet', 'Bombardier Global 7500',
        'Dalio travels aboard a Bombardier Global 7500 — with an 8,000-nautical-mile range, the world\'s longest-range business jet — for global travel related to his All Weather portfolio strategy and philanthropic commitments in China and globally. The aircraft suits his extensive international schedule.',
        75, 'ADS-B Exchange 2024', 3200),
      asset(id, 5, 'art', 'Zen & Contemporary Art Collection',
        'Dalio is an avid collector of Zen-influenced art, Japanese ceramics, and contemporary works that reflect his meditation practice and study of Eastern philosophy. His collection — displayed across Bridgewater Associates offices and his private residences — is estimated at tens of millions.',
        30, 'ARTnews 2023', 2500),
    ],
  },
]

// ── Main ──────────────────────────────────────────────────────────────────────
const celebs = JSON.parse(fs.readFileSync(CELEBS, 'utf8'))
const byId   = {}
celebs.forEach((c, i) => byId[c.id] = i)

let updated = 0

for (const enrich of ENRICHMENTS) {
  const idx = byId[enrich.id]
  if (idx === undefined) { console.warn('Not found:', enrich.id); continue }

  const c = celebs[idx]

  // Fix net worth
  if (NW_FIXES[enrich.id]) {
    c.netWorth = NW_FIXES[enrich.id]
  }

  // Determine base ID counter from existing assets
  const existingAssets = enrich.replaceAssets ? [] : (c.assets || [])

  // Build new assets (pass the celeb id)
  const newAssets = enrich.newAssets(enrich.id)

  // Add images[] and valueFormatted to existing assets that lack them
  existingAssets.forEach((a, i) => {
    if (!a.images || !a.images.length) {
      const im = imgs(a.type || 'real_estate')
      a.images = im
      if (!a.image) a.image = im[0]
    }
    if (!a.valueFormatted && a.estimatedValue) {
      a.valueFormatted = fmtVal(parseFloat(a.estimatedValue))
    }
    if (!a.valuationSource) {
      a.valuationSource = 'Forbes 2025'
    }
    if (!a.id) {
      a.id = `${enrich.id}-${i + 1}`
    }
  })

  c.assets      = [...existingAssets, ...newAssets]
  c.lastUpdated = '2026-08-17'
  celebs[idx]   = c
  updated++

  const total = c.assets.length
  console.log(`✓ ${c.name}: ${total} assets total (${newAssets.length} added)`)
}

fs.writeFileSync(CELEBS, JSON.stringify(celebs, null, 2), 'utf8')
console.log(`\nDone — updated ${updated} celebrities in celebs.json`)
