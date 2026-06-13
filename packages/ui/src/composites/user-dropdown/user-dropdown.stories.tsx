import type { Meta, StoryObj } from '@storybook/react'
import { ThemeProvider } from '../../theme/theme-provider'
import { ColorThemeProvider } from '../../theme/color-theme-provider'
import { UserDropdown } from './user-dropdown'

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ColorThemeProvider>{children}</ColorThemeProvider>
    </ThemeProvider>
  )
}

const meta: Meta<typeof UserDropdown> = {
  title: 'Composites/UserDropdown',
  component: UserDropdown,
  decorators: [(Story) => <Wrapper><Story /></Wrapper>],
  parameters: { layout: 'centered' },
}

export default meta
type Story = StoryObj<typeof UserDropdown>

const user = { name: 'Alice Johnson', email: 'alice@example.com' }

export const Default: Story = {
  args: {
    user,
    onLogout: () => alert('logout'),
    colorThemeControl: true,
  },
}

export const WithSettings: Story = {
  args: {
    user,
    onLogout: () => alert('logout'),
    onOpenSettings: () => alert('settings'),
    colorThemeControl: true,
  },
}

export const WithLanguage: Story = {
  args: {
    user,
    onLogout: () => alert('logout'),
    colorThemeControl: true,
    languageControl: true,
    language: 'en',
    onLanguageChange: (v) => alert(`lang: ${v}`),
  },
}

export const WithAvatar: Story = {
  args: {
    user: { name: 'Bob Smith', email: 'bob@example.com', avatar: 'https://i.pravatar.cc/40?u=bob' },
    onLogout: () => alert('logout'),
    colorThemeControl: true,
  },
}

export const Collapsed: Story = {
  args: {
    user,
    onLogout: () => alert('logout'),
    collapsed: true,
    colorThemeControl: true,
  },
}
