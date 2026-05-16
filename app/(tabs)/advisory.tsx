import { View } from 'react-native';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { TopAppBar } from '@/components/layout/TopAppBar';
import { Text } from '@/components/ui/Text';
import { Card } from '@/components/ui/Card';
import { SanjayAvatar } from '@/components/brand/SanjayAvatar';

export default function AdvisoryStub() {
  return (
    <View className="flex-1 bg-background">
      <TopAppBar title="Advisory" />
      <ScreenContainer scroll edges={[]} contentClassName="gap-stack-md">
        <Card>
          <View className="flex-row items-center gap-stack-md mb-stack-md">
            <SanjayAvatar size={56} />
            <View className="flex-1">
              <Text variant="label-caps" color="text-on-surface-variant">
                Your advisor
              </Text>
              <Text variant="headline-md" color="text-on-surface">
                Sanjay Kathuria
              </Text>
              <Text variant="body-md" color="text-on-surface-variant">
                18 yrs · SEBI-registered
              </Text>
            </View>
          </View>
          <Text variant="body-md" color="text-on-surface-variant">
            Sanjay profile + Schedule a call arrives in Step 10.
          </Text>
        </Card>
      </ScreenContainer>
    </View>
  );
}
