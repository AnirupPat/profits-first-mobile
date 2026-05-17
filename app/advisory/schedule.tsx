import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { router } from 'expo-router';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { TopAppBar } from '@/components/layout/TopAppBar';
import { Text } from '@/components/ui/Text';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Input } from '@/components/ui/Input';
import { SanjayAvatar } from '@/components/brand/SanjayAvatar';
import { useAdvisory } from '@/state/AdvisoryContext';
import { ADVISORY_SLOTS, SANJAY } from '@/data/mockAdvisor';
import type { AdvisorySlot, AdvisoryCallType } from '@/types/advisor';

// ── Helpers ──────────────────────────────────────────────────────────────────

function fmtDay(iso: string) {
  return new Intl.DateTimeFormat('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date(iso));
}

function fmtDayShort(iso: string) {
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

const TYPE_LABEL: Record<AdvisoryCallType, string> = {
  intro: 'Introductory call',
  review: 'Portfolio review',
  planning: 'Goal planning session',
};

const TYPE_DESC: Record<AdvisoryCallType, string> = {
  intro: "First time with Sanjay? Start here — he'll map your financial picture.",
  review: 'Deep dive into your portfolio, health metrics, and fund performance.',
  planning: 'Focus on your goals, timelines, and the SIP adjustments needed.',
};

// Group slots by calendar date (YYYY-MM-DD)
function groupByDate(slots: AdvisorySlot[]): { dateKey: string; slots: AdvisorySlot[] }[] {
  const map: Record<string, AdvisorySlot[]> = {};
  for (const s of slots) {
    const key = s.isoDateTime.slice(0, 10);
    if (!map[key]) map[key] = [];
    map[key].push(s);
  }
  return Object.entries(map).map(([dateKey, slots]) => ({ dateKey, slots }));
}

// ── Slot card ─────────────────────────────────────────────────────────────────

function SlotCard({
  slot,
  selected,
  onSelect,
}: {
  slot: AdvisorySlot;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <Pressable
      onPress={onSelect}
      style={({ pressed }) => (pressed ? { opacity: 0.7 } : undefined)}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
    >
      <View
        className={`rounded-xl border p-4 gap-stack-sm ${
          selected
            ? 'bg-secondary-container/15 border-secondary'
            : 'bg-surface-container-low border-outline-variant/20'
        }`}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <Icon
              name="schedule"
              size={16}
              color={selected ? '#99d4ae' : '#909097'}
            />
            <Text
              variant="body-md"
              color={selected ? 'text-secondary' : 'text-on-surface'}
              className="font-manrope-semibold"
            >
              {fmtTime(slot.isoDateTime)}
            </Text>
            <Text variant="label-caps" color="text-on-surface-variant">
              · {slot.durationMins} min
            </Text>
          </View>

          <View
            className={`w-5 h-5 rounded-full border-2 items-center justify-center ${
              selected ? 'border-secondary bg-secondary' : 'border-outline-variant'
            }`}
          >
            {selected ? <View className="w-2 h-2 rounded-full bg-background" /> : null}
          </View>
        </View>

        <Text
          variant="label-caps"
          color={selected ? 'text-secondary' : 'text-on-surface-variant'}
        >
          {TYPE_LABEL[slot.type]}
        </Text>

        {selected && (
          <Text variant="body-md" color="text-on-surface-variant">
            {TYPE_DESC[slot.type]}
          </Text>
        )}
      </View>
    </Pressable>
  );
}

// ── Screen ────────────────────────────────────────────────────────────────────

export default function ScheduleScreen() {
  const { bookSlot, setPrepNotes, prepNotes } = useAdvisory();
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const groups = groupByDate(ADVISORY_SLOTS);
  const selectedSlot = selectedSlotId
    ? ADVISORY_SLOTS.find((s) => s.id === selectedSlotId)
    : null;

  const handleConfirm = () => {
    if (!selectedSlotId) return;
    bookSlot(selectedSlotId);
    setConfirmed(true);
  };

  if (confirmed && selectedSlot) {
    return (
      <View className="flex-1 bg-background">
        <TopAppBar title="Booking confirmed" onBackPress={() => router.back()} rightIcon={null} />
        <ScreenContainer edges={[]} contentClassName="items-center justify-center gap-stack-lg px-6">
          <View className="items-center gap-stack-md">
            <View className="w-20 h-20 rounded-full bg-secondary-container/30 items-center justify-center">
              <Icon name="check_circle" size={40} color="#99d4ae" />
            </View>
            <Text variant="headline-lg" color="text-on-surface" className="text-center">
              You're all set!
            </Text>
            <Text variant="body-md" color="text-on-surface-variant" className="text-center">
              Your call with{' '}
              <Text variant="body-md" color="text-on-surface" className="font-manrope-semibold">
                {SANJAY.name}
              </Text>{' '}
              is booked for{' '}
              <Text variant="body-md" color="text-on-surface" className="font-manrope-semibold">
                {fmtDay(selectedSlot.isoDateTime)}
              </Text>{' '}
              at{' '}
              <Text variant="body-md" color="text-on-surface" className="font-manrope-semibold">
                {fmtTime(selectedSlot.isoDateTime)}
              </Text>
              .
            </Text>
          </View>

          <Card variant="high">
            <View className="flex-row items-center gap-3">
              <Icon name="flag" size={20} color="#99d4ae" />
              <View className="flex-1">
                <Text variant="label-caps" color="text-on-surface-variant">
                  Tip
                </Text>
                <Text variant="body-md" color="text-on-surface-variant" className="mt-0.5">
                  Review your call agenda before the meeting so Sanjay can prepare tailored recommendations.
                </Text>
              </View>
            </View>
          </Card>

          <View className="w-full gap-stack-sm">
            <Button
              label="View call agenda"
              onPress={() => {
                router.replace('/advisory/agenda');
              }}
              fullWidth
              leadingIcon="flag"
            />
            <Button
              label="Back to Advisory"
              variant="outline"
              onPress={() => router.replace('/(tabs)/advisory')}
              fullWidth
            />
          </View>
        </ScreenContainer>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <TopAppBar
        title="Schedule a call"
        onBackPress={() => router.back()}
        rightIcon={null}
      />
      <ScreenContainer scroll edges={[]} contentClassName="gap-stack-md pb-stack-lg">

        {/* Sanjay mini-header */}
        <Card variant="high">
          <View className="flex-row items-center gap-3">
            <SanjayAvatar size={44} rounded="circle" />
            <View className="flex-1">
              <Text variant="body-md" color="text-on-surface" className="font-manrope-semibold">
                {SANJAY.name}
              </Text>
              <Text variant="label-caps" color="text-on-surface-variant">
                {SANJAY.experienceYrs} yrs · MBA in Finance, CFA · Video / phone call
              </Text>
            </View>
            <Icon name="call" size={20} color="#99d4ae" />
          </View>
        </Card>

        {/* Slot picker */}
        <View>
          <Text variant="headline-md" color="text-on-surface" className="mb-stack-sm">
            Choose a time
          </Text>

          {groups.map(({ dateKey, slots }) => (
            <View key={dateKey} className="mb-stack-md">
              <Text
                variant="label-caps"
                color="text-on-surface-variant"
                className="mb-stack-sm"
              >
                {fmtDayShort(slots[0].isoDateTime)}
              </Text>
              <View className="gap-stack-sm">
                {slots.map((slot) => (
                  <SlotCard
                    key={slot.id}
                    slot={slot}
                    selected={selectedSlotId === slot.id}
                    onSelect={() => setSelectedSlotId(slot.id)}
                  />
                ))}
              </View>
            </View>
          ))}
        </View>

        {/* Prep notes */}
        {selectedSlot && (
          <Card>
            <Text variant="label-caps" color="text-on-surface-variant" className="mb-stack-sm">
              What do you want to discuss? (optional)
            </Text>
            <Input
              label="Prep notes for Sanjay"
              placeholder="e.g. Review my home goal, check SIP allocation, debt strategy..."
              value={prepNotes}
              onChangeText={setPrepNotes}
              autoCapitalize="sentences"
              multiline
            />
            <Text variant="label-caps" color="text-on-surface-variant" className="mt-2">
              Sanjay reviews these before the call so your time is well spent.
            </Text>
          </Card>
        )}

        {/* Confirm button */}
        <Button
          label={selectedSlot ? `Confirm — ${fmtDayShort(selectedSlot.isoDateTime)} ${fmtTime(selectedSlot.isoDateTime)}` : 'Select a slot to continue'}
          onPress={handleConfirm}
          disabled={!selectedSlotId}
          fullWidth
          leadingIcon="check_circle"
        />
      </ScreenContainer>
    </View>
  );
}
