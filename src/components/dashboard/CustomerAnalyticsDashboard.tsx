'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Users, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart,
  MapPin,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Activity
} from 'lucide-react'

interface CustomerSegment {
  SegmentID: string
  SegmentName: string
  CustomerCount: number
  TotalSales: number
  AverageOrderValue: number
  GrowthRate: number
  TopRegion: string
}

interface RegionalData {
  CountryRegionCode: string
  CountryName: string
  CustomerCount: number
  TotalSales: number
  AverageOrderValue: number
  GrowthRate: number
  TopCity: string
  TopCityCustomers: number
}

interface TopCustomer {
  CustomerID: number
  CustomerName: string
  TotalSales: number
  OrderCount: number
  AverageOrderValue: number
  Region: string
  City: string
  LastOrderDate: string
  CustomerType: string
}

interface CustomerAnalyticsResponse {
  segments: CustomerSegment[]
  regions: RegionalData[]
  topCustomers: TopCustomer[]
  totalCustomers: number
  totalSales: number
  averageOrderValue: number
  customerGrowthRate: number
  topRegion: string
  topSegment: string
}

export default function CustomerAnalyticsDashboard({ filters }: { filters?: any }) {
  const [data, setData] = useState<CustomerAnalyticsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('overview')

  const fetchCustomerAnalytics = async (filterParams?: any) => {
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
        ? `/api/dashboard/customer-analytics?${queryParams.toString()}`
        : `/api/dashboard/customer-analytics`
        
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error('Failed to fetch customer analytics data')
      }
      
      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCustomerAnalytics(filters)
  }, [filters])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-2">Error loading customer analytics data</p>
          <p className="text-gray-500 text-sm">{error}</p>
          <Button onClick={() => fetchCustomerAnalytics(filters)} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  const segments = data?.segments || []
  const regions = data?.regions || []
  const topCustomers = data?.topCustomers || []

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.totalCustomers.toLocaleString()}</div>
            <p className="text-xs text-gray-500 flex items-center mt-1">
              {(data?.customerGrowthRate || 0) >= 0 ? (
                <>
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  +{(data?.customerGrowthRate || 0).toFixed(1)}%
                </>
              ) : (
                <>
                  <ArrowDownRight className="h-3 w-3 mr-1" />
                  {(data?.customerGrowthRate || 0).toFixed(1)}%
                </>
              )}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${((data?.totalSales || 0) / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-gray-500">Customer revenue</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
            <ShoppingCart className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(data?.averageOrderValue || 0).toFixed(0)}</div>
            <p className="text-xs text-gray-500">Per transaction</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Region</CardTitle>
            <MapPin className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.topRegion}</div>
            <p className="text-xs text-gray-500">By customer count</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="segments">Segments</TabsTrigger>
          <TabsTrigger value="regions">Regions</TabsTrigger>
          <TabsTrigger value="top-customers">Top Customers</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Segments</CardTitle>
                <CardDescription>Performance by customer segment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {segments.slice(0, 4).map((segment) => (
                    <div key={segment.SegmentID} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{segment.SegmentName}</h4>
                        <Badge variant={segment.GrowthRate >= 0 ? "default" : "secondary"}>
                          {segment.GrowthRate >= 0 ? '+' : ''}{segment.GrowthRate.toFixed(1)}%
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Customers:</span>
                          <span className="ml-2 font-medium">{segment.CustomerCount.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Avg Order:</span>
                          <span className="ml-2 font-medium">${segment.AverageOrderValue.toFixed(0)}</span>
                        </div>
                      </div>
                      <Progress 
                        value={(segment.TotalSales / (data?.totalSales || 1)) * 100} 
                        className="h-2"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Regional Performance</CardTitle>
                <CardDescription>Customer distribution by region</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {regions.slice(0, 4).map((region) => (
                    <div key={region.CountryRegionCode} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{region.CountryName}</h4>
                        <Badge variant={region.GrowthRate >= 0 ? "default" : "secondary"}>
                          {region.GrowthRate >= 0 ? '+' : ''}{region.GrowthRate.toFixed(1)}%
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Customers:</span>
                          <span className="ml-2 font-medium">{region.CustomerCount.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Top City:</span>
                          <span className="ml-2 font-medium">{region.TopCity}</span>
                        </div>
                      </div>
                      <Progress 
                        value={(region.TotalSales / (data?.totalSales || 1)) * 100} 
                        className="h-2"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="segments" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {segments.map((segment) => (
              <Card key={segment.SegmentID}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{segment.SegmentName}</CardTitle>
                    <Badge variant={segment.GrowthRate >= 0 ? "default" : "secondary"}>
                      {segment.GrowthRate >= 0 ? (
                        <ArrowUpRight className="w-3 h-3 mr-1" />
                      ) : (
                        <ArrowDownRight className="w-3 h-3 mr-1" />
                      )}
                      {Math.abs(segment.GrowthRate).toFixed(1)}%
                    </Badge>
                  </div>
                  <CardDescription>
                    {segment.CustomerCount.toLocaleString()} customers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Total Sales</p>
                        <p className="text-xl font-bold">${(segment.TotalSales / 1000000).toFixed(1)}M</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Avg Order</p>
                        <p className="text-xl font-bold">${segment.AverageOrderValue.toFixed(0)}</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Top Region</p>
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{segment.TopRegion}</span>
                        <Target className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Sales Distribution</p>
                      <Progress 
                        value={(segment.TotalSales / (data?.totalSales || 1)) * 100} 
                        className="h-2"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {((segment.TotalSales / (data?.totalSales || 1)) * 100).toFixed(1)}% of total sales
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="regions" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {regions.map((region) => (
              <Card key={region.CountryRegionCode}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center">
                      <MapPin className="w-5 h-5 mr-2" />
                      {region.CountryName}
                    </CardTitle>
                    <Badge variant={region.GrowthRate >= 0 ? "default" : "secondary"}>
                      {region.GrowthRate >= 0 ? '+' : ''}{region.GrowthRate.toFixed(1)}%
                    </Badge>
                  </div>
                  <CardDescription>
                    {region.CustomerCount.toLocaleString()} customers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Total Sales</p>
                        <p className="text-xl font-bold">${(region.TotalSales / 1000000).toFixed(1)}M</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Avg Order</p>
                        <p className="text-xl font-bold">${region.AverageOrderValue.toFixed(0)}</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Top City</p>
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{region.TopCity}</span>
                        <span className="text-sm text-gray-500">
                          {region.TopCityCustomers.toLocaleString()} customers
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Sales Distribution</p>
                      <Progress 
                        value={(region.TotalSales / (data?.totalSales || 1)) * 100} 
                        className="h-2"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {((region.TotalSales / (data?.totalSales || 1)) * 100).toFixed(1)}% of total sales
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="top-customers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Customers by Revenue</CardTitle>
              <CardDescription>Highest-value customers and their performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topCustomers.map((customer, index) => (
                  <div key={customer.CustomerID} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-medium">{customer.CustomerName}</h4>
                          <p className="text-sm text-gray-500">
                            {customer.City}, {customer.Region} • {customer.CustomerType}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">${(customer.TotalSales / 1000).toFixed(0)}K</p>
                        <p className="text-sm text-gray-500">{customer.OrderCount} orders</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Avg Order:</span>
                        <span className="ml-2 font-medium">${customer.AverageOrderValue.toFixed(0)}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Last Order:</span>
                        <span className="ml-2 font-medium">{customer.LastOrderDate}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Customer Type:</span>
                        <span className="ml-2 font-medium">{customer.CustomerType}</span>
                      </div>
                      <div className="flex justify-end">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-1" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}