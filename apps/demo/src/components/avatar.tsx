/**
 * avatar.tsx
 * Demo-only Avatar component — circular initials with deterministic background color.
 * Derives initials from a name string (up to 2 chars).
 * Background color is stable per name (djb2 hash → one of 8 Tailwind palette classes).
 * Does NOT depend on lib; uses Tailwind utility classes only.
 */
import { cn } from '@fluent-kit/ui'

// 8 distinct background + foreground pairs using Tailwind semantic colors
const COLOR_CLASSES = [
  'bg-blue-500 text-white',
  'bg-violet-500 text-white',
  'bg-emerald-500 text-white',
  'bg-amber-500 text-white',
  'bg-rose-500 text-white',
  'bg-cyan-500 text-white',
  'bg-orange-500 text-white',
  'bg-indigo-500 text-white',
] as const

function djb2Hash(str: string): number {
  let hash = 5381
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i)
  }
  return Math.abs(hash)
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  const first = parts[0] ?? ''
  if (parts.length === 1) return first.slice(0, 2).toUpperCase()
  const last = parts[parts.length - 1] ?? ''
  return ((first[0] ?? '') + (last[0] ?? '')).toUpperCase()
}

type AvatarSize = 'sm' | 'md' | 'lg'

const SIZE_CLASSES: Record<AvatarSize, string> = {
  sm: 'size-7 text-[10px]',
  md: 'size-9 text-xs',
  lg: 'size-11 text-sm',
}

interface AvatarProps {
  name: string
  size?: AvatarSize
  className?: string
}

export function Avatar({ name, size = 'sm', className }: AvatarProps) {
  const initials = getInitials(name)
  const colorClass = COLOR_CLASSES[djb2Hash(name) % COLOR_CLASSES.length]

  return (
    <span
      role="img"
      aria-label={name}
      title={name}
      className={cn(
        'inline-flex items-center justify-center rounded-full font-semibold shrink-0 select-none',
        SIZE_CLASSES[size],
        colorClass,
        className,
      )}
    >
      {initials}
    </span>
  )
}
