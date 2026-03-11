import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPostBySlug, getPostComments } from '@/lib/db'
import { CommentThread } from '@/components/comments/CommentThread'
import { MarkdownRenderer } from '@/components/editor/MarkdownRenderer'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

interface PostDetailPageProps {
  params: Promise<{ slug: string }>
}

const typeLabels: Record<string, string> = {
  essay: 'Essay',
  poem: 'Poem',
  fiction: 'Fiction',
  reflection: 'Reflection',
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  })
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  let post
  try {
    post = await getPostBySlug(slug)
  } catch {
    notFound()
  }

  if (!post) {
    notFound()
  }

  const comments = await getPostComments(post.id)
  const author = post.profiles

  return (
    <div className="max-w-[860px] mx-auto px-6 py-8">
      {/* Back link */}
      <Link 
        href="/common" 
        className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors font-sans"
      >
        <ArrowLeft className="w-4 h-4" />
        The Common Room
      </Link>

      {/* Post header */}
      <div className="mt-6">
        {/* Type badge */}
        <span className="bg-accent-subtle text-accent-blue text-xs font-medium px-2 py-0.5 rounded">
          {typeLabels[post.post_type] || post.post_type}
        </span>

        {/* Title */}
        <h1 className="mt-3 mb-2 font-serif text-3xl text-text-primary">
          {post.title}
        </h1>

        {/* Author line */}
        <div className="mt-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-accent-subtle text-accent-blue flex items-center justify-center text-sm font-medium">
            {(author?.display_name || author?.username || 'A').charAt(0).toUpperCase()}
          </div>
          <div className="flex items-center gap-2">
            <Link 
              href={`/author/${author?.username}`}
              className="font-sans text-sm font-medium text-text-primary hover:text-accent-blue transition-colors"
            >
              {author?.display_name || author?.username}
            </Link>
            <span className="font-sans text-sm text-text-muted">
              {formatDate(post.published_at || post.created_at)}
            </span>
          </div>
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-4 flex items-center gap-2">
            {post.tags.map((tag) => (
              <span 
                key={tag}
                className="bg-accent-subtle text-accent-blue text-xs font-medium px-2 py-0.5 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="my-8 border-t border-border" />

      {/* Post body */}
      <MarkdownRenderer content={post.content ?? ''} variant="prose" />

      {/* Comments section */}
      <div className="mt-12 pt-8 border-t border-border">
        <CommentThread 
          comments={comments} 
          postId={post.id} 
          currentUserId={user?.id}
        />
      </div>
    </div>
  )
}
