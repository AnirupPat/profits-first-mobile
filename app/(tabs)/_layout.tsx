import { Redirect, Tabs } from 'expo-router';
import { BottomNavBar } from '@/components/layout/BottomNavBar';
import { useAuth } from '@/state/AuthContext';
import { useOnboarding } from '@/state/OnboardingContext';
import { STEP_TO_ROUTE } from '@/hooks/useStartRoute';

export default function TabsLayout() {
  const { status } = useAuth();
  const { hydrated, profile } = useOnboarding();
  if (status === 'loading' || !hydrated) return null;
  if (status === 'unauthed') return <Redirect href="/(auth)/access-key" />;
  if (profile.step !== 'done') {
    return <Redirect href={STEP_TO_ROUTE[profile.step]} />;
  }

  return (
    <Tabs
      initialRouteName="home"
      tabBar={(props) => <BottomNavBar {...props} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: '#131315' },
      }}
    >
      <Tabs.Screen name="home" />
      <Tabs.Screen name="portfolio" />
      <Tabs.Screen name="community" />
      <Tabs.Screen name="advisory" />
    </Tabs>
  );
}
