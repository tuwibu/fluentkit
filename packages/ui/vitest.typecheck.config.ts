import { defineConfig } from 'vitest/config'

/**
 * Dedicated config for type-level tests (*.test-d.ts).
 * Run via: vitest --typecheck --run --config vitest.typecheck.config.ts
 */
export default defineConfig({
  test: {
    // No jsdom needed — type-level tests don't run in a DOM
    environment: 'node',
    include: ['src/**/*.test-d.ts'],
    typecheck: {
      enabled: true,
      include: ['src/**/*.test-d.ts'],
      tsconfig: './tsconfig.typecheck.json',
    },
  },
})
