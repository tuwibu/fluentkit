import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from './dropdown-menu'

describe('DropdownMenu', () => {
  function setup(onSelect = vi.fn()) {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Actions</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onSelect={onSelect}>Edit</DropdownMenuItem>
          <DropdownMenuItem>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    )
    return { onSelect }
  }

  it('menu content is not visible initially', () => {
    setup()
    expect(screen.queryByText('Edit')).not.toBeInTheDocument()
  })

  it('opens on trigger click', async () => {
    setup()
    await userEvent.click(screen.getByText('Actions'))
    expect(await screen.findByText('Edit')).toBeInTheDocument()
  })

  it('calls onSelect and closes when item clicked', async () => {
    const { onSelect } = setup()
    await userEvent.click(screen.getByText('Actions'))
    await userEvent.click(await screen.findByText('Edit'))
    expect(onSelect).toHaveBeenCalledTimes(1)
    expect(screen.queryByText('Edit')).not.toBeInTheDocument()
  })

  it('closes on ESC key', async () => {
    setup()
    await userEvent.click(screen.getByText('Actions'))
    await screen.findByText('Edit')
    await userEvent.keyboard('{Escape}')
    expect(screen.queryByText('Edit')).not.toBeInTheDocument()
  })
})
