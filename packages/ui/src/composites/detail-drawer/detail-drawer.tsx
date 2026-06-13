import { cn } from '../../lib/cn'
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetHeader,
  SheetFooter,
} from '../../primitives/sheet'
import type { DetailDrawerProps } from './detail-drawer.types'

export type { DetailDrawerProps }

/**
 * DetailDrawer — sheet-based detail panel with header/body/footer slots.
 * Dismiss via ESC or overlay click. No visible X button by default.
 */
export function DetailDrawer({
  open,
  onOpenChange,
  title,
  side = 'right',
  width = 480,
  header,
  children,
  footer,
}: DetailDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={side}
        hideClose
        data-slot="detail-drawer"
        className="p-0 gap-0 flex flex-col overflow-hidden"
        style={{ width: `${width}px`, maxWidth: '100%' }}
      >
        {/* sr-only title for accessibility */}
        <SheetTitle className="sr-only">{title}</SheetTitle>

        {header && (
          <SheetHeader data-slot="detail-drawer-header" className="shrink-0 p-0">
            {header}
          </SheetHeader>
        )}

        <div
          data-slot="detail-drawer-body"
          className={cn('flex-1 overflow-y-auto min-h-0', !header && 'pt-4', !footer && 'pb-4')}
        >
          {children}
        </div>

        {footer && (
          <SheetFooter data-slot="detail-drawer-footer" className="shrink-0 p-0">
            {footer}
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  )
}
