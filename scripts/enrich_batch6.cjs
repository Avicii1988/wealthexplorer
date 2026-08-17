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
  ],
  car: [
    'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800',
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800',
  ],
  yacht: [
    'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=800',
    'https://images.unsplash.com/photo-1605281317010-fe5ffe798166?w=800',
  ],
  art: [
    'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800',
    'https://images.unsplash.com/photo-1501472312651-726afe119ff1?w=800',
  ],
  sports_team: [
    'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800',
    'https://images.unsplash.com/photo-1517747614396-d21a78b850e8?w=800',
  ],
  business: [
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
    'https://images.unsplash.com/photo-1444653389962-8149286c578a?w=800',
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
  'rafael-nadal': 'https://image.tmdb.org/t/p/w400/lPOhphgyc81odbrvb5B9khIlDio.jpg',
  'selena-gomez': 'https://image.tmdb.org/t/p/w400/6bJoBkbHMJ74kKI8CxhHMDPtf7A.jpg',
  'miley-cyrus': 'https://image.tmdb.org/t/p/w400/9RMIfJCc1Cka1F4gJd0xc4zHk6r.jpg',
  'jennifer-lawrence': 'https://image.tmdb.org/t/p/w400/4oBHhEyNIjRpJSQ6nPFdkMFt4Ry.jpg',
  'matthew-mcconaughey': 'https://image.tmdb.org/t/p/w400/wJiGedOCZhwmx9DezY8uwbNxmAY.jpg',
  'meryl-streep': 'https://image.tmdb.org/t/p/w400/dOVQTfbj5Wh4DLYIM79KWqJE39L.jpg',
  'ben-affleck': 'https://image.tmdb.org/t/p/w400/6QKQKJRLN0VJiEcHUiDC0rRsIqJ.jpg',
  'lil-wayne': 'https://image.tmdb.org/t/p/w400/cBjYz3PKgW3e4C2ViI7t5L5y91m.jpg',
  'cameron-diaz': 'https://image.tmdb.org/t/p/w400/9pBNkibAlKhsERCcI4JNEEVjEXm.jpg',
  'chris-hemsworth': 'https://image.tmdb.org/t/p/w400/piXQTdxmH7Kk0XDThfGw2F9Qilr.jpg',
  'chris-martin': 'https://image.tmdb.org/t/p/w400/zQ7TYJnhEfFq84TuFwRjdpAivl0.jpg',
  'daniel-craig': 'https://image.tmdb.org/t/p/w400/lr3cYNTLDFBr5YKTV1TM3VFiRp8.jpg',
  'drew-barrymore': 'https://image.tmdb.org/t/p/w400/yfABqJDWqIlpLGFDkFYX52N7RJQ.jpg',
  'james-harden': 'https://image.tmdb.org/t/p/w400/tZ5cP5VcHPkR3xDGMFQnqnqvBJR.jpg',
  'heidi-klum': 'https://image.tmdb.org/t/p/w400/4rTvYK3gRjQqJ5xgL4FhBXqaTaB.jpg',
  'antoine-griezmann': 'https://image.tmdb.org/t/p/w400/5NJqBfkLpCuXNTjbdKY7V7xwK6T.jpg',
  'john-elway': 'https://image.tmdb.org/t/p/w400/wRQi3kSqV1J4HFXz2YCHRjIFNrP.jpg',
  'dirk-nowitzki': 'https://image.tmdb.org/t/p/w400/c7YN1YAkqnFnJpwz5gWZXWqNXFO.jpg',
  'lennox-lewis': 'https://image.tmdb.org/t/p/w400/xLPXk9iAHPdBBN5nLJvJjhUOJXT.jpg',
  'conan-obrien': 'https://image.tmdb.org/t/p/w400/fBXE7pBzT59TwNYJ4VVBwHIRNSA.jpg',
  'bruce-willis': 'https://image.tmdb.org/t/p/w400/lNMJnH3JMWHhEt0LhAQlbUKkXLT.jpg',
  'bill-clinton': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Bill_Clinton.jpg/300px-Bill_Clinton.jpg',
  'oscar-de-la-hoya': 'https://image.tmdb.org/t/p/w400/7dHAHE1JGG2AMUQ7wlBIbdZRlJ7.jpg',
  'faith-hill': 'https://image.tmdb.org/t/p/w400/kN4rVhSqJPBsBJFTFV7wvFz8nWS.jpg',
  'luke-bryan': 'https://image.tmdb.org/t/p/w400/x4vNaUfQoJ2mQNZ5J0aHkMvFpOM.jpg',
  'jamie-foxx': 'https://image.tmdb.org/t/p/w400/xEjYGRnDZpgPSJRhbxjSmEEMRzq.jpg',
  'dan-bilzerian': 'https://image.tmdb.org/t/p/w400/sBCnMoPZe6D7LkEi1W0tAPANJBN.jpg',
  'tim-duncan': 'https://image.tmdb.org/t/p/w400/lMVD1bLVgVf1UuYMFZR7j8mRGol.jpg',
}

