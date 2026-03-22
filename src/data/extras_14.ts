import type { Ext } from './extraCelebritiesExtended'
const RE = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&h=600&fit=crop'
const YA = 'https://images.unsplash.com/photo-1605281317010-fe5ffe798166?w=900&h=600&fit=crop'
const av = (n: string) => `https://ui-avatars.com/api/?name=${encodeURIComponent(n)}&background=1a1a1a&color=c9a84c&size=200&bold=true`
export const extras_14: Record<string, Ext> = {
  'ray-dalio': {
    avatar: av('Ray Dalio'),
    assets: [
      { id: 'ray-dalio-1', type: 'yacht', name: 'Ariadne', description: "Dalio's 88-metre superyacht Ariadne — a floating research vessel and family retreat.", estimatedValue: 50, image: YA, likes: 3200 }
    ],
    gossip: [{ title: "Principles & the World's Largest Hedge Fund", summary: "Ray Dalio founded Bridgewater Associates in his New York apartment in 1975, growing it into the world's largest hedge fund with $150B+ AUM. His memoir Principles (2017) sold over 4 million copies and reshaped management theory.", type: 'gossip', date: 'Sep 2017' }]
  },
  'reed-hastings': {
    avatar: av('Reed Hastings'),
    assets: [{ id: 'reed-hastings-1', type: 'real_estate', name: 'Santa Cruz Estate', description: "Hastings' Santa Cruz, California estate near his original Netflix headquarters.", estimatedValue: 15, image: RE, likes: 1700 }],
    gossip: [{ title: "DVD by Mail to $300B Streaming Giant", summary: "Reed Hastings co-founded Netflix as a DVD mail-rental service in 1997 and pivoted to streaming in 2007. By 2022 the company had 220 million subscribers worldwide — radically transforming how humanity consumes entertainment.", type: 'gossip', date: 'Jan 2007' }]
  },
  'reese-witherspoon': {
    avatar: av('Reese Witherspoon'),
    assets: [{ id: 'reese-witherspoon-1', type: 'real_estate', name: 'Nashville Farm', description: "Reese's family farm outside Nashville — close to her Southern roots and Hello Sunshine offices.", estimatedValue: 6, image: RE, likes: 1160 }],
    gossip: [{ title: "Hello Sunshine's $900M Sale: Hollywood's Greatest Producer Exit", summary: "Reese Witherspoon sold a majority stake in her Hello Sunshine media company to Blackstone for $900M in 2021. The deal made her one of Hollywood's wealthiest female filmmakers and validated female-driven content as a $1B category.", type: 'gossip', date: 'Aug 2021' }]
  },
  'reid-hoffman': {
    avatar: av('Reid Hoffman'),
    assets: [{ id: 'reid-hoffman-1', type: 'real_estate', name: 'Palo Alto Estate', description: "Hoffman's Palo Alto estate, from which he runs Greylock Partners and his various philanthropic ventures.", estimatedValue: 12, image: RE, likes: 1520 }],
    gossip: [{ title: "LinkedIn to Masters of Scale: Silicon Valley's Greatest Networker", summary: "Reid Hoffman co-founded LinkedIn in 2003, selling it to Microsoft for $26.2B in 2016. His Masters of Scale podcast became the most influential business podcast in Silicon Valley, interviewing every major tech founder.", type: 'gossip', date: 'Jun 2016' }]
  },
  'rick-ross': {
    avatar: av('Rick Ross'),
    assets: [
      { id: 'rick-ross-1', type: 'real_estate', name: 'Promise Land Estate, Fayetteville', description: "Rick Ross's 235-acre Georgia estate with 109 rooms — the largest home in Georgia.", estimatedValue: 10, image: RE, likes: 1400 }
    ],
    gossip: [{ title: "Wingstop Empire & The Biggest House in Georgia", summary: "Rick Ross owns 25+ Wingstop franchise locations generating millions annually. His 235-acre Promise Land estate in Georgia was listed for $10M — one of the most extravagant celebrity properties in the American South.", type: 'gossip', date: 'Jan 2022' }]
  },
  'ricky-martin': {
    avatar: av('Ricky Martin'),
    assets: [{ id: 'ricky-martin-1', type: 'real_estate', name: 'Miami Beach Penthouse', description: "Ricky Martin's stunning Miami Beach penthouse with panoramic ocean views.", estimatedValue: 7, image: RE, likes: 1220 }],
    gossip: [{ title: "'Livin' la Vida Loca' & the Coming Out That Changed Latin Culture", summary: "Ricky Martin publicly came out as gay in 2010 after years of speculation, stating it was 'the most important thing he'd ever done'. His LGBT advocacy and ongoing music career have made him one of Latin America's most beloved figures.", type: 'gossip', date: 'Mar 2010' }]
  },
  'robert-downey-jr': {
    avatar: av('Robert Downey Jr'),
    assets: [
      { id: 'robert-downey-jr-1', type: 'real_estate', name: 'Venice Beach Compound', description: "RDJ's custom Venice Beach eco-compound — a collection of sustainable-design homes along the California shore.", estimatedValue: 13, image: RE, likes: 1580 }
    ],
    gossip: [{ title: "Iron Man to $75M Per Film: The Greatest Hollywood Comeback", summary: "Robert Downey Jr's arrest record and drug addiction had seemingly ended his career by 2001. His casting as Iron Man in 2008 launched one of cinema's greatest comebacks — he earned $75M for Avengers: Age of Ultron alone, becoming the world's highest-paid actor.", type: 'gossip', date: 'May 2008' }]
  },
  'roberto-carlos': {
    avatar: av('Roberto Carlos'),
    assets: [{ id: 'roberto-carlos-1', type: 'real_estate', name: 'Brasília Estate', description: "Roberto Carlos's estate in Brasília — the Brazilian capital and home of the Fenômeno's legacy.", estimatedValue: 4, image: RE, likes: 940 }],
    gossip: [{ title: "The Free Kick That Defied Physics", summary: "Roberto Carlos's 1997 free kick against France — which curved impossibly around the wall before swerving into the net — has been studied by physicists worldwide. It remains the most replayed goal in football history and the standard for all free-kick artistry.", type: 'gossip', date: 'Jun 1997' }]
  },
  'roger-federer': {
    avatar: av('Roger Federer'),
    assets: [
      { id: 'roger-federer-1', type: 'real_estate', name: 'Wollerau Estate, Lake Zurich', description: "Federer's spectacular Lake Zurich estate in Wollerau, Switzerland — overlooking the Alps and his beloved Switzerland.", estimatedValue: 8, image: RE, likes: 1280 }
    ],
    gossip: [{ title: "The Retirement Match That Made the World Cry", summary: "Roger Federer played his final professional match at the 2022 Laver Cup alongside Rafael Nadal as his doubles partner. Both men wept openly as they embraced — one of sport's most emotional scenes watched by millions worldwide.", type: 'gossip', date: 'Sep 2022' }]
  },
  'ronaldinho': {
    avatar: av('Ronaldinho'),
    assets: [{ id: 'ronaldinho-1', type: 'real_estate', name: 'Rio de Janeiro Penthouse', description: "Ronaldinho's spectacular Barra da Tijuca penthouse in Rio — overlooking the ocean and beaches he loves.", estimatedValue: 3, image: RE, likes: 780 }],
    gossip: [{ title: "Prison, Fake Passports & the Legend Who Never Faded", summary: "Ronaldinho was arrested in Paraguay in 2020 for carrying a fake passport and spent a month in prison. Despite his extraordinary off-field controversies, he remains universally beloved as the most joyful and skilful footballer of the 2000s.", type: 'controversy', date: 'Mar 2020' }]
  },
  'ronaldo-nazario': {
    avatar: av('Ronaldo Nazario'),
    assets: [{ id: 'ronaldo-nazario-1', type: 'real_estate', name: 'Ibiza Villa', description: "R9's luxurious Ibiza Villa — his Mediterranean retreat between business ventures.", estimatedValue: 8, image: RE, likes: 1280 }],
    gossip: [{ title: "R9: The Greatest Striker Who Ever Lived", summary: "Ronaldo Nazario won two FIFA World Player of the Year awards and two World Cup Golden Boots. His 1998 World Cup mystery illness — which remains unexplained — and subsequent 2002 redemption make his story sport's greatest comeback narrative.", type: 'gossip', date: 'Jun 2002' }]
  },
  'rory-mcilroy': {
    avatar: av('Rory McIlroy'),
    assets: [{ id: 'rory-mcilroy-1', type: 'real_estate', name: 'Palm Beach Gardens Home', description: "McIlroy's Palm Beach Gardens home — close to his US base and several major championship venues.", estimatedValue: 12, image: RE, likes: 1520 }],
    gossip: [{ title: "Grand Slam Completed at Last: 2024 Masters Champion", summary: "Rory McIlroy completed the career Grand Slam at the 2024 Masters Tournament — ending a 10-year search for the missing major in one of Augusta's most dramatic Sundays. The win brought tears and international celebration.", type: 'gossip', date: 'Apr 2024' }]
  },
  'rosie-huntington-whiteley': {
    avatar: av('Rosie Huntington-Whiteley'),
    assets: [{ id: 'rosie-huntington-whiteley-1', type: 'real_estate', name: 'Los Angeles Home', description: "Rosie and Jason Statham's elegant LA home — a study in minimalist luxury.", estimatedValue: 5, image: RE, likes: 1100 }],
    gossip: [{ title: "Rose Inc: The Beauty Brand Built on Substance Not Celebrity", summary: "Rosie Huntington-Whiteley launched Rose Inc as a beauty editorial platform in 2019 before pivoting to a product range. The brand's skincare-first philosophy and editorial credibility made it one of the most respected new celebrity beauty brands.", type: 'gossip', date: 'Sep 2021' }]
  },
  'russell-westbrook': {
    avatar: av('Russell Westbrook'),
    assets: [{ id: 'russell-westbrook-1', type: 'real_estate', name: 'Bel-Air Estate', description: "Westbrook's Bel-Air estate with full basketball court and entertainment complex.", estimatedValue: 7, image: RE, likes: 1220 }],
    gossip: [{ title: "Triple-Double Machine: Oscar Robertson's Record Shattered", summary: "Russell Westbrook broke Oscar Robertson's career triple-double record in 2021, finishing with 184 career triple-doubles. Despite his legendary individual performances, multiple playoff first-round exits define a career of spectacular but ultimately unfulfilled potential.", type: 'gossip', date: 'May 2021' }]
  },
  'ryan-reynolds': {
    avatar: av('Ryan Reynolds'),
    assets: [
      { id: 'ryan-reynolds-1', type: 'real_estate', name: 'Westchester County Estate', description: "Ryan Reynolds and Blake Lively's 1900s Westchester County estate — their family retreat north of NYC.", estimatedValue: 6, image: RE, likes: 1160 }
    ],
    gossip: [{ title: "Aviation Gin, Wrexham & Maximum Effort: The Anti-Celebrity Celebrity", summary: "Ryan Reynolds sold Aviation Gin to Diageo for $610M and co-owns Wrexham AFC (the subject of the Welcome to Wrexham docuseries). His Maximum Effort marketing company is considered the most creative celebrity business operation in entertainment.", type: 'gossip', date: 'Aug 2020' }]
  },
  'sachin-tendulkar': {
    avatar: av('Sachin Tendulkar'),
    assets: [{ id: 'sachin-tendulkar-1', type: 'real_estate', name: 'Bandra Bungalow, Mumbai', description: "Sachin's beloved family home in Bandra, Mumbai — the same neighbourhood he's lived in since childhood.", estimatedValue: 12, image: RE, likes: 1520 }],
    gossip: [{ title: "100 International Centuries: God of Cricket", summary: "Sachin Tendulkar scored 100 international centuries — a record so staggering it may never be broken. His 2013 retirement from cricket at the Wankhede Stadium in Mumbai was watched by 600 million Indians and remains the most emotional farewell in cricket history.", type: 'gossip', date: 'Nov 2013' }]
  },
  'sadio-mane': {
    avatar: av('Sadio Mane'),
    assets: [{ id: 'sadio-mane-1', type: 'real_estate', name: 'Hamburg Residence', description: "Mané's German home following his move to Bayern Munich and subsequent Saudi Pro League transfer.", estimatedValue: 3, image: RE, likes: 780 }],
    gossip: [{ title: "Built a Hospital, School & Stadium for His Village", summary: "Sadio Mané spent $530,000 to build a hospital in his hometown of Bambali, Senegal — a village of 2,000 people with no medical facilities. He also built a school and is constructing a stadium, funnelling his football wealth directly into his community.", type: 'gossip', date: 'Apr 2019' }]
  },
  'salman-khan': {
    avatar: av('Salman Khan'),
    assets: [
      { id: 'salman-khan-1', type: 'real_estate', name: 'Galaxy Apartments, Bandra', description: "Salman Khan's famous Galaxy Apartments penthouse in Bandra — a permanent paparazzi landmark in Mumbai.", estimatedValue: 12, image: RE, likes: 1520 }
    ],
    gossip: [{ title: "Convicted of Poaching — and Still Bollywood's Biggest Star", summary: "Salman Khan was convicted of poaching two blackbucks in 1998 and sentenced to five years in prison in 2018, later released on bail. Despite the legal cloud, his Eid releases consistently break box-office records, making him untouchable commercially.", type: 'controversy', date: 'Apr 2018' }]
  },
  'samuel-l-jackson': {
    avatar: av('Samuel L Jackson'),
    assets: [{ id: 'samuel-l-jackson-1', type: 'real_estate', name: 'Los Angeles Compound', description: "Jackson's sprawling LA compound with a full entertainment complex and golf simulator.", estimatedValue: 10, image: RE, likes: 1400 }],
    gossip: [{ title: "The $27 Billion Man: Hollywood's Highest-Grossing Actor Ever", summary: "Samuel L. Jackson's films have grossed a cumulative $27 billion worldwide — more than any other actor in history. His 150+ film roles and Marvel Universe appearances have made him the most reliably bankable supporting actor ever.", type: 'gossip', date: 'Jan 2022' }]
  },
  'sandra-bullock': {
    avatar: av('Sandra Bullock'),
    assets: [{ id: 'sandra-bullock-1', type: 'real_estate', name: 'Austin Estate', description: "Sandra Bullock's Austin, Texas estate — she has lived in the city for over 20 years.", estimatedValue: 6, image: RE, likes: 1160 }],
    gossip: [{ title: "Jesse James Betrayal & The Blind Side Oscar", summary: "Sandra Bullock won the Academy Award for Best Actress for The Blind Side (2010), only to discover the same week that her husband Jesse James had been unfaithful. She delivered one of Oscar history's most gracious speeches before a tumultuous personal chapter.", type: 'gossip', date: 'Mar 2010' }]
  },
  'satya-nadella': {
    avatar: av('Satya Nadella'),
    assets: [{ id: 'satya-nadella-1', type: 'real_estate', name: 'Bellevue, Washington Home', description: "Nadella's home in Bellevue, Washington — close to Microsoft's Redmond headquarters.", estimatedValue: 10, image: RE, likes: 1400 }],
    gossip: [{ title: "Growth Mindset: Transforming Microsoft from $300B to $3 Trillion", summary: "Satya Nadella took over as Microsoft CEO in 2014 when the company was considered a fading giant. His cloud-first, mobile-first strategy and acquisition of LinkedIn, GitHub, and Activision Blizzard grew the company to a $3 trillion market cap.", type: 'gossip', date: 'Feb 2014' }]
  },
  'scarlett-johansson': {
    avatar: av('Scarlett Johansson'),
    assets: [{ id: 'scarlett-johansson-1', type: 'real_estate', name: 'East Hampton Estate', description: "ScarJo's East Hampton estate — her Hamptons retreat from the pressures of Hollywood superstardom.", estimatedValue: 4, image: RE, likes: 940 }],
    gossip: [{ title: "The OpenAI Voice Controversy & the Black Widow Lawsuit", summary: "Scarlett Johansson sued Disney over the Black Widow streaming release (settled 2021) and publicly accused OpenAI of using a voice similar to hers for ChatGPT's 'Sky' voice without consent in 2024 — a landmark moment for AI ethics.", type: 'controversy', date: 'May 2024' }]
  },
  'sebastian-vettel': {
    avatar: av('Sebastian Vettel'),
    assets: [{ id: 'sebastian-vettel-1', type: 'real_estate', name: 'Switzerland Farm', description: "Vettel's working organic farm in Switzerland — his post-F1 life focused on sustainability and family.", estimatedValue: 5, image: RE, likes: 1100 }],
    gossip: [{ title: "Four Titles & an Environmental Awakening", summary: "Sebastian Vettel won four consecutive F1 World Championships (2010-2013), then retired in 2022 citing family and environmental concerns. He has since become one of motorsport's most prominent environmental activists, attending climate protests and championing sustainability.", type: 'gossip', date: 'Jul 2022' }]
  },
  'selena-gomez': {
    avatar: av('Selena Gomez'),
    assets: [{ id: 'selena-gomez-1', type: 'real_estate', name: 'Encino Mansion', description: "Selena's elegant Encino, LA mansion — her creative and personal base.", estimatedValue: 4.9, image: RE, likes: 1094 }],
    gossip: [{ title: "Rare Beauty's $2B Valuation: The Celebrity Beauty Disruptor", summary: "Selena Gomez's Rare Beauty reached a $2 billion valuation in 2023 — faster than any other celebrity beauty brand in history. Unlike peers, she pledged 1% of sales to her Rare Impact Fund for mental health access.", type: 'gossip', date: 'Nov 2023' }]
  },
  'serena-williams': {
    avatar: av('Serena Williams'),
    assets: [
      { id: 'serena-williams-1', type: 'real_estate', name: 'Bel-Air Mansion', description: "Serena Williams and Alexis Ohanian's Bel-Air mansion — their Los Angeles family home.", estimatedValue: 8, image: RE, likes: 1280 }
    ],
    gossip: [{ title: "23 Grand Slams & the Venture Capital Empire", summary: "Serena Williams won 23 Grand Slam singles titles — the most in the Open Era. After retiring in 2022, she launched Serena Ventures, investing in early-stage startups with a focus on founders from underrepresented groups.", type: 'gossip', date: 'Sep 2022' }]
  },
  'sergio-ramos': {
    avatar: av('Sergio Ramos'),
    assets: [{ id: 'sergio-ramos-1', type: 'real_estate', name: 'Seville Estate', description: "Ramos's private estate in his hometown of Camas, near Seville — a bull-breeding farm he maintains with pride.", estimatedValue: 7, image: RE, likes: 1220 }],
    gossip: [{ title: "El Capitán: 5 Champions Leagues & the Salah Injury Controversy", summary: "Sergio Ramos won five Champions Leagues and four La Liga titles as Real Madrid's captain. His deliberate injury to Mohamed Salah in the 2018 Champions League Final — ending Salah's involvement early — remains one of football's most controversial moments.", type: 'controversy', date: 'May 2018' }]
  },
  'shah-rukh-khan': {
    avatar: av('Shah Rukh Khan'),
    assets: [
      { id: 'shah-rukh-khan-1', type: 'real_estate', name: 'Mannat, Bandra', description: "SRK's iconic Bandra seafront bungalow Mannat — Bollywood's most visited celebrity landmark.", estimatedValue: 200, image: RE, likes: 12200 }
    ],
    gossip: [{ title: "Pathaan's ₹1000 Crore Return & the King Is Back", summary: "Shah Rukh Khan ended a four-year film drought with Pathaan (2023), which crossed ₹1000 crore globally — the fastest Bollywood film to achieve the milestone. His son Aryan's drug arrest in 2021 had temporarily overshadowed his career.", type: 'gossip', date: 'Jan 2023' }]
  },
  'shakira': {
    avatar: av('Shakira'),
    assets: [{ id: 'shakira-1', type: 'real_estate', name: 'Miami Beach Home', description: "Shakira's stunning Miami Beach waterfront home — her new base after relocating from Barcelona.", estimatedValue: 12, image: RE, likes: 1520 }],
    gossip: [{ title: "BZRP Session #53: The Diss Track Heard Around the World", summary: "Shakira's 2023 diss track BZRP Music Sessions #53 — targeting Gerard Piqué and his new girlfriend — broke records with 63 million streams in 24 hours. The track became the most-streamed Latin song in history within a week.", type: 'gossip', date: 'Jan 2023' }]
  },
  'shaquille-oneal': {
    avatar: av('Shaquille ONeal'),
    assets: [
      { id: 'shaquille-oneal-1', type: 'real_estate', name: 'Isleworth Estate, Orlando', description: "Shaq's massive 12-bedroom Orlando estate in the exclusive Isleworth gated community.", estimatedValue: 28, image: RE, likes: 2480 }
    ],
    gossip: [{ title: "Big Chicken, Five Guys & the $1B Business Portfolio", summary: "Shaquille O'Neal has built a $1B+ business portfolio through restaurant franchises (Big Chicken, Five Guys), Google investments, real estate, and media. He is widely studied as the greatest athlete-turned-entrepreneur in American sports history.", type: 'gossip', date: 'Jan 2022' }]
  },
  'simone-biles': {
    avatar: av('Simone Biles'),
    assets: [{ id: 'simone-biles-1', type: 'real_estate', name: 'Spring, Texas Home', description: "Simone Biles's Spring, Texas home — close to the World Champions Centre where she trains.", estimatedValue: 1.2, image: RE, likes: 472 }],
    gossip: [{ title: "Tokyo Withdrawal & Paris Redemption: The Bravest Athlete Alive", summary: "Simone Biles withdrew from the Tokyo 2020 Olympics team final citing mental health concerns, reframing the conversation around athlete wellbeing globally. She returned at Paris 2024 aged 27 to win three gold medals — the most decorated American gymnast in history.", type: 'gossip', date: 'Aug 2024' }]
  },
  'snoop-dogg': {
    avatar: av('Snoop Dogg'),
    assets: [{ id: 'snoop-dogg-1', type: 'real_estate', name: 'Rancho Cucamonga Estate', description: "Snoop's suburban Rancho Cucamonga estate — the family home he has maintained for over 20 years.", estimatedValue: 3, image: RE, likes: 780 }],
    gossip: [{ title: "Paris Olympic Torchbearer & the NOBODY'S BIGGER Moment", summary: "Snoop Dogg became the unlikely star of the Paris 2024 Olympics, serving as a special correspondent for NBC with 34 million viewers. He carried the Olympic torch and became the most beloved figure of the Games — and the most unlikely one.", type: 'gossip', date: 'Aug 2024' }]
  },
  'stephen-curry': {
    avatar: av('Stephen Curry'),
    assets: [{ id: 'stephen-curry-1', type: 'real_estate', name: 'Atherton Estate', description: "Steph Curry's Atherton, California estate — one of Silicon Valley's wealthiest zip codes.", estimatedValue: 7, image: RE, likes: 1220 }],
    gossip: [{ title: "The Man Who Changed Basketball Forever", summary: "Stephen Curry's three-point shooting revolution transformed the NBA — the league shot 22 threes per game before his rise, compared to 35+ by 2024. His four championships and two unanimous MVP awards make him the most transformative player since Michael Jordan.", type: 'gossip', date: 'Jun 2022' }]
  },
  'stephen-schwarzman': {
    avatar: av('Stephen Schwarzman'),
    assets: [
      { id: 'stephen-schwarzman-1', type: 'real_estate', name: 'Park Avenue Duplex, NYC', description: "Schwarzman's legendary Park Avenue duplex — site of his famous 60th birthday party that cost $3M.", estimatedValue: 35, image: RE, likes: 3100 }
    ],
    gossip: [{ title: "$100M MIT Donation & $3M Birthday Party That Changed Wall Street", summary: "Stephen Schwarzman's 60th birthday party in 2007 — with a live Rod Stewart performance and lobster for 500 guests — symbolised the pre-crisis excesses of private equity. He donated $150M to MIT's AI lab in 2018 and £150M to Oxford.", type: 'gossip', date: 'Feb 2007' }]
  },
  'steve-ballmer': {
    avatar: av('Steve Ballmer'),
    assets: [
      { id: 'steve-ballmer-1', type: 'sports_team', name: 'LA Clippers', description: "Ballmer purchased the LA Clippers for $2 billion in 2014 — the highest price ever paid for an NBA franchise at the time.", estimatedValue: 4500, image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=900&h=600&fit=crop', likes: 270200 }
    ],
    gossip: [{ title: "$2 Billion Clippers & the Loudest Owner in the NBA", summary: "Steve Ballmer paid $2B for the LA Clippers in 2014 and immediately became the most enthusiastic franchise owner in professional sports. His floor-shaking courtside celebrations have become a fixture of NBA broadcasts.", type: 'gossip', date: 'May 2014' }]
  },
  'sundar-pichai': {
    avatar: av('Sundar Pichai'),
    assets: [{ id: 'sundar-pichai-1', type: 'real_estate', name: 'Los Altos Hills Estate', description: "Pichai's elegant Los Altos Hills, California estate — close to Google's Mountain View campus.", estimatedValue: 40, image: RE, likes: 3200 }],
    gossip: [{ title: "From Chennai to CEO of the World's Most Powerful Company", summary: "Sundar Pichai grew up in a two-room apartment in Chennai, India and became CEO of Google in 2015 and Alphabet in 2019. His $226M compensation package in 2022 made him the highest-paid CEO of any S&P 500 company.", type: 'gossip', date: 'Jul 2015' }]
  },
}
