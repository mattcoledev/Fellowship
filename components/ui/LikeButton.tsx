'use client'

import { useState } from 'react'
import { Heart } from 'lucide-react'
import { togglePostLike, toggleCommentLike, toggleThreadLike, toggleReplyLike } from '@/lib/like-actions'

interface LikeButtonProps {
  contentType: 'post' | 'comment' | 'thread' | 'reply'
  contentId: string
  initialCount: number
  initialLiked: boolean
  currentUserId: string | null | undefined
}

export function LikeButton({ contentType, contentId, initialCount, initialLiked, currentUserId }: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked)
  const [count, setCount] = useState(initialCount)
  const [isLoading, setIsLoading] = useState(false)

  const handleToggle = async () => {
    if (!currentUserId || isLoading) return

    const prevLiked = liked
    const prevCount = count
    setLiked(!liked)
    setCount(!liked ? count + 1 : count - 1)
    setIsLoading(true)

    try {
      let result
      if (contentType === 'post') result = await togglePostLike(contentId)
      else if (contentType === 'comment') result = await toggleCommentLike(contentId)
      else if (contentType === 'thread') result = await toggleThreadLike(contentId)
      else result = await toggleReplyLike(contentId)

      setLiked(result.liked)
      setCount(result.count)
    } catch {
      setLiked(prevLiked)
      setCount(prevCount)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={!currentUserId || isLoading}
      className={`flex items-center gap-1 font-sans text-xs transition-colors ${
        liked ? 'text-red-400' : 'text-text-muted hover:text-red-400'
      } ${!currentUserId ? 'opacity-40 cursor-default' : 'cursor-pointer'}`}
    >
      <Heart className={`w-3.5 h-3.5 ${liked ? 'fill-current' : ''}`} />
      {count > 0 && <span>{count}</span>}
    </button>
  )
}
