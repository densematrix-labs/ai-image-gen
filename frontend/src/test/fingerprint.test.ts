import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getDeviceId } from '../lib/fingerprint'

beforeEach(() => {
  // Reset localStorage mock
  vi.mocked(localStorage.getItem).mockReset()
  vi.mocked(localStorage.setItem).mockReset()
})

describe('getDeviceId', () => {
  it('returns stored ID from localStorage if available', async () => {
    vi.mocked(localStorage.getItem).mockReturnValue('stored-device-id')
    
    const id = await getDeviceId()
    
    expect(id).toBe('stored-device-id')
  })

  it('generates new ID via FingerprintJS if not stored', async () => {
    vi.mocked(localStorage.getItem).mockReturnValue(null)
    
    const id = await getDeviceId()
    
    // Should use mocked fingerprint visitor ID
    expect(id).toBe('test-visitor-id')
    expect(localStorage.setItem).toHaveBeenCalledWith('device_id', 'test-visitor-id')
  })

  it('caches the device ID for subsequent calls', async () => {
    vi.mocked(localStorage.getItem).mockReturnValue(null)
    
    const id1 = await getDeviceId()
    const id2 = await getDeviceId()
    
    expect(id1).toBe(id2)
  })
})
