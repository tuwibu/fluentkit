import type { Meta, StoryObj } from '@storybook/react'
import { Info, User, Shield, KeyRound } from 'lucide-react'
import { DrawerSection } from './drawer-section'
import { DrawerInfoRow } from './drawer-info-row'

const meta: Meta<typeof DrawerSection> = {
  title: 'Composites/DrawerSection',
  component: DrawerSection,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof DrawerSection>

export const Default: Story = {
  render: () => (
    <div className="w-[480px] space-y-3 p-4">
      <DrawerSection icon={<User size={14} />} title="Identity">
        <DrawerInfoRow label="Full name" value="Alice Johnson" />
        <DrawerInfoRow label="Email" value="alice@example.com" />
        <DrawerInfoRow label="User ID" value="usr_01j9k2m3n4p5q6r7s8t9u0v1" monospace />
      </DrawerSection>

      <DrawerSection icon={<Shield size={14} />} title="Security">
        <DrawerInfoRow label="Status" value="Active" />
        <DrawerInfoRow label="MFA" value="Enabled" />
      </DrawerSection>
    </div>
  ),
}

export const WithAction: Story = {
  render: () => (
    <div className="w-[480px] p-4">
      <DrawerSection
        icon={<Info size={14} />}
        title="Details"
        action={<button className="text-caption text-primary">Edit</button>}
      >
        <DrawerInfoRow label="Plan" value="Pro" />
        <DrawerInfoRow label="Created" value="2024-01-15" />
      </DrawerSection>
    </div>
  ),
}

export const WithCount: Story = {
  render: () => (
    <div className="w-[480px] p-4">
      <DrawerSection icon={<KeyRound size={14} />} title="Credentials" count={4}>
        <DrawerInfoRow label="Email" value="alice@example.com" />
        <DrawerInfoRow label="Password" value="S8BC2dWZTf" />
        <DrawerInfoRow label="Recovery" value="alice.backup@example.com" />
        <DrawerInfoRow label="2FA" value="3mp5 zst5 pox6 jgs7" monospace />
      </DrawerSection>
    </div>
  ),
}

export const Padded: Story = {
  render: () => (
    <div className="w-[480px] p-4">
      <DrawerSection title="Notes" padded>
        <p className="text-body text-muted-foreground">
          This section uses padded body — useful for free-form content like flag chips.
        </p>
      </DrawerSection>
    </div>
  ),
}

export const EmptyValue: Story = {
  render: () => (
    <div className="w-[480px] p-4">
      <DrawerSection title="Optional Fields">
        <DrawerInfoRow label="Country" value={null} />
        <DrawerInfoRow label="Phone" value={undefined} />
        <DrawerInfoRow label="Email" value="alice@example.com" />
      </DrawerSection>
    </div>
  ),
}

export const WithFooter: Story = {
  render: () => (
    <div className="w-[480px] p-4">
      <DrawerSection icon={<KeyRound size={14} />} title="Credentials">
        <DrawerInfoRow
          label="2FA"
          value="3mp5 zst5 pox6 jgs7"
          monospace
          footer={
            <div className="text-caption text-muted-foreground italic">
              TOTP countdown would appear here
            </div>
          }
        />
      </DrawerSection>
    </div>
  ),
}
