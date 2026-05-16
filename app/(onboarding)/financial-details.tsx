import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { Icon, type IconName } from '@/components/ui/Icon';
import { CurrencyInput } from '@/components/ui/CurrencyInput';
import { OnboardingHeader } from '@/features/onboarding/OnboardingHeader';
import { useOnboarding } from '@/state/OnboardingContext';
import type { FinancialSection } from '@/types/onboarding';

type FormShape = {
  assets: {
    cash: string;
    equity: string;
    mf: string;
    realEstate: string;
    gold: string;
    epf: string;
  };
  liabilities: {
    homeLoan: string;
    carLoan: string;
    personalLoan: string;
    creditCard: string;
  };
  insurance: { lifeCover: string; healthCover: string; hasTermPlan: boolean };
  monthlyIncome: string;
  monthlyExpense: string;
};

const ASSET_FIELDS: { name: keyof FormShape['assets']; label: string; helper?: string }[] = [
  { name: 'cash', label: 'Cash & savings', helper: 'Bank balances + FDs.' },
  { name: 'equity', label: 'Direct equity' },
  { name: 'mf', label: 'Mutual funds' },
  { name: 'realEstate', label: 'Real estate' },
  { name: 'gold', label: 'Gold & jewellery' },
  { name: 'epf', label: 'EPF / PPF / NPS' },
];

const LIABILITY_FIELDS: { name: keyof FormShape['liabilities']; label: string }[] = [
  { name: 'homeLoan', label: 'Home loan' },
  { name: 'carLoan', label: 'Car loan' },
  { name: 'personalLoan', label: 'Personal loan' },
  { name: 'creditCard', label: 'Credit card dues' },
];

type SectionId = 'assets' | 'liabilities' | 'insurance' | 'cashflow';

type SectionShellProps = {
  id: SectionId;
  icon: IconName;
  title: string;
  subtitle?: string;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
};

function SectionShell({ icon, title, subtitle, expanded, onToggle, children }: SectionShellProps) {
  return (
    <View className="bg-surface-container/80 rounded-xl border border-outline-variant/20 overflow-hidden">
      <Pressable
        onPress={onToggle}
        className="flex-row items-center gap-stack-md p-card-padding"
      >
        <View className="w-10 h-10 rounded-lg bg-surface-container-high items-center justify-center">
          <Icon name={icon} size={20} color="#bec6e0" />
        </View>
        <View className="flex-1">
          <Text variant="headline-md" color="text-on-surface">
            {title}
          </Text>
          {subtitle ? (
            <Text variant="label-caps" color="text-on-surface-variant" className="mt-1">
              {subtitle}
            </Text>
          ) : null}
        </View>
        <Icon name={expanded ? 'expand_less' : 'expand_more'} size={20} color="#c6c6cd" />
      </Pressable>
      {expanded ? (
        <View className="px-card-padding pb-card-padding gap-stack-md">{children}</View>
      ) : null}
    </View>
  );
}

const toStr = (n: number | undefined) => (n == null ? '' : String(n));
const toNum = (s: string) => (s.length === 0 ? 0 : Number(s));

function seedFrom(prev?: FinancialSection): FormShape {
  return {
    assets: {
      cash: toStr(prev?.assets.cash),
      equity: toStr(prev?.assets.equity),
      mf: toStr(prev?.assets.mf),
      realEstate: toStr(prev?.assets.realEstate),
      gold: toStr(prev?.assets.gold),
      epf: toStr(prev?.assets.epf),
    },
    liabilities: {
      homeLoan: toStr(prev?.liabilities.homeLoan),
      carLoan: toStr(prev?.liabilities.carLoan),
      personalLoan: toStr(prev?.liabilities.personalLoan),
      creditCard: toStr(prev?.liabilities.creditCard),
    },
    insurance: {
      lifeCover: toStr(prev?.insurance.lifeCover),
      healthCover: toStr(prev?.insurance.healthCover),
      hasTermPlan: prev?.insurance.hasTermPlan ?? false,
    },
    monthlyIncome: toStr(prev?.monthlyIncome),
    monthlyExpense: toStr(prev?.monthlyExpense),
  };
}

