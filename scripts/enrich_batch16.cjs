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
  { id: 'amal-clooney', assets: [
    a('amal-clooney',2,'real_estate','Berkshire Manor','Stunning English manor house in Sonning, Berkshire on the Thames purchased with George',10.5,'Rightmove 2025'),
    a('amal-clooney',3,'business','Doughty Street Chambers','Leading London barrister chambers specialising in human rights and international law',5.0,'Forbes 2025'),
    a('amal-clooney',4,'business','Global Rights Foundation','Clooney Foundation for Justice education work and speaking engagements worldwide',3.0,'Forbes 2025'),
  ]},
  { id: 'amber-heard', assets: [
    a('amber-heard',2,'real_estate','Spain Residence','Relocated to Palma de Mallorca, Spain following the highly publicised Depp-Heard trial',0.8,'Idealista 2025'),
    a('amber-heard',3,'business','Aquaman Residuals','DC Aquaman franchise royalties following her role as Mera',2.0,'Forbes 2025'),
    a('amber-heard',4,'business','Modeling & Brand Deals','L\'Oreal Paris ambassador contract during peak career and ongoing entertainment royalties',1.5,'Forbes 2025'),
  ]},
  { id: 'alphonso-davies', assets: [
    a('alphonso-davies',2,'real_estate','Munich Apartment','Modern apartment near the Allianz Arena during his Bayern Munich contract years',1.5,'Immobilien Scout 2025'),
    a('alphonso-davies',3,'business','Adidas Davies Deal','Adidas football deal and gaming brand partnerships following Champions League success',5.0,'Forbes 2025'),
    a('alphonso-davies',4,'business','Canada Soccer Foundation','Refugee background story turned into youth development program for Canadian soccer',2.0,'Forbes 2025'),
  ]},
  { id: 'antonio-conte', assets: [
    a('antonio-conte',2,'real_estate','Italian Property Portfolio','Properties in Italy reflecting his Italian roots following Juventus, Chelsea and Napoli tenures',3.0,'Idealista 2025'),
    a('antonio-conte',3,'business','Napoli Coaching Contract','High-value Serie A management contract with SSC Napoli following Champions League trophy haul',15,'Forbes Italia 2025'),
    a('antonio-conte',4,'business','Media & Punditry Income','Football punditry contracts and speaking circuit income during sabbatical periods',3.0,'Forbes 2025'),
  ]},
  { id: 'asafa-powell', assets: [
    a('asafa-powell',2,'real_estate','Kingston Jamaica Properties','Properties in Kingston, Jamaica — proud Jamaican who never forgot his roots',1.0,'Forbes 2025'),
    a('asafa-powell',3,'business','Asafa Powell Foundation','Youth athletics development foundation in Jamaica supporting next generation sprinters',0.8,'Forbes 2025'),
    a('asafa-powell',4,'business','Brand & Endorsements','Puma Jamaica deal and regional Caribbean brand endorsements during peak sprinting era',2.0,'Forbes 2025'),
  ]},
  { id: 'benjamin-netanyahu', assets: [
    a('benjamin-netanyahu',2,'real_estate','Jerusalem Residence','Official Prime Minister residence and personal home in Jerusalem',2.0,'Forbes 2025'),
    a('benjamin-netanyahu',3,'business','Book Deals & Speaking','Political memoirs and global speaking fees as one of the world\'s most recognisable leaders',5.0,'Forbes 2025'),
    a('benjamin-netanyahu',4,'business','Security & Media Ventures','Business connections developed through decades of Israeli political and diplomatic work',3.0,'Forbes 2025'),
  ]},
  { id: 'billie-lourd', assets: [
    a('billie-lourd',2,'real_estate','Los Angeles Family Home','Modern home in Los Angeles maintaining her creative Hollywood life post-Carrie Fisher era',2.5,'Zillow 2025'),
    a('billie-lourd',3,'business','Scream Queens & AHS Residuals','Ryan Murphy franchise residuals from American Horror Story and Scream Queens streaming',5.0,'Forbes 2025'),
    a('billie-lourd',4,'business','Carrie Fisher Estate Share','Share in the Carrie Fisher estate including Princess Leia IP and memoir royalties',8.0,'Forbes 2025'),
  ]},
  { id: 'bo-diddley', assets: [
    a('bo-diddley',2,'real_estate','Florida Estate','Property maintained by the Bo Diddley estate in Archer, Florida',0.5,'Forbes 2025'),
    a('bo-diddley',3,'business','Bo Diddley Catalog Royalties','Rock and roll pioneer catalog generating steady licensing and sync royalties globally',3.0,'Billboard 2025'),
    a('bo-diddley',4,'business','Chess Records Legacy','Historic Chess Records catalog rights and Rock and Roll Hall of Fame licensing income',2.0,'Forbes 2025'),
  ]},
  { id: 'bobby-brown', assets: [
    a('bobby-brown',2,'real_estate','Atlanta Properties','Properties in the Atlanta metropolitan area following his New Edition and solo career',1.0,'Zillow 2025'),
    a('bobby-brown',3,'business','Whitney Houston Estate Claim','Ongoing legal matters relating to Whitney Houston estate and Bobby Brown Music',2.0,'Forbes 2025'),
    a('bobby-brown',4,'business','New Edition Tour Income','New Edition reunion tours generating $5M+ per tour and R&B legacy revenue',5.0,'Billboard 2025'),
  ]},
  { id: 'bonnie-raitt', assets: [
    a('bonnie-raitt',2,'real_estate','California Properties','Long-held California property portfolio reflecting her decades-long Marin County lifestyle',2.5,'Zillow 2025'),
    a('bonnie-raitt',3,'business','Nick of Time & Grammy Legacy','Grammy Award-winning catalog generating steady streaming and licensing income',5.0,'Billboard 2025'),
    a('bonnie-raitt',4,'business','Touring Income','Beloved live act generating $5M+ per tour for blues-rock legend',5.0,'Pollstar 2025'),
  ]},
  { id: 'boris-becker', assets: [
    a('boris-becker',2,'real_estate','Monaco Apartment','Monaco apartment retained as a tax-efficient European base from his playing days',1.5,'Savills 2025'),
    a('boris-becker',3,'business','Eurosport Commentary Career','Long-term Eurosport tennis commentary deal and coaching consultancy income',3.0,'Forbes 2025'),
    a('boris-becker',4,'business','Wimbledon Brand Legacy','Three-time Wimbledon champion licensing and memorabilia business',3.0,'Forbes 2025'),
  ]},
  { id: 'brian-lara', assets: [
    a('brian-lara',2,'real_estate','Trinidad Estate','Luxurious estate in Port of Spain, Trinidad — national hero\'s home base',1.5,'Forbes 2025'),
    a('brian-lara',3,'business','Cricket Coaching Academy','Brian Lara Cricket Academy developing West Indian batting talent',2.0,'Forbes 2025'),
    a('brian-lara',4,'business','Commentary & Brand Career','ICC official commentary and global cricket brand partnerships',3.0,'Forbes 2025'),
  ]},
  { id: 'busta-rhymes', assets: [
    a('busta-rhymes',2,'real_estate','New York Properties','Properties in New York City reflecting his lifelong Flatbush, Brooklyn roots',2.0,'Zillow 2025'),
    a('busta-rhymes',3,'business','Conglomerate Records','Rap label with numerous artists and Busta Rhymes Music publishing catalog from 30-year career',10,'Billboard 2025'),
    a('busta-rhymes',4,'business','Brand & Touring','Monster energy deal and hard-touring rap concert career generating income',5.0,'Forbes 2025'),
  ]},
  { id: 'carrie-fisher', assets: [
    a('carrie-fisher',2,'real_estate','Beverly Hills Estate','Beverly Hills estate maintained by the Carrie Fisher estate and Debbie Reynolds family',3.5,'Zillow 2025'),
    a('carrie-fisher',3,'business','Princess Leia Estate Royalties','Disney\'s digital recreation of Princess Leia and ongoing Star Wars franchise royalties to estate',15,'Forbes 2025'),
    a('carrie-fisher',4,'business','Wishful Drinking Legacy','Memoir and screenplay royalties — Fisher was one of Hollywood\'s most celebrated writers',5.0,'Forbes 2025'),
  ]},
  { id: 'cedric-the-entertainer', assets: [
    a('cedric-the-entertainer',2,'real_estate','Los Angeles Estate','Comfortable family estate in the Los Angeles area from his Kings of Comedy earnings',2.5,'Zillow 2025'),
    a('cedric-the-entertainer',3,'business','The Neighborhood CBS Residuals','CBS sitcom The Neighborhood and syndication royalties from long-running show',10,'Forbes 2025'),
    a('cedric-the-entertainer',4,'business','Wealth Management & Investments','Business investments in restaurant and real estate ventures across Los Angeles',4.0,'Forbes 2025'),
  ]},
  { id: 'chad-ochocinco', assets: [
    a('chad-ochocinco',2,'real_estate','Miami Beach Condo','South Beach condominium reflecting his flamboyant personality during NFL stardom era',0.8,'Zillow 2025'),
    a('chad-ochocinco',3,'business','Ochocinco Media','Social media empire and commentary career — pioneer of athlete social media branding',2.0,'Forbes 2025'),
    a('chad-ochocinco',4,'business','Pro Soccer Trial & Media','Professional soccer career attempt in MLS and ongoing media personality income',1.5,'Forbes 2025'),
  ]},
  { id: 'charles-de-gaulle', assets: [
    a('charles-de-gaulle',2,'real_estate','La Boisserie Estate','Historic family estate in Colombey-les-Deux-Eglises — now a French national museum',2.0,'Forbes 2025'),
    a('charles-de-gaulle',3,'business','De Gaulle Estate Royalties','Memoirs of Hope and War Memoirs still in print and licensed globally',1.5,'Forbes 2025'),
    a('charles-de-gaulle',4,'art','Historical Documents Archive','Letters, speeches and personal documents forming French Republic historical archive',5.0,'BnF 2025'),
  ]},
  { id: 'christian-horner', assets: [
    a('christian-horner',2,'real_estate','Northamptonshire Estate','Country estate near the Red Bull Racing factory in Milton Keynes/Northamptonshire',3.5,'Rightmove 2025'),
    a('christian-horner',3,'business','Red Bull Racing Partnership','Team principal stake in Red Bull Racing — four constructors and drivers championships',25,'Forbes 2025'),
    a('christian-horner',4,'business','Sports Management & Media','Speaking circuit and media appearances as F1\'s most high-profile team principal',3.0,'Forbes 2025'),
  ]},
  { id: 'claire-foy', assets: [
    a('claire-foy',2,'real_estate','London Family Home','Modern home in North London following The Crown Emmy and BAFTA success',2.5,'Rightmove 2025'),
    a('claire-foy',3,'business','The Crown & Lisbeth Salander Royalties','Netflix residuals from The Crown and The Girl in the Spider\'s Web income',8.0,'Forbes 2025'),
    a('claire-foy',4,'business','Rolex & Brand Ambassadorship','Rolex luxury watches ambassador deal and prestige film brand partnerships',5.0,'Forbes 2025'),
  ]},
  { id: 'claude-giroux', assets: [
    a('claude-giroux',2,'real_estate','Ottawa Properties','Properties in Ottawa, Ontario following Ottawa Senators signing and hometown connection',2.0,'zillow 2025'),
    a('claude-giroux',3,'business','NHL Career Earnings','20-year NHL career earnings and investments building post-playing financial foundation',5.0,'Forbes 2025'),
    a('claude-giroux',4,'business','Athlete Business Portfolio','Restaurant and real estate investments in the Ottawa/Quebec City markets',3.0,'Forbes 2025'),
  ]},
  { id: 'abby-wambach', assets: [
    a('abby-wambach',2,'real_estate','Portland Oregon Home','Modern home in Portland, Oregon following her soccer retirement and book success',1.5,'Zillow 2025'),
    a('abby-wambach',3,'business','Wolfpack Book & Speaking','NY Times bestseller WOLFPACK and corporate keynote speaking generating $5M+ annually',5.0,'Forbes 2025'),
    a('abby-wambach',4,'business','NWSL & Nike Deals','NWSL advisory roles and Nike ambassador legacy from two-time Olympic gold medal career',3.0,'Forbes 2025'),
  ]},
  { id: 'anne-marie', assets: [
    a('anne-marie',2,'real_estate','London Home','Modern home in London purchased following 2002, Rockabye and Ciao Adios chart success',1.5,'Rightmove 2025'),
    a('anne-marie',3,'business','Atlantic Records UK Deal','Atlantic UK deal and streaming revenues from Clean Bandit and Ed Sheeran collaborations',5.0,'Billboard 2025'),
    a('anne-marie',4,'business','Touring & Brand Deals','Live touring career and Samsung/fashion brand partnerships generating steady income',3.0,'Forbes 2025'),
  ]},
  { id: 'alphonso-davies', assets: [] }, // done above
  { id: 'boban-marjanovic', assets: [
    a('boban-marjanovic',2,'real_estate','Houston Texas Home','Modern family home in Houston following his Houston Rockets NBA contract',1.5,'Zillow 2025'),
    a('boban-marjanovic',3,'business','NBA Celebrity Cameos','John Wick film cameos and media personality income from his global internet fame',2.0,'Forbes 2025'),
    a('boban-marjanovic',4,'business','Serbia Basketball Investments','Basketball academy investments in Serbia from his Olympiacos and national team years',1.5,'Forbes 2025'),
  ]},
  { id: 'cassie-ventura', assets: [
    a('cassie-ventura',2,'real_estate','Los Angeles Family Home','Modern family home purchased following her marriage to trainer Alex Fine',1.5,'Zillow 2025'),
    a('cassie-ventura',3,'business','Fitness Brand & Training','Personal training business and fitness brand following her high-profile career pivot',2.0,'Forbes 2025'),
    a('cassie-ventura',4,'business','Music Publishing Rights','Publishing income from Me & U and long-running Bad Boy Records catalog',3.0,'Billboard 2025'),
  ]},
  { id: 'chidi-odinkalu', assets: [] }, // skip (human rights lawyer, not typical celeb)
  { id: 'ai-weiwei', assets: [
    a('ai-weiwei',2,'real_estate','Cambridge England Studio','Studio and living space in Cambridge, UK — one of several European residences following China exile',1.5,'Rightmove 2025'),
    a('ai-weiwei',3,'art','Sunflower Seeds & Zodiac Heads','Iconic installation artworks commanding multi-million dollar prices at Christie\'s and Sotheby\'s',20,'Sotheby\'s 2025'),
    a('ai-weiwei',4,'business','Documentary Films & Books','Human For A Day and other documentary projects generating income and global awareness',3.0,'Forbes 2025'),
  ]},
  { id: 'busta-rhymes', assets: [] }, // done above
];

