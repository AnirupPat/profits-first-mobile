import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { router } from 'expo-router';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { TopAppBar } from '@/components/layout/TopAppBar';
import { Text } from '@/components/ui/Text';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CurrencyInput } from '@/components/ui/CurrencyInput';
import { Icon, type IconName } from '@/components/ui/Icon';
import { useOnboarding } from '@/state/OnboardingContext';
import { useGoals } from '@/state/GoalsContext';
import type { Goal, GoalCategory, GoalRiskProfile } from '@/types/goals';
import type { ChildProfile } from '@/types/onboarding';
import { inr } from '@/utils/format';

const CURRENT_YEAR = 2026;

const CATEGORIES: { id: GoalCategory; label: string; icon: IconName; desc: string }[] = [
  { id: 'retirement', label: 'Retirement', icon: 'sail-boat', desc: 'Build your freedom corpus' },
  { id: 'education', label: 'Education', icon: 'school', desc: "Fund a child's future" },
  { id: 'home', label: 'Home', icon: 'home-city', desc: 'Save for a down payment' },
  { id: 'travel', label: 'Travel', icon: 'airplane', desc: 'Plan your next adventure' },
];

const RISK_BY_CATEGORY: Record<GoalCategory, GoalRiskProfile> = {
  retirement: 'aggressive',
  education: 'balanced',
  home: 'conservative',
  travel: 'conservative',
};

const ALLOC_BY_RISK: Record<GoalRiskProfile, { equity: number; debt: number; alt: number }> = {
  aggressive: { equity: 70, debt: 25, alt: 5 },
  balanced: { equity: 60, debt: 30, alt: 10 },
  conservative: { equity: 30, debt: 60, alt: 10 },
};

const FUNDS_BY_CATEGORY: Record<GoalCategory, string[]> = {
  retirement: ['pp-flexi-cap', 'hdfc-top-100', 'nippon-gold-etf'],
  education: ['pp-flexi-cap', 'icici-bluechip', 'hdfc-short-term'],
  home: ['hdfc-short-term', 'sbi-liquid', 'icici-bluechip'],
  travel: ['sbi-liquid', 'hdfc-short-term'],
};

const CORPUS_SUGGESTION: Record<GoalCategory, number> = {
  retirement: 50000000,
  education: 5000000,
  home: 2500000,
  travel: 300000,
};

// Simplified PMT: monthly SIP needed to reach FV at ~12% annual returns
function calcMonthlySip(targetAmount: number, years: number): number {
  if (years <= 0 || targetAmount <= 0) return 0;
  const n = years * 12;
  const r = 0.12 / 12;
  const pmt = (targetAmount * r) / (Math.pow(1 + r, n) - 1);
  return Math.round(pmt);
}

function categoryTargetYear(category: GoalCategory, child?: ChildProfile): number {
  if (category === 'education' && child) {
    return CURRENT_YEAR + Math.max(1, 18 - child.age);
  }
  if (category === 'retirement') return CURRENT_YEAR + 25;
  if (category === 'home') return CURRENT_YEAR + 5;
  return CURRENT_YEAR + 2;
}

type Step = 'pick-category' | 'fill-details';

function CategoryCard({
  item,
  selected,
  onSelect,
}: {
  item: (typeof CATEGORIES)[number];
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <Pressable
      onPress={onSelect}
      style={({ pressed }) => ({ opacity: pressed ? 0.75 : 1, flex: 1 })}
      accessibilityRole="button"
      accessibilityLabel={item.label}
    >
      <View
        className={`p-4 rounded-2xl border items-center gap-2 ${
          selected
            ? 'bg-secondary-container/30 border-secondary'
            : 'bg-surface-container-low border-outline-variant/30'
        }`}
      >
        <View
          className={`w-12 h-12 rounded-xl items-center justify-center ${
            selected ? 'bg-secondary-container/40' : 'bg-surface-container-high'
          }`}
        >
          <Icon name={item.icon} size={24} color={selected ? '#99d4ae' : '#bec6e0'} />
        </View>
        <Text
          variant="body-md"
          color={selected ? 'text-secondary' : 'text-on-surface'}
          className="font-manrope-semibold text-center"
        >
          {item.label}
        </Text>
        <Text variant="label-caps" color="text-on-surface-variant" className="text-center">
          {item.desc}
        </Text>
      </View>
    </Pressable>
  );
}

