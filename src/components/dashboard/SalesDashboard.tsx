"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  ShoppingCart,
  Package,
  Calendar,
  Globe,
  MapPin,
  Target,
  RefreshCw,
  BarChart3,
  Activity,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";

interface SalesSummary {
  TotalOrders: number;
  TotalRevenue: number;
  AverageOrderValue: number;
  TotalTax: number;
  TotalFreight: number;
  TotalCustomers: number;
  TotalSalesPeople: number;
}

interface MonthlySales {
  Year: number;
  Month: number;
  OrderCount: number;
  Revenue: number;
  AverageOrderValue: number;
}

interface TopCustomer {
  CustomerID: number;
  AccountNumber: string;
  CustomerName: string;
  OrderCount: number;
  TotalSpent: number;
  AverageOrderValue: number;
}

interface TopProduct {
  ProductID: number;
  ProductName: string;
  ProductNumber: string;
  TotalQuantity: number;
  TotalRevenue: number;
  OrderCount: number;
  AveragePrice: number;
}

interface SalesByTerritory {
  TerritoryID: number;
  TerritoryName: string;
  CountryRegionCode: string;
  Group: string;
  OrderCount: number;
  TotalRevenue: number;
  AverageOrderValue: number;
  CustomerCount: number;
}

interface RecentOrder {
  SalesOrderID: number;
  OrderDate: string;
  DueDate: string;
  ShipDate: string;
  Status: number;
  SubTotal: number;
  TaxAmt: number;
  Freight: number;
  TotalDue: number;
  AccountNumber: string;
  CustomerName: string;
  TerritoryName: string;
}

export default function SalesDashboard({ filters }: { filters?: any }) {
  const [salesData, setSalesData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSalesData = async (filterParams?: any) => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      
      // Add filter parameters to the query
      if (filterParams) {
        if (filterParams.dateRange && filterParams.dateRange !== 'all') {
          queryParams.append('dateRange', filterParams.dateRange);
        }
      }
      
      const url = queryParams.toString()
        ? `/api/dashboard/sales?${queryParams.toString()}`
        : '/api/dashboard/sales';
        
      const response = await fetch(url);
      const result = await response.json();
      
      if (result.success) {
        setSalesData(result.data);
      } else {
        setError(result.message || 'Failed to fetch sales data');
      }
    } catch (err) {
      setError('Error fetching sales data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalesData(filters);
  }, [filters]);

  const summary: SalesSummary = salesData?.summary || {};
  const monthlySales: MonthlySales[] = salesData?.monthlySales || [];
  const topCustomers: TopCustomer[] = salesData?.topCustomers || [];
  const topProducts: TopProduct[] = salesData?.topProducts || [];
  const salesByTerritory: SalesByTerritory[] = salesData?.salesByTerritory || [];
  const recentOrders: RecentOrder[] = salesData?.recentOrders || [];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  };

  const getStatusText = (status: number) => {
    switch (status) {
      case 1: return 'In Process';
      case 2: return 'Approved';
      case 3: return 'Backordered';
      case 4: return 'Rejected';
      case 5: return 'Shipped';
      case 6: return 'Cancelled';
      default: return 'Unknown';
    }
  };

  const getStatusColor = (status: number) => {
    switch (status) {
      case 1: return 'bg-yellow-100 text-yellow-800';
      case 2: return 'bg-blue-100 text-blue-800';
      case 3: return 'bg-orange-100 text-orange-800';
      case 4: return 'bg-red-100 text-red-800';
      case 5: return 'bg-green-100 text-green-800';
      case 6: return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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
          <Target className="h-12 w-12 text-destructive mx-auto mb-4" />
          <p className="text-destructive">{error}</p>
          <Button onClick={() => fetchSalesData(filters)} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Sales Dashboard</h2>
          <p className="text-muted-foreground">
            Monitor sales performance, customer metrics, and revenue trends
          </p>
        </div>
        <Button onClick={() => fetchSalesData(filters)} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.TotalOrders?.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {summary.TotalCustomers} customers
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(summary.TotalRevenue / 1000000).toFixed(1)}M
            </div>
            <p className="text-xs text-muted-foreground">
              ${summary.TotalTax?.toFixed(0)} tax
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${summary.AverageOrderValue?.toFixed(0) || '0'}
            </div>
            <p className="text-xs text-muted-foreground">
              Per transaction
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.TotalCustomers}</div>
            <p className="text-xs text-muted-foreground">
              Active accounts
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sales People</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.TotalSalesPeople}</div>
            <p className="text-xs text-muted-foreground">
              Active representatives
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Product</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">
              {topProducts[0]?.ProductName || 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              ${topProducts[0]?.TotalRevenue?.toFixed(0) || '0'}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="territories">Territories</TabsTrigger>
          <TabsTrigger value="orders">Recent Orders</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Sales Trend</CardTitle>
                <CardDescription>Sales performance over the last 12 months</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {monthlySales.slice(-6).map((month, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm font-medium">
                          {new Date(month.Year, month.Month - 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${(month.Revenue / 1000000) * 10}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium w-20 text-right">
                          {formatCurrency(month.Revenue)}
                        </span>
                        <span className="text-xs text-gray-500 w-16 text-right">
                          {month.OrderCount} orders
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Sales by Territory</CardTitle>
                <CardDescription>Revenue distribution across territories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {salesByTerritory.slice(0, 5).map((territory, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{territory.TerritoryName}</p>
                        <p className="text-sm text-muted-foreground">
                          {territory.CountryRegionCode} • {territory.CustomerCount} customers
                        </p>
                        <Badge variant="outline" className="mt-1">
                          {territory.Group}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600">
                          {formatCurrency(territory.TotalRevenue)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {territory.OrderCount} orders
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="customers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Customers by Revenue</CardTitle>
              <CardDescription>Customers with highest lifetime value</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topCustomers.map((customer, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{customer.CustomerName}</p>
                        <p className="text-sm text-muted-foreground">
                          {customer.AccountNumber} • {customer.OrderCount} orders
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">
                        {formatCurrency(customer.TotalSpent)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Avg: {formatCurrency(customer.AverageOrderValue)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Products by Revenue</CardTitle>
              <CardDescription>Products generating the most revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{product.ProductName}</p>
                        <p className="text-sm text-muted-foreground">
                          {product.ProductNumber} • {product.TotalQuantity.toLocaleString()} units
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">
                        {formatCurrency(product.TotalRevenue)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {product.OrderCount} orders • {formatCurrency(product.AveragePrice)} avg
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="territories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales by Territory</CardTitle>
              <CardDescription>Performance breakdown by sales territories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {salesByTerritory.map((territory, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{territory.TerritoryName}</p>
                      <p className="text-sm text-muted-foreground">
                        {territory.CountryRegionCode} • {territory.CustomerCount} customers
                      </p>
                      <Badge variant="outline" className="mt-1">
                        {territory.Group}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">
                        {formatCurrency(territory.TotalRevenue)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {territory.OrderCount} orders • {formatCurrency(territory.AverageOrderValue)} avg
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Sales Orders</CardTitle>
              <CardDescription>Latest sales transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <ShoppingCart className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">SO-{order.SalesOrderID}</p>
                        <p className="text-sm text-muted-foreground">
                          {order.CustomerName} • {order.AccountNumber}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {order.TerritoryName}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {new Date(order.OrderDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">
                        {formatCurrency(order.TotalDue)}
                      </p>
                      <Badge className={getStatusColor(order.Status)}>
                        {getStatusText(order.Status)}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">
                        Due: {new Date(order.DueDate).toLocaleDateString()}
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