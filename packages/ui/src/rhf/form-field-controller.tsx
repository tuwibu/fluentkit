/**
 * RHF adapter for FormField.
 * Wraps the core agnostic FormField with react-hook-form useController.
 * Consumer must have react-hook-form installed (optional peerDep on @tuwibu/fluentkit).
 */
import type { ReactNode } from 'react'
import type { Control, FieldPath, FieldValues } from 'react-hook-form'
import { useController } from 'react-hook-form'
import { FormField } from '../composites/form-field/form-field'
import type { FormFieldProps } from '../composites/form-field/form-field.types'

export interface FormFieldControllerProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<FormFieldProps, 'error'> {
  /** react-hook-form control object from useForm(). */
  control: Control<TFieldValues>
  /** Field name matching TFieldValues key. */
  name: TName
  /** Render prop receives field (ref, value, onChange, onBlur) from RHF. */
  render: (field: ReturnType<typeof useController<TFieldValues, TName>>['field']) => ReactNode
}

/**
 * FormFieldController — composes core FormField with RHF useController.
 * Automatically extracts error message from fieldState and passes to FormField.
 */
export function FormFieldController<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  render,
  label,
  htmlFor,
  required,
  description,
  children: _children, // ignore — render prop is the slot
}: FormFieldControllerProps<TFieldValues, TName>) {
  const { field, fieldState } = useController({ control, name })

  const errorMsg = fieldState.error?.message

  return (
    <FormField
      label={label}
      htmlFor={htmlFor ?? name}
      required={required}
      description={description}
      error={errorMsg}
    >
      {render(field)}
    </FormField>
  )
}
