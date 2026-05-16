import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react';
import type { BookingStatus } from '@/types/advisor';

type State = {
  bookedSlotId: string | null;
  prepNotes: string;
  status: BookingStatus;
};

type Action =
  | { type: 'BOOK_SLOT'; slotId: string }
  | { type: 'CANCEL_BOOKING' }
  | { type: 'SET_PREP_NOTES'; notes: string };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'BOOK_SLOT':
      return { ...state, bookedSlotId: action.slotId, status: 'confirmed' };
    case 'CANCEL_BOOKING':
      return { ...state, bookedSlotId: null, status: 'none' };
    case 'SET_PREP_NOTES':
      return { ...state, prepNotes: action.notes };
  }
}

const INITIAL: State = { bookedSlotId: null, prepNotes: '', status: 'none' };

type AdvisoryContextValue = State & {
  bookSlot: (slotId: string) => void;
  cancelBooking: () => void;
  setPrepNotes: (notes: string) => void;
};

const AdvisoryContext = createContext<AdvisoryContextValue | null>(null);

export function AdvisoryProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INITIAL);

  const bookSlot = useCallback((slotId: string) => dispatch({ type: 'BOOK_SLOT', slotId }), []);
  const cancelBooking = useCallback(() => dispatch({ type: 'CANCEL_BOOKING' }), []);
  const setPrepNotes = useCallback(
    (notes: string) => dispatch({ type: 'SET_PREP_NOTES', notes }),
    [],
  );

  const value = useMemo<AdvisoryContextValue>(
    () => ({ ...state, bookSlot, cancelBooking, setPrepNotes }),
    [state, bookSlot, cancelBooking, setPrepNotes],
  );

  return <AdvisoryContext.Provider value={value}>{children}</AdvisoryContext.Provider>;
}

export function useAdvisory(): AdvisoryContextValue {
  const ctx = useContext(AdvisoryContext);
  if (!ctx) throw new Error('useAdvisory must be used inside <AdvisoryProvider>');
  return ctx;
}
