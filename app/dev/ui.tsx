import { View } from 'react-native';
import { Text } from '@/components/ui/Text';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Icon } from '@/components/ui/Icon';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { TopAppBar } from '@/components/layout/TopAppBar';

export default function UiDemo() {
  return (
    <View className="flex-1 bg-background">
      <TopAppBar title="UI Demo" />
      <ScreenContainer scroll edges={[]} contentClassName="gap-6">
        <View>
          <Text variant="label-caps" color="text-on-surface-variant">
            Typography
          </Text>
          <View className="gap-1 mt-2">
            <Text variant="headline-lg" color="text-primary">
              Headline LG
            </Text>
            <Text variant="headline-md">Headline MD</Text>
            <Text variant="currency-display" color="text-secondary">
              ₹12,45,000
            </Text>
            <Text variant="body-lg">Body large 18px</Text>
            <Text variant="body-md" color="text-on-surface-variant">
              Body medium 16px, on-surface-variant
            </Text>
            <Text variant="label-caps" color="text-tertiary">
              Label caps
            </Text>
          </View>
        </View>

        <View>
          <Text variant="label-caps" color="text-on-surface-variant">
            Buttons
          </Text>
          <View className="gap-3 mt-2">
            <Button label="Primary action" onPress={() => {}} leadingIcon="flight_takeoff" />
            <Button label="Secondary" variant="secondary" onPress={() => {}} />
            <Button label="Outline" variant="outline" onPress={() => {}} />
            <Button label="Ghost" variant="ghost" onPress={() => {}} trailingIcon="arrow_forward" />
            <Button label="Disabled" disabled onPress={() => {}} />
          </View>
        </View>

        <View>
          <Text variant="label-caps" color="text-on-surface-variant">
            Chips
          </Text>
          <View className="flex-row flex-wrap gap-2 mt-2">
            <Chip label="Default" />
            <Chip label="Strong" tone="success" leadingIcon="check_circle" />
            <Chip label="Watch" tone="warning" />
            <Chip label="Risk" tone="danger" />
            <Chip label="Info" tone="info" />
          </View>
        </View>

        <View>
          <Text variant="label-caps" color="text-on-surface-variant">
            Progress
          </Text>
          <View className="gap-3 mt-2">
            <ProgressBar value={28} tone="secondary" />
            <ProgressBar value={62} tone="primary" />
            <ProgressBar value={88} tone="tertiary" />
          </View>
        </View>

        <View>
          <Text variant="label-caps" color="text-on-surface-variant">
            Card variants
          </Text>
          <View className="gap-3 mt-2">
            <Card>
              <Text variant="body-md">Default card</Text>
            </Card>
            <Card variant="low">
              <Text variant="body-md">Low elevation</Text>
            </Card>
            <Card variant="high">
              <Text variant="body-md">High elevation</Text>
            </Card>
            <Card variant="outline">
              <Text variant="body-md">Outline only</Text>
            </Card>
          </View>
        </View>

        <View>
          <Text variant="label-caps" color="text-on-surface-variant">
            Icons sample
          </Text>
          <View className="flex-row flex-wrap gap-3 mt-2">
            {(
              ['home', 'wallet', 'groups', 'support_agent', 'flight_takeoff', 'check_circle', 'goal'] as const
            ).map((n) => (
              <View key={n} className="w-10 h-10 items-center justify-center bg-surface-container rounded-lg">
                <Icon name={n} size={22} color="#bec6e0" />
              </View>
            ))}
          </View>
        </View>
      </ScreenContainer>
    </View>
  );
}
