/**
 * DataTable Phase 5 — behavior tests (TDD)
 * Tests bám hợp đồng DataTableProps phase 4.
 * KHÔNG test API TanStack nội bộ.
 */
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { DataTable } from './data-table'
import type { ColumnDef } from './data-table.types'

// ── Fixtures ────────────────────────────────────────────────────────────────

interface Row {
  id: string
  name: string
  score: number
}

const cols: ColumnDef<Row>[] = [
  { key: 'id', title: 'ID', dataIndex: 'id' },
  { key: 'name', title: 'Name', dataIndex: 'name' },
  { key: 'score', title: 'Score', dataIndex: 'score', sorter: true },
]

const rows: Row[] = [
  { id: 'r1', name: 'Alice', score: 80 },
  { id: 'r2', name: 'Bob', score: 60 },
  { id: 'r3', name: 'Carol', score: 90 },
]

// ── render rows from dataSource ──────────────────────────────────────────────

describe('DataTable — render rows', () => {
  it('renders all rows from dataSource', () => {
    render(<DataTable rowKey="id" columns={cols} dataSource={rows} />)
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
    expect(screen.getByText('Carol')).toBeInTheDocument()
  })

  it('renders column headers', () => {
    render(<DataTable rowKey="id" columns={cols} dataSource={rows} />)
    expect(screen.getByText('ID')).toBeInTheDocument()
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Score')).toBeInTheDocument()
  })
})

// ── emptyText ────────────────────────────────────────────────────────────────

describe('DataTable — emptyText', () => {
  it('shows default emptyText when dataSource is empty', () => {
    render(<DataTable rowKey="id" columns={cols} dataSource={[]} />)
    expect(document.querySelector('[data-slot="data-table-empty"]')).toBeInTheDocument()
  })

  it('shows custom emptyText', () => {
    render(
      <DataTable rowKey="id" columns={cols} dataSource={[]} emptyText="No records found" />,
    )
    expect(screen.getByText('No records found')).toBeInTheDocument()
  })

  it('does NOT show emptyText when rows exist', () => {
    render(<DataTable rowKey="id" columns={cols} dataSource={rows} />)
    expect(document.querySelector('[data-slot="data-table-empty"]')).not.toBeInTheDocument()
  })
})

// ── loading ──────────────────────────────────────────────────────────────────

describe('DataTable — loading', () => {
  it('shows loading sentinel with data-slot="data-table-loading" for loading=true', () => {
    render(<DataTable rowKey="id" columns={cols} dataSource={[]} loading={true} />)
    const sentinel = document.querySelector('[data-slot="data-table-loading"]')
    expect(sentinel).toBeInTheDocument()
    expect(sentinel).toHaveAttribute('role', 'status')
  })

  it('shows skeleton rows for loading={ skeletonRows: 5 }', () => {
    render(<DataTable rowKey="id" columns={cols} dataSource={[]} loading={{ skeletonRows: 5 }} />)
    expect(document.querySelector('[data-slot="data-table-loading"]')).toBeInTheDocument()
    const skeletonRows = document.querySelectorAll('[data-slot="skeleton-row"]')
    expect(skeletonRows.length).toBe(5)
  })

  it('shows default 3 skeleton rows for loading=true', () => {
    render(<DataTable rowKey="id" columns={cols} dataSource={[]} loading={true} />)
    const skeletonRows = document.querySelectorAll('[data-slot="skeleton-row"]')
    expect(skeletonRows.length).toBe(3)
  })

  it('does NOT show loading state when loading=false', () => {
    render(<DataTable rowKey="id" columns={cols} dataSource={rows} loading={false} />)
    expect(document.querySelector('[data-slot="data-table-loading"]')).not.toBeInTheDocument()
  })

  it('C1 — only one loading sentinel element exists (no phantom tr)', () => {
    render(<DataTable rowKey="id" columns={cols} dataSource={[]} loading={true} />)
    const sentinels = document.querySelectorAll('[data-slot="data-table-loading"]')
    expect(sentinels.length).toBe(1)
  })
})

// ── rowKey ───────────────────────────────────────────────────────────────────

describe('DataTable — rowKey', () => {
  it('accepts rowKey as string field name', () => {
    render(<DataTable rowKey="id" columns={cols} dataSource={rows} />)
    expect(screen.getByText('Alice')).toBeInTheDocument()
  })

  it('accepts rowKey as function', () => {
    render(
      <DataTable
        rowKey={(r) => `key-${r.id}`}
        columns={cols}
        dataSource={rows}
      />,
    )
    expect(screen.getByText('Alice')).toBeInTheDocument()
  })
})

// ── custom render ────────────────────────────────────────────────────────────

