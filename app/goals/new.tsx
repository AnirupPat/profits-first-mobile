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
import { Chip } from '@/components/ui/Chip';
import { Icon, type IconName } from '@/components/ui/Icon';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useOnboarding } from '@/state/OnboardingContext';
import { useGoals } from '@/state/GoalsContext';
import { MOCK_HOLDINGS } from '@/data/mockHoldings';
import type { Goal, GoalCategory, GoalRiskProfile, LinkedFund } from '@/types/goals';
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

const INFLATION_BY_CATEGORY: Record<GoalCategory, number> = {
  education: 0.08,
  home: 0.07,
  retirement: 0.06,
  travel: 0.06,
};

const TODAY_COST_LABEL: Record<GoalCategory, string> = {
  education: "Today's education cost",
  home: "Today's property cost",
  retirement: 'Monthly expense today',
  travel: "Today's trip cost",
};

const TODAY_COST_HELPER: Record<GoalCategory, string> = {
  education: 'e.g. current annual fees or 4-yr course cost.',
  home: 'e.g. current market price of the property you want.',
  retirement: "We'll compute the corpus needed to sustain this monthly.",
  travel: 'e.g. total estimated cost if you travelled today.',
};

const CATEGORY_COLOR: Record<string, string> = {
  equity: '#99d4ae',
  debt: '#bec6e0',
  alternatives: '#edbaba',
};

function calcMonthlySip(targetAmount: number, years: number): number {
  if (years <= 0 || targetAmount <= 0) return 0;
  const n = years * 12;
  const r = 0.12 / 12;
  const pmt = (targetAmount * r) / (Math.pow(1 + r, n) - 1);
  return Math.round(pmt);
}

function inflationAdjust(todayCost: number, rate: number, years: number): number {
  return Math.round(todayCost * Math.pow(1 + rate, years));
}

function categoryTargetYear(category: GoalCategory, child?: ChildProfile): number {
  if (category === 'education' && child) return CURRENT_YEAR + Math.max(1, 18 - child.age);
  if (category === 'retirement') return CURRENT_YEAR + 25;
  if (category === 'home') return CURRENT_YEAR + 5;
  return CURRENT_YEAR + 2;
}

type Step = 'pick-category' | 'fill-details' | 'link-funds';

// ─── Category card ──────────────────────────────────────────────────────────

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

// ─── Child picker ────────────────────────────────────────────────────────────

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

// ─── Fund row for link-funds step ────────────────────────────────────────────

function FundLinkRow({
  holdingId,
  linked,
  sipStr,
  onToggle,
  onSipChange,
}: {
  holdingId: string;
  linked: boolean;
  sipStr: string;
  onToggle: () => void;
  onSipChange: (val: string) => void;
}) {
  const holding = MOCK_HOLDINGS.find((h) => h.id === holdingId);
  if (!holding) return null;
  const dotColor = CATEGORY_COLOR[holding.category] ?? '#bec6e0';

  return (
    <Pressable
      onPress={onToggle}
      style={({ pressed }) => (pressed ? { opacity: 0.7 } : undefined)}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: linked }}
    >
      <View
        className={`rounded-xl border p-4 gap-stack-sm ${
          linked
            ? 'bg-secondary-container/10 border-secondary/40'
            : 'bg-surface-container-low border-outline-variant/20'
        }`}
      >
        {/* Fund header row */}
        <View className="flex-row items-start gap-3">
          <View
            className={`w-5 h-5 rounded border-2 items-center justify-center mt-0.5 flex-shrink-0 ${
              linked ? 'bg-secondary border-secondary' : 'border-outline-variant'
            }`}
          >
            {linked ? <Icon name="check" size={12} color="#131315" /> : null}
          </View>
          <View className="flex-1">
            <Text
              variant="body-md"
              color={linked ? 'text-on-surface' : 'text-on-surface-variant'}
              className="font-manrope-semibold"
              numberOfLines={1}
            >
              {holding.name}
            </Text>
            <View className="flex-row items-center gap-2 mt-0.5">
              <View className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: dotColor }} />
              <Text variant="label-caps" color="text-on-surface-variant">
                {holding.subCategory} · {holding.plan}
              </Text>
            </View>
          </View>
          <Text variant="label-caps" color="text-on-surface-variant" className="mt-0.5">
            {inrCompact(holding.currentValue)}
          </Text>
        </View>

        {/* SIP input — only visible when linked */}
        {linked && (
          <Pressable onPress={(e) => e.stopPropagation()}>
            <CurrencyInput
              label="Monthly SIP for this goal"
              value={sipStr}
              onChangeText={onSipChange}
              helper="How much of your SIP in this fund goes towards this goal?"
            />
          </Pressable>
        )}
      </View>
    </Pressable>
  );
}

