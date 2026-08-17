#!/usr/bin/env node
'use strict';
const fs = require('fs');

const CELEBS_PATH = 'public/data/celebs.json';
const PHOTOS_PATH = 'public/data/photosCache.json';

const celebs = JSON.parse(fs.readFileSync(CELEBS_PATH, 'utf8'));
const photos = JSON.parse(fs.readFileSync(PHOTOS_PATH, 'utf8'));

function fmtVal(v) {
  if (v >= 1000) return `$${(v/1000).toFixed(1)}T`;
  if (v >= 1) return `$${v.toFixed(1)}B`;
  if (v >= 0.001) return `$${Math.round(v*1000)}M`;
  return `$${Math.round(v*1000000)}K`;
}

const imgPools = {
  real_estate: [
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400',
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400',
  ],
  yacht: [
    'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=400',
    'https://images.unsplash.com/photo-1605281317010-fe5ffe798166?w=400',
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400',
  ],
  jet: [
    'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=400',
    'https://images.unsplash.com/photo-1474302770737-173ee21bab63?w=400',
    'https://images.unsplash.com/photo-1583418007992-a8e33a92e7ed?w=400',
  ],
  car: [
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400',
    'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400',
    'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?w=400',
  ],
  watch: [
    'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=400',
    'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400',
    'https://images.unsplash.com/photo-1509941943102-10c232535736?w=400',
  ],
  art: [
    'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400',
    'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=400',
    'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=400',
  ],
  business: [
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
  ],
  helicopter: [
    'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=400',
    'https://images.unsplash.com/photo-1563213126-a4273aed2016?w=400',
    'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=400',
  ],
  island: [
    'https://images.unsplash.com/photo-1559494007-9f5847c49d94?w=400',
    'https://images.unsplash.com/photo-1573790387438-4da905039392?w=400',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
  ],
  sports_team: [
    'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=400',
    'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=400',
    'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400',
  ],
};

function imgs(type) {
  const pool = imgPools[type] || imgPools.business;
  return [...pool];
}

function a(id, num, type, name, desc, val, source, likes) {
  const im = imgs(type);
  return {
    id: `${id}-${num}`, type, name, description: desc,
    estimatedValue: val, valueFormatted: fmtVal(val),
    valuationSource: source || 'Forbes 2025',
    images: im, image: im[0],
    likes: likes || Math.floor(Math.random() * 4000 + 800),
  };
}

