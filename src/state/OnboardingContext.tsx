import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react';
import { readJSON, remove, writeJSON } from './persist';
import { DEMO_MODE, DEMO_PROFILE } from '@/data/demoProfile';
import type {
  DocumentsSection,
  FamilySection,
  FinancialSection,
  OnboardingProfile,
  OnboardingStep,
  PersonalSection,
} from '@/types/onboarding';

const STORAGE_KEY = 'profits-first:onboarding';

const VALID_STEPS: OnboardingStep[] = ['personal', 'family', 'financial', 'documents', 'done'];

const INITIAL: OnboardingProfile = DEMO_PROFILE;

function normalize(profile: OnboardingProfile | null): OnboardingProfile {
  if (!profile) return INITIAL;
  const step = VALID_STEPS.includes(profile.step) ? profile.step : 'personal';
  return {
    step,
    personal: profile.personal ?? INITIAL.personal,
    family: profile.family ?? INITIAL.family,
    financial: profile.financial ?? INITIAL.financial,
    documents: profile.documents ?? INITIAL.documents,
  };
}

type State = {
  hydrated: boolean;
  profile: OnboardingProfile;
};

type Action =
  | { type: 'HYDRATE'; profile: OnboardingProfile }
  | { type: 'SET_PERSONAL'; data: PersonalSection }
  | { type: 'SET_FAMILY'; data: FamilySection }
  | { type: 'SET_FINANCIAL'; data: FinancialSection }
  | { type: 'SET_DOCUMENTS'; data: DocumentsSection }
  | { type: 'SET_STEP'; step: OnboardingStep }
  | { type: 'RESET' };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'HYDRATE':
      return { hydrated: true, profile: action.profile };
    case 'SET_PERSONAL':
      return { ...state, profile: { ...state.profile, personal: action.data } };
    case 'SET_FAMILY':
      return { ...state, profile: { ...state.profile, family: action.data } };
    case 'SET_FINANCIAL':
      return { ...state, profile: { ...state.profile, financial: action.data } };
    case 'SET_DOCUMENTS':
      return { ...state, profile: { ...state.profile, documents: action.data } };
    case 'SET_STEP':
      return { ...state, profile: { ...state.profile, step: action.step } };
    case 'RESET':
      return { hydrated: true, profile: INITIAL };
  }
}

const initialState: State = DEMO_MODE
  ? { hydrated: true, profile: INITIAL }
  : { hydrated: false, profile: INITIAL };

type OnboardingContextValue = State & {
  setPersonal: (data: PersonalSection) => void;
  setFamily: (data: FamilySection) => void;
  setFinancial: (data: FinancialSection) => void;
  setDocuments: (data: DocumentsSection) => void;
  setStep: (step: OnboardingStep) => void;
  reset: () => Promise<void>;
};

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (DEMO_MODE) return;
    (async () => {
      const stored = await readJSON<OnboardingProfile>(STORAGE_KEY);
      dispatch({ type: 'HYDRATE', profile: normalize(stored) });
    })();
  }, []);

  useEffect(() => {
    if (DEMO_MODE) return;
    if (!state.hydrated) return;
    writeJSON(STORAGE_KEY, state.profile).catch(() => {});
  }, [state.profile, state.hydrated]);

  const setPersonal = useCallback(
    (data: PersonalSection) => dispatch({ type: 'SET_PERSONAL', data }),
    [],
  );
  const setFamily = useCallback(
    (data: FamilySection) => dispatch({ type: 'SET_FAMILY', data }),
    [],
  );
  const setFinancial = useCallback(
    (data: FinancialSection) => dispatch({ type: 'SET_FINANCIAL', data }),
    [],
  );
  const setDocuments = useCallback(
    (data: DocumentsSection) => dispatch({ type: 'SET_DOCUMENTS', data }),
    [],
  );
  const setStep = useCallback((step: OnboardingStep) => dispatch({ type: 'SET_STEP', step }), []);
  const reset = useCallback(async () => {
    if (!DEMO_MODE) await remove(STORAGE_KEY);
    dispatch({ type: 'RESET' });
  }, []);

  const value = useMemo<OnboardingContextValue>(
    () => ({
      ...state,
      setPersonal,
      setFamily,
      setFinancial,
      setDocuments,
      setStep,
      reset,
    }),
    [state, setPersonal, setFamily, setFinancial, setDocuments, setStep, reset],
  );

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
}

export function useOnboarding(): OnboardingContextValue {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error('useOnboarding must be used inside <OnboardingProvider>');
  return ctx;
}
