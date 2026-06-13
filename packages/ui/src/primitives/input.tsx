import * as React from 'react'

import { cn } from '../lib/cn'

// forwardRef is required: react-hook-form's register() passes a ref to read the
// uncontrolled input's value. Without it the ref is dropped and RHF never sees the
// typed value → fields validate as "Required" and the form can't submit.
const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  function Input({ className, type, ...props }, ref) {
    return (
      <input
        ref={ref}
        type={type}
        data-slot="input"
        className={cn(
          'w-full h-8 px-3 text-body rounded-[4px] bg-[var(--win11-control-bg)] border border-[var(--win11-control-border)] text-foreground dark:text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors',
          'disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive',
          className,
        )}
        {...props}
      />
    )
  },
)

export { Input }
