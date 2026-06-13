import { describe, it, expectTypeOf } from 'vitest'
import type { ColumnDef, DataTableProps, PaginationConfig } from './data-table.types'

// ---------------------------------------------------------------------------
// Fixture row type used across all assertions
// ---------------------------------------------------------------------------
interface User {
  id: number
  name: string
  email: string
}

// ---------------------------------------------------------------------------
// ColumnDef<T>
// ---------------------------------------------------------------------------
describe('ColumnDef<User>', () => {
  it('accepts a valid column with dataIndex', () => {
    const col: ColumnDef<User> = {
      key: 'name',
      title: 'Name',
      dataIndex: 'name',
    }
    expectTypeOf(col).toMatchTypeOf<ColumnDef<User>>()
  })

  it('accepts a render function with correct signature', () => {
    const col: ColumnDef<User> = {
      key: 'name',
      title: 'Name',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (value: any, record: User, index: number) => `${value}-${record.id}-${index}`,
    }
    expectTypeOf(col.render).toMatchTypeOf<
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ((value: any, record: User, index: number) => React.ReactNode) | undefined
    >()
  })

  it('rejects render with wrong record type', () => {
    // Verify render signature is (value: any, record: T, index: number).
    // A function accepting `record: string` is not assignable to ColumnDef<User>.render.
    type RenderFn = NonNullable<ColumnDef<User>['render']>
    type Param1 = Parameters<RenderFn>[1]
    // record param must be User — string is not assignable to User
    expectTypeOf<string>().not.toMatchTypeOf<Param1>()
  })

  it('accepts boolean sorter', () => {
    const col: ColumnDef<User> = { key: 'k', title: 'T', sorter: true }
    expectTypeOf(col.sorter).toMatchTypeOf<boolean | ((a: User, b: User) => number) | undefined>()
  })

  it('accepts function sorter', () => {
    const col: ColumnDef<User> = {
      key: 'k',
      title: 'T',
      sorter: (a, b) => a.id - b.id,
    }
    expectTypeOf(col.sorter).toMatchTypeOf<boolean | ((a: User, b: User) => number) | undefined>()
  })

  it('rejects unknown dataIndex', () => {
    // dataIndex must be keyof T — 'unknown_field' is not keyof User
    type DataIndexType = ColumnDef<User>['dataIndex']
    expectTypeOf<'unknown_field'>().not.toMatchTypeOf<DataIndexType>()
  })
})

// ---------------------------------------------------------------------------
// DataTableProps<T>
// ---------------------------------------------------------------------------
describe('DataTableProps<User>', () => {
  it('accepts rowKey as keyof T', () => {
    const props: DataTableProps<User> = {
      rowKey: 'id',
      columns: [],
      dataSource: [],
    }
    expectTypeOf(props.rowKey).toMatchTypeOf<keyof User | ((record: User) => string)>()
  })

  it('accepts rowKey as function', () => {
    const props: DataTableProps<User> = {
      rowKey: (record) => String(record.id),
      columns: [],
      dataSource: [],
    }
    expectTypeOf(props.rowKey).toMatchTypeOf<keyof User | ((record: User) => string)>()
  })

  it('rejects rowKey as arbitrary string not in User', () => {
    // 'nonexistent' is not keyof User — verify via type utility
    type RowKeyType = DataTableProps<User>['rowKey']
    // keyof User = 'id' | 'name' | 'email' — 'nonexistent' must not be assignable
    expectTypeOf<'nonexistent'>().not.toMatchTypeOf<RowKeyType>()
  })

  it('accepts pagination as config object', () => {
    const pagination: PaginationConfig = {
      current: 1,
      pageSize: 20,
      total: 100,
      onChange: (_page, _size) => {},
    }
    const props: DataTableProps<User> = {
      rowKey: 'id',
      columns: [],
      dataSource: [],
      pagination,
    }
    expectTypeOf(props.pagination).toMatchTypeOf<PaginationConfig | false | undefined>()
  })

  it('accepts pagination as false', () => {
    const props: DataTableProps<User> = {
      rowKey: 'id',
      columns: [],
      dataSource: [],
      pagination: false,
    }
    expectTypeOf(props.pagination).toMatchTypeOf<PaginationConfig | false | undefined>()
  })

  it('accepts loading as boolean', () => {
    const props: DataTableProps<User> = { rowKey: 'id', columns: [], dataSource: [], loading: true }
    expectTypeOf(props.loading).toMatchTypeOf<boolean | { skeletonRows?: number } | undefined>()
  })

  it('accepts loading as object with skeletonRows', () => {
    const props: DataTableProps<User> = {
      rowKey: 'id',
      columns: [],
      dataSource: [],
      loading: { skeletonRows: 5 },
    }
    expectTypeOf(props.loading).toMatchTypeOf<boolean | { skeletonRows?: number } | undefined>()
  })

  it('accepts expandable config', () => {
    const props: DataTableProps<User> = {
      rowKey: 'id',
      columns: [],
      dataSource: [],
      expandable: {
        expandedRowRender: (record) => `expanded ${record.name}`,
        rowExpandable: (record) => record.id > 0,
      },
    }
    expectTypeOf(props.expandable).not.toBeUndefined()
  })

  it('accepts rowSelection config', () => {
    const props: DataTableProps<User> = {
      rowKey: 'id',
      columns: [],
      dataSource: [],
      rowSelection: {
        selectedRowKeys: [],
        onChange: (_keys, _rows) => {},
      },
    }
    expectTypeOf(props.rowSelection).not.toBeUndefined()
  })

  it('accepts scroll config', () => {
    const props: DataTableProps<User> = {
      rowKey: 'id',
      columns: [],
      dataSource: [],
      scroll: { x: 1200, y: '60vh' },
    }
    expectTypeOf(props.scroll).toMatchTypeOf<{ x?: number | string; y?: number | string } | undefined>()
  })

  it('accepts footer renderer', () => {
    const props: DataTableProps<User> = {
      rowKey: 'id',
      columns: [],
      dataSource: [],
      footer: (rows) => `Total: ${rows.length}`,
    }
    expectTypeOf(props.footer).toMatchTypeOf<((rows: User[]) => React.ReactNode) | undefined>()
  })

  it('accepts onRow handler', () => {
    const props: DataTableProps<User> = {
      rowKey: 'id',
      columns: [],
      dataSource: [],
      onRow: (record) => ({ onClick: (_e) => console.log(record.id) }),
    }
    expectTypeOf(props.onRow).not.toBeUndefined()
  })
})

// Need React in scope for ReactNode references — import type only, no runtime cost
import type React from 'react'
