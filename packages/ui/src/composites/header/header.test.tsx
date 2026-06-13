import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Header } from './header'

// Mock next-themes so the component works in jsdom without a real ThemeProvider.
const mockSetTheme = vi.fn()
let mockResolvedTheme = 'dark'

vi.mock('next-themes', () => ({
  useTheme: () => ({ resolvedTheme: mockResolvedTheme, setTheme: mockSetTheme }),
}))

beforeEach(() => {
  mockSetTheme.mockClear()
  mockResolvedTheme = 'dark'
})

describe('Header', () => {
  it('renders the title text', () => {
    render(<Header title="Dashboard" />)
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
  })

  it('renders leading slot', () => {
    render(<Header title="Page" leading={<button type="button">Back</button>} />)
    expect(screen.getByRole('button', { name: 'Back' })).toBeInTheDocument()
  })

  it('renders notifications slot', () => {
    render(<Header notifications={<span>notif</span>} />)
    expect(screen.getByText('notif')).toBeInTheDocument()
  })

  it('renders actions slot', () => {
    render(<Header actions={<button type="button">Action</button>} />)
    expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument()
  })

  it('shows Moon icon when theme is dark', () => {
    mockResolvedTheme = 'dark'
    render(<Header />)
    // aria-label reflects current theme (offers to switch to light)
    expect(
      screen.getByRole('button', { name: 'Switch to light theme' }),
    ).toBeInTheDocument()
  })

  it('shows Sun icon when theme is light', () => {
    mockResolvedTheme = 'light'
    render(<Header />)
    expect(
      screen.getByRole('button', { name: 'Switch to dark theme' }),
    ).toBeInTheDocument()
  })

  it('calls setTheme("light") when dark and toggle is clicked', async () => {
    const user = userEvent.setup()
    mockResolvedTheme = 'dark'
    render(<Header />)
    await user.click(screen.getByRole('button', { name: 'Switch to light theme' }))
    expect(mockSetTheme).toHaveBeenCalledWith('light')
  })

  it('calls setTheme("dark") when light and toggle is clicked', async () => {
    const user = userEvent.setup()
    mockResolvedTheme = 'light'
    render(<Header />)
    await user.click(screen.getByRole('button', { name: 'Switch to dark theme' }))
    expect(mockSetTheme).toHaveBeenCalledWith('dark')
  })

  it('hides theme toggle when showThemeToggle=false', () => {
    render(<Header showThemeToggle={false} />)
    expect(
      screen.queryByRole('button', { name: /theme/i }),
    ).toBeNull()
  })

  it('renders header element with correct height class', () => {
    const { container } = render(<Header title="Test" />)
    const header = container.querySelector('header')
    expect(header).toHaveClass('h-12')
  })

  it('applies extra className to header element', () => {
    const { container } = render(<Header className="extra-class" />)
    const header = container.querySelector('header')
    expect(header).toHaveClass('extra-class')
  })
})
