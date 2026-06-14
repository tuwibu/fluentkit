import { Loader2 } from 'lucide-react'
import { cn } from '../../lib/cn'
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '../../primitives/tooltip'
import type { IconButtonProps } from './icon-button.types'

const sizeClasses = {
  sm: 'w-7 h-7',
  md: 'w-8 h-8',
} as const

const variantClasses = {
  default:
    'text-muted-foreground hover:bg-[var(--win11-control-hover)] hover:text-foreground',
  outlined:
    'border border-[var(--win11-control-border)] bg-[var(--win11-control-bg)] text-muted-foreground hover:bg-[var(--win11-control-hover)] hover:text-foreground',
  danger:
    'text-destructive hover:text-destructive hover:bg-destructive/10',
  launch:
    'bg-primary text-primary-foreground hover:bg-primary/90',
} as const

function IconButton({
  icon,
  'aria-label': ariaLabel,
  variant = 'default',
  size = 'md',
  tooltip,
  disabled = false,
  loading = false,
  onClick,
  className,
}: IconButtonProps) {
  const isDisabled = disabled || loading

  const button = (
    <button
      type="button"
      aria-label={ariaLabel}
      disabled={isDisabled}
      onClick={onClick}
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-[4px] cursor-pointer',
        'transition-[background,color] duration-[120ms]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        sizeClasses[size],
        variantClasses[variant],
        className,
      )}
    >
      {loading ? (
        <Loader2 className="animate-spin" size={size === 'sm' ? 14 : 16} />
      ) : (
        icon
      )}
    </button>
  )

  if (tooltip) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent>{tooltip}</TooltipContent>
      </Tooltip>
    )
  }

  return button
}

export { IconButton }
