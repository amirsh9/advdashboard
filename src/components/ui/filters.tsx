'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Calendar,
  Filter,
  Download,
  RefreshCw,
  X,
  ChevronDown,
  MapPin,
  Building,
  Users,
  Package,
  DollarSign
} from 'lucide-react'

interface FilterProps {
  onFiltersChange: (filters: any) => void
  dashboardType: string
  initialFilters?: any
}

export function DashboardFilters({ onFiltersChange, dashboardType, initialFilters }: FilterProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  
  const defaultFilters = {
    dateRange: '2014',
    department: 'all',
    territory: 'all',
    category: 'all',
    vendor: 'all',
    status: 'all'
  }
  
  const [activeFilters, setActiveFilters] = useState({
    ...defaultFilters,
    ...initialFilters
  })
  const [tempFilters, setTempFilters] = useState({
    ...defaultFilters,
    ...initialFilters
  })
  
  // Update tempFilters when initialFilters change
  useEffect(() => {
    if (initialFilters) {
      const newFilters = { ...defaultFilters, ...initialFilters }
      setTempFilters(newFilters)
      setActiveFilters(newFilters)
    }
  }, [initialFilters])

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...tempFilters, [key]: value }
    setTempFilters(newFilters)
    // Apply filters automatically when changed
    setActiveFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const applyFilters = () => {
    console.log('applyFilters called with:', tempFilters)
    setActiveFilters(tempFilters)
    onFiltersChange(tempFilters)
  }

  const clearFilters = () => {
    setActiveFilters(defaultFilters)
    setTempFilters(defaultFilters)
    onFiltersChange(defaultFilters)
  }

  const getActiveFiltersCount = () => {
    return Object.values(activeFilters).filter(value => value !== 'all').length
  }

  const renderFilterContent = () => {
    switch (dashboardType) {
      case 'sales':
      case 'sales-analytics':
      case 'orders':
      case 'customers':
      case 'territories':
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Date Range</label>
                <Select value={tempFilters.dateRange} onValueChange={(value) => handleFilterChange('dateRange', value)}>
                  <SelectTrigger>
                    <Calendar className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2014">Year 2014</SelectItem>
                    <SelectItem value="2013">Year 2013</SelectItem>
                    <SelectItem value="2012">Year 2012</SelectItem>
                    <SelectItem value="2011">Year 2011</SelectItem>
                    <SelectItem value="2011-2014">2011-2014 (All)</SelectItem>
                    <SelectItem value="q4-2014">Q4 2014</SelectItem>
                    <SelectItem value="q3-2014">Q3 2014</SelectItem>
                    <SelectItem value="q2-2014">Q2 2014</SelectItem>
                    <SelectItem value="q1-2014">Q1 2014</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Territory</label>
                <Select value={tempFilters.territory} onValueChange={(value) => handleFilterChange('territory', value)}>
                  <SelectTrigger>
                    <MapPin className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="All territories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Territories</SelectItem>
                    <SelectItem value="north-america">North America</SelectItem>
                    <SelectItem value="europe">Europe</SelectItem>
                    <SelectItem value="asia">Asia</SelectItem>
                    <SelectItem value="south-america">South America</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Order Status</label>
                <Select value={tempFilters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                  <SelectTrigger>
                    <Package className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Customer Type</label>
                <Select value={tempFilters.category} onValueChange={(value) => handleFilterChange('category', value)}>
                  <SelectTrigger>
                    <Users className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="All types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Customers</SelectItem>
                    <SelectItem value="individual">Individual</SelectItem>
                    <SelectItem value="store">Store</SelectItem>
                    <SelectItem value="vip">VIP Customers</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </>
        )

      case 'finance':
      case 'revenue-analytics':
      case 'expense-management':
      case 'budget-vs-actual':
      case 'financial-reports':
      case 'cash-flow':
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Fiscal Year</label>
                <Select value={tempFilters.dateRange} onValueChange={(value) => handleFilterChange('dateRange', value)}>
                  <SelectTrigger>
                    <Calendar className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2014">Fiscal Year 2014</SelectItem>
                    <SelectItem value="2013">Fiscal Year 2013</SelectItem>
                    <SelectItem value="2012">Fiscal Year 2012</SelectItem>
                    <SelectItem value="2011">Fiscal Year 2011</SelectItem>
                    <SelectItem value="2011-2014">All Years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Department</label>
                <Select value={tempFilters.department} onValueChange={(value) => handleFilterChange('department', value)}>
                  <SelectTrigger>
                    <Building className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="All departments" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="engineering">Engineering</SelectItem>
                    <SelectItem value="operations">Operations</SelectItem>
                    <SelectItem value="hr">Human Resources</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Report Type</label>
                <Select value={tempFilters.category} onValueChange={(value) => handleFilterChange('category', value)}>
                  <SelectTrigger>
                    <DollarSign className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="All types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Reports</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Budget Status</label>
                <Select value={tempFilters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                  <SelectTrigger>
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="on-track">On Track</SelectItem>
                    <SelectItem value="over-budget">Over Budget</SelectItem>
                    <SelectItem value="under-budget">Under Budget</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </>
        )

      case 'human-resources':
      case 'employees':
      case 'employee-list':
      case 'departments':
      case 'candidates':
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Date Range</label>
                <Select value={tempFilters.dateRange} onValueChange={(value) => handleFilterChange('dateRange', value)}>
                  <SelectTrigger>
                    <Calendar className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2014">Year 2014</SelectItem>
                    <SelectItem value="2013">Year 2013</SelectItem>
                    <SelectItem value="2012">Year 2012</SelectItem>
                    <SelectItem value="2011">Year 2011</SelectItem>
                    <SelectItem value="2011-2014">All Years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Department</label>
                <Select value={tempFilters.department} onValueChange={(value) => handleFilterChange('department', value)}>
                  <SelectTrigger>
                    <Building className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="All departments" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="engineering">Engineering</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="operations">Operations</SelectItem>
                    <SelectItem value="hr">Human Resources</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Employee Status</label>
                <Select value={tempFilters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                  <SelectTrigger>
                    <Users className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Employees</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="on-leave">On Leave</SelectItem>
                    <SelectItem value="terminated">Terminated</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Job Title</label>
                <Select value={tempFilters.category} onValueChange={(value) => handleFilterChange('category', value)}>
                  <SelectTrigger>
                    <Package className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="All titles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Job Titles</SelectItem>
                    <SelectItem value="management">Management</SelectItem>
                    <SelectItem value="engineering">Engineering</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="support">Support</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </>
        )

      case 'products':
      case 'product-list':
      case 'inventory':
      case 'categories':
      case 'vendors':
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Date Range</label>
                <Select value={tempFilters.dateRange} onValueChange={(value) => handleFilterChange('dateRange', value)}>
                  <SelectTrigger>
                    <Calendar className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2014">Year 2014</SelectItem>
                    <SelectItem value="2013">Year 2013</SelectItem>
                    <SelectItem value="2012">Year 2012</SelectItem>
                    <SelectItem value="2011">Year 2011</SelectItem>
                    <SelectItem value="2011-2014">All Years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Product Category</label>
                <Select value={tempFilters.category} onValueChange={(value) => handleFilterChange('category', value)}>
                  <SelectTrigger>
                    <Package className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="bikes">Bikes</SelectItem>
                    <SelectItem value="components">Components</SelectItem>
                    <SelectItem value="clothing">Clothing</SelectItem>
                    <SelectItem value="accessories">Accessories</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Inventory Status</label>
                <Select value={tempFilters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                  <SelectTrigger>
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="in-stock">In Stock</SelectItem>
                    <SelectItem value="low-stock">Low Stock</SelectItem>
                    <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                    <SelectItem value="discontinued">Discontinued</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Price Range</label>
                <Select value={tempFilters.vendor} onValueChange={(value) => handleFilterChange('vendor', value)}>
                  <SelectTrigger>
                    <DollarSign className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="All prices" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Prices</SelectItem>
                    <SelectItem value="0-100">$0 - $100</SelectItem>
                    <SelectItem value="100-500">$100 - $500</SelectItem>
                    <SelectItem value="500-1000">$500 - $1,000</SelectItem>
                    <SelectItem value="1000+">$1,000+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </>
        )

      case 'purchasing':
      case 'vendors':
      case 'purchase-orders':
      case 'vendor-performance':
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Date Range</label>
                <Select value={tempFilters.dateRange} onValueChange={(value) => handleFilterChange('dateRange', value)}>
                  <SelectTrigger>
                    <Calendar className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2014">Year 2014</SelectItem>
                    <SelectItem value="2013">Year 2013</SelectItem>
                    <SelectItem value="2012">Year 2012</SelectItem>
                    <SelectItem value="2011">Year 2011</SelectItem>
                    <SelectItem value="2011-2014">All Years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Vendor</label>
                <Select value={tempFilters.vendor} onValueChange={(value) => handleFilterChange('vendor', value)}>
                  <SelectTrigger>
                    <Building className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="All vendors" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Vendors</SelectItem>
                    <SelectItem value="contoso">Contoso Ltd</SelectItem>
                    <SelectItem value="fabrikam">Fabrikam Inc</SelectItem>
                    <SelectItem value="litware">Litware Corp</SelectItem>
                    <SelectItem value="adventure">Adventure Works</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Order Status</label>
                <Select value={tempFilters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                  <SelectTrigger>
                    <Package className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="received">Received</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Vendor Rating</label>
                <Select value={tempFilters.category} onValueChange={(value) => handleFilterChange('category', value)}>
                  <SelectTrigger>
                    <Users className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="All ratings" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Ratings</SelectItem>
                    <SelectItem value="5">5 Stars</SelectItem>
                    <SelectItem value="4">4+ Stars</SelectItem>
                    <SelectItem value="3">3+ Stars</SelectItem>
                    <SelectItem value="2">2+ Stars</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </>
        )

      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Date Range</label>
              <Select value={tempFilters.dateRange} onValueChange={(value) => handleFilterChange('dateRange', value)}>
                <SelectTrigger>
                  <Calendar className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2014">Year 2014</SelectItem>
                  <SelectItem value="2013">Year 2013</SelectItem>
                  <SelectItem value="2012">Year 2012</SelectItem>
                  <SelectItem value="2011">Year 2011</SelectItem>
                  <SelectItem value="2011-2014">2011-2014 (All)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )
    }
  }

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4" />
            <CardTitle className="text-lg">Filters</CardTitle>
            {getActiveFiltersCount() > 0 && (
              <Badge variant="secondary">
                {getActiveFiltersCount()} active
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              disabled={getActiveFiltersCount() === 0}
            >
              <X className="w-4 h-4 mr-1" />
              Clear
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4 rotate-180" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      {isExpanded && (
        <CardContent className="pt-0">
          {renderFilterContent()}
          <div className="flex items-center justify-end space-x-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={applyFilters}
            >
              <Filter className="w-4 h-4 mr-2" />
              Apply Filters
            </Button>
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Data
            </Button>
            <Button size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  )
}