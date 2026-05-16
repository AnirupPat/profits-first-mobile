import { Pressable, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { TopAppBar } from '@/components/layout/TopAppBar';
import { Text } from '@/components/ui/Text';
import { Card } from '@/components/ui/Card';
import { Chip, type ChipTone } from '@/components/ui/Chip';
import { Icon } from '@/components/ui/Icon';
import { SanjayAvatar } from '@/components/brand/SanjayAvatar';
import { useHelp } from '@/state/HelpContext';
import type {
  CallbackPreference,
  ServiceCategory,
  TicketStatus,
  Urgency,
} from '@/types/help';

function fmtFull(iso: string) {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(iso));
}

const STATUS_LABEL: Record<TicketStatus, string> = {
  open: 'Open',
  'in-review': 'In review',
  'callback-scheduled': 'Callback scheduled',
  resolved: 'Resolved',
  closed: 'Closed',
};

const STATUS_TONE: Record<TicketStatus, ChipTone> = {
  open: 'info',
  'in-review': 'warning',
  'callback-scheduled': 'success',
  resolved: 'success',
  closed: 'default',
};

const URGENCY_LABEL: Record<Urgency, string> = {
  normal: 'Normal',
  urgent: 'Urgent',
};

const CALLBACK_LABEL: Record<CallbackPreference, string> = {
  morning: 'Morning (9 AM – 12 PM)',
  afternoon: 'Afternoon (12 PM – 4 PM)',
  evening: 'Evening (4 PM – 8 PM)',
  any: 'Any time',
};

const CATEGORY_LABEL: Record<ServiceCategory, string> = {
  'app-issue': 'App issue',
  scheduling: 'Scheduling',
  payments: 'Payments',
  account: 'Account & KYC',
  other: 'Something else',
};

// ── Screen ───────────────────────────────────────────────────────────────────

export default function TicketDetailScreen() {
  const { ticketId } = useLocalSearchParams<{ ticketId: string }>();
  const { findTicket, closeTicket } = useHelp();
  const ticket = ticketId ? findTicket(ticketId) : undefined;

  if (!ticket) {
    return (
      <View className="flex-1 bg-background">
        <TopAppBar title="Ticket" onBackPress={() => router.back()} rightIcon={null} />
        <ScreenContainer edges={[]} contentClassName="items-center justify-center px-6">
          <View className="items-center gap-stack-md">
            <Icon name="error" size={32} color="#ffb4ab" />
            <Text variant="headline-md" color="text-on-surface" className="text-center">
              Ticket not found
            </Text>
            <Text variant="body-md" color="text-on-surface-variant" className="text-center">
              It may have been closed or doesn’t belong to your account.
            </Text>
          </View>
        </ScreenContainer>
      </View>
    );
  }

  const isAdvisor = ticket.kind === 'advisor';
  const canClose = ticket.status !== 'closed';

  return (
    <View className="flex-1 bg-background">
      <TopAppBar
        title={isAdvisor ? 'Advisor query' : 'Service request'}
        onBackPress={() => router.back()}
        rightIcon={null}
      />
      <ScreenContainer scroll edges={[]} contentClassName="gap-stack-md pb-stack-lg">

        {/* Header */}
        <Card variant="high">
          <View className="flex-row items-start gap-stack-md mb-stack-sm">
            {isAdvisor ? (
              <SanjayAvatar size={40} rounded="circle" />
            ) : (
              <View className="w-10 h-10 rounded-xl bg-surface-container-high items-center justify-center">
                <Icon name="settings" size={20} color="#bec6e0" />
              </View>
            )}
            <View className="flex-1">
              <Text variant="label-caps" color="text-on-surface-variant">
                Ticket {ticket.id} · Raised {fmtFull(ticket.createdAt)}
              </Text>
              <Text variant="headline-md" color="text-on-surface" className="mt-0.5">
                {ticket.subject}
              </Text>
            </View>
          </View>

          <View className="flex-row flex-wrap gap-2">
            <Chip label={STATUS_LABEL[ticket.status]} tone={STATUS_TONE[ticket.status]} />
            {ticket.urgency ? (
              <Chip
                label={URGENCY_LABEL[ticket.urgency]}
                tone={ticket.urgency === 'urgent' ? 'danger' : 'default'}
              />
            ) : null}
            {ticket.category ? <Chip label={CATEGORY_LABEL[ticket.category]} tone="info" /> : null}
          </View>
        </Card>

        {/* Body */}
        <Card>
          <Text variant="label-caps" color="text-on-surface-variant" className="mb-stack-sm">
            Your message
          </Text>
          <Text variant="body-md" color="text-on-surface">
            {ticket.body}
          </Text>

          {ticket.callbackPreference ? (
            <View className="mt-stack-md pt-stack-md border-t border-outline-variant/20">
              <Text variant="label-caps" color="text-on-surface-variant" className="mb-1">
                Preferred callback time
              </Text>
              <Text variant="body-md" color="text-on-surface">
                {CALLBACK_LABEL[ticket.callbackPreference]}
              </Text>
            </View>
          ) : null}
        </Card>

        {/* Reply (if any) */}
        {ticket.reply ? (
          <Card variant="outline">
            <View className="flex-row items-center gap-2 mb-stack-sm">
              {isAdvisor ? (
                <SanjayAvatar size={28} rounded="circle" />
              ) : (
                <View className="w-7 h-7 rounded-full bg-surface-container-high items-center justify-center">
                  <Icon name="support_agent" size={16} color="#bec6e0" />
                </View>
              )}
              <Text variant="label-caps" color="text-on-surface-variant" className="flex-1">
                {ticket.reply.author} · {fmtFull(ticket.reply.date)}
              </Text>
            </View>
            <Text variant="body-md" color="text-on-surface">
              {ticket.reply.body}
            </Text>
          </Card>
        ) : (
          <Card>
            <View className="flex-row items-center gap-3">
              <View className="w-10 h-10 rounded-full bg-surface-container-high items-center justify-center">
                <Icon name="schedule" size={20} color="#bec6e0" />
              </View>
              <View className="flex-1">
                <Text variant="body-md" color="text-on-surface" className="font-manrope-semibold">
                  Awaiting response
                </Text>
                <Text variant="body-md" color="text-on-surface-variant">
                  {isAdvisor
                    ? 'Sanjay’s team will review and reach out with a callback.'
                    : 'Our support team will respond shortly.'}
                </Text>
              </View>
            </View>
          </Card>
        )}

        {/* Close action */}
        {canClose ? (
          <Pressable
            onPress={() => {
              closeTicket(ticket.id);
              router.back();
            }}
            style={({ pressed }) => (pressed ? { opacity: 0.7 } : undefined)}
            className="flex-row items-center justify-center gap-2 py-3 rounded-lg border border-outline-variant/40"
          >
            <Icon name="close" size={16} color="#909097" />
            <Text variant="label-caps" color="text-on-surface-variant">
              Close ticket
            </Text>
          </Pressable>
        ) : null}

      </ScreenContainer>
    </View>
  );
}
