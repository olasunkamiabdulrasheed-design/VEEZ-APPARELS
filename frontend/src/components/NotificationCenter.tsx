import { Bell, X, ShoppingBag, CheckCircle, Package } from 'lucide-react'
import { useState } from 'react'

interface Notification {
  id: string
  type: 'cart' | 'order' | 'delivery'
  title: string
  message: string
  timestamp: string
  read: boolean
}

interface NotificationCenterProps {
  notifications?: Notification[]
}

export default function NotificationCenter({ notifications = [] }: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false)
  const unreadCount = notifications.filter(n => !n.read).length

  const getIcon = (type: string) => {
    switch (type) {
      case 'cart':
        return <ShoppingBag className="w-4 h-4 text-blue-600" />
      case 'order':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'delivery':
        return <Package className="w-4 h-4 text-purple-600" />
      default:
        return <Bell className="w-4 h-4" />
    }
  }

  return (
    <div className="relative">
      {/* Bell Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-veez-gray-100 rounded-lg transition"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-2xl border z-50">
          <div className="p-4 border-b">
            <h3 className="font-semibold flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notifications
            </h3>
          </div>

          {notifications.length > 0 ? (
            <div className="max-h-96 overflow-y-auto">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-4 border-b hover:bg-veez-gray-50 transition ${
                    !notif.read ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex gap-3">
                    <div className="mt-1">{getIcon(notif.type)}</div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{notif.title}</p>
                      <p className="text-sm text-veez-gray-600">{notif.message}</p>
                      <p className="text-xs text-veez-gray-500 mt-1">{notif.timestamp}</p>
                    </div>
                    <button className="text-veez-gray-400 hover:text-red-600">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-veez-gray-500">
              <Bell className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No notifications yet</p>
            </div>
          )}

          {notifications.length > 0 && (
            <div className="p-3 border-t text-center">
              <button className="text-sm text-veez-black hover:underline font-semibold">
                View All
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
