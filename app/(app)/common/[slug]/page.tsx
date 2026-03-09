import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPostBySlug, getUserById, getCommentsByPostId, formatDate } from '@/lib/mock-data'
import { CommentThread } from '@/components/comments/CommentThread'
import { ArrowLeft } from 'lucide-react'

interface PostDetailPageProps {
  params: Promise<{ slug: string }>
}

const typeLabels = {
  essay: 'Essay',
  story: 'Story',
  idea: 'Idea',
  note: 'Note',
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const author = getUserById(post.authorId)
  const comments = getCommentsByPostId(post.id)

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
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
          {typeLabels[post.type]}
        </span>

        {/* Title */}
        <h1 className="mt-3 font-serif text-3xl text-text-primary">
          {post.title}
        </h1>

        {/* Author line */}
        <div className="mt-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-accent-subtle text-accent-blue flex items-center justify-center text-sm font-medium">
            {author?.displayName.charAt(0).toUpperCase()}
          </div>
          <div className="flex items-center gap-2">
            <Link 
              href={`/author/${author?.username}`}
              className="font-sans text-sm font-medium text-text-primary hover:text-accent-blue transition-colors"
            >
              {author?.displayName}
            </Link>
            <span className="font-sans text-sm text-text-muted">
              {formatDate(post.createdAt)}
            </span>
          </div>
        </div>

        {/* Tags */}
        {post.tags.length > 0 && (
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
      <article className="prose-reading">
        {post.content.split('\n\n').map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </article>

      {/* Comments section */}
      <div className="mt-12 pt-8 border-t border-border">
        <CommentThread comments={comments} postId={post.id} />
      </div>
    </div>
  )
}
