import { describe, it, expect, beforeEach } from 'vitest'
import { useTokenStore } from '../stores/tokenStore'

describe('tokenStore', () => {
  beforeEach(() => {
    // Reset store state
    useTokenStore.setState({
      deviceId: null,
      remaining: null,
    })
  })

  it('initializes with null values', () => {
    const state = useTokenStore.getState()
    
    expect(state.deviceId).toBeNull()
    expect(state.remaining).toBeNull()
  })

  it('sets device ID', () => {
    const { setDeviceId } = useTokenStore.getState()
    
    setDeviceId('test-device-123')
    
    expect(useTokenStore.getState().deviceId).toBe('test-device-123')
  })

  it('sets remaining count', () => {
    const { setRemaining } = useTokenStore.getState()
    
    setRemaining(42)
    
    expect(useTokenStore.getState().remaining).toBe(42)
  })

  it('updates multiple values independently', () => {
    const { setDeviceId, setRemaining } = useTokenStore.getState()
    
    setDeviceId('device-1')
    setRemaining(10)
    
    expect(useTokenStore.getState().deviceId).toBe('device-1')
    expect(useTokenStore.getState().remaining).toBe(10)
    
    setRemaining(5)
    
    expect(useTokenStore.getState().deviceId).toBe('device-1')
    expect(useTokenStore.getState().remaining).toBe(5)
  })
})