// ─── Screen ──────────────────────────────────────────────────────────────────

export default function NewGoalScreen() {
  const { profile } = useOnboarding();
  const { addGoal } = useGoals();

  const profileChildren = profile.family?.children ?? [];

  // Step 1: category
  const [step, setStep] = useState<Step>('pick-category');
  const [category, setCategory] = useState<GoalCategory | null>(null);

  // Step 2: details
  const [selectedChild, setSelectedChild] = useState<ChildProfile | null>(null);
  const [goalName, setGoalName] = useState('');
  const [todaysCostStr, setTodaysCostStr] = useState('');
  const [targetAmountStr, setTargetAmountStr] = useState('');
  const [targetYearStr, setTargetYearStr] = useState('');

  // Step 3: linked funds — map fundId → monthly SIP string
  const [linkedSips, setLinkedSips] = useState<Record<string, string>>({});

  // ── Step 1 handlers ──
  const handleCategorySelect = (cat: GoalCategory) => {
    setCategory(cat);
    setTodaysCostStr('');
    if (cat !== 'education') setSelectedChild(null);
    const defaultChild =
      cat === 'education' && profileChildren.length > 0 ? profileChildren[0] : undefined;
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

  // ── Step 2 handlers ──
  const handleChildChange = (child: ChildProfile | null) => {
    setSelectedChild(child);
    const yr = categoryTargetYear('education', child ?? undefined);
    setTargetYearStr(String(yr));
    setGoalName(child ? `${child.name}'s Education` : "Child's Education");
    if (todaysCostStr && Number(todaysCostStr) > 0) {
      const years = Math.max(1, yr - CURRENT_YEAR);
      setTargetAmountStr(
        String(inflationAdjust(Number(todaysCostStr), INFLATION_BY_CATEGORY.education, years)),
      );
    }
  };

  const handleTodaysCostChange = (val: string) => {
    setTodaysCostStr(val);
    const cost = Number(val) || 0;
    if (cost > 0 && category) {
      const years = Math.max(1, (Number(targetYearStr) || CURRENT_YEAR + 1) - CURRENT_YEAR);
      setTargetAmountStr(
        String(inflationAdjust(cost, INFLATION_BY_CATEGORY[category], years)),
      );
    }
  };

  const handleTargetYearChange = (val: string) => {
    const cleaned = val.replace(/\D/g, '').slice(0, 4);
    setTargetYearStr(cleaned);
    if (todaysCostStr && Number(todaysCostStr) > 0 && category) {
      const yr = Number(cleaned) || CURRENT_YEAR + 1;
      const years = Math.max(1, yr - CURRENT_YEAR);
      setTargetAmountStr(
        String(inflationAdjust(Number(todaysCostStr), INFLATION_BY_CATEGORY[category], years)),
      );
    }
  };

  // ── Step 3 handlers ──
  const toggleFund = (fundId: string) => {
    setLinkedSips((prev) => {
      if (fundId in prev) {
        const next = { ...prev };
        delete next[fundId];
        return next;
      }
      return { ...prev, [fundId]: '' };
    });
  };

  const setSip = (fundId: string, val: string) => {
    setLinkedSips((prev) => ({ ...prev, [fundId]: val }));
  };

  // ── Derived values ──
  const targetAmount = Number(targetAmountStr) || 0;
  const targetYear = Number(targetYearStr) || CURRENT_YEAR + 1;
  const horizonYears = Math.max(1, targetYear - CURRENT_YEAR);
  const monthlySipNeeded = calcMonthlySip(targetAmount, horizonYears);
  const riskProfile = category ? RISK_BY_CATEGORY[category] : 'balanced';
  const alloc = ALLOC_BY_RISK[riskProfile];

  const todaysCost = Number(todaysCostStr) || 0;
  const inflationRate = category ? INFLATION_BY_CATEGORY[category] : 0.06;
  const inflationPct = Math.round(inflationRate * 100);

  const linkedFundsArray: LinkedFund[] = Object.entries(linkedSips)
    .filter(([, sip]) => Number(sip) > 0)
    .map(([fundId, sip]) => ({ fundId, monthlySip: Number(sip) }));

  const totalLinkedSip = linkedFundsArray.reduce((s, f) => s + f.monthlySip, 0);
  const sipCoverageRatio = monthlySipNeeded > 0 ? totalLinkedSip / monthlySipNeeded : 0;

  // ── Guards ──
  const canProceed = category !== null;
  const canGoToLink = goalName.trim().length > 0 && targetAmount > 0 && targetYear > CURRENT_YEAR;
  const canSave = canGoToLink; // funds linking is optional

  const goalStatus = (): Goal['status'] => {
    if (totalLinkedSip === 0) return 'lagging';
    if (totalLinkedSip >= monthlySipNeeded) return 'on-track';
    if (totalLinkedSip >= monthlySipNeeded * 0.85) return 'on-track';
    return 'lagging';
  };

  const onSave = () => {
    if (!category || !canSave) return;
    const actualSip = totalLinkedSip > 0 ? totalLinkedSip : 0;
    addGoal({
      id: `goal-${Date.now()}`,
      name: goalName.trim(),
      category,
      targetAmount,
      currentAmount: 0,
      targetYear,
      horizonYears,
      monthlySipNeeded,
      monthlySipActual: actualSip,
      status: goalStatus(),
      riskProfile,
      equityPct: alloc.equity,
      debtPct: alloc.debt,
      alternativesPct: alloc.alt,
      recommendedFundIds: FUNDS_BY_CATEGORY[category],
      linkedFunds: linkedFundsArray,
    });
    router.back();
  };

  // ── Step label for TopAppBar ──
  const stepTitle: Record<Step, string> = {
    'pick-category': 'New Goal',
    'fill-details': 'Goal details',
    'link-funds': 'Link investments',
  };

  const onBackPress = () => {
    if (step === 'link-funds') setStep('fill-details');
    else if (step === 'fill-details') setStep('pick-category');
    else router.back();
  };

  return (
    <View className="flex-1 bg-background">
      <TopAppBar title={stepTitle[step]} onBackPress={onBackPress} rightIcon={null} />

      {/* Progress dots */}
      <View className="flex-row gap-1.5 px-4 pb-3">
        {(['pick-category', 'fill-details', 'link-funds'] as Step[]).map((s, i) => {
          const done =
            (step === 'fill-details' && i === 0) ||
            (step === 'link-funds' && i <= 1);
          const active = step === s;
          return (
            <View
              key={s}
              className={`h-1.5 flex-1 rounded-full ${
                active ? 'bg-secondary' : done ? 'bg-secondary/50' : 'bg-surface-container-highest'
              }`}
            />
          );
        })}
      </View>

      <ScreenContainer scroll edges={[]} contentClassName="gap-stack-md pb-stack-lg">

        {/* ── Step 1: Category picker ─────────────────────────────────── */}
        {step === 'pick-category' && (
          <>
            <View>
              <Text variant="headline-lg" color="text-on-surface">
                What are you saving for?
              </Text>
              <Text variant="body-md" color="text-on-surface-variant" className="mt-2">
                Pick a goal type. We'll personalise the plan based on your profile.
              </Text>
            </View>

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
        )}

        {/* ── Step 2: Details ─────────────────────────────────────────── */}
        {step === 'fill-details' && (
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

                <CurrencyInput
                  label={category ? TODAY_COST_LABEL[category] : "Today's cost"}
                  value={todaysCostStr}
                  onChangeText={handleTodaysCostChange}
                  helper={
                    category
                      ? TODAY_COST_HELPER[category]
                      : 'Optional — helps compute inflation-adjusted target.'
                  }
                />

                {todaysCost > 0 && targetAmount > 0 && (
                  <View className="bg-surface-container/60 rounded-lg border border-outline-variant/20 p-3 flex-row items-start gap-2">
                    <Icon name="info" size={16} color="#bec6e0" />
                    <Text variant="label-caps" color="text-on-surface-variant" className="flex-1">
                      {inrCompact(todaysCost)} today →{' '}
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
                  onChangeText={setTargetAmountStr}
                  helper={
                    todaysCost > 0
                      ? "Auto-filled from today's cost + inflation. You can override."
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

            {monthlySipNeeded > 0 && (
              <Card variant="high">
                <View className="flex-row items-center gap-stack-md">
                  <View className="w-10 h-10 rounded-xl bg-secondary-container/30 items-center justify-center">
                    <Icon name="show_chart" size={20} color="#99d4ae" />
                  </View>
                  <View className="flex-1">
                    <Text variant="label-caps" color="text-on-surface-variant">
                      Estimated monthly SIP needed
                    </Text>
                    <Text variant="headline-md" color="text-on-surface" className="mt-0.5">
                      {inr(monthlySipNeeded)}
                    </Text>
                    <Text variant="label-caps" color="text-on-surface-variant" className="mt-0.5">
                      at ~12% returns · {riskProfile} · {horizonYears} yr
                    </Text>
                  </View>
                </View>
              </Card>
            )}

            <Button
              label="Link investments"
              onPress={() => setStep('link-funds')}
              disabled={!canGoToLink}
              fullWidth
              trailingIcon="arrow_forward"
            />
          </>
        )}

        {/* ── Step 3: Link funds ──────────────────────────────────────── */}
        {step === 'link-funds' && (
          <>
            <View>
              <Text variant="headline-lg" color="text-on-surface">
                Give purpose to your SIPs
              </Text>
              <Text variant="body-md" color="text-on-surface-variant" className="mt-2">
                Select which of your existing mutual funds are working towards{' '}
                <Text variant="body-md" color="text-on-surface" className="font-manrope-semibold">
                  {goalName}
                </Text>
                . Every rupee should have a job.
              </Text>
            </View>

            {/* SIP progress bar */}
            {monthlySipNeeded > 0 && (
              <Card variant="high">
                <View className="flex-row items-baseline justify-between mb-2">
                  <Text variant="label-caps" color="text-on-surface-variant">
                    Monthly SIP committed
                  </Text>
                  <View className="flex-row items-baseline gap-1">
                    <Text variant="headline-md" color="text-on-surface">
                      {inrCompact(totalLinkedSip)}
                    </Text>
                    <Text variant="label-caps" color="text-on-surface-variant">
                      of {inrCompact(monthlySipNeeded)}
                    </Text>
                  </View>
                </View>
                <ProgressBar
                  value={Math.min(sipCoverageRatio * 100, 100)}
                  max={100}
                  tone={sipCoverageRatio >= 0.85 ? 'secondary' : 'tertiary'}
                  height="md"
                />
                {totalLinkedSip === 0 && (
                  <Text variant="label-caps" color="text-on-surface-variant" className="mt-2">
                    Tap a fund below to link it to this goal.
                  </Text>
                )}
                {totalLinkedSip > 0 && totalLinkedSip < monthlySipNeeded && (
                  <Text variant="label-caps" color="text-on-surface-variant" className="mt-2">
                    Gap of {inrCompact(monthlySipNeeded - totalLinkedSip)}/mo — link more funds or
                    increase SIP amounts.
                  </Text>
                )}
                {totalLinkedSip >= monthlySipNeeded && (
                  <Text variant="label-caps" color="text-secondary" className="mt-2">
                    SIP fully covered. You're on track.
                  </Text>
                )}
              </Card>
            )}

            {/* Fund list */}
            <View className="gap-stack-sm">
              {MOCK_HOLDINGS.map((h) => (
                <FundLinkRow
                  key={h.id}
                  holdingId={h.id}
                  linked={h.id in linkedSips}
                  sipStr={linkedSips[h.id] ?? ''}
                  onToggle={() => toggleFund(h.id)}
                  onSipChange={(val) => setSip(h.id, val)}
                />
              ))}
            </View>

            {/* Category legend */}
            <View className="flex-row gap-stack-md">
              {Object.entries(CATEGORY_COLOR).map(([cat, color]) => (
                <View key={cat} className="flex-row items-center gap-1.5">
                  <View className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                  <Text variant="label-caps" color="text-on-surface-variant" className="capitalize">
                    {cat}
                  </Text>
                </View>
              ))}
            </View>

            <View className="gap-stack-sm">
              <Button label="Add goal" onPress={onSave} fullWidth leadingIcon="check" />
              <Button
                label="Skip — add funds later"
                variant="ghost"
                onPress={onSave}
                fullWidth
              />
            </View>
          </>
        )}
      </ScreenContainer>
    </View>
  );
}