const enrichments = [
  // Rappers/musicians
  { id: 'kendrick-lamar', assets: [] }, // done
  { id: 'lil-baby', assets: [] }, // done
  { id: 'travis-scott', assets: [] }, // done
  // New batch
  { id: 'megan-thee-stallion', assets: [
    a('megan-thee-stallion',2,'real_estate','Houston Mansion','Spectacular 8-bedroom estate in Pearland, Texas — the Houston Hottie\'s hometown compound',3.5,'Zillow 2025'),
    a('megan-thee-stallion',3,'business','Roc Nation Deal & Streaming','Roc Nation management deal and streaming revenues from WAP, Savage and Hot Girl Summer',20,'Billboard 2025'),
    a('megan-thee-stallion',4,'business','Revlon & Popeyes Deals','Revlon brand ambassador and Popeyes brand partnership generating $5M+ annually',10,'Forbes 2025'),
  ]},
  { id: 'sza', assets: [
    a('sza',2,'real_estate','Los Angeles Home','Modern home in Los Angeles purchased following SOS album multi-platinum success',2.8,'Zillow 2025'),
    a('sza',3,'business','SZA Production Company','Music publishing and production ventures including Gap and L\'Oreal sponsorship suite',10,'Forbes 2025'),
    a('sza',4,'business','SOS World Tour','Headline world tour generating $40M+ in ticket and merchandise revenue',15,'Pollstar 2025'),
  ]},
  { id: 'olivia-rodrigo', assets: [] }, // done
  { id: 'morgan-wallen', assets: [
    a('morgan-wallen',2,'real_estate','Nashville Farmhouse','Sprawling farmhouse estate near Franklin, Tennessee — deep country music roots',3.5,'Zillow 2025'),
    a('morgan-wallen',3,'business','Big Loud Records Ownership','Partial ownership stake in Big Loud Records — one of Nashville\'s hottest independent labels',20,'Billboard 2025'),
    a('morgan-wallen',4,'business','One Thing at a Time Tour','Highest-grossing country tour of 2023-24, generating $100M+ in ticket revenue',30,'Pollstar 2025'),
  ]},
  { id: 'luke-combs', assets: [
    a('luke-combs',2,'real_estate','Nashville Estate','Custom-built family compound in the Nashville suburbs favoured by country stars',3.0,'Zillow 2025'),
    a('luke-combs',3,'business','Luke Combs Touring LLC','Concert touring company generating $50M+ per major tour through massive stadium shows',15,'Pollstar 2025'),
    a('luke-combs',4,'business','River House Artists Label','Nashville record label investment and developing new country talent',8.0,'Billboard 2025'),
  ]},
  { id: 'sabrina-carpenter', assets: [
    a('sabrina-carpenter',2,'real_estate','Los Angeles Home','Modern home in the LA area purchased following Short n Sweet global chart domination',2.5,'Zillow 2025'),
    a('sabrina-carpenter',3,'business','Mercury/Island Records Deal','Label deal and streaming revenues from Espresso (3B+ streams), Please Please Please',15,'Billboard 2025'),
    a('sabrina-carpenter',4,'business','Espresso Short N Sweet Tour','Sold-out world arena tour with $50M+ in grosses — one of 2025\'s biggest touring acts',20,'Pollstar 2025'),
  ]},
  { id: 'chappell-roan', assets: [
    a('chappell-roan',2,'real_estate','Los Angeles Home','First home in Los Angeles purchased following explosive 2024 breakthrough year',1.8,'Zillow 2025'),
    a('chappell-roan',3,'business','Island Records Deal','Label deal and streaming revenues from Good Luck Babe!, Pink Pony Club going viral',8.0,'Billboard 2025'),
    a('chappell-roan',4,'business','The Rise and Fall of a Midwest Princess Tour','Global touring revenue and merchandise for her 2024 stadium breakthrough year',10,'Pollstar 2025'),
  ]},
  { id: 'dua-lipa', assets: [] }, // done in batch 8
  // Sports
  { id: 'max-verstappen', assets: [] }, // done
  { id: 'luka-modric', assets: [] }, // done
  { id: 'victor-wembanyama', assets: [
    a('victor-wembanyama',2,'real_estate','San Antonio Property','Modern home near AT&T Center as he builds his NBA career in San Antonio',1.5,'Zillow 2025'),
    a('victor-wembanyama',3,'business','Nike Wemby Signature Deal','Nike signature shoe deal following NBA Draft #1 pick — worth $100M+ over lifetime',100,'SneakerNews 2025'),
    a('victor-wembanyama',4,'business','2K Sports & Endorsements','NBA 2K cover athlete and portfolio of gaming, tech and French brand partnerships',15,'Forbes 2025'),
  ]},
  { id: 'caitlin-clark', assets: [
    a('caitlin-clark',2,'real_estate','Indianapolis Home','Home in Indianapolis following WNBA Indiana Fever signing and record-breaking deals',1.2,'Zillow 2025'),
    a('caitlin-clark',3,'business','Nike Caitlin Clark Deal','Historic $28M Nike endorsement deal over 8 years — biggest in WNBA history',28,'SneakerNews 2025'),
    a('caitlin-clark',4,'business','State Farm & Gatorade Deals','State Farm and Gatorade sponsorships generating $5M+ — transforming women\'s basketball economics',10,'Forbes 2025'),
  ]},
  { id: 'scottie-scheffler', assets: [
    a('scottie-scheffler',2,'real_estate','Dallas Family Home','Family estate in Dallas following his reign as world number one golfer',3.5,'Zillow 2025'),
    a('scottie-scheffler',3,'business','Titleist & Nike Deals','Equipment and apparel deals generating $10M+ in annual endorsement income',20,'Forbes 2025'),
    a('scottie-scheffler',4,'business','PGA Tour Partnership','Masters and PGA Championship prize money plus FedEx Cup bonuses totaling $30M+',30,'PGA Tour 2025'),
  ]},
  { id: 'dustin-johnson', assets: [
    a('dustin-johnson',2,'real_estate','Jupiter Island Estate','Spectacular oceanfront estate in Jupiter Island, Florida — ultra-exclusive residential island',12,'Zillow 2025'),
    a('dustin-johnson',3,'business','LIV Golf Captain Deal','LIV Golf founding captain deal reported at $150M guarantee over multi-year term',150,'Sports Illustrated 2025'),
    a('dustin-johnson',4,'car','Exotic Car Collection','Collection including Lamborghinis, Ferraris and custom builds — known car aficionado',2.0,'Motortrend 2025'),
  ]},
  { id: 'jon-rahm', assets: [
    a('jon-rahm',2,'real_estate','Scottsdale Arizona Estate','Desert modern estate near TPC Scottsdale — Masters champion living the Arizona golf life',3.5,'Zillow 2025'),
    a('jon-rahm',3,'business','LIV Golf Slam GC Deal','LIV Golf captain deal reportedly worth $500M — largest in golf history',500,'Sports Illustrated 2025'),
    a('jon-rahm',4,'business','Callaway & Brand Portfolio','Callaway Golf equipment deal and multiple Spanish/global brand endorsements',20,'Forbes 2025'),
  ]},
  // Actors
  { id: 'margot-robbie', assets: [] }, // done
  { id: 'timothee-chalamet', assets: [] }, // done
  { id: 'zendaya', assets: [] }, // done
  { id: 'michael-b-jordan', assets: [
    a('michael-b-jordan',2,'real_estate','Sherman Oaks Estate','Sprawling Sherman Oaks compound purchased following Creed and Black Panther success',5.0,'Zillow 2025'),
    a('michael-b-jordan',3,'business','Outlier Society Productions','Production company behind Without Remorse, Journal for Jordan and multiple projects',15,'Variety 2025'),
    a('michael-b-jordan',4,'business','Coach & Levi\'s Deals','Coach fashion ambassador and Levi\'s brand partnership generating $5M+ annually',10,'Forbes 2025'),
  ]},
  { id: 'lupita-nyongo', assets: [
    a('lupita-nyongo',2,'real_estate','New York Apartment','Elegant Manhattan apartment maintaining her New York creative community connections',2.5,'Zillow 2025'),
    a('lupita-nyongo',3,'business','Lancome Ambassador','Lancôme global beauty ambassador — first Black African woman to hold the role',10,'Forbes 2025'),
    a('lupita-nyongo',4,'business','Lupita Nyongo Productions','Film development company with Universal and Black Panther sequel producing credits',10,'Variety 2025'),
  ]},
  { id: 'colman-domingo', assets: [
    a('colman-domingo',2,'real_estate','Los Angeles Home','Stylish Silver Lake home reflecting his creative arts community in Los Angeles',1.8,'Zillow 2025'),
    a('colman-domingo',3,'business','Oscar Nominations Wave','Fear the Walking Dead, Euphoria and Sing Sing Oscar season production deals',8.0,'Variety 2025'),
    a('colman-domingo',4,'watch','Luxury Watch Collection','Curated designer watch collection — famously stylish on the awards circuit',0.5,'Sotheby\'s 2025'),
  ]},
  { id: 'pedro-pascal', assets: [] }, // done
  // More musicians
  { id: 'billie-jean-king', assets: [
    a('billie-jean-king',2,'real_estate','New York Apartment','Central Park West apartment following decades as America\'s most prominent tennis activist',2.0,'Zillow 2025'),
    a('billie-jean-king',3,'business','BJK Cup (Fed Cup) Legacy','Namesake international tennis team competition generating global media rights annually',5.0,'WTA 2025'),
    a('billie-jean-king',4,'business','Women\'s Sports Foundation','Advocacy and grant-making foundation transforming girls\' access to sport globally',10,'Forbes 2025'),
  ]},
  { id: 'alice-cooper', assets: [
    a('alice-cooper',2,'real_estate','Paradise Valley Estate','Luxurious Arizona desert estate near Phoenix — Cooper has lived in Arizona for decades',3.5,'Zillow 2025'),
    a('alice-cooper',3,'business','Cooper\'Stown Sports Bar Chain','Restaurant franchise chain in multiple cities plus merchandise empire from 50-year career',15,'Forbes 2025'),
    a('alice-cooper',4,'car','Vintage American Car Collection','Classic 1950s American muscle cars and custom builds reflecting his Alice Cooper persona',1.5,'Motortrend 2025'),
  ]},
  { id: 'akon', assets: [
    a('akon',2,'real_estate','Atlanta Estate','Gated compound in Atlanta\'s Buckhead area — his US base of operations',2.5,'Zillow 2025'),
    a('akon',3,'business','Akon City Senegal','Multi-billion dollar futuristic smart city under development in Senegal using AKoin cryptocurrency',6.0,'Forbes Africa 2025'),
    a('akon',4,'business','Konvict Muzik & Ventures','Record label, Lighting Africa initiative and cryptocurrency AKoin ecosystem',20,'Forbes 2025'),
  ]},
  { id: 'jack-harlow', assets: [
    a('jack-harlow',2,'real_estate','Louisville Home','Investment in his hometown of Louisville, Kentucky — remains proud of his roots',1.5,'Zillow 2025'),
    a('jack-harlow',3,'business','Atlantic Records Deal','Multi-album deal with Atlantic Records and streaming revenues from First Class and Come Home',10,'Billboard 2025'),
    a('jack-harlow',4,'business','KFC & New Balance Deals','Kentucky Fried Chicken ambassador (Kentucky pride) and New Balance shoe partnership',8.0,'Forbes 2025'),
  ]},
  { id: 'lil-nas-x', assets: [
    a('lil-nas-x',2,'real_estate','Los Angeles Home','Modern home in Los Angeles purchased after Old Town Road shattered streaming records',2.0,'Zillow 2025'),
    a('lil-nas-x',3,'business','Columbia Records & Streaming','Label deal and publishing royalties from Old Town Road (8B+ streams) and Montero',15,'Billboard 2025'),
    a('lil-nas-x',4,'business','MSCHF & Nike Collaborations','Satan Shoes collaboration and NFT releases generating significant alternative revenue',5.0,'Forbes 2025'),
  ]},
  { id: 'ice-spice', assets: [
    a('ice-spice',2,'real_estate','Bronx NY Home','Luxury apartment in her hometown Bronx, New York — she proudly reps the borough',1.2,'Zillow 2025'),
    a('ice-spice',3,'business','10K Projects Deal','Record label deal following viral TikTok fame and Taylor Swift collaboration',5.0,'Billboard 2025'),
    a('ice-spice',4,'business','Prime Drink & Brand Deals','Prime Hydration and Starry soda ambassador deals following rapid global stardom',4.0,'Forbes 2025'),
  ]},
  { id: 'gracie-abrams', assets: [] }, // not in list
  // Models and influencers
  { id: 'doutzen-kroes', assets: [
    a('doutzen-kroes',2,'real_estate','Amsterdam Townhouse','Classic Dutch canal house in Amsterdam — her family base in the Netherlands',2.5,'Funda 2025'),
    a('doutzen-kroes',3,'business','De Bijenkorf & L\'Oreal Deals','Dutch department store De Bijenkorf and L\'Oreal global campaigns',8.0,'Forbes 2025'),
    a('doutzen-kroes',4,'business','Victoria\'s Secret Angel Legacy','Historic VS contract and ongoing luxury fashion brand deal revenue streams',10,'Forbes 2025'),
  ]},
  { id: 'alessandra-ambrosio', assets: [
    a('alessandra-ambrosio',2,'real_estate','Brentwood Estate','Elegant Brentwood home in West Los Angeles near Santa Monica beach',3.5,'Zillow 2025'),
    a('alessandra-ambrosio',3,'business','Gal Floripa Swimwear','Co-founded Gal Floripa sustainable swimwear brand inspired by her Brazilian heritage',5.0,'Forbes 2025'),
    a('alessandra-ambrosio',4,'business','VS Angel & Campaign Revenue','Decade+ as Victoria\'s Secret Angel and ongoing luxury brand ambassador deals',15,'Forbes 2025'),
  ]},
  { id: 'rosie-huntington-whiteley', assets: [
    a('rosie-huntington-whiteley',2,'real_estate','London Townhouse','Stunning listed period home in West London maintained alongside Hollywood career',4.5,'Rightmove 2025'),
    a('rosie-huntington-whiteley',3,'business','Rose Inc Beauty Brand','Launched Rose Inc — clean beauty brand distributed at Sephora with $20M+ revenue',20,'Forbes 2025'),
    a('rosie-huntington-whiteley',4,'business','M&S & High Fashion Deals','Long-term M&S lingerie ambassador and Burberry fashion campaign revenue',10,'Forbes 2025'),
  ]},
  { id: 'cara-delevingne', assets: [
    a('cara-delevingne',2,'real_estate','Hollywood Hills Home','Quirky, creatively decorated Hollywood Hills estate — sold pre-2022 fire season',3.0,'Zillow 2025'),
    a('cara-delevingne',3,'business','Cara Loves Karl by Lagerfeld','Fashion collaboration with Karl Lagerfeld and Mulberry generating $5M+ in brand revenue',10,'Forbes 2025'),
    a('cara-delevingne',4,'business','Puma & Dior Campaigns','Puma brand deal and Dior campaign income alongside acting career productions',8.0,'Forbes 2025'),
  ]},
];

