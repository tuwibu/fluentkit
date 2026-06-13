import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Tag } from './tag'

describe('Tag', () => {
  it('renders children', () => {
    render(<Tag>Frontend</Tag>)
    expect(screen.getByText('Frontend')).toBeInTheDocument()
  })

  it('passes className through', () => {
    render(<Tag className="custom-tag">Dev</Tag>)
    expect(screen.getByText('Dev')).toHaveClass('custom-tag')
  })

  it('applies variant class', () => {
    render(<Tag variant="success">Done</Tag>)
    const el = screen.getByText('Done')
    expect(el.className).toMatch(/emerald/)
  })

  it('shows bullet dot when bullet=true', () => {
    render(<Tag bullet>Bullet</Tag>)
    // bullet span is aria-hidden
    const bullets = document.querySelectorAll('[aria-hidden="true"]')
    expect(bullets.length).toBeGreaterThan(0)
  })

  it('shows remove button and calls onRemove', async () => {
    const onRemove = vi.fn()
    render(<Tag onRemove={onRemove}>React</Tag>)
    const btn = screen.getByRole('button', { name: 'Remove tag' })
    await userEvent.click(btn)
    expect(onRemove).toHaveBeenCalledTimes(1)
  })

  it('applies color-mix style when color prop set', () => {
    render(<Tag color="#ff0000">Red</Tag>)
    const el = screen.getByText('Red')
    expect(el).toHaveStyle({ color: '#ff0000' })
  })
})
