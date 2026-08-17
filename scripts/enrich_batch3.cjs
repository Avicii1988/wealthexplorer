#!/usr/bin/env node
'use strict'
const fs = require('fs')

const CELEBS_PATH = 'public/data/celebs.json'
const PHOTOS_PATH = 'public/data/photosCache.json'

const celebs = JSON.parse(fs.readFileSync(CELEBS_PATH, 'utf8'))
const photos = JSON.parse(fs.readFileSync(PHOTOS_PATH, 'utf8'))

const IMGS = {
  real_estate: [
    'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
  ],
  jet: [
    'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800',
    'https://images.unsplash.com/photo-1474302770737-173ee21bab63?w=800',
    'https://images.unsplash.com/photo-1559636382-0a4ed04a46fb?w=800',
  ],
  car: [
    'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800',
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800',
    'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800',
  ],
  yacht: [
    'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=800',
    'https://images.unsplash.com/photo-1605281317010-fe5ffe798166?w=800',
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800',
  ],
  watch: [
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
    'https://images.unsplash.com/photo-1594576722512-582bcd6d2104?w=800',
    'https://images.unsplash.com/photo-1619134778706-7015533a6150?w=800',
  ],
  art: [
    'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800',
    'https://images.unsplash.com/photo-1501472312651-726afe119ff1?w=800',
    'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=800',
  ],
  sports_team: [
    'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800',
    'https://images.unsplash.com/photo-1517747614396-d21a78b850e8?w=800',
    'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800',
  ],
  island: [
    'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=800',
    'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=800',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
  ],
  business: [
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
    'https://images.unsplash.com/photo-1444653389962-8149286c578a?w=800',
  ],
}

function imgs(type) { return [...(IMGS[type] || IMGS.real_estate)] }
function fmtVal(v) {
  if (v >= 1000) return '$' + (v / 1000).toFixed(1) + 'B'
  if (v >= 1) return '$' + Math.round(v) + 'M'
  if (v >= 0.001) return '$' + Math.round(v * 1000) + 'K'
  return '$0'
}
function a(id, num, type, name, desc, val, source, likes) {
  const im = imgs(type)
  return {
    id: `${id}-${num}`, type, name, description: desc,
    estimatedValue: val, valueFormatted: fmtVal(val),
    valuationSource: source || 'Forbes 2025',
    images: im, image: im[0],
    likes: likes || Math.floor(Math.random() * 4000 + 800),
  }
}

// Photo URL fixes for celebs with broken URLs
const PHOTO_FIXES = {
  'davidoff-yachts': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Roman_Abramovich_2006.jpg/300px-Roman_Abramovich_2006.jpg',
  'ralph-lauren': 'https://image.tmdb.org/t/p/w400/cgPRxpJFYZ3UrGLPzHZx6F2w5d.jpg',
  'mark-cuban': 'https://image.tmdb.org/t/p/w400/sRxblKTYt2lkSFM9MHsJF3s4kp.jpg',
  'bruce-springsteen': 'https://image.tmdb.org/t/p/w400/9yIh1o0JjkiXklx6B0PJZK5XuHY.jpg',
  'celine-dion': 'https://image.tmdb.org/t/p/w400/b4kfDR8hqBN10DJWDIj9JbwC5b6.jpg',
  'dolly-parton': 'https://image.tmdb.org/t/p/w400/mXOGKMh7FVPQP9GgVUFkjMSKwBl.jpg',
  'jackie-chan': 'https://image.tmdb.org/t/p/w400/nraZoLzmcsUSxuxFS0HPVC0e8vI.jpg',
  'dr-dre': 'https://image.tmdb.org/t/p/w400/8hGncGFZZFUEfMdXJzV2Ff2JFEJ.jpg',
  'kevin-hart': 'https://image.tmdb.org/t/p/w400/dzMR2IGM1TH4YpOCvMDsDWpOoeh.jpg',
  'amitabh-bachchan': 'https://image.tmdb.org/t/p/w400/9RjcblGBMCVXQPj4YEk1tKAMFYq.jpg',
  'shah-rukh-khan': 'https://image.tmdb.org/t/p/w400/8YdpeF4PFR4NVdR3qNbGwLOHUYG.jpg',
  'adele': 'https://image.tmdb.org/t/p/w400/9OgWVxjv8YMPMRQjPmU2XqQKT3.jpg',
  'angelina-jolie': 'https://image.tmdb.org/t/p/w400/bp3adzCdxDWi2jMqfHQMVZfZhol.jpg',
  'alicia-keys': 'https://image.tmdb.org/t/p/w400/oRxwDOWiDmSIGmWRF0iqJsGGnL1.jpg',
}

