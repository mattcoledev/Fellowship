import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function EnterPage() {
  return (
    <div className="min-h-screen bg-bg-base noise-bg flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-bg-surface border border-border rounded-xl p-8 text-center">
        <h1 className="font-serif text-2xl text-text-primary">
          The Fellowship
        </h1>
        <p className="font-sans text-sm text-text-secondary mt-2">
          A private space for writing and reading.
        </p>

        <div className="mt-8 space-y-3">
          <Button 
            asChild
            className="w-full bg-accent-blue text-white hover:bg-accent-dim rounded-md font-sans font-medium"
          >
            <Link href="/login">Sign in</Link>
          </Button>
          
          <Button 
            asChild
            variant="outline"
            className="w-full border-border text-text-secondary hover:text-text-primary hover:bg-bg-raised rounded-md font-sans font-medium"
          >
            <Link href="/signup">Create account</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
