import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Switch } from './switch'
import { Label } from './label'

const meta: Meta<typeof Switch> = {
  title: 'Primitives/Switch',
  component: Switch,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: { disabled: { control: 'boolean' } },
}
export default meta
type Story = StoryObj<typeof Switch>

export const Default: Story = { args: { 'aria-label': 'Toggle' } }
export const Checked: Story = { args: { checked: true, 'aria-label': 'On' } }
export const Disabled: Story = { args: { disabled: true, 'aria-label': 'Disabled' } }

export const WithLabel: Story = {
  render: () => {
    const [on, setOn] = useState(false)
    return (
      <div className="flex items-center gap-2">
        <Switch id="darkmode" checked={on} onCheckedChange={setOn} />
        <Label htmlFor="darkmode">Dark mode</Label>
      </div>
    )
  },
}
