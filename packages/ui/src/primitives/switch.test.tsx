import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Switch } from './switch'

describe('Switch', () => {
  it('renders a switch', () => {
    render(<Switch aria-label="Toggle dark mode" />)
    expect(screen.getByRole('switch', { name: 'Toggle dark mode' })).toBeInTheDocument()
  })

  it('calls onCheckedChange when clicked', async () => {
    const onCheckedChange = vi.fn()
    render(<Switch aria-label="Enable" onCheckedChange={onCheckedChange} />)
    await userEvent.click(screen.getByRole('switch'))
    expect(onCheckedChange).toHaveBeenCalledWith(true)
  })

  it('reflects checked state', () => {
    render(<Switch aria-label="On" checked />)
    expect(screen.getByRole('switch')).toHaveAttribute('data-state', 'checked')
  })

  it('reflects unchecked state', () => {
    render(<Switch aria-label="Off" checked={false} />)
    expect(screen.getByRole('switch')).toHaveAttribute('data-state', 'unchecked')
  })

  it('toggles with keyboard Space', async () => {
    const onCheckedChange = vi.fn()
    render(<Switch aria-label="Space toggle" onCheckedChange={onCheckedChange} />)
    const sw = screen.getByRole('switch')
    sw.focus()
    await userEvent.keyboard(' ')
    expect(onCheckedChange).toHaveBeenCalledWith(true)
  })

  it('disabled does not fire onCheckedChange', async () => {
    const onCheckedChange = vi.fn()
    render(<Switch aria-label="Disabled" disabled onCheckedChange={onCheckedChange} />)
    await userEvent.click(screen.getByRole('switch'))
    expect(onCheckedChange).not.toHaveBeenCalled()
  })
})
