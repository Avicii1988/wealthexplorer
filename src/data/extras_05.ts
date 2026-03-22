import type { Ext } from './extraCelebritiesExtended'
const RE = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&h=600&fit=crop'
const CA = 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=900&h=600&fit=crop'
const YA = 'https://images.unsplash.com/photo-1605281317010-fe5ffe798166?w=900&h=600&fit=crop'
const JT = 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=900&h=600&fit=crop'
const WT = 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=900&h=600&fit=crop'
const av = (n: string) => `https://ui-avatars.com/api/?name=${encodeURIComponent(n)}&background=1a1a1a&color=c9a84c&size=200&bold=true`
export const extras_05: Record<string, Ext> = {
  'dark-side': {
    avatar: av('Dark Side'),
    assets: [{ id: 'dark-side-1', type: 'real_estate', name: 'Mystery Compound', description: 'An undisclosed luxury compound associated with this enigmatic figure.', estimatedValue: 5, image: RE, likes: 700 }],
    gossip: [{ title: 'The Shadows of Success', summary: 'Operating behind the scenes of multiple entertainment ventures, this figure is known in industry circles for behind-the-scenes influence in music and media.', type: 'gossip', date: 'Jan 2023' }]
  },
  'dave-chappelle': {
    avatar: av('Dave Chappelle'),
    assets: [{ id: 'dave-chappelle-1', type: 'real_estate', name: 'Yellow Springs Farm', description: "Chappelle's 65-acre farm in Yellow Springs, Ohio — where he walked away from $50M and later returned to.", estimatedValue: 3, image: RE, likes: 780 }],
    gossip: [{ title: "Walking Away from $50M: The Chappelle Show Exit", summary: "Dave Chappelle famously walked away from a $50M Comedy Central deal in 2005 and flew to South Africa. His return with multiple Netflix specials — the most lucrative in comedy history — cemented his legend.", type: 'gossip', date: 'May 2005' }]
  },
  'dave-grohl': {
    avatar: av('Dave Grohl'),
    assets: [{ id: 'dave-grohl-1', type: 'real_estate', name: 'Studio City Home', description: "Grohl's family home in Studio City, LA — where he famously built a basement studio with his daughter.", estimatedValue: 4, image: RE, likes: 940 }],
    gossip: [{ title: 'From Nirvana to Foo Fighters: Rock\'s Most Resilient Figure', summary: "Following Kurt Cobain's 1994 death, Dave Grohl channelled his grief into Foo Fighters — recording the entire debut album alone on guitar, bass, and drums. Foo Fighters became one of the biggest rock bands of the 21st century.", type: 'gossip', date: 'Jul 1995' }]
  },
  'david-beckham': {
    avatar: av('David Beckham'),
    assets: [
      { id: 'david-beckham-1', type: 'real_estate', name: 'Cotswolds Manor', description: "The Beckhams' stunning Cotswolds estate — their primary English retreat purchased in 1999.", estimatedValue: 12, image: RE, likes: 1520 },
      { id: 'david-beckham-2', type: 'car', name: 'Rolls-Royce Phantom', description: "One of several Rolls-Royces in the Beckham garage — driven to MLS events and fashion shows alike.", estimatedValue: 0.45, image: CA, likes: 1027 }
    ],
    gossip: [{ title: 'Inter Miami & Lionel Messi: The MLS Revolution', summary: "David Beckham's Inter Miami co-ownership reached new heights when Lionel Messi joined in 2023. The resulting MLS media deal and expansion of football's US fanbase exceeded even Beckham's most ambitious projections.", type: 'gossip', date: 'Jul 2023' }]
  },
  'david-copperfield-magician': {
    avatar: av('David Copperfield'),
    assets: [{ id: 'david-copperfield-magician-1', type: 'island', name: 'Musha Cay & the Islands of Copperfield Bay', description: "Copperfield's private 11-island resort in the Bahamas — available to rent for $42,000 per night.", estimatedValue: 50, image: 'https://images.unsplash.com/photo-1559494007-9f5847c49d94?w=900&h=600&fit=crop', likes: 3200 }],
    gossip: [{ title: 'Disappearing the Statue of Liberty & Beyond', summary: "David Copperfield made the Statue of Liberty disappear on live television in 1983, watched by 35 million viewers. He remains the highest-grossing solo entertainer in history with $4 billion in lifetime ticket sales.", type: 'gossip', date: 'Apr 1983' }]
  },
  'david-hasselhoff': {
    avatar: av('David Hasselhoff'),
    assets: [{ id: 'david-hasselhoff-1', type: 'real_estate', name: 'Encino Estate', description: "The Hoff's San Fernando Valley estate, a reminder of his peak Baywatch-era earnings.", estimatedValue: 2, image: RE, likes: 520 }],
    gossip: [{ title: "Baywatch, the Berlin Wall & Meme Immortality", summary: "David Hasselhoff famously sang at the Berlin Wall on New Year's Eve 1989, a night he credits himself with contributing to its fall. His cultural legacy was secured when Google made him the first person to pay the $1 reserve price for his own domain.", type: 'gossip', date: 'Dec 1989' }]
  },
  'davidoff-yachts': {
    avatar: av('Davidoff Yachts'),
    assets: [{ id: 'davidoff-yachts-1', type: 'yacht', name: 'Charter Fleet', description: "The Davidoff luxury charter yacht fleet operating in the Mediterranean and Caribbean.", estimatedValue: 60, image: YA, likes: 3800 }],
    gossip: [{ title: 'Ultra-Luxury Charter Market Boom', summary: "Ultra-luxury yacht charters experienced a 40% demand surge post-COVID as UHNW individuals sought private travel alternatives. Charter rates for top vessels exceeded €250,000 per week.", type: 'gossip', date: 'Jun 2022' }]
  },
  'dean-martin': {
    avatar: av('Dean Martin'),
    assets: [{ id: 'dean-martin-1', type: 'real_estate', name: 'Bel-Air Estate (Heritage)', description: "Dean Martin's legendary Bel-Air estate, a symbol of the Rat Pack era's Hollywood glamour.", estimatedValue: 5, image: RE, likes: 1100 }],
    gossip: [{ title: 'The Rat Pack & Vegas: An Era That Defined Cool', summary: "Dean Martin was the coolest member of the Rat Pack alongside Frank Sinatra, Sammy Davis Jr., and Peter Lawford. His Las Vegas residencies helped transform the Strip into a global entertainment destination.", type: 'gossip', date: 'Jan 1960' }]
  },
  'deepika-chikhalia': {
    avatar: av('Deepika Chikhalia'),
    assets: [{ id: 'deepika-chikhalia-1', type: 'real_estate', name: 'Mumbai Apartment', description: "Deepika Chikhalia's Mumbai apartment, near her work as a politician and occasional actress.", estimatedValue: 0.8, image: RE, likes: 348 }],
    gossip: [{ title: 'Ramayana\'s Sita Becomes a BJP MP', summary: "Deepika Chikhalia, who played Sita in the iconic 1987-88 Ramayana TV series watched by 650 million Indians, later became a BJP Member of Parliament — winning her constituency in part due to her beloved on-screen role.", type: 'gossip', date: 'Jan 1990' }]
  },
  'deepika-padukone': {
    avatar: av('Deepika Padukone'),
    assets: [{ id: 'deepika-padukone-1', type: 'real_estate', name: 'Prabhadevi Apartment, Mumbai', description: "Deepika and Ranveer's luxurious sea-facing duplex apartment in Prabhadevi, Mumbai.", estimatedValue: 22, image: RE, likes: 2120 }],
    gossip: [{ title: 'Pathaan Crosses ₹1000 Crore & Mental Health Advocacy', summary: "Deepika Padukone broke Indian box-office records with Pathaan (2023) alongside Shah Rukh Khan. Equally significantly, her 2015 YouTube video about her depression battle became a watershed moment in South Asian mental health awareness.", type: 'gossip', date: 'Jan 2023' }]
  },
  'degrassi-drake': {
    avatar: av('Drake'),
    assets: [
      { id: 'degrassi-drake-1', type: 'real_estate', name: 'YOLO Estate, Toronto', description: "Drake's 50,000 sq ft custom mega-mansion in Forest Hill, Toronto — complete with a basketball court, indoor pool, and recording studio.", estimatedValue: 100, image: RE, likes: 6200 },
      { id: 'degrassi-drake-2', type: 'jet', name: 'Air Drake Boeing 767', description: "Drake's custom Boeing 767 — the largest celebrity private jet in the world, painted with his OVO owl logo.", estimatedValue: 185, image: JT, likes: 11310 }
    ],
    gossip: [{ title: "Kendrick Lamar's 'Not Like Us' & the Rap Battle of the Decade", summary: "Drake's 2024 beef with Kendrick Lamar culminated in Not Like Us — one of the most devastating diss tracks in hip-hop history. Lamar performed it at the Super Bowl halftime show, cementing his victory in pop culture's biggest rap battle.", type: 'controversy', date: 'May 2024' }]
  },
  'demi-lovato': {
    avatar: av('Demi Lovato'),
    assets: [{ id: 'demi-lovato-1', type: 'real_estate', name: 'Studio City Home', description: "Demi's Studio City, Los Angeles home purchased as part of their renewed commitment to stability and wellness.", estimatedValue: 3.5, image: RE, likes: 810 }],
    gossip: [{ title: '2018 Overdose & the Comeback Documentary', summary: "Demi Lovato nearly died from a drug overdose in July 2018. Their documentary Dancing with the Devil (2021) gave a raw account of addiction, survival, and recovery, watched by over 10 million viewers in its first week.", type: 'controversy', date: 'Jul 2018' }]
  },
  'denzel-curry': {
    avatar: av('Denzel Curry'),
    assets: [{ id: 'denzel-curry-1', type: 'real_estate', name: 'Miami Home', description: "Denzel Curry's Miami home — a connection to his Carol City, Florida roots.", estimatedValue: 1.2, image: RE, likes: 472 }],
    gossip: [{ title: 'TA13OO & Critical Acclaim Without Mainstream Compromise', summary: "Denzel Curry's 2018 album TA13OO was praised as a masterpiece of modern hip-hop, showcasing his versatility across three distinct album 'lights'. He remains one of rap's most respected voices while maintaining artistic independence.", type: 'gossip', date: 'Jul 2018' }]
  },
  'denzel-washington': {
    avatar: av('Denzel Washington'),
    assets: [{ id: 'denzel-washington-1', type: 'real_estate', name: 'Beverly Park Estate', description: "Washington's impressive Beverly Park estate in the hills above Beverly Hills.", estimatedValue: 14, image: RE, likes: 1640 }],
    gossip: [{ title: "Two Oscars & the Greatest Actor of His Generation", summary: "Denzel Washington is the only Black man to have won two Academy Awards for acting — Best Supporting Actor for Glory (1990) and Best Actor for Training Day (2002). He remains Hollywood's most consistently bankable dramatic star.", type: 'gossip', date: 'Mar 2002' }]
  },
  'derek-black': {
    avatar: av('Derek Black'),
    assets: [{ id: 'derek-black-1', type: 'real_estate', name: 'Florida Home', description: "Black's modest Florida residence after renouncing white nationalism and pursuing academic work.", estimatedValue: 0.3, image: RE, likes: 213 }],
    gossip: [{ title: "White Supremacy's Heir Who Walked Away", summary: "Derek Black, the godson of David Duke and son of Stormfront's founder, was groomed to lead the white nationalist movement. After forming friendships at college, he publicly renounced his beliefs in 2013 — one of the most remarkable ideological transformations on record.", type: 'gossip', date: 'Nov 2013' }]
  },
  'derek-jeter': {
    avatar: av('Derek Jeter'),
    assets: [{ id: 'derek-jeter-1', type: 'real_estate', name: 'Davis Islands Mansion, Tampa', description: "Jeter's 30,000 sq ft mansion on Davis Islands in Tampa Bay — nicknamed 'St. Jetersburg' by locals.", estimatedValue: 22, image: RE, likes: 2120 }],
    gossip: [{ title: 'The Captain: Five World Series Rings & Riverdale Drive', summary: "Derek Jeter won five World Series rings with the New York Yankees over two decades. As the Yankees' captain from 2003 to 2014, his unwavering professionalism made him baseball's most beloved ambassador.", type: 'gossip', date: 'Oct 2009' }]
  },
  'desmond-tutu': {
    avatar: av('Desmond Tutu'),
    assets: [{ id: 'desmond-tutu-1', type: 'real_estate', name: 'Cape Town Residence', description: "Archbishop Tutu's modest Cape Town home in Milnerton, reflecting his lifelong commitment to simplicity.", estimatedValue: 0.5, image: RE, likes: 430 }],
    gossip: [{ title: "The Rainbow Nation's Moral Conscience", summary: "Archbishop Desmond Tutu chaired South Africa's Truth and Reconciliation Commission, helping guide the nation through its post-apartheid healing. He won the Nobel Peace Prize in 1984 and died in December 2021 aged 90.", type: 'gossip', date: 'Dec 2021' }]
  },
  'didier-drogba': {
    avatar: av('Didier Drogba'),
    assets: [{ id: 'didier-drogba-1', type: 'real_estate', name: "Abidjan Family Estate", description: "Drogba's grand family estate in Abidjan, Ivory Coast — his home after international retirement.", estimatedValue: 4, image: RE, likes: 940 }],
    gossip: [{ title: 'The Goal That Stopped a Civil War', summary: "In 2005, Didier Drogba persuaded the warring factions of Ivory Coast's civil war to observe a ceasefire. After Ivory Coast qualified for the World Cup, his tearful pitch-side plea halted hostilities — one of sport's most powerful moments.", type: 'gossip', date: 'Oct 2005' }]
  },
  'dikembe-mutombo': {
    avatar: av('Dikembe Mutombo'),
    assets: [{ id: 'dikembe-mutombo-1', type: 'real_estate', name: 'Atlanta Mansion', description: "Mutombo's Atlanta estate, from which he ran his Dikembe Mutombo Foundation supporting the DRC.", estimatedValue: 5, image: RE, likes: 1100 }],
    gossip: [{ title: "$15M Hospital for Congo & a Finger Wag for the Ages", summary: "Dikembe Mutombo spent $15M of his own money to build the Biamba Marie Mutombo Hospital in Kinshasa, DRC. Off the court, his 'not in my house' finger-wag blocked shots became the most iconic gesture in NBA history.", type: 'gossip', date: 'Sep 2006' }]
  },
  'dimitri-payet': {
    avatar: av('Dimitri Payet'),
    assets: [{ id: 'dimitri-payet-1', type: 'real_estate', name: 'Marseille Villa', description: "Payet's villa in Marseille — the city he returned to after his dramatic Premier League exit.", estimatedValue: 2, image: RE, likes: 520 }],
    gossip: [{ title: "West Ham Exit & the West London Ultimatum", summary: "Dimitri Payet refused to play for West Ham in January 2017, forcing the club to sell him to Marseille for £25M. His hunger strike from the squad became one of football's most dramatic transfer sagas.", type: 'controversy', date: 'Jan 2017' }]
  },
  'dirk-nowitzki': {
    avatar: av('Dirk Nowitzki'),
    assets: [{ id: 'dirk-nowitzki-1', type: 'real_estate', name: 'Dallas Highland Park Home', description: "Nowitzki's Highland Park estate in Dallas — where he raised his family and plans to stay post-retirement.", estimatedValue: 6, image: RE, likes: 1160 }],
    gossip: [{ title: "2011 NBA Champion at Last: LeBron's Nemesis", summary: "Dirk Nowitzki won his only NBA championship in 2011, defeating LeBron James' Miami Heat superteam. His unique one-legged fadeaway revolutionised the power forward position and he retired as the greatest European player in NBA history.", type: 'gossip', date: 'Jun 2011' }]
  },
  'doja-cat': {
    avatar: av('Doja Cat'),
    assets: [{ id: 'doja-cat-1', type: 'real_estate', name: 'Los Angeles Hills Home', description: "Doja Cat's sleek modern home in the Hollywood Hills with views of the city skyline.", estimatedValue: 4.5, image: RE, likes: 1070 }],
    gossip: [{ title: 'Say So to Planet Her: The Shape-Shifting Pop Star', summary: "Doja Cat went from internet curiosity with Mooo! to Grammy-winning pop star in three years. Planet Her (2021) debuted at #2 on the Billboard 200 and featured five Hot 100 top-ten hits simultaneously.", type: 'gossip', date: 'Jun 2021' }]
  },
  'dolly-parton': {
    avatar: av('Dolly Parton'),
    assets: [{ id: 'dolly-parton-1', type: 'real_estate', name: 'Brentwood Nashville Estate', description: "Dolly's estate in Brentwood, Tennessee — a short drive from Dollywood and her hometown of Sevierville.", estimatedValue: 5, image: RE, likes: 1100 }],
    gossip: [{ title: "Vaccine Funder, Songwriter & America's Favourite Icon", summary: "Dolly Parton donated $1 million to Vanderbilt University to fund Moderna's COVID-19 vaccine research in 2020. She turned down both the Presidential Medal of Freedom twice and a statue in her honour, saying she didn't deserve it.", type: 'gossip', date: 'Nov 2020' }]
  },
  'donald-trump': {
    avatar: av('Donald Trump'),
    assets: [
      { id: 'donald-trump-1', type: 'real_estate', name: 'Mar-a-Lago, Palm Beach', description: "Trump's legendary 62,500 sq ft Palm Beach club and private residence — known as the Winter White House.", estimatedValue: 300, image: RE, likes: 18200 },
      { id: 'donald-trump-2', type: 'jet', name: 'Trump Force One (Boeing 757)', description: "Trump's gold-fitted Boeing 757 — his primary mode of transport since 1989 with his name in large gold letters.", estimatedValue: 50, image: JT, likes: 3200 }
    ],
    gossip: [{ title: "47th President: Historic Return to the White House", summary: "Donald Trump became the 47th President in January 2025 — only the second US president in history to serve non-consecutive terms. His 2024 victory came despite multiple criminal indictments, a phenomenon unprecedented in American history.", type: 'gossip', date: 'Jan 2025' }]
  },
  'doutzen-kroes': {
    avatar: av('Doutzen Kroes'),
    assets: [{ id: 'doutzen-kroes-1', type: 'real_estate', name: 'Amsterdam Canal House', description: "Kroes's beautifully restored 17th-century canal house in Amsterdam's Jordaan district.", estimatedValue: 5, image: RE, likes: 1100 }],
    gossip: [{ title: "Victoria's Secret Angel Turned Climate Activist", summary: "Doutzen Kroes used her platform as one of the highest-paid models to become an outspoken climate activist and vaccine choice advocate. Her public stance during COVID-19 generated significant controversy in the Netherlands.", type: 'gossip', date: 'Mar 2021' }]
  },
  'dr-dre': {
    avatar: av('Dr Dre'),
    assets: [
      { id: 'dr-dre-1', type: 'real_estate', name: 'Brentwood Mansion', description: "Dre's $40M Brentwood estate purchased from Tom Brady — one of LA's most celebrated homes.", estimatedValue: 40, image: RE, likes: 3800 },
      { id: 'dr-dre-2', type: 'jet', name: 'Gulfstream G650ER', description: "Dre's Gulfstream G650ER long-range private jet used for business and leisure.", estimatedValue: 75, image: JT, likes: 4700 }
    ],
    gossip: [{ title: '$3.2 Billion Beats by Dre Sale to Apple', summary: "Dr. Dre and Jimmy Iovine sold Beats Electronics to Apple in 2014 for $3.2 billion — the largest acquisition in Apple's history. The deal made Dre the first hip-hop billionaire, with a pre-tax payout of nearly $700M.", type: 'gossip', date: 'May 2014' }]
  },
  'dua-lipa': {
    avatar: av('Dua Lipa'),
    assets: [{ id: 'dua-lipa-1', type: 'real_estate', name: 'North London Home', description: "Dua Lipa's stylish North London home, her base between world tours.", estimatedValue: 5, image: RE, likes: 1100 }],
    gossip: [{ title: "Future Nostalgia: Pop's Greatest Lockdown Album", summary: "Dua Lipa released Future Nostalgia in March 2020 days before global lockdowns. The album won the Grammy for Best Pop Vocal Album and redefined disco-pop for a generation, with Levitating becoming one of Spotify's most-streamed songs of the decade.", type: 'gossip', date: 'Apr 2020' }]
  },
  'dustin-johnson': {
    avatar: av('Dustin Johnson'),
    assets: [{ id: 'dustin-johnson-1', type: 'real_estate', name: 'Jupiter, Florida Mansion', description: "DJ's Jupiter, Florida waterfront property near his training base and the PGA Tour season.", estimatedValue: 6, image: RE, likes: 1160 }],
    gossip: [{ title: "LIV Golf's First Big Name: $125M Signing", summary: "Dustin Johnson was the first elite golfer to defect to LIV Golf in 2022, reportedly signing a guaranteed deal worth $125M. His move triggered a cascade of PGA Tour defections that transformed professional golf.", type: 'gossip', date: 'Jun 2022' }]
  },
  'dwayne-johnson': {
    avatar: av('Dwayne Johnson'),
    assets: [
      { id: 'dwayne-johnson-1', type: 'real_estate', name: 'Powder Springs Farm, Georgia', description: "The Rock's 43-acre farm in Georgia, featuring barns, a training facility, and a private road named Tequila Lane.", estimatedValue: 9, image: RE, likes: 1340 }
    ],
    gossip: [{ title: "Teremana Tequila Hits 1 Million Cases — Fastest Ever", summary: "Dwayne Johnson's Teremana Tequila reached 1 million cases sold in its first year — the fastest spirits brand in history to reach that milestone. Combined with his acting fees, it made him Hollywood's highest-paid star for two consecutive years.", type: 'gossip', date: 'Jan 2022' }]
  },
  'dwyane-wade': {
    avatar: av('Dwyane Wade'),
    assets: [{ id: 'dwyane-wade-1', type: 'real_estate', name: 'Hallandale Beach Penthouse', description: "D-Wade's luxury penthouse in Hallandale Beach, Florida, with panoramic ocean and city views.", estimatedValue: 5, image: RE, likes: 1100 }],
    gossip: [{ title: 'Flash & The Big Three: Miami Heat Dynasty', summary: "Dwyane Wade won three NBA championships with the Miami Heat (2006, 2012, 2013). His partnership with LeBron James and Chris Bosh became the blueprint for the modern NBA superteam.", type: 'gossip', date: 'Jun 2006' }]
  },
  'ed-sheeran': {
    avatar: av('Ed Sheeran'),
    assets: [{ id: 'ed-sheeran-1', type: 'real_estate', name: 'Suffolk Village Complex', description: "Ed's growing compound of connected properties in his Suffolk village, nicknamed 'Sheeranville' by locals.", estimatedValue: 10, image: RE, likes: 1400 }],
    gossip: [{ title: 'Shape of You: The Song That Broke Spotify', summary: "Ed Sheeran's Shape of You (2017) became the first song to reach 3 billion streams on Spotify. His Divide album sold 13.1 million copies worldwide, making him the biggest-selling artist of 2017 globally.", type: 'gossip', date: 'Jan 2017' }]
  },
  'eddie-murphy': {
    avatar: av('Eddie Murphy'),
    assets: [{ id: 'eddie-murphy-1', type: 'real_estate', name: 'Beverly Hills Estate', description: "Murphy's 25,000 sq ft Beverly Hills compound with a full gym, cinema, and extensive grounds.", estimatedValue: 15, image: RE, likes: 1700 }],
    gossip: [{ title: "Dolemite & the Greatest Second Act in Comedy", summary: "Eddie Murphy disappeared from films after Norbit's critical disaster, then made a triumphant return in Dolemite Is My Name (2019) and received a Golden Globe nomination. His comedy special Eddie Murphy: Raw remains the highest-grossing stand-up film ever.", type: 'gossip', date: 'Oct 2019' }]
  },
  'eden-hazard': {
    avatar: av('Eden Hazard'),
    assets: [{ id: 'eden-hazard-1', type: 'real_estate', name: 'Madrid Villa', description: "Hazard's elegant villa in La Moraleja, Madrid's most exclusive residential suburb.", estimatedValue: 4, image: RE, likes: 940 }],
    gossip: [{ title: "The £88M Flop: Real Madrid's Greatest Misfire", summary: "Eden Hazard joined Real Madrid for £88M in 2019 after being one of Europe's best players at Chelsea. Plagued by injuries and weight issues, he made just 76 appearances in four seasons and was released in 2023 without fulfilling any of his potential.", type: 'controversy', date: 'Jun 2019' }]
  },
  'elton-john': {
    avatar: av('Elton John'),
    assets: [
      { id: 'elton-john-1', type: 'real_estate', name: 'Woodside Estate, Windsor', description: "Elton's magnificent 37-acre estate in Old Windsor, his primary UK home for over 40 years.", estimatedValue: 35, image: RE, likes: 3100 },
      { id: 'elton-john-2', type: 'real_estate', name: "Nice Villa, French Riviera", description: "Elton's villa on the French Riviera overlooking the Mediterranean — his summer retreat.", estimatedValue: 15, image: RE, likes: 1700 }
    ],
    gossip: [{ title: "Farewell Yellow Brick Road: The 5-Year Goodbye Tour", summary: "Elton John's Farewell Yellow Brick Road tour (2018–2023) grossed over $939M, making it the highest-grossing concert tour of all time. He finally concluded the tour in Stockholm in July 2023 after 330 shows.", type: 'gossip', date: 'Jul 2023' }]
  },
}
