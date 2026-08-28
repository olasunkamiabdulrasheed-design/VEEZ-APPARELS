import { Link } from 'react-router-dom'
import { Trash2, Plus, Minus } from 'lucide-react'
import { useCart } from '@/store'
import { formatCurrency } from '@/utils'
import Button from '@/components/ui/Button'

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart } = useCart()
  const subtotal = items.reduce((sum, item) => {
    const price = item.product?.current_price ? parseFloat(item.product.current_price) : 0
    return sum + price * item.quantity
  }, 0)
  const deliveryFee = 5000
  const total = subtotal + deliveryFee

  if (items.length === 0) {
    return (
      <div className="container-safe py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Your Cart is Empty</h2>
        <p className="text-veez-gray-600 mb-8">Continue shopping to add items to your cart</p>
        <Link to="/shop">
          <Button>Explore Collection</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container-safe py-8">
      <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={`${item.product_id}-${item.variant_id}`} className="bg-white border rounded-lg p-4 flex gap-4">
              {item.product?.images[0] && (
                <img src={item.product.images[0].image} alt={item.product.name} className="w-24 h-24 object-cover rounded" />
              )}
              <div className="flex-1">
                <h3 className="font-semibold">{item.product?.name}</h3>
                {item.variant && (
                  <p className="text-sm text-veez-gray-600">
                    {item.variant.size} / {item.variant.colour}
                  </p>
                )}
                <p className="font-semibold mt-2">{formatCurrency(item.product?.current_price || 0)}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => updateQuantity(item.product_id, item.quantity - 1, item.variant_id)}>
                  <Minus className="w-4 h-4" />
                </button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.product_id, item.quantity + 1, item.variant_id)}>
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <button onClick={() => removeItem(item.product_id, item.variant_id)} className="text-red-600">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-veez-gray-50 rounded-lg p-6 h-fit">
          <h3 className="text-2xl font-bold mb-6">Order Summary</h3>
          <div className="space-y-3 mb-6 pb-6 border-b">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery</span>
              <span>{formatCurrency(deliveryFee)}</span>
            </div>
          </div>
          <div className="flex justify-between text-xl font-bold mb-8">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
          <Link to="/checkout" className="block mb-4">
            <Button fullWidth>Proceed to Checkout</Button>
          </Link>
          <button onClick={() => clearCart()} className="text-veez-gray-600 text-sm hover:underline">
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  )
}
