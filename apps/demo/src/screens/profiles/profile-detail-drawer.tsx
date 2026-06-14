import { useState } from 'react'
import {
  Play, Edit3, KeyRound, MonitorSmartphone, Network, Globe,
  Flag, Activity, Database, History,
} from 'lucide-react'
import {
  DetailDrawer,
  Tabs, TabsList, TabsTrigger, TabsContent,
  DrawerSection, DrawerInfoRow,
  Tag, IconButton, Avatar,
} from '@fluent-kit/ui'
import { StatusPill } from '@/components/status-pill'
import { TotpDisplay } from './internal/totp-display'
import { AccountRawJson } from './internal/account-raw-json'
import type { ProfileRecord } from '@/mocks/fixtures/profiles.fixtures'

interface ProfileDetailDrawerProps {
  record: ProfileRecord | null
  onClose: () => void
}

const STATUS_LABEL: Record<ProfileRecord['status'], string> = {
  live: 'Live',
  die: 'Die',
  login_failed: 'Login Failed',
  pending: 'Pending',
}

const PLATFORM_LABEL: Record<ProfileRecord['platform'], string> = {
  google: 'Google',
  facebook: 'Facebook',
  twitter: 'Twitter',
}

const GROUP_TONE_COLOR: Record<ProfileRecord['groupTone'], string> = {
  purple: '#a855f7',
  orange: '#f97316',
  blue: '#3b82f6',
  green: '#22c55e',
  red: '#ef4444',
  cyan: '#06b6d4',
}

// Mock credentials — no real data in ProfileRecord
const MOCK_PASSWORD = 'S8BC2dWZTf'
const MOCK_RECOVERY = 'alice.recovery@gmail.com'
const MOCK_2FA = '3mp5 zst5 pox6 jgs7'
const MOCK_BROWSER = 'GPMLogin'
const MOCK_VERSION = '142.0.7444.163'

