import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, afterEach, vi } from 'vitest'
import { LayoutGrid, UserCircle, IdCard } from 'lucide-react'
import { AppShell } from './app-shell'
import { AppShellProvider, useAppShell } from './app-shell-context'
import type { MenuItem } from '../sidebar/sidebar.types'

// Mock next-themes — Header uses useTheme internally.
vi.mock('next-themes', () => ({
  useTheme: () => ({ resolvedTheme: 'dark', setTheme: vi.fn() }),
}))

const ITEMS: MenuItem[] = [
  { key: 'dashboard', label: 'Dashboard', tip: 'Dashboard', icon: <LayoutGrid size={18} /> },
  {
    key: 'profiles',
    label: 'Profiles',
    tip: 'Profiles',
    icon: <UserCircle size={18} />,
    children: [{ key: 'all-profiles', label: 'All Profiles', icon: <IdCard size={16} /> }],
  },
]

function renderShell(props: Partial<React.ComponentProps<typeof AppShell>> = {}) {
  return render(
    <AppShell
      menu={ITEMS}
      activeKey="dashboard"
      onSelect={() => {}}
      headerTitle="Test Page"
      {...props}
    >
      <div>page content</div>
    </AppShell>,
  )
}

describe('AppShell', () => {
  afterEach(() => {
    // Clean up body class between tests.
    document.body.classList.remove('sb-collapsed')
  })

  it('renders page content', () => {
    renderShell()
    expect(screen.getByText('page content')).toBeInTheDocument()
  })

  it('renders header title', () => {
    renderShell({ headerTitle: 'My Page Title' })
    expect(screen.getByText('My Page Title')).toBeInTheDocument()
  })

  it('passes activeKey to sidebar (aria-current=page on active item)', () => {
    renderShell({ activeKey: 'dashboard' })
    const btn = screen.getByRole('button', { name: 'Dashboard' })
    expect(btn).toHaveAttribute('aria-current', 'page')
  })

  it('calls onSelect when a sidebar item is clicked', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    renderShell({ onSelect })
    await user.click(screen.getByRole('button', { name: 'Dashboard' }))
    expect(onSelect).toHaveBeenCalledWith('dashboard')
  })

  it('renders footer slot', () => {
    renderShell({ footer: <div>app footer</div> })
    expect(screen.getByText('app footer')).toBeInTheDocument()
  })

  it('renders user slot above menu in sidebar', () => {
    const { container } = renderShell({ user: <div data-testid="shell-user-slot">User Card</div> })
    expect(screen.getByText('User Card')).toBeInTheDocument()
    const aside = container.querySelector('[data-slot="sidebar"]')!
    const userSlotEl = aside.querySelector('[data-testid="shell-user-slot"]')!
    const firstMenuBtn = aside.querySelector('button')!
    expect(
      userSlotEl.compareDocumentPosition(firstMenuBtn) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
  })

  it('applies wallpaper background to outermost div', () => {
    const { container } = renderShell()
    const outer = container.firstElementChild as HTMLElement
    expect(outer.style.background).toBe('var(--win11-wallpaper)')
  })

  it('applies mica blur to second layer', () => {
    const { container } = renderShell()
    const outer = container.firstElementChild as HTMLElement
    const mica = outer.firstElementChild as HTMLElement
    expect(mica.style.backdropFilter).toBe('blur(30px)')
  })

  it('content div has view-transition-name win11-page', () => {
    const { container } = renderShell()
    const vtEl = container.querySelector<HTMLElement>('[style*="win11-page"]')
    expect(vtEl).toBeTruthy()
    expect(vtEl!.style.viewTransitionName).toBe('win11-page')
  })

  it('content div has correct padding class', () => {
    const { container } = renderShell()
    const vtEl = container.querySelector('[style*="win11-page"]')
    expect(vtEl).toHaveClass('p-[8px_16px_16px_16px]')
  })

  it('content div has animate-win11-slide-up class', () => {
    const { container } = renderShell()
    const vtEl = container.querySelector('[style*="win11-page"]')
    expect(vtEl).toHaveClass('animate-win11-slide-up')
  })

  describe('sidebar collapse', () => {
    it('starts expanded by default', () => {
      renderShell()
      const toggleBtn = screen.getByRole('button', { name: /collapse sidebar/i })
      expect(toggleBtn).toHaveAttribute('aria-expanded', 'true')
    })

    it('starts collapsed when defaultCollapsed=true', () => {
      renderShell({ defaultCollapsed: true })
      const toggleBtn = screen.getByRole('button', { name: /expand sidebar/i })
      expect(toggleBtn).toHaveAttribute('aria-expanded', 'false')
    })

    it('toggles collapsed state on hamburger click', async () => {
      const user = userEvent.setup()
      renderShell()

      const btn = screen.getByRole('button', { name: /collapse sidebar/i })
      await user.click(btn)

      expect(screen.getByRole('button', { name: /expand sidebar/i })).toHaveAttribute(
        'aria-expanded',
        'false',
      )
    })

    it('adds body.sb-collapsed when collapsed', async () => {
      const user = userEvent.setup()
      renderShell()
      await user.click(screen.getByRole('button', { name: /collapse sidebar/i }))
      expect(document.body.classList.contains('sb-collapsed')).toBe(true)
    })

    it('removes body.sb-collapsed when expanded', async () => {
      const user = userEvent.setup()
      renderShell({ defaultCollapsed: true })
      expect(document.body.classList.contains('sb-collapsed')).toBe(true)
      await user.click(screen.getByRole('button', { name: /expand sidebar/i }))
      expect(document.body.classList.contains('sb-collapsed')).toBe(false)
    })
  })
})

describe('AppShellProvider + useAppShell', () => {
  afterEach(() => {
    document.body.classList.remove('sb-collapsed')
  })

  function HookConsumer() {
    const { collapsed, toggleSidebar } = useAppShell()
    return (
      <div>
        <span data-testid="state">{collapsed ? 'collapsed' : 'expanded'}</span>
        <button type="button" onClick={toggleSidebar}>toggle</button>
      </div>
    )
  }

  it('throws when used outside provider', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => render(<HookConsumer />)).toThrow(
      'useAppShell must be used within an AppShellProvider',
    )
    consoleSpy.mockRestore()
  })

  it('provides collapsed state and toggle', async () => {
    const user = userEvent.setup()
    render(
      <AppShellProvider>
        <HookConsumer />
      </AppShellProvider>,
    )
    expect(screen.getByTestId('state')).toHaveTextContent('expanded')
    await user.click(screen.getByRole('button', { name: 'toggle' }))
    expect(screen.getByTestId('state')).toHaveTextContent('collapsed')
  })

  it('respects defaultCollapsed prop', () => {
    render(
      <AppShellProvider defaultCollapsed>
        <HookConsumer />
      </AppShellProvider>,
    )
    expect(screen.getByTestId('state')).toHaveTextContent('collapsed')
  })

  it('syncs body.sb-collapsed on mount when defaultCollapsed=true', () => {
    render(
      <AppShellProvider defaultCollapsed>
        <HookConsumer />
      </AppShellProvider>,
    )
    expect(document.body.classList.contains('sb-collapsed')).toBe(true)
  })
})
