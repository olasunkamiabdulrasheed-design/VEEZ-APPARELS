import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, LogOut, ShoppingBag, Heart } from 'lucide-react'
import { useAuth } from '@/store/auth'
import Button from '@/components/ui/Button'

export default function AccountPage() {
  const navigate = useNavigate()
  const { user, logout, isAuthenticated } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')

  if (!isAuthenticated || !user) {
    return (
      <div className="container-safe py-20 text-center">
        <User className="w-16 h-16 mx-auto mb-4 text-veez-gray-300" />
        <h2 className="text-3xl font-bold mb-4">Sign In to Your Account</h2>
        <p className="text-veez-gray-600 mb-8">Access your profile, orders, and wishlist</p>
        <div className="flex gap-4 justify-center">
          <Button onClick={() => navigate('/login')}>Sign In</Button>
          <Button variant="secondary" onClick={() => navigate('/register')}>Create Account</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container-safe py-12">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-veez-gray-50 rounded-lg p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-veez-black text-white flex items-center justify-center mx-auto mb-3">
                  <User className="w-8 h-8" />
                </div>
                <h3 className="font-semibold">{user.name}</h3>
                <p className="text-sm text-veez-gray-600">{user.email}</p>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full text-left px-4 py-2 rounded ${
                    activeTab === 'profile'
                      ? 'bg-veez-black text-white'
                      : 'hover:bg-veez-gray-200'
                  }`}
                >
                  Profile
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full text-left px-4 py-2 rounded flex items-center gap-2 ${
                    activeTab === 'orders'
                      ? 'bg-veez-black text-white'
                      : 'hover:bg-veez-gray-200'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  Orders
                </button>
                <button
                  onClick={() => setActiveTab('wishlist')}
                  className={`w-full text-left px-4 py-2 rounded flex items-center gap-2 ${
                    activeTab === 'wishlist'
                      ? 'bg-veez-black text-white'
                      : 'hover:bg-veez-gray-200'
                  }`}
                >
                  <Heart className="w-4 h-4" />
                  Wishlist
                </button>
                <button
                  onClick={() => {
                    logout()
                    navigate('/')
                  }}
                  className="w-full text-left px-4 py-2 rounded text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="md:col-span-3">
            {activeTab === 'profile' && (
              <div className="bg-white rounded-lg border p-8">
                <h2 className="text-2xl font-bold mb-6">Profile Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-veez-gray-600">Name</label>
                    <p className="font-semibold">{user.name}</p>
                  </div>
                  <div>
                    <label className="text-sm text-veez-gray-600">Email</label>
                    <p className="font-semibold">{user.email}</p>
                  </div>
                  <div>
                    <label className="text-sm text-veez-gray-600">Phone</label>
                    <p className="font-semibold">{user.phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-veez-gray-600">Member Since</label>
                    <p className="font-semibold">
                      {new Date(user.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Button className="mt-6">Edit Profile</Button>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="bg-white rounded-lg border p-8">
                <h2 className="text-2xl font-bold mb-6">Order History</h2>
                <p className="text-veez-gray-600">No orders yet. Start shopping!</p>
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div className="bg-white rounded-lg border p-8">
                <h2 className="text-2xl font-bold mb-6">Saved Items</h2>
                <p className="text-veez-gray-600 mb-4">View your wishlist</p>
                <Button onClick={() => navigate('/wishlist')}>Go to Wishlist</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
