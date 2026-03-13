'use client'

import Link from 'next/link'
import { Post, Profile, deletePost, updatePost } from '@/lib/db-client'
import { MoreHorizontal, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { Avatar } from '@/components/ui/avatar'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface PostCardProps {
  post: Post & { profiles?: Profile }
  variant?: 'dashboard' | 'feed'
  commentCount?: number
  isRead?: boolean
}

const typeLabels: Record<string, string> = {
  essay: 'Essay',
  poem: 'Poem',
  fiction: 'Fiction',
  reflection: 'Reflection',
}

const statusConfig: Record<string, { label: string; dotColor: string }> = {
  draft: { label: 'Draft', dotColor: 'bg-yellow-500' },
  private: { label: 'Private', dotColor: 'bg-orange-500' },
  published: { label: 'Published', dotColor: 'bg-green-500' },
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

export function PostCard({ post, variant = 'dashboard', commentCount = 0, isRead = false }: PostCardProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const status = statusConfig[post.status]

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post?')) return
    setIsDeleting(true)
    try {
      await deletePost(post.id)
      router.refresh()
    } catch {
      setIsDeleting(false)
    }
  }

  const handleStatusChange = async (newStatus: 'draft' | 'private' | 'published') => {
    try {
      await updatePost(post.id, { status: newStatus })
      router.refresh()
    } catch (error) {
      console.error('Failed to update status:', error)
    }
  }

  if (variant === 'feed') {
    const authorName = post.profiles?.display_name || post.profiles?.username || 'Anonymous'
    
    return (
      <Link href={`/common/${post.slug}`}>
        <article className="bg-bg-surface border border-border rounded-lg p-6 hover:bg-bg-raised transition-colors cursor-pointer">
          {/* Top row: author + badge */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <span onClick={(e) => { e.preventDefault(); e.stopPropagation(); router.push(`/author/${post.profiles?.username}`) }} className="cursor-pointer">
                <Avatar url={post.profiles?.avatar_url} name={authorName} size="lg" />
              </span>
              <div className="flex items-center gap-2">
                <span
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); router.push(`/author/${post.profiles?.username}`) }}
                  className="font-sans text-sm font-medium text-text-primary hover:text-accent-blue transition-colors cursor-pointer"
                >
                  {authorName}
                </span>
                <span className="text-xs text-text-muted">
                  {formatRelativeDate(post.published_at || post.created_at)}
                </span>
              </div>
            </div>
            <span className="bg-accent-subtle text-accent-blue text-xs font-medium px-2 py-0.5 rounded">
              {typeLabels[post.post_type] || post.post_type}
            </span>
          </div>

          {/* Title */}
          <h2 className={`font-serif text-xl hover:text-accent-blue transition-colors ${isRead ? 'text-text-muted' : 'text-text-primary'}`}>
            {post.title}
          </h2>

          {/* Excerpt */}
          {post.excerpt && (
            <p className={`mt-2 font-body text-base line-clamp-3 ${isRead ? 'text-text-muted' : 'text-text-secondary'}`}>
              {post.excerpt}
            </p>
          )}

          {/* Footer: tags + comments */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {post.tags?.map((tag) => (
                <span 
                  key={tag}
                  className="bg-accent-subtle text-accent-blue text-xs font-medium px-2 py-0.5 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
            {commentCount > 0 && (
              <div className="flex items-center gap-1 text-xs text-text-muted">
                <MessageCircle className="w-3.5 h-3.5" />
                <span>{commentCount}</span>
              </div>
            )}
          </div>
        </article>
      </Link>
    )
  }

  // Dashboard variant
  return (
    <article className="bg-bg-surface border border-border rounded-lg p-6 hover:bg-bg-raised transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Title */}
          <h2 className="font-serif text-xl text-text-primary">
            {post.title}
          </h2>

          {/* Meta row */}
          <div className="mt-2 flex items-center gap-3 flex-wrap">
            {/* Type badge */}
            <span className="bg-accent-subtle text-accent-blue text-xs font-medium px-2 py-0.5 rounded">
              {typeLabels[post.post_type] || post.post_type}
            </span>

            {/* Status */}
            <div className="flex items-center gap-1.5">
              <span className={cn("w-1.5 h-1.5 rounded-full", status.dotColor)} />
              <span className="font-sans text-xs text-text-muted">
                {status.label}
              </span>
            </div>

            {/* Last edited */}
            <span className="font-sans text-xs text-text-muted">
              Last edited {formatRelativeDate(post.updated_at)}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="text-text-secondary hover:text-text-primary hover:bg-bg-raised font-sans text-sm"
          >
            <Link href={`/room/${post.id}/edit`}>
              Edit
            </Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-text-secondary hover:text-text-primary hover:bg-bg-raised"
                disabled={isDeleting}
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end"
              className="bg-bg-surface border-border"
            >
              {post.status !== 'published' && (
                <DropdownMenuItem 
                  onClick={() => handleStatusChange('published')}
                  className="font-sans text-sm text-text-primary hover:bg-bg-raised cursor-pointer"
                >
                  Publish to group
                </DropdownMenuItem>
              )}
              {post.status !== 'private' && (
                <DropdownMenuItem 
                  onClick={() => handleStatusChange('private')}
                  className="font-sans text-sm text-text-primary hover:bg-bg-raised cursor-pointer"
                >
                  Make private
                </DropdownMenuItem>
              )}
              {post.status !== 'draft' && (
                <DropdownMenuItem 
                  onClick={() => handleStatusChange('draft')}
                  className="font-sans text-sm text-text-primary hover:bg-bg-raised cursor-pointer"
                >
                  Move to drafts
                </DropdownMenuItem>
              )}
              <DropdownMenuItem 
                onClick={handleDelete}
                className="font-sans text-sm text-red-400 hover:bg-bg-raised cursor-pointer"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </article>
  )
}