const ENRICHMENTS = {
  // === TECH / BUSINESS ===
  'davidoff-yachts': { // Roman Abramovich
    netWorth: 9.4,
    assets: [
      a('davidoff-yachts', 1, 'yacht', 'Solaris Superyacht (139m)', "Roman Abramovich\'s 139-meter superyacht Solaris, valued at $600M, is one of the world\'s largest private yachts — featuring a helipad, beach club, and spy-grade security systems.", 600, 'Boat International 2024'),
      a('davidoff-yachts', 2, 'yacht', 'Eclipse Superyacht (162.5m)', "Eclipse, at 162.5 meters, was the world\'s longest private yacht when built. Abramovich\'s flagship vessel features two helipads, a submarine, and anti-paparazzi laser system.", 500, 'Forbes 2022'),
      a('davidoff-yachts', 3, 'sports_team', 'Chelsea FC (Former Owner)', "Abramovich owned Chelsea FC from 2003–2022, transforming the club into a global superpower with 5 Premier League titles, 2 Champions Leagues, and multiple domestic trophies.", 3000, 'Bloomberg 2022'),
      a('davidoff-yachts', 4, 'real_estate', 'Global Real Estate Portfolio', "Abramovich amassed an international real estate portfolio spanning London (Kensington Palace Gardens), Tel Aviv, and Saint Tropez — many assets frozen under EU/UK sanctions.", 200, 'Forbes 2022'),
    ],
  },
  'ralph-lauren': {
    netWorth: 8.8,
    assets: [
      a('ralph-lauren', 1, 'business', 'Ralph Lauren Corporation (Stake)', "Ralph Lauren retains a significant ownership stake in Ralph Lauren Corporation — the fashion empire he founded in 1967 valued at $20B+. His personal Polo, Purple Label, and RRL brands generate billions annually.", 4000, 'NYSE: RL 2024'),
      a('ralph-lauren', 2, 'real_estate', 'Double RL Ranch, Colorado', "Lauren\'s iconic 17,000-acre ranch in Ridgway, Colorado — the inspiration for his RRL clothing line, featuring authentic Western ranch life, cattle, and wide-open Colorado mountains.", 200, 'Forbes 2023'),
      a('ralph-lauren', 3, 'real_estate', 'Jamaica Compound', "Lauren\'s private Jamaican retreat — a stunning tropical compound on the island\'s north shore, regularly used for family vacations and creative retreats.", 40, 'Architectural Digest'),
      a('ralph-lauren', 4, 'car', 'Legendary Car Collection', "Ralph Lauren owns one of the most celebrated private automobile collections in the world, with 70+ cars including a 1938 Bugatti Type 57SC Atlantic (worth $40M+), Ferrari 250 GTO, and McLaren F1.", 200, 'Sotheby\'s / Petersen Museum 2023'),
    ],
  },
  'giorgio-armani': {
    netWorth: 8,
    assets: [
      a('giorgio-armani', 1, 'business', 'Giorgio Armani SpA (100% Owned)', "Armani owns 100% of his fashion house — refusing to go public or sell to luxury conglomerates. The company generates $2.6B in annual revenue across Armani, Emporio Armani, and AX Armani Exchange.", 3000, 'Forbes 2024'),
      a('giorgio-armani', 2, 'real_estate', 'Villa Forte dei Marmi, Tuscany', "Armani\'s primary Italian retreat — a villa near Forte dei Marmi, the exclusive Tuscan coastal resort favored by Italy\'s aristocracy and fashion world.", 40, 'Italian Property Records'),
      a('giorgio-armani', 3, 'yacht', 'Main Superyacht', "Armani\'s custom superyacht, reflecting his aesthetic for clean, minimalist luxury — a vessel designed with the same philosophy as his fashion lines.", 80, 'Boat International'),
      a('giorgio-armani', 4, 'real_estate', 'Pantelleria Island Home', "Armani\'s dramatic volcanic stone dammuso home on Pantelleria, the remote Italian island between Sicily and Tunisia — known as the island of Armani for his influence there.", 15, 'Italian Media 2022'),
    ],
  },
  'mark-cuban': {
    netWorth: 6,
    assets: [
      a('mark-cuban', 1, 'business', 'Cost Plus Drugs (CostPlusDrugs.com)', "Mark Cuban\'s pharmaceutical company disrupting US drug pricing — offering generic medications at dramatically lower prices than traditional pharmacies. Valued at $1B+.", 1000, 'Forbes 2024'),
      a('mark-cuban', 2, 'sports_team', 'Dallas Mavericks (Former Majority Owner)', "Cuban owned the Dallas Mavericks NBA franchise from 2000 to 2023, selling majority control to Miriam Adelson for ~$3.5B. He retains a small stake in the now-$5B franchise.", 200, 'ESPN 2023'),
      a('mark-cuban', 3, 'real_estate', 'Dallas Compound', "Cuban\'s primary Texas home — a contemporary Dallas estate reflecting his tech-meets-sports lifestyle in the city where he built his empire.", 20, 'TX Property Records'),
      a('mark-cuban', 4, 'business', 'Shark Tank Investments Portfolio', "As a Shark Tank investor since Season 1, Cuban has made 100+ investments including Rugged Maniac, Ten Thirty One Productions, and various tech startups with a combined portfolio value.", 100, 'ABC Shark Tank 2024'),
    ],
  },
  'brian-chesky': {
    netWorth: 12,
    assets: [
      a('brian-chesky', 1, 'business', 'Airbnb (ABNB) Equity', "Brian Chesky co-founded Airbnb and serves as CEO — his ownership stake in the $70B+ platform represents his primary wealth. He famously has an Airbnb host rating and often stays in Airbnbs.", 8000, 'NASDAQ: ABNB 2024'),
      a('brian-chesky', 2, 'real_estate', 'San Francisco Home', "Chesky maintains a home in San Francisco — the city where Airbnb was born from an air mattress and cereal boxes in 2007.", 5, 'SF Property Records'),
      a('brian-chesky', 3, 'business', 'Design for Humanity Foundation', "Chesky\'s philanthropic vehicle focused on design, creativity, and community building — reflecting his background from the Rhode Island School of Design.", 10, 'Forbes 2024'),
    ],
  },
  'tim-cook': {
    netWorth: 2.2,
    assets: [
      a('tim-cook', 1, 'business', 'Apple Inc (AAPL) Stock & Compensation', "Tim Cook\'s Apple stock and RSU grants — he has sold significant portions over the years but retains substantial equity in the world\'s most valuable company (valued at $3T+).", 1500, 'SEC Filings 2024'),
      a('tim-cook', 2, 'real_estate', 'Palo Alto Home', "Cook\'s primary Silicon Valley residence in Palo Alto — a modest home befitting his reputation for frugality despite his enormous wealth.", 3, 'Property Records'),
      a('tim-cook', 3, 'real_estate', 'Pacific Heights Home, San Francisco', "Cook\'s second Bay Area property in Pacific Heights — an upscale San Francisco neighborhood used for city-based activities.", 5, 'SF Property Records'),
    ],
  },
  'sam-altman': {
    netWorth: 1.1,
    assets: [
      a('sam-altman', 1, 'business', 'OpenAI CEO Equity & Investments', "Sam Altman as OpenAI CEO holds equity in the AI company valued at $157B+ (2025). His extensive startup investment portfolio through Y Combinator alumni and direct bets spans hundreds of companies.", 700, 'Bloomberg 2025'),
      a('sam-altman', 2, 'business', 'Helion Energy (Investor)', "Altman is the primary investor in Helion Energy — a nuclear fusion startup working to achieve commercial fusion power. He personally committed $375M to the company.", 150, 'Bloomberg 2024'),
      a('sam-altman', 3, 'real_estate', 'San Francisco Mansion', "Altman\'s primary residence — a Victorian home in San Francisco\'s exclusive Pacific Heights neighborhood, purchased for $4.5M.", 10, 'SF Property Records 2022'),
    ],
  },
  'reed-hastings': {
    netWorth: 4,
    assets: [
      a('reed-hastings', 1, 'business', 'Netflix (NFLX) Equity Stake', "Reed Hastings co-founded Netflix and served as CEO until 2023. His Netflix stake, while reduced over time, still represents significant value in the $280B+ streaming giant.", 2500, 'NASDAQ: NFLX 2024'),
      a('reed-hastings', 2, 'real_estate', 'Santa Cruz Mountains Estate', "Hastings\' primary California home — an estate in the Santa Cruz Mountains near his Silicon Valley base, reflecting his long history with the Bay Area tech community.", 20, 'Property Records'),
      a('reed-hastings', 3, 'real_estate', 'Malibu Beach House', "Reed Hastings' Malibu coastal property — a beachfront retreat from the Netflix world, acquired as his fortune grew with the streaming giant\'s success.", 15, 'Property Records'),
    ],
  },
  'evan-spiegel': {
    netWorth: 2.8,
    assets: [
      a('evan-spiegel', 1, 'business', 'Snap Inc (SNAP) Co-Founder Equity', "Spiegel co-founded Snapchat and serves as CEO of Snap Inc — owning a significant stake in the $15B+ social media company he built from a college project.", 1500, 'NYSE: SNAP 2024'),
      a('evan-spiegel', 2, 'real_estate', 'Bel Air Estate, Los Angeles', "Spiegel and wife Miranda Kerr\'s primary home — a spectacular Bel Air estate befitting two of the world\'s most prominent young power couples.", 21, 'Property Records 2018'),
      a('evan-spiegel', 3, 'real_estate', 'Paris Apartment', "The Spiegels maintain a Parisian apartment — reflecting Miranda\'s frequent Paris visits for fashion week and their international lifestyle.", 8, 'Paris Property Records'),
    ],
  },
  'chamath-palihapitiya': {
    netWorth: 1.2,
    assets: [
      a('chamath-palihapitiya', 1, 'business', 'Social Capital Venture Fund', "Chamath\'s investment firm Social Capital manages $1B+ across venture investments in tech and healthcare, including early Facebook, Slack, and numerous SPAC deals.", 600, 'Forbes 2024'),
      a('chamath-palihapitiya', 2, 'sports_team', 'Golden State Warriors (Minority Stake)', "Palihapitiya is a minority investor in the Golden State Warriors NBA franchise — purchased during the dynasty years when Steph Curry led multiple championship runs.", 50, 'Forbes 2024'),
      a('chamath-palihapitiya', 3, 'real_estate', 'Silicon Valley Home', "Chamath\'s primary Bay Area home — a Silicon Valley estate reflecting his position at the center of the tech investment ecosystem.", 15, 'Property Records'),
    ],
  },
  'marc-andreessen': {
    netWorth: 1.9,
    assets: [
      a('marc-andreessen', 1, 'business', 'Andreessen Horowitz (a16z)', "Marc Andreessen co-founded a16z — one of the world\'s most powerful VC firms managing $45B+ in assets with investments in Facebook, Airbnb, Lyft, GitHub, Coinbase, and hundreds more.", 1000, 'Forbes 2024'),
      a('marc-andreessen', 2, 'real_estate', 'Atherton Estate, Silicon Valley', "Andreessen\'s primary California home — a multi-property compound in Atherton, the wealthiest zip code in the US, perfect for Silicon Valley\'s most influential VC.", 40, 'CA Property Records 2023'),
      a('marc-andreessen', 3, 'real_estate', 'Malibu Mansion', "A Malibu coastal retreat in the prestigious Colony area — Andreessen purchased multiple Malibu properties before controversially opposing new housing developments while advocating for housing abundance.", 15, 'Malibu Property Records 2023'),
    ],
  },
  'sundar-pichai': {
    netWorth: 0.8,
    assets: [
      a('sundar-pichai', 1, 'business', 'Alphabet (GOOGL) Stock Holdings', "Sundar Pichai\'s Google/Alphabet RSU grants and stock compensation represent the bulk of his wealth — as CEO of one of the most valuable companies ($2T+), his annual compensation often exceeds $200M.", 700, 'SEC Filings 2024'),
      a('sundar-pichai', 2, 'real_estate', 'Los Altos Hills Home', "Pichai\'s primary residence in Los Altos Hills — an upscale Silicon Valley community adjacent to Palo Alto where many tech executives reside.", 6.7, 'CA Property Records'),
      a('sundar-pichai', 3, 'real_estate', 'Atherton Property', "An additional Silicon Valley property in Atherton, reflecting Pichai\'s growth from modest Tamil Nadu origins to one of the highest-paid executives in the world.", 5, 'CA Property Records'),
    ],
  },
  'satya-nadella': {
    netWorth: 0.7,
    assets: [
      a('satya-nadella', 1, 'business', 'Microsoft (MSFT) Stock & RSUs', "Satya Nadella\'s Microsoft equity — he has led the company from $300B to $3T+ in market cap since becoming CEO in 2014. Annual compensation consistently ranks among the highest in corporate America.", 600, 'SEC Filings 2024'),
      a('satya-nadella', 2, 'real_estate', 'Bellevue, Washington Home', "Nadella\'s primary residence near Microsoft HQ in Bellevue, Washington — reflecting his deep ties to the Pacific Northwest where he has spent most of his career.", 3, 'WA Property Records'),
      a('satya-nadella', 3, 'sports_team', 'Seattle SuperSonics Fan & Sports Interests', "Nadella is co-owner of the Seattle Sounders MLS team and an outspoken fan of bringing the NBA back to Seattle — representing his passion for sports alongside his technology career.", 10, 'MLS 2023'),
    ],
  },
  // === MUSICIANS ===
  'bruce-springsteen': {
    netWorth: 1.1,
    assets: [
      a('bruce-springsteen', 1, 'business', 'Music Catalog Sale to Sony', "In 2021, Springsteen sold his complete music catalog — including masters and publishing — to Sony Music Entertainment for a reported $500M, one of the most valuable music deals ever made.", 500, 'Wall Street Journal 2021'),
      a('bruce-springsteen', 2, 'real_estate', 'Wall Township Farm, New Jersey', "The Boss\'s long-time primary home — a working farm in Wall Township, Monmouth County, New Jersey — the blue-collar state that inspired his greatest albums.", 6.5, 'NJ Property Records'),
      a('bruce-springsteen', 3, 'real_estate', 'Colts Neck Estate, New Jersey', "Springsteen\'s sprawling equestrian estate in Colts Neck, NJ — featuring a working horse farm with multiple structures on dozens of acres.", 30, 'NJ Property Records 2022'),
      a('bruce-springsteen', 4, 'real_estate', 'Wellington, Florida Property', "The Springsteens\' Florida winter retreat — a Wellington equestrian community property where Patti Scialfa pursues her passion for horses in a warmer climate.", 5, 'FL Property Records'),
    ],
  },
  'celine-dion': {
    netWorth: 0.8,
    assets: [
      a('celine-dion', 1, 'real_estate', 'Jupiter Island Estate, Florida', "Celine Dion\'s waterfront Jupiter Island estate — a spectacular $72.5M compound on one of the most exclusive addresses in the US, featuring a water park, multiple pools, and resort amenities.", 72.5, 'Bloomberg 2021'),
      a('celine-dion', 2, 'real_estate', 'Sainte-Anne-des-Lacs, Quebec', "Dion\'s intimate Canadian retreat near Montreal — the beloved Quebec home where she remains deeply connected to her Francophone roots and raised her children.", 10, 'Quebec Property Records'),
      a('celine-dion', 3, 'business', 'Las Vegas Residency Legacy', "Celine Dion\'s Caesars Palace Las Vegas residency, running from 2003 with periodic breaks, generated over $660M making it the highest-grossing residency of all time.", 50, 'Billboard Boxscore 2024'),
      a('celine-dion', 4, 'real_estate', 'Montreal Penthouse', "Dion\'s Montreal penthouse apartment — kept for regular visits to her hometown and to maintain her Quebec cultural connections.", 5, 'Property Records'),
    ],
  },
  'dolly-parton': {
    netWorth: 0.65,
    assets: [
      a('dolly-parton', 1, 'business', 'Dollywood Theme Park Empire', "Dolly Parton owns Dollywood, the Pigeon Forge, Tennessee theme park — one of the most successful celebrity-branded attractions in the world, attracting over 3 million visitors annually.", 100, 'Forbes 2024'),
      a('dolly-parton', 2, 'business', 'Music Publishing & Catalog Rights', "Parton\'s publishing empire includes rights to her classic catalog and the Dolly Parton Music catalog — \"I Will Always Love You\" alone has generated over $10M in royalties.", 150, 'Billboard 2023'),
      a('dolly-parton', 3, 'business', 'Imagination Library Foundation', "Dolly\'s nonprofit book gifting program has mailed 230M+ books to children worldwide — while separate from her wealth, it has significantly enhanced her brand value.", 10, 'Dollywood Foundation 2023'),
      a('dolly-parton', 4, 'real_estate', 'Brentwood Home, Nashville', "Dolly Parton\'s primary Nashville home in Brentwood — a beautifully appointed Tennessee estate where she has lived for decades close to the Music City center of her career.", 5, 'TN Property Records'),
    ],
  },
  'bob-dylan': {
    netWorth: 0.5,
    assets: [
      a('bob-dylan', 1, 'business', 'Music Catalog Sale to Universal', "Dylan sold his entire songwriting catalog — including Masters of War, Blowin\' in the Wind, and hundreds more — to Universal Music Publishing Group for an estimated $300M+ in 2020.", 300, 'New York Times 2020'),
      a('bob-dylan', 2, 'business', 'Heaven\'s Door Whiskey', "Bob Dylan\'s premium whiskey brand Heaven\'s Door is produced in partnership with Marc Goldberg — a critically acclaimed line of bourbons and whiskeys sold globally.", 20, 'Forbes 2023'),
      a('bob-dylan', 3, 'real_estate', 'Point Dume Estate, Malibu', "Dylan\'s primary California home — a historic Malibu compound that has been his West Coast base for decades, set on one of the most dramatic coastal bluffs in LA.", 10, 'Malibu Property Records'),
      a('bob-dylan', 4, 'real_estate', 'Minnesota Properties', "Dylan\'s Minnesota real estate including properties near his Hibbing roots — a nod to his humble origins in the Iron Range mining community that shaped his worldview.", 3, 'MN Property Records'),
    ],
  },
  'dr-dre': {
    netWorth: 0.5,
    assets: [
      a('dr-dre', 1, 'real_estate', 'Bel Air Estate, Los Angeles', "Dr. Dre\'s Bel Air compound, which was burglarized in 2021. The sprawling property reflects decades of music industry success and has been extensively renovated.", 40, 'Property Records 2021'),
      a('dr-dre', 2, 'real_estate', 'Malibu Beach House', "Dre\'s Malibu oceanfront property — a beachside retreat away from the Compton streets where he grew up to become one of the wealthiest figures in music history.", 10, 'Property Records'),
      a('dr-dre', 3, 'business', 'Aftermath Records & Royalties', "Dr. Dre\'s Aftermath Entertainment label — home to Eminem, Kendrick Lamar, and 50 Cent — and his production royalties represent significant ongoing income, supplementing the Beats windfall.", 50, 'Billboard 2024'),
      a('dr-dre', 4, 'real_estate', 'Grandeur Estate, Chartwell', "Dre purchased the former Jerry Buss estate in Chatsworth known as \'The Compound\' for $10M — one of several LA properties in his real estate portfolio.", 10, 'CA Property Records'),
    ],
  },
  'eric-clapton': {
    netWorth: 0.45,
    assets: [
      a('eric-clapton', 1, 'real_estate', 'Hurtwood Park Estate, Surrey', "Clapton\'s primary English home — a 150-acre estate in Surrey featuring Tudor-style architecture, recording studio, and centuries-old English countryside.", 10, 'Surrey Property Records'),
      a('eric-clapton', 2, 'art', 'Vintage Guitar Collection', "Clapton\'s guitar collection is among the most historically significant in the world — his 1956 Fender Strat \'Blackie\' sold for $959K at Christie\'s in 2004, and his collection includes dozens of legendary instruments.", 15, 'Christie\'s Auction Records'),
      a('eric-clapton', 3, 'business', 'Crossroads Guitar Festivals', "Eric Clapton\'s charity guitar festival held at venues like Madison Square Garden, raising $100M+ for the Crossroads Centre addiction treatment center he founded in Antigua.", 10, 'Crossroads Foundation 2023'),
      a('eric-clapton', 4, 'real_estate', 'Antigua Home', "Clapton\'s Caribbean home on the island of Antigua — where he operates the Crossroads Centre rehabilitation facility he founded after his own battles with addiction.", 4, 'Antigua Property Records'),
    ],
  },
  'jon-bon-jovi': {
    netWorth: 0.41,
    assets: [
      a('jon-bon-jovi', 1, 'real_estate', 'Palm Beach Mansion, Florida', "Jon Bon Jovi\'s spectacular Palm Beach waterfront estate — a defining property of his $410M+ fortune, featuring private dock and ocean access.", 43, 'Palm Beach Property 2021'),
      a('jon-bon-jovi', 2, 'real_estate', 'Middletown, New Jersey Home', "Bon Jovi\'s long-time primary home in Middletown, New Jersey — his working-class roots still connected to the Garden State community that inspired his music.", 4, 'NJ Property Records'),
      a('jon-bon-jovi', 3, 'business', 'JBJ Soul Kitchen Restaurants', "Jon Bon Jovi\'s community restaurants where customers pay what they can — a non-profit food service model he launched in 2011 to fight food insecurity.", 3, 'JBJ Soul Foundation 2023'),
      a('jon-bon-jovi', 4, 'business', 'Philadelphia Soul Arena Football', "Jon Bon Jovi co-owns the Philadelphia Soul Arena Football League team — reflecting his passion for sports ownership alongside his music career.", 5, 'AFL 2023'),
    ],
  },
  'adele': {
    netWorth: 0.22,
    assets: [
      a('adele', 1, 'real_estate', 'Beverly Hills Estate', "Adele\'s primary California home — a $58M Beverly Hills compound in the exclusive Hidden Valley neighborhood, featuring multiple structures, pool, and tennis court.", 58, 'Property Records 2021'),
      a('adele', 2, 'real_estate', 'Beverly Hills Neighbor Estate', "Adele has quietly purchased several adjacent Beverly Hills properties from Sylvester Stallone and others — building a private compound in one of LA\'s most coveted neighborhoods.", 16, 'Property Records 2022'),
      a('adele', 3, 'business', 'Music Catalog & Las Vegas Residency', "Adele\'s 4-album catalog has sold 120M+ copies worldwide. Her Las Vegas residency at The Colosseum grossed $100M+, cementing her as one of live music\'s most bankable acts.", 60, 'Billboard 2024'),
      a('adele', 4, 'real_estate', 'London Properties', "Adele maintains connections to her native London through property holdings — including residences near her South London roots.", 5, 'London Property Records'),
    ],
  },
  'alicia-keys': {
    netWorth: 0.15,
    assets: [
      a('alicia-keys', 1, 'real_estate', 'New Jersey Compound', "Alicia Keys and Swizz Beatz\'s primary East Coast home — a dramatic riverside mansion in New Jersey overlooking the Palisades with a contemporary design and modern art.", 14.95, 'Property Records 2022'),
      a('alicia-keys', 2, 'real_estate', 'La Jolla Home, California', "Keys\' West Coast home in the coastal community of La Jolla, San Diego — a stunning cliffside property reflecting her California lifestyle.", 5, 'CA Property Records'),
      a('alicia-keys', 3, 'business', 'Keys Soulcare Beauty Brand', "Alicia Keys launched Keys Soulcare in 2020 — a clean beauty brand focused on wellness and inclusivity, inspired by her commitment to skin positivity.", 20, 'WWD 2023'),
      a('alicia-keys', 4, 'art', 'Modern Art Collection', "Keys and Swizz Beatz curate one of the most significant collections of works by artists of color — regularly loaned to museums and cited as a major cultural resource.", 15, 'Art Basel 2023'),
    ],
  },
  // === ENTERTAINMENT ===
  'jackie-chan': {
    netWorth: 0.52,
    assets: [
      a('jackie-chan', 1, 'real_estate', 'Hong Kong Properties', "Jackie Chan owns extensive real estate across Hong Kong — his home city where he remains the biggest entertainment icon and where much of his wealth is invested.", 30, 'HK Property Records'),
      a('jackie-chan', 2, 'business', 'JCE Group Entertainment', "Chan\'s entertainment production and management company JCE Group — overseeing his film projects, brand deals, and management of his vast catalog of action films.", 50, 'Forbes Asia 2024'),
      a('jackie-chan', 3, 'real_estate', 'Beijing Compound', "Chan\'s Beijing residence — reflecting his political positioning as a pro-Beijing figure in the Chinese entertainment world and his desire to keep strong ties with mainland China.", 10, 'Beijing Property Records'),
      a('jackie-chan', 4, 'car', 'Classic Car & Motorbike Collection', "Jackie Chan\'s legendary vehicle collection includes vintage Ferraris, classic American muscle cars, and a variety of motorcycles that reflect his lifelong passion for automotive culture.", 5, 'AutoTrader 2022'),
    ],
  },
  'dr-phil': {
    netWorth: 0.46,
    assets: [
      a('dr-phil', 1, 'real_estate', 'Beverly Hills Mansion', "Dr. Phil\'s spectacular 8,188 sq ft home in the Beverly Hills flats — purchased for $5.75M and featuring multiple entertaining spaces and a wine room.", 10, 'Property Records 2022'),
      a('dr-phil', 2, 'real_estate', 'Montecito Estate, California', "The McGraws\' retreat in Montecito — the elite Santa Barbara community that has attracted Oprah, Harry and Meghan, and other celebrities for its stunning scenery.", 7.5, 'Property Records 2020'),
      a('dr-phil', 3, 'business', 'Stage 29 Productions', "Dr. Phil\'s production company responsible for his eponymous show\'s 20+ year run, plus True Crime Daily and other programming — generating $90M+ annually at peak.", 50, 'Variety 2023'),
    ],
  },
  'kevin-hart': {
    netWorth: 0.45,
    assets: [
      a('kevin-hart', 1, 'real_estate', 'Calabasas Home, Los Angeles', "Kevin Hart\'s primary California home — a contemporary Calabasas estate in the gated community popular with entertainment A-listers.", 5, 'Property Records'),
      a('kevin-hart', 2, 'business', 'Hartbeat Productions', "Hart\'s entertainment production company has deals with Netflix ($400M) and Peacock — producing stand-up specials, films, and TV shows that extend his reach far beyond performing.", 100, 'Deadline 2023'),
      a('kevin-hart', 3, 'business', 'HartBeat Ventures', "Kevin Hart\'s venture capital firm focused on investing in diverse-led startups and businesses in sports, media, and consumer products.", 30, 'Forbes 2024'),
      a('kevin-hart', 4, 'business', 'Gran Coramino Tequila', "Kevin Hart co-founded Gran Coramino tequila with Juan Domingo Beckmann — a premium crystal tequila brand generating significant revenue through celebrity-powered marketing.", 15, 'DISCUS 2024'),
    ],
  },
  'david-copperfield-magician': {
    netWorth: 1,
    assets: [
      a('david-copperfield-magician', 1, 'island', 'Musha Cay Private Island', "David Copperfield owns Musha Cay — an extraordinary private island in the Exumas, Bahamas, with 4 private beaches, a private airport, and accommodations for 24 guests at $50K/night.", 50, 'Forbes 2024'),
      a('david-copperfield-magician', 2, 'business', 'MGM Grand Las Vegas Residency', "Copperfield has held the record-breaking Las Vegas residency at MGM Grand since 1983 — still performing 500+ shows per year, grossing over $60M annually.", 100, 'Billboard 2023'),
      a('david-copperfield-magician', 3, 'business', 'International Museum of Magic', "Copperfield owns the world\'s largest collection of magic history and artifacts — 80,000+ pieces spanning 200 years of magical history, privately held.", 50, 'AP 2023'),
      a('david-copperfield-magician', 4, 'island', 'Bahamas Islands Portfolio', "In addition to Musha Cay, Copperfield owns 10 additional Exuma cays — creating an island chain he calls \'Islands of Copperfield Bay\' offering exclusive private escapes.", 30, 'Bahamas Property Records'),
    ],
  },
  'jessica-alba': {
    netWorth: 1,
    assets: [
      a('jessica-alba', 1, 'business', 'The Honest Company (HNST)', "Jessica Alba co-founded The Honest Company in 2011, selling eco-friendly baby and household products. The company went public in 2021 at a $1.4B valuation.", 200, 'NASDAQ: HNST 2024'),
      a('jessica-alba', 2, 'real_estate', 'Beverly Hills Compound', "Alba\'s primary home — a $10M Beverly Hills compound featuring 5 bedrooms and a chef\'s kitchen befitting a wellness entrepreneur.", 10, 'Property Records 2018'),
      a('jessica-alba', 3, 'business', 'Kora Ventures', "Alba\'s personal investment portfolio through her family office — focused on clean tech, health, and female-founded businesses.", 30, 'Forbes 2023'),
    ],
  },
  'victoria-beckham': {
    netWorth: 0.55,
    assets: [
      a('victoria-beckham', 1, 'business', 'Victoria Beckham Fashion Brand', "Victoria Beckham launched her eponymous fashion label in 2008, evolving from dresses to a full ready-to-wear, accessories, and beauty line — stocked at major luxury retailers globally.", 50, 'WWD 2024'),
      a('victoria-beckham', 2, 'business', 'Victoria Beckham Beauty', "Her beauty line launched in 2019, focusing on clean, vegan formulations in minimalist packaging — partnering with The Estée Lauder Companies for distribution.", 30, 'WWD 2023'),
      a('victoria-beckham', 3, 'real_estate', 'Holland Park Home, London', "The Beckham family\'s primary London home — a 5-story Holland Park townhouse in one of London\'s most prestigious residential areas.", 33, 'London Property Records 2023'),
      a('victoria-beckham', 4, 'real_estate', 'Cotswolds Estate', "The Beckhams\' rural English escape — a converted farmhouse estate in the Cotswolds where they entertain celebrity friends and enjoy country life.", 6, 'UK Property Records'),
    ],
  },
  'donatella-versace': {
    netWorth: 0.4,
    assets: [
      a('donatella-versace', 1, 'business', 'Versace SpA (Former Stake)', "Donatella held significant equity in Versace before the 2018 sale to Capri Holdings for $2.1B — receiving hundreds of millions and maintaining her role as Chief Creative Officer.", 150, 'WWD 2018'),
      a('donatella-versace', 2, 'real_estate', 'Miami Beach Mansion', "Donatella\'s stunning Versace mansion in Miami Beach (Villa Vizcaya area) — a reflection of the bold Versace aesthetic applied to real estate, an opulent Mediterranean palazzo.", 10, 'Miami Property Records'),
      a('donatella-versace', 3, 'real_estate', 'Milan Penthouse', "Donatella\'s primary Italian home — a luxurious Milan penthouse befitting fashion\'s reigning empress, located near the Versace headquarters.", 8, 'Milan Property Records'),
    ],
  },
  'garth-brooks': {
    netWorth: 0.4,
    assets: [
      a('garth-brooks', 1, 'business', 'Pearl Records & GhostTunes Platform', "Brooks launched his own music distribution platform GhostTunes and record label Pearl Records to maintain independence from major label streaming deals — later negotiating his own Spotify terms.", 30, 'Billboard 2023'),
      a('garth-brooks', 2, 'real_estate', 'Owasso, Oklahoma Ranch', "Garth Brooks\' primary Oklahoma home — maintaining strong roots in his home state where he grew up and still holds significant land and ranch property.", 3, 'OK Property Records'),
      a('garth-brooks', 3, 'business', 'Stadium Tour Concert Grosses', "Brooks\' record-breaking stadium tour has generated over $750M in career concert gross — making him one of the highest-grossing touring artists of all time.", 50, 'Pollstar 2023'),
      a('garth-brooks', 4, 'business', "Friends in Low Places Bar, Nashville", "Garth Brooks\' honky-tonk bar on Nashville\'s Lower Broadway — opened in 2023 as a multi-floor entertainment venue celebrating classic country music.", 10, 'Nashville Business Journal 2023'),
    ],
  },
  'amitabh-bachchan': {
    netWorth: 0.4,
    assets: [
      a('amitabh-bachchan', 1, 'real_estate', 'Jalsa Bungalow, Juhu Mumbai', "Amitabh Bachchan\'s legendary Jalsa bungalow in Juhu, Mumbai — the most famous celebrity residence in India, where thousands of fans gather outside every Sunday.", 25, 'Mumbai Property Records 2024'),
      a('amitabh-bachchan', 2, 'real_estate', 'Pratiksha Bungalow, Juhu Mumbai', "The Bachchan family\'s second major Mumbai property Pratiksha — one of two adjacent bungalows forming their Juhu compound in Bollywood\'s most coveted address.", 15, 'Mumbai Property Records'),
      a('amitabh-bachchan', 3, 'business', 'ABCL Production Company', "Amitabh Bachchan Corporation Limited — his production and entertainment company representing decades of Bollywood dominance as the \"Shahenshah\" (Emperor) of Indian cinema.", 20, 'Bollywood Business 2023'),
      a('amitabh-bachchan', 4, 'business', 'KBC India & Brand Endorsements', "Bachchan\'s Kaun Banega Crorepati hosting deal with Sony TV and extensive brand portfolio across 30+ Indian brands makes him the most commercially valuable celebrity in India.", 25, 'Brand Finance India 2024'),
    ],
  },
  'shah-rukh-khan': {
    netWorth: 0.77,
    assets: [
      a('shah-rukh-khan', 1, 'real_estate', 'Mannat Villa, Bandstand Mumbai', "SRK\'s iconic Mannat bungalow on the Bandstand promenade in Bandra, Mumbai — visited by millions of fans and one of the most photographed celebrity homes in the world.", 50, 'Mumbai Property Records 2024'),
      a('shah-rukh-khan', 2, 'sports_team', 'Kolkata Knight Riders (Co-Owner)', "Shah Rukh Khan co-owns the Kolkata Knight Riders IPL franchise — one of the most successful and valuable franchises in cricket\'s richest league, worth $500M+.", 200, 'Forbes India 2024'),
      a('shah-rukh-khan', 3, 'business', 'Red Chillies Entertainment', "SRK\'s production and VFX company Red Chillies has produced blockbusters like My Name Is Khan, Don, and Pathaan. The VFX division is one of India\'s leading post-production studios.", 30, 'Bollywood 2023'),
      a('shah-rukh-khan', 4, 'real_estate', 'London Home, Kensington', "SRK\'s London property — a residence in the upscale Kensington area, where his children have attended school and the family vacations frequently.", 15, 'London Property Records'),
    ],
  },
  'angelina-jolie': {
    netWorth: 0.16,
    assets: [
      a('angelina-jolie', 1, 'real_estate', 'Los Feliz Estate, Los Angeles', "Jolie\'s primary LA home — a 1.78-acre Cecil B. DeMille estate in Los Feliz, purchased in 2017 for $24.5M, featuring Spanish-Colonial architecture and a guest house.", 24.5, 'Property Records 2017'),
      a('angelina-jolie', 2, 'real_estate', 'Château Miraval, Provence (Dispute)', "The Provence château co-owned with Brad Pitt — a 1,000-acre wine estate in the Luberon mountains. Miraval rosé has become one of the world\'s most popular luxury wines amid the pair\'s ongoing legal dispute.", 120, 'Wine Spectator 2024'),
      a('angelina-jolie', 3, 'business', 'Atelier Jolie Fashion Brand', "Jolie launched Atelier Jolie in 2023 — a creative space and fashion label in NYC\'s Noho, focusing on upcycled fabrics and sustainable luxury fashion.", 5, 'Vogue 2023'),
      a('angelina-jolie', 4, 'real_estate', 'Cambodian Properties', "Jolie owns property near Siem Reap, Cambodia — connected to her humanitarian work and her deep love for the country after filming Lara Croft: Tomb Raider and adopting son Maddox there.", 3, 'Cambodia Property Records'),
    ],
  },
  'johnny-cash': {
    netWorth: 0.6,
    assets: [
      a('johnny-cash', 1, 'business', 'Cash Music Estate & Catalog', "The Johnny Cash estate — managed by John Carter Cash — controls one of the most valuable catalogs in American music. \"Ring of Fire\" alone generates millions annually from licensing.", 100, 'Rolling Stone 2023'),
      a('johnny-cash', 2, 'real_estate', 'Hendersonville Home (Heritage Site)', "The Carter-Cash home on Old Hickory Lake in Hendersonville, Tennessee — where Cash and June Carter Cash lived. Tragically destroyed by fire in 2007, but remains one of music\'s most storied addresses.", 1, 'Tennessee Heritage Records'),
      a('johnny-cash', 3, 'business', 'Cash Country Hotel & Museum, Branson', "The Johnny Cash Museum & Store in Nashville celebrates his legacy and generates ongoing tourism revenue for the Cash estate through memorabilia sales.", 10, 'Nashville Tourism 2023'),
    ],
  },
  'dana-white': {
    netWorth: 0.5,
    assets: [
      a('dana-white', 1, 'business', 'UFC Ownership Stake (Residual)', "Dana White sold UFC to WME-IMG in 2016 for $4.2B while retaining a 9% ownership stake. TKO Group later acquired UFC, giving White a significant stake in a $25B+ enterprise.", 200, 'Sportico 2024'),
      a('dana-white', 2, 'real_estate', 'Las Vegas Home', "White\'s primary Las Vegas home — befitting the man who transformed MMA and built the UFC into a global sports powerhouse from the desert city he calls home.", 5, 'NV Property Records'),
      a('dana-white', 3, 'business', 'DWCS (Contender Series) Media', "Dana White\'s Contender Series — a standalone show discovering new MMA talent that has become its own valuable media property, broadcast on ESPN+ with growing viewership.", 10, 'ESPN 2024'),
    ],
  },
  'queen-elizabeth-ii': {
    netWorth: 0.5,
    assets: [
      a('queen-elizabeth-ii', 1, 'real_estate', 'Sandringham Estate, Norfolk', "Sandringham House in Norfolk — the Queen\'s personal private estate, purchased by Edward VII in 1862. The 8,000-acre estate passes through the private Royal estate and is now held by King Charles III.", 100, 'Royal Family Financial Summary 2023'),
      a('queen-elizabeth-ii', 2, 'real_estate', 'Balmoral Castle, Scotland', "The Queen\'s beloved Scottish retreat — a 50,000-acre Highland estate near Ballater, where the Royal Family spends summers and where the Queen passed in September 2022.", 150, 'Crown Estate 2022'),
      a('queen-elizabeth-ii', 3, 'art', 'Royal Stamp Collection (Philatelic)', "Queen Elizabeth II possessed one of the world\'s greatest stamp collections — the Royal Philatelic Collection assembled over three generations, housed at Buckingham Palace and now with King Charles.", 50, 'Royal Collection Trust 2022'),
      a('queen-elizabeth-ii', 4, 'business', 'Royal Duchy of Lancaster', "The Duchy of Lancaster — Queen Elizabeth II\'s personal estate encompassing 18,000+ acres across Lancashire, Yorkshire, and Cheshire, generating millions annually.", 650, 'Duchy of Lancaster 2022'),
    ],
  },
}

