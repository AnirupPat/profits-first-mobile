import type { ReactNode } from 'react';
import { View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

export type DonutChartProps = {
  /** 0..1 fill ratio */
  value: number;
  size?: number;
  strokeWidth?: number;
  trackColor?: string;
  fillColor?: string;
  children?: ReactNode;
};

export function DonutChart({
  value,
  size = 96,
  strokeWidth = 10,
  trackColor = '#353436',
  fillColor = '#99d4ae',
  children,
}: DonutChartProps) {
  const radius = (size - strokeWidth) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(1, value));
  const dash = circumference * clamped;
  return (
    <View style={{ width: size, height: size }} className="items-center justify-center">
      <Svg width={size} height={size} style={{ position: 'absolute' }}>
        <Circle cx={cx} cy={cy} r={radius} stroke={trackColor} strokeWidth={strokeWidth} fill="none" />
        <Circle
          cx={cx}
          cy={cy}
          r={radius}
          stroke={fillColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${dash} ${circumference - dash}`}
          strokeDashoffset={circumference / 4}
          strokeLinecap="round"
          transform={`rotate(-90 ${cx} ${cy})`}
        />
      </Svg>
      {children}
    </View>
  );
}
