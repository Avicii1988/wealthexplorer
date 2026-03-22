import type { Ext } from './extraCelebritiesExtended'
const RE = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&h=600&fit=crop'
const CA = 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=900&h=600&fit=crop'
const YA = 'https://images.unsplash.com/photo-1605281317010-fe5ffe798166?w=900&h=600&fit=crop'
const JT = 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=900&h=600&fit=crop'
const WT = 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=900&h=600&fit=crop'
const av = (n: string) => `https://ui-avatars.com/api/?name=${encodeURIComponent(n)}&background=1a1a1a&color=c9a84c&size=200&bold=true`
export const extras_03: Record<string, Ext> = {
  'carl-lewis': {
    avatar: av('Carl Lewis'),
    assets: [{ id: 'carl-lewis-1', type: 'real_estate', name: 'Houston Estate', description: "Carl Lewis's Houston estate with private training facilities and memorabilia collection.", estimatedValue: 3, image: RE, likes: 680 }],
    gossip: [{ title: '9 Olympic Gold Medals Across Four Games', summary: "Carl Lewis won 9 Olympic gold medals across four Olympic Games from 1984 to 1996, making him one of the greatest Olympians of all time. He controversially benefited from Ben Johnson's 1988 disqualification.", type: 'gossip', date: 'Aug 1996' }]
  },
  'carlos-alcaraz': {
    avatar: av('Carlos Alcaraz'),
    assets: [{ id: 'carlos-alcaraz-1', type: 'car', name: 'Aston Martin DBX', description: "Alcaraz's Aston Martin DBX, a favourite in his growing luxury car collection.", estimatedValue: 0.2, image: CA, likes: 412 }],
    gossip: [{ title: 'Youngest World No.1 in Tennis History', summary: "Carlos Alcaraz became the youngest World No.1 in ATP history at age 19 in 2022 after winning the US Open. He has since won Wimbledon (2023 & 2024) and the French Open (2024), establishing himself as the sport's next great champion.", type: 'gossip', date: 'Sep 2022' }]
  },
  'carlos-santana': {
    avatar: av('Carlos Santana'),
    assets: [{ id: 'carlos-santana-1', type: 'real_estate', name: 'Las Vegas Mansion', description: "Santana's Las Vegas mansion, his base during his long-running residency at House of Blues.", estimatedValue: 4, image: RE, likes: 840 }],
    gossip: [{ title: 'Supernatural: 9 Grammys in a Single Night', summary: "Carlos Santana's 1999 album Supernatural won 9 Grammy Awards in a single night — a record tied only by Michael Jackson and Beyoncé. At 52, it was the greatest late-career comeback in rock history.", type: 'gossip', date: 'Feb 2000' }]
  },
  'carlos-slim': {
    avatar: av('Carlos Slim'),
    assets: [
      { id: 'carlos-slim-1', type: 'real_estate', name: 'Lomas de Chapultepec Mansion', description: "Slim's vast colonial mansion in Mexico City's most exclusive Lomas de Chapultepec neighbourhood.", estimatedValue: 80, image: RE, likes: 5000 },
      { id: 'carlos-slim-2', type: 'art', name: 'Latin American Art Collection', description: "One of the world's finest collections of Mexican and Latin American art, housed in Slim's private museum.", estimatedValue: 500, image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=900&h=600&fit=crop', likes: 30200 }
    ],
    gossip: [{ title: "Mexico's Phone Monopoly Made Him the World's Richest", summary: "Carlos Slim built his $90B+ fortune largely through his virtual monopoly on Mexican telecom via América Móvil. In 2010 and 2011 he was ranked the world's richest person, surpassing Bill Gates.", type: 'gossip', date: 'Mar 2010' }]
  },
  'cate-blanchett': {
    avatar: av('Cate Blanchett'),
    assets: [{ id: 'cate-blanchett-1', type: 'real_estate', name: 'East Sussex Estate', description: "Blanchett's sprawling East Sussex country estate, converted from an 18th-century farmhouse.", estimatedValue: 8, image: RE, likes: 1280 }],
    gossip: [{ title: "Tár: The Performance That Redefined Acting", summary: "Cate Blanchett's role in Tár (2022) was hailed as one of cinema's greatest performances, earning her a record-extending eighth Academy Award nomination. The film sparked global debate about cancel culture and artistic genius.", type: 'gossip', date: 'Oct 2022' }]
  },
  'charlie-munger': {
    avatar: av('Charlie Munger'),
    assets: [{ id: 'charlie-munger-1', type: 'real_estate', name: 'Los Angeles Home', description: "Munger's modest Hancock Park home in Los Angeles, which he lived in for over 60 years.", estimatedValue: 2, image: RE, likes: 520 }],
    gossip: [{ title: "Warren Buffett's 'Architect': 99 Years of Wisdom", summary: "Charlie Munger, Warren Buffett's lifelong partner at Berkshire Hathaway, died in November 2023 at age 99. His Poor Charlie's Almanack and annual meeting speeches remain required reading for investors worldwide.", type: 'gossip', date: 'Nov 2023' }]
  },
  'charlize-theron': {
    avatar: av('Charlize Theron'),
    assets: [{ id: 'charlize-theron-1', type: 'real_estate', name: 'Beverly Hills Home', description: "Charlize's elegant Beverly Hills home, where she raises her two adopted daughters.", estimatedValue: 7, image: RE, likes: 1220 }],
    gossip: [{ title: "Monster: From Model to Oscar Winner", summary: "Charlize Theron gained 30 pounds and shaved her eyebrows to play serial killer Aileen Wuornos in Monster (2003), winning the Academy Award for Best Actress. The transformation shocked an industry that only knew her as a model.", type: 'gossip', date: 'Mar 2004' }]
  },
  'chen-guangbiao': {
    avatar: av('Chen Guangbiao'),
    assets: [{ id: 'chen-guangbiao-1', type: 'real_estate', name: 'Nanjing Business Campus', description: "Chen's large private business headquarters in Nanjing, the base of his recycling empire.", estimatedValue: 20, image: RE, likes: 1600 }],
    gossip: [{ title: 'The Chinese Billionaire Who Bought Lunches for New York', summary: "Chen Guangbiao famously took out a full-page ad in the New York Times declaring himself a 'most influential person in China', then flew to New York to buy lunch for hundreds of homeless people in Central Park.", type: 'gossip', date: 'Jan 2014' }]
  },
  'chidi-odinkalu': {
    avatar: av('Chidi Odinkalu'),
    assets: [{ id: 'chidi-odinkalu-1', type: 'real_estate', name: 'Lagos Residence', description: "Odinkalu's home in Lagos, Nigeria, the base of his ongoing human rights advocacy.", estimatedValue: 0.5, image: RE, likes: 230 }],
    gossip: [{ title: 'NHRC Chair & Confronting Nigeria\'s Power Structure', summary: "Chidi Odinkalu served as Chairman of Nigeria's National Human Rights Commission from 2015-2017, using the role to publicly confront corruption, police brutality, and electoral fraud despite significant personal risk.", type: 'gossip', date: 'Mar 2016' }]
  },
  'chito-vera': {
    avatar: av('Chito Vera'),
    assets: [{ id: 'chito-vera-1', type: 'real_estate', name: 'Quito Family Home', description: "Vera's family home in Quito, Ecuador — where he returns between UFC training camps.", estimatedValue: 0.4, image: RE, likes: 224 }],
    gossip: [{ title: 'Beating O\'Malley & Fighting for Ecuador', summary: "Marlon 'Chito' Vera became a national hero in Ecuador with his stunning 2020 submission win over Sean O'Malley. He has since become one of UFC's most exciting bantamweights and its highest-profile Latin American fighter.", type: 'gossip', date: 'Aug 2020' }]
  },
  'chris-brown': {
    avatar: av('Chris Brown'),
    assets: [
      { id: 'chris-brown-1', type: 'real_estate', name: 'Tarzana Mansion', description: "Brown's massive Tarzana, LA estate with indoor basketball court, pool, and recording studio.", estimatedValue: 4.3, image: RE, likes: 1058 },
      { id: 'chris-brown-2', type: 'car', name: 'Bugatti Veyron Grand Sport', description: "Brown's iconic orange Bugatti Veyron — one of the most recognisable celebrity cars in LA.", estimatedValue: 2, image: CA, likes: 1720 }
    ],
    gossip: [{ title: 'Rihanna Assault & the Long Road to Redemption', summary: "Chris Brown's 2009 assault of Rihanna before the Grammy Awards became one of music's most defining controversies. Despite a prolonged public fallout, he has returned to chart success, though legal troubles have continued.", type: 'controversy', date: 'Feb 2009' }]
  },
  'chris-evans': {
    avatar: av('Chris Evans'),
    assets: [{ id: 'chris-evans-1', type: 'real_estate', name: 'Boston Area Home', description: "Evans' New England home near his Massachusetts roots, where he lives with his dogs and family.", estimatedValue: 3.5, image: RE, likes: 810 }],
    gossip: [{ title: "Captain America's Accidental NSFW Instagram", summary: "In September 2020, Chris Evans accidentally posted a screenshot of his camera roll containing an explicit image on Instagram. The ensuing internet meltdown became one of the biggest social media moments of the year.", type: 'gossip', date: 'Sep 2020' }]
  },
  'chris-hemsworth': {
    avatar: av('Chris Hemsworth'),
    assets: [{ id: 'chris-hemsworth-1', type: 'real_estate', name: 'Byron Bay Mega-Mansion', description: "Hemsworth's controversial $20M mansion in Byron Bay, Australia — one of the largest private homes in NSW.", estimatedValue: 20, image: RE, likes: 2000 }],
    gossip: [{ title: 'Alzheimer\'s Gene Discovery & Byron Bay Mansion Backlash', summary: "Chris Hemsworth revealed in 2022 that he carries two copies of the APOE4 gene linked to Alzheimer's disease. Separately, his 18,000 sq ft Byron Bay mansion was criticised by locals for its scale and environmental impact.", type: 'gossip', date: 'Nov 2022' }]
  },
  'chris-martin': {
    avatar: av('Chris Martin'),
    assets: [{ id: 'chris-martin-1', type: 'real_estate', name: 'Malibu Beach House', description: "Chris Martin's beachfront Malibu home, where he lives with Dakota Johnson.", estimatedValue: 9, image: RE, likes: 1340 }],
    gossip: [{ title: "Conscious Uncoupling & Coldplay's Billion Streams", summary: "Chris Martin and Gwyneth Paltrow coined the term 'conscious uncoupling' for their 2014 separation. Coldplay became the first band to surpass 1 billion Spotify streams on three separate albums.", type: 'gossip', date: 'Mar 2014' }]
  },
  'chris-paul': {
    avatar: av('Chris Paul'),
    assets: [{ id: 'chris-paul-1', type: 'real_estate', name: 'Houston Memorial Area Home', description: "CP3's Houston home in the exclusive Memorial area, with basketball court and pool.", estimatedValue: 5.5, image: RE, likes: 1130 }],
    gossip: [{ title: "The Point God's Playoff Curse", summary: "Despite being one of the greatest point guards in NBA history, Chris Paul's playoff struggles — including the infamous hamstring injury against the Suns' rivals in 2021 — became one of basketball's most discussed narratives.", type: 'gossip', date: 'Jun 2021' }]
  },
  'chris-pratt': {
    avatar: av('Chris Pratt'),
    assets: [{ id: 'chris-pratt-1', type: 'real_estate', name: 'Pacific Palisades Home', description: "Pratt's Pacific Palisades estate with expansive garden, guest house, and home gym.", estimatedValue: 13, image: RE, likes: 1580 }],
    gossip: [{ title: "Parks & Rec to Guardians: Hollywood's Most Surprising A-Lister", summary: "Chris Pratt transformed from loveable slacker Andy Dwyer in Parks & Rec into Marvel's Star-Lord and an action franchise superstar in just three years — one of Hollywood's most remarkable career reinventions.", type: 'gossip', date: 'Aug 2014' }]
  },
  'chris-tucker': {
    avatar: av('Chris Tucker'),
    assets: [{ id: 'chris-tucker-1', type: 'real_estate', name: 'Georgia Estate', description: "Tucker's estate in Georgia after relocating from his long-time California residence.", estimatedValue: 2, image: RE, likes: 520 }],
    gossip: [{ title: "$25M Per Rush Hour Film & the IRS Battle", summary: "Chris Tucker earned $25M for Rush Hour 3 (2007) — one of the highest actor fees in history. He later faced $14M in IRS back taxes, which forced the sale of several properties and signalled his career slowdown.", type: 'controversy', date: 'Jun 2012' }]
  },
  'christian-horner': {
    avatar: av('Christian Horner'),
    assets: [{ id: 'christian-horner-1', type: 'real_estate', name: 'Oxfordshire Manor', description: "Horner's grand Oxfordshire country manor, home to his family near Red Bull Racing's Milton Keynes HQ.", estimatedValue: 5, image: RE, likes: 1100 }],
    gossip: [{ title: 'Red Bull Dominance & Alleged Misconduct Investigation', summary: "Christian Horner led Red Bull to four consecutive constructors' championships (2022-2025). In 2024 he faced an internal investigation over alleged inappropriate behaviour toward a female employee — charges he denied and was cleared of.", type: 'controversy', date: 'Feb 2024' }]
  },
  'cindy-crawford': {
    avatar: av('Cindy Crawford'),
    assets: [{ id: 'cindy-crawford-1', type: 'real_estate', name: 'Malibu Beachfront Estate', description: "Cindy Crawford and Rande Gerber's iconic Malibu beachfront property with direct Pacific Ocean access.", estimatedValue: 12, image: RE, likes: 1520 }],
    gossip: [{ title: "The Casamigos Payday: $1 Billion for Tequila", summary: "Cindy Crawford's husband Rande Gerber co-founded Casamigos Tequila with George Clooney. When they sold it to Diageo for $1 billion in 2017, Gerber — and by extension Cindy — received a massive windfall.", type: 'gossip', date: 'Jun 2017' }]
  },
  'claudia-sheinbaum': {
    avatar: av('Claudia Sheinbaum'),
    assets: [{ id: 'claudia-sheinbaum-1', type: 'real_estate', name: 'Mexico City Official Residence', description: "Los Pinos — the official presidential residence of Mexico's president in Mexico City.", estimatedValue: 30, image: RE, likes: 2300 }],
    gossip: [{ title: "Mexico's First Female President", summary: "Claudia Sheinbaum won Mexico's 2024 presidential election with 59% of the vote — the largest margin of victory in the country's democratic history — becoming Mexico's first female president and a symbol of STEM representation.", type: 'gossip', date: 'Jun 2024' }]
  },
  'colman-domingo': {
    avatar: av('Colman Domingo'),
    assets: [{ id: 'colman-domingo-1', type: 'real_estate', name: 'Los Angeles Home', description: "Domingo's stylish LA home, where he and his husband Raúl Domingo live and host creative gatherings.", estimatedValue: 2.5, image: RE, likes: 550 }],
    gossip: [{ title: 'Euphoria to Rustin: Hollywood\'s Renaissance Man', summary: "Colman Domingo received his first Oscar nomination for Rustin (2023) and has since become one of Hollywood's most acclaimed actors, following acclaimed work in Euphoria, Fear the Walking Dead, and Broadway.", type: 'gossip', date: 'Jan 2024' }]
  },
  'conan-obrien': {
    avatar: av('Conan OBrien'),
    assets: [{ id: 'conan-obrien-1', type: 'real_estate', name: 'Los Angeles Mansion', description: "Conan's sprawling Brentwood, LA mansion — home to his family and legendary comedy writers' rooms.", estimatedValue: 10, image: RE, likes: 1400 }],
    gossip: [{ title: "$45M NBC Payoff & the Tonight Show Exit", summary: "NBC paid Conan O'Brien a $45M settlement to leave The Tonight Show in 2010 after Jay Leno's show was cancelled and NBC pushed Conan out. The move sparked one of TV's greatest late-night controversies.", type: 'controversy', date: 'Jan 2010' }]
  },
  'connie-chiume': {
    avatar: av('Connie Chiume'),
    assets: [{ id: 'connie-chiume-1', type: 'real_estate', name: 'Johannesburg Residence', description: "Chiume's comfortable family home in Johannesburg's northern suburbs.", estimatedValue: 0.8, image: RE, likes: 248 }],
    gossip: [{ title: 'Wakanda Forever & a 50-Year Acting Career', summary: "Connie Chiume appeared in Black Panther (2018) as Elder Zawavari and reprised her role in Black Panther: Wakanda Forever (2022), introducing her extraordinary talent to a global audience after 50 years in South African theatre and television.", type: 'gossip', date: 'Nov 2022' }]
  },
  'conor-mcgregor': {
    avatar: av('Conor McGregor'),
    assets: [
      { id: 'conor-mcgregor-1', type: 'yacht', name: 'The Superconor', description: "McGregor's 66-metre superyacht, moored in Monaco and Ibiza. Previously owned by Elon Musk.", estimatedValue: 3.7, image: YA, likes: 2022 },
      { id: 'conor-mcgregor-2', type: 'real_estate', name: 'Ladychapel Road Estate', description: "McGregor's sprawling estate in County Kildare, Ireland, with full gym, cinema, and a boxing ring.", estimatedValue: 5, image: RE, likes: 1100 }
    ],
    gossip: [{ title: 'Proper Twelve, Floyd Fight & $600M Fortune', summary: "Conor McGregor founded Proper Twelve Irish Whiskey in 2018, selling his majority stake to Becle (Jose Cuervo) for a reported $600M. His 2017 boxing match with Floyd Mayweather earned him $100M in a single night.", type: 'gossip', date: 'Aug 2017' }]
  },
  'cormac-mccarthy': {
    avatar: av('Cormac McCarthy'),
    assets: [{ id: 'cormac-mccarthy-1', type: 'real_estate', name: 'Santa Fe Adobe', description: "McCarthy's modest adobe home in Santa Fe, New Mexico, where he wrote The Road and No Country for Old Men.", estimatedValue: 0.8, image: RE, likes: 348 }],
    gossip: [{ title: 'The Road to a $65M Film Sale', summary: "Cormac McCarthy's novels, written on a battered Olivetti typewriter and selling initially in the thousands, were adapted into Oscar-winning films worth hundreds of millions. No Country for Old Men won the 2008 Academy Award for Best Picture.", type: 'gossip', date: 'Feb 2008' }]
  },
  'cristiano-ronaldo': {
    avatar: av('Cristiano Ronaldo'),
    assets: [
      { id: 'cristiano-ronaldo-1', type: 'jet', name: 'Gulfstream G650', description: "CR7's Gulfstream G650 jet, customised with CR7 branding and capable of near-supersonic speeds.", estimatedValue: 65, image: JT, likes: 4110 },
      { id: 'cristiano-ronaldo-2', type: 'car', name: 'Bugatti La Voiture Noire', description: "One of only 10 Bugatti La Voiture Noire hypercars ever built, purchased by Ronaldo for €9.7M.", estimatedValue: 11, image: CA, likes: 3860 }
    ],
    gossip: [{ title: 'Al Nassr Deal: €200M Per Year in Saudi Arabia', summary: "Cristiano Ronaldo signed with Al Nassr in January 2023 for a reported €200M per year — the richest contract in football history. The move opened the floodgates for Saudi Pro League to sign global superstars.", type: 'gossip', date: 'Jan 2023' }]
  },
  'cyril-ramaphosa': {
    avatar: av('Cyril Ramaphosa'),
    assets: [{ id: 'cyril-ramaphosa-1', type: 'real_estate', name: 'Fresnaye Estate, Cape Town', description: "Ramaphosa's private estate in the exclusive Fresnaye area of Cape Town with mountain views.", estimatedValue: 12, image: RE, likes: 1520 }],
    gossip: [{ title: 'Phala Phala Farm: The Cash Heist Scandal', summary: "President Cyril Ramaphosa faced an impeachment motion in 2022 after burglars found $4 million hidden in sofas on his Phala Phala buffalo farm. He survived the vote but the scandal deeply damaged his anti-corruption credibility.", type: 'controversy', date: 'Nov 2022' }]
  },
  'daddy-yankee': {
    avatar: av('Daddy Yankee'),
    assets: [{ id: 'daddy-yankee-1', type: 'real_estate', name: 'San Juan Estate', description: "Daddy Yankee's luxury estate in San Juan, Puerto Rico — the country he never left despite global fame.", estimatedValue: 6, image: RE, likes: 1160 }],
    gossip: [{ title: "Gasolina & Despacito: The Pioneer Who Retired on Top", summary: "Daddy Yankee pioneered reggaeton with Gasolina (2004), then co-wrote Despacito — the most-streamed song in YouTube history with 8 billion views. He retired in 2022 after one final world tour, leaving at the absolute peak.", type: 'gossip', date: 'Mar 2022' }]
  },
  'dak-prescott': {
    avatar: av('Dak Prescott'),
    assets: [{ id: 'dak-prescott-1', type: 'real_estate', name: 'Frisco, Texas Mansion', description: "Prescott's modern mansion in Frisco, Texas — close to the Dallas Cowboys' practice facility.", estimatedValue: 5, image: RE, likes: 1100 }],
    gossip: [{ title: "$240M Contract: The Most Expensive QB Deal Ever", summary: "Dak Prescott signed a four-year, $240M extension with the Dallas Cowboys in 2024 — the largest contract in NFL history at the time. Despite leading the Cowboys to multiple playoff runs, a Super Bowl win remains elusive.", type: 'gossip', date: 'Sep 2024' }]
  },
  'dalai-lama': {
    avatar: av('Dalai Lama'),
    assets: [{ id: 'dalai-lama-1', type: 'real_estate', name: 'Dharamsala Residence', description: "The Dalai Lama's modest official residence in McLeod Ganj, Dharamsala — the seat of the Tibetan government-in-exile.", estimatedValue: 0.5, image: RE, likes: 730 }],
    gossip: [{ title: "Nobel Peace Prize & 65 Years in Exile", summary: "The 14th Dalai Lama has lived in exile in Dharamsala, India since fleeing Tibet in 1959 following China's invasion. He won the Nobel Peace Prize in 1989 and remains one of the world's most recognised spiritual leaders.", type: 'gossip', date: 'Oct 1989' }]
  },
  'dame-dash': {
    avatar: av('Dame Dash'),
    assets: [{ id: 'dame-dash-1', type: 'real_estate', name: 'Tribeca Loft', description: "Dash's remaining Tribeca loft — one of the few properties he retained after financial difficulties.", estimatedValue: 1.5, image: RE, likes: 590 }],
    gossip: [{ title: 'Roc-A-Fella, Jay-Z Split & the Downfall', summary: "Dame Dash co-founded Roc-A-Fella Records with Jay-Z and discovered Kanye West. After a bitter falling out with Jay-Z, he sold his Roc-A-Fella share and faced a series of business collapses, lawsuits, and IRS tax liens.", type: 'controversy', date: 'Jun 2004' }]
  },
  'damian-lillard': {
    avatar: av('Damian Lillard'),
    assets: [{ id: 'damian-lillard-1', type: 'real_estate', name: 'Milwaukee Home', description: "Lillard's Milwaukee residence following his 2023 trade from Portland to the Bucks.", estimatedValue: 3, image: RE, likes: 680 }],
    gossip: [{ title: "Dame Time: The Trade Request That Shocked the NBA", summary: "Damian Lillard's public trade request from Portland after 11 loyal seasons shocked basketball fans in 2023. He joined the Milwaukee Bucks alongside Giannis Antetokounmpo, forming one of the NBA's most feared duos.", type: 'gossip', date: 'Jul 2023' }]
  },
  'dana-white': {
    avatar: av('Dana White'),
    assets: [
      { id: 'dana-white-1', type: 'real_estate', name: 'Las Vegas Mansion', description: "White's sprawling Las Vegas compound near the UFC's performance institute.", estimatedValue: 10, image: RE, likes: 1400 },
      { id: 'dana-white-2', type: 'jet', name: 'Private Jet', description: "White's private jet, used for fight week travel across UFC's global calendar.", estimatedValue: 20, image: JT, likes: 1600 }
    ],
    gossip: [{ title: "From $4,000 to $10 Billion: The UFC's Transformation", summary: "Dana White bought the UFC for $2M in 2001 when it was near bankruptcy. He built it into a $10+ billion global combat sports empire, with Zuffa eventually selling it to WME-IMG in 2016 for $4.025 billion.", type: 'gossip', date: 'Jul 2016' }]
  },
  'daniel-craig': {
    avatar: av('Daniel Craig'),
    assets: [{ id: 'daniel-craig-1', type: 'real_estate', name: 'Somerset Country House', description: "Craig's elegant Georgian country house in Somerset, England, his retreat from London life.", estimatedValue: 4, image: RE, likes: 840 }],
    gossip: [{ title: 'No Time to Die & the $25M Bond Farewell', summary: "Daniel Craig reportedly earned $25M for No Time to Die (2021) — his fifth and final outing as James Bond. His tenure transformed 007 into a psychologically complex franchise, grossing over $3.7B globally.", type: 'gossip', date: 'Oct 2021' }]
  },
  'danilo-gallinari': {
    avatar: av('Danilo Gallinari'),
    assets: [{ id: 'danilo-gallinari-1', type: 'real_estate', name: 'Milan Apartment', description: "Gallinari's luxury apartment in central Milan — his European base in the off-season.", estimatedValue: 1.5, image: RE, likes: 590 }],
    gossip: [{ title: 'ACL Tear Ended an Improbable NBA Career', summary: "Danilo Gallinari suffered a torn ACL during the 2022 EuroBasket tournament while playing for Italy, effectively ending his NBA career at 34. He had spent 14 seasons in the league, earning over $150M in contracts.", type: 'gossip', date: 'Sep 2022' }]
  },
}
