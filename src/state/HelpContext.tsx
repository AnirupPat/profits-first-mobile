import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react';
import { MOCK_TICKETS } from '@/data/mockTickets';
import type {
  CallbackPreference,
  ServiceCategory,
  Ticket,
  Urgency,
} from '@/types/help';

type State = {
  tickets: Ticket[];
};

type AdvisorDraft = {
  subject: string;
  body: string;
  urgency: Urgency;
  callbackPreference: CallbackPreference;
};

type ServiceDraft = {
  subject: string;
  body: string;
  category: ServiceCategory;
};

type Action =
  | { type: 'ADD_TICKET'; ticket: Ticket }
  | { type: 'CLOSE_TICKET'; id: string };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD_TICKET':
      return { ...state, tickets: [action.ticket, ...state.tickets] };
    case 'CLOSE_TICKET':
      return {
        ...state,
        tickets: state.tickets.map((t) =>
          t.id === action.id
            ? { ...t, status: 'closed', updatedAt: new Date().toISOString() }
            : t,
        ),
      };
  }
}

const INITIAL: State = { tickets: MOCK_TICKETS };

type HelpContextValue = State & {
  createAdvisorTicket: (draft: AdvisorDraft) => Ticket;
  createServiceTicket: (draft: ServiceDraft) => Ticket;
  closeTicket: (id: string) => void;
  findTicket: (id: string) => Ticket | undefined;
};

const HelpContext = createContext<HelpContextValue | null>(null);

function newId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}`;
}

export function HelpProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INITIAL);

  const createAdvisorTicket = useCallback((draft: AdvisorDraft): Ticket => {
    const now = new Date().toISOString();
    const ticket: Ticket = {
      id: newId('tkt'),
      kind: 'advisor',
      status: 'in-review',
      subject: draft.subject.trim(),
      body: draft.body.trim(),
      urgency: draft.urgency,
      callbackPreference: draft.callbackPreference,
      createdAt: now,
      updatedAt: now,
    };
    dispatch({ type: 'ADD_TICKET', ticket });
    return ticket;
  }, []);

  const createServiceTicket = useCallback((draft: ServiceDraft): Ticket => {
    const now = new Date().toISOString();
    const ticket: Ticket = {
      id: newId('tkt'),
      kind: 'service',
      status: 'open',
      subject: draft.subject.trim(),
      body: draft.body.trim(),
      category: draft.category,
      createdAt: now,
      updatedAt: now,
    };
    dispatch({ type: 'ADD_TICKET', ticket });
    return ticket;
  }, []);

  const closeTicket = useCallback((id: string) => dispatch({ type: 'CLOSE_TICKET', id }), []);
  const findTicket = useCallback(
    (id: string) => state.tickets.find((t) => t.id === id),
    [state.tickets],
  );

  const value = useMemo<HelpContextValue>(
    () => ({
      ...state,
      createAdvisorTicket,
      createServiceTicket,
      closeTicket,
      findTicket,
    }),
    [state, createAdvisorTicket, createServiceTicket, closeTicket, findTicket],
  );

  return <HelpContext.Provider value={value}>{children}</HelpContext.Provider>;
}

export function useHelp(): HelpContextValue {
  const ctx = useContext(HelpContext);
  if (!ctx) throw new Error('useHelp must be used inside <HelpProvider>');
  return ctx;
}
