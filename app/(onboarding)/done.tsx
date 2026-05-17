import { View } from 'react-native';
import { router } from 'expo-router';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Card } from '@/components/ui/Card';
import { SanjayAvatar } from '@/components/brand/SanjayAvatar';
import { OnboardingHeader } from '@/features/onboarding/OnboardingHeader';
import { useOnboarding } from '@/state/OnboardingContext';

export default function DoneScreen() {
  const { profile } = useOnboarding();
  const firstName = profile.personal?.fullName.split(' ')[0] ?? 'there';

  return (
    <ScreenContainer scroll edges={['top', 'bottom']} contentClassName="gap-stack-lg pb-stack-lg">
      <OnboardingHeader
        stepIndex={4}
        title={`You're all set, ${firstName}`}
        subtitle="Your profile is ready. Sanjay has been notified and will reach out within a working day."
        canGoBack={false}
      />

      <View className="items-center my-stack-md">
        <View className="w-24 h-24 rounded-full bg-secondary-container/40 items-center justify-center mb-stack-md">
          <Icon name="check_circle" size={56} color="#99d4ae" />
        </View>
        <Text variant="label-caps" color="text-secondary">
          Investor profile activated
        </Text>
      </View>

      <Card variant="low">
        <View className="flex-row items-center gap-stack-md">
          <SanjayAvatar size={56} />
          <View className="flex-1">
            <Text variant="label-caps" color="text-on-surface-variant">
              Your advisor
            </Text>
            <Text variant="headline-md" color="text-on-surface">
              Sanjay Kathuria
            </Text>
            <Text variant="body-md" color="text-on-surface-variant">
              18 yrs · MBA in Finance, CFA
            </Text>
          </View>
        </View>
      </Card>

      <Card>
        <Text variant="headline-md" color="text-on-surface" className="mb-stack-sm">
          What's next
        </Text>
        <View className="gap-stack-sm">
          <View className="flex-row items-start gap-stack-sm">
            <Icon name="trending_up" size={18} color="#bec6e0" />
            <Text variant="body-md" color="text-on-surface-variant" className="flex-1">
              We'll sync your CAS so your existing holdings appear in Portfolio.
            </Text>
          </View>
          <View className="flex-row items-start gap-stack-sm">
            <Icon name="flag" size={18} color="#bec6e0" />
            <Text variant="body-md" color="text-on-surface-variant" className="flex-1">
              Add your first goal in Goal Pilot to get a recommended SIP.
            </Text>
          </View>
          <View className="flex-row items-start gap-stack-sm">
            <Icon name="schedule" size={18} color="#bec6e0" />
            <Text variant="body-md" color="text-on-surface-variant" className="flex-1">
              Schedule a call with Sanjay when you're ready.
            </Text>
          </View>
        </View>
      </Card>

      <View className="mt-stack-md">
        <Button
          label="Open my dashboard"
          onPress={() => router.replace('/(tabs)/home')}
          fullWidth
          trailingIcon="arrow_forward"
        />
      </View>
    </ScreenContainer>
  );
}
