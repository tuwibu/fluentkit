import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Popover, PopoverTrigger, PopoverContent } from './popover'

describe('Popover', () => {
  function setup() {
    render(
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Popover body</PopoverContent>
      </Popover>,
    )
  }

  it('content is not visible initially', () => {
    setup()
    expect(screen.queryByText('Popover body')).not.toBeInTheDocument()
  })

  it('opens on trigger click', async () => {
    setup()
    await userEvent.click(screen.getByText('Open'))
    expect(await screen.findByText('Popover body')).toBeInTheDocument()
  })

  it('closes on ESC key', async () => {
    setup()
    await userEvent.click(screen.getByText('Open'))
    await screen.findByText('Popover body')
    await userEvent.keyboard('{Escape}')
    expect(screen.queryByText('Popover body')).not.toBeInTheDocument()
  })

  it('trigger has aria-expanded=false when closed', () => {
    setup()
    expect(screen.getByText('Open')).toHaveAttribute('aria-expanded', 'false')
  })

  it('trigger has aria-expanded=true when open', async () => {
    setup()
    await userEvent.click(screen.getByText('Open'))
    expect(screen.getByText('Open')).toHaveAttribute('aria-expanded', 'true')
  })
})
