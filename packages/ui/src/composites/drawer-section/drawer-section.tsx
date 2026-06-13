import type { DrawerSectionProps } from './drawer-section.types'
import { cn } from '../../lib/cn'

export function DrawerSection({
  icon,
  title,
  count,
  action,
  padded,
  children,
  className,
  'aria-label': ariaLabel,
}: DrawerSectionProps) {
  const sectionId = `drawer-section-${title.toLowerCase().replace(/\s+/g, '-')}`

  return (
    <section
      className={cn(
        'rounded-lg border border-[var(--win11-card-border)] bg-[var(--win11-card-bg-solid)] shadow-[var(--win11-shadow)] overflow-hidden',
        className,
      )}
      aria-labelledby={sectionId}
      aria-label={ariaLabel}
    >
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[var(--win11-card-border)]">
        {icon && (
          <span className="w-4 h-4 text-muted-foreground shrink-0 flex items-center justify-center">
            {icon}
          </span>
        )}
        <span id={sectionId} className="text-body font-medium text-foreground">
          {title}
        </span>
        {count !== undefined && (
          <span className="text-caption text-muted-foreground">({count})</span>
        )}
        {action && <div className="ml-auto">{action}</div>}
      </div>
      <div className={padded ? 'p-4' : 'py-1'}>{children}</div>
    </section>
  )
}
