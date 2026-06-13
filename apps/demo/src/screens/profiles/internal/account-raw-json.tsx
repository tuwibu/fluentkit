import { useRef, useState } from 'react'
import { Braces, ChevronRight } from 'lucide-react'

interface AccountRawJsonProps {
  value: unknown
}

export function AccountRawJson({ value }: AccountRawJsonProps) {
  const [open, setOpen] = useState(false)
  const everOpen = useRef(false)
  if (open) everOpen.current = true

  return (
    <section className="rounded-lg border border-[var(--win11-card-border)] bg-[var(--win11-card-bg-solid)] shadow-[var(--win11-shadow)] overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={`flex items-center gap-2 w-full px-4 py-2.5 text-left transition-colors hover:bg-[var(--win11-control-hover)] outline-none focus-visible:ring-2 focus-visible:ring-ring/50${
          open ? ' border-b border-[var(--win11-card-border)]' : ''
        }`}
      >
        <Braces className="w-4 h-4 text-muted-foreground shrink-0" />
        <span className="text-body font-medium text-foreground">Raw JSON</span>
        <ChevronRight
          className={`w-4 h-4 text-muted-foreground ml-auto shrink-0 transition-transform duration-150${
            open ? ' rotate-90' : ''
          }`}
          aria-hidden="true"
        />
      </button>

      <div
        className={`grid transition-[grid-template-rows] duration-150${
          open ? ' grid-rows-[1fr]' : ' grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">
          {everOpen.current && (
            <div className="p-3">
              <pre className="text-caption font-mono text-foreground whitespace-pre-wrap break-all">
                {JSON.stringify(value, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
