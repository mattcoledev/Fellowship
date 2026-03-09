'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { signIn, signInWithMagicLink } from '@/lib/auth-actions'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    
    const formData = new FormData()
    formData.append('email', email)
    formData.append('password', password)
    
    const result = await signIn(formData)
    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
    }
  }

  const handleMagicLink = async () => {
    if (!email) {
      setError('Please enter your email first')
      return
    }
    setIsLoading(true)
    setError(null)
    
    const formData = new FormData()
    formData.append('email', email)
    
    const result = await signInWithMagicLink(formData)
    if (result?.error) {
      setError(result.error)
    } else if (result?.success) {
      setMessage(result.success)
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
              htmlFor="email" 
              className="font-sans text-sm text-text-secondary"
            >
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-bg-surface border-border text-text-primary placeholder:text-text-muted focus:border-accent-blue focus:ring-1 focus:ring-accent-blue/30"
            />
          </div>

          <div className="space-y-2">
            <label 
              htmlFor="password" 
              className="font-sans text-sm text-text-secondary"
            >
              Password
            </label>
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
