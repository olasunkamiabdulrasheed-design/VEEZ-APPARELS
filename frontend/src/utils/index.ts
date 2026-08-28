/**
 * Utility functions for Veez Apparels
 */

// Format currency
export const formatCurrency = (amount: number | string, currency: string = 'NGN'): string => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount
  
  const formatter = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })
  
  return formatter.format(num)
}

// Format date
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-NG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

// Format date and time
export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

// Truncate text
export const truncateText = (text: string, length: number = 100): string => {
  if (text.length <= length) return text
  return text.substring(0, length) + '...'
}

// Generate WhatsApp message for order confirmation
export const generateOrderWhatsAppMessage = (order: any): string => {
  let message = `Hello Veez Apparels, I'd like to confirm my order.\n\n`
  message += `*Order Reference:* ${order.order_number}\n`
  message += `*Reference Code:* ${order.reference}\n\n`

  message += `*Items:*\n`
  order.items.forEach((item: any, index: number) => {
    message += `${index + 1}. ${item.product_name_snapshot}\n`
    if (item.size_snapshot) message += `   Size: ${item.size_snapshot}\n`
    if (item.colour_snapshot) message += `   Colour: ${item.colour_snapshot}\n`
    message += `   Quantity: ${item.quantity}\n`
    message += `   Price: ${formatCurrency(item.unit_price_snapshot)}\n\n`
  })

  message += `*Subtotal:* ${formatCurrency(order.subtotal)}\n`
  message += `*Delivery Fee:* ${formatCurrency(order.delivery_fee)}\n`
  message += `*Total:* ${formatCurrency(order.total)}\n\n`

  message += `*Delivery Details:*\n`
  message += `${order.delivery_address}\n`
  message += `${order.delivery_city}, ${order.delivery_state}\n`
  message += `${order.delivery_country}\n\n`

  message += `*Customer Info:*\n`
  message += `Name: ${order.customer?.name || 'N/A'}\n`
  message += `Email: ${order.email}\n`
  message += `Phone: ${order.phone}\n`

  return message
}

// Generate WhatsApp message for product inquiry
export const generateProductInquiryMessage = (
  productName: string,
  productId: string,
  price: string,
  size?: string,
  colour?: string,
  quantity: number = 1
): string => {
  let message = `Hello Veez Apparels, I'm interested in this outfit:\n\n`
  message += `*Product:* ${productName}\n`
  message += `*Product ID:* ${productId}\n`
  if (size) message += `*Size:* ${size}\n`
  if (colour) message += `*Colour:* ${colour}\n`
  message += `*Quantity:* ${quantity}\n`
  message += `*Price:* ${formatCurrency(price)}\n\n`
  message += `I'd like to know more about availability and ordering.`
  return message
}

// Generate WhatsApp message for bespoke request
export const generateBespokeWhatsAppMessage = (reference: string, outfit: string, occasion: string, colour?: string): string => {
  let message = `Hello Veez Apparels, I submitted a bespoke request.\n\n`
  message += `*Reference:* ${reference}\n`
  message += `*Outfit Type:* ${outfit}\n`
  message += `*Occasion:* ${occasion}\n`
  if (colour) message += `*Colour Preference:* ${colour}\n\n`
  message += `I would like to discuss the details further.`
  return message
}

// Open WhatsApp chat
export const openWhatsAppChat = (phoneNumber: string, message: string): void => {
  // Remove +, spaces, dashes from phone number
  const cleanPhone = phoneNumber.replace(/[^\d]/g, '')
  const encodedMessage = encodeURIComponent(message)
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`
  window.open(whatsappUrl, '_blank')
}

// Validate email
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validate phone
export const isValidPhone = (phone: string): boolean => {
  // Nigerian phone format
  const phoneRegex = /^(\+234|0)[0-9]{10}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

// Format phone number
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '')
  
  if (cleaned.startsWith('234')) {
    return `+${cleaned}`
  } else if (cleaned.startsWith('0')) {
    return `+234${cleaned.slice(1)}`
  }
  
  return `+${cleaned}`
}

// Slugify text
export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

// Get initials from name
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

// Check if mobile device
export const isMobileDevice = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

// Debounce function
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

// Get price range from products
export const getPriceRange = (products: any[]): { min: number; max: number } => {
  if (products.length === 0) return { min: 0, max: 0 }

  const prices = products.map((p) => parseFloat(p.current_price || p.base_price))
  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
  }
}

// Build query string
export const buildQueryString = (params: Record<string, any>): string => {
  const query = new URLSearchParams()
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      if (Array.isArray(value)) {
        value.forEach((v) => query.append(key, v))
      } else {
        query.set(key, String(value))
      }
    }
  })

  return query.toString()
}

// Parse query string
export const parseQueryString = (queryString: string): Record<string, string | string[]> => {
  const params = new URLSearchParams(queryString)
  const result: Record<string, string | string[]> = {}

  params.forEach((value, key) => {
    if (result[key]) {
      if (Array.isArray(result[key])) {
        (result[key] as string[]).push(value)
      } else {
        result[key] = [result[key] as string, value]
      }
    } else {
      result[key] = value
    }
  })

  return result
}

// Local storage helpers
export const storage = {
  get: (key: string): any => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.error(`Error reading from localStorage: ${key}`, error)
      return null
    }
  },

  set: (key: string, value: any): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(`Error writing to localStorage: ${key}`, error)
    }
  },

  remove: (key: string): void => {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error(`Error removing from localStorage: ${key}`, error)
    }
  },

  clear: (): void => {
    try {
      localStorage.clear()
    } catch (error) {
      console.error('Error clearing localStorage', error)
    }
  },
}
