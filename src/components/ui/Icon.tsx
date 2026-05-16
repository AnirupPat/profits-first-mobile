import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';

type MCIName = ComponentProps<typeof MaterialCommunityIcons>['name'];

const NAME_MAP: Record<string, MCIName> = {
  home: 'home',
  account_balance_wallet: 'wallet',
  wallet: 'wallet',
  groups: 'account-group',
  support_agent: 'headset',
  notifications: 'bell',
  bell: 'bell',
  flight_takeoff: 'airplane-takeoff',
  check_circle: 'check-circle',
  add: 'plus',
  plus: 'plus',
  close: 'close',
  search: 'magnify',
  settings: 'cog',
  account_circle: 'account-circle',
  chevron_right: 'chevron-right',
  chevron_left: 'chevron-left',
  expand_more: 'chevron-down',
  expand_less: 'chevron-up',
  arrow_forward: 'arrow-right',
  arrow_back: 'arrow-left',
  info: 'information',
  warning: 'alert',
  error: 'alert-circle',
  shield: 'shield',
  flag: 'flag',
  trending_up: 'trending-up',
  trending_down: 'trending-down',
  upload: 'upload',
  attach_file: 'paperclip',
  calendar_today: 'calendar-blank',
  schedule: 'clock-outline',
  call: 'phone',
  goal: 'target',
  pie_chart: 'chart-donut',
  bar_chart: 'chart-bar',
  show_chart: 'chart-line',
  thumb_up: 'thumb-up',
  comment: 'comment',
  share: 'share-variant',
  favorite: 'heart',
  star: 'star',
  lock: 'lock',
  visibility: 'eye',
  visibility_off: 'eye-off',
};

export type IconName = keyof typeof NAME_MAP | MCIName;

export type IconProps = {
  name: IconName;
  size?: number;
  color?: string;
};

export function Icon({ name, size = 24, color = '#e4e2e4' }: IconProps) {
  const resolved = (NAME_MAP[name as string] ?? name) as MCIName;
  return <MaterialCommunityIcons name={resolved} size={size} color={color} />;
}
