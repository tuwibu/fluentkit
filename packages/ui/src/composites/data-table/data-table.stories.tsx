import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { DataTable } from './data-table'
import type { ColumnDef } from './data-table.types'

// ── Shared fixture data ──────────────────────────────────────────────────────

interface Employee {
  id: string
  name: string
  department: string
  role: string
  salary: number
}

const EMPLOYEES: Employee[] = [
  { id: 'e1', name: 'Alice Chen', department: 'Engineering', role: 'Senior Engineer', salary: 120000 },
  { id: 'e2', name: 'Bob Kim', department: 'Design', role: 'UX Designer', salary: 95000 },
  { id: 'e3', name: 'Carol Wang', department: 'Engineering', role: 'Tech Lead', salary: 145000 },
  { id: 'e4', name: 'David Park', department: 'Product', role: 'Product Manager', salary: 110000 },
  { id: 'e5', name: 'Eva Martinez', department: 'Engineering', role: 'Engineer', salary: 100000 },
]

const COLUMNS: ColumnDef<Employee>[] = [
  { key: 'name', title: 'Name', dataIndex: 'name', sorter: true },
  { key: 'department', title: 'Department', dataIndex: 'department' },
  { key: 'role', title: 'Role', dataIndex: 'role' },
  {
    key: 'salary',
    title: 'Salary',
    dataIndex: 'salary',
    align: 'right',
    sorter: (a, b) => a.salary - b.salary,
    render: (val: number) => `$${val.toLocaleString()}`,
  },
]

// ── Meta ─────────────────────────────────────────────────────────────────────

const meta: Meta<typeof DataTable> = {
  title: 'Composites/DataTable',
  component: DataTable,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}
export default meta

type Story = StoryObj<typeof DataTable>

// ── Default ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => (
    <DataTable<Employee>
      rowKey="id"
      columns={COLUMNS}
      dataSource={EMPLOYEES}
    />
  ),
}

// ── Loading ───────────────────────────────────────────────────────────────────

export const Loading: Story = {
  render: () => (
    <DataTable<Employee>
      rowKey="id"
      columns={COLUMNS}
      dataSource={[]}
      loading={{ skeletonRows: 5 }}
    />
  ),
}

// ── Empty ─────────────────────────────────────────────────────────────────────

export const Empty: Story = {
  render: () => (
    <DataTable<Employee>
      rowKey="id"
      columns={COLUMNS}
      dataSource={[]}
      emptyText="No employees found. Try adjusting your filters."
    />
  ),
}

// ── WithPagination ────────────────────────────────────────────────────────────

export const WithPagination: Story = {
  render: function PaginatedStory() {
    const [page, setPage] = useState(1)
    const pageSize = 2
    const start = (page - 1) * pageSize
    const pageData = EMPLOYEES.slice(start, start + pageSize)

    return (
      <DataTable<Employee>
        rowKey="id"
        columns={COLUMNS}
        dataSource={pageData}
        pagination={{
          current: page,
          pageSize,
          total: EMPLOYEES.length,
          onChange: (p) => setPage(p),
        }}
      />
    )
  },
}

// ── WithSelection ─────────────────────────────────────────────────────────────

export const WithSelection: Story = {
  render: function SelectionStory() {
    const [selectedKeys, setSelectedKeys] = useState<string[]>([])

    return (
      <div className="flex flex-col gap-4">
        <DataTable<Employee>
          rowKey="id"
          columns={COLUMNS}
          dataSource={EMPLOYEES}
          rowSelection={{
            selectedRowKeys: selectedKeys,
            onChange: (keys) => setSelectedKeys(keys),
          }}
        />
        <p className="text-sm text-muted-foreground">
          Selected: {selectedKeys.length > 0 ? selectedKeys.join(', ') : 'none'}
        </p>
      </div>
    )
  },
}

// ── WithExpandable ────────────────────────────────────────────────────────────

export const WithExpandable: Story = {
  render: () => (
    <DataTable<Employee>
      rowKey="id"
      columns={COLUMNS}
      dataSource={EMPLOYEES}
      expandable={{
        expandedRowRender: (record) => (
          <div className="px-4 py-2 text-sm text-muted-foreground">
            <strong>{record.name}</strong> — {record.role} in {record.department}.
            Annual salary: ${record.salary.toLocaleString()}.
          </div>
        ),
        rowExpandable: (record) => record.department === 'Engineering',
      }}
    />
  ),
}
