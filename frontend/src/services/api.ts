import axios, { AxiosInstance, AxiosError } from 'axios'
import type {
  Product,
  Category,
  Collection,
  Order,
  BespokeRequest,
  Appointment,
  Lookbook,
  Testimonial,
  SiteSettings,
  PaginatedResponse,
  ProductFilters,
  OrderItem
} from '@/types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: `${API_BASE_URL}/api`,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    })

    // Add request interceptor for error handling
    this.client.interceptors.response.use(
      response => response,
      error => {
        if (error.response?.status === 404) {
          console.error('Resource not found:', error.config.url)
        }
        return Promise.reject(error)
      }
    )
  }

  // ========== PRODUCTS ==========
  async getProducts(filters?: ProductFilters & { limit?: number; offset?: number }) {
    try {
      const response = await this.client.get<PaginatedResponse<Product>>('/products/', {
        params: filters
      })
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async getProductBySlug(slug: string) {
    try {
      const response = await this.client.get<Product>(`/products/${slug}/`)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async getFeaturedProducts() {
    try {
      const response = await this.client.get<Product[]>('/products/featured/')
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async getNewArrivals() {
    try {
      const response = await this.client.get<Product[]>('/products/new_arrivals/')
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async checkVariantAvailability(productSlug: string, size: string, colour: string) {
    try {
      const response = await this.client.post(`/products/${productSlug}/check_availability/`, {
        size,
        colour
      })
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // ========== CATEGORIES & COLLECTIONS ==========
  async getCategories() {
    try {
      const response = await this.client.get<PaginatedResponse<Category>>('/products/categories/')
      return response.data.results || response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async getCollections() {
    try {
      const response = await this.client.get<PaginatedResponse<Collection>>('/products/collections/')
      return response.data.results || response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async getFeaturedCollections() {
    try {
      const response = await this.client.get<Collection[]>('/products/collections/featured/')
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // ========== SEARCH ==========
  async searchProducts(query: string) {
    try {
      const response = await this.client.get('/products/search/products/', {
        params: { q: query }
      })
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // ========== ORDERS ==========
  async createOrder(data: {
    email: string
    phone: string
    name: string
    delivery_address: string
    delivery_city: string
    delivery_state: string
    delivery_country?: string
    delivery_fee?: number
    items: Array<{
      product_id: number
      variant_id?: number
      quantity: number
    }>
  }) {
    try {
      const response = await this.client.post<Order>('/orders/create_from_cart/', data)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async getOrder(reference: string) {
    try {
      const response = await this.client.get<Order>(`/orders/${reference}/`)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async confirmOrderPayment(reference: string) {
    try {
      const response = await this.client.post<Order>(`/orders/${reference}/confirm_payment/`)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async updateOrderStatus(reference: string, status: string, notes?: string) {
    try {
      const response = await this.client.post<Order>(`/orders/${reference}/update_status/`, {
        status,
        notes
      })
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async getOrderStatusHistory(reference: string) {
    try {
      const response = await this.client.get(`/orders/${reference}/status_history/`)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async cancelOrder(reference: string, reason?: string) {
    try {
      const response = await this.client.post<Order>(`/orders/${reference}/cancel/`, {
        reason
      })
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // ========== BESPOKE REQUESTS ==========
  async submitBespokeRequest(data: FormData) {
    try {
      const response = await this.client.post<BespokeRequest>('/bespoke/submit_request/', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      })
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async getBespokeRequest(reference: string) {
    try {
      const response = await this.client.get<BespokeRequest>(`/bespoke/${reference}/`)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // ========== APPOINTMENTS ==========
  async requestAppointment(data: {
    name: string
    email: string
    phone: string
    preferred_date: string
    preferred_time: string
    purpose: string
    notes?: string
  }) {
    try {
      const response = await this.client.post<Appointment>('/appointments/request_appointment/', data)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async getAppointment(id: number) {
    try {
      const response = await this.client.get<Appointment>(`/appointments/${id}/`)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // ========== CORE (Settings, Lookbook, Testimonials) ==========
  async getSettings() {
    try {
      const response = await this.client.get<SiteSettings>('/core/settings/retrieve/')
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async getLookbook() {
    try {
      const response = await this.client.get<PaginatedResponse<Lookbook>>('/core/lookbook/')
      return response.data.results || response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async getTestimonials() {
    try {
      const response = await this.client.get<PaginatedResponse<Testimonial>>('/core/testimonials/')
      return response.data.results || response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // ========== ERROR HANDLING ==========
  private handleError(error: unknown): Error {
    if (error instanceof AxiosError) {
      const message = error.response?.data?.error || error.response?.data?.detail || error.message
      return new Error(message || 'An error occurred')
    }
    return error instanceof Error ? error : new Error('Unknown error occurred')
  }
}

export const api = new ApiClient()
export default api
