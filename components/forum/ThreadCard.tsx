'use client'

import Link from 'next/link'
import { MessageCircle } from 'lucide-react'
import { Thread, getUserById, formatRelativeDate } from '@/lib/mock-data'

interface ThreadCardProps {
  thread: Thread
}

export function ThreadCard({ thread }: ThreadCardProps) {
  const author = getUserById(thread.authorId)
  const lastReplyAuthor = thread.lastReplyBy ? getUserById(thread.lastReplyBy) : null

  return (
    <Link href={`/forum/${thread.id}`}>
      <div className="bg-bg-surface border border-border rounded-lg px-5 py-4 hover:bg-bg-raised cursor-pointer transition-colors">
        {/* Top row: avatar, author, timestamp */}
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 rounded-full bg-accent-subtle text-accent flex items-center justify-center text-xs font-medium">
            {author?.displayName?.charAt(0).toUpperCase() || '?'}
          </div>
          <span className="font-sans text-sm font-bold text-text-primary">
            {author?.displayName || 'Unknown'}
          </span>
          <span className="font-sans text-xs text-text-muted">
            {formatRelativeDate(thread.createdAt)}
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
            <span className="font-sans text-xs">{thread.replyCount}</span>
          </div>
          
          {lastReplyAuthor && thread.lastReplyAt && (
            <span className="font-sans text-xs text-text-muted">
              Last reply by {lastReplyAuthor.displayName} {formatRelativeDate(thread.lastReplyAt)}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
