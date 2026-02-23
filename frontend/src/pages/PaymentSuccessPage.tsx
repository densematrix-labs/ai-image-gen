import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getTokensByDevice } from '../lib/api'
import { useTokenStore } from '../stores/tokenStore'

export default function PaymentSuccessPage() {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const { setDeviceId, setRemaining } = useTokenStore()
  
  const [loading, setLoading] = useState(true)
  const [tokens, setTokens] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    const deviceId = searchParams.get('device_id')
    if (deviceId) {
      setDeviceId(deviceId)
      loadTokens(deviceId)
    } else {
      setError('Missing device ID')
      setLoading(false)
    }
  }, [searchParams])
  
  const loadTokens = async (deviceId: string) => {
    try {
      // Wait a moment for webhook to process
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const data = await getTokensByDevice(deviceId)
      setTokens(data.tokens)
      
      // Calculate total remaining
      const total = data.tokens.reduce((sum: number, t: any) => sum + t.remaining_generations, 0)
      setRemaining(total)
    } catch (err) {
      setError('Failed to load tokens')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg mx-auto text-center">
        {loading ? (
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-4 border-neon-cyan border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-400">{t('success.processing')}</p>
          </div>
        ) : error ? (
          <div className="glass rounded-2xl p-8">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="font-display text-2xl font-bold text-white mb-4">{t('success.error')}</h1>
            <p className="text-gray-400 mb-6">{error}</p>
            <Link to="/" className="btn-primary inline-block">
              <span>{t('success.goHome')}</span>
            </Link>
          </div>
        ) : (
          <div className="glass rounded-2xl p-8">
            {/* Success Icon */}
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <svg className="w-10 h-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h1 className="font-display text-3xl font-bold text-white mb-4">
              {t('success.title')}
            </h1>
            <p className="text-gray-400 mb-8">
              {t('success.subtitle')}
            </p>
            
            {/* Token Info */}
            {tokens.length > 0 && (
              <div className="bg-white/5 rounded-xl p-6 mb-8 text-left">
                <h3 className="font-semibold text-white mb-4">{t('success.yourCredits')}</h3>
                {tokens.map((token, i) => (
                  <div key={i} className="flex justify-between items-center py-2 border-b border-white/10 last:border-0">
                    <span className="text-gray-300">{token.product_sku.replace(/_/g, ' ')}</span>
                    <span className="text-neon-cyan font-semibold">{token.remaining_generations} {t('success.credits')}</span>
                  </div>
                ))}
              </div>
            )}
            
            <Link to="/" className="btn-primary inline-block">
              <span>{t('success.startCreating')}</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
