import type { OnboardingProfile } from '@/types/onboarding';

// Demo prototype: keep state in memory only so every cold reload starts fresh
// at the invite-code screen with pre-filled fields. Flip to false once we want
// real users to stay signed in across launches.
export const DEMO_MODE = true;

const SEED_UPLOADED_AT = '2026-05-15T09:30:00.000Z';

export const DEMO_PROFILE: OnboardingProfile = {
  step: 'personal',
  personal: {
    fullName: 'Aditya Sharma',
    dob: '1990-03-12',
    gender: 'M',
    city: 'Bengaluru',
    pan: 'ABCDE1234F',
    aadharLast4: '5678',
  },
  financial: {
    assets: {
      cash: 500000,
      equity: 250000,
      mf: 800000,
      realEstate: 7500000,
      gold: 150000,
      epf: 600000,
    },
    liabilities: {
      homeLoan: 4500000,
      carLoan: 350000,
      personalLoan: 0,
      creditCard: 25000,
    },
    insurance: {
      lifeCover: 10000000,
      healthCover: 1000000,
      hasTermPlan: true,
    },
    monthlyIncome: 250000,
    monthlyExpense: 120000,
    monthlySip: 50000,
  },
  documents: {
    items: [
      { specId: 'aadhar-front', status: 'verified', fileName: 'aadhar-front.jpg', uploadedAt: SEED_UPLOADED_AT },
      { specId: 'aadhar-back', status: 'verified', fileName: 'aadhar-back.jpg', uploadedAt: SEED_UPLOADED_AT },
      { specId: 'pan-card', status: 'verified', fileName: 'pan-card.jpg', uploadedAt: SEED_UPLOADED_AT },
      { specId: 'signature', status: 'verified', fileName: 'signature.jpg', uploadedAt: SEED_UPLOADED_AT },
    ],
  },
};

export const DEMO_AUTH = {
  inviteCode: 'PROFITS-DEMO',
  phone: '9999999999',
  otp: '123456',
};
