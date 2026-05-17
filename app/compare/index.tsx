import { useMemo, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { TopAppBar } from '@/components/layout/TopAppBar';
import { Text } from '@/components/ui/Text';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { Icon } from '@/components/ui/Icon';
import { LineChart } from '@/components/charts/LineChart';
import { MetricRow } from '@/components/compare/MetricRow';
import { EntityHeaderChip } from '@/components/compare/EntityHeaderChip';
import { EntitySelectorModal } from '@/components/compare/EntitySelectorModal';
import { FUND_DETAILS } from '@/data/mockFunds';
import { INDEX_DETAILS } from '@/data/mockIndices';
import { MOCK_HOLDINGS } from '@/data/mockHoldings';
import { getNavHistory } from '@/data/mockNavHistory';
import {
  annualizedStdDev,
  beta,
  jensensAlpha,
  maxDrawdown,
  rebaseToHundred,
  rollingCagr,
  sharpe,
  sliceWindow,
} from '@/utils/finance';
import type {
  ChartWindow,
  ComparisonGroup,
  Entity,
  EntityKind,
  EntitySnapshot,
} from '@/types/compare';
import { inr } from '@/utils/format';

const LEFT_COLOR = '#edbaba';
const RIGHT_COLOR = '#bec6e0';

function pct(v: number | null | undefined): string {
  if (v == null || !Number.isFinite(v)) return '—';
  const sign = v > 0 ? '+' : '';
  return `${sign}${v.toFixed(2)}%`;
}

function num(v: number | null | undefined, digits = 2): string {
  if (v == null || !Number.isFinite(v)) return '—';
  return v.toFixed(digits);
}

function dash(v: string | undefined): string {
  return v && v.length > 0 ? v : '—';
}

function buildSnapshot(entity: Entity): EntitySnapshot | null {
  const history = getNavHistory(entity.id);
  if (entity.kind === 'fund') {
    const f = FUND_DETAILS[entity.id];
    if (!f) return null;
    const holding = MOCK_HOLDINGS.find((h) => h.id === f.id);
    return {
      kind: 'fund',
      id: f.id,
      name: holding?.name ?? f.id,
      category: f.category,
      navOrLevel: f.currentNav,
      navDate: f.navDate,
      isFund: true,
      fundManager: f.fundManager,
      expenseRatioPct: f.expenseRatioPct,
      aumCr: f.aumCr,
      rollingReturns: f.rollingReturns,
      sharpeRatio: f.sharpeRatio,
      stdDevPct: f.stdDevPct,
      maxDrawdownPct: f.maxDrawdownPct,
      betaVsDefaultBenchmark: f.betaVsDefaultBenchmark,
      jensensAlphaPct: f.jensensAlphaPct,
      history,
    };
  }
  const idx = INDEX_DETAILS[entity.id];
  if (!idx || history.length === 0) return null;
  const last = history[history.length - 1];
  return {
    kind: 'index',
    id: idx.id,
    name: idx.name,
    category: idx.category,
    navOrLevel: last.nav,
    navDate: last.date,
    isFund: false,
    rollingReturns: {
      '3Y': rollingCagr(history, 3),
      '5Y': rollingCagr(history, 5),
      '10Y': rollingCagr(history, 10),
    },
    sharpeRatio: sharpe(history),
    stdDevPct: annualizedStdDev(history),
    maxDrawdownPct: maxDrawdown(history),
    betaVsDefaultBenchmark: null,
    jensensAlphaPct: null,
    history,
  };
}

function applyPairRelativeMetrics(left: EntitySnapshot, right: EntitySnapshot): {
  left: EntitySnapshot;
  right: EntitySnapshot;
} {
  if (right.kind !== 'index' || left.kind !== 'fund') return { left, right };
  return {
    left: {
      ...left,
      betaVsDefaultBenchmark: beta(left.history, right.history),
      jensensAlphaPct: jensensAlpha(left.history, right.history),
    },
    right: {
      ...right,
      betaVsDefaultBenchmark: 1,
      jensensAlphaPct: 0,
    },
  };
}

const COMPARISON_GROUPS: ComparisonGroup[] = [
  {
    key: 'returns',
    title: 'Rolling returns',
    metrics: [
      {
        key: 'roll3',
        label: 'Rolling 3Y CAGR',
        direction: 'higher',
        format: (v) => pct(v as number | null),
        pick: (s) => s.rollingReturns['3Y'],
      },
      {
        key: 'roll5',
        label: 'Rolling 5Y CAGR',
        direction: 'higher',
        format: (v) => pct(v as number | null),
        pick: (s) => s.rollingReturns['5Y'],
      },
      {
        key: 'roll10',
        label: 'Rolling 10Y CAGR',
        direction: 'higher',
        format: (v) => pct(v as number | null),
        pick: (s) => s.rollingReturns['10Y'],
      },
    ],
  },
  {
    key: 'risk-adjusted',
    title: 'Risk-adjusted',
    metrics: [
      {
        key: 'sharpe',
        label: 'Sharpe ratio',
        direction: 'higher',
        format: (v) => num(v as number | null),
        pick: (s) => s.sharpeRatio,
      },
      {
        key: 'alpha',
        label: "Jensen's alpha",
        direction: 'higher',
        format: (v) => pct(v as number | null),
        pick: (s) => s.jensensAlphaPct,
        requiresIndexOnRight: true,
      },
      {
        key: 'beta',
        label: 'Beta',
        direction: 'neutral',
        format: (v) => num(v as number | null),
        pick: (s) => s.betaVsDefaultBenchmark,
        requiresIndexOnRight: true,
      },
    ],
  },
  {
    key: 'risk',
    title: 'Risk',
    metrics: [
      {
        key: 'std',
        label: 'Std deviation',
        direction: 'lower',
        format: (v) => (v == null ? '—' : `${(v as number).toFixed(2)}%`),
        pick: (s) => s.stdDevPct,
      },
      {
        key: 'mdd',
        label: 'Max drawdown',
        direction: 'higher',
        format: (v) => (v == null ? '—' : `${(v as number).toFixed(2)}%`),
        pick: (s) => s.maxDrawdownPct,
      },
    ],
  },
  {
    key: 'cost-profile',
    title: 'Cost & profile',
    metrics: [
      {
        key: 'expense',
        label: 'Expense ratio',
        direction: 'lower',
        format: (v, isFund) =>
          isFund && v != null ? `${(v as number).toFixed(2)}%` : '—',
        pick: (s) => s.expenseRatioPct,
      },
      {
        key: 'aum',
        label: 'AUM',
        direction: 'neutral',
        format: (v, isFund) => (isFund && v != null ? `${inr(v as number)} Cr` : '—'),
        pick: (s) => s.aumCr,
      },
    ],
  },
];

const WINDOWS: Array<{ label: ChartWindow; years: number | null }> = [
  { label: '1Y', years: 1 },
  { label: '3Y', years: 3 },
  { label: '5Y', years: 5 },
  { label: '10Y', years: 10 },
  { label: 'Max', years: null },
];

export default function CompareScreen() {
  const params = useLocalSearchParams<{
    leftKind?: EntityKind;
    leftId?: string;
    rightKind?: EntityKind;
    rightId?: string;
  }>();

  const [left, setLeft] = useState<Entity | null>(
    params.leftKind && params.leftId ? { kind: params.leftKind, id: params.leftId } : null,
  );
  const [right, setRight] = useState<Entity | null>(
    params.rightKind && params.rightId ? { kind: params.rightKind, id: params.rightId } : null,
  );
  const [selectorFor, setSelectorFor] = useState<'left' | 'right' | null>(null);
  const [windowLabel, setWindowLabel] = useState<ChartWindow>('3Y');

  const leftSnap = useMemo(() => (left ? buildSnapshot(left) : null), [left]);
  const rightSnap = useMemo(() => (right ? buildSnapshot(right) : null), [right]);

  const { adjustedLeft, adjustedRight } = useMemo(() => {
    if (!leftSnap || !rightSnap) return { adjustedLeft: leftSnap, adjustedRight: rightSnap };
    const pair = applyPairRelativeMetrics(leftSnap, rightSnap);
    return { adjustedLeft: pair.left, adjustedRight: pair.right };
  }, [leftSnap, rightSnap]);

  const chartWindow = WINDOWS.find((w) => w.label === windowLabel)!;

  const chartSeries = useMemo(() => {
    if (!adjustedLeft || !adjustedRight) return null;
    const lh = sliceWindow(adjustedLeft.history, chartWindow.years);
    const rh = sliceWindow(adjustedRight.history, chartWindow.years);
    const n = Math.min(lh.length, rh.length);
    const lt = lh.slice(lh.length - n);
    const rt = rh.slice(rh.length - n);
    return {
      left: { label: adjustedLeft.name, color: LEFT_COLOR, values: rebaseToHundred(lt) },
      right: { label: adjustedRight.name, color: RIGHT_COLOR, values: rebaseToHundred(rt) },
      xLabels: {
        start: lt.length > 0 ? lt[0].date.slice(0, 7) : '',
        end: lt.length > 0 ? lt[lt.length - 1].date.slice(0, 7) : '',
      },
    };
  }, [adjustedLeft, adjustedRight, chartWindow]);

  function handlePick(entity: Entity) {
    if (selectorFor === 'left') setLeft(entity);
    else if (selectorFor === 'right') setRight(entity);
    setSelectorFor(null);
  }

  function swap() {
    const a = left;
    const b = right;
    setLeft(b);
    setRight(a);
  }

  return (
    <View className="flex-1 bg-background">
      <TopAppBar title="Compare" onBackPress={() => router.back()} rightIcon={null} />

      <SafeAreaView edges={['bottom']} className="flex-1">
        <View className="px-container-margin pt-stack-md pb-stack-sm border-b border-outline-variant/15">
          <View className="flex-row items-center gap-2">
            <EntityHeaderChip
              snapshot={adjustedLeft}
              accentColor={LEFT_COLOR}
              side="left"
              onPress={() => setSelectorFor('left')}
            />
            <Pressable
              onPress={swap}
              disabled={!left || !right}
              className="w-9 h-9 items-center justify-center rounded-full bg-surface-container"
              style={({ pressed }) => ({ opacity: pressed ? 0.6 : (left && right ? 1 : 0.4) })}
              accessibilityLabel="Swap sides"
            >
              <Icon name="swap-horizontal" size={18} color="#bec6e0" />
            </Pressable>
            <EntityHeaderChip
              snapshot={adjustedRight}
              accentColor={RIGHT_COLOR}
              side="right"
              onPress={() => setSelectorFor('right')}
            />
          </View>
        </View>

        <ScrollView
          contentContainerClassName="px-container-margin py-stack-md gap-stack-md pb-stack-lg"
          showsVerticalScrollIndicator={false}
        >
          {adjustedLeft && adjustedRight ? (
            <>
              <Card>
                <Text variant="label-caps" color="text-on-surface-variant" className="mb-stack-sm">
                  Cumulative returns (rebased to 100)
                </Text>
                {chartSeries ? (
                  <LineChart
                    series={[chartSeries.left, chartSeries.right]}
                    xLabels={chartSeries.xLabels}
                  />
                ) : null}
                <View className="flex-row flex-wrap gap-2 mt-stack-md">
                  {WINDOWS.map((w) => (
                    <Chip
                      key={w.label}
                      label={w.label}
                      tone={windowLabel === w.label ? 'success' : 'default'}
                      selected={windowLabel === w.label}
                      onPress={() => setWindowLabel(w.label)}
                    />
                  ))}
                </View>
              </Card>

              {COMPARISON_GROUPS.map((group) => {
                const visibleMetrics = group.metrics.filter((m) =>
                  m.requiresIndexOnRight ? adjustedRight.kind === 'index' : true,
                );
                if (visibleMetrics.length === 0) return null;
                return (
                  <Card key={group.key}>
                    <Text variant="label-caps" color="text-on-surface-variant" className="mb-stack-sm">
                      {group.title}
                    </Text>
                    {visibleMetrics.map((metric) => (
                      <MetricRow
                        key={metric.key}
                        metric={metric}
                        left={adjustedLeft}
                        right={adjustedRight}
                      />
                    ))}
                  </Card>
                );
              })}

              <Card>
                <Text variant="label-caps" color="text-on-surface-variant" className="mb-stack-sm">
                  Profile
                </Text>
                <View className="flex-row items-center py-2.5 border-b border-outline-variant/15">
                  <View className="flex-[1.1] pr-2">
                    <Text variant="label-caps" color="text-on-surface-variant">
                      Category
                    </Text>
                  </View>
                  <View className="flex-1 items-end">
                    <Text variant="body-md" color="text-on-surface" numberOfLines={2}>
                      {adjustedLeft.category}
                    </Text>
                  </View>
                  <View className="flex-1 items-end">
                    <Text variant="body-md" color="text-on-surface" numberOfLines={2}>
                      {adjustedRight.category}
                    </Text>
                  </View>
                </View>
                <View className="flex-row items-center py-2.5">
                  <View className="flex-[1.1] pr-2">
                    <Text variant="label-caps" color="text-on-surface-variant">
                      Fund manager
                    </Text>
                  </View>
                  <View className="flex-1 items-end">
                    <Text variant="body-md" color="text-on-surface" numberOfLines={1}>
                      {dash(adjustedLeft.fundManager)}
                    </Text>
                  </View>
                  <View className="flex-1 items-end">
                    <Text variant="body-md" color="text-on-surface" numberOfLines={1}>
                      {dash(adjustedRight.fundManager)}
                    </Text>
                  </View>
                </View>
              </Card>

              <Card variant="outline">
                <Text variant="label-caps" color="text-on-surface-variant">
                  Returns shown are rolling and may differ from trailing returns on the fund
                  detail page. Comparison data is illustrative.
                </Text>
              </Card>
            </>
          ) : (
            <Card>
              <Text variant="body-md" color="text-on-surface-variant" className="text-center">
                Pick a fund and a fund or index to compare.
              </Text>
            </Card>
          )}
        </ScrollView>
      </SafeAreaView>

      <EntitySelectorModal
        visible={selectorFor !== null}
        initialTab={selectorFor === 'right' ? 'index' : 'fund'}
        excludeId={selectorFor === 'left' ? right?.id : left?.id}
        onSelect={handlePick}
        onDismiss={() => setSelectorFor(null)}
      />
    </View>
  );
}
