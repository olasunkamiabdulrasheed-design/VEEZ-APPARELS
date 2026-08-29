import { useState } from 'react'
import { Star, Send } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

interface Review {
  id: number
  rating: number
  comment: string
  author: string
  date: string
}

interface ProductReviewsProps {
  productId: number
  reviews?: Review[]
}

export default function ProductReviews({ productId, reviews = [] }: ProductReviewsProps) {
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [author, setAuthor] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!author.trim() || !comment.trim()) return
    
    setSubmitted(true)
    setRating(5)
    setComment('')
    setAuthor('')
    
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <div className="mt-12 pt-12 border-t">
      <h3 className="text-2xl font-bold mb-8">Customer Reviews</h3>

      {/* Rating Summary */}
      {reviews.length > 0 && (
        <div className="mb-8 pb-8 border-b">
          <div className="flex items-center gap-4">
            <div>
              <p className="text-4xl font-bold">{avgRating}</p>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.round(parseFloat(avgRating as string))
                        ? 'fill-veez-gold text-veez-gold'
                        : 'text-veez-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className="text-veez-gray-600">{reviews.length} reviews</p>
          </div>
        </div>
      )}

      {/* Review List */}
      {reviews.length > 0 && (
        <div className="mb-12 space-y-4">
          {reviews.slice(0, 5).map((review) => (
            <div key={review.id} className="p-4 bg-veez-gray-50 rounded">
              <div className="flex justify-between mb-2">
                <p className="font-semibold">{review.author}</p>
                <p className="text-sm text-veez-gray-600">{review.date}</p>
              </div>
              <div className="flex gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${
                      i < review.rating
                        ? 'fill-veez-gold text-veez-gold'
                        : 'text-veez-gray-300'
                    }`}
                  />
                ))}
              </div>
              <p className="text-veez-gray-700">{review.comment}</p>
            </div>
          ))}
        </div>
      )}

      {/* Submit Review */}
      <div>
        <h4 className="font-semibold mb-4">Leave a Review</h4>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Your Name"
            placeholder="John Doe"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />

          <div>
            <label className="block text-sm font-semibold mb-2">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`w-6 h-6 cursor-pointer ${
                      star <= rating
                        ? 'fill-veez-gold text-veez-gold'
                        : 'text-veez-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <Input
            label="Your Review"
            placeholder="Share your experience with this product..."
            multiline
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />

          <Button type="submit" disabled={submitted}>
            <Send className="w-4 h-4 mr-2" />
            {submitted ? 'Review Submitted!' : 'Submit Review'}
          </Button>
        </form>
      </div>
    </div>
  )
}
