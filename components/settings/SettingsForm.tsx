'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Profile, updateProfile } from '@/lib/db-client'
import { signOut } from '@/lib/auth-actions'
import { createClient } from '@/lib/supabase/client'
import { Avatar } from '@/components/ui/avatar'

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
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url || '')
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)

  const maxBioLength = 280

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Image must be under 2MB.' })
      e.target.value = ''
      return
    }

    setIsUploadingAvatar(true)
    try {
      const supabase = createClient()
      const ext = file.name.split('.').pop()
      const path = `${profile.id}/avatar.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(path, file, { upsert: true })
      if (uploadError) throw uploadError
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(path)
      await updateProfile(profile.id, { avatar_url: publicUrl })
      setAvatarUrl(publicUrl)
      router.refresh()
    } catch (error) {
      console.error('Failed to upload avatar:', error)
      setMessage({ type: 'error', text: 'Failed to upload image. Please try again.' })
    } finally {
      setIsUploadingAvatar(false)
    }
  }

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
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <Avatar url={avatarUrl} name={displayName || profile.username} size="lg" className="w-16 h-16 text-lg" />
            <div>
              <label
                htmlFor="avatar"
                className={`inline-block font-sans text-sm px-3 py-1.5 rounded-md border border-border cursor-pointer transition-colors ${
                  isUploadingAvatar
                    ? 'text-text-muted bg-bg-raised cursor-not-allowed'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-raised'
                }`}
              >
                {isUploadingAvatar ? 'Uploading...' : 'Change photo'}
              </label>
              <input
                id="avatar"
                type="file"
                accept="image/*"
                disabled={isUploadingAvatar}
                onChange={handleAvatarUpload}
                className="sr-only"
              />
              <p className="mt-1 font-sans text-xs text-text-muted">JPG, PNG or GIF</p>
            </div>
          </div>

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
