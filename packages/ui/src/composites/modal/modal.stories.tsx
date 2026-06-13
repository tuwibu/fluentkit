import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Modal, modal } from './modal'

const meta: Meta<typeof Modal> = {
  title: 'Composites/Modal',
  component: Modal,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
}
export default meta
type Story = StoryObj<typeof Modal>

export const Basic: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    return (
      <>
        <button type="button" onClick={() => setOpen(true)}>Open Modal</button>
        <Modal
          open={open}
          title="Basic Modal"
          onOk={() => setOpen(false)}
          onCancel={() => setOpen(false)}
        >
          <p>Modal content goes here.</p>
        </Modal>
      </>
    )
  },
}

export const ConfirmLoading: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const handleOk = async () => {
      setLoading(true)
      await new Promise((r) => setTimeout(r, 1500))
      setLoading(false)
      setOpen(false)
    }
    return (
      <>
        <button type="button" onClick={() => setOpen(true)}>Open with loading</button>
        <Modal
          open={open}
          title="Async OK"
          confirmLoading={loading}
          onOk={handleOk}
          onCancel={() => setOpen(false)}
        >
          <p>Click OK to simulate an async operation.</p>
        </Modal>
      </>
    )
  },
}

export const ImperativeConfirm: Story = {
  render: () => {
    const handleClick = () => {
      modal
        .confirm({ title: 'Delete record?', content: 'This action cannot be undone.', okType: 'danger' })
        .then(() => alert('Confirmed'))
        .catch(() => alert('Cancelled'))
    }
    return <button type="button" onClick={handleClick}>Open confirm</button>
  },
}

export const CustomFooter: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    return (
      <>
        <button type="button" onClick={() => setOpen(true)}>Custom footer</button>
        <Modal
          open={open}
          title="Custom Footer"
          footer={
            <div style={{ display: 'flex', gap: 8 }}>
              <button type="button" onClick={() => setOpen(false)}>Close</button>
              <button type="button" onClick={() => { alert('Saved'); setOpen(false) }}>Save changes</button>
            </div>
          }
        >
          <p>This modal has a fully custom footer.</p>
        </Modal>
      </>
    )
  },
}
