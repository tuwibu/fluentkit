import { useEffect, useState } from 'react'

/**
 * Tracks whether the viewport is below the `md` breakpoint (Tailwind default 768px).
 * Used by AppShell to switch the sidebar between inline (desktop) and off-canvas
 * drawer (mobile). SSR-safe: returns `false` when `window` is unavailable, then
 * syncs on mount.
 */
export function useIsMobile(query = '(max-width: 767px)'): boolean {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false
    return window.matchMedia(query).matches
  })

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const mql = window.matchMedia(query)
    const onChange = () => setIsMobile(mql.matches)
    onChange()
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])

  return isMobile
}
