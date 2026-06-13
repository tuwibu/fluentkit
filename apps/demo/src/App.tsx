import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { SidebarNav, Button } from '@fluent-kit/ui'
import type { SidebarNavItem } from '@fluent-kit/ui'
import { LayoutDashboard, Users, Settings, LogIn, ListPlus, Moon, Sun } from 'lucide-react'
import { useState } from 'react'
import { queryClient } from '@/lib/query-client'
import { DashboardScreen } from '@/screens/dashboard/dashboard-screen'
import { UsersScreen } from '@/screens/users/users-screen'
import { FormDrawerScreen } from '@/screens/form-drawer/form-drawer-screen'
import { SettingsScreen } from '@/screens/settings/settings-screen'
import { LoginScreen } from '@/screens/login/login-screen'

const NAV_ITEMS: SidebarNavItem[] = [
  { id: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
  { id: '/users', label: 'Users', icon: <Users size={16} /> },
  { id: '/crud', label: 'CRUD Drawer', icon: <ListPlus size={16} /> },
  { id: '/settings', label: 'Settings', icon: <Settings size={16} /> },
  { id: '/login', label: 'Login', icon: <LogIn size={16} /> },
]

function AppShell() {
  const navigate = useNavigate()
  const location = useLocation()
  const [dark, setDark] = useState(false)

  function toggleDark() {
    setDark((v) => {
      const next = !v
      document.documentElement.classList.toggle('dark', next)
      return next
    })
  }

  const activeId =
    NAV_ITEMS.find((item) => location.pathname.startsWith(item.id))?.id ?? '/dashboard'

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <aside className="sticky top-0 h-screen shrink-0 border-r border-border flex flex-col">
        <div className="px-4 py-3 border-b border-border">
          <p className="font-semibold text-sm">Fluent Kit</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          <SidebarNav
            items={NAV_ITEMS}
            activeId={activeId}
            onSelect={(id) => navigate(id)}
            sidebarWidth={200}
          />
        </div>
        <div className="p-3 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleDark}
            aria-label="Toggle dark mode"
            className="w-full justify-start gap-2"
          >
            {dark ? <Sun size={14} /> : <Moon size={14} />}
            {dark ? 'Light mode' : 'Dark mode'}
          </Button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <Routes>
          <Route path="/" element={<DashboardScreen />} />
          <Route path="/dashboard" element={<DashboardScreen />} />
          <Route path="/users" element={<UsersScreen />} />
          <Route path="/crud" element={<FormDrawerScreen />} />
          <Route path="/settings" element={<SettingsScreen />} />
          <Route path="/login" element={<LoginScreen />} />
        </Routes>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </QueryClientProvider>
  )
}
