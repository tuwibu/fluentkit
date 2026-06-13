export interface ProfileRecord {
  id: string
  name: string
  email: string
  group: string
  groupTone: 'purple' | 'orange' | 'blue' | 'green' | 'red' | 'cyan'
  platform: 'google' | 'facebook' | 'twitter'
  status: 'live' | 'die' | 'login_failed' | 'pending'
  proxyType: 'inline' | 'direct'
  proxy?: string
  tags: string[]
  lastF?: string
}

const GROUPS = [
  { name: 'Mail', tone: 'purple' },
  { name: 'Google Test', tone: 'orange' },
  { name: 'FB Ads', tone: 'blue' },
  { name: 'Dev', tone: 'green' },
  { name: 'Archive', tone: 'red' },
  { name: 'Alpha', tone: 'cyan' },
] as const

const STATUSES: ProfileRecord['status'][] = ['live', 'die', 'login_failed', 'pending']
const PLATFORMS: ProfileRecord['platform'][] = ['google', 'facebook', 'twitter']

const FIRST_NAMES = [
  'Alice', 'Bob', 'Carol', 'Dave', 'Eve', 'Frank', 'Grace', 'Hank',
  'Iris', 'Jack', 'Kate', 'Leo', 'Mia', 'Nick', 'Olivia', 'Paul',
  'Quinn', 'Rosa', 'Sam', 'Tina', 'Uma', 'Vince', 'Wendy', 'Xander',
  'Yara', 'Zoe', 'Adam', 'Beth', 'Carl', 'Diana',
]

const LAST_NAMES = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller',
  'Davis', 'Wilson', 'Taylor', 'Anderson', 'Thomas', 'Jackson', 'White',
]

function proxyStr(i: number) {
  return `103.${(i * 7) % 255}.${(i * 13) % 255}.${(i * 3) % 255}:${8000 + (i % 1000)}:user${i}:pass${i}abc`
}

export const PROFILE_FIXTURES: ProfileRecord[] = Array.from({ length: 35 }, (_, i) => {
  const firstName = FIRST_NAMES[i % FIRST_NAMES.length] ?? 'User'
  const lastName = LAST_NAMES[i % LAST_NAMES.length] ?? 'Test'
  const name = `${firstName} ${lastName}`
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i + 1}@gmail.com`
  const group = GROUPS[i % GROUPS.length] ?? GROUPS[0]
  const status = STATUSES[i % 4] as ProfileRecord['status']
  const platform = PLATFORMS[i % 3] as ProfileRecord['platform']
  const isInline = i % 3 !== 0
  const lastF =
    i % 5 === 0
      ? undefined
      : `${((i * 7) % 23) + 1}h ago`

  return {
    id: `profile-${i + 1}`,
    name,
    email,
    group: group.name,
    groupTone: group.tone,
    platform,
    status,
    proxyType: isInline ? 'inline' : 'direct',
    proxy: isInline ? proxyStr(i + 1) : undefined,
    tags: i % 4 === 0 ? ['vip', 'seed'] : i % 3 === 0 ? ['warmup'] : [],
    lastF,
  }
})
