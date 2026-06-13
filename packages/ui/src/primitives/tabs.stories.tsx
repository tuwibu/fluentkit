import type { Meta, StoryObj } from '@storybook/react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from './tabs'

const meta: Meta = {
  title: 'Primitives/Tabs',
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
}
export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="account" className="w-80">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <p className="text-body p-2">Account settings content.</p>
      </TabsContent>
      <TabsContent value="password">
        <p className="text-body p-2">Password settings content.</p>
      </TabsContent>
    </Tabs>
  ),
}

export const Underline: Story = {
  render: () => (
    <Tabs defaultValue="overview" className="w-96">
      <TabsList variant="underline">
        <TabsTrigger value="overview" variant="underline">Overview</TabsTrigger>
        <TabsTrigger value="analytics" variant="underline">Analytics</TabsTrigger>
        <TabsTrigger value="settings" variant="underline">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <p className="text-body p-2">Overview content.</p>
      </TabsContent>
      <TabsContent value="analytics">
        <p className="text-body p-2">Analytics content.</p>
      </TabsContent>
      <TabsContent value="settings">
        <p className="text-body p-2">Settings content.</p>
      </TabsContent>
    </Tabs>
  ),
}
