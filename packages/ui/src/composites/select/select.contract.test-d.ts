import { describe, it, expectTypeOf } from 'vitest'
import type { ReactNode } from 'react'
import type { SelectProps, SelectOption } from './select.types'

describe('SelectOption', () => {
  it('accepts string value (default generic)', () => {
    const opt: SelectOption = { label: 'Option A', value: 'a' }
    expectTypeOf(opt.value).toMatchTypeOf<string>()
  })

  it('accepts optional icon as ReactNode', () => {
    const opt: SelectOption = { label: 'With icon', value: 'x', icon: null }
    expectTypeOf(opt.icon).toMatchTypeOf<ReactNode | undefined>()
  })

  it('accepts optional color as string', () => {
    const opt: SelectOption = { label: 'Colored', value: 'y', color: '#ff0000' }
    expectTypeOf(opt.color).toMatchTypeOf<string | undefined>()
  })

  it('accepts numeric value via generic', () => {
    const opt: SelectOption<number> = { label: 'One', value: 1 }
    expectTypeOf(opt.value).toMatchTypeOf<number>()
  })

  it('accepts disabled flag', () => {
    const opt: SelectOption = { label: 'Disabled', value: 'x', disabled: true }
    expectTypeOf(opt.disabled).toMatchTypeOf<boolean | undefined>()
  })

  it('rejects missing value', () => {
    // value is required — must be present in SelectOption
    type ValueProp = SelectOption['value']
    expectTypeOf<undefined>().not.toMatchTypeOf<ValueProp>()
  })
})

describe('SelectProps', () => {
  it('accepts options array', () => {
    const props: SelectProps = {
      options: [{ label: 'A', value: 'a' }],
    }
    expectTypeOf(props.options).toMatchTypeOf<SelectOption[]>()
  })

  it('accepts single value', () => {
    const props: SelectProps = {
      options: [],
      value: 'a',
    }
    expectTypeOf(props.value).toMatchTypeOf<string | string[] | undefined>()
  })

  it('accepts multiple mode with array value', () => {
    const props: SelectProps = {
      options: [],
      mode: 'multiple',
      value: ['a', 'b'],
    }
    expectTypeOf(props.mode).toMatchTypeOf<'multiple' | undefined>()
  })

  it('rejects invalid mode', () => {
    // only 'multiple' is a valid mode — 'tags' must not be assignable
    type ModeType = NonNullable<SelectProps['mode']>
    expectTypeOf<'tags'>().not.toMatchTypeOf<ModeType>()
  })

  it('accepts onChange callback', () => {
    const props: SelectProps = {
      options: [],
      onChange: (val) => { console.log(val) },
    }
    expectTypeOf(props.onChange).toMatchTypeOf<
      ((value: string | string[]) => void) | undefined
    >()
  })

  it('accepts showSearch, loading, allowClear booleans', () => {
    const props: SelectProps = {
      options: [],
      showSearch: true,
      loading: false,
      allowClear: true,
    }
    expectTypeOf(props.showSearch).toMatchTypeOf<boolean | undefined>()
    expectTypeOf(props.loading).toMatchTypeOf<boolean | undefined>()
    expectTypeOf(props.allowClear).toMatchTypeOf<boolean | undefined>()
  })

  it('accepts numeric value via generic', () => {
    const props: SelectProps<number> = {
      options: [{ label: 'One', value: 1 }],
      value: 1,
    }
    expectTypeOf(props.value).toMatchTypeOf<number | number[] | undefined>()
  })
})
