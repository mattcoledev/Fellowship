'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { createThread } from '@/lib/db-client'
import { createClient } from '@/lib/supabase/client'

export default function NewThreadPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserId(user.id)
      } else {
        router.push('/login')
      }
    }
    getUser()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!body.trim()) {
      setError('Write something first.')
      return
    }

    if (!userId) {
      setError('You must be logged in to post.')
      return
    }

    setIsSubmitting(true)
    
    try {
      await createThread({
        user_id: userId,
        title: title.trim() || null,
        body: body.trim(),
      })
      router.push('/forum')
      router.refresh()
    } catch (err) {
      console.error('Failed to create thread:', err)
      setError('Failed to create thread. Please try again.')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto px-6 py-8">
      <h1 className="font-serif text-2xl text-text-primary mb-6">
        New Thread
      </h1>

      <div className="bg-bg-surface border border-border rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title field */}
          <div>
            <label 
              htmlFor="title" 
              className="block font-sans text-sm text-text-secondary mb-2"
            >
              Title
            </label>
            <Input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Optional — leave blank if you don't need one."
              className="bg-bg-raised border-border text-text-primary placeholder:text-text-muted font-sans"
            />
          </div>

          {/* Body field */}
          <div>
            <label 
              htmlFor="body" 
              className="block font-sans text-sm text-text-secondary mb-2"
            >
              {"What's on your mind?"}
            </label>
            <Textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Start a thread..."
              className="min-h-[120px] bg-bg-raised border-border text-text-primary placeholder:text-text-muted font-sans resize-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue/30"
            />
            {error && (
              <p className="font-sans text-sm text-red-400 mt-2">{error}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              asChild
              className="font-sans text-text-muted hover:text-text-primary"
            >
              <Link href="/forum">Cancel</Link>
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-accent-blue text-white hover:bg-accent-dim rounded-md font-sans font-medium"
            >
              {isSubmitting ? 'Posting...' : 'Post to Forum'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
