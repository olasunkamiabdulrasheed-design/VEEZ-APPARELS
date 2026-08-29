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
