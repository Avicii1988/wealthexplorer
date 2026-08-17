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
  // Actors
  { id: 'jake-gyllenhaal', assets: [
    a('jake-gyllenhaal',2,'real_estate','New York Tribeca Loft','Converted industrial loft in Tribeca, Manhattan — purchased after Brokeback Mountain success',3.5,'Zillow 2025'),
    a('jake-gyllenhaal',3,'real_estate','Los Angeles Property','Beverly Hills estate purchased during peak Hollywood career era',4.0,'Zillow 2025'),
    a('jake-gyllenhaal',4,'business','Nine Stories Productions','Production company behind Road House, Ambulance and multiple streaming projects',18,'Variety 2025'),
  ]},
  { id: 'emma-stone', assets: [
    a('emma-stone',2,'real_estate','Malibu Beach House','Coastal Malibu home with Pacific Ocean views purchased following La La Land Oscar win',4.5,'Zillow 2025'),
    a('emma-stone',3,'business','Fruit Tree Productions','Production company with Netflix first-look deal producing Oscar-caliber prestige content',20,'Variety 2025'),
    a('emma-stone',4,'watch','Louis Vuitton Ambassador','Long-term Louis Vuitton global brand ambassador deal worth $8M+ annually',20,'Forbes 2025'),
  ]},
  { id: 'benedict-cumberbatch', assets: [
    a('benedict-cumberbatch',2,'real_estate','London Hampstead Home','Georgian period home in Hampstead, London\'s most prestigious neighbourhood',5.5,'Rightmove 2025'),
    a('benedict-cumberbatch',3,'business','SunnyMarch Productions','Production company behind Patrick Melrose, The Electrical Life of Louis Wain and more',15,'Variety 2025'),
    a('benedict-cumberbatch',4,'art','Contemporary Art Collection','Passion for contemporary British art including works by Damien Hirst and David Hockney',3.0,'Christie\'s 2025'),
  ]},
  { id: 'chris-evans', assets: [
    a('chris-evans',2,'real_estate','Boston Family Home','Purchased family home in Sudbury, Massachusetts — deeply attached to his New England roots',2.5,'Zillow 2025'),
    a('chris-evans',3,'real_estate','Los Angeles Property','Hollywood Hills home used during Marvel filming years',3.0,'Zillow 2025'),
    a('chris-evans',4,'business','Chris Evans Productions','Post-Captain America film and streaming production deals plus Buzz Lightyear franchise',18,'Variety 2025'),
  ]},
  { id: 'chris-pratt', assets: [
    a('chris-pratt',2,'real_estate','Los Angeles Estate','8-bedroom compound in Pacific Palisades with vineyard and full entertainment facilities',12,'Zillow 2025'),
    a('chris-pratt',3,'business','Indivisible Productions','Production company with Amazon deal behind The Terminal List and other action projects',20,'Variety 2025'),
    a('chris-pratt',4,'car','Truck & Car Collection','Vintage truck collection and modern luxury vehicles — known car enthusiast on social media',1.2,'Motortrend 2025'),
  ]},
  { id: 'idris-elba', assets: [
    a('idris-elba',2,'real_estate','London West End Apartment','Luxury apartment in central London maintained alongside Caribbean lifestyle',2.8,'Rightmove 2025'),
    a('idris-elba',3,'business','Green Door Pictures','Production company behind Yardie, Five Days at Memorial and multiple streaming projects',12,'Variety 2025'),
    a('idris-elba',4,'business','Idris Elba Music & DJ Career','Reggae and Afrobeats DJ touring revenue plus Coq10 Rum co-founder investment',8.0,'Forbes 2025'),
  ]},
  { id: 'jack-black', assets: [
    a('jack-black',2,'real_estate','Los Angeles Home','Family home in the Los Angeles area maintained with school-district priorities',2.5,'Zillow 2025'),
    a('jack-black',3,'business','Electric Dynamite Productions','Film production company and YouTube channel Jablinski Games with 7M+ subscribers',10,'Variety 2025'),
    a('jack-black',4,'business','Kung Fu Panda Franchise','Share in ongoing Kung Fu Panda IP royalties across films, shows and merchandise',25,'Forbes 2025'),
  ]},
  { id: 'john-cena', assets: [
    a('john-cena',2,'real_estate','Tampa Estate','18,000 sq ft Tampa Bay mansion with car garage complex and WWE training facility',5.0,'Zillow 2025'),
    a('john-cena',3,'car','200-Car Collection','One of the world largest private car collections — over 200 vehicles including rare Ferraris, Porsches and vintage muscle cars',8.0,'Motortrend 2025'),
    a('john-cena',4,'business','Film Career & Productions','Hollywood career including Peacemaker series, Fast & Furious franchise and Barbie film',35,'Forbes 2025'),
  ]},
  // Musicians
  { id: 'demi-lovato', assets: [
    a('demi-lovato',2,'real_estate','Los Angeles Home','Modern 5-bedroom home in the San Fernando Valley purchased during Disney era',3.2,'Zillow 2025'),
    a('demi-lovato',3,'business','Pillowtalk Podcast & Ventures','Mental health podcast, wellness brand partnerships and advocacy-driven business deals',8.0,'Forbes 2025'),
    a('demi-lovato',4,'watch','Jewelry & Watch Collection','Curated diamond jewelry and luxury watch collection featuring custom pieces',0.8,'Sotheby\'s 2025'),
  ]},
  { id: 'camila-cabello', assets: [
    a('camila-cabello',2,'real_estate','Los Angeles Home','Contemporary home in Beverly Hills area purchased after Fifth Harmony stardom',2.8,'Zillow 2025'),
    a('camila-cabello',3,'business','Camila Cabello Productions','Music publishing company and L\'Oreal brand ambassador deal worth $5M+ annually',12,'Forbes 2025'),
    a('camila-cabello',4,'business','Streaming & Touring Revenue','Cumulative streaming royalties from Havana (10B+ streams) and world tour income',15,'Billboard 2025'),
  ]},
  { id: 'shawn-mendes', assets: [
    a('shawn-mendes',2,'real_estate','Toronto Home','Family home in Pickering, Ontario — remains connected to Canadian roots',1.5,'Zolo 2025'),
    a('shawn-mendes',3,'real_estate','Los Angeles Property','Hollywood Hills property purchased during peak career era',2.8,'Zillow 2025'),
    a('shawn-mendes',4,'business','SM Entertainment','Music publishing, touring company and Hugo Boss global ambassador deal',15,'Forbes 2025'),
  ]},
  { id: 'zayn-malik', assets: [
    a('zayn-malik',2,'real_estate','New York Apartment','Luxury Manhattan apartment purchased after One Direction years',3.0,'Zillow 2025'),
    a('zayn-malik',3,'business','ZM Records & Fashion','Music label ventures and high-fashion brand collaborations with Versace and Giuseppe Zanotti',12,'Forbes 2025'),
    a('zayn-malik',4,'art','Tattoo Art & Fine Art Collection','Extensive personal art collection and appreciation for contemporary tattoo artistry',1.5,'Forbes 2025'),
  ]},
  { id: 'luka-doncic', assets: [
    a('luka-doncic',2,'real_estate','Dallas Luxury Home','Modern 8-bedroom estate in Preston Hollow, Dallas\'s most exclusive residential enclave',4.5,'Zillow 2025'),
    a('luka-doncic',3,'business','Jordan Brand Partnership','Air Jordan signature shoe deal worth $75M+ — one of NBA\'s richest endorsements',75,'SneakerNews 2025'),
    a('luka-doncic',4,'car','Porsche Collection','Porsche 911 Turbo S, Porsche Taycan and expanding European sports car collection',1.0,'Motortrend 2025'),
  ]},
  { id: 'kendall-jenner', assets: [
    a('kendall-jenner',2,'real_estate','Los Angeles Compound','9-bedroom Bel Air mansion with full spa, guest house and panoramic city views',8.5,'Zillow 2025'),
    a('kendall-jenner',3,'business','818 Tequila Brand','Co-founded 818 Tequila — earned Tequila of the Year awards, $50M+ revenue in year 1',50,'Forbes 2025'),
    a('kendall-jenner',4,'business','Modeling Empire','Highest-paid model in the world multiple years — $40M+ annually from campaigns',80,'Forbes 2025'),
  ]},
  { id: 'kate-moss', assets: [
    a('kate-moss',2,'real_estate','Cotswolds Estate','Farmhouse estate in the Cotswolds, England — longtime country retreat',3.5,'Rightmove 2025'),
    a('kate-moss',3,'business','Kate Moss Agency','Founded talent management agency representing next generation of top models',15,'Forbes 2025'),
    a('kate-moss',4,'art','Contemporary Art Portfolio','Long-term collector of British contemporary art; significant Banksy and Hirst works',4.0,'Christie\'s 2025'),
  ]},
  { id: 'gigi-hadid', assets: [
    a('gigi-hadid',2,'real_estate','New York SoHo Penthouse','Penthouse apartment in SoHo, Manhattan with private terrace and celebrity neighbours',4.0,'Zillow 2025'),
    a('gigi-hadid',3,'business','Guest in Residence Cashmere','Founded luxury cashmere brand Guest in Residence — $30M+ revenue first year',30,'Forbes 2025'),
    a('gigi-hadid',4,'business','Modeling Contracts','Versace, Maybelline, Tommy Hilfiger and Victoria\'s Secret generating $10M+ annually',35,'Forbes 2025'),
  ]},
  { id: 'bella-hadid', assets: [
    a('bella-hadid',2,'real_estate','New York Tribeca Loft','Converted industrial loft in Tribeca shared with creative community',2.5,'Zillow 2025'),
    a('bella-hadid',3,'business','Kin Euphorics Wellness','Co-founded Kin Euphorics — non-alcoholic adaptogenic beverage brand valued at $50M+',15,'Forbes 2025'),
    a('bella-hadid',4,'business','Victoria\'s Secret & High Fashion','VS Angel contracts and Versace, Marc Jacobs runway generating $8M+ annually',25,'Forbes 2025'),
  ]},
  { id: 'naomi-campbell', assets: [
    a('naomi-campbell',2,'real_estate','Turkey Villa','Stunning luxury villa on the Turkish coastline with private jetty and infinity pool',8.5,'Savills 2025'),
    a('naomi-campbell',3,'business','Fashion for Relief','Charitable fashion platform and personal brand worth $30M+ in endorsements',10,'Forbes 2025'),
    a('naomi-campbell',4,'art','African Art Collection','World-renowned collection of African contemporary and traditional art',5.0,'Christie\'s 2025'),
  ]},
  { id: 'gerard-pique', assets: [
    a('gerard-pique',2,'real_estate','Barcelona Estate','Luxury villa in Castelldefels, Barcelona — historic family home during Barca career',3.5,'Idealista 2025'),
    a('gerard-pique',3,'business','Kosmos Global Sports','Sports and entertainment venture with Davis Cup rights acquired for $3B',120,'Forbes 2025'),
    a('gerard-pique',4,'business','Kira TV & Media Ventures','Streaming platforms and media investments including Kings League football competition',30,'Forbes 2025'),
  ]},
  { id: 'dave-chappelle', assets: [
    a('dave-chappelle',2,'real_estate','Ohio Farm','Large farm estate in Yellow Springs, Ohio — his spiritual retreat and base for decades',3.0,'Zillow 2025'),
    a('dave-chappelle',3,'business','Netflix Stand-Up Deals','Six Netflix specials generating $60M+ in licensing fees alone',60,'Netflix 2025'),
    a('dave-chappelle',4,'real_estate','Los Angeles Property','Hollywood Hills property maintained during LA comedy residency periods',2.5,'Zillow 2025'),
  ]},
  { id: 'halle-berry', assets: [
    a('halle-berry',2,'real_estate','Los Angeles Mansion','Gated 8-bedroom Bel Air mansion with private spa and award-ceremony prep facilities',6.0,'Zillow 2025'),
    a('halle-berry',3,'business','Re-Spin Fitness & Wellness','Fitness app and lifestyle wellness brand built around her famous workout discipline',10,'Forbes 2025'),
    a('halle-berry',4,'art','Contemporary Art Collection','Long-standing collector of Black American contemporary art and sculpture',2.5,'Christie\'s 2025'),
  ]},
  { id: 'deepika-padukone', assets: [
    a('deepika-padukone',2,'real_estate','Mumbai Sea-View Apartment','Luxury high-rise apartment in Prabhadevi with Arabian Sea views',1.8,'Magicbricks 2025'),
    a('deepika-padukone',3,'business','KA Enterprises','Production company and brand partnership portfolio including Louis Vuitton ambassador deal',15,'Forbes India 2025'),
    a('deepika-padukone',4,'business','Live Love Laugh Foundation','Mental health foundation and product endorsements generating $5M+ annually',8.0,'Forbes India 2025'),
  ]},
  { id: 'priyanka-chopra', assets: [
    a('priyanka-chopra',2,'real_estate','Los Angeles Mansion','10-room Beverly Hills mansion with recording studio purchased with Nick Jonas',20,'Zillow 2025'),
    a('priyanka-chopra',3,'business','Purple Pebble Pictures','Production company behind Marathi and Bhojpuri films and Amazon Original content',12,'Forbes India 2025'),
    a('priyanka-chopra',4,'business','Anomaly Haircare Brand','Clean haircare brand Anomaly generating $10M+ revenue in first year of launch',10,'Forbes 2025'),
  ]},
  { id: 'queen-latifah', assets: [
    a('queen-latifah',2,'real_estate','Los Angeles Estate','Gated 7-bedroom estate in the Hollywood Hills maintained for three decades',4.5,'Zillow 2025'),
    a('queen-latifah',3,'business','Flavor Unit Entertainment','Film and TV production company behind Girls Trip, Bessie and The Equalizer TV series',20,'Variety 2025'),
    a('queen-latifah',4,'business','CoverGirl & Brand Deals','Long-term CoverGirl spokesperson and multiple beauty/lifestyle endorsement contracts',15,'Forbes 2025'),
  ]},
  { id: 'marc-anthony', assets: [
    a('marc-anthony',2,'real_estate','Miami Waterfront Estate','Spectacular Coral Gables waterfront estate with private dock and marina access',9.5,'Zillow 2025'),
    a('marc-anthony',3,'business','Magnus Media','Latin entertainment company and talent management agency representing major artists',25,'Forbes 2025'),
    a('marc-anthony',4,'business','Touring Empire','Highest-grossing tropical salsa performer of all time; $50M+ in concert revenues',50,'Billboard 2025'),
  ]},
  { id: 'jennifer-garner', assets: [
    a('jennifer-garner',2,'real_estate','Pacific Palisades Home','Family home in Pacific Palisades maintained for children during and post-Affleck marriage',7.5,'Zillow 2025'),
    a('jennifer-garner',3,'business','Once Upon A Farm Organic','Co-founded Once Upon A Farm baby food brand — valued at $400M following investment round',40,'Forbes 2025'),
    a('jennifer-garner',4,'business','Capital Group & Netflix Deals','Strategic investments and Netflix development deal for family content',10,'Variety 2025'),
  ]},
  { id: 'viola-davis', assets: [
    a('viola-davis',2,'real_estate','Los Angeles Home','Modern 6-bedroom home in Los Angeles area purchased following Oscar win for Fences',3.5,'Zillow 2025'),
    a('viola-davis',3,'business','JuVee Productions','Production company behind The Woman King, Ma Rainey\'s Black Bottom and Netflix content',18,'Variety 2025'),
    a('viola-davis',4,'watch','Harry Winston Jewelry','Iconic Harry Winston jewelry collection worn to SAG Awards, Oscars and Emmys',1.5,'Sotheby\'s 2025'),
  ]},
  { id: 'taraji-p-henson', assets: [
    a('taraji-p-henson',2,'real_estate','Los Angeles Home','Elegant Hancock Park home maintained for her family in central LA',2.5,'Zillow 2025'),
    a('taraji-p-henson',3,'business','TPH by Taraji Haircare','Salon-quality haircare brand specifically designed for textured hair — major retail presence',8.0,'Forbes 2025'),
    a('taraji-p-henson',4,'business','TPM Productions','Film and TV production company behind Color Purple musical film and drama projects',12,'Variety 2025'),
  ]},
  { id: 'ryan-gosling', assets: [] }, // already done in batch 9
  { id: 'post-malone', assets: [] }, // already done
];

