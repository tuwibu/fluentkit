import { render, screen } from '@testing-library/react'
import { Label } from './label'

describe('Label', () => {
  it('renders children', () => {
    render(<Label>Email</Label>)
    expect(screen.getByText('Email')).toBeInTheDocument()
  })

  it('passes className through', () => {
    render(<Label className="custom-cls">Name</Label>)
    expect(screen.getByText('Name')).toHaveClass('custom-cls')
  })

  it('has data-slot attribute', () => {
    render(<Label>Field</Label>)
    expect(screen.getByText('Field')).toHaveAttribute('data-slot', 'label')
  })

  it('associates with input via htmlFor', () => {
    render(
      <>
        <Label htmlFor="email-input">Email</Label>
        <input id="email-input" />
      </>,
    )
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
  })
})
