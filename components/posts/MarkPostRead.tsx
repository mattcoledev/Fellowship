'use client'

import { useEffect } from 'react'
import { markPostRead } from '@/lib/read-actions'

export function MarkPostRead({ postId, userId }: { postId: string; userId?: string }) {
  useEffect(() => {
    if (userId) markPostRead(postId)
  }, [postId, userId])

  return null
}
