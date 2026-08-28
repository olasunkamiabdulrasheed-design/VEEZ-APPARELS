import { useState } from 'react'
import { Calendar, Clock, Users } from 'lucide-react'
import { api } from '@/services/api'
import { useToast, useLoading } from '@/store'
import { isValidEmail, isValidPhone } from '@/utils'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

export default function AppointmentsPage() {
  const { addToast } = useToast()
  const { isLoading, setLoading } = useLoading()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    preferred_date: '',
    preferred_time: '',
    purpose: 'styling',
    notes: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Invalid email'
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required'
    } else if (!isValidPhone(formData.phone)) {
      newErrors.phone = 'Invalid phone number'
    }
    if (!formData.preferred_date) newErrors.preferred_date = 'Date is required'
    if (!formData.preferred_time) newErrors.preferred_time = 'Time is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      addToast('Please fill in all required fields', 'error')
      return
    }

    try {
      setLoading(true)
      await api.requestAppointment(formData)
      setSubmitted(true)
      addToast('Appointment request submitted! We will confirm shortly.', 'success')
    } catch (error: any) {
      console.error('Error requesting appointment:', error)
      addToast(error.message || 'Failed to request appointment', 'error')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-veez-gray-50">
        <div className="container-safe py-12">
          <div className="max-w-2xl mx-auto bg-white rounded-lg border p-8 text-center">
            <div className="text-6xl mb-6">✓</div>
            <h2 className="text-3xl font-bold mb-4">Appointment Requested!</h2>
            <p className="text-veez-gray-600 mb-2">
              Thank you, <strong>{formData.name}</strong>!
            </p>
            <p className="text-veez-gray-600 mb-8">
              We will confirm your appointment at <strong>{formData.preferred_date}</strong> {formData.preferred_time}
            </p>

            <div className="bg-veez-gray-50 rounded-lg p-6 mb-8 text-left">
              <h3 className="font-semibold mb-4">Appointment Details</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-veez-gray-600">Date</p>
                  <p className="font-medium">{formData.preferred_date}</p>
                </div>
                <div>
                  <p className="text-sm text-veez-gray-600">Time</p>
                  <p className="font-medium">{formData.preferred_time}</p>
                </div>
                <div>
                  <p className="text-sm text-veez-gray-600">Purpose</p>
                  <p className="font-medium capitalize">{formData.purpose}</p>
                </div>
                <div>
                  <p className="text-sm text-veez-gray-600">Contact</p>
                  <p className="font-medium">{formData.email}</p>
                  <p className="font-medium">{formData.phone}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-veez-gray-600">
                A confirmation will be sent to your email. Our team will contact you if we need to reschedule.
              </p>
              <Button fullWidth onClick={() => window.location.href = '/'}>
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-veez-gray-50">
      {/* Hero */}
      <section className="bg-veez-black text-white py-16">
        <div className="container-safe text-center">
          <Calendar className="w-12 h-12 mx-auto mb-4" />
          <h1 className="text-5xl font-bold mb-4">Book an Appointment</h1>
          <p className="text-xl text-veez-gray-300 max-w-2xl mx-auto">
            Schedule a personal styling session with our team. Get expert advice on selecting the perfect outfit for your special occasion.
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-12">
        <div className="container-safe">
          <div className="max-w-2xl mx-auto bg-white rounded-lg border p-8">
            <h2 className="text-3xl font-bold mb-8">Request an Appointment</h2>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Your Information</h3>
                <div className="space-y-4">
                  <Input
                    label="Full Name"
                    placeholder="Your full name"
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
                </div>
              </div>

              {/* Appointment Details */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Appointment Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-veez-gray-700 mb-2">
                      Preferred Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.preferred_date}
                      onChange={(e) => setFormData({ ...formData, preferred_date: e.target.value })}
                      className="w-full px-4 py-3 border border-veez-gray-300 rounded focus:outline-none focus:border-veez-black"
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                    {errors.preferred_date && (
                      <p className="text-red-500 text-sm mt-2">{errors.preferred_date}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-veez-gray-700 mb-2">
                      Preferred Time <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="time"
                      value={formData.preferred_time}
                      onChange={(e) => setFormData({ ...formData, preferred_time: e.target.value })}
                      className="w-full px-4 py-3 border border-veez-gray-300 rounded focus:outline-none focus:border-veez-black"
                      required
                    />
                    {errors.preferred_time && (
                      <p className="text-red-500 text-sm mt-2">{errors.preferred_time}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-veez-gray-700 mb-2">
                      Appointment Purpose <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.purpose}
                      onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                      className="w-full px-4 py-3 border border-veez-gray-300 rounded focus:outline-none focus:border-veez-black"
                    >
                      <option value="styling">Personal Styling</option>
                      <option value="wedding">Wedding Consultation</option>
                      <option value="bespoke">Bespoke Consultation</option>
                      <option value="fitting">Fitting & Alterations</option>
                      <option value="occasion">Occasion Dressing</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <Input
                    label="Additional Notes"
                    placeholder="Tell us more about what you're looking for..."
                    multiline
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>
              </div>

              {/* Submit */}
              <Button
                fullWidth
                type="submit"
                loading={isLoading}
                disabled={isLoading}
              >
                Request Appointment
              </Button>
            </form>

            <p className="text-xs text-veez-gray-500 text-center mt-6">
              We're available Monday to Saturday, 10am - 6pm. We'll confirm your appointment within 24 hours.
            </p>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-12 bg-white border-t">
        <div className="container-safe">
          <h2 className="text-3xl font-bold mb-12 text-center">What to Expect</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <Users className="w-12 h-12 mx-auto mb-4 text-veez-black" />
              <h3 className="font-semibold mb-2">Expert Consultation</h3>
              <p className="text-sm text-veez-gray-600">
                Meet with our style experts who will understand your preferences and needs
              </p>
            </div>
            <div className="text-center">
              <Clock className="w-12 h-12 mx-auto mb-4 text-veez-black" />
              <h3 className="font-semibold mb-2">1-Hour Session</h3>
              <p className="text-sm text-veez-gray-600">
                Personalized styling and fashion advice tailored to your occasion
              </p>
            </div>
            <div className="text-center">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-veez-black" />
              <h3 className="font-semibold mb-2">Flexible Scheduling</h3>
              <p className="text-sm text-veez-gray-600">
                Choose the date and time that works best for you
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
