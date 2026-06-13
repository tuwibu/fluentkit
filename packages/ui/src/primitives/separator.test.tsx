import { render, screen } from '@testing-library/react'
import { Separator } from './separator'

describe('Separator', () => {
  it('renders with default horizontal orientation', () => {
    render(<Separator />)
    const el = document.querySelector('[data-slot="separator"]')
    expect(el).toBeInTheDocument()
    expect(el).toHaveAttribute('data-orientation', 'horizontal')
  })

  it('renders with vertical orientation', () => {
    render(<Separator orientation="vertical" />)
    const el = document.querySelector('[data-slot="separator"]')
    expect(el).toHaveAttribute('data-orientation', 'vertical')
  })

  it('passes className through', () => {
    render(<Separator className="my-sep" />)
    const el = document.querySelector('[data-slot="separator"]')
    expect(el).toHaveClass('my-sep')
  })

  it('is decorative by default (no role)', () => {
    render(<Separator />)
    // decorative=true → radix omits role="separator"
    expect(screen.queryByRole('separator')).not.toBeInTheDocument()
  })

  it('has role separator when decorative=false', () => {
    render(<Separator decorative={false} />)
    expect(screen.getByRole('separator')).toBeInTheDocument()
  })
})
