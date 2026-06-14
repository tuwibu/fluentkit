import type { Meta, StoryObj } from '@storybook/react'
import { Copy, Trash2, ExternalLink } from 'lucide-react'
import { IconButton } from './icon-button'

const meta: Meta<typeof IconButton> = {
  title: 'Composites/IconButton',
  component: IconButton,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
}
export default meta
type Story = StoryObj<typeof IconButton>

export const Default: Story = {
  render: () => (
    <IconButton icon={<Copy size={16} />} aria-label="Copy" />
  ),
}

export const Outlined: Story = {
  render: () => (
    <IconButton icon={<Copy size={16} />} aria-label="Refresh" variant="outlined" tooltip="Refresh" />
  ),
}

export const Danger: Story = {
  render: () => (
    <IconButton icon={<Trash2 size={16} />} aria-label="Delete" variant="danger" />
  ),
}

export const Launch: Story = {
  render: () => (
    <IconButton icon={<ExternalLink size={16} />} aria-label="Open" variant="launch" />
  ),
}

export const WithTooltip: Story = {
  render: () => (
    <IconButton
      icon={<Copy size={16} />}
      aria-label="Copy to clipboard"
      tooltip="Copy to clipboard"
    />
  ),
}

export const Loading: Story = {
  render: () => (
    <IconButton icon={<Copy size={16} />} aria-label="Copying…" loading />
  ),
}

export const SmallSize: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <IconButton icon={<Copy size={14} />} aria-label="Copy sm" size="sm" />
      <IconButton icon={<Copy size={16} />} aria-label="Copy md" size="md" />
    </div>
  ),
}
