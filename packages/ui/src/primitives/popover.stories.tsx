import type { Meta, StoryObj } from '@storybook/react'
import { Popover, PopoverTrigger, PopoverContent } from './popover'
import { Button } from './button'

const meta: Meta = {
  title: 'Primitives/Popover',
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
}
export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open popover</Button>
      </PopoverTrigger>
      <PopoverContent>
        <p className="text-body font-medium">Popover title</p>
        <p className="text-caption text-muted-foreground mt-1">
          This is the popover content area.
        </p>
      </PopoverContent>
    </Popover>
  ),
}
