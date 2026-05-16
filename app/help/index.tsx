import { Pressable, View } from 'react-native';
import { router } from 'expo-router';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { TopAppBar } from '@/components/layout/TopAppBar';
import { Text } from '@/components/ui/Text';
import { Card } from '@/components/ui/Card';
import { Chip, type ChipTone } from '@/components/ui/Chip';
import { Icon, type IconName } from '@/components/ui/Icon';
import { SanjayAvatar } from '@/components/brand/SanjayAvatar';
import { useHelp } from '@/state/HelpContext';
import type { Ticket, TicketStatus } from '@/types/help';

// ── Helpers ──────────────────────────────────────────────────────────────────

function fmtRelative(iso: string): string {
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diffMs = now - then;
  const diffMin = Math.round(diffMs / 60000);

  if (diffMin < 1) return 'just now';
  if (diffMin < 60) return `${diffMin} min ago`;
  const diffHr = Math.round(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDays = Math.round(diffHr / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short' }).format(new Date(iso));
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

// ── Action card (Sanjay callback / Service request) ──────────────────────────

function ActionCard({
  title,
  description,
  icon,
  iconSlot,
  onPress,
  testID,
}: {
  title: string;
  description: string;
  icon?: IconName;
  iconSlot?: React.ReactNode;
  onPress: () => void;
  testID?: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      testID={testID}
      style={({ pressed }) => (pressed ? { opacity: 0.7 } : undefined)}
    >
      <Card>
        <View className="flex-row items-start gap-stack-md">
          {iconSlot ?? (
            <View className="w-12 h-12 rounded-xl bg-secondary-container/30 items-center justify-center">
              {icon ? <Icon name={icon} size={24} color="#99d4ae" /> : null}
            </View>
          )}
          <View className="flex-1">
            <Text variant="body-md" color="text-on-surface" className="font-manrope-semibold mb-1">
              {title}
            </Text>
            <Text variant="body-md" color="text-on-surface-variant">
              {description}
            </Text>
          </View>
          <Icon name="chevron_right" size={20} color="#909097" />
        </View>
      </Card>
    </Pressable>
  );
}

// ── Ticket row ───────────────────────────────────────────────────────────────

function TicketRow({ ticket }: { ticket: Ticket }) {
  const kindIcon: IconName = ticket.kind === 'advisor' ? 'headset' : 'cog';
  return (
    <Pressable
      onPress={() => router.push(`/help/${ticket.id}`)}
      style={({ pressed }) => (pressed ? { opacity: 0.7 } : undefined)}
    >
      <View className="flex-row items-start gap-stack-md py-3 border-b border-outline-variant/15">
        <View className="w-9 h-9 rounded-lg bg-surface-container-high items-center justify-center">
          <Icon name={kindIcon} size={18} color="#bec6e0" />
        </View>
        <View className="flex-1">
          <View className="flex-row items-center gap-2 mb-0.5">
            <Text variant="label-caps" color="text-on-surface-variant">
              {ticket.kind === 'advisor' ? 'Advisor query' : 'Service request'} ·{' '}
              {fmtRelative(ticket.updatedAt)}
            </Text>
          </View>
          <Text variant="body-md" color="text-on-surface" numberOfLines={1} className="font-manrope-semibold">
            {ticket.subject}
          </Text>
          <View className="mt-1.5 flex-row">
            <Chip label={STATUS_LABEL[ticket.status]} tone={STATUS_TONE[ticket.status]} />
          </View>
        </View>
        <Icon name="chevron_right" size={18} color="#909097" />
      </View>
    </Pressable>
  );
}

// ── Screen ───────────────────────────────────────────────────────────────────

export default function HelpScreen() {
  const { tickets } = useHelp();

  return (
    <View className="flex-1 bg-background">
      <TopAppBar title="Help & Support" onBackPress={() => router.back()} rightIcon={null} />
      <ScreenContainer scroll edges={[]} contentClassName="gap-stack-md pb-stack-lg">

        <View>
          <Text variant="headline-lg" color="text-on-surface">
            How can we help?
          </Text>
          <Text variant="body-md" color="text-on-surface-variant" className="mt-1">
            Reach out to Sanjay’s team for portfolio concerns, or raise a service request for app issues.
          </Text>
        </View>

        {/* Sanjay callback */}
        <ActionCard
          title="Talk to Sanjay’s team"
          description="Write your query — Sanjay or his team will review and call you back."
          iconSlot={<SanjayAvatar size={48} rounded="circle" />}
          onPress={() => router.push('/help/new-advisor')}
          testID="help-action-advisor"
        />

        {/* Service request */}
        <ActionCard
          title="Report an app issue"
          description="App not working, can’t schedule a call, payment problem? Our support team will take a look."
          icon="settings"
          onPress={() => router.push('/help/new-service')}
          testID="help-action-service"
        />

        {/* Tickets */}
        <View>
          <Text variant="headline-md" color="text-on-surface" className="mb-stack-sm">
            Your tickets
          </Text>
          {tickets.length === 0 ? (
            <Card>
              <View className="items-center py-stack-md gap-stack-sm">
                <View className="w-12 h-12 rounded-full bg-surface-container-high items-center justify-center">
                  <Icon name="info" size={20} color="#909097" />
                </View>
                <Text variant="body-md" color="text-on-surface-variant" className="text-center">
                  No tickets yet. Raise a query or report an issue and it will appear here.
                </Text>
              </View>
            </Card>
          ) : (
            <Card>
              {tickets.map((t) => (
                <TicketRow key={t.id} ticket={t} />
              ))}
            </Card>
          )}
        </View>

      </ScreenContainer>
    </View>
  );
}
