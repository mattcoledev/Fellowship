'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { NotificationBell } from '@/components/notifications/NotificationBell'
import { PostCard } from '@/components/posts/PostCard'
import { Post, Profile } from '@/lib/db-client'
import { Search, ChevronDown } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

type SortOption = 'newest' | 'oldest'
type TypeFilter = 'all' | 'essay' | 'poem' | 'fiction' | 'reflection'

const typeOptions: { value: TypeFilter; label: string }[] = [
  { value: 'all', label: 'All Types' },
  { value: 'essay', label: 'Essay' },
  { value: 'poem', label: 'Poem' },
  { value: 'fiction', label: 'Fiction' },
  { value: 'reflection', label: 'Reflection' },
]

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
]

interface CommonRoomFeedProps {
  initialPosts: (Post & { profiles: Profile })[]
}

export function CommonRoomFeed({ initialPosts }: CommonRoomFeedProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all')
  const [authorFilter, setAuthorFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<SortOption>('newest')

  // Get unique authors
  const authors = useMemo(() => {
    const authorMap = new Map<string, Profile>()
    initialPosts.forEach(post => {
      if (post.profiles && !authorMap.has(post.profiles.id)) {
        authorMap.set(post.profiles.id, post.profiles)
      }
    })
    return Array.from(authorMap.values())
  }, [initialPosts])

  // Filter and sort posts
  const filteredPosts = useMemo(() => {
    let posts = [...initialPosts]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      posts = posts.filter(
        post =>
          post.title.toLowerCase().includes(query) ||
          (post.excerpt?.toLowerCase().includes(query)) ||
          post.tags?.some(tag => tag.toLowerCase().includes(query))
      )
    }

    // Type filter
    if (typeFilter !== 'all') {
      posts = posts.filter(post => post.post_type === typeFilter)
    }

    // Author filter
    if (authorFilter !== 'all') {
      posts = posts.filter(post => post.user_id === authorFilter)
    }

    // Sort
    posts.sort((a, b) => {
      const dateA = new Date(a.published_at || a.created_at).getTime()
      const dateB = new Date(b.published_at || b.created_at).getTime()
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB
    })

    return posts
  }, [initialPosts, searchQuery, typeFilter, authorFilter, sortBy])

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-2xl text-text-primary">
          The Common Room
        </h1>
        <div className="flex items-center gap-3">
          <span className="hidden lg:block">
            <NotificationBell />
          </span>
          <Button
            asChild
            className="bg-accent-blue text-white hover:bg-accent-dim rounded-md font-sans font-medium"
          >
            <Link href="/room/new">New Post</Link>
          </Button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
        {/* Search */}
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <Input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-bg-surface border-border text-text-primary placeholder:text-text-muted focus:border-accent-blue focus:ring-1 focus:ring-accent-blue/30"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 ml-auto">
          {/* Author filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="border-border text-text-secondary hover:text-text-primary hover:bg-bg-raised font-sans text-sm"
              >
                {authorFilter === 'all' 
                  ? 'Author' 
                  : authors.find(a => a.id === authorFilter)?.display_name || 'Author'}
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end"
              className="bg-bg-surface border-border"
            >
              <DropdownMenuItem 
                onClick={() => setAuthorFilter('all')}
                className="font-sans text-sm text-text-primary hover:bg-bg-raised cursor-pointer"
              >
                All Authors
              </DropdownMenuItem>
              {authors.map((author) => (
                <DropdownMenuItem 
                  key={author.id}
                  onClick={() => setAuthorFilter(author.id)}
                  className="font-sans text-sm text-text-primary hover:bg-bg-raised cursor-pointer"
                >
                  {author.display_name || author.username}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Type filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="border-border text-text-secondary hover:text-text-primary hover:bg-bg-raised font-sans text-sm"
              >
                {typeOptions.find(t => t.value === typeFilter)?.label}
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end"
              className="bg-bg-surface border-border"
            >
              {typeOptions.map((option) => (
                <DropdownMenuItem 
                  key={option.value}
                  onClick={() => setTypeFilter(option.value)}
                  className="font-sans text-sm text-text-primary hover:bg-bg-raised cursor-pointer"
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Sort */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="border-border text-text-secondary hover:text-text-primary hover:bg-bg-raised font-sans text-sm"
              >
                {sortOptions.find(s => s.value === sortBy)?.label}
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end"
              className="bg-bg-surface border-border"
            >
              {sortOptions.map((option) => (
                <DropdownMenuItem 
                  key={option.value}
                  onClick={() => setSortBy(option.value)}
                  className="font-sans text-sm text-text-primary hover:bg-bg-raised cursor-pointer"
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Post feed */}
      <div className="max-w-2xl mx-auto space-y-4">
        {filteredPosts.length > 0 ? (
          <>
            {filteredPosts.map((post) => (
              <PostCard 
                key={post.id} 
                post={post} 
                variant="feed"
              />
            ))}
          </>
        ) : (
          <div className="text-center py-16">
            <p className="font-sans text-text-secondary">
              No posts found.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
