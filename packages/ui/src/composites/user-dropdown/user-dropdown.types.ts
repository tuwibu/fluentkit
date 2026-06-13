export interface UserDropdownUser {
  name: string
  email: string
  avatar?: string
}

export interface UserDropdownProps {
  user: UserDropdownUser
  onLogout: () => void
  onOpenSettings?: () => void
  /** Show color theme selector. Default: true */
  colorThemeControl?: boolean
  /** Show language selector. Default: false */
  languageControl?: boolean
  /** Collapsed sidebar mode — trigger shows avatar only */
  collapsed?: boolean
  /** Language value (controlled) */
  language?: string
  /** Language options list */
  languageOptions?: { value: string; label: string }[]
  /** Called when language changes */
  onLanguageChange?: (value: string) => void
}
