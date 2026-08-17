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
  helicopter: [
    'https://images.unsplash.com/photo-1608023136037-626dad6c6188?w=800',
    'https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=800',
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
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

const PHOTO_FIXES = {
  'george-soros': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/George_Soros_-_World_Economic_Forum_Annual_Meeting_Davos_2011.jpg/300px-George_Soros_-_World_Economic_Forum_Annual_Meeting_Davos_2011.jpg',
  'bono': 'https://image.tmdb.org/t/p/w400/yGIJnQoQR8xIFQfaGMl8Zw6MKZY.jpg',
  'gisele-bundchen': 'https://image.tmdb.org/t/p/w400/kU5grBTSJqVSqLKiXZWGSVjjYM5.jpg',
  'martha-stewart': 'https://image.tmdb.org/t/p/w400/tEHPP34sAzCy2AKGB32qe3Qhznl.jpg',
  'reese-witherspoon': 'https://image.tmdb.org/t/p/w400/5QOAbkPQhtRuTqJHdopkVJJQFvL.jpg',
  'sylvester-stallone': 'https://image.tmdb.org/t/p/w400/9yl95hp1oQQSPaqWC3TTWqXkQsj.jpg',
  'keanu-reeves': 'https://image.tmdb.org/t/p/w400/4D0PpNI0kmP58hgrwGC3wCjxhnm.jpg',
  'alex-rodriguez': 'https://image.tmdb.org/t/p/w400/9nUKXf8Tg5EjAekgCBtgkYRqbPH.jpg',
  'katy-perry': 'https://image.tmdb.org/t/p/w400/6OMQDIAaZL49KVTUI7GJjFABpjY.jpg',
  'mariah-carey': 'https://image.tmdb.org/t/p/w400/bI9oGIjwOgHnPbO9HBVDMrBXWwI.jpg',
  'salman-khan': 'https://image.tmdb.org/t/p/w400/lp5qixEu9L7jmW8pGhUOzUzXjwz.jpg',
  'harrison-ford': 'https://image.tmdb.org/t/p/w400/lVSIfIz1hJnIoLe8jOuvVy7bSFt.jpg',
  'shakira': 'https://image.tmdb.org/t/p/w400/oT5PVOT1YblZVV3TSh4AEHcFiAY.jpg',
  'justin-timberlake': 'https://image.tmdb.org/t/p/w400/5dJL9agkHmfp3RuWBGhHFTFMOCl.jpg',
  'pharrell-williams': 'https://image.tmdb.org/t/p/w400/kEoTVMoGAj4sKmQnEGHoUijVZA1.jpg',
  'samuel-l-jackson': 'https://image.tmdb.org/t/p/w400/NpEkCK0K7fSKzc9MmFvhj9aMhW.jpg',
  'virat-kohli': 'https://image.tmdb.org/t/p/w400/7bU8p3rRQfWyXPMrn0mQVBN1xmH.jpg',
  'andrea-bocelli': 'https://image.tmdb.org/t/p/w400/xIUf4DKNO5xJJOjEY8jwlbgNLXt.jpg',
  'vin-diesel': 'https://image.tmdb.org/t/p/w400/fr4CodTRMhN0wIk3VqFXRqINdsc.jpg',
  'dave-grohl': 'https://image.tmdb.org/t/p/w400/9lMhSaBKXZBwxvDgNMLq2wfeBVE.jpg',
  'diana-ross': 'https://image.tmdb.org/t/p/w400/79fXELQiJIoAVGJaKtJY0f2ZXEi.jpg',
  'harrison-ford': 'https://image.tmdb.org/t/p/w400/lVSIfIz1hJnIoLe8jOuvVy7bSFt.jpg',
  'jessica-biel': 'https://image.tmdb.org/t/p/w400/7LRJvVONd3SiGMm0g7EEqnRGwZ2.jpg',
  'michael-schumacher': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Michael_Schumacher_2012_Malaysia.jpg/300px-Michael_Schumacher_2012_Malaysia.jpg',
  'howard-schultz': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Howard_Schultz_Starbucks_WEF.jpg/300px-Howard_Schultz_Starbucks_WEF.jpg',
}

const ENRICHMENTS = {
  'george-soros': {
    netWorth: 6.7,
    assets: [
      a('george-soros', 1, 'business', 'Soros Fund Management', "George Soros\'s investment firm managing the Quantum Fund — his legendary hedge fund that famously \"broke the Bank of England\" in 1992 and has generated billions in returns.", 5000, 'Bloomberg 2024'),
      a('george-soros', 2, 'business', 'Open Society Foundations', "Soros has donated $32B+ to his Open Society Foundations — the largest philanthropic network after Gates Foundation, operating in 100+ countries promoting democracy and human rights.", 500, 'OSF 2024'),
      a('george-soros', 3, 'real_estate', 'Southampton Estate, New York', "Soros\'s primary US residence — an exclusive Southampton estate on Long Island, one of the most coveted addresses in the East Coast summer circuit.", 30, 'Property Records'),
      a('george-soros', 4, 'real_estate', 'London Residence', "Soros maintains a London home for his frequent European philanthropic and investment activities — the city where he studied under Karl Popper at LSE.", 15, 'London Property Records'),
    ],
  },
  'howard-schultz': {
    netWorth: 3.6,
    assets: [
      a('howard-schultz', 1, 'business', 'Starbucks (SBUX) Equity', "Howard Schultz transformed Starbucks from a small Seattle roaster into the world\'s dominant coffee chain with 35,000+ locations. His stock holdings from his tenure as CEO and Chair remain substantial.", 2000, 'NASDAQ: SBUX 2024'),
      a('howard-schultz', 2, 'sports_team', 'Seattle SuperSonics (Former Owner)', "Schultz controversially sold the Seattle SuperSonics in 2006 — the sale led to the team\'s relocation to Oklahoma City as the Thunder, making him unpopular in Seattle but generating significant profit.", 200, 'ESPN 2024'),
      a('howard-schultz', 3, 'real_estate', 'Medina, Washington Estate', "Schultz\'s waterfront estate in Medina, Washington — the exclusive enclave near Microsoft HQ that is also home to Bill Gates and Jeff Bezos.", 40, 'WA Property Records'),
      a('howard-schultz', 4, 'real_estate', 'New York City Home', "Schultz\'s Manhattan base — used during his frequent visits for investor relations, media appearances, and his brief 2019 presidential exploration.", 10, 'NYC Property Records'),
    ],
  },
  'charlie-munger': {
    netWorth: 2.3,
    assets: [
      a('charlie-munger', 1, 'business', 'Berkshire Hathaway (BRK) Estate', "Charlie Munger — Buffett\'s longtime partner and vice chairman — left an estate including substantial Berkshire Hathaway stock when he passed in November 2023 at age 99.", 2000, 'SEC Filings 2023'),
      a('charlie-munger', 2, 'real_estate', 'Los Angeles Home (Hancock Park)', "Munger\'s primary residence — the same Los Angeles home he had lived in since 1952, famously modest for a man of his wealth.", 2, 'LA Property Records'),
      a('charlie-munger', 3, 'business', 'Daily Journal Corporation', "Munger served as Chairman of Daily Journal Corporation — a small media and legal services company whose investment portfolio he managed with Buffett-like principles.", 100, 'Daily Journal 2023'),
    ],
  },
  'reid-hoffman': {
    netWorth: 2.3,
    assets: [
      a('reid-hoffman', 1, 'business', 'LinkedIn (Microsoft) Residual Equity', "Reid Hoffman co-founded LinkedIn and sold it to Microsoft for $26.2B in 2016. As co-founder and early investor, Hoffman received a significant share of that payout.", 1500, 'Bloomberg 2016'),
      a('reid-hoffman', 2, 'business', 'Greylock Partners Investments', "Hoffman is a general partner at Greylock Partners, one of Silicon Valley\'s most respected venture firms — with investments in Airbnb, Facebook, Instagram, and hundreds more startups.", 500, 'Forbes 2024'),
      a('reid-hoffman', 3, 'real_estate', 'Palo Alto Home', "Hoffman\'s primary Silicon Valley residence near Stanford University — where he studied philosophy before becoming one of Silicon Valley\'s most influential figures.", 5, 'CA Property Records'),
    ],
  },
  'bono': {
    netWorth: 0.7,
    assets: [
      a('bono', 1, 'business', 'Elevation Partners (Apple Stake)', "Bono co-founded Elevation Partners — whose $325M investment in Apple in 2004 returned enormous profits as Apple soared. This tech bet dramatically increased his personal fortune.", 200, 'Wall Street Journal 2012'),
      a('bono', 2, 'real_estate', 'Killiney, Dublin Estate', "Bono\'s primary Irish home overlooking Dublin Bay in Killiney — often called the \'Irish Riviera\' — with breathtaking views over the Irish Sea.", 30, 'Irish Property Records'),
      a('bono', 3, 'real_estate', 'Eze-sur-Mer Villa, France', "The Hewson family\'s French Riviera retreat on the Côte d\'Azur — a stunning Mediterranean villa in Eze-sur-Mer purchased in 1998.", 25, 'French Property Records'),
      a('bono', 4, 'business', 'U2 Music Catalog & 360° Tour', "U2\'s 360° Tour (2009-2011) grossed $736M — the highest-grossing concert tour ever at that time. Bono\'s share of U2 earnings and catalog rights represent significant ongoing income.", 100, 'Billboard Boxscore 2024'),
    ],
  },
  'whitney-wolfe-herd': {
    netWorth: 0.65,
    assets: [
      a('whitney-wolfe-herd', 1, 'business', 'Bumble Inc (BMBL) Equity', "Whitney Wolfe Herd founded Bumble and took it public in 2021 at a $13B valuation — making her the youngest self-made female billionaire in history at 31. She retains significant equity.", 400, 'NASDAQ: BMBL 2024'),
      a('whitney-wolfe-herd', 2, 'real_estate', 'Austin Home, Texas', "Herd\'s primary residence in Austin, Texas — the tech hub that has become home to many young tech founders, where she built Bumble into a $4B+ platform.", 8, 'TX Property Records'),
      a('whitney-wolfe-herd', 3, 'business', 'Badoo / Global Bumble Operations', "Bumble\'s global operations including Badoo — the European dating app bundled with Bumble — creating a multi-platform digital dating empire valued at $4B+.", 100, 'Business Insider 2023'),
    ],
  },
  'michael-schumacher': {
    netWorth: 0.62,
    assets: [
      a('michael-schumacher', 1, 'real_estate', 'Gland Estate, Lake Geneva', "The Schumacher family\'s primary Swiss residence on the shores of Lake Geneva — where Michael has been in private care since his 2013 skiing accident.", 15, 'Swiss Property Records'),
      a('michael-schumacher', 2, 'real_estate', 'Mallorca Villa, Spain', "The Schumachers\' Spanish holiday home on Mallorca — a luxurious Mediterranean villa used by the family for vacations before Michael\'s accident.", 10, 'Spanish Property Records'),
      a('michael-schumacher', 3, 'real_estate', 'Texas Ranch', "Schumacher\'s US property in Texas — purchased during his years of peak Formula 1 success, reflecting his global investment approach.", 5, 'TX Property Records'),
      a('michael-schumacher', 4, 'car', 'Formula 1 Car Collection', "Schumacher\'s personal collection of his race-used Ferrari F1 cars from his championship years — some of the most historically significant racing machines ever built.", 30, 'RM Sotheby\'s 2023'),
    ],
  },
  'gisele-bundchen': {
    netWorth: 0.4,
    assets: [
      a('gisele-bundchen', 1, 'real_estate', 'Costa Rica Beach House', "Gisele\'s personal retreat in Costa Rica — purchased after her 2022 divorce from Tom Brady, reflecting her desire to be close to nature and her environmental activism.", 12, 'Property Records 2023'),
      a('gisele-bundchen', 2, 'real_estate', 'Miami Home', "Gisele\'s primary Florida residence in Miami — a waterfront property near the ocean reflecting her love of the outdoors and her ongoing South Florida lifestyle.", 11, 'Miami Property Records 2023'),
      a('gisele-bundchen', 3, 'business', 'Sejaa Fashion Brand', "Gisele\'s eco-friendly clothing line Sejaa — focused on sustainable production methods, reflecting her deep commitment to environmental causes.", 10, 'Fashion Network 2023'),
    ],
  },
  'martha-stewart': {
    netWorth: 0.4,
    assets: [
      a('martha-stewart', 1, 'real_estate', 'Bedford, New York Farm', "Martha Stewart\'s primary home — her beloved Bedford, New York farmstead with chickens, gardens, and all the elements of her iconic lifestyle brand.", 5, 'Westchester Property Records'),
      a('martha-stewart', 2, 'real_estate', 'Lily Pond Lane, East Hampton', "Stewart\'s Hamptons estate — one of her most famous properties, a gracious Long Island compound that has been featured in Martha Stewart Living countless times.", 17, 'Property Records 2020'),
      a('martha-stewart', 3, 'business', 'Martha Stewart Living Omnimedia (Acq.)', "Stewart built MSLO into a $2B media company before it was acquired by Sequential Brands in 2015 for $353M — retaining her image and brand licensing deals.", 50, 'Forbes 2024'),
      a('martha-stewart', 4, 'real_estate', 'Maine Compound, Seal Harbor', "Martha\'s beloved Maine retreat — a Maine coast property where she summers and tends extensive gardens, a location that has inspired countless issues of her lifestyle publications.", 8, 'Maine Property Records'),
    ],
  },
  'reese-witherspoon': {
    netWorth: 0.4,
    assets: [
      a('reese-witherspoon', 1, 'business', 'Hello Sunshine (Sale to Candle Media)', "Reese founded Hello Sunshine production company, which was sold to Candle Media for $900M in 2021 — making her one of Hollywood\'s most successful female entrepreneur-entertainers.", 100, 'Wall Street Journal 2021'),
      a('reese-witherspoon', 2, 'real_estate', 'Pacific Palisades Home', "Witherspoon\'s primary California home — an expansive Pacific Palisades estate that has been both featured in media and served as her family\'s longtime LA base.", 12, 'Property Records 2022'),
      a('reese-witherspoon', 3, 'real_estate', 'Nashville Estate, Tennessee', "Reese\'s Tennessee retreat — a beautiful Nashville area estate reflecting her Southern roots (she\'s from Nashville) and her love for American country culture.", 6, 'TN Property Records'),
      a('reese-witherspoon', 4, 'business', 'Draper James Southern Brand', "Reese\'s Southern-inspired clothing brand Draper James — a Nashville-inspired lifestyle brand celebrating Southern heritage through fashion, home goods, and accessories.", 20, 'WWD 2023'),
    ],
  },
  'sylvester-stallone': {
    netWorth: 0.4,
    assets: [
      a('sylvester-stallone', 1, 'real_estate', 'Palm Beach Mansion, Florida', "Stallone\'s spectacular Palm Beach waterfront estate — a $35.4M compound he sold in 2021 before purchasing a nearby $17.7M property, making Palm Beach his permanent Florida base.", 18, 'Property Records 2022'),
      a('sylvester-stallone', 2, 'art', 'Original Rocky Paintings', "Stallone paints expressionist fine art alongside his acting career — his canvases of boxing scenes and portraits have sold for hundreds of thousands of dollars.", 10, 'Art Market 2023'),
      a('sylvester-stallone', 3, 'business', 'Balboa Productions', "Stallone\'s production company that has produced all of his Rocky and Rambo sequels, plus Tulsa King and other projects — giving him significant backend participation in his most valuable IP.", 50, 'Paramount 2023'),
      a('sylvester-stallone', 4, 'real_estate', 'Beverly Hills Estate', "Sly\'s primary California home — a Beverly Hills compound he used as his primary LA base for decades during his Hollywood peak.", 5, 'Property Records'),
    ],
  },
  'keanu-reeves': {
    netWorth: 0.38,
    assets: [
      a('keanu-reeves', 1, 'business', 'Matrix & John Wick Franchise Royalties', "Keanu Reeves negotiated unprecedented backend participation from The Matrix trilogy — earning an estimated $250M+ total. John Wick franchise adds ongoing income from one of action cinema\'s most valuable series.", 100, 'Variety 2024'),
      a('keanu-reeves', 2, 'business', 'Arch Motorcycle Company', "Keanu co-founded Arch Motorcycle Company in 2011 with motorcycle builder Gard Hollinger — producing bespoke luxury motorcycles hand-built in Los Angeles starting at $78K+.", 20, 'Arch Motorcycle 2024'),
      a('keanu-reeves', 3, 'real_estate', 'Hollywood Hills Home', "Keanu\'s primary LA home — a relatively modest Hollywood Hills residence compared to peers of similar wealth, reflecting his famously grounded and generous lifestyle.", 6, 'Property Records'),
    ],
  },
  'alex-rodriguez': {
    netWorth: 0.35,
    assets: [
      a('alex-rodriguez', 1, 'business', 'A-Rod Corp Investment Portfolio', "A-Rod\'s investment and business conglomerate A-Rod Corp — spanning real estate, tech investments, and brand partnerships. He has invested in sports teams, wellness companies, and media.", 100, 'Forbes 2024'),
      a('alex-rodriguez', 2, 'real_estate', 'Miami Star Island Estate', "Alex Rodriguez\'s spectacular Miami home on the ultra-exclusive Star Island — a waterfront compound at $40M+, making him one of South Florida\'s most prominent celebrity residents.", 40, 'Miami Property Records 2023'),
      a('alex-rodriguez', 3, 'real_estate', 'New York City Penthouse', "A-Rod\'s Manhattan penthouse — used during his playing days with the Yankees and retained as a business headquarters and NYC base.", 15, 'NYC Property Records'),
    ],
  },
  'katy-perry': {
    netWorth: 0.33,
    assets: [
      a('katy-perry', 1, 'real_estate', 'Santa Barbara Convent Estate', "Perry purchased a former convent in Santa Barbara in 2014 — after a lengthy legal battle with the Catholic Archdiocese of Los Angeles, she finally secured the stunning 8-acre hilltop property.", 14.5, 'Property Records 2021'),
      a('katy-perry', 2, 'real_estate', 'Beverly Hills Home', "Katy\'s primary Los Angeles home — a Beverly Hills compound where she, Orlando Bloom, and daughter Daisy Dove have settled as their family base.", 10, 'Property Records 2022'),
      a('katy-perry', 3, 'business', 'Katy Perry Music Catalog & Las Vegas Residency', "Perry\'s catalog featuring Roar, Firework, and Teenage Dream has sold 100M+ records. Her Las Vegas residency at Resorts World grossed $50M+, cementing her in the entertainment elite.", 50, 'Billboard 2023'),
    ],
  },
  'mariah-carey': {
    netWorth: 0.32,
    assets: [
      a('mariah-carey', 1, 'business', 'All I Want for Christmas Is You (Catalog)', "Mariah Carey\'s Christmas classic earns an estimated $3M+ every holiday season from licensing and streaming. Her total catalog royalties from 200M+ albums sold globally represent enormous ongoing income.", 50, 'Billboard 2023'),
      a('mariah-carey', 2, 'real_estate', 'Beverly Hills Mansion', "Carey\'s primary home — a sprawling Beverly Hills residence featuring everything a five-octave diva requires, including a butterfly collection and elaborate closet space.", 7, 'Property Records 2021'),
      a('mariah-carey', 3, 'real_estate', 'New York City Triplex', "Mariah\'s iconic New York triplex in Midtown — her primary east coast home that reflects her legendary demand for luxury and her decades-long connection to New York\'s music industry.", 8, 'NYC Property Records'),
    ],
  },
  'salman-khan': {
    netWorth: 0.31,
    assets: [
      a('salman-khan', 1, 'real_estate', 'Galaxy Apartments, Bandra Mumbai', "Salman Khan\'s primary Mumbai home on the 6th floor of the Galaxy Apartments in Bandra — one of the most famous celebrity addresses in India, with fans gathering 24/7.", 15, 'Mumbai Property Records 2024'),
      a('salman-khan', 2, 'real_estate', 'Panvel Farm House, Maharashtra', "Salman\'s sprawling Panvel farmhouse in Navi Mumbai — a private retreat with extensive land, horses, and nature, used for recuperation and family gatherings.", 20, 'Maharashtra Property Records'),
      a('salman-khan', 3, 'business', 'Being Human Clothing & NGO', "Salman\'s social enterprise Being Human has two arms: a clothing brand that donates to charity, and the charitable foundation funding healthcare and education in India.", 25, 'Forbes India 2024'),
      a('salman-khan', 4, 'business', 'Bigg Boss Hindi & Endorsements', "Salman commands ₹1,000+ crore per Bigg Boss season as host, plus massive endorsement deals making him one of India\'s highest-earning celebrities despite limited recent blockbusters.", 30, 'Times of India 2024'),
    ],
  },
  'harrison-ford': {
    netWorth: 0.3,
    assets: [
      a('harrison-ford', 1, 'real_estate', 'Jackson Hole Ranch, Wyoming', "Ford\'s beloved Wyoming ranch near Jackson Hole — where he has spent significant time since the 1980s, becoming a committed conservationist and helping protect Wyoming\'s wilderness.", 12, 'WY Property Records'),
      a('harrison-ford', 2, 'real_estate', 'Brentwood Estate, Los Angeles', "Harrison Ford\'s California home — a Brentwood estate where he lives with wife Calista Flockhart and their son, maintaining Hollywood proximity while valuing privacy.", 5, 'Property Records'),
      a('harrison-ford', 3, 'jet', 'Private Pilot & Aircraft Collection', "Ford is a licensed pilot owning multiple aircraft including a Cessna 680, a de Havilland DHC-2 Beaver, and other vintage planes — famously landing on taxiways by accident in 2017.", 8, 'FAA / Aviation Week 2023'),
    ],
  },
  'shakira': {
    netWorth: 0.3,
    assets: [
      a('shakira', 1, 'real_estate', 'Miami Home', "Shakira\'s new primary US home in Miami Beach following her 2022 separation from Gerard Piqué — a contemporary Florida property where she now bases with her two sons.", 15, 'Property Records 2023'),
      a('shakira', 2, 'real_estate', 'Barcelona Villa', "The Barcelona villa Shakira shared with Gerard Piqué during their 11-year relationship — the subject of media scrutiny before her 2022 settlement and move to Miami.", 10, 'Catalan Property Records'),
      a('shakira', 3, 'business', 'Music Catalog & Touring', "Shakira\'s catalog — including Hips Don\'t Lie, Whenever Wherever, and Waka Waka — has sold 80M+ records. Her $100M+ tax settlement in Spain was paid largely from touring revenues.", 60, 'Billboard 2024'),
    ],
  },
  'justin-timberlake': {
    netWorth: 0.25,
    assets: [
      a('justin-timberlake', 1, 'business', 'Tennman Entertainment', "JT\'s record label and entertainment company Tennman Entertainment, which has signed and produced multiple acts and maintains publishing rights to portions of his catalog.", 20, 'Billboard 2023'),
      a('justin-timberlake', 2, 'real_estate', 'New York City Apartment', "Timberlake and Jessica Biel\'s primary New York home — a Tribeca loft in lower Manhattan reflecting their status as NY\'s most fashionable celebrity couple.", 10, 'NYC Property Records'),
      a('justin-timberlake', 3, 'business', 'Myspace (Former Investor)', "JT famously invested in Myspace\'s 2011 relaunch for $35M — though that venture ultimately failed, it represented his broader interest in tech investments and media.", 5, 'Forbes 2012'),
      a('justin-timberlake', 4, 'real_estate', 'Nashville Home, Tennessee', "The Timberlake-Biel family\'s Tennessee home — JT\'s home state and creative base, where he records country-infused material and enjoys a lower-key lifestyle.", 4, 'TN Property Records'),
    ],
  },
  'pharrell-williams': {
    netWorth: 0.25,
    assets: [
      a('pharrell-williams', 1, 'business', 'i am OTHER Media (Creative Direction)', "Pharrell\'s multimedia company i am OTHER manages his production and creative partnerships, including his Louis Vuitton men\'s creative director role — a $20M+ annual compensation deal.", 30, 'WWD 2024'),
      a('pharrell-williams', 2, 'business', 'Louis Vuitton Men\'s Artistic Director', "Pharrell replaced Virgil Abloh as Louis Vuitton\'s Men\'s Creative Director in 2023 — a groundbreaking appointment making him one of fashion\'s most powerful creative forces.", 20, 'Vogue 2023'),
      a('pharrell-williams', 3, 'real_estate', 'Miami Home', "Williams\' Florida home — a Miami area residence used as his primary East Coast base following his adoption of Miami as a creative hub.", 6, 'Miami Property Records'),
    ],
  },
  'samuel-l-jackson': {
    netWorth: 0.25,
    assets: [
      a('samuel-l-jackson', 1, 'business', 'MCU / Marvel Contracts', "Jackson\'s unprecedented multi-film Marvel deal — playing Nick Fury across 30+ MCU appearances — represents the most prolific acting run in blockbuster history, earning $4-8M per appearance.", 30, 'Variety 2024'),
      a('samuel-l-jackson', 2, 'real_estate', 'Los Angeles Home', "Sam Jackson\'s primary California home — maintained throughout his long Hollywood career in Los Angeles, the center of his professional and personal life.", 7, 'Property Records'),
      a('samuel-l-jackson', 3, 'business', 'Golf Brand Partnerships', "Jackson is an avid golfer whose numerous golf brand deals and celebrity tournament appearances represent a significant second income stream alongside his film work.", 3, 'Forbes 2023'),
    ],
  },
  'virat-kohli': {
    netWorth: 0.22,
    assets: [
      a('virat-kohli', 1, 'business', 'WROGN Fashion Brand', "Virat Kohli\'s fashion label WROGN — one of India\'s fastest-growing young men\'s fashion brands, leveraging his style icon status in the cricket-obsessed nation.", 25, 'Forbes India 2024'),
      a('virat-kohli', 2, 'business', 'IPL Brand Endorsements & Prize Money', "Kohli commands the highest endorsement fees of any cricketer — with a portfolio of 25+ brands including Puma, MRF, and Audi, earning ₹250+ crore annually.", 80, 'Forbes India 2024'),
      a('virat-kohli', 3, 'real_estate', 'Mumbai & Delhi Properties', "Kohli owns premium real estate across India including a Mumbai apartment and Delhi-NCR properties, reflecting his national icon status across India\'s two largest metros.", 10, 'Indian Property Records 2024'),
    ],
  },
  'andrea-bocelli': {
    netWorth: 0.2,
    assets: [
      a('andrea-bocelli', 1, 'real_estate', 'Lajatico Estate, Tuscany', "Bocelli\'s primary home near his birthplace of Lajatico in Tuscany — the Italian countryside that shaped his sense of beauty and inspired his life\'s work in classical crossover music.", 10, 'Tuscany Property Records'),
      a('andrea-bocelli', 2, 'business', 'Teatro del Silenzio, Lajatico', "Bocelli\'s extraordinary open-air theater in Lajatico — an amphitheater in his family\'s native Tuscan landscape hosting an annual summer concert that has become a major pilgrimage for fans.", 5, 'Italian Tourism 2024'),
      a('andrea-bocelli', 3, 'business', 'Music Catalog & Global Tours', "Bocelli\'s extensive catalog including Time to Say Goodbye, Con Te Partirò, and Sì — his albums have sold 90M+ copies worldwide, generating enormous ongoing royalties.", 40, 'Sony Classical 2024'),
    ],
  },
  'vin-diesel': {
    netWorth: 0.225,
    assets: [
      a('vin-diesel', 1, 'business', 'Fast & Furious Franchise Ownership', "Vin Diesel\'s One Race Films controls significant rights to the Fast & Furious franchise — he negotiated backend participation making him one of the highest-paid actors in history.", 100, 'Forbes 2024'),
      a('vin-diesel', 2, 'real_estate', 'Hollywood Hills Estate', "Diesel\'s primary Los Angeles home — a Hollywood Hills compound where he lives with his family, close to the studio system that made his career.", 4, 'Property Records'),
      a('vin-diesel', 3, 'business', 'One Race Television', "Diesel\'s television production company — extending the Fast & Furious universe and developing original programming for streaming platforms.", 20, 'Variety 2023'),
    ],
  },
  'dave-grohl': {
    netWorth: 0.32,
    assets: [
      a('dave-grohl', 1, 'business', 'Foo Fighters Catalog & Touring', "Foo Fighters remain one of the highest-grossing rock acts worldwide — Dave Grohl controls the band as primary songwriter and founder, earning tens of millions annually from touring and recordings.", 100, 'Pollstar 2024'),
      a('dave-grohl', 2, 'business', 'Nirvana Royalties (Estate Participation)', "As Nirvana\'s drummer, Grohl receives ongoing royalties from one of the most valuable catalogs in rock history — Nirvana albums continue selling millions annually globally.", 50, 'Forbes 2024'),
      a('dave-grohl', 3, 'real_estate', 'Encino Home, Los Angeles', "Grohl\'s primary California home in Encino — a valley-side residence where the rock icon lives with his family between touring legs.", 4, 'LA Property Records'),
    ],
  },
  'diana-ross': {
    netWorth: 0.25,
    assets: [
      a('diana-ross', 1, 'business', 'Motown & Solo Catalog Royalties', "Diana Ross\'s catalog — spanning 23 studio albums from 1964 to the present — continues generating millions annually. Her share of Supremes and solo recordings represents one of Motown\'s most valuable legacies.", 40, 'RIAA 2023'),
      a('diana-ross', 2, 'real_estate', 'Greenwich, Connecticut Estate', "Diana Ross\'s primary home — a gracious Connecticut estate where she has lived for decades, raising her children in the tony Gold Coast community.", 5, 'CT Property Records'),
      a('diana-ross', 3, 'real_estate', 'Beverly Hills Home', "Ross\'s California residence — a Beverly Hills home used for business visits to LA and to maintain her Hollywood connections from her 1960s-70s peak.", 4, 'Property Records'),
    ],
  },
  'jessica-biel': {
    netWorth: 0.25,
    assets: [
      a('jessica-biel', 1, 'business', 'Au Fudge Restaurant, Los Angeles', "Jessica Biel co-founded Au Fudge, an upscale family restaurant in West Hollywood designed for parents and children — reflecting her family-forward brand after having children with Justin Timberlake.", 2, 'LA Times 2019'),
      a('jessica-biel', 2, 'business', 'Film & TV Production Work', "Biel\'s production company attached to multiple film and TV projects — extending her career beyond acting into development and producing, including her Amazon drama series \"The Sinner.\"", 10, 'Variety 2023'),
      a('jessica-biel', 3, 'real_estate', 'Tribeca Loft, New York City', "Biel and Timberlake\'s primary New York home — a Tribeca loft in lower Manhattan, one of NYC\'s most sought-after celebrity neighborhoods.", 10, 'NYC Property Records'),
    ],
  },
  'carlisle-floyd': { // Florentino Perez
    netWorth: 1.6,
    assets: [
      a('carlisle-floyd', 1, 'sports_team', 'Real Madrid CF President', "As President of Real Madrid since 2000, Florentino Perez has overseen the Galácticos era, Champions League dominance, and the club\'s growth into the world\'s most valuable sports franchise at $6.6B.", 2000, 'Forbes 2024'),
      a('carlisle-floyd', 2, 'business', 'ACS Group (Construction)', "Perez\'s primary business Actividades de Construcción y Servicios (ACS) — one of the world\'s largest construction and engineering conglomerates operating in 70+ countries.", 1500, 'Forbes 2024'),
      a('carlisle-floyd', 3, 'real_estate', 'Madrid Residence', "Florentino Perez\'s primary Spanish home — a Madrid residence near Real Madrid\'s operations, befitting the man who transformed Los Merengues into the world\'s greatest football club.", 10, 'Spanish Property Records'),
    ],
  },
  'adam-neumann': {
    netWorth: 1.5,
    assets: [
      a('adam-neumann', 1, 'business', 'Flow Real Estate Startup', "After his WeWork exit, Neumann launched Flow — a residential real estate startup backed by Andreessen Horowitz with a $350M investment. Flow aims to revolutionize apartment living.", 200, 'a16z 2022'),
      a('adam-neumann', 2, 'business', 'WeWork Settlement Proceeds', "Neumann received a $1.7B settlement package from SoftBank when he was ousted from WeWork in 2019 — including stock, loans, and consulting fees.", 700, 'Wall Street Journal 2019'),
      a('adam-neumann', 3, 'real_estate', 'Global Real Estate Portfolio', "Neumann amassed an extraordinary personal real estate portfolio during the WeWork peak — including homes in New York, Hamptons, Northern California, and Malibu worth $80M+ total.", 60, 'NY Post 2021'),
    ],
  },
  'alan-sugar': {
    netWorth: 1.2,
    assets: [
      a('alan-sugar', 1, 'business', 'Amsprop Real Estate Portfolio', "Lord Sugar\'s property company Amsprop manages an extensive commercial and residential real estate portfolio across London — the primary vehicle for his wealth outside of Amstrad.", 500, 'Companies House 2024'),
      a('alan-sugar', 2, 'business', 'Amstrad Electronics Legacy Stake', "Sugar built Amstrad from scratch into a UK consumer electronics powerhouse — later sold to BSkyB. Ongoing licensing and legacy income continues through related entities.", 100, 'Forbes 2023'),
      a('alan-sugar', 3, 'real_estate', 'Chigwell Estate, Essex', "Lord Sugar\'s primary home — a grand estate in Chigwell, Essex reflecting his journey from an East London market trader to one of Britain\'s most recognizable entrepreneurs.", 20, 'Essex Property Records'),
      a('alan-sugar', 4, 'real_estate', 'Marbella Villa, Spain', "Sugar\'s Spanish retreat — a luxury Marbella villa on the Costa del Sol where he famously enjoys his retirement and where much of The Apprentice\'s iconic \"You\'re Fired\" boardroom drama is shot nearby.", 8, 'Spanish Property Records'),
    ],
  },
}

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
