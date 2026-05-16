export type PostAuthorType = 'advisor' | 'analyst' | 'member';

export type PostTag =
  | 'Strategy Tip'
  | 'Market Insight'
  | 'Tax Tip'
  | 'Asset Allocation'
  | 'Macro';

export type CommunityPost = {
  id: string;
  authorType: PostAuthorType;
  authorName: string;
  authorRole: string;
  initials: string;
  timestamp: string;
  headline: string;
  body: string;
  tag?: PostTag;
  likes: number;
  comments: number;
  featured?: boolean;
  chartData?: number[];
};

export const MOCK_COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: 'p1',
    authorType: 'advisor',
    authorName: 'Sanjay Kathuria',
    authorRole: 'SEBI-registered Advisor',
    initials: 'SK',
    timestamp: '2h ago',
    headline: 'Tech sector rotation gathers pace — should you rebalance?',
    body: 'Institutional flows have moved decisively from legacy IT to mid-cap infrastructure plays. Most retail portfolios are still over-indexed on the old leaders. Trim 5–10% from your largest tech holding and redeploy into the broader market.',
    tag: 'Market Insight',
    likes: 342,
    comments: 48,
    featured: true,
    chartData: [50, 54, 49, 58, 62, 60, 68, 72, 70, 78, 82, 88],
  },
  {
    id: 'p2',
    authorType: 'analyst',
    authorName: 'Priya Nair',
    authorRole: 'Senior Portfolio Manager',
    initials: 'PN',
    timestamp: '5h ago',
    headline: 'Bonds: the silent wealth preserver',
    body: 'Sovereign yields above 7.4% offer a compelling entry point. With equity volatility spiking, locking in part of your fixed-income allocation today gives you ballast — consider a 15% minimum debt sleeve in the current cycle.',
    tag: 'Asset Allocation',
    likes: 128,
    comments: 12,
  },
  {
    id: 'p3',
    authorType: 'analyst',
    authorName: 'Vikram Sharma',
    authorRole: 'Macro Analyst',
    initials: 'VS',
    timestamp: '1d ago',
    headline: 'Q3 earnings: banks beat, but watch this signal',
    body: 'Top-tier private banks are beating estimates by an average of 4%, mostly driven by retail credit expansion. The number to watch in the upcoming results is NPL provisioning — a small uptick there will reset everyone\'s targets.',
    tag: 'Market Insight',
    likes: 512,
    comments: 84,
  },
  {
    id: 'p4',
    authorType: 'analyst',
    authorName: 'Anjali Verma',
    authorRole: 'Tax Optimization Lead',
    initials: 'AV',
    timestamp: '2d ago',
    headline: 'Harvest losses before March 31',
    body: 'If you\'re sitting on under-performing mid-caps from the 2023 vintage, this is the window. Realising those losses now lets you offset gains booked earlier in the year. Re-enter the same names 31+ days later if the thesis still holds.',
    tag: 'Tax Tip',
    likes: 89,
    comments: 6,
  },
  {
    id: 'p5',
    authorType: 'member',
    authorName: 'Rohan Mehta',
    authorRole: 'Profits-First member',
    initials: 'RM',
    timestamp: '3d ago',
    headline: 'Topping up my emergency fund before SIP increases',
    body: 'After our last review, Sanjay flagged that my emergency cushion was 2.4 months short. Diverted three months of new SIP contributions into a liquid fund first — sleeping better already.',
    likes: 47,
    comments: 9,
  },
];
