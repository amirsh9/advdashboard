'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Bell, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  X,
  Clock,
  TrendingUp,
  Package,
  Users,
  DollarSign,
  Truck,
  AlertCircle,
  Check,
  Settings,
  RefreshCw
} from 'lucide-react'

interface Notification {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  timestamp: Date
  read: boolean
  category: 'system' | 'sales' | 'inventory' | 'finance' | 'hr' | 'all'
  action?: {
    label: string
    onClick: () => void
  }
}

interface NotificationCenterProps {
  isOpen: boolean
  onClose: () => void
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [activeTab, setActiveTab] = useState('all')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Mock notifications for demonstration
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'warning',
        title: 'Low Stock Alert',
        message: 'Mountain-200 Silver is running low (18 units remaining)',
        timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
        read: false,
        category: 'inventory',
        action: {
          label: 'View Inventory',
          onClick: () => console.log('Navigate to inventory')
        }
      },
      {
        id: '2',
        type: 'success',
        title: 'Sales Target Achieved',
        message: 'Northwest region exceeded Q4 target by 15%',
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        read: false,
        category: 'sales'
      },
      {
        id: '3',
        type: 'error',
        title: 'Payment Processing Failed',
        message: 'Order SO71775 payment could not be processed',
        timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
        read: true,
        category: 'finance',
        action: {
          label: 'Review Order',
          onClick: () => console.log('Navigate to order')
        }
      },
      {
        id: '4',
        type: 'info',
        title: 'New Employee Onboarded',
        message: 'John Smith has completed onboarding process',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        read: true,
        category: 'hr'
      },
      {
        id: '5',
        type: 'warning',
        title: 'Vendor Delivery Delay',
        message: 'Advanced Components shipment delayed by 2 days',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
        read: false,
        category: 'inventory'
      },
      {
        id: '6',
        type: 'success',
        title: 'Monthly Report Generated',
        message: 'Financial reports for December 2024 are ready',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
        read: true,
        category: 'finance'
      }
    ]

    setNotifications(mockNotifications)
  }, [])

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    )
  }

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id))
  }

  const clearAll = () => {
    setNotifications([])
  }

  const refreshNotifications = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
  }

  const filteredNotifications = notifications.filter(notif => {
    if (activeTab === 'all') return true
    return notif.category === activeTab
  })

  const unreadCount = notifications.filter(n => !n.read).length

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case 'error': return <AlertCircle className="h-4 w-4 text-red-600" />
      default: return <Info className="h-4 w-4 text-blue-600" />
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'sales': return <TrendingUp className="h-4 w-4" />
      case 'inventory': return <Package className="h-4 w-4" />
      case 'finance': return <DollarSign className="h-4 w-4" />
      case 'hr': return <Users className="h-4 w-4" />
      default: return <Bell className="h-4 w-4" />
    }
  }

  const formatTimestamp = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end pt-16 pr-4">
      <div className="fixed inset-0 bg-black bg-opacity-20" onClick={onClose} />
      <Card className="w-full max-w-md max-h-[80vh] bg-white shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            <CardTitle className="text-lg">Notifications</CardTitle>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="h-5 w-5 rounded-full p-0 flex items-center justify-center">
                {unreadCount}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={refreshNotifications}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="px-4 pb-2">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
                <TabsTrigger value="sales" className="text-xs">Sales</TabsTrigger>
                <TabsTrigger value="inventory" className="text-xs">Inventory</TabsTrigger>
                <TabsTrigger value="finance" className="text-xs">Finance</TabsTrigger>
                <TabsTrigger value="hr" className="text-xs">HR</TabsTrigger>
                <TabsTrigger value="system" className="text-xs">System</TabsTrigger>
              </TabsList>
            </div>

            <div className="flex items-center justify-between px-4 py-2 border-t">
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
              >
                <Check className="h-4 w-4 mr-2" />
                Mark all read
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAll}
                disabled={notifications.length === 0}
              >
                Clear all
              </Button>
            </div>

            <ScrollArea className="h-96">
              <div className="p-4 space-y-3">
                {filteredNotifications.length === 0 ? (
                  <div className="text-center py-8">
                    <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No notifications</p>
                  </div>
                ) : (
                  filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 rounded-lg border transition-colors ${
                        notification.read 
                          ? 'bg-gray-50 border-gray-200' 
                          : 'bg-blue-50 border-blue-200'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {getTypeIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className={`text-sm font-medium ${
                              notification.read ? 'text-gray-900' : 'text-gray-900'
                            }`}>
                              {notification.title}
                            </h4>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteNotification(notification.id)}
                              className="h-6 w-6 p-0"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                          <p className={`text-sm ${
                            notification.read ? 'text-gray-600' : 'text-gray-700'
                          }`}>
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              {getCategoryIcon(notification.category)}
                              <Clock className="h-3 w-3" />
                              {formatTimestamp(notification.timestamp)}
                            </div>
                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markAsRead(notification.id)}
                                className="text-xs h-6"
                              >
                                Mark as read
                              </Button>
                            )}
                          </div>
                          {notification.action && (
                            <div className="mt-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={notification.action.onClick}
                                className="text-xs"
                              >
                                {notification.action.label}
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

// Real-time data hook
export const useRealTimeData = () => {
  const [isConnected, setIsConnected] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  useEffect(() => {
    // Simulate real-time connection
    const interval = setInterval(() => {
      setIsConnected(true)
      setLastUpdate(new Date())
    }, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [])

  return { isConnected, lastUpdate }
}

// Live indicator component
export const LiveIndicator: React.FC = () => {
  const { isConnected, lastUpdate } = useRealTimeData()

  return (
    <div className="flex items-center gap-2 text-xs text-gray-500">
      <div className={`w-2 h-2 rounded-full ${
        isConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
      }`} />
      <span>
        {isConnected ? 'Live' : 'Offline'}
        {lastUpdate && ` • Updated ${lastUpdate.toLocaleTimeString()}`}
      </span>
    </div>
  )
}

export default NotificationCenter