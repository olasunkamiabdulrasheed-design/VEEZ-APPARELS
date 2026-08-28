import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import ProductCard from '@/components/products/ProductCard'
import { Product, Collection } from '@/types'
import { api } from '@/services/api'
import Button from '@/components/ui/Button'
import { LoadingSpinner, SkeletonGrid } from '@/components/ui/Loading'

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [newArrivals, setNewArrivals] = useState<Product[]>([])
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [featured, arrivals, collsData] = await Promise.all([
          api.getFeaturedProducts(),
          api.getNewArrivals(),
          api.getFeaturedCollections(),
        ])
        setFeaturedProducts(featured)
        setNewArrivals(arrivals)
        setCollections(collsData)
      } catch (error) {
        console.error('Error fetching homepage data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-veez-black text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-veez-black via-veez-black to-veez-gray-900 opacity-90" />
        <div className="relative z-10 text-center container-safe">
          <h1 className="text-6xl md:text-7xl font-bold mb-6">
            VEEZ APPARELS
          </h1>
          <p className="text-xl md:text-2xl text-veez-gray-300 mb-12">
            Rooted in Culture. Styled for Today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/shop">
              <Button variant="secondary">
                Explore Collection
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/bespoke">
              <Button variant="ghost">
                Book Bespoke Appointment
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      {!loading && collections.length > 0 && (
        <section className="section-padding">
          <div className="container-safe">
            <h2 className="text-4xl font-bold mb-12">Featured Collections</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {collections.slice(0, 3).map((collection) => (
                <Link
                  key={collection.id}
                  to={`/shop?collection=${collection.slug}`}
                  className="relative group overflow-hidden rounded-lg aspect-square"
                >
                  {collection.image && (
                    <img
                      src={collection.image}
                      alt={collection.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                    <h3 className="text-white text-2xl font-bold text-center">
                      {collection.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      {loading ? (
        <section className="section-padding">
          <div className="container-safe">
            <h2 className="text-4xl font-bold mb-12">Featured Products</h2>
            <SkeletonGrid count={6} />
          </div>
        </section>
      ) : (
        <section className="section-padding">
          <div className="container-safe">
            <h2 className="text-4xl font-bold mb-12">Featured Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Brand Story */}
      <section className="section-padding bg-veez-gray-50">
        <div className="container-safe">
          <div className="max-w-3xl">
            <h2 className="text-4xl font-bold mb-6">Our Story</h2>
            <p className="text-lg text-veez-gray-700 leading-relaxed mb-4">
              Veez Apparels celebrates the rich cultural heritage of Africa through contemporary fashion. Each piece is crafted with meticulous attention to detail, blending traditional elegance with modern style.
            </p>
            <p className="text-lg text-veez-gray-700 leading-relaxed">
              From Agbada to Kaftan, from Wedding Wear to Bespoke Custom Pieces, we create fashion that tells your story and honors your culture.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Sections */}
      <section className="section-padding">
        <div className="container-safe space-y-8">
          {/* Bespoke CTA */}
          <div className="bg-veez-black text-white rounded-lg p-12 text-center">
            <h3 className="text-3xl font-bold mb-4">Made For You</h3>
            <p className="text-veez-gray-300 mb-8 max-w-2xl mx-auto">
              Experience personalized tailoring with our bespoke service. Work directly with our team to create your perfect outfit.
            </p>
            <Link to="/bespoke">
              <Button variant="secondary">Start a Bespoke Request</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
