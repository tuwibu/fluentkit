/**
 * Select composite behavior tests — Phase 5b (radix-based)
 *
 * jsdom scope reduction notes (documented, not faked):
 * - radix Select (single, no showSearch): clicking the trigger to open the
 *   dropdown does not work in jsdom because radix uses pointer events (onPointerDown)
 *   which jsdom does not fully support. Single-mode interaction tests are scoped
 *   to: controlled value display, allowClear button, disabled state.
 * - Multiple/Popover path and showSearch path: fully testable via userEvent.click
 *   because the trigger is a plain <button> and the content renders in a Portal
 *   that jsdom handles. These tests cover open/close, checkbox toggle, search filter,
 *   clear, onChange callbacks.
 */
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { SelectComposite } from './select-composite'
import type { SelectOption } from './select.types'

const options: SelectOption[] = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry', disabled: true },
]

// ---------------------------------------------------------------------------
// Single mode (radix Select) — scope: controlled value + clear
// ---------------------------------------------------------------------------
describe('SelectComposite — single mode, controlled value', () => {
  it('shows placeholder when no value', () => {
    render(<SelectComposite options={options} placeholder="Choose fruit" />)
    // radix SelectValue renders placeholder when value is empty
    expect(screen.getByText('Choose fruit')).toBeInTheDocument()
  })

  it('calls onChange with undefined when clear button clicked', async () => {
    const onChange = vi.fn()
    render(<SelectComposite options={options} allowClear value="apple" onChange={onChange} />)
    const clearBtn = document.querySelector('[data-slot="select-clear"]') as HTMLButtonElement
    await userEvent.click(clearBtn)
    expect(onChange).toHaveBeenCalledWith(undefined)
  })
})

// ---------------------------------------------------------------------------
// Multiple mode (Popover-based) — fully testable in jsdom
// ---------------------------------------------------------------------------
describe('SelectComposite — multiple mode', () => {
  it('opens dropdown when trigger clicked', async () => {
    render(<SelectComposite options={options} mode="multiple" />)
    const trigger = document.querySelector('[data-slot="select-trigger"]') as HTMLButtonElement
    await userEvent.click(trigger)
    await waitFor(() => {
      expect(document.querySelector('[data-slot="select-content"]')).toBeInTheDocument()
    })
  })

  it('renders all options in dropdown', async () => {
    render(<SelectComposite options={options} mode="multiple" />)
    const trigger = document.querySelector('[data-slot="select-trigger"]') as HTMLButtonElement
    await userEvent.click(trigger)
    await waitFor(() => {
      expect(screen.getByText('Apple')).toBeInTheDocument()
      expect(screen.getByText('Banana')).toBeInTheDocument()
      expect(screen.getByText('Cherry')).toBeInTheDocument()
    })
  })

  it('calls onChange with array when item clicked', async () => {
    const onChange = vi.fn()
    render(<SelectComposite options={options} mode="multiple" onChange={onChange} />)
    const trigger = document.querySelector('[data-slot="select-trigger"]') as HTMLButtonElement
    await userEvent.click(trigger)
    await waitFor(() => screen.getByText('Apple'))
    await userEvent.click(screen.getByText('Apple'))
    expect(onChange).toHaveBeenCalledWith(['apple'])
  })

  it('calls onChange with updated array when second item clicked', async () => {
    const onChange = vi.fn()
    render(
      <SelectComposite
        options={options}
        mode="multiple"
        value={['apple']}
        onChange={onChange}
      />,
    )
    const trigger = document.querySelector('[data-slot="select-trigger"]') as HTMLButtonElement
    await userEvent.click(trigger)
    await waitFor(() => screen.getByText('Banana'))
    await userEvent.click(screen.getByText('Banana'))
    expect(onChange).toHaveBeenCalledWith(expect.arrayContaining(['apple', 'banana']))
  })

  it('deselects item when already selected item is clicked', async () => {
    const onChange = vi.fn()
    render(
      <SelectComposite
        options={options}
        mode="multiple"
        value={['apple', 'banana']}
        onChange={onChange}
      />,
    )
    const trigger = document.querySelector('[data-slot="select-trigger"]') as HTMLButtonElement
    await userEvent.click(trigger)
    await waitFor(() => screen.getByText('Apple'))
    await userEvent.click(screen.getByText('Apple'))
    // apple removed from selection
    expect(onChange).toHaveBeenCalledWith(['banana'])
  })

  it('does not call onChange for disabled option', async () => {
    const onChange = vi.fn()
    render(<SelectComposite options={options} mode="multiple" onChange={onChange} />)
    const trigger = document.querySelector('[data-slot="select-trigger"]') as HTMLButtonElement
    await userEvent.click(trigger)
    await waitFor(() => screen.getByText('Cherry'))
    await userEvent.click(screen.getByText('Cherry'))
    expect(onChange).not.toHaveBeenCalled()
  })

  it('calls onChange with empty array when clear button clicked', async () => {
    const onChange = vi.fn()
    render(
      <SelectComposite
        options={options}
        mode="multiple"
        allowClear
        value={['apple', 'banana']}
        onChange={onChange}
      />,
    )
    const clearSpan = document.querySelector('[data-slot="select-clear"]') as HTMLElement
    await userEvent.click(clearSpan)
    expect(onChange).toHaveBeenCalledWith([])
  })

  it('shows selected count in trigger', () => {
    render(
      <SelectComposite
        options={options}
        mode="multiple"
        value={['apple', 'banana']}
        onChange={() => {}}
      />,
    )
    expect(screen.getByText('2 selected')).toBeInTheDocument()
  })
})

// ---------------------------------------------------------------------------
// showSearch (Popover-based)
// ---------------------------------------------------------------------------
describe('SelectComposite — showSearch', () => {
  it('renders search input when dropdown opens', async () => {
    render(<SelectComposite options={options} showSearch />)
    const trigger = document.querySelector('[data-slot="select-trigger"]') as HTMLButtonElement
    await userEvent.click(trigger)
    await waitFor(() => {
      expect(document.querySelector('[data-slot="select-search"]')).toBeInTheDocument()
    })
  })

  it('filters options by search query', async () => {
    render(<SelectComposite options={options} showSearch />)
    const trigger = document.querySelector('[data-slot="select-trigger"]') as HTMLButtonElement
    await userEvent.click(trigger)
    const searchInput = await waitFor(() => {
      const el = document.querySelector('[data-slot="select-search"]') as HTMLInputElement
      expect(el).toBeInTheDocument()
      return el
    })
    await userEvent.type(searchInput, 'ban')
    expect(screen.getByText('Banana')).toBeInTheDocument()
    expect(screen.queryByText('Apple')).not.toBeInTheDocument()
  })

  it('calls onChange when single option selected via search dropdown', async () => {
    const onChange = vi.fn()
    render(<SelectComposite options={options} showSearch onChange={onChange} />)
    const trigger = document.querySelector('[data-slot="select-trigger"]') as HTMLButtonElement
    await userEvent.click(trigger)
    await waitFor(() => screen.getByText('Banana'))
    await userEvent.click(screen.getByText('Banana'))
    expect(onChange).toHaveBeenCalledWith('banana')
  })
})
