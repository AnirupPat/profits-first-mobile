import { useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/Text';
import { Icon } from '@/components/ui/Icon';
import { Chip } from '@/components/ui/Chip';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { FUND_DETAILS } from '@/data/mockFunds';
import { INDEX_LIST } from '@/data/mockIndices';
import { MOCK_HOLDINGS } from '@/data/mockHoldings';
import type { Entity, EntityKind } from '@/types/compare';

export type EntitySelectorModalProps = {
  visible: boolean;
  initialTab?: EntityKind;
  onSelect: (entity: Entity) => void;
  onDismiss: () => void;
  excludeId?: string;
};

type FundRow = { id: string; name: string; sub: string; isHolding: boolean };
type IndexRow = { id: string; name: string; sub: string };

const ALL_FUNDS: FundRow[] = Object.values(FUND_DETAILS).map((f) => ({
  id: f.id,
  name: MOCK_HOLDINGS.find((h) => h.id === f.id)?.name ?? f.id,
  sub: f.category,
  isHolding: MOCK_HOLDINGS.some((h) => h.id === f.id),
}));

const ALL_INDICES: IndexRow[] = INDEX_LIST.map((idx) => ({
  id: idx.id,
  name: idx.name,
  sub: idx.category,
}));

function matches(query: string, row: { name: string; sub: string }): boolean {
  if (!query) return true;
  const q = query.trim().toLowerCase();
  return row.name.toLowerCase().includes(q) || row.sub.toLowerCase().includes(q);
}

export function EntitySelectorModal({
  visible,
  initialTab = 'fund',
  onSelect,
  onDismiss,
  excludeId,
}: EntitySelectorModalProps) {
  const [tab, setTab] = useState<EntityKind>(initialTab);
  const [query, setQuery] = useState('');

  const filteredFunds = useMemo(
    () => ALL_FUNDS.filter((r) => r.id !== excludeId && matches(query, r)),
    [query, excludeId],
  );
  const filteredIndices = useMemo(
    () => ALL_INDICES.filter((r) => r.id !== excludeId && matches(query, r)),
    [query, excludeId],
  );

  const holdingFunds = filteredFunds.filter((r) => r.isHolding);
  const otherFunds = filteredFunds.filter((r) => !r.isHolding);

  function pick(kind: EntityKind, id: string) {
    onSelect({ kind, id });
    setQuery('');
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onDismiss}
    >
      <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-background">
        <View className="flex-row items-center justify-between px-container-margin h-14 border-b border-outline-variant/20">
          <Text variant="headline-md" color="text-on-surface">
            Pick to compare
          </Text>
          <Pressable
            onPress={onDismiss}
            className="w-10 h-10 items-center justify-center rounded-full"
            accessibilityLabel="Close selector"
          >
            <Icon name="close" size={22} color="#bec6e0" />
          </Pressable>
        </View>

        <View className="px-container-margin pt-stack-md gap-stack-md">
          <View className="flex-row gap-2">
            <Chip
              label="Funds"
              tone={tab === 'fund' ? 'success' : 'default'}
              selected={tab === 'fund'}
              onPress={() => setTab('fund')}
            />
            <Chip
              label="Indices"
              tone={tab === 'index' ? 'success' : 'default'}
              selected={tab === 'index'}
              onPress={() => setTab('index')}
            />
          </View>
          <Input
            placeholder={tab === 'fund' ? 'Search funds' : 'Search indices'}
            value={query}
            onChangeText={setQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <ScrollView
          contentContainerClassName="px-container-margin py-stack-md gap-stack-sm"
          showsVerticalScrollIndicator={false}
        >
          {tab === 'fund' ? (
            <>
              {holdingFunds.length > 0 ? (
                <>
                  <Text variant="label-caps" color="text-on-surface-variant" className="mt-1 mb-1">
                    Your holdings
                  </Text>
                  {holdingFunds.map((r) => (
                    <ResultRow key={r.id} name={r.name} sub={r.sub} onPress={() => pick('fund', r.id)} />
                  ))}
                </>
              ) : null}
              {otherFunds.length > 0 ? (
                <>
                  <Text variant="label-caps" color="text-on-surface-variant" className="mt-stack-md mb-1">
                    All funds
                  </Text>
                  {otherFunds.map((r) => (
                    <ResultRow key={r.id} name={r.name} sub={r.sub} onPress={() => pick('fund', r.id)} />
                  ))}
                </>
              ) : null}
              {filteredFunds.length === 0 ? <EmptyState /> : null}
            </>
          ) : (
            <>
              {filteredIndices.length > 0 ? (
                filteredIndices.map((r) => (
                  <ResultRow
                    key={r.id}
                    name={r.name}
                    sub={r.sub}
                    badge="Index"
                    onPress={() => pick('index', r.id)}
                  />
                ))
              ) : (
                <EmptyState />
              )}
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

type ResultRowProps = { name: string; sub: string; badge?: string; onPress: () => void };

function ResultRow({ name, sub, badge, onPress }: ResultRowProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
      accessibilityRole="button"
    >
      <Card variant="low">
        <View className="flex-row items-center justify-between gap-3">
          <View className="flex-1">
            <Text
              variant="body-md"
              color="text-on-surface"
              numberOfLines={2}
              className="font-manrope-semibold"
            >
              {name}
            </Text>
            <Text variant="label-caps" color="text-on-surface-variant" className="mt-1">
              {sub}
            </Text>
          </View>
          {badge ? <Chip label={badge} tone="info" /> : null}
        </View>
      </Card>
    </Pressable>
  );
}

function EmptyState() {
  return (
    <View className="items-center py-stack-lg">
      <Text variant="body-md" color="text-on-surface-variant">
        No matches.
      </Text>
    </View>
  );
}
