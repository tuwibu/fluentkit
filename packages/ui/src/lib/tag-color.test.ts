import { describe, it, expect } from 'vitest'
import { getTagColor } from './tag-color'

const PALETTE = ['#7c3aed', '#d97706', '#059669', '#2563eb', '#db2777']

describe('getTagColor', () => {
  it('is deterministic — same input always returns same color', () => {
    const tag = 'developer'
    const first = getTagColor(tag)
    expect(getTagColor(tag)).toBe(first)
    expect(getTagColor(tag)).toBe(first)
  })

  it('always returns a color from PALETTE', () => {
    const tags = ['vip', 'admin', 'user', 'manager', 'guest', 'superadmin', 'moderator']
    for (const tag of tags) {
      expect(PALETTE).toContain(getTagColor(tag))
    }
  })

  it('returns PALETTE[0] for empty string', () => {
    expect(getTagColor('')).toBe(PALETTE[0])
  })

  it('is case-insensitive — VIP, vip, Vip all return same color', () => {
    expect(getTagColor('VIP')).toBe(getTagColor('vip'))
    expect(getTagColor('Vip')).toBe(getTagColor('vip'))
  })

  it('trims whitespace — " vip " equals "vip"', () => {
    expect(getTagColor(' vip ')).toBe(getTagColor('vip'))
    expect(getTagColor('  VIP  ')).toBe(getTagColor('vip'))
  })

  it('different tags can map to different colors', () => {
    // Not guaranteed but likely with 5-color palette and varied inputs
    const results = new Set(['alpha', 'beta', 'gamma', 'delta', 'epsilon'].map(getTagColor))
    expect(results.size).toBeGreaterThan(1)
  })
})
