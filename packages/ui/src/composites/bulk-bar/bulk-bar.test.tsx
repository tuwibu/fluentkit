import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Trash2, Pencil } from 'lucide-react'
import { BulkBar } from './bulk-bar'
import type { BulkAction } from './bulk-bar.types'

const baseActions: BulkAction[] = [
  { key: 'edit', label: 'Edit', icon: <Pencil size={12} />, onClick: vi.fn() },
  { key: 'delete', label: 'Delete', icon: <Trash2 size={13} />, danger: true, onClick: vi.fn() },
]

describe('BulkBar', () => {
  it('renders toolbar when count > 0', () => {
    render(<BulkBar count={3} actions={baseActions} onClose={vi.fn()} />)
    expect(screen.getByRole('toolbar')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('selected')).toBeInTheDocument()
  })

  it('is visible (no pointer-events-none) when count > 0', () => {
    render(<BulkBar count={2} actions={baseActions} onClose={vi.fn()} />)
    const toolbar = screen.getByRole('toolbar')
    expect(toolbar.className).toContain('opacity-100')
    expect(toolbar.className).not.toContain('pointer-events-none')
  })

  it('is hidden (opacity-0 pointer-events-none) when count = 0', () => {
    render(<BulkBar count={0} actions={baseActions} onClose={vi.fn()} />)
    const toolbar = screen.getByRole('toolbar')
    expect(toolbar.className).toContain('opacity-0')
    expect(toolbar.className).toContain('pointer-events-none')
  })

  it('renders action buttons', () => {
    render(<BulkBar count={1} actions={baseActions} onClose={vi.fn()} />)
    expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument()
  })

  it('calls onClick when action button is clicked', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    const actions: BulkAction[] = [{ key: 'edit', label: 'Edit', onClick }]
    render(<BulkBar count={1} actions={actions} onClose={vi.fn()} />)
    await user.click(screen.getByRole('button', { name: /edit/i }))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<BulkBar count={1} actions={baseActions} onClose={onClose} />)
    await user.click(screen.getByRole('button', { name: /clear selection/i }))
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('disables action button when disabled=true', () => {
    const actions: BulkAction[] = [
      { key: 'edit', label: 'Edit', disabled: true, onClick: vi.fn() },
    ]
    render(<BulkBar count={1} actions={actions} onClose={vi.fn()} />)
    expect(screen.getByRole('button', { name: /edit/i })).toBeDisabled()
  })

  it('disables action button and shows spinner when loading=true', () => {
    const actions: BulkAction[] = [
      { key: 'delete', label: 'Delete', loading: true, onClick: vi.fn() },
    ]
    render(<BulkBar count={1} actions={actions} onClose={vi.fn()} />)
    const btn = screen.getByRole('button', { name: /delete/i })
    expect(btn).toBeDisabled()
    expect(btn.querySelector('.animate-spin')).toBeInTheDocument()
  })

  it('renders extra slot', () => {
    render(
      <BulkBar count={1} onClose={vi.fn()} extra={<span data-testid="extra">Extra</span>} />,
    )
    expect(screen.getByTestId('extra')).toBeInTheDocument()
  })
})
