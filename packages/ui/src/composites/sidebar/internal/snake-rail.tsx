import { useEffect, useLayoutEffect, useRef, useState } from 'react'

// Port verbatim from multiprofile-v2 snake-rail.tsx
const RAIL_H = 16
const STRETCH_MS = 150

interface SnakeRailProps {
  targetEl: HTMLElement | null
  containerEl: HTMLElement | null
}

interface RailGeom {
  top: number
  height: number
  visible: boolean
  instant: boolean
}

function computeCenter(target: HTMLElement, container: HTMLElement): number {
  const tRect = target.getBoundingClientRect()
  const cRect = container.getBoundingClientRect()
  return tRect.top - cRect.top + (tRect.height - RAIL_H) / 2
}

export function SnakeRail({ targetEl, containerEl }: SnakeRailProps) {
  const [geom, setGeom] = useState<RailGeom>({
    top: 0,
    height: RAIL_H,
    visible: false,
    instant: true,
  })
  const prevTopRef = useRef<number | null>(null)
  const stretchTimerRef = useRef<number | null>(null)
  const targetRef = useRef<HTMLElement | null>(null)
  const containerRef = useRef<HTMLElement | null>(null)

  targetRef.current = targetEl
  containerRef.current = containerEl

  // Snap rail to current target without stretch (ResizeObserver / first mount)
  const snap = (instant: boolean) => {
    const t = targetRef.current
    const c = containerRef.current
    if (!t || !c) return
    const top = computeCenter(t, c)
    prevTopRef.current = top
    setGeom({ top, height: RAIL_H, visible: true, instant })
    if (instant) {
      requestAnimationFrame(() => setGeom((g) => ({ ...g, instant: false })))
    }
  }

  const animateTo = (newTop: number) => {
    const oldTop = prevTopRef.current
    if (stretchTimerRef.current != null) {
      window.clearTimeout(stretchTimerRef.current)
      stretchTimerRef.current = null
    }
    if (oldTop == null) {
      prevTopRef.current = newTop
      setGeom({ top: newTop, height: RAIL_H, visible: true, instant: true })
      requestAnimationFrame(() => setGeom((g) => ({ ...g, instant: false })))
      return
    }
    if (Math.abs(newTop - oldTop) < 1) {
      prevTopRef.current = newTop
      return
    }
    const stretchTop = Math.min(oldTop, newTop)
    const stretchHeight = Math.abs(newTop - oldTop) + RAIL_H
    setGeom({ top: stretchTop, height: stretchHeight, visible: true, instant: false })
    stretchTimerRef.current = window.setTimeout(() => {
      setGeom({ top: newTop, height: RAIL_H, visible: true, instant: false })
      stretchTimerRef.current = null
    }, STRETCH_MS)
    prevTopRef.current = newTop
  }

  // Snake animation when target identity changes (active key change)
  useLayoutEffect(() => {
    if (!targetEl || !containerEl) {
      setGeom((g) => ({ ...g, visible: false }))
      return
    }
    animateTo(computeCenter(targetEl, containerEl))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetEl, containerEl])

  // Re-position rail when container layout shifts (font load, window resize)
  useEffect(() => {
    if (!containerEl) return
    const ro = new ResizeObserver(() => {
      if (stretchTimerRef.current != null) return
      snap(true)
    })
    ro.observe(containerEl)
    return () => ro.disconnect()
  }, [containerEl]) // eslint-disable-line react-hooks/exhaustive-deps

  // Submenu maxHeight transition — rAF poll to follow rail during animation
  useEffect(() => {
    if (!containerEl) return
    let rafId: number | null = null
    let running = false

    const tick = () => {
      const t = targetRef.current
      const c = containerRef.current
      if (t && c) {
        const top = computeCenter(t, c)
        if (prevTopRef.current == null || Math.abs(top - prevTopRef.current) > 0.5) {
          prevTopRef.current = top
          setGeom({ top, height: RAIL_H, visible: true, instant: true })
        }
      }
      if (running) rafId = requestAnimationFrame(tick)
    }

    const onStart = (e: TransitionEvent) => {
      if (e.propertyName !== 'max-height') return
      if (stretchTimerRef.current != null) return
      if (running) return
      running = true
      rafId = requestAnimationFrame(tick)
    }
    const onEnd = (e: TransitionEvent) => {
      if (e.propertyName !== 'max-height') return
      running = false
      if (rafId != null) cancelAnimationFrame(rafId)
      rafId = null
      const t = targetRef.current
      const c = containerRef.current
      if (t && c) {
        const top = computeCenter(t, c)
        prevTopRef.current = top
        setGeom({ top, height: RAIL_H, visible: true, instant: false })
      }
    }

    containerEl.addEventListener('transitionstart', onStart)
    containerEl.addEventListener('transitionend', onEnd)
    containerEl.addEventListener('transitioncancel', onEnd)
    return () => {
      containerEl.removeEventListener('transitionstart', onStart)
      containerEl.removeEventListener('transitionend', onEnd)
      containerEl.removeEventListener('transitioncancel', onEnd)
      running = false
      if (rafId != null) cancelAnimationFrame(rafId)
    }
  }, [containerEl])

  useEffect(() => {
    return () => {
      if (stretchTimerRef.current != null)
        window.clearTimeout(stretchTimerRef.current)
    }
  }, [])

  if (!geom.visible) return null

  return (
    <span
      className="absolute left-2 w-[3px] rounded-full bg-primary pointer-events-none z-[60]"
      data-instant={geom.instant ? 'true' : 'false'}
      style={{
        top: `${geom.top}px`,
        height: `${geom.height}px`,
        transition: geom.instant
          ? 'none'
          : 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
      }}
      aria-hidden
    />
  )
}
