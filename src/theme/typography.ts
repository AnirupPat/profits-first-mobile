export type TextVariant =
  | 'headline-lg'
  | 'headline-md'
  | 'currency-display'
  | 'body-lg'
  | 'body-md'
  | 'label-caps';

export const variantClasses: Record<TextVariant, string> = {
  'headline-lg': 'text-[32px] leading-[40px] tracking-[-0.02em] font-manrope-bold',
  'headline-md': 'text-[24px] leading-[32px] font-manrope-semibold',
  'currency-display': 'text-[28px] leading-[36px] tracking-[-0.01em] font-manrope-semibold',
  'body-lg': 'text-[18px] leading-[28px] font-manrope-regular',
  'body-md': 'text-[16px] leading-[24px] font-manrope-regular',
  'label-caps': 'text-[12px] leading-[16px] tracking-[0.05em] font-manrope-bold uppercase',
};
