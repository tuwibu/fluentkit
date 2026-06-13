import type { Meta, StoryObj } from '@storybook/react'
import { Tag } from './tag'

const meta: Meta<typeof Tag> = {
  title: 'Primitives/Tag',
  component: Tag,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    variant: {
      control: 'select',
      options: ['success', 'warning', 'error', 'info', 'neutral', 'accent'],
    },
  },
}
export default meta
type Story = StoryObj<typeof Tag>

export const Default: Story = { args: { children: 'Frontend', variant: 'neutral' } }
export const Success: Story = { args: { children: 'Active', variant: 'success' } }
export const Warning: Story = { args: { children: 'Pending', variant: 'warning' } }
export const Error: Story = { args: { children: 'Failed', variant: 'error' } }

export const WithRemove: Story = {
  args: {
    children: 'Removable',
    variant: 'info',
    onRemove: () => alert('removed'),
  },
}

export const WithBullet: Story = {
  args: { children: 'With dot', variant: 'accent', bullet: true },
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-2 flex-wrap">
      {(['success', 'warning', 'error', 'info', 'neutral', 'accent'] as const).map(
        (v) => <Tag key={v} variant={v}>{v}</Tag>,
      )}
    </div>
  ),
}
