// ── Types ──────────────────────────────────────────────────────────────────
export type LightTheme = 'default' | 'purple' | 'blue' | 'green' | 'orange' | 'pink'
export type DarkTheme = 'default' | 'violet' | 'navy' | 'orange'

export interface ThemeConfig {
  wallpaper: string
  primary: string
  primaryForeground: string
  ring: string
  mica: string
  cardBg: string
  cardBgSolid: string
  cardBorder: string
  border: string
  controlBg: string
  controlBorder: string
  controlHover: string
  popover: string
}

// ── Light presets (6) ──────────────────────────────────────────────────────
export const lightThemeConfigs: Record<LightTheme, ThemeConfig> = {
  default: {
    wallpaper: 'linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 50%, #dcdcdc 100%)',
    primary: 'oklch(0.546 0.245 262.88)', // #0078d4
    primaryForeground: 'oklch(1 0 0)',
    ring: 'oklch(0.546 0.245 262.88)',
    mica: 'linear-gradient(180deg, rgba(243,243,243,0.9) 0%, rgba(238,238,238,0.85) 100%)',
    cardBg: 'rgba(255,255,255,0.7)',
    cardBgSolid: '#ffffff',
    cardBorder: 'rgba(0,0,0,0.06)',
    border: 'rgba(0,0,0,0.06)',
    controlBg: '#fbfbfb',
    controlBorder: '#e5e5e5',
    controlHover: '#f0f0f0',
    popover: 'rgba(255,255,255,0.85)',
  },
  purple: {
    wallpaper: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)',
    primary: 'oklch(0.585 0.233 292.72)', // #8b5cf6
    primaryForeground: 'oklch(1 0 0)',
    ring: 'oklch(0.585 0.233 292.72)',
    mica: 'linear-gradient(180deg, rgba(248,245,254,0.9) 0%, rgba(244,240,252,0.85) 100%)',
    cardBg: 'rgba(248,245,254,0.72)',
    cardBgSolid: '#f8f5fe',
    cardBorder: 'rgba(139,92,246,0.12)',
    border: 'rgba(139,92,246,0.10)',
    controlBg: '#f6f2fe',
    controlBorder: 'rgba(139,92,246,0.16)',
    controlHover: '#efe9fd',
    popover: 'rgba(248,245,254,0.92)',
  },
  blue: {
    wallpaper: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 25%, #3b82f6 50%, #06b6d4 75%, #0284c7 100%)',
    primary: 'oklch(0.623 0.214 259.13)', // #3b82f6
    primaryForeground: 'oklch(1 0 0)',
    ring: 'oklch(0.623 0.214 259.13)',
    mica: 'linear-gradient(180deg, rgba(243,247,254,0.9) 0%, rgba(237,243,253,0.85) 100%)',
    cardBg: 'rgba(243,247,254,0.72)',
    cardBgSolid: '#f3f7fe',
    cardBorder: 'rgba(59,130,246,0.12)',
    border: 'rgba(59,130,246,0.10)',
    controlBg: '#eef5fe',
    controlBorder: 'rgba(59,130,246,0.16)',
    controlHover: '#e4eefd',
    popover: 'rgba(243,247,254,0.92)',
  },
  green: {
    wallpaper: 'linear-gradient(135deg, #10b981 0%, #059669 25%, #34d399 50%, #14b8a6 75%, #0d9488 100%)',
    primary: 'oklch(0.696 0.17 162.48)', // #10b981
    primaryForeground: 'oklch(1 0 0)',
    ring: 'oklch(0.696 0.17 162.48)',
    mica: 'linear-gradient(180deg, rgba(241,251,247,0.9) 0%, rgba(234,249,242,0.85) 100%)',
    cardBg: 'rgba(241,251,247,0.72)',
    cardBgSolid: '#f1fbf7',
    cardBorder: 'rgba(16,185,129,0.12)',
    border: 'rgba(16,185,129,0.10)',
    controlBg: '#ecfaf4',
    controlBorder: 'rgba(16,185,129,0.16)',
    controlHover: '#ddf6ec',
    popover: 'rgba(241,251,247,0.92)',
  },
  orange: {
    wallpaper: 'linear-gradient(135deg, #f97316 0%, #ea580c 25%, #fb923c 50%, #f59e0b 75%, #d97706 100%)',
    primary: 'oklch(0.702 0.191 41.12)', // #f97316
    primaryForeground: 'oklch(1 0 0)',
    ring: 'oklch(0.702 0.191 41.12)',
    mica: 'linear-gradient(180deg, rgba(255,247,241,0.9) 0%, rgba(254,242,233,0.85) 100%)',
    cardBg: 'rgba(255,247,241,0.72)',
    cardBgSolid: '#fff7f1',
    cardBorder: 'rgba(249,115,22,0.12)',
    border: 'rgba(249,115,22,0.10)',
    controlBg: '#fff3ea',
    controlBorder: 'rgba(249,115,22,0.16)',
    controlHover: '#ffe9d9',
    popover: 'rgba(255,247,241,0.92)',
  },
  pink: {
    wallpaper: 'linear-gradient(135deg, #ec4899 0%, #db2777 25%, #f472b6 50%, #e879f9 75%, #c026d3 100%)',
    primary: 'oklch(0.656 0.241 354.31)', // #ec4899
    primaryForeground: 'oklch(1 0 0)',
    ring: 'oklch(0.656 0.241 354.31)',
    mica: 'linear-gradient(180deg, rgba(254,244,249,0.9) 0%, rgba(253,238,246,0.85) 100%)',
    cardBg: 'rgba(254,244,249,0.72)',
    cardBgSolid: '#fef4f9',
    cardBorder: 'rgba(236,72,153,0.12)',
    border: 'rgba(236,72,153,0.10)',
    controlBg: '#fdeff6',
    controlBorder: 'rgba(236,72,153,0.16)',
    controlHover: '#fce3ef',
    popover: 'rgba(254,244,249,0.92)',
  },
}

