import { useState } from 'react'
import { addMonths, format, subMonths } from 'date-fns'
import { Calendar, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '../../primitives/popover'
import { DayGrid } from './internal/day-grid'
import { PRESETS, getPresetRange } from '../../lib/date-presets'
import type { PresetId } from '../../lib/date-presets'
import { cn } from '../../lib/cn'
import type { DateRangePopoverProps, DateRangeValue } from './date-range-popover.types'

// Types exported from .types.ts via barrel (src/index.ts) — no re-export here.

function parseViewMonth(dateStr: string): Date {
  if (dateStr && dateStr.length >= 10) {
    const [y = 0, m = 1] = dateStr.split('-').map(Number)
    return new Date(y, m - 1, 1)
  }
  return new Date()
}

function fmtDisplay(dateStr: string): string {
  if (!dateStr) return ''
  const [y = 0, m = 0, d = 0] = dateStr.split('-').map(Number)
  return `${String(m).padStart(2, '0')}/${String(d).padStart(2, '0')}/${y}`
}

const navBtn = cn(
  'inline-flex size-6 items-center justify-center rounded-[4px]',
  'text-muted-foreground transition-colors duration-75',
  'hover:bg-accent hover:text-foreground',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
)

export function DateRangePopover({
  value,
  onChange,
  showPresets = true,
  ariaLabel = 'Date range',
}: DateRangePopoverProps) {
  const [open, setOpen] = useState(false)
  const [viewMonth, setViewMonth] = useState<Date>(() => parseViewMonth(value.from))
  const [draftStart, setDraftStart] = useState('')
  const [draftEnd, setDraftEnd] = useState('')
  const [hoverDate, setHoverDate] = useState('')
  const [presetPreview, setPresetPreview] = useState<DateRangeValue | null>(null)

  function handleOpenChange(next: boolean) {
    if (next) {
      setDraftStart(value.from)
      setDraftEnd(value.to)
      setHoverDate('')
      setPresetPreview(null)
      setViewMonth(parseViewMonth(value.from))
    }
    setOpen(next)
  }

  function handlePick(ds: string) {
    if (!draftStart || (draftStart && draftEnd)) {
      setDraftStart(ds)
      setDraftEnd('')
      setHoverDate('')
    } else {
      const [s, e] = ds < draftStart ? [ds, draftStart] : [draftStart, ds]
      setDraftStart('')
      setDraftEnd('')
      setHoverDate('')
      onChange({ from: s, to: e })
      setOpen(false)
    }
  }

  function handleHover(ds: string) {
    if (draftStart && !draftEnd) setHoverDate(ds)
  }

  function handlePreset(id: PresetId) {
    const r = getPresetRange(id)
    onChange(r)
    setOpen(false)
  }

  function handleClear() {
    onChange({ from: '', to: '' })
    setDraftStart('')
    setDraftEnd('')
    setHoverDate('')
  }

  const secondMonth = addMonths(viewMonth, 1)
  const hasValue = !!(value.from && value.to)
  const selecting = !!(draftStart && !draftEnd)

  const triggerLabel = selecting
    ? `${fmtDisplay(draftStart)} – …`
    : hasValue
      ? `${fmtDisplay(value.from)} – ${fmtDisplay(value.to)}`
      : undefined

  const gridRangeStart = presetPreview ? presetPreview.from : selecting ? draftStart : value.from
  const gridRangeEnd = presetPreview ? presetPreview.to : selecting ? '' : value.to

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={ariaLabel}
          data-slot="date-range-trigger"
          className={cn(
            'inline-flex h-8 items-center gap-1.5 rounded-[4px] border px-3 py-1 text-sm',
            'transition-colors duration-100',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40',
            !hasValue && !open && 'bg-background border-border text-foreground hover:bg-accent/50',
            hasValue && !open && 'bg-primary/10 border-primary/30 text-primary hover:bg-primary/15',
            open && 'bg-primary/15 border-primary text-primary',
          )}
        >
          <Calendar className="size-3.5 opacity-70" strokeWidth={2.25} />
          <span>
            {triggerLabel ?? (
              <span className="text-muted-foreground">Pick date range</span>
            )}
          </span>
        </button>
      </PopoverTrigger>

      <PopoverContent
        data-slot="date-range-popover"
        className="flex w-auto gap-0 p-0 rounded-lg border border-border shadow-lg"
        align="start"
        sideOffset={4}
      >
        {showPresets && (
          <aside
            data-slot="date-range-presets"
            className="flex flex-col gap-px border-r border-border p-2 min-w-[120px]"
          >
            <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-0.5">
              Presets
            </div>
            {PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                data-preset={p.id}
                className={cn(
                  'rounded-[4px] px-2 py-1.5 text-left text-xs text-muted-foreground',
                  'transition-colors duration-75',
                  'hover:bg-accent hover:text-foreground',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
                )}
                onClick={() => handlePreset(p.id)}
                onMouseEnter={() => setPresetPreview(getPresetRange(p.id))}
                onMouseLeave={() => setPresetPreview(null)}
              >
                {p.label}
              </button>
            ))}
          </aside>
        )}

        <section className="flex flex-col p-3 gap-2">
          {/* Navigation */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-0.5">
              <button
                type="button"
                className={navBtn}
                onClick={() => setViewMonth((m) => subMonths(m, 12))}
                aria-label="Previous year"
              >
                <ChevronsLeft className="size-3.5" />
              </button>
              <button
                type="button"
                className={navBtn}
                onClick={() => setViewMonth((m) => subMonths(m, 1))}
                aria-label="Previous month"
              >
                <ChevronLeft className="size-3.5" />
              </button>
            </div>

            <div className="flex flex-1 items-center justify-around gap-4">
              <span
                className="text-xs font-semibold text-foreground w-[84px] text-center"
                aria-live="polite"
              >
                {format(viewMonth, 'MMM yyyy')}
              </span>
              <span
                className="text-xs font-semibold text-foreground w-[84px] text-center"
                aria-live="polite"
              >
                {format(secondMonth, 'MMM yyyy')}
              </span>
            </div>

            <div className="flex items-center gap-0.5">
              <button
                type="button"
                className={navBtn}
                onClick={() => setViewMonth((m) => addMonths(m, 1))}
                aria-label="Next month"
              >
                <ChevronRight className="size-3.5" />
              </button>
              <button
                type="button"
                className={navBtn}
                onClick={() => setViewMonth((m) => addMonths(m, 12))}
                aria-label="Next year"
              >
                <ChevronsRight className="size-3.5" />
              </button>
            </div>
          </div>

          {/* Dual month grids */}
          <div className="flex gap-4" onMouseLeave={() => setHoverDate('')}>
            <DayGrid
              month={viewMonth}
              rangeStart={gridRangeStart}
              rangeEnd={gridRangeEnd}
              hoverDate={hoverDate}
              onPick={handlePick}
              onHover={handleHover}
            />
            <DayGrid
              month={secondMonth}
              rangeStart={gridRangeStart}
              rangeEnd={gridRangeEnd}
              hoverDate={hoverDate}
              onPick={handlePick}
              onHover={handleHover}
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-border pt-2 mt-1">
            <button
              type="button"
              className="text-xs text-muted-foreground hover:text-destructive transition-colors"
              onClick={handleClear}
              data-slot="date-range-clear"
            >
              Clear
            </button>
            {hasValue && (
              <span className="text-xs text-muted-foreground">
                {fmtDisplay(value.from)} – {fmtDisplay(value.to)}
              </span>
            )}
          </div>
        </section>
      </PopoverContent>
    </Popover>
  )
}
