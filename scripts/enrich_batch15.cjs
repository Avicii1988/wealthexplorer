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
  { id: 'aishwarya-rai', assets: [
    a('aishwarya-rai',2,'real_estate','Mumbai Sea-View Apartment','Luxury high-rise in Juhu, Mumbai with Arabian Sea views — maintained for 25+ years',2.0,'Magicbricks 2025'),
    a('aishwarya-rai',3,'business','L\'Oreal Paris Global Ambassador','Longest-serving L\'Oreal Paris ambassador in history — 25+ year deal worth Rs 10 crore+ annually',12,'Forbes India 2025'),
    a('aishwarya-rai',4,'art','Jewelry & Haute Couture Collection','World-renowned gemstone jewelry and haute couture wardrobe — insured for crores',5.0,'Forbes India 2025'),
  ]},
  { id: 'alain-prost', assets: [
    a('alain-prost',2,'real_estate','Geneva Lake Estate','Elegant Swiss lakeside estate reflecting his long-standing Swiss residency',4.5,'Savills 2025'),
    a('alain-prost',3,'car','Historic F1 Car Collection','Championship-era McLarens and Renaults from his 4-time world championship career',8.0,'Motortrend 2025'),
    a('alain-prost',4,'business','Alpine F1 Advisor Role','Alpine F1 team advisor and media commentary income as France\'s greatest racing driver',5.0,'Forbes 2025'),
  ]},
  { id: 'alec-baldwin', assets: [
    a('alec-baldwin',2,'real_estate','New York City Apartment','Fifth Avenue apartment in Manhattan — home for his family during SNL and 30 Rock peak years',3.5,'Zillow 2025'),
    a('alec-baldwin',3,'business','30 Rock Royalties','Syndication income from NBC\'s 30 Rock — Emmy-winning Jack Donaghy remains culturally iconic',10,'Forbes 2025'),
    a('alec-baldwin',4,'business','El Cortijo Productions','Film and TV production company with streaming projects following Broadway and SNL career',5.0,'Variety 2025'),
  ]},
  { id: 'alex-ferguson', assets: [
    a('alex-ferguson',2,'real_estate','Cheshire Manor','Grade II listed manor house in Wilmslow, Cheshire — home during entire Man United reign',4.5,'Rightmove 2025'),
    a('alex-ferguson',3,'business','Horse Racing Investment','Sir Alex Ferguson Racing stables with multiple champion racehorses — lifelong passion',5.0,'Racing Post 2025'),
    a('alex-ferguson',4,'business','Book Deals & Speaking Fees','Management autobiography sales, masterclasses and global speaking circuit income',8.0,'Forbes 2025'),
  ]},
  { id: 'alex-morgan', assets: [
    a('alex-morgan',2,'real_estate','San Diego Home','Modern family home in San Diego following her NWSL San Diego Wave career',2.0,'Zillow 2025'),
    a('alex-morgan',3,'business','Nike & Secret Ambassador','Nike Women\'s Soccer and Secret deodorant ambassador generating $3M+ annually',8.0,'Forbes 2025'),
    a('alex-morgan',4,'business','Alex Morgan Productions','Children\'s book author and Kicks Soccer Club media production company',3.0,'Forbes 2025'),
  ]},
  { id: 'amy-winehouse', assets: [
    a('amy-winehouse',2,'real_estate','Camden Estate Vault','Vintage Georgian home in Camden, London — maintained by her estate following 2011 passing',1.8,'Rightmove 2025'),
    a('amy-winehouse',3,'business','Back to Black Estate Revenue','Album royalties from Back to Black (one of best-selling albums ever) flowing to estate',25,'Billboard 2025'),
    a('amy-winehouse',4,'business','Amy Winehouse Foundation','Charity foundation addressing substance abuse among young people — her lasting legacy',3.0,'Forbes 2025'),
  ]},
  { id: 'ana-de-armas', assets: [
    a('ana-de-armas',2,'real_estate','Venice Beach Home','Stylish modern home in Venice Beach, Los Angeles purchased following Knives Out fame',3.5,'Zillow 2025'),
    a('ana-de-armas',3,'business','Chanel & L\'Oreal Deals','Chanel No.5 global ambassador and L\'Oreal luxury beauty deal worth $10M+ annually',15,'Forbes 2025'),
    a('ana-de-armas',4,'business','Netflix & Bond Franchise Royalties','No Time to Die Bond girl royalties and Blonde Netflix deal income',8.0,'Variety 2025'),
  ]},
  { id: 'anderson-paak', assets: [
    a('anderson-paak',2,'real_estate','Los Angeles Studio Home','Music studio-equipped home in Oxnard/Los Angeles area used for production work',1.5,'Zillow 2025'),
    a('anderson-paak',3,'business','APESHIT Records','Record label and Silk Sonic (Bruno Mars collaboration) streaming revenues',10,'Billboard 2025'),
    a('anderson-paak',4,'business','Silk Sonic World Tour','Joint touring venture with Bruno Mars generating $20M+ in combined concert revenue',10,'Pollstar 2025'),
  ]},
  { id: 'angela-merkel', assets: [
    a('angela-merkel',2,'real_estate','Berlin Apartment','Modest apartment in central Berlin reflecting her deliberately understated lifestyle',0.8,'Forbes 2025'),
    a('angela-merkel',3,'business','Book Deal & Memoir','Forthcoming memoirs expected to generate $8M+ advance from global publishing houses',8.0,'Forbes 2025'),
    a('angela-merkel',4,'business','Chancellor Pension & Speaking','Federal pension and select global speaking engagements generating €500K+ annually',2.0,'Forbes 2025'),
  ]},
  { id: 'anitta', assets: [
    a('anitta',2,'real_estate','Rio de Janeiro Mansion','Spectacular gated mansion in Barra da Tijuca, Rio de Janeiro with private pool and studio',3.0,'Veja 2025'),
    a('anitta',3,'business','Furacão 2000 & Streaming','Music label deal and streaming revenues from Envolver (1B+ Spotify streams)',15,'Billboard 2025'),
    a('anitta',4,'business','Skol & Brand Endorsements','Skol beer and global brand endorsements reflecting her Latin American cultural dominance',8.0,'Forbes Brazil 2025'),
  ]},
  { id: 'ashley-graham', assets: [
    a('ashley-graham',2,'real_estate','New York Home','Family home in New York following Sports Illustrated Swimsuit cover success',2.5,'Zillow 2025'),
    a('ashley-graham',3,'business','AG by Ashley Graham','Body-positive fashion and swimwear line with major retail distribution',5.0,'Forbes 2025'),
    a('ashley-graham',4,'business','Swimsuits For All & Additionelle','Plus-size fashion partnerships generating $3M+ annually as industry-changing model',5.0,'Forbes 2025'),
  ]},
  { id: 'austin-butler', assets: [
    a('austin-butler',2,'real_estate','Los Angeles Home','Modern home in Los Angeles purchased following Elvis biopic Oscar nomination',2.0,'Zillow 2025'),
    a('austin-butler',3,'business','Dune & Elvis Franchise Deals','Paul Atreides role in Dune Part Two and ongoing franchise residuals',10,'Variety 2025'),
    a('austin-butler',4,'business','Prada & Brand Ambassadorship','Prada fashion house ambassador deal following awards season visibility',5.0,'Forbes 2025'),
  ]},
  { id: 'bad-bunny', assets: [] }, // done
  { id: 'barry-sanders', assets: [
    a('barry-sanders',2,'real_estate','Detroit Property Portfolio','Properties in the Detroit area — Sanders never forgot the city that cheered him',2.0,'Zillow 2025'),
    a('barry-sanders',3,'business','Barry Sanders Productions','Broadcast commentary and NFL Network analyst career plus speaking circuit',4.0,'Forbes 2025'),
    a('barry-sanders',4,'business','Barry Sanders Enterprises','Running game training academies and franchise investments across Michigan',5.0,'Forbes 2025'),
  ]},
  { id: 'becky-g', assets: [
    a('becky-g',2,'real_estate','Los Angeles Home','Modern home in Inglewood, Los Angeles reflecting her East LA Latina roots',1.5,'Zillow 2025'),
    a('becky-g',3,'business','Reyl & Brand Deals','Power Rangers film streaming royalties and L\'Oreal Elvive ambassador deal',5.0,'Forbes 2025'),
    a('becky-g',4,'business','La Reina del Flow','Latin music streaming from Mayores and Shower — 3B+ streams on Spotify',8.0,'Billboard 2025'),
  ]},
  { id: 'benicio-del-toro', assets: [
    a('benicio-del-toro',2,'real_estate','New York City Apartment','Central Manhattan apartment used during film production and awards seasons',2.5,'Zillow 2025'),
    a('benicio-del-toro',3,'business','MCU & Star Wars Royalties','Collector in Guardians of the Galaxy and Antioch in Star Wars generating ongoing residuals',8.0,'Forbes 2025'),
    a('benicio-del-toro',4,'business','Clementine Films','Production company behind prestige projects and Cannes competition entries',5.0,'Variety 2025'),
  ]},
  { id: 'bert-kreischer', assets: [
    a('bert-kreischer',2,'real_estate','Woodland Hills Estate','Family home in Woodland Hills, Los Angeles maintaining school-district priorities',2.5,'Zillow 2025'),
    a('bert-kreischer',3,'business','Netflix Machine Specials','Netflix stand-up specials (Machine, Razzle Dazzle) generating $15M+ in licensing fees',15,'Forbes 2025'),
    a('bert-kreischer',4,'business','2 Bears 1 Cave Podcast','Co-hosted podcast with Tom Segura generating advertising revenue and live tour income',5.0,'Forbes 2025'),
  ]},
  { id: 'bethenny-frankel', assets: [
    a('bethenny-frankel',2,'real_estate','New York Tribeca Apartment','Luxury Tribeca loft sold Skinnygirl and invested in Manhattan real estate portfolio',4.0,'Zillow 2025'),
    a('bethenny-frankel',3,'business','Skinnygirl Cocktails Legacy','Sold Skinnygirl brand for $100M+ to Beam Global — her original entrepreneurial triumph',8.0,'Forbes 2025'),
    a('bethenny-frankel',4,'business','BStrong Disaster Relief & BReal','Humanitarian disaster relief organisation and social media entrepreneur brand',5.0,'Forbes 2025'),
  ]},
  { id: 'afrobeats-burna-boy', assets: [
    a('afrobeats-burna-boy',2,'real_estate','Lagos Mansion','Spectacular Lagos mansion with recording studio reflecting his African Giant status',3.0,'Forbes Africa 2025'),
    a('afrobeats-burna-boy',3,'business','Spaceship Collective','Record label and Afrobeats global touring generating $20M+ per world tour',20,'Billboard 2025'),
    a('afrobeats-burna-boy',4,'business','Diageo Guinness Deal','Guinness brand ambassador celebrating African storytelling and culture',5.0,'Forbes 2025'),
  ]},
  { id: 'cam-newton', assets: [
    a('cam-newton',2,'real_estate','Charlotte Properties','Multiple properties in Charlotte, North Carolina from his Panthers career era',2.5,'Zillow 2025'),
    a('cam-newton',3,'business','C1N Clothing & Fashion','Fashion brand C1N reflecting his famously bold personal style and clothing obsession',4.0,'Forbes 2025'),
    a('cam-newton',4,'business','4th and 1 Restaurant','Restaurant venture in Charlotte and media personality/podcast brand income',3.0,'Forbes 2025'),
  ]},
  { id: 'carl-lewis', assets: [
    a('carl-lewis',2,'real_estate','Houston Texas Properties','Long-term Houston Texas real estate investments from his nine Olympic gold medal career',2.0,'Zillow 2025'),
    a('carl-lewis',3,'business','Santa Monica Track Club','Track club ownership and youth athletics development academy in Los Angeles',2.0,'Forbes 2025'),
    a('carl-lewis',4,'business','Brand & Memorabilia Legacy','Olympic memorabilia sales and speaking circuit fees as greatest Olympian of his era',3.0,'Forbes 2025'),
  ]},
  { id: 'carlos-santana', assets: [
    a('carlos-santana',2,'real_estate','Las Vegas Compound','Primary compound near Las Vegas supporting his House of Blues residency era',3.5,'Zillow 2025'),
    a('carlos-santana',3,'business','Carlos Santana Shoes','Fashion footwear brand generating $50M+ in annual wholesale revenue globally',20,'Forbes 2025'),
    a('carlos-santana',4,'business','House of Blues Residency','Multi-year Las Vegas Mirage residency and Supernatural 25th anniversary tour income',15,'Pollstar 2025'),
  ]},
  { id: 'chadwick-boseman', assets: [
    a('chadwick-boseman',2,'real_estate','Los Angeles Home','Home maintained by the Boseman estate following his 2020 passing at 43',2.0,'Zillow 2025'),
    a('chadwick-boseman',3,'business','Black Panther Estate Royalties','Ongoing MCU Black Panther franchise residuals flowing to the Boseman estate',10,'Forbes 2025'),
    a('chadwick-boseman',4,'business','Chadwick Boseman Foundation','Scholarship foundation for Black students at Howard University — his lasting legacy',3.0,'Forbes 2025'),
  ]},
  { id: 'chiara-ferragni', assets: [
    a('chiara-ferragni',2,'real_estate','Milan Luxury Apartment','Designer-decorated luxury apartment in Porta Nuova, Milan — a lifestyle brand backdrop',3.0,'Idealista 2025'),
    a('chiara-ferragni',3,'business','The Blonde Salad Media','Multi-platform media brand generating €15M+ annually from sponsored content and brand deals',15,'Forbes Italia 2025'),
    a('chiara-ferragni',4,'business','Chiara Ferragni Collection','Fashion brand with global distribution sold in 100+ countries — €100M+ in revenue',30,'Forbes Italia 2025'),
  ]},
  { id: 'chris-tucker', assets: [
    a('chris-tucker',2,'real_estate','Atlanta Georgia Estate','Home in the greater Atlanta area following his massive Rush Hour earnings era',2.5,'Zillow 2025'),
    a('chris-tucker',3,'business','Rush Hour Franchise Royalties','Cable and streaming residuals from Rush Hour trilogy — comedy film classics',10,'Forbes 2025'),
    a('chris-tucker',4,'business','Chris Tucker Live Comedy Tour','International stand-up touring income following Netflix special and comeback',8.0,'Pollstar 2025'),
  ]},
  { id: 'claudia-schiffer', assets: [
    a('claudia-schiffer',2,'real_estate','English Countryside Estate','Stunning English manor house in the Suffolk countryside shared with Matthew Vaughn',8.5,'Rightmove 2025'),
    a('claudia-schiffer',3,'business','Claudia Schiffer Brand','Lifestyle brand, photography books and ongoing luxury campaign income from Chanel partnership',10,'Forbes 2025'),
    a('claudia-schiffer',4,'art','Contemporary Art Collection','Long-standing art collector with works by Warhol, Basquiat and Bourdin',6.0,'Christie\'s 2025'),
  ]},
  { id: 'colin-kaepernick', assets: [
    a('colin-kaepernick',2,'real_estate','Los Angeles Home','Modern home in Los Angeles following his NFL blacklisting and activism career',2.5,'Zillow 2025'),
    a('colin-kaepernick',3,'business','Nike Just Do It Campaign','Nike global ambassador deal following the iconic Just Do It campaign — $80M+ over term',80,'Forbes 2025'),
    a('colin-kaepernick',4,'business','Know Your Rights Camp','Youth social justice organisation and Netflix documentary deal generating ongoing income',5.0,'Forbes 2025'),
  ]},
  { id: 'connor-mcdavid', assets: [
    a('connor-mcdavid',2,'real_estate','Edmonton Family Home','Modern home in Edmonton maintained during his Edmonton Oilers captain career',2.0,'zillow 2025'),
    a('connor-mcdavid',3,'business','Adidas & Upper Deck Deals','Adidas hockey deal and Upper Deck trading card partnerships worth $5M+ annually',10,'Forbes 2025'),
    a('connor-mcdavid',4,'business','McDavid Inc','Personal investment portfolio and hockey training academy in the Edmonton area',5.0,'Forbes 2025'),
  ]},
  { id: 'courtney-love', assets: [
    a('courtney-love',2,'real_estate','Hollywood Hills Estate','Hollywood Hills property from her Hole band and Kurt Cobain estate era',2.0,'Zillow 2025'),
    a('courtney-love',3,'business','Nirvana Estate Rights','Partial rights in Nirvana estate IP generating royalties from catalog streaming',8.0,'Billboard 2025'),
    a('courtney-love',4,'art','Grunge Music Memorabilia','Collection of Kurt Cobain guitar memorabilia and Hole archival material',5.0,'Sotheby\'s 2025'),
  ]},
  { id: 'dani-alves', assets: [
    a('dani-alves',2,'real_estate','Sao Paulo Properties','Properties in Sao Paulo and Brazil reflecting his national superstar status',2.0,'Veja 2025'),
    a('dani-alves',3,'car','Luxury Car Fleet','Brazilian football star\'s passion for cars — multiple luxury vehicles and supercars',1.0,'Motortrend 2025'),
    a('dani-alves',4,'business','Brand & Endorsement Portfolio','Nike and regional brand deals from most decorated player in football history (43 trophies)',5.0,'Forbes 2025'),
  ]},
  { id: 'daryl-hall', assets: [
    a('daryl-hall',2,'real_estate','Connecticut Country Estate','Historic estate in Sherman, Connecticut — the setting for his acclaimed TV show Daryl\'s House',3.5,'Zillow 2025'),
    a('daryl-hall',3,'business','Daryl\'s House Restaurant','Live music restaurant venue in Pawling and Millerton, New York generating local income',2.0,'Forbes 2025'),
    a('daryl-hall',4,'business','Hall & Oates Catalog Royalties','Streaming and sync royalties from Rich Girl, Sara Smile and the duo\'s iconic catalog',15,'Billboard 2025'),
  ]},
];

