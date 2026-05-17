export type RiskLevel =
  | 'Low'
  | 'Low to Moderate'
  | 'Moderate'
  | 'Moderately High'
  | 'High'
  | 'Very High';

export type TopHolding = {
  name: string;
  sector: string;
  pct: number;
};

export type FundDetail = {
  id: string;
  navDate: string;
  currentNav: number;
  navChange: number;
  navChangePct: number;
  aumCr: number;
  sharpeRatio: number;
  churnRatioPct: number;
  expenseRatioPct: number;
  riskLevel: RiskLevel;
  category: string;
  launchDate: string;
  fundManager: string;
  returns1Y: number;
  returns3Y: number;
  returns5Y: number;
  rollingReturns: { '3Y': number; '5Y': number; '10Y': number };
  stdDevPct: number;
  maxDrawdownPct: number;
  betaVsDefaultBenchmark: number;
  jensensAlphaPct: number;
  topHoldings: TopHolding[];
};

export const FUND_DETAILS: Record<string, FundDetail> = {
  'hdfc-top-100': {
    id: 'hdfc-top-100',
    navDate: '24 Jul',
    currentNav: 942.85,
    navChange: 12.4,
    navChangePct: 1.33,
    aumCr: 28450,
    sharpeRatio: 1.82,
    churnRatioPct: 12,
    expenseRatioPct: 0.85,
    riskLevel: 'Very High',
    category: 'Large Cap Equity',
    launchDate: '11 Oct 1996',
    fundManager: 'Rahul Baijal',
    returns1Y: 18.54,
    returns3Y: 22.1,
    returns5Y: 15.42,
    rollingReturns: { '3Y': 19.8, '5Y': 14.7, '10Y': 12.5 },
    stdDevPct: 14.8,
    maxDrawdownPct: -24.6,
    betaVsDefaultBenchmark: 0.94,
    jensensAlphaPct: 1.4,
    topHoldings: [
      { name: 'HDFC Bank Ltd.', sector: 'Financial Services', pct: 9.45 },
      { name: 'ICICI Bank Ltd.', sector: 'Financial Services', pct: 8.12 },
      { name: 'Reliance Ind.', sector: 'Energy', pct: 7.88 },
      { name: 'Infosys Ltd.', sector: 'Technology', pct: 6.54 },
      { name: 'TCS Ltd.', sector: 'Technology', pct: 5.2 },
    ],
  },
  'icici-bluechip': {
    id: 'icici-bluechip',
    navDate: '24 Jul',
    currentNav: 97.42,
    navChange: -0.42,
    navChangePct: -0.43,
    aumCr: 38100,
    sharpeRatio: 1.05,
    churnRatioPct: 30,
    expenseRatioPct: 0.92,
    riskLevel: 'Very High',
    category: 'Large Cap Equity',
    launchDate: '23 May 2008',
    fundManager: 'Anish Tawakley',
    returns1Y: 16.21,
    returns3Y: 19.85,
    returns5Y: 14.9,
    rollingReturns: { '3Y': 17.2, '5Y': 13.8, '10Y': 11.6 },
    stdDevPct: 15.2,
    maxDrawdownPct: -26.3,
    betaVsDefaultBenchmark: 0.96,
    jensensAlphaPct: -0.6,
    topHoldings: [
      { name: 'ICICI Bank Ltd.', sector: 'Financial Services', pct: 10.2 },
      { name: 'HDFC Bank Ltd.', sector: 'Financial Services', pct: 9.3 },
      { name: 'Infosys Ltd.', sector: 'Technology', pct: 7.45 },
      { name: 'Larsen & Toubro', sector: 'Engineering', pct: 5.8 },
      { name: 'Bharti Airtel', sector: 'Telecom', pct: 4.95 },
    ],
  },
  'pp-flexi-cap': {
    id: 'pp-flexi-cap',
    navDate: '24 Jul',
    currentNav: 84.63,
    navChange: 1.18,
    navChangePct: 1.41,
    aumCr: 72300,
    sharpeRatio: 2.14,
    churnRatioPct: 8,
    expenseRatioPct: 0.62,
    riskLevel: 'Very High',
    category: 'Flexi Cap Equity',
    launchDate: '28 May 2013',
    fundManager: 'Rajeev Thakkar',
    returns1Y: 24.1,
    returns3Y: 28.3,
    returns5Y: 20.15,
    rollingReturns: { '3Y': 25.4, '5Y': 19.2, '10Y': 17.8 },
    stdDevPct: 16.5,
    maxDrawdownPct: -20.1,
    betaVsDefaultBenchmark: 0.86,
    jensensAlphaPct: 4.8,
    topHoldings: [
      { name: 'HDFC Bank Ltd.', sector: 'Financial Services', pct: 7.2 },
      { name: 'Alphabet Inc.', sector: 'Technology (US)', pct: 6.8 },
      { name: 'Meta Platforms', sector: 'Technology (US)', pct: 6.2 },
      { name: 'Power Grid Corp', sector: 'Utilities', pct: 5.1 },
      { name: 'Bajaj Holdings', sector: 'Financial Services', pct: 4.7 },
    ],
  },
  'hdfc-short-term': {
    id: 'hdfc-short-term',
    navDate: '24 Jul',
    currentNav: 31.24,
    navChange: 0.02,
    navChangePct: 0.06,
    aumCr: 12850,
    sharpeRatio: 0.94,
    churnRatioPct: 22,
    expenseRatioPct: 0.18,
    riskLevel: 'Moderate',
    category: 'Short Duration Debt',
    launchDate: '25 Jun 2010',
    fundManager: 'Shobhit Mehrotra',
    returns1Y: 7.82,
    returns3Y: 6.45,
    returns5Y: 7.1,
    rollingReturns: { '3Y': 6.9, '5Y': 7.2, '10Y': 7.4 },
    stdDevPct: 1.9,
    maxDrawdownPct: -2.4,
    betaVsDefaultBenchmark: 0.92,
    jensensAlphaPct: 0.3,
    topHoldings: [
      { name: 'GOI 8.38% 2027', sector: 'Govt Securities', pct: 12.4 },
      { name: 'NABARD 7.52%', sector: 'PSU Bonds', pct: 9.8 },
      { name: 'NHAI 7.68%', sector: 'Infrastructure', pct: 8.2 },
      { name: 'LIC Housing Fin.', sector: 'Housing Finance', pct: 6.5 },
      { name: 'SBI 7.90%', sector: 'Banking', pct: 5.4 },
    ],
  },
  'sbi-liquid': {
    id: 'sbi-liquid',
    navDate: '24 Jul',
    currentNav: 3842.18,
    navChange: 0.62,
    navChangePct: 0.02,
    aumCr: 120450,
    sharpeRatio: 1.12,
    churnRatioPct: 285,
    expenseRatioPct: 0.07,
    riskLevel: 'Low',
    category: 'Liquid Fund',
    launchDate: '27 Sep 2007',
    fundManager: 'R. Arun',
    returns1Y: 6.85,
    returns3Y: 5.9,
    returns5Y: 5.75,
    rollingReturns: { '3Y': 6.1, '5Y': 5.9, '10Y': 6.2 },
    stdDevPct: 0.4,
    maxDrawdownPct: -0.3,
    betaVsDefaultBenchmark: 0.98,
    jensensAlphaPct: 0.1,
    topHoldings: [
      { name: 'GOI T-Bills', sector: 'Govt Securities', pct: 24.1 },
      { name: 'Certificate of Deposits', sector: 'Banking', pct: 18.4 },
      { name: 'Commercial Papers', sector: 'Corporates', pct: 15.2 },
      { name: 'CBLO / Repo', sector: 'Money Market', pct: 12.8 },
      { name: 'SBI CP', sector: 'Banking', pct: 8.5 },
    ],
  },
  'nippon-gold-etf': {
    id: 'nippon-gold-etf',
    navDate: '24 Jul',
    currentNav: 62.15,
    navChange: 0.82,
    navChangePct: 1.34,
    aumCr: 3840,
    sharpeRatio: 0.76,
    churnRatioPct: 5,
    expenseRatioPct: 0.47,
    riskLevel: 'High',
    category: 'Commodity (Gold)',
    launchDate: '07 Nov 2007',
    fundManager: 'Mehul Dama',
    returns1Y: 18.2,
    returns3Y: 14.6,
    returns5Y: 12.8,
    rollingReturns: { '3Y': 14.2, '5Y': 12.5, '10Y': 10.8 },
    stdDevPct: 13.6,
    maxDrawdownPct: -12.4,
    betaVsDefaultBenchmark: 0.99,
    jensensAlphaPct: 0.05,
    topHoldings: [
      { name: 'Gold (Physical)', sector: 'Commodity', pct: 99.8 },
    ],
  },
};
