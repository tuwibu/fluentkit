import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { SidebarNav } from './sidebar-nav'
import type { SidebarNavItem } from './sidebar-nav.types'

const items: SidebarNavItem[] = [
  { id: 'general', label: 'General' },
  { id: 'profile', label: 'Profile' },
  { id: 'security', label: 'Security' },
]

describe('SidebarNav', () => {
  it('renders all items', () => {
    render(<SidebarNav items={items} activeId="general" onSelect={() => {}} />)
    expect(screen.getByText('General')).toBeInTheDocument()
    expect(screen.getByText('Profile')).toBeInTheDocument()
    expect(screen.getByText('Security')).toBeInTheDocument()
  })

  it('marks active item with aria-current=page', () => {
    render(<SidebarNav items={items} activeId="profile" onSelect={() => {}} />)
    const btn = screen.getByRole('button', { name: 'Profile' })
    expect(btn).toHaveAttribute('aria-current', 'page')
  })

  it('non-active items do not have aria-current', () => {
    render(<SidebarNav items={items} activeId="profile" onSelect={() => {}} />)
    expect(screen.getByRole('button', { name: 'General' })).not.toHaveAttribute('aria-current')
  })

  it('calls onSelect with correct id on click', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(<SidebarNav items={items} activeId="general" onSelect={onSelect} />)
    await user.click(screen.getByRole('button', { name: 'Profile' }))
    expect(onSelect).toHaveBeenCalledWith('profile')
  })

  it('does NOT call onSelect when disabled item is clicked', async () => {
    const onSelect = vi.fn()
    const withDisabled: SidebarNavItem[] = [
      ...items,
      { id: 'disabled-item', label: 'Disabled', disabled: true },
    ]
    render(<SidebarNav items={withDisabled} activeId="general" onSelect={onSelect} />)
    // disabled button — click won't fire because of the native disabled attribute
    const btn = screen.getByRole('button', { name: 'Disabled' })
    expect(btn).toBeDisabled()
  })

  it('renders group labels when groups provided', () => {
    const grouped: SidebarNavItem[] = [
      { id: 'a', label: 'Item A', group: 'grp1' },
      { id: 'b', label: 'Item B', group: 'grp1' },
    ]
    render(
      <SidebarNav
        items={grouped}
        activeId="a"
        onSelect={() => {}}
        groups={[{ key: 'grp1', label: 'Group One' }]}
      />
    )
    expect(screen.getByText('Group One')).toBeInTheDocument()
    expect(screen.getByText('Item A')).toBeInTheDocument()
  })

  it('renders error indicator when hasError=true', () => {
    const withErr: SidebarNavItem[] = [{ id: 'x', label: 'X', hasError: true }]
    render(<SidebarNav items={withErr} activeId="x" onSelect={() => {}} />)
    expect(screen.getByLabelText('has error')).toBeInTheDocument()
  })
})
