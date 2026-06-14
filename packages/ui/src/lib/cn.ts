import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

// Register the project's custom font-size tokens (text-micro/caption/body/title/
// heading/display) with tailwind-merge. Without this, twMerge classifies e.g.
// `text-caption` ambiguously and a sibling text-COLOR utility (`text-emerald-600`)
// in the same cn() call strips the font-size — breaking pill/badge sizing.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        { text: ['micro', 'caption', 'body', 'title', 'heading', 'display'] },
      ],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