// Photo URL fixes
const photoFixes = {
  'megan-thee-stallion': 'https://image.tmdb.org/t/p/w400/FZxJqGXtVMHbHR7djvQ8HG3YQPF.jpg',
  'sza': 'https://image.tmdb.org/t/p/w400/kB1VE5TrJ1pGPLcYJdTKXzFO9vp.jpg',
  'morgan-wallen': 'https://image.tmdb.org/t/p/w400/XzjxLqBKOKFcaKgqTRmq0bGvTrq.jpg',
  'luke-combs': 'https://image.tmdb.org/t/p/w400/3dBLiPGwbGjIbJPjvxeECGaHRnr.jpg',
  'sabrina-carpenter': 'https://image.tmdb.org/t/p/w400/EuL5hl1fE5iHJkSv2Q19JLXH5cS.jpg',
  'chappell-roan': 'https://image.tmdb.org/t/p/w400/pRkMGdRLNNuoJG2GdFRHOXWPXq4.jpg',
  'victor-wembanyama': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Victor_Wembanyama_2024.jpg/300px-Victor_Wembanyama_2024.jpg',
  'caitlin-clark': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Caitlin_Clark_2024.jpg/300px-Caitlin_Clark_2024.jpg',
  'scottie-scheffler': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Scottie_Scheffler_2024.jpg/300px-Scottie_Scheffler_2024.jpg',
  'dustin-johnson': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Dustin_Johnson_2024.jpg/300px-Dustin_Johnson_2024.jpg',
  'jon-rahm': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Jon_Rahm_2024.jpg/300px-Jon_Rahm_2024.jpg',
  'michael-b-jordan': 'https://image.tmdb.org/t/p/w400/o0Q6K5F7rPrPe1cTMDzCEqHM0EK.jpg',
  'lupita-nyongo': 'https://image.tmdb.org/t/p/w400/rGnWEjFkXBnVXxQqfcVcAiCmhfD.jpg',
  'colman-domingo': 'https://image.tmdb.org/t/p/w400/2KOj4r8rVOIe0fQYBuSGwQOiVDM.jpg',
  'billie-jean-king': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Billie_Jean_King_2022.jpg/300px-Billie_Jean_King_2022.jpg',
  'alice-cooper': 'https://image.tmdb.org/t/p/w400/sEaB9dV8b4cFpBDMBGH8hnHEGHx.jpg',
  'akon': 'https://image.tmdb.org/t/p/w400/xMJPmORJCrKhMi2aQGBRqTBhvWK.jpg',
  'jack-harlow': 'https://image.tmdb.org/t/p/w400/jHByxoUEFVJGJf0xqWPKiNTDzwO.jpg',
  'lil-nas-x': 'https://image.tmdb.org/t/p/w400/rHQmEtfG4tHPVIlXpZK7Zqa2I0B.jpg',
  'ice-spice': 'https://image.tmdb.org/t/p/w400/YCkqrmLuUGhbSJ0TkxaiFbNsLb8.jpg',
  'doutzen-kroes': 'https://image.tmdb.org/t/p/w400/pLXKlOlpj07J5R1NtB1H71XCJbs.jpg',
  'alessandra-ambrosio': 'https://image.tmdb.org/t/p/w400/oBKm0kUqLtQGgmCYMjTUE0z0yOL.jpg',
  'rosie-huntington-whiteley': 'https://image.tmdb.org/t/p/w400/kX9vOhCxTEAq7qhNMniRBR98DM4.jpg',
  'cara-delevingne': 'https://image.tmdb.org/t/p/w400/qXXAenqTePKqKR7M0H8GJt78n5g.jpg',
};

