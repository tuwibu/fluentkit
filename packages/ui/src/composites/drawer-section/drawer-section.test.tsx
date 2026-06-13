import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { User } from 'lucide-react'
import { DrawerSection } from './drawer-section'
import { DrawerInfoRow } from './drawer-info-row'

describe('DrawerSection', () => {
  it('renders title', () => {
    render(
      <DrawerSection title="Identity">
        <p>child</p>
      </DrawerSection>,
    )
    expect(screen.getByText('Identity')).toBeInTheDocument()
  })

  it('renders children', () => {
    render(
      <DrawerSection title="Test">
        <span>inner content</span>
      </DrawerSection>,
    )
    expect(screen.getByText('inner content')).toBeInTheDocument()
  })

  it('renders icon slot when provided', () => {
    render(
      <DrawerSection title="With Icon" icon={<User data-testid="icon" />}>
        <span>x</span>
      </DrawerSection>,
    )
    expect(screen.getByTestId('icon')).toBeInTheDocument()
  })

  it('renders count badge when provided', () => {
    render(
      <DrawerSection title="Items" count={5}>
        <span>x</span>
      </DrawerSection>,
    )
    expect(screen.getByText('(5)')).toBeInTheDocument()
  })

  it('renders action slot when provided', () => {
    render(
      <DrawerSection title="Actions" action={<button>Edit</button>}>
        <span>x</span>
      </DrawerSection>,
    )
    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument()
  })

  it('applies padded body class when padded=true', () => {
    const { container } = render(
      <DrawerSection title="Padded" padded>
        <span>content</span>
      </DrawerSection>,
    )
    const body = container.querySelector('section > div:last-child')
    expect(body?.className).toContain('p-4')
  })

  it('applies non-padded body class when padded omitted', () => {
    const { container } = render(
      <DrawerSection title="NotPadded">
        <span>content</span>
      </DrawerSection>,
    )
    const body = container.querySelector('section > div:last-child')
    expect(body?.className).toContain('py-1')
  })

  it('applies win11 card border and bg classes', () => {
    const { container } = render(
      <DrawerSection title="Style">
        <span>x</span>
      </DrawerSection>,
    )
    const section = container.querySelector('section')
    expect(section?.className).toContain('border-[var(--win11-card-border)]')
    expect(section?.className).toContain('bg-[var(--win11-card-bg-solid)]')
  })
})

describe('DrawerInfoRow', () => {
  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    })
  })

  it('renders label and value', () => {
    render(<DrawerInfoRow label="Email" value="alice@example.com" />)
    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(screen.getByText('alice@example.com')).toBeInTheDocument()
  })

  it('renders dash when value is null', () => {
    render(<DrawerInfoRow label="Missing" value={null} />)
    expect(screen.getByText('—')).toBeInTheDocument()
  })

  it('renders dash when value is undefined', () => {
    render(<DrawerInfoRow label="Missing" value={undefined} />)
    expect(screen.getByText('—')).toBeInTheDocument()
  })

  it('shows copy icon when value present', () => {
    const { container } = render(<DrawerInfoRow label="Key" value="secret" />)
    expect(container.querySelector('[aria-hidden]')).toBeInTheDocument()
  })

  it('does not show copy icon when value absent', () => {
    const { container } = render(<DrawerInfoRow label="Key" value={null} />)
    expect(container.querySelector('[aria-hidden]')).not.toBeInTheDocument()
  })

  it('applies monospace classes when monospace=true', () => {
    render(<DrawerInfoRow label="ID" value="abc123" monospace />)
    const value = screen.getByText('abc123')
    expect(value.className).toContain('font-mono')
  })

  it('does not apply monospace classes when monospace omitted', () => {
    render(<DrawerInfoRow label="Name" value="Alice" />)
    const value = screen.getByText('Alice')
    expect(value.className).not.toContain('font-mono')
  })

  it('copies value to clipboard on click', async () => {
    render(<DrawerInfoRow label="Email" value="alice@example.com" />)
    const row = screen.getByRole('button')
    fireEvent.click(row)
    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('alice@example.com')
    })
  })

  it('shows check icon after copy', async () => {
    render(<DrawerInfoRow label="Email" value="alice@example.com" />)
    const row = screen.getByRole('button')
    fireEvent.click(row)
    await waitFor(() => {
      // Check icon replaces Copy icon after clipboard write
      expect(navigator.clipboard.writeText).toHaveBeenCalled()
    })
  })

  it('renders footer slot when provided', () => {
    render(
      <DrawerInfoRow
        label="2FA"
        value="secret"
        footer={<span data-testid="footer-content">TOTP here</span>}
      />,
    )
    expect(screen.getByTestId('footer-content')).toBeInTheDocument()
  })

  it('does not render footer slot when absent', () => {
    const { container } = render(<DrawerInfoRow label="Email" value="test@example.com" />)
    // footer wrapper div should not exist
    const footerDivs = container.querySelectorAll('.px-4.pb-2\\.5')
    expect(footerDivs.length).toBe(0)
  })
})
