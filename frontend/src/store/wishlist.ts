// Wishlist store (add to existing store/index.ts)
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface WishlistItem {
  product_id: number
  product_name: string
  product_image?: string
  product_price: number
  added_date: string
}

interface WishlistStore {
  items: WishlistItem[]
  addItem: (item: WishlistItem) => void
  removeItem: (productId: number) => void
  clearWishlist: () => void
  isInWishlist: (productId: number) => boolean
}

export const useWishlist = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const existing = get().items.find(i => i.product_id === item.product_id)
        if (!existing) {
          set({ items: [...get().items, item] })
        }
      },
      removeItem: (productId) => {
        set({ items: get().items.filter(i => i.product_id !== productId) })
      },
      clearWishlist: () => set({ items: [] }),
      isInWishlist: (productId) => {
        return get().items.some(i => i.product_id === productId)
      },
    }),
    { name: 'veez-wishlist' }
  )
)
