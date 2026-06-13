import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Tabs, TabsList, TabsTrigger, TabsContent } from './tabs'

describe('Tabs', () => {
  function setup(onValueChange = vi.fn()) {
    render(
      <Tabs defaultValue="tab1" onValueChange={onValueChange}>
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>,
    )
    return { onValueChange }
  }

  it('renders first tab content by default', () => {
    setup()
    expect(screen.getByText('Content 1')).toBeInTheDocument()
  })

  it('switches tab on click and calls onValueChange', async () => {
    const { onValueChange } = setup()
    await userEvent.click(screen.getByRole('tab', { name: 'Tab 2' }))
    expect(onValueChange).toHaveBeenCalledWith('tab2')
    expect(screen.getByText('Content 2')).toBeInTheDocument()
  })

  it('active tab has aria-selected=true', () => {
    setup()
    expect(screen.getByRole('tab', { name: 'Tab 1' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tab', { name: 'Tab 2' })).toHaveAttribute('aria-selected', 'false')
  })

  it('updates aria-selected after switching', async () => {
    setup()
    await userEvent.click(screen.getByRole('tab', { name: 'Tab 2' }))
    expect(screen.getByRole('tab', { name: 'Tab 2' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tab', { name: 'Tab 1' })).toHaveAttribute('aria-selected', 'false')
  })

  it('navigates tabs with arrow keys', async () => {
    setup()
    screen.getByRole('tab', { name: 'Tab 1' }).focus()
    await userEvent.keyboard('{ArrowRight}')
    expect(screen.getByRole('tab', { name: 'Tab 2' })).toHaveFocus()
  })
})
