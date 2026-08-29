import { Heart, Sparkles, Star, Users, Gift } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ProductCard from '@/components/products/ProductCard'
import { Product } from '@/types'
import { api } from '@/services/api'
import { SkeletonGrid } from '@/components/ui/Loading'
import Button from '@/components/ui/Button'

export default function WeddingPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await api.getProducts({ 
          category: 'wedding',
          limit: 12 
        })
        setProducts(Array.isArray(data) ? data : data.results || [])
      } catch (error) {
        console.error('Error fetching wedding products:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-b from-veez-black to-veez-gray-900 text-white py-20">
        <div className="container-safe text-center">
          <Heart className="w-16 h-16 mx-auto mb-6 text-veez-gold" />
          <h1 className="text-6xl font-bold mb-4">Your Perfect Wedding Attire</h1>
          <p className="text-xl text-veez-gray-300 max-w-2xl mx-auto">
            Look absolutely stunning on your special day
          </p>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16">
        <div className="container-safe">
          <h2 className="text-4xl font-bold text-center mb-12">Why Choose Veez for Your Wedding</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <Sparkles className="w-12 h-12 mx-auto mb-4 text-veez-gold" />
              <h3 className="font-semibold mb-2">Premium Quality</h3>
              <p className="text-veez-gray-600 text-sm">Finest fabrics and impeccable craftsmanship</p>
            </div>
            <div className="text-center">
              <Star className="w-12 h-12 mx-auto mb-4 text-veez-gold" />
              <h3 className="font-semibold mb-2">Bespoke Service</h3>
              <p className="text-veez-gray-600 text-sm">Custom-tailored to your perfect measurements</p>
            </div>
            <div className="text-center">
              <Users className="w-12 h-12 mx-auto mb-4 text-veez-gold" />
              <h3 className="font-semibold mb-2">Expert Team</h3>
              <p className="text-veez-gray-600 text-sm">Professional styling and design consultation</p>
            </div>
            <div className="text-center">
              <Gift className="w-12 h-12 mx-auto mb-4 text-veez-gold" />
              <h3 className="font-semibold mb-2">Complete Look</h3>
              <p className="text-veez-gray-600 text-sm">From attire to accessories, we have it all</p>
            </div>
          </div>
        </div>
      </section>

      {/* Wedding Collection */}
      <section className="py-16 bg-veez-gray-50">
        <div className="container-safe">
          <h2 className="text-4xl font-bold text-center mb-12">Wedding Collection</h2>
          {loading ? (
            <SkeletonGrid count={6} />
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-veez-gray-600">No products found in wedding collection</p>
            </div>
          )}
        </div>
      </section>
