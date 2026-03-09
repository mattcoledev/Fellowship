'use client'

import { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { PostCard } from '@/components/posts/PostCard'
import { getPublishedPosts, getUserById } from '@/lib/mock-data'
import { PostType } from '@/lib/types'
import { Search, ChevronDown } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

type SortOption = 'newest' | 'oldest'
type TypeFilter = 'all' | PostType

const typeOptions: { value: TypeFilter; label: string }[] = [
  { value: 'all', label: 'All Types' },
  { value: 'essay', label: 'Essay' },
  { value: 'story', label: 'Story' },
  { value: 'idea', label: 'Idea' },
  { value: 'note', label: 'Note' },
]

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
]

export default function CommonRoomPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all')
  const [authorFilter, setAuthorFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<SortOption>('newest')

  const publishedPosts = getPublishedPosts()

  // Get unique authors
  const authors = useMemo(() => {
    const authorIds = [...new Set(publishedPosts.map(p => p.authorId))]
    return authorIds.map(id => getUserById(id)).filter(Boolean)
  }, [publishedPosts])

  // Filter and sort posts
  const filteredPosts = useMemo(() => {
    let posts = [...publishedPosts]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      posts = posts.filter(
        post =>
          post.title.toLowerCase().includes(query) ||
          post.excerpt.toLowerCase().includes(query) ||
          post.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }

    // Type filter
    if (typeFilter !== 'all') {
      posts = posts.filter(post => post.type === typeFilter)
    }

    // Author filter
    if (authorFilter !== 'all') {
      posts = posts.filter(post => post.authorId === authorFilter)
    }

    // Sort
    posts.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime()
      const dateB = new Date(b.createdAt).getTime()
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB
    })

    return posts
  }, [publishedPosts, searchQuery, typeFilter, authorFilter, sortBy])

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-8">
      {/* Header */}
      <h1 className="font-serif text-2xl text-text-primary mb-8">
        The Common Room
      </h1>

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
                  : authors.find(a => a?.id === authorFilter)?.displayName}
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
              {authors.map((author) => author && (
                <DropdownMenuItem 
                  key={author.id}
                  onClick={() => setAuthorFilter(author.id)}
                  className="font-sans text-sm text-text-primary hover:bg-bg-raised cursor-pointer"
                >
                  {author.displayName}
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
            {filteredPosts.map((post) => {
              const author = getUserById(post.authorId)
              return (
                <PostCard 
                  key={post.id} 
                  post={post} 
                  variant="feed"
                  authorName={author?.displayName}
                />
              )
            })}

            {/* Load more */}
            <div className="pt-4 text-center">
              <Button
                variant="ghost"
                className="text-text-secondary hover:text-text-primary hover:bg-bg-raised font-sans"
              >
                Load more
              </Button>
            </div>
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
