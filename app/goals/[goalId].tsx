import { Pressable, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { TopAppBar } from '@/components/layout/TopAppBar';
import { Text } from '@/components/ui/Text';
import { Card } from '@/components/ui/Card';
import { Chip, type ChipTone } from '@/components/ui/Chip';
import { Icon, type IconName } from '@/components/ui/Icon';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { DonutChart } from '@/components/charts/DonutChart';
import { useGoals } from '@/state/GoalsContext';
import { MOCK_HOLDINGS } from '@/data/mockHoldings';
import { FUND_DETAILS } from '@/data/mockFunds';
import type { GoalCategory, GoalStatus } from '@/types/goals';
import { inr, inrCompact } from '@/utils/format';

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

function AllocationRow({
  label,
  pct,
  color,
}: {
  label: string;
  pct: number;
  color: string;
}) {
  return (
    <View>
      <View className="flex-row items-center justify-between mb-1">
        <View className="flex-row items-center gap-1.5">
          <View className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
          <Text variant="label-caps" color="text-on-surface-variant">
            {label}
          </Text>
        </View>
        <Text variant="label-caps" color="text-on-surface">
          {pct}%
        </Text>
      </View>
      <View className="w-full bg-surface-variant rounded-full h-1.5 overflow-hidden">
        <View
          className="h-full rounded-full"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </View>
    </View>
  );
}

function FundRow({ fundId }: { fundId: string }) {
  const holding = MOCK_HOLDINGS.find((h) => h.id === fundId);
  const detail = FUND_DETAILS[fundId];
  if (!holding) return null;
  return (
    <Pressable
      onPress={() => router.push(`/mf/${fundId}`)}
      style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
      accessibilityRole="button"
    >
      <View className="flex-row items-center justify-between py-3 border-b border-outline-variant/20">
        <View className="flex-1 mr-3">
          <Text variant="body-md" color="text-on-surface" numberOfLines={1}>
            {holding.name}
          </Text>
          <Text variant="label-caps" color="text-on-surface-variant">
            {holding.subCategory} · {holding.plan}
          </Text>
        </View>
        <View className="items-end">
          <Text variant="body-md" color="text-on-surface" className="font-manrope-semibold">
            {detail ? `${detail.returns3Y.toFixed(1)}%` : '—'}
          </Text>
          <Text variant="label-caps" color="text-on-surface-variant">
            3Y CAGR
          </Text>
        </View>
        <View className="ml-3">
          <Icon name="chevron_right" size={16} color="#909097" />
        </View>
      </View>
    </Pressable>
  );
}

export default function GoalDetailScreen() {
  const { goalId } = useLocalSearchParams<{ goalId: string }>();
  const { findGoal } = useGoals();
  const goal = findGoal(goalId ?? '');

  if (!goal) {
    return (
      <View className="flex-1 bg-background">
        <TopAppBar title="Goal" onBackPress={() => router.back()} rightIcon={null} />
        <ScreenContainer edges={[]} contentClassName="items-center justify-center">
          <Text variant="body-md" color="text-on-surface-variant">
            Goal not found.
          </Text>
        </ScreenContainer>
      </View>
    );
  }

  const progress = goal.targetAmount > 0 ? goal.currentAmount / goal.targetAmount : 0;
  const sipGap = goal.monthlySipNeeded - goal.monthlySipActual;
  const sipShort = sipGap > 0;

  return (
    <View className="flex-1 bg-background">
      <TopAppBar title={goal.name} onBackPress={() => router.back()} rightIcon={null} />
      <ScreenContainer scroll edges={[]} contentClassName="gap-stack-md pb-stack-lg">

        {/* Hero card */}
        <Card variant="high">
          <View className="flex-row items-center gap-stack-md mb-stack-md">
            <View className="w-12 h-12 rounded-2xl bg-secondary-container/30 items-center justify-center">
              <Icon name={CATEGORY_ICON[goal.category]} size={26} color="#99d4ae" />
            </View>
            <View className="flex-1">
              <Text variant="label-caps" color="text-on-surface-variant">
                Target {goal.targetYear} · {goal.horizonYears} yrs left
              </Text>
              <Text variant="headline-md" color="text-on-surface" className="mt-1">
                {inr(goal.targetAmount)}
              </Text>
            </View>
            <Chip label={STATUS_LABEL[goal.status]} tone={STATUS_TONE[goal.status]} />
          </View>

          <View>
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
        </Card>

        {/* SIP gap card */}
        <Card>
          <Text variant="label-caps" color="text-on-surface-variant" className="mb-stack-sm">
            Monthly contribution
          </Text>
          <View className="flex-row gap-2">
            <View className="flex-1 bg-surface-container-low rounded-lg p-3">
              <Text variant="label-caps" color="text-on-surface-variant" className="mb-1">
                You're saving
              </Text>
              <Text variant="body-md" color="text-on-surface" className="font-manrope-semibold">
                {inr(goal.monthlySipActual)}
              </Text>
            </View>
            <View className="flex-1 bg-surface-container-low rounded-lg p-3">
              <Text variant="label-caps" color="text-on-surface-variant" className="mb-1">
                Plan needs
              </Text>
              <Text variant="body-md" color="text-on-surface" className="font-manrope-semibold">
                {inr(goal.monthlySipNeeded)}
              </Text>
            </View>
          </View>
          <Text
            variant="body-md"
            color={sipShort ? 'text-tertiary' : 'text-secondary'}
            className="mt-stack-md"
          >
            {sipShort
              ? `Increase SIP by ${inr(sipGap)} a month to close the gap, or accept a smaller corpus at maturity.`
              : `You're contributing ${inr(Math.abs(sipGap))} more than the plan needs. The buffer compounds into a bigger corpus.`}
          </Text>
        </Card>

        {/* Strategy card */}
        <Card>
          <Text variant="label-caps" color="text-on-surface-variant" className="mb-stack-md">
            Recommended strategy · {goal.riskProfile}
          </Text>
          <View className="flex-row items-center gap-stack-md">
            <DonutChart
              value={goal.equityPct / 100}
              size={96}
              strokeWidth={10}
              fillColor="#99d4ae"
            >
              <View className="items-center">
                <Text variant="headline-md" color="text-on-surface">
                  {goal.equityPct}%
                </Text>
                <Text variant="label-caps" color="text-on-surface-variant">
                  Equity
                </Text>
              </View>
            </DonutChart>

            <View className="flex-1 gap-3">
              <AllocationRow label="Equity" pct={goal.equityPct} color="#99d4ae" />
              <AllocationRow label="Debt" pct={goal.debtPct} color="#bec6e0" />
              <AllocationRow label="Alternatives" pct={goal.alternativesPct} color="#edbaba" />
            </View>
          </View>
        </Card>

        {/* Recommended funds */}
        <Card>
          <View className="flex-row items-center justify-between mb-stack-sm">
            <Text variant="label-caps" color="text-on-surface-variant">
              Suggested funds for this goal
            </Text>
            <Text variant="label-caps" color="text-on-surface-variant">
              {goal.recommendedFundIds.length} picks
            </Text>
          </View>
          {goal.recommendedFundIds.map((id) => (
            <FundRow key={id} fundId={id} />
          ))}
          <Text variant="label-caps" color="text-on-surface-variant" className="mt-stack-sm">
            Tap any fund to see its full breakdown.
          </Text>
        </Card>

      </ScreenContainer>
    </View>
  );
}
