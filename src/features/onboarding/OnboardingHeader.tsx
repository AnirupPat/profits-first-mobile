import { Pressable, View } from 'react-native';
import { router } from 'expo-router';
import { Text } from '@/components/ui/Text';
import { Icon } from '@/components/ui/Icon';

export type OnboardingHeaderProps = {
  stepIndex: number;
  totalSteps?: number;
  title: string;
  subtitle?: string;
  canGoBack?: boolean;
};

export function OnboardingHeader({
  stepIndex,
  totalSteps = 4,
  title,
  subtitle,
  canGoBack = true,
}: OnboardingHeaderProps) {
  const backAvailable = canGoBack && stepIndex > 1 && router.canGoBack();

  return (
    <View className="gap-stack-md">
      <View className="flex-row items-center justify-between">
        <Pressable
          onPress={() => router.back()}
          disabled={!backAvailable}
          className="w-10 h-10 rounded-full bg-surface-container items-center justify-center border border-outline-variant/20"
          style={{ opacity: backAvailable ? 1 : 0 }}
          hitSlop={8}
        >
          <Icon name="arrow_back" size={20} color="#e4e2e4" />
        </Pressable>
        <View className="bg-secondary-container/30 px-3 py-1 rounded-full border border-secondary/20">
          <Text variant="label-caps" color="text-secondary">
            Step {stepIndex} of {totalSteps}
          </Text>
        </View>
        <View className="w-10" />
      </View>

      <View className="flex-row gap-2">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <View
            key={i}
            className={`h-2 flex-1 rounded-full ${
              i < stepIndex ? 'bg-secondary' : 'bg-surface-container-highest'
            }`}
          />
        ))}
      </View>

      <View className="gap-stack-sm mt-stack-sm">
        <Text variant="headline-lg" color="text-on-surface">
          {title}
        </Text>
        {subtitle ? (
          <Text variant="body-md" color="text-on-surface-variant">
            {subtitle}
          </Text>
        ) : null}
      </View>
    </View>
  );
}
