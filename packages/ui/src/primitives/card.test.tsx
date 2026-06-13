import { render, screen } from '@testing-library/react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
} from './card'

describe('Card', () => {
  it('renders children', () => {
    render(<Card>card content</Card>)
    expect(screen.getByText('card content')).toBeInTheDocument()
  })

  it('passes className through', () => {
    render(<Card className="custom-card">content</Card>)
    expect(screen.getByText('content')).toHaveClass('custom-card')
  })

  it('has data-slot attribute', () => {
    render(<Card>content</Card>)
    expect(screen.getByText('content')).toHaveAttribute('data-slot', 'card')
  })

  it('renders sub-components with correct data-slot', () => {
    render(
      <Card>
        <CardHeader data-testid="header">
          <CardTitle>Title</CardTitle>
          <CardDescription>Desc</CardDescription>
          <CardAction>Action</CardAction>
        </CardHeader>
        <CardContent>Content</CardContent>
        <CardFooter>Footer</CardFooter>
      </Card>,
    )
    expect(screen.getByTestId('header')).toHaveAttribute('data-slot', 'card-header')
    expect(screen.getByText('Title')).toHaveAttribute('data-slot', 'card-title')
    expect(screen.getByText('Desc')).toHaveAttribute('data-slot', 'card-description')
    expect(screen.getByText('Action')).toHaveAttribute('data-slot', 'card-action')
    expect(screen.getByText('Content')).toHaveAttribute('data-slot', 'card-content')
    expect(screen.getByText('Footer')).toHaveAttribute('data-slot', 'card-footer')
  })
})
