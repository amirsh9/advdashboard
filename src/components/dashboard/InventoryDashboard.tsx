"use client";

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Package, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  Warehouse,
  BarChart3,
  Activity,
  Search,
  Download,
  Filter,
  Truck,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw
} from 'lucide-react'

interface InventorySummary {
  ProductsWithInventory: number;
  TotalLocations: number;
  TotalQuantity: number;
  AverageQuantityPerLocation: number;
  LowStockItems: number;
  HighStockItems: number;
}

interface InventoryByLocation {
  LocationName: string;
  LocationID: number;
  ProductCount: number;
  TotalQuantity: number;
  AverageQuantity: number;
  LowStockCount: number;
}

interface LowInventoryItem {
  ProductName: string;
  ProductNumber: string;
  ListPrice: number;
  SafetyStockLevel: number;
  ReorderPoint: number;
  TotalQuantity: number;
  LocationCount: number;
  Locations?: string;
}

interface HighInventoryItem {
  ProductName: string;
  ProductNumber: string;
  ListPrice: number;
  SafetyStockLevel: number;
  ReorderPoint: number;
  TotalQuantity: number;
  LocationCount: number;
  InventoryValue: number;
}

interface InventoryByCategory {
  CategoryName: string;
  ProductCount: number;
  TotalQuantity: number;
  AverageQuantity: number;
  LowStockCount: number;
  TotalValue: number;
}

interface InventoryValueByLocation {
  LocationName: string;
  ProductCount: number;
  TotalQuantity: number;
  TotalValue: number;
  AverageValuePerProduct: number;
}

