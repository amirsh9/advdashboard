'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ResponsiveContainer } from 'recharts'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import { Building2, TrendingUp, TrendingDown, DollarSign, Package, AlertCircle, CheckCircle, Clock, Star } from 'lucide-react'

interface VendorData {
  vendorID: number
  accountNumber: string
  name: string
  creditRating: string
  preferredVendorStatus: boolean
  activeFlag: boolean
  purchasingWebServiceURL: string
  orderCount: number
  totalOrderValue: number
  averageOrderValue: number
  lastOrderDate: string
  productCount: number
  onTimeDeliveryRate: number
}

interface VendorPerformance {
  vendorID: number
  vendorName: string
  orderCount: number
  totalAmount: number
  avgOrderValue: number
  onTimeDeliveryRate: number
  productQuality: number
  avgDeliveryTime: number
  growthRate: number
}

interface VendorCategory {
  category: string
  vendorCount: number
  totalOrders: number
  totalValue: number
  avgOrderValue: number
}

interface MonthlyVendorData {
  month: string
  vendorCount: number
  orderCount: number
  totalValue: number
  avgDeliveryTime: number
  onTimeRate: number
}

export default function VendorsDashboard({ filters }: { filters?: any }) {
  const [vendorData, setVendorData] = useState<VendorData[]>([])
  const [vendorPerformance, setVendorPerformance] = useState<VendorPerformance[]>([])
  const [vendorCategories, setVendorCategories] = useState<VendorCategory[]>([])
  const [monthlyData, setMonthlyData] = useState<MonthlyVendorData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchVendorData = async (filterParams?: any) => {
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
        ? `/api/dashboard/vendors?${queryParams.toString()}`
        : '/api/dashboard/vendors'
        
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error('Failed to fetch vendor data')
      }
      const data = await response.json()
      
      setVendorData(data.vendors || [])
      setVendorPerformance(data.topPerformers || [])
      setVendorCategories(data.categories || [])
      setMonthlyData(data.monthlyData || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVendorData(filters)
  }, [filters])

  const handleRefresh = () => {
    fetchVendorData(filters)
  }

  const getCreditRatingColor = (rating: string) => {
    const colors: { [key: string]: string } = {
      'A': 'bg-green-100 text-green-800',
      'B': 'bg-blue-100 text-blue-800',
      'C': 'bg-yellow-100 text-yellow-800',
      'D': 'bg-orange-100 text-orange-800',
      'E': 'bg-red-100 text-red-800'
    }
    return colors[rating] || 'bg-gray-100 text-gray-800'
  }

  const getPerformanceColor = (rate: number) => {
    if (rate >= 95) return 'text-green-600'
    if (rate >= 85) return 'text-yellow-600'
    return 'text-red-600'
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
  const totalVendors = vendorData.length
  const activeVendors = vendorData.filter(v => v.activeFlag).length
  const preferredVendors = vendorData.filter(v => v.preferredVendorStatus).length
  const avgOnTimeDelivery = vendorData.length > 0 
    ? vendorData.reduce((sum, v) => sum + v.onTimeDeliveryRate, 0) / vendorData.length 
    : 0

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Vendor Management</h2>
        <Button onClick={handleRefresh} variant="outline" size="sm">
          Refresh
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Vendors</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVendors}</div>
            <p className="text-xs text-muted-foreground">
              {activeVendors} active vendors
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Preferred Vendors</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{preferredVendors}</div>
            <p className="text-xs text-muted-foreground">
              {totalVendors > 0 ? ((preferredVendors / totalVendors) * 100).toFixed(1) : 0}% of total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg On-Time Delivery</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgOnTimeDelivery.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Performance metric
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {vendorData.reduce((sum, v) => sum + v.orderCount, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all vendors
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="vendors">Vendors</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Vendor Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={vendorCategories}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="vendorCount"
                    >
                      {vendorCategories.map((entry, index) => (
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
                <CardTitle>Monthly Vendor Activity</CardTitle>
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
                    <Line type="monotone" dataKey="onTimeRate" stroke="#82ca9d" name="On-Time %" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="vendors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Vendor Directory</CardTitle>
              <CardDescription>
                Complete list of all vendors and their status for {filters?.dateRange || '2014'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Credit Rating</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Total Value</TableHead>
                    <TableHead>On-Time Delivery</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vendorData.slice(0, 10).map((vendor) => (
                    <TableRow key={vendor.vendorID}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{vendor.name}</div>
                          <div className="text-sm text-muted-foreground">{vendor.accountNumber}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getCreditRatingColor(vendor.creditRating)}>
                          {vendor.creditRating}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          {vendor.activeFlag && <Badge variant="outline">Active</Badge>}
                          {vendor.preferredVendorStatus && <Badge variant="secondary">Preferred</Badge>}
                        </div>
                      </TableCell>
                      <TableCell>{vendor.orderCount}</TableCell>
                      <TableCell>${vendor.totalOrderValue.toLocaleString()}</TableCell>
                      <TableCell className={getPerformanceColor(vendor.onTimeDeliveryRate)}>
                        {vendor.onTimeDeliveryRate.toFixed(1)}%
                      </TableCell>
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

        <TabsContent value="performance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Vendors</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={vendorPerformance.slice(0, 5)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="vendorName" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="onTimeDeliveryRate" fill="#8884d8" name="On-Time %" />
                    <Bar dataKey="productQuality" fill="#82ca9d" name="Quality" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Vendor Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {vendorPerformance.slice(0, 5).map((vendor) => (
                    <div key={vendor.vendorID} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium">{vendor.vendorName}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{vendor.onTimeDeliveryRate.toFixed(1)}% on-time</Badge>
                        <Badge variant="secondary">{vendor.avgOrderValue.toLocaleString()} avg</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Category Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={vendorCategories}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="totalValue" fill="#8884d8" name="Total Value" />
                    <Bar dataKey="avgOrderValue" fill="#82ca9d" name="Avg Order" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Delivery Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="avgDeliveryTime" stroke="#ff7300" name="Avg Delivery Time" />
                    <Line type="monotone" dataKey="onTimeRate" stroke="#387908" name="On-Time Rate" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}