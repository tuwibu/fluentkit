import type { ColumnDef } from '@fluent-kit/ui'
import { Badge, IconButton } from '@fluent-kit/ui'
import { Trash2 } from 'lucide-react'
import type { UserRecord } from '@/mocks/fixtures/users.fixtures'

/** Keep legacy export for any existing import that uses it directly (backward compat). */
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

/** Factory variant — adds row-level delete action column. */
export function createUsersColumns(
  onDelete: (id: string, record: UserRecord) => void,
): ColumnDef<UserRecord>[] {
  return [
    ...usersColumns,
    {
      key: 'actions',
      title: '',
      width: 60,
      align: 'right',
      render: (_value: unknown, record: UserRecord) => (
        <IconButton
          variant="danger"
          size="sm"
          icon={<Trash2 size={13} />}
          aria-label={`Delete ${record.name}`}
          tooltip="Delete"
          onClick={(e) => {
            e.stopPropagation()
            onDelete(record.id, record)
          }}
        />
      ),
    },
  ]
}
