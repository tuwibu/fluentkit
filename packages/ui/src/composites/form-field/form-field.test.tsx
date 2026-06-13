/**
 * FormField core tests — ZERO react-hook-form imports (proves core independence).
 * Tests verify real ARIA wiring on native controls (not data-aria-* workarounds).
 */
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { FormField } from './form-field'
import { useFormField } from './form-field-context'

describe('FormField — core (no RHF dependency)', () => {
  it('renders wrapper with data-slot', () => {
    render(<FormField />)
    expect(document.querySelector('[data-slot="form-field"]')).toBeInTheDocument()
  })

  it('renders label via Label primitive', () => {
    render(<FormField label="Username" htmlFor="usr" />)
    const label = screen.getByText('Username')
    expect(label.tagName.toLowerCase()).toBe('label')
    expect(label).toHaveAttribute('for', 'usr')
  })

  it('label htmlFor links to control id via cloneElement', () => {
    render(
      <FormField label="Email" htmlFor="em">
        <input id="em" type="email" />
      </FormField>,
    )
    // getByLabelText works only when label[for] === input[id]
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
  })

  it('renders required asterisk with aria-hidden when required=true', () => {
    render(<FormField label="Name" required />)
    const asterisk = document.querySelector('[data-slot="form-field-required"]')
    expect(asterisk).toBeInTheDocument()
    expect(asterisk).toHaveAttribute('aria-hidden', 'true')
  })

  it('M1 — required asterisk does NOT pollute accessible label name', () => {
    render(
      <FormField label="Email" htmlFor="email-req" required>
        <input id="email-req" type="email" />
      </FormField>,
    )
    // getByLabelText(/email/i) must work — asterisk is aria-hidden, not in accessible name
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
  })

  it('does NOT render required asterisk when required=false', () => {
    render(<FormField label="Name" required={false} />)
    expect(document.querySelector('[data-slot="form-field-required"]')).not.toBeInTheDocument()
  })

  it('renders error with role=alert and id', () => {
    render(<FormField error="Required field" />)
    const err = screen.getByRole('alert')
    expect(err).toHaveTextContent('Required field')
    expect(err).toHaveAttribute('data-slot', 'form-field-error')
    expect(err.id).toBeTruthy()
  })

  it('renders description with id', () => {
    render(<FormField description="Enter your name" />)
    const desc = screen.getByText('Enter your name')
    expect(desc).toBeInTheDocument()
    expect(desc.id).toBeTruthy()
  })

  it('hides description when error is present (error takes priority)', () => {
    render(<FormField error="Bad input" description="Some helper" />)
    expect(screen.getByRole('alert')).toHaveTextContent('Bad input')
    expect(screen.queryByText('Some helper')).not.toBeInTheDocument()
  })

  it('renders children inside control slot', () => {
    render(
      <FormField label="Email" htmlFor="em">
        <input id="em" type="email" />
      </FormField>,
    )
    expect(document.querySelector('[data-slot="form-field-control"] input')).toBeInTheDocument()
  })

  // ── H1: aria-invalid injected onto real control ──────────────────────────

  it('H1 — cloneElement injects aria-invalid=true onto native control when error present', () => {
    render(
      <FormField error="oops" htmlFor="ctrl">
        <input id="ctrl" type="text" />
      </FormField>,
    )
    const input = document.querySelector('input') as HTMLInputElement
    expect(input).toHaveAttribute('aria-invalid', 'true')
  })

  it('H1 — control has no aria-invalid when no error', () => {
    render(
      <FormField htmlFor="ctrl2">
        <input id="ctrl2" type="text" />
      </FormField>,
    )
    const input = document.querySelector('input') as HTMLInputElement
    expect(input).not.toHaveAttribute('aria-invalid')
  })

  it('H1 — aria-describedby on control points to error element id', () => {
    render(
      <FormField error="oops" htmlFor="ctrl3">
        <input id="ctrl3" type="text" />
      </FormField>,
    )
    const input = document.querySelector('input') as HTMLInputElement
    const errorEl = screen.getByRole('alert')
    const describedBy = input.getAttribute('aria-describedby')
    expect(describedBy).toContain(errorEl.id)
  })

  it('H1 — aria-describedby on control points to description element id', () => {
    render(
      <FormField description="helper text" htmlFor="ctrl4">
        <input id="ctrl4" type="text" />
      </FormField>,
    )
    const input = document.querySelector('input') as HTMLInputElement
    const descEl = document.querySelector('[data-slot="form-field-description"]') as HTMLElement
    const describedBy = input.getAttribute('aria-describedby')
    expect(describedBy).toContain(descEl.id)
  })

  it('H1 — child explicit aria-invalid is preserved (child wins)', () => {
    render(
      <FormField error="oops" htmlFor="ctrl5">
        <input id="ctrl5" aria-invalid={false} type="text" />
      </FormField>,
    )
    const input = document.querySelector('input') as HTMLInputElement
    // Child explicitly passed false — cloneElement must not override
    expect(input.getAttribute('aria-invalid')).toBe('false')
  })

  // ── useFormField hook ─────────────────────────────────────────────────────

  it('useFormField returns context with invalid=true when error present', () => {
    let capturedCtx: ReturnType<typeof useFormField> | null = null

    function Probe() {
      capturedCtx = useFormField()
      return null
    }

    render(
      <FormField error="bad" htmlFor="probe">
        <Probe />
      </FormField>,
    )
    expect(capturedCtx).not.toBeNull()
    expect(capturedCtx!.invalid).toBe(true)
    expect(capturedCtx!.controlId).toBe('probe')
  })

  it('useFormField throws when used outside FormField', () => {
    function Probe() {
      useFormField()
      return null
    }
    // Should throw — wrap in error boundary guard
    expect(() => render(<Probe />)).toThrow('useFormField must be used inside a <FormField>')
  })

  it('renders ReactNode as label', () => {
    render(<FormField label={<strong data-testid="lbl">Bold</strong>} />)
    expect(screen.getByTestId('lbl')).toBeInTheDocument()
  })

  it('renders ReactNode error', () => {
    render(<FormField error={<span data-testid="e">Custom</span>} />)
    expect(screen.getByTestId('e')).toBeInTheDocument()
  })
})
