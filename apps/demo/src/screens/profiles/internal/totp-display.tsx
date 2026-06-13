import { useState, useEffect } from 'react'

const RING_R = 10
const RING_CIRC = 2 * Math.PI * RING_R
const MOCK_CODE = '599274'
const WINDOW_SEC = 30

function msUntilNextWindow(): number {
  const now = Date.now()
  const elapsed = (now / 1000) % WINDOW_SEC
  return (WINDOW_SEC - elapsed) * 1000
}

export function TotpDisplay() {
  const [msUntilNext, setMsUntilNext] = useState(() => msUntilNextWindow())

  useEffect(() => {
    const id = setInterval(() => {
      setMsUntilNext(msUntilNextWindow())
    }, 1000)
    return () => clearInterval(id)
  }, [])

  const progress = msUntilNext / (WINDOW_SEC * 1000)
  const dashOffset = RING_CIRC * (1 - progress)
  const isUrgent = msUntilNext <= 5_000
  const secondsLeft = Math.ceil(msUntilNext / 1000)

  return (
    <div className="flex items-center gap-2">
      <svg className="size-6 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
        <circle
          cx="12"
          cy="12"
          r={RING_R}
          fill="none"
          strokeWidth="2"
          stroke="var(--border)"
        />
        <circle
          cx="12"
          cy="12"
          r={RING_R}
          fill="none"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={RING_CIRC}
          strokeDashoffset={dashOffset}
          stroke={isUrgent ? 'var(--destructive)' : 'var(--primary)'}
          style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
        />
      </svg>

      <span
        className={`text-heading font-semibold tracking-[2px]${
          isUrgent ? ' text-destructive' : ' text-foreground'
        }`}
        aria-label={`TOTP code ${MOCK_CODE.split('').join(' ')}`}
      >
        {MOCK_CODE.slice(0, 3)}&nbsp;{MOCK_CODE.slice(3)}
      </span>

      <span className="ml-auto text-micro text-muted-foreground" aria-hidden="true">
        {secondsLeft}s
      </span>
    </div>
  )
}