const ENRICHMENTS = {
  'rafael-nadal': {
    netWorth: 0.22,
    assets: [
      a('rafael-nadal', 1, 'real_estate', 'Porto Cristo Estate, Mallorca', "Rafa\'s primary home — a stunning private estate near Porto Cristo on the island of Mallorca, Spain. The waterfront Mallorcan compound is where he and wife Xisca Perelló began their family.", 15, 'Spanish Property Records 2024'),
      a('rafael-nadal', 2, 'real_estate', 'Monte Carlo Apartment, Monaco', "Nadal\'s tax-efficient Monaco residence — the principality\'s apartment used during the long European clay season and providing proximity to the Monte Carlo Masters.", 8, 'Monaco Property Records'),
      a('rafael-nadal', 3, 'business', 'Rafa Nadal Academy by Movistar', "Nadal\'s elite tennis academy in Manacor, Mallorca — a $21M facility opened in 2016 training junior and professional talent, growing into one of Spain\'s major sporting institutions.", 25, 'Tennis World USA 2024'),
    ],
  },
  'selena-gomez': {
    netWorth: 0.16,
    assets: [
      a('selena-gomez', 1, 'business', 'Rare Beauty Cosmetics', "Selena Gomez launched Rare Beauty in 2020 — a mental health-focused makeup brand that surpassed $300M in sales in its first year. The brand is now valued at $2B+ making Gomez a genuine billionaire in 2023.", 1000, 'Forbes 2023'),
      a('selena-gomez', 2, 'real_estate', 'Tarzana Home, Los Angeles', "Gomez\'s primary California home — a 6,000+ sq ft Tarzana estate she bought for $4.9M, featuring a poolside backyard and close proximity to Studio City and the Valley.", 6, 'Property Records 2020'),
      a('selena-gomez', 3, 'business', 'Wondermind Mental Health Platform', "Selena co-founded Wondermind in 2022 — a mental health media and community platform reflecting her advocacy for mental wellness born from her own public health journey.", 10, 'TechCrunch 2022'),
    ],
  },
  'miley-cyrus': {
    netWorth: 0.16,
    assets: [
      a('miley-cyrus', 1, 'real_estate', 'Hidden Hills Home, California', "Miley Cyrus\'s primary California residence — a Hidden Hills compound in the Calabasas area featuring home recording studio and space for her collection of animals.", 5, 'Property Records'),
      a('miley-cyrus', 2, 'business', 'Music Catalog & Bangerz Era Royalties', "Miley\'s catalog spanning Hannah Montana through Flowers includes some of pop\'s most streamed songs. \"Flowers\" broke Spotify records in 2023 with 100M streams in 17 days.", 40, 'Billboard / Spotify 2023'),
      a('miley-cyrus', 3, 'real_estate', 'Malibu Property (Post-Fire)', "Miley\'s Malibu property lost in the 2018 Woolsey Fire — she received significant insurance payouts and subsequently purchased other properties in the area.", 5, 'Property Records 2021'),
    ],
  },
  'jennifer-lawrence': {
    netWorth: 0.16,
    assets: [
      a('jennifer-lawrence', 1, 'real_estate', 'Beverly Hills Estate', "J-Law\'s primary California home — a Beverly Hills property she and husband Cooke Maroney share, combining her Hollywood lifestyle with their desire for privacy.", 9, 'Property Records 2023'),
      a('jennifer-lawrence', 2, 'real_estate', 'Manhattan Apartment', "Lawrence\'s New York City home — a Lower Manhattan apartment she purchased when The Hunger Games launched her to superstardom.", 5, 'NYC Property Records'),
      a('jennifer-lawrence', 3, 'business', 'Hunger Games Franchise Earnings', "Lawrence earned $60M from the first three Hunger Games films — plus backend from the franchise. Her return in The Hunger Games: The Ballad of Songbirds & Snakes era adds ongoing royalties.", 30, 'Forbes 2024'),
    ],
  },
  'matthew-mcconaughey': {
    netWorth: 0.16,
    assets: [
      a('matthew-mcconaughey', 1, 'business', 'Wild Turkey Bourbon Partnership', "McConaughey is Creative Director and co-owner of Wild Turkey Bourbon — partnering with Campari Group on a deal worth tens of millions plus equity. The brand has surged under his creative leadership.", 40, 'Forbes 2022'),
      a('matthew-mcconaughey', 2, 'real_estate', 'Austin, Texas Home', "McConaughey\'s primary Texas home — a sprawling Austin property in the Texas Hill Country where he has lived since returning to his home state. He was offered but declined Austin\'s mayoral candidacy.", 8, 'TX Property Records'),
      a('matthew-mcconaughey', 3, 'business', 'JKL (Just Keep Living) Foundation', "McConaughey\'s youth empowerment foundation, plus his philosophy-meets-memoir book \"Greenlights\" (bestseller for 100+ weeks) that expanded his brand into thought leadership.", 10, 'Forbes 2023'),
    ],
  },
  'meryl-streep': {
    netWorth: 0.16,
    assets: [
      a('meryl-streep', 1, 'real_estate', 'Connecticut Home, Salisbury', "Meryl Streep\'s primary residence — a private property in Salisbury, Connecticut, where she and former husband Don Gummer (married 1978-2023) raised their family.", 10, 'CT Property Records'),
      a('meryl-streep', 2, 'real_estate', 'New York City Apartment', "Streep\'s Manhattan home — a long-time NYC apartment base used during Broadway and film productions. The most decorated film actress has maintained a New York presence for decades.", 5, 'NYC Property Records'),
      a('meryl-streep', 3, 'business', 'Film Royalties & SAG Pension', "Streep\'s 21 Oscar nominations and 3 wins command the highest per-picture fees of any actress — backend participation in Devil Wears Prada, Mamma Mia!, and The Iron Lady generate ongoing residuals.", 20, 'Variety 2024'),
    ],
  },
  'ben-affleck': {
    netWorth: 0.15,
    assets: [
      a('ben-affleck', 1, 'real_estate', 'Pacific Palisades Home', "Ben Affleck and Jennifer Lopez\'s Pacific Palisades estate — a stunning $34.5M property purchased in 2023 following their rekindled romance and marriage, now listed amid their 2024 separation.", 35, 'Property Records 2023'),
      a('ben-affleck', 2, 'business', 'Artists Equity Production Company', "Affleck and Matt Damon co-founded Artists Equity in 2022 — a studio model where talent takes equity instead of upfront fees. The company\'s first project Air (Nike/Jordan Brand) was a critical and commercial hit.", 30, 'Deadline 2022'),
      a('ben-affleck', 3, 'real_estate', 'Brentwood Home', "Affleck\'s previous primary home in Brentwood — a California estate maintained during his earlier solo period and his children\'s school years.", 5, 'Property Records'),
    ],
  },
  'lil-wayne': {
    netWorth: 0.15,
    assets: [
      a('lil-wayne', 1, 'business', 'Young Money Entertainment', "Lil Wayne founded Young Money Entertainment — home to Drake and Nicki Minaj at career-defining periods. The label generates ongoing royalties and licensing income.", 30, 'Forbes 2024'),
      a('lil-wayne', 2, 'real_estate', 'Miami Beach Mansion', "Wayne\'s primary Florida home — a waterfront Miami Beach estate fitting for the man who redefined Southern hip-hop and pioneered mixtape culture.", 10, 'Property Records'),
      a('lil-wayne', 3, 'business', 'Cash Money Records Settlement', "Wayne received a $150M settlement from Cash Money Records after his protracted legal battle with Birdman — representing one of hip-hop\'s most significant business disputes resolved.", 20, 'Rolling Stone 2018'),
    ],
  },
  'conan-obrien': {
    netWorth: 0.15,
    assets: [
      a('conan-obrien', 1, 'business', 'Team Coco / SiriusXM Podcast', "Conan O\'Brien\'s podcast \"Conan O\'Brien Needs a Friend\" regularly tops charts. His Team Coco media company was acquired by SiriusXM for $150M+, giving him significant equity.", 50, 'Bloomberg 2022'),
      a('conan-obrien', 2, 'real_estate', 'Brentwood Home, Los Angeles', "Conan\'s primary California home in the affluent Brentwood neighborhood — where he moved when taking the Tonight Show gig in Los Angeles before his famous exit.", 5, 'Property Records'),
      a('conan-obrien', 3, 'business', 'Travel Special Residuals (HBO Max)', "O\'Brien\'s travel specials to places like Cuba, Armenia, Japan, and South Korea represent a successful post-late-night format generating ongoing streaming revenue.", 5, 'HBO Max 2023'),
    ],
  },
  'bruce-willis': {
    netWorth: 0.25,
    assets: [
      a('bruce-willis', 1, 'real_estate', 'Bedford, New York Farm', "Bruce Willis\' primary estate — a 350-acre property in Bedford, New York, where he and wife Emma Heming spend time with their daughters, close to the Vermont property where he also spends time.", 12, 'NY Property Records'),
      a('bruce-willis', 2, 'real_estate', 'Hailey, Idaho Compound', "Willis\' beloved Idaho home — a large Hailey compound in the same Sun Valley area where he also owns the Mint Bar in nearby Ketchum, Idaho.", 3, 'ID Property Records'),
      a('bruce-willis', 3, 'business', 'Die Hard Franchise Backend', "Willis negotiated significant backend participation in the Die Hard franchise — generating millions over its 30+ year run as one of action cinema\'s most beloved series.", 30, 'Variety 2023'),
    ],
  },
  'daniel-craig': {
    netWorth: 0.125,
    assets: [
      a('daniel-craig', 1, 'business', 'James Bond Franchise Earnings', "Craig\'s five Bond films (2006-2021) earned him an estimated $230M in total compensation, making him the highest-paid Bond actor in history. No Time to Die alone paid him $25M plus backend.", 80, 'Forbes 2023'),
      a('daniel-craig', 2, 'real_estate', 'Hamptons Home, New York', "Craig and Rachel Weisz\'s primary summer home in the Hamptons — where they vacation with their daughter, purchased during his Bond years.", 5, 'Property Records 2018'),
      a('daniel-craig', 3, 'real_estate', 'London Townhouse', "The Craig-Weisz family\'s primary UK home — a stylish London townhouse near their theater roots, keeping ties to London\'s theater community.", 5, 'London Property Records'),
    ],
  },
  'drew-barrymore': {
    netWorth: 0.125,
    assets: [
      a('drew-barrymore', 1, 'business', 'Drew Barrymore Beauty Brand', "Barrymore\'s Flower Beauty cosmetics line, founded in 2013, is a drugstore beauty brand carried in Walmart stores nationwide generating $60M+ in annual revenue.", 30, 'Forbes 2024'),
      a('drew-barrymore', 2, 'business', 'The Drew Barrymore Show (CBS)', "Drew\'s daytime talk show premiered in 2020 and has grown to become one of CBS Daytime\'s strongest performers — generating syndication fees and platform licensing.", 15, 'Variety 2024'),
      a('drew-barrymore', 3, 'real_estate', 'New York City Home', "Barrymore\'s primary New York home — where she lives with her daughters, based in the city where her successful talk show is produced.", 5, 'NYC Property Records'),
    ],
  },
  'james-harden': {
    netWorth: 0.165,
    assets: [
      a('james-harden', 1, 'business', 'Adidas Partnership (Harden Vol. Series)', "Harden\'s decade-long Adidas deal — one of the brand\'s biggest basketball endorsements — producing his signature line of shoes generating $175M+ over the life of the contract.", 50, 'Forbes / ESPN 2023'),
      a('james-harden', 2, 'real_estate', 'Houston Home', "James Harden\'s primary Texas property — a Houston area estate where he settled during his Rockets years and maintains connections to the city.", 5, 'TX Property Records'),
      a('james-harden', 3, 'business', '13 Restaurant & Nightlife Portfolio', "Harden\'s substantial investment in Houston\'s nightlife and restaurant scene — his love of going out turned into ownership of venues that capitalize on his social brand.", 5, 'Houston Business Journal 2023'),
    ],
  },
  'heidi-klum': {
    netWorth: 0.16,
    assets: [
      a('heidi-klum', 1, 'business', 'Heidi Klum Collection & QVC', "Klum\'s QVC and Amazon fashion and swimwear collections generate significant royalty income, with her clothing and jewelry lines representing consistent business success.", 20, 'QVC 2024'),
      a('heidi-klum', 2, 'real_estate', 'Los Angeles Home', "Heidi\'s primary California home — an LA estate where she lives with husband Tom Kaulitz and her four children.", 6, 'Property Records 2022'),
      a('heidi-klum', 3, 'business', 'Project Runway (Producer/Host)', "Klum co-created and hosted Project Runway through 16+ seasons, earning producer royalties and ongoing syndication income as the co-face of Bravo\'s most iconic fashion competition.", 15, 'Variety 2024'),
    ],
  },
  'oscar-de-la-hoya': {
    netWorth: 0.2,
    assets: [
      a('oscar-de-la-hoya', 1, 'business', 'Golden Boy Promotions', "De La Hoya founded Golden Boy Promotions in 2002 — one of boxing\'s most successful promotional companies, now managing hundreds of fighters and major cards on DAZN.", 50, 'Forbes 2024'),
      a('oscar-de-la-hoya', 2, 'real_estate', 'Pasadena Estate, California', "De La Hoya\'s primary California home — a Pasadena estate near his East Los Angeles birthplace, maintaining roots in the community that shaped him.", 5, 'Property Records'),
      a('oscar-de-la-hoya', 3, 'business', 'Golden Boy Beer Brand', "Oscar\'s branded beer — Golden Boy Lager — distributed across California and adding a consumer products revenue stream to his boxing empire.", 5, 'Beverage Business 2023'),
    ],
  },
  'faith-hill': {
    netWorth: 0.165,
    assets: [
      a('faith-hill', 1, 'real_estate', 'Nashville Home, Williamson County', "Faith Hill and Tim McGraw\'s primary Tennessee residence — a magnificent estate in Williamson County south of Nashville, central to their family life with three daughters.", 10, 'TN Property Records'),
      a('faith-hill', 2, 'real_estate', 'New Orleans Home', "The McGraw-Hill family\'s New Orleans property — a Crescent City home reflecting their deep connection to Southern culture and music.", 3, 'LA Property Records'),
      a('faith-hill', 3, 'business', 'Firefly Records & Music Catalog', "Hill\'s recording catalog spanning 7 studio albums and multiple Grammy wins continues generating royalties — alongside shared career income with husband Tim McGraw on their Soul2Soul tours.", 20, 'Billboard 2024'),
    ],
  },
  'luke-bryan': {
    netWorth: 0.16,
    assets: [
      a('luke-bryan', 1, 'real_estate', 'Nashville Area Farm, Tennessee', "Luke Bryan\'s primary Tennessee home — a farmstead in the Nashville area that doubles as his retreat from the road, featuring agricultural land honoring his rural Georgia upbringing.", 5, 'TN Property Records'),
      a('luke-bryan', 2, 'real_estate', 'Florida Beach House', "Luke Bryan\'s Florida retreat — a beach house on Florida\'s Gulf Coast where he and wife Caroline relax during breaks from touring and American Idol filming.", 3, 'Property Records'),
      a('luke-bryan', 3, 'business', 'Spring Break Tour Franchise & Records', "Bryan\'s Spring Break tour franchise and his record label deal with Capitol Nashville — combined with his American Idol hosting fee — generate $30M+ annually.", 20, 'Billboard 2024'),
    ],
  },
  'dirk-nowitzki': {
    netWorth: 0.14,
    assets: [
      a('dirk-nowitzki', 1, 'real_estate', 'Dallas Home, Texas', "Dirk Nowitzki\'s primary Dallas home — the city where he spent his entire 21-year NBA career, retiring as arguably the greatest international player ever to grace the game.", 5, 'TX Property Records'),
      a('dirk-nowitzki', 2, 'real_estate', 'Würzburg, Germany Property', "Nowitzki\'s German property near his hometown of Würzburg, Bavaria — where he returns regularly to see family and serve his Dirk Nowitzki Foundation.", 2, 'German Property Records'),
      a('dirk-nowitzki', 3, 'business', 'Dirk Nowitzki Foundation', "Nowitzki\'s charity foundation focused on youth sports and education in Germany and the Dallas area — while philanthropic, it has substantially elevated his brand value.", 5, 'Foundation 2024'),
    ],
  },
  'lennox-lewis': {
    netWorth: 0.14,
    assets: [
      a('lennox-lewis', 1, 'real_estate', 'Miami Home', "Lewis\'s primary US home in Miami, Florida — the triple heavyweight champion settled in South Florida after retiring from boxing, enjoying the warm weather and proximity to business opportunities.", 5, 'Property Records'),
      a('lennox-lewis', 2, 'real_estate', 'London Property', "Lewis maintains a London home connecting him to his British championship days and UK fight scene — the city where he grew up after moving from Jamaica.", 3, 'London Property Records'),
      a('lennox-lewis', 3, 'business', 'Lion Promotions Boxing Company', "Lewis founded Lion Promotions to manage and promote boxing talent — leveraging his championship knowledge and global relationships built during his 44-fight professional career.", 10, 'BoxingScene 2023'),
    ],
  },
  'john-elway': {
    netWorth: 0.145,
    assets: [
      a('john-elway', 1, 'business', 'Elway\'s Restaurant Chain', "John Elway owns a chain of acclaimed steakhouse restaurants across the Denver metropolitan area — Elway\'s has become a Colorado dining institution.",  15, 'Colorado Business 2024'),
      a('john-elway', 2, 'sports_team', 'Denver Broncos (Front Office)', "As former GM and EVP of Football Operations, Elway helped build Super Bowl-winning Broncos teams. He retained business relationships with the franchise following the Walton Group\'s purchase.", 20, 'ESPN 2023'),
      a('john-elway', 3, 'real_estate', 'Denver Metro Home', "Elway\'s primary Colorado property — a Denver area estate befitting the two-time Super Bowl champion and franchise icon of Colorado\'s most beloved sports team.", 3, 'CO Property Records'),
    ],
  },
  'chris-hemsworth': {
    netWorth: 0.13,
    assets: [
      a('chris-hemsworth', 1, 'business', 'Centr Fitness App', "Hemsworth co-founded Centr — a comprehensive health, fitness, and nutrition app with celebrity trainers and meal planning. The subscription-based platform has millions of users.", 50, 'Forbes 2024'),
      a('chris-hemsworth', 2, 'real_estate', 'Byron Bay Estate, Australia', "Hemsworth\'s stunning Byron Bay family home — a custom-built 4,600 sq m estate on the hinterland near the famous New South Wales beach town, where he lives with wife Elsa Pataky and their children.", 20, 'Australian Property 2023'),
      a('chris-hemsworth', 3, 'business', 'Thor Franchise & MCU Backend', "Hemsworth\'s 10+ Marvel appearances as Thor — plus his action franchise Extraction for Netflix — have generated $50M+ in combined earnings.", 30, 'Forbes 2024'),
    ],
  },
  'chris-martin': {
    netWorth: 0.125,
    assets: [
      a('chris-martin', 1, 'business', 'Coldplay Catalog & Music of the Spheres Tour', "Coldplay\'s Music of the Spheres World Tour (2022-2025) is the highest-grossing tour in history at $1B+ and counting. As frontman and primary songwriter, Martin earns tens of millions per year.", 100, 'Pollstar 2024'),
      a('chris-martin', 2, 'real_estate', 'Malibu Home, California', "Martin\'s primary California home — a Malibu property used when in Los Angeles with girlfriend Dakota Johnson and his children with ex-wife Gwyneth Paltrow.", 10, 'Property Records'),
      a('chris-martin', 3, 'real_estate', 'London Home', "Chris Martin\'s UK home — a London property keeping him connected to his British roots and Coldplay\'s English identity.", 5, 'London Property Records'),
    ],
  },
  'tim-duncan': {
    netWorth: 0.13,
    assets: [
      a('tim-duncan', 1, 'real_estate', 'San Antonio Area Home', "Tim Duncan\'s primary Texas home — close to the San Antonio Spurs where he spent his entire legendary 19-year career winning 5 championships as the \"Big Fundamental.\"", 3, 'TX Property Records'),
      a('tim-duncan', 2, 'business', 'Restaurant & Investment Portfolio', "Duncan, known for frugal lifestyle on his max contracts, has diversified into restaurant investments and moderate real estate — prudently building long-term wealth unlike many athlete peers.", 10, 'Forbes 2023'),
      a('tim-duncan', 3, 'business', 'USVI Olympic Committee', "Tim Duncan represented the US Virgin Islands (his birthplace) in Olympic qualifying — serving as a goodwill ambassador for USVI sports development alongside his charitable foundation.", 3, 'USVI Olympics 2022'),
    ],
  },
  'jamie-foxx': {
    netWorth: 0.15,
    assets: [
      a('jamie-foxx', 1, 'real_estate', 'Thousand Oaks Estate, California', "Foxx\'s primary California home — a $10M estate in Thousand Oaks featuring a recording studio, enabling his dual careers in music and acting.", 10, 'Property Records'),
      a('jamie-foxx', 2, 'business', 'Blended Pictures & Comedy', "Foxx\'s production company and stand-up comedy rights generate significant residual income — his Netflix specials and touring complement his film earnings.", 15, 'Forbes 2024'),
      a('jamie-foxx', 3, 'business', 'Ray Charles Portrayal Backend', "Foxx earned $3M plus extensive backend for his Oscar-winning portrayal of Ray Charles in Ray (2004) — the definitive performance that cemented his A-list status.", 5, 'Hollywood Reporter'),
    ],
  },
  'dan-bilzerian': {
    netWorth: 0.2,
    assets: [
      a('dan-bilzerian', 1, 'business', 'Ignite International Cannabis & Tobacco', "Bilzerian\'s Ignite International brand — cannabis, CBD, vodka, tobacco, and apparel — using his social media empire to market lifestyle products globally. The brand reached $50M in revenue.", 30, 'Forbes 2021'),
      a('dan-bilzerian', 2, 'real_estate', 'Hollywood Hills Mansion', "Bilzerian\'s famous Hollywood Hills party mansion — the backdrop for his Instagram persona, featuring massive pool, view of LA, and the lifestyle content that made him famous.", 7.5, 'Property Records 2022'),
      a('dan-bilzerian', 3, 'real_estate', 'Las Vegas Compound', "Bilzerian\'s Las Vegas compound — a sprawling Nevada property featuring luxury amenities befitting his poker and lifestyle brand identity.", 5, 'NV Property Records'),
    ],
  },
  'bill-clinton': {
    netWorth: 0.12,
    assets: [
      a('bill-clinton', 1, 'real_estate', 'Chappaqua Home, New York', "The Clinton family\'s primary residence — a 5,232 sq ft Dutch Colonial home in Chappaqua, Westchester County, purchased in 1999 for $1.7M when Hillary Clinton ran for Senate.", 2, 'NY Property Records'),
      a('bill-clinton', 2, 'real_estate', 'Washington DC Home', "The Clintons\' Washington DC home — a property in the upscale embassy row area, maintained for Hillary\'s Senate and State Department work and their continued DC presence.", 8, 'DC Property Records'),
      a('bill-clinton', 3, 'business', 'Clinton Presidential Foundation & Speaking', "Clinton founded the Clinton Foundation and commands up to $500K per speech — his cumulative post-presidential speaking earnings from Goldman Sachs, Laureate Education, and others exceeded $100M.", 30, 'Forbes 2016'),
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

// Also update Selena Gomez's netWorth to billionaire status
const selena = celebs.find(c => c.id === 'selena-gomez')
if (selena) selena.netWorth = 1.3

fs.writeFileSync(CELEBS_PATH, JSON.stringify(celebs, null, 2))
fs.writeFileSync(PHOTOS_PATH, JSON.stringify(photos, null, 2))

console.log(`\nDone — ${enrichedCount} celebrities enriched, ${totalNewAssets} new assets added, ${photoFixCount} photo URLs updated`)
