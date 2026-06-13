import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ThemeProvider } from '../../theme/theme-provider'
import { ColorThemeProvider } from '../../theme/color-theme-provider'
import { UserDropdown } from './user-dropdown'

const user = { name: 'Alice Johnson', email: 'alice@example.com' }

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ColorThemeProvider>{children}</ColorThemeProvider>
    </ThemeProvider>
  )
}

function renderDropdown(props: Partial<React.ComponentProps<typeof UserDropdown>> = {}) {
  const onLogout = props.onLogout ?? vi.fn()
  return render(
    <Wrapper>
      <UserDropdown user={user} onLogout={onLogout} {...props} />
    </Wrapper>,
  )
}

// jsdom getBoundingClientRect always returns zeroes — stub it to return a real rect
// so PopoverPanel's useLayoutEffect produces a non-null pos.
function stubBoundingRect() {
  vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue({
    left: 10, top: 10, right: 220, bottom: 54,
    width: 210, height: 44, x: 10, y: 10,
    toJSON: () => ({}),
  } as DOMRect)
}

describe('UserDropdown', () => {
  beforeEach(() => {
    stubBoundingRect()
  })

  it('renders the trigger button', () => {
    renderDropdown()
    expect(screen.getByRole('button', { name: /alice|user/i })).toBeInTheDocument()
  })

  it('trigger shows user name and email when not collapsed', () => {
    renderDropdown()
    expect(screen.getByText('Alice Johnson')).toBeInTheDocument()
    expect(screen.getByText('alice@example.com')).toBeInTheDocument()
  })

  it('trigger hides text in collapsed mode', () => {
    renderDropdown({ collapsed: true })
    expect(screen.queryByText('Alice Johnson')).not.toBeInTheDocument()
  })

  it('popover not visible initially', () => {
    renderDropdown()
    expect(screen.queryByRole('dialog', { name: /user menu/i })).not.toBeInTheDocument()
  })

  async function openPopover() {
    const trigger = screen.getByRole('button', { name: /alice|user/i })
    await act(async () => { fireEvent.click(trigger) })
    // useLayoutEffect sets pos after click; wait for portal to appear
    await waitFor(() => screen.getByRole('dialog', { name: /user menu/i }))
  }

  it('opens popover on trigger click', async () => {
    renderDropdown()
    await openPopover()
    expect(screen.getByRole('dialog', { name: /user menu/i })).toBeInTheDocument()
  })

  it('shows sign out button in popover', async () => {
    renderDropdown()
    await openPopover()
    expect(screen.getByText('Sign Out')).toBeInTheDocument()
  })

  it('calls onLogout when Sign Out is clicked', async () => {
    const onLogout = vi.fn()
    renderDropdown({ onLogout })
    await openPopover()
    await act(async () => { fireEvent.click(screen.getByText('Sign Out')) })
    expect(onLogout).toHaveBeenCalledOnce()
  })

  it('closes popover after logout', async () => {
    const onLogout = vi.fn()
    renderDropdown({ onLogout })
    await openPopover()
    await act(async () => { fireEvent.click(screen.getByText('Sign Out')) })
    expect(screen.queryByRole('dialog', { name: /user menu/i })).not.toBeInTheDocument()
  })

  it('calls onOpenSettings when Settings is clicked', async () => {
    const onOpenSettings = vi.fn()
    renderDropdown({ onOpenSettings })
    await openPopover()
    await act(async () => { fireEvent.click(screen.getByText('Settings')) })
    expect(onOpenSettings).toHaveBeenCalledOnce()
  })

  it('closes on Escape key', async () => {
    renderDropdown()
    await openPopover()
    await act(async () => { fireEvent.keyDown(document, { key: 'Escape' }) })
    expect(screen.queryByRole('dialog', { name: /user menu/i })).not.toBeInTheDocument()
  })

  it('shows color theme select when colorThemeControl=true', async () => {
    renderDropdown({ colorThemeControl: true })
    await openPopover()
    expect(screen.getByText('Theme')).toBeInTheDocument()
  })

  it('hides theme select when colorThemeControl=false', async () => {
    renderDropdown({ colorThemeControl: false })
    await openPopover()
    expect(screen.queryByText('Theme')).not.toBeInTheDocument()
  })

  it('shows language select when languageControl=true', async () => {
    renderDropdown({ languageControl: true, language: 'en' })
    await openPopover()
    expect(screen.getByText('Language')).toBeInTheDocument()
  })

  it('hides language select when languageControl=false (default)', async () => {
    renderDropdown()
    await openPopover()
    expect(screen.queryByText('Language')).not.toBeInTheDocument()
  })

  it('renders initials avatar when no avatar url provided', async () => {
    renderDropdown()
    await openPopover()
    const initials = screen.getAllByText('AJ')
    expect(initials.length).toBeGreaterThanOrEqual(1)
  })
})
