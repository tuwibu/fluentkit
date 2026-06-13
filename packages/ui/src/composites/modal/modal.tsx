import { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { flushSync } from 'react-dom'
import { Dialog } from 'radix-ui'
import { Button } from '../../primitives/button'
import type { ModalProps, ModalImperativeApi, ConfirmOptions } from './modal.types'

/**
 * Modal composite component.
 * Facade over radix Dialog — provides focus trap, overlay, ESC key, and portal.
 * data-slots preserved for styling hooks.
 */
export function Modal({
  open,
  title,
  children,
  footer,
  onOk,
  onCancel,
  okText = 'OK',
  cancelText = 'Cancel',
  confirmLoading = false,
  width = 520,
  destroyOnClose = false,
  closable = true,
}: ModalProps) {
  const handleOpenChange = (isOpen: boolean) => {
    // radix calls onOpenChange(false) on ESC or overlay click → map to onCancel
    if (!isOpen) onCancel?.()
  }

  const handleEscapeKeyDown = (e: KeyboardEvent) => {
    if (!closable) e.preventDefault()
  }

  const handlePointerDownOutside = (e: CustomEvent) => {
    if (!closable) e.preventDefault()
  }

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          data-slot="modal-overlay"
          className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50"
        />
        <Dialog.Content
          data-slot="modal"
          aria-describedby={undefined}
          style={{ width }}
          forceMount={destroyOnClose ? undefined : true}
          onEscapeKeyDown={handleEscapeKeyDown}
          onPointerDownOutside={handlePointerDownOutside}
          className="bg-[var(--win11-card-bg-solid)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg"
        >
          <div data-slot="modal-header" className="flex flex-col gap-2 text-center sm:text-left">
            {title ? (
              <Dialog.Title data-slot="modal-title" asChild>
                <span className="text-lg leading-none font-semibold">{title}</span>
              </Dialog.Title>
            ) : (
              /* Visually hidden title satisfies radix a11y requirement when no title prop */
              <Dialog.Title className="sr-only">Dialog</Dialog.Title>
            )}
            {closable && (
              <Dialog.Close asChild>
                <button
                  type="button"
                  aria-label="Close"
                  data-slot="modal-close"
                  className="ring-offset-background focus:ring-ring absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none"
                >
                  ×
                </button>
              </Dialog.Close>
            )}
          </div>

          <div data-slot="modal-body" className="text-muted-foreground text-body">{children}</div>

          {footer !== null && (
            <div data-slot="modal-footer" className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              {footer !== undefined ? (
                footer
              ) : (
                <>
                  <Button variant="outline" type="button" onClick={onCancel} data-slot="modal-cancel">
                    {cancelText}
                  </Button>
                  <Button
                    type="button"
                    onClick={onOk}
                    disabled={confirmLoading}
                    data-slot="modal-ok"
                  >
                    {confirmLoading ? '…' : okText}
                  </Button>
                </>
              )}
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

// ---------------------------------------------------------------------------
// Imperative confirm dialog
// Strategy: mount a temporary React root into a detached div; resolve/reject
// the returned Promise based on user action; then unmount and clean up.
// Resolves on OK (after calling onOk), rejects on Cancel/dismiss.
// ---------------------------------------------------------------------------

interface ConfirmDialogProps extends ConfirmOptions {
  onResolve: () => void
  onReject: () => void
}

function ConfirmDialog({
  title,
  content,
  onOk,
  okType = 'primary',
  okText = 'OK',
  cancelText = 'Cancel',
  onResolve,
  onReject,
}: ConfirmDialogProps) {
  const [loading, setLoading] = useState(false)

  const handleOk = async () => {
    setLoading(true)
    try {
      await onOk?.()
      onResolve()
    } catch {
      setLoading(false)
    }
  }

  return (
    <Dialog.Root open={true} onOpenChange={(isOpen) => { if (!isOpen) onReject() }}>
      <Dialog.Portal>
        <Dialog.Overlay
          data-slot="modal-overlay"
          className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50"
        />
        <Dialog.Content
          data-slot="modal"
          aria-describedby={undefined}
          onEscapeKeyDown={() => onReject()}
          className="bg-[var(--win11-card-bg-solid)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg"
        >
          <div data-slot="modal-header" className="flex flex-col gap-2 text-center sm:text-left">
            <Dialog.Title data-slot="modal-title" asChild>
              <span className="text-lg leading-none font-semibold">{title}</span>
            </Dialog.Title>
          </div>
          {content && <div data-slot="modal-body" className="text-muted-foreground text-body">{content}</div>}
          <div data-slot="modal-footer" className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button variant="outline" type="button" onClick={onReject} data-slot="modal-cancel">
              {cancelText}
            </Button>
            <Button
              type="button"
              variant={okType === 'danger' ? 'destructive' : 'default'}
              onClick={handleOk}
              disabled={loading}
              data-slot="modal-ok"
              data-variant={okType === 'danger' ? 'danger' : undefined}
            >
              {loading ? '…' : okText}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

/** Mounts a ConfirmDialog in a detached container via createRoot. */
function mountConfirm(options: ConfirmOptions): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const container = document.createElement('div')
    document.body.appendChild(container)
    const root = createRoot(container)

    const cleanup = () => {
      root.unmount()
      document.body.removeChild(container)
    }

    // Idempotent guards — radix onOpenChange(false) fires after Cancel click,
    // which would double-invoke reject and trigger React warnings.
    let settled = false

    const handleResolve = () => {
      if (settled) return
      settled = true
      cleanup()
      resolve()
    }

    const handleReject = () => {
      if (settled) return
      settled = true
      cleanup()
      // Reject with a named error so callers can distinguish cancel from unexpected errors.
      reject(new Error('cancelled'))
    }

    // flushSync ensures the dialog is in the DOM synchronously — important for
    // tests that query the DOM immediately after calling modal.confirm().
    flushSync(() => {
      root.render(
        <ConfirmDialog
          {...options}
          onResolve={handleResolve}
          onReject={handleReject}
        />,
      )
    })
  })
}

/**
 * Imperative modal API.
 * modal.confirm() → resolves when user clicks OK (after optional onOk callback),
 * rejects when user clicks Cancel.
 */
export const modal: ModalImperativeApi = {
  confirm(options: ConfirmOptions): Promise<void> {
    return mountConfirm(options)
  },
}
