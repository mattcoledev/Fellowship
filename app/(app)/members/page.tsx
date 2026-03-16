import Link from 'next/link'
import { getActiveMembers } from '@/lib/db'
import { Avatar } from '@/components/ui/avatar'

export default async function MembersPage() {
  const members = await getActiveMembers()

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <h1 className="font-serif text-3xl text-text-primary mb-1">Members</h1>
      <p className="font-sans text-sm text-text-muted mb-10">
        Active members of the Fellowship.
      </p>

      <div className="space-y-1">
        {members.map(member => (
          <Link
            key={member.id}
            href={`/author/${member.username}`}
            className="group flex items-center gap-4 -mx-2 px-2 py-3 rounded-md hover:bg-bg-raised/60 transition-colors"
          >
            <Avatar
              url={member.avatar_url}
              name={member.display_name || member.username}
              size="lg"
              className="w-9 h-9 shrink-0"
            />
            <div className="min-w-0">
              <p className="font-sans text-sm font-semibold text-text-primary group-hover:text-accent-blue transition-colors">
                {member.display_name || member.username}
              </p>
              {member.bio && (
                <p className="font-sans text-xs text-text-muted truncate">
                  {member.bio}
                </p>
              )}
            </div>
          </Link>
        ))}
        {members.length === 0 && (
          <p className="font-sans text-sm text-text-muted">No members yet.</p>
        )}
      </div>
    </div>
  )
}
