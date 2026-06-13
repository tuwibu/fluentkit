import { describe, it, expectTypeOf } from 'vitest'
import type { FormFieldProps } from './form-field.types'

describe('FormFieldProps', () => {
  it('accepts all optional props', () => {
    const props: FormFieldProps = {
      label: 'Email',
      htmlFor: 'email-input',
      required: true,
      error: 'This field is required',
      description: 'Enter your work email',
      children: null,
    }
    expectTypeOf(props).toMatchTypeOf<FormFieldProps>()
  })

  it('accepts ReactNode for label', () => {
    const props: FormFieldProps = { label: 'Name' }
    expectTypeOf(props.label).toMatchTypeOf<React.ReactNode>()
  })

  it('accepts ReactNode for error', () => {
    const props: FormFieldProps = { error: 'Required' }
    expectTypeOf(props.error).toMatchTypeOf<React.ReactNode>()
  })

  it('accepts ReactNode for description', () => {
    const props: FormFieldProps = { description: 'Helper text' }
    expectTypeOf(props.description).toMatchTypeOf<React.ReactNode>()
  })

  it('htmlFor is string', () => {
    const props: FormFieldProps = { htmlFor: 'my-input' }
    expectTypeOf(props.htmlFor).toMatchTypeOf<string | undefined>()
  })

  it('required is boolean', () => {
    const props: FormFieldProps = { required: false }
    expectTypeOf(props.required).toMatchTypeOf<boolean | undefined>()
  })

  it('works with no props (fully optional)', () => {
    const props: FormFieldProps = {}
    expectTypeOf(props).toMatchTypeOf<FormFieldProps>()
  })

  it('rejects unknown prop', () => {
    // 'name' must not exist on FormFieldProps (RHF binding excluded by design)
    type HasName = 'name' extends keyof FormFieldProps ? true : false
    expectTypeOf<HasName>().toMatchTypeOf<false>()
  })
})

import type React from 'react'
