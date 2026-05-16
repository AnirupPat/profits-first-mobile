import { View, type ViewProps } from 'react-native';

const cx = (...p: Array<string | undefined | false>) => p.filter(Boolean).join(' ');

export type CardVariant = 'default' | 'low' | 'high' | 'outline';

export type CardProps = ViewProps & {
  variant?: CardVariant;
  className?: string;
};

const VARIANT: Record<CardVariant, string> = {
  default: 'bg-surface-container border border-outline-variant/30',
  low: 'bg-surface-container-low border border-outline-variant/20',
  high: 'bg-surface-container-high border border-outline-variant/40',
  outline: 'bg-transparent border border-outline-variant/50',
};

export function Card({ variant = 'default', className, children, ...rest }: CardProps) {
  return (
    <View className={cx('rounded-xl p-card-padding', VARIANT[variant], className)} {...rest}>
      {children}
    </View>
  );
}
