import { Sidebar } from '../sidebar/sidebar'
import { Header } from '../header/header'
import { AppShellProvider, useAppShell } from './app-shell-context'
import type { AppShellProps } from './app-shell.types'

function AppShellInner({
  menu,
  activeKey,
  onSelect,
  brand,
  user,
  headerTitle,
  headerActions,
  footer,
  children,
}: Omit<AppShellProps, 'defaultCollapsed'>) {
  const { collapsed, toggleSidebar } = useAppShell()

  return (
    <>
      {/* Outermost layer: wallpaper fills the entire viewport */}
      <div
        className={`h-full overflow-hidden${collapsed ? ' sb-collapsed' : ''}`}
        style={{ background: 'var(--win11-wallpaper)' }}
      >
        {/* Mica glass overlay — mutes the wallpaper into the soft acrylic look */}
        <div
          className="flex flex-col h-full overflow-hidden"
          style={{
            background: 'var(--win11-mica)',
            backdropFilter: 'blur(30px)',
            WebkitBackdropFilter: 'blur(30px)',
          }}
        >
          {/* Horizontal row: sidebar + content column */}
          <div className="flex flex-1 min-h-0 overflow-hidden">
            <Sidebar
              items={menu}
              activeKey={activeKey}
              onSelect={onSelect}
              collapsed={collapsed}
              brand={brand}
              userSlot={user}
            />

            {/* Content column: header + scrollable main */}
            <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
              <Header
                title={headerTitle}
                actions={headerActions}
                leading={
                  <button
                    type="button"
                    onClick={toggleSidebar}
                    aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    aria-expanded={!collapsed}
                    className="flex items-center justify-center w-8 h-8 rounded hover:bg-white/10 transition-colors"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      aria-hidden="true"
                    >
                      <rect y="2" width="16" height="1.5" rx="0.75" fill="currentColor" />
                      <rect y="7.25" width="16" height="1.5" rx="0.75" fill="currentColor" />
                      <rect y="12.5" width="16" height="1.5" rx="0.75" fill="currentColor" />
                    </svg>
                  </button>
                }
              />

              <main className="flex-1 min-w-0 overflow-auto">
                {/* view-transition-name scopes the page-nav slide to this content box only —
                    sidebar / header / footer stay in `root` and don't animate. */}
                <div
                  className="animate-win11-slide-up p-[8px_16px_16px_16px]"
                  style={{ viewTransitionName: 'win11-page' }}
                >
                  {children}
                </div>
              </main>
            </div>
          </div>

          {/* Footer spans full width across sidebar + content */}
          {footer && (
            <div className="shrink-0 w-full">
              {footer}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export function AppShell({ defaultCollapsed, ...rest }: AppShellProps) {
  return (
    <AppShellProvider defaultCollapsed={defaultCollapsed}>
      <AppShellInner {...rest} />
    </AppShellProvider>
  )
}
