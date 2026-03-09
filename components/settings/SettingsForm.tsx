'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Profile, updateProfile } from '@/lib/db-client'
import { signOut } from '@/lib/auth-actions'

interface SettingsFormProps {
  profile: Profile
  email: string
}

export function SettingsForm({ profile, email }: SettingsFormProps) {
  const router = useRouter()
  const [displayName, setDisplayName] = useState(profile.display_name || '')
  const [bio, setBio] = useState(profile.bio || '')
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const maxBioLength = 280

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setMessage(null)
    
    try {
      await updateProfile(profile.id, {
        display_name: displayName,
        bio,
      })
      setMessage({ type: 'success', text: 'Profile updated successfully!' })
      router.refresh()
    } catch (error) {
      console.error('Failed to update profile:', error)
      setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' })
    } finally {
      setIsSaving(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <div className="max-w-lg mx-auto px-6 py-8">
      {/* Page heading */}
      <h1 className="font-serif text-2xl text-text-primary mb-8">
        Settings
      </h1>

      {/* Message */}
      {message && (
        <div className={`mb-6 p-3 rounded-md text-sm font-sans ${
          message.type === 'success' 
            ? 'bg-green-500/10 border border-green-500/20 text-green-400'
            : 'bg-red-500/10 border border-red-500/20 text-red-400'
        }`}>
          {message.text}
        </div>
      )}

      {/* Your Profile section */}
      <div className="bg-bg-surface border border-border rounded-lg p-6">
        <h2 className="font-sans text-sm text-text-muted uppercase tracking-wide mb-6">
          Your Profile
        </h2>

        <form onSubmit={handleSave} className="space-y-4">
          {/* Username (read-only) */}
          <div className="space-y-2">
            <label 
              htmlFor="username" 
              className="font-sans text-sm text-text-secondary"
            >
              Username
            </label>
            <Input
              id="username"
              type="text"
              value={profile.username}
              readOnly
              className="w-full bg-bg-raised border-border text-text-muted cursor-not-allowed"
            />
            <p className="font-sans text-xs text-text-muted">
              Usernames cannot be changed.
            </p>
          </div>

          {/* Display name */}
          <div className="space-y-2">
            <label 
              htmlFor="displayName" 
              className="font-sans text-sm text-text-secondary"
            >
              Display name
            </label>
            <Input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full bg-bg-surface border-border text-text-primary focus:border-accent-blue focus:ring-1 focus:ring-accent-blue/30"
            />
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <label 
              htmlFor="bio" 
              className="font-sans text-sm text-text-secondary"
            >
              Bio
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value.slice(0, maxBioLength))}
              rows={3}
              className="w-full bg-bg-surface border border-border rounded-md p-3 text-text-primary placeholder:text-text-muted resize-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue/30 outline-none font-sans text-sm"
            />
            <p className="font-sans text-xs text-text-muted text-right">
              {bio.length} / {maxBioLength}
            </p>
          </div>

          {/* Email (read-only) */}
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
              value={email}
              readOnly
              className="w-full bg-bg-raised border-border text-text-muted cursor-not-allowed"
            />
          </div>

          {/* Save button */}
          <div className="pt-2 flex justify-end">
            <Button
              type="submit"
              disabled={isSaving}
              className="bg-accent-blue text-white hover:bg-accent-dim rounded-md font-sans font-medium"
            >
              {isSaving ? 'Saving...' : 'Save changes'}
            </Button>
          </div>
        </form>
      </div>

      {/* Account section */}
      <div className="mt-6 bg-bg-surface border border-border rounded-lg p-6">
        <h2 className="font-sans text-sm text-text-muted uppercase tracking-wide mb-6">
          Account
        </h2>

        <div className="space-y-3">
          <Button
            variant="ghost"
            onClick={handleSignOut}
            className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-bg-raised font-sans"
          >
            Sign out
          </Button>
        </div>
      </div>
    </div>
  )
}