describe('DataTable — custom render', () => {
  it('uses columns[].render() for custom cell content', () => {
    const customCols: ColumnDef<Row>[] = [
      { key: 'name', title: 'Name', dataIndex: 'name' },
      {
        key: 'badge',
        title: 'Badge',
        render: (_val, record) => <span data-testid="badge">{record.name.toUpperCase()}</span>,
      },
    ]
    render(<DataTable rowKey="id" columns={customCols} dataSource={rows} />)
    const badges = screen.getAllByTestId('badge')
    expect(badges[0]).toHaveTextContent('ALICE')
    expect(badges[1]).toHaveTextContent('BOB')
  })

  it('passes value, record, index to render()', () => {
    const renderFn = vi.fn((_val: unknown, _record: Row, _index: number) => null)
    const customCols: ColumnDef<Row>[] = [
      { key: 'name', title: 'Name', dataIndex: 'name', render: renderFn },
    ]
    render(<DataTable rowKey="id" columns={customCols} dataSource={rows} />)
    expect(renderFn).toHaveBeenCalledTimes(rows.length)
    // first call: value='Alice', record=rows[0], index=0
    expect(renderFn).toHaveBeenNthCalledWith(1, 'Alice', rows[0], 0)
  })
})

// ── sorting ──────────────────────────────────────────────────────────────────

describe('DataTable — sorting', () => {
  it('toggles sort order when clicking sortable header', async () => {
    const user = userEvent.setup()
    render(<DataTable rowKey="id" columns={cols} dataSource={rows} />)

    const scoreHeader = screen.getByText('Score')
    // initial order: Alice(80), Bob(60), Carol(90)
    let cells = screen.getAllByRole('cell')
    const scoresBefore = cells.filter((c) => ['80', '60', '90'].includes(c.textContent ?? ''))
    expect(scoresBefore[0]).toHaveTextContent('80')

    // TanStack v8 default toggle: none → desc → asc → none
    // click once → desc (90,80,60)
    await user.click(scoreHeader)
    cells = screen.getAllByRole('cell')
    const scoresDesc = cells.filter((c) => ['80', '60', '90'].includes(c.textContent ?? ''))
    expect(scoresDesc[0]).toHaveTextContent('90')

    // click again → asc (60,80,90)
    await user.click(scoreHeader)
    cells = screen.getAllByRole('cell')
    const scoresAsc = cells.filter((c) => ['80', '60', '90'].includes(c.textContent ?? ''))
    expect(scoresAsc[0]).toHaveTextContent('60')
  })

  it('local sorter fn sorts rows', async () => {
    const user = userEvent.setup()
    const sortCols: ColumnDef<Row>[] = [
      { key: 'name', title: 'Name', dataIndex: 'name' },
      {
        key: 'score',
        title: 'Score',
        dataIndex: 'score',
        sorter: (a, b) => a.score - b.score,
      },
    ]
    render(<DataTable rowKey="id" columns={sortCols} dataSource={rows} />)
    // TanStack v8: first click = desc. Second click = asc.
    await user.click(screen.getByText('Score'))
    await user.click(screen.getByText('Score'))
    const nameCells = screen.getAllByRole('cell').filter((c) =>
      ['Alice', 'Bob', 'Carol'].includes(c.textContent ?? ''),
    )
    // asc by score: Bob(60), Alice(80), Carol(90)
    expect(nameCells[0]).toHaveTextContent('Bob')
  })
})

// ── pagination ───────────────────────────────────────────────────────────────

describe('DataTable — pagination', () => {
  it('fires pagination.onChange when navigating pages', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(
      <DataTable
        rowKey="id"
        columns={cols}
        dataSource={rows}
        pagination={{ current: 1, pageSize: 2, total: 3, onChange }}
      />,
    )
    // Page 2 button should exist
    const page2 = screen.getByRole('button', { name: /2/i })
    await user.click(page2)
    expect(onChange).toHaveBeenCalledWith(2, 2)
  })

  it('does not render pagination bar when pagination=false', () => {
    render(
      <DataTable rowKey="id" columns={cols} dataSource={rows} pagination={false} />,
    )
    expect(document.querySelector('[data-slot="pagination"]')).not.toBeInTheDocument()
  })
})

// ── expandable ───────────────────────────────────────────────────────────────

