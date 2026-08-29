import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '@/components/products/ProductCard'
import { Product, Category } from '@/types'
import { api } from '@/services/api'
import { SkeletonGrid } from '@/components/ui/Loading'
import Input from '@/components/ui/Input'

export default function ShopPage() {
  const [searchParams] = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [priceRange, setPriceRange] = useState([0, 1000000])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [productsData, categoriesData] = await Promise.all([
          api.getProducts(),
          api.getCategories(),
        ])
        setProducts(productsData.results || productsData)
        setCategories(categoriesData)
      } catch (error) {
        console.error('Error fetching shop data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [searchParams])

  return (
    <div className="min-h-screen">
      <div className="container-safe py-8">
        <h1 className="text-4xl font-bold mb-8">Shop All Products</h1>

        {loading ? (
          <SkeletonGrid count={12} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
