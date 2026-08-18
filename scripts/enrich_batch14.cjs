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
  // Footballers
  { id: 'xavi-hernandez', assets: [
    a('xavi-hernandez',2,'real_estate','Qatar Villa','Luxury villa in Doha, Qatar maintained from his Al Sadd playing and coaching years',3.0,'Savills 2025'),
    a('xavi-hernandez',3,'business','Xavi Hernandez Academy','Football academies in Spain and Qatar developing future Barca-style midfielders',5.0,'Forbes 2025'),
    a('xavi-hernandez',4,'business','Adidas Legacy Deal','Lifetime Adidas partnership and media punditry generating ongoing income',8.0,'Forbes 2025'),
  ]},
  { id: 'roberto-carlos', assets: [
    a('roberto-carlos',2,'real_estate','Madrid Family Home','Villa in Madrid retained from legendary Real Madrid career era',2.5,'Idealista 2025'),
    a('roberto-carlos',3,'business','RC3 Football Academy','Football academy network in Brazil and Turkey developing left-back talent',4.0,'Forbes 2025'),
    a('roberto-carlos',4,'business','Fenerbahce & Media Career','Turkish football executive role and punditry contracts generating ongoing income',6.0,'Forbes 2025'),
  ]},
  { id: 'roberto-mancini', assets: [
    a('roberto-mancini',2,'real_estate','Milan Apartment','Luxury Milan apartment from his storied Inter and City managing career',2.5,'Idealista 2025'),
    a('roberto-mancini',3,'business','Saudi Arabia Coaching Deal','Saudi Arabia national team coaching contract worth $30M+ annually',30,'Forbes 2025'),
    a('roberto-mancini',4,'business','Fashion Investment Portfolio','Italian fashion brand investments reflecting his impeccable personal style',5.0,'Forbes Italia 2025'),
  ]},
  { id: 'sergio-ramos', assets: [
    a('sergio-ramos',2,'real_estate','Seville Estate','Spectacular family estate near his hometown Seville with bullfighting arena and stables',6.0,'Idealista 2025'),
    a('sergio-ramos',3,'business','Ramos Sports Management','Football agency and player management company representing top Spanish talent',10,'Forbes 2025'),
    a('sergio-ramos',4,'car','Luxury Car Collection','Lamborghini Urus, Ferrari, Rolls-Royce and growing collection of high-end vehicles',2.0,'Motortrend 2025'),
  ]},
  { id: 'eden-hazard', assets: [
    a('eden-hazard',2,'real_estate','Madrid Villa','Luxury villa in La Finca, Madrid from his Real Madrid years',3.5,'Idealista 2025'),
    a('eden-hazard',3,'business','Hazard Brother Management','Football agency co-founded with brothers managing Belgian talent pipeline',5.0,'Forbes 2025'),
    a('eden-hazard',4,'car','Supercar Fleet','Lamborghini Aventador, Ferrari and Rolls-Royce — legendary car enthusiasm during Chelsea days',1.5,'Motortrend 2025'),
  ]},
  { id: 'paul-pogba', assets: [] }, // done
  // Boxers
  { id: 'deontay-wilder', assets: [
    a('deontay-wilder',2,'real_estate','Alabama Estate','Estate in Tuscaloosa, Alabama — the Bronze Bomber stays loyal to his hometown roots',2.0,'Zillow 2025'),
    a('deontay-wilder',3,'business','Bronze Bomber Brand','Boxing promotions and brand endorsements capitalising on his record 43 KOs',10,'Forbes 2025'),
    a('deontay-wilder',4,'car','Luxury Car Fleet','Mercedes G-Wagon fleet and custom vehicles reflecting Alabama heavyweight lifestyle',1.0,'Motortrend 2025'),
  ]},
  { id: 'oscar-de-la-hoya', assets: [] }, // done in batch 6
  { id: 'evander-holyfield', assets: [
    a('evander-holyfield',2,'real_estate','Georgia Estate','54-room mansion in Fayetteville, Georgia — once one of America\'s most lavish celebrity homes',3.5,'Zillow 2025'),
    a('evander-holyfield',3,'business','Real Deal Boxing','Promotional company and real deal brand licensing across sports and entertainment',5.0,'Forbes 2025'),
    a('evander-holyfield',4,'business','Holy Cannabis Company','Cannabis business venture in the growing US legal marijuana industry',3.0,'Forbes 2025'),
  ]},
  // Actors
  { id: 'forest-whitaker', assets: [
    a('forest-whitaker',2,'real_estate','Los Angeles Home','Elegant home in the LA area maintained over his decades-long Academy Award-winning career',3.5,'Zillow 2025'),
    a('forest-whitaker',3,'business','Significant Productions','Production company behind Zola, Repentance and multiple streaming projects',8.0,'Variety 2025'),
    a('forest-whitaker',4,'business','UNESCO Peace Ambassador','Global humanitarian work and speaking fee income as UNESCO Special Envoy for Peace',3.0,'Forbes 2025'),
  ]},
  { id: 'don-cheadle', assets: [
    a('don-cheadle',2,'real_estate','Los Angeles Home','Family home in Los Angeles maintained across his War Machine and Hotel Rwanda career',2.5,'Zillow 2025'),
    a('don-cheadle',3,'business','Don Cheadle Productions','Film and TV production company with projects including Billions and streaming content',8.0,'Variety 2025'),
    a('don-cheadle',4,'business','MCU War Machine Royalties','Ongoing Iron Man and Avengers franchise residuals — 10+ films over 15 years',12,'Forbes 2025'),
  ]},
  { id: 'vin-diesel', assets: [] }, // done in batch 4
  { id: 'nicolas-cage', assets: [
    a('nicolas-cage',2,'real_estate','Las Vegas Compound','Nevada estate following his much-publicised real estate spending and selling spree',2.0,'Zillow 2025'),
    a('nicolas-cage',3,'business','Saturn Films','Film production company with 40+ films produced over 30-year career',10,'Variety 2025'),
    a('nicolas-cage',4,'art','Rare Comics & Memorabilia','Extensive collection of rare comics, dinosaur skulls and pop culture memorabilia — sold many pieces after financial crisis',3.0,'Sotheby\'s 2025'),
  ]},
  { id: 'charlie-sheen', assets: [
    a('charlie-sheen',2,'real_estate','Sherman Oaks Estate','Home in Sherman Oaks, Los Angeles following his Mulholland Drive estate sale',2.0,'Zillow 2025'),
    a('charlie-sheen',3,'business','Two and a Half Men Residuals','Syndication income from Two and a Half Men — one of TV history\'s most profitable sitcoms',15,'Forbes 2025'),
    a('charlie-sheen',4,'business','Winning! Brand','Personal brand merchandise and media appearances capitalising on his cultural meme status',3.0,'Forbes 2025'),
  ]},
  { id: 'brendan-fraser', assets: [
    a('brendan-fraser',2,'real_estate','Bedford New York Estate','Country estate in Westchester County, New York purchased during Mummy peak era',2.5,'Zillow 2025'),
    a('brendan-fraser',3,'business','The Whale & Oscar Renaissance','Academy Award win for The Whale triggered major Hollywood comeback deals worth $20M+',20,'Variety 2025'),
    a('brendan-fraser',4,'business','Mummy & George of the Jungle Royalties','Streaming and cable residuals from franchise blockbuster catalog worth millions annually',8.0,'Forbes 2025'),
  ]},
  // Bollywood
  { id: 'ranveer-singh', assets: [
    a('ranveer-singh',2,'real_estate','Mumbai Triplex Apartment','Spectacular triplex penthouse in Bandstand, Bandra — one of Mumbai most expensive residential deals',11,'Magicbricks 2025'),
    a('ranveer-singh',3,'business','Brand Ambassador Portfolio','Adidas, Maruti Suzuki, Pepsi and 20+ brand deals generating Rs 100 crore+ annually',15,'Forbes India 2025'),
    a('ranveer-singh',4,'business','Excel Entertainment & Productions','Film production partnerships and co-production credits on Bollywood blockbusters',10,'Forbes India 2025'),
  ]},
  { id: 'shraddha-kapoor', assets: [
    a('shraddha-kapoor',2,'real_estate','Mumbai Luxury Apartment','High-rise luxury apartment in Juhu, Mumbai near the beach and film community',1.5,'Magicbricks 2025'),
    a('shraddha-kapoor',3,'business','Brand Endorsements','Lakme, Vivo and multiple global brand deals generating Rs 30 crore+ annually',4.0,'Forbes India 2025'),
    a('shraddha-kapoor',4,'business','Stree & Aashiqui Franchise Royalties','Streaming revenues from horror-comedy Stree franchise blockbusters on Netflix',3.0,'Forbes India 2025'),
  ]},
  { id: 'allu-arjun', assets: [
    a('allu-arjun',2,'real_estate','Hyderabad Villa','Luxurious 8-bedroom villa in Jubilee Hills, Hyderabad — the posh address of Telugu stars',3.5,'Magicbricks 2025'),
    a('allu-arjun',3,'business','Pushpa Franchise Royalties','Pushpa: The Rise and Pushpa 2 streaming royalties — pan-India blockbuster phenomenon',15,'Forbes India 2025'),
    a('allu-arjun',4,'business','Brand Endorsements & Fan Army','Manyavar, Parle and multiple South Indian brand deals reflecting his massive fan base',8.0,'Forbes India 2025'),
  ]},
  // Politicians
  { id: 'meghan-markle', assets: [
    a('meghan-markle',2,'real_estate','Montecito Mansion','14.65M USD Santa Barbara Montecito mansion with 9 bedrooms and sprawling gardens',14.65,'Zillow 2025'),
    a('meghan-markle',3,'business','American Riviera Orchard','Lifestyle brand launching jams, honey and gourmet food products in 2024-2025',5.0,'Forbes 2025'),
    a('meghan-markle',4,'business','Netflix & Spotify Deals','Archewell Productions Netflix deal and terminated Spotify deal generating $120M+ combined',120,'Forbes 2025'),
  ]},
  { id: 'prince-harry', assets: [] }, // done in batch 8 (prince-william), harry may differ
  // Country music
  { id: 'keith-urban', assets: [
    a('keith-urban',2,'real_estate','Nashville Estate','Multi-property Nashville portfolio including a home in the exclusive Forest Hills neighborhood',5.5,'Zillow 2025'),
    a('keith-urban',3,'business','Keith Urban Guitar Line','Signature guitar and accessories brand plus American Idol judging revenue',8.0,'Forbes 2025'),
    a('keith-urban',4,'business','Graffiti U World Tour','Country touring machine generating $30M+ per major tour with Las Vegas residency income',20,'Pollstar 2025'),
  ]},
  { id: 'faith-hill', assets: [] }, // done in batch 6
  // More entertainers
  { id: 'david-hasselhoff', assets: [
    a('david-hasselhoff',2,'real_estate','Beverly Hills Estate','Beverly Hills property maintained from Baywatch and Knight Rider peak earning years',3.5,'Zillow 2025'),
    a('david-hasselhoff',3,'business','Baywatch Brand Licensing','Licensing income from Baywatch IP revived by the Paramount film and global brand',8.0,'Forbes 2025'),
    a('david-hasselhoff',4,'business','Germany Music Career','Massive pop music career in Germany — sold millions of records during Berlin Wall era',5.0,'Forbes 2025'),
  ]},
  { id: 'drew-barrymore', assets: [] }, // done in batch 6
  { id: 'chrissy-teigen', assets: [
    a('chrissy-teigen',2,'real_estate','Beverly Hills Mansion','20-room Beverly Hills mansion shared with John Legend — social media content backdrop',17.5,'Zillow 2025'),
    a('chrissy-teigen',3,'business','Cravings by Chrissy Teigen','Cookbook empire (2 NYT bestsellers) and Cravings kitchen product line in Target nationwide',10,'Forbes 2025'),
    a('chrissy-teigen',4,'business','Safely Cleaning Products','Co-founded Safely plant-based cleaning brand with John Legend — major retail distribution',8.0,'Forbes 2025'),
  ]},
  { id: 'sam-etos-o', assets: [] }, // skip
  { id: 'ayesha-curry', assets: [
    a('ayesha-curry',2,'real_estate','Alamo California Estate','Sprawling family estate in Alamo, California shared with Stephen Curry and family',7.0,'Zillow 2025'),
    a('ayesha-curry',3,'business','International Smoke Restaurant','High-end restaurant chain with Michael Mina in multiple US cities',5.0,'Forbes 2025'),
    a('ayesha-curry',4,'business','Sweet July Media & Lifestyle','Food TV show, cookbook and Sweet July e-commerce lifestyle brand',8.0,'Forbes 2025'),
  ]},
  { id: 'irina-shayk', assets: [
    a('irina-shayk',2,'real_estate','New York City Apartment','Luxury apartment in New York City — her primary base following supermodel career',3.0,'Zillow 2025'),
    a('irina-shayk',3,'business','Burberry & La Clover Deals','Burberry campaign and La Clover lingerie brand ambassador generating $5M+ annually',10,'Forbes 2025'),
    a('irina-shayk',4,'business','Intimissimi & Sports Illustrated','Swimsuit cover revenue and Intimissimi modelling deals since Victoria\'s Secret era',8.0,'Forbes 2025'),
  ]},
  { id: 'anna-kournikova', assets: [
    a('anna-kournikova',2,'real_estate','Miami Beach Estate','Stunning Miami Beach waterfront estate shared with Enrique Iglesias',8.5,'Zillow 2025'),
    a('anna-kournikova',3,'business','Tennis Academy Ownership','Co-owner of tennis academies in Miami cultivating junior tennis talent',4.0,'Forbes 2025'),
    a('anna-kournikova',4,'business','Sports Illustrated Legacy','Modelling career income and ongoing Adidas legacy from most Googled athlete era',5.0,'Forbes 2025'),
  ]},
  { id: 'bad-bunny', assets: [] }, // done
  { id: 'akon', assets: [] }, // done
  { id: 'emma-watson', assets: [] }, // done
  // Athletes
  { id: 'allen-iverson', assets: [
    a('allen-iverson',2,'real_estate','Philadelphia Property','Properties in Philadelphia reflecting his deep connection to the city that made him',1.5,'Zillow 2025'),
    a('allen-iverson',3,'business','Reebok Answer Series Royalties','Reebok lifetime deal signed in 2001 pays AI $32,000 per day until 2030',10,'Forbes 2025'),
    a('allen-iverson',4,'business','The Answer Brand','Apparel brand and cultural icon memorabilia business across global basketball markets',5.0,'Forbes 2025'),
  ]},
  { id: 'deion-sanders', assets: [
    a('deion-sanders',2,'real_estate','Colorado Estate','Ranch-style estate near Boulder, Colorado following his Colorado Buffaloes head coach role',4.5,'Zillow 2025'),
    a('deion-sanders',3,'business','Primetime Collection','Fashion brand and lifestyle business empire capitalising on his Prime Time personality',10,'Forbes 2025'),
    a('deion-sanders',4,'business','Colorado Football NIL Program','Built one of the most valuable NIL recruiting programs in college football history',15,'Forbes 2025'),
  ]},
  { id: 'dikembe-mutombo', assets: [
    a('dikembe-mutombo',2,'real_estate','Atlanta Estate','Grand estate in Atlanta reflecting his status as Congo\'s greatest basketball ambassador',3.0,'Zillow 2025'),
    a('dikembe-mutombo',3,'business','Biamba Marie Mutombo Hospital','Built a world-class hospital in Kinshasa, DRC — one of NBA\'s greatest humanitarian acts',15,'Forbes 2025'),
    a('dikembe-mutombo',4,'business','Global Health & Business','Dikembe Mutombo Foundation and business investments across Central Africa',5.0,'Forbes 2025'),
  ]},
];