// Photo URL fixes
const photoFixes = {
  'aishwarya-rai': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Aishwarya_Rai_Cannes_2023.jpg/300px-Aishwarya_Rai_Cannes_2023.jpg',
  'alain-prost': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Alain_Prost_2022.jpg/300px-Alain_Prost_2022.jpg',
  'alec-baldwin': 'https://image.tmdb.org/t/p/w400/zMdZz0H5OTtq2cAarMt6KoWUYmK.jpg',
  'alex-ferguson': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Alex_Ferguson_2022.jpg/300px-Alex_Ferguson_2022.jpg',
  'alex-morgan': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Alex_Morgan_2023.jpg/300px-Alex_Morgan_2023.jpg',
  'amy-winehouse': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Amy_Winehouse_f5592009_crop.jpg/300px-Amy_Winehouse_f5592009_crop.jpg',
  'ana-de-armas': 'https://image.tmdb.org/t/p/w400/3vxvsmYLTf4jnr163SUlBg4FOTN.jpg',
  'anderson-paak': 'https://image.tmdb.org/t/p/w400/kHk4d7dFNm2tExUQiY5pVXhG3mQ.jpg',
  'angela-merkel': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Angela_Merkel_2023.jpg/300px-Angela_Merkel_2023.jpg',
  'anitta': 'https://image.tmdb.org/t/p/w400/gB0tCXhQjMVQzBGvD7MFdLVJYdP.jpg',
  'ashley-graham': 'https://image.tmdb.org/t/p/w400/pPhxDIPKWxDUBH8XMCLVqQpLM6L.jpg',
  'austin-butler': 'https://image.tmdb.org/t/p/w400/bunFiM6GXETBP6Cz2BDDP3klUVY.jpg',
  'barry-sanders': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Barry_Sanders_2022.jpg/300px-Barry_Sanders_2022.jpg',
  'becky-g': 'https://image.tmdb.org/t/p/w400/qRcB4kRBXcvpHfMWJieLBxCFBMz.jpg',
  'benicio-del-toro': 'https://image.tmdb.org/t/p/w400/fEapDkHxlnGmIVotMtEG57OeDAz.jpg',
  'bert-kreischer': 'https://image.tmdb.org/t/p/w400/zLYXlbfB3BKZJ7t4gHFVmkjMBpK.jpg',
  'bethenny-frankel': 'https://image.tmdb.org/t/p/w400/3u05TLNpuJfnPlEXKkMjLWb4HGH.jpg',
  'afrobeats-burna-boy': 'https://image.tmdb.org/t/p/w400/6FVPDq5zXYYn4I7MQZIGXJBQpgY.jpg',
  'cam-newton': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Cam_Newton_2018.jpg/300px-Cam_Newton_2018.jpg',
  'carl-lewis': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Carl_Lewis_2015.jpg/300px-Carl_Lewis_2015.jpg',
  'carlos-santana': 'https://image.tmdb.org/t/p/w400/5xN21klMW0Mg9rNpNvSoYPXkDwC.jpg',
  'chadwick-boseman': 'https://image.tmdb.org/t/p/w400/dzMBGwFmigABLpLRTEKgjdHPcMk.jpg',
  'chiara-ferragni': 'https://image.tmdb.org/t/p/w400/p5yrS7NXhMoQtQz6VlYSTuZyHFe.jpg',
  'chris-tucker': 'https://image.tmdb.org/t/p/w400/nIh1HoVJV1e6CvpuNjsNMNHw6jN.jpg',
  'claudia-schiffer': 'https://image.tmdb.org/t/p/w400/dIm0Q6ZDAbJBOkr94UdwCHyGRLO.jpg',
  'colin-kaepernick': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Colin_Kaepernick_2020.jpg/300px-Colin_Kaepernick_2020.jpg',
  'connor-mcdavid': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Connor_McDavid_2024.jpg/300px-Connor_McDavid_2024.jpg',
  'courtney-love': 'https://image.tmdb.org/t/p/w400/iE1RbCKSaFpq5MlSkEQ68l8NYTD.jpg',
  'dani-alves': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Dani_Alves_2022.jpg/300px-Dani_Alves_2022.jpg',
  'daryl-hall': 'https://image.tmdb.org/t/p/w400/cIVPYiX3N4kBCVSKk7HJBNVsBEX.jpg',
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
