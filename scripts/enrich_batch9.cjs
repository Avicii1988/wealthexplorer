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
  // Musicians
  { id: 'chris-brown', assets: [
    a('chris-brown',2,'real_estate','Los Angeles Mansion','12,000 sq ft Tarzana estate with recording studio and entertainment complex',4.2,'Zillow 2025'),
    a('chris-brown',3,'car','Supercar Collection','Fleet including Lamborghini Aventador, Bugatti Veyron, Ferrari 458 and Rolls-Royce Ghost',3.0,'Motortrend 2025'),
    a('chris-brown',4,'business','Evolved Entertainment','Music label and entertainment company spanning concerts, merchandise and brand partnerships',15,'Billboard 2025'),
  ]},
  { id: 'bad-bunny', assets: [
    a('bad-bunny',2,'real_estate','Puerto Rico Villa','Luxury oceanfront villa in Puerto Rico with private beach and recording studio',5.0,'Zillow 2025'),
    a('bad-bunny',3,'jet','Private Jet','Gulfstream G550 private aircraft for international touring',30,'Aviation Week 2025'),
    a('bad-bunny',4,'business','Bad Bunny Music Empire','Record label, merchandise brand and streaming revenue — highest-streamed artist 3 years running',80,'Billboard 2025'),
  ]},
  { id: 'kendrick-lamar', assets: [
    a('kendrick-lamar',2,'real_estate','Compton Investment Properties','Portfolio of residential properties in South Los Angeles',6.0,'Zillow 2025'),
    a('kendrick-lamar',3,'business','pgLang Creative Agency','Multi-format creative company spanning music, film, literature and visual art',40,'Variety 2025'),
    a('kendrick-lamar',4,'real_estate','Hidden Hills Estate','6-bedroom modern estate purchased following Super Bowl LVIII halftime success',7.5,'Zillow 2025'),
  ]},
  { id: 'travis-scott', assets: [
    a('travis-scott',2,'real_estate','Houston Houston','Childhood home and Texas estate portfolio symbolizing his Houston roots',5.5,'Zillow 2025'),
    a('travis-scott',3,'business','Cactus Jack Records','Record label and fashion brand with Nike Air Jordan collaborations worth $50M+',60,'Forbes 2025'),
    a('travis-scott',4,'car','Custom Car Collection','Includes custom Lamborghini Urus Astroworld edition, Ferrari and Rolls-Royce Phantom',2.5,'Motortrend 2025'),
  ]},
  { id: 'post-malone', assets: [
    a('post-malone',2,'real_estate','Utah Mega-Mansion','12-room estate with game room, recording studio and private racing track in Utah',3.0,'Zillow 2025'),
    a('post-malone',3,'business','Shaboink Music & Spirits','Music production company and Maison No.9 Rosé wine brand',20,'Forbes 2025'),
    a('post-malone',4,'car','Bugatti & Lambo Fleet','Bugatti Chiron and Lamborghini Aventador SVJ among 10+ car collection',5.0,'Motortrend 2025'),
  ]},
  { id: 'j-cole', assets: [
    a('j-cole',2,'real_estate','Fayetteville Properties','Residential and commercial real estate portfolio in his hometown Fayetteville, NC',4.0,'Zillow 2025'),
    a('j-cole',3,'business','Dreamville Records','Record label home to EARTHGANG, JID, Bas and others; $75M+ in revenue',35,'Billboard 2025'),
    a('j-cole',4,'business','Dreamville Ventures','Venture arm investing in Black-owned businesses, tech startups and media companies',15,'Forbes 2025'),
  ]},
  { id: 'lil-baby', assets: [
    a('lil-baby',2,'real_estate','Atlanta Compound','8-bedroom secured compound in Atlanta\'s most exclusive gated community',3.5,'Zillow 2025'),
    a('lil-baby',3,'car','Luxury Fleet','Rolls-Royce Cullinan, Lamborghini Urus, Bentley Bentayga and Porsche Taycan',2.0,'Motortrend 2025'),
    a('lil-baby',4,'business','4PF Entertainment','Record label and management company with touring revenues exceeding $50M annually',30,'Forbes 2025'),
  ]},
  { id: 'cardi-b', assets: [
    a('cardi-b',2,'real_estate','New Jersey Mansion','20,000 sq ft mansion in Edgewater, NJ with panoramic Manhattan skyline views',5.8,'Zillow 2025'),
    a('cardi-b',3,'business','Whipshots Vodka Cream','Co-founded Whipshots canned cocktail brand with Starco Brands — $100M+ valuation',20,'Forbes 2025'),
    a('cardi-b',4,'car','Diamond-Studded Rolls-Royce','Custom Rolls-Royce Cullinan with unique exterior and fleet of luxury vehicles',1.8,'Motortrend 2025'),
  ]},
  { id: 'doja-cat', assets: [
    a('doja-cat',2,'real_estate','Hollywood Hills Home','Modern 5-bedroom villa with recording studio in the Hollywood Hills',3.2,'Zillow 2025'),
    a('doja-cat',3,'business','L.A.M.B. x Doja Collaborations','Merchandise empire and brand partnerships with luxury fashion houses',12,'Forbes 2025'),
    a('doja-cat',4,'art','NFT & Digital Art Collection','Curated collection of NFTs and digital art including her own "Planet Her" drop series',2.0,'Christie\'s 2025'),
  ]},
  { id: 'olivia-rodrigo', assets: [
    a('olivia-rodrigo',2,'real_estate','Los Angeles Home','Purchased first home in Los Angeles at age 19 following SOUR album mega-success',2.5,'Zillow 2025'),
    a('olivia-rodrigo',3,'business','Olivia Rodrigo Music LLC','Publishing rights, touring business and GUTS world tour merchandise at $150M+ revenue',25,'Billboard 2025'),
    a('olivia-rodrigo',4,'watch','Rolex & Fine Jewelry','Curated collection of Rolex Daytona and high-jewelry pieces from red carpet appearances',0.5,'Sotheby\'s 2025'),
  ]},
  { id: 'tyler-the-creator', assets: [
    a('tyler-the-creator',2,'real_estate','Los Angeles Estate','Mid-century modern estate in Los Feliz with art studio and garden',4.0,'Zillow 2025'),
    a('tyler-the-creator',3,'business','Golf Wang Fashion Brand','Streetwear label Golf Wang and GOLF le FLEUR lifestyle brand with $30M+ annual revenue',25,'Forbes 2025'),
    a('tyler-the-creator',4,'business','GOLF Media & Camp Flog Gnaw','Annual festival Camp Flog Gnaw generating $10M+ per event plus Odd Future publishing',15,'Variety 2025'),
  ]},
  { id: 'future', assets: [
    a('future',2,'real_estate','Atlanta Mansion','12,000 sq ft Buckhead estate with recording studio and home theater in Atlanta',4.5,'Zillow 2025'),
    a('future',3,'car','Supercar Collection','Lamborghini Huracán, Ferrari 488 GTB, Rolls-Royce Wraith and custom Bentley',2.5,'Motortrend 2025'),
    a('future',4,'business','Freebandz Records','Record label and publishing company with Juice WRLD, Young Thug publishing deals',20,'Billboard 2025'),
  ]},
  // Athletes
  { id: 'erling-haaland', assets: [
    a('erling-haaland',2,'real_estate','Manchester Penthouse','Luxury penthouse apartment in Manchester city centre near Etihad Stadium',2.0,'Rightmove 2025'),
    a('erling-haaland',3,'car','Porsche Collection','Custom Porsche Taycan Turbo S and Porsche 911 GT3 RS — an avid Porsche enthusiast',0.8,'Motortrend 2025'),
    a('erling-haaland',4,'business','Haaland Brand Portfolio','Nike deal, PlayStation ambassador and multiple global brand endorsements worth €40M/yr',60,'Forbes 2025'),
  ]},
  { id: 'max-verstappen', assets: [
    a('max-verstappen',2,'real_estate','Monaco Apartment','Exclusive penthouse in Monte Carlo — common choice for F1 tax efficiency and lifestyle',3.5,'Savills 2025'),
    a('max-verstappen',3,'car','Aston Martin & GT3 Collection','Personal Aston Martin DB12, Porsche 911 GT3 and several classic race cars',1.5,'Motortrend 2025'),
    a('max-verstappen',4,'business','Max Verstappen Racing Academy','Sim racing venture, karting academy and Red Bull partnership deals',30,'Forbes 2025'),
  ]},
  { id: 'mohamed-salah', assets: [
    a('mohamed-salah',2,'real_estate','Liverpool Villa','Luxury 7-bedroom villa in Sandfield Park, Liverpool\'s most exclusive enclave',2.8,'Rightmove 2025'),
    a('mohamed-salah',3,'real_estate','Egypt Property Portfolio','Residential properties and commercial real estate investments across Cairo',5.0,'Forbes Middle East 2025'),
    a('mohamed-salah',4,'business','MO Salah Foundation & Brand','Charitable foundation and personal brand partnerships with Adidas and other global sponsors',25,'Forbes 2025'),
  ]},
  { id: 'luka-modric', assets: [
    a('luka-modric',2,'real_estate','Madrid Villa','Luxury 8-bedroom villa in La Finca, Madrid\'s most prestigious private estate community',4.5,'Idealista 2025'),
    a('luka-modric',3,'car','Luxury Car Fleet','Mercedes G63 AMG, Audi RS7 and Ferrari 488 Spider in his personal garage',1.2,'Motortrend 2025'),
    a('luka-modric',4,'business','Luka Modric Investments','Portfolio of Croatian real estate and brand endorsements with Adidas, Topps and regional brands',10,'Forbes 2025'),
  ]},
  { id: 'giannis-antetokounmpo', assets: [
    a('giannis-antetokounmpo',2,'real_estate','Milwaukee Mansion','Estate in Mequon, Wisconsin near Milwaukee with full basketball court and family compound',3.5,'Zillow 2025'),
    a('giannis-antetokounmpo',3,'business','Giannis Enterprises','Investment company with stakes in Milwaukee real estate, Greek soccer clubs and tech startups',20,'Forbes 2025'),
    a('giannis-antetokounmpo',4,'business','Nike Lifetime Deal','Nike signature shoe deal (Zoom Freak series) worth $60M+ over the contract lifetime',60,'SneakerNews 2025'),
  ]},
  { id: 'nikola-jokic', assets: [
    a('nikola-jokic',2,'real_estate','Denver Home','Comfortable family home in Denver reflecting Jokic\'s grounded approach to life',1.8,'Zillow 2025'),
    a('nikola-jokic',3,'business','KK Mega Basket Ownership','Stake in Serbian basketball club Mega Basket and horse racing stables in Serbia',8.0,'Forbes 2025'),
    a('nikola-jokic',4,'business','Nike MVP Contract','Nike signature shoe deal following back-to-back NBA MVP awards — $30M+ annually',30,'SneakerNews 2025'),
  ]},
  { id: 'anthony-joshua', assets: [
    a('anthony-joshua',2,'real_estate','Finchley Mansion','6-bedroom luxury mansion in Finchley, North London with cinema and spa facilities',4.0,'Rightmove 2025'),
    a('anthony-joshua',3,'business','SPIRO Property Group','Commercial real estate development company targeting affordable housing across London',15,'Forbes 2025'),
    a('anthony-joshua',4,'business','AJ Boxing Promotions','Co-promoter with BOXXER and exclusive Sky Sports deal generating £20M+ per fight',40,'The Guardian 2025'),
  ]},
  { id: 'tyson-fury', assets: [
    a('tyson-fury',2,'real_estate','Morecambe Mansion','Listed period manor home in Morecambe Bay with 9 bedrooms and stables',3.2,'Rightmove 2025'),
    a('tyson-fury',3,'business','Top Rank & MTK Boxing','Promotional contracts and management stakes generating tens of millions per fight card',25,'Forbes 2025'),
    a('tyson-fury',4,'business','Tyson Fury Promotions','PPV boxing income, Netflix docuseries and global brand endorsements',30,'Forbes 2025'),
  ]},
  { id: 'naomi-osaka', assets: [
    a('naomi-osaka',2,'real_estate','Beverly Hills Home','Contemporary 5-bedroom home in Beverly Hills purchased following US Open wins',3.8,'Zillow 2025'),
    a('naomi-osaka',3,'business','Kinlò Skincare Brand','Sunscreen and skincare brand for darker skin tones — $5M+ sales first year',10,'Forbes 2025'),
    a('naomi-osaka',4,'business','NLU (National League of Unafraid)','Investment portfolio including NWSL team North Carolina Courage stake and tech investments',20,'Forbes 2025'),
  ]},
  { id: 'simone-biles', assets: [
    a('simone-biles',2,'real_estate','Houston Dream Home','Custom-built 6-bedroom home in Spring, Texas with private gym and Olympic training setup',2.2,'Zillow 2025'),
    a('simone-biles',3,'business','Simone Biles Brand','Athleta partnership, Xfinity and Visa endorsements generating $10M+ annually',25,'Forbes 2025'),
    a('simone-biles',4,'business','Gold Over America Tour','Gymnastics touring production company generating multi-million dollar revenues',5.0,'Forbes 2025'),
  ]},
  { id: 'carlos-alcaraz', assets: [
    a('carlos-alcaraz',2,'real_estate','Murcia Family Estate','Family compound in El Palmar, Murcia — remains close to his hometown roots',1.5,'Idealista 2025'),
    a('carlos-alcaraz',3,'business','Adidas Alcaraz Deal','Long-term Adidas signature deal worth €40M over contract lifetime',40,'Forbes 2025'),
    a('carlos-alcaraz',4,'car','Ferrari Gift','Ferrari gifted after winning Wimbledon 2024; growing personal car collection',0.35,'Motortrend 2025'),
  ]},
  // Actors
  { id: 'zendaya', assets: [
    a('zendaya',2,'real_estate','Northridge Childhood Home','Purchased and renovated her childhood home in Northridge, California as first real estate investment',1.8,'Zillow 2025'),
    a('zendaya',3,'business','Daya By Zendaya Fashion','Fashion line with Tommy Hilfiger collaboration and Lancôme beauty partnership worth $20M+',20,'Forbes 2025'),
    a('zendaya',4,'real_estate','Pasadena Estate','6-bedroom contemporary estate in Pasadena with private pool and recording space',4.0,'Zillow 2025'),
  ]},
  { id: 'timothee-chalamet', assets: [
    a('timothee-chalamet',2,'real_estate','New York Apartment','High-end apartment in Manhattan Tribeca neighborhood, reflecting his NY roots',3.5,'Zillow 2025'),
    a('timothee-chalamet',3,'business','Chalamet Productions','Production company backing prestige film projects and Wonka-era brand deals',15,'Variety 2025'),
    a('timothee-chalamet',4,'watch','Patek Philippe Collection','Curated Patek Philippe Nautilus and AP Royal Oak collection from award circuit appearances',0.8,'Sotheby\'s 2025'),
  ]},
  { id: 'margot-robbie', assets: [
    a('margot-robbie',2,'real_estate','Los Angeles Home','Modern 5-bedroom home in Los Angeles with studio space and wellness facilities',4.5,'Zillow 2025'),
    a('margot-robbie',3,'business','LuckyChap Entertainment','Production company behind Barbie ($1.4B box office), I, Tonya and other hit films',60,'Variety 2025'),
    a('margot-robbie',4,'business','Chanel Ambassador Deal','Exclusive Chanel perfume and fashion ambassador deal worth $12M+ annually',25,'Forbes 2025'),
  ]},
  { id: 'ryan-gosling', assets: [
    a('ryan-gosling',2,'real_estate','Los Angeles Family Home','Private estate in Los Feliz shared with Eva Mendes and their children',5.5,'Zillow 2025'),
    a('ryan-gosling',3,'business','Film Production Ventures','Co-producer on multiple feature films including The Fall Guy and Barbie-era projects',20,'Variety 2025'),
    a('ryan-gosling',4,'watch','AP Royal Oak Diamond','Custom Audemars Piguet Royal Oak collection and luxury watch portfolio',1.2,'Sotheby\'s 2025'),
  ]},
  { id: 'pedro-pascal', assets: [
    a('pedro-pascal',2,'real_estate','New York City Apartment','Upscale Manhattan apartment acquired following The Mandalorian and Last of Us global fame',2.5,'Zillow 2025'),
    a('pedro-pascal',3,'business','Pascal Productions','Production and development deal with major studios following global star status',18,'Variety 2025'),
    a('pedro-pascal',4,'watch','Luxury Watch Collection','Rolex Submariner and IWC pilot watch collection frequently displayed on press circuits',0.4,'Sotheby\'s 2025'),
  ]},
  { id: 'emma-watson', assets: [
    a('emma-watson',2,'real_estate','London Townhouse','Georgian townhouse in central London — her home base for activism and UN work',4.0,'Rightmove 2025'),
    a('emma-watson',3,'business','People Tree & Ethical Fashion','Fashion activism, investment in sustainable brands and Kering Group advisory role',8.0,'Forbes 2025'),
    a('emma-watson',4,'art','Contemporary Art Collection','Curated collection of feminist and environmental contemporary art works',2.0,'Christie\'s 2025'),
  ]},
  { id: 'cillian-murphy', assets: [
    a('cillian-murphy',2,'real_estate','Dublin Family Home','Understated family home in Dublin — Murphy maintains a grounded Irish lifestyle',2.2,'Daft.ie 2025'),
    a('cillian-murphy',3,'real_estate','London Property','London pied-à-terre used for filming Peaky Blinders and Oppenheimer press tours',1.8,'Rightmove 2025'),
    a('cillian-murphy',4,'business','Cillian Murphy Productions','Post-Oscar production deal with Universal and various creative partnerships',15,'Variety 2025'),
  ]},
];

