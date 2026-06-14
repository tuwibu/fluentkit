/**
 * Domain-specific preset options for the profiles toolbar filters.
 * Platform brand colors + status tones are demo-specific — lib stays generic.
 */
import type { ReactNode } from 'react'
import { SiFacebook, SiGoogle, SiX } from 'react-icons/si'
import type { SelectOption } from '@fluent-kit/ui'
import { getTagColor } from '@fluent-kit/ui'
import { PROFILE_FIXTURES } from '@/mocks/fixtures/profiles.fixtures'

// ---- Platform ----------------------------------------------------------------

function PlatformIcon({ children, color }: { children: ReactNode; color: string }) {
  return <span style={{ color, display: 'flex', alignItems: 'center' }}>{children}</span>
}

export const PLATFORM_OPTIONS: SelectOption[] = [
  {
    label: 'Google',
    value: 'google',
    icon: (
      <PlatformIcon color="#4285F4">
        <SiGoogle size={13} />
      </PlatformIcon>
    ),
  },
  {
    label: 'Facebook',
    value: 'facebook',
    icon: (
      <PlatformIcon color="#1877F2">
        <SiFacebook size={13} />
      </PlatformIcon>
    ),
  },
  {
    label: 'Twitter / X',
    value: 'twitter',
    icon: (
      <PlatformIcon color="currentColor">
        <SiX size={12} />
      </PlatformIcon>
    ),
  },
]

// ---- Status ------------------------------------------------------------------

export const STATUS_OPTIONS: SelectOption[] = [
  { label: 'Live',         value: 'live',         color: '#10b981' },
  { label: 'Die',          value: 'die',          color: '#ef4444' },
  { label: 'Login Failed', value: 'login_failed', color: '#f43f5e' },
  { label: 'Pending',      value: 'pending',      color: '#f59e0b' },
]

// ---- Country -----------------------------------------------------------------

const COUNTRY_META: Record<string, { flag: string; name: string }> = {
  us: { flag: '🇺🇸', name: 'United States' },
  vn: { flag: '🇻🇳', name: 'Vietnam' },
  jp: { flag: '🇯🇵', name: 'Japan' },
  gb: { flag: '🇬🇧', name: 'United Kingdom' },
  de: { flag: '🇩🇪', name: 'Germany' },
}

export const COUNTRY_OPTIONS: SelectOption[] = Object.entries(COUNTRY_META).map(
  ([code, { flag, name }]) => ({
    label: `${flag} ${name}`,
    value: code,
  }),
)

// ---- Tags --------------------------------------------------------------------

export const TAG_OPTIONS: SelectOption[] = Array.from(
  new Set(PROFILE_FIXTURES.flatMap((p) => p.tags)),
).map((tag) => ({ label: tag, value: tag, color: getTagColor(tag) }))

// ---- Sort --------------------------------------------------------------------

export const SORT_OPTIONS: SelectOption[] = [
  { label: 'Name (A → Z)',     value: 'name_asc' },
  { label: 'Name (Z → A)',     value: 'name_desc' },
  { label: 'Created (newest)', value: 'created_desc' },
  { label: 'Created (oldest)', value: 'created_asc' },
  { label: 'Status',           value: 'status' },
]
