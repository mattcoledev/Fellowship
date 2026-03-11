'use client'

import { RefObject } from 'react'
import {
  Bold, Italic, Heading2, Heading3,
  Quote, List, ListOrdered, Minus, Link as LinkIcon,
} from 'lucide-react'

type FormatType = 'bold' | 'italic' | 'h2' | 'h3' | 'quote' | 'ul' | 'ol' | 'hr' | 'link'

// Block-level formats must start and end on their own line.
// Returns the prefix/suffix newlines needed given the surrounding characters.
function blockPad(before: string, after: string) {
  const pre  = before.length > 0 && !before.endsWith('\n') ? '\n' : ''
  const post = after.length  > 0 && !after.startsWith('\n') ? '\n' : ''
  return { pre, post }
}

function insertFormat(
  textarea: HTMLTextAreaElement,
  format: FormatType,
  onChange: (v: string) => void,
) {
  const { selectionStart: s, selectionEnd: e, value } = textarea
  const sel = value.slice(s, e)
  const before = value.slice(0, s)
  const after = value.slice(e)

  let insert: string
  let newS: number
  let newE: number

  switch (format) {
    case 'bold': {
      const inner = (sel || 'bold text').trim()
      insert = `**${inner}**`
      newS = s + 2; newE = s + 2 + inner.length
      break
    }
    case 'italic': {
      const inner = (sel || 'italic text').trim()
      insert = `*${inner}*`
      newS = s + 1; newE = s + 1 + inner.length
      break
    }
    case 'h2': {
      const inner = sel || 'Heading'
      const { pre, post } = blockPad(before, after)
      insert = `${pre}## ${inner}${post}`
      newS = s + pre.length + 3; newE = s + pre.length + 3 + inner.length
      break
    }
    case 'h3': {
      const inner = sel || 'Heading'
      const { pre, post } = blockPad(before, after)
      insert = `${pre}### ${inner}${post}`
      newS = s + pre.length + 4; newE = s + pre.length + 4 + inner.length
      break
    }
    case 'quote': {
      const inner = sel || 'Quote'
      const quoted = inner.split('\n').map(l => `> ${l}`).join('\n')
      const { pre, post } = blockPad(before, after)
      insert = `${pre}${quoted}${post}`
      newS = s + pre.length + 2; newE = s + pre.length + quoted.length
      break
    }
    case 'ul': {
      const inner = sel ? sel.split('\n').map(l => `- ${l}`).join('\n') : '- List item'
      const { pre, post } = blockPad(before, after)
      insert = `${pre}${inner}${post}`
      newS = s + pre.length + inner.length; newE = newS
      break
    }
    case 'ol': {
      const inner = sel
        ? sel.split('\n').map((l, i) => `${i + 1}. ${l}`).join('\n')
        : '1. List item'
      const { pre, post } = blockPad(before, after)
      insert = `${pre}${inner}${post}`
      newS = s + pre.length + inner.length; newE = newS
      break
    }
    case 'hr': {
      insert = '\n---\n'
      newS = s + insert.length; newE = newS
      break
    }
    case 'link': {
      const text = sel || 'link text'
      insert = `[${text}](https://)`
      // select the 'https://' placeholder so the user can type over it
      newS = s + text.length + 3
      newE = newS + 8
      break
    }
    default: return
  }

  onChange(before + insert + after)

  // Restore focus and selection after React re-renders
  requestAnimationFrame(() => {
    textarea.focus()
    textarea.setSelectionRange(newS, newE)
  })
}

const BUTTONS: { format: FormatType; icon: React.ComponentType<{ className?: string }>; label: string }[] = [
  { format: 'bold',   icon: Bold,          label: 'Bold' },
  { format: 'italic', icon: Italic,         label: 'Italic' },
  { format: 'link',   icon: LinkIcon,       label: 'Link' },
  { format: 'quote',  icon: Quote,          label: 'Blockquote' },
  { format: 'ul',     icon: List,           label: 'Bullet list' },
  { format: 'ol',     icon: ListOrdered,    label: 'Numbered list' },
  { format: 'h2',     icon: Heading2,       label: 'Heading 2' },
  { format: 'h3',     icon: Heading3,       label: 'Heading 3' },
  { format: 'hr',     icon: Minus,          label: 'Divider' },
]

interface MarkdownToolbarProps {
  textareaRef: RefObject<HTMLTextAreaElement>
  onChange: (value: string) => void
  className?: string
}

export function MarkdownToolbar({ textareaRef, onChange, className }: MarkdownToolbarProps) {
  return (
    <div className={`flex items-center gap-0.5 ${className ?? ''}`}>
      {BUTTONS.map(({ format, icon: Icon, label }) => (
        <button
          key={format}
          type="button"
          title={label}
          // onMouseDown + preventDefault keeps textarea focus & selection intact
          onMouseDown={(e) => {
            e.preventDefault()
            if (textareaRef.current) {
              insertFormat(textareaRef.current, format, onChange)
            }
          }}
          className="p-1.5 rounded text-text-secondary hover:text-text-primary hover:bg-bg-raised transition-colors"
        >
          <Icon className="w-4 h-4" />
        </button>
      ))}
    </div>
  )
}