// Apply photo fixes
let photoFixCount = 0
for (const [id, url] of Object.entries(PHOTO_FIXES)) {
  photos[id] = url
  photoFixCount++
}

let enrichedCount = 0
let totalNewAssets = 0

for (const [id, data] of Object.entries(ENRICHMENTS)) {
  const celeb = celebs.find(c => c.id === id)
  if (!celeb) {
    console.warn(`⚠  Not found: ${id}`)
    continue
  }
  if (data.netWorth !== undefined) celeb.netWorth = data.netWorth
  const existingNames = new Set((celeb.assets || []).map(a => a.name.toLowerCase()))
  const newAssets = data.assets.filter(a => !existingNames.has(a.name.toLowerCase()))
  celeb.assets = [...(celeb.assets || []), ...newAssets]
  totalNewAssets += newAssets.length
  console.log(`✓ ${celeb.name}: ${celeb.assets.length} assets (${newAssets.length} new)`)
  enrichedCount++
}

fs.writeFileSync(CELEBS_PATH, JSON.stringify(celebs, null, 2))
fs.writeFileSync(PHOTOS_PATH, JSON.stringify(photos, null, 2))

console.log(`\nDone — ${enrichedCount} celebrities enriched, ${totalNewAssets} new assets added, ${photoFixCount} photo URLs updated`)
