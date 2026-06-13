import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts', 'src/rhf/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  splitting: false,
  outDir: 'dist',
  external: [
    'react',
    'react-dom',
    'react/jsx-runtime',
    'radix-ui',
    'lucide-react',
    'class-variance-authority',
    'clsx',
    'tailwind-merge',
    'date-fns',
    'react-hook-form',
    'zod',
    '@hookform/resolvers',
  ],
  noExternal: ['@tanstack/react-table', '@tanstack/react-virtual'],
})
