import type {
  FinancialInsurance,
  FinancialLiabilities,
  FinancialSection,
} from '@/types/onboarding';

export type HealthBucket = 'good' | 'warn' | 'bad';

// Demo proxy: real EMI depends on tenor + rate. We approximate from outstanding
// balances using typical product-level percentages so the dashboard reacts
// sensibly when the user edits liabilities in onboarding.
export function estimateMonthlyEmi(l: FinancialLiabilities): number {
  return Math.round(
    l.homeLoan * 0.01 +
      l.carLoan * 0.02 +
      l.personalLoan * 0.025 +
      l.creditCard * 0.05,
  );
}

export function computeDti(monthlyIncome: number, l: FinancialLiabilities): number {
  if (monthlyIncome <= 0) return 0;
  return Math.min(1, estimateMonthlyEmi(l) / monthlyIncome);
}

export function dtiBucket(dti: number): HealthBucket {
  if (dti <= 0.35) return 'good';
  if (dti <= 0.5) return 'warn';
  return 'bad';
}

export function totalDebt(l: FinancialLiabilities): number {
  return l.homeLoan + l.carLoan + l.personalLoan + l.creditCard;
}

export function totalDebtBucket(total: number, annualIncome: number): HealthBucket {
  if (annualIncome <= 0) return 'bad';
  const ratio = total / annualIncome;
  if (ratio <= 2) return 'good';
  if (ratio <= 4) return 'warn';
  return 'bad';
}

export function highInterestDebt(l: FinancialLiabilities): number {
  return l.creditCard + l.personalLoan;
}

export function highInterestBucket(amount: number, monthlyIncome: number): HealthBucket {
  if (amount === 0) return 'good';
  if (amount <= monthlyIncome) return 'warn';
  return 'bad';
}

export function sipToIncomeRatio(monthlySip: number, monthlyIncome: number): number {
  if (monthlyIncome <= 0) return 0;
  return Math.min(1, monthlySip / monthlyIncome);
}

export function sipBucket(ratio: number): HealthBucket {
  if (ratio >= 0.2) return 'good';
  if (ratio >= 0.1) return 'warn';
  return 'bad';
}

export function emergencyMonths(cash: number, monthlyExpense: number): number {
  if (monthlyExpense <= 0) return 0;
  return cash / monthlyExpense;
}

export function emergencyBucket(months: number): HealthBucket {
  if (months >= 6) return 'good';
  if (months >= 3) return 'warn';
  return 'bad';
}

export function emergencySegments(months: number): 0 | 1 | 2 | 3 | 4 {
  if (months >= 6) return 4;
  if (months >= 3) return 3;
  if (months >= 1.5) return 2;
  if (months >= 0.5) return 1;
  return 0;
}

// Insurance markers measured against annual income (rule-of-thumb multiples).
// Health: at least 1x annual income; comfortable at 3x.
// Term: at least 5x annual income; comfortable at 10x.
export function healthCoverRatio(cover: number, annualIncome: number): number {
  if (annualIncome <= 0) return 0;
  return cover / annualIncome;
}

export function healthCoverBucket(ratio: number): HealthBucket {
  if (ratio >= 3) return 'good';
  if (ratio >= 1) return 'warn';
  return 'bad';
}

export function termCoverRatio(
  lifeCover: number,
  hasTerm: boolean,
  annualIncome: number,
): number {
  if (!hasTerm || annualIncome <= 0) return 0;
  return lifeCover / annualIncome;
}

export function termCoverBucket(ratio: number, hasTerm: boolean): HealthBucket {
  if (!hasTerm) return 'bad';
  if (ratio >= 10) return 'good';
  if (ratio >= 5) return 'warn';
  return 'bad';
}

export type HealthMetrics = {
  monthlyIncome: number;
  annualIncome: number;
  dti: number;
  dtiBucket: HealthBucket;
  monthlyEmi: number;
  totalDebt: number;
  totalDebtRatio: number;
  totalDebtBucket: HealthBucket;
  hiDebt: number;
  hiDebtBucket: HealthBucket;
  sipRatio: number;
  sipBucket: HealthBucket;
  monthlySip: number;
  emergencyMonths: number;
  emergencyBucket: HealthBucket;
  emergencySegments: 0 | 1 | 2 | 3 | 4;
  emergencyCash: number;
  monthlyExpense: number;
  healthCover: number;
  healthCoverRatio: number;
  healthCoverBucket: HealthBucket;
  hasTerm: boolean;
  lifeCover: number;
  termCoverRatio: number;
  termCoverBucket: HealthBucket;
  insurance: FinancialInsurance;
};

export function computeHealth(f: FinancialSection): HealthMetrics {
  const annualIncome = f.monthlyIncome * 12;
  const dti = computeDti(f.monthlyIncome, f.liabilities);
  const monthlyEmi = estimateMonthlyEmi(f.liabilities);
  const td = totalDebt(f.liabilities);
  const hi = highInterestDebt(f.liabilities);
  const sip = f.monthlySip ?? 0;
  const sipRatio = sipToIncomeRatio(sip, f.monthlyIncome);
  const months = emergencyMonths(f.assets.cash, f.monthlyExpense);
  const hcRatio = healthCoverRatio(f.insurance.healthCover, annualIncome);
  const tcRatio = termCoverRatio(f.insurance.lifeCover, f.insurance.hasTermPlan, annualIncome);
  return {
    monthlyIncome: f.monthlyIncome,
    annualIncome,
    dti,
    dtiBucket: dtiBucket(dti),
    monthlyEmi,
    totalDebt: td,
    totalDebtRatio: annualIncome > 0 ? td / annualIncome : 0,
    totalDebtBucket: totalDebtBucket(td, annualIncome),
    hiDebt: hi,
    hiDebtBucket: highInterestBucket(hi, f.monthlyIncome),
    sipRatio,
    sipBucket: sipBucket(sipRatio),
    monthlySip: sip,
    emergencyMonths: months,
    emergencyBucket: emergencyBucket(months),
    emergencySegments: emergencySegments(months),
    emergencyCash: f.assets.cash,
    monthlyExpense: f.monthlyExpense,
    healthCover: f.insurance.healthCover,
    healthCoverRatio: hcRatio,
    healthCoverBucket: healthCoverBucket(hcRatio),
    hasTerm: f.insurance.hasTermPlan,
    lifeCover: f.insurance.lifeCover,
    termCoverRatio: tcRatio,
    termCoverBucket: termCoverBucket(tcRatio, f.insurance.hasTermPlan),
    insurance: f.insurance,
  };
}
