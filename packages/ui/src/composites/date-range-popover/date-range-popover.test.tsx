/**
 * DateRangePopover tests.
 * jsdom constraint: Radix Popover open state is tested via aria-expanded + data-slot existence.
 * Calendar day interactions are tested via preset clicks (simpler, reliable in jsdom).
 * date-presets logic is tested separately.
 */
import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { useState } from 'react'
import { DateRangePopover } from './date-range-popover'
import type { DateRangeValue } from './date-range-popover.types'

function Controlled({ onChange }: { onChange?: (r: DateRangeValue) => void }) {
  const [value, setValue] = useState<DateRangeValue>({ from: '', to: '' })
  return (
    <DateRangePopover
      value={value}
      onChange={(r) => {
        setValue(r)
        onChange?.(r)
      }}
    />
  )
}

describe('DateRangePopover', () => {
  it('renders trigger button', () => {
    render(<DateRangePopover value={{ from: '', to: '' }} onChange={() => {}} />)
    expect(screen.getByRole('button', { name: 'Date range' })).toBeInTheDocument()
  })

  it('shows placeholder text when no value', () => {
    render(<DateRangePopover value={{ from: '', to: '' }} onChange={() => {}} />)
    expect(screen.getByText('Pick date range')).toBeInTheDocument()
  })

  it('shows formatted value when value is set', () => {
    render(
      <DateRangePopover
        value={{ from: '2024-01-15', to: '2024-01-31' }}
        onChange={() => {}}
      />
    )
    expect(screen.getByText(/01\/15\/2024.+01\/31\/2024/)).toBeInTheDocument()
  })

  it('opens popover when trigger is clicked', async () => {
    const user = userEvent.setup()
    render(<Controlled />)
    await act(async () => {
      await user.click(screen.getByRole('button', { name: 'Date range' }))
    })
    expect(document.querySelector('[data-slot="date-range-popover"]')).toBeInTheDocument()
  })

  it('renders preset buttons when popover is open', async () => {
    const user = userEvent.setup()
    render(<Controlled />)
    await act(async () => {
      await user.click(screen.getByRole('button', { name: 'Date range' }))
    })
    expect(screen.getByText('Today')).toBeInTheDocument()
    expect(screen.getByText('Last 7 days')).toBeInTheDocument()
    expect(screen.getByText('Last 30 days')).toBeInTheDocument()
  })

  it('calls onChange with correct range when preset is clicked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Controlled onChange={onChange} />)
    await act(async () => {
      await user.click(screen.getByRole('button', { name: 'Date range' }))
    })
    await act(async () => {
      await user.click(screen.getByText('Today'))
    })
    expect(onChange).toHaveBeenCalledTimes(1)
    const firstCall = onChange.mock.calls[0] ?? []
    const [arg] = firstCall
    expect(arg).toMatchObject({ from: expect.any(String), to: expect.any(String) })
    expect(arg.from).toBe(arg.to) // Today's preset: from === to
  })

  it('closes popover after preset click', async () => {
    const user = userEvent.setup()
    render(<Controlled />)
    await act(async () => {
      await user.click(screen.getByRole('button', { name: 'Date range' }))
    })
    await act(async () => {
      await user.click(screen.getByText('Yesterday'))
    })
    expect(document.querySelector('[data-slot="date-range-popover"]')).not.toBeInTheDocument()
  })

  it('renders dual month grids when open', async () => {
    const user = userEvent.setup()
    render(<Controlled />)
    await act(async () => {
      await user.click(screen.getByRole('button', { name: 'Date range' }))
    })
    // two role="grid" elements (one per month)
    const grids = document.querySelectorAll('[role="grid"]')
    expect(grids.length).toBe(2)
  })
})

describe('date-presets utility', () => {
  it('getPresetRange returns correct shape', async () => {
    const { getPresetRange } = await import('../../lib/date-presets')
    const r = getPresetRange('last7')
    expect(r).toHaveProperty('from')
    expect(r).toHaveProperty('to')
    expect(r.from).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it('today preset returns same from and to', async () => {
    const { getPresetRange } = await import('../../lib/date-presets')
    const r = getPresetRange('today')
    expect(r.from).toBe(r.to)
  })

  it('PRESETS array has all expected ids', async () => {
    const { PRESETS } = await import('../../lib/date-presets')
    const ids = PRESETS.map((p) => p.id)
    expect(ids).toContain('today')
    expect(ids).toContain('last30')
    expect(ids).toContain('thisMonth')
  })
})
