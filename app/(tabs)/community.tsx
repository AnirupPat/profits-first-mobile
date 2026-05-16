import { View } from 'react-native';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { TopAppBar } from '@/components/layout/TopAppBar';
import { Text } from '@/components/ui/Text';
import { Card } from '@/components/ui/Card';

export default function CommunityStub() {
  return (
    <View className="flex-1 bg-background">
      <TopAppBar title="Community" />
      <ScreenContainer scroll edges={[]} contentClassName="gap-stack-md">
        <Card>
          <Text variant="headline-md" color="text-primary" className="mb-2">
            Community
          </Text>
          <Text variant="body-md" color="text-on-surface-variant">
            Read-only investor feed arrives in Step 8.
          </Text>
        </Card>
      </ScreenContainer>
    </View>
  );
}
