import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getUserPosts } from '@/lib/db'
import { RoomDashboard } from '@/components/room/RoomDashboard'

export default async function YourRoomPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const posts = await getUserPosts(user.id)

  return <RoomDashboard posts={posts} />
}
