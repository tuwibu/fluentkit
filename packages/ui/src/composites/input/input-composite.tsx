import * as React from 'react'
import { X } from 'lucide-react'
import { cn } from '../../lib/cn'
import type { InputProps } from './input.types'

const sizeClass: Record<NonNullable<InputProps['size']>, string> = {
  small: 'h-7',
  middle: 'h-8',
  large: 'h-10',
}

const addonClass =
  'flex items-center px-2 shrink-0 bg-[var(--win11-control-hover)] border-[var(--win11-control-border)] text-muted-foreground text-sm select-none'

/**
 * Input composite component — facade with prefix/suffix/addon/allowClear.
 * Wraps the native input element; does NOT depend on the primitive Input
 * to avoid a circular barrel dependency.
 */
export function InputComposite({
  value,
  onChange,
  placeholder,
  prefix,
  suffix,
  size = 'middle',
  status,
  allowClear = false,
  addonBefore,
  addonAfter,
  disabled = false,
  type = 'text',
  className,
  ...rest
}: InputProps & { className?: string }) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const hasValue = typeof value === 'string' && value.length > 0

  const handleClear = () => {
    if (!onChange) return
    const input = inputRef.current
    if (!input) return
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      'value',
    )?.set
    nativeInputValueSetter?.call(input, '')
    const reactEvent = {
      target: input,
      currentTarget: input,
    } as React.ChangeEvent<HTMLInputElement>
    onChange(reactEvent)
  }

  const isError = status === 'error'
  const isWarning = status === 'warning'

  return (
    <div
      data-slot="input-composite"
      data-size={size}
      data-status={status ?? undefined}
      className={cn('flex w-full', className)}
    >
      {addonBefore && (
        <span
          data-slot="input-addon-before"
          className={cn(addonClass, 'rounded-l-[4px] border border-r-0')}
        >
          {addonBefore}
        </span>
      )}

      <div
        className={cn(
          'flex flex-1 items-center gap-2 px-3 min-w-0 transition-colors',
          'bg-[var(--win11-control-bg)] border border-[var(--win11-control-border)]',
          'hover:bg-[var(--win11-control-hover)]',
          'focus-within:border-primary focus-within:ring-0',
          sizeClass[size],
          addonBefore && addonAfter
            ? 'rounded-none'
            : addonBefore
              ? 'rounded-r-[4px]'
              : addonAfter
                ? 'rounded-l-[4px]'
                : 'rounded-[4px]',
          isError && 'border-destructive focus-within:border-destructive',
          isWarning && 'border-yellow-500 focus-within:border-yellow-500',
          disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
        )}
      >
        {prefix && (
          <span data-slot="input-prefix" className="flex items-center shrink-0 text-muted-foreground">
            {prefix}
          </span>
        )}

        <input
          {...rest}
          ref={inputRef}
          type={type}
          value={value ?? ''}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          aria-invalid={isError ? true : rest['aria-invalid']}
          data-slot="input"
          className="flex-1 min-w-0 h-full bg-transparent border-0 outline-none text-sm text-foreground placeholder:text-muted-foreground disabled:cursor-not-allowed"
        />

        {allowClear && hasValue && (
          <button
            type="button"
            data-slot="input-clear"
            aria-label="Clear input"
            onClick={handleClear}
            className="shrink-0 flex items-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={14} />
          </button>
        )}

        {suffix && (
          <span data-slot="input-suffix" className="flex items-center shrink-0 text-muted-foreground">
            {suffix}
          </span>
        )}
      </div>

      {addonAfter && (
        <span
          data-slot="input-addon-after"
          className={cn(addonClass, 'rounded-r-[4px] border border-l-0')}
        >
          {addonAfter}
        </span>
      )}
    </div>
  )
}
