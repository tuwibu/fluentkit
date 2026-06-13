/**
 * Modal behavior tests — Phase 5 TDD + Phase 5b radix Dialog fixes
 * Tests for behaviors not covered by Phase 4 contract tests.
 * ESC / overlay / closable tests verify radix Dialog native behaviors.
 */
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Modal, modal } from './modal'

describe('Modal — onOk / onCancel callbacks', () => {
  it('calls onOk when OK button clicked', async () => {
    const onOk = vi.fn()
    render(<Modal open={true} onOk={onOk} />)
    await userEvent.click(screen.getByText('OK'))
    expect(onOk).toHaveBeenCalledTimes(1)
  })

  it('calls onCancel when Cancel button clicked', async () => {
    const onCancel = vi.fn()
    render(<Modal open={true} onCancel={onCancel} />)
    await userEvent.click(screen.getByText('Cancel'))
    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it('calls onCancel when close icon clicked', async () => {
    const onCancel = vi.fn()
    render(<Modal open={true} onCancel={onCancel} />)
    await userEvent.click(screen.getByLabelText('Close'))
    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it('does NOT call onOk when confirmLoading=true', async () => {
    const onOk = vi.fn()
    render(<Modal open={true} onOk={onOk} confirmLoading={true} />)
    const okBtn = document.querySelector('[data-slot="modal-ok"]') as HTMLButtonElement
    await userEvent.click(okBtn)
    expect(onOk).not.toHaveBeenCalled()
  })
})

describe('Modal — destroyOnClose', () => {
  it('mounts children when open=true (destroyOnClose=true)', () => {
    render(<Modal open={true} destroyOnClose><span data-testid="child">content</span></Modal>)
    expect(screen.getByTestId('child')).toBeInTheDocument()
  })

  it('does NOT render children when open=false and destroyOnClose=true', () => {
    render(<Modal open={false} destroyOnClose><span data-testid="child">content</span></Modal>)
    expect(screen.queryByTestId('child')).not.toBeInTheDocument()
  })

  it('does not render children when open=false (default behavior)', () => {
    render(<Modal open={false}><span data-testid="child">content</span></Modal>)
    expect(screen.queryByTestId('child')).not.toBeInTheDocument()
  })
})

describe('Modal — ESC key / overlay / closable (radix Dialog behaviors)', () => {
  it('calls onCancel when ESC is pressed (closable=true default)', async () => {
    const onCancel = vi.fn()
    render(<Modal open={true} onCancel={onCancel} />)
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(onCancel).toHaveBeenCalledTimes(1))
  })

  it('does NOT call onCancel when ESC pressed and closable=false', async () => {
    const onCancel = vi.fn()
    render(<Modal open={true} closable={false} onCancel={onCancel} />)
    await userEvent.keyboard('{Escape}')
    // radix ESC is prevented when closable=false — onCancel must not fire
    expect(onCancel).not.toHaveBeenCalled()
  })
})

describe('modal.confirm() — imperative API', () => {
  // modal.confirm() uses flushSync+createRoot to render into document.body.
  // DOM query is done directly since flushSync makes render synchronous.
  // Cancel → rejects Error('cancelled'); OK → resolves undefined.

  it('resolves when OK is clicked', async () => {
    const promise = modal.confirm({ title: 'Are you sure?' })
    const title = document.querySelector('[data-slot="modal-title"]')
    expect(title?.textContent).toBe('Are you sure?')
    const okBtn = document.querySelector('[data-slot="modal-ok"]') as HTMLButtonElement
    await userEvent.click(okBtn)
    await expect(promise).resolves.toBeUndefined()
  })

  it('rejects with Error("cancelled") when Cancel is clicked', async () => {
    const promise = modal.confirm({ title: 'Delete item?' })
    // Attach catch immediately to prevent unhandled-rejection in vitest global
    const caught = promise.catch((e: Error) => e)
    const cancelBtn = document.querySelector('[data-slot="modal-cancel"]') as HTMLButtonElement
    await userEvent.click(cancelBtn)
    const err = await caught
    expect(err).toBeInstanceOf(Error)
    expect((err as Error).message).toBe('cancelled')
  })

  it('calls onOk callback and resolves when OK clicked', async () => {
    const onOk = vi.fn().mockResolvedValue(undefined)
    const promise = modal.confirm({ title: 'Confirm?', onOk })
    const okBtn = document.querySelector('[data-slot="modal-ok"]') as HTMLButtonElement
    await userEvent.click(okBtn)
    await expect(promise).resolves.toBeUndefined()
    expect(onOk).toHaveBeenCalledTimes(1)
  })

  it('renders custom okText and cancelText', async () => {
    const promise = modal.confirm({
      title: 'Custom?',
      okText: 'Yes, do it',
      cancelText: 'No way',
    })
    const caught = promise.catch((e: Error) => e)
    const okBtn = document.querySelector('[data-slot="modal-ok"]') as HTMLButtonElement
    const cancelBtn = document.querySelector('[data-slot="modal-cancel"]') as HTMLButtonElement
    expect(okBtn?.textContent).toBe('Yes, do it')
    expect(cancelBtn?.textContent).toBe('No way')
    await userEvent.click(cancelBtn)
    await caught
  })

  it('applies danger styling when okType=danger', async () => {
    const promise = modal.confirm({ title: 'Delete?', okType: 'danger' })
    const caught = promise.catch((e: Error) => e)
    const okBtn = document.querySelector('[data-slot="modal-ok"]') as HTMLButtonElement
    expect(okBtn).toHaveAttribute('data-variant', 'danger')
    const cancelBtn = document.querySelector('[data-slot="modal-cancel"]') as HTMLButtonElement
    await userEvent.click(cancelBtn)
    await caught
  })

  it('H3 — cancel rejects exactly once (idempotent, no double-reject)', async () => {
    // radix onOpenChange(false) fires after cancel click — guard must stop double-invoke
    const rejectSpy = vi.fn()
    const promise = modal.confirm({ title: 'Idempotent?' })
    promise.catch(rejectSpy)
    const cancelBtn = document.querySelector('[data-slot="modal-cancel"]') as HTMLButtonElement
    await userEvent.click(cancelBtn)
    // Wait a tick for any cascading async events (radix onOpenChange)
    await new Promise((r) => setTimeout(r, 50))
    expect(rejectSpy).toHaveBeenCalledTimes(1)
  })
})
