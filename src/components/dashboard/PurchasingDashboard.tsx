"use client";

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Truck,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Building,
  Package,
  Clock,
  CheckCircle,
  AlertTriangle,
  FileText,
  BarChart3,
  PieChart,
  Target,
  Activity,
  Calendar,
  Users,
  ShoppingCart,
  Star,
  Timer,
  CreditCard,
  Receipt,
  RefreshCw
} from 'lucide-react'

interface PurchasingSummary {
  TotalPurchaseOrders: number;
  PendingOrders: number;
  ApprovedOrders: number;
  RejectedOrders: number;
  CompletedOrders: number;
  TotalVendors: number;
  TotalBuyers: number;
  TotalPurchaseValue: number;
  AverageOrderValue: number;
}

interface VendorVolume {
  BusinessEntityID: number;
  VendorName: string;
  OrderCount: number;
  TotalPurchaseValue: number;
  AverageOrderValue: number;
  LastOrderDate: string;
}

interface MonthlyPurchasing {
  Year: number;
  Month: number;
  OrderCount: number;
  TotalValue: number;
  AverageOrderValue: number;
}

interface PendingOrder {
  PurchaseOrderID: number;
  OrderDate: string;
  ShipDate: string;
  Status: number;
  TotalDue: number;
  VendorName: string;
  EmployeeName: string;
  ItemCount: number;
}

interface MostOrderedProduct {
  ProductID: number;
  ProductName: string;
  ProductNumber: string;
  StandardCost: number;
  OrderFrequency: number;
  TotalQuantity: number;
  TotalCost: number;
  AverageUnitPrice: number;
}

interface PurchasingByEmployee {
  BusinessEntityID: number;
  EmployeeName: string;
  JobTitle: string;
  OrderCount: number;
  TotalPurchaseValue: number;
  AverageOrderValue: number;
  VendorCount: number;
}

