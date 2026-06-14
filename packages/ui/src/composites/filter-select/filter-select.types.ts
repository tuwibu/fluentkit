import type { ReactNode } from 'react'
import type { SelectOption } from '../select/select.types'

/**
 * Props for the FilterSelect composite.
 *
 * FilterSelect differs from Select in trigger semantics:
 * - trigger always shows `title` (static label) — not the selected value.
 * - active state: badge count (default) or chip list (`triggerDisplay='tags'`).
 * - single mode supports toggle-to-clear (click selected option again → deselect).
 *
 * Generic over V — the option value type. Defaults to string.
 */
export interface FilterSelectProps<V = string> {
  /** Static trigger label — never replaced by the selected value. */
  title: string
  /** Selectable options. Reuses SelectOption<V> (supports icon + color). */
  options: SelectOption<V>[]
  /** Controlled value. Single: V | undefined. Multiple: V[]. */
  value?: V | V[]
  /** Change handler. Receives undefined when selection is cleared. */
  onChange: (value: V | V[] | undefined) => void
  /** 'single' (default) or 'multiple'. */
  mode?: 'single' | 'multiple'
  /** Show a search input inside the popup. Default false. */
  searchable?: boolean
  /**
   * How to display active selections in the trigger.
   * - 'count' (default): badge with total count.
   * - 'tags': inline Tag chips for each selected option (with × remove).
   */
  triggerDisplay?: 'count' | 'tags'
  /** Wider popup (w-56 instead of w-48). Default false. */
  wide?: boolean
  /**
   * Single mode only: add a leading "All" row that clears the selection
   * when clicked (shown as checked when nothing is selected).
   */
  allLabel?: string
  /**
   * Drop max-height + scroll from the option list so every option is visible.
   * Default false.
   */
  autoHeight?: boolean
  /**
   * Escape hatch: custom render function for each option row.
   * Takes priority over the default OptionChip renderer.
   */
  renderLabel?: (opt: SelectOption<V>) => ReactNode
  /**
   * Show an "×" clear button inside the trigger. Default false.
   * Note: ignored when `triggerDisplay='tags'` — each chip already has its own remove button.
   */
  allowClear?: boolean
  /** Disable interaction and apply muted styling. Default false. */
  disabled?: boolean
}
