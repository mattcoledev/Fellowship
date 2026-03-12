'use server'

import { createClient } from '@/lib/supabase/server'

export async function searchPostsForReadNext(
  query: string,
  authorId: string,
  showAll: boolean
): Promise<{ id: string; title: string; slug: string | null; post_type: string; tags: string[] }[]> {
  const supabase = await createClient()

  let q = supabase
    .from('posts')
    .select('id, title, slug, post_type, tags')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(20)

  if (!showAll) {
    q = q.eq('user_id', authorId)
  }

  if (query.trim()) {
    q = q.ilike('title', `%${query.trim()}%`)
  }

  const { data, error } = await q
  if (error) throw error
  return data || []
}
