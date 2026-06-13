import type { ReactNode } from 'react'

/**
 * Props for the Modal composite component.
 * API mirrors antd Modal props subset.
 */
export interface ModalProps {
  /** Controls visibility of the modal. */
  open: boolean
  /** Modal title content. */
  title?: ReactNode
  /** Modal body content. */
  children?: ReactNode
  /**
   * Custom footer content.
   * Pass `null` to hide footer entirely.
   * Omit to render default Ok/Cancel buttons.
   */
  footer?: ReactNode | null
  /** Called when the Ok button is clicked. */
  onOk?: () => void | Promise<void>
  /** Called when the Cancel button or close icon is clicked. */
  onCancel?: () => void
  /** Text label for the Ok button. Default: 'OK'. */
  okText?: ReactNode
  /** Text label for the Cancel button. Default: 'Cancel'. */
  cancelText?: ReactNode
  /** Shows a loading spinner on the Ok button during async onOk. */
  confirmLoading?: boolean
  /** Modal width in px or CSS string. Default: 520. */
  width?: number | string
  /** Destroys modal DOM on close instead of hiding it. Default: false. */
  destroyOnClose?: boolean
  /** Show the close (X) icon in the top-right corner. Default: true. */
  closable?: boolean
}

/**
 * Options for the imperative confirm dialog.
 */
export interface ConfirmOptions {
  /** Dialog title content. */
  title: ReactNode
  /** Dialog body content. */
  content?: ReactNode
  /** Called when the user confirms. May be async. */
  onOk?: () => void | Promise<void>
  /**
   * Variant of the Ok button.
   * - 'primary' → accent color (default).
   * - 'danger'  → destructive/red intent.
   */
  okType?: 'primary' | 'danger'
  /** Text label for the Ok button. Default: 'OK'. */
  okText?: ReactNode
  /** Text label for the Cancel button. Default: 'Cancel'. */
  cancelText?: ReactNode
}

/**
 * Imperative modal API — call `modal.confirm(opts)` to open a programmatic
 * confirm dialog without mounting a component in JSX.
 *
 * Implementation is deferred to phase 5. Stub may throw "not implemented".
 */
export interface ModalImperativeApi {
  /**
   * Opens a confirmation dialog imperatively.
   * Resolves when the user confirms; rejects (or silently resolves) on cancel.
   */
  confirm(options: ConfirmOptions): Promise<void>
}
