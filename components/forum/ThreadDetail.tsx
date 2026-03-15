'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Thread, Reply, Profile, createReply, deleteThread, updateThread } from '@/lib/db-client'
import { MarkdownRenderer } from '@/components/editor/MarkdownRenderer'
import { MarkdownToolbar } from '@/components/editor/MarkdownToolbar'
import { ReplyCompose } from './ReplyCompose'
import { ReplyList } from './ReplyList'
import { LikeButton } from '@/components/ui/LikeButton'
import { formatDistanceToNow } from 'date-fns'
import { Avatar } from '@/components/ui/avatar'
import { markThreadRead } from '@/lib/read-actions'

interface ThreadDetailProps {
  thread: Thread & { profiles: Profile }
  replies: (Reply & { profiles: Profile })[]
  currentUserId: string | null
  isAdmin?: boolean
  threadLikeCount: number
  threadUserLiked: boolean
  replyLikesData: Record<string, { count: number; liked: boolean }>
  uniqueViewCount?: number
}

function formatRelativeDate(dateString: string) {
  return formatDistanceToNow(new Date(dateString), { addSuffix: true })
}

export function ThreadDetail({ thread, replies: initialReplies, currentUserId, isAdmin = false, threadLikeCount, threadUserLiked, replyLikesData, uniqueViewCount = 0 }: ThreadDetailProps) {
  const router = useRouter()
  const [replies, setReplies] = useState(initialReplies)
  const [replyTo, setReplyTo] = useState<{ username: string; replyId: string | null } | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editBody, setEditBody] = useState(thread.body)
  const [displayBody, setDisplayBody] = useState(thread.body)
  const [isSaving, setIsSaving] = useState(false)
  const editRef = useRef<HTMLTextAreaElement>(null)
  const author = thread.profiles

  useEffect(() => {
    if (currentUserId) markThreadRead(thread.id)
  }, [thread.id, currentUserId])

  // Check if within 15 minutes of posting (for edit button)
  const createdAt = new Date(thread.created_at)
  const now = new Date()
  const minutesSinceCreation = (now.getTime() - createdAt.getTime()) / (1000 * 60)
  const canEdit = currentUserId === thread.user_id && minutesSinceCreation < 15

  const handleSaveEdit = async () => {
    if (!editBody.trim()) return
    setIsSaving(true)
    try {
      await updateThread(thread.id, { body: editBody.trim() })
      setDisplayBody(editBody.trim())
      setIsEditing(false)
      router.refresh()
    } catch (error) {
      console.error('Failed to update thread:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Delete this thread and all its replies?')) return
    try {
      await deleteThread(thread.id)
      router.push('/forum')
      router.refresh()
    } catch (error) {
      console.error('Failed to delete thread:', error)
    }
  }

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
        The Roundtable
      </Link>

      {/* Thread header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Link href={`/author/${author?.username}`}>
            <Avatar url={author?.avatar_url} name={author?.display_name || author?.username} size="lg" />
          </Link>
          <Link href={`/author/${author?.username}`} className="font-sans text-sm font-bold text-text-primary hover:text-accent-blue transition-colors">
            {author?.display_name || author?.username || 'Unknown'}
          </Link>
          <span className="font-sans text-xs text-text-muted">
            {formatRelativeDate(thread.created_at)}
          </span>
          <div className="ml-auto flex items-center gap-3">
            {uniqueViewCount > 0 && (
              <span className="font-sans text-xs text-text-muted">
                Seen by {uniqueViewCount} {uniqueViewCount === 1 ? 'member' : 'members'}
              </span>
            )}
            <LikeButton
              contentType="thread"
              contentId={thread.id}
              initialCount={threadLikeCount}
              initialLiked={threadUserLiked}
              currentUserId={currentUserId}
            />
            {canEdit && !isEditing && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="font-sans text-xs text-text-muted hover:text-text-primary h-auto py-1 px-2"
              >
                Edit
              </Button>
            )}
            {isAdmin && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                className="h-auto py-1 px-2 text-text-muted hover:text-red-500"
                aria-label="Delete thread"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            )}
          </div>
        </div>

        {thread.title && (
          <h1 className="font-sans text-xl font-semibold text-text-primary mb-3">
            {thread.title}
          </h1>
        )}

        {isEditing ? (
          <div className="space-y-2">
            <MarkdownToolbar textareaRef={editRef} onChange={setEditBody} className="mb-1" />
            <textarea
              ref={editRef}
              value={editBody}
              onChange={(e) => setEditBody(e.target.value)}
              className="w-full bg-bg-surface border border-border rounded-md p-3 text-sm text-text-primary placeholder:text-text-muted resize-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue/30 outline-none font-sans"
              rows={6}
            />
            <div className="flex gap-2">
              <Button
                onClick={handleSaveEdit}
                disabled={isSaving || !editBody.trim()}
                size="sm"
                className="bg-accent-blue text-white hover:bg-accent-dim rounded-md font-sans font-medium text-xs"
              >
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
              <Button
                onClick={() => { setEditBody(displayBody); setIsEditing(false) }}
                variant="ghost"
                size="sm"
                className="text-text-secondary hover:text-text-primary hover:bg-bg-raised font-sans text-xs"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <MarkdownRenderer content={displayBody} variant="forum" />
        )}
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
          likesData={replyLikesData}
          isAdmin={isAdmin}
        />
      )}
    </div>
  )
}
