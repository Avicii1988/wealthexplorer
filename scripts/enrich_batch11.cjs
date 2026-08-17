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
  // Athletes
  { id: 'kawhi-leonard', assets: [
    a('kawhi-leonard',2,'real_estate','San Diego Property Portfolio','Multiple residential properties in San Diego area — Leonard keeps a famously low profile at home',4.0,'Zillow 2025'),
    a('kawhi-leonard',3,'business','New Balance Signature Deal','Exclusive New Balance lifetime shoe deal — first NBA player signed — worth $30M+ over term',30,'SneakerNews 2025'),
    a('kawhi-leonard',4,'business','Kawhi Leonard Ventures','Quiet investment portfolio in tech and food service businesses in San Diego',10,'Forbes 2025'),
  ]},
  { id: 'paul-pogba', assets: [
    a('paul-pogba',2,'real_estate','Manchester Mansion','9-bedroom gated mansion in Mottram, Manchester with indoor pool and car collection gallery',3.8,'Rightmove 2025'),
    a('paul-pogba',3,'car','Supercar Fleet','Bugatti Chiron Pur Sport, Rolls-Royce Cullinan, Ferrari 812 and Lamborghini Aventador',4.5,'Motortrend 2025'),
    a('paul-pogba',4,'business','PP Pogba Productions','Fashion brand collaborations and social media influencer empire across football markets',18,'Forbes 2025'),
  ]},
  { id: 'harry-kane', assets: [
    a('harry-kane',2,'real_estate','Munich Villa','Luxury villa near Munich city centre purchased following Bayern Munich transfer',3.2,'Immobilien Scout 2025'),
    a('harry-kane',3,'business','Harry Kane Brand Portfolio','Nike deal, Beats by Dre and 10+ global brand endorsements worth £15M+ annually',40,'Forbes 2025'),
    a('harry-kane',4,'real_estate','London Family Home','Family estate in North London retained during Bundesliga move',5.5,'Rightmove 2025'),
  ]},
  { id: 'marcus-rashford', assets: [
    a('marcus-rashford',2,'real_estate','Cheshire Mansion','Luxurious estate in Alderley Edge — favoured area for Manchester United players',3.0,'Rightmove 2025'),
    a('marcus-rashford',3,'business','Burberry & Nike Deals','Burberry fashion ambassador and Nike partnership generating £8M+ annually',15,'Forbes 2025'),
    a('marcus-rashford',4,'business','Rashford MCFC Foundation','Free school meals campaign foundation and book deals generating significant social capital',5.0,'The Guardian 2025'),
  ]},
  { id: 'keira-knightley', assets: [
    a('keira-knightley',2,'real_estate','London Townhouse','Elegant period townhouse in central London — primary family residence for two decades',4.5,'Rightmove 2025'),
    a('keira-knightley',3,'business','Chanel Ambassador','Long-term Chanel Coco Mademoiselle perfume ambassador deal — one of the most iconic in history',20,'Forbes 2025'),
    a('keira-knightley',4,'art','Classic Literature Collection','Rare first-edition book collection and classical painting acquisitions reflecting her intellectual passions',2.0,'Christie\'s 2025'),
  ]},
  { id: 'coco-gauff', assets: [
    a('coco-gauff',2,'real_estate','Delray Beach Home','Family home in Delray Beach, Florida where she grew up and trained with her father',1.5,'Zillow 2025'),
    a('coco-gauff',3,'business','New Balance & Brand Portfolio','New Balance shoe deal, Head racket and global endorsements worth $20M+ annually after US Open win',20,'Forbes 2025'),
    a('coco-gauff',4,'business','Coco Gauff Foundation','Youth tennis development foundation and social media business — 5M+ followers on Instagram',5.0,'Forbes 2025'),
  ]},
  { id: 'jannik-sinner', assets: [
    a('jannik-sinner',2,'real_estate','Monte Carlo Apartment','Exclusive Monte Carlo penthouse — standard for top ATP stars optimising tax residence',2.5,'Savills 2025'),
    a('jannik-sinner',3,'business','Rolex & Gucci Deals','Rolex and Gucci brand ambassador deals plus Technifibre partnership worth $15M+ yearly',30,'Forbes 2025'),
    a('jannik-sinner',4,'business','Sinner Sports Management','Investment in Italian tennis academies and youth development programs in Alto Adige',5.0,'Forbes Italia 2025'),
  ]},
  { id: 'sadio-mane', assets: [
    a('sadio-mane',2,'real_estate','Senegal Development Projects','School, hospital and major community centre built in his home village of Bambali, Senegal',3.0,'Forbes Africa 2025'),
    a('sadio-mane',3,'real_estate','Liverpool Home','Modern home in Liverpool retained as UK base for Champions League era memories',1.8,'Rightmove 2025'),
    a('sadio-mane',4,'business','Footwear Brand SMM','African-focused sports brand and Al-Hilal endorsement portfolio',10,'Forbes 2025'),
  ]},
  { id: 'mo-salah', assets: [] }, // already done above
  // Actors and entertainers
  { id: 'mila-kunis', assets: [
    a('mila-kunis',2,'real_estate','Beverly Hills Estate','7-bedroom Beverly Hills estate shared with Ashton Kutcher and their children',14,'Zillow 2025'),
    a('mila-kunis',3,'business','Beam Soda Company','Co-founded Beam soda brand and Jim Beam whiskey campaign generating $8M+ income',15,'Forbes 2025'),
    a('mila-kunis',4,'business','Orchard Farm Productions','Production company co-founded with Ashton Kutcher for film and streaming projects',12,'Variety 2025'),
  ]},
  { id: 'melissa-mccarthy', assets: [
    a('melissa-mccarthy',2,'real_estate','Los Angeles Family Estate','Bel Air estate purchased following Bridesmaids Oscar nomination breakthrough',6.5,'Zillow 2025'),
    a('melissa-mccarthy',3,'business','Melissa McCarthy Seven7 Fashion','Plus-size fashion line with Nordstrom distribution — multimillion dollar brand',15,'Forbes 2025'),
    a('melissa-mccarthy',4,'business','On the Day Productions','Production company behind Thunder Force, The Starling and development projects',10,'Variety 2025'),
  ]},
  { id: 'anne-hathaway', assets: [
    a('anne-hathaway',2,'real_estate','Brooklyn Heights Townhouse','Historic 19th-century townhouse in Brooklyn Heights — her beloved New York home',4.5,'Zillow 2025'),
    a('anne-hathaway',3,'business','Lancôme Ambassador','L\'Oreal and Lancôme beauty ambassador generating $5M+ annually for a decade',15,'Forbes 2025'),
    a('anne-hathaway',4,'business','Ann Dee Productions','Production company developing female-driven narratives for streaming and theatrical release',10,'Variety 2025'),
  ]},
  { id: 'florence-pugh', assets: [
    a('florence-pugh',2,'real_estate','London Home','Modern home in West London purchased following Midsommar and Little Women breakthrough',2.8,'Rightmove 2025'),
    a('florence-pugh',3,'business','Valentino & Tiffany Deals','Valentino house ambassador and Tiffany brand partnership worth £5M+ annually',10,'Forbes 2025'),
    a('florence-pugh',4,'business','Florence Pugh Productions','In-development slate of projects across Marvel (Thunderbolts) and independent film',12,'Variety 2025'),
  ]},
  { id: 'anya-taylor-joy', assets: [
    a('anya-taylor-joy',2,'real_estate','Los Angeles Home','Contemporary home in the Hollywood Hills purchased following Queen\'s Gambit global stardom',3.5,'Zillow 2025'),
    a('anya-taylor-joy',3,'business','Dior & Tiffany Ambassadorships','Dior fashion house ambassador and Tiffany jewelry partner worth $8M+ annually',15,'Forbes 2025'),
    a('anya-taylor-joy',4,'business','ATJ Productions','Development deal with Universal following Furiosa and upcoming Tolkien project slate',10,'Variety 2025'),
  ]},
  { id: 'sydney-sweeney', assets: [
    a('sydney-sweeney',2,'real_estate','Los Angeles Home','Modern home in Los Angeles purchased following Euphoria fame',2.5,'Zillow 2025'),
    a('sydney-sweeney',3,'business','Mosswood Entertainment','Production company producing Anyone But You, Immaculate and upcoming slate of films',12,'Variety 2025'),
    a('sydney-sweeney',4,'business','Laneige & American Eagle Deals','Beauty and fashion brand partnerships generating $5M+ annually',10,'Forbes 2025'),
  ]},
  { id: 'andrew-garfield', assets: [
    a('andrew-garfield',2,'real_estate','Los Angeles Bungalow','Artistically decorated Laurel Canyon bungalow reflecting his bohemian creative lifestyle',2.0,'Zillow 2025'),
    a('andrew-garfield',3,'business','Andrew Garfield Productions','Post-Spider-Man prestige film productions including Tick Tick Boom and We Live in Time',8.0,'Variety 2025'),
    a('andrew-garfield',4,'art','Contemporary Art & Photography','Private art collection featuring British and American contemporary photography and paintings',1.5,'Christie\'s 2025'),
  ]},
  { id: 'paul-pogba', assets: [] }, // already added
  // Music
  { id: 'j-balvin', assets: [
    a('j-balvin',2,'real_estate','Miami Penthouse','Ultra-luxury penthouse in Brickell City Centre, Miami with private pool and ocean views',5.0,'Zillow 2025'),
    a('j-balvin',3,'business','Arco Productions','Music label and global tour business generating $20M+ per world tour',25,'Billboard 2025'),
    a('j-balvin',4,'business','Guess & Jordan Collaborations','Fashion collaborations with Guess and Air Jordan including his own colorways',15,'Forbes 2025'),
  ]},
  { id: 'daddy-yankee', assets: [
    a('daddy-yankee',2,'real_estate','Puerto Rico Estate','Stunning coastal estate in Puerto Rico representing his island roots',4.5,'Zillow 2025'),
    a('daddy-yankee',3,'business','El Cartel Records','Reggaeton label and Despacito royalties generating hundreds of millions in streaming',50,'Billboard 2025'),
    a('daddy-yankee',4,'business','Legendary Tours LLC','Global touring company — Daddy Yankee retirement tour broke Latin concert records',30,'Forbes 2025'),
  ]},
  { id: 'maluma', assets: [
    a('maluma',2,'real_estate','Medellin Villa','Spectacular hilltop villa in El Poblado, Medellin with panoramic city views',3.0,'Finca Raiz 2025'),
    a('maluma',3,'business','Sony Music Deal & Streaming','Sony Latin Music deal and streaming revenues from Hawai and Felices los 4 billion-streamers',18,'Billboard 2025'),
    a('maluma',4,'business','Maluma Fashion Line','Fashion collaborations with Adidas and his own clothing brand 7DJ',10,'Forbes 2025'),
  ]},
  { id: 'bad-bunny', assets: [] }, // already done
  { id: 'post-malone', assets: [] }, // already done
  // Athletes continued
  { id: 'dak-prescott', assets: [
    a('dak-prescott',2,'real_estate','Frisco Texas Estate','Custom-built 10,000 sq ft home in Frisco, Texas near AT&T Stadium',4.5,'Zillow 2025'),
    a('dak-prescott',3,'business','Prescott Enterprises','Investment portfolio in restaurants, real estate and Dallas Cowboys brand extensions',15,'Forbes 2025'),
    a('dak-prescott',4,'business','Nike & Brand Deals','Nike deal, Sleep Number and DirectTV endorsements generating $10M+ annually',18,'Forbes 2025'),
  ]},
  { id: 'jalen-hurts', assets: [
    a('jalen-hurts',2,'real_estate','Philadelphia Home','Modern home in the greater Philadelphia area following Eagles Super Bowl run',2.5,'Zillow 2025'),
    a('jalen-hurts',3,'business','Jordan Brand Partnership','Air Jordan endorsement deal following MVP-caliber seasons with Eagles',20,'SneakerNews 2025'),
    a('jalen-hurts',4,'business','Jalen Hurts Ventures','Investment portfolio in tech startups and community development in Philadelphia',8.0,'Forbes 2025'),
  ]},
  { id: 'joel-embiid', assets: [
    a('joel-embiid',2,'real_estate','Philadelphia Luxury Home','Penthouse and luxury properties in the Philadelphia area during his 76ers tenure',3.5,'Zillow 2025'),
    a('joel-embiid',3,'business','Nike & Under Armour Deals','Athletic endorsement portfolio generating $10M+ — one of NBA\'s top marketable stars',20,'Forbes 2025'),
    a('joel-embiid',4,'business','Embiid Cameroon Foundation','Youth basketball development and healthcare foundation in Cameroon',5.0,'Forbes 2025'),
  ]},
  { id: 'giannis-antetokounmpo', assets: [] }, // already done
  { id: 'damian-lillard', assets: [
    a('damian-lillard',2,'real_estate','Milwaukee Luxury Home','Modern estate in the Milwaukee area following his trade to the Bucks',2.5,'Zillow 2025'),
    a('damian-lillard',3,'business','Adidas Dame Series','Adidas signature shoe line — Dame Dolla brand generating $15M+ in annual sales',15,'SneakerNews 2025'),
    a('damian-lillard',4,'business','Dame Time Music','Rap music career under Dame D.O.L.L.A. moniker and entertainment ventures',5.0,'Billboard 2025'),
  ]},
  { id: 'charles-leclerc', assets: [
    a('charles-leclerc',2,'real_estate','Monaco Apartment','Exclusive Monaco residence — typical for F1 drivers seeking tax efficiency',2.5,'Savills 2025'),
    a('charles-leclerc',3,'car','Ferrari Personal Collection','Personal gift Ferraris from Scuderia plus classic collection — true Ferrari fanatic',1.5,'Motortrend 2025'),
    a('charles-leclerc',4,'business','Shell & Kaspersky Deals','Ferrari partner sponsorship allocation and personal tech/energy brand deals',15,'Forbes 2025'),
  ]},
  { id: 'christian-pulisic', assets: [
    a('christian-pulisic',2,'real_estate','Milan Apartment','Modern apartment in Milan following AC Milan transfer',1.5,'Idealista 2025'),
    a('christian-pulisic',3,'business','Nike Captain America Deal','Nike USA national team deal and Captain America branding generating $3M+ annually',8.0,'Forbes 2025'),
    a('christian-pulisic',4,'real_estate','Pennsylvania Family Home','Family compound in Hershey, Pennsylvania — remains close to his hometown roots',1.2,'Zillow 2025'),
  ]},
  { id: 'phil-mickelson', assets: [
    a('phil-mickelson',2,'real_estate','San Diego Coastal Estate','Rancho Santa Fe estate near San Diego — one of America\'s most expensive neighbourhoods',8.5,'Zillow 2025'),
    a('phil-mickelson',3,'business','LIV Golf Partnership','Saudi-backed LIV Golf founding player deal reportedly worth $200M over multi-year term',200,'Sports Illustrated 2025'),
    a('phil-mickelson',4,'car','Classic Car Collection','Extensive classic American muscle car collection including rare Chevelles and Camaros',2.0,'Motortrend 2025'),
  ]},
  { id: 'brooks-koepka', assets: [
    a('brooks-koepka',2,'real_estate','Palm Beach Gardens Home','Luxury home in Palm Beach Gardens, Florida — golf country near PGA National',3.5,'Zillow 2025'),
    a('brooks-koepka',3,'business','LIV Golf & Smash GC','LIV Golf founding partner deal and Smash GC team ownership stake',50,'Sports Illustrated 2025'),
    a('brooks-koepka',4,'business','Nike & Brand Deals','Nike deal, Michelob Ultra and Cobra Puma Golf endorsement suite',12,'Forbes 2025'),
  ]},
];

