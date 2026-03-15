import { getActivityFeed, getRecentPublishedPosts, getRecentThreads } from '@/lib/db'
import { ActivityFeed } from '@/components/home/ActivityFeed'

export default async function HomePage() {
  const [activity, recentPosts, recentThreads] = await Promise.all([
    getActivityFeed(12),
    getRecentPublishedPosts(5),
    getRecentThreads(5),
  ])

  return (
    <ActivityFeed
      activity={activity}
      recentPosts={recentPosts}
      recentThreads={recentThreads}
    />
  )
}
