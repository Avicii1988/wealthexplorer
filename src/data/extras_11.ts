import type { Ext } from './extraCelebritiesExtended'
const RE = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&h=600&fit=crop'
const JT = 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=900&h=600&fit=crop'
const av = (n: string) => `https://ui-avatars.com/api/?name=${encodeURIComponent(n)}&background=1a1a1a&color=c9a84c&size=200&bold=true`
export const extras_11: Record<string, Ext> = {
  'max-verstappen': {
    avatar: av('Max Verstappen'),
    assets: [{ id: 'max-verstappen-1', type: 'real_estate', name: 'Monaco Apartment', description: "Verstappen's Monaco apartment — the tax-friendly home of most F1 champions.", estimatedValue: 8, image: RE, likes: 1280 }],
    gossip: [{ title: "Three Consecutive World Championships & The Red Bull Dominance", summary: "Max Verstappen won three consecutive F1 World Championships (2022-2024) with Red Bull, dominating the sport in a way not seen since Michael Schumacher. His 19-win season in 2023 broke the all-time record.", type: 'gossip', date: 'Nov 2024' }]
  },
  'megan-thee-stallion': {
    avatar: av('Megan Thee Stallion'),
    assets: [{ id: 'megan-thee-stallion-1', type: 'real_estate', name: 'Houston Mansion', description: "Megan Thee Stallion's Houston mansion — a tribute to her hometown and the city she promotes constantly.", estimatedValue: 4, image: RE, likes: 940 }],
    gossip: [{ title: "Tory Lanez Trial & the Shooting That Changed Everything", summary: "Megan Thee Stallion was shot in the foot by rapper Tory Lanez in 2020. Lanez was convicted of assault in 2022 and sentenced to 10 years in prison. Megan's public testimony and subsequent advocacy transformed conversations around violence against women in hip-hop.", type: 'controversy', date: 'Dec 2022' }]
  },
  'michael-b-jordan': {
    avatar: av('Michael B Jordan'),
    assets: [{ id: 'michael-b-jordan-1', type: 'real_estate', name: 'Sherman Oaks Home', description: "Michael B. Jordan's Sherman Oaks, LA home — purchased after his Creed and Black Panther breakthrough.", estimatedValue: 4.5, image: RE, likes: 1070 }],
    gossip: [{ title: "Creed III: Directorial Debut Crosses $270M", summary: "Michael B. Jordan made his directorial debut with Creed III (2023) — a film he also starred in, produced, and co-wrote. The film grossed $270M worldwide and established him as one of Hollywood's most versatile triple threats.", type: 'gossip', date: 'Mar 2023' }]
  },
  'michael-bloomberg': {
    avatar: av('Michael Bloomberg'),
    assets: [
      { id: 'michael-bloomberg-1', type: 'real_estate', name: 'East 79th Street Mansion, NYC', description: "Bloomberg's East Side Manhattan townhouse — one of New York's most valuable private residences.", estimatedValue: 45, image: RE, likes: 3500 },
      { id: 'michael-bloomberg-2', type: 'jet', name: 'Falcon 900B Fleet', description: "Bloomberg's private jet fleet used for global business and philanthropic travel.", estimatedValue: 60, image: JT, likes: 3800 }
    ],
    gossip: [{ title: "$1 Billion 2020 Presidential Campaign That Won Zero States", summary: "Michael Bloomberg spent over $1 billion on his 2020 Democratic presidential campaign — the most expensive in US primary history — and withdrew after Super Tuesday having won just American Samoa. He donated $100M to support Joe Biden's general election campaign.", type: 'gossip', date: 'Mar 2020' }]
  },
  'michael-dell': {
    avatar: av('Michael Dell'),
    assets: [
      { id: 'michael-dell-1', type: 'real_estate', name: 'Austin Lakeside Estate', description: "Dell's vast Austin lakeside compound — the most valuable residential property in Texas.", estimatedValue: 72, image: RE, likes: 4520 }
    ],
    gossip: [{ title: "Dorm Room to $50 Billion: The Dell Story", summary: "Michael Dell started Dell Technologies from his University of Texas dorm room in 1984 with $1,000. He took the company private in 2013 and public again in 2018 — one of the largest leveraged buyout reversals in history.", type: 'gossip', date: 'Dec 2018' }]
  },
  'mila-kunis': {
    avatar: av('Mila Kunis'),
    assets: [{ id: 'mila-kunis-1', type: 'real_estate', name: 'Beverly Hills Estate', description: "Mila Kunis and Ashton Kutcher's elegant Beverly Hills estate, their family home.", estimatedValue: 10, image: RE, likes: 1400 }],
    gossip: [{ title: "That 70s Show Sweethearts: A Decade-Long Love Story", summary: "Mila Kunis and Ashton Kutcher played love interests on That '70s Show (1998-2006) but only began dating in 2012. They married in 2015 and have two children, making them one of Hollywood's most enduring real-life romance stories.", type: 'gossip', date: 'Jun 2015' }]
  },
  'miranda-kerr': {
    avatar: av('Miranda Kerr'),
    assets: [{ id: 'miranda-kerr-1', type: 'real_estate', name: 'Malibu Family Estate', description: "Miranda Kerr and Evan Spiegel's Malibu estate — home to their young family and Miranda's KORA Organics team.", estimatedValue: 12, image: RE, likes: 1520 }],
    gossip: [{ title: "KORA Organics: The $1B+ Beauty Empire Built on Clean Principles", summary: "Miranda Kerr founded KORA Organics in 2009, which grew into a beauty business valued at over $1 billion. As both the face and owner, she demonstrated the power of the celebrity-founder model before it became mainstream.", type: 'gossip', date: 'Mar 2021' }]
  },
  'mohamed-salah': {
    avatar: av('Mohamed Salah'),
    assets: [{ id: 'mohamed-salah-1', type: 'real_estate', name: 'Liverpool Mansion', description: "Mo Salah's Merseyside mansion near Liverpool's Melwood training ground.", estimatedValue: 4, image: RE, likes: 940 }],
    gossip: [{ title: "£350,000-a-Week Renewal & Egypt's Most Beloved Icon", summary: "Mohamed Salah renewed his Liverpool contract in 2023 for a reported £350,000 per week — making him one of the Premier League's highest earners. His refusal to celebrate against Muslim-majority nations during Ramadan has made him a figure of deep cultural pride.", type: 'gossip', date: 'May 2023' }]
  },
  'morgan-freeman': {
    avatar: av('Morgan Freeman'),
    assets: [{ id: 'morgan-freeman-1', type: 'real_estate', name: 'Mississippi Delta Ranch', description: "Freeman's 124-acre ranch in Charleston, Mississippi — now converted to a bee sanctuary.", estimatedValue: 3, image: RE, likes: 780 }],
    gossip: [{ title: "Converting His Ranch to a Bee Sanctuary to Save the Planet", summary: "Morgan Freeman converted his 124-acre Mississippi ranch into a honeybee sanctuary in 2014, importing thousands of bees to combat declining pollinator populations. He plants lavender, magnolia, and clover and refuses to use pesticides.", type: 'gossip', date: 'Jun 2014' }]
  },
  'mukesh-ambani': {
    avatar: av('Mukesh Ambani'),
    assets: [
      { id: 'mukesh-ambani-1', type: 'real_estate', name: 'Antilia, Mumbai', description: "Ambani's 27-storey private skyscraper in Mumbai — the world's most expensive private residence at $2 billion.", estimatedValue: 2000, image: RE, likes: 120200 },
      { id: 'mukesh-ambani-2', type: 'jet', name: 'Boeing 747 Jumbo Jet', description: "Ambani's custom Boeing 747 — one of the most luxuriously appointed private aircraft in existence.", estimatedValue: 200, image: JT, likes: 12400 }
    ],
    gossip: [{ title: "Asia's Richest Man & the $100M Wedding", summary: "Mukesh Ambani's son Anant's 2024 wedding was a three-day, $100M+ extravaganza attended by Rihanna, Kim Kardashian, and Mark Zuckerberg — the most expensive wedding in modern history.", type: 'gossip', date: 'Jul 2024' }]
  },
  'naomi-osaka': {
    avatar: av('Naomi Osaka'),
    assets: [{ id: 'naomi-osaka-1', type: 'real_estate', name: 'Beverly Hills Home', description: "Osaka's Beverly Hills home purchased as she established herself as tennis's highest-paid female athlete.", estimatedValue: 6, image: RE, likes: 1160 }],
    gossip: [{ title: "Mental Health, French Open Withdrawal & the Conversation She Started", summary: "Naomi Osaka withdrew from the 2021 French Open citing mental health concerns, triggering the most significant conversation about athlete wellbeing in sports history. She returned to tennis in 2023 after giving birth to her daughter.", type: 'gossip', date: 'Jun 2021' }]
  },
  'narendra-modi': {
    avatar: av('Narendra Modi'),
    assets: [{ id: 'narendra-modi-1', type: 'real_estate', name: '7 Lok Kalyan Marg, New Delhi', description: "The official residence of India's Prime Minister — a heavily secured bungalow in New Delhi's Lutyens' Zone.", estimatedValue: 20, image: RE, likes: 2000 }],
    gossip: [{ title: "World's Largest Election & Third Term Victory", summary: "Narendra Modi won a historic third consecutive term as India's Prime Minister in 2024's general election — the world's largest democratic exercise with 640 million voters. His BJP-led NDA retained power despite a reduced majority.", type: 'gossip', date: 'Jun 2024' }]
  },
  'ne-yo': {
    avatar: av('Ne-Yo'),
    assets: [{ id: 'ne-yo-1', type: 'real_estate', name: 'Atlanta Home', description: "Ne-Yo's Atlanta home, where he has raised his family while continuing his music and acting career.", estimatedValue: 2, image: RE, likes: 520 }],
    gossip: [{ title: "So Sick to Songwriting Legend: Written for Everyone", summary: "Ne-Yo has written hits for Beyoncé (Irreplaceable), Rihanna (Let Me), and Mario before establishing himself as a solo artist with multiple platinum albums. He is widely considered one of the greatest R&B songwriters of the 2000s.", type: 'gossip', date: 'Jan 2006' }]
  },
  'nicki-minaj': {
    avatar: av('Nicki Minaj'),
    assets: [{ id: 'nicki-minaj-1', type: 'real_estate', name: 'Calabasas Mansion', description: "Nicki Minaj's Calabasas estate — a fitting home for the Queen of Rap in LA's celebrity suburb.", estimatedValue: 7, image: RE, likes: 1220 }],
    gossip: [{ title: "Pink Friday 2 & The Most-Charted Female Rapper in History", summary: "Nicki Minaj holds the record for most entries on the Billboard Hot 100 by a female rapper with 109 entries. Pink Friday 2 (2023) debuted at #1 — her first chart-topper in 13 years — and spawned the viral Super Freaky Girl remix.", type: 'gossip', date: 'Dec 2023' }]
  },
  'nicolas-cage': {
    avatar: av('Nicolas Cage'),
    assets: [{ id: 'nicolas-cage-1', type: 'real_estate', name: 'Las Vegas Mansion', description: "Cage's Las Vegas residence — one of his few remaining properties after selling his castle, islands, and numerous estates.", estimatedValue: 2, image: RE, likes: 520 }],
    gossip: [{ title: "From $150M Fortune to Bankruptcy: Hollywood's Most Extreme Spender", summary: "Nicolas Cage earned $150M in his career and spent it all — on 15 houses, a castle, a private island, dinosaur skulls, and a 67-million-year-old T-rex skull. He declared bankruptcy in 2009 and has worked constantly to pay off $14M in IRS debts.", type: 'controversy', date: 'Oct 2009' }]
  },
  'nikola-jokic': {
    avatar: av('Nikola Jokic'),
    assets: [{ id: 'nikola-jokic-1', type: 'real_estate', name: 'Denver Home', description: "Jokic's modest Denver home — reflecting his famously down-to-earth personality despite three MVP awards.", estimatedValue: 2, image: RE, likes: 520 }],
    gossip: [{ title: "Three MVPs & the Humble Champion Who Preferred Horses", summary: "Nikola Jokic won three NBA MVP awards and an NBA Championship with Denver (2023) — but is most famous for preferring his horses in Serbia to celebrity culture. He reportedly only learned he'd been selected in the NBA Draft through a TV highlight while eating McDonald's.", type: 'gossip', date: 'Jun 2023' }]
  },
  'novak-djokovic': {
    avatar: av('Novak Djokovic'),
    assets: [{ id: 'novak-djokovic-1', type: 'real_estate', name: 'Monte-Carlo Apartment', description: "Djokovic's Monte-Carlo base — close to the clay courts where he has collected multiple titles.", estimatedValue: 10, image: RE, likes: 1400 }],
    gossip: [{ title: "24 Grand Slams: The Undisputed GOAT of Tennis", summary: "Novak Djokovic surpassed Federer and Nadal's records to claim 24 Grand Slam titles — the most in men's singles history. His 2023 Australian Open deportation saga, related to COVID vaccination status, dominated global news for weeks.", type: 'gossip', date: 'Jan 2024' }]
  },
  'olivia-rodrigo': {
    avatar: av('Olivia Rodrigo'),
    assets: [{ id: 'olivia-rodrigo-1', type: 'real_estate', name: 'Los Angeles Home', description: "Olivia Rodrigo's LA home, purchased following the extraordinary success of her debut album.", estimatedValue: 3, image: RE, likes: 780 }],
    gossip: [{ title: "drivers license to GUTS: Gen Z's Defining Voice", summary: "Olivia Rodrigo's debut single drivers license broke the Spotify streaming record for first-week plays in 2021. GUTS (2023) debuted at #1 in 12 countries and spawned five top-10 singles, cementing her as the defining musical voice of Generation Z.", type: 'gossip', date: 'Sep 2023' }]
  },
  'oscar-de-la-hoya': {
    avatar: av('Oscar De La Hoya'),
    assets: [{ id: 'oscar-de-la-hoya-1', type: 'real_estate', name: 'South Pasadena Mansion', description: "De La Hoya's South Pasadena estate, close to Golden Boy Promotions' Los Angeles headquarters.", estimatedValue: 7, image: RE, likes: 1220 }],
    gossip: [{ title: "Golden Boy Promotions & the Billion-Dollar Boxing Empire", summary: "Oscar De La Hoya's Golden Boy Promotions became one of boxing's most powerful promotional companies, managing Saul 'Canelo' Alvarez among others. He has generated over $1 billion in revenue since founding the company in 2002.", type: 'gossip', date: 'Jun 2002' }]
  },
  'patrick-mahomes': {
    avatar: av('Patrick Mahomes'),
    assets: [
      { id: 'patrick-mahomes-1', type: 'real_estate', name: 'Kansas City Mansion', description: "Mahomes' sprawling Kansas City estate — close to Arrowhead Stadium and his Kansas City kingdom.", estimatedValue: 5, image: RE, likes: 1100 },
      { id: 'patrick-mahomes-2', type: 'sports_team', name: 'Kansas City Royals Minority Stake', description: "Mahomes' minority stake in the Kansas City Royals MLB franchise — purchased alongside Patrick Mahomes Sr.", estimatedValue: 50, image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=900&h=600&fit=crop', likes: 3200 }
    ],
    gossip: [{ title: "$503M Contract & Back-to-Back Super Bowl Champion", summary: "Patrick Mahomes signed a 10-year, $503M contract extension with Kansas City in 2020 — the richest contract in NFL history. He led the Chiefs to back-to-back Super Bowl victories in 2023 and 2024, cementing his claim as the greatest quarterback of his generation.", type: 'gossip', date: 'Feb 2024' }]
  },
  'paul-mccartney': {
    avatar: av('Paul McCartney'),
    assets: [
      { id: 'paul-mccartney-1', type: 'real_estate', name: 'Peasmarsh Estate, Sussex', description: "McCartney's private Sussex estate with organic farm — his longtime English country retreat.", estimatedValue: 15, image: RE, likes: 1700 }
    ],
    gossip: [{ title: "$1.2 Billion Catalogue & the Most Successful Songwriter in History", summary: "Paul McCartney is the most successful songwriter in music history with 32 #1 hit singles. His estimated £1.2 billion fortune includes music rights that generate $50M+ annually. He performed at Glastonbury at age 80 — the oldest headline act in its history.", type: 'gossip', date: 'Jun 2022' }]
  },
  'pele': {
    avatar: av('Pele'),
    assets: [{ id: 'pele-1', type: 'real_estate', name: 'Santos Penthouse (Heritage)', description: "Pelé's apartment in Santos, Brazil — overlooking the city and club that made him a global icon.", estimatedValue: 2, image: RE, likes: 720 }],
    gossip: [{ title: "Three World Cups & Eternal Greatness", summary: "Pelé won three FIFA World Cups (1958, 1962, 1970) and scored over 1,000 career goals. He died on December 29, 2022 aged 82, triggering an outpouring of global grief that confirmed his status as football's most universally beloved figure.", type: 'gossip', date: 'Dec 2022' }]
  },
  'penelope-cruz': {
    avatar: av('Penelope Cruz'),
    assets: [{ id: 'penelope-cruz-1', type: 'real_estate', name: 'Madrid Villa', description: "Penélope Cruz and Javier Bardem's elegant Madrid villa — their family home and Spanish base.", estimatedValue: 5, image: RE, likes: 1100 }],
    gossip: [{ title: "First Spanish Actress to Win an Oscar", summary: "Penélope Cruz won the Academy Award for Best Supporting Actress for Vicky Cristina Barcelona (2009), becoming the first Spanish actress to win an Oscar. Her role in Parallel Mothers (2021) earned her a second nomination.", type: 'gossip', date: 'Feb 2009' }]
  },
  'pete-sampras': {
    avatar: av('Pete Sampras'),
    assets: [{ id: 'pete-sampras-1', type: 'real_estate', name: 'Los Angeles Estate', description: "Sampras's Los Angeles estate where he lives in quiet retirement with his wife Bridgette Wilson.", estimatedValue: 7, image: RE, likes: 1220 }],
    gossip: [{ title: "14 Grand Slams & the Agassi Rivalry That Defined 1990s Tennis", summary: "Pete Sampras won 14 Grand Slam titles and held the World No.1 ranking for a record 286 weeks. His rivalry with Andre Agassi — opposite personalities who brought out the best in each other — remains the gold standard of tennis rivalry.", type: 'gossip', date: 'Sep 2002' }]
  },
  'peter-thiel': {
    avatar: av('Peter Thiel'),
    assets: [{ id: 'peter-thiel-1', type: 'real_estate', name: 'New Zealand Citizenship Estate', description: "Thiel's New Zealand countryside property — linked to his controversial citizenship granted in 2011.", estimatedValue: 15, image: RE, likes: 1700 }],
    gossip: [{ title: "Palantir, Founders Fund & the Libertarian Kingdom of New Zealand", summary: "Peter Thiel acquired New Zealand citizenship without living there, then purchased extensive land in the country as a doomsday retreat. His Palantir Technologies IPO in 2020 and Founders Fund portfolio value exceed $10 billion.", type: 'gossip', date: 'Jun 2017' }]
  },
  'phil-knight': {
    avatar: av('Phil Knight'),
    assets: [
      { id: 'phil-knight-1', type: 'real_estate', name: 'Oregon Estate', description: "Knight's sprawling Oregon estate near Beaverton — the home of Nike's world headquarters.", estimatedValue: 20, image: RE, likes: 2000 }
    ],
    gossip: [{ title: "Just Do It: From $50 to a $35 Billion Brand", summary: "Phil Knight co-founded Nike in 1964 selling shoes from the boot of a car. The brand grew into the world's most valuable sports company. His memoir Shoe Dog (2016) became a business bible with over 2 million copies sold.", type: 'gossip', date: 'Apr 2016' }]
  },
  'phil-mickelson': {
    avatar: av('Phil Mickelson'),
    assets: [{ id: 'phil-mickelson-1', type: 'real_estate', name: 'Rancho Santa Fe Home', description: "Lefty's Rancho Santa Fe, San Diego estate — his San Diego home and gambling hub.", estimatedValue: 8, image: RE, likes: 1280 }],
    gossip: [{ title: "$200M Gambling Losses & the LIV Golf Betrayal", summary: "Phil Mickelson admitted to $200M in lifetime gambling losses in a 2022 book, simultaneously facing backlash for LIV Golf comments calling Saudi Arabia's human rights record 'scary' while taking their money — one of golf's biggest self-inflicted PR disasters.", type: 'controversy', date: 'Feb 2022' }]
  },
  'pierce-brosnan': {
    avatar: av('Pierce Brosnan'),
    assets: [{ id: 'pierce-brosnan-1', type: 'real_estate', name: 'Malibu Beach House', description: "Pierce Brosnan's Malibu oceanfront estate with direct Pacific beach access.", estimatedValue: 7, image: RE, likes: 1220 }],
    gossip: [{ title: "Mamma Mia! & the Singing That Launched a Thousand Memes", summary: "Pierce Brosnan's enthusiastic but tuneless singing in Mamma Mia! (2008) became one of cinema's most beloved running jokes. Despite this, the film grossed $609M and he reprised the role in the 2018 sequel.", type: 'gossip', date: 'Jul 2008' }]
  },
  'pitbull': {
    avatar: av('Pitbull'),
    assets: [{ id: 'pitbull-1', type: 'real_estate', name: 'Miami Penthouse', description: "Mr. 305's Miami penthouse — a fitting home for the man who made Miami's culture global.", estimatedValue: 5, image: RE, likes: 1100 }],
    gossip: [{ title: "Alaska Exile & the Global Brand That Followed", summary: "Pitbull was 'exiled' to Kodiak, Alaska as a social media prank in 2012 — and went, turning it into a PR triumph. His partnership with Kodiak cemented his reputation as the savviest self-marketer in music.", type: 'gossip', date: 'Jul 2012' }]
  },
  'post-malone': {
    avatar: av('Post Malone'),
    assets: [{ id: 'post-malone-1', type: 'real_estate', name: 'Cottonwood Heights Compound, Utah', description: "Post Malone's extensive Utah compound with a custom skate park, indoor bowling alley, and recording studio.", estimatedValue: 3, image: RE, likes: 780 }],
    gossip: [{ title: "Rockstar to Country: The Most Genre-Fluid Artist in Pop", summary: "Post Malone's Beerbongs & Bentleys (2018) debuted with 9 simultaneous Billboard Hot 100 entries — a new record. His 2024 F-1 Trillion country album featured collaborations with Morgan Wallen and Luke Combs, proving his genre agnosticism.", type: 'gossip', date: 'Aug 2024' }]
  },
  'priyanka-chopra': {
    avatar: av('Priyanka Chopra'),
    assets: [{ id: 'priyanka-chopra-1', type: 'real_estate', name: 'Los Angeles Mansion', description: "Priyanka Chopra Jonas and Nick Jonas's elegant LA mansion — their family base.", estimatedValue: 20, image: RE, likes: 2000 }],
    gossip: [{ title: "Miss World to Global Entertainment Icon", summary: "Priyanka Chopra became the first Indian actress to lead a US primetime network drama with Quantico (2015-2018). Her marriage to Nick Jonas in 2018 created two 20M+ Instagram followers in one ceremony.", type: 'gossip', date: 'Dec 2018' }]
  },
  'queen-latifah': {
    avatar: av('Queen Latifah'),
    assets: [{ id: 'queen-latifah-1', type: 'real_estate', name: 'New Jersey Estate', description: "Queen Latifah's New Jersey estate close to her hometown of Newark.", estimatedValue: 4, image: RE, likes: 940 }],
    gossip: [{ title: "Ladies First: From Rap Pioneer to EGOT Contender", summary: "Queen Latifah was the first female rapper to receive a Grammy nomination and has since won a Grammy, two Screen Actors Guild Awards, and a Golden Globe. Her Oscar nomination for Chicago (2003) established her as one of entertainment's most complete talents.", type: 'gossip', date: 'Mar 2003' }]
  },
  'rafael-nadal': {
    avatar: av('Rafael Nadal'),
    assets: [{ id: 'rafael-nadal-1', type: 'real_estate', name: 'Mallorca Estate', description: "Rafa's stunning family estate in Porto Cristo, Mallorca — the island he grew up on and never truly left.", estimatedValue: 5, image: RE, likes: 1100 }],
    gossip: [{ title: "22 Grand Slams & the Farewell That Moved the World", summary: "Rafael Nadal announced his retirement from professional tennis in October 2024 aged 38, citing his ongoing hip and foot injuries. His 22 Grand Slams and 14 French Open titles cemented his legacy as the greatest clay-court player in history.", type: 'gossip', date: 'Oct 2024' }]
  },
  'ralph-lauren': {
    avatar: av('Ralph Lauren'),
    assets: [
      { id: 'ralph-lauren-1', type: 'real_estate', name: 'Bedford Farm, New York', description: "Lauren's 1,500-acre Bedford, New York estate — a working horse farm and the centrepiece of his American dream vision.", estimatedValue: 150, image: RE, likes: 9200 }
    ],
    gossip: [{ title: "$10 Billion from a Tie: The American Dream Made Literal", summary: "Ralph Lauren started his fashion empire selling ties from a drawer in the Empire State Building in 1967 with a $50,000 loan. He has since built a $10B+ global brand empire and donated over $100M to cancer research.", type: 'gossip', date: 'Jan 1970' }]
  },
  'ranveer-singh': {
    avatar: av('Ranveer Singh'),
    assets: [{ id: 'ranveer-singh-1', type: 'real_estate', name: 'Beaumonde Towers, Mumbai', description: "Ranveer and Deepika's luxurious sea-facing duplex in Beaumonde Towers, Prabhadevi, Mumbai.", estimatedValue: 22, image: RE, likes: 2120 }],
    gossip: [{ title: "Nude Photoshoot Controversy & Bollywood's Most Colourful Star", summary: "Ranveer Singh's nude photoshoot for Paper magazine (2022) triggered a police complaint in India for obscenity. His extravagant fashion choices, boundless energy, and blockbuster box office results make him Bollywood's most talked-about star.", type: 'controversy', date: 'Jul 2022' }]
  },
}