describe('DataTable — expandable', () => {
  it('renders expanded row content when row is expanded', async () => {
    const user = userEvent.setup()
    render(
      <DataTable
        rowKey="id"
        columns={cols}
        dataSource={rows}
        expandable={{
          expandedRowRender: (record) => (
            <div data-testid="expanded">{`Detail: ${record.name}`}</div>
          ),
        }}
      />,
    )
    // expand first row
    const expandBtns = screen.getAllByRole('button', { name: /expand/i })
    await user.click(expandBtns[0]!)
    expect(screen.getByTestId('expanded')).toHaveTextContent('Detail: Alice')
  })

  it('respects rowExpandable — disables expand when returns false', () => {
    render(
      <DataTable
        rowKey="id"
        columns={cols}
        dataSource={rows}
        expandable={{
          expandedRowRender: (r) => <span>{r.name}</span>,
          rowExpandable: (r) => r.score > 70,
        }}
      />,
    )
    const expandBtns = screen.getAllByRole('button', { name: /expand/i })
    // Bob (score=60) should be disabled
    const bobBtn = expandBtns[1] // order: Alice, Bob, Carol
    expect(bobBtn).toBeDisabled()
  })
})

// ── rowSelection ─────────────────────────────────────────────────────────────

describe('DataTable — rowSelection', () => {
  it('fires rowSelection.onChange with correct keys and rows when checkbox clicked', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(
      <DataTable
        rowKey="id"
        columns={cols}
        dataSource={rows}
        rowSelection={{ selectedRowKeys: [], onChange }}
      />,
    )
    const checkboxes = screen.getAllByRole('checkbox')
    // first checkbox may be select-all, row checkboxes follow
    const rowCheckbox = checkboxes.find((cb) => cb.getAttribute('aria-label') === 'Select row r1') ??
      checkboxes[1]!
    await user.click(rowCheckbox)
    expect(onChange).toHaveBeenCalledWith(['r1'], [rows[0]])
  })

  it('renders select-all checkbox', () => {
    render(
      <DataTable
        rowKey="id"
        columns={cols}
        dataSource={rows}
        rowSelection={{ selectedRowKeys: [], onChange: vi.fn() }}
      />,
    )
    const selectAll = screen.getByRole('checkbox', { name: /select all/i })
    expect(selectAll).toBeInTheDocument()
  })

  it('reflects selectedRowKeys in checkbox checked state', () => {
    render(
      <DataTable
        rowKey="id"
        columns={cols}
        dataSource={rows}
        rowSelection={{ selectedRowKeys: ['r1'], onChange: vi.fn() }}
      />,
    )
    const checkboxes = screen.getAllByRole('checkbox')
    // find the row checkbox for r1
    const r1Box = checkboxes.find((cb) => cb.getAttribute('aria-label') === 'Select row r1') ??
      checkboxes[1]
    expect(r1Box).toBeChecked()
  })
})

// ── onRow ────────────────────────────────────────────────────────────────────

describe('DataTable — onRow', () => {
  it('fires onRow().onClick when row is clicked', async () => {
    const onClick = vi.fn()
    const user = userEvent.setup()
    render(
      <DataTable
        rowKey="id"
        columns={cols}
        dataSource={rows}
        onRow={(_record) => ({ onClick })}
      />,
    )
    const dataRows = document.querySelectorAll('tbody tr[data-slot="data-row"]')
    await user.click(dataRows[0] as HTMLElement)
    expect(onClick).toHaveBeenCalled()
  })
})

// ── footer ───────────────────────────────────────────────────────────────────

describe('DataTable — footer', () => {
  it('renders footer with current page data', () => {
    render(
      <DataTable
        rowKey="id"
        columns={cols}
        dataSource={rows}
        footer={(currentRows) => (
          <div data-testid="footer">Total: {currentRows.length}</div>
        )}
      />,
    )
    expect(screen.getByTestId('footer')).toHaveTextContent('Total: 3')
  })
})

// ── scroll / fixed — no crash ────────────────────────────────────────────────

describe('DataTable — scroll + fixed', () => {
  it('renders without crash when scroll.y is set', () => {
    render(
      <DataTable rowKey="id" columns={cols} dataSource={rows} scroll={{ y: 300 }} />,
    )
    expect(screen.getByText('Alice')).toBeInTheDocument()
  })

  it('renders sticky thead class when scroll.y is set', () => {
    render(
      <DataTable rowKey="id" columns={cols} dataSource={rows} scroll={{ y: 300 }} />,
    )
    // thead should have sticky positioning class
    const thead = document.querySelector('thead')
    expect(thead?.className).toMatch(/sticky/)
  })

  it('renders without crash when fixed column is set', () => {
    const fixedCols: ColumnDef<Row>[] = [
      { key: 'id', title: 'ID', dataIndex: 'id', fixed: 'left' },
      { key: 'name', title: 'Name', dataIndex: 'name' },
    ]
    render(<DataTable rowKey="id" columns={fixedCols} dataSource={rows} />)
    expect(screen.getByText('Alice')).toBeInTheDocument()
  })
})
