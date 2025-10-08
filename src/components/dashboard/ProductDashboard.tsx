"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Package, 
  TrendingUp, 
  AlertTriangle, 
  DollarSign,
  RefreshCw,
  BarChart3,
  ShoppingCart
} from "lucide-react";

interface Product {
  ProductID: number;
  ProductName: string;
  ProductNumber: string;
  ListPrice: number;
  StandardCost: number;
  Color?: string;
  CategoryName?: string;
  SubcategoryName?: string;
}

interface ProductInventory {
  ProductName: string;
  ProductNumber: string;
  ListPrice: number;
  Quantity: number;
  LocationName: string;
  CategoryName?: string;
  SubcategoryName?: string;
}

interface ProductSales {
  ProductName: string;
  ProductNumber: string;
  TotalQuantitySold: number;
  TotalRevenue: number;
  OrderCount: number;
  AverageSellingPrice: number;
  CurrentListPrice: number;
}

interface ProductsByCategory {
  CategoryName: string;
  ProductCount: number;
  AveragePrice: number;
  TotalCost: number;
}

interface ProductSummary {
  TotalProducts: number;
  DiscontinuedProducts: number;
  ActiveProducts: number;
  Subcategories: number;
  Categories: number;
}

export default function ProductDashboard({ filters }: { filters?: any }) {
  const [productData, setProductData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProductData = async (filterParams?: any) => {
    try {
      setLoading(true);
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
        ? `/api/dashboard/products?${queryParams.toString()}`
        : '/api/dashboard/products';
        
      const response = await fetch(url);
      const result = await response.json();
      
      if (result.success) {
        setProductData(result.data);
      } else {
        setError(result.message || 'Failed to fetch product data');
      }
    } catch (err) {
      setError('Error fetching product data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductData(filters);
  }, [filters]);

  if (loading) {
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
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <p className="text-destructive">{error}</p>
          <Button onClick={fetchProductData} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const summary: ProductSummary = productData?.summary || {};
  const productsByCategory: ProductsByCategory[] = productData?.productsByCategory || [];
  const expensiveProducts: Product[] = productData?.expensiveProducts || [];
  const productInventory: ProductInventory[] = productData?.productInventory || [];
  const lowInventory: any[] = productData?.lowInventory || [];
  const productSales: ProductSales[] = productData?.productSales || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Product Dashboard</h2>
          <p className="text-muted-foreground">
            Monitor product performance, inventory, and sales metrics
          </p>
        </div>
        <Button onClick={fetchProductData} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.TotalProducts?.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {summary.ActiveProducts} active
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.Categories}</div>
            <p className="text-xs text-muted-foreground">
              {summary.Subcategories} subcategories
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Discontinued</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.DiscontinuedProducts}</div>
            <p className="text-xs text-muted-foreground">
              {((summary.DiscontinuedProducts / summary.TotalProducts) * 100).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lowInventory.length}</div>
            <p className="text-xs text-muted-foreground">
              Need attention
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Product Price</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${expensiveProducts[0]?.ListPrice?.toFixed(2) || '0.00'}
            </div>
            <p className="text-xs text-muted-foreground">
              {expensiveProducts[0]?.ProductName || 'N/A'}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="categories" className="space-y-4">
        <TabsList>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="expensive">Expensive Products</TabsTrigger>
          <TabsTrigger value="sales">Sales Performance</TabsTrigger>
          <TabsTrigger value="lowstock">Low Stock</TabsTrigger>
        </TabsList>
        
        <TabsContent value="categories" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {productsByCategory.map((category, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{category.CategoryName}</CardTitle>
                  <CardDescription>
                    {category.ProductCount} products
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Avg Price</span>
                      <span className="font-medium">
                        ${category.AveragePrice?.toFixed(2) || '0.00'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total Cost</span>
                      <span className="font-medium">
                        ${category.TotalCost?.toFixed(2) || '0.00'}
                      </span>
                    </div>
                    <Progress 
                      value={(category.ProductCount / summary.TotalProducts) * 100} 
                      className="mt-2"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Inventory Levels</CardTitle>
              <CardDescription>
                Current inventory levels across all locations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {productInventory.slice(0, 10).map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{item.ProductName}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.ProductNumber} • {item.LocationName}
                      </p>
                      {item.CategoryName && (
                        <Badge variant="outline" className="mt-1">
                          {item.CategoryName}
                        </Badge>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">{item.Quantity.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">
                        ${item.ListPrice?.toFixed(2) || '0.00'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="expensive" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Most Expensive Products</CardTitle>
              <CardDescription>
                Products with the highest list prices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {expensiveProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{product.ProductName}</p>
                      <p className="text-sm text-muted-foreground">
                        {product.ProductNumber}
                      </p>
                      {product.CategoryName && (
                        <Badge variant="outline" className="mt-1">
                          {product.CategoryName}
                        </Badge>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">
                        ${product.ListPrice?.toFixed(2) || '0.00'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Cost: ${product.StandardCost?.toFixed(2) || '0.00'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Sales Performance</CardTitle>
              <CardDescription>
                Top performing products by revenue
              </CardDescription>
            </CardHeader>
            <CardContent>
              {productSales.length > 0 ? (
                <div className="space-y-4">
                  {productSales.map((product, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{product.ProductName}</p>
                        <p className="text-sm text-muted-foreground">
                          {product.ProductNumber} • {product.OrderCount} orders
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600">
                          ${product.TotalRevenue?.toFixed(2) || '0.00'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {product.TotalQuantitySold} units sold
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No sales data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="lowstock" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Low Stock Alert</CardTitle>
              <CardDescription>
                Products with inventory below safety stock levels
              </CardDescription>
            </CardHeader>
            <CardContent>
              {lowInventory.length > 0 ? (
                <div className="space-y-4">
                  {lowInventory.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg border-red-200 bg-red-50">
                      <div className="flex-1">
                        <p className="font-medium text-red-800">{item.ProductName}</p>
                        <p className="text-sm text-red-600">
                          {item.ProductNumber} • {item.LocationCount} locations
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-red-600">
                          {item.TotalQuantity} units
                        </p>
                        <p className="text-sm text-red-600">
                          ${item.ListPrice?.toFixed(2) || '0.00'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <p className="text-green-600">All products have adequate inventory</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}