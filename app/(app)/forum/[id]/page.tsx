import { notFound } from 'next/navigation'
import { ThreadDetail } from '@/components/forum/ThreadDetail'
import { getThreadById, getRepliesByThreadId } from '@/lib/mock-data'

interface ThreadPageProps {
  params: Promise<{ id: string }>
}

export default async function ThreadPage({ params }: ThreadPageProps) {
  const { id } = await params
  const thread = getThreadById(id)
  
  if (!thread) {
    notFound()
  }

  const replies = getRepliesByThreadId(id)

  return <ThreadDetail thread={thread} replies={replies} />
}
