import { Link } from 'react-router-dom'
import { ShoppingCart, Heart } from 'lucide-react'
import { Product } from '@/types'
import { formatCurrency } from '@/utils'
import Button from '@/components/ui/Button'

interface ProductCardProps {
  product: Product
  onAddToCart?: () => void
  showHover?: boolean
}

export default function ProductCard({
  product,
  onAddToCart,
  showHover = true,
}: ProductCardProps) {
  const primaryImage = product.images?.[0]
  const secondaryImage = product.images?.[1]

  return (
    <div className="group relative">
      {/* Image Container */}
      <div className="relative bg-veez-gray-100 aspect-square overflow-hidden rounded">
        <Link to={`/products/${product.slug}`}>
          {primaryImage && (
            <img
              src={primaryImage.image}
              alt={primaryImage.alt_text || product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          )}
          {!primaryImage && (
            <div className="w-full h-full flex items-center justify-center bg-veez-gray-200">
              <span className="text-veez-gray-400">No Image</span>
            </div>
          )}

          {/* Sale Badge */}
          {product.is_on_sale && (
            <div className="absolute top-4 left-4 bg-veez-black text-white px-3 py-1 text-sm font-semibold rounded">
              Sale
            </div>
          )}

          {/* New Badge */}
          {product.new_arrival && (
            <div className="absolute top-4 right-4 bg-veez-gold text-veez-black px-3 py-1 text-sm font-semibold rounded">
              New
            </div>
          )}
        </Link>

        {/* Hover Overlay */}
        {showHover && (
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-end justify-center pb-4">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
              <Button
                variant="secondary"
                size="md"
                onClick={onAddToCart}
                className="!bg-white !border-white"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="mt-4 space-y-2">
        <Link
          to={`/products/${product.slug}`}
          className="text-sm text-veez-gray-600 hover:text-veez-black transition"
        >
          {product.category.name}
        </Link>

        <Link
          to={`/products/${product.slug}`}
          className="block text-base font-semibold text-veez-black hover:underline"
        >
          {product.name}
        </Link>

        {/* Availability */}
        <p className="text-xs text-veez-gray-500">
          {product.available ? (
            <span className="text-green-600 font-medium">In Stock</span>
          ) : (
            <span className="text-red-600 font-medium">Out of Stock</span>
          )}
        </p>

        {/* Pricing */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-veez-black">
            {formatCurrency(product.current_price, product.currency)}
          </span>
          {product.is_on_sale && (
            <span className="text-sm text-veez-gray-500 line-through">
              {formatCurrency(product.base_price, product.currency)}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
