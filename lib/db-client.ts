'use client'

import { createClient } from '@/lib/supabase/client'

export type Profile = {
  id: string
  username: string
  display_name: string | null
  bio: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export type Post = {
  id: string
  user_id: string
  title: string
  content: string | null
  excerpt: string | null
  post_type: 'essay' | 'poem' | 'fiction' | 'reflection'
  status: 'draft' | 'private' | 'published'
  tags: string[]
  word_count: number
  slug: string | null
  published_at: string | null
  created_at: string
  updated_at: string
  profiles?: Profile
}

export type Comment = {
  id: string
  post_id: string
  user_id: string
  parent_id: string | null
  content: string
  created_at: string
  updated_at: string
  profiles?: Profile
}

// Client-side post operations
export async function createPost(post: {
  user_id: string
  title: string
  content?: string
  excerpt?: string
  post_type?: string
  status?: string
  tags?: string[]
  word_count?: number
}) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('posts')
    .insert(post)
    .select()
    .single()

  if (error) throw error
  return data as Post
}

export async function updatePost(id: string, updates: Partial<Post>) {
  const supabase = createClient()
  
  // If publishing, set published_at
  if (updates.status === 'published') {
    updates.published_at = new Date().toISOString()
  }
  
  const { data, error } = await supabase
    .from('posts')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Post
}

export async function deletePost(id: string) {
  const supabase = createClient()
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// Client-side comment operations
export async function createComment(comment: {
  post_id: string
  user_id: string
  content: string
  parent_id?: string
}) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('comments')
    .insert(comment)
    .select(`
      *,
      profiles (id, username, display_name, avatar_url)
    `)
    .single()

  if (error) throw error
  return data as Comment & { profiles: Profile }
}

// Client-side profile operations
export async function updateProfile(id: string, updates: Partial<Profile>) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Profile
}
