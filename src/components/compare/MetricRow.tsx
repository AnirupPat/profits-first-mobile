import { View } from 'react-native';
import { Text } from '@/components/ui/Text';
import { Icon } from '@/components/ui/Icon';
import type { EntitySnapshot, MetricDefinition } from '@/types/compare';

export type MetricRowProps = {
  metric: MetricDefinition;
  left: EntitySnapshot;
  right: EntitySnapshot;
};

function determineWinner(
  leftVal: number | null | undefined,
  rightVal: number | null | undefined,
  direction: MetricDefinition['direction'],
): 'left' | 'right' | null {
  if (direction === 'neutral') return null;
  if (leftVal == null || rightVal == null) return null;
  if (leftVal === rightVal) return null;
  if (direction === 'higher') return leftVal > rightVal ? 'left' : 'right';
  return leftVal < rightVal ? 'left' : 'right';
}

function shouldRender(metric: MetricDefinition, right: EntitySnapshot): boolean {
  if (metric.requiresIndexOnRight && right.kind !== 'index') return false;
  return true;
}

export function MetricRow({ metric, left, right }: MetricRowProps) {
  if (!shouldRender(metric, right)) return null;

  const lv = metric.pick(left);
  const rv = metric.pick(right);
  const winner = determineWinner(lv, rv, metric.direction);

  return (
    <View className="flex-row items-center py-2.5 border-b border-outline-variant/15">
      <View className="flex-[1.1] pr-2">
        <Text variant="label-caps" color="text-on-surface-variant" numberOfLines={2}>
          {metric.label}
        </Text>
      </View>
      <View className="flex-1 items-end">
        <View className="flex-row items-center gap-1">
          <Text
            variant="body-md"
            color={winner === 'left' ? 'text-secondary' : 'text-on-surface'}
            className={winner === 'left' ? 'font-manrope-semibold' : undefined}
          >
            {metric.format(lv, left.isFund)}
          </Text>
          {winner === 'left' ? (
            <Icon
              name={metric.direction === 'higher' ? 'expand_less' : 'expand_more'}
              size={12}
              color="#99d4ae"
            />
          ) : null}
        </View>
      </View>
      <View className="flex-1 items-end">
        <View className="flex-row items-center gap-1">
          <Text
            variant="body-md"
            color={winner === 'right' ? 'text-secondary' : 'text-on-surface'}
            className={winner === 'right' ? 'font-manrope-semibold' : undefined}
          >
            {metric.format(rv, right.isFund)}
          </Text>
          {winner === 'right' ? (
            <Icon
              name={metric.direction === 'higher' ? 'expand_less' : 'expand_more'}
              size={12}
              color="#99d4ae"
            />
          ) : null}
        </View>
      </View>
    </View>
  );
}
