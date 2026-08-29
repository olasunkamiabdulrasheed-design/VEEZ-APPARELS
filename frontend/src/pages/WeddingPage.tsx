import { Heart, Sparkles } from 'lucide-react'
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
