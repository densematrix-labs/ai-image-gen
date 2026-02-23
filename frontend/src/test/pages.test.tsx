import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter, MemoryRouter } from 'react-router-dom'
import HomePage from '../pages/HomePage'
import PricingPage from '../pages/PricingPage'
import PaymentSuccessPage from '../pages/PaymentSuccessPage'

// Mock fetch
const mockFetch = vi.fn()
global.fetch = mockFetch

beforeEach(() => {
  mockFetch.mockReset()
})

describe('HomePage', () => {
  it('renders hero section', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    )
    
    expect(screen.getByText('hero.title')).toBeInTheDocument()
    expect(screen.getByText('hero.subtitle')).toBeInTheDocument()
  })

  it('renders image generator component', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    )
    
    expect(screen.getByTestId('image-generator')).toBeInTheDocument()
  })

  it('renders features section', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    )
    
    expect(screen.getByText('features.title')).toBeInTheDocument()
    expect(screen.getByText('features.fast.title')).toBeInTheDocument()
    expect(screen.getByText('features.styles.title')).toBeInTheDocument()
    expect(screen.getByText('features.quality.title')).toBeInTheDocument()
  })

  it('renders comparison section for SEO', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    )
    
    expect(screen.getByText('comparison.title')).toBeInTheDocument()
  })

  it('has alternative mention in hero for SEO', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    )
    
    expect(screen.getByText('hero.alternative')).toBeInTheDocument()
  })
})

describe('PricingPage', () => {
  beforeEach(() => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([
        { sku: 'starter_10', name: 'Starter', price_cents: 299, generations: 10 },
        { sku: 'pro_50', name: 'Pro', price_cents: 999, generations: 50, discount_percent: 30 },
        { sku: 'unlimited', name: 'Unlimited', price_cents: 1499, generations: 500 },
      ]),
    })
  })

  it('renders pricing title', async () => {
    render(
      <BrowserRouter>
        <PricingPage />
      </BrowserRouter>
    )
    
    await waitFor(() => {
      expect(screen.getByText('pricing.title')).toBeInTheDocument()
    })
  })

  it('loads and displays products', async () => {
    render(
      <BrowserRouter>
        <PricingPage />
      </BrowserRouter>
    )
    
    await waitFor(() => {
      expect(screen.getByText('Starter')).toBeInTheDocument()
      expect(screen.getByText('Pro')).toBeInTheDocument()
    })
  })

  it('renders FAQ section', async () => {
    render(
      <BrowserRouter>
        <PricingPage />
      </BrowserRouter>
    )
    
    await waitFor(() => {
      expect(screen.getByText('pricing.faq.title')).toBeInTheDocument()
    })
  })
})

describe('PaymentSuccessPage', () => {
  it('shows loading initially', () => {
    render(
      <MemoryRouter initialEntries={['/payment/success?device_id=test-device']}>
        <PaymentSuccessPage />
      </MemoryRouter>
    )
    
    expect(screen.getByText('success.processing')).toBeInTheDocument()
  })

  it('shows error if no device_id', async () => {
    render(
      <MemoryRouter initialEntries={['/payment/success']}>
        <PaymentSuccessPage />
      </MemoryRouter>
    )
    
    await waitFor(() => {
      expect(screen.getByText('Missing device ID')).toBeInTheDocument()
    })
  })

  it('shows success after loading tokens', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        tokens: [
          { token: 'tok_123', remaining_generations: 10, product_sku: 'starter_10' }
        ],
      }),
    })

    render(
      <MemoryRouter initialEntries={['/payment/success?device_id=test-device']}>
        <PaymentSuccessPage />
      </MemoryRouter>
    )
    
    await waitFor(() => {
      expect(screen.getByText('success.title')).toBeInTheDocument()
    }, { timeout: 5000 })
  })
})
