import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { router } from 'expo-router';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { TopAppBar } from '@/components/layout/TopAppBar';
import { Text } from '@/components/ui/Text';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Icon } from '@/components/ui/Icon';
import { SanjayAvatar } from '@/components/brand/SanjayAvatar';
import { useHelp } from '@/state/HelpContext';
import { SANJAY } from '@/data/mockAdvisor';
import type { CallbackPreference, Urgency } from '@/types/help';

// ── Choice row used by urgency and callback windows ──────────────────────────

function ChoiceRow<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string; sub?: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <View className="gap-stack-sm">
      {options.map((opt) => {
        const selected = opt.value === value;
        return (
          <Pressable
            key={opt.value}
            onPress={() => onChange(opt.value)}
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
                className={`w-5 h-5 rounded-full border-2 items-center justify-center ${
                  selected ? 'border-secondary bg-secondary' : 'border-outline-variant'
                }`}
              >
                {selected ? <View className="w-2 h-2 rounded-full bg-background" /> : null}
              </View>
              <View className="flex-1">
                <Text
                  variant="body-md"
                  color={selected ? 'text-secondary' : 'text-on-surface'}
                  className="font-manrope-semibold"
                >
                  {opt.label}
                </Text>
                {opt.sub ? (
                  <Text variant="label-caps" color="text-on-surface-variant">
                    {opt.sub}
                  </Text>
                ) : null}
              </View>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

// ── Screen ───────────────────────────────────────────────────────────────────

export default function NewAdvisorTicketScreen() {
  const { createAdvisorTicket } = useHelp();
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [urgency, setUrgency] = useState<Urgency>('normal');
  const [callback, setCallback] = useState<CallbackPreference>('any');
  const [submitted, setSubmitted] = useState(false);

  const canSubmit = subject.trim().length >= 5 && body.trim().length >= 20;

  const handleSubmit = () => {
    if (!canSubmit) return;
    createAdvisorTicket({ subject, body, urgency, callbackPreference: callback });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <View className="flex-1 bg-background">
        <TopAppBar title="Request received" onBackPress={() => router.back()} rightIcon={null} />
        <ScreenContainer edges={[]} contentClassName="items-center justify-center gap-stack-lg px-6">
          <View className="items-center gap-stack-md">
            <View className="w-20 h-20 rounded-full bg-secondary-container/30 items-center justify-center">
              <Icon name="check_circle" size={40} color="#99d4ae" />
            </View>
            <Text variant="headline-lg" color="text-on-surface" className="text-center">
              We’ve got it
            </Text>
            <Text variant="body-md" color="text-on-surface-variant" className="text-center">
              Sanjay’s team will review your query and call you back during your preferred window.
              You’ll see updates under “Your tickets”.
            </Text>
          </View>

          <Card variant="high">
            <Text variant="body-md" color="text-on-surface-variant" className="text-center">
              Typical response time is within{' '}
              <Text variant="body-md" color="text-on-surface" className="font-manrope-semibold">
                {urgency === 'urgent' ? '4 business hours' : '1 business day'}
              </Text>
              .
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
      <TopAppBar title="Talk to Sanjay’s team" onBackPress={() => router.back()} rightIcon={null} />
      <ScreenContainer scroll edges={[]} contentClassName="gap-stack-md pb-stack-lg">

        {/* Header card */}
        <Card variant="high">
          <View className="flex-row items-center gap-stack-md">
            <SanjayAvatar size={48} rounded="circle" />
            <View className="flex-1">
              <Text variant="label-caps" color="text-secondary">
                Reviewed by
              </Text>
              <Text variant="body-md" color="text-on-surface" className="font-manrope-semibold mt-0.5">
                {SANJAY.name} & team
              </Text>
              <Text variant="label-caps" color="text-on-surface-variant">
                MBA in Finance, CFA · Callback within 1 business day
              </Text>
            </View>
          </View>
        </Card>

        {/* Subject + body */}
        <Card>
          <View className="gap-stack-md">
            <Input
              label="What’s on your mind?"
              placeholder="e.g. Should I rebalance my portfolio before retirement?"
              value={subject}
              onChangeText={setSubject}
              autoCapitalize="sentences"
              maxLength={140}
              helper={`${subject.length}/140`}
            />
            <Input
              label="Tell us more"
              placeholder="Share context — your goals, recent changes, market events that worried you, anything specific you want Sanjay to look at..."
              value={body}
              onChangeText={setBody}
              autoCapitalize="sentences"
              multiline
              numberOfLines={6}
              style={{ minHeight: 120, textAlignVertical: 'top' }}
              helper="Min. 20 characters"
            />
          </View>
        </Card>

        {/* Urgency */}
        <View>
          <Text variant="headline-md" color="text-on-surface" className="mb-stack-sm">
            How urgent is this?
          </Text>
          <ChoiceRow<Urgency>
            value={urgency}
            onChange={setUrgency}
            options={[
              { value: 'normal', label: 'Normal', sub: 'Callback within 1 business day' },
              { value: 'urgent', label: 'Urgent', sub: 'Time-sensitive — callback within 4 business hours' },
            ]}
          />
        </View>

        {/* Callback window */}
        <View>
          <Text variant="headline-md" color="text-on-surface" className="mb-stack-sm">
            Preferred callback time
          </Text>
          <ChoiceRow<CallbackPreference>
            value={callback}
            onChange={setCallback}
            options={[
              { value: 'morning', label: 'Morning', sub: '9 AM – 12 PM' },
              { value: 'afternoon', label: 'Afternoon', sub: '12 PM – 4 PM' },
              { value: 'evening', label: 'Evening', sub: '4 PM – 8 PM' },
              { value: 'any', label: 'Any time', sub: 'Whenever the team is free' },
            ]}
          />
        </View>

        <Button
          label={canSubmit ? 'Submit query' : 'Add a subject and a few details'}
          onPress={handleSubmit}
          disabled={!canSubmit}
          fullWidth
          leadingIcon="check_circle"
        />
      </ScreenContainer>
    </View>
  );
}
