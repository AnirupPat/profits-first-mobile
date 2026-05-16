import { View } from 'react-native';
import { router } from 'expo-router';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { TopAppBar } from '@/components/layout/TopAppBar';
import { Text } from '@/components/ui/Text';
import { Card } from '@/components/ui/Card';
import { Chip, type ChipTone } from '@/components/ui/Chip';
import { Icon, type IconName } from '@/components/ui/Icon';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useOnboarding } from '@/state/OnboardingContext';
import { computeHealth, type HealthBucket, type HealthMetrics } from '@/utils/portfolioHealth';
import { inr, inrCompact } from '@/utils/format';

const BUCKET_TO_CHIP: Record<HealthBucket, ChipTone> = {
  good: 'success',
  warn: 'warning',
  bad: 'danger',
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

const ALL_BUCKETS = (h: HealthMetrics): HealthBucket[] => [
  h.dtiBucket,
  h.totalDebtBucket,
  h.hiDebtBucket,
  h.sipBucket,
  h.emergencyBucket,
  h.healthCoverBucket,
  h.termCoverBucket,
];

type DetailCardProps = {
  icon: IconName;
  category: string;
  value: string;
  bucket: HealthBucket;
  chipLabel: string;
  description: string;
  target: string;
  fillRatio?: number;
  children?: React.ReactNode;
};

function DetailMetricCard({
  icon,
  category,
  value,
  bucket,
  chipLabel,
  description,
  target,
  fillRatio,
  children,
}: DetailCardProps) {
  return (
    <Card>
      <View className="flex-row items-center gap-stack-sm mb-stack-md">
        <View className="w-9 h-9 rounded-lg bg-surface-container-high items-center justify-center">
          <Icon name={icon} size={18} color="#bec6e0" />
        </View>
        <Text variant="label-caps" color="text-on-surface-variant">
          {category}
        </Text>
      </View>

      <View className="flex-row items-end justify-between mb-stack-md">
        <Text variant="headline-lg" color="text-on-surface" numberOfLines={1}>
          {value}
        </Text>
        <Chip label={chipLabel} tone={BUCKET_TO_CHIP[bucket]} />
      </View>

      {fillRatio !== undefined ? (
        <View className="mb-stack-md">
          <ProgressBar
            value={Math.max(0, Math.min(1, fillRatio)) * 100}
            max={100}
            tone={BUCKET_TO_BAR_TONE[bucket]}
            height="md"
          />
        </View>
      ) : null}

      <Text variant="body-md" color="text-on-surface-variant">
        {description}
      </Text>

      {children ? <View className="mt-stack-md">{children}</View> : null}

      <View className="mt-stack-md pt-stack-sm border-t border-outline-variant/20">
        <Text variant="label-caps" color="text-on-surface-variant">
          {target}
        </Text>
      </View>
    </Card>
  );
}

function BreakdownRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row justify-between py-1.5">
      <Text variant="body-md" color="text-on-surface-variant">
        {label}
      </Text>
      <Text variant="body-md" color="text-on-surface">
        {value}
      </Text>
    </View>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <View className="mt-stack-md">
      <Text variant="headline-md" color="text-on-surface">
        {title}
      </Text>
      <Text variant="label-caps" color="text-on-surface-variant" className="mt-1">
        {subtitle}
      </Text>
    </View>
  );
}

function multipleLabel(ratio: number): string {
  if (ratio === 0) return 'None';
  if (ratio < 1) return `${ratio.toFixed(2)}× income`;
  return `${ratio.toFixed(1)}× income`;
}

