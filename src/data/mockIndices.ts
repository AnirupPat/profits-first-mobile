export type IndexDetail = {
  id: string;
  name: string;
  shortName: string;
  category: string;
};

export const INDEX_DETAILS: Record<string, IndexDetail> = {
  'nifty-100-tri': {
    id: 'nifty-100-tri',
    name: 'Nifty 100 TRI',
    shortName: 'Nifty 100',
    category: 'Large Cap Index',
  },
  'nifty-500-tri': {
    id: 'nifty-500-tri',
    name: 'Nifty 500 TRI',
    shortName: 'Nifty 500',
    category: 'Broad Market Index',
  },
  'nifty-midcap-150-tri': {
    id: 'nifty-midcap-150-tri',
    name: 'Nifty Midcap 150 TRI',
    shortName: 'Midcap 150',
    category: 'Mid Cap Index',
  },
  'nifty-smallcap-250-tri': {
    id: 'nifty-smallcap-250-tri',
    name: 'Nifty Smallcap 250 TRI',
    shortName: 'Smallcap 250',
    category: 'Small Cap Index',
  },
  'crisil-short-term-bond': {
    id: 'crisil-short-term-bond',
    name: 'CRISIL Short Term Bond Index',
    shortName: 'CRISIL ST Bond',
    category: 'Short Duration Debt Index',
  },
  'crisil-liquid-fund': {
    id: 'crisil-liquid-fund',
    name: 'CRISIL Liquid Fund Index',
    shortName: 'CRISIL Liquid',
    category: 'Liquid Fund Index',
  },
  'domestic-gold-price': {
    id: 'domestic-gold-price',
    name: 'Domestic Gold Price',
    shortName: 'Gold',
    category: 'Commodity Index',
  },
};

export const INDEX_LIST: IndexDetail[] = Object.values(INDEX_DETAILS);
