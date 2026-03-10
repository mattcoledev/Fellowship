'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Thread, Reply, Profile, createReply } from '@/lib/db-client'
import { ReplyCompose } from './ReplyCompose'
import { ReplyList } from './ReplyList'
import { formatDistanceToNow } from 'date-fns'

interface ThreadDetailProps {
  thread: Thread & { profiles: Profile }
  replies: (Reply & { profiles: Profile })[]
  currentUserId: string | null
}

function formatRelativeDate(dateString: string) {
  return formatDistanceToNow(new Date(dateString), { addSuffix: true })
}

export function ThreadDetail({ thread, replies: initialReplies, currentUserId }: ThreadDetailProps) {
  const router = useRouter()
  const [replies, setReplies] = useState(initialReplies)
  const [replyTo, setReplyTo] = useState<{ username: string; replyId: string | null } | null>(null)
  const author = thread.profiles
  
  // Check if within 15 minutes of posting (for edit button)
  const createdAt = new Date(thread.created_at)
  const now = new Date()
  const minutesSinceCreation = (now.getTime() - createdAt.getTime()) / (1000 * 60)
  const canEdit = currentUserId === thread.user_id && minutesSinceCreation < 15

  const handleReply = (username: string, replyId: string | null = null) => {
    setReplyTo({ username, replyId })
  }

  const handleSubmitReply = async (content: string) => {
    if (!currentUserId) return

    try {
      const newReply = await createReply({
        thread_id: thread.id,
        user_id: currentUserId,
        content,
        parent_id: replyTo?.replyId || null,
      })
      
      setReplies([...replies, newReply])
      setReplyTo(null)
      router.refresh()
    } catch (error) {
      console.error('Failed to create reply:', error)
    }
  }

  // Get current user's initial for the compose box
  const currentUserInitial = replies.find(r => r.user_id === currentUserId)?.profiles?.display_name?.charAt(0).toUpperCase() 
    || replies.find(r => r.user_id === currentUserId)?.profiles?.username?.charAt(0).toUpperCase()
    || '?'

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
            {author?.display_name?.charAt(0).toUpperCase() || author?.username?.charAt(0).toUpperCase() || '?'}
          </div>
          <span className="font-sans text-sm font-bold text-text-primary">
            {author?.display_name || author?.username || 'Unknown'}
          </span>
          <span className="font-sans text-xs text-text-muted">
            {formatRelativeDate(thread.created_at)}
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

        <p className="font-sans text-base text-text-primary leading-relaxed whitespace-pre-wrap">
          {thread.body}
        </p>
      </div>

      {/* Divider */}
      <div className="border-t border-border my-6" />

      {/* Reply compose */}
      {currentUserId ? (
        <div className="mb-8">
          <ReplyCompose 
            currentUserInitial={currentUserInitial} 
            replyTo={replyTo?.username || null}
            onClearReplyTo={() => setReplyTo(null)}
            onSubmit={handleSubmitReply}
          />
        </div>
      ) : (
        <div className="mb-8 text-center py-4">
          <p className="font-sans text-sm text-text-muted">
            <Link href="/login" className="text-accent-blue hover:underline">Sign in</Link> to reply
          </p>
        </div>
      )}

      {/* Replies list */}
      {replies.length > 0 && (
        <ReplyList 
          replies={replies} 
          onReply={handleReply}
          currentUserId={currentUserId}
        />
      )}
    </div>
  )
}
