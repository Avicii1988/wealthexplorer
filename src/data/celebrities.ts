export interface AssetBreakdown {
  realEstate: number;
  stocks: number;
  business: number;
  entertainment: number;
  crypto: number;
  luxury: number;
}

export interface Celebrity {
  id: string;
  name: string;
  title: string;
  category: 'Tech' | 'Entertainment' | 'Sports' | 'Business' | 'Music' | 'Film';
  netWorth: number; // in billions USD
  netWorthChange: number; // % change YoY
  avatar: string; // emoji avatar
  nationality: string;
  age: number;
  assets: AssetBreakdown;
  knownFor: string[];
  primarySource: string;
  rank: number;
}

export const celebrities: Celebrity[] = [
  {
    id: 'elon-musk',
    name: 'Elon Musk',
    title: 'CEO of Tesla & SpaceX',
    category: 'Tech',
    netWorth: 242,
    netWorthChange: 18.4,
    avatar: '🚀',
    nationality: 'USA',
    age: 52,
    assets: {
      stocks: 78,
      business: 85,
      realEstate: 12,
      entertainment: 28,
      crypto: 25,
      luxury: 14,
    },
    knownFor: ['Tesla', 'SpaceX', 'X.com', 'Neuralink', 'The Boring Company'],
    primarySource: 'Tesla & SpaceX equity',
    rank: 1,
  },
  {
    id: 'jeff-bezos',
    name: 'Jeff Bezos',
    title: 'Founder of Amazon',
    category: 'Tech',
    netWorth: 198,
    netWorthChange: 12.1,
    avatar: '📦',
    nationality: 'USA',
    age: 60,
    assets: {
      stocks: 120,
      business: 40,
      realEstate: 25,
      entertainment: 5,
      crypto: 3,
      luxury: 5,
    },
    knownFor: ['Amazon', 'Blue Origin', 'Washington Post', 'Bezos Earth Fund'],
    primarySource: 'Amazon equity',
    rank: 2,
  },
  {
    id: 'bernard-arnault',
    name: 'Bernard Arnault',
    title: 'Chairman & CEO of LVMH',
    category: 'Business',
    netWorth: 178,
    netWorthChange: -4.2,
    avatar: '👜',
    nationality: 'France',
    age: 75,
    assets: {
      stocks: 140,
      business: 20,
      realEstate: 8,
      entertainment: 4,
      crypto: 0,
      luxury: 6,
    },
    knownFor: ['LVMH', 'Louis Vuitton', 'Dior', 'Moët Hennessy', 'Tiffany & Co.'],
    primarySource: 'LVMH luxury empire',
    rank: 3,
  },
  {
    id: 'mark-zuckerberg',
    name: 'Mark Zuckerberg',
    title: 'CEO of Meta',
    category: 'Tech',
    netWorth: 162,
    netWorthChange: 32.6,
    avatar: '📱',
    nationality: 'USA',
    age: 40,
    assets: {
      stocks: 130,
      business: 15,
      realEstate: 10,
      entertainment: 3,
      crypto: 2,
      luxury: 2,
    },
    knownFor: ['Meta', 'Facebook', 'Instagram', 'WhatsApp', 'Oculus VR'],
    primarySource: 'Meta equity',
    rank: 4,
  },
  {
    id: 'bill-gates',
    name: 'Bill Gates',
    title: 'Co-founder of Microsoft',
    category: 'Tech',
    netWorth: 128,
    netWorthChange: 5.3,
    avatar: '💻',
    nationality: 'USA',
    age: 68,
    assets: {
      stocks: 60,
      business: 25,
      realEstate: 20,
      entertainment: 3,
      crypto: 0,
      luxury: 20,
    },
    knownFor: ['Microsoft', 'Bill & Melinda Gates Foundation', 'Cascade Investment'],
    primarySource: 'Diversified investments',
    rank: 5,
  },
  {
    id: 'warren-buffett',
    name: 'Warren Buffett',
    title: 'CEO of Berkshire Hathaway',
    category: 'Business',
    netWorth: 118,
    netWorthChange: 8.9,
    avatar: '📈',
    nationality: 'USA',
    age: 94,
    assets: {
      stocks: 100,
      business: 10,
      realEstate: 3,
      entertainment: 2,
      crypto: 0,
      luxury: 3,
    },
    knownFor: ['Berkshire Hathaway', 'Value investing', 'Coca-Cola', 'Apple shares'],
    primarySource: 'Berkshire Hathaway',
    rank: 6,
  },
  {
    id: 'taylor-swift',
    name: 'Taylor Swift',
    title: 'Singer-Songwriter',
    category: 'Music',
    netWorth: 1.1,
    netWorthChange: 45.2,
    avatar: '🎤',
    nationality: 'USA',
    age: 35,
    assets: {
      stocks: 2,
      business: 15,
      realEstate: 25,
      entertainment: 50,
      crypto: 0,
      luxury: 8,
    },
    knownFor: ['Eras Tour', 'Album re-recordings', 'Publishing rights', 'Acting'],
    primarySource: 'Music & touring',
    rank: 7,
  },
  {
    id: 'jay-z',
    name: 'Jay-Z',
    title: 'Rapper & Entrepreneur',
    category: 'Music',
    netWorth: 2.5,
    netWorthChange: 6.8,
    avatar: '🎵',
    nationality: 'USA',
    age: 55,
    assets: {
      stocks: 10,
      business: 45,
      realEstate: 15,
      entertainment: 20,
      crypto: 5,
      luxury: 5,
    },
    knownFor: ['Armand de Brignac', 'D\'Ussé', 'Tidal', 'Roc Nation', 'Art collection'],
    primarySource: 'Business ventures',
    rank: 8,
  },
  {
    id: 'lebron-james',
    name: 'LeBron James',
    title: 'NBA Player & Businessman',
    category: 'Sports',
    netWorth: 1.0,
    netWorthChange: 12.3,
    avatar: '🏀',
    nationality: 'USA',
    age: 40,
    assets: {
      stocks: 5,
      business: 50,
      realEstate: 20,
      entertainment: 15,
      crypto: 5,
      luxury: 5,
    },
    knownFor: ['SpringHill Company', 'Blaze Pizza', 'Liverpool FC', 'Space Jam 2'],
    primarySource: 'Media & business empire',
    rank: 9,
  },
  {
    id: 'kylie-jenner',
    name: 'Kylie Jenner',
    title: 'Entrepreneur & Media Personality',
    category: 'Entertainment',
    netWorth: 0.72,
    netWorthChange: -8.1,
    avatar: '💄',
    nationality: 'USA',
    age: 27,
    assets: {
      stocks: 2,
      business: 60,
      realEstate: 15,
      entertainment: 18,
      crypto: 3,
      luxury: 2,
    },
    knownFor: ['Kylie Cosmetics', 'Kylie Skin', 'Kylie Baby', 'Keeping Up with the Kardashians'],
    primarySource: 'Beauty brands',
    rank: 10,
  },
  {
    id: 'rihanna',
    name: 'Rihanna',
    title: 'Singer & Businesswoman',
    category: 'Music',
    netWorth: 1.4,
    netWorthChange: 18.9,
    avatar: '💋',
    nationality: 'Barbados',
    age: 36,
    assets: {
      stocks: 3,
      business: 70,
      realEstate: 10,
      entertainment: 12,
      crypto: 1,
      luxury: 4,
    },
    knownFor: ['Fenty Beauty', 'Savage X Fenty', 'LVMH partnership', 'Music catalog'],
    primarySource: 'Fenty Beauty (LVMH)',
    rank: 11,
  },
  {
    id: 'cristiano-ronaldo',
    name: 'Cristiano Ronaldo',
    title: 'Professional Footballer',
    category: 'Sports',
    netWorth: 0.56,
    netWorthChange: 9.4,
    avatar: '⚽',
    nationality: 'Portugal',
    age: 39,
    assets: {
      stocks: 2,
      business: 30,
      realEstate: 25,
      entertainment: 30,
      crypto: 5,
      luxury: 8,
    },
    knownFor: ['CR7 brand', 'Nike deal', 'Hotels', 'Pestana CR7', 'Social media empire'],
    primarySource: 'Brand endorsements & CR7',
    rank: 12,
  },
];

