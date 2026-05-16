import { Pressable, View } from 'react-native';
import { router } from 'expo-router';
import { Card } from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';
import { Chip } from '@/components/ui/Chip';
import { Icon } from '@/components/ui/Icon';
import { MOCK_GOALS } from '@/data/mockGoals';

export type GoalPilotEntryCardProps = {
  variant?: 'home' | 'advisory';
};

export function GoalPilotEntryCard({ variant = 'home' }: GoalPilotEntryCardProps) {
  const counts = {
    onTrack: MOCK_GOALS.filter((g) => g.status === 'on-track').length,
    lagging: MOCK_GOALS.filter((g) => g.status === 'lagging').length,
    ahead: MOCK_GOALS.filter((g) => g.status === 'ahead').length,
  };
  const total = MOCK_GOALS.length;

  const headline = variant === 'advisory' ? 'Prep your goals for Sanjay' : 'Goal Pilot';
  const sub =
    variant === 'advisory'
      ? 'Review and prioritise your goals before the next advisory call.'
      : counts.lagging > 0
        ? `${counts.lagging} of your ${total} goals need attention this quarter.`
        : `All ${total} goals tracking against plan.`;

  return (
    <Pressable
      onPress={() => router.push('/goals')}
      style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
      accessibilityRole="button"
      accessibilityLabel="Open Goal Pilot"
    >
      <Card variant="high">
        <View className="flex-row items-start gap-stack-md">
          <View className="w-12 h-12 rounded-2xl bg-secondary-container/30 items-center justify-center">
            <Icon name="target" size={24} color="#99d4ae" />
          </View>
          <View className="flex-1">
            <Text variant="label-caps" color="text-secondary">
              {variant === 'advisory' ? 'Advisory prep' : 'Plan your future'}
            </Text>
            <Text variant="headline-md" color="text-on-surface" className="mt-1">
              {headline}
            </Text>
            <Text variant="body-md" color="text-on-surface-variant" className="mt-1">
              {sub}
            </Text>
          </View>
        </View>

        <View className="flex-row flex-wrap gap-2 mt-stack-md">
          {counts.onTrack > 0 ? (
            <Chip label={`${counts.onTrack} On Track`} tone="success" />
          ) : null}
          {counts.lagging > 0 ? (
            <Chip label={`${counts.lagging} Lagging`} tone="warning" />
          ) : null}
          {counts.ahead > 0 ? (
            <Chip label={`${counts.ahead} Ahead`} tone="info" />
          ) : null}
        </View>

        <View className="flex-row items-center mt-stack-md pt-stack-sm border-t border-outline-variant/20">
          <Text variant="label-caps" className="text-primary">
            {variant === 'advisory' ? 'Open Goal Pilot' : 'View all goals'}
          </Text>
          <View className="ml-auto">
            <Icon name="chevron_right" size={16} color="#bec6e0" />
          </View>
        </View>
      </Card>
    </Pressable>
  );
}
