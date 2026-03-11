import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProfileByUsername, getUserPublishedPosts } from '@/lib/db'
import { createClient } from '@/lib/supabase/server'
import { PostCard } from '@/components/posts/PostCard'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/Avatar'

interface AuthorProfilePageProps {
  params: Promise<{ username: string }>
}

export default async function AuthorProfilePage({ params }: AuthorProfilePageProps) {
  const { username } = await params
  const supabase = await createClient()
  const { data: { user: currentUser } } = await supabase.auth.getUser()
  
  let profile
  try {
    profile = await getProfileByUsername(username)
  } catch {
    notFound()
  }

  if (!profile) {
    notFound()
  }

  const posts = await getUserPublishedPosts(profile.id)
  const isOwnProfile = currentUser?.id === profile.id

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
          <Avatar url={profile.avatar_url} name={profile.display_name || profile.username} size="lg" className="w-16 h-16 text-xl" />

          <div>
            {/* Name */}
            <h1 className="font-serif text-2xl text-text-primary">
              {profile.display_name || profile.username}
            </h1>

            {/* Bio */}
            {profile.bio && (
              <p className="mt-2 font-body text-base text-text-secondary italic">
                {profile.bio}
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
          Posts by {profile.display_name || profile.username}
        </h2>

        {posts.length > 0 ? (
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard 
                key={post.id} 
                post={{ ...post, profiles: profile }} 
                variant="feed"
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
