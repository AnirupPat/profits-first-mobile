import { Redirect } from 'expo-router';
import { View } from 'react-native';
import { Text } from '@/components/ui/Text';
import { PFLogo } from '@/components/brand/PFLogo';
import { useStartRoute } from '@/hooks/useStartRoute';

export default function Splash() {
  const route = useStartRoute();

  if (route.kind === 'loading') {
    return (
      <View className="flex-1 items-center justify-center bg-background gap-stack-md">
        <PFLogo size={88} />
        <Text variant="headline-lg" color="text-primary">
          Profits First
        </Text>
        <Text variant="label-caps" color="text-on-surface-variant">
          Loading…
        </Text>
      </View>
    );
  }

  return <Redirect href={route.href} />;
}
