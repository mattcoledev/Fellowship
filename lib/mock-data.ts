import { Post, User, Comment } from './types'

export const users: User[] = [
  {
    id: '1',
    username: 'matt',
    displayName: 'Matt',
    bio: 'Writing about culture and the spaces between things.',
    avatar: null,
  },
  {
    id: '2',
    username: 'james',
    displayName: 'James',
    bio: 'Reading and thinking in the Pacific Northwest.',
    avatar: null,
  },
  {
    id: '3',
    username: 'sarah',
    displayName: 'Sarah',
    bio: 'Essays on thinking, writing, and the creative life.',
    avatar: null,
  },
  {
    id: '4',
    username: 'marcus',
    displayName: 'Marcus',
    bio: 'Notes from the margins.',
    avatar: null,
  },
]

export const currentUser = users[0] // matt

export const posts: Post[] = [
  // Matt's posts
  {
    id: '1',
    slug: 'against-productivity-culture',
    title: 'Against Productivity Culture',
    excerpt: 'There is a particular cruelty in framing rest as something to be earned. We have built an entire vocabulary around guilt.',
    content: `There is a particular cruelty in framing rest as something to be earned. We have built an entire vocabulary around guilt.

We speak of "deserving" a break, of "earning" our weekends, as if existence itself were a debt to be paid through labor. The language betrays us: we "spend" time, we "invest" hours, we "waste" moments. Even our metaphors are transactional.

I have been thinking about this lately because I notice it in myself—the flinch when I sit down without a task, the ambient anxiety of an unscheduled afternoon. There is a voice that asks: what have you produced today? What can you show for these hours?

The voice is not mine, exactly. It has been trained into me by decades of optimization culture, by apps that gamify existence, by a economy that measures human worth in output. We have internalized the factory clock so completely that we carry it with us everywhere, even into our dreams.

Josef Pieper wrote about this in 1948, calling leisure the basis of culture. Not leisure as entertainment or distraction—those are themselves forms of consumption—but leisure as contemplation, as the willingness to be present without purpose. He saw the loss of this capacity as a kind of spiritual impoverishment.

What would it mean to rest without justification? To exist for an hour without producing, consuming, or improving? The question feels almost radical now, which is itself an indictment.`,
    type: 'essay',
    status: 'published',
    tags: ['culture', 'work'],
    authorId: '1',
    createdAt: '2024-02-15T10:00:00Z',
    updatedAt: '2024-02-15T14:30:00Z',
    commentCount: 4,
  },
  {
    id: '2',
    slug: 'a-walk-in-november',
    title: 'A Walk in November',
    excerpt: 'The leaves have mostly fallen now. There is something clarifying about bare branches against a gray sky.',
    content: `The leaves have mostly fallen now. There is something clarifying about bare branches against a gray sky—the structure of things revealed.

I walked the usual route this morning but saw it differently. Without the canopy, light reaches places it hasn't touched in months. The path feels wider, more exposed.

November always brings this stripping away. The trees let go of what they no longer need, conserving energy for the harder months ahead. There is wisdom in this that we rarely apply to our own lives.

What would we release if we trusted that it would return? What excess are we carrying through seasons that don't require it?

The cold was sharp but not unpleasant. My breath made small clouds that dissolved almost immediately. I thought about impermanence, about how we fear it even as we watch it happen constantly, beautifully, all around us.`,
    type: 'note',
    status: 'published',
    tags: ['personal'],
    authorId: '1',
    createdAt: '2024-02-10T08:00:00Z',
    updatedAt: '2024-02-10T08:45:00Z',
    commentCount: 2,
  },
  {
    id: '3',
    title: 'On the Difficulty of Starting',
    excerpt: '',
    content: 'The blank page is not the problem. The problem is all the words we carry that feel insufficient to the task...',
    type: 'essay',
    status: 'draft',
    tags: ['writing'],
    authorId: '1',
    createdAt: '2024-02-18T09:00:00Z',
    updatedAt: '2024-02-18T11:00:00Z',
    commentCount: 0,
  },
  {
    id: '4',
    title: 'The Cartographer',
    excerpt: '',
    content: 'She had been mapping the coastline for three years when she realized the land itself was moving...',
    type: 'story',
    status: 'draft',
    tags: ['fiction'],
    authorId: '1',
    createdAt: '2024-02-17T14:00:00Z',
    updatedAt: '2024-02-17T16:30:00Z',
    commentCount: 0,
  },
  {
    id: '5',
    title: 'Why I Read Slowly',
    excerpt: '',
    content: 'Speed is the enemy of attention. When we rush through words, we are not reading—we are scanning for information...',
    type: 'note',
    status: 'draft',
    tags: ['reading'],
    authorId: '1',
    createdAt: '2024-02-16T10:00:00Z',
    updatedAt: '2024-02-16T10:30:00Z',
    commentCount: 0,
  },
  {
    id: '6',
    title: 'Letter I Will Not Send',
    excerpt: '',
    content: 'There are things I have wanted to say to you for years. This is where I will say them, knowing you will never read it...',
    type: 'essay',
    status: 'private',
    tags: ['personal'],
    authorId: '1',
    createdAt: '2024-02-12T22:00:00Z',
    updatedAt: '2024-02-12T23:30:00Z',
    commentCount: 0,
  },
  // James's posts
  {
    id: '7',
    slug: 'notes-on-rereading-middlemarch',
    title: 'Notes on Rereading Middlemarch',
    excerpt: 'George Eliot understood something most novelists miss: that the most consequential moments in a life are invisible to everyone, including the person living it.',
    content: `George Eliot understood something most novelists miss: that the most consequential moments in a life are invisible to everyone, including the person living it.

Rereading Middlemarch for the third time, I am struck by how patient the book is with its characters. Eliot does not judge them for their blindnesses; she illuminates those blindnesses with such tenderness that we recognize our own.

Dorothea's idealism, Lydgate's ambition, Casaubon's fear—these are not flaws to be corrected but conditions of being human. We are all trapped in our perspectives, reaching for meaning we cannot quite grasp.

What makes the novel great is not its plot but its attention. Eliot looks at ordinary life with the intensity usually reserved for tragedy, and in doing so, reveals that ordinary life is tragedy—and comedy, and everything between.`,
    type: 'essay',
    status: 'published',
    tags: ['books', 'fiction'],
    authorId: '2',
    createdAt: '2024-02-14T12:00:00Z',
    updatedAt: '2024-02-14T15:00:00Z',
    commentCount: 7,
  },
  {
    id: '8',
    slug: 'silence-as-a-writing-tool',
    title: 'Silence as a Writing Tool',
    excerpt: 'The hardest edit is removing the sentence you wrote to fill a silence that should have stayed.',
    content: `The hardest edit is removing the sentence you wrote to fill a silence that should have stayed.

We fear silence on the page as we fear it in conversation—as absence, as failure, as something that must be filled. But silence is not nothing. It is the space where meaning lives.

The best writers know when not to speak. They trust the reader to complete what the text begins. They leave room for resonance.

I am learning this slowly, sentence by sentence. The urge to explain, to clarify, to add one more thought—it is almost physical. But the work is often better when I resist it.

What would happen if we treated silence as a compositional element, as deliberate as any word? What would our writing sound like then?`,
    type: 'note',
    status: 'published',
    tags: ['writing', 'craft'],
    authorId: '2',
    createdAt: '2024-02-08T09:00:00Z',
    updatedAt: '2024-02-08T10:00:00Z',
    commentCount: 6,
  },
  // Sarah's posts
  {
    id: '9',
    slug: 'the-problem-with-epiphanies',
    title: 'The Problem with Epiphanies',
    excerpt: 'We talk about insight as if it arrives. In my experience it accumulates—and you only notice it has when something breaks.',
    content: `We talk about insight as if it arrives. In my experience it accumulates—and you only notice it has when something breaks.

The epiphany narrative is seductive: a moment of clarity, a flash of understanding, everything suddenly makes sense. It makes for good stories. But it is rarely how understanding actually works.

Real insight is more like erosion. The same water, passing over the same stone, year after year, until one day the stone is shaped differently and you cannot point to when it changed.

We prefer the epiphany because it is dramatic, because it suggests that change can be instant and complete. The truth is slower and harder: understanding comes through repetition, through returning to the same questions again and again, through living with uncertainty longer than feels comfortable.

Maybe the epiphany is just the moment we finally notice what has been happening all along.`,
    type: 'essay',
    status: 'published',
    tags: ['thinking', 'writing'],
    authorId: '3',
    createdAt: '2024-02-13T11:00:00Z',
    updatedAt: '2024-02-13T14:00:00Z',
    commentCount: 11,
  },
  // Marcus's posts
  {
    id: '10',
    slug: 'first-lines',
    title: 'First Lines',
    excerpt: 'Every book tells you what kind of book it is in its first sentence. Most writers don\'t know this yet when they write it.',
    content: `Every book tells you what kind of book it is in its first sentence. Most writers don't know this yet when they write it.

"Call me Ishmael." A command. An invitation. A name that is probably not his name. Already we know: this will be a book about identity, about the stories we tell to explain ourselves.

"It was the best of times, it was the worst of times." The structure tells us everything: this will be a book of contrasts, of dualities, of a world split in two.

"Happy families are all alike; every unhappy family is unhappy in its own way." A thesis statement masquerading as an observation. The novel that follows will prove it.

First lines are promises. The best ones are kept.`,
    type: 'idea',
    status: 'published',
    tags: ['writing'],
    authorId: '4',
    createdAt: '2024-02-11T16:00:00Z',
    updatedAt: '2024-02-11T16:30:00Z',
    commentCount: 3,
  },
]

