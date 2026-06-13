import { DataTable, Button, Modal } from '@fluent-kit/ui'
import { useQuery } from '@tanstack/react-query'
import { apiGetList } from '@/lib/api-client'
import type { UserRecord } from '@/mocks/fixtures/users.fixtures'
import { usersColumns } from '../users/users-columns'
import { useFormDrawer } from './use-form-drawer'
import { UserFormDrawer } from './user-form-drawer'
import type { UsersListResponse } from '../users/use-users'

export function FormDrawerScreen() {
  const {
    drawerMode,
    editTarget,
    deleteTarget,
    setDeleteTarget,
    openCreate,
    openEdit,
    closeDrawer,
    createMutation,
    updateMutation,
    deleteMutation,
  } = useFormDrawer()

  const query = useQuery<UsersListResponse>({
    queryKey: ['users', 1, 10, {}],
    queryFn: () => apiGetList<UsersListResponse>('/api/users?page=1&pageSize=10'),
  })

  const rows = query.data?.data ?? []

  const actionColumns = [
    ...usersColumns,
    {
      key: 'actions',
      title: 'Actions',
      render: (_: unknown, record: UserRecord) => (
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => openEdit(record)}>Edit</Button>
          <Button size="sm" variant="destructive" onClick={() => setDeleteTarget(record)}>
            Delete
          </Button>
        </div>
      ),
    },
  ]

  const mutationError =
    createMutation.error instanceof Error
      ? createMutation.error.message
      : updateMutation.error instanceof Error
        ? updateMutation.error.message
        : null

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">User Management (CRUD)</h1>
        <Button onClick={openCreate}>+ New User</Button>
      </div>

      {query.isError && (
        <div role="alert" className="mb-4 rounded-md bg-destructive/10 p-4 text-destructive">
          Failed to load users.
        </div>
      )}

      <DataTable<UserRecord>
        rowKey="id"
        columns={actionColumns}
        dataSource={rows}
        loading={query.isLoading}
        pagination={false}
        scroll={{ x: 1000 }}
      />

      <UserFormDrawer
        open={drawerMode !== null}
        mode={drawerMode ?? 'create'}
        initial={editTarget}
        loading={createMutation.isPending || updateMutation.isPending}
        error={mutationError}
        onClose={closeDrawer}
        onSubmit={(data) => {
          if (drawerMode === 'create') createMutation.mutate(data)
          else if (editTarget) updateMutation.mutate({ id: editTarget.id, data })
        }}
      />

      <Modal
        open={deleteTarget !== null}
        title="Confirm Delete"
        okText="Delete"
        cancelText="Cancel"
        confirmLoading={deleteMutation.isPending}
        onOk={() => { if (deleteTarget) deleteMutation.mutate(deleteTarget.id) }}
        onCancel={() => setDeleteTarget(null)}
      >
        <p>Are you sure you want to delete <strong>{deleteTarget?.name}</strong>?</p>
      </Modal>
    </div>
  )
}
