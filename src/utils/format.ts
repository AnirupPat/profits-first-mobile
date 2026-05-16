// Indian-style currency formatting helpers.
// Indian grouping is 2-digit after the last 3: 250000 → "2,50,000".

function stripTrailingZero(s: string): string {
  return s.endsWith('.0') ? s.slice(0, -2) : s;
}

export function inr(n: number): string {
  const negative = n < 0;
  const s = Math.abs(Math.round(n)).toString();
  if (s.length <= 3) return `₹${negative ? '-' : ''}${s}`;
  const last3 = s.slice(-3);
  const rest = s.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ',');
  return `₹${negative ? '-' : ''}${rest},${last3}`;
}

export function inrCompact(n: number): string {
  if (n >= 10_000_000) {
    const cr = n / 10_000_000;
    return `₹${stripTrailingZero(cr.toFixed(1))}Cr`;
  }
  if (n >= 100_000) {
    const l = n / 100_000;
    return `₹${stripTrailingZero(l.toFixed(1))}L`;
  }
  if (n >= 1_000) return `₹${Math.round(n / 1_000)}K`;
  return `₹${n}`;
}
