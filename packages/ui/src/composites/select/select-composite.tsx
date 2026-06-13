import { Select as SelectPrimitive } from 'radix-ui'
import type { SelectProps } from './select.types'
import { MultiSearchSelect } from './internal/multi-search-select'

/**
 * Select composite component — config-driven, antd-style facade.
 * - Single mode (no showSearch): radix Select compound for accessible dropdown.
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

  // Single mode without search: radix Select compound
  const singleValue = value !== undefined ? String(value) : undefined
  const hasValue = singleValue !== undefined && singleValue !== ''

  const handleValueChange = (val: string) => {
    onChange?.(val as unknown as V)
  }

  const handleClear = () => {
    onChange?.(undefined as unknown as V)
  }

  return (
    <div data-slot="select-composite" data-loading={loading || undefined}>
      <SelectPrimitive.Root
        value={singleValue ?? ''}
        onValueChange={handleValueChange}
        disabled={disabled || loading}
      >
        <SelectPrimitive.Trigger
          data-slot="select-trigger"
          aria-busy={loading}
        >
          <SelectPrimitive.Value
            data-slot="select-value"
            placeholder={placeholder}
          />
        </SelectPrimitive.Trigger>
        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            data-slot="select-content"
            position="popper"
          >
            <SelectPrimitive.Viewport data-slot="select-viewport">
              {options.map((opt, i) => (
                <SelectPrimitive.Item
                  key={i}
                  value={String(opt.value)}
                  disabled={opt.disabled}
                  data-slot="select-item"
                >
                  <SelectPrimitive.ItemText>
                    {typeof opt.label === 'string' ? opt.label : String(opt.value)}
                  </SelectPrimitive.ItemText>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.Viewport>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
      {allowClear && hasValue && (
        <button
          type="button"
          data-slot="select-clear"
          aria-label="Clear selection"
          onClick={handleClear}
        >
          ×
        </button>
      )}
    </div>
  )
}
