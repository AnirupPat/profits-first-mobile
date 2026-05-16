import { Redirect, Stack } from 'expo-router';
import { useStartRoute } from '@/hooks/useStartRoute';

export default function AuthLayout() {
  const route = useStartRoute();
  if (route.kind === 'loading') return null;
  if (route.href !== '/(auth)/access-key') {
    return <Redirect href={route.href} />;
  }
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#131315' },
        animation: 'slide_from_right',
      }}
    />
  );
}
