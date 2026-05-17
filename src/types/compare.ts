export type EntityKind = 'fund' | 'index';

export type Entity = { kind: EntityKind; id: string };

export type NavPoint = { date: string; nav: number };

export type EntitySnapshot = {
  kind: EntityKind;
  id: string;
  name: string;
  category: string;
  navOrLevel: number;
  navDate: string;
  isFund: boolean;
  fundManager?: string;
  expenseRatioPct?: number;
  aumCr?: number;
  rollingReturns: { '3Y': number | null; '5Y': number | null; '10Y': number | null };
  sharpeRatio: number | null;
  stdDevPct: number | null;
  maxDrawdownPct: number | null;
  betaVsDefaultBenchmark?: number | null;
  jensensAlphaPct?: number | null;
  history: NavPoint[];
};

export type MetricDirection = 'higher' | 'lower' | 'neutral';

export type MetricDefinition = {
  key: string;
  label: string;
  direction: MetricDirection;
  format: (value: number | null | undefined, isFund: boolean) => string;
  pick: (snap: EntitySnapshot) => number | null | undefined;
  requiresIndexOnRight?: boolean;
  fundOnly?: boolean;
};

export type ComparisonGroup = {
  key: string;
  title: string;
  metrics: MetricDefinition[];
};

export type ChartWindow = '1Y' | '3Y' | '5Y' | '10Y' | 'Max';
