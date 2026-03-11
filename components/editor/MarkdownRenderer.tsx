import Markdown, { Components } from 'react-markdown'
import { Children, isValidElement, ReactElement } from 'react'

interface MarkdownRendererProps {
  content: string
  /** 'prose' = long-form post (serif, large), 'forum' = thread body (sans, normal) */
  variant?: 'prose' | 'forum'
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
    return (
      <a href={url} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
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
      <Markdown components={components}>{content}</Markdown>
    </div>
  )
}
