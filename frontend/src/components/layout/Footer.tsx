import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, Instagram, Facebook, MessageCircle } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-veez-black text-white">
      <div className="container-safe py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold mb-4">VEEZ APPARELS</h3>
            <p className="text-veez-gray-300 text-sm">
              Rooted in Culture. Styled for Today.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-veez-gray-300">
              <li>
                <Link to="/shop" className="hover:text-white transition">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-white transition">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link to="/wedding" className="hover:text-white transition">
                  Wedding & Occasion
                </Link>
              </li>
              <li>
                <Link to="/bespoke" className="hover:text-white transition">
                  Bespoke
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer */}
          <div>
            <h4 className="font-semibold mb-4">Customer</h4>
            <ul className="space-y-2 text-veez-gray-300">
              <li>
                <Link to="#" className="hover:text-white transition">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-white transition">
                  Order Tracking
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-white transition">
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-white transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-veez-gray-300">
                <Mail className="w-4 h-4" />
                <span className="text-sm">info@veezapparels.com</span>
              </div>
              <div className="flex items-center gap-2 text-veez-gray-300">
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm">Chat on WhatsApp</span>
              </div>
              <div className="flex gap-4 mt-4">
                <Link to="#" className="hover:text-veez-gold transition">
                  <Instagram className="w-5 h-5" />
                </Link>
                <Link to="#" className="hover:text-veez-gold transition">
                  <Facebook className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-veez-gray-800 pt-8">
          <div className="text-center text-veez-gray-300 text-sm">
            <p>&copy; {currentYear} Veez Apparels. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
