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
