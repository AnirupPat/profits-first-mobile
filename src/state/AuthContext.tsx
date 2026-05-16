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
import { DEMO_MODE } from '@/data/demoProfile';
import type { AuthSession, AuthStatus, User } from '@/types/user';

const STORAGE_KEY = 'profits-first:auth';

type State = {
  status: AuthStatus;
  session: AuthSession | null;
};

type Action =
  | { type: 'HYDRATE'; session: AuthSession | null }
  | { type: 'SIGN_IN'; session: AuthSession }
  | { type: 'SIGN_OUT' };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'HYDRATE':
      return { status: action.session ? 'authed' : 'unauthed', session: action.session };
    case 'SIGN_IN':
      return { status: 'authed', session: action.session };
    case 'SIGN_OUT':
      return { status: 'unauthed', session: null };
  }
}

const initialState: State = DEMO_MODE
  ? { status: 'unauthed', session: null }
  : { status: 'loading', session: null };

type AuthContextValue = State & {
  signIn: (input: { phone: string; inviteCode: string }) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (DEMO_MODE) return;
    (async () => {
      const stored = await readJSON<AuthSession>(STORAGE_KEY);
      dispatch({ type: 'HYDRATE', session: stored });
    })();
  }, []);

  const signIn = useCallback(async (input: { phone: string; inviteCode: string }) => {
    const user: User = {
      id: `usr_${Date.now()}`,
      phone: input.phone,
    };
    const session: AuthSession = {
      token: `mock_${Math.random().toString(36).slice(2, 12)}`,
      user,
      inviteCode: input.inviteCode,
      signedInAt: new Date().toISOString(),
    };
    if (!DEMO_MODE) await writeJSON(STORAGE_KEY, session);
    dispatch({ type: 'SIGN_IN', session });
  }, []);

  const signOut = useCallback(async () => {
    if (!DEMO_MODE) await remove(STORAGE_KEY);
    dispatch({ type: 'SIGN_OUT' });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ ...state, signIn, signOut }),
    [state, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
