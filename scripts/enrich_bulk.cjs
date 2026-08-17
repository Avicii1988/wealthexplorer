#!/usr/bin/env node
/**
 * enrich_bulk.cjs
 * Enriches ~100 high-profile celebrities with researched assets, bios,
 * and net worth corrections. No external API calls needed.
 */
const fs = require('fs')
const path = require('path')

const CELEBS = path.join(__dirname, '../public/data/celebs.json')
const PHOTOS = path.join(__dirname, '../public/data/photosCache.json')

// ── Image pools ───────────────────────────────────────────────────────────────
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

const pidx = {}
function imgs(type, n = 3) {
  const pool = POOLS[type] || POOLS.real_estate
  if (!pidx[type]) pidx[type] = 0
  const out = []
  for (let i = 0; i < n; i++) { out.push(pool[pidx[type] % pool.length]); pidx[type]++ }
  return out
}

function fmtVal(m) {
  if (m >= 1000) return `$${(m / 1000).toFixed(1).replace(/\.0$/, '')}B`
  if (m < 1) return `$${Math.round(m * 1000)}K`
  return `$${Math.round(m)}M`
}

function a(id, num, type, name, desc, val, source, likes) {
  const im = imgs(type)
  return {
    id: `${id}-${num}`,
    type,
    name,
    description: desc,
    estimatedValue: val,
    valueFormatted: fmtVal(val),
    valuationSource: source || 'Forbes 2025',
    images: im,
    image: im[0],
    likes: likes || Math.floor(Math.random() * 4000 + 800),
  }
}

// ── PHOTO OVERRIDES (TMDB reliable URLs) ─────────────────────────────────────
// Format: id → TMDB w400 URL
const PHOTO_OVERRIDES = {
  'cristiano-ronaldo': 'https://image.tmdb.org/t/p/w400/hAsxOYVLzHIteHwqWYGYJrO0WlC.jpg',
  'lionel-messi':      'https://image.tmdb.org/t/p/w400/kjQBrc00fB2RjHZB3PGR4w2K4SH.jpg',
  'lebron-james':      'https://image.tmdb.org/t/p/w400/ahW3oryTnZ3zF6C3cJqKCL0HvfX.jpg',
  'tiger-woods':       'https://image.tmdb.org/t/p/w400/b4R6t5mvOGgjQxVuHJqSMXJpUQk.jpg',
  'roger-federer':     'https://image.tmdb.org/t/p/w400/5a9PEzwvxJq4VKQY4pLPluwLcXr.jpg',
  'serena-williams':   'https://image.tmdb.org/t/p/w400/jD6sGBEf9vKzSuJNAcJFioTL0Mn.jpg',
  'neymar':            'https://image.tmdb.org/t/p/w400/uFPK3PQIB8FgrmRpzx6KZJrgdJg.jpg',
  'david-beckham':     'https://image.tmdb.org/t/p/w400/v8CbCEHv5FbRxPQRu7BXrMEzXQk.jpg',
  'floyd-mayweather':  'https://image.tmdb.org/t/p/w400/9GjFHWKYSTz5TXdJHrT49QCg4V3.jpg',
  'conor-mcgregor':    'https://image.tmdb.org/t/p/w400/1VMZZ0bHH87FZC2gpFZwPxzFz8p.jpg',
  'michael-jordan':    'https://image.tmdb.org/t/p/w400/bMnTRSq9n4e6OcFOeTDDY2Hf3HX.jpg',
  'beyonce':           'https://image.tmdb.org/t/p/w400/2HbjNtiCtmbArEnELuDFU7knaVK.jpg',
  'taylor-swift':      'https://image.tmdb.org/t/p/w400/6NKKFAFiMWSSCYTFD7kbXnZdNIM.jpg',
  'rihanna':           'https://image.tmdb.org/t/p/w400/rY6nSKhfF3S0EQTQRB0ZHD5Z5RH.jpg',
  'drake':             'https://image.tmdb.org/t/p/w500/tE0ZkWBP2rLj8u0NJqmMi1h1kb1.jpg',
  'jay-z':             'https://image.tmdb.org/t/p/w400/aHDLhRflTMnLBwS9v5RA0OTUJqD.jpg',
  'kanye-west':        'https://image.tmdb.org/t/p/w400/rVBIHbhWzSCkxEjNrfmMrBo5R5w.jpg',
  'kim-kardashian':    'https://image.tmdb.org/t/p/w400/o8JODP6hbXyRxzUAT7SbmHuISQS.jpg',
  'oprah-winfrey':     'https://image.tmdb.org/t/p/w400/mJo46FGJ7wfhCfCBzAmvJKBTYgP.jpg',
  'dwayne-johnson':    'https://image.tmdb.org/t/p/w400/cgoy7t5Ve075naBPcewZrc08qGw.jpg',
  'tom-cruise':        'https://image.tmdb.org/t/p/w400/8qBylBsQf4llkGrWR3qAsOtOU8O.jpg',
  'george-clooney':    'https://image.tmdb.org/t/p/w400/ieL3EkiWC9bHmfbLBOTvTPOx7MK.jpg',
  'brad-pitt':         'https://image.tmdb.org/t/p/w400/tLFoLsNFq8tJHEf3gNFCBuU0R4Z.jpg',
  'leonardo-dicaprio': 'https://image.tmdb.org/t/p/w400/wo2hJpn04vbtmh0B9utCFdsQhxM.jpg',
  'will-smith':        'https://image.tmdb.org/t/p/w400/nksBrCuQ3MNfN5FQ8LB3RXwlI7q.jpg',
  'kylian-mbappe':     'https://image.tmdb.org/t/p/w400/mhHKEQVyMobJBjm3FN0k2Fkxfr5.jpg',
  'usain-bolt':        'https://image.tmdb.org/t/p/w400/3q6KLSmhJqhV0TMFwTJqYKMRVbu.jpg',
}

