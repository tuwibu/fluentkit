import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

interface AppShellState {
  collapsed: boolean
  toggleSidebar: () => void
}

const AppShellContext = createContext<AppShellState | undefined>(undefined)

interface AppShellProviderProps {
  children: ReactNode
  defaultCollapsed?: boolean
}

export function AppShellProvider({ children, defaultCollapsed = false }: AppShellProviderProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed)

  const toggleSidebar = () => setCollapsed((v) => !v)

  // Keep body.sb-collapsed in sync so external CSS selectors (e.g. :root.sb-collapsed > *)
  // can respond to sidebar state without prop drilling.
  // Cleanup removes the class on unmount to prevent it leaking when the shell
  // is conditionally rendered. Safe as long as only ONE AppShellProvider is
  // mounted at a time — two concurrent providers would race on the same body class.
  useEffect(() => {
    if (collapsed) {
      document.body.classList.add('sb-collapsed')
    } else {
      document.body.classList.remove('sb-collapsed')
    }
    return () => {
      document.body.classList.remove('sb-collapsed')
    }
  }, [collapsed])

  return (
    <AppShellContext.Provider value={{ collapsed, toggleSidebar }}>
      {children}
    </AppShellContext.Provider>
  )
}

export function useAppShell(): AppShellState {
  const ctx = useContext(AppShellContext)
  if (!ctx) {
    throw new Error('useAppShell must be used within an AppShellProvider')
  }
  return ctx
}
