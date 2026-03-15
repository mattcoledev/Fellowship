import Link from 'next/link'
import { ActivityItem } from '@/lib/db'

interface ActivityFeedProps {
  activity: ActivityItem[]
  recentPosts: { id: string; title: string; slug: string | null }[]
  recentThreads: { id: string; title: string | null; body: string }[]
}

const verbs: Record<ActivityItem['type'], string> = {
  post: 'published',
  comment: 'commented on',
  thread: 'started',
  reply: 'replied to',
}

const THREE_HOURS_MS = 3 * 60 * 60 * 1000

function isRecent(dateString: string): boolean {
  return Date.now() - new Date(dateString).getTime() < THREE_HOURS_MS
}

function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return 'just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function ActivityRow({ item }: { item: ActivityItem }) {
  const actorName = item.actor.display_name || item.actor.username || 'Someone'
  const verb = verbs[item.type]
  const recent = isRecent(item.timestamp)

  return (
    <Link href={item.href} className="group block -mx-2 px-2 py-1.5 rounded-md hover:bg-bg-raised/60 transition-colors cursor-pointer">
      <div className="flex items-baseline gap-1.5 flex-wrap font-sans text-sm leading-relaxed">
        {recent && (
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent-blue mt-0.5 shrink-0" aria-label="New" />
        )}
        <span className="font-medium text-text-primary">{actorName}</span>
        <span className="text-text-muted">{verb}</span>
        <span className="font-semibold text-text-primary group-hover:text-accent-blue transition-colors">
          {item.targetTitle}
        </span>
        <span className="text-text-muted">·</span>
        <span className="text-text-muted text-xs">{formatRelativeDate(item.timestamp)}</span>
      </div>
    </Link>
  )
}

export function ActivityFeed({ activity, recentPosts, recentThreads }: ActivityFeedProps) {
  return (
    <div className="max-w-2xl mx-auto px-6 py-8">

      {/* Page header */}
      <h1 className="font-serif text-3xl text-text-primary mb-1">Home</h1>
      <p className="font-sans text-sm text-text-muted mb-10">Recent activity across the Fellowship.</p>

      {/* Latest Activity */}
      <p className="font-sans text-xs text-text-secondary uppercase tracking-wide mb-5">
        Latest Activity
      </p>

      {activity.length > 0 ? (
        <div className="space-y-1">
          {activity.map(item => (
            <ActivityRow key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <p className="font-sans text-sm text-text-muted">
          Nothing yet. Be the first to post or start a thread.
        </p>
      )}

      {/* Divider */}
      <div className="border-t border-border mt-11 mb-10" />

      {/* Bottom: Latest Writing + Roundtable */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">

        {/* Latest Writing */}
        <div>
          <p className="font-sans text-xs text-text-secondary uppercase tracking-wide mb-4">
            Latest Writing
          </p>
          {recentPosts.length > 0 ? (
            <div className="space-y-2.5">
              {recentPosts.map(post => (
                <Link
                  key={post.id}
                  href={`/common/${post.slug}`}
                  className="block font-sans text-sm text-text-primary hover:text-accent-blue transition-colors"
                >
                  {post.title}
                </Link>
              ))}
            </div>
          ) : (
            <p className="font-sans text-sm text-text-muted">No posts yet.</p>
          )}
          <Link
            href="/common"
            className="mt-4 block font-sans text-xs text-text-muted hover:text-text-primary transition-colors"
          >
            View all →
          </Link>
        </div>

        {/* Roundtable */}
        <div>
          <p className="font-sans text-xs text-text-secondary uppercase tracking-wide mb-4">
            Roundtable
          </p>
          {recentThreads.length > 0 ? (
            <div className="space-y-2.5">
              {recentThreads.map(thread => (
                <Link
                  key={thread.id}
                  href={`/forum/${thread.id}`}
                  className="block font-sans text-sm text-text-primary hover:text-accent-blue transition-colors"
                >
                  {thread.title || thread.body.slice(0, 60).trim()}
                </Link>
              ))}
            </div>
          ) : (
            <p className="font-sans text-sm text-text-muted">No threads yet.</p>
          )}
          <Link
            href="/forum"
            className="mt-4 block font-sans text-xs text-text-muted hover:text-text-primary transition-colors"
          >
            View all →
          </Link>
        </div>

      </div>
    </div>
  )
}
