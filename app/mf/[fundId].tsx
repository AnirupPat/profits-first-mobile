import { View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { TopAppBar } from '@/components/layout/TopAppBar';
import { Text } from '@/components/ui/Text';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { Button } from '@/components/ui/Button';
import { MOCK_HOLDINGS } from '@/data/mockHoldings';
import { FUND_DETAILS, type RiskLevel } from '@/data/mockFunds';
import { inr, inrCompact } from '@/utils/format';

const RISK_SEGMENTS: Array<{ label: string; color: string }> = [
  { label: 'Low', color: '#4ade80' },
  { label: 'L-Mod', color: '#86efac' },
  { label: 'Mod', color: '#fbbf24' },
  { label: 'M-Hi', color: '#f97316' },
  { label: 'High', color: '#ef4444' },
  { label: 'V-Hi', color: '#dc2626' },
];

const RISK_INDEX: Record<RiskLevel, number> = {
  Low: 0,
  'Low to Moderate': 1,
  Moderate: 2,
  'Moderately High': 3,
  High: 4,
  'Very High': 5,
};

const RISK_CHIP_TONE: Record<RiskLevel, 'success' | 'info' | 'warning' | 'danger'> = {
  Low: 'success',
  'Low to Moderate': 'success',
  Moderate: 'info',
  'Moderately High': 'warning',
  High: 'danger',
  'Very High': 'danger',
};

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-1 bg-surface-container-low rounded-lg p-3 items-start">
      <Text variant="label-caps" color="text-on-surface-variant" className="mb-1">
        {label}
      </Text>
      <Text variant="body-md" color="text-on-surface" className="font-manrope-semibold">
        {value}
      </Text>
    </View>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row justify-between py-2.5 border-b border-outline-variant/20">
      <Text variant="body-md" color="text-on-surface-variant">
        {label}
      </Text>
      <Text variant="body-md" color="text-on-surface">
        {value}
      </Text>
    </View>
  );
}

