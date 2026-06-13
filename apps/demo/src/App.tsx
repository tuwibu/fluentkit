import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { AppShell, UserDropdown } from '@fluent-kit/ui'
import { queryClient } from '@/lib/query-client'
import { MENU_ITEMS, getActiveKey, getMenuTitle } from '@/config/menu'
import { DashboardScreen } from '@/screens/dashboard/dashboard-screen'
import { UsersScreen } from '@/screens/users/users-screen'
import { ProfilesScreen } from '@/screens/profiles/profiles-screen'
import { FormDrawerScreen } from '@/screens/form-drawer/form-drawer-screen'
import { SettingsScreen } from '@/screens/settings/settings-screen'
import { LoginScreen } from '@/screens/login/login-screen'

function AppLayout() {
  const navigate = useNavigate()
  const location = useLocation()

  const activeKey = getActiveKey(location.pathname)
  const headerTitle = getMenuTitle(location.pathname)

  return (
    <AppShell
      menu={MENU_ITEMS}
      activeKey={activeKey}
      onSelect={(key) => { if (!key.endsWith('-group')) navigate(key) }}
      brand={{ name: 'MultiProfile', version: 'v2.4.1' }}
      headerTitle={headerTitle}
      user={
        <UserDropdown
          user={{ name: 'Admin User', email: 'admin@multiprofile.app' }}
          onLogout={() => navigate('/login')}
          onOpenSettings={() => navigate('/settings')}
          colorThemeControl
        />
      }
    >
      <Routes>
        <Route path="/" element={<DashboardScreen />} />
        <Route path="/dashboard" element={<DashboardScreen />} />
        <Route path="/users" element={<UsersScreen />} />
        <Route path="/profiles" element={<ProfilesScreen />} />
        <Route path="/crud" element={<FormDrawerScreen />} />
        <Route path="/settings" element={<SettingsScreen />} />
        <Route path="/login" element={<LoginScreen />} />
      </Routes>
    </AppShell>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </QueryClientProvider>
  )
}
