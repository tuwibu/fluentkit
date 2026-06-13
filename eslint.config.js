import tseslint from 'typescript-eslint'

export default tseslint.config(
  // Base TS rules for all packages
  {
    files: ['packages/**/*.{ts,tsx}', 'apps/**/*.{ts,tsx}'],
    extends: [...tseslint.configs.recommended],
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },

  // BOUNDARY RULE: packages/ui/src must never import coupling deps
  // This is the anti-tech-debt guardrail — keeps @fluent-kit/ui fully decoupled
  {
    files: ['packages/ui/src/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@reduxjs/*', 'redux', 'react-redux'],
              message:
                'packages/ui must not import redux. Pass state via props/callbacks.',
            },
            {
              group: [
                'react-router',
                'react-router-dom',
                'react-router/*',
                'react-router-dom/*',
              ],
              message:
                'packages/ui must not import react-router. Use callback props for navigation.',
            },
            {
              // Known limit: matches alias/bare specifiers (e.g. '@/services/x').
              // Deep relative escapes ('../../services/x') also leave the package
              // boundary and won't resolve — caught at build, not here.
              group: ['**/services/**', '**/services/*', '@/services', '@/services/*'],
              message:
                'packages/ui must not import services. Fetch data in the app layer.',
            },
            {
              group: ['@wailsjs/*', '@wailsjs'],
              message:
                'packages/ui must not import wails bindings. Keep the lib platform-agnostic.',
            },
            {
              group: ['axios'],
              message:
                'packages/ui must not import axios directly. Use props/callbacks for data.',
            },
            {
              group: ['**/store/**', '**/store/*', '@/store', '@/store/*'],
              message:
                'packages/ui must not access the app store. Props only.',
            },
          ],
        },
      ],
    },
  },

  // Ignore patterns
  {
    ignores: [
      '**/dist/**',
      '**/node_modules/**',
      '**/.storybook/**',
      '**/storybook-static/**',
      '**/coverage/**',
    ],
  },
)
