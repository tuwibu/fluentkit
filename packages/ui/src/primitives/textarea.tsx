import * as React from 'react'

import { cn } from '../lib/cn'

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<'textarea'>>(
  function Textarea({ className, ...props }, ref) {
    return (
      <textarea
        ref={ref}
        data-slot="textarea"
        className={cn(
          'w-full min-h-16 px-3 py-2 text-body rounded-[4px] bg-[var(--win11-control-bg)] border border-[var(--win11-control-border)] text-foreground dark:text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors resize-none',
          'disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive',
          className,
        )}
        {...props}
      />
    )
  },
)

export { Textarea }
