import { PostEditor } from '@/components/posts/PostEditor'
import { getPostById } from '@/lib/mock-data'
import { notFound } from 'next/navigation'

interface EditPostPageProps {
  params: Promise<{ id: string }>
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { id } = await params
  const post = getPostById(id)

  if (!post) {
    notFound()
  }

  return <PostEditor post={post} />
}
