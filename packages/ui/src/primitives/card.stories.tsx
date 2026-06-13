import type { Meta, StoryObj } from '@storybook/react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './card'
import { Button } from './button'

const meta: Meta<typeof Card> = {
  title: 'Primitives/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
}
export default meta
type Story = StoryObj<typeof Card>

export const Default: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Short description of the card content.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-body">Main content goes here.</p>
      </CardContent>
      <CardFooter className="justify-end">
        <Button size="sm">Action</Button>
      </CardFooter>
    </Card>
  ),
}

export const Simple: Story = {
  args: { children: 'Simple card content', className: 'w-64 p-4' },
}
