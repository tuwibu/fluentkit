import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Modal, modal } from './modal'

describe('Modal — contract tests', () => {
  it('renders nothing when open=false', () => {
    render(<Modal open={false} title="Hidden" />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('renders dialog when open=true', () => {
    render(<Modal open={true} title="Test Modal" />)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('renders title', () => {
    render(<Modal open={true} title="My Title" />)
    expect(screen.getByText('My Title')).toBeInTheDocument()
  })

  it('renders children', () => {
    render(<Modal open={true}><p>Body content</p></Modal>)
    expect(screen.getByText('Body content')).toBeInTheDocument()
  })

  it('renders default Ok/Cancel buttons when footer is omitted', () => {
    render(<Modal open={true} />)
    expect(screen.getByText('OK')).toBeInTheDocument()
    expect(screen.getByText('Cancel')).toBeInTheDocument()
  })

  it('renders custom okText/cancelText', () => {
    render(<Modal open={true} okText="Confirm" cancelText="Dismiss" />)
    expect(screen.getByText('Confirm')).toBeInTheDocument()
    expect(screen.getByText('Dismiss')).toBeInTheDocument()
  })

  it('renders custom footer when provided', () => {
    render(<Modal open={true} footer={<button>Custom</button>} />)
    expect(screen.getByText('Custom')).toBeInTheDocument()
    expect(screen.queryByText('OK')).not.toBeInTheDocument()
  })

  it('hides footer when footer=null', () => {
    render(<Modal open={true} footer={null} />)
    expect(screen.queryByText('OK')).not.toBeInTheDocument()
  })

  it('shows close button when closable=true (default)', () => {
    render(<Modal open={true} />)
    expect(screen.getByLabelText('Close')).toBeInTheDocument()
  })

  it('hides close button when closable=false', () => {
    render(<Modal open={true} closable={false} />)
    expect(screen.queryByLabelText('Close')).not.toBeInTheDocument()
  })

  it('disables Ok button when confirmLoading=true', () => {
    render(<Modal open={true} confirmLoading={true} />)
    const okBtn = document.querySelector('[data-slot="modal-ok"]')
    expect(okBtn).toBeDisabled()
  })
})

describe('modal.confirm() — imperative API', () => {
  it('returns a Promise (not implemented stub is gone in Phase 5)', async () => {
    // Phase 5: modal.confirm() returns a real Promise instead of throwing.
    const promise = modal.confirm({ title: 'Delete?' })
    expect(promise).toBeInstanceOf(Promise)
    // Dismiss immediately to avoid hanging — click cancel synchronously
    const cancelBtn = document.querySelector('[data-slot="modal-cancel"]')
    if (cancelBtn) (cancelBtn as HTMLButtonElement).click()
    // Swallow the rejection from cancel (cancel rejects with Error('cancelled'))
    await promise.catch(() => {})
  })
})
