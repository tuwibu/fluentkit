import { useRef, type KeyboardEvent } from 'react'
import { cn } from '../../lib/cn'
import type { SegmentedControlProps, SegmentedControlOption } from './segmented-control.types'

export type { SegmentedControlProps, SegmentedControlOption }

/**
 * SegmentedControl — radio-group style tab switcher.
 * Keyboard: ArrowRight/ArrowLeft navigate between segments.
 */
export function SegmentedControl<T extends string = string>({
  options,
  value,
  onChange,
  size = 'sm',
  'aria-label': ariaLabel,
  disabled = false,
}: SegmentedControlProps<T>) {
  const refs = useRef<(HTMLButtonElement | null)[]>([])

  function handleKey(e: KeyboardEvent<HTMLButtonElement>, idx: number) {
    let next = idx
    if (e.key === 'ArrowRight') next = (idx + 1) % options.length
    else if (e.key === 'ArrowLeft') next = (idx - 1 + options.length) % options.length
    else return
    e.preventDefault()
    refs.current[next]?.focus()
    const nextOption = options[next]
    if (!disabled && nextOption) onChange(nextOption.value)
  }

  return (
    <div
      data-slot="segmented-control"
      role="group"
      aria-label={ariaLabel}
      className="inline-flex items-center rounded-[4px] border border-border bg-muted p-0.5 gap-px"
    >
      {(options as readonly SegmentedControlOption<T>[]).map((opt, idx) => {
        const active = opt.value === value
        return (
          <button
            key={opt.value}
            ref={(el) => { refs.current[idx] = el }}
            type="button"
            role="radio"
            aria-checked={active}
            disabled={disabled}
            onClick={() => !disabled && onChange(opt.value)}
            onKeyDown={(e) => handleKey(e, idx)}
            data-active={active ? 'true' : undefined}
            className={cn(
              'rounded-[3px] font-medium outline-none transition-colors duration-100',
              'focus-visible:ring-2 focus-visible:ring-ring/50',
              size === 'md' ? 'px-3 py-1.5 text-sm' : 'px-2.5 py-1 text-xs',
              active
                ? 'bg-background text-foreground shadow-sm border border-border'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent/40',
              disabled && 'opacity-50 cursor-not-allowed',
            )}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
