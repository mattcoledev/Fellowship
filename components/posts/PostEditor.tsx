'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, X } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { Post, createPost, updatePost } from '@/lib/db-client'
import { MarkdownToolbar } from '@/components/editor/MarkdownToolbar'

interface PostEditorProps {
  post?: Post
  userId: string
}

type PostType = 'essay' | 'poem' | 'fiction' | 'reflection'
type PostStatus = 'draft' | 'private' | 'published'

const postTypes: { value: PostType; label: string }[] = [
  { value: 'essay', label: 'Essay' },
  { value: 'poem', label: 'Poem' },
  { value: 'fiction', label: 'Fiction' },
  { value: 'reflection', label: 'Reflection' },
]

const visibilityOptions: { value: PostStatus; label: string }[] = [
  { value: 'draft', label: 'Draft' },
  { value: 'private', label: 'Private' },
  { value: 'published', label: 'Publish to Group' },
]

export function PostEditor({ post, userId }: PostEditorProps) {
  const router = useRouter()
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [postId, setPostId] = useState<string | null>(post?.id || null)
  const [title, setTitle] = useState(post?.title || '')
  const [content, setContent] = useState(post?.content || '')
  const [postType, setPostType] = useState<PostType>(post?.post_type || 'essay')
  const [visibility, setVisibility] = useState<PostStatus>(post?.status || 'draft')
  const [tags, setTags] = useState<string[]>(post?.tags || [])
  const [tagInput, setTagInput] = useState('')
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved' | 'error'>('saved')
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  // Calculate word count
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0

  // Generate excerpt from content
  const generateExcerpt = (text: string) => {
    const plainText = text.replace(/[#*_~`]/g, '').trim()
    return plainText.length > 200 ? plainText.substring(0, 200) + '...' : plainText
  }

  // Auto-save function
  const savePost = useCallback(async () => {
    if (!title.trim()) return

    setSaveStatus('saving')
    try {
      const postData = {
        title,
        content,
        excerpt: generateExcerpt(content),
        post_type: postType,
        status: visibility,
        tags,
        word_count: wordCount,
      }

      if (postId) {
        await updatePost(postId, postData)
      } else {
        const newPost = await createPost({
          ...postData,
          user_id: userId,
        })
        setPostId(newPost.id)
      }
      setSaveStatus('saved')
      setHasUnsavedChanges(false)
    } catch (error) {
      console.error('Failed to save post:', error)
      setSaveStatus('error')
    }
  }, [title, content, postType, visibility, tags, wordCount, postId, userId])

  // Auto-save with debounce
  useEffect(() => {
    if (!hasUnsavedChanges) return

    const timer = setTimeout(() => {
      savePost()
    }, 2000)

    return () => clearTimeout(timer)
  }, [hasUnsavedChanges, savePost])

  const markUnsaved = () => {
    setSaveStatus('unsaved')
    setHasUnsavedChanges(true)
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
    markUnsaved()
  }

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value)
    markUnsaved()
  }

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault()
      if (!tags.includes(tagInput.trim().toLowerCase())) {
        setTags([...tags, tagInput.trim().toLowerCase()])
      }
      setTagInput('')
      markUnsaved()
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
    markUnsaved()
  }

  const handlePublish = async () => {
    if (!title.trim()) {
      alert('Please add a title before publishing')
      return
    }

    setSaveStatus('saving')
    try {
      const postData = {
        title,
        content,
        excerpt: generateExcerpt(content),
        post_type: postType,
        status: visibility,
        tags,
        word_count: wordCount,
      }

      if (postId) {
        await updatePost(postId, postData)
      } else {
        await createPost({
          ...postData,
          user_id: userId,
        })
      }
      router.push('/room')
      router.refresh()
    } catch (error) {
      console.error('Failed to publish:', error)
      setSaveStatus('error')
    }
  }

  return (
    <div className="min-h-screen bg-bg-base">
      {/* Top bar */}
      <div className="sticky top-0 z-10 bg-bg-base border-b border-border">
        <div className="max-w-[800px] mx-auto px-6 py-3 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="text-text-secondary hover:text-text-primary hover:bg-bg-raised"
          >
            <Link href="/room">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Link>
          </Button>

          <span className="font-sans text-xs text-text-muted">
            {saveStatus === 'saving' && 'Saving...'}
            {saveStatus === 'saved' && 'Saved'}
            {saveStatus === 'unsaved' && 'Unsaved changes'}
            {saveStatus === 'error' && 'Failed to save'}
          </span>

          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-border text-text-secondary hover:text-text-primary hover:bg-bg-raised font-sans text-sm"
                >
                  {visibilityOptions.find(v => v.value === visibility)?.label}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end"
                className="bg-bg-surface border-border"
              >
                {visibilityOptions.map((option) => (
                  <DropdownMenuItem 
                    key={option.value}
                    onClick={() => {
                      setVisibility(option.value)
                      markUnsaved()
                    }}
                    className="font-sans text-sm text-text-primary hover:bg-bg-raised cursor-pointer"
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              onClick={handlePublish}
              disabled={saveStatus === 'saving'}
              className="bg-accent-blue text-white hover:bg-accent-dim rounded-md font-sans font-medium text-sm"
            >
              Save
            </Button>
          </div>
        </div>
      </div>

      {/* Editor area */}
      <div className="max-w-[800px] mx-auto px-6 py-8">
        {/* Title */}
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="Title..."
          className="w-full bg-transparent border-none outline-none font-serif text-4xl text-text-primary placeholder:text-text-muted"
        />

        {/* Post type selector */}
        <div className="mt-4 flex items-center gap-4">
          {postTypes.map((type, index) => (
            <button
              key={type.value}
              onClick={() => {
                setPostType(type.value)
                markUnsaved()
              }}
              className={cn(
                "font-sans text-sm transition-colors",
                postType === type.value 
                  ? "text-text-primary" 
                  : "text-text-secondary hover:text-text-primary"
              )}
            >
              {type.label}
              {index < postTypes.length - 1 && (
                <span className="text-text-muted ml-4">·</span>
              )}
            </button>
          ))}
        </div>

        {/* Tags input */}
        <div className="mt-4 flex items-center gap-2 flex-wrap">
          {tags.map((tag) => (
            <span 
              key={tag}
              className="inline-flex items-center gap-1 bg-accent-subtle text-accent-blue text-xs font-medium px-2 py-0.5 rounded"
            >
              {tag}
              <button 
                onClick={() => removeTag(tag)}
                className="hover:text-white transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            placeholder={tags.length === 0 ? "Add tags..." : ""}
            className="flex-1 min-w-[100px] bg-transparent border-none outline-none font-sans text-sm text-text-primary placeholder:text-text-muted"
          />
        </div>

        {/* Divider */}
        <div className="my-6 border-t border-border" />

        {/* Toolbar */}
        <MarkdownToolbar
          textareaRef={textareaRef}
          onChange={(v) => { setContent(v); markUnsaved() }}
          className="mb-4"
        />

        {/* Content area */}
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleContentChange}
          placeholder="Start writing..."
          className="w-full min-h-[400px] bg-transparent border-none outline-none resize-none font-body text-lg text-text-primary placeholder:text-text-muted leading-relaxed"
        />

        {/* Word count */}
        <div className="mt-4 text-right">
          <span className="font-sans text-xs text-text-muted">
            {wordCount} {wordCount === 1 ? 'word' : 'words'}
          </span>
        </div>
      </div>
    </div>
  )
}
