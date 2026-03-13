'use server'

import { createClient } from '@/lib/supabase/server'

export async function markThreadRead(threadId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase
    .from('thread_reads')
    .upsert(
      { user_id: user.id, thread_id: threadId, last_seen_at: new Date().toISOString() },
      { onConflict: 'user_id,thread_id' }
    )
}

export async function markPostRead(postId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase
    .from('post_reads')
    .upsert(
      { user_id: user.id, post_id: postId, last_seen_at: new Date().toISOString() },
      { onConflict: 'user_id,post_id' }
    )
}
