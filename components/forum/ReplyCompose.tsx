'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

interface ReplyComposeProps {
  currentUserInitial: string
  replyTo?: string | null
  onClearReplyTo?: () => void
}

export function ReplyCompose({ currentUserInitial, replyTo, onClearReplyTo }: ReplyComposeProps) {
  const [content, setContent] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (replyTo && textareaRef.current) {
      setContent(`@${replyTo} `)
      textareaRef.current.focus()
    }
  }, [replyTo])

  const handleSubmit = () => {
    if (!content.trim()) return
    // In a real app, this would post the reply
    setContent('')
    onClearReplyTo?.()
  }

  return (
    <div className="flex gap-3">
      <div className="w-7 h-7 rounded-full bg-accent-subtle text-accent flex items-center justify-center text-xs font-medium flex-shrink-0">
        {currentUserInitial}
      </div>
      <div className="flex-1 space-y-3">
        <Textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Reply..."
          className="min-h-[80px] bg-bg-surface border-border text-text-primary placeholder:text-text-muted font-sans text-sm resize-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue/30"
        />
        <div className="flex justify-end">
          <Button
            onClick={handleSubmit}
            disabled={!content.trim()}
            className="bg-accent-blue text-white hover:bg-accent-dim rounded-md font-sans font-medium text-sm"
          >
            Reply
          </Button>
        </div>
      </div>
    </div>
  )
}
