import { useState } from 'react';
import { View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { Text } from '@/components/ui/Text';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { useAuth } from '@/state/AuthContext';
import { DEMO_AUTH } from '@/data/demoProfile';

export default function OtpScreen() {
  const { phone, inviteCode } = useLocalSearchParams<{ phone: string; inviteCode: string }>();
  const { signIn } = useAuth();
  const [otp, setOtp] = useState(DEMO_AUTH.otp);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const masked = phone ? `+91 ${phone.slice(0, 5)} ${phone.slice(5)}` : '';

  const onVerify = async () => {
    if (!/^\d{6}$/.test(otp)) {
      setError('Enter the 6-digit code');
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      await signIn({ phone: phone ?? '', inviteCode: inviteCode ?? '' });
      // After sign-in, root gating + (auth) layout will redirect to (tabs)/home.
    } catch {
      setError('Something went wrong. Try again.');
      setSubmitting(false);
    }
  };

  return (
    <ScreenContainer scroll edges={['top', 'bottom']} contentClassName="gap-stack-lg">
      <View className="mt-12 gap-2">
        <View className="w-12 h-12 rounded-full bg-secondary-container/30 items-center justify-center mb-2">
          <Icon name="shield" size={22} color="#99d4ae" />
        </View>
        <Text variant="headline-lg" color="text-primary">
          Verify your number
        </Text>
        <Text variant="body-lg" color="text-on-surface-variant">
          We sent a 6-digit code to {masked}. Any 6 digits will work for this prototype (try 123456).
        </Text>
      </View>

      <Input
        label="Verification code"
        placeholder="• • • • • •"
        keyboardType="number-pad"
        maxLength={6}
        value={otp}
        onChangeText={(v) => {
          setOtp(v.replace(/\D/g, ''));
          if (error) setError(null);
        }}
        error={error ?? undefined}
      />

      <View className="mt-stack-md gap-stack-sm">
        <Button
          label={submitting ? 'Verifying…' : 'Verify & continue'}
          onPress={onVerify}
          disabled={submitting}
          fullWidth
          trailingIcon="arrow_forward"
        />
        <Button label="Change number" variant="ghost" onPress={() => router.back()} fullWidth />
      </View>
    </ScreenContainer>
  );
}
