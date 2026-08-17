#!/usr/bin/env node
'use strict'
const fs = require('fs')

const CELEBS_PATH = 'public/data/celebs.json'
const PHOTOS_PATH = 'public/data/photosCache.json'

const celebs = JSON.parse(fs.readFileSync(CELEBS_PATH, 'utf8'))
const photos = JSON.parse(fs.readFileSync(PHOTOS_PATH, 'utf8'))

const IMGS = {
  real_estate: ['https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'],
  car: ['https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800', 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800'],
  art: ['https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800', 'https://images.unsplash.com/photo-1501472312651-726afe119ff1?w=800'],
  sports_team: ['https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800', 'https://images.unsplash.com/photo-1517747614396-d21a78b850e8?w=800'],
  business: ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800', 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800', 'https://images.unsplash.com/photo-1444653389962-8149286c578a?w=800'],
  island: ['https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=800', 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=800'],
  jet: ['https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800', 'https://images.unsplash.com/photo-1474302770737-173ee21bab63?w=800'],
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
  'bob-marley': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Bob-Marley.jpg/300px-Bob-Marley.jpg',
  'stevie-wonder': 'https://image.tmdb.org/t/p/w400/txKOo4nOPgIAEQAuK8LHHVcCiXL.jpg',
  'wayne-rooney': 'https://image.tmdb.org/t/p/w400/jG2Bnb5YmVqMn1ZGE5bqgOl4pDB.jpg',
  'blake-shelton': 'https://image.tmdb.org/t/p/w400/nmC8MCcQFfmGUJE6M7BH5j3FOPW.jpg',
  'harry-styles': 'https://image.tmdb.org/t/p/w400/sgZGFMSGHH4hpgRLDBw8Trs9DY7.jpg',
  'john-legend': 'https://image.tmdb.org/t/p/w400/fPkIzwAqH3wSAkYzSHHJGc3z0UW.jpg',
  'lil-baby': 'https://image.tmdb.org/t/p/w400/8PbYkA1q7pJEFzpGqkWRZJXqmjp.jpg',
  'michael-phelps': 'https://image.tmdb.org/t/p/w400/kBnM5xwi4kRNyvLYdHvjz5QR1yg.jpg',
  'nicki-minaj': 'https://image.tmdb.org/t/p/w400/jF8IXFqD8VChI1BnS4AiSBj2pMt.jpg',
  'prince-william': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Prince_William_2022.jpg/300px-Prince_William_2022.jpg',
  'trevor-noah': 'https://image.tmdb.org/t/p/w400/cbMNiEJkSBCEqO0AekJeVmjI5pq.jpg',
  'venus-williams': 'https://image.tmdb.org/t/p/w400/xhVQPTKr8lw5uRQc8sFnqwUQzbl.jpg',
  'dua-lipa': 'https://image.tmdb.org/t/p/w400/nkDBrXbkgR3UHPEw2HRiCJE6kJy.jpg',
  'gareth-bale': 'https://image.tmdb.org/t/p/w400/mOaJVQVaLk5RTGl23f9Km5vOlPH.jpg',
  'andy-murray': 'https://image.tmdb.org/t/p/w400/fZkpJvKb2T6uXjbTe7J8g8xvv4Y.jpg',
  'cindy-crawford': 'https://image.tmdb.org/t/p/w400/yCBQRE7bLCh0PRxJ3LoSkLo5T0Y.jpg',
  'cate-blanchett': 'https://image.tmdb.org/t/p/w400/clvGGILrAjhiZ8QiJ4TQJJQ1Gjn.jpg',
  'natalie-portman': 'https://image.tmdb.org/t/p/w400/9MKTJ3MQF7QOYKxqRDGqNAMPzUL.jpg',
  'zinedine-zidane': 'https://image.tmdb.org/t/p/w400/j5l7j2gHkSPZLJEYSeSfxe3Qd7E.jpg',
  'ronaldinho': 'https://image.tmdb.org/t/p/w400/bx5WI5jNIGbh7bvL8oiJHmMV4I4.jpg',
  'tony-parker': 'https://image.tmdb.org/t/p/w400/8G5aEE1DUFm2VBaI9VHiMMxEnzR.jpg',
  'tyra-banks': 'https://image.tmdb.org/t/p/w400/6UZd4IIDR84aYtHFvjJf4KD7rHV.jpg',
  'didier-drogba': 'https://image.tmdb.org/t/p/w400/l1VCWzJ12bJkBNNhM1V8ux0gHxl.jpg',
  'john-mcenroe': 'https://image.tmdb.org/t/p/w400/nY7RR3J7DlhH5Gk7QVaHaIzBKJH.jpg',
  'joel-osteen': 'https://image.tmdb.org/t/p/w400/o8Sj0TBWkPXO3Rb4E4MwCEqAXS2.jpg',
  'nile-rodgers': 'https://image.tmdb.org/t/p/w400/n5ztlxTBQh2n5AGgv4H2P2YCBM3.jpg',
  'pitbull': 'https://image.tmdb.org/t/p/w400/kXvpSYFZvTPGpBgJr3sX5cYf5VJ.jpg',
  'sean-combs': 'https://image.tmdb.org/t/p/w400/1eUJ9KnqxE9zCbLFETm7ItjXJt8.jpg',
  'freddie-mercury': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Freddie_Mercury_performing_in_New_Haven.jpg/300px-Freddie_Mercury_performing_in_New_Haven.jpg',
  'elvis-presley': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Elvis_Presley_promoting_Jailhouse_Rock.jpg/300px-Elvis_Presley_promoting_Jailhouse_Rock.jpg',
  'bruce-lee': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Bruce_Lee_1973.jpg/300px-Bruce_Lee_1973.jpg',
}

const ENRICHMENTS = {
  'bob-marley': {
    netWorth: 0.11,
    assets: [
      a('bob-marley', 1, 'business', 'Bob Marley Music Estate (Universal)', "The Bob Marley estate manages one of the most valuable music catalogs in the world — No Woman No Cry, One Love, Redemption Song, and 100+ songs regularly licensed for film, TV, and streaming.", 50, 'Universal Music 2024'),
      a('bob-marley', 2, 'business', 'Marley Coffee & Marley Brand', "The Marley family has built a consumer brand empire including Marley Coffee, House of Marley audio products, and Marley Apparel — generating $100M+ in annual revenue across categories.", 30, 'Forbes 2023'),
      a('bob-marley', 3, 'real_estate', 'Hope Road, Kingston (Museum)', "Bob Marley\'s home at 56 Hope Road in Kingston, Jamaica — now the Bob Marley Museum attracting 300,000+ visitors annually, one of the Caribbean\'s most visited cultural institutions.", 5, 'Jamaica Tourist Board 2024'),
    ],
  },
  'stevie-wonder': {
    netWorth: 0.11,
    assets: [
      a('stevie-wonder', 1, 'business', 'JOBETE Music Catalog (Motown)', "Stevie Wonder\'s extraordinary catalog — Superstition, Sir Duke, Higher Ground, Isn\'t She Lovely — represents one of Motown\'s most valuable songwriting legacies.", 30, 'Universal Music 2024'),
      a('stevie-wonder', 2, 'real_estate', 'Los Angeles Home', "Stevie\'s primary LA residence — where the musical genius has lived for decades, connecting him to the entertainment capital where his career has thrived since childhood.", 5, 'Property Records'),
      a('stevie-wonder', 3, 'business', 'Motown Records & Touring', "Wonder\'s ongoing touring activity and Motown legacy generate tens of millions annually — his classic catalog is consistently among the most licensed in popular music history.", 15, 'Billboard 2024'),
    ],
  },
  'wayne-rooney': {
    netWorth: 0.11,
    assets: [
      a('wayne-rooney', 1, 'real_estate', 'Cheshire Mansion, United Kingdom', "Rooney\'s primary UK home — a spectacular mansion in the affluent Prestbury village in Cheshire, featuring indoor pool, cinema room, and extensive grounds.", 8, 'UK Property Records'),
      a('wayne-rooney', 2, 'business', 'Football Manager & Punditry Career', "Following his playing career, Rooney has worked as a manager (Derby County, DC United, Birmingham) and pundit — building income through football management and media appearances.", 5, 'Sky Sports 2024'),
      a('wayne-rooney', 3, 'real_estate', 'Washington DC Home (Former)', "Wayne Rooney\'s American home during his time as captain and coach of DC United in MLS — maintaining his football presence in the US market.", 2, 'Property Records 2023'),
    ],
  },
  'blake-shelton': {
    netWorth: 0.1,
    assets: [
      a('blake-shelton', 1, 'real_estate', 'Tishomingo Ranch, Oklahoma', "Blake Shelton and Gwen Stefani\'s primary home — a large ranch in Tishomingo, Oklahoma near Shelton\'s home state roots, where they got married in 2021.", 5, 'OK Property Records'),
      a('blake-shelton', 2, 'business', 'Ole Red Restaurant & Bar, Nashville', "Shelton\'s country entertainment venue Ole Red on Lower Broadway in Nashville — expanded to multiple locations including Gatlinburg and Tishomingo, generating significant food & beverage revenue.", 10, 'Nashville Business 2024'),
      a('blake-shelton', 3, 'business', 'The Voice NBC (20+ Seasons)', "Shelton served as a coach on NBC\'s The Voice for its entire run through Season 23 — earning a reported $13M per season at peak, making him one of TV\'s highest-paid personalities.", 20, 'Hollywood Reporter 2023'),
    ],
  },
  'elvis-presley': {
    netWorth: 0.1,
    assets: [
      a('elvis-presley', 1, 'real_estate', 'Graceland Estate, Memphis', "Elvis Presley\'s iconic Graceland estate in Memphis, Tennessee — now one of the most visited homes in America with 500,000+ visitors annually and a massive entertainment complex. Owned by Authentic Brands Group.", 100, 'Authentic Brands 2024'),
      a('elvis-presley', 2, 'business', 'Elvis Presley Music Estate (Sony)', "The Elvis estate\'s music catalog — Hound Dog, Jailhouse Rock, Love Me Tender — remains one of rock\'s most valuable, generating $100M+ annually through Sony Music and worldwide licensing.", 100, 'Forbes 2024'),
      a('elvis-presley', 3, 'business', 'Elvis Brand & Licensing', "Elvis Presley Enterprises licenses the King\'s image, name, and likeness for merchandise, films, and commercial use worldwide — generating $50M+ annually for the Authentic Brands Group portfolio.", 50, 'Authentic Brands 2024'),
    ],
  },
  'freddie-mercury': {
    netWorth: 0.1,
    assets: [
      a('freddie-mercury', 1, 'business', 'Queen Music Catalog Estate', "Freddie Mercury\'s estate holds rights to his Queen catalog compositions — Bohemian Rhapsody, We Will Rock You, Don\'t Stop Me Now — which continue generating tens of millions annually.", 50, 'Universal Music 2024'),
      a('freddie-mercury', 2, 'real_estate', 'Garden Lodge, Kensington', "Freddie Mercury\'s beloved London home — Garden Lodge at Logan Place in Kensington, still owned by his estate and the site of devoted fan pilgrimages worldwide.", 15, 'London Property Records'),
      a('freddie-mercury', 3, 'business', 'Bohemian Rhapsody Film Royalties', "The 2018 biopic Bohemian Rhapsody grossed $900M+ worldwide and drove enormous catalog streaming increases — with ongoing royalties flowing to the Mercury estate through Universal Music.", 10, 'Fox / Universal 2023'),
    ],
  },
  'harry-styles': {
    netWorth: 0.1,
    assets: [
      a('harry-styles', 1, 'business', 'Erskine Records & Music Catalog', "Harry Styles\' own independent label Erskine Records — giving him full creative control over his music. His Harry\'s House album won Grammy Album of the Year 2023.", 30, 'Grammy / Columbia 2023'),
      a('harry-styles', 2, 'real_estate', 'North London Home', "Styles\' primary London home — a townhouse in the north London neighborhood near his Cheshire birthplace roots, offering privacy amid his superstar touring schedule.", 6, 'London Property Records'),
      a('harry-styles', 3, 'real_estate', 'Malibu Home, California', "Harry\'s California beach house used during US tours and his Hollywood foray into acting, including his role in Olivia Wilde\'s Don\'t Worry Darling (2022).", 6, 'Property Records'),
    ],
  },
  'john-legend': {
    netWorth: 0.1,
    assets: [
      a('john-legend', 1, 'real_estate', 'Beverly Hills Estate', "John Legend and Chrissy Teigen\'s primary California home — a spectacular Beverly Hills estate featuring an outdoor entertaining space worthy of the couple\'s status as social media royalty.", 17.5, 'Property Records 2021'),
      a('john-legend', 2, 'business', 'Get Lifted Film Company', "Legend\'s production company Get Lifted Film Co. produced underground documentaries and music-based content, as well as the Broadway musical \"Jitney\" and TV productions.", 10, 'Variety 2024'),
      a('john-legend', 3, 'business', 'EGOT Crown & Brand Value', "Legend is one of only 18 EGOT winners (Emmy, Grammy, Oscar, Tony) — a status that commands premium endorsement rates and global brand recognition far beyond his contemporaries.", 15, 'Forbes 2024'),
    ],
  },
  'nicki-minaj': {
    netWorth: 0.1,
    assets: [
      a('nicki-minaj', 1, 'real_estate', 'Los Angeles Mansion', "Nicki Minaj\'s primary California home — a lavish LA mansion featuring custom décor reflecting her bold aesthetic, used as a family base after the birth of her son.", 8, 'Property Records'),
      a('nicki-minaj', 2, 'business', 'Queen Radio / Beats 1', "Minaj hosted the Queen Radio show on Apple Music\'s Beats 1 — a major cultural platform reaching millions of fans and generating promotional leverage for her music releases.", 5, 'Apple Music 2024'),
      a('nicki-minaj', 3, 'business', 'Fendi Nicki Collab & Fashion IP', "Minaj\'s collaboration with Fendi, MAC Cosmetics, and her own Onika Beauty brand have generated tens of millions in fashion and beauty revenue throughout her career.", 10, 'Forbes 2023'),
    ],
  },
  'prince-william': {
    netWorth: 0.1,
    assets: [
      a('prince-william', 1, 'real_estate', 'Adelaide Cottage, Windsor', "The Prince and Princess of Wales\' primary English home — Adelaide Cottage on the Windsor Great Park estate, a modest 4-bedroom royal property they chose for family privacy.", 10, 'Royal Household 2022'),
      a('prince-william', 2, 'real_estate', 'Amner Hall, Norfolk', "William and Kate\'s Norfolk country home near Sandringham — a Georgian country house on the royal estate used for quiet family retreats and children\'s activities.", 7, 'Norfolk Property Records'),
      a('prince-william', 3, 'business', 'Duchy of Cornwall Inheritance', "William inherited the Duchy of Cornwall from King Charles on his accession — a vast portfolio of 130,000 acres generating £23M annually in agricultural and commercial income.", 700, 'Duchy of Cornwall 2023'),
    ],
  },
  'sean-combs': {
    netWorth: 0.1,
    assets: [
      a('sean-combs', 1, 'business', 'Bad Boy Entertainment Legacy', "Diddy founded Bad Boy Records in 1993 — launching Biggie Smalls, Mary J. Blige, and others. The catalog and Bad Boy brand generate ongoing royalty income.", 30, 'Sony Music 2024'),
      a('sean-combs', 2, 'real_estate', 'Star Island Estate, Miami', "Sean Combs\' spectacular Star Island waterfront estate in Miami — sold in 2023, formerly the site of his legendary White Parties.", 40, 'Property Records 2023'),
      a('sean-combs', 3, 'business', 'Revolt Media Network', "Combs co-founded Revolt — a Black-owned music TV network and digital media company focused on hip-hop and urban culture, valued at $300M+.", 50, 'Forbes 2023'),
    ],
  },
  'trevor-noah': {
    netWorth: 0.1,
    assets: [
      a('trevor-noah', 1, 'business', 'The Daily Show Legacy Income', "Trevor Noah hosted The Daily Show on Comedy Central for 7 years — generating $16M+ annually at peak and producing significant residual income through syndication and streaming.", 20, 'Variety 2023'),
      a('trevor-noah', 2, 'real_estate', 'New York City Apartment', "Noah\'s NYC home used during his Daily Show tenure — a Manhattan property allowing easy access to the Comedy Central studios.", 7, 'NYC Property Records'),
      a('trevor-noah', 3, 'business', 'Standup Comedy Tours & Netflix Specials', "Noah\'s standup tours and multiple Netflix specials (\"Son of Patricia,\" \"I Wish You Would\") represent his primary income post-Daily Show.", 10, 'Netflix / Pollstar 2024'),
    ],
  },
  'venus-williams': {
    netWorth: 0.095,
    assets: [
      a('venus-williams', 1, 'business', 'EleVen Activewear Brand', "Venus Williams founded EleVen — her performance activewear brand focusing on bold, colorful athletic fashion. The line blends her tennis passion with her interior design background.", 10, 'WWD 2024'),
      a('venus-williams', 2, 'business', 'V Starr Interior Design', "Venus\'s commercial interior design firm V Starr Interiors has worked on luxury hotels, spas, and commercial properties — a fully realized second career alongside tennis.", 5, 'Architectural Digest 2024'),
      a('venus-williams', 3, 'real_estate', 'Palm Beach Gardens Home', "Venus Williams\' Florida home near the USTA National Campus — befitting the 7-Grand-Slam champion and tennis icon who has maintained a Florida base throughout her career.", 4, 'FL Property Records'),
    ],
  },
  'dua-lipa': {
    netWorth: 0.09,
    assets: [
      a('dua-lipa', 1, 'business', 'Music Catalog & Future Nostalgia Tour', "Dua Lipa\'s Future Nostalgia album (2020) was the best-selling album by a female artist in two years. Her touring earnings and catalog royalties have rapidly built her fortune.", 20, 'RIAA / Pollstar 2024'),
      a('dua-lipa', 2, 'real_estate', 'London Home', "Dua\'s primary London residence — the British-Albanian pop star maintains strong UK roots through her London home base despite frequent global travel.", 5, 'London Property Records'),
      a('dua-lipa', 3, 'business', 'Radical Optimism Tour & Endorsements', "Her 2024 Radical Optimism album cycle and tour, plus major brand deals with Versace and YSL Beauty, represent her rapidly growing commercial empire.", 10, 'Billboard 2024'),
    ],
  },
  'gareth-bale': {
    netWorth: 0.115,
    assets: [
      a('gareth-bale', 1, 'business', 'Real Madrid Salary & Champions League Bonuses', "Bale earned €20M+ per season at Real Madrid over 9 years — plus Champions League bonuses from 4 titles. His career earnings exceeded $150M in salary alone.", 50, 'L\'Equipe / ESPN 2023'),
      a('gareth-bale', 2, 'real_estate', 'Cardiff Area Home, Wales', "Bale\'s primary Welsh home near Cardiff — the passionate Welshman maintained strong homeland connections and is now retired in Wales following his final season with LAFC.", 5, 'Welsh Property Records'),
      a('gareth-bale', 3, 'sports_team', 'Golf Investment & Golf Course Interest', "Bale\'s legendary passion for golf — including membership at Spain\'s top courses during his Madrid years — has extended to golf business investments and commercial partnerships.", 5, 'Golf Digest 2023'),
    ],
  },
  'andy-murray': {
    netWorth: 0.1,
    assets: [
      a('andy-murray', 1, 'real_estate', 'Oxshott Estate, Surrey', "Murray\'s primary UK home — a grand Surrey property in the exclusive Oxshott village, where he lives with wife Kim Sears and their four children.", 5, 'Surrey Property Records'),
      a('andy-murray', 2, 'business', 'Tennis Prize Money & Broadcasting', "Murray earned $65M+ in career prize money — third highest in tennis history. Post-retirement commentary and coaching provide ongoing income.", 20, 'ATP 2024'),
      a('andy-murray', 3, 'business', 'Battle of the Sexes Productions (Investor)', "Murray became a minority investor in Castore sportswear — a premium British sports brand expanding globally, reflecting his entrepreneurial ambitions beyond the court.", 5, 'Castore 2023'),
    ],
  },
  'cindy-crawford': {
    netWorth: 0.1,
    assets: [
      a('cindy-crawford', 1, 'real_estate', 'Malibu Home, California', "Cindy Crawford and Rande Gerber\'s primary California home — a beautiful Malibu compound where the supermodel couple has raised their children Kaia and Presley.", 8, 'Property Records'),
      a('cindy-crawford', 2, 'business', 'Casamigos Tequila (Gerber/Clooney)', "Crawford\'s husband Rande Gerber co-founded Casamigos Tequila with George Clooney and Mike Meldman — sold to Diageo for $1B in 2017. The family received significant proceeds.", 50, 'Bloomberg 2017'),
      a('cindy-crawford', 3, 'business', 'Meaningful Beauty Skincare', "Cindy Crawford\'s skincare brand Meaningful Beauty — developed with French dermatologist Dr. Jean-Louis Sebagh and marketed through infomercials — generates $100M+ in annual sales.", 20, 'Business Insider 2024'),
    ],
  },
  'cate-blanchett': {
    netWorth: 0.09,
    assets: [
      a('cate-blanchett', 1, 'real_estate', 'East Sussex Estate, UK', "Blanchett and husband Andrew Upton\'s primary UK home — a sprawling East Sussex estate near the English countryside, purchased when the couple relocated from Australia.", 10, 'UK Property Records'),
      a('cate-blanchett', 2, 'real_estate', 'Sydney Property, Australia', "Blanchett maintains Australian property connections — the actress grew up in Melbourne and has kept connections to her home country throughout her Hollywood career.", 3, 'Australian Property Records'),
      a('cate-blanchett', 3, 'business', 'Giorgio Armani & Manifesto Campaigns', "Blanchett\'s longstanding Armani Beauté and IWC Schaffhausen partnerships have generated $2M+ annually — complementing her extraordinarily rich film career including two Oscar wins.", 5, 'WWD 2024'),
    ],
  },
  'natalie-portman': {
    netWorth: 0.09,
    assets: [
      a('natalie-portman', 1, 'real_estate', 'Los Feliz Home, Los Angeles', "Portman and husband Benjamin Millepied\'s primary California home — a Los Feliz property in the arts-forward LA neighborhood connecting them to the film and dance communities.", 7, 'Property Records 2022'),
      a('natalie-portman', 2, 'business', 'Iconic Films & Harvard Psychology Degree', "Portman\'s film earnings (Black Swan, Thor franchise, Jackie) plus her intellectual brand value from her Harvard psychology degree command premium rates for endorsements and speaking.", 10, 'Forbes 2024'),
      a('natalie-portman', 3, 'business', 'Dior Brand Ambassador', "Portman\'s partnership with Dior — as the face of Miss Dior fragrance since 2011 — represents a premium endorsement generating several million per year.", 5, 'Dior 2024'),
    ],
  },
  'zinedine-zidane': {
    netWorth: 0.09,
    assets: [
      a('zinedine-zidane', 1, 'real_estate', 'La Moraleja Estate, Madrid', "Zidane\'s primary Spanish home in La Moraleja — the exclusive gated community north of Madrid popular with footballing royalty and business elites.", 8, 'Spanish Property Records'),
      a('zinedine-zidane', 2, 'business', 'Adidas ZZ Endorsement Legacy', "Zidane\'s lifetime Adidas partnership and the ZZ brand — the most decorated European footballer of his era continues earning from licensing and historic brand deals.", 15, 'Forbes 2024'),
      a('zinedine-zidane', 3, 'business', 'Real Madrid Coaching Income (3 UCL)', "As Real Madrid coach Zidane won 3 consecutive Champions League titles (2016-18) and 3 La Liga titles — earning €6M+ per year and commanding premium consulting rates in football.", 10, 'Real Madrid / ESPN 2024'),
    ],
  },
  'ronaldinho': {
    netWorth: 0.09,
    assets: [
      a('ronaldinho', 1, 'real_estate', 'Porto Alegre Penthouse', "Ronaldinho\'s primary Brazilian home — a penthouse in Porto Alegre, Rio Grande do Sul — his hometown where the \'Magic of Football\' was born.", 3, 'Brazilian Property Records'),
      a('ronaldinho', 2, 'business', 'Hawk Esports Team', "Ronaldinho co-owns the Hawk esports organization — joining the wave of football legends diversifying into the booming esports industry.", 5, 'Esports 2024'),
      a('ronaldinho', 3, 'business', 'Nike & Brand Legacy', "Ronaldinho\'s Nike partnership and ongoing brand legacy — his name and likeness commands significant licensing fees as one of football\'s most beloved figures despite post-career controversies.", 10, 'Forbes 2024'),
    ],
  },
  'tony-parker': {
    netWorth: 0.09,
    assets: [
      a('tony-parker', 1, 'sports_team', 'ASVEL Basket Lyon-Villeurbanne', "Parker owns and leads ASVEL — France\'s most successful basketball club, with Parker having won multiple French championships as owner since buying a stake in 2014.", 20, 'Eurobasket 2024'),
      a('tony-parker', 2, 'real_estate', 'Lyon Property, France', "Parker\'s primary home in Lyon, France — the city of his beloved ASVEL basketball club, where he has built his post-NBA business empire.", 3, 'French Property Records'),
      a('tony-parker', 3, 'business', 'TC Media Production Company', "Parker\'s French media production company TC Media develops sports content — reflecting his vision to grow European basketball\'s media profile and commercial footprint.", 5, 'French Media 2024'),
    ],
  },
  'tyra-banks': {
    netWorth: 0.09,
    assets: [
      a('tyra-banks', 1, 'business', 'Fierce Capital Management', "Tyra Banks\' production and investment company — responsible for America\'s Next Top Model (22 cycles) which she created, hosted, and produced. ANTM continues in syndication globally.", 20, 'Viacom / Forbes 2024'),
      a('tyra-banks', 2, 'business', 'ModelLand Experience', "Banks developed ModelLand — a planned fantasy entertainment experience combining theme park and model boot camp concepts, representing her vision for the future of modeling.", 5, 'Fashion Industry 2024'),
      a('tyra-banks', 3, 'real_estate', 'Los Angeles Home', "Tyra\'s primary California home — a LA residence befitting the pioneering supermodel who revolutionized the fashion industry and created one of TV\'s most enduring franchises.", 5, 'Property Records'),
    ],
  },
  'didier-drogba': {
    netWorth: 0.09,
    assets: [
      a('didier-drogba', 1, 'business', 'Didier Drogba Foundation', "Drogba\'s humanitarian foundation has built health clinics and schools across Côte d\'Ivoire — helping stop a civil war through his influence as the nation\'s most beloved icon.", 5, 'Drogba Foundation 2024'),
      a('didier-drogba', 2, 'real_estate', 'London Property', "Drogba\'s London home maintained from his legendary Chelsea years — the Ivorian striker spent his peak years in the Premier League and maintains UK connections.", 3, 'London Property Records'),
      a('didier-drogba', 3, 'business', 'African Premier League & Phoenix Rising', "Drogba has invested in African football development and was co-owner of Phoenix Rising FC in the USL — contributing to growing football infrastructure on two continents.", 5, 'USL / CAF 2023'),
    ],
  },
  'john-mcenroe': {
    netWorth: 0.1,
    assets: [
      a('john-mcenroe', 1, 'real_estate', 'Malibu Colony, California', "McEnroe\'s California home in the exclusive Malibu Colony — a beachfront community where he lives with wife Patty Smyth and his large blended family.", 10, 'Malibu Property Records'),
      a('john-mcenroe', 2, 'business', 'McEnroe Tennis Academy & Instruction', "McEnroe runs a tennis academy and provides instruction to top players — generating premium consulting income alongside his prolific tennis broadcasting career with ESPN and the BBC.", 5, 'Tennis 2024'),
      a('john-mcenroe', 3, 'art', 'Contemporary Art Gallery, NYC', "McEnroe founded an art gallery in Manhattan — his passion for contemporary art has made him a genuine figure in the New York art world, with an impressive private collection.", 5, 'Artnet 2024'),
    ],
  },
  'joel-osteen': {
    netWorth: 0.1,
    assets: [
      a('joel-osteen', 1, 'real_estate', 'River Oaks Mansion, Houston', "Osteen\'s primary Houston home in the ultra-exclusive River Oaks neighborhood — a 17,000 sq ft mansion valued at $10.5M, notorious for remaining closed during Hurricane Harvey relief efforts.", 10, 'Harris County Property 2022'),
      a('joel-osteen', 2, 'business', 'Lakewood Church Media Empire', "Osteen\'s Lakewood Church in Houston attracts 52,000+ weekly attendees, with his sermons broadcast to 7M+ viewers in 100 countries. The media empire includes book deals, TV rights, and speaking.", 50, 'SiriusXM / Forbes 2024'),
      a('joel-osteen', 3, 'business', 'Book Publishing (15+ Bestsellers)', "Osteen has authored 15+ New York Times bestsellers including Your Best Life Now and Become a Better You — with total book sales exceeding 10M copies, generating significant royalty income.", 20, 'Publisher\'s Weekly 2023'),
    ],
  },
  'bruce-lee': {
    netWorth: 0.1,
    assets: [
      a('bruce-lee', 1, 'business', 'Bruce Lee Estate IP Licensing', "The Bruce Lee estate — managed by his daughter Shannon Lee — licenses his image, martial arts philosophy, and film rights worldwide. His likeness appears in countless video games, films, and merchandise.", 30, 'BruceLeeFdn 2024'),
      a('bruce-lee', 2, 'business', 'Enter the Dragon Film Royalties', "Lee\'s definitive film Enter the Dragon (1973) remains one of martial arts cinema\'s most enduring classics — generating ongoing licensing and digital distribution income for his estate.", 10, 'Warner Bros 2024'),
      a('bruce-lee', 3, 'business', 'Jeet Kune Do Brand & Schools', "Bruce Lee\'s Jeet Kune Do martial arts system is taught in schools worldwide, with the estate receiving licensing fees from certified schools and instructional materials.", 5, 'JKD Foundation 2024'),
    ],
  },
  'nile-rodgers': {
    netWorth: 0.1,
    assets: [
      a('nile-rodgers', 1, 'business', 'CHIC Catalog & Daft Punk Royalties', "Nile Rodgers co-wrote Le Freak, Good Times, and hundreds more — plus produced Daft Punk\'s Get Lucky which earned him $5M+ in royalties. His production catalog is one of pop\'s most valuable.", 40, 'ASCAP 2024'),
      a('nile-rodgers', 2, 'business', 'We Are Family Foundation', "Rodgers\' We Are Family Foundation — inspired by his CHIC classic — promotes cultural diversity and inclusion. While charitable, the high-profile foundation elevates his commercial brand.", 3, 'Foundation 2024'),
      a('nile-rodgers', 3, 'real_estate', 'Greenwich, Connecticut Home', "Rodgers\' primary Connecticut residence — maintaining his East Coast roots while producing albums for David Bowie, Diana Ross, Madonna, and Daft Punk from his home studio.", 3, 'CT Property Records'),
    ],
  },
  'pitbull': {
    netWorth: 0.1,
    assets: [
      a('pitbull', 1, 'business', 'Pitbull\'s Music Label & Entertainment', "Pitbull founded Mr. 305 / Polo Grounds Music and has massive global distribution through Sony. His music generated 80M+ song sales and his catalog is one of Latin pop\'s most commercially powerful.", 30, 'Forbes 2024'),
      a('pitbull', 2, 'real_estate', 'Miami Home', "Pitbull\'s primary Miami residence — the Cuban-American rapper is deeply connected to Miami\'s Latin community and culture that shaped his identity and music.", 5, 'FL Property Records'),
      a('pitbull', 3, 'business', 'SLAM Miami Charter Schools', "Pitbull founded the SLAM (Sports Leadership and Management) charter school network in Miami and Atlanta — giving him significant goodwill and civic platform.", 5, 'SLAM Schools 2024'),
    ],
  },
  'michael-phelps': {
    netWorth: 0.1,
    assets: [
      a('michael-phelps', 1, 'real_estate', 'Paradise Valley Home, Arizona', "Phelps\' primary Arizona home — a Paradise Valley property near Scottsdale, where he lives with wife Nicole and their children.", 5, 'AZ Property Records'),
      a('michael-phelps', 2, 'business', 'MP Swimming & Endorsements', "Phelps\' MP brand through Under Armour and Speedo — 28 Olympic medals make him the most decorated Olympian ever, commanding premium lifetime endorsement rates.", 30, 'Forbes 2024'),
      a('michael-phelps', 3, 'business', 'Michael Phelps Foundation', "Phelps\' IM (Imagine, Inspire, Motivate) Foundation — focused on youth swimming access and mental health advocacy, reflecting his own public battle with depression and anxiety.", 3, 'MichaelPhelpsFoundation.org 2024'),
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
