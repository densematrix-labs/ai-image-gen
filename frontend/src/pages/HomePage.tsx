import { useTranslation } from 'react-i18next'
import ImageGenerator from '../components/ImageGenerator'

export default function HomePage() {
  const { t } = useTranslation()
  
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
          {t('hero.title')}
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-2">
          {t('hero.subtitle')}
        </p>
        {/* SEO: Playground AI alternative mention */}
        <p className="text-sm text-gray-500">
          {t('hero.alternative')}
        </p>
      </div>
      
      {/* Generator */}
      <ImageGenerator />
      
      {/* Features Section */}
      <div className="max-w-4xl mx-auto mt-16">
        <h2 className="font-display text-2xl font-bold text-white text-center mb-8">
          {t('features.title')}
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="glass rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-neon-cyan/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🚀</span>
            </div>
            <h3 className="font-display font-semibold text-white mb-2">{t('features.fast.title')}</h3>
            <p className="text-sm text-gray-400">{t('features.fast.desc')}</p>
          </div>
          
          <div className="glass rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-neon-pink/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎨</span>
            </div>
            <h3 className="font-display font-semibold text-white mb-2">{t('features.styles.title')}</h3>
            <p className="text-sm text-gray-400">{t('features.styles.desc')}</p>
          </div>
          
          <div className="glass rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-neon-purple/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">💎</span>
            </div>
            <h3 className="font-display font-semibold text-white mb-2">{t('features.quality.title')}</h3>
            <p className="text-sm text-gray-400">{t('features.quality.desc')}</p>
          </div>
        </div>
      </div>
      
      {/* Comparison Section for SEO */}
      <div className="max-w-4xl mx-auto mt-16">
        <h2 className="font-display text-2xl font-bold text-white text-center mb-8">
          {t('comparison.title')}
        </h2>
        <div className="glass rounded-xl p-6">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10">
                <th className="pb-4 text-gray-400">{t('comparison.feature')}</th>
                <th className="pb-4 text-neon-cyan">AI Image Gen</th>
                <th className="pb-4 text-gray-400">Playground AI</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-b border-white/10">
                <td className="py-3 text-gray-300">{t('comparison.freeTrial')}</td>
                <td className="py-3 text-green-400">✓ 3 {t('comparison.freeImages')}</td>
                <td className="py-3 text-gray-400">{t('comparison.limited')}</td>
              </tr>
              <tr className="border-b border-white/10">
                <td className="py-3 text-gray-300">{t('comparison.noSignup')}</td>
                <td className="py-3 text-green-400">✓</td>
                <td className="py-3 text-red-400">✗</td>
              </tr>
              <tr className="border-b border-white/10">
                <td className="py-3 text-gray-300">{t('comparison.multiModel')}</td>
                <td className="py-3 text-green-400">✓ DALL-E 3</td>
                <td className="py-3 text-gray-400">{t('comparison.proprietary')}</td>
              </tr>
              <tr>
                <td className="py-3 text-gray-300">{t('comparison.watermark')}</td>
                <td className="py-3 text-green-400">✓ {t('comparison.noWatermark')}</td>
                <td className="py-3 text-gray-400">{t('comparison.paidOnly')}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
