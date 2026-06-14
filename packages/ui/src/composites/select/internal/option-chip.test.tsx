import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { OptionChip } from './option-chip'

describe('OptionChip', () => {
  describe('with color', () => {
    it('renders label text inside a Tag (span with color style)', () => {
      render(<OptionChip color="#7c3aed" label="VIP" />)
      expect(screen.getByText('VIP')).toBeInTheDocument()
    })

    it('applies color-mix style via Tag', () => {
      render(<OptionChip color="#7c3aed" label="VIP" />)
      const el = screen.getByText('VIP')
      // Tag renders a span with inline color style
      expect(el).toHaveStyle({ color: '#7c3aed' })
    })

    it('renders icon alongside label inside Tag', () => {
      render(<OptionChip color="#059669" icon={<span data-testid="icon" />} label="Admin" />)
      expect(screen.getByTestId('icon')).toBeInTheDocument()
      expect(screen.getByText('Admin')).toBeInTheDocument()
    })

    it('shows remove button when removable=true and calls onRemove', async () => {
      const onRemove = vi.fn()
      render(<OptionChip color="#d97706" label="Manager" removable onRemove={onRemove} />)
      const btn = screen.getByRole('button', { name: 'Remove tag' })
      await userEvent.click(btn)
      expect(onRemove).toHaveBeenCalledTimes(1)
    })

    it('does not show remove button when removable=false', () => {
      render(<OptionChip color="#d97706" label="Manager" removable={false} onRemove={vi.fn()} />)
      expect(screen.queryByRole('button', { name: 'Remove tag' })).not.toBeInTheDocument()
    })
  })

  describe('with icon, no color', () => {
    it('renders icon and label in a span', () => {
      render(<OptionChip icon={<span data-testid="icon" />} label="Guest" />)
      expect(screen.getByTestId('icon')).toBeInTheDocument()
      expect(screen.getByText('Guest')).toBeInTheDocument()
    })

    it('wraps icon+label in inline-flex span', () => {
      const { container } = render(
        <OptionChip icon={<span data-testid="icon" />} label="Guest" />,
      )
      const wrapper = container.querySelector('span.inline-flex')
      expect(wrapper).toBeInTheDocument()
    })
  })

  describe('label only', () => {
    it('renders label text with no extra wrapper element', () => {
      const { container } = render(<OptionChip label="Simple" />)
      expect(screen.getByText('Simple')).toBeInTheDocument()
      // No span or Tag wrapper — just the fragment content in the container div
      expect(container.querySelector('span')).not.toBeInTheDocument()
    })

    it('renders ReactNode label', () => {
      render(<OptionChip label={<em>Emphasized</em>} />)
      expect(screen.getByText('Emphasized').tagName).toBe('EM')
    })
  })
})
