import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { useTheme } from 'next-themes'
import {
  type LightTheme,
  type DarkTheme,
  type ThemeConfig,
  lightThemeConfigs,
  darkThemeConfigs,
  lightThemeOptions,
  darkThemeOptions,
} from './presets'

// ── Context type ───────────────────────────────────────────────────────────
interface ColorThemeContextType {
  currentTheme: string
  setTheme: (theme: string) => void
  isDark: boolean
  themeOptions: { value: string; label: string }[]
}

// ── Context ────────────────────────────────────────────────────────────────
const ColorThemeContext = createContext<ColorThemeContextType | undefined>(undefined)

// ── SSR-safe localStorage helpers ─────────────────────────────────────────
function storageGet(key: string): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(key)
}

function storageSet(key: string, value: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(key, value)
}

// ── applyTheme: sets CSS vars on documentElement ───────────────────────────
function applyTheme(isDark: boolean, theme: string): void {
  if (typeof window === 'undefined') return
  const root = document.documentElement

  const config: ThemeConfig = isDark
    ? (darkThemeConfigs[theme as DarkTheme] ?? darkThemeConfigs.default)
    : (lightThemeConfigs[theme as LightTheme] ?? lightThemeConfigs.default)

  root.style.setProperty('--win11-wallpaper', config.wallpaper)
  root.style.setProperty('--background', config.wallpaper)
  root.style.setProperty('--primary', config.primary)
  root.style.setProperty('--primary-foreground', config.primaryForeground)
  root.style.setProperty('--ring', config.ring)
  root.style.setProperty('--accent', config.primary)
  root.style.setProperty('--accent-foreground', config.primaryForeground)
  root.style.setProperty('--sidebar-primary', config.primary)
  root.style.setProperty('--sidebar-primary-foreground', config.primaryForeground)
  root.style.setProperty('--sidebar-ring', config.ring)
  root.style.setProperty('--win11-mica', config.mica)
  root.style.setProperty('--win11-card-bg', config.cardBg)
  root.style.setProperty('--win11-card-bg-solid', config.cardBgSolid)
  root.style.setProperty('--win11-card-border', config.cardBorder)
  root.style.setProperty('--card', config.cardBg)
  root.style.setProperty('--border', config.border)
  root.style.setProperty('--win11-control-bg', config.controlBg)
  root.style.setProperty('--win11-control-border', config.controlBorder)
  root.style.setProperty('--win11-control-hover', config.controlHover)
  root.style.setProperty('--popover', config.popover)
}

// ── Provider ───────────────────────────────────────────────────────────────
export function ColorThemeProvider({ children }: { children: ReactNode }) {
  // next-themes is the single source of truth for light/dark — reading the
  // .dark class off <html> raced its first commit and froze a wrong mode.
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  const [lightTheme, setLightTheme] = useState<LightTheme>(() => {
    const saved = storageGet('light-theme') as LightTheme | null
    return saved && lightThemeConfigs[saved] ? saved : 'default'
  })
  const [darkTheme, setDarkTheme] = useState<DarkTheme>(() => {
    const saved = storageGet('dark-theme') as DarkTheme | null
    return saved && darkThemeConfigs[saved] ? saved : 'default'
  })
  const prevIsDarkRef = useRef<boolean | null>(null)

  // Reset preset to default on mode flip — mirrors source behavior
  useEffect(() => {
    if (resolvedTheme === undefined) return

    if (prevIsDarkRef.current !== null && prevIsDarkRef.current !== isDark) {
      if (isDark) {
        setDarkTheme('default')
        storageSet('dark-theme', 'default')
      } else {
        setLightTheme('default')
        storageSet('light-theme', 'default')
      }
    }
    prevIsDarkRef.current = isDark
  }, [resolvedTheme, isDark])

  // Apply CSS vars whenever mode or preset changes
  useEffect(() => {
    if (resolvedTheme === undefined) return
    applyTheme(isDark, isDark ? darkTheme : lightTheme)
  }, [resolvedTheme, isDark, lightTheme, darkTheme])

  const setTheme = (theme: string): void => {
    if (isDark) {
      setDarkTheme(theme as DarkTheme)
      storageSet('dark-theme', theme)
    } else {
      setLightTheme(theme as LightTheme)
      storageSet('light-theme', theme)
    }
  }

  const currentTheme = isDark ? darkTheme : lightTheme
  const themeOptions = isDark
    ? darkThemeOptions.map((o) => ({ value: o.value, label: o.label }))
    : lightThemeOptions.map((o) => ({ value: o.value, label: o.label }))

  return (
    <ColorThemeContext.Provider value={{ currentTheme, setTheme, isDark, themeOptions }}>
      {children}
    </ColorThemeContext.Provider>
  )
}

// ── Hook ───────────────────────────────────────────────────────────────────
export function useColorTheme(): ColorThemeContextType {
  const context = useContext(ColorThemeContext)
  if (!context) {
    throw new Error('useColorTheme must be used within a ColorThemeProvider')
  }
  return context
}

// Re-export types for consumers
export type { LightTheme, DarkTheme }
