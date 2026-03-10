'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Thread, Reply, getUserById, formatRelativeDate, currentUser } from '@/lib/mock-data'
import { ReplyCompose } from './ReplyCompose'
import { ReplyList } from './ReplyList'

interface ThreadDetailProps {
  thread: Thread
  replies: Reply[]
}

export function ThreadDetail({ thread, replies }: ThreadDetailProps) {
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const author = getUserById(thread.authorId)
  
  // Check if within 15 minutes of posting (for edit button)
  const createdAt = new Date(thread.createdAt)
  const now = new Date()
  const minutesSinceCreation = (now.getTime() - createdAt.getTime()) / (1000 * 60)
  const canEdit = minutesSinceCreation < 15

  const handleReply = (username: string) => {
    setReplyTo(username)
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      {/* Back link */}
      <Link 
        href="/forum" 
        className="inline-flex items-center gap-1.5 font-sans text-sm text-text-muted hover:text-text-primary transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        The Forum
      </Link>

      {/* Thread header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-accent-subtle text-accent flex items-center justify-center text-sm font-medium">
            {author?.displayName?.charAt(0).toUpperCase() || '?'}
          </div>
          <span className="font-sans text-sm font-bold text-text-primary">
            {author?.displayName || 'Unknown'}
          </span>
          <span className="font-sans text-xs text-text-muted">
            {formatRelativeDate(thread.createdAt)}
          </span>
          {canEdit && (
            <Button
              variant="ghost"
              size="sm"
              className="font-sans text-xs text-text-muted hover:text-text-primary ml-auto h-auto py-1 px-2"
            >
              Edit
            </Button>
          )}
        </div>

        {thread.title && (
          <h1 className="font-sans text-xl font-semibold text-text-primary mb-3">
            {thread.title}
          </h1>
        )}

        <p className="font-sans text-base text-text-primary leading-relaxed">
          {thread.body}
        </p>
      </div>

      {/* Divider */}
      <div className="border-t border-border my-6" />

      {/* Reply compose */}
      <div className="mb-8">
        <ReplyCompose 
          currentUserInitial={currentUser.displayName.charAt(0).toUpperCase()} 
          replyTo={replyTo}
          onClearReplyTo={() => setReplyTo(null)}
        />
      </div>

      {/* Replies list */}
      {replies.length > 0 && (
        <ReplyList replies={replies} onReply={handleReply} />
      )}
    </div>
  )
}
