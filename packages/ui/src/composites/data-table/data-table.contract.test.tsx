import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { DataTable } from './data-table'
import type { ColumnDef } from './data-table.types'

interface User {
  id: number
  name: string
  email: string
}

const columns: ColumnDef<User>[] = [
  { key: 'id', title: 'ID', dataIndex: 'id' },
  { key: 'name', title: 'Name', dataIndex: 'name' },
  { key: 'email', title: 'Email', dataIndex: 'email' },
]

const users: User[] = [
  { id: 1, name: 'Alice', email: 'alice@example.com' },
  { id: 2, name: 'Bob', email: 'bob@example.com' },
]

describe('DataTable — contract tests', () => {
  it('renders without crashing with minimal props', () => {
    render(<DataTable rowKey="id" columns={columns} dataSource={[]} />)
    expect(document.querySelector('[data-slot="data-table"]')).toBeInTheDocument()
  })

  it('renders thead with column titles', () => {
    render(<DataTable rowKey="id" columns={columns} dataSource={[]} />)
    expect(screen.getByText('ID')).toBeInTheDocument()
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Email')).toBeInTheDocument()
  })

  it('renders emptyText when dataSource is empty (default)', () => {
    render(<DataTable rowKey="id" columns={columns} dataSource={[]} />)
    const emptyCell = document.querySelector('[data-slot="data-table-empty"]')
    expect(emptyCell).toBeInTheDocument()
    expect(emptyCell).toHaveTextContent('No data')
  })

  it('renders custom emptyText when dataSource is empty', () => {
    render(
      <DataTable
        rowKey="id"
        columns={columns}
        dataSource={[]}
        emptyText="Nothing to display"
      />
    )
    expect(screen.getByText('Nothing to display')).toBeInTheDocument()
  })

  it('renders row data when dataSource has items', () => {
    render(<DataTable rowKey="id" columns={columns} dataSource={users} />)
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
  })

  it('does NOT render emptyText when dataSource has items', () => {
    render(<DataTable rowKey="id" columns={columns} dataSource={users} />)
    expect(document.querySelector('[data-slot="data-table-empty"]')).not.toBeInTheDocument()
  })

  it('renders loading state when loading=true', () => {
    render(<DataTable rowKey="id" columns={columns} dataSource={[]} loading={true} />)
    expect(document.querySelector('[data-slot="data-table-loading"]')).toBeInTheDocument()
  })

  it('renders loading state when loading={ skeletonRows: 3 }', () => {
    render(
      <DataTable
        rowKey="id"
        columns={columns}
        dataSource={[]}
        loading={{ skeletonRows: 3 }}
      />
    )
    expect(document.querySelector('[data-slot="data-table-loading"]')).toBeInTheDocument()
  })

  it('uses rowKey as function', () => {
    render(
      <DataTable
        rowKey={(r) => `user-${r.id}`}
        columns={columns}
        dataSource={users}
      />
    )
    expect(screen.getByText('Alice')).toBeInTheDocument()
  })

  it('calls render() for computed columns', () => {
    const renderCols: ColumnDef<User>[] = [
      { key: 'name', title: 'Name', dataIndex: 'name' },
      {
        key: 'computed',
        title: 'Upper',
        render: (_val, record) => record.name.toUpperCase(),
      },
    ]
    render(<DataTable rowKey="id" columns={renderCols} dataSource={users} />)
    expect(screen.getByText('ALICE')).toBeInTheDocument()
    expect(screen.getByText('BOB')).toBeInTheDocument()
  })
})
