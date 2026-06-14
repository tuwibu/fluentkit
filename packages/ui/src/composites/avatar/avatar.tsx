import { cn } from '../../lib/cn'
import type { AvatarProps, AvatarSize } from './avatar.types'

const COLOR_CLASSES = [
  'bg-blue-500',
  'bg-violet-500',
  'bg-emerald-500',
  'bg-amber-500',
  'bg-rose-500',
  'bg-cyan-500',
  'bg-orange-500',
  'bg-indigo-500',
] as const

const SIZE_CLASSES: Record<AvatarSize, string> = {
  sm: 'w-7 h-7 text-[10px]',
  md: 'w-10 h-10 text-xs',
  lg: 'w-14 h-14 text-sm',
}

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

const BASE =
  'rounded-full flex items-center justify-center font-medium shrink-0 ring-1 ring-black/[0.06] dark:ring-white/10 overflow-hidden select-none'

export function Avatar({ name, src, size = 'md', className }: AvatarProps) {
  const sizeClass = SIZE_CLASSES[size]

  if (src) {
    return (
      <span
        role="img"
        aria-label={name}
        className={cn(BASE, sizeClass, className)}
      >
        <img
          src={src}
          alt={name ?? ''}
          className="w-full h-full object-cover"
        />
      </span>
    )
  }

  const displayName = name ?? ''
  const initials = displayName ? getInitials(displayName) : '?'
  const colorClass =
    displayName
      ? COLOR_CLASSES[djb2Hash(displayName) % COLOR_CLASSES.length]
      : 'bg-neutral-400'

  return (
    <span
      role="img"
      aria-label={displayName || undefined}
      title={displayName || undefined}
      className={cn(BASE, sizeClass, colorClass, 'text-white', className)}
    >
      {initials}
    </span>
  )
}
