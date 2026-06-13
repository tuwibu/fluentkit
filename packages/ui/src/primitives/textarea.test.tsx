import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as React from 'react'
import { Textarea } from './textarea'

describe('Textarea', () => {
  it('renders textarea element', () => {
    render(<Textarea placeholder="Write here" />)
    expect(screen.getByPlaceholderText('Write here')).toBeInTheDocument()
  })

  it('controlled value + onChange', async () => {
    const onChange = vi.fn()
    render(<Textarea value="initial" onChange={onChange} />)
    const ta = screen.getByRole('textbox')
    expect(ta).toHaveValue('initial')
    await userEvent.type(ta, 'x')
    expect(onChange).toHaveBeenCalled()
  })

  it('disabled prevents interaction', () => {
    render(<Textarea disabled placeholder="Locked" />)
    expect(screen.getByPlaceholderText('Locked')).toBeDisabled()
  })

  it('forwards ref', () => {
    const ref = React.createRef<HTMLTextAreaElement>()
    render(<Textarea ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement)
  })

  it('passes aria-invalid through', () => {
    render(<Textarea aria-invalid="true" />)
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true')
  })

  it('passes className through', () => {
    render(<Textarea className="custom-ta" />)
    expect(document.querySelector('[data-slot="textarea"]')).toHaveClass('custom-ta')
  })
})
