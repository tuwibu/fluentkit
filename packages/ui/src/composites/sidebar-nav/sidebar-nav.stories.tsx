import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { SidebarNav } from './sidebar-nav'
import type { SidebarNavItem } from './sidebar-nav.types'

const meta: Meta<typeof SidebarNav> = {
  title: 'Composites/SidebarNav',
  component: SidebarNav,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof SidebarNav>

const items: SidebarNavItem[] = [
  { id: 'general', label: 'General' },
  { id: 'profile', label: 'Profile' },
  { id: 'security', label: 'Security' },
  { id: 'notifications', label: 'Notifications' },
]

export const Default: Story = {
  render: () => {
    const [active, setActive] = useState('general')
    return (
      <SidebarNav
        items={items}
        activeId={active}
        onSelect={setActive}
      />
    )
  },
}

export const WithGroups: Story = {
  render: () => {
    const [active, setActive] = useState('a')
    const groupedItems: SidebarNavItem[] = [
      { id: 'a', label: 'Account', group: 'user' },
      { id: 'b', label: 'Profile', group: 'user' },
      { id: 'c', label: 'Billing', group: 'workspace' },
      { id: 'd', label: 'Members', group: 'workspace' },
    ]
    return (
      <SidebarNav
        items={groupedItems}
        activeId={active}
        onSelect={setActive}
        groups={[
          { key: 'user', label: 'User' },
          { key: 'workspace', label: 'Workspace' },
        ]}
      />
    )
  },
}
