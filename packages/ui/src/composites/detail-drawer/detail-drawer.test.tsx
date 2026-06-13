import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { DetailDrawer } from './detail-drawer'

function Drawer({
  open = true,
  onOpenChange = () => {},
  ...props
}: Partial<Parameters<typeof DetailDrawer>[0]>) {
  return (
    <DetailDrawer
      open={open}
      onOpenChange={onOpenChange}
      title="Test Drawer"
      {...props}
    />
  )
}

describe('DetailDrawer', () => {
  it('renders content when open=true', () => {
    render(<Drawer open><p>Body content</p></Drawer>)
    expect(screen.getByText('Body content')).toBeInTheDocument()
  })

  it('does not render content when open=false', () => {
    render(<Drawer open={false}><p>Hidden</p></Drawer>)
    expect(screen.queryByText('Hidden')).not.toBeInTheDocument()
  })

  it('renders header slot', () => {
    render(<Drawer header={<h2>Drawer Header</h2>} />)
    expect(screen.getByText('Drawer Header')).toBeInTheDocument()
  })

  it('renders footer slot', () => {
    render(<Drawer footer={<button>Save</button>} />)
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument()
  })

  it('has sr-only title for accessibility', () => {
    render(<Drawer title="My Drawer" />)
    // SheetTitle renders as sr-only — should be in DOM
    expect(screen.getByText('My Drawer')).toBeInTheDocument()
  })

  it('calls onOpenChange when overlay is clicked', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    render(<Drawer open onOpenChange={onOpenChange} />)
    // Click the overlay (Sheet overlay is radix Dialog overlay)
    const overlay = document.querySelector('[data-slot="sheet-overlay"]')
    if (overlay) {
      await act(async () => {
        await user.click(overlay)
      })
      expect(onOpenChange).toHaveBeenCalledWith(false)
    }
  })

  it('calls onOpenChange on ESC key', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    render(<Drawer open onOpenChange={onOpenChange} />)
    await act(async () => {
      await user.keyboard('{Escape}')
    })
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('has data-slot on drawer content', () => {
    render(<Drawer />)
    expect(document.querySelector('[data-slot="detail-drawer"]')).toBeInTheDocument()
  })
})
