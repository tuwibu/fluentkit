import { useMemo, useState } from 'react'
import { Trash2, Globe } from 'lucide-react'
import { DataTable, BulkBar, Modal, Button } from '@tuwibu/fluentkit'
import type { ProfileRecord } from '@/mocks/fixtures/profiles.fixtures'
import { useProfiles } from './use-profiles'
import { createProfilesColumns } from './profiles-columns'
import { ProfilesToolbar } from './profiles-toolbar'
import { ProfilesFooter } from './profiles-footer'
import { NewProfileModal } from './new-profile-modal'
import { ProfileDetailDrawer } from './profile-detail-drawer'
import { AssignProxyModal } from './assign-proxy-modal'

export function ProfilesScreen() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<ProfileRecord | null>(null)
  const [detailRecord, setDetailRecord] = useState<ProfileRecord | null>(null)
  const [assignProxyTarget, setAssignProxyTarget] = useState<{ name: string; proxy?: string } | null>(null)
  const columns = useMemo(
    () => createProfilesColumns(setDeleteTarget, setDetailRecord),
    [],
  )

  const {
    query,
    page,
    pageSize,
    filters,
    selectedRowKeys,
    setSelectedRowKeys,
    handlePageChange,
    handleFilterChange,
  } = useProfiles()

  const rows = query.data?.data ?? []
  const total = query.data?.total ?? 0

  return (
    <div className="flex flex-col h-full profiles-density">
      {query.isError && (
        <div
          role="alert"
          className="mb-2 rounded-md bg-destructive/10 p-3 text-destructive text-sm"
        >
          {query.error instanceof Error ? query.error.message : 'Failed to load profiles.'}
        </div>
      )}

      {/* Card bọc toolbar + table + footer — parity dự án cũ */}
      <div className="flex flex-col flex-1 overflow-hidden rounded-lg bg-[var(--win11-card-bg)] border border-[var(--win11-card-border)] backdrop-blur-xl">
        {/* Toolbar */}
        <div className="px-3 py-2 shrink-0 border-b border-[var(--win11-card-border)]">
          <ProfilesToolbar
            filters={filters}
            onFilterChange={handleFilterChange}
            onRefresh={() => query.refetch()}
            onNewProfile={() => setDrawerOpen(true)}
          />
        </div>

        {/* Table — flat, card wrapper disabled */}
        <div className="flex-1 overflow-hidden">
          <DataTable<ProfileRecord>
            rowKey="id"
            columns={columns}
            dataSource={rows}
            loading={query.isLoading}
            pagination={false}
            bordered={false}
            rowSelection={{
              selectedRowKeys,
              onChange: (keys) => setSelectedRowKeys(keys),
            }}
            onRow={(record) => ({
              onClick: () => setDetailRecord(record),
            })}
            scroll={{ x: 980 }}
            emptyText="No profiles found."
            columnMenu={{ sort: true, pin: true, reorder: true, hide: true }}
          />
        </div>

        {/* Footer */}
        <ProfilesFooter
          page={page}
          pageSize={pageSize}
          total={total}
          onPageChange={handlePageChange}
        />
      </div>

      <NewProfileModal open={drawerOpen} onOpenChange={setDrawerOpen} />

      <ProfileDetailDrawer record={detailRecord} onClose={() => setDetailRecord(null)} />

      <AssignProxyModal
        open={assignProxyTarget !== null}
        target={assignProxyTarget ?? undefined}
        onOpenChange={(o) => { if (!o) setAssignProxyTarget(null) }}
      />

      {/* Delete confirm modal — parity với ConfirmDeleteDialog dự án cũ */}
      <Modal
        open={deleteTarget !== null}
        title="Delete profile?"
        onCancel={() => setDeleteTarget(null)}
        footer={
          <>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                console.log('delete', deleteTarget?.id)
                setDeleteTarget(null)
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

      <BulkBar
        count={selectedRowKeys.length}
        onClose={() => setSelectedRowKeys([])}
        actions={[
          {
            key: 'assign-proxy',
            label: 'Assign proxy',
            icon: <Globe size={13} />,
            onClick: () => setAssignProxyTarget({ name: `${selectedRowKeys.length} profiles` }),
          },
          {
            key: 'delete',
            label: 'Delete',
            icon: <Trash2 size={13} />,
            danger: true,
            onClick: () => {
              console.log('bulk delete', selectedRowKeys)
              setSelectedRowKeys([])
            },
          },
        ]}
      />
    </div>
  )
}
