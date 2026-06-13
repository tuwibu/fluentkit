import { twMerge } from 'tailwind-merge'

/**
 * Classname joiner with Tailwind conflict resolution.
 * Filters out falsy values; delegates to twMerge so later utilities override earlier ones.
 */
export function cx(...classes: (string | undefined | false | null)[]): string {
  return twMerge(classes.filter(Boolean).join(' '))
}
// Note: `cn` lives in ./cn.ts (clsx-based, supports objects/arrays). Import it
// from there — do NOT alias cn = cx here, the two have different signatures.
