import { useState } from 'react'
import { Sparkles, ArrowRight } from 'lucide-react'
import { api } from '@/services/api'
import { useToast, useLoading } from '@/store'
import { isValidEmail, isValidPhone, generateBespokeWhatsAppMessage, openWhatsAppChat } from '@/utils'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

export default function BespokePage() {
  const { addToast } = useToast()
  const { isLoading, setLoading } = useLoading()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    outfit_type: 'agbada',
    occasion: 'wedding',
    colour: '',
    fabric: '',
    style_description: '',
    measurements: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [referenceNumber, setReferenceNumber] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)

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
    if (!formData.style_description.trim()) newErrors.style_description = 'Style description is required'
    if (!formData.measurements.trim()) newErrors.measurements = 'Measurements are required'

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

      const formDataToSend = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value)
      })

      if (imageFile) {
        formDataToSend.append('reference_image', imageFile)
      }

      const response = await api.submitBespokeRequest(formDataToSend)
      setReferenceNumber(response.reference)
      addToast('Bespoke request submitted! 🎉', 'success')
    } catch (error: any) {
      console.error('Error submitting bespoke request:', error)
      addToast(error.message || 'Failed to submit request', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleWhatsAppChat = () => {
    if (!referenceNumber) return
    const message = generateBespokeWhatsAppMessage(
      referenceNumber,
      formData.outfit_type,
      formData.occasion,
      formData.colour
    )
    openWhatsAppChat('+2348100000000', message)
  }

  // Success state
  if (referenceNumber) {
    return (
      <div className="min-h-screen bg-veez-gray-50">
        <div className="container-safe py-12">
          <div className="max-w-2xl mx-auto bg-white rounded-lg border p-8 text-center">
            <div className="text-6xl mb-6">✨</div>
            <h2 className="text-3xl font-bold mb-4">Bespoke Request Received!</h2>
            <p className="text-veez-gray-600 mb-2">
              Thank you for your request, <strong>{formData.name}</strong>
            </p>
            <p className="text-veez-gray-600 mb-8">
              Reference: <span className="font-mono font-bold text-lg">{referenceNumber}</span>
            </p>

            <div className="bg-veez-gray-50 rounded-lg p-6 mb-8 text-left">
              <h3 className="font-semibold mb-4">Your Request</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-veez-gray-600">Outfit Type</p>
                  <p className="font-medium capitalize">{formData.outfit_type}</p>
                </div>
                <div>
                  <p className="text-sm text-veez-gray-600">Occasion</p>
                  <p className="font-medium capitalize">{formData.occasion}</p>
                </div>
                {formData.colour && (
                  <div>
                    <p className="text-sm text-veez-gray-600">Colour Preference</p>
                    <p className="font-medium">{formData.colour}</p>
                  </div>
                )}
                {formData.fabric && (
                  <div>
                    <p className="text-sm text-veez-gray-600">Fabric Preference</p>
                    <p className="font-medium">{formData.fabric}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-veez-gray-600">
                Our design team will review your request and reach out within 24 hours. Connect with us on WhatsApp for faster response.
              </p>
              <Button
                fullWidth
                onClick={handleWhatsAppChat}
                className="!bg-green-600 hover:!bg-green-700"
              >
                Chat on WhatsApp
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button variant="secondary" fullWidth onClick={() => setReferenceNumber('')}>
                Submit Another Request
              </Button>
            </div>

            <p className="text-xs text-veez-gray-500 mt-6">
              Keep your reference number for tracking. You can also reply to the email confirmation.
            </p>
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
          <Sparkles className="w-12 h-12 mx-auto mb-4" />
          <h1 className="text-5xl font-bold mb-4">Your Style. Your Measurements. Your Veez.</h1>
          <p className="text-xl text-veez-gray-300 max-w-2xl mx-auto">
            Create a one-of-a-kind outfit tailored specifically for you. Work with our design team to bring your vision to life.
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-12">
        <div className="container-safe">
          <div className="max-w-2xl mx-auto bg-white rounded-lg border p-8">
            <h2 className="text-3xl font-bold mb-8">Submit Your Bespoke Request</h2>

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

              {/* Outfit Details */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Outfit Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-veez-gray-700 mb-2">
                      Outfit Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.outfit_type}
                      onChange={(e) => setFormData({ ...formData, outfit_type: e.target.value })}
                      className="w-full px-4 py-3 border border-veez-gray-300 rounded focus:outline-none focus:border-veez-black"
                    >
                      <option value="agbada">Agbada</option>
                      <option value="kaftan">Kaftan</option>
                      <option value="native">Native Wear</option>
                      <option value="senator">Senator Style</option>
                      <option value="wedding">Wedding Outfit</option>
                      <option value="traditional">Traditional Outfit</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-veez-gray-700 mb-2">
                      Occasion <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.occasion}
                      onChange={(e) => setFormData({ ...formData, occasion: e.target.value })}
                      className="w-full px-4 py-3 border border-veez-gray-300 rounded focus:outline-none focus:border-veez-black"
                    >
                      <option value="wedding">Wedding</option>
                      <option value="birthday">Birthday</option>
                      <option value="party">Party</option>
                      <option value="ceremony">Ceremony</option>
                      <option value="corporate">Corporate Event</option>
                      <option value="religious">Religious Event</option>
                      <option value="casual">Casual</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <Input
                    label="Colour Preference"
                    placeholder="e.g., Navy Blue, Deep Red, Gold"
                    value={formData.colour}
                    onChange={(e) => setFormData({ ...formData, colour: e.target.value })}
                  />

                  <Input
                    label="Fabric Preference"
                    placeholder="e.g., Ankara, Linen, Silk, Damask"
                    value={formData.fabric}
                    onChange={(e) => setFormData({ ...formData, fabric: e.target.value })}
                  />

                  <Input
                    label="Style Description"
                    placeholder="Describe your vision in detail. What's the style, fit, embellishments, etc.?"
                    multiline
                    rows={4}
                    value={formData.style_description}
                    onChange={(e) => setFormData({ ...formData, style_description: e.target.value })}
                    error={errors.style_description}
                    required
                  />
                </div>
              </div>

              {/* Measurements */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Measurements</h3>
                <p className="text-sm text-veez-gray-600 mb-4">
                  Please provide your measurements in centimeters or inches. Include: chest, waist, hips, shoulder width, sleeve length, etc.
                </p>
                <Input
                  label="Your Measurements"
                  placeholder="Chest: 90cm, Waist: 75cm, Hips: 100cm, etc."
                  multiline
                  rows={3}
                  value={formData.measurements}
                  onChange={(e) => setFormData({ ...formData, measurements: e.target.value })}
                  error={errors.measurements}
                  required
                />
              </div>

              {/* Reference Image */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Reference Image (Optional)</h3>
                <p className="text-sm text-veez-gray-600 mb-4">
                  Upload an image of a style you like for inspiration
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="w-full px-4 py-3 border border-veez-gray-300 rounded focus:outline-none focus:border-veez-black"
                />
                {imageFile && (
                  <p className="text-sm text-green-600 mt-2">✓ {imageFile.name}</p>
                )}
              </div>

              {/* Submit */}
              <Button
                fullWidth
                type="submit"
                loading={isLoading}
                disabled={isLoading}
              >
                Submit Bespoke Request
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </form>

            <p className="text-xs text-veez-gray-500 text-center mt-6">
              You'll receive a reference number and our team will contact you within 24 hours to discuss your custom outfit.
            </p>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-12 bg-white border-t">
        <div className="container-safe">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-4xl mb-4">📏</div>
              <h3 className="font-semibold mb-2">Perfect Fit</h3>
              <p className="text-sm text-veez-gray-600">
                Tailored to your exact measurements for an impeccable fit
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="font-semibold mb-2">Your Vision</h3>
              <p className="text-sm text-veez-gray-600">
                Collaborate with our designers to create exactly what you imagine
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">✨</div>
              <h3 className="font-semibold mb-2">Premium Quality</h3>
              <p className="text-sm text-veez-gray-600">
                Crafted with the finest materials and attention to detail
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
