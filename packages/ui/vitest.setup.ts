import '@testing-library/jest-dom'

// Polyfills required by Radix UI primitives in jsdom environment.
// ResizeObserver is used by radix-ui/react-use-size (Select content sizing).
// hasPointerCapture is used by radix-ui/react-select pointer tracking.
if (typeof window !== 'undefined') {
  if (!window.ResizeObserver) {
    window.ResizeObserver = class ResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  }

  // jsdom does not implement pointer capture APIs — stub them out so Radix
  // primitives that call hasPointerCapture / setPointerCapture don't throw.
  if (!Element.prototype.hasPointerCapture) {
    Element.prototype.hasPointerCapture = () => false
  }
  if (!Element.prototype.setPointerCapture) {
    Element.prototype.setPointerCapture = () => {}
  }
  if (!Element.prototype.releasePointerCapture) {
    Element.prototype.releasePointerCapture = () => {}
  }
}

