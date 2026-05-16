import { useState } from 'react';
import { View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { Text } from '@/components/ui/Text';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { DEMO_AUTH } from '@/data/demoProfile';

export default function PhoneScreen() {
  const { inviteCode } = useLocalSearchParams<{ inviteCode: string }>();
  const [phone, setPhone] = useState(DEMO_AUTH.phone);
  const [error, setError] = useState<string | null>(null);

  const onContinue = () => {
    const cleaned = phone.replace(/\D/g, '');
    if (!/^[6-9]\d{9}$/.test(cleaned)) {
      setError('Enter a valid 10-digit Indian mobile number');
      return;
    }
    setError(null);
    router.push({
      pathname: '/(auth)/otp',
      params: { phone: cleaned, inviteCode: inviteCode ?? '' },
    });
  };

  return (
    <ScreenContainer scroll edges={['top', 'bottom']} contentClassName="gap-stack-lg">
      <View className="mt-12 gap-2">
        <View className="w-12 h-12 rounded-full bg-secondary-container/30 items-center justify-center mb-2">
          <Icon name="call" size={22} color="#99d4ae" />
        </View>
        <Text variant="headline-lg" color="text-primary">
          Your mobile number
        </Text>
        <Text variant="body-lg" color="text-on-surface-variant">
          We'll send a one-time code to verify it's you.
        </Text>
      </View>

      <Input
        label="Mobile number"
        placeholder="9999999999"
        keyboardType="number-pad"
        maxLength={10}
        value={phone}
        onChangeText={(v) => {
          setPhone(v.replace(/\D/g, ''));
          if (error) setError(null);
        }}
        error={error ?? undefined}
        helper="Indian numbers only — starts with 6, 7, 8, or 9."
      />

      <View className="mt-stack-md">
        <Button label="Send code" onPress={onContinue} fullWidth trailingIcon="arrow_forward" />
      </View>
    </ScreenContainer>
  );
}
