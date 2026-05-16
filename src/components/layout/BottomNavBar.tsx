import { Pressable, View } from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Text } from '@/components/ui/Text';
import { Icon, type IconName } from '@/components/ui/Icon';

type TabMeta = { label: string; icon: IconName };

const TAB_META: Record<string, TabMeta> = {
  home: { label: 'Home', icon: 'home' },
  portfolio: { label: 'Portfolio', icon: 'wallet' },
  community: { label: 'Community', icon: 'account-group' },
  advisory: { label: 'Advisory', icon: 'headset' },
};

const TAB_ORDER = ['home', 'portfolio', 'community', 'advisory'] as const;

export function BottomNavBar({ state, navigation, insets }: BottomTabBarProps) {
  return (
    <View
      className="flex-row justify-around items-center px-4 pt-3 border-t border-outline-variant/20 bg-surface-container/95"
      style={{ paddingBottom: Math.max(insets.bottom, 12) }}
    >
      {TAB_ORDER.map((name) => {
        const route = state.routes.find((r) => r.name === name);
        if (!route) return null;
        const meta = TAB_META[name];
        const active = state.routes[state.index]?.name === name;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!active && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            accessibilityLabel={meta.label}
            className={
              active
                ? 'flex-col items-center justify-center bg-secondary-container/30 rounded-xl px-4 py-1.5'
                : 'flex-col items-center justify-center px-4 py-1.5'
            }
            style={({ pressed }) => ({ transform: [{ scale: pressed ? 0.92 : 1 }] })}
          >
            <Icon name={meta.icon} size={22} color={active ? '#99d4ae' : '#c6c6cd'} />
            <Text
              variant="label-caps"
              className={active ? 'text-secondary mt-1' : 'text-on-surface-variant mt-1'}
            >
              {meta.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
