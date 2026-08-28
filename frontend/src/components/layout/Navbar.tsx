import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X, Search, User, ShoppingCart } from 'lucide-react'
import { useCart } from '@/store'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { getItemCount } = useCart()
  const itemCount = getItemCount()

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
    { label: 'Collections', href: '/shop' },
    { label: 'Bespoke', href: '/bespoke' },
    { label: 'Wedding', href: '/wedding' },
  ]

  return (
    <nav className="bg-white border-b border-veez-gray-200 sticky top-0 z-40">
      <div className="container-safe">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-veez-black">VEEZ</h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-sm font-medium text-veez-gray-700 hover:text-veez-black transition"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right icons */}
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-veez-gray-100 rounded transition">
              <Search className="w-5 h-5 text-veez-black" />
            </button>
            <button className="p-2 hover:bg-veez-gray-100 rounded transition">
              <User className="w-5 h-5 text-veez-black" />
            </button>
            <Link
              to="/cart"
              className="relative p-2 hover:bg-veez-gray-100 rounded transition"
            >
              <ShoppingCart className="w-5 h-5 text-veez-black" />
              {itemCount > 0 && (
                <span className="absolute top-0 right-0 bg-veez-black text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="block px-4 py-2 text-sm font-medium text-veez-gray-700 hover:bg-veez-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}
