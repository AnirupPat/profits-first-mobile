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
import { inr, inrCompact } from '@/utils/format';

const CURRENT_YEAR = 2026;

const CATEGORIES: { id: GoalCategory; label: string; icon: IconName; desc: string }[] = [
  { id: 'retirement', label: 'Retirement', icon: 'sail-boat', desc: 'Build your freedom corpus' },
  { id: 'education', label: 'Education', icon: 'school', desc: "Fund a child's future" },
  { id: 'home', label: 'Home', icon: 'home-city', desc: 'Save for a down payment' },
  { id: 'travel', label: 'Travel', icon: 'airplane', desc: 'Next adventure' },
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

// Annual inflation rates per category
const INFLATION_BY_CATEGORY: Record<GoalCategory, number> = {
  education: 0.08,  // education costs rise ~8% p.a. in India
  home: 0.07,
  retirement: 0.06,
  travel: 0.06,
};

const TODAY_COST_LABEL: Record<GoalCategory, string> = {
  education: "Today's education cost",
  home: "Today's property cost",
  retirement: "Monthly expense today",
  travel: "Today's trip cost",
};

const TODAY_COST_HELPER: Record<GoalCategory, string> = {
  education: 'e.g. current annual fees or 4-yr course cost.',
  home: 'e.g. current market price of the property you want.',
  retirement: "We'll compute the corpus needed to sustain this monthly.",
  travel: 'e.g. total estimated cost if you travelled today.',
};

function calcMonthlySip(targetAmount: number, years: number): number {
  if (years <= 0 || targetAmount <= 0) return 0;
  const n = years * 12;
  const r = 0.12 / 12;
  const pmt = (targetAmount * r) / (Math.pow(1 + r, n) - 1);
  return Math.round(pmt);
}

function inflationAdjust(todayCost: number, inflationRate: number, years: number): number {
  return Math.round(todayCost * Math.pow(1 + inflationRate, years));
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
    // flex-1 via className; only opacity goes in the pressed-state style callback
    <Pressable
      onPress={onSelect}
      className="flex-1"
      style={({ pressed }) => (pressed ? { opacity: 0.7 } : undefined)}
      accessibilityRole="button"
      accessibilityLabel={item.label}
    >
      <View
        className={`flex-1 p-4 rounded-2xl border items-center gap-2 overflow-hidden ${
          selected
            ? 'bg-secondary-container/30 border-secondary'
            : 'bg-surface-container-low border-outline-variant/30'
        }`}
      >
        <View
          className={`w-11 h-11 rounded-xl items-center justify-center ${
            selected ? 'bg-secondary-container/40' : 'bg-surface-container-high'
          }`}
        >
          <Icon name={item.icon} size={22} color={selected ? '#99d4ae' : '#bec6e0'} />
        </View>
        <Text
          variant="body-md"
          color={selected ? 'text-secondary' : 'text-on-surface'}
          className="font-manrope-semibold text-center w-full"
          numberOfLines={1}
        >
          {item.label}
        </Text>
        <Text
          variant="label-caps"
          color="text-on-surface-variant"
          className="text-center w-full"
          numberOfLines={2}
        >
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
              <Text variant="body-md" color={sel ? 'text-secondary' : 'text-on-surface'}>
                {child.name}{' '}
                <Text variant="label-caps" color="text-on-surface-variant">
                  age {child.age}
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
            Other
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function NewGoalScreen() {
  const { profile } = useOnboarding();
  const { addGoal } = useGoals();

  const profileChildren = profile.family?.children ?? [];

  const [step, setStep] = useState<Step>('pick-category');
  const [category, setCategory] = useState<GoalCategory | null>(null);
  const [selectedChild, setSelectedChild] = useState<ChildProfile | null>(null);
  const [goalName, setGoalName] = useState('');
  const [todaysCostStr, setTodaysCostStr] = useState('');
  const [targetAmountStr, setTargetAmountStr] = useState('');
  const [targetYearStr, setTargetYearStr] = useState('');

  const handleCategorySelect = (cat: GoalCategory) => {
    setCategory(cat);
    setTodaysCostStr('');
    if (cat !== 'education') setSelectedChild(null);
    const defaultChild = cat === 'education' && profileChildren.length > 0 ? profileChildren[0] : undefined;
    if (cat === 'education' && defaultChild) setSelectedChild(defaultChild);
    setTargetYearStr(String(categoryTargetYear(cat, defaultChild)));
    setTargetAmountStr('');
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
    const yr = categoryTargetYear('education', child ?? undefined);
    setTargetYearStr(String(yr));
    setGoalName(child ? `${child.name}'s Education` : "Child's Education");
    // recalculate inflation-adjusted amount if today's cost is set
    if (todaysCostStr && Number(todaysCostStr) > 0) {
      const years = Math.max(1, yr - CURRENT_YEAR);
      const inflated = inflationAdjust(Number(todaysCostStr), INFLATION_BY_CATEGORY.education, years);
      setTargetAmountStr(String(inflated));
    }
  };

  const handleTodaysCostChange = (val: string) => {
    setTodaysCostStr(val);
    const cost = Number(val) || 0;
    if (cost > 0 && category) {
      const years = Math.max(1, (Number(targetYearStr) || CURRENT_YEAR + 1) - CURRENT_YEAR);
      const inflated = inflationAdjust(cost, INFLATION_BY_CATEGORY[category], years);
      setTargetAmountStr(String(inflated));
    }
  };

  const handleTargetYearChange = (val: string) => {
    const cleaned = val.replace(/\D/g, '').slice(0, 4);
    setTargetYearStr(cleaned);
    // recalc if today's cost is entered
    if (todaysCostStr && Number(todaysCostStr) > 0 && category) {
      const yr = Number(cleaned) || CURRENT_YEAR + 1;
      const years = Math.max(1, yr - CURRENT_YEAR);
      const inflated = inflationAdjust(Number(todaysCostStr), INFLATION_BY_CATEGORY[category], years);
      setTargetAmountStr(String(inflated));
    }
  };

  const targetAmount = Number(targetAmountStr) || 0;
  const targetYear = Number(targetYearStr) || CURRENT_YEAR + 1;
  const horizonYears = Math.max(1, targetYear - CURRENT_YEAR);
  const monthlySipNeeded = calcMonthlySip(targetAmount, horizonYears);
  const riskProfile = category ? RISK_BY_CATEGORY[category] : 'balanced';
  const alloc = ALLOC_BY_RISK[riskProfile];

  const todaysCost = Number(todaysCostStr) || 0;
  const inflationRate = category ? INFLATION_BY_CATEGORY[category] : 0.06;
  const inflationPct = Math.round(inflationRate * 100);

  const canProceed = category !== null;
  const canSave = goalName.trim().length > 0 && targetAmount > 0 && targetYear > CURRENT_YEAR;

  const onSave = () => {
    if (!category || !canSave) return;
    addGoal({
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
    });
    router.back();
  };

  return (
    <View className="flex-1 bg-background">
      <TopAppBar
        title={step === 'pick-category' ? 'New Goal' : 'Goal details'}
        onBackPress={() => {
          if (step === 'fill-details') setStep('pick-category');
          else router.back();
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

            {/* 2×2 grid — explicit flex-row with flex-1 children */}
            <View className="gap-stack-sm">
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
            {/* Education: child picker */}
            {category === 'education' && profileChildren.length > 0 && (
              <Card>
                <ChildPicker
                  children={profileChildren}
                  selected={selectedChild}
                  onSelect={handleChildChange}
                />
                {selectedChild && (
                  <View className="mt-stack-md bg-secondary-container/10 rounded-lg p-3 border border-secondary/20">
                    <Text variant="label-caps" color="text-secondary">
                      Smart fill applied
                    </Text>
                    <Text variant="body-md" color="text-on-surface-variant" className="mt-1">
                      {selectedChild.name} is {selectedChild.age} yr old — college in{' '}
                      {horizonYears} yr ({targetYear}).
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

                {/* Today's cost → inflation-adjusted corpus */}
                <CurrencyInput
                  label={category ? TODAY_COST_LABEL[category] : "Today's cost"}
                  value={todaysCostStr}
                  onChangeText={handleTodaysCostChange}
                  helper={category ? TODAY_COST_HELPER[category] : 'Optional — helps us compute inflation-adjusted target.'}
                />

                {/* Inflation callout */}
                {todaysCost > 0 && targetAmount > 0 && (
                  <View className="bg-surface-container/60 rounded-lg border border-outline-variant/20 p-3 flex-row items-start gap-2">
                    <Icon name="info" size={16} color="#bec6e0" />
                    <Text variant="label-caps" color="text-on-surface-variant" className="flex-1">
                      {inrCompact(todaysCost)} today grows to{' '}
                      <Text variant="label-caps" color="text-on-surface">
                        {inrCompact(targetAmount)}
                      </Text>{' '}
                      in {horizonYears} yr at {inflationPct}% annual inflation.
                    </Text>
                  </View>
                )}

                <CurrencyInput
                  label="Target corpus"
                  value={targetAmountStr}
                  onChangeText={(v) => {
                    setTargetAmountStr(v);
                    // manual edit clears the auto-link to today's cost
                    if (!todaysCostStr) return;
                  }}
                  helper={
                    todaysCost > 0
                      ? 'Auto-filled from today\'s cost + inflation. You can override.'
                      : 'How much do you want to accumulate?'
                  }
                />

                <Input
                  label="Target year"
                  placeholder={String(CURRENT_YEAR + horizonYears)}
                  value={targetYearStr}
                  onChangeText={handleTargetYearChange}
                  keyboardType="number-pad"
                  maxLength={4}
                  helper={`${horizonYears} year${horizonYears === 1 ? '' : 's'} from now`}
                />
              </View>
            </Card>

            {/* Monthly SIP estimate */}
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
                      at ~12% returns · {riskProfile} · {horizonYears} yr horizon
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
