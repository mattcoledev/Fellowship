'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'
import { resolveUsernameToEmail } from '@/lib/auth-actions'

export default function LoginPage() {
  const router = useRouter()
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const resolveEmail = async (): Promise<string | null> => {
    const trimmed = identifier.trim()
    if (trimmed.includes('@')) return trimmed

    // It's a username — look up the email server-side
    const email = await resolveUsernameToEmail(trimmed)
    if (!email) {
      setError('No account found with that username.')
      return null
    }
    return email
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const email = await resolveEmail()
    if (!email) {
      setIsLoading(false)
      return
    }

    const supabase = createClient()
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      setError(signInError.message)
      setIsLoading(false)
      return
    }

    router.push('/common')
    router.refresh()
  }

  const handleMagicLink = async () => {
    const trimmed = identifier.trim()
    if (!trimmed) {
      setError('Please enter your email or username first')
      return
    }

    setIsLoading(true)
    setError(null)

    const email = await resolveEmail()
    if (!email) {
      setIsLoading(false)
      return
    }

    const supabase = createClient()
    const { error: otpError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/common`,
      },
    })

    if (otpError) {
      setError(otpError.message)
    } else {
      setMessage('Check your email for the magic link!')
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-bg-base noise-bg flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-bg-surface border border-border rounded-xl p-8">
        <h1 className="font-serif text-2xl text-text-primary">
          Welcome back.
        </h1>

        {error && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-md text-red-400 text-sm font-sans">
            {error}
          </div>
        )}

        {message && (
          <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-md text-green-400 text-sm font-sans">
            {message}
          </div>
        )}

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

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="font-sans text-sm text-text-secondary"
              >
                Password
              </label>
              <Link href="/forgot-password" className="font-sans text-xs text-text-muted hover:text-accent-blue transition-colors">
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-bg-surface border-border text-text-primary placeholder:text-text-muted focus:border-accent-blue focus:ring-1 focus:ring-accent-blue/30"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-accent-blue text-white hover:bg-accent-dim rounded-md font-sans font-medium"
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>

        <Button
          type="button"
          variant="ghost"
          onClick={handleMagicLink}
          disabled={isLoading}
          className="w-full mt-3 text-text-secondary hover:text-text-primary hover:bg-bg-raised font-sans"
        >
          Or sign in with a magic link
        </Button>

        <p className="mt-6 text-sm text-text-muted text-center font-sans">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-accent-blue hover:text-accent-dim">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