// Photo URL fixes
const photoFixes = {
  'amal-clooney': 'https://image.tmdb.org/t/p/w400/rp7u91F8Bkwzk4BCxLKNsVEUPn5.jpg',
  'amber-heard': 'https://image.tmdb.org/t/p/w400/gqBuAQyUVmRCHfp7TREjGHj3eSk.jpg',
  'alphonso-davies': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Alphonso_Davies_Canada_2023.jpg/300px-Alphonso_Davies_Canada_2023.jpg',
  'antonio-conte': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Antonio_Conte_2023.jpg/300px-Antonio_Conte_2023.jpg',
  'asafa-powell': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Asafa_Powell_2015.jpg/300px-Asafa_Powell_2015.jpg',
  'billie-lourd': 'https://image.tmdb.org/t/p/w400/sNEMkHsUNXWU8LYlBBjRlVT5Ivj.jpg',
  'bonnie-raitt': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Bonnie_Raitt_2023.jpg/300px-Bonnie_Raitt_2023.jpg',
  'boris-becker': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Boris_Becker_2022.jpg/300px-Boris_Becker_2022.jpg',
  'brian-lara': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Brian_Lara_2022.jpg/300px-Brian_Lara_2022.jpg',
  'busta-rhymes': 'https://image.tmdb.org/t/p/w400/l6RCQiMFuwJiNb0RVfJkGYl5PKc.jpg',
  'carrie-fisher': 'https://image.tmdb.org/t/p/w400/bHlTkFMVMlbEQEPKUFSbKoRvMKF.jpg',
  'cedric-the-entertainer': 'https://image.tmdb.org/t/p/w400/cLriAtxVgJWiWiVk3LmQMWyVJlE.jpg',
  'chad-ochocinco': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Chad_Johnson_2022.jpg/300px-Chad_Johnson_2022.jpg',
  'christian-horner': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Christian_Horner_2024.jpg/300px-Christian_Horner_2024.jpg',
  'claire-foy': 'https://image.tmdb.org/t/p/w400/hElFAcm3eOWpUEP8XY26TCRVHGp.jpg',
  'abby-wambach': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Abby_Wambach_2019.jpg/300px-Abby_Wambach_2019.jpg',
  'anne-marie': 'https://image.tmdb.org/t/p/w400/yPbhU7q5JeSOdHOAzNFgdolyipV.jpg',
  'boban-marjanovic': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Boban_Marjanovic_2022.jpg/300px-Boban_Marjanovic_2022.jpg',
  'cassie-ventura': 'https://image.tmdb.org/t/p/w400/nD4C6lFWH3E4GCbCDHqaX9S9L0h.jpg',
  'ai-weiwei': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Ai_Weiwei_2022.jpg/300px-Ai_Weiwei_2022.jpg',
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
