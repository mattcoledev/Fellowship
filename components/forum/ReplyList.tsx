'use client'

import { Reply, Profile } from '@/lib/db-client'
import { formatDistanceToNow } from 'date-fns'

interface ReplyItemProps {
  reply: Reply & { profiles: Profile }
  onReply: (username: string, replyId: string | null) => void
  isNested?: boolean
  currentUserId: string | null
}

function formatRelativeDate(dateString: string) {
  return formatDistanceToNow(new Date(dateString), { addSuffix: true })
}

function ReplyItem({ reply, onReply, isNested = false, currentUserId }: ReplyItemProps) {
  const author = reply.profiles

  return (
    <div className={isNested ? 'ml-8' : ''}>
      <div className="flex gap-3">
        <div className={`${isNested ? 'w-6 h-6' : 'w-7 h-7'} rounded-full bg-accent-subtle text-accent flex items-center justify-center text-xs font-medium flex-shrink-0`}>
          {author?.display_name?.charAt(0).toUpperCase() || author?.username?.charAt(0).toUpperCase() || '?'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-sans text-sm font-bold text-text-primary">
              {author?.display_name || author?.username || 'Unknown'}
            </span>
            <span className="font-sans text-xs text-text-muted">
              {formatRelativeDate(reply.created_at)}
            </span>
          </div>
          <p className="font-sans text-sm text-text-primary mb-2 whitespace-pre-wrap">
            {reply.content}
          </p>
          {currentUserId && (
            <button
              onClick={() => onReply(author?.username || '', reply.id)}
              className="font-sans text-xs text-text-muted hover:text-text-primary transition-colors"
            >
              Reply
            </button>
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
}

export function ReplyList({ replies, onReply, currentUserId }: ReplyListProps) {
  // Group replies: top-level and nested
  const topLevelReplies = replies.filter(r => !r.parent_id)
  const nestedReplies = replies.filter(r => r.parent_id)

  return (
    <div className="space-y-0">
      {topLevelReplies.map((reply, index) => {
        const children = nestedReplies.filter(r => r.parent_id === reply.id)

        return (
          <div key={reply.id}>
            {index > 0 && <div className="border-t border-border my-4" />}
            <ReplyItem reply={reply} onReply={onReply} currentUserId={currentUserId} />
            {children.map((child) => (
              <div key={child.id} className="mt-3">
                <ReplyItem reply={child} onReply={onReply} isNested currentUserId={currentUserId} />
              </div>
            ))}
          </div>
        )
      })}
    </div>
  )
}
