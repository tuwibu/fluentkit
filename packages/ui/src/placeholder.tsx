import type { ReactNode } from 'react'

export interface PlaceholderProps {
  children?: ReactNode
  className?: string
}

export function Placeholder({ children, className }: PlaceholderProps) {
  return (
    <div data-slot="placeholder" className={className}>
      {children}
    </div>
  )
}
