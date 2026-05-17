const MAP: Record<string, string> = {
  'Large Cap Equity': 'nifty-100-tri',
  'Flexi Cap Equity': 'nifty-500-tri',
  'Mid Cap Equity': 'nifty-midcap-150-tri',
  'Small Cap Equity': 'nifty-smallcap-250-tri',
  'ELSS': 'nifty-500-tri',
  'Short Duration Debt': 'crisil-short-term-bond',
  'Liquid Fund': 'crisil-liquid-fund',
  'Commodity (Gold)': 'domestic-gold-price',
};

const FALLBACK = 'nifty-500-tri';

export function defaultBenchmarkFor(category: string | undefined): string {
  if (!category) return FALLBACK;
  return MAP[category] ?? FALLBACK;
}
