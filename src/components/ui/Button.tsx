import { Pressable, View, type PressableProps } from 'react-native';
import { Text } from './Text';
import { Icon, type IconName } from './Icon';

const cx = (...p: Array<string | undefined | false>) => p.filter(Boolean).join(' ');

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export type ButtonProps = Omit<PressableProps, 'children'> & {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  leadingIcon?: IconName;
  trailingIcon?: IconName;
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
};

const CONTAINER: Record<ButtonVariant, string> = {
  primary: 'bg-secondary',
  secondary: 'bg-primary-container',
  outline: 'bg-transparent border border-outline-variant',
  ghost: 'bg-transparent',
};

const TEXT_COLOR: Record<ButtonVariant, string> = {
  primary: 'text-on-secondary',
  secondary: 'text-on-primary-container',
  outline: 'text-on-surface',
  ghost: 'text-primary',
};

const SIZE_PAD: Record<ButtonSize, string> = {
  sm: 'px-4 py-2',
  md: 'px-6 py-3',
  lg: 'px-7 py-4',
};

const ICON_COLOR: Record<ButtonVariant, string> = {
  primary: '#003921',
  secondary: '#eeefff',
  outline: '#e4e2e4',
  ghost: '#bec6e0',
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  leadingIcon,
  trailingIcon,
  disabled,
  fullWidth,
  className,
  ...rest
}: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => ({
        transform: [{ scale: pressed ? 0.97 : 1 }],
        opacity: disabled ? 0.4 : 1,
      })}
      className={cx(
        'rounded-lg flex-row items-center justify-center gap-2',
        CONTAINER[variant],
        SIZE_PAD[size],
        fullWidth && 'w-full',
        className,
      )}
      {...rest}
    >
      {leadingIcon ? (
        <View>
          <Icon name={leadingIcon} size={size === 'sm' ? 16 : 18} color={ICON_COLOR[variant]} />
        </View>
      ) : null}
      <Text variant="body-md" className={cx('font-manrope-semibold', TEXT_COLOR[variant])}>
        {label}
      </Text>
      {trailingIcon ? (
        <View>
          <Icon name={trailingIcon} size={size === 'sm' ? 16 : 18} color={ICON_COLOR[variant]} />
        </View>
      ) : null}
    </Pressable>
  );
}
