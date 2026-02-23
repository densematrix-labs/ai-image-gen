import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import LanguageSwitcher from '../components/LanguageSwitcher'

describe('Header', () => {
  it('renders logo and navigation', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    )
    
    expect(screen.getByText('AI Image Gen')).toBeInTheDocument()
    expect(screen.getByText('nav.pricing')).toBeInTheDocument()
  })

  it('contains language switcher', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    )
    
    expect(screen.getByTestId('lang-switcher')).toBeInTheDocument()
  })
})

describe('Footer', () => {
  it('renders copyright', () => {
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    )
    
    expect(screen.getByText('footer.rights')).toBeInTheDocument()
  })

  it('renders about link', () => {
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    )
    
    expect(screen.getByText('footer.about')).toBeInTheDocument()
  })

  it('renders alternative mention for SEO', () => {
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    )
    
    expect(screen.getByText('footer.alternative')).toBeInTheDocument()
  })
})

describe('LanguageSwitcher', () => {
  it('renders current language', () => {
    render(<LanguageSwitcher />)
    
    expect(screen.getByTestId('lang-switcher')).toBeInTheDocument()
    expect(screen.getByText('English')).toBeInTheDocument()
  })

  it('opens dropdown on click', () => {
    render(<LanguageSwitcher />)
    
    fireEvent.click(screen.getByTestId('lang-switcher'))
    
    expect(screen.getByText('中文')).toBeInTheDocument()
    expect(screen.getByText('日本語')).toBeInTheDocument()
    expect(screen.getByText('Deutsch')).toBeInTheDocument()
  })

  it('has all 7 languages', () => {
    render(<LanguageSwitcher />)
    
    fireEvent.click(screen.getByTestId('lang-switcher'))
    
    const languages = ['English', '中文', '日本語', 'Deutsch', 'Français', '한국어', 'Español']
    languages.forEach(lang => {
      expect(screen.getByText(lang)).toBeInTheDocument()
    })
  })
})
