export interface UserRecord {
  id: string
  name: string
  email: string
  role: 'admin' | 'editor' | 'viewer'
  status: 'active' | 'inactive'
  joinedAt: string
  department: string
}

const ROLES = ['admin', 'editor', 'viewer'] as const
const DEPTS = ['Engineering', 'Design', 'Product', 'Marketing', 'Sales'] as const

export const USER_FIXTURES: UserRecord[] = Array.from({ length: 35 }, (_, i) => {
  const role = ROLES[i % 3] as UserRecord['role']
  const department = DEPTS[i % 5] as string
  return {
    id: `user-${i + 1}`,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    role,
    status: (i % 5 === 4 ? 'inactive' : 'active') as UserRecord['status'],
    joinedAt: new Date(2023, i % 12, (i % 28) + 1).toISOString(),
    department,
  }
})
