import type { NavPoint } from '@/types/compare';

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashSeed(id: string): number {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function boxMuller(rand: () => number): number {
  const u = Math.max(rand(), 1e-9);
  const v = rand();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

type Spec = { id: string; startNav: number; annualDrift: number; annualVol: number };

const ENTITIES: Spec[] = [
  { id: 'hdfc-top-100', startNav: 220, annualDrift: 0.15, annualVol: 0.16 },
  { id: 'icici-bluechip', startNav: 30, annualDrift: 0.13, annualVol: 0.15 },
  { id: 'pp-flexi-cap', startNav: 18, annualDrift: 0.21, annualVol: 0.17 },
  { id: 'hdfc-short-term', startNav: 16, annualDrift: 0.069, annualVol: 0.018 },
  { id: 'sbi-liquid', startNav: 2240, annualDrift: 0.058, annualVol: 0.004 },
  { id: 'nippon-gold-etf', startNav: 17, annualDrift: 0.13, annualVol: 0.14 },

  { id: 'nifty-100-tri', startNav: 12000, annualDrift: 0.135, annualVol: 0.15 },
  { id: 'nifty-500-tri', startNav: 14000, annualDrift: 0.14, annualVol: 0.16 },
  { id: 'nifty-midcap-150-tri', startNav: 6500, annualDrift: 0.175, annualVol: 0.19 },
  { id: 'nifty-smallcap-250-tri', startNav: 5500, annualDrift: 0.165, annualVol: 0.22 },
  { id: 'crisil-short-term-bond', startNav: 2800, annualDrift: 0.068, annualVol: 0.015 },
  { id: 'crisil-liquid-fund', startNav: 2700, annualDrift: 0.058, annualVol: 0.003 },
  { id: 'domestic-gold-price', startNav: 30000, annualDrift: 0.125, annualVol: 0.14 },
];

const MONTHS = 121;
const END_YEAR = 2026;
const END_MONTH = 5;

function buildSeries(spec: Spec): NavPoint[] {
  const rand = mulberry32(hashSeed(spec.id));
  const muM = spec.annualDrift / 12;
  const sigmaM = spec.annualVol / Math.sqrt(12);
  const points: NavPoint[] = [];
  let nav = spec.startNav;

  const startYear = END_YEAR - 10;
  const startMonth = END_MONTH;

  for (let i = 0; i < MONTHS; i++) {
    const m = startMonth + i;
    const year = startYear + Math.floor((m - 1) / 12);
    const month = ((m - 1) % 12) + 1;
    const date = `${year}-${String(month).padStart(2, '0')}-01`;
    if (i > 0) {
      const shock = boxMuller(rand);
      const ret = muM + sigmaM * shock;
      nav = Math.max(nav * (1 + ret), 0.01);
    }
    points.push({ date, nav: Number(nav.toFixed(4)) });
  }
  return points;
}

export const NAV_HISTORY: Record<string, NavPoint[]> = Object.fromEntries(
  ENTITIES.map((spec) => [spec.id, buildSeries(spec)]),
);

export function getNavHistory(entityId: string): NavPoint[] {
  return NAV_HISTORY[entityId] ?? [];
}
