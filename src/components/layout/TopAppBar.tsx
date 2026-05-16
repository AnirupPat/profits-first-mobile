import { Pressable, View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/Text';
import { Icon, type IconName } from '@/components/ui/Icon';

export type TopAppBarProps = {
  title: string;
  avatarUrl?: string;
  rightIcon?: IconName | null;
  onRightPress?: () => void;
  onAvatarPress?: () => void;
  onBackPress?: () => void;
};

export function TopAppBar({
  title,
  avatarUrl,
  rightIcon,
  onRightPress,
  onAvatarPress,
  onBackPress,
}: TopAppBarProps) {
  const resolvedRightIcon: IconName | null =
    rightIcon === undefined ? 'bell' : rightIcon;

  return (
    <SafeAreaView
      edges={['top']}
      className="bg-surface/95 border-b border-outline-variant/20"
    >
      <View className="flex-row items-center justify-between px-container-margin h-16">
        <Pressable
          onPress={onBackPress ?? onAvatarPress}
          className="flex-row items-center gap-3 flex-1 mr-3"
        >
          <View className="w-10 h-10 rounded-full bg-surface-container-high overflow-hidden border border-outline-variant/30 items-center justify-center">
            {onBackPress ? (
              <Icon name="arrow_back" size={20} color="#bec6e0" />
            ) : avatarUrl ? (
              <Image source={{ uri: avatarUrl }} className="w-full h-full" resizeMode="cover" />
            ) : (
              <Icon name="account-circle" size={28} color="#909097" />
            )}
          </View>
          <Text
            variant="headline-md"
            className="text-primary tracking-tight flex-1"
            numberOfLines={1}
          >
            {title}
          </Text>
        </Pressable>
        {resolvedRightIcon ? (
          <Pressable
            onPress={onRightPress}
            className="w-10 h-10 items-center justify-center rounded-full"
            style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
          >
            <Icon name={resolvedRightIcon} size={24} color="#bec6e0" />
          </Pressable>
        ) : null}
      </View>
    </SafeAreaView>
  );
}
