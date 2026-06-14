import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Avatar } from './avatar'

describe('Avatar', () => {
  describe('initials', () => {
    it('derives two-letter initials from full name', () => {
      render(<Avatar name="Alice Smith" />)
      expect(screen.getByRole('img', { name: 'Alice Smith' })).toHaveTextContent('AS')
    })

    it('derives single-word initials (up to 2 chars)', () => {
      render(<Avatar name="Bob" />)
      expect(screen.getByRole('img', { name: 'Bob' })).toHaveTextContent('BO')
    })

    it('uppercases initials', () => {
      render(<Avatar name="carol white" />)
      expect(screen.getByRole('img', { name: 'carol white' })).toHaveTextContent('CW')
    })

    it('renders fallback "?" when name is empty string', () => {
      render(<Avatar name="" />)
      const el = document.querySelector('[role="img"]')
      expect(el).toHaveTextContent('?')
    })

    it('renders fallback "?" when name is omitted', () => {
      render(<Avatar />)
      const el = document.querySelector('[role="img"]')
      expect(el).toHaveTextContent('?')
    })
  })

  describe('deterministic color', () => {
    it('same name always produces same color class', () => {
      const { container: a } = render(<Avatar name="Alice Smith" />)
      const { container: b } = render(<Avatar name="Alice Smith" />)
      const classA = a.querySelector('[role="img"]')?.className
      const classB = b.querySelector('[role="img"]')?.className
      expect(classA).toBe(classB)
    })

    it('different names may produce different colors', () => {
      const { container: a } = render(<Avatar name="Alice Smith" />)
      const { container: b } = render(<Avatar name="Zelda Xander" />)
      const classA = a.querySelector('[role="img"]')?.className
      const classB = b.querySelector('[role="img"]')?.className
      // Not guaranteed to differ but Alice vs Zelda hash to different buckets
      expect(classA).not.toBe(classB)
    })
  })

  describe('image branch', () => {
    it('renders <img> when src is provided', () => {
      render(<Avatar name="Alice Smith" src="https://example.com/avatar.jpg" />)
      // The inner <img> element itself has role="img" with alt=name — query it directly
      const img = document.querySelector('img')
      expect(img).toBeInTheDocument()
      expect(img).toHaveAttribute('src', 'https://example.com/avatar.jpg')
      expect(img).toHaveAttribute('alt', 'Alice Smith')
    })

    it('does not render initials text when src is provided', () => {
      render(<Avatar name="Alice Smith" src="https://example.com/avatar.jpg" />)
      // Wrapper span contains only <img>, no text
      const wrapper = document.querySelector('[role="img"]')
      expect(wrapper?.textContent).toBe('')
    })

    it('renders img with empty alt when name is omitted', () => {
      render(<Avatar src="https://example.com/avatar.jpg" />)
      const img = document.querySelector('img')
      expect(img).toBeInTheDocument()
      expect(img).toHaveAttribute('alt', '')
    })
  })

  describe('size classes', () => {
    it('applies sm size class', () => {
      render(<Avatar name="X" size="sm" />)
      expect(document.querySelector('[role="img"]')?.className).toMatch(/w-7/)
    })

    it('applies md size class (default)', () => {
      render(<Avatar name="X" />)
      expect(document.querySelector('[role="img"]')?.className).toMatch(/w-10/)
    })

    it('applies lg size class', () => {
      render(<Avatar name="X" size="lg" />)
      expect(document.querySelector('[role="img"]')?.className).toMatch(/w-14/)
    })
  })

  describe('className prop', () => {
    it('merges custom className', () => {
      render(<Avatar name="X" className="my-custom-class" />)
      expect(document.querySelector('[role="img"]')?.className).toMatch(/my-custom-class/)
    })
  })
})
