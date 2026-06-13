import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import type { DrawerInfoRowProps } from './drawer-section.types'

export function DrawerInfoRow({ label, value, monospace, footer }: DrawerInfoRowProps) {
  const [copied, setCopied] = useState(false)
  const hasValue = value != null && value !== ''

  async function handleCopy() {
    if (!hasValue) return
    try {
      await navigator.clipboard.writeText(value as string)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      // clipboard access denied — fail silently (no toast dep in lib)
    }
  }

  return (
    <div>
      <div
        onClick={hasValue ? handleCopy : undefined}
        role={hasValue ? 'button' : undefined}
        tabIndex={hasValue ? 0 : undefined}
        onKeyDown={hasValue ? (e) => { if (e.key === 'Enter' || e.key === ' ') handleCopy() } : undefined}
        aria-label={hasValue ? `Copy ${typeof label === 'string' ? label : ''}` : undefined}
        className={`flex items-center justify-between px-4 py-2.5 transition-colors${
          hasValue ? ' hover:bg-[var(--win11-control-hover)] cursor-pointer' : ''
        }`}
      >
        <span className="text-body text-muted-foreground min-w-[100px]">{label}</span>
        <div className="flex items-center gap-2 flex-1 justify-end min-w-0">
          <span
            className={`text-body truncate max-w-[220px]${
              hasValue ? ' text-foreground' : ' text-muted-foreground'
            }${monospace ? ' font-mono' : ''}`}
            title={hasValue ? (value as string) : undefined}
          >
            {hasValue ? value : '—'}
          </span>
          {hasValue && (
            <span className="p-1 flex-shrink-0" aria-hidden="true">
              {copied ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4 text-muted-foreground" />
              )}
            </span>
          )}
        </div>
      </div>
      {footer && <div className="px-4 pb-2.5">{footer}</div>}
    </div>
  )
}
