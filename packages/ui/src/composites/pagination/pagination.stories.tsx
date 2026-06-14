import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Pagination } from './pagination'

const meta: Meta<typeof Pagination> = {
  title: 'Composites/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}
export default meta
type Story = StoryObj<typeof Pagination>

function Controlled(props: { total: number; initialPage?: number; initialSize?: number }) {
  const [page, setPage] = useState(props.initialPage ?? 1)
  const [pageSize, setPageSize] = useState(props.initialSize ?? 10)
  return (
    <div className="min-w-[640px] border border-border rounded-md">
      <Pagination
        page={page}
        pageSize={pageSize}
        total={props.total}
        onPageChange={(p, s) => {
          setPage(p)
          setPageSize(s)
        }}
      />
    </div>
  )
}

export const FewPages: Story = {
  render: () => <Controlled total={35} initialPage={1} initialSize={10} />,
}

export const ManyPages: Story = {
  render: () => <Controlled total={500} initialPage={6} initialSize={10} />,
}

export const LastPage: Story = {
  render: () => <Controlled total={100} initialPage={10} initialSize={10} />,
}

export const Empty: Story = {
  render: () => <Controlled total={0} />,
}

export const CustomPageSizes: Story = {
  render: () => {
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(5)
    return (
      <div className="min-w-[640px] border border-border rounded-md">
        <Pagination
          page={page}
          pageSize={pageSize}
          total={100}
          pageSizeOptions={[5, 15, 25]}
          onPageChange={(p, s) => {
            setPage(p)
            setPageSize(s)
          }}
        />
      </div>
    )
  },
}
