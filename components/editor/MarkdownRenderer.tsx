import Markdown, { Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Children, isValidElement, ReactElement } from 'react'

interface MarkdownRendererProps {
  content: string
  /** 'prose' = long-form post (serif, large), 'forum' = thread body (sans, normal) */
  variant?: 'prose' | 'forum'
}

const MEDIA_URL_RE = /^https?:\/\/\S+\.(gif|png|jpe?g|webp)(\?\S*)?$/i

function isMediaUrl(href: string | undefined): boolean {
  return !!href && MEDIA_URL_RE.test(href.trim())
}

// If a <pre> block has no language class on its <code> child, it was created by
// 4-space indentation (not a fenced code block). Render it as plain wrapping text
// instead of a scrollable code block.
const components: Components = {
  a({ href, children }) {
    const url =
      href && !/^https?:\/\//i.test(href) && !href.startsWith('/') && !href.startsWith('#')
        ? `https://${href}`
        : href

    // If this is a bare media URL pasted on its own, render as image
    if (isMediaUrl(url) && children?.toString() === url) {
      return (
        <img
          src={url}
          alt="Embedded media"
          className="max-w-full rounded-md my-2"
          loading="lazy"
        />
      )
    }

    return (
      <a href={url} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    )
  },
  img({ src, alt }) {
    if (!src) return null
    return (
      <img
        src={src}
        alt={alt || 'Embedded media'}
        className="max-w-full rounded-md my-2"
        loading="lazy"
      />
    )
  },
  pre({ children }) {
    const codeChild = Children.toArray(children).find(
      (child): child is ReactElement =>
        isValidElement(child) && (child as ReactElement).type === 'code',
    ) as ReactElement | undefined

    const hasLanguage =
      typeof codeChild?.props?.className === 'string' &&
      codeChild.props.className.includes('language-')

    if (!hasLanguage) {
      // Indented text — render as a wrapping paragraph, preserving intentional newlines
      return (
        <p style={{ whiteSpace: 'pre-wrap' }}>
          {codeChild?.props?.children}
        </p>
      )
    }

    return <pre>{children}</pre>
  },
}

export function MarkdownRenderer({ content, variant = 'prose' }: MarkdownRendererProps) {
  return (
    <div className={variant === 'prose' ? 'prose-reading' : 'prose-forum'}>
      <Markdown remarkPlugins={[remarkGfm]} components={components}>{content}</Markdown>
    </div>
  )
}
