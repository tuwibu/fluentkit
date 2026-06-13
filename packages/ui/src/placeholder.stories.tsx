import type { Meta, StoryObj } from '@storybook/react'
import { Placeholder } from './placeholder'

const meta: Meta<typeof Placeholder> = {
  title: 'Components/Placeholder',
  component: Placeholder,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof Placeholder>

export const Default: Story = {
  args: {
    children: 'Placeholder component — phase 1 harness check',
  },
}

export const WithClassName: Story = {
  args: {
    children: 'Styled placeholder',
    className: 'p-4 border rounded',
  },
}
