import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { InputComposite } from './input-composite'

describe('InputComposite — contract tests', () => {
  it('renders without crashing', () => {
    render(<InputComposite />)
    expect(document.querySelector('[data-slot="input"]')).toBeInTheDocument()
  })

  it('renders controlled value', () => {
    render(<InputComposite value="hello" onChange={() => {}} />)
    const input = document.querySelector('[data-slot="input"]') as HTMLInputElement
    expect(input.value).toBe('hello')
  })

  it('renders placeholder', () => {
    render(<InputComposite placeholder="Enter text" />)
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument()
  })

  it('renders prefix content', () => {
    render(<InputComposite prefix="http://" />)
    expect(screen.getByText('http://')).toBeInTheDocument()
  })

  it('renders suffix content', () => {
    render(<InputComposite suffix=".com" />)
    expect(screen.getByText('.com')).toBeInTheDocument()
  })

  it('renders addonBefore', () => {
    render(<InputComposite addonBefore="https://" />)
    expect(screen.getByText('https://')).toBeInTheDocument()
  })

  it('renders addonAfter', () => {
    render(<InputComposite addonAfter=".io" />)
    expect(screen.getByText('.io')).toBeInTheDocument()
  })

  it('is disabled when disabled=true', () => {
    render(<InputComposite disabled={true} />)
    const input = document.querySelector('[data-slot="input"]') as HTMLInputElement
    expect(input).toBeDisabled()
  })

  it('sets type attribute', () => {
    render(<InputComposite type="password" />)
    const input = document.querySelector('[data-slot="input"]') as HTMLInputElement
    expect(input.type).toBe('password')
  })

  it('sets aria-invalid when status=error', () => {
    render(<InputComposite status="error" />)
    const input = document.querySelector('[data-slot="input"]') as HTMLInputElement
    expect(input).toHaveAttribute('aria-invalid', 'true')
  })

  it('does not set aria-invalid when status=warning', () => {
    render(<InputComposite status="warning" />)
    const input = document.querySelector('[data-slot="input"]') as HTMLInputElement
    expect(input).not.toHaveAttribute('aria-invalid')
  })

  it('forwards id to native input for a11y label association', () => {
    render(<InputComposite id="email" value="" onChange={() => {}} />)
    const input = document.querySelector('[data-slot="input"]') as HTMLInputElement
    expect(input).toHaveAttribute('id', 'email')
  })
})
