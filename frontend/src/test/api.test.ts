import { describe, it, expect, vi, beforeEach } from 'vitest'
import { generateImage, getUsage, getProducts, createCheckout, getTokensByDevice } from '../lib/api'

// Mock fetch
const mockFetch = vi.fn()
global.fetch = mockFetch

beforeEach(() => {
  mockFetch.mockReset()
})

describe('API', () => {
  describe('generateImage', () => {
    it('returns success result on 200', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          success: true,
          image_url: 'https://example.com/image.png',
          remaining_generations: 2,
          is_free_trial: true,
        }),
      })

      const result = await generateImage('test prompt', undefined, 'device-1')
      
      expect(result.success).toBe(true)
      expect(result.image_url).toBe('https://example.com/image.png')
    })

    it('handles string error detail', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ detail: 'Something went wrong' }),
      })

      await expect(generateImage('test', undefined, 'device-1'))
        .rejects.toThrow('Something went wrong')
    })

    it('handles object error detail with error field', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 402,
        json: () => Promise.resolve({
          detail: { error: 'No tokens remaining', code: 'payment_required' }
        }),
      })

      await expect(generateImage('test', undefined, 'device-1'))
        .rejects.toThrow('No tokens remaining')
    })

    it('handles object error detail with message field', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 400,
        json: () => Promise.resolve({
          detail: { message: 'Invalid input' }
        }),
      })

      await expect(generateImage('test', undefined, 'device-1'))
        .rejects.toThrow('Invalid input')
    })

    it('does not throw [object Object]', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 402,
        json: () => Promise.resolve({
          detail: { error: 'Test error', code: 'test' }
        }),
      })

      try {
        await generateImage('test', undefined, 'device-1')
      } catch (e: any) {
        expect(e.message).not.toContain('[object Object]')
        expect(e.message).not.toContain('object Object')
      }
    })
  })

  describe('getUsage', () => {
    it('returns usage info', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          free_remaining: 3,
          paid_remaining: 10,
          total_remaining: 13,
        }),
      })

      const result = await getUsage('device-1')
      
      expect(result.free_remaining).toBe(3)
      expect(result.paid_remaining).toBe(10)
    })

    it('throws on error', async () => {
      mockFetch.mockResolvedValue({ ok: false })

      await expect(getUsage('device-1')).rejects.toThrow('Failed to get usage')
    })
  })

  describe('getProducts', () => {
    it('returns products list', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve([
          { sku: 'starter_10', name: 'Starter', price_cents: 299, generations: 10 }
        ]),
      })

      const result = await getProducts()
      
      expect(result).toHaveLength(1)
      expect(result[0].sku).toBe('starter_10')
    })
  })

  describe('createCheckout', () => {
    it('returns checkout URL', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          checkout_url: 'https://checkout.example.com',
          session_id: 'session_123',
        }),
      })

      const result = await createCheckout('starter_10', 'device-1', 'https://success.url')
      
      expect(result.checkout_url).toBe('https://checkout.example.com')
    })

    it('handles checkout error', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({ detail: 'Invalid product' }),
      })

      await expect(createCheckout('invalid', 'device-1', 'https://success.url'))
        .rejects.toThrow('Invalid product')
    })
  })

  describe('getTokensByDevice', () => {
    it('returns tokens list', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          tokens: [
            { token: 'tok_123', remaining_generations: 10 }
          ],
        }),
      })

      const result = await getTokensByDevice('device-1')
      
      expect(result.tokens).toHaveLength(1)
    })
  })
})
