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
