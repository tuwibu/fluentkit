/**
 * Internal: Popover-based multi/search select.
 * Used by SelectComposite when mode='multiple' or showSearch=true.
 * NOT exported from package barrel — internal only.
 */
import * as React from 'react'
import { Popover as PopoverPrimitive } from 'radix-ui'
import { Checkbox as CheckboxPrimitive } from 'radix-ui'
import { CheckIcon } from 'lucide-react'
import type { SelectOption } from '../select.types'

interface MultiSearchSelectProps<V> {
  options: SelectOption<V>[]
  value?: V | V[]
  onChange?: (value: V | V[]) => void
  mode?: 'multiple'
  showSearch?: boolean
  loading?: boolean
  allowClear?: boolean
  placeholder?: string
  disabled?: boolean
}

function getOptLabel<V>(opt: SelectOption<V>): string {
  return typeof opt.label === 'string' ? opt.label : String(opt.value)
}

export function MultiSearchSelect<V = string>({
  options,
  value,
  onChange,
  mode,
  showSearch = false,
  loading = false,
  allowClear = false,
  placeholder,
  disabled = false,
}: MultiSearchSelectProps<V>) {
  const isMultiple = mode === 'multiple'
  const [open, setOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState('')

  const selectedValues: V[] = isMultiple
    ? Array.isArray(value) ? (value as V[]) : []
    : value !== undefined ? [value as V] : []

  const filteredOptions = searchQuery
    ? options.filter((opt) => getOptLabel(opt).toLowerCase().includes(searchQuery.toLowerCase()))
    : options

  const hasValue = selectedValues.length > 0

  const getTriggerLabel = () => {
    if (selectedValues.length === 0) return placeholder ?? 'Select...'
    if (isMultiple) return `${selectedValues.length} selected`
    const match = options.find((o) => o.value === selectedValues[0])
    if (!match) return placeholder ?? 'Select...'
    return getOptLabel(match)
  }

  const handleToggle = (optValue: V, optDisabled?: boolean) => {
    if (optDisabled || !onChange) return
    if (isMultiple) {
      const current = Array.isArray(value) ? (value as V[]) : []
      const next = current.includes(optValue)
        ? current.filter((v) => v !== optValue)
        : [...current, optValue]
      onChange(next)
    } else {
      onChange(optValue)
      setOpen(false)
    }
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!onChange) return
    onChange(isMultiple ? ([] as unknown as V[]) : (undefined as unknown as V))
  }

  const isChecked = (optValue: V) => selectedValues.includes(optValue)

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={disabled || loading ? undefined : setOpen}>
      <div data-slot="select-composite" data-loading={loading || undefined}>
        <PopoverPrimitive.Trigger asChild>
          <button
            type="button"
            data-slot="select-trigger"
            disabled={disabled || loading}
            aria-busy={loading}
            aria-haspopup="listbox"
            aria-expanded={open}
          >
            <span data-slot="select-value">{getTriggerLabel()}</span>
            {allowClear && hasValue && (
              <span
                data-slot="select-clear"
                role="button"
                aria-label="Clear selection"
                onClick={handleClear}
                onKeyDown={(e) => e.key === 'Enter' && handleClear(e as unknown as React.MouseEvent)}
                tabIndex={0}
              >
                ×
              </span>
            )}
          </button>
        </PopoverPrimitive.Trigger>

        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Content
            data-slot="select-content"
            align="start"
            sideOffset={4}
          >
            {showSearch && (
              <input
                type="text"
                data-slot="select-search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                aria-label="Search options"
                autoFocus
              />
            )}
            <div role="listbox" aria-multiselectable={isMultiple}>
              {filteredOptions.map((opt, i) => (
                <div
                  key={i}
                  data-slot="select-item"
                  role="option"
                  aria-selected={isChecked(opt.value)}
                  aria-disabled={opt.disabled}
                  onClick={() => handleToggle(opt.value, opt.disabled)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') handleToggle(opt.value, opt.disabled)
                  }}
                  tabIndex={opt.disabled ? -1 : 0}
                >
                  {isMultiple && (
                    <CheckboxPrimitive.Root
                      data-slot="checkbox"
                      checked={isChecked(opt.value)}
                      disabled={opt.disabled}
                      aria-hidden="true"
                      tabIndex={-1}
                    >
                      <CheckboxPrimitive.Indicator>
                        <CheckIcon className="size-3.5" />
                      </CheckboxPrimitive.Indicator>
                    </CheckboxPrimitive.Root>
                  )}
                  <span>{getOptLabel(opt)}</span>
                </div>
              ))}
            </div>
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      </div>
    </PopoverPrimitive.Root>
  )
}
