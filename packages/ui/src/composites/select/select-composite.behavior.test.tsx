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

const ICON_NODE = <span data-testid="icon-globe">globe</span>

const optionsWithIcon: SelectOption[] = [
  { label: 'Globe', value: 'globe', icon: ICON_NODE },
  { label: 'Star', value: 'star' },
]

const optionsWithColor: SelectOption[] = [
  { label: 'Red', value: 'red', color: '#ef4444' },
  { label: 'Plain', value: 'plain' },
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
// icon + color in dropdown rows (Popover-based — fully testable)
// ---------------------------------------------------------------------------
describe('SelectComposite — icon + color rendering in dropdown rows', () => {
  it('icon appears inside dropdown row when option has icon', async () => {
    render(<SelectComposite options={optionsWithIcon} mode="multiple" />)
    const trigger = document.querySelector('[data-slot="select-trigger"]') as HTMLButtonElement
    await userEvent.click(trigger)
    await waitFor(() => {
      expect(screen.getByTestId('icon-globe')).toBeInTheDocument()
    })
  })

  it('plain option (no icon) still renders text in row', async () => {
    render(<SelectComposite options={optionsWithIcon} mode="multiple" />)
    const trigger = document.querySelector('[data-slot="select-trigger"]') as HTMLButtonElement
    await userEvent.click(trigger)
    await waitFor(() => {
      expect(screen.getByText('Star')).toBeInTheDocument()
    })
  })

  it('colored option renders label text with color-mix style in row', async () => {
    render(<SelectComposite options={optionsWithColor} mode="multiple" />)
    const trigger = document.querySelector('[data-slot="select-trigger"]') as HTMLButtonElement
    await userEvent.click(trigger)
    await waitFor(() => {
      // Tag renders a <span> containing the label text
      const redLabel = screen.getByText('Red')
      // Tag wraps label — parent span should have inline style from color-mix
      const tagSpan = redLabel.closest('span[style]')
      expect(tagSpan).not.toBeNull()
    })
  })

  it('plain option (no color) renders text without colored span wrapper', async () => {
    render(<SelectComposite options={optionsWithColor} mode="multiple" />)
    const trigger = document.querySelector('[data-slot="select-trigger"]') as HTMLButtonElement
    await userEvent.click(trigger)
    await waitFor(() => {
      const plainLabel = screen.getByText('Plain')
      // Plain option should NOT be wrapped in a span with inline color style
      const tagSpan = plainLabel.closest('span[style]')
      expect(tagSpan).toBeNull()
    })
  })
})

// ---------------------------------------------------------------------------
// trigger chip for single+search when selected option has icon/color
// ---------------------------------------------------------------------------
describe('SelectComposite — trigger chip (showSearch single)', () => {
  it('shows colored chip (Tag span with style) in trigger after selecting colored option', async () => {
    render(<SelectComposite options={optionsWithColor} showSearch value="red" onChange={() => {}} />)
    // Tag renders a span with inline color-mix style
    const triggerValue = document.querySelector('[data-slot="select-value"]')
    const tagSpan = triggerValue?.querySelector('span[style]')
    expect(tagSpan).not.toBeNull()
  })

  it('shows icon in trigger after selecting option with icon (single+search)', async () => {
    render(<SelectComposite options={optionsWithIcon} showSearch value="globe" onChange={() => {}} />)
    const triggerValue = document.querySelector('[data-slot="select-value"]')
    expect(triggerValue?.querySelector('[data-testid="icon-globe"]')).toBeInTheDocument()
  })

  it('shows plain text in trigger when selected option has no meta', async () => {
    render(<SelectComposite options={optionsWithIcon} showSearch value="star" onChange={() => {}} />)
    const triggerValue = document.querySelector('[data-slot="select-value"]')
    expect(triggerValue?.textContent).toContain('Star')
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
