/**
 * SelectComposite contract tests — Phase 5b (radix-based)
 * Single mode: radix Select. Multiple/showSearch: Popover-based.
 *
 * jsdom scope notes:
 * - radix Select pointer interactions (click trigger → open popover) are limited
 *   in jsdom because radix uses pointer events internally. We test render/structure
 *   and controlled value display; interaction tests live in behavior suite.
 * - Multiple/Popover path is fully testable via click + keyboard.
 */
import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { SelectComposite } from './select-composite'
import type { SelectOption } from './select.types'

const options: SelectOption[] = [
  { label: 'Option A', value: 'a' },
  { label: 'Option B', value: 'b' },
  { label: 'Option C', value: 'c', disabled: true },
]

describe('SelectComposite — contract tests (single / radix Select)', () => {
  it('renders without crashing (single mode)', () => {
    render(<SelectComposite options={[]} />)
    expect(document.querySelector('[data-slot="select-composite"]')).toBeInTheDocument()
  })

  it('renders select trigger', () => {
    render(<SelectComposite options={options} />)
    expect(document.querySelector('[data-slot="select-trigger"]')).toBeInTheDocument()
  })

  it('is disabled when disabled=true', () => {
    render(<SelectComposite options={options} disabled={true} />)
    const trigger = document.querySelector('[data-slot="select-trigger"]') as HTMLButtonElement
    expect(trigger).toBeDisabled()
  })

  it('is disabled when loading=true', () => {
    render(<SelectComposite options={options} loading={true} />)
    const trigger = document.querySelector('[data-slot="select-trigger"]') as HTMLButtonElement
    expect(trigger).toBeDisabled()
  })

  it('sets data-loading when loading=true', () => {
    render(<SelectComposite options={options} loading={true} />)
    const composite = document.querySelector('[data-slot="select-composite"]')
    expect(composite).toHaveAttribute('data-loading')
  })

  it('shows clear button when allowClear=true and value is set', () => {
    render(<SelectComposite options={options} allowClear value="a" onChange={() => {}} />)
    expect(document.querySelector('[data-slot="select-clear"]')).toBeInTheDocument()
  })

  it('does not show clear button when no value', () => {
    render(<SelectComposite options={options} allowClear onChange={() => {}} />)
    expect(document.querySelector('[data-slot="select-clear"]')).not.toBeInTheDocument()
  })
})

describe('SelectComposite — contract tests (multiple / Popover-based)', () => {
  it('renders without crashing (multiple mode)', () => {
    render(<SelectComposite options={[]} mode="multiple" />)
    expect(document.querySelector('[data-slot="select-composite"]')).toBeInTheDocument()
  })

  it('renders trigger button', () => {
    render(<SelectComposite options={options} mode="multiple" />)
    expect(document.querySelector('[data-slot="select-trigger"]')).toBeInTheDocument()
  })

  it('is disabled when disabled=true (multiple)', () => {
    render(<SelectComposite options={options} mode="multiple" disabled={true} />)
    const trigger = document.querySelector('[data-slot="select-trigger"]') as HTMLButtonElement
    expect(trigger).toBeDisabled()
  })

  it('is disabled when loading=true (multiple)', () => {
    render(<SelectComposite options={options} mode="multiple" loading={true} />)
    const trigger = document.querySelector('[data-slot="select-trigger"]') as HTMLButtonElement
    expect(trigger).toBeDisabled()
  })

  it('sets aria-busy when loading=true', () => {
    render(<SelectComposite options={options} mode="multiple" loading={true} />)
    const trigger = document.querySelector('[data-slot="select-trigger"]') as HTMLButtonElement
    expect(trigger).toHaveAttribute('aria-busy', 'true')
  })

  it('shows clear button when allowClear=true and values selected', () => {
    render(
      <SelectComposite
        options={options}
        mode="multiple"
        allowClear
        value={['a', 'b']}
        onChange={() => {}}
      />,
    )
    expect(document.querySelector('[data-slot="select-clear"]')).toBeInTheDocument()
  })
})

describe('SelectComposite — contract tests (showSearch)', () => {
  it('renders trigger when showSearch=true', () => {
    render(<SelectComposite options={options} showSearch />)
    expect(document.querySelector('[data-slot="select-trigger"]')).toBeInTheDocument()
  })
})
