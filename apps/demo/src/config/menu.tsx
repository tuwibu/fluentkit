import {
  LayoutGrid,
  UserCircle,
  IdCard,
  Layers,
  Tv,
  ListChecks,
  Users,
  Settings,
  LogIn,
} from 'lucide-react'
import type { MenuItem } from '@tuwibu/fluentkit'

const ICON = { size: 18, strokeWidth: 2 } as const
const CHILD = { size: 16, strokeWidth: 2 } as const

export const MENU_ITEMS: MenuItem[] = [
  {
    key: '/dashboard',
    label: 'Dashboard',
    icon: <LayoutGrid {...ICON} />,
    tip: 'Dashboard',
    color: '#f59e0b',
  },
  {
    key: '/profiles-group',
    label: 'Profiles',
    icon: <UserCircle {...ICON} />,
    tip: 'Profiles',
    color: '#8b5cf6',
    children: [
      {
        key: '/profiles',
        label: 'All Profiles',
        icon: <IdCard {...CHILD} />,
        color: '#8b5cf6',
      },
      {
        key: '/groups',
        label: 'Groups',
        icon: <Layers {...CHILD} />,
        color: '#6b7280',
        disabled: true,
      },
      {
        key: '/channels',
        label: 'Channels',
        icon: <Tv {...CHILD} />,
        color: '#ec4899',
        disabled: true,
      },
      {
        key: '/tasks',
        label: 'Tasks',
        icon: <ListChecks {...CHILD} />,
        color: '#22c55e',
        disabled: true,
      },
    ],
  },
  {
    key: '/users',
    label: 'Users',
    icon: <Users {...ICON} />,
    tip: 'Users',
    color: '#8b5cf6',
  },
  {
    key: '/settings',
    label: 'Settings',
    icon: <Settings {...ICON} />,
    tip: 'Settings',
    color: '#6b7280',
  },
  {
    // Demo-only: provides direct access to the login page from the sidebar
    key: '/login',
    label: 'Login',
    icon: <LogIn {...ICON} />,
    tip: 'Login',
    color: '#6b7280',
  },
]

/** Returns the header title matching the active route. */
export function getMenuTitle(pathname: string): string {
  for (const item of MENU_ITEMS) {
    if ('children' in item) {
      if (pathname.startsWith(item.key.replace('-group', ''))) {
        const child = item.children.find((c) => pathname.startsWith(c.key))
        if (child) return String(child.label)
      }
      continue
    }
    if (pathname === item.key || (item.key.length > 1 && pathname.startsWith(item.key))) {
      return String(item.label)
    }
  }
  return 'Dashboard'
}

/** Returns the active key for a given pathname.
 *  Child routes map to their leaf key; group header keys are never active. */
export function getActiveKey(pathname: string): string {
  for (const item of MENU_ITEMS) {
    if ('children' in item) {
      const child = item.children.find((c) => pathname.startsWith(c.key))
      if (child) return child.key
      continue
    }
    if (pathname === item.key || (item.key.length > 1 && pathname.startsWith(item.key))) {
      return item.key
    }
  }
  return '/dashboard'
}
