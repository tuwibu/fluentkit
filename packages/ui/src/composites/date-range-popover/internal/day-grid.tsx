import { addDays, eachDayOfInterval, format, startOfMonth, startOfWeek } from 'date-fns'
import { cn } from '../../../lib/cn'

export interface DayGridProps {
  month: Date
  rangeStart: string
  rangeEnd: string
  hoverDate: string
  onPick: (dateStr: string) => void
  onHover?: (dateStr: string) => void
}

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

export function DayGrid({ month, rangeStart, rangeEnd, hoverDate, onPick, onHover }: DayGridProps) {
  const today = format(new Date(), 'yyyy-MM-dd')
  const gridStart = startOfWeek(startOfMonth(month))
  const days = eachDayOfInterval({ start: gridStart, end: addDays(gridStart, 41) })
  const currentMonthStr = format(month, 'yyyy-MM')

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    const cells = Array.from(
      e.currentTarget.querySelectorAll<HTMLButtonElement>('button[data-cell]:not([disabled])'),
    )
    const focused = document.activeElement as HTMLButtonElement
    const idx = cells.indexOf(focused)
    if (idx === -1) return

    let next = idx
    if (e.key === 'ArrowRight') next = idx + 1
    else if (e.key === 'ArrowLeft') next = idx - 1
    else if (e.key === 'ArrowDown') next = idx + 7
    else if (e.key === 'ArrowUp') next = idx - 7
    else return

    e.preventDefault()
    if (next >= 0 && next < cells.length) cells[next].focus()
  }

  return (
    <div className="flex flex-col gap-1 select-none">
      <div className="grid grid-cols-7 gap-px" role="row">
        {WEEKDAYS.map((d) => (
          <span
            key={d}
            role="columnheader"
            aria-label={d}
            className="flex h-6 w-7 items-center justify-center text-xs font-medium text-muted-foreground"
          >
            {d}
          </span>
        ))}
      </div>

      <div
        className="grid grid-cols-7 gap-px"
        role="grid"
        aria-label={format(month, 'MMMM yyyy')}
        onKeyDown={handleKeyDown}
      >
        {days.map((day) => {
          const ds = format(day, 'yyyy-MM-dd')
          const isOutside = !ds.startsWith(currentMonthStr)
          const isToday = ds === today
          const isStart = ds === rangeStart
          const isEnd = ds === rangeEnd
          const previewEnd = rangeEnd || hoverDate
          const isInRange =
            !!rangeStart && !!previewEnd && ds > rangeStart && ds < previewEnd

          return (
            <button
              key={ds}
              type="button"
              data-cell
              data-date={ds}
              className={cn(
                'flex h-7 w-7 items-center justify-center rounded-[4px] text-xs outline-none',
                'transition-colors duration-75',
                'focus-visible:ring-2 focus-visible:ring-ring/50',
                isOutside && 'opacity-30',
                isToday && !isStart && !isEnd && 'font-semibold text-primary',
                isInRange && 'bg-primary/10 rounded-none',
                (isStart || isEnd) && 'bg-primary text-primary-foreground font-semibold rounded-[4px]',
                !isStart && !isEnd && !isInRange && !isOutside &&
                  'hover:bg-accent text-foreground',
              )}
              onClick={() => onPick(ds)}
              onMouseEnter={() => onHover?.(ds)}
              aria-label={format(day, 'MMMM d, yyyy')}
              aria-pressed={isStart || isEnd}
              aria-current={isToday ? 'date' : undefined}
              tabIndex={isStart || isEnd || (isToday && !rangeStart) ? 0 : -1}
            >
              {format(day, 'd')}
            </button>
          )
        })}
      </div>
    </div>
  )
}
