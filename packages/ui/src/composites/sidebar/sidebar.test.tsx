import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { LayoutGrid, UserCircle, IdCard, Layers } from 'lucide-react'
import { Sidebar } from './sidebar'
import type { MenuItem } from './sidebar.types'
import { TooltipProvider } from '../../primitives/tooltip'

const ITEMS: MenuItem[] = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    tip: 'Dashboard',
    color: '#f59e0b',
    icon: <LayoutGrid size={18} />,
  },
  {
    key: 'profiles',
    label: 'Profiles',
    tip: 'Profiles',
    color: '#8b5cf6',
    icon: <UserCircle size={18} />,
    children: [
      {
        key: 'all-profiles',
        label: 'All Profiles',
        icon: <IdCard size={16} />,
        color: '#8b5cf6',
      },
      {
        key: 'groups',
        label: 'Groups',
        icon: <Layers size={16} />,
        color: '#6b7280',
      },
    ],
  },
]

function renderSidebar(
  props: Partial<React.ComponentProps<typeof Sidebar>> = {},
) {
  return render(
    <TooltipProvider>
      <Sidebar
        items={ITEMS}
        activeKey="dashboard"
        onSelect={() => {}}
        {...props}
      />
    </TooltipProvider>,
  )
}

describe('Sidebar', () => {
  it('renders leaf items', () => {
    renderSidebar()
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
  })

  it('renders group header', () => {
    renderSidebar()
    expect(screen.getByText('Profiles')).toBeInTheDocument()
  })

  it('renders group children when group header is clicked', async () => {
    const user = userEvent.setup()
    renderSidebar()
    // Use aria-expanded to find exactly the group toggle button
    const groupBtn = screen.getByRole('button', { expanded: false, name: /Profiles/i })
    await user.click(groupBtn)
    expect(screen.getByText('All Profiles')).toBeInTheDocument()
  })

  it('auto-opens group when activeKey is inside it', () => {
    renderSidebar({ activeKey: 'all-profiles' })
    // Group should be expanded — children visible in DOM
    expect(screen.getByText('All Profiles')).toBeInTheDocument()
    expect(screen.getByText('Groups')).toBeInTheDocument()
  })

  it('marks active leaf with aria-current=page', () => {
    renderSidebar({ activeKey: 'dashboard' })
    const btn = screen.getByRole('button', { name: 'Dashboard' })
    expect(btn).toHaveAttribute('aria-current', 'page')
  })

  it('marks active sub-leaf with aria-current=page', () => {
    renderSidebar({ activeKey: 'all-profiles' })
    // Group auto-opens due to activeKey — sub-leaf should have aria-current
    const allProfilesBtn = screen.getByRole('button', { name: 'All Profiles' })
    expect(allProfilesBtn).toHaveAttribute('aria-current', 'page')
  })

  it('calls onSelect with leaf key when clicked', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    renderSidebar({ onSelect })
    await user.click(screen.getByRole('button', { name: 'Dashboard' }))
    expect(onSelect).toHaveBeenCalledWith('dashboard')
  })

  it('calls onSelect with sub-leaf key when clicked', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    renderSidebar({ activeKey: 'all-profiles', onSelect })
    // Auto-opened group — click sub-leaf
    await user.click(screen.getByRole('button', { name: 'All Profiles' }))
    expect(onSelect).toHaveBeenCalledWith('all-profiles')
  })

  it('renders brand bar when brand prop provided', () => {
    renderSidebar({
      brand: { name: 'TestBrand', version: 'v1.0' },
    })
    expect(screen.getByText('TestBrand')).toBeInTheDocument()
    expect(screen.getByText('v1.0')).toBeInTheDocument()
  })

  it('renders userSlot', () => {
    renderSidebar({ userSlot: <div>User Card</div> })
    expect(screen.getByText('User Card')).toBeInTheDocument()
  })

  it('userSlot appears before first menu item in DOM', () => {
    const { container } = renderSidebar({ userSlot: <div data-testid="user-slot">User Card</div> })
    const aside = container.querySelector('[data-slot="sidebar"]')!
    const userSlotEl = aside.querySelector('[data-testid="user-slot"]')!
    const firstMenuBtn = aside.querySelector('button')!
    expect(
      userSlotEl.compareDocumentPosition(firstMenuBtn) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
  })

  it('does not call onSelect for disabled leaf', () => {
    const onSelect = vi.fn()
    const items: MenuItem[] = [
      { key: 'disabled-item', label: 'Disabled', disabled: true },
    ]
    renderSidebar({ items, onSelect })
    // Disabled items render as div — not a button, can't be clicked
    expect(screen.queryByRole('button', { name: 'Disabled' })).toBeNull()
    expect(onSelect).not.toHaveBeenCalled()
  })

  it('renders count badge on leaf', () => {
    const items: MenuItem[] = [
      { key: 'item', label: 'Item', count: 99 },
    ]
    renderSidebar({ items })
    expect(screen.getByText('99')).toBeInTheDocument()
  })

  describe('collapsed mode', () => {
    it('does not throw when activeKey is a child of a group', () => {
      expect(() =>
        renderSidebar({ collapsed: true, activeKey: 'all-profiles' }),
      ).not.toThrow()
    })

    it('active child button has data-active=true in collapsed mode', () => {
      renderSidebar({ collapsed: true, activeKey: 'all-profiles' })
      // In collapsed mode group children are flattened — find by aria-current
      const buttons = document.querySelectorAll<HTMLButtonElement>(
        'button[data-active="true"]',
      )
      expect(buttons.length).toBeGreaterThan(0)
    })

    it('active child button has aria-current=page in collapsed mode', () => {
      renderSidebar({ collapsed: true, activeKey: 'all-profiles' })
      const activeButtons = document.querySelectorAll<HTMLButtonElement>(
        'button[aria-current="page"]',
      )
      expect(activeButtons.length).toBe(1)
    })
  })

  it('mounts sidebar aside element', () => {
    // SnakeRail renders only when visible (targetEl resolves after layout).
    // In jsdom getBoundingClientRect returns zeros, so rail stays hidden —
    // we verify the aside has data-slot="sidebar" and rail logic doesn't throw.
    const { container } = renderSidebar({ activeKey: 'dashboard' })
    expect(container.querySelector('[data-slot="sidebar"]')).toBeTruthy()
  })

  it('aside has aria-label="Main navigation"', () => {
    const { container } = renderSidebar()
    const aside = container.querySelector<HTMLElement>('[data-slot="sidebar"]')!
    expect(aside.getAttribute('aria-label')).toBe('Main navigation')
  })

  describe('collapsedWidth', () => {
    it('uses default 56px width when collapsed', () => {
      const { container } = renderSidebar({ collapsed: true })
      const aside = container.querySelector<HTMLElement>('[data-slot="sidebar"]')!
      expect(aside.style.width).toBe('56px')
    })

    it('uses custom collapsedWidth when provided', () => {
      const { container } = renderSidebar({ collapsed: true, collapsedWidth: 72 })
      const aside = container.querySelector<HTMLElement>('[data-slot="sidebar"]')!
      expect(aside.style.width).toBe('72px')
    })

    it('uses expanded width when not collapsed', () => {
      const { container } = renderSidebar({ collapsed: false, width: 240 })
      const aside = container.querySelector<HTMLElement>('[data-slot="sidebar"]')!
      expect(aside.style.width).toBe('240px')
    })
  })
})
