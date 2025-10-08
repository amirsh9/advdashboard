'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  DollarSign, 
  ShoppingCart, 
  TrendingUp, 
  Users, 
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Target
} from 'lucide-react'

interface SalesAnalyticsData {
  summary: {
    totalRevenue: number;
    totalOrders: number;
    averageOrderValue: number;
    totalCustomers: number;
  };
  monthlyTrend: Array<{
    month: string;
    revenue: number;
    orders: number;
    customers: number;
  }>;
  topProducts: Array<{
    productName: string;
    revenue: number;
    quantity: number;
    growth: number;
  }>;
  salesByRegion: Array<{
    region: string;
    revenue: number;
    orders: number;
    growth: number;
  }>;
  customerSegments: Array<{
    segment: string;
    customers: number;
    revenue: number;
    avgOrderValue: number;
  }>;
}

export default function SalesAnalyticsDashboard({ filters }: { filters?: any }) {
  const [data, setData] = useState<SalesAnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSalesAnalyticsData = async (filterParams?: any) => {
    try {
      setLoading(true)
      const queryParams = new URLSearchParams()
      
      // Add filter parameters to the query
      if (filterParams) {
        if (filterParams.dateRange && filterParams.dateRange !== 'all') {
          queryParams.append('dateRange', filterParams.dateRange)
        }
      }
      
      const url = queryParams.toString() 
        ? `/api/dashboard/sales-analytics?${queryParams.toString()}`
        : '/api/dashboard/sales-analytics'
        
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error('Failed to fetch sales analytics data')
      }
      
      const result = await response.json()
      if (result.success) {
        setData(result.data)
      } else {
        setError(result.message || 'Failed to fetch data')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSalesAnalyticsData(filters)
  }, [filters])

  const handleRefresh = () => {
    fetchSalesAnalyticsData(filters)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Sales Analytics</h1>
          <Button onClick={handleRefresh} disabled>
            Refreshing...
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Sales Analytics</h1>
          <Button onClick={handleRefresh}>Retry</Button>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              <p>Error loading data: {error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Sales Analytics</h1>
          <Button onClick={handleRefresh}>Refresh</Button>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p>No data available</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sales Analytics</h1>
          <p className="text-gray-600 mt-1">Comprehensive sales performance analysis for {filters?.dateRange || '2014'}</p>
        </div>
        <Button onClick={handleRefresh}>
          Refresh Data
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(data.summary.totalRevenue / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +12.5% from last period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(data.summary.totalOrders || 0).toLocaleString()}</div>
            <p className="text-xs text-blue-600 flex items-center mt-1">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +8.2% from last period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
            <Target className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(data.summary.averageOrderValue || 0).toFixed(0)}</div>
            <p className="text-xs text-purple-600 flex items-center mt-1">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +3.7% from last period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(data.summary.totalCustomers || 0).toLocaleString()}</div>
            <p className="text-xs text-orange-600 flex items-center mt-1">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +15.3% from last period
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Monthly Sales Trend
            </CardTitle>
            <CardDescription>Revenue performance for {filters?.dateRange || '2014'}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.monthlyTrend.map((month, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium w-12">{month.month}</span>
                    <div className="flex-1">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(month.revenue / Math.max(...data.monthlyTrend.map(m => m.revenue))) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">${(month.revenue / 1000000).toFixed(1)}M</p>
                    <p className="text-xs text-gray-500">{month.orders} orders</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
            <CardDescription>Best performing products by revenue in {filters?.dateRange || '2014'}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{product.productName}</p>
                      <p className="text-xs text-gray-500">{product.quantity} units sold</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">${(product.revenue / 1000).toFixed(0)}K</p>
                    <p className={`text-xs flex items-center justify-end ${
                      product.growth > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {product.growth > 0 ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                      {Math.abs(product.growth)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Regional Performance and Customer Segments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sales by Region</CardTitle>
            <CardDescription>Revenue distribution across regions for {filters?.dateRange || '2014'}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.salesByRegion.map((region, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{region.region}</span>
                    <span className="text-gray-600">${(region.revenue / 1000000).toFixed(1)}M</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${(region.revenue / Math.max(...data.salesByRegion.map(r => r.revenue))) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{region.orders} orders</span>
                    <span className={region.growth > 0 ? 'text-green-600' : 'text-red-600'}>
                      {region.growth > 0 ? '+' : ''}{region.growth}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customer Segments</CardTitle>
            <CardDescription>Performance by customer type for {filters?.dateRange || '2014'}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.customerSegments.map((segment, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{segment.segment}</h4>
                    <Badge variant="outline">{(segment.customers || 0).toLocaleString()} customers</Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Revenue:</span>
                      <span className="font-medium">${(segment.revenue / 1000000).toFixed(1)}M</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Avg Order:</span>
                      <span className="font-medium">${(segment.avgOrderValue || 0).toFixed(0)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}