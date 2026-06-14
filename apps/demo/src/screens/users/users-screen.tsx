'use client'

import { useMemo, useState } from 'react'
import { Trash2, Search } from 'lucide-react'
import { DataTable, BulkBar, Input, FilterSelect, Pagination, Modal, Button } from '@fluent-kit/ui'
import { useQueryClient } from '@tanstack/react-query'
import { apiDelete } from '@/lib/api-client'
import type { UserRecord } from '@/mocks/fixtures/users.fixtures'
import { useUsers } from './use-users'
import { createUsersColumns } from './users-columns'

const ROLE_OPTIONS = [
  { label: 'Admin', value: 'admin' },
  { label: 'Editor', value: 'editor' },
  { label: 'Viewer', value: 'viewer' },
]

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

  const [deleteTarget, setDeleteTarget] = useState<UserRecord | null>(null)
  const [bulkDeletePending, setBulkDeletePending] = useState(false)
  const queryClient = useQueryClient()

  const columns = useMemo(
    () => createUsersColumns((_id, record) => setDeleteTarget(record)),
    [],
  )

  const rows = query.data?.data ?? []
  const total = query.data?.total ?? 0

  return (
    <div className="flex flex-col h-full users-density">
      {query.isError && (
        <div
          role="alert"
          className="mb-2 rounded-md bg-destructive/10 p-3 text-destructive text-sm"
        >
          {query.error instanceof Error ? query.error.message : 'Failed to load users.'}
        </div>
      )}

      <div className="flex flex-col flex-1 overflow-hidden rounded-lg bg-[var(--win11-card-bg)] border border-[var(--win11-card-border)] backdrop-blur-xl">
        {/* Toolbar */}
        <div className="px-3 py-2 shrink-0 border-b border-[var(--win11-card-border)]">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Search */}
            <div className="w-52">
              <Input
                placeholder="Search name or email…"
                value={filters.search}
                onChange={(e) => handleFilterChange({ search: e.target.value })}
                prefix={<Search size={14} className="text-muted-foreground" />}
                allowClear
                size="middle"
              />
            </div>

            <div className="w-px h-6 self-center bg-[var(--win11-card-border)] shrink-0" aria-hidden />

            {/* Role filter */}
            <FilterSelect
              title="Role"
              options={ROLE_OPTIONS}
              value={filters.role || undefined}
              onChange={(v) => handleFilterChange({ role: (v as string | undefined) ?? '' })}
              mode="single"
              allLabel="All Roles"
              allowClear
            />

            <div className="flex-1" />
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-hidden">
          <DataTable<UserRecord>
            rowKey="id"
            columns={columns}
            dataSource={rows}
            loading={query.isLoading}
            pagination={false}
            bordered={false}
            rowSelection={{
              selectedRowKeys,
              onChange: (keys) => setSelectedRowKeys(keys as string[]),
            }}
            scroll={{ x: 900 }}
            emptyText="No users found."
          />
        </div>

        {/* Footer */}
        <div className="border-t border-[var(--win11-card-border)] px-3 py-1.5 shrink-0">
          <Pagination
            page={page}
            pageSize={pageSize}
            total={total}
            onPageChange={handlePageChange}
            showTotal
          />
        </div>
      </div>

      <BulkBar
        count={selectedRowKeys.length}
        onClose={() => setSelectedRowKeys([])}
        actions={[
          {
            key: 'delete',
            label: 'Delete',
            icon: <Trash2 size={13} />,
            danger: true,
            onClick: () => setBulkDeletePending(true),
          },
        ]}
      />

      {/* Row delete confirm */}
      <Modal
        open={deleteTarget !== null}
        title="Delete user?"
        onCancel={() => setDeleteTarget(null)}
        footer={
          <>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                if (!deleteTarget) return
                try {
                  await apiDelete(`/api/users/${deleteTarget.id}`)
                  await queryClient.invalidateQueries({ queryKey: ['users'] })
                } catch {
                  // error surfaced via query state on next load
                } finally {
                  setDeleteTarget(null)
                }
              }}
            >
              Delete
            </Button>
          </>
        }
      >
        <p>
          Are you sure you want to delete{' '}
          <strong className="font-semibold text-foreground">{deleteTarget?.name}</strong>? This
          action cannot be undone.
        </p>
      </Modal>

      {/* Bulk delete confirm */}
      <Modal
        open={bulkDeletePending}
        title={`Delete ${selectedRowKeys.length} user${selectedRowKeys.length !== 1 ? 's' : ''}?`}
        onCancel={() => setBulkDeletePending(false)}
        footer={
          <>
            <Button variant="outline" onClick={() => setBulkDeletePending(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                try {
                  await Promise.all(
                    selectedRowKeys.map((id) => apiDelete(`/api/users/${id}`)),
                  )
                  await queryClient.invalidateQueries({ queryKey: ['users'] })
                  setSelectedRowKeys([])
                } catch {
                  // error surfaced via query state on next load
                } finally {
                  setBulkDeletePending(false)
                }
              }}
            >
              Delete
            </Button>
          </>
        }
      >
        <p>
          Are you sure you want to delete{' '}
          <strong className="font-semibold text-foreground">{selectedRowKeys.length}</strong>{' '}
          selected user{selectedRowKeys.length !== 1 ? 's' : ''}? This action cannot be undone.
        </p>
      </Modal>
    </div>
  )
}
