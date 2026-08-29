import { useState } from 'react'
import { PackageOpen, MapPin, Clock, CheckCircle2 } from 'lucide-react'
import { api } from '@/services/api'
import { useLoading, useToast } from '@/store'
import { formatCurrency, formatDate } from '@/utils'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Order } from '@/types'

export default function OrderTrackingPage() {
  const { isLoading, setLoading } = useLoading()
  const { addToast } = useToast()
  const [referenceNumber, setReferenceNumber] = useState('')
  const [order, setOrder] = useState<Order | null>(null)
  const [searched, setSearched] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!referenceNumber.trim()) {
      addToast('Please enter an order reference number', 'error')
      return
    }

    try {
      setLoading(true)
      const data = await api.getOrder(referenceNumber)
      setOrder(data)
      setSearched(true)
      addToast('Order found!', 'success')
    } catch (error: any) {
      setOrder(null)
      setSearched(true)
      addToast(error.message || 'Order not found', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-veez-gray-50">
      {/* Hero */}
      <section className="bg-veez-black text-white py-16">
        <div className="container-safe text-center">
          <PackageOpen className="w-12 h-12 mx-auto mb-4" />
          <h1 className="text-5xl font-bold mb-4">Track Your Order</h1>
          <p className="text-xl text-veez-gray-300">
            Enter your order reference number to check the status of your delivery
          </p>
        </div>
      </section>

      {/* Search Form */}
      <section className="py-12">
        <div className="container-safe max-w-2xl">
          <form onSubmit={handleSearch} className="bg-white rounded-lg border p-8 shadow-sm">
            <label className="block text-sm font-semibold mb-4">Order Reference Number</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g., VEEZ-20240829-001 or VEEZ-BSP-XXXXXXXX"
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value.toUpperCase())}
                className="flex-1 px-4 py-3 border border-veez-gray-300 rounded focus:outline-none focus:border-veez-black"
                disabled={isLoading}
              />
              <Button type="submit" loading={isLoading} disabled={isLoading}>
                Search
              </Button>
            </div>
            <p className="text-xs text-veez-gray-500 mt-2">
              Find your reference number in your order confirmation email
            </p>
          </form>
        </div>
      </section>

      {/* No Results */}
      {searched && !order && (
        <section className="py-12">
          <div className="container-safe max-w-2xl">
            <div className="bg-white rounded-lg border p-8 text-center">
              <PackageOpen className="w-12 h-12 mx-auto mb-4 text-veez-gray-400" />
              <h2 className="text-2xl font-bold mb-2">Order Not Found</h2>
              <p className="text-veez-gray-600 mb-6">
                We couldn't find an order with that reference number. Please check and try again.
              </p>
              <Button variant="secondary" onClick={() => { setSearched(false); setReferenceNumber('') }}>
                Search Again
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Order Details */}
      {order && (
        <section className="py-12">
          <div className="container-safe max-w-4xl">
            <div className="bg-white rounded-lg border p-8 shadow-sm">
              <div className="mb-8 pb-8 border-b">
                <h2 className="text-2xl font-bold mb-2">Order {order.order_number}</h2>
                <p className="text-veez-gray-600">Reference: {order.reference}</p>
              </div>

              {/* Status Badges */}
              <div className="mb-8 pb-8 border-b">
                <p className="text-sm font-semibold text-veez-gray-600 mb-2">Status</p>
                <div className="flex gap-2 flex-wrap">
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    order.order_status === 'delivered' 
                      ? 'bg-green-100 text-green-700'
                      : order.order_status === 'shipped'
                      ? 'bg-blue-100 text-blue-700'
                      : order.order_status === 'processing'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {order.order_status.charAt(0).toUpperCase() + order.order_status.slice(1)}
                  </span>
                </div>
              </div>

              {/* Order Items */}
              <div className="mb-8 pb-8 border-b">
                <h3 className="text-lg font-semibold mb-4">Order Items</h3>
                <div className="space-y-3">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between items-start p-4 bg-veez-gray-50 rounded">
                      <div>
                        <p className="font-semibold">{item.product_name_snapshot}</p>
                        {item.size_snapshot && (
                          <p className="text-sm text-veez-gray-600">
                            {item.size_snapshot} / {item.colour_snapshot}
                          </p>
                        )}
                        <p className="text-sm text-veez-gray-600">Quantity: {item.quantity}</p>
                      </div>
                      <p className="font-semibold">{formatCurrency(item.subtotal)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Information */}
              <div className="mb-8 pb-8 border-b">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Delivery Address
                </h3>
                <p className="text-veez-gray-700">
                  {order.delivery_address}<br />
                  {order.delivery_city}, {order.delivery_state}<br />
                  {order.delivery_country}
                </p>
              </div>

              {/* Order Totals */}
              <div className="text-right">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatCurrency(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span>{formatCurrency(order.delivery_fee)}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>{formatCurrency(order.total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
