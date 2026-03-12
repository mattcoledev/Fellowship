const MEDIA_URL_RE = /^https?:\/\/\S+\.(gif|png|jpe?g|webp)(\?\S*)?$/i
const ANY_URL_RE = /^https?:\/\/\S+$/i
const INLINE_URL_RE = /https?:\/\/[^\s]+/g

function isMediaUrl(s: string) { return MEDIA_URL_RE.test(s) }
function isUrl(s: string) { return ANY_URL_RE.test(s) }

/** Splits a text line into segments, turning inline URLs into <a> elements */
function renderInlineLinks(line: string, key: number) {
  const parts: React.ReactNode[] = []
  let last = 0
  let match: RegExpExecArray | null

  INLINE_URL_RE.lastIndex = 0
  while ((match = INLINE_URL_RE.exec(line)) !== null) {
    if (match.index > last) {
      parts.push(line.slice(last, match.index))
    }
    const url = match[0]
    parts.push(
      <a
        key={`${key}-${match.index}`}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-accent-blue hover:underline break-all"
      >
        {url}
      </a>
    )
    last = match.index + url.length
  }

  if (last < line.length) {
    parts.push(line.slice(last))
  }

  return parts
}

interface ContentRendererProps {
  content: string
  className?: string
}

export function ContentRenderer({ content, className }: ContentRendererProps) {
  const lines = content.split('\n')

  return (
    <div className={className}>
      {lines.map((line, i) => {
        const trimmed = line.trim()

        if (!trimmed) {
          return <div key={i} className="h-2" />
        }

        if (isMediaUrl(trimmed)) {
          return (
            <img
              key={i}
              src={trimmed}
              alt="Embedded media"
              className="max-w-full rounded-md my-2"
              loading="lazy"
            />
          )
        }

        if (isUrl(trimmed)) {
          return (
            <p key={i}>
              <a
                href={trimmed}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-blue hover:underline break-all"
              >
                {trimmed}
              </a>
            </p>
          )
        }

        return (
          <p key={i} className="whitespace-pre-wrap break-words">
            {renderInlineLinks(line, i)}
          </p>
        )
      })}
    </div>
  )
}
