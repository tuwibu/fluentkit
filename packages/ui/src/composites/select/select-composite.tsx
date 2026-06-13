import type { SelectProps } from './select.types'
import { MultiSearchSelect } from './internal/multi-search-select'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../../primitives/select'

/**
 * Select composite component — config-driven, antd-style facade.
 * - Single mode (no showSearch): styled primitives from primitives/select.
 * - Multiple or showSearch: Popover-based with Checkbox items + search input.
 * Supports single/multiple selection, search filtering, and allowClear.
 */
export function SelectComposite<V = string>({
  options,
  value,
  onChange,
  mode,
  showSearch = false,
  loading = false,
  allowClear = false,
  placeholder,
  disabled = false,
}: SelectProps<V>) {
  const isMultiple = mode === 'multiple'

  // Use Popover-based implementation for multiple selection or search
  if (isMultiple || showSearch) {
    return (
      <MultiSearchSelect
        options={options}
        value={value}
        onChange={onChange}
        mode={mode}
        showSearch={showSearch}
        loading={loading}
        allowClear={allowClear}
        placeholder={placeholder}
        disabled={disabled}
      />
    )
  }

  // Single mode without search: styled Select primitives
  const singleValue = value !== undefined ? String(value) : undefined
  const hasValue = singleValue !== undefined && singleValue !== ''

  const handleValueChange = (val: string) => {
    onChange?.(val as unknown as V)
  }

  const handleClear = () => {
    onChange?.(undefined as unknown as V)
  }

  return (
    <div data-slot="select-composite" data-loading={loading || undefined} className="relative inline-flex items-center gap-1">
      <Select
        value={singleValue ?? ''}
        onValueChange={handleValueChange}
        disabled={disabled || loading}
      >
        <SelectTrigger aria-busy={loading}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        {/* Don't return focus to the trigger on close — radix's programmatic
            refocus makes the browser match :focus-visible, leaving the primary
            border stuck after a pointer selection. Keyboard users still get the
            focus border when they Tab to the trigger. */}
        <SelectContent
          position="popper"
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          {options.map((opt) => (
            <SelectItem
              key={String(opt.value)}
              value={String(opt.value)}
              disabled={opt.disabled}
            >
              {typeof opt.label === 'string' ? opt.label : String(opt.value)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {allowClear && hasValue && (
        <button
          type="button"
          data-slot="select-clear"
          aria-label="Clear selection"
          onClick={handleClear}
          className="flex size-4 items-center justify-center rounded-full text-muted-foreground hover:text-foreground transition-colors"
        >
          ×
        </button>
      )}
    </div>
  )
}
