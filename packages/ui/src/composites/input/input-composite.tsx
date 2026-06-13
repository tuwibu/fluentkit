import * as React from 'react'
import type { InputProps } from './input.types'

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
  ...rest
}: InputProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const hasValue = typeof value === 'string' && value.length > 0

  const handleClear = () => {
    if (!onChange) return
    const input = inputRef.current
    if (!input) return
    // Set the underlying value on the real input element so the synthetic event
    // target reflects '' without creating a detached element.
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      'value',
    )?.set
    nativeInputValueSetter?.call(input, '')
    // Call onChange once with a React ChangeEvent-compatible shape.
    const reactEvent = {
      target: input,
      currentTarget: input,
    } as React.ChangeEvent<HTMLInputElement>
    onChange(reactEvent)
  }

  return (
    <div data-slot="input-composite" data-size={size} data-status={status ?? undefined}>
      {addonBefore && <span data-slot="input-addon-before">{addonBefore}</span>}
      {prefix && <span data-slot="input-prefix">{prefix}</span>}
      <input
        {...rest}
        ref={inputRef}
        type={type}
        value={value ?? ''}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        aria-invalid={status === 'error' ? true : rest['aria-invalid']}
        data-slot="input"
      />
      {allowClear && hasValue && (
        <button
          type="button"
          data-slot="input-clear"
          aria-label="Clear input"
          onClick={handleClear}
        >
          ×
        </button>
      )}
      {suffix && <span data-slot="input-suffix">{suffix}</span>}
      {addonAfter && <span data-slot="input-addon-after">{addonAfter}</span>}
    </div>
  )
}
