'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { 
  ArrowLeft, 
  Bold, 
  Italic, 
  Heading2, 
  Heading3, 
  Quote, 
  List, 
  ListOrdered,
  Minus,
  Link as LinkIcon,
  X
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { PostType, PostStatus, Post } from '@/lib/types'

interface PostEditorProps {
  post?: Post
}

const postTypes: { value: PostType; label: string }[] = [
  { value: 'essay', label: 'Essay' },
  { value: 'story', label: 'Story' },
  { value: 'idea', label: 'Idea' },
  { value: 'note', label: 'Note' },
]

const visibilityOptions: { value: PostStatus; label: string }[] = [
  { value: 'draft', label: 'Draft' },
  { value: 'private', label: 'Private' },
  { value: 'published', label: 'Publish to Group' },
]

const toolbarButtons = [
  { icon: Bold, label: 'Bold' },
  { icon: Italic, label: 'Italic' },
  { icon: Heading2, label: 'Heading 2' },
  { icon: Heading3, label: 'Heading 3' },
  { icon: Quote, label: 'Blockquote' },
  { icon: List, label: 'Bullet List' },
  { icon: ListOrdered, label: 'Numbered List' },
  { icon: Minus, label: 'Horizontal Rule' },
  { icon: LinkIcon, label: 'Link' },
]

export function PostEditor({ post }: PostEditorProps) {
  const router = useRouter()
  const [title, setTitle] = useState(post?.title || '')
  const [content, setContent] = useState(post?.content || '')
  const [postType, setPostType] = useState<PostType>(post?.type || 'essay')
  const [visibility, setVisibility] = useState<PostStatus>(post?.status || 'draft')
  const [tags, setTags] = useState<string[]>(post?.tags || [])
  const [tagInput, setTagInput] = useState('')
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved')

  // Auto-save simulation
  const autoSave = useCallback(() => {
    if (title || content) {
      setSaveStatus('saving')
      setTimeout(() => {
        setSaveStatus('saved')
      }, 800)
    }
  }, [title, content])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (saveStatus === 'unsaved') {
        autoSave()
      }
    }, 2000)
    return () => clearTimeout(timer)
  }, [title, content, saveStatus, autoSave])

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
    setSaveStatus('unsaved')
  }

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value)
    setSaveStatus('unsaved')
  }

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault()
      if (!tags.includes(tagInput.trim().toLowerCase())) {
        setTags([...tags, tagInput.trim().toLowerCase()])
      }
      setTagInput('')
      setSaveStatus('unsaved')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
    setSaveStatus('unsaved')
  }

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0

  const handlePublish = () => {
    // Simulate publish
    setSaveStatus('saving')
    setTimeout(() => {
      setSaveStatus('saved')
      router.push('/room')
    }, 500)
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
                    onClick={() => setVisibility(option.value)}
                    className="font-sans text-sm text-text-primary hover:bg-bg-raised cursor-pointer"
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              onClick={handlePublish}
              className="bg-accent-blue text-white hover:bg-accent-dim rounded-md font-sans font-medium text-sm"
            >
              Publish
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
                setSaveStatus('unsaved')
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
        <div className="flex items-center gap-1 mb-4">
          {toolbarButtons.map((button) => (
            <button
              key={button.label}
              title={button.label}
              className="p-2 text-text-secondary hover:text-text-primary transition-colors rounded-md hover:bg-bg-raised"
            >
              <button.icon className="w-4 h-4" />
            </button>
          ))}
        </div>

        {/* Content area */}
        <textarea
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
