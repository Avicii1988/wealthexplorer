import type { Ext } from './extraCelebritiesExtended'
const RE = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&h=600&fit=crop'
const CA = 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=900&h=600&fit=crop'
const YA = 'https://images.unsplash.com/photo-1605281317010-fe5ffe798166?w=900&h=600&fit=crop'
const JT = 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=900&h=600&fit=crop'
const av = (n: string) => `https://ui-avatars.com/api/?name=${encodeURIComponent(n)}&background=1a1a1a&color=c9a84c&size=200&bold=true`
export const extras_02: Record<string, Ext> = {
  'anthony-joshua': {
    avatar: av('Anthony Joshua'),
    assets: [
      { id: 'anthony-joshua-1', type: 'real_estate', name: 'Hertfordshire Mansion', description: "AJ's grand estate in Hertfordshire with a professional boxing gym, pool, and cinema room.", estimatedValue: 5, image: RE, likes: 1100 },
      { id: 'anthony-joshua-2', type: 'car', name: 'Lamborghini Urus', description: "Joshua's favourite daily driver, a customised Lamborghini Urus in matte black.", estimatedValue: 0.23, image: CA, likes: 514 }
    ],
    gossip: [{ title: 'Two Losses to Usyk & the Road Back', summary: "Anthony Joshua lost his IBF, WBA, and WBO heavyweight belts to Oleksandr Usyk twice in 2021 and 2022. He has since rebuilt with a string of knockouts, targeting a rematch with the undisputed champion.", type: 'controversy', date: 'Sep 2021' }],
    relationships: { parents: ['Robert Joshua', 'Yeta Joshua'], children: ['JJ Joshua'] }
  },
  'antoine-griezmann': {
    avatar: av('Antoine Griezmann'),
    assets: [{ id: 'antoine-griezmann-1', type: 'car', name: 'Ferrari 488 GTB', description: "Griezmann's fire-engine red Ferrari 488, his favourite weekend drive in Madrid.", estimatedValue: 0.3, image: CA, likes: 618 }],
    gossip: [{ title: 'The Fortnite Celebration That Went Viral', summary: "Antoine Griezmann became the first footballer to bring video game celebrations mainstream, doing the Fortnite dance after goals. His 2018 World Cup win with France cemented his status as a global football icon.", type: 'gossip', date: 'Jul 2018' }],
    relationships: { spouse: 'Érika Choperena', children: ['Mia Griezmann', 'Amaro Griezmann', 'Alba Griezmann'] }
  },
  'antony-blinken': {
    avatar: av('Antony Blinken'),
    assets: [{ id: 'antony-blinken-1', type: 'real_estate', name: 'Washington DC Home', description: "Blinken's family home in Washington DC's Georgetown neighbourhood.", estimatedValue: 2, image: RE, likes: 420 }],
    gossip: [{ title: 'The Rock Guitarist Who Became Secretary of State', summary: "Antony Blinken is an accomplished amateur rock guitarist who has performed publicly during diplomatic trips. He released an original song on Spotify in 2023 under the name ABlinken, surprising world leaders.", type: 'gossip', date: 'Jan 2023' }],
    relationships: { spouse: 'Evan Ryan', children: ['Lila Blinken'] }
  },
  'ariana-grande': {
    avatar: av('Ariana Grande'),
    assets: [{ id: 'ariana-grande-1', type: 'real_estate', name: 'Hollywood Hills Home', description: "Ariana's gated Mediterranean-style compound in the Hollywood Hills.", estimatedValue: 13.5, image: RE, likes: 1610 }],
    gossip: [{ title: 'Thank U, Next: From Tragedy to Triumph', summary: "Following the 2017 Manchester Arena bombing during her concert and the loss of ex-boyfriend Mac Miller, Ariana channelled her grief into the record-breaking albums Thank U, Next and Positions, becoming pop's biggest artist.", type: 'gossip', date: 'Feb 2019' }],
    relationships: { parents: ['Joan Grande', 'Edward Butera'], exSpouse: ['Dalton Gomez'], exPartner: ['Mac Miller (†)', 'Pete Davidson', 'Ricky Alvarez', 'Graham Phillips'], siblings: ['Frankie Grande'] }
  },
  'arnold-schwarzenegger': {
    avatar: av('Arnold Schwarzenegger'),
    assets: [
      { id: 'arnold-schwarzenegger-1', type: 'car', name: 'Custom Unimog', description: "Arnold's Mercedes-Benz Unimog military truck, converted for civilian luxury use.", estimatedValue: 0.5, image: CA, likes: 830 },
      { id: 'arnold-schwarzenegger-2', type: 'real_estate', name: 'Brentwood Estate', description: "Schwarzenegger's sprawling Brentwood, LA estate with gym, pool, and guesthouse.", estimatedValue: 12, image: RE, likes: 1520 }
    ],
    gossip: [{ title: "The Governator's Secret Family", summary: "In 2011 Arnold Schwarzenegger revealed he had fathered a son with his housekeeper during his marriage to Maria Shriver. The revelation ended his marriage and threatened his attempted Hollywood comeback.", type: 'controversy', date: 'May 2011' }],
    relationships: { exSpouse: ['Maria Shriver'], children: ['Katherine Schwarzenegger', 'Christina Schwarzenegger', 'Patrick Schwarzenegger', 'Christopher Schwarzenegger', 'Joseph Baena'] }
  },
  'asafa-powell': {
    avatar: av('Asafa Powell'),
    assets: [{ id: 'asafa-powell-1', type: 'real_estate', name: 'Kingston Residence', description: "Powell's comfortable family home in Kingston, Jamaica, where he trains.", estimatedValue: 1.5, image: RE, likes: 290 }],
    gossip: [{ title: "World's Fastest Human — Before Bolt", summary: "Asafa Powell held the 100m world record 17 times between 2005 and 2008, clocking 9.74 seconds. Though overshadowed by Usain Bolt, he remains one of the most prolific sub-10 second sprinters in history.", type: 'gossip', date: 'Jun 2005' }],
    relationships: { partner: 'Alyshia Gordon', children: ['Dreade Powell'] }
  },
  'ashleigh-barty': {
    avatar: av('Ashleigh Barty'),
    assets: [{ id: 'ashleigh-barty-1', type: 'real_estate', name: 'Brisbane Family Home', description: "Barty's quiet Brisbane home where she retired aged 25 to spend time with her young family.", estimatedValue: 2, image: RE, likes: 620 }],
    gossip: [{ title: "Retired at 25: Australia's Greatest Ever Champion", summary: "Ash Barty shocked the tennis world by retiring at age 25 in March 2022, just weeks after winning the Australian Open. Having won 3 Grand Slams and reached World No.1, she walked away on her own terms.", type: 'gossip', date: 'Mar 2022' }],
    relationships: { spouse: 'Garry Kissick', children: ['Hayden Kissick'] }
  },
  'ashley-graham': {
    avatar: av('Ashley Graham'),
    assets: [{ id: 'ashley-graham-1', type: 'real_estate', name: 'New York Tribeca Loft', description: "Ashley's stylish Tribeca loft in Manhattan — a converted warehouse with industrial chic interiors.", estimatedValue: 3.5, image: RE, likes: 810 }],
    gossip: [{ title: "Sports Illustrated's History-Making Cover", summary: "Ashley Graham became the first plus-size model on the cover of Sports Illustrated Swimsuit in 2016, sparking a global conversation about beauty standards. She remains the most prominent figure in the body positivity movement.", type: 'gossip', date: 'Feb 2016' }],
    relationships: { spouse: 'Justin Ervin', children: ['Isaac Menelik Giovanni Ervin', 'Roman Ervin', 'Malachi Ervin'] }
  },
  'asim-azhar': {
    avatar: av('Asim Azhar'),
    assets: [{ id: 'asim-azhar-1', type: 'real_estate', name: 'Karachi Home Studio', description: "Asim's recording studio setup in his Karachi family home where he produces his music.", estimatedValue: 0.5, image: RE, likes: 230 }],
    gossip: [{ title: 'Jo Tu Na Mila & Pakistan Pop Stardom', summary: "Asim Azhar rose to fame with heartbreak anthem Jo Tu Na Mila, which became one of Pakistan's most-streamed songs. His open diary approach to songwriting resonated with a generation of South Asian youth.", type: 'gossip', date: 'May 2020' }],
    relationships: { exPartner: ['Hania Amir'] }
  },
  'atif-aslam': {
    avatar: av('Atif Aslam'),
    assets: [{ id: 'atif-aslam-1', type: 'real_estate', name: 'Lahore Family Mansion', description: "Atif's grand family home in Lahore — the cultural capital of Pakistan.", estimatedValue: 2, image: RE, likes: 520 }],
    gossip: [{ title: "Aadat: The Song That Launched Pakistan's Biggest Pop Star", summary: "Atif Aslam's debut song Aadat (2004) with the band Jal became Pakistan's biggest pop hit. He went on to record multiple Bollywood soundtracks and remains the most-streamed Pakistani artist on Spotify.", type: 'gossip', date: 'Jan 2004' }],
    relationships: { spouse: 'Sara Bharwana', children: ['Ahad Aslam', 'Aryaan Aslam', 'Halima Aslam'] }
  },
  'augusto-pinochet': {
    avatar: av('Augusto Pinochet'),
    assets: [{ id: 'augusto-pinochet-1', type: 'real_estate', name: 'Los Boldos Estate', description: "Pinochet's vast private estate outside Santiago, used during and after his military rule.", estimatedValue: 3, image: RE, likes: 380 }],
    gossip: [{ title: '$28M Hidden in Riggs Bank Accounts', summary: "Following his 2004 arrest, it was revealed that Pinochet had secretly hidden $28 million in over 125 accounts at Riggs Bank in Washington DC, a stunning revelation for a man who claimed to be a poor army officer.", type: 'controversy', date: 'Jul 2004' }],
    relationships: { spouse: 'Lucía Hiriart', children: ['Inés Pinochet', 'María Pinochet', 'Jacqueline Pinochet', 'Marco Pinochet', 'Augusto Pinochet Hiriart'] }
  },
  'ayrton-senna': {
    avatar: av('Ayrton Senna'),
    assets: [{ id: 'ayrton-senna-1', type: 'car', name: 'McLaren MP4/4', description: "Senna's legendary 1988 McLaren-Honda — the most dominant F1 car ever built, winning 15 of 16 races.", estimatedValue: 1, image: CA, likes: 1260 }],
    gossip: [{ title: 'The Last Lap: San Marino 1994', summary: "Ayrton Senna died on 1 May 1994 at the San Marino Grand Prix at Imola. His death transformed F1 safety forever and cemented his legacy as arguably the greatest racing driver in history.", type: 'controversy', date: 'May 1994' }],
    relationships: { exSpouse: ['Lilian de Vasconcelos Souza'], exPartner: ['Adriane Galisteu', 'Xuxa'], siblings: ['Viviane Senna', 'Leonardo Senna'] }
  },
  'bad-bunny': {
    avatar: av('Bad Bunny'),
    assets: [{ id: 'bad-bunny-1', type: 'car', name: 'Lamborghini Urus', description: "Bad Bunny's custom white Lamborghini Urus, regularly spotted in San Juan, Puerto Rico.", estimatedValue: 0.25, image: CA, likes: 715 }],
    gossip: [{ title: 'Most-Streamed Artist Three Years Running', summary: "Bad Bunny was Spotify's most-streamed artist globally in 2020, 2021, and 2022 — the only artist to achieve three consecutive years at #1. Un Verano Sin Ti became the first Spanish-language album to win Album of the Year at Billboard.", type: 'gossip', date: 'Dec 2022' }],
    relationships: { exPartner: ['Gabriela Berlingeri'] }
  },
  'barack-obama': {
    avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/President_Barack_Obama.jpg/400px-President_Barack_Obama.jpg',
    assets: [{ id: 'barack-obama-1', type: 'real_estate', name: "Martha's Vineyard Estate", description: "The Obamas' 29-acre waterfront compound on Martha's Vineyard, purchased in 2019 for $11.75M.", estimatedValue: 11.75, image: RE, likes: 1905 }],
    gossip: [{ title: 'Netflix & Higher Ground: The Media Empire', summary: "Barack and Michelle Obama signed a multi-year Netflix production deal in 2018 worth a reported $65M+. Their Higher Ground Productions has released multiple award-winning documentaries and series.", type: 'gossip', date: 'May 2018' }],
    relationships: { parents: ['Barack Obama Sr. (†)', 'Ann Dunham (†)'], spouse: 'Michelle Obama', children: ['Malia Obama', 'Sasha Obama'] }
  },
  'barry-bonds': {
    avatar: av('Barry Bonds'),
    assets: [{ id: 'barry-bonds-1', type: 'real_estate', name: 'Beverly Hills Compound', description: "Bonds' Beverly Hills compound complete with a batting cage, pool, and private gym.", estimatedValue: 8, image: RE, likes: 1280 }],
    gossip: [{ title: 'BALCO: The Steroids Scandal That Defined an Era', summary: "Barry Bonds broke the all-time MLB home run record with 762 in 2007, but his legacy is overshadowed by the BALCO steroids scandal. He was convicted of obstruction of justice in 2011, later overturned on appeal.", type: 'controversy', date: 'Dec 2004' }],
    relationships: { exSpouse: ['Sun Bonds', 'Liz Watson'], children: ['Nikolai Bonds', 'Aisha Lynn Bonds', 'Shikari Bonds'] }
  },
  'barry-sanders': {
    avatar: av('Barry Sanders'),
    assets: [{ id: 'barry-sanders-1', type: 'real_estate', name: 'Michigan Lake House', description: "Sanders' private retreat on a quiet Michigan lake, purchased after his 1999 retirement.", estimatedValue: 3, image: RE, likes: 680 }],
    gossip: [{ title: 'The Retirement Fax That Shocked the NFL', summary: "Barry Sanders retired without warning in July 1999 — announcing it via fax to his hometown newspaper — just 1,458 yards short of Walter Payton's all-time rushing record. He was 31 years old.", type: 'controversy', date: 'Jul 1999' }],
    relationships: { exSpouse: ['Lauren Campbell'], children: ['Barry Sanders Jr.', 'Nicholas Sanders', 'Noah Sanders', 'Nigel Sanders'] }
  },
  'ben-affleck': {
    avatar: av('Ben Affleck'),
    assets: [{ id: 'ben-affleck-1', type: 'real_estate', name: 'Pacific Palisades Mansion', description: "The $20M Pacific Palisades home Ben purchased after reuniting with Jennifer Lopez.", estimatedValue: 20, image: RE, likes: 1800 }],
    gossip: [{ title: 'Bennifer 2.0: The Reunion That Captivated the World', summary: "Ben Affleck and Jennifer Lopez reignited their early-2000s romance in 2021 and married in Las Vegas in July 2022, before a larger ceremony in Georgia. The reunion became one of pop culture's biggest stories of the decade.", type: 'gossip', date: 'Jul 2022' }],
    relationships: { parents: ['Christopher Anne Boldt', 'Timothy Byers Affleck'], exSpouse: ['Jennifer Garner', 'Jennifer Lopez'], siblings: ['Casey Affleck'], children: ['Violet Affleck', 'Seraphina Rose Elizabeth Affleck', 'Samuel Garner Affleck'] }
  },
  'bernard-arnault': {
    avatar: av('Bernard Arnault'),
    assets: [
      { id: 'bernard-arnault-1', type: 'yacht', name: 'Symphony', description: "The 101-metre superyacht Symphony, used for family vacations across the Mediterranean.", estimatedValue: 150, image: YA, likes: 9200 },
      { id: 'bernard-arnault-2', type: 'jet', name: 'Falcon 900B', description: "Arnault's Dassault Falcon private jet, a favourite of French executives.", estimatedValue: 30, image: JT, likes: 2000 }
    ],
    gossip: [{ title: "World's Richest Man: The LVMH Empire", summary: "Bernard Arnault has repeatedly topped Forbes' world's richest person list with a net worth exceeding $200 billion. His LVMH conglomerate owns over 70 luxury brands including Louis Vuitton, Dior, Moët, and Hennessy.", type: 'gossip', date: 'Jan 2023' }],
    relationships: { exSpouse: ['Anne Dewavrin'], spouse: 'Hélène Mercier', children: ['Delphine Arnault', 'Antoine Arnault', 'Alexandre Arnault', 'Frédéric Arnault', 'Jean Arnault'] }
  },
  'bill-clinton': {
    avatar: av('Bill Clinton'),
    assets: [{ id: 'bill-clinton-1', type: 'real_estate', name: 'Chappaqua Estate', description: "The Clintons' Chappaqua, New York estate purchased for $1.7M in 1999 before leaving the White House.", estimatedValue: 1.7, image: RE, likes: 702 }],
    gossip: [{ title: 'The $16M Book Deal & Post-Presidential Empire', summary: "Bill Clinton's memoir My Life received a $15M advance — one of the largest ever — and sold 400,000 copies on its first day. He has since earned over $100M in speaking fees and philanthropic ventures.", type: 'gossip', date: 'Jun 2004' }],
    relationships: { spouse: 'Hillary Clinton', children: ['Chelsea Clinton'] }
  },
  'bill-gates': {
    avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Bill_Gates_2018.jpg/400px-Bill_Gates_2018.jpg',
    assets: [
      { id: 'bill-gates-1', type: 'real_estate', name: 'Xanadu 2.0', description: "The famous 66,000 sq ft tech-filled estate on Lake Washington — took 7 years and $63M to build.", estimatedValue: 130, image: RE, likes: 8100 }
    ],
    gossip: [{ title: 'Epstein Ties & Marriage Collapse', summary: "Bill Gates' 27-year marriage to Melinda ended in 2021 amid revelations of his friendship with Jeffrey Epstein. The Gates Foundation restructured following the divorce, with Melinda later departing entirely.", type: 'controversy', date: 'May 2021' }],
    relationships: { exSpouse: ['Melinda Gates'], children: ['Jennifer Gates', 'Rory Gates', 'Phoebe Gates'] }
  },
  'billie-eilish': {
    avatar: av('Billie Eilish'),
    assets: [{ id: 'billie-eilish-1', type: 'real_estate', name: 'Highland Park Home', description: "Billie's modern home in Highland Park, LA, where she records music in her private studio.", estimatedValue: 2.5, image: RE, likes: 950 }],
    gossip: [{ title: 'Youngest Artist to Win All Four Major Grammys', summary: "At 18, Billie Eilish became the youngest artist to win all four major Grammy categories — Record, Song, Album of the Year, and Best New Artist — in the same night. She remains pop's most unique voice.", type: 'gossip', date: 'Jan 2020' }],
    relationships: { parents: ['Maggie Baird', "Patrick O'Connell"], siblings: ['Finneas O\'Connell'], exPartner: ['Q', 'Matthew Tyler Vorce', 'Jesse Rutherford'] }
  },
  'billie-jean-king': {
    avatar: av('Billie Jean King'),
    assets: [{ id: 'billie-jean-king-1', type: 'real_estate', name: 'New York Apartment', description: "King's Manhattan apartment, close to her longtime advocacy work in New York.", estimatedValue: 2, image: RE, likes: 520 }],
    gossip: [{ title: 'Battle of the Sexes: The $100,000 Match', summary: "Billie Jean King defeated Bobby Riggs in the famous 'Battle of the Sexes' match in 1973, watched by 90 million people worldwide. The match became a landmark moment for gender equality in sport.", type: 'gossip', date: 'Sep 1973' }],
    relationships: { exSpouse: ['Larry King'], partner: 'Ilana Kloss' }
  },
  'blake-shelton': {
    avatar: av('Blake Shelton'),
    assets: [{ id: 'blake-shelton-1', type: 'real_estate', name: 'Lake Texoma Ranch', description: "Blake's vast Oklahoma ranch near Lake Texoma — the setting for his authentic country lifestyle.", estimatedValue: 5, image: RE, likes: 1100 }],
    gossip: [{ title: 'The Voice Coach Who Married His Co-Star', summary: "Blake Shelton and Gwen Stefani met as coaches on The Voice in 2014, began dating in 2015, and married in 2021 at his Oklahoma ranch. Their romance became one of TV's greatest love stories.", type: 'gossip', date: 'Jul 2021' }],
    relationships: { exSpouse: ['Kaynette Williams', 'Miranda Lambert'], spouse: 'Gwen Stefani' }
  },
  'bono': {
    avatar: av('Bono'),
    assets: [
      { id: 'bono-1', type: 'real_estate', name: 'Killiney Cliff Estate', description: "Bono's spectacular cliff-top estate overlooking Dublin Bay in the exclusive Killiney village.", estimatedValue: 25, image: RE, likes: 2300 }
    ],
    gossip: [{ title: 'ONE Campaign & Fighting Global Poverty', summary: "Bono co-founded the ONE Campaign and DATA (Debt, AIDS, Trade, Africa) organisations, personally lobbying G8 leaders including George W. Bush and Tony Blair to cancel Third World debt. He remains one of music's most influential activists.", type: 'gossip', date: 'Jul 2005' }],
    relationships: { parents: ['Robert Hewson (†)', 'Iris Hewson (†)'], spouse: 'Ali Hewson', siblings: ['Norman Hewson'], children: ['Jordan Hewson', 'Memphis Eve Hewson', 'Elijah Bob Hewson', 'John Abraham Hewson'] }
  },
  'brad-pitt': {
    avatar: av('Brad Pitt'),
    assets: [{ id: 'brad-pitt-1', type: 'real_estate', name: 'Los Feliz Compound', description: "Brad's historic Los Feliz property in Los Angeles — his main base since the 2016 Angelina split.", estimatedValue: 5, image: RE, likes: 1100 }],
    gossip: [{ title: 'Make It Right Foundation Lawsuit', summary: "Brad Pitt's post-Katrina Make It Right Foundation, which built homes for New Orleans flood victims, was sued in 2019 after the new houses developed dangerous defects. The lawsuit was settled for an undisclosed sum.", type: 'controversy', date: 'Aug 2019' }],
    relationships: { parents: ['William Alvin Pitt', 'Jane Etta Pitt'], exSpouse: ['Jennifer Aniston', 'Angelina Jolie'], siblings: ['Doug Pitt', 'Julie Pitt Neal'], children: ['Maddox Chivan', 'Zahara Marley', 'Pax Thien', 'Shiloh Nouvel', 'Vivienne Marcheline', 'Knox Leon'] }
  },
  'brian-chesky': {
    avatar: av('Brian Chesky'),
    assets: [{ id: 'brian-chesky-1', type: 'real_estate', name: 'San Francisco Victorian Home', description: "Chesky's stylish San Francisco home — fittingly, one he initially found through Airbnb.", estimatedValue: 14, image: RE, likes: 1640 }],
    gossip: [{ title: 'From Air Mattress to $75 Billion IPO', summary: "Brian Chesky and Joe Gebbia launched Airbnb in 2008 by renting air mattresses in their San Francisco apartment. By 2020, despite COVID devastating travel, Airbnb's IPO valued the company at $47B on its first day.", type: 'gossip', date: 'Dec 2020' }],
    relationships: { exPartner: ['Elissa Patel'] }
  },
  'brooks-koepka': {
    avatar: av('Brooks Koepka'),
    assets: [{ id: 'brooks-koepka-1', type: 'real_estate', name: 'Palm Beach Waterfront Home', description: "Koepka's waterfront Palm Beach property with private golf simulator and pool.", estimatedValue: 7, image: RE, likes: 1220 }],
    gossip: [{ title: 'First Golfer to Win Back-to-Back US Opens Twice', summary: "Brooks Koepka became the first golfer since Curtis Strange to win back-to-back US Opens (2017 & 2018), then repeated the feat at the PGA Championship (2018 & 2019), establishing himself as the greatest major specialist of his era.", type: 'gossip', date: 'May 2019' }],
    relationships: { spouse: 'Jena Sims' }
  },
  'bruce-springsteen': {
    avatar: av('Bruce Springsteen'),
    assets: [{ id: 'bruce-springsteen-1', type: 'real_estate', name: 'Monmouth County Farm', description: "Springsteen's 378-acre horse farm in Colts Neck, New Jersey — his beloved home since the 1980s.", estimatedValue: 14, image: RE, likes: 1640 }],
    gossip: [{ title: '$500M Masters Catalogue Sale', summary: "Bruce Springsteen sold his entire music masters and publishing catalogue to Sony Music in 2021 for a reported $500M — one of the largest music catalogue deals in history.", type: 'gossip', date: 'Dec 2021' }],
    relationships: { exSpouse: ['Julianne Phillips'], spouse: 'Patti Scialfa', children: ['Evan James Springsteen', 'Jessica Rae Springsteen', 'Samuel Ryan Springsteen'] }
  },
  'bruce-willis': {
    avatar: av('Bruce Willis'),
    assets: [{ id: 'bruce-willis-1', type: 'real_estate', name: "Turks & Caicos Island Estate", description: "Willis' luxury Caribbean compound in Turks & Caicos, owned since the late 1990s.", estimatedValue: 12, image: RE, likes: 1520 }],
    gossip: [{ title: 'Aphasia Diagnosis & Retirement from Acting', summary: "In March 2022, Bruce Willis retired from acting after being diagnosed with aphasia, a condition affecting his ability to communicate. His family later revealed the diagnosis had progressed to frontotemporal dementia.", type: 'controversy', date: 'Mar 2022' }],
    relationships: { exSpouse: ['Demi Moore'], spouse: 'Emma Heming', children: ['Rumer Willis', 'Scout LaRue Willis', 'Tallulah Belle Willis', 'Mabel Ray Willis', 'Evelyn Penn Willis'] }
  },
  'cameron-diaz': {
    avatar: av('Cameron Diaz'),
    assets: [{ id: 'cameron-diaz-1', type: 'real_estate', name: 'Beverly Hills Estate', description: "Cameron's Beverly Hills family home, where she lives with husband Benji Madden and their children.", estimatedValue: 7, image: RE, likes: 1220 }],
    gossip: [{ title: 'Unretirement: Back for Back in Action', summary: "Cameron Diaz retired from acting in 2014 after The Other Woman. She made a comeback 10 years later in the Netflix action comedy Back in Action (2024) with Jamie Foxx, surprising fans who had assumed her retirement was permanent.", type: 'gossip', date: 'Jan 2024' }],
    relationships: { spouse: 'Benji Madden', children: ['Raddix Chloe Wildflower Madden'] }
  },
  'camila-cabello': {
    avatar: av('Camila Cabello'),
    assets: [{ id: 'camila-cabello-1', type: 'real_estate', name: 'Los Angeles Home', description: "Camila's contemporary home in the Bel Air area of Los Angeles.", estimatedValue: 3.5, image: RE, likes: 810 }],
    gossip: [{ title: 'Havana: 1 Billion Streams & the Fifth Harmony Exit', summary: "Camila Cabello's departure from Fifth Harmony in 2016 was one of pop's most dramatic exits. Her solo debut Havana became one of the biggest songs of 2017, surpassing 1 billion Spotify streams.", type: 'gossip', date: 'Dec 2016' }],
    relationships: { parents: ['Alejandro Cabello', 'Sinuhe Estrabao'], exPartner: ['Shawn Mendes'] }
  },
  'canelo-alvarez': {
    avatar: av('Canelo Alvarez'),
    assets: [
      { id: 'canelo-alvarez-1', type: 'car', name: 'Ferrari SF90 Stradale', description: "Canelo's prized Ferrari SF90 — one of several luxury cars in his Guadalajara collection.", estimatedValue: 0.5, image: CA, likes: 1130 },
      { id: 'canelo-alvarez-2', type: 'real_estate', name: 'Guadalajara Estate', description: "The boxing champion's grand estate in his hometown of Guadalajara, Mexico.", estimatedValue: 8, image: RE, likes: 1280 }
    ],
    gossip: [{ title: 'Undisputed Super Middleweight Champion', summary: "Canelo Alvarez became undisputed super middleweight champion in 2021 by defeating Caleb Plant, unifying all four major belts. With a reported net worth of $140M+, he signed the most lucrative boxing contract ever with DAZN.", type: 'gossip', date: 'Nov 2021' }],
    relationships: { children: ['Emily Cinnamon Alvarez', 'Mía Ener Álvarez', 'Fernanda Alvarez', 'Saúl Adiel Álvarez'] }
  },
  'cara-delevingne': {
    avatar: av('Cara Delevingne'),
    assets: [{ id: 'cara-delevingne-1', type: 'real_estate', name: "Los Angeles 'Playhouse'", description: "Cara's eccentric Los Angeles home, famous for its elaborate adult treehouse and slide.", estimatedValue: 7, image: RE, likes: 1220 }],
    gossip: [{ title: 'The Playhouse & Public Wellness Struggles', summary: "Cara Delevingne's custom Los Angeles 'playhouse' went viral in a 2021 Architectural Digest feature. She later opened up about struggles with mental health and substance use, becoming an advocate for wellness in the fashion industry.", type: 'gossip', date: 'Dec 2021' }],
    relationships: { parents: ['Charles Delevingne', 'Pandora Delevingne'], siblings: ['Poppy Delevingne', 'Chloe Delevingne'], exPartner: ['St. Vincent', 'Ashley Benson'] }
  },
  'cardi-b': {
    avatar: av('Cardi B'),
    assets: [{ id: 'cardi-b-1', type: 'real_estate', name: 'Atlanta Mansion', description: "Cardi B's sprawling Atlanta mansion with luxury finishes, home theatre, and custom walk-in closets.", estimatedValue: 5.8, image: RE, likes: 1148 }],
    gossip: [{ title: 'Bodak Yellow: From Instagram to #1 Billboard', summary: "Cardi B became the first solo female rapper to reach #1 on the Billboard Hot 100 in 19 years with Bodak Yellow in 2017. Her Invasion of Privacy won the first Grammy for Best Rap Album by a solo female artist.", type: 'gossip', date: 'Sep 2017' }],
    relationships: { spouse: 'Offset', children: ['Kulture Kiari Cephus', 'Wave Set Cephus'] }
  },
  'carl-icahn': {
    avatar: av('Carl Icahn'),
    assets: [
      { id: 'carl-icahn-1', type: 'real_estate', name: 'Palm Beach Villa', description: "Icahn's oceanfront Palm Beach estate — his primary winter residence.", estimatedValue: 18, image: RE, likes: 1880 },
      { id: 'carl-icahn-2', type: 'yacht', name: 'Starfire', description: "Icahn's 53-metre superyacht Starfire, docked in Palm Beach Marina.", estimatedValue: 25, image: YA, likes: 2300 }
    ],
    gossip: [{ title: 'Hindenburg Research Short Report Wipes $9B', summary: "In 2023, short seller Hindenburg Research released a damning report alleging Icahn Enterprises was overvalued. The stock dropped 50%, wiping $9 billion from its market cap — one of the most dramatic short-seller attacks in history.", type: 'controversy', date: 'May 2023' }],
    relationships: { exSpouse: ['Liba Trejbal'], spouse: 'Gail Golden', children: ['Brett Icahn'] }
  },
}
