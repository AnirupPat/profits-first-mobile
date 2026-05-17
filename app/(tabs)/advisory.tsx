import { Pressable, View } from 'react-native';
import { router } from 'expo-router';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { TopAppBar } from '@/components/layout/TopAppBar';
import { Text } from '@/components/ui/Text';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Chip, type ChipTone } from '@/components/ui/Chip';
import { Icon } from '@/components/ui/Icon';
import { SanjayAvatar } from '@/components/brand/SanjayAvatar';
import { GoalPilotEntryCard } from '@/components/goals/GoalPilotEntryCard';
import { useOnboarding } from '@/state/OnboardingContext';
import { useAdvisory } from '@/state/AdvisoryContext';
import { SANJAY, ADVISORY_SLOTS, SANJAY_INSIGHTS } from '@/data/mockAdvisor';
import { computeHealth, type HealthBucket } from '@/utils/portfolioHealth';
import type { AdvisoryInsight } from '@/types/advisor';

// ── Date helpers ─────────────────────────────────────────────────────────────

function fmtDay(iso: string) {
  return new Intl.DateTimeFormat('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).format(new Date(iso));
}

function fmtTime(iso: string) {
  return new Intl.DateTimeFormat('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(iso));
}

function fmtInsightDate(dateStr: string) {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
  }).format(new Date(dateStr));
}

// ── Health snapshot ───────────────────────────────────────────────────────────

const BUCKET_CHIP: Record<HealthBucket, ChipTone> = {
  good: 'success',
  warn: 'warning',
  bad: 'danger',
};

function HealthRow({
  label,
  chipLabel,
  bucket,
}: {
  label: string;
  chipLabel: string;
  bucket: HealthBucket;
}) {
  return (
    <View className="flex-row items-center justify-between py-2.5 border-b border-outline-variant/15">
      <Text variant="label-caps" color="text-on-surface-variant">
        {label}
      </Text>
      <Chip label={chipLabel} tone={BUCKET_CHIP[bucket]} />
    </View>
  );
}

// ── Insight card ──────────────────────────────────────────────────────────────

function InsightCard({ insight }: { insight: AdvisoryInsight }) {
  return (
    <Card>
      <View className="flex-row items-center gap-2 mb-stack-sm">
        <SanjayAvatar size={28} rounded="circle" />
        <Text variant="label-caps" color="text-on-surface-variant">
          Sanjay · {fmtInsightDate(insight.date)}
        </Text>
      </View>
      <Text variant="body-md" color="text-on-surface" className="font-manrope-semibold mb-1">
        {insight.title}
      </Text>
      <Text variant="body-md" color="text-on-surface-variant">
        {insight.body}
      </Text>
    </Card>
  );
}

// ── Screen ────────────────────────────────────────────────────────────────────

