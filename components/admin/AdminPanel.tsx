'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createInvite, revokeInvite, setMemberStatus, setAdminRole } from '@/lib/admin-actions'

interface Member {
  id: string
  username: string | null
  display_name: string | null
  is_admin: boolean
  member_status: string | null
  created_at: string
}

interface Invite {
  id: string
  email: string
  status: string
  invited_at: string
  accepted_at: string | null
}

interface AdminPanelProps {
  members: Member[]
  invites: Invite[]
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function AdminPanel({ members, invites }: AdminPanelProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteError, setInviteError] = useState<string | null>(null)
  const [inviteSuccess, setInviteSuccess] = useState<string | null>(null)
  const [isInviting, setIsInviting] = useState(false)

  const pendingInvites = invites.filter(i => i.status === 'pending')
  const acceptedInvites = invites.filter(i => i.status === 'accepted')

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inviteEmail.trim()) return
    setIsInviting(true)
    setInviteError(null)
    setInviteSuccess(null)

    const result = await createInvite(inviteEmail.trim())
    if (result.error) {
      setInviteError(result.error)
    } else {
      setInviteSuccess(`Invite created for ${inviteEmail.trim()}`)
      setInviteEmail('')
      startTransition(() => router.refresh())
    }
    setIsInviting(false)
  }

  const handleRevoke = (inviteId: string) => {
    startTransition(async () => {
      await revokeInvite(inviteId)
      router.refresh()
    })
  }

  const handleMemberStatus = (profileId: string, status: 'active' | 'disabled') => {
    startTransition(async () => {
      await setMemberStatus(profileId, status)
      router.refresh()
    })
  }

  const handleAdminToggle = (profileId: string, isAdmin: boolean) => {
    startTransition(async () => {
      await setAdminRole(profileId, isAdmin)
      router.refresh()
    })
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <h1 className="font-serif text-3xl text-text-primary mb-1">Admin</h1>
      <p className="font-sans text-sm text-text-muted mb-10">Manage members and invitations.</p>

      {/* Invite section */}
      <section className="mb-10">
        <p className="font-sans text-xs text-text-secondary uppercase tracking-wide mb-4">
          Invite a Member
        </p>
        <form onSubmit={handleInvite} className="flex gap-3">
          <input
            type="email"
            placeholder="email@example.com"
            value={inviteEmail}
            onChange={e => setInviteEmail(e.target.value)}
            required
            className="flex-1 bg-bg-surface border border-border rounded-md px-3 py-2 text-sm font-sans text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue/30"
          />
          <button
            type="submit"
            disabled={isInviting}
            className="px-4 py-2 bg-accent-blue text-white rounded-md text-sm font-sans font-medium hover:bg-accent-dim transition-colors disabled:opacity-50"
          >
            {isInviting ? 'Inviting...' : 'Send Invite'}
          </button>
        </form>
        {inviteError && (
          <p className="mt-2 text-sm text-red-400 font-sans">{inviteError}</p>
        )}
        {inviteSuccess && (
          <p className="mt-2 text-sm text-green-400 font-sans">{inviteSuccess}</p>
        )}
      </section>

      <div className="border-t border-border mb-10" />

      {/* Members */}
      <section className="mb-10">
        <p className="font-sans text-xs text-text-secondary uppercase tracking-wide mb-4">
          Members ({members.length})
        </p>
        <div className="space-y-2">
          {members.map(member => (
            <div
              key={member.id}
              className="bg-bg-surface border border-border rounded-lg px-4 py-3 flex items-center justify-between gap-4"
            >
              <div className="min-w-0">
                <p className="font-sans text-sm font-medium text-text-primary truncate">
                  {member.display_name || member.username || 'Unknown'}
                  {member.is_admin && (
                    <span className="ml-2 text-xs text-accent-blue">admin</span>
                  )}
                </p>
                <p className="font-sans text-xs text-text-muted">
                  @{member.username} · joined {formatDate(member.created_at)}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-xs font-sans px-2 py-0.5 rounded-full ${
                  member.member_status === 'active'
                    ? 'bg-green-500/10 text-green-400'
                    : 'bg-red-500/10 text-red-400'
                }`}>
                  {member.member_status ?? 'pending'}
                </span>
                {member.member_status === 'active' ? (
                  <button
                    onClick={() => handleMemberStatus(member.id, 'disabled')}
                    disabled={isPending}
                    className="text-xs font-sans text-text-muted hover:text-red-400 transition-colors disabled:opacity-50"
                  >
                    Disable
                  </button>
                ) : (
                  <button
                    onClick={() => handleMemberStatus(member.id, 'active')}
                    disabled={isPending}
                    className="text-xs font-sans text-text-muted hover:text-green-400 transition-colors disabled:opacity-50"
                  >
                    Reactivate
                  </button>
                )}
                <button
                  onClick={() => handleAdminToggle(member.id, !member.is_admin)}
                  disabled={isPending}
                  className="text-xs font-sans text-text-muted hover:text-text-primary transition-colors disabled:opacity-50"
                >
                  {member.is_admin ? 'Remove admin' : 'Make admin'}
                </button>
              </div>
            </div>
          ))}
          {members.length === 0 && (
            <p className="font-sans text-sm text-text-muted">No members yet.</p>
          )}
        </div>
      </section>

      <div className="border-t border-border mb-10" />

      {/* Pending invites */}
      <section className="mb-10">
        <p className="font-sans text-xs text-text-secondary uppercase tracking-wide mb-4">
          Pending Invites ({pendingInvites.length})
        </p>
        <div className="space-y-2">
          {pendingInvites.map(invite => (
            <div
              key={invite.id}
              className="bg-bg-surface border border-border rounded-lg px-4 py-3 flex items-center justify-between gap-4"
            >
              <div>
                <p className="font-sans text-sm text-text-primary">{invite.email}</p>
                <p className="font-sans text-xs text-text-muted">Invited {formatDate(invite.invited_at)}</p>
              </div>
              <button
                onClick={() => handleRevoke(invite.id)}
                disabled={isPending}
                className="text-xs font-sans text-text-muted hover:text-red-400 transition-colors disabled:opacity-50"
              >
                Revoke
              </button>
            </div>
          ))}
          {pendingInvites.length === 0 && (
            <p className="font-sans text-sm text-text-muted">No pending invites.</p>
          )}
        </div>
      </section>

      {acceptedInvites.length > 0 && (
        <>
          <div className="border-t border-border mb-10" />
          <section>
            <p className="font-sans text-xs text-text-secondary uppercase tracking-wide mb-4">
              Accepted Invites ({acceptedInvites.length})
            </p>
            <div className="space-y-2">
              {acceptedInvites.map(invite => (
                <div
                  key={invite.id}
                  className="px-4 py-3 flex items-center justify-between gap-4"
                >
                  <p className="font-sans text-sm text-text-muted">{invite.email}</p>
                  <p className="font-sans text-xs text-text-muted">
                    {invite.accepted_at ? formatDate(invite.accepted_at) : '—'}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  )
}
