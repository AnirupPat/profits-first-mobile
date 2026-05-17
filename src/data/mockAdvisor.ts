import type { Advisor, AdvisoryInsight, AdvisorySlot } from '@/types/advisor';

export const SANJAY: Advisor = {
  id: 'sanjay-kathuria',
  name: 'Sanjay Kathuria',
  credentials: ['CFP', 'CFA'],
  experienceYrs: 18,
  specialisations: ['Equity', 'Retirement', 'Tax Planning', 'Insurance'],
  bio: "Sanjay helps India's emerging affluent navigate wealth creation with clarity and discipline. He believes every rupee deserves a purpose.",
};

// Slots across the next two weeks from 2026-05-17
export const ADVISORY_SLOTS: AdvisorySlot[] = [
  { id: 's1', isoDateTime: '2026-05-20T10:00:00+05:30', durationMins: 30, type: 'intro' },
  { id: 's2', isoDateTime: '2026-05-20T14:00:00+05:30', durationMins: 30, type: 'review' },
  { id: 's3', isoDateTime: '2026-05-21T11:00:00+05:30', durationMins: 45, type: 'review' },
  { id: 's4', isoDateTime: '2026-05-23T15:00:00+05:30', durationMins: 30, type: 'planning' },
  { id: 's5', isoDateTime: '2026-05-26T10:00:00+05:30', durationMins: 45, type: 'planning' },
  { id: 's6', isoDateTime: '2026-05-27T14:00:00+05:30', durationMins: 30, type: 'review' },
];

export const SANJAY_INSIGHTS: AdvisoryInsight[] = [
  {
    id: 'ins-1',
    title: 'Step up your SIP this year',
    body: 'With your income growing, a 10% annual SIP step-up compounds into ₹15L extra in 15 years. The best time to start was yesterday.',
    date: '2026-05-10',
  },
  {
    id: 'ins-2',
    title: 'Clear credit card dues first',
    body: 'At 36% p.a., your outstanding dues cost you more in interest than most equity funds return. Paying it off beats any SIP return in the short term.',
    date: '2026-05-05',
  },
  {
    id: 'ins-3',
    title: 'Consider a partial home loan prepayment',
    body: "Prepaying ₹1L saves ₹3.2L in interest over your loan's tenure. Let's run the exact numbers on our next call.",
    date: '2026-04-28',
  },
];
