import type { Meta, StoryObj } from '@storybook/react'
import { FormField } from './form-field'

const meta: Meta<typeof FormField> = {
  title: 'Composites/FormField',
  component: FormField,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof FormField>

export const Default: Story = {
  args: {
    label: 'Email address',
    htmlFor: 'email',
    description: 'We will never share your email.',
    children: <input id="email" type="email" placeholder="you@example.com" className="border rounded px-2 py-1 w-full" />,
  },
}

export const Required: Story = {
  args: {
    label: 'Password',
    htmlFor: 'pw',
    required: true,
    children: <input id="pw" type="password" className="border rounded px-2 py-1 w-full" />,
  },
}

export const WithError: Story = {
  args: {
    label: 'Username',
    htmlFor: 'uname',
    required: true,
    error: 'Username is already taken.',
    children: <input id="uname" defaultValue="admin" className="border border-red-500 rounded px-2 py-1 w-full" />,
  },
}
