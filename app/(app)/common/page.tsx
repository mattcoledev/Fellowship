import { getPublishedPosts } from '@/lib/db'
import { CommonRoomFeed } from '@/components/room/CommonRoomFeed'

export default async function CommonRoomPage() {
  const posts = await getPublishedPosts()
  return <CommonRoomFeed initialPosts={posts} />
}
