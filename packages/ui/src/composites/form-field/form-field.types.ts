import type { ReactNode } from 'react'

/**
 * Props for the FormField composite component.
 *
 * Core agnostic — does NOT bind to react-hook-form.
 * A separate RHF adapter (`@fluent-kit/ui/rhf`) wraps this component
 * using `useController` and is an optional peer dependency.
 */
export interface FormFieldProps {
  /** Label text displayed above the field. */
  label?: ReactNode
  /** The `id` of the form control this label targets. Used for `htmlFor`. */
  htmlFor?: string
  /** When true, renders a required indicator (e.g. asterisk) next to the label. */
  required?: boolean
  /**
   * Validation error message or node.
   * When provided, renders below the field in error styling.
   */
  error?: ReactNode
  /**
   * Helper / description text rendered below the field (and below the error
   * when both are present). Describes expected input format or constraints.
   */
  description?: ReactNode
  /** The form control to wrap (Input, Select, Textarea, etc.). */
  children?: ReactNode
}