export default function FundDetailScreen() {
  const { fundId } = useLocalSearchParams<{ fundId: string }>();
  const holding = MOCK_HOLDINGS.find((h) => h.id === fundId);
  const fund = FUND_DETAILS[fundId ?? ''];

  if (!holding || !fund) {
    return (
      <View className="flex-1 bg-background">
        <TopAppBar title="Fund Detail" onBackPress={() => router.back()} rightIcon={null} />
        <ScreenContainer edges={[]} contentClassName="items-center justify-center">
          <Text variant="body-md" color="text-on-surface-variant">
            Fund not found.
          </Text>
        </ScreenContainer>
      </View>
    );
  }

  const navPositive = fund.navChange >= 0;
  const riskIdx = RISK_INDEX[fund.riskLevel];

  return (
    <View className="flex-1 bg-background">
      <TopAppBar title={holding.name} onBackPress={() => router.back()} rightIcon={null} />
      <ScreenContainer scroll edges={[]} contentClassName="gap-stack-md pb-stack-lg">

        {/* NAV header */}
        <Card variant="high">
          <Text variant="label-caps" color="text-on-surface-variant">
            Current NAV ({fund.navDate})
          </Text>
          <Text variant="headline-lg" color="text-on-surface" className="mt-1">
            ₹{fund.currentNav.toFixed(2)}
          </Text>
          <View className="flex-row items-center gap-2 mt-stack-sm">
            <Chip
              label={`${navPositive ? '+' : ''}₹${Math.abs(fund.navChange).toFixed(2)} (${navPositive ? '+' : ''}${fund.navChangePct.toFixed(2)}%)`}
              tone={navPositive ? 'success' : 'danger'}
            />
          </View>
        </Card>

        {/* Your position */}
        <Card>
          <Text variant="label-caps" color="text-on-surface-variant" className="mb-stack-sm">
            Your position
          </Text>
          <View className="flex-row gap-2">
            <StatBox label="Current value" value={inrCompact(holding.currentValue)} />
            <StatBox label="Invested" value={inrCompact(holding.invested)} />
          </View>
          <View className="flex-row gap-2 mt-2">
            <StatBox label="Units held" value={holding.units.toFixed(1)} />
            <StatBox
              label="Returns"
              value={`${holding.returnsPct >= 0 ? '+' : ''}${holding.returnsPct.toFixed(1)}%`}
            />
          </View>
        </Card>

        {/* Fund stats */}
        <Card>
          <Text variant="label-caps" color="text-on-surface-variant" className="mb-stack-sm">
            Fund metrics
          </Text>
          <View className="flex-row gap-2">
            <StatBox label="AUM" value={`${inr(fund.aumCr)} Cr`} />
            <StatBox label="Sharpe Ratio" value={fund.sharpeRatio.toFixed(2)} />
          </View>
          <View className="flex-row gap-2 mt-2">
            <StatBox label="Churn Ratio" value={`${fund.churnRatioPct}%`} />
            <StatBox label="Expense Ratio" value={`${fund.expenseRatioPct}%`} />
          </View>
        </Card>

        {/* Riskometer */}
        <Card>
          <Text variant="label-caps" color="text-on-surface-variant" className="mb-stack-md">
            Riskometer
          </Text>
          <View className="flex-row gap-1 mb-2">
            {RISK_SEGMENTS.map((seg, i) => (
              <View
                key={seg.label}
                className="flex-1 h-2 rounded-full"
                style={{
                  backgroundColor: seg.color,
                  opacity: i === riskIdx ? 1 : 0.2,
                }}
              />
            ))}
          </View>
          <View className="flex-row items-center justify-between mt-1">
            <Text variant="label-caps" color="text-on-surface-variant">
              Low
            </Text>
            <Chip label={fund.riskLevel} tone={RISK_CHIP_TONE[fund.riskLevel]} />
            <Text variant="label-caps" color="text-on-surface-variant">
              Very High
            </Text>
          </View>
        </Card>

        {/* Fund details */}
        <Card>
          <Text variant="label-caps" color="text-on-surface-variant" className="mb-2">
            Fund details
          </Text>
          <DetailRow label="Category" value={fund.category} />
          <DetailRow label="Launch Date" value={fund.launchDate} />
          <View className="flex-row justify-between pt-2.5">
            <Text variant="body-md" color="text-on-surface-variant">
              Fund Manager
            </Text>
            <Text variant="body-md" color="text-on-surface">
              {fund.fundManager}
            </Text>
          </View>
        </Card>

        {/* Returns */}
        <Card>
          <Text variant="label-caps" color="text-on-surface-variant" className="mb-stack-sm">
            Performance returns
          </Text>
          <View className="flex-row gap-2">
            <StatBox label="1Y Return" value={`+${fund.returns1Y.toFixed(2)}%`} />
            <StatBox label="3Y Return" value={`+${fund.returns3Y.toFixed(2)}%`} />
            <StatBox label="5Y Return" value={`+${fund.returns5Y.toFixed(2)}%`} />
          </View>
        </Card>

        {/* Top holdings */}
        <Card>
          <View className="flex-row items-center justify-between mb-stack-md">
            <Text variant="label-caps" color="text-on-surface-variant">
              Top Holdings
            </Text>
            <Text variant="label-caps" color="text-on-surface-variant">
              {`Total ${fund.topHoldings.length} stocks`}
            </Text>
          </View>
          {fund.topHoldings.map((th) => (
            <View key={th.name} className="mb-3">
              <View className="flex-row items-center justify-between mb-1">
                <View className="flex-1 mr-3">
                  <Text variant="body-md" color="text-on-surface" numberOfLines={1}>
                    {th.name}
                  </Text>
                  <Text variant="label-caps" color="text-on-surface-variant">
                    {th.sector}
                  </Text>
                </View>
                <Text variant="body-md" color="text-on-surface">
                  {th.pct.toFixed(2)}%
                </Text>
              </View>
              <View className="w-full bg-surface-variant rounded-full h-1.5 overflow-hidden">
                <View
                  className="h-full rounded-full bg-secondary"
                  style={{ width: `${Math.min(100, th.pct * 5)}%` }}
                />
              </View>
            </View>
          ))}
        </Card>

        {/* Actions */}
        <View className="flex-row gap-stack-md">
          <View className="flex-1">
            <Button label="Redeem" variant="outline" fullWidth />
          </View>
          <View className="flex-1">
            <Button label="Invest More" variant="primary" fullWidth />
          </View>
        </View>

      </ScreenContainer>
    </View>
  );
}
