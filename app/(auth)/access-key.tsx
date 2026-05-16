import { useState } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { Text } from '@/components/ui/Text';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { PFLogo } from '@/components/brand/PFLogo';
import { isValidInvite } from '@/data/inviteCodes';
import { DEMO_AUTH } from '@/data/demoProfile';

export default function AccessKeyScreen() {
  const [code, setCode] = useState(DEMO_AUTH.inviteCode);
  const [error, setError] = useState<string | null>(null);

  const onContinue = () => {
    if (!code.trim()) {
      setError('Please enter your invite code');
      return;
    }
    if (!isValidInvite(code)) {
      setError('Invite code not recognised. Try PROFITS-DEMO.');
      return;
    }
    setError(null);
    router.push({
      pathname: '/(auth)/phone',
      params: { inviteCode: code.trim().toUpperCase() },
    });
  };

  return (
    <ScreenContainer scroll edges={['top', 'bottom']} contentClassName="gap-stack-lg">
      <View className="mt-12 gap-3">
        <PFLogo size={64} />
        <Text variant="headline-lg" color="text-primary">
          Welcome to Profits First
        </Text>
        <Text variant="body-lg" color="text-on-surface-variant">
          Enter the invite code shared by Sanjay Kathuria to get started.
        </Text>
      </View>

      <View className="gap-stack-md">
        <Input
          label="Invite code"
          placeholder="PROFITS-XXXX"
          value={code}
          onChangeText={(v) => {
            setCode(v);
            if (error) setError(null);
          }}
          autoCapitalize="characters"
          autoCorrect={false}
          autoComplete="off"
          error={error ?? undefined}
        />
        <Text variant="label-caps" color="text-on-surface-variant">
          Try PROFITS-DEMO for testing.
        </Text>
      </View>

      <View className="mt-stack-md">
        <Button label="Continue" onPress={onContinue} fullWidth trailingIcon="arrow_forward" />
      </View>
    </ScreenContainer>
  );
}
