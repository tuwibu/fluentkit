import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { InputComposite } from './input-composite'

const meta: Meta<typeof InputComposite> = {
  title: 'Composites/Input',
  component: InputComposite,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
}
export default meta
type Story = StoryObj<typeof InputComposite>

export const Basic: Story = {
  args: {
    placeholder: 'Enter text…',
  },
}

export const WithPrefixSuffix: Story = {
  args: {
    prefix: '$',
    suffix: '.00',
    placeholder: '0',
    type: 'number',
  },
}

export const WithAddon: Story = {
  args: {
    addonBefore: 'https://',
    addonAfter: '.com',
    placeholder: 'example',
  },
}

export const AllowClear: Story = {
  render: () => {
    const [value, setValue] = useState('Clear me!')
    return (
      <InputComposite
        value={value}
        onChange={(e) => setValue(e.target.value)}
        allowClear
        placeholder="Type something…"
      />
    )
  },
}

export const ErrorStatus: Story = {
  args: {
    value: 'invalid@',
    status: 'error',
    placeholder: 'Email',
  },
}

export const Disabled: Story = {
  args: {
    value: 'Cannot edit',
    disabled: true,
  },
}
