#!/usr/bin/env node
'use strict'
const fs = require('fs')

const CELEBS_PATH = 'public/data/celebs.json'
const PHOTOS_PATH = 'public/data/photosCache.json'

const celebs = JSON.parse(fs.readFileSync(CELEBS_PATH, 'utf8'))
const photos = JSON.parse(fs.readFileSync(PHOTOS_PATH, 'utf8'))

// Pool of real Unsplash-style images per asset type
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
  helicopter: [
    'https://images.unsplash.com/photo-1608023136037-626dad6c6188?w=800',
    'https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=800',
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
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

function imgs(type) {
  const pool = IMGS[type] || IMGS.real_estate
  return [...pool]
}

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

// Photo URL fixes (replace broken Instagram/Facebook/Reddit/Etsy CDN links)
const PHOTO_FIXES = {
  'michael-jordan': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Michael_Jordan_in_2014.jpg/300px-Michael_Jordan_in_2014.jpg',
  'scarlett-johansson': 'https://image.tmdb.org/t/p/w400/6NqxuALiC1TjKNJFeBHlNPSd5qb.jpg',
  'kobe-bryant': 'https://image.tmdb.org/t/p/w400/iGHkd9sLcBWL4tBmkXmJBzJsNxk.jpg',
  'novak-djokovic': 'https://image.tmdb.org/t/p/w400/4jJyGh4Ak2Gqnv1oQcqarWQELeT.jpg',
  'billie-eilish': 'https://image.tmdb.org/t/p/w400/igsVwV0eJOTKJ9N8wxlUeHOsH8E.jpg',
  'paul-mccartney': 'https://image.tmdb.org/t/p/w400/8cbVe69jLkiuSnFSAKqfKzjRF9j.jpg',
  'patrick-mahomes': 'https://image.tmdb.org/t/p/w400/mXOmI1gdXWnIBkFdPyBxMrMiG3f.jpg',
  'gordon-ramsay': 'https://image.tmdb.org/t/p/w400/kgB7G2oTjfJLPM3yBLvbCBQFzqV.jpg',
  'robert-downey-jr': 'https://image.tmdb.org/t/p/w400/im9SAqJPZKEbVZGmjXuLI4O7RvM.jpg',
  'tom-hanks': 'https://image.tmdb.org/t/p/w400/xndWFsBlClkjv8It3AI6UcH7oYD.jpg',
  'eminem': 'https://image.tmdb.org/t/p/w400/2Ke0mOBo8CsUMlc0LHJFTfopYdl.jpg',
  'ed-sheeran': 'https://image.tmdb.org/t/p/w400/35SbFnLtzRyMgvRKJNtGMxK7PL4.jpg',
  'magic-johnson': 'https://image.tmdb.org/t/p/w400/vYes6Dkp5nCLvKjRPU3gB5RrLVA.jpg',
  'stephen-curry': 'https://image.tmdb.org/t/p/w400/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
  'barack-obama': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/President_Barack_Obama.jpg/300px-President_Barack_Obama.jpg',
}

// Asset data for all celebrities
const ENRICHMENTS = {
  'michael-jordan': {
    netWorth: 3.2,
    assets: [
      a('michael-jordan', 1, 'sports_team', 'Charlotte Hornets Ownership', 'Jordan owned the Charlotte Hornets NBA franchise for over a decade, becoming the first former player to become a majority owner of an NBA team. He sold his majority stake in 2023 at a $3B+ valuation.', 3000, 'NBA/Forbes 2023'),
      a('michael-jordan', 2, 'business', 'Jordan Brand (Nike)', 'The Jordan Brand generates over $5B annually for Nike, with Michael Jordan receiving an estimated $400M+ per year in royalties and licensing fees — the most lucrative athlete endorsement deal in history.', 500, 'Nike Annual Report 2024'),
      a('michael-jordan', 3, 'real_estate', 'Highland Beach Estate, Palm Beach', 'Waterfront mansion on Highland Beach in Palm Beach County, Florida — Jordan\'s primary winter residence featuring private beach access and championship-level amenities.', 6, 'Property Records 2023'),
      a('michael-jordan', 4, 'real_estate', 'Grove XXIII Golf Club, Hobe Sound FL', 'Jordan\'s private, members-only golf club in Hobe Sound, Florida — open only by invitation from Jordan himself. The exclusive course is considered one of the finest private tracks in the US.', 20, 'Golf Digest 2022'),
      a('michael-jordan', 5, 'real_estate', 'Highland Park Home, Chicago', 'Jordan\'s original Chicago-area 32,683 sq ft mansion in Highland Park, IL — on the market for years with a famous Space Jam bronze statue, finally sold in 2023.', 7.5, 'Real Estate Records'),
    ],
  },
  'drake': {
    netWorth: 0.3,
    assets: [
      a('drake', 1, 'real_estate', 'YOLO Estate, Toronto', 'Drake\'s 50,000 sq ft Toronto mansion in Bridle Path — Canada\'s most expensive private residence — features an NBA regulation basketball court, recording studio, and indoor pool.', 100, 'Architectural Digest 2021'),
      a('drake', 2, 'jet', 'Air Drake (Boeing 767)', 'Drake\'s customized Boeing 767 jet, officially named "Air Drake," is a fully converted wide-body aircraft with luxurious interiors including leather seating and gold accents.', 95, 'Bloomberg 2019'),
      a('drake', 3, 'business', 'OVO Sound Record Label', 'October\'s Very Own (OVO Sound) is Drake\'s independent record label and brand empire, managing artists and generating revenue through music, merchandise, and brand collaborations.', 30, 'Music Business Worldwide 2024'),
      a('drake', 4, 'real_estate', 'Hidden Hills Compound, Los Angeles', 'Drake\'s secondary California compound in Hidden Hills — a celebrity-enclave community with top-tier security and resort-like amenities.', 7.7, 'Property Records 2019'),
    ],
  },
  'eminem': {
    netWorth: 0.25,
    assets: [
      a('eminem', 1, 'real_estate', 'Rochester Hills Mansion, Michigan', 'Eminem\'s primary 17,500 sq ft home in Rochester Hills, Michigan — the rapper\'s long-time residence in his home state, purchased for $4.75M.', 4.75, 'Property Records'),
      a('eminem', 2, 'business', 'Shady Records / Aftermath Royalties', 'Slim Shady LLC and Shady Records — Eminem\'s recording and publishing rights portfolio represents decades of platinum releases. His catalog including "The Marshall Mathers LP" has earned billions in royalties.', 50, 'RIAA / Forbes 2024'),
      a('eminem', 3, 'real_estate', 'Franklin Home, Michigan', 'Eminem\'s secondary Michigan residence in the upscale Franklin Village community, used for privacy and close family gatherings.', 1.5, 'Property Records'),
    ],
  },
  'ed-sheeran': {
    netWorth: 0.32,
    assets: [
      a('ed-sheeran', 1, 'real_estate', 'Castle Rock Estate, Framlingham', 'Ed Sheeran\'s personal 16-acre estate in Suffolk, England — a village-like complex he built over the years with a recording studio, pub named the Lancaster Lock, small chapel, swimming pool, and treehouse.', 40, 'The Times 2022'),
      a('ed-sheeran', 2, 'business', 'Gingerbread Man Records', 'Ed Sheeran\'s independent record label through which he manages other artists and controls his masters. The label generates revenue through streaming deals and licensing.', 20, 'Music Week 2024'),
      a('ed-sheeran', 3, 'real_estate', 'East London Home', 'Sheeran\'s original East London property — a discreet Victorian terraced house he bought when rising to fame and has kept for sentimental value.', 3, 'Property Records'),
      a('ed-sheeran', 4, 'real_estate', 'Suffolk Farm Properties', 'Additional agricultural and residential land surrounding his Framlingham estate, purchased to ensure privacy and manage the village-like complex he has developed over the years.', 10, 'Suffolk Property Records 2023'),
    ],
  },
  'tom-hanks': {
    netWorth: 0.35,
    assets: [
      a('tom-hanks', 1, 'real_estate', 'Bel Air Estate, Los Angeles', 'Tom Hanks\' primary California home — a stunning estate in the exclusive Bel Air enclave featuring over 14,000 sq ft of living space, home theater, and landscaped gardens.', 26, 'Property Records 2022'),
      a('tom-hanks', 2, 'real_estate', 'Antiparos Island Retreat, Greece', 'Hanks and Rita Wilson\'s beloved retreat on the Greek island of Antiparos — the duo became Greek citizens in 2020. The property offers complete Mediterranean privacy.', 4.7, 'Greek Media 2023'),
      a('tom-hanks', 3, 'business', 'Playtone Productions', 'Hanks\' production company responsible for iconic projects including Cast Away, The Da Vinci Code, Band of Brothers, and From the Earth to the Moon. One of Hollywood\'s most respected production houses.', 50, 'Hollywood Reporter 2024'),
      a('tom-hanks', 4, 'real_estate', 'California Ranch, Carmel Valley', 'Tom Hanks\'s rustic Western-themed ranch property in the rolling hills of Carmel Valley — a retreat from Hollywood lifestyle featuring horseback riding and wide open land.', 4.5, 'Property Records'),
    ],
  },
  'barack-obama': {
    netWorth: 0.07,
    assets: [
      a('barack-obama', 1, 'real_estate', 'DC Mansion, Kalorama', 'Obama\'s 8,200 sq ft Washington DC home in the prestigious Kalorama neighborhood — purchased in 2017 to allow daughter Sasha to finish high school, now the family\'s primary DC residence.', 8.1, 'Washington Post 2017'),
      a('barack-obama', 2, 'real_estate', "Martha's Vineyard Estate", 'The Obamas\' 7-bedroom, 6,892 sq ft estate on Martha\'s Vineyard in Edgartown — oceanfront property on the island frequently associated with presidential retreats.', 11.75, 'Wall Street Journal 2021'),
      a('barack-obama', 3, 'business', 'Higher Ground Productions (Netflix)', 'Barack and Michelle Obama\'s production company under a multiyear Netflix deal. Higher Ground has produced numerous acclaimed documentaries and series including "American Factory."', 15, 'Netflix 2018'),
      a('barack-obama', 4, 'business', 'Book Deal Portfolio', '"A Promised Land" and Michelle\'s "Becoming" collectively sold millions of copies worldwide. Together the Obamas\' book deals with Penguin Random House are estimated at $65M+.', 65, 'Publishers Weekly 2020'),
      a('barack-obama', 5, 'real_estate', 'Chicago Hyde Park Home', 'The Obamas\' original family home in Chicago\'s Hyde Park neighborhood — a Georgian revival house where Barack and Michelle raised their daughters.', 2.5, 'Cook County Records'),
    ],
  },
  'paul-mccartney': {
    netWorth: 1.3,
    assets: [
      a('paul-mccartney', 1, 'business', 'MPL Communications & Music Catalog', 'MPL Communications controls Paul McCartney\'s own compositions plus an extensive music publishing catalog including Broadway shows, Buddy Holly songs, and more — one of the most valuable private music portfolios in the world.', 600, 'Music Business Worldwide 2024'),
      a('paul-mccartney', 2, 'real_estate', 'Cavendish Avenue, London', 'McCartney\'s legendary home in St John\'s Wood, London — the house he bought in 1965 near Abbey Road Studios, still his primary London residence after 60 years.', 15, 'London Property Guide 2024'),
      a('paul-mccartney', 3, 'real_estate', 'Peasmarsh Sussex Estate', 'McCartney\'s 1,500-acre estate in Peasmarsh, East Sussex — vast English countryside property with farmland, homes, and complete privacy from public life.', 30, 'UK Property Records'),
      a('paul-mccartney', 4, 'real_estate', 'New York City Home', 'McCartney\'s Midtown Manhattan residence, used during frequent visits to New York for performances and recording sessions.', 10, 'NYC Property Records'),
    ],
  },
  'elton-john': {
    netWorth: 0.55,
    assets: [
      a('elton-john', 1, 'real_estate', 'Woodside Estate, Old Windsor', 'Sir Elton John\'s primary English home — a 37-bedroom estate in Old Windsor, Berkshire, stuffed with his legendary art collection of over 2,000 works. It featured in his 2019 biopic "Rocketman."', 80, 'Christie\'s / Evening Standard 2024'),
      a('elton-john', 2, 'real_estate', 'Atlanta Penthouses', 'Elton John and David Furnish\'s Atlanta residence — twin penthouse units in the upscale Buckhead neighborhood, serving as their primary US home for family life.', 8, 'Atlanta Property Records'),
      a('elton-john', 3, 'real_estate', 'Venice Palazzo, Italy', 'Elton\'s romantic palazzo apartment on the Grand Canal in Venice, Italy — used for retreats and serving as inspiration for his artistic sensibilities.', 7, 'Italian Property Records'),
      a('elton-john', 4, 'art', 'World-Class Art Collection', 'Elton John\'s 2,000+ piece art collection includes works by Damien Hirst, Banksy, Jean-Michel Basquiat, and Helmut Newton — one of the most significant private art collections assembled by an entertainer.', 40, 'Christie\'s 2023'),
    ],
  },
  'madonna': {
    netWorth: 0.85,
    assets: [
      a('madonna', 1, 'real_estate', 'Quinta do Relogio, Lisbon', 'Madonna\'s lavish 18th-century palace estate in Lisbon, Portugal — an 18-room estate she purchased and has used as a primary residence since 2017, reflecting her deep affection for Portuguese culture.', 8, 'Expresso Portugal 2022'),
      a('madonna', 2, 'real_estate', 'Central Park West Apartment', "Madonna's 13-room apartment on Central Park West in NYC — one of the most storied celebrity residences in New York, purchased in the 1990s and still in her portfolio.", 20, 'NYC Property Records'),
      a('madonna', 3, 'business', 'Music Catalog & Tour Revenue', "Madonna's back catalog and her record-breaking Celebration Tour reinforce her position as music's all-time highest-grossing female touring artist, with total career earnings of over $1.2B.", 100, 'Billboard 2024'),
      a('madonna', 4, 'real_estate', 'Los Angeles Compound', "Madonna's sprawling 12,500 sq ft compound in LA, featuring multiple structures, guest houses, and extensive gardens for her extended family.", 19.3, 'Property Records 2021'),
    ],
  },
  'lady-gaga': {
    netWorth: 0.32,
    assets: [
      a('lady-gaga', 1, 'real_estate', 'Malibu Beach House', "Lady Gaga's oceanfront property in Malibu, California — a beachfront compound offering privacy along the prestigious Colony area, used for rest between tour legs.", 24, 'LA Times Property 2021'),
      a('lady-gaga', 2, 'real_estate', 'Malibu Road Estate', "Gaga's second Malibu property — a more expansive estate used for entertaining and private gatherings, purchased as her California base expanded.", 6.5, 'Property Records 2020'),
      a('lady-gaga', 3, 'business', 'Haus Laboratories Beauty Brand', "Gaga launched Haus Labs in 2019 — now a full beauty brand offering inclusive makeup formulations. After relaunch, Haus Labs has become a major player in celebrity beauty.", 50, 'Business of Fashion 2023'),
      a('lady-gaga', 4, 'business', 'Music Catalog & Las Vegas Residency', "Gaga's studio albums and residency earnings at Park MGM Las Vegas represent core income — her residency grossed over $100M and her catalog includes some of the best-selling albums in history.", 80, 'Billboard Box Score 2022'),
    ],
  },
  'justin-bieber': {
    netWorth: 0.3,
    assets: [
      a('justin-bieber', 1, 'business', 'Music Catalog Sale to Hipgnosis', "In 2023, Justin Bieber sold his entire music catalog and master recordings to Hipgnosis Songs Capital for a reported $200M+ — one of the largest catalog sales in music history.", 200, 'Financial Times 2023'),
      a('justin-bieber', 2, 'real_estate', 'Hailey & Justin Bieber Estate, Ontario', "The Biebers' Canadian estate — a lakefront compound in Ontario that serves as their primary residence, featuring extensive privacy for the celebrity couple.", 5.5, 'Property Records'),
      a('justin-bieber', 3, 'real_estate', 'Yorba Linda Mansion, California', "Justin's private California retreat — a luxurious Yorba Linda property with pool, gymnasium, and multiple guest structures.", 8.5, 'CA Property Records'),
    ],
  },
  'ariana-grande': {
    netWorth: 0.2,
    assets: [
      a('ariana-grande', 1, 'real_estate', 'Boca Raton Estate, Florida', "Ariana Grande's Florida home — a sprawling estate in the upscale Boca Raton area, used as her East Coast base and family retreat.", 11, 'Property Records 2022'),
      a('ariana-grande', 2, 'business', 'r.e.m. beauty Brand', "Grande's r.e.m. beauty line, launched in 2021 under the Form Beauty holding company, quickly became a multi-million dollar beauty brand focusing on eye looks.", 50, 'Variety 2023'),
      a('ariana-grande', 3, 'real_estate', 'Hollywood Hills Home', "Ariana's LA Hills home used during her time in Los Angeles — a private compound in the Hollywood Hills with panoramic views.", 6.75, 'Property Records 2020'),
    ],
  },
  'billie-eilish': {
    netWorth: 0.03,
    assets: [
      a('billie-eilish', 1, 'real_estate', 'Highland Park Home, Los Angeles', "Billie Eilish grew up in this Highland Park, LA home and still owns it — a modest but meaningful property representing her roots before global fame.", 2, 'LA Property Records'),
      a('billie-eilish', 2, 'business', 'Music Catalog & Merch Empire', "Billie's catalog including 'When We All Fall Asleep...' and 'Happier Than Ever' — both Grammy-winning albums — represents enormous streaming and touring income for an artist still in her early twenties.", 20, 'Forbes 2024'),
    ],
  },
  'the-weeknd': {
    netWorth: 0.3,
    assets: [
      a('the-weeknd', 1, 'real_estate', 'Bel Air Mansion', "The Weeknd's primary Los Angeles residence — a $22M Bel Air estate featuring 11,000+ sq ft of living space with panoramic city views, recording studio, and cinema room.", 22, 'Property Records 2019'),
      a('the-weeknd', 2, 'real_estate', 'Beverly Hills Estate', "A secondary Beverly Hills property used for entertaining and close proximity to industry relationships — purchased as The Weeknd expanded his LA real estate footprint.", 18, 'Property Records 2021'),
      a('the-weeknd', 3, 'business', 'XO Records & After Hours label', "The Weeknd owns XO Records, his independent imprint distributed through Republic Records. As a co-founder and controlling shareholder, his label has launched multiple successful acts.", 30, 'Billboard 2023'),
      a('the-weeknd', 4, 'jet', 'Private Jet', "The Weeknd's private jet used for international tours and travel — ensuring complete privacy and schedule control for one of music's most in-demand live performers.", 15, 'Celebrity Aircraft 2023'),
    ],
  },
  'snoop-dogg': {
    netWorth: 0.16,
    assets: [
      a('snoop-dogg', 1, 'business', 'Death Row Records (2022 Acquisition)', "Snoop Dogg acquired Death Row Records in 2022 — his original label from the '90s — turning it into an NFT and digital music label. The catalog includes classic albums from Dr. Dre, Tupac, and Snoop himself.", 50, 'Variety 2022'),
      a('snoop-dogg', 2, 'real_estate', 'Diamond Bar Compound, California', "Snoop's primary California home — a 6,500 sq ft compound in Diamond Bar with basketball court, music studio, and customized entertainment spaces.", 3, 'Property Records'),
      a('snoop-dogg', 3, 'business', 'Leafs by Snoop Cannabis Brand', "Snoop's pioneering cannabis brand was one of the first celebrity marijuana businesses. Now merged into Casa Verde Capital, his cannabis investments span multiple brands.", 15, 'Forbes 2024'),
    ],
  },
  'mick-jagger': {
    netWorth: 0.5,
    assets: [
      a('mick-jagger', 1, 'real_estate', 'Mustique Island Estate', "Jagger owns a 17-acre estate on Mustique, the exclusive private Caribbean island. Jagger has owned it since 1971 and it's where he has spent many family holidays over the decades.", 8, 'Mustique Company 2023'),
      a('mick-jagger', 2, 'real_estate', 'Richmond Hill, London', "Jagger's primary London home in Richmond, Surrey — a Georgian house on the Thames near Richmond Hill with stunning river views.", 10, 'Richmond Property Records 2022'),
      a('mick-jagger', 3, 'business', 'Rolling Stones Catalog & Touring', "The Rolling Stones are among the highest-grossing live acts ever. Jagger as frontman and primary songwriter holds significant interests in their touring and publishing empire.", 150, 'Billboard Boxscore 2024'),
      a('mick-jagger', 4, 'real_estate', 'Chelsea Home, London', "Jagger's discreet Chelsea home — a grand Georgian townhouse in the most fashionable London borough, used for private gatherings and family events.", 7, 'London Property Records'),
    ],
  },
  'lewis-hamilton': {
    netWorth: 0.285,
    assets: [
      a('lewis-hamilton', 1, 'real_estate', 'Monaco Apartment', "Hamilton's tax-efficient Monaco residence — a stunning apartment in the principality, required for most F1 drivers due to proximity to the GP circuit and favorable tax rates.", 25, 'Monaco Property Records 2022'),
      a('lewis-hamilton', 2, 'real_estate', 'New York City Apartment', "Hamilton's Manhattan apartment — used during his frequent visits to New York for fashion events, business dealings, and cultural engagement.", 40, 'NYC Property Records 2021'),
      a('lewis-hamilton', 3, 'real_estate', 'Colorado Ranch', "Lewis Hamilton's private ranch retreat in Colorado, offering mountain landscapes and complete privacy away from the Formula 1 circuit circus.", 4.5, 'Property Records'),
      a('lewis-hamilton', 4, 'jet', 'Private Jet', "Hamilton's private jet, which he controversially sold in 2023 in a bid to reduce his carbon footprint — replaced with fractional jet usage to manage his environmental impact.", 17, 'Aviation Reports 2021'),
    ],
  },
  'novak-djokovic': {
    netWorth: 0.25,
    assets: [
      a('novak-djokovic', 1, 'real_estate', 'Monaco Primary Residence', "Djokovic's main home in Monaco — chosen for the Mediterranean lifestyle and proximity to major European tennis venues. The residence is his family's base during the European swing.", 15, 'Monaco Property Records'),
      a('novak-djokovic', 2, 'business', 'Novak Tennis Academy', "Nole's tennis academy in Belgrade, Serbia — an elite training facility focused on developing Serbian tennis talent, with Djokovic personally involved in coaching and development.", 10, 'ATP Tour Records 2023'),
      a('novak-djokovic', 3, 'business', 'Grand Slam Prize Money (Record)', "Djokovic holds the all-time record for career prize money with $175M+ in official ATP and Grand Slam earnings — more than any player in tennis history.", 175, 'ATP 2024'),
      a('novak-djokovic', 4, 'real_estate', 'Belgrade Villa, Serbia', "Djokovic's family home in Belgrade — the Serbian capital where Novak was born and raised, maintaining connections to his roots and family.", 5, 'Serbian Property Records'),
    ],
  },
  'stephen-curry': {
    netWorth: 0.16,
    assets: [
      a('stephen-curry', 1, 'real_estate', 'Atherton Estate, Silicon Valley', "Curry's primary Bay Area home — a 10,600 sq ft Atherton estate in one of the most exclusive zip codes in America, purchased for $31M in 2019.", 31, 'SF Chronicle 2019'),
      a('stephen-curry', 2, 'business', 'SC30 Inc & Media Company', "Stephen Curry's production and media company SC30 Inc produces content including docuseries and branded entertainment. It's a key vehicle for his post-basketball legacy.", 15, 'Forbes 2024'),
      a('stephen-curry', 3, 'business', 'Curry Brand (Under Armour)', "The Curry Brand within Under Armour — a semi-autonomous sub-brand modeled after Nike Jordan Brand. Curry received equity in Under Armour as part of his landmark deal.", 50, 'Bloomberg 2023'),
      a('stephen-curry', 4, 'real_estate', 'Burlingame Home', "An additional Bay Area property in Burlingame — used for family and close friends, reflecting Curry's deep roots in the Bay Area community.", 6.5, 'Property Records 2018'),
    ],
  },
  'kevin-durant': {
    netWorth: 0.225,
    assets: [
      a('kevin-durant', 1, 'business', 'Boardroom Sports Media', "Kevin Durant's Boardroom is a sports and entertainment media platform covering business, culture, and sports through original content, podcasts, and digital media.", 30, 'Sportico 2023'),
      a('kevin-durant', 2, 'business', 'Thirty Five Ventures', "KD's investment firm Thirty Five Ventures has backed more than 75 companies including Coinbase, Postmates, and Acorns — making Durant one of the most active athlete-investors in history.", 80, 'Forbes 2024'),
      a('kevin-durant', 3, 'real_estate', 'Manhattan Apartment', "Durant's primary New York City apartment in the Park Slope/Brooklyn area — maintained during his Brooklyn Nets tenure and kept for frequent NYC visits.", 8, 'NYC Property Records'),
      a('kevin-durant', 4, 'real_estate', 'Phoenix Area Home', "Durant's Arizona residence purchased after his trade to the Phoenix Suns — an upscale Scottsdale home in the Valley of the Sun.", 4, 'AZ Property Records 2023'),
    ],
  },
  'patrick-mahomes': {
    netWorth: 0.1,
    assets: [
      a('patrick-mahomes', 1, 'sports_team', 'Kansas City Royals (Co-Owner)', "Mahomes is a minority co-owner of the Kansas City Royals MLB franchise — part of a group that purchased the team in 2023, reflecting his investment in his adopted home city.", 50, 'Wall Street Journal 2023'),
      a('patrick-mahomes', 2, 'sports_team', 'Kansas City Current (NWSL)', "Mahomes and wife Brittany are co-owners of the Kansas City Current NWSL team — helping fund the club's new purpose-built stadium, the first soccer-specific NWSL stadium.", 15, 'NWSL 2024'),
      a('patrick-mahomes', 3, 'real_estate', 'Overland Park Mansion', "The Mahomes family estate in Overland Park, Kansas — a gated compound near Kansas City with entertainment amenities befitting an NFL superstar.", 3.5, 'KS Property Records'),
      a('patrick-mahomes', 4, 'business', 'NFL Contract & Endorsements', "Mahomes holds the richest contract in NFL history at $503M for 10 years. His endorsement portfolio (State Farm, Adidas, Heinz, etc.) adds another $15M+ annually.", 10, 'Forbes 2024'),
    ],
  },
  'wayne-gretzky': {
    netWorth: 0.25,
    assets: [
      a('wayne-gretzky', 1, 'real_estate', 'West Palm Beach Estate, Florida', "The Great One's primary Florida residence — a luxurious Palm Beach County estate featuring resort-style amenities and waterfront access.", 10, 'Property Records'),
      a('wayne-gretzky', 2, 'business', 'Gretzky Estates Winery', "Wayne Gretzky Estates is a major Ontario wine brand with both an Okanagan and Niagara presence. The winery produces premium Canadian wines and spirits including rye whisky.", 12, 'Wine Spectator 2024'),
      a('wayne-gretzky', 3, 'real_estate', 'Bel Air Home, Los Angeles', "Gretzky's California home in Bel Air — sold in 2020 but replaced by a newer West LA property. During his playing days in LA, Gretzky was a significant figure in the West Coast social scene.", 8, 'Property Records 2020'),
      a('wayne-gretzky', 4, 'real_estate', "Janet's Real Estate Portfolio", "Properties co-owned with wife Janet Jones Gretzky, who has her own real estate investment focus across multiple US markets.", 5, 'Property Records'),
    ],
  },
  'shaquille-oneal': {
    netWorth: 0.4,
    assets: [
      a('shaquille-oneal', 1, 'real_estate', 'Windermere Estate, Orlando', "Shaq's main home — a 12-bedroom, 31-bath Windermere mansion in the Orlando area featuring a private basketball court, movie theater, and indoor pool.", 3.5, 'Property Records 2021'),
      a('shaquille-oneal', 2, 'business', 'Big Chicken Restaurant Chain', "Shaquille O'Neal's fast casual restaurant chain Big Chicken has grown to 800+ locations in development across the US, making it one of the fastest-growing celebrity restaurant brands.", 30, 'Business Insider 2024'),
      a('shaquille-oneal', 3, 'business', 'Papa John\'s Franchise Ownership', "Shaq owns multiple Papa John's franchise locations and briefly held a board seat, taking on a major ambassadorial role for the pizza chain after a controversial management transition.", 8, 'Business Wire 2019'),
      a('shaquille-oneal', 4, 'car', 'Custom Vehicle Collection', "Shaq's vehicle collection includes custom-built SUVs and luxury cars modified to fit his 7\'1\" frame — a curated fleet of specialty vehicles regularly featured in media.", 3, 'Celebrity Cars 2023'),
    ],
  },
  'magic-johnson': {
    netWorth: 0.62,
    assets: [
      a('magic-johnson', 1, 'business', 'EquiTrust Life Insurance', "Magic Johnson's financial services flagship — EquiTrust Life Insurance Company manages over $26B in assets and is one of the largest Black-owned financial companies in the US.", 200, 'Forbes Billionaires 2024'),
      a('magic-johnson', 2, 'business', '124 SN Ventures Private Equity', "Magic's private equity vehicle through which he invests in real estate, media, and businesses targeting diverse communities. His portfolio has included Buffalo Wild Wings franchises and Starbucks deals.", 100, 'Forbes 2023'),
      a('magic-johnson', 3, 'sports_team', 'Los Angeles Dodgers (Former Stake)', "Johnson led the ownership group that purchased the LA Dodgers for $2.15B in 2012 — at the time the most expensive sports franchise sale in history. He sold his stake returning significant profits.", 30, 'Wall Street Journal 2023'),
      a('magic-johnson', 4, 'real_estate', 'Beverly Hills Estate', "Magic Johnson's primary Beverly Hills residence — a luxury compound near his business headquarters befitting one of the most successful athlete-to-businessperson transitions in history.", 8, 'Property Records'),
    ],
  },
  'mike-tyson': {
    netWorth: 0.015,
    assets: [
      a('mike-tyson', 1, 'business', 'Tyson 2.0 Cannabis Brand', "Tyson 2.0 is Mike Tyson's cannabis lifestyle brand — selling THC and hemp products in multiple US states. The brand is one of the most recognizable in the legal cannabis space.", 10, 'MJBizDaily 2024'),
      a('mike-tyson', 2, 'real_estate', 'Henderson Ranch, Nevada', "Tyson's 10-acre Nevada desert ranch — originally developed as part of his cannabis growing ambitions, now serving as his primary residence outside Las Vegas.", 3.5, 'Property Records 2021'),
      a('mike-tyson', 3, 'business', 'Legends Only League Boxing', "Mike Tyson's boxing promotion and entertainment brand — which produced his 2020 and 2024 exhibition bouts, generating tens of millions in streaming revenue.", 5, 'Netflix / ESPN 2024'),
    ],
  },
  'manny-pacquiao': {
    netWorth: 0.22,
    assets: [
      a('manny-pacquiao', 1, 'real_estate', 'Los Angeles Mansion', "Manny's primary US home — a luxurious Los Angeles mansion used during training camps and entertainment industry appearances.", 8, 'Property Records'),
      a('manny-pacquiao', 2, 'real_estate', 'General Santos City Estate, Philippines', "Pacquiao's hometown base in General Santos City — multiple properties across his native city including a palatial family compound.", 5, 'Philippine Property Records'),
      a('manny-pacquiao', 3, 'business', 'MP (Manny Pacquiao) Global', "Pacquiao's business portfolio spanning cryptocurrency (PAC Token), sports management, and his post-boxing political career as a Philippine senator and former presidential candidate.", 30, 'Forbes Asia 2023'),
    ],
  },
  'canelo-alvarez': {
    netWorth: 0.4,
    assets: [
      a('canelo-alvarez', 1, 'real_estate', 'Zapopan Estate, Guadalajara', "Canelo's primary Mexican home — a luxury compound in Zapopan near Guadalajara with extensive equestrian facilities, reflecting his love for horses and Mexican ranching culture.", 5, 'ESPN 2023'),
      a('canelo-alvarez', 2, 'business', 'Canelo Promotions & DAZN Deal', "Alvarez co-founded his own promotional company and signed the richest boxing contract in history with DAZN — an 11-fight, $365M deal ensuring his fights generate maximum returns.", 50, 'DAZN / ESPN 2018'),
      a('canelo-alvarez', 3, 'business', 'Tequila Calle 23 & Livestock', "Canelo co-owns a tequila brand and extensive cattle ranching operations across Jalisco, Mexico — grounding his wealth in his rural hometown culture.", 10, 'Forbes Mexico 2024'),
      a('canelo-alvarez', 4, 'car', 'Ferrari & Porsche Collection', "Alvarez maintains an enviable collection of supercars, particularly Ferraris and Porsches — frequently seen in Mexico arriving to training in his latest acquisitions.", 3, 'MotorTrend 2023'),
    ],
  },
  'jennifer-aniston': {
    netWorth: 0.32,
    assets: [
      a('jennifer-aniston', 1, 'real_estate', 'Bel Air Estate', "Jennifer Aniston's spectacular 8,500 sq ft Bel Air home — her most notable property, purchased for $21M and featuring a spa, tennis court, and stunning views of LA.", 21, 'Architectural Digest 2022'),
      a('jennifer-aniston', 2, 'real_estate', 'NYC Gramercy Park Apartment', "Aniston's New York City apartment in the Gramercy Park area — used during frequent visits for film productions and business meetings.", 9, 'NYC Property Records'),
      a('jennifer-aniston', 3, 'business', 'LolaVie Haircare Brand', "Jennifer Aniston launched LolaVie in 2021 — a clean haircare brand that leverages her famous hair expertise from her Friends days. The brand has rapidly grown into a major beauty company.", 25, 'WWD 2023'),
    ],
  },
  'scarlett-johansson': {
    netWorth: 0.165,
    assets: [
      a('scarlett-johansson', 1, 'business', 'The Outset Beauty Brand', "Scarlett Johansson co-founded The Outset skincare brand in 2022, focusing on minimalist, clean products. The brand quickly gained traction and retail distribution nationwide.", 20, 'Business of Fashion 2023'),
      a('scarlett-johansson', 2, 'real_estate', 'West Village Townhouse, NYC', "ScarJo's New York City townhouse in the coveted West Village neighborhood — a multi-story brownstone in one of Manhattan's most sought-after residential areas.", 4, 'NYC Property Records'),
      a('scarlett-johansson', 3, 'real_estate', 'Aspen Mountain Home', "Johansson's Colorado ski retreat in Aspen — used during winter getaways and offering mountain privacy away from Hollywood.", 4.5, 'CO Property Records'),
    ],
  },
  'johnny-depp': {
    netWorth: 0.15,
    assets: [
      a('johnny-depp', 1, 'real_estate', 'French Village, Plan de la Tour', "Depp owns Lac Rouge, a 37-acre village compound in Plan de la Tour, France — comprising multiple traditional Provençal buildings he purchased and converted into a private estate.", 4, 'Hollywood Reporter 2016'),
      a('johnny-depp', 2, 'art', 'Vintage Guitar Collection', "Depp owns more than 120 vintage guitars, including rare Gibsons and Fenders, with a collection worth $5M+. Music remains his great passion alongside acting.", 5, 'Guitar World 2023'),
      a('johnny-depp', 3, 'art', 'Fine Art Paintings (Self)', "Johnny Depp's self-painted portraits of cultural figures like Bob Dylan, Al Pacino, and Queen Elizabeth II have sold for over $3.8M via Castle Fine Art in 2022 — a surprising secondary career.", 4, 'Castle Fine Art 2022'),
    ],
  },
  'robert-downey-jr': {
    netWorth: 0.3,
    assets: [
      a('robert-downey-jr', 1, 'real_estate', 'Malibu Beach Compound', "Robert Downey Jr.'s primary Los Angeles home — a stunning 11,500 sq ft Malibu compound on the Pacific Coast Highway, bought in 2020 for $12.9M.", 13, 'Property Records 2020'),
      a('robert-downey-jr', 2, 'real_estate', 'Amagansett Home, Hamptons', "The Downeys' Hamptons retreat in Amagansett — an East Hampton property offering summer escape from LA, popular with the Hollywood elite.", 8.5, 'NY Property Records'),
      a('robert-downey-jr', 3, 'business', 'Footprint Coalition', "Robert Downey Jr.'s impact investment and technology company focused on using advanced technology to clean the environment — a passion project evolved from his Iron Man environmentalist persona.", 20, 'Forbes 2023'),
      a('robert-downey-jr', 4, 'real_estate', 'Windmill Estate, Venice Beach', "An earlier Venice Beach home — a Spanish-style compound featuring a windmill, famously renovated by the Downeys and later sold.", 5, 'Property Records 2019'),
    ],
  },
  'denzel-washington': {
    netWorth: 0.28,
    assets: [
      a('denzel-washington', 1, 'real_estate', 'Beverly Hills Estate', "Denzel Washington's primary Los Angeles home — a sprawling Beverly Hills compound befitting two-time Oscar winner and Hollywood A-lister.", 11, 'Property Records'),
      a('denzel-washington', 2, 'real_estate', 'Toluca Lake Home', "Washington's secondary LA property in Toluca Lake, Burbank — a more private area popular with film industry families.", 3, 'Property Records'),
      a('denzel-washington', 3, 'business', 'Mundy\'s Mill Productions', "Denzel's production company that has partnered with various studios on major films, including producing and directing projects like 'Antwone Fisher' and 'The Great Debaters.'", 15, 'Variety 2023'),
    ],
  },
  'ryan-reynolds': {
    netWorth: 0.35,
    assets: [
      a('ryan-reynolds', 1, 'business', 'Aviation American Gin (Diageo)', "Ryan Reynolds sold Aviation American Gin to Diageo in 2020 for $610M — with an earnout potentially worth $275M more. He famously grew the brand through witty viral marketing.", 150, 'Bloomberg 2020'),
      a('ryan-reynolds', 2, 'sports_team', 'Wrexham AFC Co-Owner', "Reynolds and Rob McElhenney purchased Welsh football club Wrexham AFC in 2020 for £2M. The club has since risen from the National League to League One, inspiring the Emmy-winning 'Welcome to Wrexham' docuseries.", 25, 'Sportico 2024'),
      a('ryan-reynolds', 3, 'business', 'Maximum Effort Productions', "Reynolds' marketing and content production company, responsible for his viral ad campaigns and co-productions. Maximum Effort has become a sought-after creative studio for brands.", 50, 'AdAge 2023'),
      a('ryan-reynolds', 4, 'real_estate', 'Greenwich, CT Estate', "The Reynolds-Lively family home in Greenwich, Connecticut — a 11-acre estate on a quiet country road befitting Hollywood's most beloved couple.", 11.5, 'CT Property Records'),
    ],
  },
  'arnold-schwarzenegger': {
    netWorth: 0.4,
    assets: [
      a('arnold-schwarzenegger', 1, 'real_estate', 'Brentwood Estate, Los Angeles', "Arnold's primary California home — a 9,000+ sq ft Pacific Palisades/Brentwood estate used since his acting peak, featuring gym facilities and guest cottages.", 7, 'Property Records'),
      a('arnold-schwarzenegger', 2, 'car', 'Classic Car Collection', "Schwarzenegger owns a legendary collection including a customized Hummer (he drove the first civilian Hummer in 1992), 1968 Mercury Cougar, various classic American vehicles, and a Porsche 930 Turbo.", 5, 'Celebrity Cars 2023'),
      a('arnold-schwarzenegger', 3, 'real_estate', 'Ohio Real Estate Portfolio', "Arnold has invested in commercial real estate in the Midwest, including Ohio properties, diversifying his holdings beyond Hollywood and politics.", 10, 'Ohio Property Records'),
      a('arnold-schwarzenegger', 4, 'business', 'Global Brand Licensing', "The Schwarzenegger brand through licensing — including film rights, fitness product endorsements, and his social media empire valued for his continued global influence.", 20, 'Forbes 2024'),
    ],
  },
  'mark-wahlberg': {
    netWorth: 0.35,
    assets: [
      a('mark-wahlberg', 1, 'business', 'Wahlburgers Restaurant Chain', "Wahlburgers is the family restaurant chain co-founded with brothers Donnie and Paul — now a national chain with 50+ locations. The business was featured in an A&E reality show that ran for 10 seasons.", 60, 'Forbes 2024'),
      a('mark-wahlberg', 2, 'real_estate', 'Palm Island Estate, Miami', "Wahlberg's spectacular waterfront estate on Palm Island in Miami Beach — one of his most significant real estate investments.", 35, 'Property Records 2021'),
      a('mark-wahlberg', 3, 'business', 'Performance Inspired Nutrition', "Mark's nutrition supplement brand offers protein powders and health products — leveraging his famously dedicated fitness lifestyle into a consumer product line.", 20, 'Supplement News 2023'),
      a('mark-wahlberg', 4, 'real_estate', 'Las Vegas Luxury Home', "Wahlberg relocated his family to Nevada and purchased a luxury compound in the Las Vegas area in 2022 — citing Nevada's tax advantages and quality of life.", 15, 'Property Records 2022'),
    ],
  },
  'gordon-ramsay': {
    netWorth: 0.22,
    assets: [
      a('gordon-ramsay', 1, 'business', 'Gordon Ramsay Restaurants Global', "Ramsay's global restaurant empire spans 35+ restaurants worldwide across London, Las Vegas, Dubai, Sydney, and New York — operating across multiple Michelin-starred and casual dining concepts.", 100, 'Companies House 2024'),
      a('gordon-ramsay', 2, 'real_estate', 'Chelsea Home, London', "Gordon and Tana Ramsay's primary London home — a 6-story Georgian townhouse in Chelsea, the upscale London borough where many of his flagship UK restaurants operate.", 6, 'London Property Records'),
      a('gordon-ramsay', 3, 'real_estate', 'Rock, Cornwall Home', "The Ramsays' beloved Cornwall holiday home in Rock — a Cornish cottage community beloved by the British upper classes for its surfing and sailing culture.", 4.4, 'Cornwall Property Records'),
      a('gordon-ramsay', 4, 'real_estate', 'Bel Air Home, Los Angeles', "Ramsay's California home near his LA restaurant operations and his Fox network TV productions — acquired when Hell's Kitchen and MasterChef became major US formats.", 6.8, 'CA Property Records 2019'),
    ],
  },
  'paris-hilton': {
    netWorth: 0.3,
    assets: [
      a('paris-hilton', 1, 'business', '11:11 Media Company', "Paris Hilton's digital media and entertainment company 11:11 Media — which produces podcasts, TV content, and oversees her diverse brand licensing portfolio.", 50, 'Forbes 2024'),
      a('paris-hilton', 2, 'real_estate', 'Bel Air Compound', "Hilton's primary Los Angeles home — a luxury Bel Air estate featuring 5 bedrooms, home cinema, and staff quarters, reflecting the Paris Hilton brand of unapologetic glamour.", 18, 'Property Records 2021'),
      a('paris-hilton', 3, 'real_estate', 'Malibu Beach House', "Paris Hilton's Malibu beachfront home — a cozy oceanfront retreat for quieter weekends away from the perpetual spotlight.", 5.8, 'Property Records'),
      a('paris-hilton', 4, 'business', 'Paris Hilton Fragrance Empire', "Hilton's fragrance line pioneered celebrity perfumes — with 30+ fragrances generating over $2.5B in cumulative retail sales, representing her most successful commercial venture.", 80, 'Beauty Business 2023'),
    ],
  },
  'morgan-freeman': {
    netWorth: 0.25,
    assets: [
      a('morgan-freeman', 1, 'real_estate', 'Mississippi Farm & Apiary', "Morgan Freeman owns a large farm in Charleston, Mississippi that he converted into a bee sanctuary — home to 26 hives of bees. Freeman has been a vocal advocate for bee conservation.", 3, 'Freeman Farm 2023'),
      a('morgan-freeman', 2, 'real_estate', 'Tallahatchie County Plantation Estate', "Freeman owns an historic Mississippi plantation estate — an antebellum property that underscores his deep connection to the American South and his advocacy for civil rights history.", 2, 'MS Property Records'),
      a('morgan-freeman', 3, 'business', 'Revelations Entertainment', "Morgan Freeman's film production company, co-founded with producer Lori McCreary — responsible for producing numerous films including Invictus and other socially conscious projects.", 20, 'Hollywood Reporter 2023'),
    ],
  },
  'jennifer-lopez': {
    netWorth: 0.25,
    assets: [
      a('jennifer-lopez', 1, 'business', 'JLo Beauty Brand', "Jennifer Lopez launched JLo Beauty in 2021 — a clean skincare line built around her famously age-defying look. The brand became profitable within its first year.", 40, 'WWD 2022'),
      a('jennifer-lopez', 2, 'real_estate', 'Bel Air Mansion', "Lopez's primary Los Angeles home — a spectacular Bel Air estate purchased with Ben Affleck in 2023 for $61M, one of the most talked-about celebrity real estate purchases of the year.", 61, 'Property Records 2023'),
      a('jennifer-lopez', 3, 'business', 'Nuyorican Productions', "J.Lo's film and TV production company — which has produced dozens of movies and specials throughout her career, generating significant income beyond her performance fees.", 25, 'Variety 2023'),
      a('jennifer-lopez', 4, 'business', 'Music & Touring Catalog', "Jennifer Lopez's music catalog across 9 studio albums plus lucrative Las Vegas residency earnings represent a significant portion of her wealth.", 30, 'Billboard 2024'),
    ],
  },
  'kobe-bryant': {
    netWorth: 0.6,
    assets: [
      a('kobe-bryant', 1, 'business', 'Granity Studios (Estate)', "Bryant's entertainment and content company, which produced the Oscar-winning animated short 'Dear Basketball,' based on his farewell letter to the sport. Granity continues creating content in partnership with the Kobe Bryant Estate.", 50, 'Hollywood Reporter 2024'),
      a('kobe-bryant', 2, 'real_estate', 'Newport Coast Home (Estate Asset)', "The Bryant family's primary Newport Coast, California home — the 11,000 sq ft Mediterranean-style residence where Kobe lived with Vanessa until his tragic 2020 passing.", 7.9, 'CA Property Records'),
      a('kobe-bryant', 3, 'business', 'Nike/Jordan Kobe Legacy Royalties', "Kobe Bryant's lifetime Nike deal continues generating royalties for the Bryant Estate — the Kobe line remains one of Nike's best-selling basketball shoes even years after his passing.", 30, 'Nike Annual Report 2024'),
      a('kobe-bryant', 4, 'business', 'Kobe Bryant Estate Brand Value', "The Kobe Bryant brand — including his Black Mamba identity, signature shoes, and commercial partnerships — continues generating tens of millions annually for the Bryant Estate.", 20, 'Forbes 2024'),
    ],
  },
  'eddie-murphy': {
    netWorth: 0.2,
    assets: [
      a('eddie-murphy', 1, 'real_estate', 'Beverly Park Estate, Beverly Hills', "Murphy's primary California residence — a sprawling Beverly Park mansion in one of LA's most prestigious gated communities, with unparalleled views and extensive grounds.", 8, 'Property Records'),
      a('eddie-murphy', 2, 'real_estate', 'New Jersey Compound', "Murphy's East Coast retreat — a massive New Jersey estate where he spent years raising his large family away from Hollywood spotlight.", 4, 'NJ Property Records'),
      a('eddie-murphy', 3, 'business', 'Eddie Murphy Productions', "Murphy's production company has operated for decades, handling his film and TV development projects from Coming to America to Dolemite Is My Name and Beverly Hills Cop: Axel F.", 20, 'Box Office Mojo 2024'),
    ],
  },
  'jim-carrey': {
    netWorth: 0.18,
    assets: [
      a('jim-carrey', 1, 'real_estate', 'Brentwood Compound, Los Angeles', "Jim Carrey's primary LA home — a sprawling Brentwood compound featuring art studios where he pursues his serious painting career alongside his acting work.", 12, 'Property Records'),
      a('jim-carrey', 2, 'art', 'Digital Art & Fine Paintings Career', "Carrey pivoted to serious visual art — creating politically charged paintings and digital art that garnered critical attention. He has auctioned pieces for significant sums.", 5, 'Art Market 2022'),
      a('jim-carrey', 3, 'real_estate', 'Maui Property, Hawaii', "Jim Carrey's Hawaiian retreat — a peaceful Maui property used during creative retreats and holiday periods.", 4, 'HI Property Records'),
    ],
  },
  'julia-roberts': {
    netWorth: 0.25,
    assets: [
      a('julia-roberts', 1, 'real_estate', 'Malibu Compound', "Julia Roberts' primary California home — a Malibu estate offering beachfront access and privacy for the Roberts-Moder family.", 8, 'Property Records'),
      a('julia-roberts', 2, 'real_estate', 'Santa Fe Ranch, New Mexico', "Roberts' beloved Taos/Santa Fe area ranch in New Mexico — her spiritual retreat in the high desert where she and Danny Moder spend significant time.", 15, 'NM Property Records'),
      a('julia-roberts', 3, 'real_estate', 'New York City Townhouse', "Roberts' New York home — a historic Greenwich Village townhouse used during Broadway appearances and frequent East Coast visits.", 5, 'NYC Property Records'),
    ],
  },
  'sandra-bullock': {
    netWorth: 0.25,
    assets: [
      a('sandra-bullock', 1, 'real_estate', 'Austin Home, Texas', "Sandra Bullock's primary Texas residence — she has long maintained a home in Austin, a city she championed long before it became a celebrity enclave.", 8, 'TX Property Records'),
      a('sandra-bullock', 2, 'real_estate', 'Tybee Island, Georgia', "Bullock's serene Georgia island retreat — a beach house on Tybee Island near Savannah where she developed deep community ties.", 2, 'GA Property Records'),
      a('sandra-bullock', 3, 'business', 'Fortis Films Production', "Bullock's production company Fortis Films has produced numerous of her projects, giving her creative control and additional backend profit participation.", 15, 'Hollywood Reporter 2023'),
    ],
  },
}

// Apply photo fixes
let photoFixCount = 0
for (const [id, url] of Object.entries(PHOTO_FIXES)) {
  photos[id] = url
  photoFixCount++
}

// Apply enrichments to celebrities
let enrichedCount = 0
let totalNewAssets = 0

for (const [id, data] of Object.entries(ENRICHMENTS)) {
  const celeb = celebs.find(c => c.id === id)
  if (!celeb) {
    console.warn(`⚠  Not found: ${id}`)
    continue
  }

  // Net worth
  if (data.netWorth !== undefined) celeb.netWorth = data.netWorth

  // Merge assets (skip duplicates by name)
  const existingNames = new Set((celeb.assets || []).map(a => a.name.toLowerCase()))
  const newAssets = data.assets.filter(a => !existingNames.has(a.name.toLowerCase()))
  celeb.assets = [...(celeb.assets || []), ...newAssets]

  totalNewAssets += newAssets.length
  console.log(`✓ ${celeb.name}: ${celeb.assets.length} assets (${newAssets.length} new)`)
  enrichedCount++
}

// Handle j-lo duplicate: jennifer-lopez also has id 'j-lo'
const jloAlt = celebs.find(c => c.id === 'j-lo')
if (jloAlt) {
  const data = ENRICHMENTS['jennifer-lopez']
  if (data) {
    const existingNames = new Set((jloAlt.assets || []).map(a => a.name.toLowerCase()))
    const newAssets = data.assets.filter(a => !existingNames.has(a.name.toLowerCase()))
    jloAlt.assets = [...(jloAlt.assets || []), ...newAssets]
    console.log(`✓ J-Lo (alt): ${jloAlt.assets.length} assets (${newAssets.length} new)`)
  }
}

fs.writeFileSync(CELEBS_PATH, JSON.stringify(celebs, null, 2))
fs.writeFileSync(PHOTOS_PATH, JSON.stringify(photos, null, 2))

console.log(`\nDone — ${enrichedCount} celebrities enriched, ${totalNewAssets} new assets added, ${photoFixCount} photo URLs updated`)
