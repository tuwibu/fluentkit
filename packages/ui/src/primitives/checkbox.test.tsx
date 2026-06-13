import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Checkbox } from './checkbox'

describe('Checkbox', () => {
  it('renders a checkbox', () => {
    render(<Checkbox aria-label="Accept" />)
    expect(screen.getByRole('checkbox', { name: 'Accept' })).toBeInTheDocument()
  })

  it('calls onCheckedChange when clicked', async () => {
    const onCheckedChange = vi.fn()
    render(<Checkbox aria-label="Toggle" onCheckedChange={onCheckedChange} />)
    await userEvent.click(screen.getByRole('checkbox'))
    expect(onCheckedChange).toHaveBeenCalledWith(true)
  })

  it('reflects checked state', () => {
    render(<Checkbox aria-label="Checked" checked />)
    expect(screen.getByRole('checkbox')).toHaveAttribute('data-state', 'checked')
  })

  it('reflects unchecked state', () => {
    render(<Checkbox aria-label="Unchecked" checked={false} />)
    expect(screen.getByRole('checkbox')).toHaveAttribute('data-state', 'unchecked')
  })

  it('toggles with keyboard Space', async () => {
    const onCheckedChange = vi.fn()
    render(<Checkbox aria-label="Space" onCheckedChange={onCheckedChange} />)
    const cb = screen.getByRole('checkbox')
    cb.focus()
    await userEvent.keyboard(' ')
    expect(onCheckedChange).toHaveBeenCalledWith(true)
  })

  it('disabled does not fire onCheckedChange', async () => {
    const onCheckedChange = vi.fn()
    render(<Checkbox aria-label="Disabled" disabled onCheckedChange={onCheckedChange} />)
    await userEvent.click(screen.getByRole('checkbox'))
    expect(onCheckedChange).not.toHaveBeenCalled()
  })
})
