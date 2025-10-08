'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ResponsiveContainer } from 'recharts'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import { ShoppingCart, TrendingUp, TrendingDown, DollarSign, Package, AlertCircle, CheckCircle, Clock, Calendar, Truck } from 'lucide-react'

interface PurchaseOrder {
  purchaseOrderID: number
  vendorName: string
  orderDate: string
  shipDate: string
  status: string
  totalDue: number
  subTotal: number
  taxAmt: number
  freight: number
  orderQty: number
  receivedQty: number
  rejectedQty: number
  stockedQty: number
}

interface OrderStatus {
  status: string
  count: number
  totalValue: number
  percentage: number
}

interface MonthlyOrderData {
  month: string
  orderCount: number
  totalValue: number
  avgOrderValue: number
  onTimeDeliveryRate: number
}

interface VendorOrderData {
  vendorName: string
  orderCount: number
  totalValue: number
  avgOrderValue: number
  onTimeDeliveryRate: number
}

export default function PurchaseOrdersDashboard({ filters }: { filters?: any }) {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([])
  const [orderStatuses, setOrderStatuses] = useState<OrderStatus[]>([])
  const [monthlyData, setMonthlyData] = useState<MonthlyOrderData[]>([])
  const [vendorData, setVendorData] = useState<VendorOrderData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPurchaseOrdersData = async (filterParams?: any) => {
    try {
      setLoading(true)
      const queryParams = new URLSearchParams()
      
      // Add filter parameters to the query
      if (filterParams) {
        if (filterParams.dateRange && filterParams.dateRange !== 'all') {
          queryParams.append('dateRange', filterParams.dateRange)
        }
        if (filterParams.vendor && filterParams.vendor !== 'all') {
          queryParams.append('vendor', filterParams.vendor)
        }
        if (filterParams.status && filterParams.status !== 'all') {
          queryParams.append('status', filterParams.status)
        }
      }
      
      const url = queryParams.toString() 
        ? `/api/dashboard/purchase-orders?${queryParams.toString()}`
        : '/api/dashboard/purchase-orders'
        
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error('Failed to fetch purchase orders data')
      }
      const data = await response.json()
      
      setPurchaseOrders(data.orders || [])
      setOrderStatuses(data.statuses || [])
      setMonthlyData(data.monthlyData || [])
      setVendorData(data.vendorData || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPurchaseOrdersData(filters)
  }, [filters])

  const handleRefresh = () => {
    fetchPurchaseOrdersData(filters)
  }

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'Approved': 'bg-green-100 text-green-800',
      'Rejected': 'bg-red-100 text-red-800',
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Completed': 'bg-blue-100 text-blue-800',
      'Shipped': 'bg-purple-100 text-purple-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'Rejected':
        return <AlertCircle className="h-4 w-4 text-red-600" />
      case 'Pending':
        return <Clock className="h-4 w-4 text-yellow-600" />
      case 'Completed':
        return <Package className="h-4 w-4 text-blue-600" />
      case 'Shipped':
        return <Truck className="h-4 w-4 text-purple-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">{error}</div>
      </div>
    )
  }

  // Calculate summary statistics
  const totalOrders = purchaseOrders.length
  const totalValue = purchaseOrders.reduce((sum, order) => sum + order.totalDue, 0)
  const avgOrderValue = totalOrders > 0 ? totalValue / totalOrders : 0
  const completedOrders = purchaseOrders.filter(order => order.status === 'Completed').length
  const pendingOrders = purchaseOrders.filter(order => order.status === 'Pending').length

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Purchase Orders</h2>
        <Button onClick={handleRefresh} variant="outline" size="sm">
          Refresh
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {pendingOrders} pending
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              ${avgOrderValue.toFixed(2)} avg per order
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedOrders}</div>
            <p className="text-xs text-muted-foreground">
              {totalOrders > 0 ? ((completedOrders / totalOrders) * 100).toFixed(1) : 0}% completion rate
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${avgOrderValue.toFixed(0)}</div>
            <p className="text-xs text-muted-foreground">
              Per order average
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="vendors">Vendors</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Order Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={orderStatuses}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ status, percentage }) => `${status} ${percentage.toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {orderStatuses.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Order Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="orderCount" stroke="#8884d8" name="Orders" />
                    <Line type="monotone" dataKey="totalValue" stroke="#82ca9d" name="Value ($)" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Purchase Orders</CardTitle>
              <CardDescription>
                Latest purchase orders and their status for {filters?.dateRange || '2014'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Order Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Received</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {purchaseOrders.slice(0, 10).map((order) => (
                    <TableRow key={order.purchaseOrderID}>
                      <TableCell className="font-medium">{order.purchaseOrderID}</TableCell>
                      <TableCell>{order.vendorName}</TableCell>
                      <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(order.status)}
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>${order.totalDue.toLocaleString()}</TableCell>
                      <TableCell>{order.orderQty}</TableCell>
                      <TableCell>{order.receivedQty}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Order Value Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="totalValue" fill="#8884d8" name="Total Value" />
                    <Bar dataKey="avgOrderValue" fill="#82ca9d" name="Avg Order Value" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Delivery Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="onTimeDeliveryRate" stroke="#ff7300" name="On-Time Delivery %" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="vendors" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Top Vendors by Order Value</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={vendorData.slice(0, 5)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="vendorName" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="totalValue" fill="#8884d8" name="Total Value" />
                    <Bar dataKey="orderCount" fill="#82ca9d" name="Order Count" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Vendor Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {vendorData.slice(0, 5).map((vendor, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium">{vendor.vendorName}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{vendor.orderCount} orders</Badge>
                        <Badge variant="secondary">${vendor.avgOrderValue.toFixed(0)} avg</Badge>
                        <Badge variant="outline">{vendor.onTimeDeliveryRate.toFixed(1)}% on-time</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}