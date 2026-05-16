import { View, Pressable } from 'react-native';
import { router } from 'expo-router';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { TopAppBar } from '@/components/layout/TopAppBar';
import { Text } from '@/components/ui/Text';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Chip, type ChipTone } from '@/components/ui/Chip';
import { Icon } from '@/components/ui/Icon';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { DonutChart } from '@/components/charts/DonutChart';
import { GoalPilotEntryCard } from '@/components/goals/GoalPilotEntryCard';
import { useAuth } from '@/state/AuthContext';
import { useOnboarding } from '@/state/OnboardingContext';
import { computeHealth, type HealthBucket } from '@/utils/portfolioHealth';
import { inrCompact } from '@/utils/format';

const BUCKET_TO_CHIP: Record<HealthBucket, ChipTone> = {
  good: 'success',
  warn: 'warning',
  bad: 'danger',
};
const BUCKET_TO_HEX: Record<HealthBucket, string> = {
  good: '#99d4ae',
  warn: '#edbaba',
  bad: '#ffb4ab',
};
const BUCKET_TO_BAR_TONE: Record<HealthBucket, 'secondary' | 'tertiary' | 'error'> = {
  good: 'secondary',
  warn: 'tertiary',
  bad: 'error',
};
const BUCKET_TO_BG: Record<HealthBucket, string> = {
  good: 'bg-secondary',
  warn: 'bg-tertiary',
  bad: 'bg-error',
};

const DTI_LABEL: Record<HealthBucket, string> = {
  good: 'Comfortable',
  warn: 'Tight',
  bad: 'Heavy',
};
const HI_LABEL: Record<HealthBucket, string> = {
  good: 'Cleared',
  warn: 'Pay soon',
  bad: 'Reduce now',
};
const EF_LABEL: Record<HealthBucket, string> = {
  good: 'On track',
  warn: 'Almost',
  bad: 'Top up',
};

type MetricTileProps = {
  visual: React.ReactNode;
  title: string;
  chipLabel: string;
  chipTone: ChipTone;
  sub: string;
};

function MetricTile({ visual, title, chipLabel, chipTone, sub }: MetricTileProps) {
  return (
    <Card className="flex-1">
      <View className="items-center justify-center w-full" style={{ height: 96 }}>
        {visual}
      </View>
      <View className="mt-stack-md gap-2">
        <Text variant="label-caps" color="text-on-surface-variant" numberOfLines={1}>
          {title}
        </Text>
        <View className="flex-row">
          <Chip label={chipLabel} tone={chipTone} />
        </View>
        <Text variant="label-caps" color="text-on-surface-variant" numberOfLines={2}>
          {sub}
        </Text>
      </View>
    </Card>
  );
}

