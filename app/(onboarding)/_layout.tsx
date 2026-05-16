import { Redirect, Stack } from 'expo-router';
import { useAuth } from '@/state/AuthContext';
import { useOnboarding } from '@/state/OnboardingContext';

export default function OnboardingLayout() {
  const { status } = useAuth();
  const { hydrated } = useOnboarding();
  if (status === 'loading' || !hydrated) return null;
  if (status === 'unauthed') return <Redirect href="/(auth)/access-key" />;
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#131315' },
        animation: 'slide_from_right',
        gestureEnabled: false,
      }}
    />
  );
}
