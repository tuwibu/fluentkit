'use client'

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
} from 'react'
import { createPortal } from 'react-dom'
import { Settings, Paintbrush, Languages, LogOut } from 'lucide-react'
import { cn } from '../../lib/cn'
import { useColorTheme } from '../../theme/color-theme-provider'
import { SelectComposite as Select } from '../select/select-composite'
import { UserCard } from './internal/user-card'
import type { UserDropdownProps } from './user-dropdown.types'

const DEFAULT_LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'vi', label: 'Tiếng Việt' },
]

interface PopoverPanelProps {
  open: boolean
  onClose: () => void
  anchorRef: RefObject<HTMLButtonElement | null>
  user: UserDropdownProps['user']
  onLogout: () => void
  onOpenSettings?: () => void
  settingsLabel: string
  colorThemeControl: boolean
  languageControl: boolean
  language?: string
  languageOptions: { value: string; label: string }[]
  onLanguageChange?: (value: string) => void
}

function PopoverPanel({
  open,
  onClose,
  anchorRef,
  user,
  onLogout,
  onOpenSettings,
  settingsLabel,
  colorThemeControl,
  languageControl,
  language,
  languageOptions,
  onLanguageChange,
}: PopoverPanelProps) {
  const { currentTheme, setTheme, themeOptions } = useColorTheme()
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (!open) return
    const el = anchorRef.current
    if (!el) return
    const update = () => {
      const r = el.getBoundingClientRect()
      if (r.width <= 0) return
      setPos({ left: r.left, top: r.bottom + 4 })
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    window.addEventListener('resize', update)
    window.addEventListener('scroll', update, true)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', update)
      window.removeEventListener('scroll', update, true)
    }
  }, [open, anchorRef])

  // Close on outside mousedown — ignore select portals
  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node | null
      if (anchorRef.current?.contains(t)) return
      if (
        t instanceof Element &&
        t.closest(
          '[data-up-pop],[data-slot="select-content"],[data-slot="select-viewport"],[data-radix-popper-content-wrapper]',
        )
      )
        return
      onClose()
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open, onClose, anchorRef])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open || !pos) return null

  const initials =
    user.name
      .split(' ')
      .map((w) => w[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'U'

  return createPortal(
    <div
      ref={panelRef}
      role="dialog"
      aria-label="User menu"
      data-up-pop="true"
      style={{
        left: pos.left,
        top: pos.top,
        width: 216,
        position: 'fixed',
        zIndex: 600,
        background: 'var(--win11-card-bg)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid var(--win11-card-border, var(--border))',
        boxShadow: 'var(--win11-shadow-lg, var(--shadow-lg))',
      }}
      className={cn(
        'rounded-lg overflow-hidden transition-all duration-200',
        open
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 -translate-y-2 pointer-events-none',
      )}
    >
      {/* User hero */}
      <div className="flex items-center gap-3 p-3">
        {user.avatar ? (
          <img
            src={user.avatar}
            alt=""
            aria-hidden
            className="w-10 h-10 rounded-full object-cover border border-[var(--win11-card-border,var(--border))] flex-shrink-0"
          />
        ) : (
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-primary-foreground font-semibold flex-shrink-0 text-body"
            style={{
              background:
                'linear-gradient(135deg, color-mix(in srgb, var(--primary) 60%, transparent), var(--primary))',
            }}
            aria-hidden
          >
            {initials}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-body font-medium text-foreground truncate">{user.name}</p>
          {user.email && (
            <p className="text-caption text-muted-foreground truncate">{user.email}</p>
          )}
        </div>
      </div>

      <div style={{ height: 1, background: 'var(--win11-card-border, var(--border))' }} />

      {/* Actions */}
      <div className="py-1">
        {onOpenSettings && (
          <button
            type="button"
            className="w-full flex items-center gap-2 px-3 py-2 text-body text-foreground hover:bg-[var(--win11-hover,hsl(var(--accent)))] transition-colors cursor-pointer"
            onClick={() => {
              onOpenSettings()
              onClose()
            }}
          >
            <Settings className="w-4 h-4 flex-shrink-0" aria-hidden />
            <span>{settingsLabel}</span>
          </button>
        )}

        {(colorThemeControl || languageControl) && (
          <div style={{ height: 1, margin: '4px 0', background: 'var(--win11-card-border, var(--border))' }} />
        )}

        {colorThemeControl && (
          <div className="flex items-center justify-between px-3 py-1.5">
            <div className="flex items-center gap-2 text-body text-foreground">
              <Paintbrush className="w-4 h-4 flex-shrink-0" aria-hidden />
              <span>Theme</span>
            </div>
            <div className="w-[96px]">
              <Select
                options={themeOptions.map((o) => ({ value: o.value, label: o.label }))}
                value={currentTheme}
                onChange={(v) => v && setTheme(String(v))}
              />
            </div>
          </div>
        )}

        {languageControl && (
          <div className="flex items-center justify-between px-3 py-1.5">
            <div className="flex items-center gap-2 text-body text-foreground">
              <Languages className="w-4 h-4 flex-shrink-0" aria-hidden />
              <span>Language</span>
            </div>
            <div className="w-[96px]">
              <Select
                options={languageOptions}
                value={language}
                onChange={(v) => v && onLanguageChange?.(String(v))}
              />
            </div>
          </div>
        )}
      </div>

      <div style={{ height: 1, background: 'var(--win11-card-border, var(--border))' }} />

      {/* Logout */}
      <div className="py-1">
        <button
          type="button"
          className="w-full flex items-center gap-2 px-3 py-2 text-body text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
          onClick={() => {
            onLogout()
            onClose()
          }}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" aria-hidden />
          <span>Sign Out</span>
        </button>
      </div>
    </div>,
    document.body,
  )
}

/**
 * UserDropdown — trigger (user card) + anchored popover with theme/language/logout.
 * Routing-agnostic: navigation handled by onOpenSettings / onLogout callbacks.
 */
export function UserDropdown({
  user,
  onLogout,
  onOpenSettings,
  settingsLabel = 'Account Settings',
  colorThemeControl = true,
  languageControl = false,
  collapsed = false,
  language,
  languageOptions = DEFAULT_LANGUAGES,
  onLanguageChange,
}: UserDropdownProps) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)

  const handleClose = useCallback(() => setOpen(false), [])
  const handleTriggerClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    setOpen((v) => !v)
  }, [])

  return (
    <div className="relative shrink-0" data-slot="user-dropdown">
      <PopoverPanel
        open={open}
        onClose={handleClose}
        anchorRef={triggerRef}
        user={user}
        onLogout={onLogout}
        onOpenSettings={onOpenSettings}
        settingsLabel={settingsLabel}
        colorThemeControl={colorThemeControl}
        languageControl={languageControl}
        language={language}
        languageOptions={languageOptions}
        onLanguageChange={onLanguageChange}
      />

      <UserCard
        ref={triggerRef}
        user={user}
        collapsed={collapsed}
        open={open}
        onClick={handleTriggerClick}
      />
    </div>
  )
}
