import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider, ColorThemeProvider } from '@tuwibu/fluentkit'
import './index.css'
import App from './App'

async function bootstrap() {
  if (import.meta.env.DEV) {
    const { worker } = await import('./mocks/browser')
    await worker.start({ onUnhandledRequest: 'bypass' })
  }

  const rootEl = document.getElementById('root')
  if (!rootEl) throw new Error('Root element not found')

  createRoot(rootEl).render(
    <StrictMode>
      <ThemeProvider>
        <ColorThemeProvider>
          <App />
        </ColorThemeProvider>
      </ThemeProvider>
    </StrictMode>,
  )
}

bootstrap()
