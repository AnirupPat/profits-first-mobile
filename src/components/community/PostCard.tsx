import { View, Text as RNText } from 'react-native';
import Svg, {
  Polyline,
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
  Rect,
} from 'react-native-svg';
import { Text } from '@/components/ui/Text';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { Icon } from '@/components/ui/Icon';
import { SanjayAvatar } from '@/components/brand/SanjayAvatar';
import type { CommunityPost, PostAuthorType } from '@/data/mockCommunityPosts';

const AUTHOR_BG: Record<PostAuthorType, string> = {
  advisor: '#1e2a44',
  analyst: '#1d3a2a',
  member: '#3a2730',
};

const AUTHOR_FG: Record<PostAuthorType, string> = {
  advisor: '#aab5d0',
  analyst: '#9bd6b3',
  member: '#e8b7b7',
};

function InitialsAvatar({
  initials,
  type,
  size = 40,
}: {
  initials: string;
  type: PostAuthorType;
  size?: number;
}) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: AUTHOR_BG[type],
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <RNText
        style={{
          color: AUTHOR_FG[type],
          fontFamily: 'Manrope_700Bold',
          fontSize: Math.round(size * 0.34),
          letterSpacing: -0.4,
        }}
      >
        {initials}
      </RNText>
    </View>
  );
}

function Sparkline({ data, color = '#99d4ae' }: { data: number[]; color?: string }) {
  const width = 280;
  const height = 80;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const stepX = width / (data.length - 1);
  const points = data
    .map((v, i) => {
      const y = height - ((v - min) / range) * (height * 0.75) - 8;
      return `${(i * stepX).toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
  return (
    <Svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      <Defs>
        <SvgLinearGradient id="sparklineGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor={color} stopOpacity={0.28} />
          <Stop offset="100%" stopColor={color} stopOpacity={0} />
        </SvgLinearGradient>
      </Defs>
      <Rect x="0" y="0" width={width} height={height} fill="url(#sparklineGrad)" />
      <Polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth={2.5}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </Svg>
  );
}

export type PostCardProps = {
  post: CommunityPost;
};

export function PostCard({ post }: PostCardProps) {
  const isSanjay = post.authorType === 'advisor' && post.initials === 'SK';

  return (
    <Card variant={post.featured ? 'high' : 'default'}>
      <View className="flex-row items-center gap-3 mb-stack-md">
        {isSanjay ? (
          <SanjayAvatar size={40} rounded="circle" />
        ) : (
          <InitialsAvatar initials={post.initials} type={post.authorType} />
        )}
        <View className="flex-1">
          <Text variant="body-md" color="text-on-surface" className="font-manrope-semibold">
            {post.authorName}
          </Text>
          <Text variant="label-caps" color="text-on-surface-variant" numberOfLines={1}>
            {post.authorRole} · {post.timestamp}
          </Text>
        </View>
      </View>

      <Text variant="headline-md" color="text-on-surface" className="mb-stack-sm">
        {post.headline}
      </Text>

      <Text variant="body-md" color="text-on-surface-variant">
        {post.body}
      </Text>

      {post.tag ? (
        <View className="flex-row mt-stack-sm">
          <Chip label={post.tag} tone="info" />
        </View>
      ) : null}

      {post.featured && post.chartData ? (
        <View className="mt-stack-md rounded-lg overflow-hidden bg-surface-container-low">
          <Sparkline data={post.chartData} />
        </View>
      ) : null}

      <View className="flex-row items-center gap-stack-md mt-stack-md pt-stack-sm border-t border-outline-variant/20">
        <View className="flex-row items-center gap-1.5">
          <Icon name="thumb_up" size={16} color="#909097" />
          <Text variant="label-caps" color="text-on-surface-variant">
            {post.likes}
          </Text>
        </View>
        <View className="flex-row items-center gap-1.5">
          <Icon name="comment" size={16} color="#909097" />
          <Text variant="label-caps" color="text-on-surface-variant">
            {post.comments}
          </Text>
        </View>
        {post.featured ? (
          <View className="ml-auto flex-row items-center gap-1.5">
            <Icon name="star" size={16} color="#edbaba" />
            <Text variant="label-caps" color="text-tertiary">
              Featured
            </Text>
          </View>
        ) : null}
      </View>
    </Card>
  );
}
