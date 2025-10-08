'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Search, Package, TrendingUp, TrendingDown, DollarSign, Eye } from 'lucide-react'

interface Product {
  ProductID: number
  Name: string
  ProductNumber: string
  Color: string
  StandardCost: number
  ListPrice: number
  Size: string
  Weight: number
  ProductLine: string
  Class: string
  Style: string
  SubcategoryName: string
  CategoryName: string
  SellStartDate: string
  TotalSales: number
  TotalQuantity: number
  OrderCount: number
  AverageOrderValue: number
  ReorderPoint: number
  SafetyStockLevel: number
}

interface ProductListData {
  products: Product[]
  totalProducts: number
  totalValue: number
  averagePrice: number
  topCategory: string
  lowStockCount: number
}

export default function ProductListDashboard({ filters }: { filters?: any }) {
  const [data, setData] = useState<ProductListData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  const fetchProductList = async (filterParams?: any) => {
    try {
      setLoading(true)
      const queryParams = new URLSearchParams()
      
      // Add filter parameters to the query
      if (filterParams) {
        if (filterParams.dateRange && filterParams.dateRange !== 'all') {
          queryParams.append('dateRange', filterParams.dateRange)
        }
        if (filterParams.category && filterParams.category !== 'all') {
          queryParams.append('category', filterParams.category)
        }
      }
      
      queryParams.append('page', currentPage.toString())
      queryParams.append('limit', itemsPerPage.toString())
      queryParams.append('search', searchTerm)
      queryParams.append('category', categoryFilter)
      queryParams.append('sortBy', sortBy)
      
      const url = queryParams.toString() 
        ? `/api/dashboard/product-list?${queryParams.toString()}`
        : `/api/dashboard/product-list`
        
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error('Failed to fetch product list data')
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
    fetchProductList(filters)
  }, [filters, currentPage, searchTerm, categoryFilter, sortBy])

  const filteredProducts = data?.products || []
  const totalPages = Math.ceil((data?.totalProducts || 0) / itemsPerPage)

  const getStockStatus = (product: Product) => {
    if (product.TotalQuantity <= product.ReorderPoint) {
      return { status: 'Critical', color: 'destructive' as const }
    } else if (product.TotalQuantity <= product.SafetyStockLevel) {
      return { status: 'Low', color: 'secondary' as const }
    } else {
      return { status: 'In Stock', color: 'default' as const }
    }
  }

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
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-10 bg-gray-200 rounded"></div>
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
          <p className="text-red-600 mb-2">Error loading product data</p>
          <p className="text-gray-500 text-sm">{error}</p>
          <Button onClick={() => fetchProductList(filters)} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.totalProducts.toLocaleString()}</div>
            <p className="text-xs text-gray-500">Active SKUs</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${data?.totalValue.toLocaleString()}</div>
            <p className="text-xs text-gray-500">Inventory value</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Price</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${data?.averagePrice.toFixed(2)}</div>
            <p className="text-xs text-gray-500">Per unit</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Category</CardTitle>
            <Package className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.topCategory}</div>
            <p className="text-xs text-gray-500">By sales</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.lowStockCount}</div>
            <p className="text-xs text-gray-500">Need reorder</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Product Catalog</CardTitle>
          <CardDescription>Browse and manage your product inventory for {filters?.dateRange || '2014'}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="bikes">Bikes</SelectItem>
                <SelectItem value="components">Components</SelectItem>
                <SelectItem value="clothing">Clothing</SelectItem>
                <SelectItem value="accessories">Accessories</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="price">Price</SelectItem>
                <SelectItem value="sales">Sales</SelectItem>
                <SelectItem value="quantity">Quantity</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Product Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Sales</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => {
                  const stockStatus = getStockStatus(product)
                  return (
                    <TableRow key={product.ProductID}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{product.Name}</div>
                          <div className="text-sm text-gray-500">{product.ProductNumber}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{product.SubcategoryName}</div>
                          <div className="text-sm text-gray-500">{product.CategoryName}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">${product.ListPrice.toFixed(2)}</div>
                        <div className="text-sm text-gray-500">Cost: ${product.StandardCost.toFixed(2)}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{product.TotalQuantity}</div>
                        <div className="text-sm text-gray-500">Reorder at: {product.ReorderPoint}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">${product.TotalSales.toLocaleString()}</div>
                        <div className="text-sm text-gray-500">{product.OrderCount} orders</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={stockStatus.color}>{stockStatus.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-500">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, data?.totalProducts || 0)} of {data?.totalProducts} products
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}