export const comments: Comment[] = [
  // Comments on "Against Productivity Culture"
  {
    id: '1',
    postId: '1',
    authorId: '2',
    content: 'This connects to what Pieper says in Leisure—that the inability to be idle is a spiritual problem, not a productivity one.',
    createdAt: '2024-02-15T15:00:00Z',
    parentId: null,
  },
  {
    id: '2',
    postId: '1',
    authorId: '3',
    content: 'The framing of rest as reward rather than right is doing a lot of work here. Worth unpacking.',
    createdAt: '2024-02-15T16:30:00Z',
    parentId: null,
  },
  {
    id: '3',
    postId: '1',
    authorId: '1',
    content: 'Exactly—and I think the word "deserve" is where it gets ugly.',
    createdAt: '2024-02-15T17:00:00Z',
    parentId: '2',
  },
  {
    id: '4',
    postId: '1',
    authorId: '4',
    content: 'Sent this to three people already.',
    createdAt: '2024-02-15T18:00:00Z',
    parentId: null,
  },
  // Comments on "A Walk in November"
  {
    id: '5',
    postId: '2',
    authorId: '2',
    content: 'The metaphor of trees releasing what they don\'t need—I\'ve been thinking about this all week.',
    createdAt: '2024-02-10T12:00:00Z',
    parentId: null,
  },
  {
    id: '6',
    postId: '2',
    authorId: '3',
    content: 'Beautiful. This is what notes should be.',
    createdAt: '2024-02-10T14:00:00Z',
    parentId: null,
  },
]

// Helper functions
export function getPostsByAuthor(authorId: string): Post[] {
  return posts.filter(post => post.authorId === authorId)
}

export function getPublishedPosts(): Post[] {
  return posts.filter(post => post.status === 'published')
}

export function getUserPosts(userId: string): Post[] {
  return posts.filter(post => post.authorId === userId)
}

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find(post => post.slug === slug)
}

export function getPostById(id: string): Post | undefined {
  return posts.find(post => post.id === id)
}

export function getUserByUsername(username: string): User | undefined {
  return users.find(user => user.username === username)
}

export function getUserById(id: string): User | undefined {
  return users.find(user => user.id === id)
}

export function getCommentsByPostId(postId: string): Comment[] {
  return comments.filter(comment => comment.postId === postId)
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  })
}

export function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
  
  if (diffInHours < 1) return 'Just now'
  if (diffInHours < 24) return `${diffInHours}h ago`
  if (diffInHours < 48) return 'Yesterday'
  if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`
  return formatDate(dateString)
}
