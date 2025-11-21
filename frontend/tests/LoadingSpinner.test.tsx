import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import LoadingSpinner from '@/components/layout/LoadingSpinner'

describe('LoadingSpinner', () => {
  it('renders with default size', () => {
    render(<LoadingSpinner />)
    
    const spinner = screen.getByRole('status')
    expect(spinner).toHaveClass('w-8', 'h-8')
  })

  it('renders with small size', () => {
    render(<LoadingSpinner size="small" />)
    
    const spinner = screen.getByRole('status')
    expect(spinner).toHaveClass('w-4', 'h-4')
  })

  it('renders with large size', () => {
    render(<LoadingSpinner size="large" />)
    
    const spinner = screen.getByRole('status')
    expect(spinner).toHaveClass('w-12', 'h-12')
  })

  it('applies custom className', () => {
    render(<LoadingSpinner className="custom-class" />)
    
    const spinner = screen.getByRole('status')
    expect(spinner).toHaveClass('custom-class')
  })

  it('contains the spinner SVG', () => {
    render(<LoadingSpinner />)
    
    const spinner = screen.getByRole('status')
    const svg = spinner.querySelector('svg')
    expect(svg).toBeInTheDocument()
    expect(svg).toHaveClass('text-primary-600')
  })
})