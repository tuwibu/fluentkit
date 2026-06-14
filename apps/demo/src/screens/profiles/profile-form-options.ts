import type { SelectOption } from '@tuwibu/fluentkit'

export const PLATFORM_OPTIONS: SelectOption[] = [
  { label: 'Google', value: 'google' },
  { label: 'Facebook', value: 'facebook' },
  { label: 'TikTok', value: 'tiktok' },
  { label: 'Twitter / X', value: 'twitter' },
  { label: 'Amazon', value: 'amazon' },
]

export const GROUP_OPTIONS: SelectOption[] = [
  { label: 'Group A', value: 'group_a' },
  { label: 'Group B', value: 'group_b' },
  { label: 'Group C', value: 'group_c' },
  { label: 'Ungrouped', value: '__none__' },
]

export const COUNTRY_OPTIONS: SelectOption[] = [
  { label: 'United States', value: 'us' },
  { label: 'Vietnam', value: 'vn' },
  { label: 'United Kingdom', value: 'gb' },
  { label: 'Germany', value: 'de' },
  { label: 'Japan', value: 'jp' },
]

export const BROWSER_TYPE_OPTIONS: SelectOption[] = [
  { label: 'Chrome', value: 'chrome' },
  { label: 'Firefox', value: 'firefox' },
  { label: 'Edge', value: 'edge' },
]

export const VERSION_OPTIONS: SelectOption[] = [
  { label: 'Latest', value: 'latest' },
  { label: '124', value: '124' },
  { label: '123', value: '123' },
  { label: '122', value: '122' },
]
