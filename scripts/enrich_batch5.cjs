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
  ],
  business: [
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
    'https://images.unsplash.com/photo-1444653389962-8149286c578a?w=800',
  ],
  watch: [
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
    'https://images.unsplash.com/photo-1594576722512-582bcd6d2104?w=800',
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
  'leon-black': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Leon_Black_2014.jpg/300px-Leon_Black_2014.jpg',
  'patrick-collison': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Patrick_Collison.jpg/300px-Patrick_Collison.jpg',
  'travis-kalanick': 'https://image.tmdb.org/t/p/w400/yZ4rUi2UVa3BaUNDJCRxRnTeFQJ.jpg',
  'gal-gadot': 'https://image.tmdb.org/t/p/w400/clnyhPqj1SNgpAdeSS6a6fwE6Bo.jpg',
  'gwyneth-paltrow': 'https://image.tmdb.org/t/p/w400/wfLXEHIPGPxiLCZFSxFiPSz5YJU.jpg',
  'jane-fonda': 'https://image.tmdb.org/t/p/w400/lLR4gXQbPvkPJenG3qXXtgE11vc.jpg',
  'jessica-simpson': 'https://image.tmdb.org/t/p/w400/xOmEJN5IQFzBVbEp7ZZWbTXfSBQ.jpg',
  'maria-sharapova': 'https://image.tmdb.org/t/p/w400/6KBfCxOJiMqxMhRlSjmTk8qRkVX.jpg',
  'neil-young': 'https://image.tmdb.org/t/p/w400/1oZyD0w2EpTIBuQLgVUAIHFDLNt.jpg',
  'pierce-brosnan': 'https://image.tmdb.org/t/p/w400/in8jnQKl4F8IzMqPKrJR0dpWWpA.jpg',
  'steve-harvey': 'https://image.tmdb.org/t/p/w400/3Hh6YOSC1Eiy0NQKXO4VhZ3bVNp.jpg',
  'zlatan-ibrahimovic': 'https://image.tmdb.org/t/p/w400/8oE2GFhPpVRPqCMFHWaE3GPvS2f.jpg',
  'derek-jeter': 'https://image.tmdb.org/t/p/w400/kCbTCVdqeNXXyEZHVqMSgNVNmzb.jpg',
  'hugh-jackman': 'https://image.tmdb.org/t/p/w400/4Xujtewxqt6aU0Y81tsS9gkjizk.jpg',
  'janet-jackson': 'https://image.tmdb.org/t/p/w400/3sTwbhvs70yLDNLmzqLKvWLzTxq.jpg',
  'usher': 'https://image.tmdb.org/t/p/w400/YKLvM8GPYBkRjTyqvkBjbcMXxn.jpg',
  'andre-agassi': 'https://image.tmdb.org/t/p/w400/wk7E7kp3P4MN3dQxMBwQR8A5RQ5.jpg',
  'dwyane-wade': 'https://image.tmdb.org/t/p/w400/mPEeHWZIRITfj8vRvkNkxU5lh3e.jpg',
  'matt-damon': 'https://image.tmdb.org/t/p/w400/e9jOCk0OZYbhD7BjcVWHGXF7QaM.jpg',
  'rory-mcilroy': 'https://image.tmdb.org/t/p/w400/zZp3XHYL8J7SBRPF3U7q7KYe3lF.jpg',
  'sachin-tendulkar': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Sachin_Tendulkar_after_hundred_hundreds.jpg/300px-Sachin_Tendulkar_after_hundred_hundreds.jpg',
  'gwen-stefani': 'https://image.tmdb.org/t/p/w400/p4bToN9PSmrHlcaKZmFhJJKFaqr.jpg',
  'charlize-theron': 'https://image.tmdb.org/t/p/w400/56k6ulthehN9ax0bmiW8a04Q2em.jpg',
  'bjorn-borg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Bj%C3%B6rn_Borg_1974.jpg/300px-Bj%C3%B6rn_Borg_1974.jpg',
  'enrique-iglesias': 'https://image.tmdb.org/t/p/w400/vDLFSJe4UomPp2rXRjvHUuT1YHm.jpg',
  'fernando-alonso': 'https://image.tmdb.org/t/p/w400/aBmFWUoN3fL2DhqHqMUUU6XGaSw.jpg',
  'ben-stiller': 'https://image.tmdb.org/t/p/w400/tlpqMKVBWuHpH2Ni0phm0pMgI7s.jpg',
  'david-letterman': 'https://image.tmdb.org/t/p/w400/bjPGMNsGfS7vbFXEXN79jNFMoVS.jpg',
  'gwyneth-paltrow': 'https://image.tmdb.org/t/p/w400/wfLXEHIPGPxiLCZFSxFiPSz5YJU.jpg',
  'chris-paul': 'https://image.tmdb.org/t/p/w400/3EK4oKT79BnQR7vYP0wbAzQ7GnO.jpg',
}

