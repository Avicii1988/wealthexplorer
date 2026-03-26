import type { Ext } from './extraCelebritiesExtended'
const RE = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&h=600&fit=crop'
const CA = 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=900&h=600&fit=crop'
const YA = 'https://images.unsplash.com/photo-1605281317010-fe5ffe798166?w=900&h=600&fit=crop'
const JT = 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=900&h=600&fit=crop'
const WT = 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=900&h=600&fit=crop'
const av = (n: string) => `https://ui-avatars.com/api/?name=${encodeURIComponent(n)}&background=1a1a1a&color=c9a84c&size=200&bold=true`
export const extras_01: Record<string, Ext> = {
  'adam-neumann': {
    avatar: av('Adam Neumann'),
    assets: [{ id: 'adam-neumann-1', type: 'real_estate', name: 'Gramercy Park Townhouse', description: "Neumann's Manhattan townhouse near Gramercy Park, sold after WeWork's collapse.", estimatedValue: 35, image: RE, likes: 2310 }],
    gossip: [{ title: "WeWork's $47B Collapse", summary: "Adam Neumann took WeWork from a $47 billion valuation to near-bankruptcy in 2019, forcing his resignation. The story became the subject of multiple documentaries and a TV series.", type: 'controversy', date: 'Sep 2019' }],
    relationships: { spouse: 'Rebekah Paltrow Neumann', children: ['Abbie Neumann', 'Bella Neumann', 'Leo Neumann', 'Ariel Neumann', 'Asha Neumann', 'Eli Neumann'] }
  },
  'adele': {
    avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Adele_2016.jpg/400px-Adele_2016.jpg',
    assets: [{ id: 'adele-1', type: 'real_estate', name: 'Beverly Hills Estate', description: "Adele's $10M Beverly Hills home purchased after her divorce from Simon Konecki.", estimatedValue: 10, image: RE, likes: 1450 }],
    gossip: [{ title: '30 Breaks Streaming Records', summary: "Adele's album 30 shattered first-week streaming records in 2021. Easy On Me became her fastest single to reach #1 in the UK and US, and the album sold over 1 million copies in its opening week.", type: 'gossip', date: 'Nov 2021' }]
  },
  'adriana-lima': {
    avatar: av('Adriana Lima'),
    assets: [{ id: 'adriana-lima-1', type: 'real_estate', name: 'Miami Beach Villa', description: "Adriana's waterfront villa in Miami Beach with private dock and ocean views.", estimatedValue: 5, image: RE, likes: 1100 }],
    gossip: [{ title: "20 Years as Victoria's Secret's Longest-Serving Angel", summary: "Adriana Lima walked the Victoria's Secret runway for 18 consecutive years from 1999 to 2018, becoming the brand's longest-serving Angel and earning up to $10.5M annually at her peak.", type: 'gossip', date: 'Nov 2018' }],
    relationships: { exSpouse: ['Marko Jarić'], partner: 'André Lemmers', children: ['Valentina Lima Jarić', 'Sienna Lima Jarić', 'Cyan Lima Lemmers'] }
  },
  'alessandra-ambrosio': {
    avatar: av('Alessandra Ambrosio'),
    assets: [{ id: 'alessandra-ambrosio-1', type: 'real_estate', name: 'Santa Monica Home', description: 'Modern Californian home in Santa Monica, minutes from the beach.', estimatedValue: 4, image: RE, likes: 840 }],
    gossip: [{ title: 'Gal Floripa Swimwear Empire', summary: "After retiring as a Victoria's Secret Angel, Alessandra co-founded Gal Floripa, a successful Brazilian-inspired swimwear brand sold globally through major fashion retailers.", type: 'gossip', date: 'Jun 2020' }],
    relationships: { exPartner: ['Jamie Mazur'], partner: 'Nicolo Oddi', children: ['Anja Louise Ambrosio Mazur', 'Noah Phoenix Ambrosio Mazur'] }
  },
  'alex-rodriguez': {
    avatar: av('Alex Rodriguez'),
    assets: [
      { id: 'alex-rodriguez-1', type: 'real_estate', name: 'Miami Waterfront Mansion', description: "A-Rod's palatial Coconut Grove, Miami estate with private dock and pool.", estimatedValue: 30, image: RE, likes: 2600 },
      { id: 'alex-rodriguez-2', type: 'jet', name: 'Gulfstream G650', description: "A-Rod's private Gulfstream jet used for business travel across the Americas.", estimatedValue: 65, image: JT, likes: 4110 }
    ],
    gossip: [{ title: 'Jennifer Lopez Split & Bennifer Returns', summary: "A-Rod's 2021 breakup with Jennifer Lopez just months before their wedding shocked fans. J-Lo swiftly reunited with Ben Affleck, later marrying him. A-Rod refocused on his sports investment empire.", type: 'gossip', date: 'Apr 2021' }],
    relationships: { exSpouse: ['Cynthia Scurtis'], exPartner: ['Jennifer Lopez', 'Kate Hudson'], children: ['Natasha Alexander Rodriguez', 'Ella Alexander Rodriguez'] }
  },
  'alexander-volkanovski': {
    avatar: av('Alexander Volkanovski'),
    assets: [{ id: 'alexander-volkanovski-1', type: 'real_estate', name: 'Wollongong Home', description: "Volkanovski's family home in Windang near Wollongong, where he trains with his team City Kickboxing.", estimatedValue: 1.2, image: RE, likes: 272 }],
    gossip: [{ title: 'Pound-for-Pound King: Three Wins Over Holloway', summary: "Alexander Volkanovski became the UFC's pound-for-pound #1 fighter after defeating Max Holloway three times. His blue-collar rise from fruit picker to champion is one of MMA's greatest stories.", type: 'gossip', date: 'Jul 2022' }],
    relationships: { spouse: 'Emma Volkanovski', children: ['Ariana Volkanovski', 'Airlie Volkanovski', 'Deja Volkanovski'] }
  },
  'alexei-navalny': {
    avatar: av('Alexei Navalny'),
    assets: [{ id: 'alexei-navalny-1', type: 'real_estate', name: 'Moscow Apartment', description: "Navalny's modest Moscow apartment, in stark contrast to Putin's palaces he exposed through his Anti-Corruption Foundation.", estimatedValue: 0.2, image: RE, likes: 212 }],
    gossip: [{ title: 'Death in an Arctic Prison Colony', summary: "Alexei Navalny, Putin's most prominent critic, died in February 2024 in a remote Arctic penal colony under mysterious circumstances. His death sparked international protests and global condemnation of the Kremlin.", type: 'controversy', date: 'Feb 2024' }],
    relationships: { spouse: 'Yulia Navalnaya', children: ['Dasha Navalnaya', 'Zahar Navalny'] }
  },
  'ali-banat': {
    avatar: av('Ali Banat'),
    assets: [{ id: 'ali-banat-1', type: 'real_estate', name: 'Western Sydney Home', description: "Ali's home in Western Sydney, sold to fund his MATW African charity before his death.", estimatedValue: 1, image: RE, likes: 260 }],
    gossip: [{ title: 'The Man Who Gave It All Away', summary: "Australian millionaire Ali Banat donated his entire fortune to build schools and hospitals in West Africa after being diagnosed with terminal cancer in 2015. He died in 2018 aged 32, leaving behind an extraordinary charitable legacy.", type: 'gossip', date: 'May 2018' }],
    relationships: { parents: ['Ramzy Banat', 'Lilian Banat'], siblings: ['Amira Banat', 'Hamza Banat'] }
  },
  'ali-bongo': {
    avatar: av('Ali Bongo'),
    assets: [{ id: 'ali-bongo-1', type: 'real_estate', name: 'Presidential Palace, Libreville', description: "The official residence and office of Gabon's president, overlooking the Atlantic Ocean.", estimatedValue: 50, image: RE, likes: 3200 }],
    gossip: [{ title: 'Overthrown by Military Coup', summary: "Ali Bongo Ondimba was ousted in a military coup in August 2023 — minutes after his disputed election victory was announced — ending 55 years of unbroken Bongo family rule in Gabon.", type: 'controversy', date: 'Aug 2023' }],
    relationships: { parents: ['Omar Bongo (†)', 'Patience Dabany'], spouse: 'Sylvia Bongo Ondimba', children: ['Noureddin Bongo Valentin'] }
  },
  'ali-hassan-mwinyi': {
    avatar: av('Ali Hassan Mwinyi'),
    assets: [{ id: 'ali-hassan-mwinyi-1', type: 'real_estate', name: 'Dar es Salaam Residence', description: "Former presidential residence in Dar es Salaam used during Mwinyi's 1985-1995 tenure.", estimatedValue: 2, image: RE, likes: 320 }],
    gossip: [{ title: "Architect of Tanzania's Economic Liberalisation", summary: "Ali Hassan Mwinyi, Tanzania's second president, reversed Julius Nyerere's socialist policies and opened the economy to private enterprise, earning the nickname Mzee Rukhsa — Mr Permissive.", type: 'gossip', date: 'Jan 1990' }],
    relationships: { spouse: 'Sitti Mwinyi', children: ['Haji Mwinyi', 'Rashida Mwinyi', 'Saad Mwinyi', 'Amina Mwinyi'] }
  },
  'alice-cooper': {
    avatar: av('Alice Cooper'),
    assets: [
      { id: 'alice-cooper-1', type: 'real_estate', name: 'Paradise Valley Estate', description: "Alice Cooper's grand Arizona estate with a golf simulator, home studio, and memorabilia vault.", estimatedValue: 3.5, image: RE, likes: 810 },
      { id: 'alice-cooper-2', type: 'car', name: 'Classic Car Collection', description: "Cooper's collection of vintage American muscle cars and custom vehicles.", estimatedValue: 1.2, image: CA, likes: 472 }
    ],
    gossip: [{ title: 'Still Shocking at 75', summary: "Alice Cooper pioneered theatrical rock in the 1970s with guillotines, boa constrictors, and fake blood on stage. Now in his mid-70s he still tours globally, outlasting and out-rocking generations of followers.", type: 'gossip', date: 'Jan 2023' }],
    relationships: { spouse: 'Sheryl Goddard', children: ['Calico Cooper', 'Dashiell Cooper', 'Sonora Rose Cooper'] }
  },
  'alkiviades-david': {
    avatar: av('Alkiviades David'),
    assets: [{ id: 'alkiviades-david-1', type: 'yacht', name: 'Mediterranean Superyacht', description: "David's luxury superyacht used for entertainment and business across the Mediterranean.", estimatedValue: 40, image: YA, likes: 2640 }],
    gossip: [{ title: 'Hologram USA & Crypto Billions', summary: "Greek billionaire Alkiviades David built his fortune through Hologram USA and streaming platform FilmOn, then expanded into cryptocurrency with substantial Filecoin investments during the 2021 bull run.", type: 'gossip', date: 'Mar 2021' }],
    relationships: { parents: ['Phillip David', 'Julia David'] }
  },
  'allen-iverson': {
    avatar: av('Allen Iverson'),
    assets: [{ id: 'allen-iverson-1', type: 'watch', name: 'Rolex Daytona Collection', description: "Iverson's iconic Rolex Daytona watches, a staple accessory throughout his playing career.", estimatedValue: 0.2, image: WT, likes: 412 }],
    gossip: [{ title: "The Practice Rant That Defined a Legacy", summary: "Allen Iverson's legendary 'We talkin' about practice?' press conference in 2002 became one of the most iconic moments in sports history, perfectly capturing his rebellious genius and turbulent Philadelphia career.", type: 'gossip', date: 'May 2002' }],
    relationships: { exSpouse: ['Tawanna Turner'], children: ['Tiaura Iverson', 'Allen Iverson Jr.', 'Messiah Iverson', 'Deuce Iverson', 'Dream Iverson'] }
  },
  'allu-arjun': {
    avatar: av('Allu Arjun'),
    assets: [
      { id: 'allu-arjun-1', type: 'real_estate', name: 'Jubilee Hills Bungalow', description: "Allu Arjun's luxury home in Jubilee Hills, Hyderabad's most exclusive celebrity neighbourhood.", estimatedValue: 8, image: RE, likes: 1280 },
      { id: 'allu-arjun-2', type: 'car', name: 'Rolls-Royce Cullinan', description: "The Stylish Star's Rolls-Royce Cullinan, regularly spotted in Hyderabad.", estimatedValue: 0.4, image: CA, likes: 624 }
    ],
    gossip: [{ title: 'Pushpa 2 Shatters Box-Office Records', summary: "Allu Arjun's Pushpa: The Rise (2021) grossed ₹365 crore and created a pan-India superstar. The sequel Pushpa 2: The Rule (2024) became the highest-grossing Indian film of all time.", type: 'gossip', date: 'Dec 2024' }],
    relationships: { parents: ['Allu Aravind', 'Nirmala Allu'], spouse: 'Sneha Reddy', children: ['Allu Arha', 'Ayaan Allu'] }
  },
  'aloe-blacc': {
    avatar: av('Aloe Blacc'),
    assets: [{ id: 'aloe-blacc-1', type: 'real_estate', name: 'Los Angeles Family Home', description: "Aloe Blacc's comfortable family home in a quiet Los Angeles suburban neighbourhood.", estimatedValue: 2.5, image: RE, likes: 550 }],
    gossip: [{ title: 'Wake Me Up: Avicii Collaboration Goes #1 in 22 Countries', summary: "Aloe Blacc's collaboration with Avicii on Wake Me Up became a global phenomenon in 2013, reaching #1 in 22 countries and introducing his soulful voice to hundreds of millions of new listeners.", type: 'gossip', date: 'Sep 2013' }],
    relationships: { spouse: 'Maya Jupiter' }
  },
  'alphonso-davies': {
    avatar: av('Alphonso Davies'),
    assets: [{ id: 'alphonso-davies-1', type: 'car', name: 'Mercedes-AMG GT', description: "Davies' sleek Mercedes-AMG GT, a gift to himself after signing his landmark Bayern Munich contract.", estimatedValue: 0.18, image: CA, likes: 411 }],
    gossip: [{ title: 'From Refugee Camp to Champions League Winner', summary: "Alphonso Davies was born in a Ghanaian refugee camp and moved to Edmonton, Canada as a child. By age 19 he was a Champions League winner with Bayern Munich — one of football's greatest modern stories.", type: 'gossip', date: 'Aug 2020' }],
    relationships: { parents: ['Debeah Davies', 'Victoria Davies'], partner: 'Jordyn Huitema' }
  },
  'alshon-jeffery': {
    avatar: av('Alshon Jeffery'),
    assets: [{ id: 'alshon-jeffery-1', type: 'real_estate', name: 'South Carolina Estate', description: "Jeffery's home estate in South Carolina where he returned after retiring from the NFL.", estimatedValue: 2.5, image: RE, likes: 550 }],
    gossip: [{ title: 'Super Bowl LII Touchdown Catch', summary: "Alshon Jeffery made the crucial opening touchdown catch in Super Bowl LII as the Philadelphia Eagles beat the New England Patriots 41-33. Career-ending injuries followed, cutting short a brilliant career.", type: 'gossip', date: 'Feb 2018' }],
    relationships: { spouse: 'Kristin Jeffery', children: ['Nava Jeffery'] }
  },
  'amal-clooney': {
    avatar: av('Amal Clooney'),
    assets: [{ id: 'amal-clooney-1', type: 'real_estate', name: 'Berkshire Manor', description: "The Clooneys' English country manor in Sonning-on-Thames, purchased in 2014 for £10M.", estimatedValue: 12, image: RE, likes: 920 }],
    gossip: [{ title: 'ICC Prosecutor & Global Human Rights Pioneer', summary: "Amal Clooney was appointed lead counsel to the International Criminal Court and has prosecuted cases involving ISIS war crimes, press freedom, and human trafficking. She is widely regarded as one of the world's most influential human rights lawyers.", type: 'gossip', date: 'Mar 2021' }],
    relationships: { spouse: 'George Clooney', children: ['Ella Clooney', 'Alexander Clooney'] }
  },
  'amancio-ortega': {
    avatar: av('Amancio Ortega'),
    assets: [
      { id: 'amancio-ortega-1', type: 'real_estate', name: 'Hacendado Stud Farm', description: "Ortega's sprawling equestrian estate in A Coruña, Spain, home to champion thoroughbreds.", estimatedValue: 200, image: RE, likes: 12200 },
      { id: 'amancio-ortega-2', type: 'yacht', name: 'Drizzle Superyacht', description: "Ortega's 66-metre superyacht, used for private retreats across the Atlantic.", estimatedValue: 90, image: YA, likes: 5600 }
    ],
    gossip: [{ title: 'Zara: From One Shop to World Domination', summary: "Amancio Ortega started Zara in 1975 in a small Galician town and built it into the world's largest fashion retailer through radical fast-fashion supply chain innovation, making himself Spain's richest person.", type: 'gossip', date: 'Jan 2000' }],
    relationships: { exSpouse: ['Rosalía Mera (†)'], spouse: 'Flora Pérez Marcote', children: ['Sandra Ortega Mera', 'Marcos Ortega Pérez', 'Marta Ortega Pérez'] }
  },
  'amitabh-bachchan': {
    avatar: av('Amitabh Bachchan'),
    assets: [{ id: 'amitabh-bachchan-1', type: 'real_estate', name: 'Jalsa Bungalow, Juhu', description: "Big B's iconic Juhu bungalow in Mumbai — a landmark of Bollywood history that fans visit daily.", estimatedValue: 15, image: RE, likes: 1700 }],
    gossip: [{ title: "Bollywood's Greatest Comeback", summary: "After financial ruin in the late 1990s, Amitabh Bachchan staged one of entertainment's greatest comebacks via Kaun Banega Crorepati (India's Who Wants to Be a Millionaire) and re-established himself as India's most bankable star.", type: 'gossip', date: 'Nov 2000' }],
    relationships: { parents: ['Harivansh Rai Bachchan (†)', 'Teji Bachchan (†)'], spouse: 'Jaya Bachchan', children: ['Abhishek Bachchan', 'Shweta Bachchan Nanda'] }
  },
  'amy-winehouse': {
    avatar: av('Amy Winehouse'),
    assets: [{ id: 'amy-winehouse-1', type: 'real_estate', name: 'Camden Town House', description: "Amy's beloved Camden home, now a pilgrimage site for fans from around the world.", estimatedValue: 1.5, image: RE, likes: 690 }],
    gossip: [{ title: 'Back to Black: 20 Million Copies Sold', summary: "Amy Winehouse died in July 2011 at age 27, leaving behind just two studio albums. Back to Black remains one of the best-selling albums in UK chart history with over 20 million copies sold worldwide.", type: 'controversy', date: 'Jul 2011' }],
    relationships: { parents: ['Mitchell Winehouse', 'Janis Winehouse'], exSpouse: ['Blake Fielder-Civil'], exPartner: ['Alex Clare', 'Reg Traviss'] }
  },
  'anderson-paak': {
    avatar: av('Anderson Paak'),
    assets: [{ id: 'anderson-paak-1', type: 'real_estate', name: 'Los Angeles Recording Studio', description: "Paak's private recording studio in LA where he crafts his genre-blending funk-soul sound.", estimatedValue: 2.5, image: RE, likes: 650 }],
    gossip: [{ title: 'Silk Sonic Grammy Sweep', summary: "Anderson .Paak and Bruno Mars formed Silk Sonic in 2021, winning the Grammy for Record of the Year with Leave the Door Open. Their retro soul project sparked a wave of neo-funk revivalism.", type: 'gossip', date: 'Feb 2022' }],
    relationships: { spouse: 'Jae Lin', children: ['Soul Rasheed Anderson', 'Shine Anderson'] }
  },
  'andile-ramaphosa': {
    avatar: av('Andile Ramaphosa'),
    assets: [{ id: 'andile-ramaphosa-1', type: 'real_estate', name: 'Johannesburg Northern Suburbs Home', description: "Andile's home in a prestigious Johannesburg northern suburb.", estimatedValue: 3, image: RE, likes: 580 }],
    gossip: [{ title: 'Mining Interests Under Parliamentary Scrutiny', summary: "Andile Ramaphosa, son of President Cyril Ramaphosa, faced parliamentary questions over his mining interests in Limpopo's platinum belt, drawing nepotism allegations from the Democratic Alliance and EFF.", type: 'controversy', date: 'Feb 2020' }],
    relationships: { parents: ['Cyril Ramaphosa', 'Tshepo Motsepe'] }
  },
  'andre-agassi': {
    avatar: av('Andre Agassi'),
    assets: [{ id: 'andre-agassi-1', type: 'real_estate', name: 'Las Vegas Compound', description: "Agassi's sprawling Las Vegas estate designed by celebrity architect Richard Landry.", estimatedValue: 22, image: RE, likes: 2120 }],
    gossip: [{ title: 'Open: The Crystal Meth Confession', summary: "In his 2009 autobiography Open, Agassi admitted to using crystal meth, hating tennis, and wearing a hairpiece during his 1990 French Open win. The book became one of the greatest sports memoirs ever written.", type: 'gossip', date: 'Nov 2009' }],
    relationships: { exSpouse: ['Brooke Shields'], spouse: 'Steffi Graf', children: ['Jaden Gil Agassi', 'Jaz Elle Agassi'] }
  },
  'andrea-bocelli': {
    avatar: av('Andrea Bocelli'),
    assets: [{ id: 'andrea-bocelli-1', type: 'real_estate', name: 'Forte dei Marmi Villa', description: "Bocelli's private Tuscany estate on the coast at Forte dei Marmi — his lifelong family home.", estimatedValue: 12, image: RE, likes: 1520 }],
    gossip: [{ title: 'Music for Hope: 28 Million Viewers on Easter', summary: "Andrea Bocelli's solo Easter 2020 concert in Milan's empty Duomo cathedral drew 28 million live viewers worldwide, becoming a global symbol of hope during COVID-19 lockdowns.", type: 'gossip', date: 'Apr 2020' }],
    relationships: { exSpouse: ['Enrica Cenzatti'], spouse: 'Veronica Berti', children: ['Amos Bocelli', 'Matteo Bocelli', 'Virginia Bocelli'] }
  },
  'andrey-melnichenko': {
    avatar: av('Andrey Melnichenko'),
    assets: [
      { id: 'andrey-melnichenko-1', type: 'yacht', name: 'Motor Yacht A', description: "The extraordinary 119-metre superyacht designed by Philippe Starck — one of the most distinctive vessels ever built.", estimatedValue: 300, image: YA, likes: 18200 },
      { id: 'andrey-melnichenko-2', type: 'jet', name: 'Boeing Business Jet', description: "Melnichenko's customised Boeing BBJ, one of the most luxurious private aircraft ever configured.", estimatedValue: 120, image: JT, likes: 7400 }
    ],
    gossip: [{ title: '$700M Assets Seized After Ukraine Invasion', summary: "Following Russia's 2022 invasion of Ukraine, the EU froze Melnichenko's assets. His iconic sailing yacht A and motor yacht A were both seized at ports in Italy and Germany.", type: 'controversy', date: 'Mar 2022' }],
    relationships: { spouse: 'Aleksandra Nikolić' }
  },
  'andy-murray': {
    avatar: av('Andy Murray'),
    assets: [{ id: 'andy-murray-1', type: 'real_estate', name: 'Surrey Family Estate', description: "Murray's Surrey estate with indoor tennis court, gym, and training facilities.", estimatedValue: 3, image: RE, likes: 780 }],
    gossip: [{ title: 'Hip Resurfacing & the Greatest Sports Comeback', summary: "Andy Murray had a full hip resurfacing operation in 2019 and staged a remarkable return to win ATP titles. His refusal to retire despite chronic pain made him a global inspiration for resilience.", type: 'gossip', date: 'Jan 2019' }],
    relationships: { parents: ['Judy Murray', 'Willie Murray'], spouse: 'Kim Sears', siblings: ['Jamie Murray'], children: ['Sophia Murray', 'Edie Murray', 'Teddy Murray', 'Lola Murray'] }
  },
  'angela-merkel': {
    avatar: av('Angela Merkel'),
    assets: [{ id: 'angela-merkel-1', type: 'real_estate', name: 'Uckermark Country Retreat', description: "Merkel's modest weekend home in the Uckermark region of Brandenburg, Germany.", estimatedValue: 0.8, image: RE, likes: 448 }],
    gossip: [{ title: '16 Years at the Helm of Europe', summary: "Angela Merkel served as German Chancellor for 16 years (2005–2021), navigating the 2008 financial crisis, eurozone debt crisis, and refugee crisis. She retired in 2021 to near-universal respect.", type: 'gossip', date: 'Dec 2021' }],
    relationships: { exSpouse: ['Ulrich Merkel'], spouse: 'Joachim Sauer' }
  },
  'angelina-jolie': {
    avatar: av('Angelina Jolie'),
    assets: [{ id: 'angelina-jolie-1', type: 'real_estate', name: 'Los Feliz Craftsman Mansion', description: "Jolie's 11,000 sq ft craftsman mansion in Los Feliz, Los Angeles.", estimatedValue: 25, image: RE, likes: 2300 }],
    gossip: [{ title: 'Château Miraval: The $500M Divorce War', summary: "Angelina Jolie and Brad Pitt's legal battle over the $500M Château Miraval wine estate in Provence became one of Hollywood's most protracted divorces, with ownership disputes still unresolved years later.", type: 'controversy', date: 'Sep 2022' }],
    relationships: { parents: ['Jon Voight', 'Marcheline Bertrand (†)'], exSpouse: ['Jonny Lee Miller', 'Billy Bob Thornton', 'Brad Pitt'], siblings: ['James Haven'], children: ['Maddox Chivan', 'Zahara Marley', 'Pax Thien', 'Shiloh Nouvel', 'Vivienne Marcheline', 'Knox Leon'] }
  },
  'anitta': {
    avatar: av('Anitta'),
    assets: [{ id: 'anitta-1', type: 'real_estate', name: 'Barra da Tijuca Penthouse', description: "Anitta's glamorous penthouse in Barra da Tijuca, Rio de Janeiro, with panoramic ocean views.", estimatedValue: 3.5, image: RE, likes: 1010 }],
    gossip: [{ title: 'First Brazilian Artist to Top Spotify Global', summary: "Anitta won the Latin Grammy for Best Urban Fusion in 2022 and became the first Brazilian artist to reach #1 on Spotify's Global chart with Envolver, cementing her status as Latin music's biggest female star.", type: 'gossip', date: 'Mar 2022' }],
    relationships: { exSpouse: ['Vitrino Carioca', 'Thiago Magalhães'] }
  },
  'ann-widdecombe': {
    avatar: av('Ann Widdecombe'),
    assets: [{ id: 'ann-widdecombe-1', type: 'real_estate', name: 'Dartmoor Cottage', description: "Widdecombe's beloved rural retreat on Dartmoor in Devon, England.", estimatedValue: 0.6, image: RE, likes: 336 }],
    gossip: [{ title: 'Strictly, Celebrity Big Brother & Brexit MEP', summary: "Ann Widdecombe entertained Britain on Strictly Come Dancing in 2010, won Celebrity Big Brother in 2018, then became a Brexit Party MEP in 2019 — proving herself one of UK politics' most enduring characters.", type: 'gossip', date: 'Jun 2019' }],
    relationships: { parents: ['James Murray Widdecombe', 'Rita Noreen Plummer'] }
  },
  'anna-kournikova': {
    avatar: av('Anna Kournikova'),
    assets: [{ id: 'anna-kournikova-1', type: 'real_estate', name: 'Star Island Estate, Miami', description: "Kournikova's waterfront Star Island home in Miami, shared with long-term partner Enrique Iglesias.", estimatedValue: 15, image: RE, likes: 1900 }],
    gossip: [{ title: "The World's Most Googled Athlete", summary: "Despite never winning a WTA singles title, Anna Kournikova was the most-searched athlete on the early internet. She has three children with Enrique Iglesias and maintains a very private life.", type: 'gossip', date: 'Jun 2004' }],
    relationships: { partner: 'Enrique Iglesias', children: ['Nicholas Iglesias', 'Lucy Iglesias', 'Mary Iglesias'] }
  },
  'anna-netrebko': {
    avatar: av('Anna Netrebko'),
    assets: [{ id: 'anna-netrebko-1', type: 'real_estate', name: 'Vienna Grand Apartment', description: "Netrebko's Viennese apartment in the city's historic First District — her European artistic base.", estimatedValue: 4, image: RE, likes: 740 }],
    gossip: [{ title: 'Dropped by Met Opera Over Putin Stance', summary: "Anna Netrebko was dropped by the Metropolitan Opera in March 2022 after refusing to publicly denounce Vladimir Putin following Russia's invasion of Ukraine. Many European opera houses followed suit.", type: 'controversy', date: 'Mar 2022' }],
    relationships: { exSpouse: ['Erwin Schrott'], spouse: 'Yusif Eyvazov', children: ['Tiago Aroa Schrott'] }
  },
  'anne-hathaway': {
    avatar: av('Anne Hathaway'),
    assets: [{ id: 'anne-hathaway-1', type: 'real_estate', name: 'Brooklyn Park Slope Townhouse', description: "Hathaway's elegant brownstone townhouse in Park Slope, Brooklyn, purchased with husband Adam Shulman.", estimatedValue: 3.7, image: RE, likes: 822 }],
    gossip: [{ title: "Hathahaters to Hathaway: The Internet's Greatest Redemption Arc", summary: "Anne Hathaway overcame an inexplicable 2010s internet backlash to become one of Hollywood's most acclaimed actresses. Her Oscar for Les Misérables and recent roles in Armageddon Time and WeCrashed completed her rehabilitation.", type: 'gossip', date: 'Jan 2023' }],
    relationships: { spouse: 'Adam Shulman', children: ['Jonathan Rosebanks Shulman', 'Jack Shulman'] }
  },
  'anne-hidalgo': {
    avatar: av('Anne Hidalgo'),
    assets: [{ id: 'anne-hidalgo-1', type: 'real_estate', name: "Hôtel de Ville Official Residence", description: "The official mayoral suite at Paris's Hôtel de Ville, used by the Mayor of Paris.", estimatedValue: 8, image: RE, likes: 880 }],
    gossip: [{ title: 'Car-Free Paris & the 2024 Olympic Transformation', summary: "Mayor Anne Hidalgo removed 60% of car lanes, added hundreds of kilometres of cycle paths, and cleaned the River Seine for swimming during the Paris 2024 Olympics — transforming the city's public spaces.", type: 'gossip', date: 'Jul 2024' }],
    relationships: { exSpouse: ['Manuel Valls'], spouse: 'Jean-Marc Germain' }
  },
}
