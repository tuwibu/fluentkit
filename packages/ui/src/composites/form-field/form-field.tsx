import { Children, cloneElement, isValidElement, useId } from 'react'
import { Label } from '../../primitives/label'
import { FormFieldContext } from './form-field-context'
import type { FormFieldProps } from './form-field.types'

/**
 * FormField composite — CORE agnostic.
 * Wraps a form control with label, required indicator, description, and error.
 * Does NOT depend on react-hook-form. RHF adapter: @tuwibu/fluentkit/rhf (Phase 7 subpath).
 *
 * A11y wiring:
 * - Creates FormFieldContext so custom controls can call useFormField() to read
 *   { controlId, invalid, errorId, descriptionId, required }.
 * - If children is a single valid React element, injects id/aria-invalid/aria-describedby
 *   via cloneElement (convenience: no consumer wiring needed for simple cases).
 *   Existing props on the child take precedence.
 */
export function FormField({
  label,
  htmlFor,
  required = false,
  error,
  description,
  children,
}: FormFieldProps) {
  const autoId = useId()
  const controlId = htmlFor ?? autoId
  const descriptionId = `${autoId}-desc`
  const errorId = `${autoId}-err`

  const hasError = !!error
  const hasDescription = !!description
  const invalid = hasError

  // aria-describedby: error id when error present, else description id (mirrors render logic)
  const ariaDescribedBy = [
    hasError ? errorId : undefined,
    hasDescription && !hasError ? descriptionId : undefined,
  ]
    .filter(Boolean)
    .join(' ') || undefined

  // Convenience: inject aria props into a single React element child.
  // Child's own explicit props take precedence (child wins on conflict).
  let resolvedChildren = children
  const childArray = Children.toArray(children)
  if (childArray.length === 1 && isValidElement(childArray[0])) {
    const child = childArray[0] as React.ReactElement<Record<string, unknown>>
    resolvedChildren = cloneElement(child, {
      id: child.props.id ?? controlId,
      'aria-invalid': child.props['aria-invalid'] ?? (invalid ? true : undefined),
      'aria-describedby': child.props['aria-describedby'] ?? ariaDescribedBy,
    })
  }

  return (
    <FormFieldContext.Provider value={{ controlId, invalid, errorId, descriptionId, required }}>
      <div data-slot="form-field" className="flex flex-col gap-2">
        {label && (
          <Label htmlFor={controlId} data-slot="form-field-label">
            {label}
            {required && (
              <span aria-hidden="true" data-slot="form-field-required" className="text-destructive ml-0.5">
                *
              </span>
            )}
          </Label>
        )}

        <div data-slot="form-field-control">
          {resolvedChildren}
        </div>

        {hasError && (
          <p id={errorId} role="alert" data-slot="form-field-error" aria-live="assertive" className="text-xs text-destructive font-medium">
            {error}
          </p>
        )}

        {/* Description hidden when error is present — error takes priority (phase 4 contract). */}
        {hasDescription && !hasError && (
          <p id={descriptionId} data-slot="form-field-description" className="text-xs text-muted-foreground">
            {description}
          </p>
        )}
      </div>
    </FormFieldContext.Provider>
  )
}
