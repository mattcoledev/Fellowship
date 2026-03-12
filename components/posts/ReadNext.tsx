import Link from 'next/link'

interface ReadNextPost {
  id: string
  title: string
  slug: string | null
  post_type: string
  tags: string[]
}

interface ReadNextProps {
  posts: ReadNextPost[]
}

export function ReadNext({ posts }: ReadNextProps) {
  if (!posts.length) return null

  return (
    <div className="mt-12 pt-8 border-t border-border">
      <p className="font-sans text-xs text-text-muted uppercase tracking-widest mb-4">
        Read Next
      </p>
      <ul className="space-y-3">
        {posts.map((post) => (
          <li key={post.id}>
            <Link
              href={`/common/${post.slug}`}
              className="group flex items-baseline gap-3"
            >
              {post.tags?.[0] && (
                <span className="font-sans text-xs text-text-muted shrink-0">
                  {post.tags[0]}
                </span>
              )}
              <span className="font-serif text-lg text-text-primary group-hover:text-accent-blue transition-colors">
                {post.title}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
