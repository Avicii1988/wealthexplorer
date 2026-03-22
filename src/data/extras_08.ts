import type { Ext } from './extraCelebritiesExtended'
const RE = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&h=600&fit=crop'
const CA = 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=900&h=600&fit=crop'
const JT = 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=900&h=600&fit=crop'
const av = (n: string) => `https://ui-avatars.com/api/?name=${encodeURIComponent(n)}&background=1a1a1a&color=c9a84c&size=200&bold=true`
export const extras_08: Record<string, Ext> = {
  'j-balvin': {
    avatar: av('J Balvin'),
    assets: [{ id: 'j-balvin-1', type: 'real_estate', name: 'Medellín Penthouse', description: "J Balvin's luxury penthouse in his hometown of Medellín, Colombia — the city he helped put on the global music map.", estimatedValue: 4, image: RE, likes: 940 }],
    gossip: [{ title: "Mi Gente: 4 Billion Streams & Reggaeton Goes Global", summary: "J Balvin's Mi Gente became the first reggaeton song to hit 1 billion YouTube views in 2017. He has since broken records at Coachella as the first Latin artist to headline the festival, cementing Colombia's place in global pop culture.", type: 'gossip', date: 'Aug 2017' }]
  },
  'j-cole': {
    avatar: av('J Cole'),
    assets: [{ id: 'j-cole-1', type: 'real_estate', name: 'Fayetteville Estate', description: "J. Cole's estate near Fayetteville, North Carolina — the hometown he immortalised in his music.", estimatedValue: 3, image: RE, likes: 780 }],
    gossip: [{ title: "Forest Hills Drive: Rap's Greatest Homecoming Album", summary: "J. Cole's 2014 Forest Hills Drive album — named after his actual childhood home address — went platinum with zero features and spawned a sold-out world tour. His refusal to chase mainstream trends makes him rap's most respected independent voice.", type: 'gossip', date: 'Dec 2014' }]
  },
  'jacinda-ardern': {
    avatar: av('Jacinda Ardern'),
    assets: [{ id: 'jacinda-ardern-1', type: 'real_estate', name: 'Auckland Home', description: "Jacinda Ardern's Auckland family home, where she returned after resigning as Prime Minister.", estimatedValue: 1.5, image: RE, likes: 590 }],
    gossip: [{ title: 'Resigned at the Height of Her Powers', summary: "Jacinda Ardern resigned as New Zealand's Prime Minister in January 2023, citing exhaustion and saying she no longer had 'enough left in the tank'. Her crisis leadership during the Christchurch attacks and COVID-19 made her one of the most admired leaders of her generation.", type: 'gossip', date: 'Jan 2023' }]
  },
  'jack-black': {
    avatar: av('Jack Black'),
    assets: [{ id: 'jack-black-1', type: 'real_estate', name: 'Los Feliz Home', description: "Jack Black's eclectic Los Feliz, LA home — fitting for the man who plays everything from kung fu pandas to Bowser.", estimatedValue: 4, image: RE, likes: 940 }],
    gossip: [{ title: "The Super Mario Movie, Kung Fu Panda & a Viral TikTok Empire", summary: "Jack Black voiced Bowser in the record-breaking Super Mario Bros. Movie (2023) and became a TikTok phenomenon with 10 million followers. Kung Fu Panda 4 (2024) added another $550M to his voice acting box office legacy.", type: 'gossip', date: 'Apr 2023' }]
  },
  'jake-gyllenhaal': {
    avatar: av('Jake Gyllenhaal'),
    assets: [{ id: 'jake-gyllenhaal-1', type: 'real_estate', name: 'Brooklyn Heights Apartment', description: "Gyllenhaal's Brooklyn Heights apartment with panoramic Manhattan skyline views.", estimatedValue: 4, image: RE, likes: 940 }],
    gossip: [{ title: 'Nightcrawler & the Art of the Method Transformation', summary: "Jake Gyllenhaal lost 20 pounds to play the deeply unsettling Louis Bloom in Nightcrawler (2014), arguably the performance of his career. His intense physical transformations for Southpaw, Demolition, and Road House show an actor who never coasts.", type: 'gossip', date: 'Oct 2014' }]
  },
  'james-blunt': {
    avatar: av('James Blunt'),
    assets: [{ id: 'james-blunt-1', type: 'real_estate', name: 'Ibiza Villa', description: "James Blunt's beloved Ibiza villa overlooking the Mediterranean — his retreat from British winters.", estimatedValue: 2.5, image: RE, likes: 650 }],
    gossip: [{ title: "You're Beautiful: The Song That Defined an Era (and He Hates)", summary: "James Blunt's You're Beautiful (2005) sold 11 million copies and became one of the most-played songs of the 2000s. Blunt has since become Twitter's most self-deprecating celebrity, embracing jokes about the song's overplay with legendary wit.", type: 'gossip', date: 'Mar 2005' }]
  },
  'jamie-foxx': {
    avatar: av('Jamie Foxx'),
    assets: [{ id: 'jamie-foxx-1', type: 'real_estate', name: 'Hidden Hills Estate', description: "Jamie Foxx's sprawling Hidden Hills estate with a full entertainment complex and recording studio.", estimatedValue: 9, image: RE, likes: 1340 }],
    gossip: [{ title: 'Medical Emergency & the Comeback That Moved Hollywood', summary: "Jamie Foxx suffered a serious medical emergency in April 2023 that hospitalised him for weeks. His emotional return to the spotlight, performing and reuniting with family, moved fans worldwide and sparked a renewed appreciation for his extraordinary talents.", type: 'gossip', date: 'Apr 2023' }]
  },
  'jan-vertonghen': {
    avatar: av('Jan Vertonghen'),
    assets: [{ id: 'jan-vertonghen-1', type: 'real_estate', name: 'Anderlecht Home', description: "Vertonghen's home near Anderlecht in Brussels — close to the club where he began his career.", estimatedValue: 2, image: RE, likes: 520 }],
    gossip: [{ title: 'Spurs Cult Hero & Belgium\'s Most Capped Outfield Player', summary: "Jan Vertonghen became Belgium's most capped outfield player and spent 8 years at Tottenham Hotspur as one of the Premier League's most reliable defenders. His 2018 World Cup campaign with Belgium, finishing third, was a career highlight.", type: 'gossip', date: 'Jul 2018' }]
  },
  'jean-todt': {
    avatar: av('Jean Todt'),
    assets: [{ id: 'jean-todt-1', type: 'real_estate', name: 'Paris Residence', description: "Todt's elegant Paris apartment, home between his FIA duties and frequent motorsport travel.", estimatedValue: 5, image: RE, likes: 1100 }],
    gossip: [{ title: "Ferrari Dynasty & Michael Schumacher's Guardian", summary: "Jean Todt orchestrated Ferrari's dominance from 1999-2004 with Michael Schumacher, winning 6 consecutive constructors' championships. He remains fiercely loyal to his friend Schumacher, visiting him regularly and refusing to discuss his medical condition publicly.", type: 'gossip', date: 'Jul 2004' }]
  },
  'jennifer-lopez': {
    avatar: av('Jennifer Lopez'),
    assets: [
      { id: 'jennifer-lopez-1', type: 'real_estate', name: 'Bel-Air Mansion', description: "J-Lo and Ben Affleck's $60M Bel-Air estate purchased together after their 2022 marriage.", estimatedValue: 60, image: RE, likes: 5000 },
      { id: 'jennifer-lopez-2', type: 'jet', name: 'Bombardier Challenger 850', description: "J-Lo's private Bombardier Challenger jet, used for her global performance tours.", estimatedValue: 35, image: JT, likes: 2900 }
    ],
    gossip: [{ title: "Bennifer 2.0 & the Fairytale Ending", summary: "Jennifer Lopez and Ben Affleck's 2022 Las Vegas wedding — 20 years after their original engagement ended — became one of pop culture's greatest reunion stories. A larger ceremony in Georgia followed, attended by Hollywood's elite.", type: 'gossip', date: 'Jul 2022' }]
  },
  'jenson-button': {
    avatar: av('Jenson Button'),
    assets: [{ id: 'jenson-button-1', type: 'real_estate', name: 'Monaco Apartment', description: "Button's luxury Monaco apartment — a classic F1 champion's residence in the tax-friendly principality.", estimatedValue: 8, image: RE, likes: 1280 }],
    gossip: [{ title: "2009 World Champion in the Slowest Car", summary: "Jenson Button won the 2009 Formula 1 World Championship with Brawn GP — a team that started the season with no sponsors. His 6 wins in the first 7 races with an underdog team remains one of F1's most improbable title runs.", type: 'gossip', date: 'Oct 2009' }]
  },
  'jessie-j': {
    avatar: av('Jessie J'),
    assets: [{ id: 'jessie-j-1', type: 'real_estate', name: 'Los Angeles Home', description: "Jessie J's LA home after relocating from London to pursue her US career.", estimatedValue: 2, image: RE, likes: 520 }],
    gossip: [{ title: "Price Tag & the Singer Who Beat a Chinese Talent Show", summary: "Jessie J entered Chinese talent show Singer in 2018 as a wildcard contestant and won — the first Western artist ever to do so. Her vocal performances stunned Chinese audiences and gave her career a second wind in Asia.", type: 'gossip', date: 'Mar 2018' }]
  },
  'jim-carrey': {
    avatar: av('Jim Carrey'),
    assets: [{ id: 'jim-carrey-1', type: 'real_estate', name: 'Brentwood Estate', description: "Jim Carrey's grand Brentwood estate, purchased during his peak $20M-per-film earning years.", estimatedValue: 12, image: RE, likes: 1520 }],
    gossip: [{ title: "The $20M Man Who Painted His Way to Peace", summary: "Jim Carrey commanded $20M per film during the 1990s, becoming Hollywood's highest-paid comedian. He later retreated from the industry to pursue painting and philosophy, releasing an acclaimed Netflix documentary and making occasional acting returns.", type: 'gossip', date: 'Jan 2017' }]
  },
  'joe-biden': {
    avatar: av('Joe Biden'),
    assets: [{ id: 'joe-biden-1', type: 'real_estate', name: 'Rehoboth Beach Home', description: "Biden's beloved Rehoboth Beach, Delaware home — his coastal retreat and post-presidency base.", estimatedValue: 3, image: RE, likes: 680 }],
    gossip: [{ title: 'Oldest President in US History & the 2024 Exit', summary: "Joe Biden served as the 46th and oldest US President, withdrawing from the 2024 presidential race in July under party pressure at 81 — the first incumbent to exit since Lyndon Johnson in 1968. He endorsed Kamala Harris before departing.", type: 'gossip', date: 'Jul 2024' }]
  },
  'joe-montana': {
    avatar: av('Joe Montana'),
    assets: [{ id: 'joe-montana-1', type: 'real_estate', name: 'Napa Valley Vineyard Estate', description: "Montana's Napa Valley vineyard estate — he produces his own wine label, Montana's Best.", estimatedValue: 10, image: RE, likes: 1400 }],
    gossip: [{ title: "Four Super Bowls, Zero Interceptions & the Greatest Clutch QB in History", summary: "Joe Montana won four Super Bowls and was named MVP three times, throwing 122 touchdown passes with zero interceptions in the postseason. His famous calm under pressure became the defining characteristic of quarterbacking excellence.", type: 'gossip', date: 'Jan 1990' }]
  },
  'joel-embiid': {
    avatar: av('Joel Embiid'),
    assets: [{ id: 'joel-embiid-1', type: 'real_estate', name: 'Philadelphia Penthouse', description: "Embiid's luxury Rittenhouse Square penthouse in Philadelphia — overlooking the city he adopted.", estimatedValue: 4, image: RE, likes: 940 }],
    gossip: [{ title: "The Process: From Cameroon to MVP", summary: "Joel Embiid was discovered in Cameroon at 16 having only recently started playing basketball. He won the NBA MVP award in 2023 after a patient 'Process' of development, then chose to represent France at the Olympics over Team USA.", type: 'gossip', date: 'Jul 2023' }]
  },
  'joel-osteen': {
    avatar: av('Joel Osteen'),
    assets: [{ id: 'joel-osteen-1', type: 'real_estate', name: 'River Oaks Mansion', description: "Osteen's $10.5M River Oaks mansion in Houston — a 17,000 sq ft estate in Houston's most exclusive district.", estimatedValue: 10.5, image: RE, likes: 1630 }],
    gossip: [{ title: 'Hurricane Harvey & the Locked Church Doors', summary: "When Hurricane Harvey flooded Houston in 2017, Joel Osteen's Lakewood Church — America's largest congregation — initially refused to open as a shelter. The backlash forced the church to open the following day, exposing tensions between prosperity gospel wealth and community need.", type: 'controversy', date: 'Aug 2017' }]
  },
  'john-cena': {
    avatar: av('John Cena'),
    assets: [{ id: 'john-cena-1', type: 'car', name: 'Ford GT Vintage Collection', description: "Cena's legendary collection of vintage Ford GT muscle cars — he sold a rare 2005 Ford GT in violation of a no-resale agreement.", estimatedValue: 1.2, image: CA, likes: 1472 }],
    gossip: [{ title: "The Make-A-Wish Record & the Peacemaker Pivot", summary: "John Cena has granted over 650 Make-A-Wish requests — more than any other person in history. He successfully transitioned from wrestling to Hollywood blockbusters (Fast & Furious, The Suicide Squad) and critically-acclaimed TV (Peacemaker).", type: 'gossip', date: 'Jan 2022' }]
  },
  'john-elway': {
    avatar: av('John Elway'),
    assets: [{ id: 'john-elway-1', type: 'real_estate', name: 'Cherry Hills Village Estate', description: "Elway's Cherry Hills Village, Colorado estate — close to his beloved Denver Broncos franchise.", estimatedValue: 8, image: RE, likes: 1280 }],
    gossip: [{ title: 'Back-to-Back Super Bowls & the Perfect Retirement', summary: "John Elway won consecutive Super Bowls (1997, 1998) before retiring on his own terms at the peak of his powers. He later returned as Broncos General Manager and executive VP, winning Super Bowl 50 with Peyton Manning in 2016.", type: 'gossip', date: 'Jan 1999' }]
  },
  'john-krasinski': {
    avatar: av('John Krasinski'),
    assets: [{ id: 'john-krasinski-1', type: 'real_estate', name: 'Brooklyn Family Home', description: "Krasinski and Emily Blunt's Brooklyn brownstone — their New York family base.", estimatedValue: 5, image: RE, likes: 1100 }],
    gossip: [{ title: "A Quiet Place: $340M Box Office from a $17M Budget", summary: "John Krasinski wrote and directed A Quiet Place (2018) — which grossed $340M on a $17M budget — while also starring alongside his wife Emily Blunt. The film launched him from comedy actor to major Hollywood filmmaker.", type: 'gossip', date: 'Apr 2018' }]
  },
  'john-legend': {
    avatar: av('John Legend'),
    assets: [{ id: 'john-legend-1', type: 'real_estate', name: 'Beverly Hills Home', description: "John and Chrissy Teigen's elegant Beverly Hills home, a social hub for LA's creative elite.", estimatedValue: 10, image: RE, likes: 1400 }],
    gossip: [{ title: "EGOT at 39: The Youngest Male to Complete Entertainment's Grand Slam", summary: "John Legend became the first Black man and youngest male to achieve EGOT status (Emmy, Grammy, Oscar, Tony) in 2018 when he won the Emmy for Outstanding Variety Special for Jesus Christ Superstar Live.", type: 'gossip', date: 'Sep 2018' }]
  },
  'john-mcenroe': {
    avatar: av('John McEnroe'),
    assets: [{ id: 'john-mcenroe-1', type: 'real_estate', name: 'Malibu Beach Home', description: "McEnroe's beachfront Malibu compound — purchased during his peak tennis earning years.", estimatedValue: 10, image: RE, likes: 1400 }],
    gossip: [{ title: "'You Cannot Be Serious!' — Tennis's Greatest Villain Becomes Its Greatest Ambassador", summary: "John McEnroe's court-side tantrums made him tennis's greatest villain in the 1980s. He has since reinvented himself as the sport's most insightful commentator and a passionate champion of young talent through his New York academy.", type: 'gossip', date: 'Jan 2000' }]
  },
  'johnny-cash': {
    avatar: av('Johnny Cash'),
    assets: [{ id: 'johnny-cash-1', type: 'real_estate', name: 'Hendersonville House (Heritage)', description: "The Man in Black's Hendersonville, Tennessee estate on Old Hickory Lake — his beloved home that tragically burned down in 2007.", estimatedValue: 3, image: RE, likes: 780 }],
    gossip: [{ title: "Hurt: The Cover That Outlasted the Original", summary: "Johnny Cash's 2002 cover of Nine Inch Nails' Hurt — recorded when he was dying — is widely considered one of the greatest music videos ever made. The song introduced Cash to a generation born after his peak, ensuring his immortality.", type: 'gossip', date: 'Jan 2003' }]
  },
  'johnny-depp': {
    avatar: av('Johnny Depp'),
    assets: [
      { id: 'johnny-depp-1', type: 'real_estate', name: 'French Village Retreat', description: "Depp's restored village in Provence, France — a collection of historic buildings he purchased and connected.", estimatedValue: 10, image: RE, likes: 1400 }
    ],
    gossip: [{ title: 'Amber Heard Trial: The Defamation Case That Gripped the World', summary: "Johnny Depp won his 2022 defamation case against Amber Heard in a Virginia court, watched by 10 million daily viewers worldwide. The trial dominated social media for six weeks and became the most-discussed legal proceeding since O.J. Simpson.", type: 'controversy', date: 'Jun 2022' }]
  },
  'jon-bon-jovi': {
    avatar: av('Jon Bon Jovi'),
    assets: [{ id: 'jon-bon-jovi-1', type: 'real_estate', name: 'New Jersey Estate', description: "Bon Jovi's sprawling New Jersey estate — a tribute to the state that made him a rock legend.", estimatedValue: 14, image: RE, likes: 1640 }],
    gossip: [{ title: "$300M Catalogue Sale & the Restaurant That Feeds the Hungry", summary: "Jon Bon Jovi sold his music catalogue for $300M in 2023. He also opened JBJ Soul Kitchen — a restaurant where those who can't afford a meal bus tables or wash dishes instead — in Red Bank, New Jersey.", type: 'gossip', date: 'Oct 2023' }]
  },
  'jon-jones': {
    avatar: av('Jon Jones'),
    assets: [{ id: 'jon-jones-1', type: 'real_estate', name: 'Albuquerque Training Compound', description: "Jones' Albuquerque, New Mexico home and training complex near Jackson-Wink MMA Academy.", estimatedValue: 2, image: RE, likes: 520 }],
    gossip: [{ title: "Greatest of All Time — with the Asterisks", summary: "Jon Jones is widely regarded as the most talented MMA fighter of all time. His career is shadowed by multiple failed drug tests, a hit-and-run conviction, and various legal troubles that have repeatedly derailed his dominance.", type: 'controversy', date: 'Apr 2015' }]
  },
  'jon-rahm': {
    avatar: av('Jon Rahm'),
    assets: [{ id: 'jon-rahm-1', type: 'real_estate', name: 'Scottsdale Home', description: "Jon Rahm's Scottsdale, Arizona family home — his base between PGA and LIV Golf tournaments.", estimatedValue: 4, image: RE, likes: 940 }],
    gossip: [{ title: "Pulled from the Masters While Leading — Then Won It the Next Year", summary: "Jon Rahm was leading the 2021 Masters by 6 shots before testing positive for COVID-19 and being forced to withdraw. He returned the following year to win the US Open, and then claimed the 2023 Masters title in one of golf's great redemption stories.", type: 'gossip', date: 'Apr 2023' }]
  },
  'julia-roberts': {
    avatar: av('Julia Roberts'),
    assets: [{ id: 'julia-roberts-1', type: 'real_estate', name: 'Malibu Beach House', description: "Roberts' Malibu beachfront home — the retreat she shares with husband Daniel Moder and their three children.", estimatedValue: 9, image: RE, likes: 1340 }],
    gossip: [{ title: "Pretty Woman to $25M Per Film: Hollywood's Biggest Female Star", summary: "Julia Roberts commanded $25M per film at her peak — the first actress to cross that threshold. Pretty Woman (1990) and Erin Brockovich (2001, Oscar) cemented her as the biggest female box office draw in Hollywood history.", type: 'gossip', date: 'Mar 2001' }]
  },
  'julius-randle': {
    avatar: av('Julius Randle'),
    assets: [{ id: 'julius-randle-1', type: 'real_estate', name: 'New Jersey Home', description: "Randle's family home in New Jersey, where he lives with his wife Kendra and son Kyden.", estimatedValue: 2.5, image: RE, likes: 550 }],
    gossip: [{ title: "MSG's Most Controversial Star: Boos to Most Improved Player", summary: "Julius Randle won the NBA's Most Improved Player award in 2021 after a stellar Knicks season, only to be booed off Madison Square Garden the following year after a dramatic regression. His relationship with New York fans became one of basketball's most turbulent.", type: 'gossip', date: 'May 2022' }]
  },
  'justin-bieber': {
    avatar: av('Justin Bieber'),
    assets: [
      { id: 'justin-bieber-1', type: 'real_estate', name: 'Ontario Lake House', description: "Bieber's private Ontario lake house near his hometown of Stratford, his Canadian retreat.", estimatedValue: 5, image: RE, likes: 1100 }
    ],
    gossip: [{ title: 'Ramsay Hunt Syndrome & the Pause on Superstardom', summary: "Justin Bieber was diagnosed with Ramsay Hunt syndrome in 2022, causing facial paralysis and forcing him to cancel his Justice World Tour. The health crisis humanised the star who had spent years battling public scrutiny since his teen idol peak.", type: 'gossip', date: 'Jun 2022' }]
  },
  'justin-timberlake': {
    avatar: av('Justin Timberlake'),
    assets: [{ id: 'justin-timberlake-1', type: 'real_estate', name: 'Nashville Compound', description: "Justin Timberlake's sprawling Nashville compound — reflecting his roots and musical heritage.", estimatedValue: 8, image: RE, likes: 1280 }],
    gossip: [{ title: "DUI Arrest & the Apology Tour", summary: "Justin Timberlake was arrested for DUI in the Hamptons in June 2024, shortly after releasing his sixth studio album. The timing was particularly unfortunate given his ongoing apology for past behaviour toward Britney Spears and Janet Jackson.", type: 'controversy', date: 'Jun 2024' }]
  },
  'kanye-west': {
    avatar: av('Kanye West'),
    assets: [
      { id: 'kanye-west-1', type: 'real_estate', name: 'Malibu Concrete Bunker', description: "Ye's controversial $57M Malibu oceanfront 'bunker' home — stripped bare of windows by his architect.", estimatedValue: 57, image: RE, likes: 4710 }
    ],
    gossip: [{ title: "Adidas Drops Ye: Losing Billionaire Status in 24 Hours", summary: "Adidas terminated its $1.5B Yeezy partnership with Kanye West in October 2022 following his antisemitic comments, causing Ye to lose his billionaire status overnight. Forbes estimated he lost $2B in net worth in a single day.", type: 'controversy', date: 'Oct 2022' }]
  },
  'karlie-kloss': {
    avatar: av('Karlie Kloss'),
    assets: [{ id: 'karlie-kloss-1', type: 'real_estate', name: 'New York Penthouse', description: "Karlie Kloss and Josh Kushner's luxury New York penthouse, their primary residence.", estimatedValue: 7, image: RE, likes: 1220 }],
    gossip: [{ title: 'Kode With Klossy: Teaching 2,000 Girls to Code', summary: "Karlie Kloss founded Kode With Klossy in 2015, providing free coding scholarships and summer camps to young women. The initiative has awarded over 2,000 scholarships and is widely regarded as fashion's most impactful philanthropic endeavour.", type: 'gossip', date: 'Jun 2015' }]
  },
  'kate-moss': {
    avatar: av('Kate Moss'),
    assets: [{ id: 'kate-moss-1', type: 'real_estate', name: 'Cotswolds Manor', description: "Kate Moss's Cotswolds manor house — a stunning English country retreat reflecting her enduring style.", estimatedValue: 8, image: RE, likes: 1280 }],
    gossip: [{ title: "The Moss Comeback: From Cocaine Scandal to Industry Kingmaker", summary: "Kate Moss was dropped by multiple brands after drug photos surfaced in 2005. She staged one of fashion's most complete comebacks, eventually earning more from the scandal than before it. As founder of Kate Moss Agency, she is now a fashion power broker.", type: 'controversy', date: 'Sep 2005' }]
  },
  'katy-perry': {
    avatar: av('Katy Perry'),
    assets: [{ id: 'katy-perry-1', type: 'real_estate', name: 'Santa Barbara Ranch', description: "Katy Perry and Orlando Bloom's Santa Barbara ranch estate purchased for $14.2M in 2020.", estimatedValue: 14.2, image: RE, likes: 1652 }],
    gossip: [{ title: "$25M American Idol Chair & the Las Vegas Residency", summary: "Katy Perry earned $25M per season as an American Idol judge and signed a reported $130M Las Vegas residency deal for Play at Resorts World — the most lucrative deal in Vegas residency history at the time.", type: 'gossip', date: 'Dec 2021' }]
  },
}
