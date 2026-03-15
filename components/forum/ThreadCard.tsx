'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { MessageCircle, Pin, Trash2 } from 'lucide-react'
import { Thread, Profile, updateThread, deleteThread } from '@/lib/db-client'
import { formatDistanceToNow } from 'date-fns'
import { Avatar } from '@/components/ui/avatar'

interface ThreadCardProps {
  thread: Thread & {
    profiles: Profile
    last_reply_profile?: Profile | null
  }
  isAdmin?: boolean
  isRead?: boolean
}

function formatRelativeDate(dateString: string) {
  return formatDistanceToNow(new Date(dateString), { addSuffix: true })
}

export function ThreadCard({ thread, isAdmin = false, isRead = false }: ThreadCardProps) {
  const router = useRouter()
  const author = thread.profiles
  const lastReplyAuthor = thread.last_reply_profile
  const [isSticky, setIsSticky] = useState(thread.is_sticky)

  const handleStickyToggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      await updateThread(thread.id, { is_sticky: !isSticky })
      setIsSticky(!isSticky)
      router.refresh()
    } catch (error) {
      console.error('Failed to update sticky:', error)
    }
  }

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!confirm('Delete this thread?')) return
    try {
      await deleteThread(thread.id)
      router.refresh()
    } catch (error) {
      console.error('Failed to delete thread:', error)
    }
  }

  return (
    <Link href={`/forum/${thread.id}`}>
      <div className="bg-bg-surface border border-border rounded-lg px-5 py-4 hover:bg-bg-raised hover:shadow-sm cursor-pointer transition-all">
        {/* Top row: avatar, author, timestamp */}
        <div className="flex items-center gap-2 mb-2">
          <span onClick={(e) => { e.preventDefault(); e.stopPropagation(); router.push(`/author/${author?.username}`) }} className="cursor-pointer">
            <Avatar url={author?.avatar_url} name={author?.display_name || author?.username} size="md" />
          </span>
          <span
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); router.push(`/author/${author?.username}`) }}
            className="font-sans text-sm font-bold text-text-primary hover:text-accent-blue transition-colors cursor-pointer"
          >
            {author?.display_name || author?.username || 'Unknown'}
          </span>
          <span className="font-sans text-xs text-text-muted">
            {formatRelativeDate(thread.created_at)}
          </span>
          {isSticky && (
            <Pin className="w-3.5 h-3.5 text-accent-blue ml-1" aria-label="Pinned" />
          )}
        </div>

        {/* Title (if present) */}
        {thread.title && (
          <h3 className={`font-sans text-base font-semibold mb-1 ${isRead ? 'text-text-muted' : 'text-text-primary'}`}>
            {thread.title}
          </h3>
        )}

        {/* Body preview — strip markdown syntax for clean plain-text snippet */}
        <p className={`font-sans text-sm line-clamp-2 mb-3 ${isRead ? 'text-text-muted' : 'text-text-secondary'}`}>
          {thread.body
            .replace(/^#{1,6}\s+/gm, '')       // headings
            .replace(/\*\*(.+?)\*\*/g, '$1')    // bold
            .replace(/\*(.+?)\*/g, '$1')         // italic
            .replace(/`(.+?)`/g, '$1')           // inline code
            .replace(/^>\s+/gm, '')              // blockquotes
            .replace(/^[-*+]\s+/gm, '')          // unordered lists
            .replace(/^\d+\.\s+/gm, '')          // ordered lists
            .replace(/\[(.+?)\]\(.+?\)/g, '$1')  // links → keep label
            .replace(/^---+$/gm, '')             // hr
            .trim()
          }
        </p>

        {/* Footer row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-text-muted">
            <MessageCircle className="w-3.5 h-3.5" />
            <span className="font-sans text-xs">
              {thread.reply_count} {thread.reply_count === 1 ? 'reply' : 'replies'}
              {thread.last_reply_at && (
                <> · <span className={!isRead ? 'text-accent-blue' : ''}>{!isRead ? 'new reply' : 'last reply'}</span> {formatRelativeDate(thread.last_reply_at)}</>
              )}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {isAdmin && (
              <div className="flex items-center gap-1">
                <button
                  onClick={handleStickyToggle}
                  className={`p-1 rounded transition-colors ${isSticky ? 'text-accent-blue hover:text-text-secondary' : 'text-text-muted hover:text-accent-blue'}`}
                  aria-label={isSticky ? 'Unpin thread' : 'Pin thread'}
                >
                  <Pin className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-1 rounded text-text-muted hover:text-red-500 transition-colors"
                  aria-label="Delete thread"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
