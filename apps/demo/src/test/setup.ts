import '@testing-library/jest-dom'
import { server } from '@/mocks/server'
import { beforeAll, afterEach, afterAll } from 'vitest'

// Polyfill ResizeObserver — not implemented in jsdom
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Polyfill pointer capture — Radix UI uses these
Element.prototype.hasPointerCapture = () => false
Element.prototype.setPointerCapture = () => {}
Element.prototype.releasePointerCapture = () => {}

// Polyfill scrollIntoView
Element.prototype.scrollIntoView = () => {}

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