export default function HomeScreen() {
  const { signOut } = useAuth();
  const { profile, reset } = useOnboarding();
  const firstName = profile.personal?.fullName.split(' ')[0] ?? 'there';

  // Layout already gates on profile.step === 'done', which guarantees financial.
  // Defensive null-check keeps the type narrow without an assertion.
  if (!profile.financial) return null;
  const health = computeHealth(profile.financial);

  const onResetDemo = async () => {
    await reset();
    await signOut();
  };

  const openDetail = () => router.push('/portfolio-health');

  return (
    <View className="flex-1 bg-background">
      <TopAppBar title="Profits First" onRightPress={() => router.push('/help')} />
      <ScreenContainer scroll edges={[]} contentClassName="gap-stack-md">
        <View>
          <Text variant="headline-lg" color="text-on-surface">
            Hi, {firstName}
          </Text>
          <Text variant="body-md" color="text-on-surface-variant" className="mt-1">
            Here's where your money stands today.
          </Text>
        </View>

        <Card variant="high">
          <View className="flex-row items-start gap-stack-md">
            <View className="flex-1">
              <Text variant="label-caps" color="text-secondary">
                Your roadmap
              </Text>
              <Text variant="headline-lg" color="text-on-surface" className="mt-1">
                Navigate Your Future
              </Text>
              <Text variant="body-md" color="text-on-surface-variant" className="mt-2">
                Profits-First nudges put you in the driver's seat. Each tile below is a lever Sanjay can pull with you.
              </Text>
            </View>
            <View className="w-12 h-12 rounded-2xl bg-secondary-container/30 items-center justify-center">
              <Icon name="flight_takeoff" size={24} color="#99d4ae" />
            </View>
          </View>
        </Card>

        <View className="flex-row items-center justify-between mt-stack-sm">
          <Text variant="headline-md" color="text-on-surface">
            Portfolio Health
          </Text>
          <Pressable
            onPress={openDetail}
            className="flex-row items-center gap-1 py-1"
            style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
            accessibilityRole="button"
            accessibilityLabel="View portfolio health details"
          >
            <Text variant="label-caps" className="text-primary">
              View details
            </Text>
            <Icon name="chevron-right" size={14} color="#bec6e0" />
          </Pressable>
        </View>

        <View className="flex-row gap-stack-md">
          <MetricTile
            visual={
              <DonutChart
                value={health.dti}
                size={92}
                strokeWidth={9}
                fillColor={BUCKET_TO_HEX[health.dtiBucket]}
              >
                <Text variant="headline-md" color="text-on-surface">
                  {Math.round(health.dti * 100)}%
                </Text>
              </DonutChart>
            }
            title="Debt-to-income"
            chipLabel={DTI_LABEL[health.dtiBucket]}
            chipTone={BUCKET_TO_CHIP[health.dtiBucket]}
            sub={`≈ ${inrCompact(health.monthlyEmi)} / month`}
          />
          <MetricTile
            visual={
              <Text variant="headline-lg" color="text-on-surface" numberOfLines={1}>
                {inrCompact(health.hiDebt)}
              </Text>
            }
            title="Toxic debt"
            chipLabel={HI_LABEL[health.hiDebtBucket]}
            chipTone={BUCKET_TO_CHIP[health.hiDebtBucket]}
            sub="Credit card + personal loan"
          />
        </View>

        <View className="flex-row gap-stack-md">
          <MetricTile
            visual={
              <View className="items-center w-full px-2">
                <View className="flex-row items-baseline gap-1">
                  <Text variant="headline-md" color="text-on-surface" numberOfLines={1}>
                    {inrCompact(health.monthlySip)}
                  </Text>
                  <Text variant="label-caps" color="text-on-surface-variant">
                    /mo
                  </Text>
                </View>
                <View className="w-full mt-3">
                  <ProgressBar
                    value={health.sipRatio * 100}
                    max={100}
                    tone={BUCKET_TO_BAR_TONE[health.sipBucket]}
                    height="md"
                  />
                </View>
              </View>
            }
            title="SIP / income"
            chipLabel={`${Math.round(health.sipRatio * 100)}%`}
            chipTone={BUCKET_TO_CHIP[health.sipBucket]}
            sub="Aim for 20% +"
          />
          <MetricTile
            visual={
              <View className="items-center w-full px-2">
                <Text variant="headline-lg" color="text-on-surface" numberOfLines={1}>
                  {health.emergencyMonths.toFixed(1)} mo
                </Text>
                <View className="flex-row gap-1 mt-3 w-full">
                  {[0, 1, 2, 3].map((i) => (
                    <View
                      key={i}
                      className={`h-2 flex-1 rounded-full ${
                        i < health.emergencySegments
                          ? BUCKET_TO_BG[health.emergencyBucket]
                          : 'bg-surface-variant'
                      }`}
                    />
                  ))}
                </View>
              </View>
            }
            title="Emergency fund"
            chipLabel={EF_LABEL[health.emergencyBucket]}
            chipTone={BUCKET_TO_CHIP[health.emergencyBucket]}
            sub="Target: 6 months"
          />
        </View>

        <GoalPilotEntryCard />

        <Card variant="outline">
          <Text variant="label-caps" color="text-on-surface-variant" className="mb-stack-sm">
            Demo controls
          </Text>
          <Text variant="body-md" color="text-on-surface-variant" className="mb-stack-md">
            Wipes saved profile and signs out so you can replay the journey from the invite screen.
          </Text>
          <Button label="Reset demo" variant="ghost" leadingIcon="close" onPress={onResetDemo} />
        </Card>
      </ScreenContainer>
    </View>
  );
}
