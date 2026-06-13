import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Placeholder } from '../index'

describe('Placeholder smoke test', () => {
  it('renders children in the document', () => {
    render(<Placeholder>hello fluent-kit</Placeholder>)
    expect(screen.getByText('hello fluent-kit')).toBeInTheDocument()
  })

  it('has data-slot attribute', () => {
    render(<Placeholder>slot test</Placeholder>)
    const el = screen.getByText('slot test')
    expect(el).toHaveAttribute('data-slot', 'placeholder')
  })
})
