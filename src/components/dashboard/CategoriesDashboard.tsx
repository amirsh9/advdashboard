'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  TrendingDown, 
  Package, 
  DollarSign, 
  ShoppingCart,
  Eye,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'

interface CategoryData {
  ProductCategoryID: number
  Name: string
  TotalProducts: number
  TotalSales: number
  TotalQuantity: number
  OrderCount: number
  AveragePrice: number
  GrowthRate: number
  TopProduct: string
  TopProductSales: number
  Subcategories: SubcategoryData[]
}

interface SubcategoryData {
  ProductSubcategoryID: number
  Name: string
  TotalProducts: number
  TotalSales: number
  TotalQuantity: number
  OrderCount: number
  AveragePrice: number
  GrowthRate: number
}

interface CategoriesResponse {
  categories: CategoryData[]
  totalCategories: number
  totalProducts: number
  totalSales: number
  topCategory: string
  averageGrowthRate: number
}

export default function CategoriesDashboard({ filters }: { filters?: any }) {
  const [data, setData] = useState<CategoriesResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('overview')

  const fetchCategoriesData = async (filterParams?: any) => {
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
        ? `/api/dashboard/categories?${queryParams.toString()}`
        : `/api/dashboard/categories`
        
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error('Failed to fetch categories data')
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
    fetchCategoriesData(filters)
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
          <p className="text-red-600 mb-2">Error loading categories data</p>
          <p className="text-gray-500 text-sm">{error}</p>
          <Button onClick={() => fetchCategoriesData(filters)} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  const categories = data?.categories || []

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Categories</CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.totalCategories}</div>
            <p className="text-xs text-gray-500">Product categories</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <ShoppingCart className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.totalProducts.toLocaleString()}</div>
            <p className="text-xs text-gray-500">Across all categories</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${((data?.totalSales || 0) / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-gray-500">Category revenue</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Growth</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.averageGrowthRate.toFixed(1)}%</div>
            <p className="text-xs text-gray-500">Year over year</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="subcategories">Subcategories</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {categories.map((category) => (
              <Card key={category.ProductCategoryID}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{category.Name}</CardTitle>
                    <Badge variant={category.GrowthRate >= 0 ? "default" : "secondary"}>
                      {category.GrowthRate >= 0 ? (
                        <ArrowUpRight className="w-3 h-3 mr-1" />
                      ) : (
                        <ArrowDownRight className="w-3 h-3 mr-1" />
                      )}
                      {Math.abs(category.GrowthRate).toFixed(1)}%
                    </Badge>
                  </div>
                  <CardDescription>
                    {category.TotalProducts} products • {category.Subcategories.length} subcategories
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Total Sales</p>
                        <p className="text-xl font-bold">${(category.TotalSales / 1000000).toFixed(1)}M</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Orders</p>
                        <p className="text-xl font-bold">{category.OrderCount.toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Top Product</p>
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{category.TopProduct}</span>
                        <span className="text-sm text-gray-500">
                          ${(category.TopProductSales / 1000).toFixed(0)}K
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Sales Distribution</p>
                      <Progress 
                        value={(category.TotalSales / (data?.totalSales || 1)) * 100} 
                        className="h-2"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {((category.TotalSales / (data?.totalSales || 1)) * 100).toFixed(1)}% of total sales
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Category Performance Comparison</CardTitle>
              <CardDescription>Sales and growth metrics by category for {filters?.dateRange || '2014'}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {categories.map((category) => (
                  <div key={category.ProductCategoryID} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{category.Name}</h4>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">
                          ${(category.TotalSales / 1000000).toFixed(1)}M
                        </span>
                        <Badge variant={category.GrowthRate >= 0 ? "default" : "secondary"}>
                          {category.GrowthRate >= 0 ? '+' : ''}{category.GrowthRate.toFixed(1)}%
                        </Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Products:</span>
                        <span className="ml-2 font-medium">{category.TotalProducts}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Avg Price:</span>
                        <span className="ml-2 font-medium">${category.AveragePrice.toFixed(0)}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Orders:</span>
                        <span className="ml-2 font-medium">{category.OrderCount.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Quantity:</span>
                        <span className="ml-2 font-medium">{category.TotalQuantity.toLocaleString()}</span>
                      </div>
                    </div>
                    <Progress 
                      value={(category.TotalSales / (data?.totalSales || 1)) * 100} 
                      className="h-2"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="subcategories" className="space-y-6">
          {categories.map((category) => (
            <Card key={category.ProductCategoryID}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="w-5 h-5 mr-2" />
                  {category.Name} Subcategories
                </CardTitle>
                <CardDescription>
                  Performance breakdown by subcategory for {filters?.dateRange || '2014'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {category.Subcategories.map((subcategory) => (
                    <div key={subcategory.ProductSubcategoryID} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{subcategory.Name}</h4>
                        <div className="flex items-center space-x-2">
                          <Badge variant={subcategory.GrowthRate >= 0 ? "default" : "secondary"}>
                            {subcategory.GrowthRate >= 0 ? '+' : ''}{subcategory.GrowthRate.toFixed(1)}%
                          </Badge>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Products:</span>
                          <span className="ml-2 font-medium">{subcategory.TotalProducts}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Sales:</span>
                          <span className="ml-2 font-medium">
                            ${(subcategory.TotalSales / 1000).toFixed(0)}K
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Orders:</span>
                          <span className="ml-2 font-medium">{subcategory.OrderCount}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Avg Price:</span>
                          <span className="ml-2 font-medium">
                            ${subcategory.AveragePrice.toFixed(0)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}