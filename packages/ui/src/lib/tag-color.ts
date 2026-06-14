/**
 * Deterministic tag → color mapping.
 * Same tag string always maps to the same palette color.
 * Uses FNV-1a 32-bit hash modulo palette size.
 */

const PALETTE = [
  '#7c3aed',
  '#d97706',
  '#059669',
  '#2563eb',
  '#db2777',
] as const

function fnv1a(input: string): number {
  let h = 0x811c9dc5
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return h >>> 0
}

export function getTagColor(tag: string): string {
  if (!tag) return PALETTE[0]
  const key = tag.trim().toLowerCase()
  return PALETTE[fnv1a(key) % PALETTE.length] as string
}
