import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as React from 'react'
import { Input } from './input'

describe('Input', () => {
  it('renders input element', () => {
    render(<Input placeholder="Enter text" />)
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument()
  })

  it('controlled value + onChange', async () => {
    const onChange = vi.fn()
    render(<Input value="hello" onChange={onChange} />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveValue('hello')
    await userEvent.type(input, 'x')
    expect(onChange).toHaveBeenCalled()
  })

  it('disabled prevents interaction', () => {
    render(<Input disabled placeholder="No type" />)
    expect(screen.getByPlaceholderText('No type')).toBeDisabled()
  })

  it('forwards ref', () => {
    const ref = React.createRef<HTMLInputElement>()
    render(<Input ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })

  it('passes aria-invalid through', () => {
    render(<Input aria-invalid="true" />)
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true')
  })

  it('passes className through', () => {
    render(<Input className="custom-input" />)
    expect(document.querySelector('[data-slot="input"]')).toHaveClass('custom-input')
  })
})
