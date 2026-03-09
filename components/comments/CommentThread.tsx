'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Comment } from '@/lib/types'
import { getUserById, formatRelativeDate, currentUser } from '@/lib/mock-data'

interface CommentThreadProps {
  comments: Comment[]
  postId: string
}

interface CommentItemProps {
  comment: Comment
  allComments: Comment[]
  depth?: number
}

function CommentItem({ comment, allComments, depth = 0 }: CommentItemProps) {
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [replyContent, setReplyContent] = useState('')
  const author = getUserById(comment.authorId)
  
  const replies = allComments.filter(c => c.parentId === comment.id)

  const handleSubmitReply = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate posting reply
    setReplyContent('')
    setShowReplyForm(false)
  }

  return (
    <div className={depth > 0 ? 'ml-8' : ''}>
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-accent-subtle text-accent-blue flex items-center justify-center text-sm font-medium flex-shrink-0">
          {author?.displayName.charAt(0).toUpperCase()}
        </div>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2">
            <span className="font-sans text-sm font-medium text-text-primary">
              {author?.displayName}
            </span>
            <span className="font-sans text-xs text-text-muted">
              {formatRelativeDate(comment.createdAt)}
            </span>
          </div>

          {/* Content */}
          <p className="mt-1 font-sans text-sm text-text-primary">
            {comment.content}
          </p>

          {/* Reply button */}
          <button
            onClick={() => setShowReplyForm(!showReplyForm)}
            className="mt-2 font-sans text-xs text-text-secondary hover:text-text-primary transition-colors"
          >
            Reply
          </button>

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
                  className="bg-accent-blue text-white hover:bg-accent-dim rounded-md font-sans font-medium text-sm"
                >
                  Reply
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
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function CommentThread({ comments, postId }: CommentThreadProps) {
  const [newComment, setNewComment] = useState('')

  // Get top-level comments (no parent)
  const topLevelComments = comments.filter(c => !c.parentId)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate posting comment
    setNewComment('')
  }

  return (
    <div>
      {/* Header */}
      <h2 className="font-serif text-xl text-text-primary">
        Discussion ({comments.length})
      </h2>

      {/* New comment form */}
      <form onSubmit={handleSubmit} className="mt-6">
        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-full bg-accent-subtle text-accent-blue flex items-center justify-center text-sm font-medium flex-shrink-0">
            {currentUser.displayName.charAt(0).toUpperCase()}
          </div>
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
                disabled={!newComment.trim()}
                className="bg-accent-blue text-white hover:bg-accent-dim rounded-md font-sans font-medium text-sm disabled:opacity-50"
              >
                Post
              </Button>
            </div>
          </div>
        </div>
      </form>

      {/* Comments list */}
      <div className="mt-8 space-y-6">
        {topLevelComments.map((comment) => (
          <CommentItem 
            key={comment.id} 
            comment={comment} 
            allComments={comments}
          />
        ))}
      </div>
    </div>
  )
}
