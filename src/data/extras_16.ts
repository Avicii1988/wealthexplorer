import type { Ext } from './extraCelebritiesExtended'
const RE = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&h=600&fit=crop'
const CA = 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=900&h=600&fit=crop'
const YA = 'https://images.unsplash.com/photo-1605281317010-fe5ffe798166?w=900&h=600&fit=crop'
const JT = 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=900&h=600&fit=crop'
const WT = 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=900&h=600&fit=crop'
const av = (n: string) => `https://ui-avatars.com/api/?name=${encodeURIComponent(n)}&background=1a1a1a&color=c9a84c&size=200&bold=true`
export const extras_16: Record<string, Ext> = {
  'sylvester-stallone': {
    avatar: av('Sylvester Stallone'),
    assets: [{ id: 'sylvester-stallone-1', type: 'real_estate', name: 'Palm Beach Mansion', description: "Stallone's Palm Beach estate — purchased after his divorce from Jennifer Flavin and sale of his California home.", estimatedValue: 35, image: RE, likes: 3100 }],
    gossip: [{ title: "Tulsa King & the 70s Action Legend Who Keeps Reinventing", summary: "Sylvester Stallone launched Tulsa King on Paramount+ in 2022, becoming a hit for a new generation of fans. His Rocky and Rambo franchises continue to generate revenue 45 years after their creation — a Hollywood record.", type: 'gossip', date: 'Nov 2022' }]
  },
  'sza': {
    avatar: av('SZA'),
    assets: [{ id: 'sza-1', type: 'real_estate', name: 'Los Angeles Home', description: "SZA's serene LA home where she creates music and retreats between relentless touring.", estimatedValue: 3, image: RE, likes: 780 }],
    gossip: [{ title: "SOS: The R&B Album That Redefined a Genre", summary: "SZA's SOS (2022) spent 10 weeks at #1 on the Billboard 200 — the longest run at #1 by a female artist since 2011. The album's blend of genres and emotional rawness made it the most acclaimed R&B record of the decade.", type: 'gossip', date: 'Dec 2022' }]
  },
  'the-weeknd': {
    avatar: av('The Weeknd'),
    assets: [
      { id: 'the-weeknd-1', type: 'real_estate', name: 'Hidden Hills Estate', description: "The Weeknd's Hidden Hills, California compound — a private sanctuary for the reclusive Canadian superstar.", estimatedValue: 21, image: RE, likes: 2060 }
    ],
    gossip: [{ title: "Super Bowl Halftime & 75 Million Albums Sold", summary: "The Weeknd's 2021 Super Bowl halftime show — performed without guest appearances — was watched by 91 million viewers and praised as one of the greatest NFL halftime shows ever. He has sold over 75 million albums equivalent worldwide.", type: 'gossip', date: 'Feb 2021' }]
  },
  'tiger-woods': {
    avatar: av('Tiger Woods'),
    assets: [
      { id: 'tiger-woods-1', type: 'real_estate', name: 'Jupiter Island Estate', description: "Tiger's Jupiter Island, Florida estate with a 3,500 sq ft gym, a 150-yard golf green, and private ocean access.", estimatedValue: 55, image: RE, likes: 4700 }
    ],
    gossip: [{ title: "The Masters Return: Greatest Comeback in Sport", summary: "Tiger Woods won the 2019 Masters — his first major in 11 years, following knee surgeries, a DUI arrest, and public infidelity scandals — in what President Obama called 'one of the greatest comebacks in any sport I have ever seen'.", type: 'gossip', date: 'Apr 2019' }]
  },
  'tim-cook': {
    avatar: av('Tim Cook'),
    assets: [{ id: 'tim-cook-1', type: 'real_estate', name: 'Palo Alto Home', description: "Cook's modest Palo Alto home — a contrast to Apple's $5 billion spaceship campus he presides over.", estimatedValue: 1.9, image: RE, likes: 514 }],
    gossip: [{ title: "Apple Park to $3 Trillion: The Quiet CEO Who Surpassed Jobs", summary: "Tim Cook was handed Apple in 2011 when many doubted he could follow Steve Jobs. Under his leadership, Apple became the first company in history to reach a $3 trillion market capitalisation — three times what it was worth when he took over.", type: 'gossip', date: 'Jan 2022' }]
  },
  'tim-duncan': {
    avatar: av('Tim Duncan'),
    assets: [{ id: 'tim-duncan-1', type: 'real_estate', name: 'San Antonio Estate', description: "Tim Duncan's San Antonio estate — his home through five championships and two decades with the Spurs.", estimatedValue: 4, image: RE, likes: 940 }],
    gossip: [{ title: "The Big Fundamental: Five Rings, Zero Drama", summary: "Tim Duncan won five NBA Championships with San Antonio Spurs across three decades and is widely regarded as the greatest power forward — and possibly the greatest winning player — in NBA history. He was never ejected from a game in 19 seasons.", type: 'gossip', date: 'Jun 2014' }]
  },
  'tom-brady': {
    avatar: av('Tom Brady'),
    assets: [
      { id: 'tom-brady-1', type: 'real_estate', name: 'Indian Creek Island Estate', description: "Brady's $37M Indian Creek Island, Miami mansion — known as 'Billionaires Bunker'. Features 7 bedrooms, a pool, and a boat dock.", estimatedValue: 37, image: RE, likes: 3010 },
      { id: 'tom-brady-2', type: 'jet', name: 'Gulfstream G650', description: "Brady's Gulfstream G650 private jet, used during and after his playing career for business travel.", estimatedValue: 65, image: JT, likes: 4110 }
    ],
    gossip: [{ title: "Seven Super Bowls & the Divorce That Followed", summary: "Tom Brady won seven Super Bowl rings — more than any NFL franchise — before retiring in February 2023. His divorce from Gisele Bündchen in 2022, reportedly triggered by his unretirement, became one of sport's most publicly discussed separations.", type: 'gossip', date: 'Oct 2022' }]
  },
  'tom-cruise': {
    avatar: av('Tom Cruise'),
    assets: [{ id: 'tom-cruise-1', type: 'real_estate', name: 'Telluride Mountain Estate', description: "Tom's Telluride, Colorado ski estate — his mountainside retreat between globe-trotting Mission Impossible shoots.", estimatedValue: 12, image: RE, likes: 1520 }],
    gossip: [{ title: "Top Gun: Maverick's $1.5B & Hollywood's Last True Movie Star", summary: "Top Gun: Maverick (2022) grossed $1.5 billion worldwide — the highest-grossing film of Cruise's career after 40 years in Hollywood. His commitment to performing his own stunts, including hanging from a plane at 25,000 feet, remains unparalleled.", type: 'gossip', date: 'Jun 2022' }]
  },
  'tom-hanks': {
    avatar: av('Tom Hanks'),
    assets: [{ id: 'tom-hanks-1', type: 'real_estate', name: 'Pacific Palisades Home', description: "Tom Hanks and Rita Wilson's Pacific Palisades family compound — one of LA's most beloved celebrity homes.", estimatedValue: 26, image: RE, likes: 2360 }],
    gossip: [{ title: "America's Dad: Two Consecutive Oscars & Beloved Typewriter Collection", summary: "Tom Hanks is one of two actors to win consecutive Academy Awards for Best Actor (Philadelphia, 1994; Forrest Gump, 1995). He collects vintage typewriters and sends personalised letters to fans — making him Hollywood's most genuinely beloved figure.", type: 'gossip', date: 'Mar 1995' }]
  },
  'tony-parker': {
    avatar: av('Tony Parker'),
    assets: [{ id: 'tony-parker-1', type: 'real_estate', name: 'Lyon Castle, France', description: "Parker's historic castle in the Lyon region of France — a symbol of his French pride and transatlantic success.", estimatedValue: 5, image: RE, likes: 1100 }],
    gossip: [{ title: "ASVEL & Building French Basketball from the Ground Up", summary: "Tony Parker co-owns LDLC ASVEL — one of Europe's top basketball clubs based in Lyon — and has invested heavily in developing French basketball talent. His four NBA championships with San Antonio made him France's greatest ever basketball export.", type: 'gossip', date: 'Jun 2018' }]
  },
  'travis-kalanick': {
    avatar: av('Travis Kalanick'),
    assets: [{ id: 'travis-kalanick-1', type: 'real_estate', name: 'Hollywood Hills Home', description: "Kalanick's Hollywood Hills home — purchased after his forced resignation from Uber and subsequent CloudKitchens venture.", estimatedValue: 7, image: RE, likes: 1220 }],
    gossip: [{ title: "Uber's $82B IPO & the Toxic Culture That Cost Him His Job", summary: "Travis Kalanick built Uber from a $200K seed round to an $82B IPO — one of history's greatest startup runs. A toxic workplace culture exposed by whistleblower Susan Fowler's 2017 blog post led to his forced resignation.", type: 'controversy', date: 'Jun 2017' }]
  },
  'travis-scott': {
    avatar: av('Travis Scott'),
    assets: [
      { id: 'travis-scott-1', type: 'real_estate', name: 'Houston Estate', description: "Travis Scott's sprawling Houston compound — a tribute to the city that shaped his sound.", estimatedValue: 6, image: RE, likes: 1160 }
    ],
    gossip: [{ title: "Astroworld Tragedy & the Road Back", summary: "The Astroworld Festival crowd crush in November 2021 killed 10 people and injured hundreds. Travis Scott faced widespread criticism for continuing to perform as the crisis unfolded. He settled thousands of lawsuits and has since attempted to rebuild his public image.", type: 'controversy', date: 'Nov 2021' }]
  },
  'tyra-banks': {
    avatar: av('Tyra Banks'),
    assets: [{ id: 'tyra-banks-1', type: 'real_estate', name: 'Los Angeles Home', description: "Tyra Banks's stylish Los Angeles home — her base for BanksWorld and her entertainment business empire.", estimatedValue: 7, image: RE, likes: 1220 }],
    gossip: [{ title: "ANTM, America's Next Top Model & the Business of Smizing", summary: "Tyra Banks created and hosted America's Next Top Model for 24 seasons, single-handedly defining a generation's understanding of modelling. Her 'smize' (smile with your eyes) concept became one of pop culture's most lasting coinages.", type: 'gossip', date: 'May 2003' }]
  },
  'tyson-fury': {
    avatar: av('Tyson Fury'),
    assets: [{ id: 'tyson-fury-1', type: 'real_estate', name: 'Morecambe Bay Estate', description: "The Gypsy King's Lancashire estate overlooking Morecambe Bay — his primary UK base.", estimatedValue: 4, image: RE, likes: 940 }],
    gossip: [{ title: "Rising from Depression to Undisputed Champion", summary: "Tyson Fury publicly battled severe depression and gained 12 stone after dethroning Wladimir Klitschko in 2015. His recovery and return to become WBC Heavyweight Champion — then undisputed champion — is widely regarded as sport's most inspiring mental health comeback story.", type: 'gossip', date: 'Feb 2020' }]
  },
  'usain-bolt': {
    avatar: av('Usain Bolt'),
    assets: [{ id: 'usain-bolt-1', type: 'real_estate', name: 'Kingston Estate', description: "Bolt's private Kingston estate — close to the Jamaican national stadium and his training base.", estimatedValue: 5, image: RE, likes: 1100 }],
    gossip: [{ title: "9.58: The 100m World Record That May Never Fall", summary: "Usain Bolt set the 100m world record of 9.58 seconds at the 2009 World Championships — a time so fast that no runner has come within 0.06 seconds of it in 15 years. His three consecutive Olympic 100m/200m doubles (2008, 2012, 2016) may never be matched.", type: 'gossip', date: 'Aug 2009' }]
  },
  'usher': {
    avatar: av('Usher'),
    assets: [{ id: 'usher-1', type: 'real_estate', name: 'Las Vegas Penthouse', description: "Usher's Las Vegas penthouse — his base during his record-breaking Park MGM residency.", estimatedValue: 3, image: RE, likes: 780 }],
    gossip: [{ title: "Super Bowl Halftime & the Las Vegas Record", summary: "Usher performed at the 2024 Super Bowl LVIII halftime show in Las Vegas with a 30-minute set featuring 40 performers. His Park MGM residency was the highest-grossing Las Vegas residency in history at the time.", type: 'gossip', date: 'Feb 2024' }]
  },
  'venus-williams': {
    avatar: av('Venus Williams'),
    assets: [{ id: 'venus-williams-1', type: 'real_estate', name: 'Palm Beach Gardens Home', description: "Venus Williams's Palm Beach Gardens, Florida home — close to her tennis academy.", estimatedValue: 4, image: RE, likes: 940 }],
    gossip: [{ title: "Equal Pay at Wimbledon: The Battle That Changed Tennis", summary: "Venus Williams campaigned for equal prize money at Wimbledon for years before it was finally granted in 2007. Her advocacy — backed by a landmark letter to The Times — directly improved earnings for every female player since.", type: 'gossip', date: 'Jun 2007' }]
  },
  'vin-diesel': {
    avatar: av('Vin Diesel'),
    assets: [{ id: 'vin-diesel-1', type: 'real_estate', name: 'Atlanta Estate', description: "Vin Diesel's Atlanta compound — his production base for the Fast & Furious franchise.", estimatedValue: 5, image: RE, likes: 1100 }],
    gossip: [{ title: "Fast & Furious: From $38M to $7 Billion Franchise", summary: "Vin Diesel helped relaunch the Fast & Furious franchise in 2009 with Fast Five, turning a $38M original film into a $7+ billion global franchise. He serves as producer, star, and de facto creative director of one of Hollywood's most profitable IPs.", type: 'gossip', date: 'Apr 2011' }]
  },
  'viola-davis': {
    avatar: av('Viola Davis'),
    assets: [{ id: 'viola-davis-1', type: 'real_estate', name: 'Toluca Lake Home', description: "Viola Davis's Toluca Lake, Los Angeles home — purchased as her career entered its extraordinary final phase.", estimatedValue: 4, image: RE, likes: 940 }],
    gossip: [{ title: "EGOT: Only the Second Black Woman in History", summary: "Viola Davis became only the second Black woman to achieve EGOT status (Emmy, Grammy, Oscar, Tony) when she won a Grammy for her memoir Finding Me in 2023. Her Oscar for Fences (2017) made her the most-awarded Black actress in Academy Award history.", type: 'gossip', date: 'Feb 2023' }]
  },
  'virat-kohli': {
    avatar: av('Virat Kohli'),
    assets: [
      { id: 'virat-kohli-1', type: 'real_estate', name: 'DLF Golf Course Apartment, Gurgaon', description: "Kohli's luxury apartment in Gurgaon — one of several premium properties in his real estate portfolio.", estimatedValue: 8, image: RE, likes: 1280 }
    ],
    gossip: [{ title: "ODI World Cup Winner at Last: 2023 India's Triumph", summary: "Virat Kohli finally won the ICC ODI World Cup with India in 2023 after years of near-misses. He scored 765 runs in the tournament — a record — and performed across the knockout stages to end India's 12-year wait for the trophy.", type: 'gossip', date: 'Nov 2023' }]
  },
  'vladimir-putin': {
    avatar: av('Vladimir Putin'),
    assets: [
      { id: 'vladimir-putin-1', type: 'real_estate', name: "Putin's Palace, Cape Idokopas", description: "The $1.35 billion Black Sea estate exposed by Alexei Navalny's Anti-Corruption Foundation — the most extravagant undisclosed presidential residence in the world.", estimatedValue: 1350, image: RE, likes: 81200 }
    ],
    gossip: [{ title: "The $1.35B Palace That Navalny Exposed", summary: "Navalny's documentary exposing Putin's secret Black Sea palace garnered over 100 million YouTube views in a week. The Kremlin denied ownership. Putin's actual net worth remains opaque, with estimates ranging from $40B to $200B held through proxies.", type: 'controversy', date: 'Jan 2021' }]
  },
  'warren-buffett': {
    avatar: av('Warren Buffett'),
    assets: [
      { id: 'warren-buffett-1', type: 'real_estate', name: 'Omaha Family Home', description: "Buffett's modest Omaha, Nebraska home purchased in 1958 for $31,500 — his primary residence for 65 years.", estimatedValue: 1.4, image: RE, likes: 784 }
    ],
    gossip: [{ title: "$50 Billion Pledge: The Greatest Philanthropic Commitment in History", summary: "Warren Buffett has pledged over $50 billion to the Bill & Melinda Gates Foundation and his children's foundations — the largest philanthropic commitment in history. He still lives in the same Omaha house he bought in 1958.", type: 'gossip', date: 'Jun 2006' }]
  },
  'wayne-gretzky': {
    avatar: av('Wayne Gretzky'),
    assets: [{ id: 'wayne-gretzky-1', type: 'real_estate', name: 'Thousand Oaks Estate', description: "Gretzky's Thousand Oaks, California estate — his home since retiring to the US after his playing career.", estimatedValue: 8, image: RE, likes: 1280 }],
    gossip: [{ title: "2,857 Points: A Record That Cannot Be Broken", summary: "Wayne Gretzky scored 2,857 career NHL points — more points than any other player has scored in goals alone. He is the only player in NHL history to score 200 points in a single season, achieving it four times.", type: 'gossip', date: 'Apr 1999' }]
  },
  'wayne-rooney': {
    avatar: av('Wayne Rooney'),
    assets: [{ id: 'wayne-rooney-1', type: 'real_estate', name: 'Cheshire Mansion', description: "Rooney's grand Cheshire mansion — his family home for over a decade of his Manchester United tenure.", estimatedValue: 4.5, image: RE, likes: 1070 }],
    gossip: [{ title: "England's All-Time Top Scorer & the Plymouth Argyle Saga", summary: "Wayne Rooney became England's all-time top scorer with 53 goals and scored 253 for Manchester United — both records at the time. His management career took a dramatic turn as Plymouth Argyle manager in 2023 before a rapid departure after one season.", type: 'gossip', date: 'Nov 2023' }]
  },
  'whitney-wolfe-herd': {
    avatar: av('Whitney Wolfe Herd'),
    assets: [{ id: 'whitney-wolfe-herd-1', type: 'real_estate', name: 'Austin Home', description: "Whitney Wolfe Herd's Austin, Texas home — the city where Bumble's headquarters is based.", estimatedValue: 8, image: RE, likes: 1280 }],
    gossip: [{ title: "Bumble's $13B IPO & the Dating App That Made Women Move First", summary: "Whitney Wolfe Herd founded Bumble in 2014 after leaving Tinder following a sexual harassment lawsuit. Her 2021 IPO valued the company at $13 billion, making her the world's youngest female self-made billionaire at 31.", type: 'gossip', date: 'Feb 2021' }]
  },
  'will-smith': {
    avatar: av('Will Smith'),
    assets: [
      { id: 'will-smith-1', type: 'real_estate', name: 'Calabasas Estate', description: "Will Smith and Jada Pinkett Smith's sprawling Calabasas compound — one of the most photographed celebrity homes in America.", estimatedValue: 42, image: RE, likes: 4020 }
    ],
    gossip: [{ title: "The Slap: Oscar Night's Most Watched Moment", summary: "Will Smith slapped presenter Chris Rock at the 2022 Academy Awards after a joke about his wife Jada's alopecia. The incident was watched by 16 million US viewers and led to a 10-year ban from the Oscars — the most dramatic moment in the ceremony's history.", type: 'controversy', date: 'Mar 2022' }]
  },
}
