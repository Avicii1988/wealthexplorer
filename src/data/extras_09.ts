import type { Ext } from './extraCelebritiesExtended'
const RE = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&h=600&fit=crop'
const CA = 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=900&h=600&fit=crop'
const YA = 'https://images.unsplash.com/photo-1605281317010-fe5ffe798166?w=900&h=600&fit=crop'
const JT = 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=900&h=600&fit=crop'
const WT = 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=900&h=600&fit=crop'
const av = (n: string) => `https://ui-avatars.com/api/?name=${encodeURIComponent(n)}&background=1a1a1a&color=c9a84c&size=200&bold=true`
export const extras_09: Record<string, Ext> = {
  'kawhi-leonard': {
    avatar: av('Kawhi Leonard'),
    assets: [{ id: 'kawhi-leonard-1', type: 'real_estate', name: 'San Diego Estate', description: "Leonard's low-key San Diego estate — matching his preference for privacy over celebrity.", estimatedValue: 4, image: RE, likes: 940 }],
    gossip: [{ title: "The Shot & the Most Improbable Championship Run", summary: "Kawhi Leonard's four-bounce buzzer-beater in the 2019 playoffs — watched by 15.9 million viewers — propelled the Raptors to their first NBA title. He remains the most enigmatic superstar in professional basketball.", type: 'gossip', date: 'Jun 2019' }]
  },
  'keanu-reeves': {
    avatar: av('Keanu Reeves'),
    assets: [{ id: 'keanu-reeves-1', type: 'real_estate', name: 'Hollywood Hills Home', description: "Keanu's understated Hollywood Hills home — reflecting his famously grounded approach to celebrity.", estimatedValue: 5, image: RE, likes: 1100 }],
    gossip: [{ title: 'John Wick: $1 Billion Franchise & the Internet\'s Favourite Human', summary: "Keanu Reeves became the internet's most beloved celebrity through his genuine acts of kindness. John Wick (2014) launched a franchise that has grossed over $1 billion, giving Reeves his greatest late-career triumph at age 62.", type: 'gossip', date: 'May 2023' }]
  },
  'keira-knightley': {
    avatar: av('Keira Knightley'),
    assets: [{ id: 'keira-knightley-1', type: 'real_estate', name: 'North London Victorian Home', description: "Keira's elegant Victorian home in North London, shared with husband James Righton and their daughters.", estimatedValue: 4, image: RE, likes: 940 }],
    gossip: [{ title: "Pirates & Pride: The Actress Who Defined the 2000s", summary: "Keira Knightley starred in Pirates of the Caribbean, Love Actually, and Pride & Prejudice (earning an Oscar nomination at 20) in a remarkable run that made her one of the defining British actresses of the 2000s.", type: 'gossip', date: 'Nov 2005' }]
  },
  'ken-griffin': {
    avatar: av('Ken Griffin'),
    assets: [
      { id: 'ken-griffin-1', type: 'real_estate', name: 'Palm Beach Oceanfront Estate', description: "Griffin's expansive Palm Beach oceanfront estate — part of over $700M in US real estate holdings.", estimatedValue: 99, image: RE, likes: 6140 },
      { id: 'ken-griffin-2', type: 'art', name: 'Art Collection', description: "Griffin's $1B+ fine art collection including de Kooning's Interchange and Pollock's Number 31.", estimatedValue: 1000, image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=900&h=600&fit=crop', likes: 60200 }
    ],
    gossip: [{ title: "GameStop, Robinhood & the $1.2B Trading War", summary: "Citadel CEO Ken Griffin found himself at the centre of the 2021 GameStop short-squeeze controversy when Robinhood halted trading amid reports of pressure from market makers. Griffin testified before Congress defending his firm's practices.", type: 'controversy', date: 'Feb 2021' }]
  },
  'kendall-jenner': {
    avatar: av('Kendall Jenner'),
    assets: [{ id: 'kendall-jenner-1', type: 'real_estate', name: 'Beverly Hills Home', description: "Kendall's $8.5M Beverly Hills home in a gated community with valley views.", estimatedValue: 8.5, image: RE, likes: 1310 }],
    gossip: [{ title: "818 Tequila: $100M+ Valuation & Cultural Appropriation Claims", summary: "Kendall Jenner's 818 Tequila brand attracted both commercial success — reportedly valued at $100M+ — and controversy when social media users accused her of appropriating Mexican agave culture. The brand nonetheless became one of tequila's fastest-growing.", type: 'gossip', date: 'May 2021' }]
  },
  'kendrick-lamar': {
    avatar: av('Kendrick Lamar'),
    assets: [{ id: 'kendrick-lamar-1', type: 'real_estate', name: 'Calabasas Estate', description: "Lamar's Calabasas estate purchased at the height of his critical and commercial success.", estimatedValue: 9, image: RE, likes: 1340 }],
    gossip: [{ title: "Pulitzer Prize & the Super Bowl Triumph Over Drake", summary: "Kendrick Lamar became the first rapper to win the Pulitzer Prize for Music for DAMN. (2018). After winning the Drake beef with Not Like Us, he performed it at the 2025 Super Bowl halftime show to 127 million viewers.", type: 'gossip', date: 'Feb 2025' }]
  },
  'kenny-rogers': {
    avatar: av('Kenny Rogers'),
    assets: [{ id: 'kenny-rogers-1', type: 'real_estate', name: 'Sandy Springs Estate (Heritage)', description: "Kenny Rogers' legendary Sandy Springs, Georgia estate — his home for the final decades of his life.", estimatedValue: 7, image: RE, likes: 1220 }],
    gossip: [{ title: "The Gambler: A Song That Outlives Its Singer", summary: "Kenny Rogers' The Gambler (1978) sold 35 million copies and became one of country music's defining songs. He died in March 2020 at age 81, leaving a legacy of 24 #1 hits and a restaurant chain that outlasted his career.", type: 'gossip', date: 'Mar 2020' }]
  },
  'kevin-durant': {
    avatar: av('Kevin Durant'),
    assets: [
      { id: 'kevin-durant-1', type: 'real_estate', name: 'Bel-Air Estate', description: "KD's Bel-Air estate purchased following his move to the Golden State Warriors in 2016.", estimatedValue: 9, image: RE, likes: 1340 }
    ],
    gossip: [{ title: "$315M Extension & the Trade Request Drama", summary: "Kevin Durant signed a $315M contract extension with the Brooklyn Nets in 2021 then immediately requested a trade in 2022. The ensuing trade saga lasted months before he was dealt to Phoenix — the most dramatic off-season in NBA history.", type: 'controversy', date: 'Jun 2022' }]
  },
  'kevin-hart': {
    avatar: av('Kevin Hart'),
    assets: [
      { id: 'kevin-hart-1', type: 'real_estate', name: 'Calabasas Mansion', description: "Kevin Hart's massive Calabasas compound, complete with a comedy studio, gym, and entertainment complex.", estimatedValue: 6, image: RE, likes: 1160 }
    ],
    gossip: [{ title: "From $200 Sets to $50M: Comedy's Richest Man", summary: "Kevin Hart went from performing for 30 people at $200 per set to earning $50M+ annually through stand-up, films, and business ventures. His Hartbeat production company was valued at $650M, making him the first stand-up comedy billionaire-in-waiting.", type: 'gossip', date: 'Jan 2022' }]
  },
  'kobe-bryant': {
    avatar: av('Kobe Bryant'),
    assets: [{ id: 'kobe-bryant-1', type: 'real_estate', name: 'Newport Coast Mansion', description: "Kobe and Vanessa Bryant's Newport Coast, California estate — a symbol of the family tragedy that shocked the world.", estimatedValue: 14, image: RE, likes: 1640 }],
    gossip: [{ title: "Mamba Forever: The Helicopter Crash That Shook the World", summary: "Kobe Bryant, his daughter Gianna, and seven others died in a helicopter crash in Calabasas on 26 January 2020. The tragedy triggered an outpouring of global grief unprecedented for a sports figure and cemented his legacy as a sporting icon.", type: 'controversy', date: 'Jan 2020' }]
  },
  'kylian-mbappe': {
    avatar: av('Kylian Mbappe'),
    assets: [{ id: 'kylian-mbappe-1', type: 'real_estate', name: 'Madrid Villa, La Finca', description: "Mbappé's luxury villa in La Finca, Madrid's most prestigious celebrity enclave, following his Real Madrid move.", estimatedValue: 8, image: RE, likes: 1280 }],
    gossip: [{ title: "€200M Real Madrid Dream Fulfilled After PSG Saga", summary: "Kylian Mbappé signed with Real Madrid on a free transfer in 2024 following years of PSG contract disputes. The 25-year-old reportedly earns €150M per year, making him the highest-paid footballer in history.", type: 'gossip', date: 'Jun 2024' }]
  },
  'kylie-minogue': {
    avatar: av('Kylie Minogue'),
    assets: [{ id: 'kylie-minogue-1', type: 'real_estate', name: 'Chelsea Townhouse, London', description: "Kylie's elegant Chelsea townhouse — her London base since relocating from Australia in the 1980s.", estimatedValue: 10, image: RE, likes: 1400 }],
    gossip: [{ title: "Padam Padam Goes Viral at 55: The Comeback Queen Reigns Again", summary: "Kylie Minogue's Padam Padam became a global TikTok phenomenon in 2023, introducing her to a generation born after her 1980s peak. The Tension album debuted at #1 in multiple countries, making her one of the greatest pop comebacks in history.", type: 'gossip', date: 'Sep 2023' }]
  },
  'lady-gaga': {
    avatar: av('Lady Gaga'),
    assets: [{ id: 'lady-gaga-1', type: 'real_estate', name: 'Malibu Estate', description: "Lady Gaga's Malibu estate perched above the Pacific Coast Highway with sweeping ocean views.", estimatedValue: 6, image: RE, likes: 1160 }],
    gossip: [{ title: "A Star Is Born: $436M & The Oscar That Changed Everything", summary: "Lady Gaga's acting debut in A Star Is Born (2018) earned her an Academy Award for Best Original Song and a Best Actress nomination. The film grossed $436M worldwide and proved she is one of the most versatile entertainers alive.", type: 'gossip', date: 'Feb 2019' }]
  },
  'larry-bird': {
    avatar: av('Larry Bird'),
    assets: [{ id: 'larry-bird-1', type: 'real_estate', name: 'Naples, Florida Estate', description: "Bird's Florida retirement estate — his base since leaving basketball operations with the Pacers.", estimatedValue: 4, image: RE, likes: 940 }],
    gossip: [{ title: "French Lick to Three Rings: The Legend of Larry Legend", summary: "Larry Bird won three NBA titles with the Celtics and was named MVP three consecutive years (1984-1986). His rivalry with Magic Johnson is credited with saving the NBA's popularity in the early 1980s.", type: 'gossip', date: 'Jun 1986' }]
  },
  'larry-page': {
    avatar: av('Larry Page'),
    assets: [
      { id: 'larry-page-1', type: 'yacht', name: 'Senses', description: "Larry Page's 193-foot superyacht Senses — one of Silicon Valley's most impressive vessels.", estimatedValue: 45, image: YA, likes: 3500 },
      { id: 'larry-page-2', type: 'real_estate', name: 'Palo Alto Compound', description: "Page's expansive Palo Alto compound, close to Google's original Menlo Park campus.", estimatedValue: 45, image: RE, likes: 3200 }
    ],
    gossip: [{ title: "Google to Alphabet: The $2 Trillion Transformation", summary: "Larry Page co-founded Google in a Stanford garage in 1998 and grew it into a $2 trillion enterprise. As CEO of Alphabet, he oversaw the company's transformation from a search engine into AI, autonomous vehicles, and life sciences.", type: 'gossip', date: 'Aug 2015' }]
  },
  'lennox-lewis': {
    avatar: av('Lennox Lewis'),
    assets: [{ id: 'lennox-lewis-1', type: 'real_estate', name: 'Miami Beach Home', description: "Lewis's comfortable Miami Beach home where he retired after an unbeaten final run as undisputed champion.", estimatedValue: 8, image: RE, likes: 1280 }],
    gossip: [{ title: "Undisputed Champion Who Retired on Top", summary: "Lennox Lewis retired in 2004 as undisputed heavyweight champion — the first since Evander Holyfield. His rematches with Hasim Rahman and Vitali Klitschko cemented his legacy as one of the most technically gifted heavyweights ever.", type: 'gossip', date: 'Feb 2004' }]
  },
  'leonardo-dicaprio': {
    avatar: av('Leonardo DiCaprio'),
    assets: [
      { id: 'leonardo-dicaprio-1', type: 'island', name: 'Blackadore Caye, Belize', description: "DiCaprio's private eco-resort island in Belize, being developed as the world's first carbon-neutral eco-resort.", estimatedValue: 1.75, image: 'https://images.unsplash.com/photo-1559494007-9f5847c49d94?w=900&h=600&fit=crop', likes: 905 },
      { id: 'leonardo-dicaprio-2', type: 'yacht', name: 'Vava II', description: "DiCaprio has chartered the 99-metre superyacht Vava II for Cannes Film Festival visits.", estimatedValue: 150, image: YA, likes: 9200 }
    ],
    gossip: [{ title: "The Oscar That Took 23 Years to Arrive", summary: "Leonardo DiCaprio won his first Oscar for Best Actor for The Revenant in 2016 — his fifth nomination over 23 years. The internet's obsession with his Oscar drought had become a cultural phenomenon before his win.", type: 'gossip', date: 'Feb 2016' }]
  },
  'lewis-hamilton': {
    avatar: av('Lewis Hamilton'),
    assets: [
      { id: 'lewis-hamilton-1', type: 'jet', name: 'Bombardier Challenger 605', description: "Hamilton's private Bombardier Challenger 605 jet — controversially sold due to environmental concerns.", estimatedValue: 20, image: JT, likes: 1600 },
      { id: 'lewis-hamilton-2', type: 'real_estate', name: 'Monaco Apartment', description: "Hamilton's Monaco penthouse overlooking the F1 circuit he has raced on since 2007.", estimatedValue: 8, image: RE, likes: 1280 }
    ],
    gossip: [{ title: "The Seven-Time World Champion Who Keeps Racing", summary: "Lewis Hamilton equalled Michael Schumacher's record of seven F1 World Championships in 2020. His move to Ferrari in 2025 — signing a long-term deal at age 40 — is seen as one of motorsport's most dramatic late-career transitions.", type: 'gossip', date: 'Feb 2024' }]
  },
  'lil-baby': {
    avatar: av('Lil Baby'),
    assets: [{ id: 'lil-baby-1', type: 'real_estate', name: 'Atlanta Mansion', description: "Lil Baby's sprawling Atlanta estate with recording studio — close to his Quality Control roots.", estimatedValue: 5, image: RE, likes: 1100 }],
    gossip: [{ title: "From House Arrest to #1: Rap's Fastest Rise", summary: "Lil Baby was released from house arrest in 2017 and released his debut mixtape Harder Than Ever just months later. By 2020 his Bigger Picture — responding to George Floyd's murder — was the most impactful protest song of the year.", type: 'gossip', date: 'Jun 2020' }]
  },
  'lizzo': {
    avatar: av('Lizzo'),
    assets: [{ id: 'lizzo-1', type: 'real_estate', name: 'Hollywood Hills Home', description: "Lizzo's stylish Hollywood Hills home, where she practices flute and develops her music.", estimatedValue: 3, image: RE, likes: 780 }],
    gossip: [{ title: "About Damn Time Grammy & the Lawsuit That Followed", summary: "Lizzo won three Grammys including Record of the Year for About Damn Time (2023) at the peak of her popularity. A lawsuit from former dancers alleging a hostile work environment followed, creating significant controversy around her body positivity brand.", type: 'controversy', date: 'Aug 2023' }]
  },
  'luis-fonsi': {
    avatar: av('Luis Fonsi'),
    assets: [{ id: 'luis-fonsi-1', type: 'real_estate', name: 'Miami Home', description: "Luis Fonsi's elegant Miami home — the city that became his creative base for Despacito.", estimatedValue: 3, image: RE, likes: 780 }],
    gossip: [{ title: "Despacito: 8 Billion YouTube Views, the Most-Watched Video in History", summary: "Luis Fonsi's Despacito featuring Daddy Yankee and the Justin Bieber remix became the most-watched YouTube video in history with 8+ billion views. It broke 48 major records and became the most-streamed song in music history at the time.", type: 'gossip', date: 'Jan 2017' }]
  },
  'luka-doncic': {
    avatar: av('Luka Doncic'),
    assets: [{ id: 'luka-doncic-1', type: 'real_estate', name: 'Dallas Penthouse', description: "Doncic's luxury Dallas penthouse in Uptown — close to American Airlines Center and his adoring Mavs fans.", estimatedValue: 3, image: RE, likes: 780 }],
    gossip: [{ title: "$215M Max Extension & the Superstar Who Came from Europe", summary: "Luka Doncic won EuroLeague MVP at 19 with Real Madrid before moving to the NBA. He signed a $215M supermax extension with the Mavericks in 2022 and led Dallas to the NBA Finals in 2024, establishing himself as a generational talent.", type: 'gossip', date: 'Jun 2024' }]
  },
  'luka-modric': {
    avatar: av('Luka Modric'),
    assets: [{ id: 'luka-modric-1', type: 'real_estate', name: 'Madrid Villa', description: "Modric's elegant Madrid villa — his home for over a decade as Real Madrid's midfield heartbeat.", estimatedValue: 4, image: RE, likes: 940 }],
    gossip: [{ title: "Ballon d'Or at 33: Ending the Ronaldo-Messi Era", summary: "Luka Modric won the 2018 Ballon d'Or — ending Cristiano Ronaldo and Lionel Messi's 10-year stranglehold on the award. Leading Croatia to the 2018 World Cup Final while aged 33 was one of football's most improbable individual achievements.", type: 'gossip', date: 'Dec 2018' }]
  },
  'luke-bryan': {
    avatar: av('Luke Bryan'),
    assets: [{ id: 'luke-bryan-1', type: 'real_estate', name: 'Nashville Farm', description: "Luke Bryan's working farm outside Nashville — reflecting his deeply held agricultural values.", estimatedValue: 5, image: RE, likes: 1100 }],
    gossip: [{ title: "7x CMA Entertainer of the Year & American Idol Reign", summary: "Luke Bryan has won CMA Entertainer of the Year seven times and has served as an American Idol judge since 2018. His Farm Tour — performing on working farms across rural America — remains country music's most unique annual event.", type: 'gossip', date: 'Oct 2021' }]
  },
  'lupita-nyongo': {
    avatar: av('Lupita Nyongo'),
    assets: [{ id: 'lupita-nyongo-1', type: 'real_estate', name: 'Brooklyn Apartment', description: "Lupita's stylish Brooklyn apartment — her New York base between Broadway and film work.", estimatedValue: 3, image: RE, likes: 780 }],
    gossip: [{ title: "From Yale to Oscar: The Speech That Changed Hollywood", summary: "Lupita Nyong'o won the Academy Award for Best Supporting Actress for 12 Years a Slave (2014) in just her second film role, having graduated from Yale School of Drama the previous year. Her acceptance speech about dreams is one of Oscar history's most moving.", type: 'gossip', date: 'Mar 2014' }]
  },
  'maluma': {
    avatar: av('Maluma'),
    assets: [{ id: 'maluma-1', type: 'real_estate', name: 'Medellín Penthouse', description: "Maluma's luxury Medellín penthouse — a modern statement of his city's transformation alongside J Balvin.", estimatedValue: 3, image: RE, likes: 780 }],
    gossip: [{ title: "Hawái Goes Viral: Colombia's Biggest Pop Export After Shakira", summary: "Maluma's Hawái became a global anthem during the 2020 pandemic, reaching #2 on the Billboard Hot Latin Songs chart. His collaborations with Madonna and Marc Anthony cemented his status as Latin music's most internationally visible male artist.", type: 'gossip', date: 'Aug 2020' }]
  },
  'manny-pacquiao': {
    avatar: av('Manny Pacquiao'),
    assets: [{ id: 'manny-pacquiao-1', type: 'real_estate', name: 'General Santos City Estate', description: "Pac-Man's sprawling estate in General Santos City, Philippines — the hometown that made him a national hero.", estimatedValue: 5, image: RE, likes: 1100 }],
    gossip: [{ title: "8-Division World Champion & Philippine Senator", summary: "Manny Pacquiao became the only eight-division boxing world champion in history. He served as a Philippine Senator from 2016 to 2022 and ran for President in 2022, finishing third with 8.7 million votes.", type: 'gossip', date: 'Jul 2016' }]
  },
  'marc-andreessen': {
    avatar: av('Marc Andreessen'),
    assets: [{ id: 'marc-andreessen-1', type: 'real_estate', name: 'Atherton Compound', description: "Andreessen's Atherton, California compound — Silicon Valley's most exclusive residential enclave.", estimatedValue: 177, image: RE, likes: 10820 }],
    gossip: [{ title: "Netscape at 24 to a16z: Silicon Valley's Most Influential VC", summary: "Marc Andreessen co-created Mosaic (the first graphical browser) at 21 and Netscape at 24. With Andreessen Horowitz, he backed Facebook, Twitter, Airbnb, and hundreds of unicorns, making a16z the most influential VC firm of the internet age.", type: 'gossip', date: 'Jun 2009' }]
  },
  'marc-anthony': {
    avatar: av('Marc Anthony'),
    assets: [{ id: 'marc-anthony-1', type: 'real_estate', name: 'Miami Mansion', description: "Marc Anthony's luxurious Miami waterfront mansion, his base in the city that defined Latin pop.", estimatedValue: 12, image: RE, likes: 1520 }],
    gossip: [{ title: "Best-Selling Salsa Artist of All Time", summary: "Marc Anthony has sold over 12 million albums worldwide, making him the best-selling salsa artist of all time. His stadium tours consistently outsell those of almost any other Latin artist.", type: 'gossip', date: 'Jan 2010' }]
  },
  'marcus-rashford': {
    avatar: av('Marcus Rashford'),
    assets: [{ id: 'marcus-rashford-1', type: 'real_estate', name: 'Cheshire Mansion', description: "Rashford's Cheshire mansion — close to Manchester United's Carrington training ground.", estimatedValue: 4, image: RE, likes: 940 }],
    gossip: [{ title: "Free School Meals: The Campaign That Shamed a Government", summary: "Marcus Rashford's 2020 campaign to extend free school meals through the UK summer holidays forced a U-turn from Boris Johnson's government after initially being rejected. He was awarded an MBE and named NatWest's 2020 Person of the Year.", type: 'gossip', date: 'Jun 2020' }]
  },
  'margot-robbie': {
    avatar: av('Margot Robbie'),
    assets: [{ id: 'margot-robbie-1', type: 'real_estate', name: 'Los Angeles Home', description: "Margot Robbie's contemporary LA home, purchased with husband Tom Ackerley.", estimatedValue: 3.5, image: RE, likes: 810 }],
    gossip: [{ title: "Barbie: $1.44 Billion & the Biggest Film of 2023", summary: "Margot Robbie produced and starred in Barbie (2023), which became the highest-grossing film in Warner Bros.' history and the highest-grossing film ever directed by a woman. Despite the film's success, Robbie was not nominated for an Oscar — a snub that sparked global controversy.", type: 'gossip', date: 'Jul 2023' }]
  },
  'maria-sharapova': {
    avatar: av('Maria Sharapova'),
    assets: [{ id: 'maria-sharapova-1', type: 'real_estate', name: 'Los Angeles Home', description: "Sharapova's elegant Pacific Palisades home — her California base since her rise to tennis stardom.", estimatedValue: 4, image: RE, likes: 940 }],
    gossip: [{ title: "Sugarpova to Meldonium: Sport's Most Polarising Second Act", summary: "Maria Sharapova built Sugarpova into a global confectionery business, then served a 15-month doping ban for Meldonium use in 2016. Her return to tennis and subsequent retirement in 2020 closed one of sport's most complex careers.", type: 'controversy', date: 'Mar 2016' }]
  },
  'mark-wahlberg': {
    avatar: av('Mark Wahlberg'),
    assets: [{ id: 'mark-wahlberg-1', type: 'real_estate', name: 'Las Vegas Mansion', description: "Wahlberg's new 30,000 sq ft Las Vegas mansion — built after leaving his $87.5M Beverly Hills compound.", estimatedValue: 15, image: RE, likes: 1700 }],
    gossip: [{ title: "$87.5M Beverly Hills Sale & the Nevada Tax Move", summary: "Mark Wahlberg sold his Beverly Hills mansion for $87.5M in 2022 — one of the highest prices ever for a California home — and relocated to Nevada for tax reasons, a move that saved him an estimated $12M annually.", type: 'gossip', date: 'Nov 2022' }]
  },
  'martina-navratilova': {
    avatar: av('Martina Navratilova'),
    assets: [{ id: 'martina-navratilova-1', type: 'real_estate', name: 'Aspen Estate', description: "Navratilova's beloved Aspen, Colorado estate — used year-round for skiing and outdoor pursuits.", estimatedValue: 4, image: RE, likes: 940 }],
    gossip: [{ title: "18 Grand Slams & Fighting Cancer Twice", summary: "Martina Navratilova won 18 Grand Slam singles titles and was the world's dominant player for a decade. She battled breast cancer in 2010 and throat and breast cancer simultaneously in 2023, maintaining her activism and commentary throughout.", type: 'gossip', date: 'Jan 2023' }]
  },
  'mary-j-blige': {
    avatar: av('Mary J Blige'),
    assets: [{ id: 'mary-j-blige-1', type: 'real_estate', name: 'Teaneck Mansion', description: "Mary J. Blige's Teaneck, New Jersey mansion — close to the New York community she emerged from.", estimatedValue: 3.5, image: RE, likes: 810 }],
    gossip: [{ title: "Oscar Nomination at 46: The Queen of Hip-Hop Soul Reinvented", summary: "Mary J. Blige received Oscar nominations for both Best Actress and Best Original Song for Mudbound (2017) — making her the second person ever nominated in both acting and music categories on the same night.", type: 'gossip', date: 'Jan 2018' }]
  },
}
