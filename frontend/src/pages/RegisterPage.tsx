import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { UserPlus } from 'lucide-react'
import { useAuth } from '@/store/auth'
import { useToast } from '@/store'
import { isValidEmail, isValidPhone } from '@/utils'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const { addToast } = useToast()
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })
  
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Invalid email format'
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required'
    } else if (!isValidPhone(formData.phone)) {
      newErrors.phone = 'Invalid phone number'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
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
      await register(formData.name, formData.email, formData.phone, formData.password)
      addToast('Account created successfully! 🎉', 'success')
      navigate('/account')
    } catch (error: any) {
      addToast(error.message || 'Registration failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-veez-gray-50">
      <div className="container-safe py-12">
        <div className="max-w-md mx-auto bg-white rounded-lg border p-8">
          <div className="text-center mb-8">
            <UserPlus className="w-12 h-12 mx-auto mb-4 text-veez-black" />
            <h1 className="text-3xl font-bold">Create Account</h1>
            <p className="text-veez-gray-600 mt-2">Join Veez Apparels today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              placeholder="Your name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              error={errors.name}
              required
            />

            <Input
              label="Email"
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              error={errors.email}
              required
            />

            <Input
              label="Phone Number"
              placeholder="+234 8100 000 000"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              error={errors.phone}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              error={errors.password}
              required
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              error={errors.confirmPassword}
              required
            />

            <Button fullWidth type="submit" loading={loading} disabled={loading}>
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-veez-gray-600 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-veez-black font-semibold hover:underline">
              Sign in
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
