import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPostBySlug, getPostComments, getProfileById, getLikeCount, hasUserLiked, getCommentLikesData, getPostsByIds } from '@/lib/db'
import { CommentThread } from '@/components/comments/CommentThread'
import { MarkdownRenderer } from '@/components/editor/MarkdownRenderer'
import { LikeButton } from '@/components/ui/LikeButton'
import { ReadNext } from '@/components/posts/ReadNext'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Avatar } from '@/components/ui/avatar'

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

  let isAdmin = false
  if (user) {
    const { data: adminProfile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()
    isAdmin = adminProfile?.is_admin ?? false
  }

  let post
  try {
    post = await getPostBySlug(slug)
  } catch {
    notFound()
  }

  if (!post) {
    notFound()
  }

  const [comments, currentUserProfile, postLikeCount, postUserLiked, readNextPosts] = await Promise.all([
    getPostComments(post.id),
    user ? getProfileById(user.id) : Promise.resolve(null),
    getLikeCount(post.id),
    user ? hasUserLiked(post.id, user.id) : Promise.resolve(false),
    post.read_next_ids?.length ? getPostsByIds(post.read_next_ids) : Promise.resolve([]),
  ])

  const commentIds = comments.map(c => c.id)
  const commentLikesData = await getCommentLikesData(commentIds, user?.id)

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
          <Link href={`/author/${author?.username}`}>
            <Avatar url={author?.avatar_url} name={author?.display_name || author?.username} size="lg" />
          </Link>
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

      {/* Author's Note */}
      {post.authors_note && (
        <div className="mb-8 pl-4 border-l-2 border-accent-blue">
          <p className="font-sans text-xs text-accent-blue uppercase tracking-wide mb-1">Author&apos;s Note</p>
          <p className="font-sans text-sm text-text-secondary italic leading-relaxed">
            {post.authors_note}
          </p>
        </div>
      )}

      {/* Post body */}
      <MarkdownRenderer content={post.content ?? ''} variant="prose" />

      {/* Post like */}
      <div className="mt-8 flex items-center gap-2">
        <LikeButton
          contentType="post"
          contentId={post.id}
          initialCount={postLikeCount}
          initialLiked={postUserLiked}
          currentUserId={user?.id}
        />
      </div>

      {/* Read Next */}
      <ReadNext posts={readNextPosts} />

      {/* Comments section */}
      <div className="mt-8 pt-8 border-t border-border">
        <CommentThread
          comments={comments}
          postId={post.id}
          currentUserId={user?.id}
          currentUserProfile={currentUserProfile}
          commentLikesData={commentLikesData}
          isAdmin={isAdmin}
        />
      </div>
    </div>
  )
}
