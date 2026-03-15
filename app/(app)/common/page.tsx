import { getPublishedPosts, getPostReadsMap, getPostCommentCountsMap } from '@/lib/db'
import { CommonRoomFeed } from '@/components/room/CommonRoomFeed'
import { createClient } from '@/lib/supabase/server'

export default async function CommonRoomPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const posts = await getPublishedPosts()
  const postIds = posts.map(p => p.id)

  const [readMap, commentCountsMap] = await Promise.all([
    user ? getPostReadsMap(user.id, postIds) : Promise.resolve({}),
    getPostCommentCountsMap(postIds),
  ])

  return <CommonRoomFeed initialPosts={posts} readMap={readMap} commentCountsMap={commentCountsMap} />
}
