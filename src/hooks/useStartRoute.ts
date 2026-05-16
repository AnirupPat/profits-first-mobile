import type { Href } from 'expo-router';
import { useAuth } from '@/state/AuthContext';
import { useOnboarding } from '@/state/OnboardingContext';
import type { OnboardingStep } from '@/types/onboarding';

const STEP_TO_ROUTE: Record<OnboardingStep, Href> = {
  personal: '/(onboarding)/personal-details',
  family: '/(onboarding)/family-details',
  financial: '/(onboarding)/financial-details',
  documents: '/(onboarding)/documents',
  done: '/(tabs)/home',
};

export type StartRoute = { kind: 'loading' } | { kind: 'redirect'; href: Href };

export function useStartRoute(): StartRoute {
  const { status } = useAuth();
  const { hydrated, profile } = useOnboarding();
  if (status === 'loading' || !hydrated) return { kind: 'loading' };
  if (status === 'unauthed') return { kind: 'redirect', href: '/(auth)/access-key' };
  return { kind: 'redirect', href: STEP_TO_ROUTE[profile.step] };
}

export { STEP_TO_ROUTE };
