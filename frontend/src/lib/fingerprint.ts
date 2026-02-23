/**
 * Device fingerprinting for user tracking.
 */
import FingerprintJS from '@fingerprintjs/fingerprintjs'

let cachedDeviceId: string | null = null

/**
 * Get or create a unique device ID.
 * Uses FingerprintJS for browser fingerprinting.
 */
export async function getDeviceId(): Promise<string> {
  // Return cached ID if available
  if (cachedDeviceId) {
    return cachedDeviceId
  }
  
  // Check localStorage first
  const storedId = localStorage.getItem('device_id')
  if (storedId) {
    cachedDeviceId = storedId
    return storedId
  }
  
  // Generate new fingerprint
  try {
    const fp = await FingerprintJS.load()
    const result = await fp.get()
    cachedDeviceId = result.visitorId
    localStorage.setItem('device_id', cachedDeviceId)
    return cachedDeviceId
  } catch (error) {
    // Fallback to random ID if fingerprinting fails
    const fallbackId = `fallback_${Math.random().toString(36).substring(2, 15)}`
    cachedDeviceId = fallbackId
    localStorage.setItem('device_id', fallbackId)
    return fallbackId
  }
}
