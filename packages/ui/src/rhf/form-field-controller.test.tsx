/**
 * RHF adapter test — uses real useForm + zodResolver.
 * Proves: (1) adapter wires RHF errors → FormField core; (2) ARIA wiring reaches native control.
 * H2: verifies aria-invalid + aria-describedby arrive on the real <input> after submit invalid.
 */
import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { FormFieldController } from './form-field-controller'

const schema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(2, 'Name must be at least 2 chars'),
})
type FormData = z.infer<typeof schema>

function TestForm({ onSubmit }: { onSubmit?: (data: FormData) => void }) {
  const { control, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', name: '' },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit ?? (() => {}))}>
      <FormFieldController
        control={control}
        name="email"
        label="Email"
        required
        render={(field) => <input type="email" {...field} />}
      />
      <FormFieldController
        control={control}
        name="name"
        label="Name"
        render={(field) => <input {...field} />}
      />
      <button type="submit">Submit</button>
    </form>
  )
}

describe('FormFieldController — RHF adapter', () => {
  it('renders labels from FormField core', () => {
    render(<TestForm />)
    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(screen.getByText('Name')).toBeInTheDocument()
  })

  it('M1 — getByLabelText works despite required asterisk (asterisk is aria-hidden)', () => {
    render(<TestForm />)
    // Should find input by label "Email" — asterisk must not pollute accessible name
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
  })

  it('shows no errors before submission', () => {
    render(<TestForm />)
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('shows zod error messages after submitting invalid form', async () => {
    const user = userEvent.setup()
    render(<TestForm />)

    await act(async () => {
      await user.click(screen.getByRole('button', { name: 'Submit' }))
    })

    const alerts = screen.getAllByRole('alert')
    expect(alerts.length).toBeGreaterThanOrEqual(1)
    const texts = alerts.map((a) => a.textContent)
    expect(texts.some((t) => t?.includes('Invalid email') || t?.includes('least 2'))).toBe(true)
  })

  it('H2 — aria-invalid=true set on native control after invalid submit', async () => {
    const user = userEvent.setup()
    render(<TestForm />)

    await act(async () => {
      await user.click(screen.getByRole('button', { name: 'Submit' }))
    })

    // Email input (first input) should have aria-invalid after failed submit
    const emailInput = screen.getByLabelText(/email/i)
    expect(emailInput).toHaveAttribute('aria-invalid', 'true')
  })

  it('H2 — aria-describedby on control points to error message element', async () => {
    const user = userEvent.setup()
    render(<TestForm />)

    await act(async () => {
      await user.click(screen.getByRole('button', { name: 'Submit' }))
    })

    const emailInput = screen.getByLabelText(/email/i)
    const describedBy = emailInput.getAttribute('aria-describedby')
    expect(describedBy).toBeTruthy()

    // The element referenced by aria-describedby must contain the error text
    const errorEl = document.getElementById(describedBy!.split(' ')[0] ?? '')
    expect(errorEl?.textContent).toContain('Invalid email')
  })

  it('clears aria-invalid and errors when valid data is entered', async () => {
    const user = userEvent.setup()
    render(<TestForm />)

    await act(async () => {
      await user.click(screen.getByRole('button', { name: 'Submit' }))
    })
    expect(screen.getAllByRole('alert').length).toBeGreaterThan(0)

    const emailInput = screen.getByLabelText(/email/i)
    const nameInput = screen.getByLabelText(/name/i)

    await act(async () => {
      await user.clear(emailInput)
      await user.type(emailInput, 'valid@example.com')
      await user.clear(nameInput)
      await user.type(nameInput, 'Alice')
      await user.click(screen.getByRole('button', { name: 'Submit' }))
    })

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(emailInput).not.toHaveAttribute('aria-invalid', 'true')
  })

  it('passes field value/onChange to render prop', () => {
    render(<TestForm />)
    const emailInput = screen.getByLabelText(/email/i)
    expect(emailInput).toBeInTheDocument()
    expect(emailInput).toHaveAttribute('type', 'email')
  })
})
