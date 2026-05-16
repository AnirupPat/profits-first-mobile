export type GoalCategory = 'retirement' | 'education' | 'home' | 'travel';

export type GoalStatus = 'on-track' | 'lagging' | 'ahead';

export type GoalRiskProfile = 'aggressive' | 'balanced' | 'conservative';

export type LinkedFund = {
  fundId: string;
  monthlySip: number;
};

export type Goal = {
  id: string;
  name: string;
  category: GoalCategory;
  targetAmount: number;
  currentAmount: number;
  targetYear: number;
  horizonYears: number;
  monthlySipNeeded: number;
  monthlySipActual: number;
  status: GoalStatus;
  riskProfile: GoalRiskProfile;
  equityPct: number;
  debtPct: number;
  alternativesPct: number;
  recommendedFundIds: string[];
  linkedFunds: LinkedFund[];
};