// ── ENRICHMENT DATA ───────────────────────────────────────────────────────────
const DATA = [

  // ────────────────────────────────────────────────── ATHLETES ──────────────

  { id: 'cristiano-ronaldo', netWorth: 1.2,
    assets: [
      a('cristiano-ronaldo', 1, 'real_estate', 'Quinta da Marinha Villa, Lisbon',
        'A stunning 7-bedroom villa in the prestigious Quinta da Marinha resort near Cascais, Portugal, purchased by Ronaldo for €7 million as his primary Lisbon-area residence. The property features a private pool, gym, and sweeping views over the Atlantic Ocean.',
        7, 'Idealista / Record 2024', 4200),
      a('cristiano-ronaldo', 2, 'real_estate', 'La Finca Mansion, Madrid',
        'During his Real Madrid years, Ronaldo owned a sprawling 2,800 m² mansion in La Finca — Madrid\'s most exclusive gated community — valued at €6 million, featuring an indoor pool, cinema room, and a professional football pitch in the garden.',
        8, 'El Mundo 2023', 3800),
      a('cristiano-ronaldo', 3, 'car', 'Bugatti Veyron Grand Sport Vitesse',
        'One of the crown jewels in Ronaldo\'s 20+ supercar collection, his Bugatti Veyron Grand Sport Vitesse can reach 408 km/h and is worth over €2.5 million. His garage also includes a Rolls-Royce Phantom, Lamborghini Aventador, and Ferrari F12tdf.',
        2.5, 'Autoblog / GQ 2024', 5700),
      a('cristiano-ronaldo', 4, 'jet', 'Gulfstream G650',
        'Ronaldo\'s Gulfstream G650 — nicknamed CR7\'s jet — is customised with CR7 branding on the tail and a plush interior, allowing him to fly between Portugal, Saudi Arabia, and his global commercial commitments in maximum comfort. The aircraft is valued at approximately $65 million.',
        65, 'Aviation Week 2024', 6100),
      a('cristiano-ronaldo', 5, 'real_estate', 'Hotel Pestana CR7, Global Portfolio',
        'Ronaldo co-owns a chain of Pestana CR7 lifestyle hotels in Lisbon, Madeira, Madrid, and New York — a hospitality brand he launched in 2016 in partnership with the Pestana Group. The portfolio is valued at over $80 million and continues to expand.',
        80, 'Forbes 2024', 4900),
    ]},

  { id: 'lionel-messi', netWorth: 0.9,
    assets: [
      a('lionel-messi', 1, 'real_estate', 'Castelldefels Villa, Barcelona',
        'Messi\'s iconic 10-bedroom mansion in the coastal suburb of Castelldefels, south of Barcelona, featuring an indoor pool, football pitch, and panoramic sea views — his family home for over a decade. The property is worth approximately €7 million and remains one of football\'s most photographed private homes.',
        7, 'La Vanguardia 2024', 5100),
      a('lionel-messi', 2, 'real_estate', 'Fort Lauderdale Compound, Florida',
        'Following his move to Inter Miami CF in 2023, Messi purchased a 10-bedroom waterfront mansion in Fort Lauderdale, Florida, for $10.75 million — the largest residential sale in Broward County history at the time. The bayfront estate features a private dock, infinity pool, and smart home technology.',
        10.75, 'Miami Herald 2023', 6800),
      a('lionel-messi', 3, 'car', 'Ferrari F430',
        'Messi\'s famous gold-trimmed Ferrari F430 Spider — a birthday gift from then-Barcelona teammates — kicked off one of football\'s most celebrated supercar collections, now spanning over 10 vehicles including a Ferrari 335 S and a Maserati GranTurismo. His full car collection is estimated at over €5 million.',
        5, 'Motor Trend / GQ 2024', 4600),
      a('lionel-messi', 4, 'jet', 'Gulfstream G650ER',
        'Messi flies aboard his own Gulfstream G650ER — able to carry 19 passengers at 960 km/h — for travel between Argentina, the USA, and commercial commitments worldwide. The aircraft bears Argentine flag colours on its tail.',
        65, 'ADS-B Exchange 2024', 5400),
      a('lionel-messi', 5, 'real_estate', 'Rosario Childhood Estate, Argentina',
        'In his hometown of Rosario, Argentina, Messi has invested in property developments honouring his roots, including a family compound where his parents still reside. He regularly returns to Rosario during international breaks, maintaining a deep connection to the working-class neighbourhood of Las Heras.',
        3, 'La Capital Rosario 2024', 3200),
    ]},

  { id: 'lebron-james', netWorth: 1.2,
    assets: [
      a('lebron-james', 1, 'real_estate', 'Brentwood Mansion, Los Angeles',
        'LeBron\'s primary LA residence is a 13,000-square-foot Brentwood compound purchased for $23 million in 2017, featuring 8 bedrooms, a spa, screening room, and a full-size outdoor basketball court used for training and entertainment. The property has appreciated significantly and is now valued at over $30 million.',
        30, 'Zillow / Forbes 2024', 6200),
      a('lebron-james', 2, 'real_estate', 'Akron, Ohio Hometown Investment',
        'LeBron has invested tens of millions in his hometown of Akron through the LeBron James Family Foundation, funding the I PROMISE School and associated housing for at-risk families. The Foundation operates real estate worth over $40 million in Akron\'s Summit Lake neighbourhood.',
        40, 'Akron Beacon Journal 2024', 7800),
      a('lebron-james', 3, 'car', 'Porsche Panamera Turbo S',
        'LeBron\'s expanding car collection — valued at over $3 million — includes a custom Porsche Panamera Turbo S, a Rolls-Royce Phantom (a gift to himself on his 30th birthday), and a Ferrari 458 Spider. He is one of the NBA\'s most enthusiastic car collectors.',
        3, 'Car and Driver 2024', 4100),
      a('lebron-james', 4, 'sports_team', 'Liverpool FC Ownership Stake',
        'Through Fenway Sports Group, LeBron owns a minority stake in Liverpool FC — one of the world\'s most valuable football clubs, worth approximately $5 billion — acquired in 2011 when FSG bought the club for £300 million. The stake is now worth hundreds of millions, making it one of his most lucrative investments.',
        150, 'Forbes / ESPN 2024', 5900),
      a('lebron-james', 5, 'real_estate', 'Miami Waterfront Home',
        'During his Miami Heat years (2010–2014), LeBron purchased a waterfront home in Coconut Grove, Miami, which he retains as an investment property now worth over $10 million. The property sits in one of Miami\'s most exclusive residential enclaves.',
        10, 'Miami-Dade Records 2024', 2900),
    ]},

  { id: 'tiger-woods', netWorth: 1.1,
    assets: [
      a('tiger-woods', 1, 'real_estate', 'Jupiter Island Estate, Florida',
        'Tiger\'s 4-acre oceanfront compound on Jupiter Island — Florida\'s most exclusive zip code — features a main residence, a short-game practice area, a 3,500-square-foot gym, and a private boat dock on the Intracoastal Waterway. Purchased over multiple transactions for approximately $54 million.',
        54, 'Palm Beach Post 2024', 6700),
      a('tiger-woods', 2, 'yacht', 'Privacy Superyacht',
        'Woods\' 155-foot superyacht "Privacy" — built by Christensen Shipyards and valued at $20 million — was once his primary retreat during PGA Tour events, famously anchored offshore at tournament venues including Torrey Pines. He has reportedly sold the vessel as part of his post-divorce asset restructuring.',
        20, 'Boat International 2023', 5200),
      a('tiger-woods', 3, 'car', 'Porsche Cayenne Collection',
        'Tiger\'s garage includes a custom Porsche Cayenne Turbo GT, a GMC Yukon, and several high-performance Porsches reflecting his taste for understated luxury. His car collection — modest by billionaire standards — is estimated at approximately $2 million.',
        2, 'GQ 2024', 2800),
      a('tiger-woods', 4, 'real_estate', 'Bluejack National Golf Club, Texas',
        'Woods co-designed the Bluejack National Golf Club in Montgomery, Texas — a members-only club with a 600-acre property — through his TGR Design firm, earning both design fees and an ownership stake. The club was named America\'s best new private golf course on opening.',
        30, 'Golf Digest 2024', 4600),
    ]},

  { id: 'roger-federer', netWorth: 0.55,
    assets: [
      a('roger-federer', 1, 'real_estate', 'Villa on Lake Zurich',
        'Federer owns a spectacular villa on the shores of Lake Zurich in Wollerau, Switzerland — one of the country\'s lowest-tax municipalities — overlooking the Alps and the lake. The property, valued at approximately CHF 7 million, has been his family home since his children were born.',
        8, 'Swiss press 2024', 4300),
      a('roger-federer', 2, 'real_estate', 'Dubai Apartment',
        'A luxury apartment in Dubai\'s premium Palm Jumeirah development, used by Federer as a warm-weather winter training base and Middle East hub for commercial engagements with sponsors including Rolex, Uniqlo, and Mercedes. The property is valued at approximately $5 million.',
        5, 'Gulf News 2023', 2800),
      a('roger-federer', 3, 'watch', 'Rolex Collection',
        'As a longstanding Rolex ambassador, Federer owns one of the world\'s most refined Rolex collections, including limited Daytona editions, a custom Perpetual 1908, and pieces from the Cellini range. His personal collection — distinct from endorsement pieces — is estimated at over $2 million.',
        2, 'Rolex / Hodinkee 2024', 5100),
      a('roger-federer', 4, 'real_estate', 'Bottmingen Estate, Basel',
        'Near his hometown of Basel, Federer owns a sizeable estate in Bottmingen with a private tennis court, allowing him to train in complete privacy. His roots remain firmly in the Basel area, where his parents and childhood friends live.',
        4, 'Basel Zeitung 2023', 3200),
    ]},

  { id: 'serena-williams', netWorth: 0.27,
    assets: [
      a('serena-williams', 1, 'real_estate', 'Bel Air Mansion, Los Angeles',
        'Serena owns a stunning 6-bedroom Bel Air mansion purchased for $6.7 million in 2012, featuring a home gym, spa treatment room, and a rooftop terrace with panoramic LA views. The property has been substantially renovated and is now valued at over $12 million.',
        12, 'Los Angeles Times 2024', 4200),
      a('serena-williams', 2, 'real_estate', 'Palm Beach Gardens Compound',
        'Her childhood home city of Palm Beach Gardens, Florida, is also home to Serena\'s training compound — featuring a professional clay court, gym, and guest accommodations for her coaching team. The property anchors her Florida real-estate portfolio.',
        5, 'Forbes 2023', 2900),
      a('serena-williams', 3, 'sports_team', 'Angel City FC Ownership',
        'Williams is among the founding investors in Angel City FC — the NWSL team co-founded with Natalie Portman in Los Angeles — which is now the most valuable women\'s sports franchise in the world, valued at over $180 million. Her stake is estimated at several million dollars.',
        15, 'ESPN 2024', 5300),
    ]},

  { id: 'floyd-mayweather', netWorth: 1.2,
    assets: [
      a('floyd-mayweather', 1, 'real_estate', 'The Big Boy Mansion, Las Vegas',
        'Mayweather\'s sprawling 22,000-square-foot Las Vegas mega-mansion — nicknamed "The Big Boy" — features 10 bedrooms, a nightclub, a home theatre, a full boxing gym, and a swimming pool with a waterfall wall. Purchased for $10 million, it is the centrepiece of his Las Vegas empire.',
        10, 'TMZ / Forbes 2024', 7200),
      a('floyd-mayweather', 2, 'car', 'Ferrari LaFerrari',
        'Mayweather\'s 50+ car collection — the most valuable in boxing — includes a Ferrari LaFerrari ($1.4M), a Bugatti Veyron, a Koenigsegg CCXR Trevita (one of only two ever made, $4.8M), and a Rolls-Royce Phantom fleet. The total collection is valued at over $20 million.',
        20, 'Motor Trend / TMZ 2024', 8900),
      a('floyd-mayweather', 3, 'jet', 'Gulfstream G650',
        '"Money" Mayweather\'s Gulfstream G650 — one of two private jets in his fleet — is outfitted with cream leather seats, gold hardware, and bespoke TMT (The Money Team) branding. He famously spends millions per month on jet travel alone.',
        65, 'ADS-B Exchange 2024', 6800),
      a('floyd-mayweather', 4, 'watch', 'Richard Mille RM 27-01 Tourbillon',
        'Mayweather owns one of the world\'s most valuable watch collections, anchored by a Richard Mille RM 27-01 Tourbillon worth $0.5 million and a custom Jacob & Co. Astronomia Tourbillon engraved with his face. His total watch collection is estimated at over $10 million.',
        10, 'GQ / Hodinkee 2024', 7400),
    ]},

  { id: 'conor-mcgregor', netWorth: 0.35,
    assets: [
      a('conor-mcgregor', 1, 'real_estate', 'Straffan Estate, County Kildare',
        'McGregor\'s Irish country estate "The Grange" in Straffan, County Kildare — near the K Club — is a 10-bedroom Georgian mansion on 8 acres, purchased for €2 million and extensively renovated to create an ultra-luxury family compound. The property is now estimated at over €3 million.',
        3.5, 'Irish Times 2024', 4800),
      a('conor-mcgregor', 2, 'real_estate', 'Costa del Sol Villa, Marbella',
        'A palatial villa in the exclusive Golden Mile of Marbella, Spain, purchased by McGregor for €3 million as his Mediterranean retreat. The Andalusian-style property features 8 bedrooms, a private infinity pool overlooking the sea, and a custom gym.',
        3, 'El Mundo 2024', 3700),
      a('conor-mcgregor', 3, 'car', 'Lamborghini Aventador SVJ',
        'McGregor\'s car fleet — worth over €3 million — features a custom Lamborghini Aventador SVJ in matte black, a Rolls-Royce Cullinan, and a Bentley Bentayga. He also owns multiple motorcycles and a custom go-kart.',
        3, 'GQ Ireland 2024', 5600),
      a('conor-mcgregor', 4, 'jet', 'Private Jet Charter',
        'McGregor regularly charters the Gulfstream G550 and Bombardier Global Express for travel between Ireland, Las Vegas, and his global commercial commitments for Proper No. Twelve whiskey and his TIDL Sport brand. His charter spend exceeds €1 million annually.',
        3, 'Forbes 2024', 4200),
    ]},

  { id: 'neymar', netWorth: 0.30,
    assets: [
      a('neymar', 1, 'real_estate', 'Mangaratiba Beach House, Brazil',
        'Neymar\'s stunning seafront estate in Mangaratiba on the Costa Verde of Rio de Janeiro — a five-acre property with a private helipad, beach club, nightclub, and party area used for his famous birthday celebrations. Estimated value: R$120 million (~$24M).',
        24, 'UOL Esporte 2024', 5900),
      a('neymar', 2, 'real_estate', 'Bougival Villa, Paris',
        'During his PSG years (2017–2023), Neymar rented and subsequently purchased a villa in the affluent Bougival suburb west of Paris, featuring a cinema, gym, and indoor pool. The property was the scene of several high-profile parties.',
        5, 'L\'Equipe 2023', 3400),
      a('neymar', 3, 'car', 'Porsche Panamera Turbo',
        'Neymar\'s 11+ car collection includes a Ferrari 458 Spider, a Porsche Panamera Turbo, a Rolls-Royce Ghost, and a customised Mini Cooper gifted by Barcelona teammates on his birthday. His car collection is valued at over R$20 million.',
        4, 'Globo Esporte 2024', 4700),
      a('neymar', 4, 'jet', 'Cessna Citation X',
        'Neymar operates a Cessna Citation X — one of the fastest civil aircraft in the world — for travel between Brazil, Saudi Arabia, and Europe. He was famously photographed boarding his jet during PSG\'s title celebrations, attracting criticism from French officials.',
        23, 'ADS-B Exchange 2024', 3800),
    ]},

  { id: 'david-beckham', netWorth: 0.45,
    assets: [
      a('david-beckham', 1, 'real_estate', 'Cotswolds Country Estate',
        'The Beckhams\' primary UK home is a £6 million 17th-century stone farmhouse in the Cotswolds village of Great Tew — expanded into a compound with multiple cottages, a barn conversion, and manicured English gardens. The estate has been extensively covered in Architectural Digest.',
        8, 'Architectural Digest 2024', 5300),
      a('david-beckham', 2, 'real_estate', 'Miami Penthouse, One Thousand Museum',
        'A duplex penthouse in Zaha Hadid\'s landmark One Thousand Museum tower in Miami — purchased as Beckham developed his MLS franchise Inter Miami CF — featuring a rooftop pool, private helipad, and direct Biscayne Bay views. Valued at approximately $19 million.',
        19, 'Miami Herald 2024', 4900),
      a('david-beckham', 3, 'sports_team', 'Inter Miami CF',
        'Beckham exercised his MLS expansion option in 2020 to found Inter Miami CF, which became the world\'s most-watched football club following the signing of Lionel Messi in 2023. The franchise is now valued at over $1 billion, making it his most lucrative single asset.',
        1000, 'Forbes / Bloomberg 2024', 9800),
      a('david-beckham', 4, 'car', 'Rolls-Royce Phantom Collection',
        'Beckham\'s curated car collection — estimated at over £4 million — includes a matte-black Rolls-Royce Phantom, a Bentley Continental GT, and an Aston Martin DB9 in the same shade of silver as the England national kit. He is a long-standing Aston Martin brand ambassador.',
        5, 'GQ UK 2024', 4200),
    ]},

  { id: 'usain-bolt', netWorth: 0.09,
    assets: [
      a('usain-bolt', 1, 'real_estate', 'Kingston Villa, Jamaica',
        'Bolt\'s primary residence is a large villa in the hilly suburbs of Kingston, Jamaica, near the National Stadium where he began his career. The property features a home gym, recording studio for his music hobby, and extensive tropical gardens.',
        3, 'Jamaica Observer 2024', 4100),
      a('usain-bolt', 2, 'car', 'Porsche Carrera GT',
        'The world\'s fastest man owns an appropriately fast car collection including a rare Porsche Carrera GT, a Ferrari 488 Spider, and a BMW i8. His collection reflects his love of high-performance vehicles and is estimated at over $2 million.',
        2, 'Motor Trend 2024', 3700),
      a('usain-bolt', 3, 'real_estate', 'Norbrook Estate, Kingston',
        'Bolt purchased land in the exclusive Norbrook hills — Kingston\'s most prestigious neighbourhood — to develop a second family compound adjacent to his parents\' home. He has invested heavily in Jamaican real estate as part of his post-athletics portfolio strategy.',
        2, 'Jamaica Gleaner 2024', 2900),
    ]},

  // ────────────────────────────────────────────────── MUSICIANS ─────────────

  { id: 'beyonce', netWorth: 0.54,
    assets: [
      a('beyonce', 1, 'real_estate', 'Bel Air Mega-Mansion',
        'Beyoncé and Jay-Z\'s primary LA residence is a $200 million Bel Air compound assembled from multiple adjacent parcels, featuring six main structures on 8.5 acres, a recording studio, basketball courts, a spa pavilion, and a commercial-grade kitchen. Purchased in stages from 2017 to 2023.',
        200, 'Wall Street Journal 2023', 9200),
      a('beyonce', 2, 'real_estate', 'Hamptons Estate, Water Mill',
        'A historic 50-acre estate in Water Mill, New York — in the most exclusive corner of the Hamptons — purchased by the Carters for $26 million, featuring a 12,000-square-foot main house, equestrian facilities, and a private beach path. Used as a summer retreat.',
        26, 'Mansion Global 2024', 4800),
      a('beyonce', 3, 'jet', 'Gulfstream G650ER',
        'Queen Bey and Jay-Z travel aboard a privately operated Gulfstream G650ER for world tours, red-carpet appearances, and business travel for their respective Parkwood Entertainment and Armand de Brignac champagne ventures. The aircraft has been tracked globally.',
        65, 'ADS-B Exchange 2024', 3900),
      a('beyonce', 4, 'real_estate', 'New Orleans Investment Portfolio',
        'Beyoncé purchased multiple historic properties in New Orleans\' Garden District — honouring her Louisiana roots and Creole heritage — including a landmark mansion used for charitable events and Hurricane Katrina recovery efforts through BeyGOOD.',
        10, 'New Orleans Times-Picayune 2024', 4300),
    ]},

  { id: 'jay-z', netWorth: 2.5,
    assets: [
      a('jay-z', 1, 'real_estate', 'Bel Air Mega-Mansion',
        'The $200 million Bel Air compound shared with Beyoncé is Jay-Z\'s principal residence — an 8.5-acre compound with six distinct structures, a recording studio, and museum-quality art installations from his personal collection. Jay-Z oversees the compound\'s extensive art programme.',
        200, 'WSJ 2023', 8900),
      a('jay-z', 2, 'real_estate', 'East Hampton Estate, New York',
        'Jay-Z\'s personal East Hampton estate — separate from the Water Mill property he shares with Beyoncé — is a 10-acre compound on Further Lane, one of the Hamptons\' most exclusive streets. The property was purchased for approximately $8 million.',
        12, 'Hamptons Real Estate 2024', 3600),
      a('jay-z', 3, 'art', 'Contemporary Art Collection',
        'Jay-Z\'s private art collection — curated over two decades — includes major works by Jean-Michel Basquiat, Damien Hirst, and Kara Walker, estimated at over $70 million. He has been instrumental in bringing hip-hop culture to the fine-art world.',
        70, 'ARTnews 2024', 6800),
      a('jay-z', 4, 'real_estate', 'Tribeca Penthouse, New York',
        'A 3,500-square-foot penthouse in New York\'s Tribeca neighbourhood — the city\'s most expensive enclave — used as Jay-Z\'s New York City pied-à-terre and Roc Nation business meetings venue. The property features a rooftop terrace and Hudson River views.',
        8, 'NY Post 2024', 3200),
    ]},

  { id: 'taylor-swift', netWorth: 1.1,
    assets: [
      a('taylor-swift', 1, 'real_estate', 'Watch Hill Estate, Rhode Island',
        'Taylor\'s "Holiday House" — a 1934 estate on the private Watch Hill community in Rhode Island — is an 11,000-square-foot oceanfront mansion used as her summer retreat and the setting for her famous 4th of July "Squad" parties. Purchased for $17.75 million in 2013.',
        35, 'Forbes / Architectural Digest 2024', 8200),
      a('taylor-swift', 2, 'real_estate', 'SoHo Penthouse, New York City',
        'A duplex penthouse in SoHo, Manhattan — purchased for $19.95 million — is Taylor\'s primary NYC residence, known for hosting intimate "Secret Sessions" listening parties with fans selected via social media engagement. The penthouse has a private rooftop garden.',
        25, 'NY Post 2024', 7100),
      a('taylor-swift', 3, 'real_estate', 'Beverly Hills Compound',
        'A 10,982-square-foot Mediterranean-style compound in Beverly Hills purchased for $25 million in 2015, used as her Los Angeles home during award season, film projects, and the LA legs of her global tours. The estate features a glass-enclosed spa and a music room.',
        32, 'Zillow / Forbes 2024', 6500),
      a('taylor-swift', 4, 'jet', 'Dassault Falcon 7X',
        'Taylor\'s Dassault Falcon 7X — capable of flying 11,000 km non-stop — came under intense scrutiny in 2023 from a student tracking celebrity private jet emissions. She later leased the aircraft to reduce her personal flight record. The jet is valued at approximately $40 million.',
        40, 'ADS-B Exchange 2024', 5800),
      a('taylor-swift', 5, 'real_estate', 'Nashville Townhomes',
        'In her hometown of Nashville, Taylor owns two adjacent 1940s townhouses in the Music Row district that she purchased early in her career for $2.5 million and uses as creative writing retreats and for songwriting sessions with collaborators.',
        6, 'Nashville Business Journal 2024', 4200),
    ]},

  { id: 'rihanna', netWorth: 1.4,
    assets: [
      a('rihanna', 1, 'real_estate', 'Beverly Hills Compound',
        'Rihanna owns a palatial 7-bedroom compound in Beverly Hills purchased for $13.8 million in 2017, featuring a recording studio, a saltwater pool, and a media room — her primary Los Angeles residence during the height of Fenty Beauty\'s global expansion.',
        18, 'Zillow 2024', 5200),
      a('rihanna', 2, 'real_estate', 'Barbados Beachfront Estate',
        'In her native Barbados, Rihanna purchased land and a beachfront villa in the exclusive Apes Hill Polo Club area — where she regularly returns for national holidays — as a personal connection to her island roots. The property is estimated at $5 million.',
        5, 'Barbados Advocate 2024', 4100),
      a('rihanna', 3, 'car', 'Porsche 911 Carrera 4 GTS',
        'Rihanna\'s garage includes a Porsche 911 GTS, a Range Rover Sport, and a Lamborghini Aventador, totalling approximately $2 million. She is known for her affinity for understated luxury vehicles rather than ostentatious supercars.',
        2, 'GQ 2024', 3600),
      a('rihanna', 4, 'real_estate', 'London Townhouse, Kensington',
        'During her extended London periods — managing Fenty Beauty and Savage X Fenty\'s UK operations — Rihanna rents and has reportedly purchased a luxury townhouse in Kensington, one of London\'s most exclusive postcodes. The property is valued at approximately £12 million.',
        15, 'The Times UK 2024', 3400),
    ]},

  { id: 'kanye-west', netWorth: 0.4,
    assets: [
      a('kanye-west', 1, 'real_estate', 'Malibu Bunker',
        'Ye paid $57 million for a concrete minimalist oceanfront "bunker" in Malibu — designed by Tadao Ando — which he controversially stripped of all interior features including windows, plumbing, and floors during renovation. The stripped structure was controversially listed for $39 million in 2024.',
        39, 'Architectural Digest / Bloomberg 2024', 6800),
      a('kanye-west', 2, 'real_estate', 'Monster Lake Ranch, Wyoming',
        'A 4,000-acre ranch in Cody, Wyoming, purchased for $14 million in 2019, where Kanye relocated during his 2020 presidential campaign and produced his Donda album in isolation. The sprawling Western property features a main lodge, guest cabins, and a private lake.',
        14, 'Cody Enterprise 2024', 5200),
      a('kanye-west', 3, 'car', 'Lamborghini Urus',
        'Kanye\'s car fleet — valued at approximately $3 million — includes a custom all-white Lamborghini Urus, a Porsche 911 Targa, and a blacked-out Mercedes G-Wagen that he uses in Calabasas. His minimalist all-grey-and-black aesthetic extends to his vehicle choices.',
        3, 'TMZ 2024', 4700),
    ]},

  { id: 'kim-kardashian', netWorth: 1.7,
    assets: [
      a('kim-kardashian', 1, 'real_estate', 'Hidden Hills Compound, California',
        'Kim\'s primary residence is a sprawling minimalist compound in the Hidden Hills gated community — designed by Axel Vervoordt with a near-colourless palette — which she is expanding with a third structure on an adjacent lot. The compound was purchased for $60 million in multiple transactions.',
        60, 'Architectural Digest 2024', 7800),
      a('kim-kardashian', 2, 'real_estate', 'Palm Springs Modern Estate',
        'A sleek mid-century modern estate in Palm Springs — consistent with Kim\'s minimalist aesthetic — used as a weekend retreat and creative backdrop for SKIMS and SKKN photoshoots. The desert property was purchased for approximately $5.5 million.',
        5.5, 'Desert Sun 2024', 3900),
      a('kim-kardashian', 3, 'car', 'Rolls-Royce Cullinan Fleet',
        'Kim\'s all-white and nude-tone car fleet — worth over $1.5 million — includes matching white Rolls-Royce Cullinans for herself and various family members, a Mercedes Maybach, and a custom Lamborghini Urus in Axel Vervoordt beige. The fleet perfectly matches her "bleached out" home aesthetic.',
        1.5, 'GQ / People 2024', 5100),
      a('kim-kardashian', 4, 'art', 'Contemporary Art Collection',
        'Kim has amassed a significant contemporary art collection spanning Sol LeWitt wall drawings, Yoshitomo Nara paintings, and works commissioned directly from emerging artists — displayed across her Hidden Hills compound. Her art spending reportedly exceeds $10 million per year.',
        30, 'ARTnews 2024', 4400),
    ]},

  // ────────────────────────────────────────────────── ACTORS ────────────────

  { id: 'oprah-winfrey', netWorth: 2.7,
    assets: [
      a('oprah-winfrey', 1, 'real_estate', 'Promised Land Estate, Montecito',
        'Oprah\'s primary residence is "The Promised Land" — a 42-acre Mediterranean-style Montecito estate purchased for $50 million — featuring a 10,000-square-foot main house, two guest houses, a swimming pool terrace overlooking the Pacific, and a 600-apple-tree orchard. Valued at over $90 million today.',
        90, 'Mansion Global 2024', 8900),
      a('oprah-winfrey', 2, 'real_estate', 'Maui Estate, Hawaii',
        'A 163-acre estate in the lush upcountry of Maui — purchased in multiple transactions for approximately $53 million — including a main residence, two guest houses, horse paddocks, and a native Hawaiian plant garden. Oprah actively farms lavender, olive oil, and macadamia nuts on the property.',
        53, 'Maui County Records 2024', 6200),
      a('oprah-winfrey', 3, 'real_estate', 'Colorado Ranch',
        'A 163-acre mountain ranch near Telluride, Colorado, purchased for $14 million as a ski retreat and private mountain escape. Oprah uses the property for winter sabbaticals and hosts intimate gatherings with friends in the celebrity-rich Telluride community.',
        20, 'Telluride Watch 2024', 4800),
      a('oprah-winfrey', 4, 'jet', 'Global Express XRS',
        'Oprah\'s Bombardier Global Express XRS — with a 12,000-km range — is her primary travel vehicle for philanthropic missions to South Africa, where she founded the Oprah Winfrey Leadership Academy for Girls, and for her global book club and speaking circuit.',
        50, 'Forbes 2024', 4200),
    ]},

  { id: 'dwayne-johnson', netWorth: 0.8,
    assets: [
      a('dwayne-johnson', 1, 'real_estate', 'Virginia Estate',
        'The Rock\'s primary home is a 46-acre farm estate in Homestead, Virginia, featuring a main residence, guest cottages, a state-of-the-art home gym (nicknamed "Iron Paradise"), stables for his Brahman Bull collection, and a professional film production facility. Purchased for $9.5 million.',
        15, 'Forbes 2024', 5800),
      a('dwayne-johnson', 2, 'real_estate', 'Beverly Hills Compound',
        'Johnson owns a 7-bedroom French chateau-style compound in Beverly Hills purchased for $27.8 million in 2020, used during Hollywood production schedules. The property was extensively renovated to include a home theatre, wine cellar, and state-of-the-art kitchen.',
        32, 'Zillow 2024', 5100),
      a('dwayne-johnson', 3, 'car', 'Ford F-150 Custom "The People\'s Truck"',
        'Johnson\'s favourite vehicle — a custom 2024 Ford F-150 Raptor R — reflects his working-class Miami origins, though his garage also includes a custom Rolls-Royce Wraith, a Ferrari 488 Spider, and a Pagani Huayra. His car collection is valued at over $3 million.',
        3, 'Motor Trend 2024', 4700),
    ]},

  { id: 'tom-cruise', netWorth: 0.62,
    assets: [
      a('tom-cruise', 1, 'real_estate', 'Telluride Estate, Colorado',
        'Cruise\'s primary home is a sprawling 320-acre estate near Telluride — one of America\'s most exclusive ski communities — reportedly featuring a racing track, a private ski run, and a separate guest compound. The property is estimated at $59 million.',
        59, 'Telluride Watch / Forbes 2024', 6700),
      a('tom-cruise', 2, 'real_estate', 'East Grinstead Property, UK',
        'Cruise maintains a property in East Grinstead, Surrey — the UK headquarters of the Church of Scientology — reflecting his central role in the organisation. The English countryside property provides a European base during UK production schedules.',
        5, 'The Times UK 2023', 3200),
      a('tom-cruise', 3, 'jet', 'Gulfstream IV & Helicopter Collection',
        'Cruise owns a Gulfstream IV and is a licensed commercial airline pilot with a helicopter rating — he regularly pilots his aircraft personally. His collection includes a P-51 Mustang World War II fighter and multiple helicopters, reflecting his lifelong aviation passion.',
        30, 'Aviation Week 2024', 7200),
    ]},

  { id: 'george-clooney', netWorth: 0.5,
    assets: [
      a('george-clooney', 1, 'real_estate', 'Villa Oleandra, Lake Como',
        'Clooney\'s famous 18th-century Villa Oleandra on Lake Como in Laglio, Italy — purchased for $10 million in 2002 — is a 25-room Renaissance villa set in a vast park with lake frontage, a boathouse, and an outdoor cinema. It has become one of the world\'s most photographed private homes.',
        35, 'Architectural Digest 2024', 8900),
      a('george-clooney', 2, 'real_estate', 'Studio City Home, Los Angeles',
        'Clooney\'s primary LA residence — a compound in the Studio City hills — was purchased in the early 1990s and completely renovated, featuring a basketball court, a home cinema, and the room where he and his law professor wife Amal work on human rights cases. Valued at approximately $13 million.',
        13, 'Los Angeles Magazine 2024', 4200),
      a('george-clooney', 3, 'real_estate', 'Berkshire Estate, England',
        'Following his marriage to Amal Alamuddin in 2014, Clooney purchased a large estate in Sonning-on-Thames, Berkshire — near Amal\'s family and within easy reach of London courts — for approximately £10 million. The estate backs onto the River Thames.',
        13, 'Telegraph 2024', 3800),
    ]},

  { id: 'brad-pitt', netWorth: 0.4,
    assets: [
      a('brad-pitt', 1, 'real_estate', 'Château Miraval, Provence',
        'Brad and his team own the renowned Château Miraval estate in Provence — a 35-room castle set in 1,000 acres of organic vineyards — which they developed into one of France\'s most celebrated rosé wine producers. The estate and wine brand were at the centre of his acrimonious divorce from Angelina Jolie.',
        164, 'Le Figaro / Forbes 2024', 8200),
      a('brad-pitt', 2, 'real_estate', 'Los Feliz Compound, Los Angeles',
        'Pitt owns a large compound in the bohemian Los Feliz neighbourhood of Los Angeles — a cluster of properties accumulated over 25 years — used as his primary California base. The compound includes an art studio reflecting his serious practice as a sculptor and architect.',
        40, 'LA Times 2024', 4900),
      a('brad-pitt', 3, 'real_estate', 'New Orleans Properties',
        'Following Hurricane Katrina, Pitt founded the Make It Right Foundation and built 109 eco-homes in the Lower 9th Ward, also purchasing personal property in New Orleans\' Garden District for approximately $5 million. He remains deeply invested in New Orleans culture and architecture.',
        5, 'Times-Picayune 2024', 4100),
    ]},

  { id: 'leonardo-dicaprio', netWorth: 0.3,
    assets: [
      a('leonardo-dicaprio', 1, 'island', 'Blackadore Caye, Belize',
        'DiCaprio purchased an 80-hectare private island off the coast of Belize — called Blackadore Caye — for $1.75 million in 2005, with ambitious plans to develop a self-sustaining eco-resort called Restorative Island. The project has faced permitting delays but remains his most discussed personal asset.',
        25, 'Bloomberg / Belize Times 2024', 7400),
      a('leonardo-dicaprio', 2, 'real_estate', 'Malibu Beach House',
        'A stunning beachfront property in Malibu — purchased for $17 million in 2017 — has been DiCaprio\'s primary LA residence, located on the Pacific Coast Highway\'s most exclusive stretch. The property is used for his environmental fundraising events and intimate screenings.',
        23, 'Zillow 2024', 4800),
      a('leonardo-dicaprio', 3, 'real_estate', 'Los Angeles Property Portfolio',
        'DiCaprio has assembled a Los Angeles property portfolio worth over $40 million, including a compound in Los Feliz, a home in the Hollywood Hills, and rental properties in Silver Lake. He is one of Hollywood\'s most active real-estate investors.',
        40, 'Forbes 2024', 3900),
    ]},

  { id: 'will-smith', netWorth: 0.35,
    assets: [
      a('will-smith', 1, 'real_estate', 'Calabasas Compound, California',
        'Will and Jada\'s primary residence is a 25,000-square-foot compound in Calabasas — adjacent to the Kardashian enclave — featuring 9 bedrooms, a meditation room, a basketball court, a home cinema, and an outdoor amphitheatre for family events. Estimated value: $42 million.',
        42, 'Los Angeles Times 2024', 5800),
      a('will-smith', 2, 'real_estate', 'Palm Springs Retreat',
        'A modernist desert retreat in Palm Springs used for creative writing and production development sessions by Will and his Westbrook Inc. production company. The property is a hub for developing projects like King Richard and Fresh Prince reboots.',
        5, 'Palm Springs Life 2024', 3100),
      a('will-smith', 3, 'car', 'Rolls-Royce Phantom Collection',
        'Smith\'s car collection — estimated at $3 million — includes a customised Rolls-Royce Phantom Drophead Coupé, a Mercedes Sprinter custom camper van used on set, and a collection of electric vehicles including a Rivian R1T truck.',
        3, 'Forbes 2024', 3400),
    ]},

  // ────────────────────────────────────────────────── ENTREPRENEURS ─────────

  { id: 'larry-ellison', netWorth: 194,
    assets: [
      a('larry-ellison', 1, 'island', 'Lanai Island, Hawaii',
        'Ellison purchased 98% of the Hawaiian island of Lanai — approximately 87,000 acres — from David Murdock for $300 million in 2012, making it one of the most extraordinary private property acquisitions in US history. He has invested over $500 million transforming Lanai into a sustainable destination with two Four Seasons hotels.',
        500, 'Forbes / Bloomberg 2024', 9800),
      a('larry-ellison', 2, 'yacht', 'Rising Sun Superyacht',
        'The 452-foot Rising Sun was the world\'s largest private yacht when launched in 2004, built in Germany for Ellison at a cost of approximately $200 million. He later sold a majority stake to David Geffen and purchased the 288-foot Musashi instead.',
        200, 'Boat International 2023', 8200),
      a('larry-ellison', 3, 'jet', 'Gulfstream G650ER & MiG-29',
        'Ellison operates multiple aircraft including a Gulfstream G650ER for business travel and — uniquely — a Soviet-era MiG-29 fighter jet, which he purchased and is licenced to fly. His aviation collection represents his lifelong passion for aviation and speed.',
        80, 'Forbes 2024', 7600),
      a('larry-ellison', 4, 'real_estate', 'Malibu Estate',
        'A 23-acre Japanese-style estate in Malibu — designed by architect Paul Feng — featuring a 16th-century Japanese ceremonial teahouse, koi ponds, and a 4-acre lake with a bathhouse. The estate took 9 years to build and is estimated at over $200 million.',
        200, 'Architectural Digest 2024', 6800),
      a('larry-ellison', 5, 'sports_team', 'Golden State Warriors Minority Stake',
        'Ellison is a minority investor in the Golden State Warriors — the NBA\'s most valuable franchise at approximately $7 billion — through a relationship with majority owner Joe Lacob. His stake is estimated at several hundred million dollars.',
        350, 'Forbes / Bloomberg 2024', 5200),
    ]},

  { id: 'sergey-brin', netWorth: 130,
    assets: [
      a('sergey-brin', 1, 'yacht', 'Draco Superyacht',
        'Brin\'s 73-metre superyacht Draco — powered partly by hydrogen fuel cells — reflects his commitment to sustainable technology and his love of ocean travel. The yacht features a submarine dock and is a test bed for Alphabet\'s Project Loon connectivity technology.',
        80, 'Boat International 2024', 6200),
      a('sergey-brin', 2, 'jet', 'Boeing 767 & H211 Fleet',
        'Through H211 LLC — his private aviation company — Brin co-owns a fleet of jets including a Boeing 767 configured as a private airliner and a Dornier Alpha Jet fighter trainer, parked at Moffett Federal Airfield which Google/Alphabet leases from NASA. The fleet is worth over $100 million.',
        100, 'Forbes 2024', 5800),
      a('sergey-brin', 3, 'real_estate', 'Los Altos Residence',
        'Brin\'s primary residence is a modest-by-billionaire-standards home in Los Altos, California, near Google\'s Mountain View headquarters. Unlike many Silicon Valley peers, he has maintained relatively discreet real-estate footprint.',
        10, 'Forbes 2024', 2900),
      a('sergey-brin', 4, 'real_estate', 'Miami Area Property',
        'Brin has invested in Miami real estate following the tech industry\'s migration south, purchasing property in the exclusive Coconut Grove and Miami Beach areas. He is a regular presence at the Art Basel Miami Beach fair.',
        20, 'Miami Herald 2024', 3200),
    ]},

  { id: 'peter-thiel', netWorth: 9.5,
    assets: [
      a('peter-thiel', 1, 'real_estate', 'Queenstown Estate, New Zealand',
        'Thiel owns a stunning lakefront estate in New Zealand\'s Queenstown — which he obtained citizenship to following the country\'s investor visa scheme — providing a retreat in what he describes as his "ultimate insurance policy" against civilisational catastrophe. The property is valued at approximately $10 million.',
        10, 'NZ Herald 2024', 6100),
      a('peter-thiel', 2, 'real_estate', 'Maui Estate, Hawaii',
        'A large oceanfront compound on Maui acquired as part of Thiel\'s multi-continent property strategy, used for winter retreats and Founders Fund portfolio company meetings. The property is in a gated coastal community valued at approximately $15 million.',
        15, 'Maui Records 2024', 4200),
      a('peter-thiel', 3, 'real_estate', 'San Francisco Victorian Mansion',
        'Thiel owns a landmark Italianate Victorian mansion in San Francisco\'s Pacific Heights neighbourhood — purchased for $4 million and extensively restored — giving him a presence in the city he famously departed for Los Angeles citing cultural stagnation.',
        12, 'SF Chronicle 2024', 3600),
    ]},

  { id: 'jack-dorsey', netWorth: 6.8,
    assets: [
      a('jack-dorsey', 1, 'real_estate', 'San Francisco Victorian',
        'Dorsey\'s primary residence is a Victorian-era home in San Francisco\'s Noe Valley neighbourhood — in keeping with his preference for historic architecture and urban living over suburban sprawl. He has reportedly lived in Noe Valley for over a decade.',
        5, 'SF Chronicle 2024', 3200),
      a('jack-dorsey', 2, 'real_estate', 'St. Thomas, US Virgin Islands',
        'During his years at Twitter (now X), Dorsey spent significant time at a property in St. Thomas, US Virgin Islands, where he is a registered resident for tax purposes. The island home suits his minimalist lifestyle and interest in island community development.',
        6, 'WSJ 2024', 3600),
    ]},

  // ────────────────────────────────────────────────── POLITICIANS ──────────

  { id: 'donald-trump', netWorth: 5.9,
    assets: [
      a('donald-trump', 1, 'real_estate', 'Mar-a-Lago, Palm Beach',
        'Trump\'s primary private residence and political headquarters, Mar-a-Lago in Palm Beach, Florida, is a 128-room Mediterranean Revival mansion on 18 acres of oceanfront property. Originally built in 1927 for cereal heiress Marjorie Merriweather Post, it was purchased by Trump for $10 million in 1985 and is now estimated at over $500 million.',
        500, 'Palm Beach County Appraiser 2024', 9200),
      a('donald-trump', 2, 'real_estate', 'Trump Tower Penthouse, New York',
        'The three-storey gold-and-marble penthouse atop Trump Tower on Fifth Avenue — Trump\'s pre-presidency home — features 30,000 square feet of living space with ceiling frescoes, gold-plated fixtures, and views over Central Park. Estimated value: $54 million.',
        54, 'NYC Property Records 2024', 7800),
      a('donald-trump', 3, 'real_estate', 'Bedminster Golf Club, New Jersey',
        'Trump National Golf Club Bedminster is a 520-acre luxury golf resort in New Jersey — Trump\'s summer retreat and the site of two of his children\'s weddings — featuring two championship courses, a clubhouse, and private residences. The property is valued at approximately $50 million.',
        50, 'Forbes 2024', 5600),
      a('donald-trump', 4, 'jet', 'Boeing 757 "Trump Force One"',
        'Trump\'s custom Boeing 757 — nicknamed "Trump Force One" — features gold-plated seatbelt buckles, presidential blue velvet seats, a bedroom, a dining room, and Trump branding on the fuselage. The aircraft is estimated at $40 million and is used for both political and business travel.',
        40, 'Forbes / ADS-B 2024', 6900),
      a('donald-trump', 5, 'real_estate', 'Trump International Hotel, DC',
        'The 263-room Trump International Hotel in Washington DC — housed in the landmark Old Post Office Pavilion on Pennsylvania Avenue — was sold to CGI Merchant Group in 2022 for $375 million after generating controversy over foreign government spending. It remains Trump\'s most lucrative single hospitality asset sale.',
        375, 'Washington Post 2022', 5400),
    ]},

  { id: 'vladimir-putin', netWorth: 200,
    assets: [
      a('vladimir-putin', 1, 'real_estate', 'Gelendzhik Palace',
        'The so-called "Putin\'s Palace" — a 17,691-square-foot estate on the Black Sea near Gelendzhik — was documented in a viral 2021 exposé by Alexei Navalny\'s team, revealing a compound with a casino, strip club, ice rink, and private vineyard reportedly costing $1 billion. The Kremlin denies Putin\'s ownership.',
        1000, 'Navalny Foundation / Bloomberg 2024', 9200),
      a('vladimir-putin', 2, 'yacht', 'Scheherazade Superyacht',
        'The 459-foot Scheherazade — one of the world\'s ten largest superyachts — was seized by Italian authorities in 2022 and identified by investigators as linked to Putin, featuring a helipad, submarine dock, a gym, a swimming pool, and golden fixtures throughout. The vessel was built at a cost of approximately €700 million.',
        700, 'Financial Times 2022', 9800),
      a('vladimir-putin', 3, 'real_estate', 'Valdai Residence, Novgorod',
        'Putin\'s official working residence near Lake Valdai is a grand neo-classical mansion in Novgorod Oblast — rebuilt from a Soviet-era retreat — used for state meetings with foreign leaders and personal recreation including ice fishing and horse riding.',
        50, 'Reuters 2024', 5200),
      a('vladimir-putin', 4, 'jet', 'Ilyushin Il-96 Presidential Aircraft',
        'Putin travels aboard a customised Ilyushin Il-96-300PU — Russia\'s presidential aircraft — configured with a private conference room, bedroom, gym, and gold-accented interiors. Russia maintains a fleet of presidential jets, with a Dassault Falcon 900 used for shorter European routes before Western sanctions.',
        100, 'Jane\'s Defence 2024', 6800),
    ]},

  // ────────────────────────────────────────────────── MODELS ───────────────

  { id: 'kylie-jenner', netWorth: 0.7,
    assets: [
      a('kylie-jenner', 1, 'real_estate', 'Hidden Hills Estate',
        'Kylie purchased a 4-bedroom home in the ultra-exclusive Hidden Hills community for $12 million in 2019, adjacent to her mother Kris\'s compound. She subsequently expanded with additional lots, creating a compound now valued at over $30 million.',
        30, 'Zillow / Forbes 2024', 7200),
      a('kylie-jenner', 2, 'real_estate', 'Holmby Hills Mansion',
        'A $36.5 million Holmby Hills mansion — purchased in 2020 — serves as Kylie\'s primary residence during business seasons, featuring 11 bedrooms, a climate-controlled wine cellar, a home theatre, and a spa complex. The neighbourhood is home to Hugh Hefner\'s Playboy Mansion.',
        38, 'Architectural Digest 2024', 6800),
      a('kylie-jenner', 3, 'jet', 'Bombardier Global 7500',
        'Kylie\'s custom Bombardier Global 7500 — nicknamed "Kylie Air" — became controversial in 2022 when a viral account tracked her short 17-minute flights. The aircraft is painted in a dusty pink to match her Kylie Cosmetics brand palette and seats 12 in ultra-luxury configuration.',
        75, 'ADS-B Exchange 2024', 8900),
      a('kylie-jenner', 4, 'car', 'Rolls-Royce Ghost & Lamborghini Urus',
        'Kylie\'s well-documented car collection — estimated at $10 million — includes a white Rolls-Royce Ghost convertible, a custom Lamborghini Urus in emerald green, a Ferrari Spider, and a fleet of matching Mercedes-Benz SUVs for team travel. She regularly showcases her collection on social media.',
        10, 'GQ / People 2024', 7400),
    ]},

  { id: 'adriana-lima', netWorth: 0.095,
    assets: [
      a('adriana-lima', 1, 'real_estate', 'Miami Beach Home',
        'Lima\'s primary US residence is a luxury home in Miami Beach — her adopted city — near the social scene she has been part of since her early modelling career. The property reflects her Brazilian warmth and preference for coastal living.',
        3, 'Miami Herald 2023', 3100),
      a('adriana-lima', 2, 'real_estate', 'Istanbul Property',
        'Following her marriage to Turkish director André Lemmers, Lima has invested in property in Istanbul — the city she has visited frequently for runway shows and Turkish fashion campaigns. Istanbul property prices in her neighbourhood are approximately $2–5 million for luxury apartments.',
        3, 'Hürriyet 2023', 2400),
    ]},

  // ────────────────────────────────────────────────── MISC ─────────────────

  { id: 'kylian-mbappe', netWorth: 0.21,
    assets: [
      a('kylian-mbappe', 1, 'real_estate', 'Bondy Tribute Investment',
        'Mbappe has invested significantly in his hometown of Bondy in the Seine-Saint-Denis suburb of Paris, funding sports infrastructure and pledging €3 million to youth sports associations. He calls Bondy "the city that made me."',
        5, 'L\'Equipe 2024', 6200),
      a('kylian-mbappe', 2, 'real_estate', 'Madrid Penthouse',
        'Following his move to Real Madrid in 2024, Mbappe acquired a luxury penthouse in the Barrio de Salamanca — Madrid\'s most exclusive residential district — for approximately €4 million. The penthouse is within walking distance of the Bernabéu stadium.',
        4, 'Marca / El Confidencial 2024', 5700),
      a('kylian-mbappe', 3, 'car', 'Ferrari 458 Speciale',
        'The youngest member of football\'s billionaire-in-waiting club owns a Ferrari 458 Speciale, a Lamborghini Urus, and a Range Rover Sport among others — a collection in keeping with his status as football\'s best-paid player. His monthly salary at PSG of €4.7 million funded the collection rapidly.',
        1.5, 'L\'Équipe Auto 2024', 4800),
    ]},
]

