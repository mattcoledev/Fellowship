import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PostEditor } from '@/components/posts/PostEditor'

export default async function NewPostPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return <PostEditor userId={user.id} />
}
