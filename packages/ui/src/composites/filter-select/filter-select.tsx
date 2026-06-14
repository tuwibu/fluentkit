import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown, Search, X } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '../../primitives/popover'
import { Checkbox } from '../../primitives/checkbox'
import { Tag } from '../../primitives/tag'
import { cn } from '../../lib/cn'
import type { SelectOption } from '../select/select.types'
import { OptionChip } from '../select/internal/option-chip'
import type { FilterSelectProps } from './filter-select.types'

// Compare by string form — consistent with the Select composite.
// Intended for string/number values; object V is not supported (would collide as "[object Object]").
function sameVal<V>(a: V, b: V): boolean {
  return String(a) === String(b)
}

function toArray<V>(value: V | V[] | undefined): V[] {
  if (value === undefined) return []
  return Array.isArray(value) ? value : [value]
}

function getOptLabel<V>(opt: SelectOption<V>): string {
  return typeof opt.label === 'string' ? opt.label : String(opt.value)
}

export function FilterSelect<V = string>({
  title,
  options,
  value,
  onChange,
  mode = 'single',
  searchable = false,
  triggerDisplay = 'count',
  wide = false,
  allLabel,
  autoHeight = false,
  renderLabel,
  allowClear = false,
  disabled = false,
}: FilterSelectProps<V>) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const searchRef = useRef<HTMLInputElement>(null)

  const isMultiple = mode === 'multiple'
  const selected = toArray(value)
  const hasSelection = selected.length > 0

  // Auto-focus search input when popup opens; clear query on close.
  useEffect(() => {
    if (open && searchable) {
      const id = window.setTimeout(() => searchRef.current?.focus(), 30)
      return () => window.clearTimeout(id)
    }
    if (!open) setQuery('')
  }, [open, searchable])

  const filteredOptions =
    searchable && query
      ? options.filter((o) =>
          getOptLabel(o).toLowerCase().includes(query.toLowerCase()),
        )
      : options

  // Single: toggle-to-clear (filter-select.tsx:71-74 gốc).
  // Multiple: Set-based toggle.
  const handleSelect = (optValue: V) => {
    if (isMultiple) {
      const current = toArray(value)
      const next = current.some((v) => sameVal(v, optValue))
        ? current.filter((v) => !sameVal(v, optValue))
        : [...current, optValue]
      onChange(next.length > 0 ? next : undefined)
    } else {
      if (selected.some((v) => sameVal(v, optValue))) {
        onChange(undefined)
      } else {
        onChange(optValue)
      }
      setOpen(false)
    }
  }

  const handleClear = () => onChange(undefined)

  const handleRemoveTag = (optValue: V) => {
    const next = toArray(value).filter((v) => !sameVal(v, optValue))
    onChange(next.length > 0 ? next : undefined)
  }

  // Resolve selected option objects for tag display.
  const selectedOpts = selected
    .map((v) => options.find((o) => sameVal(o.value, v)))
    .filter((o): o is SelectOption<V> => o !== undefined)

  const isChecked = (optValue: V) => selected.some((v) => sameVal(v, optValue))

  // When triggerDisplay='tags', Tag's onRemove renders a <button> inside the
  // trigger. When allowClear is active with a selection, the clear <span role="button">
  // would also be nested inside a <button> — use <div role="button"> for both cases.
  const useDivTrigger = (triggerDisplay === 'tags' && hasSelection) || (allowClear && hasSelection)
  const triggerCls = cn(
    'inline-flex h-8 items-center gap-1.5 rounded-md border px-3 py-1 text-body font-medium min-w-0',
    'bg-[var(--win11-control-bg)] border-[var(--win11-control-border)] text-foreground',
    'transition-all duration-100',
    'hover:bg-[var(--win11-control-hover)]',
    'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary',
    disabled && 'cursor-not-allowed opacity-50 pointer-events-none',
    hasSelection &&
      'bg-primary/10 border-primary/30 text-primary dark:bg-primary/20 dark:border-primary/40 dark:text-white hover:bg-primary/15 dark:hover:bg-primary/25',
  )

  const triggerContent = (
    <>
      <span className="shrink-0">{title}</span>

      {/* Tags display: inline chips for each selected option */}
      {hasSelection && triggerDisplay === 'tags' && (
        <span className="flex items-center gap-1 min-w-0 overflow-hidden max-w-[200px]">
          {selectedOpts.map((opt) => (
            <Tag
              key={String(opt.value)}
              color={opt.color}
              onRemove={() => handleRemoveTag(opt.value)}
              truncate
            >
              {getOptLabel(opt)}
            </Tag>
          ))}
        </span>
      )}

      {/* Count display: numeric badge */}
      {hasSelection && triggerDisplay === 'count' && (
        <span className="inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary px-1 text-micro font-semibold leading-none text-primary-foreground">
          {selected.length}
        </span>
      )}

      {/* Clear button (allowClear) — only in count/no-tags mode to avoid nesting */}
      {hasSelection && allowClear && triggerDisplay !== 'tags' && (
        <span
          role="button"
          aria-label="Clear selection"
          tabIndex={0}
          onClick={(e) => { e.stopPropagation(); handleClear() }}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.stopPropagation(); handleClear() } }}
          className="inline-flex size-4 items-center justify-center rounded-full text-muted-foreground hover:text-foreground transition-colors shrink-0"
        >
          <X size={10} />
        </span>
      )}

      <ChevronDown
        className={cn(
          'w-3 h-3 shrink-0',
          hasSelection ? 'text-primary' : 'text-muted-foreground',
        )}
      />
    </>
  )

  return (
    <Popover open={open} onOpenChange={(next) => { if (!disabled) setOpen(next) }}>
      <PopoverTrigger asChild>
        {useDivTrigger ? (
          <div
            role="button"
            tabIndex={disabled ? -1 : 0}
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-disabled={disabled}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                if (!disabled) setOpen((o) => !o)
              }
            }}
            className={triggerCls}
          >
            {triggerContent}
          </div>
        ) : (
          <button
            type="button"
            disabled={disabled}
            aria-haspopup="listbox"
            aria-expanded={open}
            className={triggerCls}
          >
            {triggerContent}
          </button>
        )}
      </PopoverTrigger>

      <PopoverContent
        className={cn(
          wide ? 'w-56' : 'w-48',
          'p-0 border-[var(--win11-card-border)]',
          'bg-[var(--win11-card-bg-solid)] shadow-[0_8px_32px_rgba(0,0,0,0.14)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.36)]',
        )}
        align="start"
        sideOffset={4}
      >
        {/* Search input */}
        {searchable && (
          <div className="p-2 border-b border-[var(--win11-control-border)]">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <input
                ref={searchRef}
                type="text"
                placeholder={`Search ${title.toLowerCase()}...`}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label={`Search ${title}`}
                className="w-full h-8 pl-8 pr-3 text-body rounded-[4px] bg-[var(--win11-control-bg)] border-0 focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"
              />
            </div>
          </div>
        )}

        {/* Multi: selected count + clear all */}
        {isMultiple && hasSelection && (
          <div className="px-2.5 py-2 border-b border-[var(--win11-control-border)] flex items-center justify-between">
            <span className="text-caption text-muted-foreground">
              {selected.length} selected
            </span>
            <button
              type="button"
              className="text-caption text-primary hover:underline"
              onClick={handleClear}
            >
              Clear all
            </button>
          </div>
        )}

        {/* Option list */}
        <div
          role="listbox"
          aria-label={title}
          aria-multiselectable={isMultiple}
          className={cn('p-1.5 space-y-0.5', !autoHeight && 'max-h-64 overflow-y-auto')}
        >
          {/* Single "All" row — first option inside listbox */}
          {!isMultiple && allLabel && !query && (
            <button
              type="button"
              role="option"
              aria-selected={!hasSelection}
              className={cn(
                'w-full flex items-center gap-2 min-h-[34px] px-2 py-1.5 rounded-[4px] text-body text-left transition-colors',
                'hover:bg-[var(--win11-control-hover)]',
                !hasSelection && 'bg-[var(--win11-control-hover)]',
              )}
              onClick={() => { onChange(undefined); setOpen(false) }}
            >
              <span className="flex-1 min-w-0">{allLabel}</span>
              {!hasSelection && <Check className="w-4 h-4 shrink-0 text-primary" />}
            </button>
          )}

          {/* No results */}
          {filteredOptions.length === 0 ? (
            <div className="px-2.5 py-4 text-body text-center text-muted-foreground">
              No results
            </div>
          ) : (
            filteredOptions.map((opt) => {
              const checked = isChecked(opt.value)
              // Use <div role="option"> for multiple mode to avoid <button>-in-<button>
              // (Checkbox renders a <button> internally via Radix).
              // Single mode has no nested interactive elements so <button> is fine.
              if (isMultiple) {
                return (
                  <div
                    key={String(opt.value)}
                    role="option"
                    aria-selected={checked}
                    aria-disabled={opt.disabled}
                    tabIndex={opt.disabled ? -1 : 0}
                    className={cn(
                      'w-full flex items-center gap-2 min-h-[34px] px-2 py-1.5 rounded-[4px] text-body text-left transition-colors cursor-default select-none',
                      'hover:bg-[var(--win11-control-hover)]',
                      opt.disabled && 'pointer-events-none opacity-50',
                      checked && 'bg-primary/5',
                    )}
                    onClick={() => !opt.disabled && handleSelect(opt.value)}
                    onKeyDown={(e) => {
                      if ((e.key === 'Enter' || e.key === ' ') && !opt.disabled) {
                        e.preventDefault()
                        handleSelect(opt.value)
                      }
                    }}
                  >
                    <Checkbox
                      checked={checked}
                      disabled={opt.disabled}
                      aria-hidden="true"
                      tabIndex={-1}
                      onCheckedChange={() => {}}
                    />
                    <span className="flex-1 min-w-0">
                      {renderLabel
                        ? renderLabel(opt)
                        : <OptionChip icon={opt.icon} color={opt.color} label={opt.label} />
                      }
                    </span>
                  </div>
                )
              }
              return (
                <button
                  key={String(opt.value)}
                  type="button"
                  role="option"
                  aria-selected={checked}
                  aria-disabled={opt.disabled}
                  disabled={opt.disabled}
                  className={cn(
                    'w-full flex items-center gap-2 min-h-[34px] px-2 py-1.5 rounded-[4px] text-body text-left transition-colors',
                    'hover:bg-[var(--win11-control-hover)]',
                    'disabled:pointer-events-none disabled:opacity-50',
                    checked && 'bg-[var(--win11-control-hover)]',
                  )}
                  onClick={() => handleSelect(opt.value)}
                >
                  <span className="flex-1 min-w-0">
                    {renderLabel
                      ? renderLabel(opt)
                      : <OptionChip icon={opt.icon} color={opt.color} label={opt.label} />
                    }
                  </span>
                  {checked && <Check className="w-4 h-4 shrink-0 text-primary" />}
                </button>
              )
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
