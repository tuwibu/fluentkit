import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, afterEach, vi } from 'vitest'
import { useIsMobile } from './use-is-mobile'

type Listener = () => void

function mockMatchMedia(initialMatches: boolean) {
  let matches = initialMatches
  const listeners = new Set<Listener>()
  const mql = {
    get matches() {
      return matches
    },
    media: '(max-width: 767px)',
    addEventListener: (_: string, cb: Listener) => listeners.add(cb),
    removeEventListener: (_: string, cb: Listener) => listeners.delete(cb),
  }
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => mql),
  )
  return {
    setMatches(next: boolean) {
      matches = next
      listeners.forEach((cb) => cb())
    },
  }
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('useIsMobile', () => {
  it('returns true when the query matches', () => {
    mockMatchMedia(true)
    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(true)
  })

  it('returns false when the query does not match', () => {
    mockMatchMedia(false)
    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(false)
  })

  it('updates when the media query changes', () => {
    const ctl = mockMatchMedia(false)
    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(false)
    act(() => ctl.setMatches(true))
    expect(result.current).toBe(true)
  })
})
