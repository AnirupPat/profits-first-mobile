import type { SubmittedDoc } from './documents';

export type OnboardingStep = 'personal' | 'financial' | 'documents' | 'done';

export interface PersonalSection {
  fullName: string;
  dob: string;
  gender: 'M' | 'F' | 'O';
  city: string;
  pan: string;
  aadharLast4: string;
}

export interface FinancialAssets {
  cash: number;
  equity: number;
  mf: number;
  realEstate: number;
  gold: number;
  epf: number;
}

export interface FinancialLiabilities {
  homeLoan: number;
  carLoan: number;
  personalLoan: number;
  creditCard: number;
}

export interface FinancialInsurance {
  lifeCover: number;
  healthCover: number;
  hasTermPlan: boolean;
}

export interface FinancialSection {
  assets: FinancialAssets;
  liabilities: FinancialLiabilities;
  insurance: FinancialInsurance;
  monthlyIncome: number;
  monthlyExpense: number;
  monthlySip?: number;
}

export interface DocumentsSection {
  items: SubmittedDoc[];
}

export interface OnboardingProfile {
  step: OnboardingStep;
  personal?: PersonalSection;
  financial?: FinancialSection;
  documents?: DocumentsSection;
}
