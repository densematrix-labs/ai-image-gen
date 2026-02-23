import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function Footer() {
  const { t } = useTranslation()
  
  return (
    <footer className="border-t border-white/10 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-gray-400 text-sm">
            © {new Date().getFullYear()} AI Image Gen. {t('footer.rights')}
          </div>
          
          <div className="flex items-center gap-6">
            <Link to="/pricing" className="text-gray-400 hover:text-white text-sm transition-colors">
              {t('nav.pricing')}
            </Link>
            <a 
              href="https://densematrix.ai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              {t('footer.about')}
            </a>
          </div>
        </div>
        
        {/* SEO: Alternative mention */}
        <div className="mt-6 text-center text-gray-500 text-xs">
          {t('footer.alternative')}
        </div>
      </div>
    </footer>
  )
}
