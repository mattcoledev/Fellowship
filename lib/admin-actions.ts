'use server'

import { supabaseAdmin } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!profile?.is_admin) throw new Error('Unauthorized')
  return user
}

export async function getAdminData() {
  await requireAdmin()

  const [{ data: members }, { data: invites }] = await Promise.all([
    supabaseAdmin
      .from('profiles')
      .select('id, username, display_name, is_admin, member_status, created_at')
      .order('created_at', { ascending: true }),
    supabaseAdmin
      .from('invites')
      .select('id, email, status, invited_at, accepted_at')
      .order('invited_at', { ascending: false }),
  ])

  return { members: members ?? [], invites: invites ?? [] }
}

export async function createInvite(email: string) {
  await requireAdmin()

  const normalized = email.toLowerCase().trim()
  const { error } = await supabaseAdmin
    .from('invites')
    .insert({ email: normalized })

  if (error) {
    if (error.code === '23505') return { error: 'An active invite for that email already exists.' }
    return { error: error.message }
  }

  return { success: true }
}

export async function revokeInvite(inviteId: string) {
  await requireAdmin()

  const { error } = await supabaseAdmin
    .from('invites')
    .update({ status: 'revoked' })
    .eq('id', inviteId)

  if (error) return { error: error.message }
  return { success: true }
}

export async function setMemberStatus(profileId: string, status: 'active' | 'disabled') {
  await requireAdmin()

  const { error } = await supabaseAdmin
    .from('profiles')
    .update({ member_status: status })
    .eq('id', profileId)

  if (error) return { error: error.message }
  return { success: true }
}

export async function setAdminRole(profileId: string, isAdmin: boolean) {
  await requireAdmin()

  const { error } = await supabaseAdmin
    .from('profiles')
    .update({ is_admin: isAdmin })
    .eq('id', profileId)

  if (error) return { error: error.message }
  return { success: true }
}
