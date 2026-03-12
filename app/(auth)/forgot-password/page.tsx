'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { sendPasswordReset } from '@/lib/auth-actions'

export default function ForgotPasswordPage() {
  const [identifier, setIdentifier] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!identifier.trim()) return
    setIsLoading(true)
    await sendPasswordReset(identifier.trim())
    setIsLoading(false)
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-bg-base noise-bg flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-bg-surface border border-border rounded-xl p-8">
        {submitted ? (
          <div className="text-center">
            <h1 className="font-serif text-2xl text-text-primary">
              Check your email
            </h1>
            <p className="mt-4 font-sans text-sm text-text-secondary">
              If an account exists for that email or username, you&apos;ll receive reset instructions shortly.
            </p>
            <Button
              asChild
              className="mt-6 w-full bg-accent-blue text-white hover:bg-accent-dim rounded-md font-sans font-medium"
            >
              <Link href="/login">Back to sign in</Link>
            </Button>
          </div>
        ) : (
          <>
            <h1 className="font-serif text-2xl text-text-primary">
              Reset your password
            </h1>
            <p className="mt-2 font-sans text-sm text-text-secondary">
              Enter your email or username and we&apos;ll send you a reset link.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="identifier"
                  className="font-sans text-sm text-text-secondary"
                >
                  Email or Username
                </label>
                <Input
                  id="identifier"
                  type="text"
                  placeholder="you@example.com or yourUsername"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                  className="w-full bg-bg-surface border-border text-text-primary placeholder:text-text-muted focus:border-accent-blue focus:ring-1 focus:ring-accent-blue/30"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-accent-blue text-white hover:bg-accent-dim rounded-md font-sans font-medium"
              >
                {isLoading ? 'Sending...' : 'Send reset link'}
              </Button>
            </form>

            <p className="mt-6 text-sm text-text-muted text-center font-sans">
              <Link href="/login" className="text-accent-blue hover:text-accent-dim">
                Back to sign in
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
