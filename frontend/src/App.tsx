import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import HomePage from '@/pages/HomePage'
import ShopPage from '@/pages/ShopPage'
import ProductDetailPage from '@/pages/ProductDetailPage'
import CartPage from '@/pages/CartPage'
import CheckoutPage from '@/pages/CheckoutPage'
import BespokePage from '@/pages/BespokePage'
import AppointmentsPage from '@/pages/AppointmentsPage'
import WeddingPage from '@/pages/WeddingPage'
import OrderTrackingPage from '@/pages/OrderTrackingPage'
import NotFoundPage from '@/pages/NotFoundPage'

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-white">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/products/:slug" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/bespoke" element={<BespokePage />} />
            <Route path="/appointments" element={<AppointmentsPage />} />
            <Route path="/wedding" element={<WeddingPage />} />
            <Route path="/orders/:reference" element={<OrderTrackingPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
