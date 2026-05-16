import { Pressable, View } from 'react-native';
import { router } from 'expo-router';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { TopAppBar } from '@/components/layout/TopAppBar';
import { Text } from '@/components/ui/Text';
import { Card } from '@/components/ui/Card';
import { Chip, type ChipTone } from '@/components/ui/Chip';
import { Icon, type IconName } from '@/components/ui/Icon';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useGoals } from '@/state/GoalsContext';
import type { Goal, GoalCategory, GoalStatus } from '@/types/goals';
import { inrCompact } from '@/utils/format';

const CATEGORY_ICON: Record<GoalCategory, IconName> = {
  retirement: 'sail-boat',
  education: 'school',
  home: 'home-city',
  travel: 'airplane',
};

const STATUS_LABEL: Record<GoalStatus, string> = {
  'on-track': 'On Track',
  lagging: 'Needs Attention',
  ahead: 'Ahead of Plan',
};

const STATUS_TONE: Record<GoalStatus, ChipTone> = {
  'on-track': 'success',
  lagging: 'warning',
  ahead: 'info',
};

const STATUS_BAR_TONE: Record<GoalStatus, 'secondary' | 'tertiary' | 'primary'> = {
  'on-track': 'secondary',
  lagging: 'tertiary',
  ahead: 'primary',
};

function GoalListCard({ goal }: { goal: Goal }) {
  const progress = goal.targetAmount > 0 ? goal.currentAmount / goal.targetAmount : 0;
  return (
    <Pressable
      onPress={() => router.push(`/goals/${goal.id}`)}
      style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
      accessibilityRole="button"
      accessibilityLabel={`Open ${goal.name} details`}
    >
      <Card>
        <View className="flex-row items-center gap-stack-md mb-stack-md">
          <View className="w-11 h-11 rounded-xl bg-surface-container-high items-center justify-center">
            <Icon name={CATEGORY_ICON[goal.category]} size={22} color="#bec6e0" />
          </View>
          <View className="flex-1">
            <Text variant="body-md" color="text-on-surface" className="font-manrope-semibold">
              {goal.name}
            </Text>
            <Text variant="label-caps" color="text-on-surface-variant">
              Target {goal.targetYear} · {goal.horizonYears} yrs left
            </Text>
          </View>
          <Text variant="body-md" color="text-on-surface" className="font-manrope-semibold">
            {inrCompact(goal.targetAmount)}
          </Text>
        </View>

        <View className="mb-2">
          <View className="flex-row items-baseline justify-between mb-1">
            <Text variant="label-caps" color="text-on-surface-variant">
              {inrCompact(goal.currentAmount)} of {inrCompact(goal.targetAmount)}
            </Text>
            <Text variant="label-caps" color="text-on-surface">
              {Math.round(progress * 100)}%
            </Text>
          </View>
          <ProgressBar
            value={progress * 100}
            max={100}
            tone={STATUS_BAR_TONE[goal.status]}
            height="md"
          />
        </View>

        <View className="flex-row items-center justify-between mt-stack-sm">
          <Chip label={STATUS_LABEL[goal.status]} tone={STATUS_TONE[goal.status]} />
          <Text variant="label-caps" color="text-on-surface-variant">
            SIP {inrCompact(goal.monthlySipActual)} / {inrCompact(goal.monthlySipNeeded)} mo
          </Text>
        </View>
      </Card>
    </Pressable>
  );
}

export default function GoalsListScreen() {
  const { goals } = useGoals();
  const totalTarget = goals.reduce((s, g) => s + g.targetAmount, 0);
  const totalCurrent = goals.reduce((s, g) => s + g.currentAmount, 0);
  const overallProgress = totalTarget > 0 ? totalCurrent / totalTarget : 0;
  const lagging = goals.filter((g) => g.status === 'lagging').length;

  return (
    <View className="flex-1 bg-background">
      <TopAppBar title="Goal Pilot" onBackPress={() => router.back()} rightIcon={null} />
      <ScreenContainer scroll edges={[]} contentClassName="gap-stack-md pb-stack-lg">
        <View>
          <Text variant="headline-lg" color="text-on-surface">
            Your flight path
          </Text>
          <Text variant="body-md" color="text-on-surface-variant" className="mt-2">
            Every goal has its own glide-slope. Sanjay tracks the runway against your actual savings rate.
          </Text>
        </View>

        <Card variant="high">
          <Text variant="label-caps" color="text-on-surface-variant">
            Combined target
          </Text>
          <Text variant="headline-lg" color="text-on-surface" className="mt-1">
            {inrCompact(totalTarget)}
          </Text>
          <View className="mt-stack-sm">
            <View className="flex-row items-baseline justify-between mb-1">
              <Text variant="label-caps" color="text-on-surface-variant">
                {inrCompact(totalCurrent)} accumulated
              </Text>
              <Text variant="label-caps" color="text-on-surface">
                {Math.round(overallProgress * 100)}%
              </Text>
            </View>
            <ProgressBar value={overallProgress * 100} max={100} tone="secondary" height="md" />
          </View>
          {lagging > 0 ? (
            <Text variant="body-md" color="text-on-surface-variant" className="mt-stack-md">
              {`${lagging} ${lagging === 1 ? 'goal needs' : 'goals need'} attention to stay on plan. Tap into each to see what to change.`}
            </Text>
          ) : (
            <Text variant="body-md" color="text-on-surface-variant" className="mt-stack-md">
              Every goal is currently tracking against plan. Hold steady.
            </Text>
          )}
        </Card>

        <View className="flex-row items-end justify-between mt-stack-sm">
          <Text variant="headline-md" color="text-on-surface">
            Flight goals
          </Text>
          <View className="flex-row items-center gap-stack-sm">
            <Text variant="label-caps" color="text-on-surface-variant">
              {goals.length} active
            </Text>
            <Pressable
              onPress={() => router.push('/goals/new')}
              className="flex-row items-center gap-1 py-1 px-2 rounded-lg bg-secondary-container/20 border border-secondary/30"
              accessibilityRole="button"
              accessibilityLabel="Add new goal"
            >
              <Icon name="add" size={14} color="#99d4ae" />
              <Text variant="label-caps" color="text-secondary">
                New goal
              </Text>
            </Pressable>
          </View>
        </View>

        {goals.map((g) => (
          <GoalListCard key={g.id} goal={g} />
        ))}
      </ScreenContainer>
    </View>
  );
}
