import { useState } from 'react';
import { TextInput, View } from 'react-native';
import { Text } from './Text';

const cx = (...p: Array<string | undefined | false>) => p.filter(Boolean).join(' ');

export type CurrencyInputProps = {
  label?: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  helper?: string;
  error?: string;
};

export function CurrencyInput({
  label,
  value,
  onChangeText,
  placeholder = '0',
  helper,
  error,
}: CurrencyInputProps) {
  const [focused, setFocused] = useState(false);
  const borderColor = error
    ? 'border-error'
    : focused
      ? 'border-primary'
      : 'border-outline-variant/50';

  return (
    <View className="gap-1.5">
      {label ? (
        <Text variant="label-caps" color="text-on-surface-variant">
          {label}
        </Text>
      ) : null}
      <View
        className={cx(
          'flex-row items-center bg-surface-container-low rounded-lg border px-4',
          borderColor,
        )}
      >
        <Text variant="body-lg" color="text-on-surface-variant">
          ₹
        </Text>
        <TextInput
          value={value}
          onChangeText={(v) => onChangeText(v.replace(/[^\d]/g, ''))}
          placeholder={placeholder}
          placeholderTextColor="#737686"
          keyboardType="number-pad"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="flex-1 text-on-surface text-[16px] leading-[24px] font-manrope-regular px-2 py-3.5"
        />
      </View>
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
