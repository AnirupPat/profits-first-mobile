import type { Ticket } from '@/types/help';

export const MOCK_TICKETS: Ticket[] = [
  {
    id: 'tkt-001',
    kind: 'advisor',
    status: 'callback-scheduled',
    subject: 'Should I reduce equity allocation before retirement?',
    body: 'My retirement goal is 8 years away. With markets at all-time highs, I am wondering if I should de-risk gradually. Also, my Parag Parikh Flexi Cap is now 40% of equity — feels concentrated.',
    urgency: 'normal',
    callbackPreference: 'evening',
    createdAt: '2026-05-15T10:30:00+05:30',
    updatedAt: '2026-05-16T09:15:00+05:30',
    reply: {
      author: 'Priya (Sanjay’s team)',
      body: 'Sanjay will call you on Tue 19 May between 6–7 PM to walk through a de-risking glide path. We have pulled your goal sheet — please keep ~10 mins free.',
      date: '2026-05-16T09:15:00+05:30',
    },
  },
  {
    id: 'tkt-002',
    kind: 'service',
    status: 'resolved',
    category: 'app-issue',
    subject: 'NAV not refreshing on portfolio screen',
    body: 'Pull-to-refresh on the My Wealth screen does not update NAV for HDFC Top 100. Other funds refresh fine.',
    createdAt: '2026-05-10T18:20:00+05:30',
    updatedAt: '2026-05-12T11:00:00+05:30',
    reply: {
      author: 'Support',
      body: 'Fixed in build 1.4.2 — NAV feed cache was sticky on a stale provider response. Please pull-to-refresh and reopen the fund. Reach out again if it recurs.',
      date: '2026-05-12T11:00:00+05:30',
    },
  },
];
