import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../../theme/theme-provider'
import { cn } from '../../lib/cn'
import type { HeaderProps } from './header.types'

/**
 * App-level header bar — h-12, left zone (leading + title) + right zone
 * (notifications, custom actions, theme toggle). Visual spec mirrors the
 * Win11-style winbar: borderBottom var(--win11-card-border), hover tokens.
 * Window controls and drag region are intentionally omitted (web target).
 */
export function Header({
  title,
  leading,
  actions,
  notifications,
  showThemeToggle = true,
  className,
}: HeaderProps) {
  const { resolvedTheme, setTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  return (
    <header
      className={cn('h-12 flex items-center justify-between px-4 shrink-0', className)}
      style={{ borderBottom: '1px solid var(--win11-card-border)' }}
    >
      {/* Left zone: leading slot + title */}
      <div className="flex items-center gap-2">
        {leading}
        {title && (
          <span className="text-body font-medium text-foreground select-none">
            {title}
          </span>
        )}
      </div>

      {/* Right zone: notifications → custom actions → theme toggle */}
      <div className="flex items-center gap-1">
        {notifications}
        {actions}
        {showThemeToggle && (
          <button
            type="button"
            className="p-2 rounded hover:bg-[var(--win11-hover)] transition-colors text-foreground"
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
            title={isDark ? 'Light theme' : 'Dark theme'}
          >
            {isDark ? <Sun size={16} aria-hidden /> : <Moon size={16} aria-hidden />}
          </button>
        )}
      </div>
    </header>
  )
}
