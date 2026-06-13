import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { SegmentedControl } from './segmented-control'

const meta: Meta<typeof SegmentedControl> = {
  title: 'Composites/SegmentedControl',
  component: SegmentedControl,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof SegmentedControl>

const options = [
  { label: 'Day', value: 'day' },
  { label: 'Week', value: 'week' },
  { label: 'Month', value: 'month' },
] as const

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState<string>('week')
    return (
      <SegmentedControl
        options={options}
        value={value}
        onChange={setValue}
        aria-label="Time period"
      />
    )
  },
}

export const MediumSize: Story = {
  render: () => {
    const [value, setValue] = useState<string>('day')
    return (
      <SegmentedControl
        options={options}
        value={value}
        onChange={setValue}
        size="md"
        aria-label="Time period"
      />
    )
  },
}
