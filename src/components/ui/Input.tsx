import { useState } from 'react';
import { TextInput, View, type TextInputProps } from 'react-native';
import { Text } from './Text';

const cx = (...p: Array<string | undefined | false>) => p.filter(Boolean).join(' ');

export type InputProps = TextInputProps & {
  label?: string;
  helper?: string;
  error?: string;
  containerClassName?: string;
};

export function Input({
  label,
  helper,
  error,
  containerClassName,
  onFocus,
  onBlur,
  style,
  ...rest
}: InputProps) {
  const [focused, setFocused] = useState(false);
  const borderColor = error
    ? 'border-error'
    : focused
      ? 'border-primary'
      : 'border-outline-variant/50';

  return (
    <View className={cx('gap-1.5', containerClassName)}>
      {label ? (
        <Text variant="label-caps" color="text-on-surface-variant">
          {label}
        </Text>
      ) : null}
      <TextInput
        className={cx(
          'bg-surface-container-low rounded-lg px-4 py-3.5 text-on-surface',
          'text-[16px] leading-[24px] font-manrope-regular',
          'border',
          borderColor,
        )}
        style={style}
        placeholderTextColor="#737686"
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        {...rest}
      />
      {error ? (
        <Text variant="label-caps" color="text-error">
          {error}
        </Text>
      ) : helper ? (
        <Text variant="label-caps" color="text-on-surface-variant">
          {helper}
        </Text>
      ) : null}
    </View>
  );
}
