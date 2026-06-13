import type { Meta, StoryObj } from '@storybook/react'
import { Textarea } from './textarea'

const meta: Meta<typeof Textarea> = {
  title: 'Primitives/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    disabled: { control: 'boolean' },
    placeholder: { control: 'text' },
  },
}
export default meta
type Story = StoryObj<typeof Textarea>

export const Default: Story = {
  args: { placeholder: 'Write something…', className: 'w-80' },
}

export const Disabled: Story = {
  args: { placeholder: 'Read only', disabled: true, className: 'w-80' },
}

export const Invalid: Story = {
  args: { placeholder: 'Error state', 'aria-invalid': 'true' as const, className: 'w-80' },
}
