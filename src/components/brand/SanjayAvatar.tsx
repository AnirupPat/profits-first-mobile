import { View, Text as RNText } from 'react-native';

export type SanjayAvatarProps = {
  size?: number;
  rounded?: 'square' | 'circle';
};

/**
 * Sanjay Kathuria's brand mark — "SK" monogram on a deep navy rounded square.
 * Used as his profile avatar across Advisory flows.
 *
 * To swap for the original artwork later, drop the PNG at
 * `assets/avatar-sanjay.png` and replace usages of <SanjayAvatar />
 * with <Image source={require('../../assets/avatar-sanjay.png')} />.
 */
export function SanjayAvatar({ size = 56, rounded = 'square' }: SanjayAvatarProps) {
  const radius = rounded === 'circle' ? size / 2 : size * 0.18;
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        backgroundColor: '#1e2a44',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <RNText
        style={{
          color: '#aab5d0',
          fontFamily: 'Manrope_700Bold',
          fontSize: Math.round(size * 0.42),
          letterSpacing: -1,
        }}
      >
        SK
      </RNText>
    </View>
  );
}
