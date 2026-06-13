import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
    // typecheck runs only via `test:types` (vitest --typecheck --run)
    // to avoid breaking runtime test suite with globals type errors
    typecheck: {
      enabled: false,
      include: ['src/**/*.test-d.ts'],
      tsconfig: './tsconfig.json',
    },
  },
})
