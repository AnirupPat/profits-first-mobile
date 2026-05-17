import type { NavPoint } from '@/types/compare';

export const DEFAULT_RFR = 0.065;

const PERIODS_PER_YEAR = 12;

function monthlyReturns(history: NavPoint[]): number[] {
  const out: number[] = [];
  for (let i = 1; i < history.length; i++) {
    const prev = history[i - 1].nav;
    const curr = history[i].nav;
    if (prev > 0) out.push(curr / prev - 1);
  }
  return out;
}

export function rollingCagr(history: NavPoint[], years: number): number | null {
  const months = years * PERIODS_PER_YEAR;
  if (history.length < months + 1) return null;
  const cagrs: number[] = [];
  for (let end = months; end < history.length; end++) {
    const start = end - months;
    const startNav = history[start].nav;
    const endNav = history[end].nav;
    if (startNav <= 0 || endNav <= 0) continue;
    cagrs.push(Math.pow(endNav / startNav, 1 / years) - 1);
  }
  if (cagrs.length === 0) return null;
  const mean = cagrs.reduce((s, r) => s + r, 0) / cagrs.length;
  return mean * 100;
}

export function annualizedStdDev(history: NavPoint[]): number | null {
  const rets = monthlyReturns(history);
  if (rets.length < 2) return null;
  const mean = rets.reduce((s, r) => s + r, 0) / rets.length;
  const variance =
    rets.reduce((s, r) => s + (r - mean) * (r - mean), 0) / (rets.length - 1);
  return Math.sqrt(variance) * Math.sqrt(PERIODS_PER_YEAR) * 100;
}

export function sharpe(history: NavPoint[], rfr = DEFAULT_RFR): number | null {
  const rets = monthlyReturns(history);
  if (rets.length < 2) return null;
  const meanM = rets.reduce((s, r) => s + r, 0) / rets.length;
  const variance =
    rets.reduce((s, r) => s + (r - meanM) * (r - meanM), 0) / (rets.length - 1);
  const stdM = Math.sqrt(variance);
  if (stdM === 0) return null;
  const meanA = meanM * PERIODS_PER_YEAR;
  const stdA = stdM * Math.sqrt(PERIODS_PER_YEAR);
  return (meanA - rfr) / stdA;
}

export function maxDrawdown(history: NavPoint[]): number | null {
  if (history.length === 0) return null;
  let peak = history[0].nav;
  let maxDd = 0;
  for (const p of history) {
    if (p.nav > peak) peak = p.nav;
    const dd = (p.nav - peak) / peak;
    if (dd < maxDd) maxDd = dd;
  }
  return maxDd * 100;
}

function alignedReturns(a: NavPoint[], b: NavPoint[]): { ra: number[]; rb: number[] } {
  const n = Math.min(a.length, b.length);
  const aTail = a.slice(a.length - n);
  const bTail = b.slice(b.length - n);
  const ra: number[] = [];
  const rb: number[] = [];
  for (let i = 1; i < n; i++) {
    const pa = aTail[i - 1].nav;
    const pb = bTail[i - 1].nav;
    if (pa > 0 && pb > 0) {
      ra.push(aTail[i].nav / pa - 1);
      rb.push(bTail[i].nav / pb - 1);
    }
  }
  return { ra, rb };
}

export function beta(fundHistory: NavPoint[], benchHistory: NavPoint[]): number | null {
  const { ra, rb } = alignedReturns(fundHistory, benchHistory);
  if (ra.length < 2) return null;
  const meanA = ra.reduce((s, r) => s + r, 0) / ra.length;
  const meanB = rb.reduce((s, r) => s + r, 0) / rb.length;
  let cov = 0;
  let varB = 0;
  for (let i = 0; i < ra.length; i++) {
    cov += (ra[i] - meanA) * (rb[i] - meanB);
    varB += (rb[i] - meanB) * (rb[i] - meanB);
  }
  if (varB === 0) return null;
  return cov / varB;
}

export function jensensAlpha(
  fundHistory: NavPoint[],
  benchHistory: NavPoint[],
  rfr = DEFAULT_RFR,
): number | null {
  const b = beta(fundHistory, benchHistory);
  if (b === null) return null;
  const { ra, rb } = alignedReturns(fundHistory, benchHistory);
  if (ra.length < 2) return null;
  const meanA = (ra.reduce((s, r) => s + r, 0) / ra.length) * PERIODS_PER_YEAR;
  const meanB = (rb.reduce((s, r) => s + r, 0) / rb.length) * PERIODS_PER_YEAR;
  const alpha = meanA - (rfr + b * (meanB - rfr));
  return alpha * 100;
}

export function rebaseToHundred(history: NavPoint[]): number[] {
  if (history.length === 0) return [];
  const base = history[0].nav;
  if (base <= 0) return history.map(() => 100);
  return history.map((p) => (p.nav / base) * 100);
}

export function sliceWindow(history: NavPoint[], years: number | null): NavPoint[] {
  if (years === null) return history;
  const months = years * PERIODS_PER_YEAR;
  return history.length > months ? history.slice(history.length - months - 1) : history;
}