function DrawerHeader({ record }: { record: ProfileRecord }) {
  const proxyAddress =
    record.proxyType === 'inline' && record.proxy ? record.proxy : null

  return (
    <div className="px-5 pt-3.5 pb-3 flex items-start gap-3 border-b border-[var(--win11-card-border)] bg-gradient-to-b from-white/40 to-transparent dark:from-white/[0.02]">
      <Avatar
        name={record.name}
        size="md"
        className="shrink-0 mt-0.5 ring-1 ring-black/[0.06] shadow-[var(--win11-shadow)]"
      />

      <div className="flex-1 min-w-0 flex flex-col gap-1.5 pt-0.5">
        <span
          className="text-title font-semibold leading-tight text-foreground truncate"
          title={record.name}
        >
          {record.name}
        </span>

        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-caption text-muted-foreground">
            {PLATFORM_LABEL[record.platform]}
          </span>
          <StatusPill status={STATUS_LABEL[record.status]} />
          <Tag color={GROUP_TONE_COLOR[record.groupTone]}>{record.group}</Tag>
          {proxyAddress && (
            <button
              type="button"
              className="inline-flex items-center gap-[6px] text-caption font-medium py-[2px] px-2 rounded bg-[rgba(0,103,192,0.10)] text-primary border-none cursor-pointer max-w-[200px] transition-[background] duration-[120ms] hover:bg-[rgba(0,103,192,0.18)]"
              onClick={() => console.log('copy proxy', proxyAddress)}
              title={`${proxyAddress} — click to copy`}
            >
              <Globe size={11} className="shrink-0" />
              <span className="overflow-hidden text-ellipsis whitespace-nowrap">{proxyAddress}</span>
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0 self-start pt-0.5">
        <IconButton
          variant="launch"
          size="md"
          icon={<Play size={14} className="fill-current" />}
          aria-label={`Launch ${record.name}`}
          tooltip="Launch"
          onClick={() => console.log('launch', record.id)}
        />
        <IconButton
          variant="default"
          size="md"
          icon={<Edit3 size={14} />}
          aria-label={`Edit ${record.name}`}
          tooltip="Edit"
          onClick={() => console.log('edit', record.id)}
        />
      </div>
    </div>
  )
}

function TabAccount({ record }: { record: ProfileRecord }) {
  const mockAccount = {
    email: record.email,
    password: MOCK_PASSWORD,
    recovery: MOCK_RECOVERY,
    two_factor: MOCK_2FA,
    platform: record.platform,
    group: record.group,
  }

  return (
    <>
      <AccountRawJson value={mockAccount} />

      <DrawerSection icon={<KeyRound size={14} />} title="Credentials">
        <DrawerInfoRow label="Email" value={record.email} />
        <DrawerInfoRow label="Password" value={MOCK_PASSWORD} />
        <DrawerInfoRow label="Recovery" value={MOCK_RECOVERY} />
        <DrawerInfoRow
          label="2FA"
          value={MOCK_2FA}
          monospace
          footer={<TotpDisplay />}
        />
      </DrawerSection>

      <DrawerSection icon={<Flag size={14} />} title="Flags" padded>
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="inline-flex items-center gap-1 text-micro font-medium py-[2px] px-2 rounded border bg-primary/10 border-primary text-primary/90"
            aria-label="Registered"
          >
            ✓ is_register
          </span>
          <span
            className="inline-flex items-center gap-1 text-micro font-medium py-[2px] px-2 rounded border border-[var(--win11-control-border)] bg-[var(--win11-control-bg)] text-muted-foreground"
            aria-label="Login enabled"
          >
            × no_login
          </span>
        </div>
      </DrawerSection>

      <DrawerSection icon={<MonitorSmartphone size={14} />} title="Browser & Fingerprint">
        <DrawerInfoRow label="Browser" value={MOCK_BROWSER} />
        <DrawerInfoRow label="Version" value={MOCK_VERSION} />
        <DrawerInfoRow label="Country" value={null} />
        <DrawerInfoRow label="Platform" value={PLATFORM_LABEL[record.platform]} />
      </DrawerSection>

      <DrawerSection icon={<Network size={14} />} title="Proxy">
        {record.proxyType === 'inline' && record.proxy ? (
          <DrawerInfoRow label="Address" value={record.proxy} monospace />
        ) : (
          <div className="p-4">
            <span className="text-caption text-muted-foreground">No proxy assigned</span>
          </div>
        )}
      </DrawerSection>
    </>
  )
}

function EmptyTabState({ icon: Icon, label }: { icon: typeof Activity; label: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-14 gap-2.5 text-center">
      <div className="w-14 h-14 rounded-full bg-[var(--win11-hover)] flex items-center justify-center">
        <Icon size={26} strokeWidth={1.5} className="text-muted-foreground opacity-70" />
      </div>
      <p className="text-caption text-muted-foreground">No {label} data yet</p>
    </div>
  )
}

export function ProfileDetailDrawer({ record, onClose }: ProfileDetailDrawerProps) {
  const [activeTab, setActiveTab] = useState('account')

  return (
    <DetailDrawer
      open={record !== null}
      onOpenChange={(open) => { if (!open) onClose() }}
      title={record?.name ?? 'Profile detail'}
      side="right"
      width={480}
      header={record ? <DrawerHeader record={record} /> : undefined}
    >
      {record && (
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex flex-col h-full gap-0"
        >
          <TabsList
            variant="underline"
            className="px-4 border-b border-[var(--win11-card-border)] shrink-0"
          >
            <TabsTrigger value="account" variant="underline">Account</TabsTrigger>
            <TabsTrigger value="activity" variant="underline">Activity</TabsTrigger>
            <TabsTrigger value="sources" variant="underline">Sources</TabsTrigger>
            <TabsTrigger value="runs" variant="underline">Runs</TabsTrigger>
          </TabsList>

          <TabsContent value="account" className="p-5 space-y-3">
            <TabAccount record={record} />
          </TabsContent>

          <TabsContent value="activity" className="p-5 space-y-3">
            <EmptyTabState icon={Activity} label="activity" />
          </TabsContent>

          <TabsContent value="sources" className="p-5 space-y-3">
            <EmptyTabState icon={Database} label="sources" />
          </TabsContent>

          <TabsContent value="runs" className="p-5 space-y-3">
            <EmptyTabState icon={History} label="runs" />
          </TabsContent>
        </Tabs>
      )}
    </DetailDrawer>
  )
}
