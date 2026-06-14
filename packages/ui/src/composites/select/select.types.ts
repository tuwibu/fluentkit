import type { ReactNode } from 'react'

/**
 * A single option in the Select dropdown.
 */
export interface SelectOption<V = string> {
  /** Display label shown in the dropdown and trigger. */
  label: ReactNode
  /** The underlying value emitted on selection. */
  value: V
  /** When true, this option is not selectable. */
  disabled?: boolean
  /** Optional leading icon (ReactNode, consumer-supplied). */
  icon?: ReactNode
  /** Optional hex/rgb color for a colored chip (via color-mix). */
  color?: string
}

/**
 * Props for the Select composite component.
 * Config-driven facade: pass `options` array instead of composing
 * individual `<Option>` children (antd-style).
 *
 * Generic over V — the value type. Defaults to `string`.
 */
export interface SelectProps<V = string> {
  /** List of selectable options. */
  options: SelectOption<V>[]
  /**
   * Controlled value.
   * - Single mode: `V | undefined`.
   * - Multiple mode: `V[]`.
   */
  value?: V | V[]
  /**
   * Change handler.
   * - Single mode: receives the selected value.
   * - Multiple mode: receives the full selected values array.
   */
  onChange?: (value: V | V[]) => void
  /**
   * Selection mode.
   * - Omit or `undefined` → single selection.
   * - `'multiple'` → multi-select with tag display.
   */
  mode?: 'multiple'
  /** Shows a search input inside the dropdown to filter options. */
  showSearch?: boolean
  /** Shows a loading spinner in the trigger when true. */
  loading?: boolean
  /** Shows a clear (×) button when a value is selected. */
  allowClear?: boolean
  /** Placeholder text shown when no value is selected. */
  placeholder?: string
  /** Disables interaction and applies muted styling. Default: false. */
  disabled?: boolean
  /**
   * Stretches the select to fill its container width (100%) instead of sizing
   * to content. Mirrors antd's `<Select>` block behavior. Default: false.
   */
  block?: boolean
}
