import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { NotificationBell } from '@/components/notifications/NotificationBell'
import { ThreadCard } from '@/components/forum/ThreadCard'
import { getThreads, getThreadReadsMap } from '@/lib/db'
import { createClient } from '@/lib/supabase/server'

export default async function ForumPage() {
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

  const threads = await getThreads()

  const readMap = user
    ? await getThreadReadsMap(user.id, threads.map(t => t.id))
    : {}

  return (
    <div className="max-w-[900px] mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-2xl text-text-primary">
          The Forum
        </h1>
        <div className="flex items-center gap-3">
          <span className="hidden lg:block">
            <NotificationBell />
          </span>
          <Button
            asChild
            className="bg-accent-blue text-white hover:bg-accent-dim rounded-md font-sans font-medium"
          >
            <Link href="/forum/new">New Thread</Link>
          </Button>
        </div>
      </div>

      {/* Thread list */}
      {threads.length > 0 ? (
        <div className="space-y-3">
          {threads.map((thread) => {
            const activityAt = thread.last_reply_at || thread.created_at
            const lastSeen = readMap[thread.id]
            const isRead = !!lastSeen && lastSeen >= activityAt
            return (
              <ThreadCard key={thread.id} thread={thread} isAdmin={isAdmin} isRead={isRead} />
            )
          })}
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
