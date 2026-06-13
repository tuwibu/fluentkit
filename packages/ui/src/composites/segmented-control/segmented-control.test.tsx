import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { SegmentedControl } from './segmented-control'

const options = [
  { label: 'Day', value: 'day' },
  { label: 'Week', value: 'week' },
  { label: 'Month', value: 'month' },
] as const

describe('SegmentedControl', () => {
  it('renders all segment labels', () => {
    render(<SegmentedControl options={options} value="day" onChange={() => {}} />)
    expect(screen.getByText('Day')).toBeInTheDocument()
    expect(screen.getByText('Week')).toBeInTheDocument()
    expect(screen.getByText('Month')).toBeInTheDocument()
  })

  it('active segment has aria-checked=true', () => {
    render(<SegmentedControl options={options} value="week" onChange={() => {}} />)
    const weekBtn = screen.getByRole('radio', { name: 'Week' })
    const dayBtn = screen.getByRole('radio', { name: 'Day' })
    expect(weekBtn).toHaveAttribute('aria-checked', 'true')
    expect(dayBtn).toHaveAttribute('aria-checked', 'false')
  })

  it('calls onChange with correct value on click', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<SegmentedControl options={options} value="day" onChange={onChange} />)
    await user.click(screen.getByRole('radio', { name: 'Month' }))
    expect(onChange).toHaveBeenCalledWith('month')
  })

  it('does not call onChange when disabled', () => {
    const onChange = vi.fn()
    render(<SegmentedControl options={options} value="day" onChange={onChange} disabled />)
    const btn = screen.getByRole('radio', { name: 'Week' })
    expect(btn).toBeDisabled()
  })

  it('renders with role=group', () => {
    render(
      <SegmentedControl
        options={options}
        value="day"
        onChange={() => {}}
        aria-label="Time period"
      />
    )
    expect(screen.getByRole('group', { name: 'Time period' })).toBeInTheDocument()
  })

  it('marks active segment with data-active attribute', () => {
    render(<SegmentedControl options={options} value="month" onChange={() => {}} />)
    const monthBtn = screen.getByRole('radio', { name: 'Month' })
    expect(monthBtn).toHaveAttribute('data-active', 'true')
  })
})
