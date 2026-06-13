import { useState, useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Modal, Tabs, TabsList, TabsTrigger, TabsContent, FormField, Input, Button } from '@fluent-kit/ui'

interface AssignProxyModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  target?: { name: string; proxy?: string }
}

type Tab = 'raw' | 'remove'

export function AssignProxyModal({ open, onOpenChange, target }: AssignProxyModalProps) {
  const [tab, setTab] = useState<Tab>('raw')
  const [rawValue, setRawValue] = useState('')

  useEffect(() => {
    if (!open) {
      setTab('raw')
      setRawValue('')
    }
  }, [open])

  const hasProxy = !!target?.proxy && target.proxy.trim() !== ''

  const handleCancel = () => onOpenChange(false)

  const handleAssign = () => {
    console.log('assign proxy', { target: target?.name, proxy: rawValue })
    onOpenChange(false)
  }

  const handleRemove = () => {
    console.log('remove proxy', { target: target?.name })
    onOpenChange(false)
  }

  const footer =
    tab === 'raw' ? (
      <>
        <Button variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
        <Button variant="default" disabled={rawValue.trim() === ''} onClick={handleAssign}>
          Assign
        </Button>
      </>
    ) : (
      <>
        <Button variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
        <Button variant="destructive" disabled={!hasProxy} onClick={handleRemove}>
          Remove
        </Button>
      </>
    )

  return (
    <Modal
      open={open}
      title={`Update proxy — ${target?.name ?? 'profiles'}`}
      width={480}
      onCancel={handleCancel}
      footer={footer}
    >
      <Tabs value={tab} onValueChange={(v) => setTab(v as Tab)}>
        <TabsList variant="underline" className="mb-4">
          <TabsTrigger value="raw" variant="underline">
            Raw string
          </TabsTrigger>
          <TabsTrigger value="remove" variant="underline">
            Remove
          </TabsTrigger>
        </TabsList>

        <TabsContent value="raw">
          <FormField label="Proxy string">
            <Input
              placeholder="host:port:user:pass"
              maxLength={512}
              value={rawValue}
              onChange={(e) => setRawValue(e.target.value)}
            />
          </FormField>
        </TabsContent>

        <TabsContent value="remove">
          <div className="flex flex-col gap-[10px]">
            <div
              className="flex items-start gap-2 text-caption rounded-[6px] px-[10px] py-[8px]"
              style={{ color: '#b45309', background: '#fffbeb', border: '1px solid #fde68a' }}
            >
              <AlertTriangle size={14} className="mt-[1px] shrink-0" />
              <span>
                This will clear the assigned proxy from the selected profile(s). Action is
                reversible by re-assigning a proxy later.
              </span>
            </div>
            <div className="rounded-md border border-border bg-[var(--win11-card-bg)] px-3 py-2 flex items-start gap-2">
              <span className="text-muted-foreground text-body shrink-0">Current proxy</span>
              <span className="font-mono text-body break-all text-foreground">
                {target?.proxy ?? 'No proxy'}
              </span>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Modal>
  )
}
