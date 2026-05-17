import { View, Pressable } from 'react-native';
import { router } from 'expo-router';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { TopAppBar } from '@/components/layout/TopAppBar';
import { Text } from '@/components/ui/Text';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { Icon } from '@/components/ui/Icon';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { DonutChart } from '@/components/charts/DonutChart';
import { MOCK_HOLDINGS, type HoldingCategory } from '@/data/mockHoldings';
import { inr, inrCompact } from '@/utils/format';

const CATEGORY_LABEL: Record<HoldingCategory, string> = {
  equity: 'Equity',
  debt: 'Debt Funds',
  alternatives: 'Alternatives',
};
const CATEGORY_TONE: Record<HoldingCategory, 'secondary' | 'primary' | 'tertiary'> = {
  equity: 'secondary',
  debt: 'primary',
  alternatives: 'tertiary',
};
const CATEGORY_DOT: Record<HoldingCategory, string> = {
  equity: '#99d4ae',
  debt: '#bec6e0',
  alternatives: '#edbaba',
};

function sum(ids: string[], key: 'currentValue' | 'invested') {
  return MOCK_HOLDINGS.filter((h) => ids.includes(h.id)).reduce((s, h) => s + h[key], 0);
}

const totalValue = MOCK_HOLDINGS.reduce((s, h) => s + h.currentValue, 0);
const totalInvested = MOCK_HOLDINGS.reduce((s, h) => s + h.invested, 0);
const overallGain = totalValue - totalInvested;
const overallReturnPct = (overallGain / totalInvested) * 100;

const ALLOCATION_CATEGORIES: HoldingCategory[] = ['equity', 'debt', 'alternatives'];

function allocationFor(cat: HoldingCategory) {
  const value = MOCK_HOLDINGS.filter((h) => h.category === cat).reduce(
    (s, h) => s + h.currentValue,
    0,
  );
  return { value, pct: value / totalValue };
}

const equityAlloc = allocationFor('equity');

type HoldingCardProps = {
  id: string;
  name: string;
  subCategory: string;
  plan: string;
  currentValue: number;
  invested: number;
  returnsPct: number;
};

function HoldingCard({ id, name, subCategory, plan, currentValue, invested, returnsPct }: HoldingCardProps) {
  const gain = currentValue - invested;
  const positive = returnsPct >= 0;
  return (
    <Pressable
      onPress={() => router.push(`/mf/${id}`)}
      style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
      accessibilityRole="button"
    >
      <Card>
        <View className="flex-row items-start justify-between gap-3">
          <View className="flex-1">
            <Text variant="body-md" color="text-on-surface" numberOfLines={2} className="font-manrope-semibold">
              {name}
            </Text>
            <Text variant="label-caps" color="text-on-surface-variant" className="mt-1">
              {subCategory} · {plan}
            </Text>
          </View>
          <View className="items-end shrink-0">
            <Text variant="body-md" color="text-on-surface" className="font-manrope-semibold">
              {inrCompact(currentValue)}
            </Text>
            <Chip
              label={`${positive ? '+' : ''}${returnsPct.toFixed(1)}%`}
              tone={positive ? 'success' : 'danger'}
              className="mt-1"
            />
          </View>
        </View>
        <View className="mt-stack-sm pt-stack-sm border-t border-outline-variant/20 flex-row items-center justify-between">
          <Text variant="label-caps" color="text-on-surface-variant">
            Invested {inrCompact(invested)}
          </Text>
          <Text variant="label-caps" color={positive ? 'text-secondary' : 'text-error'}>
            {positive ? '+' : ''}{inrCompact(gain)}
          </Text>
        </View>
      </Card>
    </Pressable>
  );
}