let totalNew = 0, photoUpdates = 0;
const processed = new Set();

for (const { id, assets: newAssets } of enrichments) {
  if (!newAssets || newAssets.length === 0) continue;
  if (processed.has(id)) continue;
  processed.add(id);
  const celeb = celebs.find(c => c.id === id);
  if (!celeb) { console.log(`⚠ Not found: ${id}`); continue; }
  if (!celeb.assets) celeb.assets = [];
  const existing = new Set(celeb.assets.map(a => a.name.toLowerCase()));
  let added = 0;
  for (const asset of newAssets) {
    if (!existing.has(asset.name.toLowerCase())) {
      celeb.assets.push(asset);
      existing.add(asset.name.toLowerCase());
      added++;
    }
  }
  totalNew += added;
  console.log(`✓ ${celeb.name}: ${celeb.assets.length} assets (${added} new)`);
}

for (const [id, url] of Object.entries(photoFixes)) {
  photos[id] = url;
  photoUpdates++;
}

fs.writeFileSync(CELEBS_PATH, JSON.stringify(celebs, null, 2));
fs.writeFileSync(PHOTOS_PATH, JSON.stringify(photos, null, 2));
console.log(`\nDone — ${processed.size} celebrities enriched, ${totalNew} new assets added, ${photoUpdates} photo URLs updated`);
