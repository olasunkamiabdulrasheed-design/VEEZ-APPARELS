import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { LogIn } from 'lucide-react'
import { useAuth } from '@/store/auth'
import { useToast } from '@/store'
import { isValidEmail } from '@/utils'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const { addToast } = useToast()
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    
    if (!email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!isValidEmail(email)) {
      newErrors.email = 'Invalid email format'
    }
    
    if (!password) {
      newErrors.password = 'Password is required'
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      addToast('Please fix the errors above', 'error')
      return
    }

    try {
      setLoading(true)
      await login(email, password)
      addToast('Welcome back! 👋', 'success')
      navigate('/account')
    } catch (error: any) {
      addToast(error.message || 'Login failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-veez-gray-50">
      <div className="container-safe py-12">
        <div className="max-w-md mx-auto bg-white rounded-lg border p-8">
          <div className="text-center mb-8">
            <LogIn className="w-12 h-12 mx-auto mb-4 text-veez-black" />
            <h1 className="text-3xl font-bold">Sign In</h1>
            <p className="text-veez-gray-600 mt-2">Access your Veez Apparels account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              required
            />

            <Button fullWidth type="submit" loading={loading} disabled={loading}>
              Sign In
            </Button>
          </form>

          <p className="text-center text-sm text-veez-gray-600 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-veez-black font-semibold hover:underline">
              Create one
            </Link>
          </p>

          <Link to="/" className="block text-center text-sm text-veez-gray-600 mt-2 hover:underline">
            Continue as guest
          </Link>
        </div>
      </div>
    </div>
  )
}
