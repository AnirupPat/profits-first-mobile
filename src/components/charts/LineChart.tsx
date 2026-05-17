import { useState } from 'react';
import { View } from 'react-native';
import Svg, { G, Line, Polyline, Text as SvgText } from 'react-native-svg';
import { Text } from '@/components/ui/Text';

export type LineSeries = {
  label: string;
  color: string;
  values: number[];
};

export type LineChartProps = {
  series: [LineSeries, LineSeries];
  xLabels: { start: string; end: string };
  height?: number;
};

const PADDING_X = 24;
const PADDING_TOP = 12;
const PADDING_BOTTOM = 24;
const GRID_LINES = 4;

export function LineChart({ series, xLabels, height = 180 }: LineChartProps) {
  const [width, setWidth] = useState(0);

  const allValues = series.flatMap((s) => s.values).filter((v) => Number.isFinite(v));
  const minY = allValues.length ? Math.min(...allValues) : 0;
  const maxY = allValues.length ? Math.max(...allValues) : 100;
  const yPad = (maxY - minY) * 0.08 || 1;
  const yLow = minY - yPad;
  const yHigh = maxY + yPad;

  const innerW = Math.max(width - PADDING_X * 2, 0);
  const innerH = height - PADDING_TOP - PADDING_BOTTOM;

  function pointsFor(values: number[]): string {
    if (values.length === 0 || innerW === 0) return '';
    const stepX = values.length > 1 ? innerW / (values.length - 1) : 0;
    return values
      .map((v, i) => {
        const x = PADDING_X + i * stepX;
        const yNorm = (v - yLow) / (yHigh - yLow);
        const y = PADDING_TOP + innerH - yNorm * innerH;
        return `${x.toFixed(2)},${y.toFixed(2)}`;
      })
      .join(' ');
  }

  const gridY = Array.from({ length: GRID_LINES + 1 }, (_, i) => {
    const ratio = i / GRID_LINES;
    return PADDING_TOP + innerH * ratio;
  });

  return (
    <View>
      <View
        style={{ height, width: '100%' }}
        onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
      >
        {width > 0 ? (
          <Svg width={width} height={height}>
            <G>
              {gridY.map((y, i) => (
                <Line
                  key={i}
                  x1={PADDING_X}
                  x2={width - PADDING_X}
                  y1={y}
                  y2={y}
                  stroke="#45464d"
                  strokeOpacity={0.3}
                  strokeWidth={1}
                />
              ))}
              <SvgText
                x={PADDING_X}
                y={PADDING_TOP + 4}
                fontSize={10}
                fill="#909097"
              >
                {Math.round(yHigh)}
              </SvgText>
              <SvgText
                x={PADDING_X}
                y={PADDING_TOP + innerH - 2}
                fontSize={10}
                fill="#909097"
              >
                {Math.round(yLow)}
              </SvgText>
              {series.map((s, i) => (
                <Polyline
                  key={i}
                  points={pointsFor(s.values)}
                  fill="none"
                  stroke={s.color}
                  strokeWidth={2}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              ))}
              <SvgText
                x={PADDING_X}
                y={height - 6}
                fontSize={10}
                fill="#909097"
              >
                {xLabels.start}
              </SvgText>
              <SvgText
                x={width - PADDING_X}
                y={height - 6}
                fontSize={10}
                fill="#909097"
                textAnchor="end"
              >
                {xLabels.end}
              </SvgText>
            </G>
          </Svg>
        ) : null}
      </View>
      <View className="flex-row items-center gap-stack-md mt-stack-sm">
        {series.map((s) => (
          <View key={s.label} className="flex-row items-center gap-1.5">
            <View
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: s.color }}
            />
            <Text variant="label-caps" color="text-on-surface-variant" numberOfLines={1}>
              {s.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
