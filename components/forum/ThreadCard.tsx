'use client'

import Link from 'next/link'
import { MessageCircle } from 'lucide-react'
import { Thread, Profile } from '@/lib/db-client'
import { formatDistanceToNow } from 'date-fns'

interface ThreadCardProps {
  thread: Thread & { 
    profiles: Profile
    last_reply_profile?: Profile | null
  }
}

function formatRelativeDate(dateString: string) {
  return formatDistanceToNow(new Date(dateString), { addSuffix: true })
}

export function ThreadCard({ thread }: ThreadCardProps) {
  const author = thread.profiles
  const lastReplyAuthor = thread.last_reply_profile

  return (
    <Link href={`/forum/${thread.id}`}>
      <div className="bg-bg-surface border border-border rounded-lg px-5 py-4 hover:bg-bg-raised cursor-pointer transition-colors">
        {/* Top row: avatar, author, timestamp */}
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 rounded-full bg-accent-subtle text-accent flex items-center justify-center text-xs font-medium">
            {author?.display_name?.charAt(0).toUpperCase() || author?.username?.charAt(0).toUpperCase() || '?'}
          </div>
          <span className="font-sans text-sm font-bold text-text-primary">
            {author?.display_name || author?.username || 'Unknown'}
          </span>
          <span className="font-sans text-xs text-text-muted">
            {formatRelativeDate(thread.created_at)}
          </span>
        </div>

        {/* Title (if present) */}
        {thread.title && (
          <h3 className="font-sans text-base font-semibold text-text-primary mb-1">
            {thread.title}
          </h3>
        )}

        {/* Body preview */}
        <p className="font-sans text-sm text-text-secondary line-clamp-2 mb-3">
          {thread.body}
        </p>

        {/* Footer row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-text-muted">
            <MessageCircle className="w-3.5 h-3.5" />
            <span className="font-sans text-xs">{thread.reply_count}</span>
          </div>
          
          {lastReplyAuthor && thread.last_reply_at && (
            <span className="font-sans text-xs text-text-muted">
              Last reply by {lastReplyAuthor.display_name || lastReplyAuthor.username} {formatRelativeDate(thread.last_reply_at)}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
