import type { Meta, StoryObj } from '@storybook/react'
import { Avatar } from './avatar'

const meta: Meta<typeof Avatar> = {
  title: 'Composites/Avatar',
  component: Avatar,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof Avatar>

export const Initials: Story = {
  args: {
    name: 'Alice Smith',
    size: 'md',
  },
}

export const WithImage: Story = {
  args: {
    name: 'Alice Smith',
    src: 'https://i.pravatar.cc/150?img=1',
    size: 'md',
  },
}

export const Small: Story = {
  args: {
    name: 'Bob Jones',
    size: 'sm',
  },
}

export const Medium: Story = {
  args: {
    name: 'Bob Jones',
    size: 'md',
  },
}

export const Large: Story = {
  args: {
    name: 'Bob Jones',
    size: 'lg',
  },
}

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar name="Carol White" size="sm" />
      <Avatar name="Carol White" size="md" />
      <Avatar name="Carol White" size="lg" />
    </div>
  ),
}

export const ImageAllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar name="Carol White" src="https://i.pravatar.cc/150?img=5" size="sm" />
      <Avatar name="Carol White" src="https://i.pravatar.cc/150?img=5" size="md" />
      <Avatar name="Carol White" src="https://i.pravatar.cc/150?img=5" size="lg" />
    </div>
  ),
}
