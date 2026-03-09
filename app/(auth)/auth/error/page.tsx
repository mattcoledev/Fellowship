import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen bg-bg-base noise-bg flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-bg-surface border border-border rounded-xl p-8 text-center">
        <h1 className="font-serif text-2xl text-text-primary">
          Authentication Error
        </h1>
        
        <p className="mt-4 font-sans text-text-secondary">
          Something went wrong during authentication. Please try again.
        </p>

        <Button 
          asChild
          className="mt-6 w-full bg-accent-blue text-white hover:bg-accent-dim rounded-md font-sans font-medium"
        >
          <Link href="/login">
            Back to sign in
          </Link>
        </Button>
      </div>
    </div>
  )
}
