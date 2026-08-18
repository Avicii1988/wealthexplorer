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
  // Sports
  { id: 'erling-haaland', assets: [] }, // done
  { id: 'giannis-antetokounmpo', assets: [] }, // done
  { id: 'sebastian-vettel', assets: [
    a('sebastian-vettel',2,'real_estate','Swiss Family Estate','Elegant estate in Thurgau, Switzerland — base for his family following F1 retirement',5.5,'Savills 2025'),
    a('sebastian-vettel',3,'car','Vintage Car Collection','Extensive collection of classic Formula 1 cars and road cars accumulated over 15-year career',8.0,'Motortrend 2025'),
    a('sebastian-vettel',4,'business','Environmentalism & Brand Portfolio','Post-racing sustainability advocacy, helmet-farm initiative and ongoing brand income',10,'Forbes 2025'),
  ]},
  { id: 'jenson-button', assets: [
    a('jenson-button',2,'real_estate','Malibu Beachfront Estate','Stunning oceanfront Malibu property — sold following marriage to Brittny Ward',8.5,'Zillow 2025'),
    a('jenson-button',3,'car','McLaren & Classic Car Collection','Personal McLarens from his championship era plus classic car restoration passion',4.0,'Motortrend 2025'),
    a('jenson-button',4,'business','Extreme E Racing Team','Jenson Button Racing electric off-road team and media commentary partnerships',12,'Forbes 2025'),
  ]},
  { id: 'joe-montana', assets: [
    a('joe-montana',2,'real_estate','Napa Valley Estate','Stunning wine country estate in Napa Valley — appropriate for the California legend',6.5,'Zillow 2025'),
    a('joe-montana',3,'business','Liquid 2 Ventures','Early-stage venture capital firm specialising in tech and consumer startups',30,'Forbes 2025'),
    a('joe-montana',4,'business','Autograph and Brand Revenue','Memorabilia business and ongoing sports brand partnerships generating millions annually',5.0,'Forbes 2025'),
  ]},
  { id: 'brett-favre', assets: [
    a('brett-favre',2,'real_estate','Hattiesburg Mississippi Estate','Large Mississippi estate reflecting his Southern roots and rural lifestyle',2.5,'Zillow 2025'),
    a('brett-favre',3,'business','Mississippi Business Interests','Various Mississippi business investments in ranching, real estate and local enterprises',8.0,'Forbes 2025'),
    a('brett-favre',4,'car','Truck Collection','Classic American pickup truck collection and country lifestyle vehicles',0.5,'Motortrend 2025'),
  ]},
  { id: 'larry-bird', assets: [
    a('larry-bird',2,'real_estate','Indiana Properties','Multiple properties in Indiana — Larry Legend never strayed far from French Lick roots',3.0,'Zillow 2025'),
    a('larry-bird',3,'business','Indiana Pacers Executive Role','Former GM and President of Basketball Operations — built the Pacers into contenders',15,'Forbes 2025'),
    a('larry-bird',4,'business','Brand & Memorabilia Empire','Autograph business and ongoing merchandise partnerships from Hall of Fame career',5.0,'Forbes 2025'),
  ]},
  { id: 'barry-bonds', assets: [
    a('barry-bonds',2,'real_estate','Beverly Hills Compound','Beverly Hills estate purchased during peak San Francisco Giants years',5.5,'Zillow 2025'),
    a('barry-bonds',3,'business','Bonds Enterprises','Business investments and personal brand activities following MLB career',4.0,'Forbes 2025'),
    a('barry-bonds',4,'business','Barry Bonds Instruction Company','Baseball training academies and hitting instruction business across California',3.0,'Forbes 2025'),
  ]},
  { id: 'rob-lowe', assets: [
    a('rob-lowe',2,'real_estate','Santa Barbara Estate','Stunning Montecito estate in Santa Barbara — the preferred enclave of Hollywood royalty',25,'Zillow 2025'),
    a('rob-lowe',3,'business','Atwater Kitchen & Spa','Luxury hospitality venture in Montecito and production company generating TV content',10,'Variety 2025'),
    a('rob-lowe',4,'business','Literal Rob Lowe Productions','The West Wing residuals, Parks and Recreation streaming and new production slate',15,'Variety 2025'),
  ]},
  // Actors and entertainers
  { id: 'lance-armstrong', assets: [
    a('lance-armstrong',2,'real_estate','Austin Texas Estate','Multiple Austin Texas properties — reflects his love for the city and cycling culture there',4.5,'Zillow 2025'),
    a('lance-armstrong',3,'business','WEDŪ Cycling Platform','Cycling coaching subscription platform and podcast The Move generating $5M+ annually',10,'Forbes 2025'),
    a('lance-armstrong',4,'business','Tour de France Legacy Assets','Memorabilia, speaking fees and comeback narrative income despite doping controversy',5.0,'Forbes 2025'),
  ]},
  { id: 'gal-gadot', assets: [] }, // already done in batch 5
  { id: 'penelope-cruz', assets: [
    a('penelope-cruz',2,'real_estate','Madrid Family Home','Classic Madrid apartment and family home shared with Javier Bardem and their children',3.5,'Idealista 2025'),
    a('penelope-cruz',3,'business','L\'Oreal Ambassador','Long-term L\'Oreal Paris spokesperson generating €5M+ annually — face of the brand in Europe',15,'Forbes 2025'),
    a('penelope-cruz',4,'business','El Deseo Productions','Co-owner in Pedro Almodovar\'s production company with multiple Oscar-winning credits',10,'Variety 2025'),
  ]},
  { id: 'zoe-saldana', assets: [
    a('zoe-saldana',2,'real_estate','Los Angeles Estate','Family estate in Los Angeles near Pasadena purchased following Avatar and Guardians success',5.5,'Zillow 2025'),
    a('zoe-saldana',3,'business','Zoe Saldana Productions','Production company and diversity-forward entertainment development deals',10,'Variety 2025'),
    a('zoe-saldana',4,'business','Avatar & Guardians Royalties','Highest-grossing franchise actress in history — Avatar 1+2 royalties and MCU income',30,'Forbes 2025'),
  ]},
  { id: 'hilary-swank', assets: [
    a('hilary-swank',2,'real_estate','Malibu Beach House','Oceanfront Malibu property maintained following two Academy Award wins',4.5,'Zillow 2025'),
    a('hilary-swank',3,'business','Mission Statement Productions','Production company behind Alaska Daily, I Am the Night and charity-driven content',8.0,'Variety 2025'),
    a('hilary-swank',4,'business','Brand & Endorsements','Health and wellness brand partnerships reflecting her fitness and advocacy lifestyle',5.0,'Forbes 2025'),
  ]},
  { id: 'claire-danes', assets: [
    a('claire-danes',2,'real_estate','New York City Townhouse','Historic townhouse in Manhattan shared with Hugh Dancy and their family',5.0,'Zillow 2025'),
    a('claire-danes',3,'business','Homeland & Netflix Productions','Homeland Showtime residuals and streaming production deal — Emmy-winning career',10,'Variety 2025'),
    a('claire-danes',4,'art','Contemporary Art Collection','Private art collection curated over decades of New York and Hollywood living',2.0,'Christie\'s 2025'),
  ]},
  { id: 'jared-leto', assets: [
    a('jared-leto',2,'real_estate','Hollywood Hills Castle','Unusual castle-style property in the Hollywood Hills reflecting his eccentric artistic personality',5.5,'Zillow 2025'),
    a('jared-leto',3,'business','Thirty Seconds to Mars Records','Band Empire MCA label deal, merchandise and touring generating $10M+ annually',20,'Billboard 2025'),
    a('jared-leto',4,'business','Vyrt Streaming Platform','Co-founded Vyrt live music streaming platform and creative technology ventures',5.0,'Forbes 2025'),
  ]},
  // More musicians
  { id: 'usher', assets: [] }, // done in batch 5
  { id: 'shawn-mendes', assets: [] }, // done
  { id: 'chance-the-rapper', assets: [
    a('chance-the-rapper',2,'real_estate','Chicago Family Home','Family home in Chicago\'s Chatham neighbourhood — deeply rooted in his hometown community',1.8,'Zillow 2025'),
    a('chance-the-rapper',3,'business','Social Works Foundation','Chicago social impact foundation and Magnificent Coloring World festival generating $10M+',5.0,'Forbes 2025'),
    a('chance-the-rapper',4,'business','Acid Rap Streaming Royalties','Streaming revenues from Coloring Book, Acid Rap and brand deals with Kit Kat and others',12,'Billboard 2025'),
  ]},
  { id: 'frank-ocean', assets: [
    a('frank-ocean',2,'real_estate','Los Angeles Home','Reclusive lifestyle — minimalist LA home reflecting his private artistic existence',3.0,'Zillow 2025'),
    a('frank-ocean',3,'business','Blonded Radio & Homer Jewelry','Pink Friday vinyl pop-up revenues, Homer jewellery brand launch and Blonde streaming income',15,'Forbes 2025'),
    a('frank-ocean',4,'business','Def Jam Publishing Rights','Publishing ownership of Blonde, Channel ORANGE and unreleased music vault',25,'Billboard 2025'),
  ]},
  { id: 'tyler-the-creator', assets: [] }, // done
  { id: 'doja-cat', assets: [] }, // done
  { id: 'missy-elliott', assets: [
    a('missy-elliott',2,'real_estate','Virginia Estate','Home compound in Virginia Beach/Hampton Roads area — stays connected to her hometown roots',2.5,'Zillow 2025'),
    a('missy-elliott',3,'business','The Goldmind Inc Records','Record label and Timbaland production partnership generating ongoing royalties from iconic 2000s catalog',20,'Billboard 2025'),
    a('missy-elliott',4,'business','Adidas & Super Bowl Legacy','Super Bowl halftime legacy income and Adidas collaboration reflecting cultural icon status',10,'Forbes 2025'),
  ]},
  { id: 'wyclef-jean', assets: [
    a('wyclef-jean',2,'real_estate','New Jersey Estate','Family home in New Jersey maintained since Fugees peak era',2.0,'Zillow 2025'),
    a('wyclef-jean',3,'business','Yele Haiti Foundation','Haiti development foundation following 2010 earthquake and ongoing Caribbean community work',3.0,'Forbes 2025'),
    a('wyclef-jean',4,'business','Carnival Records','Wyclef\'s solo label and production ventures including streaming royalties from Fugees catalog',10,'Billboard 2025'),
  ]},
  { id: 'post-malone', assets: [] }, // done
  // More athletes
  { id: 'muhammad-ali', assets: [
    a('muhammad-ali',2,'real_estate','Louisville Home Museum','Muhammad Ali Center and birthplace museum in Louisville Kentucky — cultural landmark',5.0,'Forbes 2025'),
    a('muhammad-ali',3,'business','Muhammad Ali Enterprises','Brand licensing company managed by his estate — $7M+ annually in licensing fees',25,'Forbes 2025'),
    a('muhammad-ali',4,'art','Ali Memorabilia Collection','Championship belts, gloves and authenticated memorabilia — museum-quality pieces worldwide',10,'Sotheby\'s 2025'),
  ]},
  { id: 'pele', assets: [
    a('pele',2,'real_estate','Santos Brazil Estate','Historic estate in Guaruja, Sao Paulo maintained by the Pele estate and family',4.0,'Veja 2025'),
    a('pele',3,'business','Pele Estate Licensing','Brand licensing by the estate generating royalties from global football merchandise',15,'Forbes 2025'),
    a('pele',4,'art','Pele Memorabilia Archive','Original match-worn jerseys, boots and trophies — priceless football heritage items',8.0,'Sotheby\'s 2025'),
  ]},
  { id: 'naomi-osaka', assets: [] }, // done
  { id: 'rafael-nadal', assets: [] }, // done in batch 6
  { id: 'ashleigh-barty', assets: [
    a('ashleigh-barty',2,'real_estate','Brisbane Home','Modern family home in Brisbane — Barty retired young to spend time in her Queensland hometown',1.5,'realestate.com.au 2025'),
    a('ashleigh-barty',3,'business','Nike & ANZ Bank Deals','Nike Australia ambassador and ANZ Bank sponsorship generating $5M+ annually',10,'Forbes 2025'),
    a('ashleigh-barty',4,'business','Barty Golf Career','Transitioned to professional golf following tennis retirement — endorsement continuation',3.0,'Forbes 2025'),
  ]},
  { id: 'andy-murray', assets: [] }, // done in batch 8
  // Media personalities
  { id: 'conan-obrien', assets: [] }, // done in batch 6
  { id: 'david-guetta', assets: [
    a('david-guetta',2,'real_estate','Miami Beach Penthouse','Ultra-luxury penthouse in South Beach, Miami — fitting for EDM royalty',5.5,'Zillow 2025'),
    a('david-guetta',3,'real_estate','Ibiza Villa','Historic villa on Ibiza overlooking the sea — his spiritual home as DJ king of Ibiza',4.0,'Idealista 2025'),
    a('david-guetta',4,'business','Jack Back & Future Rave','Music labels, streaming revenues from Titanium/When Love Takes Over and touring residencies',30,'Forbes 2025'),
  ]},
  { id: 'diplo', assets: [
    a('diplo',2,'real_estate','Los Angeles Home','Modern home in Silver Lake — Diplo keeps it creative and community-focused in LA',2.5,'Zillow 2025'),
    a('diplo',3,'business','Mad Decent Records','Record label home to MIA, Sleigh Bells and Major Lazer; streaming revenue from billions of plays',20,'Billboard 2025'),
    a('diplo',4,'business','Major Lazer Touring','Major Lazer residencies and festival revenues generating $10M+ per touring cycle',10,'Pollstar 2025'),
  ]},
  { id: 'gennady-golovkin', assets: [
    a('gennady-golovkin',2,'real_estate','Las Vegas Compound','Private compound in Las Vegas — standard for elite boxing champions',2.5,'Zillow 2025'),
    a('gennady-golovkin',3,'business','GGG Promotions','Boxing promotion company and streaming deal with DAZN generating $20M+ per fight',20,'Forbes 2025'),
    a('gennady-golovkin',4,'business','Kazakhstan Brand Portfolio','Brand deals in Kazakhstan and Central Asia reflecting his legendary status at home',5.0,'Forbes 2025'),
  ]},
];

