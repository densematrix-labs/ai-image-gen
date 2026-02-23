/**
 * API client for AI Image Gen backend.
 */

const API_BASE = '/api/v1'

export interface Product {
  sku: string
  name: string
  price_cents: number
  generations: number
  discount_percent?: number
}

export interface GenerateResult {
  success: boolean
  image_url?: string
  remaining_generations?: number
  is_free_trial: boolean
  error?: string
}

export interface UsageInfo {
  free_remaining: number
  paid_remaining: number
  total_remaining: number
}

export interface CheckoutResult {
  checkout_url: string
  session_id: string
}

export interface TokenListResult {
  tokens: Array<{
    token: string
    remaining_generations: number
    total_generations: number
    expires_at: string
    product_sku: string
  }>
}

/**
 * Generate an image from text prompt.
 */
export async function generateImage(
  prompt: string,
  style: string | undefined,
  deviceId: string,
  token?: string
): Promise<GenerateResult> {
  const response = await fetch(`${API_BASE}/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt,
      style: style || null,
      device_id: deviceId,
      token: token || null,
    }),
  })
  
  if (!response.ok) {
    const data = await response.json()
    // Handle error detail correctly - it may be string or object
    const errorMessage = typeof data.detail === 'string'
      ? data.detail
      : data.detail?.error || data.detail?.message || 'Request failed'
    throw new Error(errorMessage)
  }
  
  return response.json()
}

/**
 * Get usage info for a device.
 */
export async function getUsage(deviceId: string): Promise<UsageInfo> {
  const response = await fetch(`${API_BASE}/usage/${deviceId}`)
  
  if (!response.ok) {
    throw new Error('Failed to get usage')
  }
  
  return response.json()
}

/**
 * Get available products.
 */
export async function getProducts(): Promise<Product[]> {
  const response = await fetch(`${API_BASE}/payment/products`)
  
  if (!response.ok) {
    throw new Error('Failed to get products')
  }
  
  return response.json()
}

/**
 * Create checkout session.
 */
export async function createCheckout(
  productSku: string,
  deviceId: string,
  successUrl: string,
  email?: string
): Promise<CheckoutResult> {
  const response = await fetch(`${API_BASE}/payment/create-checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      product_sku: productSku,
      device_id: deviceId,
      success_url: successUrl,
      optional_email: email || null,
    }),
  })
  
  if (!response.ok) {
    const data = await response.json()
    const errorMessage = typeof data.detail === 'string'
      ? data.detail
      : data.detail?.error || data.detail?.message || 'Failed to create checkout'
    throw new Error(errorMessage)
  }
  
  return response.json()
}

/**
 * Get tokens for a device.
 */
export async function getTokensByDevice(deviceId: string): Promise<TokenListResult> {
  const response = await fetch(`${API_BASE}/tokens/by-device/${deviceId}`)
  
  if (!response.ok) {
    throw new Error('Failed to get tokens')
  }
  
  return response.json()
}
