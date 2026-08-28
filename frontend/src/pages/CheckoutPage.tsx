import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useCart, useToast, useLoading } from '@/store'
import { formatCurrency, generateOrderWhatsAppMessage, openWhatsAppChat, isValidEmail, isValidPhone } from '@/utils'
import { api } from '@/services/api'
import { Order } from '@/types'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { items, clearCart } = useCart()
  const { addToast } = useToast()
  const { isLoading, setLoading } = useLoading()

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    delivery_address: '',
    delivery_city: '',
    delivery_state: '',
    delivery_country: 'Nigeria',
    delivery_notes: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null)

  // Redirect if no items in cart
  useEffect(() => {
    if (items.length === 0 && !createdOrder) {
      navigate('/cart')
    }
  }, [items, navigate, createdOrder])

  // Calculate totals
  const subtotal = items.reduce((sum, item) => {
    const price = item.product?.current_price ? parseFloat(item.product.current_price) : 0
    return sum + price * item.quantity
  }, 0)
  const deliveryFee = 5000
  const total = subtotal + deliveryFee

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Invalid email address'
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required'
    } else if (!isValidPhone(formData.phone)) {
      newErrors.phone = 'Invalid phone number'
    }
    if (!formData.delivery_address.trim()) newErrors.delivery_address = 'Address is required'
    if (!formData.delivery_city.trim()) newErrors.delivery_city = 'City is required'
    if (!formData.delivery_state.trim()) newErrors.delivery_state = 'State is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      addToast('Please fill in all required fields correctly', 'error')
      return
    }

    try {
      setLoading(true)

      // Prepare order data - only send product IDs and quantities
      const orderData = {
        ...formData,
        delivery_fee: deliveryFee,
        items: items.map((item) => ({
          product_id: item.product_id,
          variant_id: item.variant_id,
          quantity: item.quantity,
        })),
      }

      // Create order - backend calculates prices
      const order = await api.createOrder(orderData)
      setCreatedOrder(order)
      addToast('Order created successfully!', 'success')
    } catch (error: any) {
      console.error('Error creating order:', error)
      const message = error.response?.data?.error || error.message || 'Failed to create order'
      addToast(message, 'error')
    } finally {
      setLoading(false)
    }
  }

  // Handle WhatsApp confirmation
  const handleWhatsAppConfirm = () => {
    if (!createdOrder) return

    const message = generateOrderWhatsAppMessage(createdOrder)
    openWhatsAppChat('+2348100000000', message)

    // Clear cart after successful WhatsApp redirect
    clearCart()
    addToast('Cart cleared', 'success')
  }

  // If order created, show confirmation
  if (createdOrder) {
    return (
      <div className="container-safe py-12">
        <div className="max-w-2xl mx-auto bg-white rounded-lg border p-8 text-center">
          <div className="text-6xl mb-6">✓</div>
          <h2 className="text-3xl font-bold mb-4">Order Created!</h2>
          <p className="text-veez-gray-600 mb-2">
            Order Number: <span className="font-semibold">{createdOrder.order_number}</span>
          </p>
          <p className="text-veez-gray-600 mb-8">
            Reference: <span className="font-mono text-sm">{createdOrder.reference}</span>
          </p>

          {/* Order Summary */}
          <div className="bg-veez-gray-50 rounded-lg p-6 mb-8 text-left">
            <h3 className="font-semibold mb-4">Order Summary</h3>
            <div className="space-y-3 mb-4 pb-4 border-b">
              {createdOrder.items.map((item, i) => (
                <div key={i} className="flex justify-between">
                  <div>
                    <p className="font-medium">{item.product_name_snapshot}</p>
                    {item.size_snapshot && <p className="text-sm text-veez-gray-600">{item.size_snapshot} / {item.colour_snapshot}</p>}
                    <p className="text-sm text-veez-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold">{formatCurrency(item.subtotal)}</p>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(createdOrder.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span>{formatCurrency(createdOrder.delivery_fee)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>Total</span>
                <span>{formatCurrency(createdOrder.total)}</span>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="bg-veez-gray-50 rounded-lg p-6 mb-8 text-left">
            <h3 className="font-semibold mb-4">Delivery Address</h3>
            <p className="text-veez-gray-700">
              {createdOrder.delivery_address}<br />
              {createdOrder.delivery_city}, {createdOrder.delivery_state}<br />
              {createdOrder.delivery_country}
            </p>
          </div>

          {/* WhatsApp CTA */}
          <div className="space-y-4">
            <p className="text-veez-gray-600 mb-4">
              Continue on WhatsApp to confirm your order details and payment
            </p>
            <Button
              fullWidth
              onClick={handleWhatsAppConfirm}
              className="!bg-green-600 hover:!bg-green-700"
            >
              Continue on WhatsApp
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button variant="secondary" fullWidth onClick={() => navigate('/shop')}>
              Continue Shopping
            </Button>
          </div>

          <p className="text-sm text-veez-gray-500 mt-6">
            You will be redirected to WhatsApp. Our team will confirm your order and payment details.
          </p>
        </div>
      </div>
    )
  }

  // Checkout form
  return (
    <div className="container-safe py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-bold mb-8">Checkout</h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Customer Information */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Your Information</h3>
              <div className="space-y-4">
                <Input
                  label="Full Name"
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  error={errors.name}
                  required
                />
                <Input
                  label="Email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  error={errors.email}
                  required
                />
                <Input
                  label="Phone Number"
                  placeholder="+234 8100 000 000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  error={errors.phone}
                  required
                />
              </div>
            </div>

            {/* Delivery Address */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Delivery Address</h3>
              <div className="space-y-4">
                <Input
                  label="Street Address"
                  placeholder="123 Main Street"
                  value={formData.delivery_address}
                  onChange={(e) => setFormData({ ...formData, delivery_address: e.target.value })}
                  error={errors.delivery_address}
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="City"
                    placeholder="Lagos"
                    value={formData.delivery_city}
                    onChange={(e) => setFormData({ ...formData, delivery_city: e.target.value })}
                    error={errors.delivery_city}
                    required
                  />
                  <Input
                    label="State"
                    placeholder="Lagos"
                    value={formData.delivery_state}
                    onChange={(e) => setFormData({ ...formData, delivery_state: e.target.value })}
                    error={errors.delivery_state}
                    required
                  />
                </div>
                <Input
                  label="Additional Notes"
                  placeholder="Gate code, apartment number, etc."
                  multiline
                  rows={3}
                  value={formData.delivery_notes}
                  onChange={(e) => setFormData({ ...formData, delivery_notes: e.target.value })}
                />
              </div>
            </div>

            {/* Submit */}
            <Button
              fullWidth
              type="submit"
              loading={isLoading}
              disabled={isLoading || items.length === 0}
            >
              Complete Order
            </Button>
          </form>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-veez-gray-50 rounded-lg p-6 sticky top-8">
            <h3 className="text-xl font-bold mb-6">Order Summary</h3>

            {/* Items */}
            <div className="space-y-3 mb-6 pb-6 border-b max-h-96 overflow-y-auto">
              {items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <div>
                    <p className="font-medium">{item.product?.name}</p>
                    {item.variant && (
                      <p className="text-xs text-veez-gray-600">
                        {item.variant.size} / {item.variant.colour}
                      </p>
                    )}
                    <p className="text-xs text-veez-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold">
                    {formatCurrency((item.product?.current_price || 0) * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="space-y-3 mb-6 pb-6 border-b">
              <div className="flex justify-between">
                <span className="text-veez-gray-600">Subtotal</span>
                <span className="font-medium">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-veez-gray-600">Delivery Fee</span>
                <span className="font-medium">{formatCurrency(deliveryFee)}</span>
              </div>
            </div>

            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>

            <p className="text-xs text-veez-gray-500 mt-4">
              You will confirm payment via WhatsApp after placing your order.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
