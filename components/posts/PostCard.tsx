'use client'

import Link from 'next/link'
import { Post, PostType, PostStatus } from '@/lib/types'
import { formatRelativeDate } from '@/lib/mock-data'
import { MoreHorizontal, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

interface PostCardProps {
  post: Post
  variant?: 'dashboard' | 'feed'
  authorName?: string
}

const typeLabels: Record<PostType, string> = {
  essay: 'Essay',
  story: 'Story',
  idea: 'Idea',
  note: 'Note',
}

const statusConfig: Record<PostStatus, { label: string; dotColor: string }> = {
  draft: { label: 'Draft', dotColor: 'bg-yellow-500' },
  private: { label: 'Private', dotColor: 'bg-orange-500' },
  published: { label: 'Published', dotColor: 'bg-green-500' },
}

export function PostCard({ post, variant = 'dashboard', authorName }: PostCardProps) {
  const status = statusConfig[post.status]

  if (variant === 'feed') {
    return (
      <Link href={`/common/${post.slug}`}>
        <article className="bg-bg-surface border border-border rounded-lg p-6 hover:bg-bg-raised transition-colors cursor-pointer">
          {/* Top row: author + badge */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-accent-subtle text-accent-blue flex items-center justify-center text-sm font-medium">
                {authorName?.charAt(0).toUpperCase()}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-sans text-sm font-medium text-text-primary">
                  {authorName}
                </span>
                <span className="text-xs text-text-muted">
                  {formatRelativeDate(post.createdAt)}
                </span>
              </div>
            </div>
            <span className="bg-accent-subtle text-accent-blue text-xs font-medium px-2 py-0.5 rounded">
              {typeLabels[post.type]}
            </span>
          </div>

          {/* Title */}
          <h2 className="font-serif text-xl text-text-primary hover:text-accent-blue transition-colors">
            {post.title}
          </h2>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="mt-2 font-body text-base text-text-secondary line-clamp-3">
              {post.excerpt}
            </p>
          )}

          {/* Footer: tags + comments */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {post.tags.map((tag) => (
                <span 
                  key={tag}
                  className="bg-accent-subtle text-accent-blue text-xs font-medium px-2 py-0.5 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
            {post.commentCount > 0 && (
              <div className="flex items-center gap-1 text-xs text-text-muted">
                <MessageCircle className="w-3.5 h-3.5" />
                <span>{post.commentCount}</span>
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
              {typeLabels[post.type]}
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
              Last edited {formatRelativeDate(post.updatedAt)}
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
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end"
              className="bg-bg-surface border-border"
            >
              <DropdownMenuItem className="font-sans text-sm text-text-primary hover:bg-bg-raised cursor-pointer">
                Publish to group
              </DropdownMenuItem>
              <DropdownMenuItem className="font-sans text-sm text-text-primary hover:bg-bg-raised cursor-pointer">
                Make private
              </DropdownMenuItem>
              <DropdownMenuItem className="font-sans text-sm text-red-400 hover:bg-bg-raised cursor-pointer">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </article>
  )
}
