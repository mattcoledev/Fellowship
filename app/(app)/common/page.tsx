import { getPublishedPosts, getPostReadsMap } from '@/lib/db'
import { CommonRoomFeed } from '@/components/room/CommonRoomFeed'
import { createClient } from '@/lib/supabase/server'

export default async function CommonRoomPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const posts = await getPublishedPosts()

  const readMap = user
    ? await getPostReadsMap(user.id, posts.map(p => p.id))
    : {}

  return <CommonRoomFeed initialPosts={posts} readMap={readMap} />
}
