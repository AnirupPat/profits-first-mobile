import { Pressable, View } from 'react-native';
import { Text } from '@/components/ui/Text';
import { Icon } from '@/components/ui/Icon';
import type { EntitySnapshot } from '@/types/compare';

export type EntityHeaderChipProps = {
  snapshot: EntitySnapshot | null;
  accentColor: string;
  side: 'left' | 'right';
  onPress: () => void;
};

export function EntityHeaderChip({ snapshot, accentColor, side, onPress }: EntityHeaderChipProps) {
  if (!snapshot) {
    return (
      <Pressable
        onPress={onPress}
        className="flex-1 rounded-xl bg-surface-container-low border border-outline-variant/30 px-3 py-3 items-center justify-center"
        accessibilityRole="button"
        accessibilityLabel={side === 'left' ? 'Pick left entity' : 'Pick right entity'}
      >
        <View className="flex-row items-center gap-1.5">
          <Icon name="plus" size={16} color="#bec6e0" />
          <Text variant="label-caps" color="text-on-surface-variant">
            {side === 'left' ? 'Pick fund' : 'Pick fund or index'}
          </Text>
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable onPress={onPress} className="flex-1" accessibilityRole="button">
      <View className="rounded-xl bg-surface-container-high border border-outline-variant/30 px-3 py-3">
        <View className="flex-row items-center gap-1.5 mb-1">
          <View
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: accentColor }}
          />
          <Text variant="label-caps" color="text-on-surface-variant" numberOfLines={1}>
            {snapshot.category}
          </Text>
        </View>
        <Text
          variant="body-md"
          color="text-on-surface"
          className="font-manrope-semibold"
          numberOfLines={2}
        >
          {snapshot.name}
        </Text>
        <Text variant="label-caps" color="text-on-surface-variant" className="mt-1">
          {snapshot.isFund ? `NAV ₹${snapshot.navOrLevel.toFixed(2)}` : `Level ${snapshot.navOrLevel.toFixed(0)}`}
        </Text>
      </View>
    </Pressable>
  );
}
