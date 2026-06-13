import type { ReactNode, ChangeEvent, InputHTMLAttributes } from 'react'

/**
 * Visual size variant for the Input component.
 */
export type InputSize = 'small' | 'middle' | 'large'

/**
 * Validation status to apply border/color feedback.
 * - 'error'   → red border.
 * - 'warning' → yellow border.
 */
export type InputStatus = 'error' | 'warning'

/**
 * Props for the Input composite component.
 * API mirrors antd Input props subset, and (like antd) also accepts native
 * input attributes (`id`, `name`, `aria-*`, `autoComplete`, …) which are
 * forwarded to the underlying `<input>`. This is what lets `FormField` wire
 * `id` / `aria-invalid` / `aria-describedby` onto the control for a11y.
 */
export interface InputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'onChange' | 'prefix' | 'size' | 'type' | 'value' | 'disabled' | 'placeholder'
  > {
  /** Controlled value. */
  value?: string
  /** Change handler — receives the native input change event. */
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
  /** Placeholder text shown when value is empty. */
  placeholder?: string
  /** Content rendered inside the input, before the text (e.g. icon). */
  prefix?: ReactNode
  /** Content rendered inside the input, after the text (e.g. icon). */
  suffix?: ReactNode
  /** Size variant. Default: 'middle'. */
  size?: InputSize
  /** Validation status — applies visual feedback styling. */
  status?: InputStatus
  /** Shows a clear (×) button when the input has a value. */
  allowClear?: boolean
  /** Content rendered outside and before the input (e.g. 'http://'). */
  addonBefore?: ReactNode
  /** Content rendered outside and after the input (e.g. '.com'). */
  addonAfter?: ReactNode
  /** Disables interaction and applies muted styling. Default: false. */
  disabled?: boolean
  /**
   * Native input type attribute.
   * Common values: 'text' | 'password' | 'email' | 'number' | 'search'.
   * Default: 'text'.
   */
  type?: string
}