// ── Dark presets (4) ───────────────────────────────────────────────────────
export const darkThemeConfigs: Record<DarkTheme, ThemeConfig> = {
  default: {
    wallpaper: 'linear-gradient(135deg, #202020 0%, #2b2b2b 50%, #202020 100%)',
    primary: 'oklch(0.789 0.154 211.53)', // #60cdff
    primaryForeground: 'oklch(0.234 0.065 229.7)', // #003d5c
    ring: 'oklch(0.789 0.154 211.53)',
    mica: 'linear-gradient(180deg, rgba(42,42,42,0.72) 0%, rgba(32,32,32,0.68) 100%)',
    cardBg: 'rgba(50,50,50,0.66)',
    cardBgSolid: '#2f2f2f',
    cardBorder: 'rgba(255,255,255,0.08)',
    border: 'rgba(255,255,255,0.08)',
    controlBg: '#383838',
    controlBorder: '#4a4a4a',
    controlHover: '#424242',
    popover: 'rgba(48,48,48,0.96)',
  },
  violet: {
    wallpaper: 'linear-gradient(135deg, #140a2e 0%, #2a1550 40%, #3d1a55 70%, #1a0e30 100%)',
    primary: 'oklch(0.702 0.183 292.79)', // #a78bfa
    primaryForeground: 'oklch(0.283 0.141 291.09)',
    ring: 'oklch(0.702 0.183 292.79)',
    mica: 'linear-gradient(180deg, rgba(40,30,58,0.66) 0%, rgba(30,22,46,0.62) 100%)',
    cardBg: 'rgba(48,38,66,0.6)',
    cardBgSolid: '#2c2046',
    cardBorder: 'rgba(167,139,250,0.16)',
    border: 'rgba(167,139,250,0.16)',
    controlBg: '#362a54',
    controlBorder: 'rgba(167,139,250,0.22)',
    controlHover: '#413463',
    popover: 'rgba(44,32,70,0.96)',
  },
  navy: {
    wallpaper: 'linear-gradient(135deg, #080d20 0%, #122247 42%, #0c2a40 72%, #080d20 100%)',
    primary: 'oklch(0.713 0.137 257.42)', // #60a5fa
    primaryForeground: 'oklch(0.248 0.072 264.05)',
    ring: 'oklch(0.713 0.137 257.42)',
    mica: 'linear-gradient(180deg, rgba(26,36,58,0.66) 0%, rgba(18,26,44,0.62) 100%)',
    cardBg: 'rgba(30,42,68,0.6)',
    cardBgSolid: '#1a2440',
    cardBorder: 'rgba(96,165,250,0.16)',
    border: 'rgba(96,165,250,0.16)',
    controlBg: '#243150',
    controlBorder: 'rgba(96,165,250,0.22)',
    controlHover: '#2a3a5e',
    popover: 'rgba(26,36,64,0.96)',
  },
  orange: {
    wallpaper: 'linear-gradient(135deg, #2a1305 0%, #45260e 40%, #401a10 70%, #1e0f06 100%)',
    primary: 'oklch(0.738 0.173 55.93)', // #fb923c
    primaryForeground: 'oklch(0.266 0.079 41.12)',
    ring: 'oklch(0.738 0.173 55.93)',
    mica: 'linear-gradient(180deg, rgba(50,34,18,0.66) 0%, rgba(38,26,14,0.62) 100%)',
    cardBg: 'rgba(58,40,22,0.6)',
    cardBgSolid: '#3a2614',
    cardBorder: 'rgba(251,146,60,0.16)',
    border: 'rgba(251,146,60,0.16)',
    controlBg: '#45301b',
    controlBorder: 'rgba(251,146,60,0.22)',
    controlHover: '#523a22',
    popover: 'rgba(58,38,20,0.96)',
  },
}

// ── Theme options for dropdowns ────────────────────────────────────────────
export const lightThemeOptions: { value: LightTheme; label: string }[] = [
  { value: 'default', label: 'Default' },
  { value: 'purple', label: 'Purple' },
  { value: 'blue', label: 'Blue' },
  { value: 'green', label: 'Green' },
  { value: 'orange', label: 'Orange' },
  { value: 'pink', label: 'Pink' },
]

export const darkThemeOptions: { value: DarkTheme; label: string }[] = [
  { value: 'default', label: 'Default' },
  { value: 'violet', label: 'Violet' },
  { value: 'navy', label: 'Navy' },
  { value: 'orange', label: 'Orange' },
]
