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
  
  try {
    const thread = await getThreadById(id)
    const replies = await getThreadReplies(id)

    return (
      <ThreadDetail 
        thread={thread} 
        replies={replies} 
        currentUserId={user?.id || null}
      />
    )
  } catch {
    notFound()
  }
}
