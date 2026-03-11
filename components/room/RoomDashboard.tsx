'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { NotificationBell } from '@/components/notifications/NotificationBell'
import { PostCard } from '@/components/posts/PostCard'
import { Post } from '@/lib/db-client'
import { cn } from '@/lib/utils'

type FilterTab = 'drafts' | 'private' | 'published'

const filterConfig: Record<FilterTab, { label: string; status: string }> = {
  drafts: { label: 'Drafts', status: 'draft' },
  private: { label: 'Private', status: 'private' },
  published: { label: 'Published', status: 'published' },
}

interface RoomDashboardProps {
  posts: Post[]
}

export function RoomDashboard({ posts }: RoomDashboardProps) {
  const [activeTab, setActiveTab] = useState<FilterTab>('drafts')
  
  const counts = {
    drafts: posts.filter(p => p.status === 'draft').length,
    private: posts.filter(p => p.status === 'private').length,
    published: posts.filter(p => p.status === 'published').length,
  }

  const filteredPosts = posts.filter(
    post => post.status === filterConfig[activeTab].status
  )

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-2xl text-text-primary">Your Room</h1>
        <div className="flex items-center gap-3">
          <NotificationBell />
          <Button
            asChild
            className="bg-accent-blue text-white hover:bg-accent-dim rounded-md font-sans font-medium"
          >
            <Link href="/room/new">New Post</Link>
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-border mb-6">
        {(Object.keys(filterConfig) as FilterTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "pb-3 font-sans text-sm font-medium transition-colors relative",
              activeTab === tab 
                ? "text-accent-blue" 
                : "text-text-secondary hover:text-text-primary"
            )}
          >
            {filterConfig[tab].label} ({counts[tab]})
            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-blue" />
            )}
          </button>
        ))}
      </div>

      {/* Post list */}
      {filteredPosts.length > 0 ? (
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} variant="dashboard" />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="font-sans text-text-secondary mb-4">
            No {filterConfig[activeTab].label.toLowerCase()} yet.
          </p>
          <Button
            variant="ghost"
            asChild
            className="text-text-secondary hover:text-text-primary hover:bg-bg-raised font-sans"
          >
            <Link href="/room/new">Start writing</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
