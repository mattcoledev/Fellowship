'use server'

import { createClient } from '@/lib/supabase/server'

async function getAuthUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  return { user, supabase }
}

export async function togglePostLike(postId: string) {
  const { user, supabase } = await getAuthUser()

  const { data: existing } = await supabase
    .from('likes')
    .select('id')
    .eq('post_id', postId)
    .eq('user_id', user.id)
    .maybeSingle()

  if (existing) {
    await supabase.from('likes').delete().eq('post_id', postId).eq('user_id', user.id)
  } else {
    await supabase.from('likes').insert({ post_id: postId, user_id: user.id })
  }

  const { count } = await supabase
    .from('likes')
    .select('*', { count: 'exact', head: true })
    .eq('post_id', postId)

  return { liked: !existing, count: count || 0 }
}

export async function toggleCommentLike(commentId: string) {
  const { user, supabase } = await getAuthUser()

  const { data: existing } = await supabase
    .from('comment_likes')
    .select('id')
    .eq('comment_id', commentId)
    .eq('user_id', user.id)
    .maybeSingle()

  if (existing) {
    await supabase.from('comment_likes').delete().eq('comment_id', commentId).eq('user_id', user.id)
  } else {
    await supabase.from('comment_likes').insert({ comment_id: commentId, user_id: user.id })
  }

  const { count } = await supabase
    .from('comment_likes')
    .select('*', { count: 'exact', head: true })
    .eq('comment_id', commentId)

  return { liked: !existing, count: count || 0 }
}

export async function toggleThreadLike(threadId: string) {
  const { user, supabase } = await getAuthUser()

  const { data: existing } = await supabase
    .from('thread_likes')
    .select('id')
    .eq('thread_id', threadId)
    .eq('user_id', user.id)
    .maybeSingle()

  if (existing) {
    await supabase.from('thread_likes').delete().eq('thread_id', threadId).eq('user_id', user.id)
  } else {
    await supabase.from('thread_likes').insert({ thread_id: threadId, user_id: user.id })
  }

  const { count } = await supabase
    .from('thread_likes')
    .select('*', { count: 'exact', head: true })
    .eq('thread_id', threadId)

  return { liked: !existing, count: count || 0 }
}

export async function toggleReplyLike(replyId: string) {
  const { user, supabase } = await getAuthUser()

  const { data: existing } = await supabase
    .from('reply_likes')
    .select('id')
    .eq('reply_id', replyId)
    .eq('user_id', user.id)
    .maybeSingle()

  if (existing) {
    await supabase.from('reply_likes').delete().eq('reply_id', replyId).eq('user_id', user.id)
  } else {
    await supabase.from('reply_likes').insert({ reply_id: replyId, user_id: user.id })
  }

  const { count } = await supabase
    .from('reply_likes')
    .select('*', { count: 'exact', head: true })
    .eq('reply_id', replyId)

  return { liked: !existing, count: count || 0 }
}