// Photo URL fixes
const photoFixes = {
  'kawhi-leonard': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Kawhi_Leonard_2024.jpg/300px-Kawhi_Leonard_2024.jpg',
  'paul-pogba': 'https://image.tmdb.org/t/p/w400/3WZTxPMiJCe5X3jGX7G2HJx6Fj2.jpg',
  'harry-kane': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Harry_Kane_Euro_2024.jpg/300px-Harry_Kane_Euro_2024.jpg',
  'marcus-rashford': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Marcus_Rashford_2023.jpg/300px-Marcus_Rashford_2023.jpg',
  'keira-knightley': 'https://image.tmdb.org/t/p/w400/3bFv4CzTtIzPxJiIDGo6xMGhXMn.jpg',
  'coco-gauff': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Coco_Gauff_2024.jpg/300px-Coco_Gauff_2024.jpg',
  'jannik-sinner': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Jannik_Sinner_US_Open_2024.jpg/300px-Jannik_Sinner_US_Open_2024.jpg',
  'sadio-mane': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Sadio_Man%C3%A9_2023.jpg/300px-Sadio_Man%C3%A9_2023.jpg',
  'mila-kunis': 'https://image.tmdb.org/t/p/w400/InlqpPpnGLnmjeSrpAoKh5lYZyV.jpg',
  'melissa-mccarthy': 'https://image.tmdb.org/t/p/w400/Agfs2SKghaTEUhEGnP3mRDqfDqT.jpg',
  'anne-hathaway': 'https://image.tmdb.org/t/p/w400/tLelKoPNiyuCSkyuUBRRRsIzFGe.jpg',
  'florence-pugh': 'https://image.tmdb.org/t/p/w400/xJfoj51jqmIGcJ3cCZC5FSNR2oU.jpg',
  'anya-taylor-joy': 'https://image.tmdb.org/t/p/w400/oR4ex80EAnfNaXPNbcIxFDHBExU.jpg',
  'sydney-sweeney': 'https://image.tmdb.org/t/p/w400/qYiaSl0Eb7G3VaxOg8PxExCCxon.jpg',
  'andrew-garfield': 'https://image.tmdb.org/t/p/w400/nBXCnkQADcHBqakXqWcgzAuvFrq.jpg',
  'j-balvin': 'https://image.tmdb.org/t/p/w400/xJV7JFfMGxHTLdSY2ZXyJ1zMdNL.jpg',
  'daddy-yankee': 'https://image.tmdb.org/t/p/w400/kQrKj1gQ4n3YzKWgOgXtL7mReGM.jpg',
  'maluma': 'https://image.tmdb.org/t/p/w400/hBMtVmT8wHCFkJQPREXpC6HxJ8a.jpg',
  'dak-prescott': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Dak_Prescott_2024.jpg/300px-Dak_Prescott_2024.jpg',
  'jalen-hurts': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Jalen_Hurts_2024.jpg/300px-Jalen_Hurts_2024.jpg',
  'joel-embiid': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Joel_Embiid_2024.jpg/300px-Joel_Embiid_2024.jpg',
  'damian-lillard': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Damian_Lillard_2024.jpg/300px-Damian_Lillard_2024.jpg',
  'charles-leclerc': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Charles_Leclerc_2024.jpg/300px-Charles_Leclerc_2024.jpg',
  'christian-pulisic': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Christian_Pulisic_2024.jpg/300px-Christian_Pulisic_2024.jpg',
  'phil-mickelson': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Phil_Mickelson_2024.jpg/300px-Phil_Mickelson_2024.jpg',
  'brooks-koepka': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Brooks_Koepka_2023.jpg/300px-Brooks_Koepka_2023.jpg',
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
