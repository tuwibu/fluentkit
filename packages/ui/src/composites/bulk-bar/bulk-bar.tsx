import type { ReactNode } from 'react'
import { X, Loader2 } from 'lucide-react'
import { cx } from '../../lib/cx'
import type { BulkBarProps, BulkAction } from './bulk-bar.types'

const BTN_BASE =
  'px-2.5 py-1.5 text-body font-medium rounded-[4px] hover:bg-[var(--win11-control-hover)] transition-colors flex items-center gap-1.5 whitespace-nowrap'

const BTN_DANGER =
  'px-2.5 py-1.5 text-body font-medium rounded-[4px] hover:bg-destructive/10 text-destructive transition-colors flex items-center gap-1.5 whitespace-nowrap'

const SEP = 'w-px h-6 bg-border mx-1 shrink-0'

function ActionButton({ action }: { action: BulkAction }) {
  const icon: ReactNode = action.loading ? (
    <Loader2 className="animate-spin" size={12} />
  ) : (
    action.icon
  )

  return (
    <button
      type="button"
      className={action.danger ? BTN_DANGER : BTN_BASE}
      onClick={action.onClick}
      disabled={action.disabled || action.loading}
      aria-busy={action.loading || undefined}
    >
      {icon}
      {action.label}
    </button>
  )
}

export function BulkBar({ count, actions = [], onClose, extra }: BulkBarProps) {
  const show = count > 0
  const normalActions = actions.filter((a) => !a.danger)
  const dangerActions = actions.filter((a) => a.danger)
  const hasNormal = normalActions.length > 0
  const hasDanger = dangerActions.length > 0

  return (
    <div
      className={cx(
        'fixed bottom-10 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ease-out',
        show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none',
      )}
      role="toolbar"
      aria-label="Bulk actions"
    >
      <div
        className="flex items-center gap-1 px-2 py-1.5 rounded-xl whitespace-nowrap flex-nowrap backdrop-blur-xl bg-[var(--win11-card-bg)] border border-[var(--win11-card-border)]"
        style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.1)' }}
      >
        {/* Count chip */}
        <div className="px-2.5 py-1.5 text-body font-medium text-muted-foreground flex items-center gap-2 whitespace-nowrap">
          <div className="w-5 h-5 rounded bg-primary/20 text-primary flex items-center justify-center text-micro font-bold">
            {count}
          </div>
          selected
        </div>

        {extra}

        {(hasNormal || hasDanger) && <span className={SEP} aria-hidden="true" />}

        {normalActions.map((action) => (
          <ActionButton key={action.key} action={action} />
        ))}

        {hasDanger && <span className={SEP} aria-hidden="true" />}

        {dangerActions.map((action) => (
          <ActionButton key={action.key} action={action} />
        ))}

        <span className={SEP} aria-hidden="true" />

        <button
          type="button"
          className="p-1.5 rounded-[4px] hover:bg-[var(--win11-control-hover)] transition-colors ml-1 shrink-0"
          onClick={onClose}
          aria-label="Clear selection"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  )
}
