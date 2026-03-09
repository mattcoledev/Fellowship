export type PostType = 'essay' | 'story' | 'idea' | 'note'
export type PostStatus = 'draft' | 'private' | 'published'

export interface User {
  id: string
  username: string
  displayName: string
  bio: string
  avatar: string | null
}

export interface Post {
  id: string
  slug?: string
  title: string
  excerpt: string
  content: string
  type: PostType
  status: PostStatus
  tags: string[]
  authorId: string
  createdAt: string
  updatedAt: string
  commentCount: number
}

export interface Comment {
  id: string
  postId: string
  authorId: string
  content: string
  createdAt: string
  parentId: string | null
}
