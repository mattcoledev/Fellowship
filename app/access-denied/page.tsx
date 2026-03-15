import Link from 'next/link'
import { signOut } from '@/lib/auth-actions'

export default function AccessDeniedPage() {
  return (
    <div className="min-h-screen bg-bg-base noise-bg flex items-center justify-center p-4">
      <div className="w-full max-w-sm text-center">
        <h1 className="font-serif text-2xl text-text-primary mb-3">
          Fellowship is invite-only.
        </h1>
        <p className="font-sans text-sm text-text-muted mb-8">
          Your account hasn&apos;t been granted access. If you believe this is an error, reach out to an admin.
        </p>
        <form action={signOut}>
          <button
            type="submit"
            className="font-sans text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            Sign out
          </button>
        </form>
      </div>
    </div>
  )
}
