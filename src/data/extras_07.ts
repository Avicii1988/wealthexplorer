import type { Ext } from './extraCelebritiesExtended'
const RE = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&h=600&fit=crop'
const CA = 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=900&h=600&fit=crop'
const YA = 'https://images.unsplash.com/photo-1605281317010-fe5ffe798166?w=900&h=600&fit=crop'
const JT = 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=900&h=600&fit=crop'
const av = (n: string) => `https://ui-avatars.com/api/?name=${encodeURIComponent(n)}&background=1a1a1a&color=c9a84c&size=200&bold=true`
export const extras_07: Record<string, Ext> = {
  'elvis-presley': {
    avatar: av('Elvis Presley'),
    assets: [{ id: 'elvis-presley-1', type: 'real_estate', name: 'Graceland, Memphis', description: "Elvis's legendary 13-acre Memphis estate — now a museum attracting 650,000 visitors per year.", estimatedValue: 100, image: RE, likes: 6200 }],
    gossip: [{ title: "The King Lives: $400M in Annual Revenue from Beyond the Grave", summary: "Elvis Presley's estate generates over $400M in annual revenue — more than almost any living musician. The 2022 Baz Luhrmann biopic Elvis grossed $286M worldwide, introducing the King to a new generation.", type: 'gossip', date: 'Jun 2022' }],
    relationships: { parents: ['Vernon Presley (†)', 'Gladys Presley (†)'], exSpouse: ['Priscilla Presley'], children: ['Lisa Marie Presley (†)'] }
  },
  'eminem': {
    avatar: av('Eminem'),
    assets: [{ id: 'eminem-1', type: 'real_estate', name: 'Rochester Hills Mansion', description: "Eminem's 15,000 sq ft Michigan mansion purchased in 2003, his primary residence.", estimatedValue: 1.8, image: RE, likes: 708 }],
    gossip: [{ title: 'Super Bowl Halftime & a Decade of Silence Broken', summary: "Eminem performed at the 2022 Super Bowl halftime show alongside Dr. Dre, Snoop Dogg, and Kendrick Lamar, kneeling in tribute to Colin Kaepernick. The performance was watched by 103 million viewers.", type: 'gossip', date: 'Feb 2022' }],
    relationships: { exSpouse: ['Kim Scott'], children: ['Hailie Jade Mathers', 'Alaina Marie Mathers', 'Stevie Laine Mathers'] }
  },
  'emma-stone': {
    avatar: av('Emma Stone'),
    assets: [{ id: 'emma-stone-1', type: 'real_estate', name: 'Malibu Beach House', description: "Emma Stone's beachfront Malibu home purchased with husband Dave McCary.", estimatedValue: 4, image: RE, likes: 940 }],
    gossip: [{ title: 'Poor Things & Back-to-Back Oscar Wins', summary: "Emma Stone won her second Academy Award for Best Actress for Poor Things (2024), becoming only the tenth actress in history to win the award multiple times. Her first win was for La La Land in 2017.", type: 'gossip', date: 'Mar 2024' }],
    relationships: { spouse: 'Dave McCary', children: ['Louise Jean McCary'] }
  },
  'emma-watson': {
    avatar: av('Emma Watson'),
    assets: [{ id: 'emma-watson-1', type: 'real_estate', name: 'Notting Hill House', description: "Watson's elegant terraced home in Notting Hill, London — a short walk from the famous market.", estimatedValue: 4, image: RE, likes: 940 }],
    gossip: [{ title: 'UN Women Goodwill Ambassador & HeForShe', summary: "Emma Watson gave a landmark speech at the United Nations in 2014 launching the HeForShe campaign for gender equality. She has since become one of the world's most prominent feminist activists while maintaining a private personal life.", type: 'gossip', date: 'Sep 2014' }],
    relationships: { parents: ['Chris Watson', 'Jacqueline Luesby'], siblings: ['Alex Watson'] }
  },
  'enrique-iglesias': {
    avatar: av('Enrique Iglesias'),
    assets: [{ id: 'enrique-iglesias-1', type: 'real_estate', name: 'Star Island Estate, Miami', description: "Enrique's waterfront Star Island home, shared with Anna Kournikova and their three children.", estimatedValue: 15, image: RE, likes: 1900 }],
    gossip: [{ title: 'The Most Awarded Latin Artist in History', summary: "Enrique Iglesias has won more Billboard Latin Music Awards than any other artist in history — holding records in multiple categories including Hot Latin Songs Artist of the Decade for the 2000s.", type: 'gossip', date: 'Apr 2010' }],
    relationships: { parents: ['Julio Iglesias', 'Isabel Preysler'], siblings: ['Julio José Iglesias Jr.', 'Chabeli Iglesias'], partner: 'Anna Kournikova', children: ['Nicholas Iglesias Kournikova', 'Lucy Iglesias Kournikova', 'Mary Iglesias Kournikova'] }
  },
  'erling-haaland': {
    avatar: av('Erling Haaland'),
    assets: [{ id: 'erling-haaland-1', type: 'real_estate', name: 'Manchester Apartment', description: "Haaland's luxury Manchester city-centre penthouse, close to Manchester City's training facility.", estimatedValue: 2.5, image: RE, likes: 650 }],
    gossip: [{ title: '36 Premier League Goals: Shattering Shearer\'s Record', summary: "Erling Haaland scored 36 Premier League goals in his debut 2022-23 season with Manchester City, demolishing Andy Cole and Alan Shearer's previous record of 34. He won the Premier League, FA Cup, and Champions League in his first year.", type: 'gossip', date: 'Jun 2023' }],
    relationships: { parents: ['Alfie Haaland', 'Gry Marita Braut'], partner: 'Isabel Haugseng Johansen' }
  },
  'evan-spiegel': {
    avatar: av('Evan Spiegel'),
    assets: [
      { id: 'evan-spiegel-1', type: 'real_estate', name: 'Pacific Palisades Mansion', description: "Spiegel and Miranda Kerr's $12M Pacific Palisades home with ocean views and designer interiors.", estimatedValue: 12, image: RE, likes: 1520 },
      { id: 'evan-spiegel-2', type: 'yacht', name: 'Pacific Spirit', description: "The couple's luxury yacht used for Mediterranean vacations.", estimatedValue: 20, image: YA, likes: 2000 }
    ],
    gossip: [{ title: 'Turning Down Facebook\'s $3 Billion Offer at 23', summary: "At age 23, Evan Spiegel turned down a $3 billion acquisition offer from Mark Zuckerberg for Snapchat, shocking Silicon Valley. Snap eventually IPO'd at a $24 billion valuation in 2017.", type: 'gossip', date: 'Nov 2013' }],
    relationships: { spouse: 'Miranda Kerr', children: ['Hart Kerr Spiegel', 'Myles Spiegel', 'Porter Spiegel'] }
  },
  'evander-holyfield': {
    avatar: av('Evander Holyfield'),
    assets: [{ id: 'evander-holyfield-1', type: 'real_estate', name: 'Fayette County Estate (Former)', description: "Holyfield's 109-room Atlanta mansion with bowling alley and recording studio, foreclosed and sold for $7.5M.", estimatedValue: 7.5, image: RE, likes: 1150 }],
    gossip: [{ title: 'From $250M to Bankruptcy: The Cautionary Tale', summary: "Evander Holyfield earned an estimated $250M during his boxing career, only to declare bankruptcy in 2012. The 109-room Atlanta mansion was foreclosed. At 58, he attempted a comeback fight against Vitor Belfort.", type: 'controversy', date: 'Aug 2012' }],
    relationships: { exSpouse: ['Paulette Bowen', 'Janice Itson', 'Candi Calvana Smith'], children: ['Evander Jr.', 'Ebonne', 'Emage', 'Ewin', 'Eli', 'Elexa', 'Evan', 'Elijah', 'Evette', 'Emily'] }
  },
  'faith-hill': {
    avatar: av('Faith Hill'),
    assets: [{ id: 'faith-hill-1', type: 'real_estate', name: 'Nashville Estate', description: "Faith Hill and Tim McGraw's sprawling Nashville area estate where they raised their three daughters.", estimatedValue: 5, image: RE, likes: 1100 }],
    gossip: [{ title: 'Soul2Soul: $100M Country Tour with Tim McGraw', summary: "Faith Hill and Tim McGraw's Soul2Soul II tour (2006-2007) grossed $100M, making it the highest-grossing country music tour at the time. Together they represent country music's greatest love story.", type: 'gossip', date: 'Nov 2006' }],
    relationships: { spouse: 'Tim McGraw', children: ['Gracie Katherine McGraw', 'Maggie Elizabeth McGraw', 'Audrey Caroline McGraw'] }
  },
  'farhan-akhtar': {
    avatar: av('Farhan Akhtar'),
    assets: [{ id: 'farhan-akhtar-1', type: 'real_estate', name: 'Bandra Apartment, Mumbai', description: "Farhan's luxury apartment in Bandra West, Mumbai's most creative celebrity neighbourhood.", estimatedValue: 5, image: RE, likes: 1100 }],
    gossip: [{ title: 'Dil Chahta Hai: The Film That Changed Bollywood Forever', summary: "Farhan Akhtar's directorial debut Dil Chahta Hai (2001) is credited with modernising Bollywood storytelling, introducing urban friendship narratives. He has since succeeded as director, producer, actor, and singer.", type: 'gossip', date: 'Aug 2001' }],
    relationships: { parents: ['Javed Akhtar', 'Honey Irani'], siblings: ['Zoya Akhtar'], exSpouse: ['Adhuna Bhabani'], partner: 'Shibani Dandekar', children: ['Shakya Akhtar', 'Akira Akhtar'] }
  },
  'fernando-alonso': {
    avatar: av('Fernando Alonso'),
    assets: [{ id: 'fernando-alonso-1', type: 'real_estate', name: 'Oviedo Family Home', description: "Alonso's home in Oviedo, Asturias — the Spanish region he has always called home.", estimatedValue: 3, image: RE, likes: 780 }],
    gossip: [{ title: 'Back on the Podium at 41: The Alonso Renaissance', summary: "Fernando Alonso returned to F1 with Aston Martin in 2023 after two years away and finished on the podium at the Bahrain Grand Prix in his first race. At 41, he proved he remains one of the most complete drivers in history.", type: 'gossip', date: 'Mar 2023' }],
    relationships: { exPartner: ['Raquel del Rosario', 'Dasha Kapustina', 'Linda Morselli', 'Andrea Schlager'] }
  },
  'florence-welch': {
    avatar: av('Florence Welch'),
    assets: [{ id: 'florence-welch-1', type: 'real_estate', name: 'Camberwell Home, London', description: "Florence's South London home, close to her artistic and creative roots.", estimatedValue: 2.5, image: RE, likes: 650 }],
    gossip: [{ title: 'Dog Days Are Over & Florence\'s Fearless Artistry', summary: "Florence and the Machine broke through with Lungs (2009) and have since released five acclaimed albums. Florence Welch is widely regarded as one of Britain's greatest live performers, known for barefoot dancing and operatic vocals.", type: 'gossip', date: 'Jul 2009' }],
    relationships: { parents: ['Nick Welch', 'Evelyn Welch'], siblings: ['Grace Welch', 'John Welch', 'Thomas Welch', 'Bill Welch'] }
  },
  'floyd-mayweather': {
    avatar: av('Floyd Mayweather'),
    assets: [
      { id: 'floyd-mayweather-1', type: 'car', name: 'Koenigsegg CCXR Trevita', description: "One of only two Koenigsegg CCXR Trevitas ever made, purchased by Mayweather for $4.8M.", estimatedValue: 4.8, image: CA, likes: 2688 },
      { id: 'floyd-mayweather-2', type: 'jet', name: 'Gulfstream G650', description: "Money Mayweather's Gulfstream G650, one of two private jets in his fleet.", estimatedValue: 65, image: JT, likes: 4110 }
    ],
    gossip: [{ title: "$300M McGregor Night & 50-0 Perfect Record", summary: "Floyd Mayweather earned $300M+ from his 2017 boxing match with Conor McGregor, retiring with a perfect 50-0 record. His 'Money Team' brand and meticulous financial management made him one of sport's first self-made billionaires.", type: 'gossip', date: 'Aug 2017' }],
    relationships: { exPartner: ['Josie Harris (†)', 'Melissa Brim'], children: ['Zion Shamaree Mayweather', 'Jirah Mayweather', 'Iyanna Mayweather', 'Devion Cromwell'] }
  },
  'forest-whitaker': {
    avatar: av('Forest Whitaker'),
    assets: [{ id: 'forest-whitaker-1', type: 'real_estate', name: 'Los Angeles Estate', description: "Whitaker's elegant LA estate used for family and his UNESCO Félix Houphouët-Boigny Peace Prize work.", estimatedValue: 5, image: RE, likes: 1100 }],
    gossip: [{ title: 'The Last King of Scotland: An Oscar-Winning Transformation', summary: "Forest Whitaker won the Academy Award for Best Actor for his portrayal of Idi Amin in The Last King of Scotland (2006), widely regarded as one of cinema's greatest transformative performances.", type: 'gossip', date: 'Mar 2007' }],
    relationships: { exSpouse: ['Keisha Nash Whitaker'], children: ['Ocean Alexander Whitaker', 'True Isabella Summer Whitaker', 'Sonnet Noel Whitaker', 'Autumn Alexis Whitaker'] }
  },
  'frank-ocean': {
    avatar: av('Frank Ocean'),
    assets: [{ id: 'frank-ocean-1', type: 'real_estate', name: 'New York Penthouse', description: "Frank Ocean's minimalist Manhattan penthouse, maintaining his reclusive artistic persona.", estimatedValue: 5, image: RE, likes: 1100 }],
    gossip: [{ title: 'Blonde & the Four-Year Wait That Was Worth It', summary: "Frank Ocean released Blonde exclusively on Apple Music in 2016, bypassing his label and surrendering $1M in guaranteed label money. The album became critically acclaimed as a masterpiece and continues to influence music years after its release.", type: 'gossip', date: 'Aug 2016' }],
    relationships: { parents: ['Calvin Cooksey', 'Katonya Breaux'], siblings: ['Ryan Breaux (†)'] }
  },
  'freddie-mercury': {
    avatar: av('Freddie Mercury'),
    assets: [{ id: 'freddie-mercury-1', type: 'real_estate', name: 'Garden Lodge, London (Estate)', description: "Freddie's beloved Garden Lodge in Kensington, London — bequeathed to Mary Austin and still his fan pilgrimage site.", estimatedValue: 20, image: RE, likes: 2000 }],
    gossip: [{ title: 'Bohemian Rhapsody: Still #1 After 50 Years', summary: "Queen's Bohemian Rhapsody (1975) became the first pre-1980s song to cross 1 billion YouTube streams. The 2018 biopic grossed $900M worldwide, introducing Freddie Mercury's extraordinary talent to a new generation.", type: 'gossip', date: 'Oct 2018' }],
    relationships: { parents: ['Bomi Bulsara (†)', 'Jer Bulsara (†)'], siblings: ['Kashmira Cooke'], exPartner: ['Mary Austin'] }
  },
  'future': {
    avatar: av('Future'),
    assets: [{ id: 'future-1', type: 'real_estate', name: 'Atlanta Mansion', description: "Future's sprawling Atlanta compound with recording studio, pool, and basketball court.", estimatedValue: 6, image: RE, likes: 1160 }],
    gossip: [{ title: "DS2 to Metro Boomin: The Architect of Trap's Sound", summary: "Future's DS2 (2015) is widely credited with establishing the melodic trap sound that defined a decade of hip-hop. His prolific output — 9 studio albums in 10 years — makes him one of rap's most influential figures.", type: 'gossip', date: 'Jul 2015' }],
    relationships: { children: ['Nayvadius Wilburn Jr.', 'Londyn', 'Jakobi Wilburn', 'Future Zahir Wilburn', 'Reign Wilburn'] }
  },
  'gal-gadot': {
    avatar: av('Gal Gadot'),
    assets: [{ id: 'gal-gadot-1', type: 'real_estate', name: 'Los Angeles Home', description: "Gal Gadot's elegant LA home with her husband Yaron Varsano and their four daughters.", estimatedValue: 4, image: RE, likes: 940 }],
    gossip: [{ title: 'Wonder Woman & the $821M Box Office Breakthrough', summary: "Gal Gadot's Wonder Woman (2017) became the highest-grossing superhero origin film of all time at the time, grossing $821M worldwide. As the first major female-led DC film, it was a watershed moment for female representation in superhero cinema.", type: 'gossip', date: 'Jun 2017' }],
    relationships: { spouse: 'Yaron Varsano', children: ['Alma Varsano', 'Maya Varsano', 'Daniella Varsano', 'Ori Varsano'] }
  },
  'gareth-bale': {
    avatar: av('Gareth Bale'),
    assets: [{ id: 'gareth-bale-1', type: 'real_estate', name: 'Madrid Villa', description: "Bale's luxury villa in Madrid's exclusive La Finca estate, home during his Real Madrid years.", estimatedValue: 7, image: RE, likes: 1220 }],
    gossip: [{ title: 'Club Over Country: The Golf Flag That Defined Bale', summary: "Gareth Bale celebrated Wales' 2022 World Cup qualification with a flag reading 'Wales. Golf. Madrid. In that order.' — a tongue-in-cheek reference to his priorities that delighted fans and infuriated Real Madrid hierarchy.", type: 'gossip', date: 'Nov 2021' }],
    relationships: { spouse: 'Emma Rhys-Jones', children: ['Alba Violet Bale', 'Nava Valentina Bale', 'Axel Charles Bale'] }
  },
  'gennady-golovkin': {
    avatar: av('Gennady Golovkin'),
    assets: [{ id: 'gennady-golovkin-1', type: 'real_estate', name: 'Big Bear Lake Training Camp', description: "GGG's Big Bear Lake, California training camp — the same altitude training facility used by boxing legends.", estimatedValue: 1.5, image: RE, likes: 590 }],
    gossip: [{ title: "Triple G vs Canelo: Boxing's Greatest Trilogy", summary: "Gennady Golovkin and Canelo Alvarez fought three times (2017-2022) in boxing's most anticipated trilogy. The first fight ended controversially in a draw; Canelo won the rematch and rubber match, but GGG's punching power made him the fight most feared.", type: 'gossip', date: 'Sep 2017' }],
    relationships: { spouse: 'Alina Golovkina', children: ['Egor', 'Alina'] }
  },
  'giannis-antetokounmpo': {
    avatar: av('Giannis Antetokounmpo'),
    assets: [{ id: 'giannis-antetokounmpo-1', type: 'real_estate', name: 'Milwaukee Home', description: "Giannis's Milwaukee home — a symbol of his commitment to the city that gave him his NBA shot.", estimatedValue: 3, image: RE, likes: 780 }],
    gossip: [{ title: "From Selling Goods on Athens Streets to NBA Champion", summary: "Giannis Antetokounmpo grew up in abject poverty in Athens, his Nigerian immigrant family selling goods on the street. By 2021 he had won the NBA Championship, Finals MVP, and signed the largest contract extension in NBA history at $228M.", type: 'gossip', date: 'Jul 2021' }],
    relationships: { parents: ['Charles Antetokounmpo (†)', 'Veronica Antetokounmpo'], siblings: ['Thanasis Antetokounmpo', 'Kostas Antetokounmpo', 'Alex Antetokounmpo', 'Francis Antetokounmpo'], partner: 'Mariah Riddlesprigger', children: ['Liam Charles Antetokounmpo', 'Maverick Shai Antetokounmpo'] }
  },
  'gigi-buffon': {
    avatar: av('Gianluigi Buffon'),
    assets: [{ id: 'gigi-buffon-1', type: 'real_estate', name: 'Turin Villa', description: "Buffon's elegant Turin villa, reflecting his long decades as Juventus' legendary goalkeeper.", estimatedValue: 3, image: RE, likes: 780 }],
    gossip: [{ title: "Italy's Greatest Goalkeeper: 6 World Records", summary: "Gianluigi Buffon holds the record for most clean sheets in Serie A history and was FIFA's World Goalkeeper of the Year three times. At 45, he retired in 2023 as Italian football's most decorated player.", type: 'gossip', date: 'May 2023' }],
    relationships: { exSpouse: ['Alena Seredova'], partner: "Ilaria D'Amico", children: ['Louis Thomas Buffon', 'David Lee Buffon', 'Leopoldo Mattia Buffon'] }
  },
  'gigi-hadid': {
    avatar: av('Gigi Hadid'),
    assets: [{ id: 'gigi-hadid-1', type: 'real_estate', name: 'SoHo Penthouse, New York', description: "Gigi's stylish downtown Manhattan penthouse, a short walk from her favourite NYC haunts.", estimatedValue: 4, image: RE, likes: 940 }],
    gossip: [{ title: "The Hadid Dynasty: From Real Estate to Runway", summary: "Gigi Hadid grew up in a real estate dynasty but built her own empire on the runway. With sister Bella and mother Yolanda, the Hadids became the most prominent family in fashion, with Gigi earning up to $9M per year at her peak.", type: 'gossip', date: 'Jun 2018' }],
    relationships: { parents: ['Mohamed Hadid', 'Yolanda Hadid'], siblings: ['Bella Hadid', 'Anwar Hadid'], exPartner: ['Zayn Malik', 'Tyler Cameron'], children: ['Khai Hadid Malik'] }
  },
  'giorgio-armani': {
    avatar: av('Giorgio Armani'),
    assets: [
      { id: 'giorgio-armani-1', type: 'real_estate', name: 'Pantelleria Island Villa', description: "Armani's breathtaking volcanic island retreat on Pantelleria, where he hosts A-list guests each summer.", estimatedValue: 25, image: RE, likes: 2300 },
      { id: 'giorgio-armani-2', type: 'yacht', name: 'Main (Superyacht)', description: "Armani's 65-metre superyacht Main, moored in the Mediterranean during summer months.", estimatedValue: 60, image: YA, likes: 3800 }
    ],
    gossip: [{ title: "Building Fashion's Greatest Empire Without Partners", summary: "Giorgio Armani is one of the last great fashion houses not owned by LVMH or Kering. He has repeatedly turned down acquisition offers, maintaining full private control of his $5B+ empire since founding it in 1975.", type: 'gossip', date: 'Jan 2020' }],
    relationships: { parents: ['Ugo Armani (†)', 'Maria Maira (†)'], siblings: ['Rosanna Armani', 'Sergio Armani (†)'] }
  },
  'gordon-ramsay': {
    avatar: av('Gordon Ramsay'),
    assets: [
      { id: 'gordon-ramsay-1', type: 'real_estate', name: 'Cornwall Coastal Estate', description: "Ramsay's stunning Rock, Cornwall holiday complex — actually six properties he consolidated into one estate.", estimatedValue: 11, image: RE, likes: 1610 }
    ],
    gossip: [{ title: "Hell's Kitchen to $1.5 Billion Restaurant Empire", summary: "Gordon Ramsay has built a global restaurant empire worth over $1.5 billion, spanning 90+ restaurants across 12 countries. His TV empire — including Hell's Kitchen, MasterChef, and Kitchen Nightmares — has aired in over 100 countries.", type: 'gossip', date: 'Jan 2023' }],
    relationships: { spouse: 'Tana Ramsay', children: ['Megan Jane Ramsay', 'Holly Anna Ramsay', 'Jack Scott Ramsay', 'Tilly Ramsay', 'Oscar James Ramsay', 'Jesse James Ramsay'] }
  },
  'greg-norman': {
    avatar: av('Greg Norman'),
    assets: [
      { id: 'greg-norman-1', type: 'yacht', name: 'Aussie Rules', description: "The Great White Shark's 228-foot superyacht Aussie Rules — one of the largest privately-owned vessels in the world.", estimatedValue: 18, image: YA, likes: 2080 }
    ],
    gossip: [{ title: 'LIV Golf CEO: Dividing the Game He Loved', summary: "Greg Norman became the CEO of Saudi-backed LIV Golf in 2021, overseeing a $255M first season that poached dozens of PGA Tour stars. The move divided professional golf and triggered years of legal battles.", type: 'controversy', date: 'Oct 2021' }],
    relationships: { exSpouse: ['Laura Andrassy', 'Chris Evert'], spouse: 'Kirsten Kutner', children: ['Morgan-Leigh Norman', 'Gregory Norman Jr.'] }
  },
  'gwyneth-paltrow': {
    avatar: av('Gwyneth Paltrow'),
    assets: [{ id: 'gwyneth-paltrow-1', type: 'real_estate', name: 'Montecito Estate', description: "Gwyneth's stunning Montecito, Santa Barbara estate — neighbour to Oprah and Harry & Meghan.", estimatedValue: 5, image: RE, likes: 1100 }],
    gossip: [{ title: "Goop's $250M Empire & the Jade Egg Controversy", summary: "Gwyneth Paltrow's wellness company Goop grew from a newsletter into a $250M+ business, but faced regulatory fines for unsubstantiated health claims including its infamous jade egg product. The ski trial drama in 2023 became a cultural phenomenon.", type: 'gossip', date: 'Mar 2023' }],
    relationships: { parents: ['Blythe Danner', 'Bruce Paltrow (†)'], siblings: ['Jake Paltrow'], exSpouse: ['Chris Martin', 'Brad Falchuk'], children: ['Apple Martin', 'Moses Martin'] }
  },
  'halle-berry': {
    avatar: av('Halle Berry'),
    assets: [{ id: 'halle-berry-1', type: 'real_estate', name: 'Cleveland Avenue Home, LA', description: "Halle Berry's Los Angeles home purchased following her divorce from Olivier Martinez.", estimatedValue: 5, image: RE, likes: 1100 }],
    gossip: [{ title: 'First Black Woman to Win Best Actress Oscar', summary: "Halle Berry won the Academy Award for Best Actress for Monster's Ball in 2002, becoming the first Black woman to win the award. Her tearful acceptance speech referencing all women of colour who came before her remains one of Oscar history's most memorable moments.", type: 'gossip', date: 'Mar 2002' }],
    relationships: { exSpouse: ['David Justice', 'Eric Benét', 'Olivier Martinez'], exPartner: ['Gabriel Aubry'], children: ['Nahla Ariela Aubry', 'Maceo Robert Martinez'] }
  },
  'harrison-ford': {
    avatar: av('Harrison Ford'),
    assets: [
      { id: 'harrison-ford-1', type: 'real_estate', name: 'Wyoming Ranch', description: "Ford's 800-acre ranch near Jackson Hole, Wyoming — his personal escape from Hollywood.", estimatedValue: 10, image: RE, likes: 1400 }
    ],
    gossip: [{ title: 'Indiana Jones at 80: The Oldest Action Hero in Blockbuster History', summary: "Harrison Ford starred in Indiana Jones and the Dial of Destiny (2023) at age 80, making him the oldest lead actor in a major blockbuster franchise. The film was also digitally de-aged to portray him 40 years younger in its prologue.", type: 'gossip', date: 'Jun 2023' }],
    relationships: { exSpouse: ['Mary Marquardt', 'Melissa Mathison'], spouse: 'Calista Flockhart', children: ['Benjamin Ford', 'Willard Ford', 'Malcolm Ford', 'Georgia Ford', 'Liam Flockhart'] }
  },
  'harry-kane': {
    avatar: av('Harry Kane'),
    assets: [{ id: 'harry-kane-1', type: 'real_estate', name: 'Munich Residence', description: "Kane's luxury Munich home after joining Bayern Munich from Tottenham for a British record £100M.", estimatedValue: 5, image: RE, likes: 1100 }],
    gossip: [{ title: 'England\'s Greatest Goalscorer — Without a Trophy', summary: "Harry Kane became England's all-time top scorer in 2023, surpassing Wayne Rooney's record of 53 goals. Despite his individual brilliance, he has won zero trophies with either club or country — the most decorated goalless major career in football history.", type: 'gossip', date: 'Mar 2023' }],
    relationships: { spouse: 'Katie Goodland', children: ['Ivy Jane Kane', 'Vivienne Jane Kane', 'Louis Harry Kane', 'Henry Edward Kane'] }
  },
  'hilary-swank': {
    avatar: av('Hilary Swank'),
    assets: [{ id: 'hilary-swank-1', type: 'real_estate', name: 'Los Angeles Home', description: "Swank's comfortable LA home where she lives with her husband Philip Schneider and twin children.", estimatedValue: 3.5, image: RE, likes: 810 }],
    gossip: [{ title: 'Two Oscars, Zero Nominations in Between', summary: "Hilary Swank is one of only three actors to win two Best Actor Oscars (Boys Don't Cry, 1999; Million Dollar Baby, 2004), but had zero further nominations for nearly 20 years — one of Hollywood's most puzzling career trajectories.", type: 'gossip', date: 'Mar 2005' }],
    relationships: { exSpouse: ['Chad Lowe', 'Ruben Torres'], spouse: 'Philip Schneider', children: ['Aya Schneider', 'Ohm Schneider'] }
  },
  'howard-schultz': {
    avatar: av('Howard Schultz'),
    assets: [{ id: 'howard-schultz-1', type: 'real_estate', name: 'Seattle Estate', description: "Schultz's elegant Seattle waterfront estate, home to the man who transformed global coffee culture.", estimatedValue: 11, image: RE, likes: 1610 }],
    gossip: [{ title: '$1.50 Handshake to $3 Billion: The Starbucks Story', summary: "Howard Schultz joined Starbucks as a director after being inspired by Italian coffee culture and invested $150,000 to buy the company in 1987. He built it into a 35,000-location empire before exploring a 2020 presidential run.", type: 'gossip', date: 'Jan 1987' }],
    relationships: { spouse: 'Sheri Kersch', children: ['Jordan Schultz', 'Addison Schultz'] }
  },
  'idris-elba': {
    avatar: av('Idris Elba'),
    assets: [{ id: 'idris-elba-1', type: 'real_estate', name: 'South London Home', description: "Idris Elba's stylish South London home — a tribute to his Hackney and Canning Town roots.", estimatedValue: 3, image: RE, likes: 780 }],
    gossip: [{ title: "James Bond Rumours & Luther: The Fan Favourite Who Plays Every Role", summary: "Idris Elba has been the fan-favourite choice for James Bond for over a decade. As Luther, The Wire's Stringer Bell, and Beasts of No Nation's Commandant, he built a reputation as one of Britain's most versatile actors.", type: 'gossip', date: 'Nov 2015' }],
    relationships: { exSpouse: ['Hanne Norgaard', 'Sonya Nicole Hamlin'], spouse: 'Sabrina Dhowre', children: ['Isan Elba', 'Winston Elba'] }
  },
  'imran-khan': {
    avatar: av('Imran Khan'),
    assets: [{ id: 'imran-khan-1', type: 'real_estate', name: 'Bani Gala Estate, Islamabad', description: "Khan's hillside estate in Bani Gala, Islamabad — subject of legal controversy during his prime ministership.", estimatedValue: 5, image: RE, likes: 1100 }],
    gossip: [{ title: "Jailed Former PM: Pakistan's Most Divisive Politician", summary: "Imran Khan, Pakistan's 1992 World Cup-winning cricket captain, served as Prime Minister from 2018-2022 before being ousted in a no-confidence vote. He was subsequently imprisoned in 2023 on charges he claims are politically motivated.", type: 'controversy', date: 'Aug 2023' }],
    relationships: { exSpouse: ['Jemima Goldsmith', 'Reham Khan', 'Bushra Bibi'], children: ['Sulaiman Isa Khan', 'Qasim Khan'] }
  },
  'irina-shayk': {
    avatar: av('Irina Shayk'),
    assets: [{ id: 'irina-shayk-1', type: 'real_estate', name: 'New York City Apartment', description: "Irina's chic Manhattan apartment — her base between global modelling assignments.", estimatedValue: 3, image: RE, likes: 780 }],
    gossip: [{ title: 'Ronaldo Split & the Bradley Cooper Chapter', summary: "Irina Shayk's 2015 split from Cristiano Ronaldo surprised football fans. She later had a four-year relationship with Bradley Cooper, sharing a daughter. Her resilience through high-profile media scrutiny made her one of modelling's most admired figures.", type: 'gossip', date: 'Jan 2015' }],
    relationships: { parents: ['Valery Shaikov (†)', 'Olga Shaykhlislamova'], siblings: ['Tatiana Shayk'], exPartner: ['Cristiano Ronaldo', 'Bradley Cooper'], children: ['Lea De Seine Shayk Cooper'] }
  },
}
