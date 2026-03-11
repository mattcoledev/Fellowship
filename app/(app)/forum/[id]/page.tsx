import { notFound } from 'next/navigation'
import { ThreadDetail } from '@/components/forum/ThreadDetail'
import { getThreadById, getThreadReplies } from '@/lib/db'
import { createClient } from '@/lib/supabase/server'

interface ThreadPageProps {
  params: Promise<{ id: string }>
}

export default async function ThreadPage({ params }: ThreadPageProps) {
  const { id } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let isAdmin = false
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()
    isAdmin = profile?.is_admin ?? false
  }

  try {
    const thread = await getThreadById(id)
    const replies = await getThreadReplies(id)

    return (
      <ThreadDetail
        thread={thread}
        replies={replies}
        currentUserId={user?.id || null}
        isAdmin={isAdmin}
      />
    )
  } catch {
    notFound()
  }
}