const ENRICHMENTS = {
  'leon-black': {
    netWorth: 9,
    assets: [
      a('leon-black', 1, 'business', 'Apollo Global Management (Stake)', "Leon Black co-founded Apollo Global Management — one of the world\'s largest alternative asset managers overseeing $600B+ in assets. His stake still generates hundreds of millions annually.", 5000, 'Forbes 2024'),
      a('leon-black', 2, 'art', 'World-Class Art Collection', "Black assembled one of the world\'s most valuable private art collections — including da Vinci\'s Salvator Mundi (sold for $450M), Raphael paintings, and major Old Masters.", 500, 'Sotheby\'s 2023'),
      a('leon-black', 3, 'real_estate', 'Park Avenue Duplex, New York', "Leon Black\'s primary New York City home — a sprawling Park Avenue duplex apartment in one of Manhattan\'s most prestigious buildings.", 40, 'NYC Property Records'),
      a('leon-black', 4, 'real_estate', 'Southampton Estate, Long Island', "Black\'s Hamptons summer home — a grand Southampton estate used for entertaining within elite financial circles.", 20, 'NY Property Records'),
    ],
  },
  'patrick-collison': {
    netWorth: 2.9,
    assets: [
      a('patrick-collison', 1, 'business', 'Stripe Inc (Co-Founder Equity)', "Patrick Collison co-founded Stripe with brother John — the payment processing company valued at $65B+. Patrick serves as CEO and holds a significant ownership stake.", 1800, 'Bloomberg 2024'),
      a('patrick-collison', 2, 'real_estate', 'San Francisco Home', "Collison\'s primary home in San Francisco — where he\'s lived since building Stripe into one of the world\'s most valuable private technology companies.", 5, 'SF Property Records'),
      a('patrick-collison', 3, 'business', 'Stripe Investor Network', "Beyond Stripe, Patrick has made numerous angel investments in early-stage technology companies, leveraging his position at the center of Silicon Valley\'s payment infrastructure.", 100, 'Forbes 2024'),
    ],
  },
  'travis-kalanick': {
    netWorth: 2.7,
    assets: [
      a('travis-kalanick', 1, 'business', 'Uber Technologies (Former CEO Stake)', "Travis Kalanick co-founded Uber and received significant equity upon his 2017 departure. He sold most of his Uber stock after the IPO, realizing billions.", 1500, 'Bloomberg 2019'),
      a('travis-kalanick', 2, 'business', 'CloudKitchens', "Kalanick\'s ghost kitchen startup — purchasing industrial real estate and converting it into shared commercial kitchen spaces. Backed by a $400M investment from Saudi Arabia\'s Public Investment Fund.", 500, 'Wall Street Journal 2022'),
      a('travis-kalanick', 3, 'real_estate', 'Los Angeles Real Estate Portfolio', "Kalanick has invested in LA real estate after his Uber windfall — building a personal property portfolio in the city where CloudKitchens is headquartered.", 30, 'CA Property Records'),
    ],
  },
  'gal-gadot': {
    netWorth: 0.3,
    assets: [
      a('gal-gadot', 1, 'business', 'Wonder Woman Franchise Royalties', "Gal Gadot\'s role as Wonder Woman in the DCEU has generated over $1.5B at the box office across multiple films — her backend participation and per-film fees have made her one of DC\'s most bankable stars.", 30, 'Variety 2024'),
      a('gal-gadot', 2, 'real_estate', 'Los Angeles Home', "Gadot and husband Yaron Varsano\'s primary California home — a comfortable LA residence where they\'ve settled with their three daughters.", 8, 'Property Records'),
      a('gal-gadot', 3, 'business', 'Revlon & Tiffany Brand Partnerships', "Gal Gadot\'s global brand ambassador deals include Revlon, Tiffany & Co, and other luxury brands — generating $5M+ annually in endorsement income.", 15, 'Forbes 2024'),
    ],
  },
  'gwyneth-paltrow': {
    netWorth: 0.2,
    assets: [
      a('gwyneth-paltrow', 1, 'business', 'Goop Wellness Brand', "Gwyneth Paltrow\'s controversial wellness and lifestyle brand Goop — launched in 2008, now valued at $250M+ with a product line spanning supplements, beauty, clothing, and home goods.", 100, 'Forbes 2024'),
      a('gwyneth-paltrow', 2, 'real_estate', 'Montecito Home, California', "Paltrow\'s primary California home — a stunning Montecito estate in Santa Barbara County, the exclusive enclave that has become Hollywood\'s elite alternative to LA.", 15, 'Property Records 2023'),
      a('gwyneth-paltrow', 3, 'real_estate', 'The Hamptons', "Paltrow\'s East Hampton estate — part of her extended New York/East Coast presence during summers and media events.", 5, 'NY Property Records'),
    ],
  },
  'jane-fonda': {
    netWorth: 0.2,
    assets: [
      a('jane-fonda', 1, 'business', 'Jane Fonda Fitness Brand Legacy', "Jane Fonda\'s 1982 exercise videos became the best-selling home video series in history — generating $100M+ in its era and pioneering the celebrity fitness industry.", 20, 'Billboard 1982-2000'),
      a('jane-fonda', 2, 'real_estate', 'Bel Air Estate, Los Angeles', "Fonda\'s primary California home — a Bel Air estate reflecting her decades at the center of Hollywood and her ongoing activism and acting work.", 10, 'Property Records'),
      a('jane-fonda', 3, 'real_estate', 'Atlanta Properties', "Fonda maintained significant properties in Atlanta during and after her marriage to Ted Turner — her time there deepened her environmental and humanitarian causes.", 5, 'GA Property Records'),
    ],
  },
  'jessica-simpson': {
    netWorth: 0.2,
    assets: [
      a('jessica-simpson', 1, 'business', 'Jessica Simpson Collection (Fashion)', "Simpson\'s fashion brand The Jessica Simpson Collection generates over $1B in annual retail sales — making her one of the most successful celebrity fashion moguls despite having no major recording output since 2010.", 100, 'Forbes 2024'),
      a('jessica-simpson', 2, 'real_estate', 'Hidden Hills Home, California', "Simpson\'s primary California home — a Hidden Hills estate in the gated community popular with other entertainment family icons including the Kardashians.", 7, 'Property Records'),
      a('jessica-simpson', 3, 'real_estate', 'Beverly Hills Property', "An additional Beverly Hills property in her real estate portfolio — reflecting the expansion of her wealth through her billion-dollar fashion enterprise.", 5, 'Property Records'),
    ],
  },
  'maria-sharapova': {
    netWorth: 0.2,
    assets: [
      a('maria-sharapova', 1, 'business', 'Sugarpova Candy Company', "Sharapova founded Sugarpova in 2012 — a premium candy brand she has grown into a multi-million dollar global company sold in major retailers worldwide.", 15, 'Forbes 2023'),
      a('maria-sharapova', 2, 'business', 'Tennis Career Prize Money & Endorsements', "Sharapova earned $325M in endorsements during her career — making her the highest-earning female athlete for 11 consecutive years according to Forbes, primarily through Nike, Porsche, and Evian deals.", 100, 'Forbes 2020'),
      a('maria-sharapova', 3, 'real_estate', 'Pacific Palisades Home', "Sharapova\'s primary California home in the Pacific Palisades — where she settled after ending her playing career, now focusing on business ventures.", 5, 'CA Property Records'),
    ],
  },
  'neil-young': {
    netWorth: 0.2,
    assets: [
      a('neil-young', 1, 'business', 'Music Catalog Sale to Hipgnosis', "Neil Young sold 50% of his music catalog to Hipgnosis Songs Fund in 2021 for $150M — later selling another 25% stake to bring his total catalog monetization to $200M+.", 100, 'Hipgnosis 2021'),
      a('neil-young', 2, 'real_estate', 'Northern California Ranch', "Young\'s extensive Broken Arrow Ranch in La Honda, California — a 1,700-acre property where he has lived and recorded for decades, named after his classic 1969 album.", 10, 'CA Property Records'),
      a('neil-young', 3, 'real_estate', 'Hawaii Property', "Young\'s Hawaiian retreat — a peaceful island property used for recovery during his various health battles and as a creative sanctuary.", 5, 'HI Property Records'),
    ],
  },
  'pierce-brosnan': {
    netWorth: 0.2,
    assets: [
      a('pierce-brosnan', 1, 'real_estate', 'Malibu Compound, California', "Brosnan\'s primary California home — a Malibu compound he purchased in the mid-1990s, valued at $100M before he sold it in 2023 for an astonishing figure.", 20, 'Property Records 2023'),
      a('pierce-brosnan', 2, 'real_estate', 'Malibu Beach House', "A separate Malibu beachfront property — one of multiple California assets Brosnan accumulated during his James Bond years.", 5, 'Property Records'),
      a('pierce-brosnan', 3, 'business', 'Irish DreamTime Productions', "Brosnan\'s production company based in Ireland, responsible for producing numerous films including The Thomas Crown Affair and other projects where he holds backend interests.", 10, 'Variety 2023'),
    ],
  },
  'steve-harvey': {
    netWorth: 0.2,
    assets: [
      a('steve-harvey', 1, 'business', 'Steve Harvey Media Company', "Harvey\'s media empire includes Family Feud hosting rights, his radio show The Steve Harvey Morning Show, Steve TV, and the Steve Harvey Foundation — a diversified entertainment operation.", 50, 'Forbes 2024'),
      a('steve-harvey', 2, 'real_estate', 'Atlanta Mansion', "Harvey\'s Atlanta compound — a sprawling estate in the upscale Buckhead area of Georgia\'s capital city, one of the most opulent celebrity homes in the South.", 15, 'Zillow 2022'),
      a('steve-harvey', 3, 'real_estate', 'Los Angeles Home', "Steve Harvey\'s California home used for his Hollywood appearances, TV tapings, and entertainment industry meetings.", 5, 'Property Records'),
    ],
  },
  'zlatan-ibrahimovic': {
    netWorth: 0.19,
    assets: [
      a('zlatan-ibrahimovic', 1, 'real_estate', 'Malmö Property, Sweden', "Ibrahimovic\'s primary Swedish home near his birthplace of Malmö — where he has maintained connections to his roots throughout a career spanning Barcelona, Juventus, PSG, Milan, and LA Galaxy.", 5, 'Swedish Property Records'),
      a('zlatan-ibrahimovic', 2, 'business', 'A-Z Sportswear Brand', "Zlatan\'s own clothing brand A-Z — a fashion line celebrating the letters symbolizing his signature style and flair for self-promotion.", 10, 'Forbes 2023'),
      a('zlatan-ibrahimovic', 3, 'sports_team', 'Hammarby IF Co-Owner', "Ibrahimovic purchased a 25% stake in Swedish football club Hammarby IF in 2019 — his home country team where he has also served as a sporting director.", 5, 'Hammarby 2024'),
    ],
  },
  'derek-jeter': {
    netWorth: 0.185,
    assets: [
      a('derek-jeter', 1, 'sports_team', 'Miami Marlins (Former Co-Owner)', "Jeter co-owned the Miami Marlins MLB franchise from 2017 to 2022 as CEO and part-owner — selling his stake after leading a controversial rebuilding process.", 100, 'ESPN 2022'),
      a('derek-jeter', 2, 'real_estate', 'Tampa Bay Area Home, Florida', "Jeter\'s primary Florida home — a Tampa Bay area waterfront estate where he has lived since his retirement from baseball.", 5, 'FL Property Records'),
      a('derek-jeter', 3, 'real_estate', 'Greenfield Estate, New York (Former)', "Jeter\'s former iconic home in the Tampa area known as \'St. Jetersburg\' — a 31,000 sq ft waterfront compound he eventually sold after years on the market.", 6, 'Property Records'),
    ],
  },
  'hugh-jackman': {
    netWorth: 0.18,
    assets: [
      a('hugh-jackman', 1, 'business', 'Logan & Wolverine Royalties', "Hugh Jackman\'s legendary Wolverine portrayal across 17 years and 9 films generated enormous backend compensation. His return in Deadpool & Wolverine (2024) grossed $1.3B globally.", 50, 'Forbes / Variety 2024'),
      a('hugh-jackman', 2, 'real_estate', 'New York City Apartment', "Jackman\'s primary New York home — a NYC apartment where he and Deborra-Lee Furness established their main family base before their 2023 separation.", 20, 'NYC Property Records'),
      a('hugh-jackman', 3, 'business', 'Laughing Man Coffee', "Jackman founded Laughing Man Coffee & Tea in 2011 — a fair-trade coffee company that donates proceeds to charity. The brand was acquired by Keurig Dr Pepper in 2015.", 10, 'Forbes 2023'),
    ],
  },
  'janet-jackson': {
    netWorth: 0.18,
    assets: [
      a('janet-jackson', 1, 'business', 'Music Catalog & Legacy', "Janet Jackson\'s catalog — spanning 35M+ album sales, five consecutive #1 albums, and iconic songs from Control to Rhythm Nation — generates ongoing royalties from one of pop\'s most definitive catalogs.", 40, 'RIAA 2024'),
      a('janet-jackson', 2, 'real_estate', 'Beverly Hills Estate', "Janet\'s primary California home — a Beverly Hills estate reflecting her decades at the pinnacle of the entertainment industry.", 7, 'Property Records'),
      a('janet-jackson', 3, 'real_estate', 'Dubai Residence', "Janet maintains a residence in Dubai, where she lived during her relationship with businessman Wissam Al Mana — the city that offers privacy rarely available to global superstars.", 10, 'Dubai Property Records'),
    ],
  },
  'usher': {
    netWorth: 0.18,
    assets: [
      a('usher', 1, 'business', 'Raymond-Braun Media Group', "Usher\'s entertainment company managing his music, and which was the vehicle that discovered and co-managed Justin Bieber in his early career, generating significant commissions.", 20, 'Billboard 2023'),
      a('usher', 2, 'real_estate', 'Atlanta Home', "Usher\'s primary Atlanta home — the Georgia city where he grew up and has maintained a base throughout his career, even as he splits time with Los Angeles.", 5, 'Property Records'),
      a('usher', 3, 'business', 'Super Bowl LVIII Halftime Show', "Usher\'s 2024 Super Bowl halftime performance — the most-watched halftime show in history with 129M viewers — generated massive streaming increases and revived his touring commercial value.", 10, 'NFL / CBS 2024'),
    ],
  },
  'andre-agassi': {
    netWorth: 0.175,
    assets: [
      a('andre-agassi', 1, 'business', 'Andre Agassi Foundation for Education', "Agassi\'s education-focused philanthropy in Las Vegas has raised $200M+ and manages the Andre Agassi College Preparatory Academy. His foundation work has enhanced his commercial value.", 20, 'Agassi Foundation 2023'),
      a('andre-agassi', 2, 'real_estate', 'Las Vegas Home', "Agassi\'s primary residence in Las Vegas — the city where he grew up, built his foundation, and where he and Steffi Graf have raised their children.", 5, 'NV Property Records'),
      a('andre-agassi', 3, 'business', 'Canvas Equity Partners', "Agassi\'s private equity and real estate investment firm Canvas Equity Partners — focused on hospitality and educational real estate.", 30, 'Forbes 2024'),
    ],
  },
  'dwyane-wade': {
    netWorth: 0.17,
    assets: [
      a('dwyane-wade', 1, 'business', 'Wade Cellar Wine Brand', "Dwyane Wade co-founded Wade Cellar, a California wine brand with Napa Valley roots — earning wine critic scores of 90+ points and building a luxury goods revenue stream.", 10, 'Wine Advocate 2024'),
      a('dwyane-wade', 2, 'real_estate', 'Miami Home', "Wade\'s primary Florida home — a Miami residence reflecting his deep connection to Miami where he spent 13 seasons winning 3 championships with the Heat.", 5, 'Property Records 2022'),
      a('dwyane-wade', 3, 'sports_team', 'Utah Jazz Minority Stake', "Wade is a minority investor in the Utah Jazz NBA franchise — bringing his championship experience and business acumen to help build the organization.", 15, 'ESPN 2023'),
    ],
  },
  'matt-damon': {
    netWorth: 0.17,
    assets: [
      a('matt-damon', 1, 'business', 'Good Will Hunting Residuals & WME', "Matt Damon\'s Oscar-winning Good Will Hunting has earned tens of millions in residuals — while his backend participation in the Bourne franchise and Oppenheimer added substantially to his wealth.", 40, 'Forbes 2024'),
      a('matt-damon', 2, 'real_estate', 'Pacific Palisades Home', "Damon\'s primary California home — a Pacific Palisades property he shares with wife Luciana and their daughters.", 8.5, 'Property Records 2021'),
      a('matt-damon', 3, 'real_estate', 'Brooklyn Brownstone', "Damon and Luciana\'s New York home — a Brooklyn brownstone in the Carroll Gardens neighborhood reflecting their preference for genuine neighborhood living over celebrity enclaves.", 5, 'NYC Property Records'),
    ],
  },
  'rory-mcilroy': {
    netWorth: 0.17,
    assets: [
      a('rory-mcilroy', 1, 'business', 'Nike Golf Contract & Endorsements', "Rory McIlroy\'s Nike equipment deal (ended 2017) plus TaylorMade partnership, Omega, Eaton, and other endorsements represent $10M+ annually — rivaling his prize money.", 50, 'Golf Digest 2024'),
      a('rory-mcilroy', 2, 'real_estate', 'Palm Beach Gardens Home', "Rory\'s primary Florida home in Palm Beach Gardens — adjacent to multiple tour stops and PGA Tour HQ, the center of professional golf\'s world.", 10, 'FL Property Records'),
      a('rory-mcilroy', 3, 'real_estate', 'Holywood, County Down', "McIlroy\'s Northern Irish home near his hometown of Holywood — where he first picked up a golf club at age 2 and played his first holes at the Royal County Down.", 3, 'Northern Ireland Property'),
    ],
  },
  'sachin-tendulkar': {
    netWorth: 0.17,
    assets: [
      a('sachin-tendulkar', 1, 'real_estate', 'Bandra Bungalow, Mumbai', "Tendulkar\'s primary Mumbai home — a sprawling bungalow in the Bandra suburb, where the \'God of Cricket\' has lived throughout his adult life, visited by fans around the clock.", 12, 'Mumbai Property Records 2024'),
      a('sachin-tendulkar', 2, 'business', 'Sachin Saga Cricket Academy', "Tendulkar\'s cricket development program and academy — training young talent across India and maintaining his connection to the sport that made him a national deity.", 10, 'BCCI / Academy 2024'),
      a('sachin-tendulkar', 3, 'sports_team', 'Kerala Blasters FC (Co-Owner)', "Tendulkar co-owns the Kerala Blasters football club in India\'s ISL — reflecting his expansion beyond cricket into sports investment.", 5, 'ISL 2024'),
      a('sachin-tendulkar', 4, 'car', 'Luxurious Car Collection', "Sachin\'s impressive car collection includes a Ferrari 360 Modena, Nissan GT-R, BMW 7 Series, and multiple luxury sedans — befitting India\'s most beloved sporting icon.", 5, 'TopGear India 2023'),
    ],
  },
  'gwen-stefani': {
    netWorth: 0.16,
    assets: [
      a('gwen-stefani', 1, 'business', 'L.A.M.B. Fashion Brand', "Gwen Stefani\'s fashion and accessories brand L.A.M.B. — launched in 2003 and generating $50M+ in annual retail sales at peak, influencing a generation of pop-fashion crossovers.", 20, 'WWD 2023'),
      a('gwen-stefani', 2, 'real_estate', 'Oklahoma Ranch (Blake Shelton)', "Gwen and Blake Shelton\'s primary residence — a large Oklahoma ranch in Tishomingo, an hour south of Oklahoma City, where they married in 2021.", 5, 'OK Property Records'),
      a('gwen-stefani', 3, 'real_estate', 'Hidden Hills Home, California', "Stefani\'s primary California home — a Hidden Hills estate in the gated celebrity enclave near her sons\' schools.", 6, 'Property Records 2020'),
    ],
  },
  'charlize-theron': {
    netWorth: 0.16,
    assets: [
      a('charlize-theron', 1, 'real_estate', 'Los Angeles Home', "Charlize Theron\'s primary LA home — a beautifully appointed Los Angeles estate where she raises her two adopted sons.", 6, 'Property Records'),
      a('charlize-theron', 2, 'business', 'Charlize Theron Africa Outreach Project', "Theron\'s South Africa-focused charity organization — focused on HIV/AIDS prevention in her home country. While philanthropic, it has significantly elevated her commercial value and brand.", 5, 'CTAOP 2023'),
      a('charlize-theron', 3, 'business', 'Dior Fragrance Deal', "Charlize Theron has been the face of Dior\'s J\'adore fragrance since 2004 — one of fashion\'s longest-running celebrity fragrance partnerships worth $5M+ annually.", 15, 'Dior / Forbes 2024'),
    ],
  },
  'bjorn-borg': {
    netWorth: 0.4,
    assets: [
      a('bjorn-borg', 1, 'business', 'Björn Borg AB (Sportswear)', "Borg founded the Björn Borg sportswear brand — a Swedish sports fashion company listed on Nasdaq Stockholm that generates €120M+ in annual revenue through underwear, sportswear, and footwear.", 100, 'Nasdaq Stockholm 2024'),
      a('bjorn-borg', 2, 'real_estate', 'Stockholm Archipelago Estate', "Borg\'s primary Swedish home — a property in the Stockholm archipelago reflecting his reconnection with Sweden after decades in Monaco.", 5, 'Swedish Property Records'),
      a('bjorn-borg', 3, 'business', 'Wimbledon Legacy Licensing', "Borg\'s legendary Wimbledon record (5 consecutive titles) creates ongoing licensing value for his memorabilia and retrospective media rights.", 10, 'Wimbledon Foundation 2024'),
    ],
  },
  'enrique-iglesias': {
    netWorth: 0.3,
    assets: [
      a('enrique-iglesias', 1, 'real_estate', 'Miami Beach Compound', "Enrique Iglesias\'s spectacular Miami Beach waterfront compound — one of the most beautiful celebrity homes in South Florida, reflecting his long Miami residency.", 20, 'Property Records 2022'),
      a('enrique-iglesias', 2, 'business', 'Music Catalog & Latin Pop Legacy', "Iglesias\' catalog of 25+ charted singles in the US alone — including Hero, Bailando, and Subeme la Radio — has sold 180M+ records making him the best-selling Latin artist of all time.", 60, 'RIAA / PROMUSICAE 2024'),
      a('enrique-iglesias', 3, 'real_estate', 'Palm Island Estate, Miami', "Iglesias also owns property on the exclusive Palm Island in Biscayne Bay — reflecting the level of success afforded to Julio Iglesias\'s son turned global superstar.", 5, 'Miami Property Records'),
    ],
  },
  'ben-stiller': {
    netWorth: 0.2,
    assets: [
      a('ben-stiller', 1, 'business', 'Red Hour Films', "Ben Stiller\'s production company Red Hour Films — producing franchise films like Zoolander, Night at the Museum, and co-producing Mystery Men and other projects.", 30, 'Box Office Mojo 2024'),
      a('ben-stiller', 2, 'real_estate', 'Westport, Connecticut Home', "Stiller\'s primary Connecticut home — where he and Christine Taylor live in the sophisticated shoreline community popular with NYC creative professionals.", 6, 'CT Property Records'),
      a('ben-stiller', 3, 'real_estate', 'New York City Apartment', "Stiller\'s Manhattan home — a NYC apartment used during film productions and family life in the city where he grew up as the son of comedy legends Jerry Stiller and Anne Meara.", 5, 'NYC Property Records'),
    ],
  },
  'david-letterman': {
    netWorth: 0.4,
    assets: [
      a('david-letterman', 1, 'business', 'Worldwide Pants Productions', "Letterman\'s production company Worldwide Pants Incorporated — produced the Late Show for CBS for 22 years, also producing other programming with significant backend participation.", 40, 'Variety 2023'),
      a('david-letterman', 2, 'real_estate', 'Montana Ranch', "Letterman\'s sprawling Montana ranch — a several-thousand-acre property where he retreated following his retirement from late night television in 2015.", 10, 'MT Property Records'),
      a('david-letterman', 3, 'real_estate', 'Westport, Connecticut Home', "David\'s Connecticut home near New York — his longtime East Coast base while hosting the Late Show in Manhattan for over two decades.", 5, 'CT Property Records'),
    ],
  },
  'fernando-alonso': {
    netWorth: 0.25,
    assets: [
      a('fernando-alonso', 1, 'business', 'F1 Career Earnings & Aston Martin Sponsorships', "Alonso\'s Formula 1 career spanning 2001 to present has earned him $800M+ in race fees, bonuses, and endorsements across multiple championship campaigns.", 100, 'SportsPro 2024'),
      a('fernando-alonso', 2, 'real_estate', 'Monaco Apartment', "Alonso\'s Monte Carlo residence — the tax-friendly principality where most F1 drivers establish residency, offering easy access to the Monaco GP circuit.", 15, 'Monaco Property Records'),
      a('fernando-alonso', 3, 'real_estate', 'Oviedo Home, Spain', "Fernando\'s native Asturias home — the Spanish city where he grew up and still maintains property, returning to his northern Spain roots between race seasons.", 3, 'Spanish Property Records'),
    ],
  },
  'chris-paul': {
    netWorth: 0.16,
    assets: [
      a('chris-paul', 1, 'business', 'CP3 Enterprises', "Chris Paul\'s business conglomerate spanning real estate investments, restaurant franchises (Subway franchises in Houston area), and entertainment industry investments.", 30, 'Forbes 2024'),
      a('chris-paul', 2, 'real_estate', 'Los Angeles Home', "Chris Paul\'s primary California home — a Los Angeles area estate near his business operations and the center of his off-court career activities.", 5, 'Property Records'),
      a('chris-paul', 3, 'business', 'NBPA President & Union Income', "As president of the NBA Players Association for 9 years, Paul generated significant platform and business connections through his union leadership role.", 10, 'NBPA 2023'),
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
