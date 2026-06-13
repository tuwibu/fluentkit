import { useState } from 'react'
import {
  LayoutGrid,
  UserCircle,
  IdCard,
  Layers,
  Tv,
  ListChecks,
  Settings,
} from 'lucide-react'
import { Sidebar } from './sidebar'
import type { MenuItem } from './sidebar.types'
import { TooltipProvider } from '../../primitives/tooltip'

const ICON_PROPS = { size: 18, strokeWidth: 2 } as const
const CHILD_ICON_PROPS = { size: 16, strokeWidth: 2 } as const

const MENU_ITEMS: MenuItem[] = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    tip: 'Dashboard',
    color: '#f59e0b',
    icon: <LayoutGrid {...ICON_PROPS} />,
  },
  {
    key: 'profiles',
    label: 'Profiles',
    tip: 'Profiles',
    color: '#8b5cf6',
    icon: <UserCircle {...ICON_PROPS} />,
    children: [
      {
        key: 'all-profiles',
        label: 'All Profiles',
        color: '#8b5cf6',
        icon: <IdCard {...CHILD_ICON_PROPS} />,
        count: 42,
      },
      {
        key: 'groups',
        label: 'Groups',
        color: '#6b7280',
        icon: <Layers {...CHILD_ICON_PROPS} />,
      },
      {
        key: 'channels',
        label: 'Channels',
        color: '#ec4899',
        icon: <Tv {...CHILD_ICON_PROPS} />,
        count: 3,
      },
      {
        key: 'tasks',
        label: 'Tasks',
        color: '#22c55e',
        icon: <ListChecks {...CHILD_ICON_PROPS} />,
      },
    ],
  },
  {
    key: 'settings',
    label: 'Settings',
    tip: 'Settings',
    color: '#6b7280',
    icon: <Settings {...ICON_PROPS} />,
  },
]

function SidebarDemo({ collapsed = false }: { collapsed?: boolean }) {
  const [activeKey, setActiveKey] = useState('all-profiles')

  return (
    <TooltipProvider>
      <div
        className="flex h-screen"
        style={{ background: 'var(--win11-mica, #1a1a2e)' }}
      >
        <Sidebar
          items={MENU_ITEMS}
          activeKey={activeKey}
          onSelect={setActiveKey}
          collapsed={collapsed}
          brand={{
            logo: (
              <img
                src="/logo.png"
                alt=""
                aria-hidden
                className="w-5 h-5 object-contain"
              />
            ),
            name: 'FluentKit',
            version: 'v0.1',
          }}
        />
        <main className="flex-1 p-6 text-white text-sm opacity-60">
          active: {activeKey}
        </main>
      </div>
    </TooltipProvider>
  )
}

export default {
  title: 'Composites/Sidebar',
  component: Sidebar,
}

export const Default = () => <SidebarDemo />
Default.storyName = 'Default (expanded)'

export const Collapsed = () => <SidebarDemo collapsed />
Collapsed.storyName = 'Collapsed (icon-only + tooltip)'
