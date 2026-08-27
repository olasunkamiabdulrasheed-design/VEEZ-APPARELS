// Product Types
export interface ProductImage {
  id: number
  image: string
  alt_text: string
  sort_order: number
}

export interface ProductVariant {
  id: number
  size: string
  colour: string
  sku: string
  price: string
  stock: number
  available: boolean
  has_stock: boolean
}

export interface Category {
  id: number
  name: string
  slug: string
  description?: string
  image?: string
}

export interface Collection {
  id: number
  name: string
  slug: string
  description?: string
  image?: string
  featured: boolean
}

export interface Product {
  id: number
  name: string
  slug: string
  sku: string
  description: string
  category: Category
  collection?: Collection
  base_price: string
  sale_price?: string | null
  current_price: string
  currency: string
  is_on_sale: boolean
  featured: boolean
  new_arrival: boolean
  available: boolean
  audience: 'men' | 'women' | 'children' | 'unisex'
  images: ProductImage[]
  variants: ProductVariant[]
  created_at: string
  updated_at: string
}

// Cart Types
export interface CartItem {
  product_id: number
  variant_id?: number
  quantity: number
  product?: Product
  variant?: ProductVariant
}

export interface Cart {
  items: CartItem[]
  subtotal: number
  deliveryFee: number
  total: number
}

// Customer Types
export interface Customer {
  id: number
  name: string
  email: string
  phone: string
  address?: string
  city?: string
  state?: string
  country: string
}

// Order Types
export interface OrderItem {
  id: number
  product_name_snapshot: string
  product_sku_snapshot: string
  size_snapshot?: string
  colour_snapshot?: string
  unit_price_snapshot: string
  quantity: number
  subtotal: string
}

export interface Order {
  id: number
  order_number: string
  reference: string
  customer?: Customer
  email: string
  phone: string
  delivery_address: string
  delivery_city: string
  delivery_state: string
  delivery_country: string
  delivery_notes?: string
  subtotal: string
  delivery_fee: string
  total: string
  currency: string
  order_status: 'pending' | 'confirmed' | 'processing' | 'ready' | 'shipped' | 'delivered' | 'cancelled'
  items: OrderItem[]
  notes?: string
  created_at: string
  updated_at: string
}

export interface OrderStatusHistory {
  id: number
  from_status: string
  to_status: string
  changed_by_name?: string
  notes?: string
  created_at: string
}

// Bespoke Request Types
export interface BespokeRequest {
  id: number
  reference: string
  name: string
  email: string
  phone: string
  outfit_type: 'agbada' | 'kaftan' | 'native' | 'senator' | 'wedding' | 'traditional' | 'other'
  occasion: 'wedding' | 'birthday' | 'party' | 'ceremony' | 'corporate' | 'religious' | 'casual' | 'other'
  colour?: string
  fabric?: string
  style_description: string
  measurements: string
  reference_image?: string
  notes?: string
  status: 'pending' | 'contacted' | 'in_progress' | 'completed' | 'cancelled'
  created_at: string
}

// Appointment Types
export interface Appointment {
  id: number
  name: string
  email: string
  phone: string
  preferred_date: string
  preferred_time: string
  purpose: string
  notes?: string
  status: 'pending' | 'confirmed' | 'rescheduled' | 'completed' | 'cancelled'
  created_at: string
}

// Lookbook Types
export interface Lookbook {
  id: number
  title: string
  description?: string
  image: string
  collection?: Collection
}

// Testimonial Types
export interface Testimonial {
  id: number
  name: string
  quote: string
  rating: number
  created_at: string
}

// Site Settings Types
export interface SiteSettings {
  whatsapp_number: string
  business_email: string
  business_phone: string
  business_address: string
  instagram_url: string
  facebook_url: string
  default_delivery_fee: number
  currency: string
}

// API Response Types
export interface ApiResponse<T> {
  data?: T
  error?: string
  errors?: Record<string, string[]>
}

export interface PaginatedResponse<T> {
  count: number
  next?: string
  previous?: string
  results: T[]
}

// Filter Types
export interface ProductFilters {
  category?: string
  collection?: string
  audience?: string
  search?: string
  min_price?: number
  max_price?: number
  new_arrival?: boolean
  featured?: boolean
  page?: number
}
