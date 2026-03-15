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
import { MarkdownRenderer } from '@/components/editor/MarkdownRenderer'
import { searchPostsForReadNext } from '@/lib/post-actions'

type ReadNextPost = { id: string; title: string; slug: string | null; post_type: string; tags: string[] }

interface PostEditorProps {
  post?: Post
  userId: string
  readNextPosts?: ReadNextPost[]
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

export function PostEditor({ post, userId, readNextPosts: initialReadNextPosts = [] }: PostEditorProps) {
  const router = useRouter()
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [postId, setPostId] = useState<string | null>(post?.id || null)
  const [title, setTitle] = useState(post?.title || '')
  const [content, setContent] = useState(post?.content || '')
  const [authorsNote, setAuthorsNote] = useState(post?.authors_note || '')
  const [postType, setPostType] = useState<PostType>(post?.post_type || 'essay')
  const [visibility, setVisibility] = useState<PostStatus>(post?.status || 'draft')
  const [tags, setTags] = useState<string[]>(post?.tags || [])
  const [tagInput, setTagInput] = useState('')
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved' | 'error'>('saved')
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [mode, setMode] = useState<'edit' | 'preview'>('edit')

  // Read Next state
  const [readNextIds, setReadNextIds] = useState<string[]>(post?.read_next_ids || [])
  const [readNextPosts, setReadNextPosts] = useState<ReadNextPost[]>(initialReadNextPosts)
  const [readNextQuery, setReadNextQuery] = useState('')
  const [readNextShowAll, setReadNextShowAll] = useState(false)
  const [readNextResults, setReadNextResults] = useState<ReadNextPost[]>([])
  const [readNextSearching, setReadNextSearching] = useState(false)
  const readNextSearchRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Calculate word count
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0

  // Generate excerpt from content
  const generateExcerpt = (text: string) => {
    const plainText = text.replace(/[#*_~`]/g, '').trim()
    return plainText.length > 200 ? plainText.substring(0, 200) + '...' : plainText
  }

  // Read Next search effect
  useEffect(() => {
    if (readNextSearchRef.current) clearTimeout(readNextSearchRef.current)
    readNextSearchRef.current = setTimeout(async () => {
      setReadNextSearching(true)
      try {
        const results = await searchPostsForReadNext(readNextQuery, userId, readNextShowAll)
        setReadNextResults(results.filter(r => r.id !== postId && !readNextIds.includes(r.id)))
      } finally {
        setReadNextSearching(false)
      }
    }, 300)
    return () => { if (readNextSearchRef.current) clearTimeout(readNextSearchRef.current) }
  }, [readNextQuery, readNextShowAll, userId, postId, readNextIds])

  const addReadNext = (p: ReadNextPost) => {
    if (readNextIds.length >= 3) return
    setReadNextIds(prev => [...prev, p.id])
    setReadNextPosts(prev => [...prev, p])
    setReadNextResults(prev => prev.filter(r => r.id !== p.id))
    markUnsaved()
  }

  const removeReadNext = (id: string) => {
    setReadNextIds(prev => prev.filter(x => x !== id))
    setReadNextPosts(prev => prev.filter(p => p.id !== id))
    markUnsaved()
  }

  // Auto-save function
  const savePost = useCallback(async () => {
    if (!title.trim()) return

    setSaveStatus('saving')
    try {
      const postData = {
        title,
        content,
        authors_note: authorsNote || null,
        read_next_ids: readNextIds,
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
  }, [title, content, authorsNote, readNextIds, postType, visibility, tags, wordCount, postId, userId])

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
        authors_note: authorsNote || null,
        read_next_ids: readNextIds,
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

          <div className="flex items-center gap-4">
            {/* Edit / Preview toggle */}
            <div className="flex items-center gap-1 font-sans text-sm">
              <button
                onClick={() => setMode('edit')}
                className={cn(
                  'px-3 py-1 rounded transition-colors',
                  mode === 'edit'
                    ? 'text-text-primary bg-bg-raised'
                    : 'text-text-muted hover:text-text-primary'
                )}
              >
                Edit
              </button>
              <button
                onClick={() => setMode('preview')}
                className={cn(
                  'px-3 py-1 rounded transition-colors',
                  mode === 'preview'
                    ? 'text-text-primary bg-bg-raised'
                    : 'text-text-muted hover:text-text-primary'
                )}
              >
                Preview
              </button>
            </div>

            <span className="font-sans text-xs text-text-muted">
              {saveStatus === 'saving' && 'Saving...'}
              {saveStatus === 'saved' && 'Saved'}
              {saveStatus === 'unsaved' && 'Unsaved changes'}
              {saveStatus === 'error' && 'Failed to save'}
            </span>
          </div>

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

        {mode === 'preview' ? (
          /* ── Preview mode ── */
          <div>
            <p className="font-sans text-xs text-text-muted uppercase tracking-wide mb-6">
              Preview — not published
            </p>
            <h1 className="font-serif text-4xl text-text-primary mb-4">
              {title || <span className="text-text-muted">Untitled</span>}
            </h1>
            {authorsNote && (
              <p className="font-sans text-sm text-text-secondary italic mb-6 border-l-2 border-border pl-4">
                {authorsNote}
              </p>
            )}
            {content ? (
              <MarkdownRenderer content={content} variant="prose" />
            ) : (
              <p className="font-body text-lg text-text-muted italic">No content yet.</p>
            )}
          </div>
        ) : (
          /* ── Edit mode ── */
          <>
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

            {/* Author's Note */}
            <div className="mb-6">
              <label className="block font-sans text-xs text-text-muted uppercase tracking-wide mb-2">
                Author&apos;s Note <span className="normal-case">(optional)</span>
              </label>
              <textarea
                value={authorsNote}
                onChange={(e) => { setAuthorsNote(e.target.value); markUnsaved() }}
                placeholder="Give your readers some context before they dive in..."
                rows={2}
                className="w-full bg-transparent border-none outline-none resize-none font-sans text-sm text-text-secondary placeholder:text-text-muted leading-relaxed"
              />
            </div>

            <div className="border-t border-border mb-6" />

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
          </>
        )}

        {/* Read Next — edit mode only */}
        {mode === 'edit' && <div className="mt-10 pt-8 border-t border-border">
          <div className="flex items-center justify-between mb-3">
            <label className="font-sans text-xs text-text-muted uppercase tracking-wide">
              Read Next <span className="normal-case">(optional · up to 3)</span>
            </label>
            <div className="flex items-center gap-1 text-xs font-sans">
              <button
                type="button"
                onClick={() => setReadNextShowAll(false)}
                className={cn(
                  'px-2 py-0.5 rounded transition-colors',
                  !readNextShowAll ? 'text-text-primary' : 'text-text-muted hover:text-text-primary'
                )}
              >
                My posts
              </button>
              <span className="text-text-muted">·</span>
              <button
                type="button"
                onClick={() => setReadNextShowAll(true)}
                className={cn(
                  'px-2 py-0.5 rounded transition-colors',
                  readNextShowAll ? 'text-text-primary' : 'text-text-muted hover:text-text-primary'
                )}
              >
                All posts
              </button>
            </div>
          </div>

          {/* Selected posts */}
          {readNextPosts.length > 0 && (
            <ul className="mb-3 space-y-1">
              {readNextPosts.map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-2 py-1">
                  <span className="font-sans text-sm text-text-primary truncate">{p.title}</span>
                  <button
                    type="button"
                    onClick={() => removeReadNext(p.id)}
                    className="shrink-0 text-text-muted hover:text-text-primary transition-colors"
                    aria-label="Remove"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* Search input */}
          {readNextIds.length < 3 && (
            <div className="relative">
              <input
                type="text"
                value={readNextQuery}
                onChange={(e) => setReadNextQuery(e.target.value)}
                placeholder="Search posts..."
                className="w-full bg-bg-surface border border-border rounded-md px-3 py-2 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue/30"
              />
              {(readNextQuery || readNextSearching) && readNextResults.length > 0 && (
                <ul className="absolute z-10 mt-1 w-full bg-bg-surface border border-border rounded-md shadow-lg max-h-48 overflow-y-auto">
                  {readNextResults.map((r) => (
                    <li key={r.id}>
                      <button
                        type="button"
                        onClick={() => { addReadNext(r); setReadNextQuery('') }}
                        className="w-full text-left px-3 py-2 text-sm text-text-primary hover:bg-bg-raised transition-colors"
                      >
                        {r.title}
                        <span className="ml-2 text-xs text-text-muted capitalize">{r.post_type}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {readNextQuery && !readNextSearching && readNextResults.length === 0 && (
                <p className="mt-2 text-xs text-text-muted font-sans">No matching posts found.</p>
              )}
            </div>
          )}
        </div>}
      </div>
    </div>
  )
}
