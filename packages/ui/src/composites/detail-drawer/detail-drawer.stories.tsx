import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Button } from '../../primitives/button'
import { DetailDrawer } from './detail-drawer'

const meta: Meta<typeof DetailDrawer> = {
  title: 'Composites/DetailDrawer',
  component: DetailDrawer,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof DetailDrawer>

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Drawer</Button>
        <DetailDrawer
          open={open}
          onOpenChange={setOpen}
          title="User Profile"
          header={
            <div className="px-5 py-3 border-b font-semibold text-lg">
              User Profile
            </div>
          }
          footer={
            <div className="px-5 py-3 border-t flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button>Save</Button>
            </div>
          }
        >
          <div className="p-5 space-y-4">
            <p>Drawer body content goes here.</p>
            <p>Scroll or add more content as needed.</p>
          </div>
        </DetailDrawer>
      </>
    )
  },
}

export const NoHeaderFooter: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Simple Drawer</Button>
        <DetailDrawer
          open={open}
          onOpenChange={setOpen}
          title="Simple Drawer"
        >
          <div className="p-5">
            <p>Just body, no header or footer slots.</p>
          </div>
        </DetailDrawer>
      </>
    )
  },
}
