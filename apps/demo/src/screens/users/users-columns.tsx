import type { ColumnDef } from '@fluent-kit/ui'
import { Badge } from '@fluent-kit/ui'
import type { UserRecord } from '@/mocks/fixtures/users.fixtures'

export const usersColumns: ColumnDef<UserRecord>[] = [
  {
    key: 'name',
    title: 'Name',
    dataIndex: 'name',
    sorter: (a, b) => a.name.localeCompare(b.name),
    ellipsis: true,
  },
  {
    key: 'email',
    title: 'Email',
    dataIndex: 'email',
    ellipsis: true,
  },
  {
    key: 'role',
    title: 'Role',
    dataIndex: 'role',
    render: (value: string) => (
      <Badge variant={value === 'admin' ? 'default' : 'secondary'}>{value}</Badge>
    ),
  },
  {
    key: 'department',
    title: 'Department',
    dataIndex: 'department',
  },
  {
    key: 'status',
    title: 'Status',
    dataIndex: 'status',
    render: (value: string) => (
      <Badge variant={value === 'active' ? 'default' : 'outline'}>{value}</Badge>
    ),
  },
  {
    key: 'joinedAt',
    title: 'Joined',
    dataIndex: 'joinedAt',
    render: (value: string) => new Date(value).toLocaleDateString(),
  },
]
