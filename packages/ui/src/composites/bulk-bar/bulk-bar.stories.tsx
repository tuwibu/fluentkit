import type { Meta, StoryObj } from '@storybook/react'
import { Pencil, Trash2 } from 'lucide-react'
import { BulkBar } from './bulk-bar'

const meta: Meta<typeof BulkBar> = {
  title: 'Composites/BulkBar',
  component: BulkBar,
  parameters: { layout: 'centered' },
}

export default meta
type Story = StoryObj<typeof BulkBar>

export const WithActions: Story = {
  args: {
    count: 3,
    actions: [
      { key: 'edit', label: 'Edit', icon: <Pencil size={12} />, onClick: () => {} },
      {
        key: 'delete',
        label: 'Delete',
        icon: <Trash2 size={13} />,
        danger: true,
        onClick: () => {},
      },
    ],
    onClose: () => {},
  },
}

export const Hidden: Story = {
  args: {
    count: 0,
    actions: [
      { key: 'edit', label: 'Edit', icon: <Pencil size={12} />, onClick: () => {} },
    ],
    onClose: () => {},
  },
}

export const LoadingAction: Story = {
  args: {
    count: 2,
    actions: [
      {
        key: 'delete',
        label: 'Delete',
        icon: <Trash2 size={13} />,
        danger: true,
        loading: true,
        onClick: () => {},
      },
    ],
    onClose: () => {},
  },
}
