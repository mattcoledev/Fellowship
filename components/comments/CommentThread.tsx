'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Comment, Profile, createComment, updateComment } from '@/lib/db-client'
import { Avatar } from '@/components/ui/Avatar'

interface CommentThreadProps {
  comments: (Comment & { profiles: Profile })[]
  postId: string
  currentUserId?: string
  currentUserProfile?: Profile | null
}

interface CommentItemProps {
  comment: Comment & { profiles: Profile }
  allComments: (Comment & { profiles: Profile })[]
  postId: string
  currentUserId?: string
  depth?: number
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

function CommentItem({ comment, allComments, postId, currentUserId, depth = 0 }: CommentItemProps) {
  const router = useRouter()
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [replyContent, setReplyContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(comment.content)
  const [displayContent, setDisplayContent] = useState(comment.content)
  const [wasEdited, setWasEdited] = useState(comment.updated_at !== comment.created_at)
  const [isSaving, setIsSaving] = useState(false)
  const author = comment.profiles
  const isOwner = currentUserId === comment.user_id
  
  const replies = allComments.filter(c => c.parent_id === comment.id)

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUserId || !replyContent.trim()) return

    setIsSubmitting(true)
    try {
      await createComment({
        post_id: postId,
        user_id: currentUserId,
        content: replyContent.trim(),
        parent_id: comment.id,
      })
      setReplyContent('')
      setShowReplyForm(false)
      router.refresh()
    } catch (error) {
      console.error('Failed to post reply:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSaveEdit = async () => {
    if (!editContent.trim()) return
    setIsSaving(true)
    try {
      await updateComment(comment.id, editContent.trim())
      setDisplayContent(editContent.trim())
      setWasEdited(true)
      setIsEditing(false)
      router.refresh()
    } catch (error) {
      console.error('Failed to update comment:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancelEdit = () => {
    setEditContent(comment.content)
    setIsEditing(false)
  }

  return (
    <div className={depth > 0 ? 'ml-8' : ''}>
      <div className="flex gap-3">
        <Link href={`/author/${author?.username}`}>
          <Avatar url={author?.avatar_url} name={author?.display_name || author?.username} size="lg" />
        </Link>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2">
            <Link href={`/author/${author?.username}`} className="font-sans text-sm font-medium text-text-primary hover:text-accent-blue transition-colors">
              {author?.display_name || author?.username}
            </Link>
            <span className="font-sans text-xs text-text-muted">
              {formatRelativeDate(comment.created_at)}
            </span>
            {wasEdited && (
              <span className="font-sans text-xs text-text-muted">(edited)</span>
            )}
          </div>

          {/* Content or Edit Form */}
          {isEditing ? (
            <div className="mt-2 space-y-2">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full bg-bg-surface border border-border rounded-md p-3 text-sm text-text-primary placeholder:text-text-muted resize-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue/30 outline-none"
                rows={3}
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleSaveEdit}
                  disabled={isSaving || !editContent.trim()}
                  size="sm"
                  className="bg-accent-blue text-white hover:bg-accent-dim rounded-md font-sans font-medium text-xs"
                >
                  {isSaving ? 'Saving...' : 'Save'}
                </Button>
                <Button
                  onClick={handleCancelEdit}
                  variant="ghost"
                  size="sm"
                  className="text-text-secondary hover:text-text-primary hover:bg-bg-raised font-sans text-xs"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <>
              <p className="mt-1 font-sans text-sm text-text-primary">
                {displayContent}
              </p>

              {/* Action buttons */}
              <div className="mt-2 flex items-center gap-3">
                {currentUserId && (
                  <button
                    onClick={() => setShowReplyForm(!showReplyForm)}
                    className="font-sans text-xs text-text-secondary hover:text-text-primary transition-colors"
                  >
                    Reply
                  </button>
                )}
                {isOwner && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="font-sans text-xs text-text-secondary hover:text-text-primary transition-colors"
                  >
                    Edit
                  </button>
                )}
              </div>
            </>
          )}

          {/* Reply form */}
          {showReplyForm && (
            <form onSubmit={handleSubmitReply} className="mt-3">
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write a reply..."
                className="w-full bg-bg-surface border border-border rounded-md p-3 text-sm text-text-primary placeholder:text-text-muted resize-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue/30 outline-none"
                rows={3}
              />
              <div className="mt-2 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowReplyForm(false)}
                  className="text-text-secondary hover:text-text-primary hover:bg-bg-raised font-sans text-sm"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isSubmitting || !replyContent.trim()}
                  className="bg-accent-blue text-white hover:bg-accent-dim rounded-md font-sans font-medium text-sm"
                >
                  {isSubmitting ? 'Posting...' : 'Reply'}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Replies */}
      {replies.length > 0 && (
        <div className="mt-4 space-y-4">
          {replies.map((reply) => (
            <CommentItem 
              key={reply.id} 
              comment={reply} 
              allComments={allComments}
              postId={postId}
              currentUserId={currentUserId}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function CommentThread({ comments, postId, currentUserId, currentUserProfile }: CommentThreadProps) {
  const router = useRouter()
  const [newComment, setNewComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Get top-level comments (no parent)
  const topLevelComments = comments.filter(c => !c.parent_id)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUserId || !newComment.trim()) return

    setIsSubmitting(true)
    try {
      await createComment({
        post_id: postId,
        user_id: currentUserId,
        content: newComment.trim(),
      })
      setNewComment('')
      router.refresh()
    } catch (error) {
      console.error('Failed to post comment:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      {/* Header */}
      <h2 className="font-serif text-xl text-text-primary">
        Discussion ({comments.length})
      </h2>

      {/* New comment form */}
      {currentUserId ? (
        <form onSubmit={handleSubmit} className="mt-6">
          <div className="flex gap-3">
            <Avatar url={currentUserProfile?.avatar_url} name={currentUserProfile?.display_name || currentUserProfile?.username} size="lg" />
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add to the conversation..."
                className="w-full bg-bg-surface border border-border rounded-md p-3 text-sm text-text-primary placeholder:text-text-muted resize-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue/30 outline-none"
                rows={3}
              />
              <div className="mt-2 flex justify-end">
                <Button
                  type="submit"
                  disabled={!newComment.trim() || isSubmitting}
                  className="bg-accent-blue text-white hover:bg-accent-dim rounded-md font-sans font-medium text-sm disabled:opacity-50"
                >
                  {isSubmitting ? 'Posting...' : 'Post'}
                </Button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <p className="mt-6 font-sans text-sm text-text-muted">
          Sign in to join the conversation.
        </p>
      )}

      {/* Comments list */}
      <div className="mt-8 space-y-6">
        {topLevelComments.map((comment) => (
          <CommentItem 
            key={comment.id} 
            comment={comment} 
            allComments={comments}
            postId={postId}
            currentUserId={currentUserId}
          />
        ))}
      </div>
    </div>
  )
}
