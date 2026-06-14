/**
 * FilterSelect behavior tests.
 *
 * All tests use the Popover path (plain <button> trigger) which is fully
 * testable in jsdom via userEvent.click — no pointer-event workarounds needed.
 */
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Globe, Monitor } from 'lucide-react'
import { FilterSelect } from './filter-select'
import type { SelectOption } from '../select/select.types'

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------
const OPTIONS: SelectOption[] = [
  { label: 'Web', value: 'web' },
  { label: 'Desktop', value: 'desktop' },
  { label: 'Mobile', value: 'mobile' },
]

const OPTIONS_WITH_ICON: SelectOption[] = [
  { label: 'Web', value: 'web', icon: <Globe size={14} data-testid="icon-globe" /> },
  { label: 'Desktop', value: 'desktop', icon: <Monitor size={14} data-testid="icon-monitor" /> },
]

const OPTIONS_WITH_COLOR: SelectOption[] = [
  { label: 'Active', value: 'active', color: '#059669' },
  { label: 'Pending', value: 'pending', color: '#d97706' },
  { label: 'Inactive', value: 'inactive', color: '#6b7280' },
]

// Helper: open the popover
async function openPopover(triggerText: string) {
  const trigger = screen.getByRole('button', { name: new RegExp(triggerText, 'i') })
  await userEvent.click(trigger)
  await waitFor(() => expect(screen.getByRole('listbox')).toBeInTheDocument())
}

// ---------------------------------------------------------------------------
// Loại 3 — single mode
// ---------------------------------------------------------------------------
describe('FilterSelect — single mode (loại 3)', () => {
  it('trigger always shows title, not the selected value', async () => {
    render(
      <FilterSelect
        title="Platform"
        options={OPTIONS}
        value="web"
        onChange={vi.fn()}
        mode="single"
      />,
    )
    expect(screen.getByRole('button', { name: /Platform/i })).toBeInTheDocument()
    // "Web" must NOT appear in the trigger
    const trigger = screen.getByRole('button', { name: /Platform/i })
    expect(trigger).not.toHaveTextContent('Web')
  })

  it('shows count badge = 1 when one option selected', () => {
    render(
      <FilterSelect
        title="Platform"
        options={OPTIONS}
        value="web"
        onChange={vi.fn()}
        mode="single"
      />,
    )
    expect(screen.getByText('1')).toBeInTheDocument()
  })

  it('no badge when nothing selected', () => {
    render(
      <FilterSelect
        title="Platform"
        options={OPTIONS}
        value={undefined}
        onChange={vi.fn()}
        mode="single"
      />,
    )
    expect(screen.queryByText('1')).not.toBeInTheDocument()
  })

  it('toggle-to-clear: clicking selected option calls onChange(undefined)', async () => {
    const onChange = vi.fn()
    render(
      <FilterSelect
        title="Platform"
        options={OPTIONS}
        value="web"
        onChange={onChange}
        mode="single"
        allLabel="All platforms"
      />,
    )
    await openPopover('Platform')
    await userEvent.click(screen.getByText('Web'))
    expect(onChange).toHaveBeenCalledWith(undefined)
  })

  it('clicking All row calls onChange(undefined) and closes popup', async () => {
    const onChange = vi.fn()
    render(
      <FilterSelect
        title="Platform"
        options={OPTIONS}
        value="web"
        onChange={onChange}
        mode="single"
        allLabel="All platforms"
      />,
    )
    await openPopover('Platform')
    await userEvent.click(screen.getByText('All platforms'))
    expect(onChange).toHaveBeenCalledWith(undefined)
  })

  it('selecting a new option calls onChange with that value', async () => {
    const onChange = vi.fn()
    render(
      <FilterSelect
        title="Platform"
        options={OPTIONS}
        value={undefined}
        onChange={onChange}
        mode="single"
      />,
    )
    await openPopover('Platform')
    await userEvent.click(screen.getByText('Desktop'))
    expect(onChange).toHaveBeenCalledWith('desktop')
  })
})

