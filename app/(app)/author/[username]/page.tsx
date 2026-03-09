import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getUserByUsername, getPostsByAuthor, currentUser } from '@/lib/mock-data'
import { PostCard } from '@/components/posts/PostCard'
import { Button } from '@/components/ui/button'

interface AuthorProfilePageProps {
  params: Promise<{ username: string }>
}

export default async function AuthorProfilePage({ params }: AuthorProfilePageProps) {
  const { username } = await params
  const user = getUserByUsername(username)

  if (!user) {
    notFound()
  }

  const posts = getPostsByAuthor(user.id).filter(post => post.status === 'published')
  const isOwnProfile = user.id === currentUser.id

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      {/* Profile header card */}
      <div className="bg-bg-surface border border-border rounded-lg p-6 relative">
        {isOwnProfile && (
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="absolute top-4 right-4 text-text-secondary hover:text-text-primary hover:bg-bg-raised font-sans text-sm"
          >
            <Link href="/settings">Edit profile</Link>
          </Button>
        )}

        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-full bg-accent-subtle text-accent-blue flex items-center justify-center text-xl font-medium flex-shrink-0">
            {user.displayName.charAt(0).toUpperCase()}
          </div>

          <div>
            {/* Name */}
            <h1 className="font-serif text-2xl text-text-primary">
              {user.displayName}
            </h1>

            {/* Bio */}
            {user.bio && (
              <p className="mt-2 font-body text-base text-text-secondary italic">
                {user.bio}
              </p>
            )}

            {/* Post count */}
            <p className="mt-3 font-sans text-sm text-text-muted">
              {posts.length} {posts.length === 1 ? 'post' : 'posts'} shared
            </p>
          </div>
        </div>
      </div>

      {/* Posts section */}
      <div className="mt-8">
        <h2 className="font-sans text-sm text-text-muted uppercase tracking-wide mb-4">
          Posts by {user.displayName}
        </h2>

        {posts.length > 0 ? (
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard 
                key={post.id} 
                post={post} 
                variant="feed"
                authorName={user.displayName}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="font-sans text-text-secondary">
              No posts yet.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