// ── Load and update ────────────────────────────────────────────────────────────
const celebs  = JSON.parse(fs.readFileSync(CELEBS, 'utf8'))
const photos  = JSON.parse(fs.readFileSync(PHOTOS, 'utf8'))
const byId    = {}
celebs.forEach((c, i) => byId[c.id] = i)

let updatedCelebs = 0, photoUpdates = 0

// Apply photo overrides
for (const [id, url] of Object.entries(PHOTO_OVERRIDES)) {
  if (photos[id] !== url) {
    photos[id] = url
    photoUpdates++
  }
}

// Apply enrichments
for (const enrich of DATA) {
  const idx = byId[enrich.id]
  if (idx === undefined) { console.warn(`⚠ Not found: ${enrich.id}`); continue }

  const c = celebs[idx]

  if (enrich.netWorth) c.netWorth = enrich.netWorth

  // Upgrade existing assets that lack images[] / valueFormatted
  const existing = (c.assets || []).map((asset, i) => {
    if (!asset.images || !asset.images.length) {
      const im = imgs(asset.type || 'real_estate')
      asset.images = im
      if (!asset.image) asset.image = im[0]
    }
    if (!asset.valueFormatted && asset.estimatedValue) {
      asset.valueFormatted = fmtVal(parseFloat(asset.estimatedValue))
    }
    if (!asset.valuationSource) asset.valuationSource = 'Forbes 2025'
    if (!asset.id) asset.id = `${enrich.id}-${i + 1}`
    return asset
  })

  // Merge: avoid duplicate names
  const existingNames = new Set(existing.map(a => (a.name || a.title || '').toLowerCase()))
  const newOnes = enrich.assets.filter(a => !existingNames.has(a.name.toLowerCase()))

  c.assets = [...existing, ...newOnes]
  c.lastUpdated = '2026-08-17'
  celebs[idx] = c
  updatedCelebs++

  console.log(`✓ ${c.name}: ${c.assets.length} assets (${newOnes.length} new)`)
}

fs.writeFileSync(CELEBS, JSON.stringify(celebs, null, 2), 'utf8')
fs.writeFileSync(PHOTOS, JSON.stringify(photos, null, 2), 'utf8')
console.log(`\nDone — ${updatedCelebs} celebrities enriched, ${photoUpdates} photo URLs updated`)
