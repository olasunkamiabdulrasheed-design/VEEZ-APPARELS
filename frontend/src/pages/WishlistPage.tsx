import { Link } from 'react-router-dom'
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react'
import { useWishlist } from '@/store/wishlist'
import { formatCurrency } from '@/utils'
import Button from '@/components/ui/Button'

export default function WishlistPage() {
  const { items, removeItem, clearWishlist } = useWishlist()

  if (items.length === 0) {
    return (
      <div className="container-safe py-20 text-center">
        <Heart className="w-16 h-16 mx-auto mb-4 text-veez-gray-300" />
        <h2 className="text-3xl font-bold mb-4">Your Wishlist is Empty</h2>
        <p className="text-veez-gray-600 mb-8">Save items you love for later</p>
        <Link to="/shop">
          <Button>
            Explore Products
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container-safe py-12">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-4xl font-bold">Wishlist ({items.length})</h1>
        <button
          onClick={() => clearWishlist()}
          className="text-veez-gray-600 hover:text-red-500 transition text-sm"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {items.map((item) => (
          <div
            key={item.product_id}
            className="bg-white border rounded-lg overflow-hidden hover:shadow-lg transition"
          >
            {item.product_image && (
              <img
                src={item.product_image}
                alt={item.product_name}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h3 className="font-semibold mb-2">{item.product_name}</h3>
              <p className="text-veez-gold font-bold mb-4">
                {formatCurrency(item.product_price)}
              </p>
              <div className="flex gap-2">
                <Link to={`/product/${item.product_id}`} className="flex-1">
                  <Button variant="secondary" fullWidth size="sm">
                    View
                  </Button>
                </Link>
                <button
                  onClick={() => removeItem(item.product_id)}
                  className="px-4 py-2 border border-red-300 text-red-600 hover:bg-red-50 rounded transition"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Link to="/shop">
        <Button fullWidth>
          <ShoppingBag className="w-4 h-4 mr-2" />
          Continue Shopping
        </Button>
      </Link>
    </div>
  )
}