export const categories = ['All', 'Tech', 'Entertainment', 'Sports', 'Business', 'Music', 'Film'] as const;

export type Category = typeof categories[number];

export function formatNetWorth(value: number): string {
  if (value >= 1) {
    return `$${value.toFixed(1)}B`;
  }
  return `$${(value * 1000).toFixed(0)}M`;
}

export function getWealthTier(netWorth: number): { label: string; color: string; bg: string } {
  if (netWorth >= 100) return { label: 'Centibillionaire', color: 'text-yellow-300', bg: 'bg-yellow-400/20' };
  if (netWorth >= 10) return { label: 'Mega Billionaire', color: 'text-amber-400', bg: 'bg-amber-400/20' };
  if (netWorth >= 1) return { label: 'Billionaire', color: 'text-orange-400', bg: 'bg-orange-400/20' };
  return { label: 'Multi-Millionaire', color: 'text-blue-400', bg: 'bg-blue-400/20' };
}

export function getCategoryColor(category: Celebrity['category']): string {
  const colors: Record<string, string> = {
    Tech: 'text-cyan-400 bg-cyan-400/15',
    Entertainment: 'text-pink-400 bg-pink-400/15',
    Sports: 'text-green-400 bg-green-400/15',
    Business: 'text-purple-400 bg-purple-400/15',
    Music: 'text-rose-400 bg-rose-400/15',
    Film: 'text-indigo-400 bg-indigo-400/15',
  };
  return colors[category] || 'text-gray-400 bg-gray-400/15';
}
