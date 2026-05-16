import { View } from 'react-native';
import { router } from 'expo-router';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { TopAppBar } from '@/components/layout/TopAppBar';
import { Text } from '@/components/ui/Text';
import { PostCard } from '@/components/community/PostCard';
import { MOCK_COMMUNITY_POSTS } from '@/data/mockCommunityPosts';

export default function CommunityScreen() {
  return (
    <View className="flex-1 bg-background">
      <TopAppBar title="Community" onRightPress={() => router.push('/help')} />
      <ScreenContainer scroll edges={[]} contentClassName="gap-stack-md pb-stack-lg">
        <View>
          <Text variant="headline-lg" color="text-on-surface">
            Featured Insights
          </Text>
          <Text variant="body-md" color="text-on-surface-variant" className="mt-1">
            What Sanjay and the wider Profits-First desk are watching this week.
          </Text>
        </View>

        {MOCK_COMMUNITY_POSTS.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </ScreenContainer>
    </View>
  );
}
