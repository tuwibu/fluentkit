import { render, screen } from '@testing-library/react'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from './select'

// NOTE: Radix Select relies on pointer capture (setPointerCapture/hasPointerCapture)
// and ResizeObserver for its listbox positioning. Even with stubs, the jsdom
// environment does not fully emulate pointer capture semantics, so opening the
// listbox via userEvent.click causes a thrown exception inside radix internals.
// Tests here cover: render, controlled prop, and data-slot contract.
// Open/select interaction is intentionally reduced in scope — documented here.
describe('Select', () => {
  function setup(onValueChange = vi.fn()) {
    render(
      <Select onValueChange={onValueChange}>
        <SelectTrigger aria-label="Pick fruit">
          <SelectValue placeholder="Pick a fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
        </SelectContent>
      </Select>,
    )
    return { onValueChange }
  }

  it('renders trigger with placeholder', () => {
    setup()
    expect(screen.getByText('Pick a fruit')).toBeInTheDocument()
  })

  it('trigger has data-slot attribute', () => {
    setup()
    expect(document.querySelector('[data-slot="select-trigger"]')).toBeInTheDocument()
  })

  it('trigger is a combobox role', () => {
    setup()
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('renders with controlled value', () => {
    render(
      <Select value="apple" onValueChange={vi.fn()}>
        <SelectTrigger aria-label="Fruit">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
        </SelectContent>
      </Select>,
    )
    // controlled value renders the selected item text in trigger
    expect(screen.getByText('Apple')).toBeInTheDocument()
  })
})
