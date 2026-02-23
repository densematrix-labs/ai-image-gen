import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { getProducts, createCheckout, Product } from '../lib/api'
import { getDeviceId } from '../lib/fingerprint'
import { useTokenStore } from '../stores/tokenStore'

export default function PricingPage() {
  const { t } = useTranslation()
  const { deviceId, setDeviceId } = useTokenStore()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [purchasing, setPurchasing] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    loadProducts()
    initDeviceId()
  }, [])
  
  const initDeviceId = async () => {
    if (!deviceId) {
      const id = await getDeviceId()
      setDeviceId(id)
    }
  }
  
  const loadProducts = async () => {
    try {
      const data = await getProducts()
      setProducts(data)
    } catch (err) {
      setError('Failed to load products')
    } finally {
      setLoading(false)
    }
  }
  
  const handlePurchase = async (sku: string) => {
    setPurchasing(sku)
    setError(null)
    
    try {
      let currentDeviceId = deviceId
      if (!currentDeviceId) {
        currentDeviceId = await getDeviceId()
        setDeviceId(currentDeviceId)
      }
      
      const successUrl = `${window.location.origin}/payment/success?device_id=${currentDeviceId}`
      const result = await createCheckout(sku, currentDeviceId, successUrl)
      
      // Redirect to Creem checkout
      window.location.href = result.checkout_url
    } catch (err: any) {
      setError(err.message || 'Failed to create checkout')
      setPurchasing(null)
    }
  }
  
  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`
  }
  
  if (loading) {
    return (
      <div className="py-16 flex justify-center">
        <div className="loading-dots flex gap-2">
          <span className="w-3 h-3 bg-neon-cyan rounded-full"></span>
          <span className="w-3 h-3 bg-neon-cyan rounded-full"></span>
          <span className="w-3 h-3 bg-neon-cyan rounded-full"></span>
        </div>
      </div>
    )
  }
  
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4">
            {t('pricing.title')}
          </h1>
          <p className="text-xl text-gray-400">
            {t('pricing.subtitle')}
          </p>
        </div>
        
        {/* Error */}
        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-center">
            {error}
          </div>
        )}
        
        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {products.map((product, index) => {
            const isPopular = index === 1 // Middle one is popular
            
            return (
              <div
                key={product.sku}
                className={`glass rounded-2xl p-6 relative ${
                  isPopular ? 'border-2 border-neon-cyan' : ''
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-neon-cyan text-deep-900 text-xs font-bold rounded-full">
                    {t('pricing.popular')}
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h3 className="font-display text-xl font-bold text-white mb-2">
                    {product.name}
                  </h3>
                  <div className="text-3xl font-bold text-white">
                    {formatPrice(product.price_cents)}
                  </div>
                  {product.discount_percent && (
                    <div className="text-sm text-neon-cyan mt-1">
                      {t('pricing.save', { percent: product.discount_percent })}
                    </div>
                  )}
                </div>
                
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center text-gray-300">
                    <svg className="w-5 h-5 text-green-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {product.generations} {t('pricing.generations')}
                  </li>
                  <li className="flex items-center text-gray-300">
                    <svg className="w-5 h-5 text-green-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {t('pricing.hdQuality')}
                  </li>
                  <li className="flex items-center text-gray-300">
                    <svg className="w-5 h-5 text-green-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {t('pricing.noWatermark')}
                  </li>
                  <li className="flex items-center text-gray-300">
                    <svg className="w-5 h-5 text-green-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {t('pricing.allStyles')}
                  </li>
                </ul>
                
                <button
                  onClick={() => handlePurchase(product.sku)}
                  disabled={purchasing !== null}
                  className={`w-full py-3 rounded-xl font-semibold transition-all ${
                    isPopular
                      ? 'bg-neon-cyan text-deep-900 hover:bg-neon-cyan/90'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {purchasing === product.sku ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                      {t('pricing.processing')}
                    </span>
                  ) : (
                    t('pricing.buyNow')
                  )}
                </button>
              </div>
            )
          })}
        </div>
        
        {/* FAQ */}
        <div className="mt-16">
          <h2 className="font-display text-2xl font-bold text-white text-center mb-8">
            {t('pricing.faq.title')}
          </h2>
          <div className="space-y-4">
            <div className="glass rounded-xl p-6">
              <h3 className="font-semibold text-white mb-2">{t('pricing.faq.q1')}</h3>
              <p className="text-gray-400 text-sm">{t('pricing.faq.a1')}</p>
            </div>
            <div className="glass rounded-xl p-6">
              <h3 className="font-semibold text-white mb-2">{t('pricing.faq.q2')}</h3>
              <p className="text-gray-400 text-sm">{t('pricing.faq.a2')}</p>
            </div>
            <div className="glass rounded-xl p-6">
              <h3 className="font-semibold text-white mb-2">{t('pricing.faq.q3')}</h3>
              <p className="text-gray-400 text-sm">{t('pricing.faq.a3')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
