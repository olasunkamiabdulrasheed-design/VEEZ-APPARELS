import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: number
  email: string
  name: string
  phone: string
  created_at: string
}

interface AuthStore {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  register: (name: string, email: string, phone: string, password: string) => Promise<void>
  setUser: (user: User) => void
}

export const useAuth = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      
      login: async (email, password) => {
        try {
          // Mock login - replace with actual API call
          const user: User = {
            id: 1,
            email,
            name: 'Customer',
            phone: '',
            created_at: new Date().toISOString(),
          }
          set({ user, token: 'mock-token', isAuthenticated: true })
        } catch (error) {
          throw error
        }
      },
      
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false })
      },
      
      register: async (name, email, phone, password) => {
        try {
          // Mock register - replace with actual API call
          const user: User = {
            id: 1,
            email,
            name,
            phone,
            created_at: new Date().toISOString(),
          }
          set({ user, token: 'mock-token', isAuthenticated: true })
        } catch (error) {
          throw error
        }
      },
      
      setUser: (user) => {
        set({ user })
      },
    }),
    { name: 'veez-auth' }
  )
)