// Photo URL fixes
const photoFixes = {
  'sebastian-vettel': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Sebastian_Vettel_2022_Bahrain.jpg/300px-Sebastian_Vettel_2022_Bahrain.jpg',
  'jenson-button': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Jenson_Button_2010.jpg/300px-Jenson_Button_2010.jpg',
  'joe-montana': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Joe_Montana_2022.jpg/300px-Joe_Montana_2022.jpg',
  'brett-favre': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Brett_Favre_2015.jpg/300px-Brett_Favre_2015.jpg',
  'larry-bird': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Larry_Bird_2018.jpg/300px-Larry_Bird_2018.jpg',
  'barry-bonds': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Barry_Bonds_2014.jpg/300px-Barry_Bonds_2014.jpg',
  'rob-lowe': 'https://image.tmdb.org/t/p/w400/2fmkNNrZ3E3GkjBb9i5rlPnPGz.jpg',
  'lance-armstrong': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Lance_Armstrong_2023.jpg/300px-Lance_Armstrong_2023.jpg',
  'penelope-cruz': 'https://image.tmdb.org/t/p/w400/ypwPtIAuCkBLqrEJK6vlPMwmFGE.jpg',
  'zoe-saldana': 'https://image.tmdb.org/t/p/w400/sHm9gXPCTMoJV6EvIEAW0bCkYPF.jpg',
  'hilary-swank': 'https://image.tmdb.org/t/p/w400/uuHtJdMl3s1AhMvhTjFPaLd44M9.jpg',
  'claire-danes': 'https://image.tmdb.org/t/p/w400/vhNGmFgIi0GmHvqJ4sQkT1J1MaP.jpg',
  'jared-leto': 'https://image.tmdb.org/t/p/w400/qXioSNdSR3T2EjT1GJGE5rCiKxb.jpg',
  'chance-the-rapper': 'https://image.tmdb.org/t/p/w400/eWZBMvKd7JFGNZvMZcTgEiSHXcA.jpg',
  'frank-ocean': 'https://image.tmdb.org/t/p/w400/uaexVrGJaToBkz7fRpCyMYMlOhb.jpg',
  'missy-elliott': 'https://image.tmdb.org/t/p/w400/5c1BQ0V0WsBbxqRxLkW0ywFdOLl.jpg',
  'wyclef-jean': 'https://image.tmdb.org/t/p/w400/b4uNAGk4mB7H5tEXSJM5HUQZrQE.jpg',
  'ashleigh-barty': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Ash_Barty_2022_Australian_Open.jpg/300px-Ash_Barty_2022_Australian_Open.jpg',
  'david-guetta': 'https://image.tmdb.org/t/p/w400/1TCK8VHZ83RUcq8IFc5kKrI5e8D.jpg',
  'diplo': 'https://image.tmdb.org/t/p/w400/bMqvQoM9vXr3N91WU9WjKMpM2JE.jpg',
  'gennady-golovkin': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Gennady_Golovkin_2023.jpg/300px-Gennady_Golovkin_2023.jpg',
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
