import { useEffect, useState } from 'react'
import ProductCard from '@/components/products/ProductCard'
import { Product } from '@/types'
import { SkeletonGrid } from '@/components/ui/Loading'

interface RelatedProductsProps {
  currentProductId: number
  categoryId: number
  limit?: number
}

export default function RelatedProducts({
  currentProductId,
  categoryId,
  limit = 4,
}: RelatedProductsProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        setLoading(true)
        // Mock data - replace with actual API call
        const mockProducts: Product[] = [
          {
            id: 2,
            name: 'Classic Agbada V2',
            slug: 'agbada-v2',
            description: 'Premium traditional wear',
            sku: 'SKU002',
            base_price: 45000,
            current_price: 40000,
            currency: 'NGN',
            category: { id: categoryId, name: 'Agbada' },
            images: [],
            variants: [],
            available: true,
            is_on_sale: true,
            featured: false,
            new_arrival: false,
            audience: 'everyone',
          },
        ]
        setProducts(mockProducts.slice(0, limit))
      } catch (error) {
        console.error('Error fetching related products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRelated()
  }, [categoryId, limit])

  if (loading) {
    return <SkeletonGrid count={limit} />
  }

  if (products.length === 0) {
    return null
  }

  return (
    <div className="mt-16">
      <h3 className="text-2xl font-bold mb-8">You Might Also Like</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
