import { Pressable, View } from 'react-native';
import { Text } from './Text';
import { Icon, type IconName } from './Icon';

const cx = (...p: Array<string | undefined | false>) => p.filter(Boolean).join(' ');

export type ChipTone = 'default' | 'success' | 'warning' | 'danger' | 'info';

export type ChipProps = {
  label: string;
  tone?: ChipTone;
  selected?: boolean;
  onPress?: () => void;
  leadingIcon?: IconName;
  className?: string;
};

const TONE_BG: Record<ChipTone, string> = {
  default: 'bg-surface-container-high',
  success: 'bg-secondary-container/30',
  warning: 'bg-tertiary-container/30',
  danger: 'bg-error-container/30',
  info: 'bg-primary-container/30',
};

const TONE_TEXT: Record<ChipTone, string> = {
  default: 'text-on-surface-variant',
  success: 'text-secondary',
  warning: 'text-tertiary',
  danger: 'text-error',
  info: 'text-primary',
};

const TONE_BORDER: Record<ChipTone, string> = {
  default: 'border-outline-variant/30',
  success: 'border-secondary/20',
  warning: 'border-tertiary/20',
  danger: 'border-error/20',
  info: 'border-primary/20',
};

export function Chip({ label, tone = 'default', selected, onPress, leadingIcon, className }: ChipProps) {
  const Wrapper = onPress ? Pressable : View;
  return (
    <Wrapper
      onPress={onPress}
      className={cx(
        'flex-row items-center gap-1.5 px-3 py-1 rounded-full border',
        TONE_BG[tone],
        TONE_BORDER[tone],
        selected && 'border-secondary',
        className,
      )}
    >
      {leadingIcon ? <Icon name={leadingIcon} size={14} color="#99d4ae" /> : null}
      <Text variant="label-caps" className={TONE_TEXT[tone]}>
        {label}
      </Text>
    </Wrapper>
  );
}
