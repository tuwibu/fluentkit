import { DataTable } from '@fluent-kit/ui'
import type { UserRecord } from '@/mocks/fixtures/users.fixtures'
import { useUsers } from './use-users'
import { usersColumns } from './users-columns'
import { UsersFilters } from './users-filters'

export function UsersScreen() {
  const {
    query,
    page,
    pageSize,
    filters,
    selectedRowKeys,
    setSelectedRowKeys,
    handlePageChange,
    handleFilterChange,
  } = useUsers()

  const rows = query.data?.data ?? []
  const total = query.data?.total ?? 0

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Users</h1>

      {query.isError && (
        <div role="alert" className="mb-4 rounded-md bg-destructive/10 p-4 text-destructive">
          {query.error instanceof Error ? query.error.message : 'Failed to load users.'}
        </div>
      )}

      <UsersFilters
        search={filters.search}
        role={filters.role}
        onSearchChange={(v) => handleFilterChange({ search: v })}
        onRoleChange={(v) => handleFilterChange({ role: v })}
      />

      <DataTable<UserRecord>
        rowKey="id"
        columns={usersColumns}
        dataSource={rows}
        loading={query.isLoading}
        pagination={{
          current: page,
          pageSize,
          total,
          onChange: handlePageChange,
        }}
        rowSelection={{
          selectedRowKeys,
          onChange: (keys) => setSelectedRowKeys(keys),
        }}
        expandable={{
          expandedRowRender: (record) => (
            <div className="px-4 py-2 text-sm text-muted-foreground">
              <strong>Email:</strong> {record.email} &nbsp;|&nbsp;
              <strong>Dept:</strong> {record.department} &nbsp;|&nbsp;
              <strong>Joined:</strong> {new Date(record.joinedAt).toLocaleDateString()}
            </div>
          ),
        }}
        scroll={{ x: 900 }}
        emptyText="No users found."
      />

      {selectedRowKeys.length > 0 && (
        <p className="mt-3 text-sm text-muted-foreground" aria-live="polite">
          {selectedRowKeys.length} row(s) selected
        </p>
      )}
    </div>
  )
}