function ChildPicker({
  children,
  selected,
  onSelect,
}: {
  children: ChildProfile[];
  selected: ChildProfile | null;
  onSelect: (child: ChildProfile | null) => void;
}) {
  return (
    <View className="gap-stack-sm">
      <Text variant="label-caps" color="text-on-surface-variant">
        Which child is this goal for?
      </Text>
      <View className="flex-row flex-wrap gap-2">
        {children.map((child) => {
          const sel = selected?.name === child.name;
          return (
            <Pressable
              key={child.name}
              onPress={() => onSelect(sel ? null : child)}
              className={`px-4 py-2 rounded-lg border ${
                sel
                  ? 'bg-secondary-container/30 border-secondary'
                  : 'bg-surface-container-low border-outline-variant/40'
              }`}
            >
              <Text
                variant="body-md"
                color={sel ? 'text-secondary' : 'text-on-surface-variant'}
              >
                {child.name}
                <Text variant="label-caps" color="text-on-surface-variant">
                  {' '}
                  (age {child.age})
                </Text>
              </Text>
            </Pressable>
          );
        })}
        <Pressable
          onPress={() => onSelect(null)}
          className={`px-4 py-2 rounded-lg border ${
            selected === null
              ? 'bg-secondary-container/30 border-secondary'
              : 'bg-surface-container-low border-outline-variant/40'
          }`}
        >
          <Text
            variant="body-md"
            color={selected === null ? 'text-secondary' : 'text-on-surface-variant'}
          >
            Other / not listed
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function NewGoalScreen() {
  const { profile } = useOnboarding();
  const { addGoal } = useGoals();

  const children = profile.family?.children ?? [];

  const [step, setStep] = useState<Step>('pick-category');
  const [category, setCategory] = useState<GoalCategory | null>(null);
  const [selectedChild, setSelectedChild] = useState<ChildProfile | null>(null);
  const [goalName, setGoalName] = useState('');
  const [targetAmountStr, setTargetAmountStr] = useState('');
  const [targetYearStr, setTargetYearStr] = useState('');

  const handleCategorySelect = (cat: GoalCategory) => {
    setCategory(cat);
    // reset child when switching away from education
    if (cat !== 'education') setSelectedChild(null);
    // pre-fill target year and amount based on category
    const defaultChild = cat === 'education' && children.length > 0 ? children[0] : undefined;
    if (cat === 'education' && defaultChild) setSelectedChild(defaultChild);
    setTargetYearStr(String(categoryTargetYear(cat, defaultChild)));
    setTargetAmountStr(String(CORPUS_SUGGESTION[cat]));
    // pre-fill name
    const defaultNames: Record<GoalCategory, string> = {
      retirement: 'Retirement Corpus',
      education: defaultChild ? `${defaultChild.name}'s Education` : "Child's Education",
      home: 'Home Down Payment',
      travel: 'Family Travel Fund',
    };
    setGoalName(defaultNames[cat]);
  };

  const handleChildChange = (child: ChildProfile | null) => {
    setSelectedChild(child);
    if (child) {
      setTargetYearStr(String(categoryTargetYear('education', child)));
      setGoalName(`${child.name}'s Education`);
    } else {
      setTargetYearStr(String(categoryTargetYear('education')));
      setGoalName("Child's Education");
    }
  };

  const targetAmount = Number(targetAmountStr) || 0;
  const targetYear = Number(targetYearStr) || CURRENT_YEAR + 1;
  const horizonYears = Math.max(1, targetYear - CURRENT_YEAR);
  const monthlySipNeeded = calcMonthlySip(targetAmount, horizonYears);
  const riskProfile = category ? RISK_BY_CATEGORY[category] : 'balanced';
  const alloc = ALLOC_BY_RISK[riskProfile];

  const canProceed = category !== null;
  const canSave =
    goalName.trim().length > 0 && targetAmount > 0 && targetYear > CURRENT_YEAR;

  const onSave = () => {
    if (!category || !canSave) return;
    const newGoal: Goal = {
      id: `goal-${Date.now()}`,
      name: goalName.trim(),
      category,
      targetAmount,
      currentAmount: 0,
      targetYear,
      horizonYears,
      monthlySipNeeded,
      monthlySipActual: 0,
      status: 'on-track',
      riskProfile,
      equityPct: alloc.equity,
      debtPct: alloc.debt,
      alternativesPct: alloc.alt,
      recommendedFundIds: FUNDS_BY_CATEGORY[category],
    };
    addGoal(newGoal);
    router.back();
  };

  return (
    <View className="flex-1 bg-background">
      <TopAppBar
        title={step === 'pick-category' ? 'New Goal' : 'Goal details'}
        onBackPress={() => {
          if (step === 'fill-details') {
            setStep('pick-category');
          } else {
            router.back();
          }
        }}
        rightIcon={null}
      />
      <ScreenContainer scroll edges={[]} contentClassName="gap-stack-md pb-stack-lg">
        {step === 'pick-category' ? (
          <>
            <View>
              <Text variant="headline-lg" color="text-on-surface">
                What are you saving for?
              </Text>
              <Text variant="body-md" color="text-on-surface-variant" className="mt-2">
                Pick a goal type. We'll personalise the plan based on your profile.
              </Text>
            </View>

            <View className="flex-row gap-stack-sm">
              {CATEGORIES.slice(0, 2).map((cat) => (
                <CategoryCard
                  key={cat.id}
                  item={cat}
                  selected={category === cat.id}
                  onSelect={() => handleCategorySelect(cat.id)}
                />
              ))}
            </View>
            <View className="flex-row gap-stack-sm">
              {CATEGORIES.slice(2).map((cat) => (
                <CategoryCard
                  key={cat.id}
                  item={cat}
                  selected={category === cat.id}
                  onSelect={() => handleCategorySelect(cat.id)}
                />
              ))}
            </View>

            <Button
              label="Continue"
              onPress={() => setStep('fill-details')}
              disabled={!canProceed}
              fullWidth
              trailingIcon="arrow_forward"
            />
          </>
        ) : (
          <>
            {/* Education child picker */}
            {category === 'education' && children.length > 0 && (
              <Card>
                <ChildPicker
                  children={children}
                  selected={selectedChild}
                  onSelect={handleChildChange}
                />
                {selectedChild && (
                  <View className="mt-stack-md bg-secondary-container/10 rounded-lg p-3 border border-secondary/20">
                    <Text variant="label-caps" color="text-secondary">
                      Smart fill applied
                    </Text>
                    <Text variant="body-md" color="text-on-surface-variant" className="mt-1">
                      {selectedChild.name} is {selectedChild.age} years old — college in{' '}
                      {horizonYears} years ({targetYear}). Target year and corpus pre-filled.
                    </Text>
                  </View>
                )}
              </Card>
            )}

            <Card>
              <View className="gap-stack-md">
                <Input
                  label="Goal name"
                  placeholder="e.g. Arjun's Education"
                  value={goalName}
                  onChangeText={setGoalName}
                  autoCapitalize="words"
                />

                <CurrencyInput
                  label="Target corpus"
                  value={targetAmountStr}
                  onChangeText={setTargetAmountStr}
                  helper={
                    category === 'education'
                      ? 'Estimated cost including inflation.'
                      : 'How much do you want to accumulate?'
                  }
                />

                <Input
                  label="Target year"
                  placeholder={String(CURRENT_YEAR + horizonYears)}
                  value={targetYearStr}
                  onChangeText={(v) => setTargetYearStr(v.replace(/\D/g, '').slice(0, 4))}
                  keyboardType="number-pad"
                  maxLength={4}
                  helper={`${horizonYears} year${horizonYears === 1 ? '' : 's'} from now`}
                />
              </View>
            </Card>

            {/* SIP estimate */}
            {monthlySipNeeded > 0 && (
              <Card variant="high">
                <View className="flex-row items-center gap-stack-md">
                  <View className="w-10 h-10 rounded-xl bg-secondary-container/30 items-center justify-center">
                    <Icon name="show_chart" size={20} color="#99d4ae" />
                  </View>
                  <View className="flex-1">
                    <Text variant="label-caps" color="text-on-surface-variant">
                      Estimated monthly SIP
                    </Text>
                    <Text variant="headline-md" color="text-on-surface" className="mt-0.5">
                      {inr(monthlySipNeeded)}
                    </Text>
                    <Text variant="label-caps" color="text-on-surface-variant" className="mt-0.5">
                      at ~12% annual returns · {riskProfile} strategy
                    </Text>
                  </View>
                </View>
              </Card>
            )}

            <Button
              label="Add goal"
              onPress={onSave}
              disabled={!canSave}
              fullWidth
              leadingIcon="check"
            />
          </>
        )}
      </ScreenContainer>
    </View>
  );
}