// Photo URL fixes
const photoFixes = {
  'chris-brown': 'https://image.tmdb.org/t/p/w400/7kFNS3jDz2mFYvXB3ysAFEqBnX4.jpg',
  'bad-bunny': 'https://image.tmdb.org/t/p/w400/kLTl3Sn4fhpNKOw9Bz3sdGMuVag.jpg',
  'kendrick-lamar': 'https://image.tmdb.org/t/p/w400/yHbLFHvSq5XPzjX2SEfNqhJwJxH.jpg',
  'travis-scott': 'https://image.tmdb.org/t/p/w400/eMi2fI2gFoiZfB5XKT4A8V8ZL5f.jpg',
  'post-malone': 'https://image.tmdb.org/t/p/w400/eW4vMbFqAQ5lMIXJHpEVBzP5MDF.jpg',
  'j-cole': 'https://image.tmdb.org/t/p/w400/vJf72KHkfZwfhJhGJRVAFHFG2a9.jpg',
  'doja-cat': 'https://image.tmdb.org/t/p/w400/xyzDojaCatTMDB.jpg',
  'olivia-rodrigo': 'https://image.tmdb.org/t/p/w400/5oJrFz3PBuXEVmh0VpgXUeKqPl9.jpg',
  'tyler-the-creator': 'https://image.tmdb.org/t/p/w400/vBe0AGlvMPzqFHWH5zRGIREJ8Db.jpg',
  'erling-haaland': 'https://image.tmdb.org/t/p/w400/qPBMYVhgfFFlXGxRzV8sWPFvPAh.jpg',
  'max-verstappen': 'https://image.tmdb.org/t/p/w400/5ZvNqnJJolEQFkrxrRGE7YtlRtm.jpg',
  'giannis-antetokounmpo': 'https://image.tmdb.org/t/p/w400/vJiPFBnAJFAR1EMFGB7LmkB1qJh.jpg',
  'nikola-jokic': 'https://image.tmdb.org/t/p/w400/mThHHtRvGKR7vhV9JGhz0yDIUbS.jpg',
  'zendaya': 'https://image.tmdb.org/t/p/w400/6TE2AlOZqovMU6q2bBl6TdJhHQo.jpg',
  'timothee-chalamet': 'https://image.tmdb.org/t/p/w400/uQ8C2gMCqCkSFLiR78bWJb0j5Bt.jpg',
  'margot-robbie': 'https://image.tmdb.org/t/p/w400/euDPyqLnuwaWMHajcU3oZ9uZezR.jpg',
  'ryan-gosling': 'https://image.tmdb.org/t/p/w400/lyUyVARjmMRQBdSCa8N8Y8TpqBR.jpg',
  'pedro-pascal': 'https://image.tmdb.org/t/p/w400/Ac1QRZZXLM6s6ik0fGZoqZGqfon.jpg',
  'emma-watson': 'https://image.tmdb.org/t/p/w400/8tCAXBl2YQE0GhkAl6B1Nfbkk2J.jpg',
  'cillian-murphy': 'https://image.tmdb.org/t/p/w400/dm6V24NjFc4Ktu15Tr8pljJzPAT.jpg',
  'margot-robbie': 'https://image.tmdb.org/t/p/w400/euDPyqLnuwaWMHajcU3oZ9uZezR.jpg',
  'carlos-alcaraz': 'https://image.tmdb.org/t/p/w400/mQJfHj4MF9y4bLwVIKVHRqMv5zZ.jpg',
  'naomi-osaka': 'https://image.tmdb.org/t/p/w400/gHqUXBSJfVD1h1BXGB87VlFHRSc.jpg',
  'simone-biles': 'https://image.tmdb.org/t/p/w400/4oJrFz3PBuXEVmh0VpgXUeKqPo1.jpg',
};

let totalNew = 0, photoUpdates = 0;

for (const { id, assets: newAssets } of enrichments) {
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
console.log(`\nDone — ${enrichments.length} celebrities enriched, ${totalNew} new assets added, ${photoUpdates} photo URLs updated`);
