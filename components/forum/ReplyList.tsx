'use client'

import { Reply, getUserById, formatRelativeDate } from '@/lib/mock-data'

interface ReplyItemProps {
  reply: Reply
  onReply: (username: string) => void
  isNested?: boolean
}

function ReplyItem({ reply, onReply, isNested = false }: ReplyItemProps) {
  const author = getUserById(reply.authorId)

  return (
    <div className={isNested ? 'ml-8' : ''}>
      <div className="flex gap-3">
        <div className={`${isNested ? 'w-6 h-6' : 'w-7 h-7'} rounded-full bg-accent-subtle text-accent flex items-center justify-center text-xs font-medium flex-shrink-0`}>
          {author?.displayName?.charAt(0).toUpperCase() || '?'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-sans text-sm font-bold text-text-primary">
              {author?.displayName || 'Unknown'}
            </span>
            <span className="font-sans text-xs text-text-muted">
              {formatRelativeDate(reply.createdAt)}
            </span>
          </div>
          <p className="font-sans text-sm text-text-primary mb-2">
            {reply.content}
          </p>
          <button
            onClick={() => onReply(author?.username || '')}
            className="font-sans text-xs text-text-muted hover:text-text-primary transition-colors"
          >
            Reply
          </button>
        </div>
      </div>
    </div>
  )
}

interface ReplyListProps {
  replies: Reply[]
  onReply: (username: string) => void
}

export function ReplyList({ replies, onReply }: ReplyListProps) {
  // Group replies: top-level and nested
  const topLevelReplies = replies.filter(r => !r.parentId)
  const nestedReplies = replies.filter(r => r.parentId)

  return (
    <div className="space-y-0">
      {topLevelReplies.map((reply, index) => {
        const children = nestedReplies.filter(r => r.parentId === reply.id)
        const isLast = index === topLevelReplies.length - 1

        return (
          <div key={reply.id}>
            {index > 0 && <div className="border-t border-border my-4" />}
            <ReplyItem reply={reply} onReply={onReply} />
            {children.map((child) => (
              <div key={child.id} className="mt-3">
                <ReplyItem reply={child} onReply={onReply} isNested />
              </div>
            ))}
          </div>
        )
      })}
    </div>
  )
}
