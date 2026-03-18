'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Reply, Profile, updateReply, deleteReply } from '@/lib/db-client'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import { LikeButton } from '@/components/ui/LikeButton'
import { ContentRenderer } from '@/components/ui/ContentRenderer'
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
  isAdmin?: boolean
}

function formatRelativeDate(dateString: string) {
  return formatDistanceToNow(new Date(dateString), { addSuffix: true })
}

function ReplyItem({ reply, onReply, isNested = false, currentUserId, likeCount, userLiked, isAdmin }: ReplyItemProps) {
  const router = useRouter()
  const author = reply.profiles
  const isOwner = currentUserId === reply.user_id
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(reply.content)
  const [displayContent, setDisplayContent] = useState(reply.content)
  const [wasEdited, setWasEdited] = useState(reply.updated_at !== reply.created_at)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleted, setIsDeleted] = useState(false)

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

  const handleDelete = async () => {
    if (!confirm('Delete this reply?')) return
    try {
      await deleteReply(reply.id)
      setIsDeleted(true)
      router.refresh()
    } catch (error) {
      console.error('Failed to delete reply:', error)
    }
  }

  if (isDeleted) return null

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
              <ContentRenderer
                content={displayContent}
                className="font-sans text-sm text-text-primary mb-2 space-y-1"
              />
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
                {isAdmin && (
                  <button
                    onClick={handleDelete}
                    className="text-text-muted hover:text-red-500 transition-colors"
                    aria-label="Delete reply"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
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
  isAdmin?: boolean
}

export function ReplyList({ replies, onReply, currentUserId, likesData, isAdmin }: ReplyListProps) {
  const topLevelReplies = replies.filter(r => !r.parent_id)

  function getDescendants(parentId: string): (Reply & { profiles: Profile })[] {
    const children = replies.filter(r => r.parent_id === parentId)
    return children.flatMap(child => [child, ...getDescendants(child.id)])
  }

  return (
    <div className="space-y-0">
      {topLevelReplies.map((reply, index) => {
        const descendants = getDescendants(reply.id)
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
              isAdmin={isAdmin}
            />
            {descendants.map((child) => {
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
                    isAdmin={isAdmin}
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