// ---------------------------------------------------------------------------
// Loại 4 — multiple mode with count badge
// ---------------------------------------------------------------------------
describe('FilterSelect — multiple mode count (loại 4)', () => {
  it('shows count badge = 2 when two options selected', () => {
    render(
      <FilterSelect
        title="Status"
        options={OPTIONS_WITH_COLOR}
        value={['active', 'pending']}
        onChange={vi.fn()}
        mode="multiple"
        triggerDisplay="count"
      />,
    )
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('shows "2 selected" header inside popup', async () => {
    render(
      <FilterSelect
        title="Status"
        options={OPTIONS_WITH_COLOR}
        value={['active', 'pending']}
        onChange={vi.fn()}
        mode="multiple"
      />,
    )
    await openPopover('Status')
    expect(screen.getByText('2 selected')).toBeInTheDocument()
  })

  it('"Clear all" button calls onChange(undefined)', async () => {
    const onChange = vi.fn()
    render(
      <FilterSelect
        title="Status"
        options={OPTIONS_WITH_COLOR}
        value={['active', 'pending']}
        onChange={onChange}
        mode="multiple"
      />,
    )
    await openPopover('Status')
    await userEvent.click(screen.getByText('Clear all'))
    expect(onChange).toHaveBeenCalledWith(undefined)
  })

  it('clicking an option adds it to selection', async () => {
    const onChange = vi.fn()
    render(
      <FilterSelect
        title="Status"
        options={OPTIONS_WITH_COLOR}
        value={['active']}
        onChange={onChange}
        mode="multiple"
      />,
    )
    await openPopover('Status')
    await userEvent.click(screen.getByText('Pending'))
    expect(onChange).toHaveBeenCalledWith(expect.arrayContaining(['active', 'pending']))
  })

  it('clicking a selected option removes it', async () => {
    const onChange = vi.fn()
    render(
      <FilterSelect
        title="Status"
        options={OPTIONS_WITH_COLOR}
        value={['active', 'pending']}
        onChange={onChange}
        mode="multiple"
      />,
    )
    await openPopover('Status')
    await userEvent.click(screen.getByText('Active'))
    expect(onChange).toHaveBeenCalledWith(['pending'])
  })

  it('removing last item calls onChange(undefined)', async () => {
    const onChange = vi.fn()
    render(
      <FilterSelect
        title="Status"
        options={OPTIONS_WITH_COLOR}
        value={['active']}
        onChange={onChange}
        mode="multiple"
      />,
    )
    await openPopover('Status')
    await userEvent.click(screen.getByText('Active'))
    expect(onChange).toHaveBeenCalledWith(undefined)
  })
})

// ---------------------------------------------------------------------------
// Loại 5 — multiple mode with tags display
// ---------------------------------------------------------------------------
describe('FilterSelect — multiple mode tags display (loại 5)', () => {
  it('renders Tag chip for each selected option in trigger', () => {
    render(
      <FilterSelect
        title="Tags"
        options={OPTIONS_WITH_COLOR}
        value={['active', 'pending']}
        onChange={vi.fn()}
        mode="multiple"
        triggerDisplay="tags"
      />,
    )
    expect(screen.getByText('Active')).toBeInTheDocument()
    expect(screen.getByText('Pending')).toBeInTheDocument()
  })

  it('clicking × on a chip removes that option via onChange', async () => {
    const onChange = vi.fn()
    render(
      <FilterSelect
        title="Tags"
        options={OPTIONS_WITH_COLOR}
        value={['active', 'pending']}
        onChange={onChange}
        mode="multiple"
        triggerDisplay="tags"
      />,
    )
    // Tag renders aria-label="Remove tag" buttons
    const removeButtons = screen.getAllByRole('button', { name: /remove tag/i })
    // First chip is 'Active'
    const firstRemove = removeButtons[0]
    if (!firstRemove) throw new Error('Expected remove button for first tag chip')
    await userEvent.click(firstRemove)
    expect(onChange).toHaveBeenCalledWith(['pending'])
  })

  it('removing last tag chip calls onChange(undefined)', async () => {
    const onChange = vi.fn()
    render(
      <FilterSelect
        title="Tags"
        options={OPTIONS_WITH_COLOR}
        value={['active']}
        onChange={onChange}
        mode="multiple"
        triggerDisplay="tags"
      />,
    )
    const removeBtn = screen.getByRole('button', { name: /remove tag/i })
    await userEvent.click(removeBtn)
    expect(onChange).toHaveBeenCalledWith(undefined)
  })
})

// ---------------------------------------------------------------------------
// Searchable
// ---------------------------------------------------------------------------
describe('FilterSelect — searchable', () => {
  it('filters options by query', async () => {
    render(
      <FilterSelect
        title="Platform"
        options={OPTIONS}
        value={undefined}
        onChange={vi.fn()}
        mode="single"
        searchable
      />,
    )
    await openPopover('Platform')
    const searchInput = screen.getByRole('textbox')
    await userEvent.type(searchInput, 'mob')
    expect(screen.getByText('Mobile')).toBeInTheDocument()
    expect(screen.queryByText('Web')).not.toBeInTheDocument()
    expect(screen.queryByText('Desktop')).not.toBeInTheDocument()
  })

  it('shows "No results" when no options match', async () => {
    render(
      <FilterSelect
        title="Platform"
        options={OPTIONS}
        value={undefined}
        onChange={vi.fn()}
        mode="single"
        searchable
      />,
    )
    await openPopover('Platform')
    const searchInput = screen.getByRole('textbox')
    await userEvent.type(searchInput, 'zzz')
    expect(screen.getByText('No results')).toBeInTheDocument()
  })
})

// ---------------------------------------------------------------------------
// icon / color → OptionChip + renderLabel override
// ---------------------------------------------------------------------------
describe('FilterSelect — OptionChip and renderLabel', () => {
  it('renders icon from option via OptionChip', async () => {
    render(
      <FilterSelect
        title="Platform"
        options={OPTIONS_WITH_ICON}
        value={undefined}
        onChange={vi.fn()}
        mode="single"
      />,
    )
    await openPopover('Platform')
    expect(screen.getByTestId('icon-globe')).toBeInTheDocument()
  })

  it('renderLabel overrides default OptionChip rendering', async () => {
    render(
      <FilterSelect
        title="Platform"
        options={OPTIONS}
        value={undefined}
        onChange={vi.fn()}
        mode="single"
        renderLabel={(opt) => (
          <span data-testid={`custom-${String(opt.value)}`}>custom-{String(opt.label)}</span>
        )}
      />,
    )
    await openPopover('Platform')
    expect(screen.getByTestId('custom-web')).toBeInTheDocument()
    expect(screen.getByText('custom-Web')).toBeInTheDocument()
  })
})
