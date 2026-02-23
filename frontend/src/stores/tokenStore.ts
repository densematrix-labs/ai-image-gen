import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface TokenState {
  deviceId: string | null
  remaining: number | null
  setDeviceId: (id: string) => void
  setRemaining: (count: number) => void
}

export const useTokenStore = create<TokenState>()(
  persist(
    (set) => ({
      deviceId: null,
      remaining: null,
      setDeviceId: (id) => set({ deviceId: id }),
      setRemaining: (count) => set({ remaining: count }),
    }),
    {
      name: 'token-storage',
    }
  )
)