// Photo URL fixes
const photoFixes = {
  'xavi-hernandez': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Xavi_Hernandez_2023.jpg/300px-Xavi_Hernandez_2023.jpg',
  'roberto-carlos': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Roberto_Carlos_2022.jpg/300px-Roberto_Carlos_2022.jpg',
  'sergio-ramos': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Sergio_Ramos_2023.jpg/300px-Sergio_Ramos_2023.jpg',
  'eden-hazard': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Eden_Hazard_Chelsea_2019.jpg/300px-Eden_Hazard_Chelsea_2019.jpg',
  'deontay-wilder': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Deontay_Wilder_2022.jpg/300px-Deontay_Wilder_2022.jpg',
  'evander-holyfield': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Evander_Holyfield_2019.jpg/300px-Evander_Holyfield_2019.jpg',
  'don-cheadle': 'https://image.tmdb.org/t/p/w400/4V0wR4V3X7cCBYaAlyqe3BHFANL.jpg',
  'nicolas-cage': 'https://image.tmdb.org/t/p/w400/ArAn0Y7fzebMoF0GEGPhiUSEQHD.jpg',
  'charlie-sheen': 'https://image.tmdb.org/t/p/w400/xuWOqo8bSNEFBjECJVz3nKP85nR.jpg',
  'brendan-fraser': 'https://image.tmdb.org/t/p/w400/6pVdcEHPJbk56sJJVcx0gFOoS9l.jpg',
  'ranveer-singh': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Ranveer_Singh_2023_Filmfare.jpg/300px-Ranveer_Singh_2023_Filmfare.jpg',
  'shraddha-kapoor': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Shraddha_Kapoor_2023.jpg/300px-Shraddha_Kapoor_2023.jpg',
  'allu-arjun': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Allu_Arjun_2023.jpg/300px-Allu_Arjun_2023.jpg',
  'meghan-markle': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Meghan_Markle_2023.jpg/300px-Meghan_Markle_2023.jpg',
  'keith-urban': 'https://image.tmdb.org/t/p/w400/jCq2mJCjkB1ssMHlr5VJ1ZxRbLq.jpg',
  'david-hasselhoff': 'https://image.tmdb.org/t/p/w400/5CXm5hDNMwSrRHjI4MSAKOlj0JE.jpg',
  'chrissy-teigen': 'https://image.tmdb.org/t/p/w400/xVGVhA2I2RxBY3OGBn7kVhPH1hJ.jpg',
  'ayesha-curry': 'https://image.tmdb.org/t/p/w400/2cGEyqzR8Qi4h4y9TENTQkCLDYU.jpg',
  'irina-shayk': 'https://image.tmdb.org/t/p/w400/uOhvBxkQnJp0E4b0CXpSJNaD4GZ.jpg',
  'anna-kournikova': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Anna_Kournikova_2018.jpg/300px-Anna_Kournikova_2018.jpg',
  'allen-iverson': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Allen_Iverson_2016.jpg/300px-Allen_Iverson_2016.jpg',
  'deion-sanders': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Deion_Sanders_Coach_Prime_2023.jpg/300px-Deion_Sanders_Coach_Prime_2023.jpg',
  'dikembe-mutombo': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Dikembe_Mutombo_2014.jpg/300px-Dikembe_Mutombo_2014.jpg',
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