export default function AdvisoryScreen() {
  const { profile } = useOnboarding();
  const { status, bookedSlotId, cancelBooking } = useAdvisory();

  const firstName = profile.personal?.fullName.split(' ')[0] ?? 'there';

  // health snapshot requires financial data (home tab already gates on step===done)
  const health = profile.financial ? computeHealth(profile.financial) : null;

  const bookedSlot = bookedSlotId
    ? ADVISORY_SLOTS.find((s) => s.id === bookedSlotId)
    : null;

  const TYPE_LABEL: Record<string, string> = {
    intro: 'Introductory call',
    review: 'Portfolio review',
    planning: 'Goal planning session',
  };

  return (
    <View className="flex-1 bg-background">
      <TopAppBar title="Advisory" onRightPress={() => router.push('/help')} />
      <ScreenContainer scroll edges={[]} contentClassName="gap-stack-md">

        <View>
          <Text variant="headline-lg" color="text-on-surface">
            Hi, {firstName}
          </Text>
          <Text variant="body-md" color="text-on-surface-variant" className="mt-1">
            Here's how Sanjay can help you navigate your financial journey.
          </Text>
        </View>

        {/* ── Sanjay profile card ── */}
        <Card variant="high">
          <View className="flex-row items-start gap-stack-md mb-stack-md">
            <SanjayAvatar size={64} rounded="circle" />
            <View className="flex-1">
              <Text variant="label-caps" color="text-secondary">
                Your advisor
              </Text>
              <Text variant="headline-md" color="text-on-surface" className="mt-0.5">
                {SANJAY.name}
              </Text>
              <Text variant="body-md" color="text-on-surface-variant" className="mt-0.5">
                {SANJAY.experienceYrs} yrs · MBA in Finance, CFA
              </Text>
            </View>
            <View className="flex-row gap-1.5">
              {SANJAY.credentials.map((c) => (
                <Chip key={c} label={c} tone="info" />
              ))}
            </View>
          </View>

          <Text variant="body-md" color="text-on-surface-variant" className="mb-stack-md">
            {SANJAY.bio}
          </Text>

          <View className="flex-row flex-wrap gap-2 mb-stack-md">
            {SANJAY.specialisations.map((s) => (
              <Chip key={s} label={s} tone="default" />
            ))}
          </View>

          <Button
            label="Schedule a Call"
            onPress={() => router.push('/advisory/schedule')}
            fullWidth
            leadingIcon="schedule"
          />
        </Card>

        {/* ── Booked call card ── */}
        {status === 'confirmed' && bookedSlot ? (
          <Card variant="outline">
            <View className="flex-row items-start gap-3 mb-stack-md">
              <View className="w-10 h-10 rounded-xl bg-secondary-container/30 items-center justify-center">
                <Icon name="calendar_today" size={20} color="#99d4ae" />
              </View>
              <View className="flex-1">
                <Text variant="label-caps" color="text-secondary">
                  Your next call
                </Text>
                <Text variant="headline-md" color="text-on-surface" className="mt-0.5">
                  {fmtDay(bookedSlot.isoDateTime)}
                </Text>
                <Text variant="body-md" color="text-on-surface-variant">
                  {fmtTime(bookedSlot.isoDateTime)} · {bookedSlot.durationMins} min ·{' '}
                  {TYPE_LABEL[bookedSlot.type]}
                </Text>
              </View>
            </View>

            <View className="flex-row gap-stack-sm">
              <Pressable
                onPress={() => router.push('/advisory/agenda')}
                className="flex-1 flex-row items-center justify-center gap-1.5 py-2.5 rounded-lg bg-secondary-container/20 border border-secondary/30"
              >
                <Icon name="flag" size={16} color="#99d4ae" />
                <Text variant="label-caps" color="text-secondary">
                  View agenda
                </Text>
              </Pressable>
              <Pressable
                onPress={cancelBooking}
                className="flex-1 flex-row items-center justify-center gap-1.5 py-2.5 rounded-lg border border-outline-variant/40"
              >
                <Text variant="label-caps" color="text-on-surface-variant">
                  Reschedule
                </Text>
              </Pressable>
            </View>
          </Card>
        ) : null}

        {/* ── Goal Pilot prep card ── */}
        <View>
          <Text variant="headline-md" color="text-on-surface" className="mb-stack-sm">
            Prepare for your call
          </Text>
          <GoalPilotEntryCard variant="advisory" />
        </View>

        {/* ── Portfolio health snapshot ── */}
        {health ? (
          <Card>
            <View className="flex-row items-center justify-between mb-stack-sm">
              <Text variant="label-caps" color="text-on-surface-variant">
                Portfolio health
              </Text>
              <Pressable
                onPress={() => router.push('/portfolio-health')}
                className="flex-row items-center gap-1"
                style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
              >
                <Text variant="label-caps" className="text-primary">
                  Full report
                </Text>
                <Icon name="chevron_right" size={14} color="#bec6e0" />
              </Pressable>
            </View>

            <HealthRow
              label="Debt-to-income"
              chipLabel={
                health.dtiBucket === 'good'
                  ? 'Comfortable'
                  : health.dtiBucket === 'warn'
                    ? 'Tight'
                    : 'Heavy'
              }
              bucket={health.dtiBucket}
            />
            <HealthRow
              label="SIP / income"
              chipLabel={`${Math.round(health.sipRatio * 100)}%`}
              bucket={health.sipBucket}
            />
            <HealthRow
              label="Emergency fund"
              chipLabel={`${health.emergencyMonths.toFixed(1)} mo`}
              bucket={health.emergencyBucket}
            />
            <HealthRow
              label="High-interest debt"
              chipLabel={
                health.hiDebtBucket === 'good'
                  ? 'Cleared'
                  : health.hiDebtBucket === 'warn'
                    ? 'Pay soon'
                    : 'Reduce now'
              }
              bucket={health.hiDebtBucket}
            />
          </Card>
        ) : null}

        {/* ── Sanjay's insights ── */}
        <View>
          <Text variant="headline-md" color="text-on-surface" className="mb-stack-sm">
            Sanjay's insights
          </Text>
          {SANJAY_INSIGHTS.map((ins) => (
            <View key={ins.id} className="mb-stack-sm">
              <InsightCard insight={ins} />
            </View>
          ))}
        </View>

      </ScreenContainer>
    </View>
  );
}
