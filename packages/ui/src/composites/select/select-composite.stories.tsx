import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Globe, Star, Zap, Heart } from 'lucide-react'
import { SelectComposite } from './select-composite'

const meta: Meta<typeof SelectComposite> = {
  title: 'Composites/Select',
  component: SelectComposite,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
}
export default meta
type Story = StoryObj<typeof SelectComposite>

const OPTIONS = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
  { label: 'Durian (disabled)', value: 'durian', disabled: true },
]

export const Single: Story = {
  render: () => {
    const [val, setVal] = useState<string | undefined>(undefined)
    return (
      <div style={{ minWidth: 220 }}>
        <SelectComposite
          options={OPTIONS}
          value={val}
          onChange={(v) => setVal(v as string)}
          placeholder="Select a fruit"
          allowClear
        />
        <p style={{ marginTop: 8 }}>Selected: {val ?? '(none)'}</p>
      </div>
    )
  },
}

export const Multiple: Story = {
  render: () => {
    const [vals, setVals] = useState<string[]>([])
    return (
      <div style={{ minWidth: 220 }}>
        <SelectComposite
          options={OPTIONS}
          mode="multiple"
          value={vals}
          onChange={(v) => setVals(v as string[])}
          placeholder="Select fruits"
          allowClear
        />
        <p style={{ marginTop: 8 }}>Selected: {vals.join(', ') || '(none)'}</p>
      </div>
    )
  },
}

export const WithSearch: Story = {
  render: () => {
    const [val, setVal] = useState<string | undefined>(undefined)
    return (
      <div style={{ minWidth: 220 }}>
        <SelectComposite
          options={OPTIONS}
          value={val}
          onChange={(v) => setVal(v as string)}
          showSearch
          placeholder="Search fruits…"
        />
      </div>
    )
  },
}

export const Loading: Story = {
  args: {
    options: OPTIONS,
    loading: true,
    placeholder: 'Loading…',
  },
}

const OPTIONS_WITH_ICONS = [
  { label: 'Globe', value: 'globe', icon: <Globe className="size-4" /> },
  { label: 'Star', value: 'star', icon: <Star className="size-4" /> },
  { label: 'Zap', value: 'zap', icon: <Zap className="size-4" /> },
  { label: 'Heart (disabled)', value: 'heart', icon: <Heart className="size-4" />, disabled: true },
]

export const SingleWithIcons: Story = {
  render: () => {
    const [val, setVal] = useState<string | undefined>(undefined)
    return (
      <div style={{ minWidth: 220 }}>
        <SelectComposite
          options={OPTIONS_WITH_ICONS}
          value={val}
          onChange={(v) => setVal(v as string)}
          placeholder="Select icon…"
          allowClear
        />
        <p style={{ marginTop: 8 }}>Selected: {val ?? '(none)'}</p>
      </div>
    )
  },
}

const OPTIONS_COLORED = [
  { label: 'Red', value: 'red', color: '#ef4444' },
  { label: 'Green', value: 'green', color: '#22c55e' },
  { label: 'Blue', value: 'blue', color: '#3b82f6' },
  { label: 'Purple', value: 'purple', color: '#a855f7' },
]

export const SingleSearchableColored: Story = {
  render: () => {
    const [val, setVal] = useState<string | undefined>(undefined)
    return (
      <div style={{ minWidth: 220 }}>
        <SelectComposite
          options={OPTIONS_COLORED}
          value={val}
          onChange={(v) => setVal(v as string)}
          showSearch
          placeholder="Search color…"
          allowClear
        />
        <p style={{ marginTop: 8 }}>Selected: {val ?? '(none)'}</p>
      </div>
    )
  },
}
