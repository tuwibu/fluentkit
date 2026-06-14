import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Switch,
  Select,
  FormField,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Skeleton,
} from '@tuwibu/fluentkit'
import type { SelectOption } from '@tuwibu/fluentkit'
import { useSettings } from './use-settings'

const THEME_OPTIONS: SelectOption[] = [
  { label: 'System', value: 'system' },
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
]

const LANG_OPTIONS: SelectOption[] = [
  { label: 'English', value: 'en' },
  { label: 'Vietnamese', value: 'vi' },
  { label: 'Japanese', value: 'ja' },
]

const DIGEST_OPTIONS: SelectOption[] = [
  { label: 'Daily', value: 'daily' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Never', value: 'never' },
]

export function SettingsScreen() {
  const { query, saveMutation } = useSettings()
  const settings = query.data

  function patch(key: string, value: unknown) {
    saveMutation.mutate({ [key]: value })
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Settings</h1>

      {query.isError && (
        <div role="alert" className="mb-4 rounded-md bg-destructive/10 p-4 text-destructive">
          Failed to load settings.
        </div>
      )}

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-4">
          <Card>
            <CardHeader><CardTitle>Appearance & Language</CardTitle></CardHeader>
            <CardContent className="flex flex-col gap-4">
              {query.isLoading ? (
                <Skeleton className="h-20 w-full" />
              ) : (
                <>
                  <FormField label="Theme" htmlFor="s-theme">
                    <Select
                      options={THEME_OPTIONS}
                      value={settings?.theme}
                      onChange={(v) => patch('theme', v)}
                    />
                  </FormField>
                  <FormField label="Language" htmlFor="s-lang">
                    <Select
                      options={LANG_OPTIONS}
                      value={settings?.language}
                      onChange={(v) => patch('language', v)}
                    />
                  </FormField>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-4">
          <Card>
            <CardHeader><CardTitle>Notification Preferences</CardTitle></CardHeader>
            <CardContent className="flex flex-col gap-4">
              {query.isLoading ? (
                <Skeleton className="h-20 w-full" />
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <label htmlFor="s-notif" className="text-sm font-medium">
                      Enable notifications
                    </label>
                    <Switch
                      id="s-notif"
                      checked={settings?.notifications}
                      onCheckedChange={(v) => patch('notifications', v)}
                    />
                  </div>
                  <FormField label="Email digest" htmlFor="s-digest">
                    <Select
                      options={DIGEST_OPTIONS}
                      value={settings?.emailDigest}
                      onChange={(v) => patch('emailDigest', v)}
                    />
                  </FormField>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-4">
          <Card>
            <CardHeader><CardTitle>Security</CardTitle></CardHeader>
            <CardContent>
              {query.isLoading ? (
                <Skeleton className="h-12 w-full" />
              ) : (
                <div className="flex items-center justify-between">
                  <label htmlFor="s-2fa" className="text-sm font-medium">
                    Two-factor authentication
                  </label>
                  <Switch
                    id="s-2fa"
                    checked={settings?.twoFactor}
                    onCheckedChange={(v) => patch('twoFactor', v)}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
