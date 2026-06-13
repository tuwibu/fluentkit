import type { CSSProperties, HTMLAttributes, ReactNode } from 'react'
import { X } from 'lucide-react'
import { cn } from '../lib/cn'

export type TagVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'accent'

export interface TagProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  variant?: TagVariant
  color?: string
  bullet?: boolean
  onRemove?: () => void
  truncate?: boolean
  className?: string
  children: ReactNode
}

const VARIANT_CLS: Record<TagVariant, string> = {
  success: 'bg-emerald-500/10 text-emerald-500 border-[rgba(52,211,153,0.25)]',
  warning: 'bg-[rgba(251,191,36,0.12)] text-amber-500 border-[rgba(251,191,36,0.25)]',
  error: 'bg-[rgba(220,38,38,0.10)] text-destructive border-[rgba(220,38,38,0.22)]',
  info: 'bg-[rgba(96,165,250,0.12)] text-primary border-[rgba(96,165,250,0.25)]',
  neutral: 'bg-[var(--win11-control-bg)] text-muted-foreground border-[var(--win11-control-border)]',
  accent: 'bg-primary/10 text-primary border-primary/30',
}

export function Tag({
  variant,
  color,
  bullet,
  onRemove,
  truncate,
  className,
  children,
  style: styleProp,
  ...rest
}: TagProps) {
  const useColorMix = !!color
  const hasAnyColor = useColorMix || !!styleProp
  const colorMixStyle: CSSProperties | undefined = color
    ? {
        background: `color-mix(in srgb, ${color} 12%, transparent)`,
        color: color,
        borderColor: `color-mix(in srgb, ${color} 32%, transparent)`,
      }
    : undefined
  const style: CSSProperties | undefined = color
    ? ({ ...colorMixStyle, ...styleProp } as CSSProperties)
    : styleProp

  return (
    <span
      {...rest}
      className={cn(
        'inline-flex items-center gap-[5px] whitespace-nowrap border',
        'text-caption font-medium leading-snug',
        'py-[2px] px-[7px] rounded-[4px]',
        truncate && 'max-w-[80px] overflow-hidden text-ellipsis',
        variant && !useColorMix && VARIANT_CLS[variant],
        !hasAnyColor && !variant &&
          'bg-[var(--win11-control-bg)] text-muted-foreground border-[var(--win11-control-border)]',
        className,
      )}
      style={style}
    >
      {bullet && (
        <span
          className="w-1.5 h-1.5 rounded-full shrink-0 bg-current opacity-70"
          aria-hidden="true"
        />
      )}
      {children}
      {onRemove && (
        <button
          type="button"
          className={cn(
            'inline-flex size-3.5 shrink-0 items-center justify-center rounded-[2px]',
            'border-none bg-transparent p-0 opacity-60',
            'hover:opacity-100 transition-opacity',
          )}
          onClick={onRemove}
          aria-label="Remove tag"
        >
          <X size={10} />
        </button>
      )}
    </span>
  )
}
