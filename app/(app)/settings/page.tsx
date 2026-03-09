import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getProfileById } from '@/lib/db'
import { SettingsForm } from '@/components/settings/SettingsForm'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const profile = await getProfileById(user.id)

  return (
    <SettingsForm 
      profile={profile} 
      email={user.email || ''} 
    />
  )
}
