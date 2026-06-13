import { useState } from 'react'
import { LayoutGrid, UserCircle, IdCard, Layers, Tv, ListChecks, Settings } from 'lucide-react'
import { ThemeProvider } from '../../theme/theme-provider'
import { ColorThemeProvider } from '../../theme/color-theme-provider'
import { UserDropdown } from '../user-dropdown/user-dropdown'
import { AppShell } from './app-shell'
import type { MenuItem } from '../sidebar/sidebar.types'

const ICON = { size: 18, strokeWidth: 2 } as const
const CHILD = { size: 16, strokeWidth: 2 } as const

const MENU_ITEMS: MenuItem[] = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    tip: 'Dashboard',
    color: '#f59e0b',
    icon: <LayoutGrid {...ICON} />,
  },
  {
    key: 'profiles',
    label: 'Profiles',
    tip: 'Profiles',
    color: '#8b5cf6',
    icon: <UserCircle {...ICON} />,
    children: [
      { key: 'all-profiles', label: 'All Profiles', color: '#8b5cf6', icon: <IdCard {...CHILD} />, count: 42 },
      { key: 'groups',       label: 'Groups',       color: '#6b7280', icon: <Layers {...CHILD} /> },
      { key: 'channels',     label: 'Channels',     color: '#ec4899', icon: <Tv {...CHILD} />,    count: 3 },
      { key: 'tasks',        label: 'Tasks',        color: '#22c55e', icon: <ListChecks {...CHILD} /> },
    ],
  },
  {
    key: 'settings',
    label: 'Settings',
    tip: 'Settings',
    color: '#6b7280',
    icon: <Settings {...ICON} />,
  },
]

const SAMPLE_FOOTER = (
  <footer
    className="flex items-center justify-between px-5 py-1.5 text-xs shrink-0 text-muted-foreground"
    style={{ borderTop: '1px solid var(--win11-card-border)', background: 'var(--win11-card-bg)' }}
  >
    <span className="flex items-center gap-1.5">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
      Connected
    </span>
    <span>FluentKit Demo v0.1</span>
  </footer>
)

function FullShellDemo({ defaultCollapsed = false }: { defaultCollapsed?: boolean }) {
  const [activeKey, setActiveKey] = useState('all-profiles')

  const userSlot = (
    <UserDropdown
      user={{ name: 'Jane Doe', email: 'jane@example.com' }}
      onLogout={() => alert('sign out')}
    />
  )

  const pageContent: Record<string, string> = {
    dashboard:    'Dashboard page content',
    'all-profiles': 'All Profiles page content',
    groups:       'Groups page content',
    channels:     'Channels page content',
    tasks:        'Tasks page content',
    settings:     'Settings page content',
  }

  return (
    <ThemeProvider>
      <ColorThemeProvider>
        <div style={{ height: '100vh' }}>
          <AppShell
            menu={MENU_ITEMS}
            activeKey={activeKey}
            onSelect={setActiveKey}
            brand={{ name: 'FluentKit', version: 'v0.1' }}
            user={userSlot}
            headerTitle={activeKey.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
            footer={SAMPLE_FOOTER}
            defaultCollapsed={defaultCollapsed}
          >
            <div className="text-sm text-muted-foreground space-y-4">
              <h1 className="text-lg font-semibold text-foreground">
                {pageContent[activeKey] ?? 'Page content'}
              </h1>
              <p>
                This is sample content for the <strong>{activeKey}</strong> page. The wallpaper +
                mica glass layers are rendered behind the sidebar and content area.
              </p>
              <p>
                Use the hamburger button in the header to toggle the sidebar collapsed/expanded
                state. The <code>body.sb-collapsed</code> class is also toggled for CSS hooks.
              </p>
            </div>
          </AppShell>
        </div>
      </ColorThemeProvider>
    </ThemeProvider>
  )
}

export default {
  title: 'Composites/AppShell',
  component: AppShell,
  parameters: {
    layout: 'fullscreen',
  },
}

export const Default = () => <FullShellDemo />
Default.storyName = 'Full shell (expanded)'

export const CollapsedDefault = () => <FullShellDemo defaultCollapsed />
CollapsedDefault.storyName = 'Full shell (collapsed by default)'
