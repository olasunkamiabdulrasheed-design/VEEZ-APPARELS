import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ShoppingCart, Heart, Share2 } from 'lucide-react'
import { Product, ProductVariant } from '@/types'
import { api } from '@/services/api'
import { useCart, useToast } from '@/store'
import { formatCurrency, openWhatsAppChat, generateProductInquiryMessage } from '@/utils'
import Button from '@/components/ui/Button'
import { LoadingSpinner } from '@/components/ui/Loading'

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { addItem } = useCart()
  const { addToast } = useToast()

  const [product, setProduct] = useState<Product | null>(null)
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) return
      try {
        setLoading(true)
        const data = await api.getProductBySlug(slug)
        setProduct(data)
        if (data.variants.length > 0) {
          setSelectedVariant(data.variants[0])
        }
      } catch (error) {
        console.error('Error fetching product:', error)
        navigate('/shop')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [slug, navigate])

  const handleAddToCart = () => {
    if (!product) return

    addItem({
      product_id: product.id,
      variant_id: selectedVariant?.id,
      quantity,
      product,
      variant: selectedVariant || undefined,
    })

    addToast('Added to cart', 'success')
  }

  const handleWhatsAppInquiry = () => {
    if (!product) return
    const message = generateProductInquiryMessage(
      product.name,
      product.sku,
      product.current_price,
      selectedVariant?.size,
      selectedVariant?.colour,
      quantity
    )
    openWhatsAppChat('+2348100000000', message)
  }

  if (loading) {
    return <div className="container-safe py-20 flex justify-center"><LoadingSpinner /></div>
  }

  if (!product) {
    return <div className="container-safe py-20 text-center">Product not found</div>
  }

  return (
    <div className="min-h-screen">
      <div className="container-safe py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            {product.images.length > 0 ? (
              <img
                src={product.images[0].image}
                alt={product.images[0].alt_text}
                className="w-full h-96 md:h-full object-cover rounded-lg mb-4"
              />
            ) : (
              <div className="w-full h-96 md:h-full bg-veez-gray-200 rounded-lg flex items-center justify-center">
                No Image
              </div>
            )}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.slice(1, 5).map((img) => (
                  <img
                    key={img.id}
                    src={img.image}
                    alt={img.alt_text}
                    className="w-full aspect-square object-cover rounded cursor-pointer hover:opacity-80"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <div className="mb-6">
              <p className="text-sm text-veez-gray-600 mb-2">{product.category.name}</p>
              <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
              
              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-bold">
                  {formatCurrency(product.current_price, product.currency)}
                </span>
                {product.is_on_sale && (
                  <span className="text-xl text-veez-gray-500 line-through">
                    {formatCurrency(product.base_price, product.currency)}
                  </span>
                )}
              </div>

              <p className={`text-sm font-medium ${product.available ? 'text-green-600' : 'text-red-600'}`}>
                {product.available ? 'In Stock' : 'Out of Stock'}
              </p>
            </div>

            {/* Description */}
            <div className="mb-8">
              <p className="text-veez-gray-700 leading-relaxed">{product.description}</p>
            </div>

            {/* Variants */}
            {product.variants.length > 0 && (
              <div className="mb-8 space-y-4">
                <div>
                  <h3 className="font-semibold mb-3">Size</h3>
                  <div className="flex gap-2 flex-wrap">
                    {[...new Set(product.variants.map(v => v.size))].map((size) => (
                      <button
                        key={size}
                        onClick={() => {
                          const v = product.variants.find(x => x.size === size)
                          if (v) setSelectedVariant(v)
                        }}
                        className={`px-4 py-2 border-2 rounded ${
                          selectedVariant?.size === size
                            ? 'border-veez-black bg-veez-black text-white'
                            : 'border-veez-gray-300 hover:border-veez-black'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Colour</h3>
                  <div className="flex gap-2 flex-wrap">
                    {[...new Set(product.variants.map(v => v.colour))].map((colour) => (
                      <button
                        key={colour}
                        onClick={() => {
                          const v = product.variants.find(x => x.colour === colour)
                          if (v) setSelectedVariant(v)
                        }}
                        className={`px-4 py-2 border-2 rounded ${
                          selectedVariant?.colour === colour
                            ? 'border-veez-black bg-veez-black text-white'
                            : 'border-veez-gray-300 hover:border-veez-black'
                        }`}
                      >
                        {colour}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Quantity & Add to Cart */}
            <div className="mb-8 space-y-4">
              <div className="flex items-center gap-4">
                <label className="font-semibold">Quantity</label>
                <div className="flex items-center border border-veez-gray-300 rounded">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 hover:bg-veez-gray-100"
                  >
                    −
                  </button>
                  <span className="px-6 py-2">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 hover:bg-veez-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>

              <Button fullWidth onClick={handleAddToCart} disabled={!product.available}>
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>

              <Button variant="secondary" fullWidth onClick={handleWhatsAppInquiry}>
                Ask About This Outfit on WhatsApp
              </Button>
            </div>

            {/* Actions */}
            <div className="flex gap-4 text-veez-gray-600">
              <button className="flex items-center gap-2 hover:text-veez-black">
                <Heart className="w-5 h-5" />
                Wishlist
              </button>
              <button className="flex items-center gap-2 hover:text-veez-black">
                <Share2 className="w-5 h-5" />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
