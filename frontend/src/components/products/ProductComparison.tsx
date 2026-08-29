import { X } from 'lucide-react'
import { Product } from '@/types'
import { formatCurrency } from '@/utils'
import Button from '@/components/ui/Button'

interface ProductComparisonProps {
  products: Product[]
  onRemove: (productId: number) => void
  onAddToCart: (product: Product) => void
}

export default function ProductComparison({
  products,
  onRemove,
  onAddToCart,
}: ProductComparisonProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-veez-gray-600">No products to compare</p>
      </div>
    )
  }

  const specs = [
    { label: 'Price', key: 'current_price' },
    { label: 'Category', key: 'category' },
    { label: 'Availability', key: 'available' },
    { label: 'SKU', key: 'sku' },
  ]

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-veez-gray-50">
            <th className="px-4 py-4 text-left font-semibold border">Specification</th>
            {products.map((product) => (
              <th key={product.id} className="px-4 py-4 text-left border">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">{product.name}</p>
                    {product.images[0] && (
                      <img
                        src={product.images[0].image}
                        alt={product.name}
                        className="w-20 h-20 object-cover mt-2 rounded"
                      />
                    )}
                  </div>
                  <button
                    onClick={() => onRemove(product.id)}
                    className="text-veez-gray-400 hover:text-red-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {specs.map((spec, i) => (
            <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-veez-gray-50'}>
              <td className="px-4 py-4 font-semibold border">{spec.label}</td>
              {products.map((product) => (
                <td key={product.id} className="px-4 py-4 border">
                  {spec.key === 'current_price' && formatCurrency(product.current_price)}
                  {spec.key === 'category' && product.category.name}
                  {spec.key === 'available' && (
                    <span className={product.available ? 'text-green-600' : 'text-red-600'}>
                      {product.available ? 'In Stock' : 'Out of Stock'}
                    </span>
                  )}
                  {spec.key === 'sku' && product.sku}
                </td>
              ))}
            </tr>
          ))}
          <tr>
            <td colSpan={products.length + 1} className="px-4 py-4 border">
              <div className="flex gap-2">
                {products.map((product) => (
                  <Button
                    key={product.id}
                    size="sm"
                    onClick={() => onAddToCart(product)}
                    disabled={!product.available}
                  >
                    Add to Cart
                  </Button>
                ))}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
