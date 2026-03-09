'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function EnterPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    
    try {
      const res = await fetch('/api/verify-gate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      
      const result = await res.json()
      
      if (result.success) {
        window.location.href = '/login'
      } else {
        setError(result.error || 'Invalid password')
        setIsLoading(false)
      }
    } catch {
      setError('Something went wrong')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg-base noise-bg flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-bg-surface border border-border rounded-xl p-8 text-center">
        <h1 className="font-serif text-2xl text-text-primary">
          The Fellowship
        </h1>
        <p className="font-sans text-sm text-text-secondary mt-2">
          A private space for writing and reading.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div className="text-left">
            <label htmlFor="password" className="block font-sans text-sm text-text-secondary mb-2">
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full bg-bg-raised border-border text-text-primary placeholder:text-text-muted font-mono"
              disabled={isLoading}
            />
          </div>
          
          {error && (
            <p className="text-sm text-red-400 font-sans">{error}</p>
          )}
          
          <Button 
            type="submit"
            disabled={isLoading || !password}
            className="w-full bg-accent-blue text-white hover:bg-accent-dim rounded-md font-sans font-medium"
          >
            {isLoading ? 'Verifying...' : 'Enter'}
          </Button>
        </form>
      </div>
    </div>
  )
}
