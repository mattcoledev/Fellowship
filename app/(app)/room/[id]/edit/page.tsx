import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getPostById, getPostsByIds } from '@/lib/db'
import { PostEditor } from '@/components/posts/PostEditor'

interface EditPostPageProps {
  params: Promise<{ id: string }>
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  try {
    const post = await getPostById(id)

    // Check if user owns this post
    if (post.user_id !== user.id) {
      redirect('/room')
    }

    const readNextPosts = post.read_next_ids?.length
      ? await getPostsByIds(post.read_next_ids)
      : []

    return <PostEditor post={post} userId={user.id} readNextPosts={readNextPosts} />
  } catch {
    notFound()
  }
}
