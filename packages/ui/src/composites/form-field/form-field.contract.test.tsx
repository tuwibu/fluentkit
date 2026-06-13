import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { FormField } from './form-field'

describe('FormField — contract tests', () => {
  it('renders without crashing with no props', () => {
    render(<FormField />)
    expect(document.querySelector('[data-slot="form-field"]')).toBeInTheDocument()
  })

  it('renders label text', () => {
    render(<FormField label="Email" />)
    expect(screen.getByText('Email')).toBeInTheDocument()
  })

  it('renders htmlFor on label element', () => {
    render(<FormField label="Email" htmlFor="email-input" />)
    const label = document.querySelector('label')
    expect(label).toHaveAttribute('for', 'email-input')
  })

  it('renders required asterisk when required=true', () => {
    render(<FormField label="Email" required={true} />)
    expect(document.querySelector('[data-slot="form-field-required"]')).toBeInTheDocument()
  })

  it('does not render required asterisk when required=false', () => {
    render(<FormField label="Email" required={false} />)
    expect(document.querySelector('[data-slot="form-field-required"]')).not.toBeInTheDocument()
  })

  it('renders error message with role=alert', () => {
    render(<FormField error="This field is required" />)
    const errorEl = screen.getByRole('alert')
    expect(errorEl).toHaveTextContent('This field is required')
    expect(errorEl).toHaveAttribute('data-slot', 'form-field-error')
  })

  it('renders description when no error', () => {
    render(<FormField description="Enter your work email" />)
    expect(screen.getByText('Enter your work email')).toBeInTheDocument()
    expect(document.querySelector('[data-slot="form-field-description"]')).toBeInTheDocument()
  })

  it('hides description when error is present', () => {
    render(<FormField error="Required" description="Helper text" />)
    // error takes priority — description is hidden
    expect(screen.queryByText('Helper text')).not.toBeInTheDocument()
    expect(screen.getByRole('alert')).toHaveTextContent('Required')
  })

  it('renders children in the control slot', () => {
    render(
      <FormField label="Name">
        <input id="name-input" />
      </FormField>
    )
    expect(document.querySelector('[data-slot="form-field-control"] input')).toBeInTheDocument()
  })

  it('renders ReactNode error', () => {
    render(<FormField error={<span data-testid="err">Custom error node</span>} />)
    expect(screen.getByTestId('err')).toBeInTheDocument()
  })
})
