import type { Meta, StoryObj } from '@storybook/react'
import { Input } from './input'

const meta: Meta<typeof Input> = {
  title: 'Primitives/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    disabled: { control: 'boolean' },
    placeholder: { control: 'text' },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'search'],
    },
  },
}
export default meta
type Story = StoryObj<typeof Input>

export const Default: Story = {
  args: { placeholder: 'Enter text…', type: 'text' },
}

export const Email: Story = {
  args: { placeholder: 'you@example.com', type: 'email' },
}

export const Password: Story = {
  args: { placeholder: 'Password', type: 'password' },
}

export const Disabled: Story = {
  args: { placeholder: 'Disabled', disabled: true },
}

export const Invalid: Story = {
  args: { placeholder: 'Invalid', 'aria-invalid': 'true' as const },
}
