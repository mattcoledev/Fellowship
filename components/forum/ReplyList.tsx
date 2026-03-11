'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Reply, Profile, updateReply } from '@/lib/db-client'
import { Button } from '@/components/ui/button'
import { LikeButton } from '@/components/ui/LikeButton'
import { formatDistanceToNow } from 'date-fns'
import { Avatar } from '@/components/ui/avatar'
import Link from 'next/link'

interface ReplyItemProps {
  reply: Reply & { profiles: Profile }
  onReply: (username: string, replyId: string | null) => void
  isNested?: boolean
  currentUserId: string | null
  likeCount: number
  userLiked: boolean
}

function formatRelativeDate(dateString: string) {
  return formatDistanceToNow(new Date(dateString), { addSuffix: true })
}

function ReplyItem({ reply, onReply, isNested = false, currentUserId, likeCount, userLiked }: ReplyItemProps) {
  const router = useRouter()
  const author = reply.profiles
  const isOwner = currentUserId === reply.user_id
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(reply.content)
  const [displayContent, setDisplayContent] = useState(reply.content)
  const [wasEdited, setWasEdited] = useState(reply.updated_at !== reply.created_at)
  const [isSaving, setIsSaving] = useState(false)

  const handleSaveEdit = async () => {
    if (!editContent.trim()) return
    setIsSaving(true)
    try {
      await updateReply(reply.id, editContent.trim())
      setDisplayContent(editContent.trim())
      setWasEdited(true)
      setIsEditing(false)
      router.refresh()
    } catch (error) {
      console.error('Failed to update reply:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancelEdit = () => {
    setEditContent(reply.content)
    setIsEditing(false)
  }

  return (
    <div className={isNested ? 'ml-8' : ''}>
      <div className="flex gap-3">
        <Link href={`/author/${author?.username}`}>
          <Avatar url={author?.avatar_url} name={author?.display_name || author?.username} size={isNested ? 'sm' : 'md'} />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Link href={`/author/${author?.username}`} className="font-sans text-sm font-bold text-text-primary hover:text-accent-blue transition-colors">
              {author?.display_name || author?.username || 'Unknown'}
            </Link>
            <span className="font-sans text-xs text-text-muted">
              {formatRelativeDate(reply.created_at)}
            </span>
            {wasEdited && (
              <span className="font-sans text-xs text-text-muted">(edited)</span>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-2">
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
              <p className="font-sans text-sm text-text-primary mb-2 whitespace-pre-wrap">
                {displayContent}
              </p>
              <div className="flex items-center gap-3">
                <LikeButton
                  contentType="reply"
                  contentId={reply.id}
                  initialCount={likeCount}
                  initialLiked={userLiked}
                  currentUserId={currentUserId}
                />
                {currentUserId && (
                  <button
                    onClick={() => onReply(author?.username || '', reply.id)}
                    className="font-sans text-xs text-text-muted hover:text-text-primary transition-colors"
                  >
                    Reply
                  </button>
                )}
                {isOwner && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="font-sans text-xs text-text-muted hover:text-text-primary transition-colors"
                  >
                    Edit
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

interface ReplyListProps {
  replies: (Reply & { profiles: Profile })[]
  onReply: (username: string, replyId: string | null) => void
  currentUserId: string | null
  likesData: Record<string, { count: number; liked: boolean }>
}

export function ReplyList({ replies, onReply, currentUserId, likesData }: ReplyListProps) {
  const topLevelReplies = replies.filter(r => !r.parent_id)
  const nestedReplies = replies.filter(r => r.parent_id)

  return (
    <div className="space-y-0">
      {topLevelReplies.map((reply, index) => {
        const children = nestedReplies.filter(r => r.parent_id === reply.id)
        const like = likesData[reply.id] || { count: 0, liked: false }

        return (
          <div key={reply.id}>
            {index > 0 && <div className="border-t border-border my-4" />}
            <ReplyItem
              reply={reply}
              onReply={onReply}
              currentUserId={currentUserId}
              likeCount={like.count}
              userLiked={like.liked}
            />
            {children.map((child) => {
              const childLike = likesData[child.id] || { count: 0, liked: false }
              return (
                <div key={child.id} className="mt-3">
                  <ReplyItem
                    reply={child}
                    onReply={onReply}
                    isNested
                    currentUserId={currentUserId}
                    likeCount={childLike.count}
                    userLiked={childLike.liked}
                  />
                </div>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}
