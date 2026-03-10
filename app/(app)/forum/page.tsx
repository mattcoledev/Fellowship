import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ThreadCard } from '@/components/forum/ThreadCard'
import { getThreads } from '@/lib/db'

export default async function ForumPage() {
  const threads = await getThreads()

  return (
    <div className="max-w-[900px] mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-2xl text-text-primary">
          The Forum
        </h1>
        <Button 
          asChild
          className="bg-accent-blue text-white hover:bg-accent-dim rounded-md font-sans font-medium"
        >
          <Link href="/forum/new">New Thread</Link>
        </Button>
      </div>

      {/* Thread list */}
      {threads.length > 0 ? (
        <div className="space-y-3">
          {threads.map((thread) => (
            <ThreadCard key={thread.id} thread={thread} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="font-sans text-text-secondary mb-4">
            No threads yet. Start one.
          </p>
          <Button 
            variant="ghost"
            asChild
            className="font-sans text-text-muted hover:text-text-primary"
          >
            <Link href="/forum/new">New Thread</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
