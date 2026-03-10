import { createClient } from '@/lib/supabase/server'

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

export type Like = {
  id: string
  post_id: string
  user_id: string
  created_at: string
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

// Posts
export async function getUserPosts(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })

  if (error) throw error
  return data as Post[]
}

export async function getPublishedPosts() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      profiles (id, username, display_name, avatar_url)
    `)
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  if (error) throw error
  return data as (Post & { profiles: Profile })[]
}

export async function getPostBySlug(slug: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      profiles (id, username, display_name, avatar_url, bio)
    `)
    .eq('slug', slug)
    .single()

  if (error) throw error
  return data as Post & { profiles: Profile }
}

export async function getPostById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data as Post
}

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
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('posts')
    .insert(post)
    .select()
    .single()

  if (error) throw error
  return data as Post
}

export async function updatePost(id: string, updates: Partial<Post>) {
  const supabase = await createClient()
  
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
  const supabase = await createClient()
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// Comments
export async function getPostComments(postId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('comments')
    .select(`
      *,
      profiles (id, username, display_name, avatar_url)
    `)
    .eq('post_id', postId)
    .order('created_at', { ascending: true })

  if (error) throw error
  return data as (Comment & { profiles: Profile })[]
}

export async function createComment(comment: {
  post_id: string
  user_id: string
  content: string
  parent_id?: string
}) {
  const supabase = await createClient()
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

// Likes
export async function getLikeCount(postId: string) {
  const supabase = await createClient()
  const { count, error } = await supabase
    .from('likes')
    .select('*', { count: 'exact', head: true })
    .eq('post_id', postId)

  if (error) throw error
  return count || 0
}

export async function hasUserLiked(postId: string, userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('likes')
    .select('id')
    .eq('post_id', postId)
    .eq('user_id', userId)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return !!data
}

export async function toggleLike(postId: string, userId: string) {
  const supabase = await createClient()
  const liked = await hasUserLiked(postId, userId)

  if (liked) {
    const { error } = await supabase
      .from('likes')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', userId)
    if (error) throw error
    return false
  } else {
    const { error } = await supabase
      .from('likes')
      .insert({ post_id: postId, user_id: userId })
    if (error) throw error
    return true
  }
}

// Profiles
export async function getProfileByUsername(username: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single()

  if (error) throw error
  return data as Profile
}

export async function getProfileById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data as Profile
}

export async function updateProfile(id: string, updates: Partial<Profile>) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Profile
}

export async function getUserPublishedPosts(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  if (error) throw error
  return data as Post[]
}

// Forum - Threads
export async function getThreads() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('threads')
    .select(`
      *,
      profiles:user_id (id, username, display_name, avatar_url),
      last_reply_profile:last_reply_by (id, username, display_name)
    `)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Thread[]
}

export async function getThreadById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('threads')
    .select(`
      *,
      profiles:user_id (id, username, display_name, avatar_url)
    `)
    .eq('id', id)
    .single()

  if (error) throw error
  return data as Thread
}

// Forum - Replies
export async function getThreadReplies(threadId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('replies')
    .select(`
      *,
      profiles:user_id (id, username, display_name, avatar_url)
    `)
    .eq('thread_id', threadId)
    .order('created_at', { ascending: true })

  if (error) throw error
  return data as (Reply & { profiles: Profile })[]
}
