import { useState } from 'react'
import { Modal, FormField, Input, Select, Button, Textarea } from '@fluent-kit/ui'
import {
  PLATFORM_OPTIONS,
  GROUP_OPTIONS,
  COUNTRY_OPTIONS,
  BROWSER_TYPE_OPTIONS,
  VERSION_OPTIONS,
} from './profile-form-options'

interface NewProfileModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface FormState {
  platform: string
  name: string
  group: string
  browserType: string
  version: string
  country: string
  tags: string
  note: string
  email: string
  password: string
  twoFactor: string
  recovery: string
  proxy: string
}

const INITIAL: FormState = {
  platform: '',
  name: '',
  group: '',
  browserType: '',
  version: '',
  country: '',
  tags: '',
  note: '',
  email: '',
  password: '',
  twoFactor: '',
  recovery: '',
  proxy: '',
}

export function NewProfileModal({ open, onOpenChange }: NewProfileModalProps) {
  const [form, setForm] = useState<FormState>(INITIAL)

  const set = (key: keyof FormState) => (value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const handleCreate = () => {
    console.log('create profile', form)
    setForm(INITIAL)
    onOpenChange(false)
  }

  const handleCancel = () => {
    setForm(INITIAL)
    onOpenChange(false)
  }

  const footer = (
    <>
      <Button variant="outline" onClick={handleCancel}>
        Cancel
      </Button>
      <Button variant="default" onClick={handleCreate}>
        Create
      </Button>
    </>
  )

  return (
    <Modal
      open={open}
      title="Create new profile"
      width={560}
      onCancel={handleCancel}
      footer={footer}
    >
      <div className="max-h-[60vh] overflow-y-auto pr-1">
        <div className="flex flex-col gap-[14px]">
          {/* Platform — full width */}
          <FormField label="Platform" required>
            <Select
              options={PLATFORM_OPTIONS}
              value={form.platform}
              onChange={(v) => set('platform')(v as string)}
              placeholder="Select platform"
              block
            />
          </FormField>

          {/* Name + Group */}
          <div className="grid grid-cols-2 gap-[14px]">
            <FormField label="Profile name" required>
              <Input
                placeholder="e.g. alpha_stog_01"
                value={form.name}
                onChange={(e) => set('name')(e.target.value)}
              />
            </FormField>
            <FormField label="Group">
              <Select
                options={GROUP_OPTIONS}
                value={form.group}
                onChange={(v) => set('group')(v as string)}
                placeholder="Select group"
                block
              />
            </FormField>
          </div>

          {/* Browser type + Version */}
          <div className="grid grid-cols-2 gap-[14px]">
            <FormField label="Browser type">
              <Select
                options={BROWSER_TYPE_OPTIONS}
                value={form.browserType}
                onChange={(v) => set('browserType')(v as string)}
                placeholder="Select browser"
                block
              />
            </FormField>
            <FormField label="Version">
              <Select
                options={VERSION_OPTIONS}
                value={form.version}
                onChange={(v) => set('version')(v as string)}
                placeholder="Select version"
                block
              />
            </FormField>
          </div>

          {/* Country — full width */}
          <FormField label="Country / Timezone">
            <Select
              options={COUNTRY_OPTIONS}
              value={form.country}
              onChange={(v) => set('country')(v as string)}
              placeholder="Select country"
              block
            />
          </FormField>

          {/* Tags — full width */}
          <FormField label="Tags">
            <Input
              placeholder="seller, main, vn…"
              value={form.tags}
              onChange={(e) => set('tags')(e.target.value)}
            />
          </FormField>

          {/* Note — full width */}
          <FormField label="Notes">
            <Textarea
              rows={2}
              placeholder="Anything teammates should know about this profile…"
              value={form.note}
              onChange={(e) => set('note')(e.target.value)}
            />
          </FormField>

          {/* Section divider */}
          <div className="flex items-center gap-2 my-1 text-caption font-semibold uppercase tracking-[0.5px] text-muted-foreground after:content-[''] after:flex-1 after:h-px after:bg-border">
            Account credentials{' '}
            <span className="font-normal normal-case tracking-normal">optional</span>
          </div>

          {/* Email + Password */}
          <div className="grid grid-cols-2 gap-[14px]">
            <FormField label="Email">
              <Input
                type="email"
                placeholder="user@example.com"
                value={form.email}
                onChange={(e) => set('email')(e.target.value)}
              />
            </FormField>
            <FormField label="Password">
              <Input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => set('password')(e.target.value)}
              />
            </FormField>
          </div>

          {/* 2FA + Recovery */}
          <div className="grid grid-cols-2 gap-[14px]">
            <FormField label="Two-factor (TOTP)">
              <Input
                placeholder="JBSWY3DPEHPK3PXP"
                value={form.twoFactor}
                onChange={(e) => set('twoFactor')(e.target.value)}
              />
            </FormField>
            <FormField label="Recovery">
              <Input
                placeholder="recovery@example.com"
                value={form.recovery}
                onChange={(e) => set('recovery')(e.target.value)}
              />
            </FormField>
          </div>

          {/* Proxy — full width */}
          <FormField label="Proxy">
            <Input
              placeholder="host:port:user:pass"
              value={form.proxy}
              onChange={(e) => set('proxy')(e.target.value)}
            />
          </FormField>
        </div>
      </div>
    </Modal>
  )
}