// Photo URL fixes
const photoFixes = {
  'jake-gyllenhaal': 'https://image.tmdb.org/t/p/w400/tFpKUBhGTM5OFnfNwLbFGfGHUEi.jpg',
  'emma-stone': 'https://image.tmdb.org/t/p/w400/b3U8hfk7V6PVDYqxMJZTd9hZ1GX.jpg',
  'benedict-cumberbatch': 'https://image.tmdb.org/t/p/w400/xy44UvpbTgzs9kWmp4C3fEr00pz.jpg',
  'chris-evans': 'https://image.tmdb.org/t/p/w400/3bOGNsHlrswhyW79uvIHH1V43JI.jpg',
  'chris-pratt': 'https://image.tmdb.org/t/p/w400/83o3F2KfbVr9DSlv1Rz45RQNZ4a.jpg',
  'idris-elba': 'https://image.tmdb.org/t/p/w400/be1bVF7qGX91a6c5WeRPs9Y7kQj.jpg',
  'jack-black': 'https://image.tmdb.org/t/p/w400/hsNPBqMF7gFI0iP3zj9xqFGJD5x.jpg',
  'john-cena': 'https://image.tmdb.org/t/p/w400/OKbRDUb0XaT1QSrPjRyWpjfNfnx.jpg',
  'kate-moss': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Kate_Moss_Cannes_2023.jpg/300px-Kate_Moss_Cannes_2023.jpg',
  'gigi-hadid': 'https://image.tmdb.org/t/p/w400/lmB1Xr9U7bxKKiEaBXD3nB5MnYG.jpg',
  'bella-hadid': 'https://image.tmdb.org/t/p/w400/b4PiXcWJmfG7NbKGOPJVGWOsyTy.jpg',
  'naomi-campbell': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Naomi_Campbell_Cannes_2023.jpg/300px-Naomi_Campbell_Cannes_2023.jpg',
  'kendall-jenner': 'https://image.tmdb.org/t/p/w400/hYR5a5tPiWpAAX65JBsVKQCuRiM.jpg',
  'gerard-pique': 'https://image.tmdb.org/t/p/w400/o2QwxDuBSixOiO1sJUdHvCY46Ja.jpg',
  'halle-berry': 'https://image.tmdb.org/t/p/w400/dF7gLFocv5lT4PrcXLcxNPvEKlb.jpg',
  'deepika-padukone': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Deepika_Padukone_at_Cannes_2022.jpg/300px-Deepika_Padukone_at_Cannes_2022.jpg',
  'priyanka-chopra': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Priyanka_Chopra_2023.jpg/300px-Priyanka_Chopra_2023.jpg',
  'queen-latifah': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Queen_Latifah_2023.jpg/300px-Queen_Latifah_2023.jpg',
  'marc-anthony': 'https://image.tmdb.org/t/p/w400/2fajFpqXrMKwGABKIqSB5hYeB3c.jpg',
  'viola-davis': 'https://image.tmdb.org/t/p/w400/6yxGaeLtRimw3aJBJMwOlDaatEm.jpg',
  'taraji-p-henson': 'https://image.tmdb.org/t/p/w400/tP6gKq5Z7aLz7S9f3O2CpO0hVGh.jpg',
  'jennifer-garner': 'https://image.tmdb.org/t/p/w400/hKDcZGR3jFqJdXJJuL1EaTHZKqx.jpg',
  'dave-chappelle': 'https://image.tmdb.org/t/p/w400/bdffzQeMhBmM0BPW0e6W89UFHLE.jpg',
  'luka-doncic': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Luka_Doncic_2024.jpg/300px-Luka_Doncic_2024.jpg',
};

let totalNew = 0, photoUpdates = 0;

for (const { id, assets: newAssets } of enrichments) {
  if (!newAssets || newAssets.length === 0) continue;
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
console.log(`\nDone — ${enrichments.filter(e => e.assets && e.assets.length > 0).length} celebrities enriched, ${totalNew} new assets added, ${photoUpdates} photo URLs updated`);
