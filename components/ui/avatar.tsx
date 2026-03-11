interface AvatarProps {
  url?: string | null
  name?: string | null
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

// sm = w-6 h-6 text-xs (nested replies)
// md = w-7 h-7 text-xs (thread cards, reply list)
// lg = w-8 h-8 text-sm (post detail, thread detail)
const sizeClasses = {
  sm: 'w-6 h-6 text-xs',
  md: 'w-7 h-7 text-xs',
  lg: 'w-8 h-8 text-sm',
}

export function Avatar({ url, name, size = 'md', className = '' }: AvatarProps) {
  const initial = (name || '?').charAt(0).toUpperCase()
  const base = `${sizeClasses[size]} rounded-full flex-shrink-0 font-medium ${className}`

  if (url) {
    return (
      <img
        src={url}
        alt={name || 'Avatar'}
        className={`${base} object-cover`}
      />
    )
  }

  return (
    <div className={`${base} bg-accent-subtle text-accent flex items-center justify-center`}>
      {initial}
    </div>
  )
}