const InventoryDashboard: React.FC<{ filters?: any }> = ({ filters }) => {
  const [inventoryData, setInventoryData] = useState<any>(null);
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInventoryData = async (filterParams?: any) => {
    try {
      setIsLoading(true);
      const queryParams = new URLSearchParams();
      
      // Add filter parameters to the query
      if (filterParams) {
        if (filterParams.dateRange && filterParams.dateRange !== 'all') {
          queryParams.append('dateRange', filterParams.dateRange);
        }
        if (filterParams.category && filterParams.category !== 'all') {
          queryParams.append('category', filterParams.category);
        }
      }
      
      const url = queryParams.toString()
        ? `/api/dashboard/inventory?${queryParams.toString()}`
        : '/api/dashboard/inventory';
        
      const response = await fetch(url);
      const result = await response.json();
      
      if (result.success) {
        setInventoryData(result.data);
      } else {
        setError(result.message || 'Failed to fetch inventory data');
      }
    } catch (err) {
      setError('Error fetching inventory data');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInventoryData(filters);
  }, [filters]);

  const summary: InventorySummary = inventoryData?.summary || {};
  const inventoryByLocation: InventoryByLocation[] = inventoryData?.inventoryByLocation || [];
  const lowInventory: LowInventoryItem[] = inventoryData?.lowInventory || [];
  const highInventory: HighInventoryItem[] = inventoryData?.highInventory || [];
  const inventoryByCategory: InventoryByCategory[] = inventoryData?.inventoryByCategory || [];
  const inventoryValueByLocation: InventoryValueByLocation[] = inventoryData?.inventoryValueByLocation || [];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  };

  const getStatusColor = (quantity: number, safetyStock: number) => {
    if (quantity === 0) return 'text-red-600 bg-red-50';
    if (quantity < safetyStock) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  const getStatusIcon = (quantity: number, safetyStock: number) => {
    if (quantity === 0) return <XCircle className="h-4 w-4" />;
    if (quantity < safetyStock) return <AlertTriangle className="h-4 w-4" />;
    return <CheckCircle className="h-4 w-4" />;
  };

  const getStatusText = (quantity: number, safetyStock: number) => {
    if (quantity === 0) return 'out-of-stock';
    if (quantity < safetyStock) return 'low-stock';
    return 'in-stock';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <XCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <p className="text-destructive">{error}</p>
          <Button onClick={fetchInventoryData} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600 mt-1">Monitor stock levels, warehouse status, and inventory alerts</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchInventoryData} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* Alerts */}
      {(lowInventory.length > 0) && (
        <div className="space-y-2">
          <Alert className="border-yellow-200 bg-yellow-50">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              <strong>Warning:</strong> {lowInventory.length} items are running low and should be reordered soon
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products with Inventory</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.ProductsWithInventory?.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Across {summary.TotalLocations} locations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Quantity</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.TotalQuantity?.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {summary.AverageQuantityPerLocation?.toFixed(0)} avg per location
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{summary.LowStockItems}</div>
            <p className="text-xs text-muted-foreground">
              Items need reordering
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Stock</CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{summary.HighStockItems}</div>
            <p className="text-xs text-muted-foreground">
              Excess inventory
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Location</CardTitle>
            <Warehouse className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">
              {inventoryByLocation[0]?.LocationName || 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              {inventoryByLocation[0]?.TotalQuantity?.toLocaleString() || 0} items
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedLocation} onValueChange={setSelectedLocation}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="All Locations" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            {inventoryByLocation.map((location) => (
              <SelectItem key={location.LocationID} value={location.LocationID.toString()}>
                {location.LocationName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {inventoryByCategory.map((category) => (
              <SelectItem key={category.CategoryName} value={category.CategoryName}>
                {category.CategoryName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
          <TabsTrigger value="lowstock">Low Stock</TabsTrigger>
          <TabsTrigger value="highstock">High Stock</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Inventory by Location</CardTitle>
                <CardDescription>Product distribution across warehouse locations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {inventoryByLocation.slice(0, 5).map((location, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{location.LocationName}</p>
                        <p className="text-sm text-gray-600">
                          {location.ProductCount} products • {location.LowStockCount} low stock
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">{location.TotalQuantity.toLocaleString()}</p>
                        <p className="text-sm text-gray-500">
                          Avg: {location.AverageQuantity?.toFixed(0)} per product
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Inventory Value by Location</CardTitle>
                <CardDescription>Total inventory value by location</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {inventoryValueByLocation.slice(0, 5).map((location, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{location.LocationName}</p>
                        <p className="text-sm text-gray-600">
                          {location.ProductCount} products • {location.TotalQuantity.toLocaleString()} units
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600">
                          {formatCurrency(location.TotalValue)}
                        </p>
                        <p className="text-sm text-gray-500">
                          Avg: {formatCurrency(location.AverageValuePerProduct)} per product
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="locations" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {inventoryByLocation.map((location, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{location.LocationName}</CardTitle>
                      <CardDescription>Location ID: {location.LocationID}</CardDescription>
                    </div>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Warehouse className="h-3 w-3" />
                      Active
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Products</p>
                      <p className="text-lg font-semibold">{location.ProductCount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Quantity</p>
                      <p className="text-lg font-semibold">{location.TotalQuantity.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Average Quantity</span>
                      <span>{location.AverageQuantity?.toFixed(0)} units</span>
                    </div>
                    <Progress 
                      value={(location.AverageQuantity / 1000) * 100} 
                      className="h-2"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Low Stock</p>
                      <p className="font-medium text-yellow-600">{location.LowStockCount}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Utilization</p>
                      <p className="font-medium">
                        {((location.TotalQuantity / 10000) * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Activity className="h-4 w-4 mr-2" />
                        Details
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Reports
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="lowstock" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Low Stock Items</CardTitle>
              <CardDescription>Products that need immediate reordering</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lowInventory.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg border-yellow-200 bg-yellow-50">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                        <AlertTriangle className="w-4 h-4 text-yellow-600" />
                      </div>
                      <div>
                        <p className="font-medium">{item.ProductName}</p>
                        <p className="text-sm text-gray-600">{item.ProductNumber}</p>
                        <p className="text-xs text-gray-500">
                          Safety Stock: {item.SafetyStockLevel} • Reorder Point: {item.ReorderPoint}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-yellow-600">{item.TotalQuantity}</p>
                      <p className="text-sm text-gray-500">
                        {formatCurrency(item.ListPrice)}
                      </p>
                      <Button size="sm" className="mt-2">
                        <Truck className="h-4 w-4 mr-2" />
                        Reorder
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="highstock" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>High Stock Items</CardTitle>
              <CardDescription>Products with excess inventory levels</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {highInventory.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg border-blue-200 bg-blue-50">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Package className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{item.ProductName}</p>
                        <p className="text-sm text-gray-600">{item.ProductNumber}</p>
                        <p className="text-xs text-gray-500">
                          Safety Stock: {item.SafetyStockLevel} • {item.LocationCount} locations
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-blue-600">{item.TotalQuantity.toLocaleString()}</p>
                      <p className="text-sm text-gray-500">
                        Value: {formatCurrency(item.InventoryValue)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Inventory by Category</CardTitle>
              <CardDescription>Product distribution and inventory levels by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {inventoryByCategory.map((category, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{category.CategoryName}</p>
                      <p className="text-sm text-gray-600">
                        {category.ProductCount} products • {category.LowStockCount} low stock
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">{category.TotalQuantity.toLocaleString()}</p>
                      <p className="text-sm text-gray-500">
                        Value: {formatCurrency(category.TotalValue)} • Avg: {category.AverageQuantity?.toFixed(0)} units
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default InventoryDashboard;