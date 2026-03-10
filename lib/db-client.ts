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

export type Thread = {
  id: string
  user_id: string
  title: string | null
  body: string
  reply_count: number
  last_reply_by: string | null
  last_reply_at: string | null
  created_at: string
  updated_at: string
  profiles?: Profile
  last_reply_profile?: Profile
}

export type Reply = {
  id: string
  thread_id: string
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

export async function updateComment(id: string, content: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('comments')
    .update({ content })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Comment
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

// Forum - Threads (client-side)
export async function createThread(thread: {
  user_id: string
  title?: string | null
  body: string
}) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('threads')
    .insert(thread)
    .select(`
      *,
      profiles:user_id (id, username, display_name, avatar_url)
    `)
    .single()

  if (error) throw error
  return data as Thread
}

export async function updateThread(id: string, updates: { title?: string | null; body?: string }) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('threads')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Thread
}

export async function deleteThread(id: string) {
  const supabase = createClient()
  const { error } = await supabase
    .from('threads')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// Forum - Replies (client-side)
export async function createReply(reply: {
  thread_id: string
  user_id: string
  content: string
  parent_id?: string | null
}) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('replies')
    .insert(reply)
    .select(`
      *,
      profiles:user_id (id, username, display_name, avatar_url)
    `)
    .single()

  if (error) throw error
  return data as Reply & { profiles: Profile }
}

export async function updateReply(id: string, content: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('replies')
    .update({ content })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Reply
}

export async function deleteReply(id: string) {
  const supabase = createClient()
  const { error } = await supabase
    .from('replies')
    .delete()
    .eq('id', id)

  if (error) throw error
}
