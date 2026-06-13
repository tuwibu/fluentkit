import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './button'

const meta: Meta<typeof Button> = {
  title: 'Primitives/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon', 'icon-sm', 'icon-lg'],
    },
    disabled: { control: 'boolean' },
  },
}
export default meta
type Story = StoryObj<typeof Button>

export const Default: Story = { args: { children: 'Click me', variant: 'default' } }
export const Destructive: Story = { args: { children: 'Delete', variant: 'destructive' } }
export const Outline: Story = { args: { children: 'Cancel', variant: 'outline' } }
export const Ghost: Story = { args: { children: 'Ghost', variant: 'ghost' } }
export const Small: Story = { args: { children: 'Small', size: 'sm' } }
export const Large: Story = { args: { children: 'Large', size: 'lg' } }
export const Disabled: Story = { args: { children: 'Disabled', disabled: true } }

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      {(['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'] as const).map(
        (v) => <Button key={v} variant={v}>{v}</Button>,
      )}
    </div>
  ),
}

export const AsLink: Story = {
  render: () => (
    <Button asChild>
      <a href="#">Link styled as button</a>
    </Button>
  ),
}
