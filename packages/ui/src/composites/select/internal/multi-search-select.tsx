/**
 * Internal: Popover-based multi/search select.
 * Used by SelectComposite when mode='multiple' or showSearch=true.
 * NOT exported from package barrel — internal only.
 */
import * as React from 'react'
import { Popover as PopoverPrimitive } from 'radix-ui'
import { ChevronDownIcon } from 'lucide-react'
import { Checkbox } from '../../../primitives/checkbox'
import type { SelectOption } from '../select.types'
import { OptionChip } from './option-chip'

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

// Compare option values by their string form so selection stays consistent
// with the single-mode path (select-composite uses `String(value)`), and so
// non-primitive V (objects) match by content instead of reference identity.
function sameVal<V>(a: V, b: V): boolean {
  return String(a) === String(b)
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

  // For single+search: returns matched option if it has icon/color meta (render chip).
  // For multiple: falls through to text label ("N selected").
  const getTriggerOption = (): SelectOption<V> | undefined => {
    if (isMultiple || selectedValues.length === 0) return undefined
    const match = options.find((o) => sameVal(o.value, selectedValues[0]))
    return match && (match.icon || match.color) ? match : undefined
  }

  const getTriggerLabel = () => {
    if (selectedValues.length === 0) return placeholder ?? 'Select...'
    if (isMultiple) return `${selectedValues.length} selected`
    const match = options.find((o) => sameVal(o.value, selectedValues[0]))
    if (!match) return placeholder ?? 'Select...'
    return getOptLabel(match)
  }

  const handleToggle = (optValue: V, optDisabled?: boolean) => {
    if (optDisabled || !onChange) return
    if (isMultiple) {
      const current = Array.isArray(value) ? (value as V[]) : []
      const next = current.some((v) => sameVal(v, optValue))
        ? current.filter((v) => !sameVal(v, optValue))
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
    onChange(isMultiple ? ([] as V[]) : (undefined as unknown as V))
  }

  const isChecked = (optValue: V) => selectedValues.some((v) => sameVal(v, optValue))

  return (
    <PopoverPrimitive.Root
      open={open}
      onOpenChange={(val) => {
        if (disabled || loading) return
        if (!val) setSearchQuery('')
        setOpen(val)
      }}
    >
      <div data-slot="select-composite" data-loading={loading || undefined} className="relative inline-flex items-center gap-1">
        <PopoverPrimitive.Trigger asChild>
          <button
            type="button"
            data-slot="select-trigger"
            disabled={disabled || loading}
            aria-busy={loading}
            aria-haspopup="listbox"
            aria-expanded={open}
            className="flex h-8 w-fit items-center justify-between gap-2 rounded-[4px] border border-[var(--win11-control-border)] bg-[var(--win11-control-bg)] px-3 py-2 text-body text-foreground whitespace-nowrap transition-all duration-100 outline-none hover:bg-[var(--win11-control-hover)] focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 dark:text-white"
          >
            <span data-slot="select-value" className="line-clamp-1 flex items-center gap-2 data-[placeholder]:text-muted-foreground">
              {(() => {
                const triggerOpt = getTriggerOption()
                return triggerOpt
                  ? <OptionChip icon={triggerOpt.icon} color={triggerOpt.color} label={triggerOpt.label} />
                  : getTriggerLabel()
              })()}
            </span>
            {allowClear && hasValue ? (
              <span
                data-slot="select-clear"
                role="button"
                aria-label="Clear selection"
                onClick={handleClear}
                onKeyDown={(e) => e.key === 'Enter' && handleClear(e as unknown as React.MouseEvent)}
                tabIndex={0}
                className="flex size-4 items-center justify-center rounded-full text-muted-foreground hover:text-foreground transition-colors"
              >
                ×
              </span>
            ) : (
              <ChevronDownIcon className="size-4 shrink-0 opacity-60" />
            )}
          </button>
        </PopoverPrimitive.Trigger>

        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Content
            data-slot="select-content"
            align="start"
            sideOffset={4}
            onCloseAutoFocus={(e) => e.preventDefault()}
            className="relative z-50 min-w-[8rem] overflow-hidden rounded-lg border border-[var(--win11-card-border)] bg-[var(--win11-card-bg-solid)] p-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.14)] text-foreground data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 dark:shadow-[0_8px_32px_rgba(0,0,0,0.36)]"
          >
            {showSearch && (
              <div className="px-1 pb-1.5">
                <input
                  type="text"
                  data-slot="select-search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  aria-label="Search options"
                  autoFocus
                  className="h-7 w-full rounded-[4px] border border-[var(--win11-control-border)] bg-[var(--win11-control-bg)] px-2 text-body text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
                />
              </div>
            )}
            <div role="listbox" aria-multiselectable={isMultiple}>
              {filteredOptions.map((opt) => (
                <div
                  key={String(opt.value)}
                  data-slot="select-item"
                  role="option"
                  aria-selected={isChecked(opt.value)}
                  aria-disabled={opt.disabled}
                  onClick={() => handleToggle(opt.value, opt.disabled)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') handleToggle(opt.value, opt.disabled)
                  }}
                  tabIndex={opt.disabled ? -1 : 0}
                  className="relative flex w-full cursor-default items-center gap-2 rounded-[4px] px-3 py-2 text-body text-foreground outline-none select-none transition-colors duration-75 hover:bg-[var(--win11-control-hover)] focus:bg-[var(--win11-control-hover)] aria-disabled:pointer-events-none aria-disabled:opacity-50 aria-selected:font-medium"
                >
                  {isMultiple && (
                    <Checkbox
                      checked={isChecked(opt.value)}
                      disabled={opt.disabled}
                      aria-hidden="true"
                      tabIndex={-1}
                    />
                  )}
                  <OptionChip icon={opt.icon} color={opt.color} label={opt.label} />
                </div>
              ))}
            </div>
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      </div>
    </PopoverPrimitive.Root>
  )
}
