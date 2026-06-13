/**
 * Input composite behavior tests — Phase 5 TDD
 * Tests for allowClear, onChange, controlled value
 */
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { InputComposite } from './input-composite'

describe('InputComposite — allowClear', () => {
  it('shows clear button when allowClear=true and value is non-empty', () => {
    render(<InputComposite allowClear value="hello" onChange={() => {}} />)
    expect(document.querySelector('[data-slot="input-clear"]')).toBeInTheDocument()
  })

  it('does NOT show clear button when allowClear=true and value is empty', () => {
    render(<InputComposite allowClear value="" onChange={() => {}} />)
    expect(document.querySelector('[data-slot="input-clear"]')).not.toBeInTheDocument()
  })

  it('does NOT show clear button when allowClear is not set', () => {
    render(<InputComposite value="hello" onChange={() => {}} />)
    expect(document.querySelector('[data-slot="input-clear"]')).not.toBeInTheDocument()
  })

  it('calls onChange with empty string event when clear button clicked', async () => {
    const onChange = vi.fn()
    render(<InputComposite allowClear value="hello" onChange={onChange} />)
    await userEvent.click(document.querySelector('[data-slot="input-clear"]') as HTMLElement)
    expect(onChange).toHaveBeenCalledTimes(1)
    // The synthetic event value should be ''
    const callArg = onChange.mock.calls[0][0]
    expect(callArg.target.value).toBe('')
  })
})

describe('InputComposite — controlled onChange', () => {
  it('fires onChange when user types', async () => {
    const onChange = vi.fn()
    render(<InputComposite value="" onChange={onChange} />)
    const input = document.querySelector('[data-slot="input"]') as HTMLInputElement
    await userEvent.type(input, 'a')
    expect(onChange).toHaveBeenCalled()
  })
})

describe('InputComposite — data-slot wrappers', () => {
  it('renders prefix with data-slot', () => {
    render(<InputComposite prefix="$" />)
    const prefix = document.querySelector('[data-slot="input-prefix"]')
    expect(prefix).toBeInTheDocument()
    expect(screen.getByText('$')).toBeInTheDocument()
  })

  it('renders suffix with data-slot', () => {
    render(<InputComposite suffix="kg" />)
    expect(document.querySelector('[data-slot="input-suffix"]')).toBeInTheDocument()
  })

  it('renders addonBefore with data-slot', () => {
    render(<InputComposite addonBefore="http://" />)
    expect(document.querySelector('[data-slot="input-addon-before"]')).toBeInTheDocument()
  })

  it('renders addonAfter with data-slot', () => {
    render(<InputComposite addonAfter=".com" />)
    expect(document.querySelector('[data-slot="input-addon-after"]')).toBeInTheDocument()
  })
})
