import { View } from 'react-native';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { TopAppBar } from '@/components/layout/TopAppBar';
import { Text } from '@/components/ui/Text';
import { Card } from '@/components/ui/Card';

export default function PortfolioStub() {
  return (
    <View className="flex-1 bg-background">
      <TopAppBar title="Portfolio" />
      <ScreenContainer scroll edges={[]} contentClassName="gap-stack-md">
        <Card>
          <Text variant="headline-md" color="text-primary" className="mb-2">
            Portfolio
          </Text>
          <Text variant="body-md" color="text-on-surface-variant">
            Asset allocation donut and holdings list arrive in Step 7.
          </Text>
        </Card>
      </ScreenContainer>
    </View>
  );
}
