import { describe, it, expectTypeOf } from 'vitest'
import type { InputProps, InputSize, InputStatus } from './input.types'

describe('InputProps', () => {
  it('accepts controlled value + onChange', () => {
    const props: InputProps = {
      value: 'hello',
      onChange: (_e) => {},
    }
    expectTypeOf(props.value).toMatchTypeOf<string | undefined>()
  })

  it('accepts valid size values', () => {
    const s1: InputSize = 'small'
    const s2: InputSize = 'middle'
    const s3: InputSize = 'large'
    expectTypeOf(s1).toMatchTypeOf<InputSize>()
    expectTypeOf(s2).toMatchTypeOf<InputSize>()
    expectTypeOf(s3).toMatchTypeOf<InputSize>()
  })

  it('rejects invalid size', () => {
    // 'xl' is not a valid InputSize value
    expectTypeOf<'xl'>().not.toMatchTypeOf<InputSize>()
  })

  it('accepts valid status values', () => {
    const st1: InputStatus = 'error'
    const st2: InputStatus = 'warning'
    expectTypeOf(st1).toMatchTypeOf<InputStatus>()
    expectTypeOf(st2).toMatchTypeOf<InputStatus>()
  })

  it('rejects invalid status', () => {
    // 'success' is not a valid InputStatus
    expectTypeOf<'success'>().not.toMatchTypeOf<InputStatus>()
  })

  it('accepts prefix/suffix as ReactNode', () => {
    const props: InputProps = { prefix: 'http://', suffix: '.com' }
    expectTypeOf(props.prefix).toMatchTypeOf<React.ReactNode>()
    expectTypeOf(props.suffix).toMatchTypeOf<React.ReactNode>()
  })

  it('accepts addonBefore/addonAfter as ReactNode', () => {
    const props: InputProps = { addonBefore: 'https://', addonAfter: '.io' }
    expectTypeOf(props.addonBefore).toMatchTypeOf<React.ReactNode>()
    expectTypeOf(props.addonAfter).toMatchTypeOf<React.ReactNode>()
  })

  it('accepts allowClear boolean', () => {
    const props: InputProps = { allowClear: true }
    expectTypeOf(props.allowClear).toMatchTypeOf<boolean | undefined>()
  })

  it('accepts arbitrary type string', () => {
    const props: InputProps = { type: 'password' }
    expectTypeOf(props.type).toMatchTypeOf<string | undefined>()
  })

  it('rejects unknown prop', () => {
    // 'autocomplete' is not a known key on InputProps
    type HasAutocomplete = 'autocomplete' extends keyof InputProps ? true : false
    expectTypeOf<HasAutocomplete>().toMatchTypeOf<false>()
  })
})

import type React from 'react'
