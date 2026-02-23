import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { generateImage } from '../lib/api'
import { useTokenStore } from '../stores/tokenStore'
import { getDeviceId } from '../lib/fingerprint'

const styles = [
  { id: '', name: 'default', icon: '✨' },
  { id: 'realistic', name: 'realistic', icon: '📷' },
  { id: 'anime', name: 'anime', icon: '🎌' },
  { id: 'digital_art', name: 'digitalArt', icon: '🎨' },
  { id: 'oil_painting', name: 'oilPainting', icon: '🖼️' },
  { id: 'watercolor', name: 'watercolor', icon: '🌊' },
  { id: 'sketch', name: 'sketch', icon: '✏️' },
  { id: 'cyberpunk', name: 'cyberpunk', icon: '🌃' },
  { id: 'fantasy', name: 'fantasy', icon: '🏰' },
]

export default function ImageGenerator() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { deviceId, setDeviceId, remaining, setRemaining } = useTokenStore()
  
  const [prompt, setPrompt] = useState('')
  const [style, setStyle] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  const handleGenerate = async () => {
    if (!prompt.trim()) return
    
    setIsGenerating(true)
    setError(null)
    setGeneratedImage(null)
    
    try {
      // Get device ID
      let currentDeviceId = deviceId
      if (!currentDeviceId) {
        currentDeviceId = await getDeviceId()
        setDeviceId(currentDeviceId)
      }
      
      // Generate image
      const result = await generateImage(prompt, style || undefined, currentDeviceId)
      
      if (result.success && result.image_url) {
        setGeneratedImage(result.image_url)
        if (result.remaining_generations !== undefined) {
          setRemaining(result.remaining_generations)
        }
      } else {
        setError(result.error || t('errors.generationFailed'))
      }
    } catch (err: any) {
      if (err.message?.includes('payment_required') || err.message?.includes('Free trial exhausted')) {
        navigate('/pricing')
      } else {
        setError(err.message || t('errors.unexpected'))
      }
    } finally {
      setIsGenerating(false)
    }
  }
  
  const handleDownload = () => {
    if (!generatedImage) return
    
    const link = document.createElement('a')
    link.href = generatedImage
    link.download = `ai-image-${Date.now()}.png`
    link.click()
  }
  
  return (
    <div className="max-w-4xl mx-auto" data-testid="image-generator">
      {/* Prompt Input */}
      <div className="glass rounded-2xl p-6 mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {t('generator.promptLabel')}
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={t('generator.promptPlaceholder')}
          className="w-full h-32 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan/50 focus:ring-1 focus:ring-neon-cyan/30 resize-none"
          data-testid="prompt-input"
        />
        
        {/* Style Selection */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {t('generator.styleLabel')}
          </label>
          <div className="flex flex-wrap gap-2">
            {styles.map((s) => (
              <button
                key={s.id}
                onClick={() => setStyle(s.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  style === s.id
                    ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/50'
                    : 'bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10'
                }`}
              >
                <span className="mr-2">{s.icon}</span>
                {t(`styles.${s.name}`)}
              </button>
            ))}
          </div>
        </div>
        
        {/* Generate Button */}
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-400">
            {remaining !== null && (
              <span>
                {t('generator.remaining', { count: remaining })}
              </span>
            )}
          </div>
          
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            data-testid="generate-btn"
          >
            <span className="flex items-center gap-2">
              {isGenerating ? (
                <>
                  <div className="loading-dots flex gap-1">
                    <span className="w-2 h-2 bg-white rounded-full"></span>
                    <span className="w-2 h-2 bg-white rounded-full"></span>
                    <span className="w-2 h-2 bg-white rounded-full"></span>
                  </div>
                  {t('generator.generating')}
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  {t('generator.generate')}
                </>
              )}
            </span>
          </button>
        </div>
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400" data-testid="error-message">
          {error}
        </div>
      )}
      
      {/* Generated Image */}
      {generatedImage && (
        <div className="glass rounded-2xl p-6" data-testid="result">
          <div className="relative rounded-xl overflow-hidden">
            <img 
              src={generatedImage} 
              alt="Generated" 
              className="w-full image-appear"
            />
          </div>
          
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              {t('generator.download')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
