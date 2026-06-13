import { render, screen } from '@testing-library/react'
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from './tooltip'

// NOTE: Radix Tooltip uses pointer capture internally (setPointerCapture) for
// tracking pointer events on the trigger. In jsdom this throws even with stubs
// when the pointer event bubbles through radix internals. Tests here cover:
// render contract, data-slot, and open state via the `open` controlled prop.
// Hover-driven open/close is reduced in scope — documented here.
describe('Tooltip', () => {
  it('content is not visible when closed (uncontrolled)', () => {
    render(
      <Tooltip>
        <TooltipTrigger>Hover me</TooltipTrigger>
        <TooltipContent>Tooltip text</TooltipContent>
      </Tooltip>,
    )
    expect(screen.queryByText('Tooltip text')).not.toBeInTheDocument()
  })

  it('trigger has correct data-slot', () => {
    render(
      <Tooltip>
        <TooltipTrigger>Hover me</TooltipTrigger>
        <TooltipContent>Tooltip text</TooltipContent>
      </Tooltip>,
    )
    expect(screen.getByText('Hover me')).toHaveAttribute('data-slot', 'tooltip-trigger')
  })

  it('content is visible when open=true (controlled)', async () => {
    render(
      <TooltipProvider>
        <Tooltip open>
          <TooltipTrigger>Trigger</TooltipTrigger>
          <TooltipContent>Always visible</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    )
    // radix may render content in multiple nodes (portal); at least one must exist
    const items = await screen.findAllByText('Always visible')
    expect(items.length).toBeGreaterThan(0)
  })

  it('content has correct data-slot when visible', async () => {
    render(
      <TooltipProvider>
        <Tooltip open>
          <TooltipTrigger>Trigger</TooltipTrigger>
          <TooltipContent>Tooltip body</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    )
    const items = await screen.findAllByText('Tooltip body')
    const inContent = items.some((el) => el.closest('[data-slot="tooltip-content"]'))
    expect(inContent).toBe(true)
  })
})
