import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { router } from 'expo-router';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { TopAppBar } from '@/components/layout/TopAppBar';
import { Text } from '@/components/ui/Text';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Icon, type IconName } from '@/components/ui/Icon';
import { useHelp } from '@/state/HelpContext';
import type { ServiceCategory } from '@/types/help';

const CATEGORIES: { value: ServiceCategory; label: string; icon: IconName; hint: string }[] = [
  { value: 'app-issue', label: 'App issue', icon: 'warning', hint: 'Crashes, blank screens, slow loads' },
  { value: 'scheduling', label: 'Scheduling', icon: 'calendar_today', hint: 'Can’t book or change a call' },
  { value: 'payments', label: 'Payments', icon: 'wallet', hint: 'SIP debit, refund, transaction stuck' },
  { value: 'account', label: 'Account & KYC', icon: 'account_circle', hint: 'Login, profile, document upload' },
  { value: 'other', label: 'Something else', icon: 'info', hint: 'Anything that doesn’t fit above' },
];

// ── Screen ───────────────────────────────────────────────────────────────────

export default function NewServiceTicketScreen() {
  const { createServiceTicket } = useHelp();
  const [category, setCategory] = useState<ServiceCategory>('app-issue');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const canSubmit = subject.trim().length >= 5 && body.trim().length >= 10;

  const handleSubmit = () => {
    if (!canSubmit) return;
    createServiceTicket({ subject, body, category });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <View className="flex-1 bg-background">
        <TopAppBar title="Ticket raised" onBackPress={() => router.back()} rightIcon={null} />
        <ScreenContainer edges={[]} contentClassName="items-center justify-center gap-stack-lg px-6">
          <View className="items-center gap-stack-md">
            <View className="w-20 h-20 rounded-full bg-secondary-container/30 items-center justify-center">
              <Icon name="check_circle" size={40} color="#99d4ae" />
            </View>
            <Text variant="headline-lg" color="text-on-surface" className="text-center">
              Thanks — we’re on it
            </Text>
            <Text variant="body-md" color="text-on-surface-variant" className="text-center">
              Our support team will look into this and update the ticket. You’ll find it under{' '}
              “Your tickets” on the help home.
            </Text>
          </View>

          <Card variant="high">
            <Text variant="body-md" color="text-on-surface-variant" className="text-center">
              Most service tickets are resolved within{' '}
              <Text variant="body-md" color="text-on-surface" className="font-manrope-semibold">
                1–2 business days
              </Text>
              . We’ll email you when there’s an update.
            </Text>
          </Card>

          <View className="w-full gap-stack-sm">
            <Button
              label="Back to Help & Support"
              onPress={() => router.replace('/help')}
              fullWidth
              leadingIcon="arrow_back"
            />
          </View>
        </ScreenContainer>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <TopAppBar title="Report an issue" onBackPress={() => router.back()} rightIcon={null} />
      <ScreenContainer scroll edges={[]} contentClassName="gap-stack-md pb-stack-lg">

        {/* Category picker */}
        <View>
          <Text variant="headline-md" color="text-on-surface" className="mb-stack-sm">
            What’s the issue about?
          </Text>
          <View className="gap-stack-sm">
            {CATEGORIES.map((c) => {
              const selected = c.value === category;
              return (
                <Pressable
                  key={c.value}
                  onPress={() => setCategory(c.value)}
                  accessibilityRole="radio"
                  accessibilityState={{ selected }}
                  style={({ pressed }) => (pressed ? { opacity: 0.7 } : undefined)}
                >
                  <View
                    className={`flex-row items-center gap-stack-sm rounded-xl border p-3 ${
                      selected
                        ? 'bg-secondary-container/15 border-secondary'
                        : 'bg-surface-container-low border-outline-variant/20'
                    }`}
                  >
                    <View
                      className={`w-10 h-10 rounded-xl items-center justify-center ${
                        selected ? 'bg-secondary-container/30' : 'bg-surface-container-high'
                      }`}
                    >
                      <Icon name={c.icon} size={20} color={selected ? '#99d4ae' : '#bec6e0'} />
                    </View>
                    <View className="flex-1">
                      <Text
                        variant="body-md"
                        color={selected ? 'text-secondary' : 'text-on-surface'}
                        className="font-manrope-semibold"
                      >
                        {c.label}
                      </Text>
                      <Text variant="label-caps" color="text-on-surface-variant">
                        {c.hint}
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
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Subject + body */}
        <Card>
          <View className="gap-stack-md">
            <Input
              label="Subject"
              placeholder="Short summary of the issue"
              value={subject}
              onChangeText={setSubject}
              autoCapitalize="sentences"
              maxLength={120}
              helper={`${subject.length}/120`}
            />
            <Input
              label="What happened?"
              placeholder="Describe the steps you took, what you expected, and what went wrong. Screenshots help — you can mention them here too."
              value={body}
              onChangeText={setBody}
              autoCapitalize="sentences"
              multiline
              numberOfLines={5}
              style={{ minHeight: 100, textAlignVertical: 'top' }}
              helper="Min. 10 characters"
            />
          </View>
        </Card>

        <Button
          label={canSubmit ? 'Raise ticket' : 'Add a subject and description'}
          onPress={handleSubmit}
          disabled={!canSubmit}
          fullWidth
          leadingIcon="check_circle"
        />
      </ScreenContainer>
    </View>
  );
}
