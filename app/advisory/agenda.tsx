import { View } from 'react-native';
import { router } from 'expo-router';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { TopAppBar } from '@/components/layout/TopAppBar';
import { Text } from '@/components/ui/Text';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { Icon, type IconName } from '@/components/ui/Icon';
import { SanjayAvatar } from '@/components/brand/SanjayAvatar';
import { useOnboarding } from '@/state/OnboardingContext';
import { useAdvisory } from '@/state/AdvisoryContext';
import { useGoals } from '@/state/GoalsContext';
import { computeHealth } from '@/utils/portfolioHealth';
import { ADVISORY_SLOTS, SANJAY } from '@/data/mockAdvisor';
import { inr, inrCompact } from '@/utils/format';
import type { Goal } from '@/types/goals';

// ── Helpers ──────────────────────────────────────────────────────────────────

function fmtDay(iso: string) {
  return new Intl.DateTimeFormat('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date(iso));
}

function fmtTime(iso: string) {
  return new Intl.DateTimeFormat('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(iso));
}

// ── Agenda item types ─────────────────────────────────────────────────────────

type Priority = 'high' | 'medium' | 'low';

type AgendaItem = {
  id: string;
  icon: IconName;
  title: string;
  detail: string;
  priority: Priority;
};

const PRIORITY_TONE: Record<Priority, 'danger' | 'warning' | 'default'> = {
  high: 'danger',
  medium: 'warning',
  low: 'default',
};

const PRIORITY_LABEL: Record<Priority, string> = {
  high: 'Priority',
  medium: 'Review',
  low: 'FYI',
};

// ── Agenda generation ─────────────────────────────────────────────────────────

function buildAgenda(
  profile: ReturnType<typeof useOnboarding>['profile'],
  goals: Goal[],
  prepNotes: string,
): AgendaItem[] {
  const items: AgendaItem[] = [];

  if (!profile.financial) return items;
  const h = computeHealth(profile.financial);

  // High-interest debt
  if (h.hiDebtBucket === 'bad') {
    items.push({
      id: 'hi-debt',
      icon: 'credit-card-outline',
      title: 'High-interest debt is costing you',
      detail: `${inrCompact(h.hiDebt)} in credit cards / personal loans at 18–36% p.a. Sanjay will design a fast-payoff sequence.`,
      priority: 'high',
    });
  } else if (h.hiDebtBucket === 'warn') {
    items.push({
      id: 'hi-debt',
      icon: 'credit-card-outline',
      title: 'Pay down high-interest debt soon',
      detail: `${inrCompact(h.hiDebt)} outstanding. A 3-month payoff plan can free up ${inr(Math.round(h.hiDebt / 3))}/mo for investments.`,
      priority: 'medium',
    });
  }

  // DTI
  if (h.dtiBucket === 'bad') {
    items.push({
      id: 'dti',
      icon: 'trending-down',
      title: 'Debt-to-income ratio is heavy',
      detail: `At ${Math.round(h.dti * 100)}% DTI, loan EMIs are straining cash flow. Sanjay will review consolidation or prepayment options.`,
      priority: 'high',
    });
  }

  // Emergency fund
  if (h.emergencyBucket === 'bad') {
    items.push({
      id: 'ef',
      icon: 'shield-outline',
      title: 'Emergency fund needs topping up',
      detail: `${h.emergencyMonths.toFixed(1)} months saved against a 6-month target. A liquid fund SIP of ${inr(Math.round((6 - h.emergencyMonths) * (profile.financial?.monthlyExpense ?? 0) / 6))}/mo fills the gap in 6 months.`,
      priority: 'high',
    });
  } else if (h.emergencyBucket === 'warn') {
    items.push({
      id: 'ef',
      icon: 'shield-outline',
      title: 'Almost there — complete your emergency fund',
      detail: `${h.emergencyMonths.toFixed(1)} of 6 months funded. Top it up before increasing long-term SIPs.`,
      priority: 'medium',
    });
  }

  // SIP
  if (h.sipBucket === 'bad') {
    items.push({
      id: 'sip',
      icon: 'trending_up',
      title: 'SIP allocation is below target',
      detail: `Currently ${Math.round(h.sipRatio * 100)}% of income. Sanjay recommends a step-up plan to reach 20% over 12 months.`,
      priority: 'medium',
    });
  }

  // Lagging goals
  const lagging = goals.filter((g) => g.status === 'lagging');
  for (const goal of lagging) {
    const gap = goal.monthlySipNeeded - goal.monthlySipActual;
    items.push({
      id: `goal-${goal.id}`,
      icon: 'target',
      title: `${goal.name} is behind plan`,
      detail: `SIP is ${inr(goal.monthlySipActual)}/mo but needs ${inr(goal.monthlySipNeeded)}/mo. Gap of ${inr(gap)}/mo — review timeline or increase contributions.`,
      priority: 'medium',
    });
  }

  // Goals with no linked funds
  const unlinked = goals.filter((g) => g.linkedFunds.length === 0);
  if (unlinked.length > 0) {
    items.push({
      id: 'unlinked-goals',
      icon: 'flag',
      title: `${unlinked.length} goal${unlinked.length > 1 ? 's' : ''} without dedicated SIPs`,
      detail: `${unlinked.map((g) => g.name).join(', ')} — link mutual funds to these goals to track progress properly.`,
      priority: 'medium',
    });
  }

  // Standard review items
  items.push({
    id: 'goal-review',
    icon: 'flag',
    title: 'Goal portfolio review',
    detail: "Walk through each goal's progress and update projections based on recent performance.",
    priority: 'low',
  });

  if (h.sipBucket === 'good') {
    items.push({
      id: 'sip-stepup',
      icon: 'trending_up',
      title: 'Plan next SIP step-up',
      detail: 'Your savings rate is healthy. Sanjay will model how a 10% annual SIP increase impacts long-term corpus.',
      priority: 'low',
    });
  }

  // Prepnotes as a discussion point
  if (prepNotes.trim().length > 0) {
    items.push({
      id: 'prep-notes',
      icon: 'note-text-outline',
      title: 'Your notes for this call',
      detail: prepNotes.trim(),
      priority: 'low',
    });
  }

  return items;
}

// ── Agenda item card ──────────────────────────────────────────────────────────

function AgendaCard({ item, index }: { item: AgendaItem; index: number }) {
  return (
    <View className="flex-row gap-3">
      {/* Number + vertical line */}
      <View className="items-center" style={{ width: 32 }}>
        <View className="w-8 h-8 rounded-full bg-surface-container-high items-center justify-center">
          <Text variant="label-caps" color="text-on-surface">
            {index + 1}
          </Text>
        </View>
      </View>

      {/* Content */}
      <View className="flex-1 pb-stack-md">
        <View className="flex-row items-start gap-2 mb-1">
          <View className="flex-1">
            <Text variant="body-md" color="text-on-surface" className="font-manrope-semibold">
              {item.title}
            </Text>
          </View>
          <Chip label={PRIORITY_LABEL[item.priority]} tone={PRIORITY_TONE[item.priority]} />
        </View>
        <Text variant="body-md" color="text-on-surface-variant">
          {item.detail}
        </Text>
      </View>
    </View>
  );
}

// ── Screen ────────────────────────────────────────────────────────────────────

export default function AgendaScreen() {
  const { profile } = useOnboarding();
  const { bookedSlotId, prepNotes } = useAdvisory();
  const { goals } = useGoals();

  const bookedSlot = bookedSlotId
    ? ADVISORY_SLOTS.find((s) => s.id === bookedSlotId)
    : null;

  const agendaItems = buildAgenda(profile, goals, prepNotes);
  const highPriority = agendaItems.filter((i) => i.priority === 'high').length;

  return (
    <View className="flex-1 bg-background">
      <TopAppBar title="Call Agenda" onBackPress={() => router.back()} rightIcon={null} />
      <ScreenContainer scroll edges={[]} contentClassName="gap-stack-md pb-stack-lg">

        {/* Call header */}
        <Card variant="high">
          <View className="flex-row items-center gap-3">
            <SanjayAvatar size={48} rounded="circle" />
            <View className="flex-1">
              <Text variant="label-caps" color="text-secondary">
                Upcoming call with {SANJAY.name}
              </Text>
              {bookedSlot ? (
                <Text variant="headline-md" color="text-on-surface" className="mt-0.5">
                  {fmtDay(bookedSlot.isoDateTime)}
                </Text>
              ) : (
                <Text variant="headline-md" color="text-on-surface" className="mt-0.5">
                  Not yet scheduled
                </Text>
              )}
              {bookedSlot ? (
                <Text variant="body-md" color="text-on-surface-variant">
                  {fmtTime(bookedSlot.isoDateTime)} · {bookedSlot.durationMins} min
                </Text>
              ) : null}
            </View>
          </View>

          {highPriority > 0 && (
            <View className="mt-stack-md flex-row items-center gap-2 bg-error-container/10 rounded-lg border border-error/20 p-3">
              <Icon name="warning" size={16} color="#ffb4ab" />
              <Text variant="label-caps" color="text-on-surface-variant" className="flex-1">
                {highPriority} priority item{highPriority > 1 ? 's' : ''} detected — Sanjay will
                focus on these first.
              </Text>
            </View>
          )}
        </Card>

        {/* Agenda items */}
        <View>
          <Text variant="headline-md" color="text-on-surface" className="mb-stack-sm">
            Discussion points
          </Text>
          <Card>
            {agendaItems.map((item, i) => (
              <AgendaCard key={item.id} item={item} index={i} />
            ))}
          </Card>
        </View>

        {/* Sanjay's prep note */}
        <Card variant="outline">
          <View className="flex-row items-start gap-3">
            <SanjayAvatar size={32} rounded="circle" />
            <View className="flex-1">
              <Text variant="label-caps" color="text-secondary" className="mb-1">
                A note from Sanjay
              </Text>
              <Text variant="body-md" color="text-on-surface-variant">
                I've reviewed your portfolio snapshot and goal progress. Come prepared with any
                questions about fund selection or SIP amounts — we'll make every minute count.
              </Text>
            </View>
          </View>
        </Card>

      </ScreenContainer>
    </View>
  );
}
