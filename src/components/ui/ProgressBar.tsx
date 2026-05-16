import { View } from 'react-native';

const cx = (...p: Array<string | undefined | false>) => p.filter(Boolean).join(' ');

export type ProgressBarProps = {
  value: number;
  max?: number;
  tone?: 'primary' | 'secondary' | 'tertiary' | 'error';
  height?: 'sm' | 'md';
  className?: string;
};

const TONE: Record<NonNullable<ProgressBarProps['tone']>, string> = {
  primary: 'bg-primary',
  secondary: 'bg-secondary',
  tertiary: 'bg-tertiary',
  error: 'bg-error',
};

export function ProgressBar({ value, max = 100, tone = 'primary', height = 'sm', className }: ProgressBarProps) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const heightClass = height === 'sm' ? 'h-2' : 'h-3';
  return (
    <View className={cx('w-full bg-surface-variant rounded-full overflow-hidden', heightClass, className)}>
      <View
        className={cx('h-full rounded-full', TONE[tone])}
        style={{ width: `${pct}%` }}
      />
    </View>
  );
}
