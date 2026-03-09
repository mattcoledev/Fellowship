'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function EnterPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(false)
    setIsLoading(true)
    
    // Simulate password check
    await new Promise(resolve => setTimeout(resolve, 500))
    
    if (password === 'theroom') {
      router.push('/room')
    } else {
      setError(true)
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg-base noise-bg flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-bg-surface border border-border rounded-xl p-8">
        <h1 className="font-serif text-2xl text-text-primary text-center">
          The Room
        </h1>
        <p className="font-sans text-sm text-text-secondary text-center mt-2">
          This is a private space.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-bg-surface border-border text-text-primary placeholder:text-text-muted focus:border-accent-blue focus:ring-1 focus:ring-accent-blue/30"
            />
          </div>

          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-accent-blue text-white hover:bg-accent-dim rounded-md font-sans font-medium"
          >
            {isLoading ? 'Entering...' : 'Enter'}
          </Button>

          {error && (
            <p className="text-sm text-red-400 text-center">
              Incorrect password. Try again.
            </p>
          )}
        </form>
      </div>
    </div>
  )
}
