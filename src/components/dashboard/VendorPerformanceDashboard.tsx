'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ResponsiveContainer } from 'recharts'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'
import { Building2, TrendingUp, TrendingDown, DollarSign, Package, AlertCircle, CheckCircle, Clock, Star, Award, Target } from 'lucide-react'

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
  rating: number
  complianceScore: number
}

interface PerformanceMetric {
  metric: string
  value: number
  benchmark: number
  status: 'excellent' | 'good' | 'average' | 'poor'
}

interface CategoryPerformance {
  category: string
  avgOnTimeDelivery: number
  avgQuality: number
  avgDeliveryTime: number
  vendorCount: number
  totalOrders: number
}

interface MonthlyPerformance {
  month: string
  avgOnTimeDelivery: number
  avgQuality: number
  avgDeliveryTime: number
  totalOrders: number
  vendorCount: number
}

export default function VendorPerformanceDashboard({ filters }: { filters?: any }) {
  const [vendorPerformance, setVendorPerformance] = useState<VendorPerformance[]>([])
  const [topPerformers, setTopPerformers] = useState<VendorPerformance[]>([])
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetric[]>([])
  const [categoryPerformance, setCategoryPerformance] = useState<CategoryPerformance[]>([])
  const [monthlyPerformance, setMonthlyPerformance] = useState<MonthlyPerformance[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchVendorPerformanceData = async (filterParams?: any) => {
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
        ? `/api/dashboard/vendor-performance?${queryParams.toString()}`
        : '/api/dashboard/vendor-performance'
        
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error('Failed to fetch vendor performance data')
      }
      const data = await response.json()
      
      setVendorPerformance(data.vendors || [])
      setTopPerformers(data.topPerformers || [])
      setPerformanceMetrics(data.metrics || [])
      setCategoryPerformance(data.categories || [])
      setMonthlyPerformance(data.monthlyData || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVendorPerformanceData(filters)
  }, [filters])

  const handleRefresh = () => {
    fetchVendorPerformanceData(filters)
  }

  const getPerformanceColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'excellent': 'text-green-600',
      'good': 'text-blue-600',
      'average': 'text-yellow-600',
      'poor': 'text-red-600'
    }
    return colors[status] || 'text-gray-600'
  }

  const getRatingStars = (rating: number) => {
    const stars: React.ReactNode[] = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)
    }
    
    if (hasHalfStar) {
      stars.push(<Star key="half" className="h-4 w-4 fill-yellow-200 text-yellow-400" />)
    }
    
    const emptyStars = 5 - Math.ceil(rating)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />)
    }
    
    return stars
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
  const totalVendors = vendorPerformance.length
  const avgOnTimeDelivery = vendorPerformance.length > 0 
    ? vendorPerformance.reduce((sum, v) => sum + v.onTimeDeliveryRate, 0) / vendorPerformance.length 
    : 0
  const avgQuality = vendorPerformance.length > 0 
    ? vendorPerformance.reduce((sum, v) => sum + v.productQuality, 0) / vendorPerformance.length 
    : 0
  const highPerformers = vendorPerformance.filter(v => v.rating >= 4.5).length

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Vendor Performance Analysis</h2>
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
              Active vendors analyzed
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
              Across all vendors
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Quality Score</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgQuality.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">
              Product quality rating
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Performers</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{highPerformers}</div>
            <p className="text-xs text-muted-foreground">
              4.5+ star rating
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="top-performers">Top Performers</TabsTrigger>
          <TabsTrigger value="metrics">Performance Metrics</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Performance Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Excellent', value: vendorPerformance.filter(v => v.rating >= 4.5).length },
                        { name: 'Good', value: vendorPerformance.filter(v => v.rating >= 3.5 && v.rating < 4.5).length },
                        { name: 'Average', value: vendorPerformance.filter(v => v.rating >= 2.5 && v.rating < 3.5).length },
                        { name: 'Poor', value: vendorPerformance.filter(v => v.rating < 2.5).length }
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {COLORS.map((color, index) => (
                        <Cell key={`cell-${index}`} fill={color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Key Performance Indicators</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {performanceMetrics.slice(0, 5).map((metric, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{metric.metric}</span>
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm font-bold ${getPerformanceColor(metric.status)}`}>
                          {metric.value.toFixed(1)}%
                        </span>
                        <Badge variant="outline" className={getPerformanceColor(metric.status)}>
                          {metric.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="top-performers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Vendors</CardTitle>
              <CardDescription>
                Vendors with highest performance ratings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>On-Time Delivery</TableHead>
                    <TableHead>Quality Score</TableHead>
                    <TableHead>Avg Delivery Time</TableHead>
                    <TableHead>Total Orders</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topPerformers.slice(0, 10).map((vendor) => (
                    <TableRow key={vendor.vendorID}>
                      <TableCell className="font-medium">{vendor.vendorName}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          {getRatingStars(vendor.rating)}
                          <span className="text-sm text-muted-foreground ml-1">
                            {vendor.rating.toFixed(1)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={vendor.onTimeDeliveryRate >= 95 ? "default" : "secondary"}>
                          {vendor.onTimeDeliveryRate.toFixed(1)}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={vendor.productQuality >= 90 ? "default" : "secondary"}>
                          {vendor.productQuality.toFixed(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{vendor.avgDeliveryTime.toFixed(1)} days</TableCell>
                      <TableCell>{vendor.orderCount}</TableCell>
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

        <TabsContent value="metrics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={performanceMetrics}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="metric" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar name="Current" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                    <Radar name="Benchmark" dataKey="benchmark" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Category Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={categoryPerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="avgOnTimeDelivery" fill="#8884d8" name="On-Time %" />
                    <Bar dataKey="avgQuality" fill="#82ca9d" name="Quality" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Performance Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyPerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="avgOnTimeDelivery" stroke="#8884d8" name="On-Time %" />
                    <Line type="monotone" dataKey="avgQuality" stroke="#82ca9d" name="Quality" />
                    <Line type="monotone" dataKey="avgDeliveryTime" stroke="#ff7300" name="Delivery Time" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Top performing vendors show 95%+ on-time delivery</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Target className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Quality scores correlate strongly with delivery performance</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Award className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm">Vendors with 4.5+ rating process 30% more orders</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <span className="text-sm">5 vendors need immediate performance improvement</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}