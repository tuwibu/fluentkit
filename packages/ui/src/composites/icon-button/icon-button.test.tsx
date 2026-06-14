import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Copy, Trash2 } from 'lucide-react'
import { IconButton } from './icon-button'

describe('IconButton', () => {
  it('renders with aria-label', () => {
    render(<IconButton icon={<Copy size={16} />} aria-label="Copy" />)
    expect(screen.getByRole('button', { name: 'Copy' })).toBeInTheDocument()
  })

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn()
    render(<IconButton icon={<Copy size={16} />} aria-label="Copy" onClick={onClick} />)
    await userEvent.click(screen.getByRole('button', { name: 'Copy' }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('does not call onClick when disabled', async () => {
    const onClick = vi.fn()
    render(<IconButton icon={<Copy size={16} />} aria-label="Copy" disabled onClick={onClick} />)
    const btn = screen.getByRole('button', { name: 'Copy' })
    expect(btn).toBeDisabled()
    await userEvent.click(btn)
    expect(onClick).not.toHaveBeenCalled()
  })

  it('applies danger variant class', () => {
    render(<IconButton icon={<Trash2 size={16} />} aria-label="Delete" variant="danger" />)
    const btn = screen.getByRole('button', { name: 'Delete' })
    expect(btn.className).toMatch(/text-destructive/)
  })

  it('applies launch variant class', () => {
    render(<IconButton icon={<Copy size={16} />} aria-label="Open" variant="launch" />)
    const btn = screen.getByRole('button', { name: 'Open' })
    expect(btn.className).toMatch(/bg-primary/)
  })

  it('applies outlined variant class (control bg + border)', () => {
    render(<IconButton icon={<Copy size={16} />} aria-label="Refresh" variant="outlined" />)
    const btn = screen.getByRole('button', { name: 'Refresh' })
    expect(btn.className).toMatch(/win11-control-bg/)
    expect(btn.className).toMatch(/border/)
  })

  it('applies sm size class', () => {
    render(<IconButton icon={<Copy size={14} />} aria-label="Copy sm" size="sm" />)
    const btn = screen.getByRole('button', { name: 'Copy sm' })
    expect(btn.className).toMatch(/w-7/)
  })

  it('applies md size class by default', () => {
    render(<IconButton icon={<Copy size={16} />} aria-label="Copy md" />)
    const btn = screen.getByRole('button', { name: 'Copy md' })
    expect(btn.className).toMatch(/w-8/)
  })

  it('shows spinner and disables button when loading', () => {
    render(<IconButton icon={<Copy size={16} />} aria-label="Loading…" loading />)
    const btn = screen.getByRole('button', { name: 'Loading…' })
    expect(btn).toBeDisabled()
    // Loader2 renders an svg with animate-spin
    // svg.className is SVGAnimatedString in jsdom, use getAttribute instead
    const svg = btn.querySelector('svg')
    expect(svg).not.toBeNull()
    expect(svg!.getAttribute('class')).toMatch(/animate-spin/)
  })

  it('does not call onClick when loading', async () => {
    const onClick = vi.fn()
    render(<IconButton icon={<Copy size={16} />} aria-label="Loading…" loading onClick={onClick} />)
    await userEvent.click(screen.getByRole('button', { name: 'Loading…' }))
    expect(onClick).not.toHaveBeenCalled()
  })

  it('renders without tooltip (no wrapper)', () => {
    render(<IconButton icon={<Copy size={16} />} aria-label="Plain" />)
    // No tooltip-trigger data-slot on the button itself
    expect(screen.getByRole('button', { name: 'Plain' })).not.toHaveAttribute(
      'data-slot',
      'tooltip-trigger',
    )
  })

  it('renders with tooltip — button mounts without errors', () => {
    render(
      <IconButton
        icon={<Copy size={16} />}
        aria-label="With tooltip"
        tooltip="Copy text"
      />,
    )
    // Button should still be in the document; tooltip content hidden until hover
    expect(screen.getByRole('button', { name: 'With tooltip' })).toBeInTheDocument()
    expect(screen.queryByText('Copy text')).not.toBeInTheDocument()
  })

  it('forwards extra className', () => {
    render(
      <IconButton icon={<Copy size={16} />} aria-label="Styled" className="extra-class" />,
    )
    expect(screen.getByRole('button', { name: 'Styled' }).className).toMatch(/extra-class/)
  })
})