export default function PortfolioScreen() {
  return (
    <View className="flex-1 bg-background">
      <TopAppBar title="My Wealth" onRightPress={() => router.push('/help')} />
      <ScreenContainer scroll edges={[]} contentClassName="gap-stack-md pb-stack-lg">

        {/* Total value hero */}
        <Card variant="high">
          <Text variant="label-caps" color="text-on-surface-variant">
            Total Portfolio Value
          </Text>
          <Text variant="headline-lg" color="text-on-surface" className="mt-1">
            {inrCompact(totalValue)}
          </Text>
          <View className="flex-row items-center gap-2 mt-stack-sm">
            <Chip
              label={`+${inrCompact(overallGain)}`}
              tone="success"
            />
            <Text variant="label-caps" color="text-secondary">
              +{overallReturnPct.toFixed(1)}% overall
            </Text>
          </View>
        </Card>

        {/* Asset Allocation */}
        <Card>
          <Text variant="headline-md" color="text-on-surface" className="mb-stack-md">
            Asset Allocation
          </Text>
          <View className="flex-row items-center gap-stack-md">
            <DonutChart
              value={equityAlloc.pct}
              size={96}
              strokeWidth={10}
              fillColor="#99d4ae"
            >
              <View className="items-center">
                <Text variant="headline-md" color="text-on-surface">
                  {Math.round(equityAlloc.pct * 100)}%
                </Text>
                <Text variant="label-caps" color="text-on-surface-variant">
                  Equity
                </Text>
              </View>
            </DonutChart>

            <View className="flex-1 gap-3">
              {ALLOCATION_CATEGORIES.map((cat) => {
                const alloc = allocationFor(cat);
                return (
                  <View key={cat}>
                    <View className="flex-row items-center justify-between mb-1">
                      <View className="flex-row items-center gap-1.5">
                        <View
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: CATEGORY_DOT[cat] }}
                        />
                        <Text variant="label-caps" color="text-on-surface-variant">
                          {CATEGORY_LABEL[cat]}
                        </Text>
                      </View>
                      <Text variant="label-caps" color="text-on-surface">
                        {inrCompact(alloc.value)}
                      </Text>
                    </View>
                    <ProgressBar
                      value={alloc.pct * 100}
                      max={100}
                      tone={CATEGORY_TONE[cat]}
                      height="sm"
                    />
                  </View>
                );
              })}
            </View>
          </View>
        </Card>

        {/* Holdings header */}
        <View className="flex-row items-center justify-between">
          <Text variant="headline-md" color="text-on-surface">
            Holdings
          </Text>
          <View className="flex-row items-center gap-1">
            <Icon name="show_chart" size={14} color="#909097" />
            <Text variant="label-caps" color="text-on-surface-variant">
              {MOCK_HOLDINGS.length} funds
            </Text>
          </View>
        </View>

        {/* Compare CTA */}
        <Pressable
          onPress={() => router.push('/compare')}
          style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
          accessibilityRole="button"
          className="self-start flex-row items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-high border border-outline-variant/30"
        >
          <Icon name="swap-horizontal" size={14} color="#99d4ae" />
          <Text variant="label-caps" color="text-on-surface-variant">
            Compare funds
          </Text>
        </Pressable>

        {/* Holdings list */}
        {MOCK_HOLDINGS.map((h) => (
          <HoldingCard
            key={h.id}
            id={h.id}
            name={h.name}
            subCategory={h.subCategory}
            plan={h.plan}
            currentValue={h.currentValue}
            invested={h.invested}
            returnsPct={h.returnsPct}
          />
        ))}

        {/* Total row */}
        <Card variant="outline">
          <View className="flex-row items-center justify-between">
            <Text variant="label-caps" color="text-on-surface-variant">
              Total invested
            </Text>
            <Text variant="body-md" color="text-on-surface">
              {inr(totalInvested)}
            </Text>
          </View>
          <View className="flex-row items-center justify-between mt-2">
            <Text variant="label-caps" color="text-on-surface-variant">
              Current value
            </Text>
            <Text variant="body-md" color="text-secondary">
              {inr(totalValue)}
            </Text>
          </View>
        </Card>

      </ScreenContainer>
    </View>
  );
}
