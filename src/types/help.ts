export type TicketKind = 'advisor' | 'service';

export type TicketStatus =
  | 'open'
  | 'in-review'
  | 'callback-scheduled'
  | 'resolved'
  | 'closed';

export type ServiceCategory =
  | 'app-issue'
  | 'scheduling'
  | 'payments'
  | 'account'
  | 'other';

export type CallbackPreference = 'morning' | 'afternoon' | 'evening' | 'any';

export type Urgency = 'normal' | 'urgent';

export type TicketReply = {
  author: string;
  body: string;
  date: string;
};

export type Ticket = {
  id: string;
  kind: TicketKind;
  status: TicketStatus;
  subject: string;
  body: string;
  createdAt: string;
  updatedAt: string;
  category?: ServiceCategory;
  urgency?: Urgency;
  callbackPreference?: CallbackPreference;
  reply?: TicketReply;
};