export default function PortfolioHealthDetailScreen() {
  const { profile } = useOnboarding();
  if (!profile.financial) return null;
  const f = profile.financial;
  const health = computeHealth(f);
  const buckets = ALL_BUCKETS(health);
  const counts = {
    good: buckets.filter((b) => b === 'good').length,
    warn: buckets.filter((b) => b === 'warn').length,
    bad: buckets.filter((b) => b === 'bad').length,
  };

  // EMI breakdown by loan (using same 0.01/0.02/0.025/0.05 proxy as portfolioHealth)
  const emiRows = [
    { label: 'Home loan', emi: Math.round(f.liabilities.homeLoan * 0.01) },
    { label: 'Car loan', emi: Math.round(f.liabilities.carLoan * 0.02) },
    { label: 'Personal loan', emi: Math.round(f.liabilities.personalLoan * 0.025) },
    { label: 'Credit card', emi: Math.round(f.liabilities.creditCard * 0.05) },
  ].filter((r) => r.emi > 0);

  const liabilityRows = [
    { label: 'Home loan', amount: f.liabilities.homeLoan },
    { label: 'Car loan', amount: f.liabilities.carLoan },
    { label: 'Personal loan', amount: f.liabilities.personalLoan },
    { label: 'Credit card', amount: f.liabilities.creditCard },
  ].filter((r) => r.amount > 0);

  return (
    <View className="flex-1 bg-background">
      <TopAppBar title="Portfolio Health" onBackPress={() => router.back()} rightIcon={null} />
      <ScreenContainer scroll edges={[]} contentClassName="gap-stack-md pb-stack-lg">
        <View>
          <Text variant="headline-lg" color="text-on-surface">
            Your financial fitness
          </Text>
          <Text variant="body-md" color="text-on-surface-variant" className="mt-2">
            Seven signals Sanjay reviews before every advisory call. Each one tells you where you're strong and where to focus next.
          </Text>
        </View>

        <Card variant="high">
          <Text variant="label-caps" color="text-on-surface-variant" className="mb-stack-md">
            Overall snapshot
          </Text>
          <View className="flex-row items-center gap-stack-md">
            <View className="flex-1 flex-row gap-2">
              <View className="flex-1 items-center bg-secondary-container/30 rounded-lg py-stack-md">
                <Text variant="headline-lg" className="text-secondary">
                  {counts.good}
                </Text>
                <Text variant="label-caps" className="text-secondary mt-1">
                  Strong
                </Text>
              </View>
              <View className="flex-1 items-center bg-tertiary-container/30 rounded-lg py-stack-md">
                <Text variant="headline-lg" className="text-tertiary">
                  {counts.warn}
                </Text>
                <Text variant="label-caps" className="text-tertiary mt-1">
                  Watch
                </Text>
              </View>
              <View className="flex-1 items-center bg-error-container/30 rounded-lg py-stack-md">
                <Text variant="headline-lg" className="text-error">
                  {counts.bad}
                </Text>
                <Text variant="label-caps" className="text-error mt-1">
                  Fix soon
                </Text>
              </View>
            </View>
          </View>
          <Text variant="body-md" color="text-on-surface-variant" className="mt-stack-md">
            {counts.bad > 0
              ? `Start with the ${counts.bad} red flag below — those compound the fastest.`
              : counts.warn > 0
                ? 'No red flags. Nudge the watchlist items when you have bandwidth.'
                : 'Every signal is green. Keep doing what you\'re doing.'}
          </Text>
        </Card>

        <SectionHeader title="Debt" subtitle="What you owe today" />

        <DetailMetricCard
          icon="pie_chart"
          category="Debt-to-income"
          value={`${Math.round(health.dti * 100)}%`}
          bucket={health.dtiBucket}
          chipLabel={
            health.dtiBucket === 'good'
              ? 'Comfortable'
              : health.dtiBucket === 'warn'
                ? 'Tight'
                : 'Heavy'
          }
          description={`Your estimated EMIs total ${inr(health.monthlyEmi)} against ${inr(health.monthlyIncome)} monthly income.`}
          target="Target: under 35% of monthly income"
          fillRatio={health.dti}
        >
          <View className="bg-surface-container-low rounded-lg p-3">
            {emiRows.length === 0 ? (
              <Text variant="body-md" color="text-on-surface-variant">
                No loans recorded.
              </Text>
            ) : (
              <>
                {emiRows.map((r) => (
                  <BreakdownRow key={r.label} label={r.label} value={inr(r.emi)} />
                ))}
                <View className="h-px bg-outline-variant/20 my-1" />
                <BreakdownRow label="Total monthly EMI" value={inr(health.monthlyEmi)} />
              </>
            )}
          </View>
        </DetailMetricCard>

        <DetailMetricCard
          icon="bar_chart"
          category="Total debt outstanding"
          value={inrCompact(health.totalDebt)}
          bucket={health.totalDebtBucket}
          chipLabel={multipleLabel(health.totalDebtRatio)}
          description={`Combined balance across every loan, ${health.totalDebtRatio.toFixed(2)}× your ${inrCompact(health.annualIncome)} annual income.`}
          target="Target: under 2× annual income"
          fillRatio={Math.min(1, health.totalDebtRatio / 4)}
        >
          <View className="bg-surface-container-low rounded-lg p-3">
            {liabilityRows.length === 0 ? (
              <Text variant="body-md" color="text-on-surface-variant">
                No liabilities recorded.
              </Text>
            ) : (
              liabilityRows.map((r) => (
                <BreakdownRow key={r.label} label={r.label} value={inr(r.amount)} />
              ))
            )}
          </View>
        </DetailMetricCard>

        <DetailMetricCard
          icon="warning"
          category="Toxic debt"
          value={inr(health.hiDebt)}
          bucket={health.hiDebtBucket}
          chipLabel={
            health.hiDebtBucket === 'good'
              ? 'Cleared'
              : health.hiDebtBucket === 'warn'
                ? 'Pay soon'
                : 'Reduce now'
          }
          description={`Credit-card and personal-loan balances combined. These usually carry 14-36% interest — clear them before investing more.`}
          target="Target: zero high-interest debt"
          fillRatio={Math.min(1, health.hiDebt / health.monthlyIncome)}
        >
          <View className="bg-surface-container-low rounded-lg p-3">
            <BreakdownRow label="Credit card" value={inr(f.liabilities.creditCard)} />
            <BreakdownRow label="Personal loan" value={inr(f.liabilities.personalLoan)} />
          </View>
        </DetailMetricCard>

        <SectionHeader title="Saving" subtitle="What you set aside" />

        <DetailMetricCard
          icon="trending_up"
          category="SIP / income"
          value={inr(health.monthlySip)}
          bucket={health.sipBucket}
          chipLabel={`${Math.round(health.sipRatio * 100)}% of income`}
          description={`You're putting ${inr(health.monthlySip)} into systematic investments every month, out of ${inr(health.monthlyIncome)} take-home.`}
          target="Target: 20%+ of monthly income"
          fillRatio={health.sipRatio}
        />

        <DetailMetricCard
          icon="show_chart"
          category="Emergency fund"
          value={`${health.emergencyMonths.toFixed(1)} months`}
          bucket={health.emergencyBucket}
          chipLabel={
            health.emergencyBucket === 'good'
              ? 'On track'
              : health.emergencyBucket === 'warn'
                ? 'Almost'
                : 'Top up'
          }
          description={`${inr(health.emergencyCash)} in cash & savings can cover ${health.emergencyMonths.toFixed(1)} months of your ${inr(health.monthlyExpense)} monthly outflow.`}
          target={`Target: 6 months (~${inrCompact(health.monthlyExpense * 6)})`}
        >
          <View className="flex-row gap-1.5">
            {[0, 1, 2, 3].map((i) => (
              <View
                key={i}
                className={`h-3 flex-1 rounded-full ${
                  i < health.emergencySegments
                    ? BUCKET_TO_BG[health.emergencyBucket]
                    : 'bg-surface-variant'
                }`}
              />
            ))}
          </View>
          <View className="flex-row justify-between mt-2">
            <Text variant="label-caps" color="text-on-surface-variant">
              {'<'} 1.5 mo
            </Text>
            <Text variant="label-caps" color="text-on-surface-variant">
              6+ mo
            </Text>
          </View>
        </DetailMetricCard>

        <SectionHeader title="Protection" subtitle="What stays standing if life shifts" />

        <DetailMetricCard
          icon="favorite"
          category="Health cover"
          value={inrCompact(health.healthCover)}
          bucket={health.healthCoverBucket}
          chipLabel={multipleLabel(health.healthCoverRatio)}
          description={`Total family health insurance sum assured. Hospital bills inflate ~12% a year — yesterday's cover is rarely enough.`}
          target="Target: 3× annual income"
          fillRatio={Math.min(1, health.healthCoverRatio / 3)}
        />

        <DetailMetricCard
          icon="shield"
          category="Term life cover"
          value={health.hasTerm ? inrCompact(health.lifeCover) : 'Not active'}
          bucket={health.termCoverBucket}
          chipLabel={
            health.hasTerm
              ? multipleLabel(health.termCoverRatio)
              : 'No term plan'
          }
          description={
            health.hasTerm
              ? `Your family receives ${inrCompact(health.lifeCover)} on an unfortunate event. Term covers cost very little when you're young.`
              : `You don't have a pure term plan flagged. A 1Cr cover for someone earning ${inrCompact(health.monthlyIncome)}/mo typically costs ₹600-900 a month.`
          }
          target="Target: 10× annual income"
          fillRatio={Math.min(1, health.termCoverRatio / 10)}
        />
      </ScreenContainer>
    </View>
  );
}
