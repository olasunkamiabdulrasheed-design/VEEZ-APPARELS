import { useState } from 'react'
import { Mail, Send } from 'lucide-react'
import { useToast } from '@/store'
import { isValidEmail } from '@/utils'

export default function NewsletterSignup() {
  const { addToast } = useToast()
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim()) {
      addToast('Please enter your email', 'error')
      return
    }

    if (!isValidEmail(email)) {
      addToast('Please enter a valid email', 'error')
      return
    }

    setSubscribed(true)
    setEmail('')
    addToast('Thank you for subscribing! 📧', 'success')

    setTimeout(() => setSubscribed(false), 3000)
  }

  return (
    <div className="bg-veez-black text-white rounded-lg p-8">
      <div className="flex items-start gap-4 mb-4">
        <Mail className="w-6 h-6 text-veez-gold flex-shrink-0 mt-1" />
        <div>
          <h3 className="text-2xl font-bold mb-2">Stay Updated</h3>
          <p className="text-veez-gray-300">
            Get exclusive offers, new arrivals, and styling tips delivered to your inbox
          </p>
        </div>
      </div>

      <form onSubmit={handleSubscribe} className="flex gap-2">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 px-4 py-3 rounded bg-veez-gray-800 text-white placeholder-veez-gray-500 focus:outline-none"
          disabled={subscribed}
        />
        <button
          type="submit"
          disabled={subscribed}
          className="px-6 py-3 bg-veez-gold text-veez-black font-semibold rounded hover:bg-opacity-90 transition flex items-center gap-2"
        >
          <Send className="w-4 h-4" />
          {subscribed ? '✓' : 'Subscribe'}
        </button>
      </form>

      <p className="text-xs text-veez-gray-400 mt-3">
        We respect your privacy. Unsubscribe at any time.
      </p>
    </div>
  )
}
