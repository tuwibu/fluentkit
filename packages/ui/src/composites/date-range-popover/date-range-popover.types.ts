export interface DateRangeValue {
  from: string
  to: string
}

export interface DateRangePopoverProps {
  /** Current date range value. Pass `{ from: '', to: '' }` for empty state. */
  value: DateRangeValue
  /** Called when user selects a range or preset. */
  onChange: (range: DateRangeValue) => void
  /** Whether to show the preset sidebar. Default true. */
  showPresets?: boolean
  /** Accessible label for the trigger button. */
  ariaLabel?: string
}
