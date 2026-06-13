import * as React from 'react'
import { Switch as SwitchPrimitive } from 'radix-ui'

import { cn } from '../lib/cn'

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        'peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-transparent focus-visible:border-ring focus-visible:ring-ring/50 inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border data-[state=checked]:border-transparent data-[state=unchecked]:border-[var(--win11-control-border)] shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="pointer-events-none block size-3 rounded-full ring-0 shadow-sm transition-transform data-[state=checked]:bg-white data-[state=unchecked]:bg-muted-foreground data-[state=checked]:translate-x-[16px] data-[state=unchecked]:translate-x-[2px]"
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
