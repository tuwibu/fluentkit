import { Bell, Settings } from 'lucide-react'
import { ThemeProvider } from '../../theme/theme-provider'
import { Header } from './header'

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <div style={{ background: 'var(--win11-mica, #1a1a2e)' }}>{children}</div>
    </ThemeProvider>
  )
}

export default {
  title: 'Composites/Header',
  component: Header,
  decorators: [(Story: () => React.ReactElement) => <Wrapper><Story /></Wrapper>],
}

export const Default = () => <Header title="Dashboard" />
Default.storyName = 'Default (title + theme toggle)'

export const WithActions = () => (
  <Header
    title="Settings"
    actions={
      <button
        type="button"
        className="p-2 rounded hover:bg-[var(--win11-hover)] transition-colors text-foreground"
        aria-label="Open settings"
      >
        <Settings size={16} aria-hidden />
      </button>
    }
    notifications={
      <button
        type="button"
        className="p-2 rounded hover:bg-[var(--win11-hover)] transition-colors text-foreground"
        aria-label="Notifications"
      >
        <Bell size={16} aria-hidden />
      </button>
    }
  />
)
WithActions.storyName = 'With notifications + actions'

export const NoThemeToggle = () => (
  <Header title="Read-only view" showThemeToggle={false} />
)
NoThemeToggle.storyName = 'Theme toggle hidden'

export const WithLeading = () => (
  <Header
    title="Profile Details"
    leading={
      <button
        type="button"
        className="p-2 rounded hover:bg-[var(--win11-hover)] transition-colors text-muted-foreground"
        aria-label="Go back"
      >
        ←
      </button>
    }
  />
)
WithLeading.storyName = 'With leading slot (back button)'