export default function PurchasingDashboard({ filters }: { filters?: any }) {
  const [purchasingData, setPurchasingData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPurchasingData = async (filterParams?: any) => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      
      // Add filter parameters to the query
      if (filterParams) {
        if (filterParams.dateRange && filterParams.dateRange !== 'all') {
          queryParams.append('dateRange', filterParams.dateRange);
        }
        if (filterParams.vendor && filterParams.vendor !== 'all') {
          queryParams.append('vendor', filterParams.vendor);
        }
      }
      
      const url = queryParams.toString()
        ? `/api/dashboard/purchasing?${queryParams.toString()}`
        : '/api/dashboard/purchasing';
        
      const response = await fetch(url);
      const result = await response.json();
      
      if (result.success) {
        setPurchasingData(result.data);
      } else {
        setError(result.message || 'Failed to fetch purchasing data');
      }
    } catch (err) {
      setError('Error fetching purchasing data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchasingData(filters);
  }, [filters]);

  const summary: PurchasingSummary = purchasingData?.summary || {};
  const vendorsByVolume: VendorVolume[] = purchasingData?.vendorsByVolume || [];
  const monthlyPurchasing: MonthlyPurchasing[] = purchasingData?.monthlyPurchasing || [];
  const pendingOrders: PendingOrder[] = purchasingData?.pendingOrders || [];
  const mostOrderedProducts: MostOrderedProduct[] = purchasingData?.mostOrderedProducts || [];
  const purchasingByEmployee: PurchasingByEmployee[] = purchasingData?.purchasingByEmployee || [];

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
      case 1: return 'Pending';
      case 2: return 'Approved';
      case 3: return 'Rejected';
      case 4: return 'Completed';
      default: return 'Unknown';
    }
  };

  const getStatusColor = (status: number) => {
    switch (status) {
      case 1: return 'bg-yellow-100 text-yellow-800';
      case 2: return 'bg-blue-100 text-blue-800';
      case 3: return 'bg-red-100 text-red-800';
      case 4: return 'bg-green-100 text-green-800';
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
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <p className="text-destructive">{error}</p>
          <Button onClick={fetchPurchasingData} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Purchasing & Procurement Dashboard</h1>
          <p className="text-gray-600 mt-1">Complete vendor management and procurement analysis</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button onClick={fetchPurchasingData} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button size="sm">
            <ShoppingCart className="h-4 w-4 mr-2" />
            New Order
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Purchase Orders
            </CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.TotalPurchaseOrders?.toLocaleString()}</div>
            <p className="text-xs text-green-600 mt-1">
              {summary.CompletedOrders} completed
            </p>
            <p className="text-xs text-gray-500 mt-1">Total orders placed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Active Vendors
            </CardTitle>
            <Building className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.TotalVendors}</div>
            <p className="text-xs text-gray-500 mt-1">
              {summary.TotalBuyers} buyers
            </p>
            <p className="text-xs text-gray-500 mt-1">Registered suppliers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Spend
            </CardTitle>
            <DollarSign className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(summary.TotalPurchaseValue / 1000000).toFixed(1)}M
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Avg: {formatCurrency(summary.AverageOrderValue)} per order
            </p>
            <p className="text-xs text-gray-500 mt-1">Annual purchasing volume</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Pending Orders
            </CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{summary.PendingOrders}</div>
            <p className="text-xs text-gray-500 mt-1">
              {summary.ApprovedOrders} approved
            </p>
            <p className="text-xs text-gray-500 mt-1">Awaiting processing</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="vendors">Vendors</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="buyers">Buyers</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Top Vendors and Recent Orders */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="w-5 h-5 mr-2" />
                  Top Vendors by Spend
                </CardTitle>
                <CardDescription>Highest-value supplier relationships</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {vendorsByVolume.slice(0, 5).map((vendor, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{vendor.VendorName}</p>
                          <p className="text-sm text-gray-600">{vendor.OrderCount} orders</p>
                          <p className="text-xs text-gray-500">
                            Last: {new Date(vendor.LastOrderDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(vendor.TotalPurchaseValue)}</p>
                        <p className="text-sm text-green-600">
                          Avg: {formatCurrency(vendor.AverageOrderValue)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Pending Purchase Orders
                </CardTitle>
                <CardDescription>Orders requiring attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingOrders.slice(0, 5).map((order, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-yellow-100 rounded flex items-center justify-center">
                          <FileText className="w-4 h-4 text-yellow-600" />
                        </div>
                        <div>
                          <p className="font-medium">PO-{order.PurchaseOrderID}</p>
                          <p className="text-sm text-gray-600">{order.VendorName}</p>
                          <p className="text-xs text-gray-500">
                            {order.EmployeeName} • {order.ItemCount} items
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(order.TotalDue)}</p>
                        <Badge className={getStatusColor(order.Status)}>
                          {getStatusText(order.Status)}
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(order.OrderDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Monthly Purchasing Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Monthly Purchasing Trend
              </CardTitle>
              <CardDescription>Purchasing volume over the last 12 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {monthlyPurchasing.slice(-6).map((month, index) => (
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
                          style={{ width: `${(month.TotalValue / 1000000) * 10}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-20 text-right">
                        {formatCurrency(month.TotalValue)}
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
        </TabsContent>

        <TabsContent value="vendors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Vendor Performance Analysis</CardTitle>
              <CardDescription>Top vendors by purchase volume and value</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {vendorsByVolume.map((vendor, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-medium">{vendor.VendorName}</h3>
                        <p className="text-sm text-gray-600">
                          Vendor ID: {vendor.BusinessEntityID}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">{formatCurrency(vendor.TotalPurchaseValue)}</p>
                        <p className="text-sm text-gray-500">
                          {vendor.OrderCount} orders
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Average Order</p>
                        <p className="font-medium">{formatCurrency(vendor.AverageOrderValue)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Order Frequency</p>
                        <p className="font-medium">{vendor.OrderCount} orders</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Last Order</p>
                        <p className="font-medium">
                          {new Date(vendor.LastOrderDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Status</p>
                        <Badge variant="default" className="mt-1">
                          Active
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Purchase Order Management</CardTitle>
              <CardDescription>Complete order tracking and management</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingOrders.map((order, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-6 h-6 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">PO-{order.PurchaseOrderID}</h3>
                        <p className="text-sm text-gray-600">{order.VendorName}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-sm text-gray-500">
                            Order: {new Date(order.OrderDate).toLocaleDateString()}
                          </span>
                          <span className="text-sm text-gray-500">
                            Ship: {order.ShipDate ? new Date(order.ShipDate).toLocaleDateString() : 'Not set'}
                          </span>
                          <span className="text-sm text-gray-500">
                            Buyer: {order.EmployeeName}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(order.TotalDue)}</p>
                      <Badge className={getStatusColor(order.Status)}>
                        {getStatusText(order.Status)}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">
                        {order.ItemCount} items
                      </p>
                      <div className="mt-2 space-x-2">
                        <Button size="sm" variant="outline">Track</Button>
                        <Button size="sm" variant="outline">Edit</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Most Ordered Products</CardTitle>
              <CardDescription>Products with highest purchase frequency and volume</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mostOrderedProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{product.ProductName}</p>
                        <p className="text-sm text-gray-600">{product.ProductNumber}</p>
                        <p className="text-xs text-gray-500">
                          {product.OrderFrequency} orders • {product.TotalQuantity.toLocaleString()} units
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">{formatCurrency(product.TotalCost)}</p>
                      <p className="text-sm text-gray-500">
                        Avg: {formatCurrency(product.AverageUnitPrice)} per unit
                      </p>
                      <p className="text-xs text-gray-500">
                        Cost: {formatCurrency(product.StandardCost)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="buyers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Purchasing by Employee</CardTitle>
              <CardDescription>Purchase activity by procurement team members</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {purchasingByEmployee.map((employee, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{employee.EmployeeName}</p>
                        <p className="text-sm text-gray-600">{employee.JobTitle}</p>
                        <p className="text-xs text-gray-500">
                          {employee.OrderCount} orders • {employee.VendorCount} vendors
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">{formatCurrency(employee.TotalPurchaseValue)}</p>
                      <p className="text-sm text-gray-500">
                        Avg: {formatCurrency(employee.AverageOrderValue)} per order
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