import { createContext, useContext } from 'react'

export interface FormFieldContextValue {
  /** The `id` that should be set on the native control. */
  controlId: string
  /** `true` when the field has an error — inject as `aria-invalid` on the control. */
  invalid: boolean
  /** `id` of the error message element (for `aria-describedby`). */
  errorId: string
  /** `id` of the description element (for `aria-describedby`). */
  descriptionId: string
  /** Whether the field is required. */
  required: boolean
}

export const FormFieldContext = createContext<FormFieldContextValue | null>(null)

/**
 * useFormField — public hook.
 * Returns ARIA wiring context for custom controls rendered inside <FormField>.
 * Use when cloneElement auto-wiring isn't sufficient (e.g. composite children).
 *
 * @example
 * function MyInput(props) {
 *   const { controlId, invalid, errorId } = useFormField()
 *   return <input id={controlId} aria-invalid={invalid || undefined} aria-describedby={errorId} {...props} />
 * }
 */
export function useFormField(): FormFieldContextValue {
  const ctx = useContext(FormFieldContext)
  if (!ctx) {
    throw new Error('useFormField must be used inside a <FormField>')
  }
  return ctx
}
