import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from './sheet'
import { Button } from './button'

const meta: Meta = {
  title: 'Primitives/Sheet',
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
}
export default meta
type Story = StoryObj

export const Right: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open right sheet</Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Edit Profile</SheetTitle>
          <SheetDescription>Make changes to your profile here.</SheetDescription>
        </SheetHeader>
        <div className="flex-1 p-4">
          <p className="text-body text-muted-foreground">Sheet content area.</p>
        </div>
        <SheetFooter>
          <Button variant="outline">Cancel</Button>
          <Button>Save changes</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
}

export const Left: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open left sheet</Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Navigation</SheetTitle>
          <SheetDescription>Left-side panel.</SheetDescription>
        </SheetHeader>
        <div className="flex-1 p-4">
          <p className="text-body text-muted-foreground">Navigation items here.</p>
        </div>
      </SheetContent>
    </Sheet>
  ),
}

export const Controlled: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    return (
      <div className="flex flex-col gap-2 items-center">
        <Button onClick={() => setOpen(true)}>Open controlled sheet</Button>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>Controlled Sheet</SheetTitle>
              <SheetDescription>Opened programmatically.</SheetDescription>
            </SheetHeader>
            <SheetFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Close</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    )
  },
}
