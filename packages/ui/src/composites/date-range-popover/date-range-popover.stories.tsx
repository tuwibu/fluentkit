import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { DateRangePopover } from './date-range-popover'
import type { DateRangeValue } from './date-range-popover.types'

const meta: Meta<typeof DateRangePopover> = {
  title: 'Composites/DateRangePopover',
  component: DateRangePopover,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof DateRangePopover>

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState<DateRangeValue>({ from: '', to: '' })
    return (
      <div className="p-8">
        <DateRangePopover value={value} onChange={setValue} />
        {value.from && (
          <p className="mt-4 text-sm text-muted-foreground">
            Selected: {value.from} – {value.to}
          </p>
        )}
      </div>
    )
  },
}

export const WithInitialValue: Story = {
  render: () => {
    const [value, setValue] = useState<DateRangeValue>({
      from: '2024-01-01',
      to: '2024-01-31',
    })
    return (
      <div className="p-8">
        <DateRangePopover value={value} onChange={setValue} ariaLabel="Report period" />
      </div>
    )
  },
}
