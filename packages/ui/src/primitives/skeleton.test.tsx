import { render, screen } from '@testing-library/react'
import { Skeleton } from './skeleton'

describe('Skeleton', () => {
  it('renders with role status', () => {
    render(<Skeleton />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('has aria-busy=true', () => {
    render(<Skeleton />)
    expect(screen.getByRole('status')).toHaveAttribute('aria-busy', 'true')
  })

  it('has data-slot attribute', () => {
    render(<Skeleton />)
    expect(screen.getByRole('status')).toHaveAttribute('data-slot', 'skeleton')
  })

  it('passes className through', () => {
    render(<Skeleton className="w-32 h-4" />)
    expect(screen.getByRole('status')).toHaveClass('w-32', 'h-4')
  })

  it('passes aria-label through', () => {
    render(<Skeleton aria-label="Loading content" />)
    expect(screen.getByRole('status', { name: 'Loading content' })).toBeInTheDocument()
  })
})
