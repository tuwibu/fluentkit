import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from './sheet'

describe('Sheet', () => {
  function setup(side: 'right' | 'left' | 'top' | 'bottom' = 'right') {
    render(
      <Sheet>
        <SheetTrigger>Open Sheet</SheetTrigger>
        <SheetContent side={side}>
          <SheetTitle>Sheet Title</SheetTitle>
          <SheetDescription>Sheet Description</SheetDescription>
          <p>Sheet body</p>
        </SheetContent>
      </Sheet>,
    )
  }

  it('content is not visible initially', () => {
    setup()
    expect(screen.queryByText('Sheet body')).not.toBeInTheDocument()
  })

  it('opens on trigger click', async () => {
    setup()
    await userEvent.click(screen.getByText('Open Sheet'))
    expect(await screen.findByText('Sheet body')).toBeInTheDocument()
  })

  it('closes on ESC key', async () => {
    setup()
    await userEvent.click(screen.getByText('Open Sheet'))
    await screen.findByText('Sheet body')
    await userEvent.keyboard('{Escape}')
    expect(screen.queryByText('Sheet body')).not.toBeInTheDocument()
  })

  it('close button closes the sheet', async () => {
    setup()
    await userEvent.click(screen.getByText('Open Sheet'))
    await screen.findByText('Sheet body')
    await userEvent.click(screen.getByRole('button', { name: 'Close' }))
    expect(screen.queryByText('Sheet body')).not.toBeInTheDocument()
  })

  it('applies correct side class for left', async () => {
    setup('left')
    await userEvent.click(screen.getByText('Open Sheet'))
    const content = document.querySelector('[data-slot="sheet-content"]')
    expect(content?.className).toMatch(/slide-in-from-left/)
  })

  it('applies correct side class for right (default)', async () => {
    setup('right')
    await userEvent.click(screen.getByText('Open Sheet'))
    const content = document.querySelector('[data-slot="sheet-content"]')
    expect(content?.className).toMatch(/slide-in-from-right/)
  })

  it('controlled open/close via open prop', async () => {
    const onOpenChange = vi.fn()
    render(
      <Sheet open={true} onOpenChange={onOpenChange}>
        <SheetContent>
          <SheetTitle>Controlled</SheetTitle>
          <p>Always open</p>
        </SheetContent>
      </Sheet>,
    )
    expect(await screen.findByText('Always open')).toBeInTheDocument()
    await userEvent.keyboard('{Escape}')
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })
})
