export type HoldingCategory = 'equity' | 'debt' | 'alternatives';

export type Holding = {
  id: string;
  name: string;
  category: HoldingCategory;
  subCategory: string;
  plan: string;
  currentValue: number;
  invested: number;
  returnsPct: number;
  nav: number;
  units: number;
};

export const MOCK_HOLDINGS: Holding[] = [
  {
    id: 'hdfc-top-100',
    name: 'HDFC Top 100 Fund',
    category: 'equity',
    subCategory: 'Large Cap',
    plan: 'Direct · Growth',
    currentValue: 485200,
    invested: 409000,
    returnsPct: 18.6,
    nav: 942.85,
    units: 514.7,
  },
  {
    id: 'icici-bluechip',
    name: 'ICICI Prudential Bluechip',
    category: 'equity',
    subCategory: 'Large Cap',
    plan: 'Regular · Growth',
    currentValue: 212000,
    invested: 197800,
    returnsPct: 7.2,
    nav: 97.42,
    units: 2176.4,
  },
  {
    id: 'pp-flexi-cap',
    name: 'Parag Parikh Flexi Cap',
    category: 'equity',
    subCategory: 'Flexi Cap',
    plan: 'Direct · Growth',
    currentValue: 382800,
    invested: 313500,
    returnsPct: 22.1,
    nav: 84.63,
    units: 4523.1,
  },
  {
    id: 'hdfc-short-term',
    name: 'HDFC Short Term Debt',
    category: 'debt',
    subCategory: 'Short Duration',
    plan: 'Direct · Growth',
    currentValue: 245000,
    invested: 227100,
    returnsPct: 7.9,
    nav: 31.24,
    units: 7845.0,
  },
  {
    id: 'sbi-liquid',
    name: 'SBI Liquid Fund',
    category: 'debt',
    subCategory: 'Liquid',
    plan: 'Direct · Growth',
    currentValue: 128000,
    invested: 120500,
    returnsPct: 6.2,
    nav: 3842.18,
    units: 33.3,
  },
  {
    id: 'nippon-gold-etf',
    name: 'Nippon India Gold ETF',
    category: 'alternatives',
    subCategory: 'Commodity',
    plan: 'ETF',
    currentValue: 44000,
    invested: 39000,
    returnsPct: 12.8,
    nav: 62.15,
    units: 708.0,
  },
];
