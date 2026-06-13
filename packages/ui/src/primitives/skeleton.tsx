import * as React from 'react'
import { cn } from '../lib/cn'

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeleton"
      role="status"
      aria-busy="true"
      aria-label="Loading"
      className={cn('bg-foreground/10 animate-pulse rounded-md', className)}
      {...props}
    />
  )
}

export { Skeleton }
