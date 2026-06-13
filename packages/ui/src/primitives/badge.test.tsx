import { render, screen } from '@testing-library/react'
import { Badge } from './badge'

describe('Badge', () => {
  it('renders children', () => {
    render(<Badge>New</Badge>)
    expect(screen.getByText('New')).toBeInTheDocument()
  })

  it('has data-slot attribute', () => {
    render(<Badge>Tag</Badge>)
    expect(screen.getByText('Tag')).toHaveAttribute('data-slot', 'badge')
  })

  it('passes className through', () => {
    render(<Badge className="custom-badge">Label</Badge>)
    expect(screen.getByText('Label')).toHaveClass('custom-badge')
  })

  it('applies variant class for destructive', () => {
    render(<Badge variant="destructive">Error</Badge>)
    const el = screen.getByText('Error')
    expect(el.className).toMatch(/destructive/)
  })

  it('applies variant class for outline (no background, uses text-foreground)', () => {
    render(<Badge variant="outline">Outline</Badge>)
    const el = screen.getByText('Outline')
    // outline variant has no bg-* class — verified by source badgeVariants definition
    expect(el.className).toMatch(/text-foreground/)
  })

  it('renders as child element when asChild', () => {
    render(
      <Badge asChild>
        <a href="#">Link Badge</a>
      </Badge>,
    )
    expect(screen.getByRole('link', { name: 'Link Badge' })).toBeInTheDocument()
  })
})
