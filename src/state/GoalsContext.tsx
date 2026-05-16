import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react';
import { MOCK_GOALS } from '@/data/mockGoals';
import type { Goal } from '@/types/goals';

type State = { goals: Goal[] };
type Action = { type: 'ADD_GOAL'; goal: Goal };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD_GOAL':
      return { goals: [...state.goals, action.goal] };
  }
}

type GoalsContextValue = State & {
  addGoal: (goal: Goal) => void;
  findGoal: (id: string) => Goal | undefined;
  /** fundId → name of the goal that has already claimed that fund */
  fundsInUse: Record<string, string>;
};

const GoalsContext = createContext<GoalsContextValue | null>(null);

export function GoalsProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { goals: MOCK_GOALS });

  const addGoal = useCallback((goal: Goal) => dispatch({ type: 'ADD_GOAL', goal }), []);
  const findGoal = useCallback(
    (id: string) => state.goals.find((g) => g.id === id),
    [state.goals],
  );
  const fundsInUse = useMemo<Record<string, string>>(() => {
    const map: Record<string, string> = {};
    for (const goal of state.goals) {
      for (const link of goal.linkedFunds) {
        map[link.fundId] = goal.name;
      }
    }
    return map;
  }, [state.goals]);

  const value = useMemo<GoalsContextValue>(
    () => ({ ...state, addGoal, findGoal, fundsInUse }),
    [state, addGoal, findGoal, fundsInUse],
  );

  return <GoalsContext.Provider value={value}>{children}</GoalsContext.Provider>;
}

export function useGoals(): GoalsContextValue {
  const ctx = useContext(GoalsContext);
  if (!ctx) throw new Error('useGoals must be used inside <GoalsProvider>');
  return ctx;
}
