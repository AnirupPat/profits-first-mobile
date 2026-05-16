import { Text as RNText, type TextProps as RNTextProps } from 'react-native';
import { variantClasses, type TextVariant } from '@/theme/typography';

export type TextProps = RNTextProps & {
  variant?: TextVariant;
  className?: string;
  color?: string;
};

const cx = (...parts: Array<string | undefined | false>) => parts.filter(Boolean).join(' ');

export function Text({ variant = 'body-md', className, color, style, children, ...rest }: TextProps) {
  const colorClass = color ?? 'text-on-surface';
  return (
    <RNText className={cx(variantClasses[variant], colorClass, className)} style={style} {...rest}>
      {children}
    </RNText>
  );
}