export default function FinancialDetailsScreen() {
  const { profile, setFinancial, setStep } = useOnboarding();
  const { control, handleSubmit } = useForm<FormShape>({
    defaultValues: seedFrom(profile.financial),
  });
  const [expanded, setExpanded] = useState<Record<SectionId, boolean>>({
    assets: true,
    liabilities: false,
    insurance: false,
    cashflow: false,
  });

  const toggle = (id: SectionId) => setExpanded((p) => ({ ...p, [id]: !p[id] }));

  const onSubmit = (data: FormShape) => {
    const next: FinancialSection = {
      assets: {
        cash: toNum(data.assets.cash),
        equity: toNum(data.assets.equity),
        mf: toNum(data.assets.mf),
        realEstate: toNum(data.assets.realEstate),
        gold: toNum(data.assets.gold),
        epf: toNum(data.assets.epf),
      },
      liabilities: {
        homeLoan: toNum(data.liabilities.homeLoan),
        carLoan: toNum(data.liabilities.carLoan),
        personalLoan: toNum(data.liabilities.personalLoan),
        creditCard: toNum(data.liabilities.creditCard),
      },
      insurance: {
        lifeCover: toNum(data.insurance.lifeCover),
        healthCover: toNum(data.insurance.healthCover),
        hasTermPlan: data.insurance.hasTermPlan,
      },
      monthlyIncome: toNum(data.monthlyIncome),
      monthlyExpense: toNum(data.monthlyExpense),
      monthlySip: profile.financial?.monthlySip,
    };
    setFinancial(next);
    setStep('documents');
    router.push('/(onboarding)/documents');
  };

  return (
    <ScreenContainer scroll edges={['top', 'bottom']} contentClassName="gap-stack-lg pb-stack-lg">
      <OnboardingHeader
        stepIndex={2}
        title="Financial details"
        subtitle="Approximate is fine — Sanjay refines these together with you. Leave fields empty if they don't apply."
      />

      <View className="gap-stack-md">
        <SectionShell
          id="assets"
          icon="trending_up"
          title="Assets"
          subtitle="What you own"
          expanded={expanded.assets}
          onToggle={() => toggle('assets')}
        >
          {ASSET_FIELDS.map((f) => (
            <Controller
              key={f.name}
              control={control}
              name={`assets.${f.name}` as const}
              render={({ field }) => (
                <CurrencyInput
                  label={f.label}
                  value={field.value}
                  onChangeText={field.onChange}
                  helper={f.helper}
                />
              )}
            />
          ))}
        </SectionShell>

        <SectionShell
          id="liabilities"
          icon="credit-card-outline"
          title="Liabilities"
          subtitle="What you owe"
          expanded={expanded.liabilities}
          onToggle={() => toggle('liabilities')}
        >
          {LIABILITY_FIELDS.map((f) => (
            <Controller
              key={f.name}
              control={control}
              name={`liabilities.${f.name}` as const}
              render={({ field }) => (
                <CurrencyInput
                  label={f.label}
                  value={field.value}
                  onChangeText={field.onChange}
                />
              )}
            />
          ))}
        </SectionShell>

        <SectionShell
          id="insurance"
          icon="shield"
          title="Insurance"
          subtitle="How you're protected"
          expanded={expanded.insurance}
          onToggle={() => toggle('insurance')}
        >
          <Controller
            control={control}
            name="insurance.lifeCover"
            render={({ field }) => (
              <CurrencyInput
                label="Life cover"
                value={field.value}
                onChangeText={field.onChange}
                helper="Total sum assured across policies."
              />
            )}
          />
          <Controller
            control={control}
            name="insurance.healthCover"
            render={({ field }) => (
              <CurrencyInput
                label="Health cover"
                value={field.value}
                onChangeText={field.onChange}
                helper="Family floater + individual."
              />
            )}
          />
          <Controller
            control={control}
            name="insurance.hasTermPlan"
            render={({ field }) => (
              <Pressable
                onPress={() => field.onChange(!field.value)}
                className="flex-row items-center justify-between bg-surface-container-low rounded-lg border border-outline-variant/40 px-4 py-3"
              >
                <View className="flex-1 pr-stack-md">
                  <Text variant="body-md" color="text-on-surface">
                    I have a term insurance plan
                  </Text>
                  <Text variant="label-caps" color="text-on-surface-variant" className="mt-1">
                    Helps us assess your safety net.
                  </Text>
                </View>
                <View
                  className={`h-7 w-12 rounded-full border ${
                    field.value
                      ? 'bg-secondary border-secondary'
                      : 'bg-surface-container-high border-outline-variant'
                  } items-${field.value ? 'end' : 'start'} justify-center px-0.5`}
                >
                  <View className="h-5 w-5 rounded-full bg-on-surface" />
                </View>
              </Pressable>
            )}
          />
        </SectionShell>

        <SectionShell
          id="cashflow"
          icon="show_chart"
          title="Cash flow"
          subtitle="Monthly income and spending"
          expanded={expanded.cashflow}
          onToggle={() => toggle('cashflow')}
        >
          <Controller
            control={control}
            name="monthlyIncome"
            render={({ field }) => (
              <CurrencyInput
                label="Take-home monthly income"
                value={field.value}
                onChangeText={field.onChange}
              />
            )}
          />
          <Controller
            control={control}
            name="monthlyExpense"
            render={({ field }) => (
              <CurrencyInput
                label="Average monthly expense"
                value={field.value}
                onChangeText={field.onChange}
              />
            )}
          />
        </SectionShell>
      </View>

      <View className="mt-stack-md">
        <Button
          label="Continue"
          onPress={handleSubmit(onSubmit)}
          fullWidth
          trailingIcon="arrow_forward"
        />
      </View>
    </ScreenContainer>
  );
}
