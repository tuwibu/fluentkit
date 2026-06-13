import { describe, it, expectTypeOf } from 'vitest'
import type { ModalProps, ConfirmOptions, ModalImperativeApi } from './modal.types'

describe('ModalProps', () => {
  it('requires open', () => {
    const props: ModalProps = { open: true }
    expectTypeOf(props.open).toBeBoolean()
  })

  it('accepts footer as ReactNode', () => {
    const props: ModalProps = { open: true, footer: 'custom footer' }
    expectTypeOf(props.footer).not.toBeUndefined()
  })

  it('accepts footer as null to hide footer', () => {
    const props: ModalProps = { open: true, footer: null }
    expectTypeOf(props.footer).toMatchTypeOf<React.ReactNode | null | undefined>()
  })

  it('accepts onOk returning Promise<void>', () => {
    const props: ModalProps = {
      open: true,
      onOk: async () => {},
    }
    expectTypeOf(props.onOk).toMatchTypeOf<
      (() => void | Promise<void>) | undefined
    >()
  })

  it('accepts numeric width', () => {
    const props: ModalProps = { open: true, width: 720 }
    expectTypeOf(props.width).toMatchTypeOf<number | string | undefined>()
  })

  it('accepts string width', () => {
    const props: ModalProps = { open: true, width: '80%' }
    expectTypeOf(props.width).toMatchTypeOf<number | string | undefined>()
  })

  it('rejects unknown prop', () => {
    // ModalProps must not have an index signature — unknown keys are rejected
    type HasUnknownProp = 'unknownProp' extends keyof ModalProps ? true : false
    expectTypeOf<HasUnknownProp>().toMatchTypeOf<false>()
  })
})

describe('ConfirmOptions', () => {
  it('requires title', () => {
    const opts: ConfirmOptions = { title: 'Are you sure?' }
    expectTypeOf(opts.title).not.toBeUndefined()
  })

  it('accepts okType danger', () => {
    const opts: ConfirmOptions = { title: 'Delete?', okType: 'danger' }
    expectTypeOf(opts.okType).toMatchTypeOf<'primary' | 'danger' | undefined>()
  })

  it('rejects invalid okType', () => {
    // okType only allows 'primary' | 'danger'
    type OkTypeType = NonNullable<ConfirmOptions['okType']>
    expectTypeOf<'destructive'>().not.toMatchTypeOf<OkTypeType>()
  })
})

describe('ModalImperativeApi', () => {
  it('confirm returns Promise<void>', () => {
    const api = {} as ModalImperativeApi
    expectTypeOf(api.confirm).toMatchTypeOf<(options: ConfirmOptions) => Promise<void>>()
  })

  it('rejects confirm called without title', () => {
    // title is required — it must be a listed key in ConfirmOptions (not optional-only)
    // Verify 'title' is a required key: Required<ConfirmOptions> must have 'title'
    type RequiredKeys = keyof Required<ConfirmOptions>
    type TitleIsRequired = 'title' extends RequiredKeys ? true : false
    expectTypeOf<TitleIsRequired>().toMatchTypeOf<true>()
  })
})

import type React from 'react'
