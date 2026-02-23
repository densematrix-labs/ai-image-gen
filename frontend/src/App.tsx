import { Routes, Route } from 'react-router-dom'
import { Suspense } from 'react'
import HomePage from './pages/HomePage'
import PricingPage from './pages/PricingPage'
import PaymentSuccessPage from './pages/PaymentSuccessPage'
import Header from './components/Header'
import Footer from './components/Footer'

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Background orbs */}
      <div className="bg-orbs">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>
      
      <Header />
      
      <main className="flex-1">
        <Suspense fallback={<div className="flex items-center justify-center h-64">Loading...</div>}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/payment/success" element={<PaymentSuccessPage />} />
          </Routes>
        </Suspense>
      </main>
      
      <Footer />
    </div>
  )
}

export default App
