'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  Download, 
  FileText, 
  FileSpreadsheet, 
  FileImage,
  Calendar,
  Filter,
  Settings,
  CheckCircle,
  Clock,
  AlertCircle,
  BarChart3,
  PieChart,
  TrendingUp,
  Users,
  Package,
  DollarSign,
  Truck
} from 'lucide-react'

interface ExportOption {
  id: string
  name: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  formats: string[]
  size?: string
}

interface ReportTemplate {
  id: string
  name: string
  description: string
  category: string
  icon: React.ComponentType<{ className?: string }>
  fields: string[]
  formats: string[]
}

const DataExport: React.FC = () => {
  const [selectedFormat, setSelectedFormat] = useState('csv')
  const [selectedDateRange, setSelectedDateRange] = useState('30days')
  const [selectedData, setSelectedData] = useState<string[]>([])
  const [isExporting, setIsExporting] = useState(false)
  const [exportProgress, setExportProgress] = useState(0)

  const exportOptions: ExportOption[] = [
    {
      id: 'sales',
      name: 'Sales Data',
      description: 'Complete sales transactions and orders',
      icon: DollarSign,
      formats: ['csv', 'excel', 'pdf'],
      size: '~15MB'
    },
    {
      id: 'inventory',
      name: 'Inventory Reports',
      description: 'Current stock levels and warehouse data',
      icon: Package,
      formats: ['csv', 'excel', 'pdf'],
      size: '~8MB'
    },
    {
      id: 'customers',
      name: 'Customer Information',
      description: 'Customer profiles and purchase history',
      icon: Users,
      formats: ['csv', 'excel', 'pdf'],
      size: '~12MB'
    },
    {
      id: 'vendors',
      name: 'Vendor Data',
      description: 'Supplier information and purchase orders',
      icon: Truck,
      formats: ['csv', 'excel', 'pdf'],
      size: '~6MB'
    },
    {
      id: 'financial',
      name: 'Financial Reports',
      description: 'Revenue, expenses, and cash flow data',
      icon: TrendingUp,
      formats: ['excel', 'pdf'],
      size: '~10MB'
    },
    {
      id: 'employees',
      name: 'Employee Data',
      description: 'HR information and performance metrics',
      icon: Users,
      formats: ['csv', 'excel', 'pdf'],
      size: '~4MB'
    }
  ]

  const reportTemplates: ReportTemplate[] = [
    {
      id: 'sales-summary',
      name: 'Sales Summary Report',
      description: 'Monthly sales performance overview',
      category: 'Sales',
      icon: BarChart3,
      fields: ['Revenue', 'Orders', 'Customers', 'Products', 'Regions'],
      formats: ['pdf', 'excel']
    },
    {
      id: 'inventory-status',
      name: 'Inventory Status Report',
      description: 'Current stock levels and reorder points',
      category: 'Inventory',
      icon: Package,
      fields: ['Products', 'Quantity', 'Value', 'Location', 'Status'],
      formats: ['pdf', 'excel', 'csv']
    },
    {
      id: 'financial-statement',
      name: 'Financial Statement',
      description: 'Comprehensive financial overview',
      category: 'Finance',
      icon: DollarSign,
      fields: ['Revenue', 'Expenses', 'Profit', 'Cash Flow', 'Assets'],
      formats: ['pdf', 'excel']
    },
    {
      id: 'customer-analysis',
      name: 'Customer Analysis Report',
      description: 'Customer behavior and demographics',
      category: 'Sales',
      icon: Users,
      fields: ['Demographics', 'Purchase History', 'Segmentation', 'Lifetime Value'],
      formats: ['pdf', 'excel']
    },
    {
      id: 'vendor-performance',
      name: 'Vendor Performance Report',
      description: 'Supplier metrics and performance analysis',
      category: 'Purchasing',
      icon: Truck,
      fields: ['Suppliers', 'Orders', 'Delivery Time', 'Quality', 'Cost'],
      formats: ['pdf', 'excel']
    }
  ]

  const recentExports = [
    {
      id: 1,
      name: 'Sales Data - Q4 2024',
      format: 'Excel',
      status: 'completed',
      date: '2024-01-15 14:30',
      size: '15.2 MB',
      downloadUrl: '#'
    },
    {
      id: 2,
      name: 'Inventory Report',
      format: 'PDF',
      status: 'completed',
      date: '2024-01-15 13:15',
      size: '8.7 MB',
      downloadUrl: '#'
    },
    {
      id: 3,
      name: 'Customer Analysis',
      format: 'CSV',
      status: 'processing',
      date: '2024-01-15 15:45',
      size: 'Processing...',
      downloadUrl: null
    },
    {
      id: 4,
      name: 'Financial Statement',
      format: 'PDF',
      status: 'failed',
      date: '2024-01-15 12:00',
      size: 'Failed',
      downloadUrl: null
    }
  ]

  const handleExport = async () => {
    if (selectedData.length === 0) return
    
    setIsExporting(true)
    setExportProgress(0)
    
    // Simulate export progress
    const interval = setInterval(() => {
      setExportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsExporting(false)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'processing': return <Clock className="h-4 w-4 text-yellow-600" />
      case 'failed': return <AlertCircle className="h-4 w-4 text-red-600" />
      default: return null
    }
  }

  const getFormatIcon = (format: string) => {
    switch (format.toLowerCase()) {
      case 'csv': return <FileSpreadsheet className="h-4 w-4" />
      case 'excel': return <FileSpreadsheet className="h-4 w-4" />
      case 'pdf': return <FileText className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Data Export & Reports</h1>
          <p className="text-gray-600 mt-1">Export data and generate custom reports</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Export Settings
          </Button>
        </div>
      </div>

      <Tabs defaultValue="export" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="export">Data Export</TabsTrigger>
          <TabsTrigger value="reports">Report Templates</TabsTrigger>
          <TabsTrigger value="history">Export History</TabsTrigger>
        </TabsList>

        <TabsContent value="export" className="space-y-6">
          {/* Export Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exportOptions.map((option) => (
              <Card key={option.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <option.icon className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{option.name}</CardTitle>
                        <CardDescription className="text-sm">{option.description}</CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Estimated Size:</span>
                    <span className="font-medium">{option.size}</span>
                  </div>
                  
                  <div className="space-y-2">
                    <span className="text-sm text-gray-600">Available Formats:</span>
                    <div className="flex flex-wrap gap-2">
                      {option.formats.map((format) => (
                        <Badge key={format} variant="secondary" className="text-xs">
                          {format.toUpperCase()}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={option.id}
                      checked={selectedData.includes(option.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedData([...selectedData, option.id])
                        } else {
                          setSelectedData(selectedData.filter(id => id !== option.id))
                        }
                      }}
                    />
                    <label htmlFor={option.id} className="text-sm font-medium">
                      Include in export
                    </label>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Export Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Export Configuration</CardTitle>
              <CardDescription>Configure your export settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Export Format</label>
                  <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="excel">Excel</SelectItem>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="json">JSON</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Date Range</label>
                  <Select value={selectedDateRange} onValueChange={setSelectedDateRange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7days">Last 7 Days</SelectItem>
                      <SelectItem value="30days">Last 30 Days</SelectItem>
                      <SelectItem value="90days">Last 90 Days</SelectItem>
                      <SelectItem value="1year">Last Year</SelectItem>
                      <SelectItem value="all">All Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Compression</label>
                  <Select defaultValue="zip">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Compression</SelectItem>
                      <SelectItem value="zip">ZIP Archive</SelectItem>
                      <SelectItem value="gzip">GZIP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {isExporting && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Export Progress</span>
                    <span>{exportProgress}%</span>
                  </div>
                  <Progress value={exportProgress} className="h-2" />
                </div>
              )}

              <div className="flex justify-end">
                <Button 
                  onClick={handleExport}
                  disabled={selectedData.length === 0 || isExporting}
                  className="min-w-32"
                >
                  <Download className="h-4 w-4 mr-2" />
                  {isExporting ? 'Exporting...' : `Export ${selectedData.length} Dataset${selectedData.length !== 1 ? 's' : ''}`}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reportTemplates.map((template) => (
              <Card key={template.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-50 rounded-lg">
                      <template.icon className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <CardDescription className="text-sm">{template.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Category:</span>
                    <Badge variant="outline">{template.category}</Badge>
                  </div>

                  <div className="space-y-2">
                    <span className="text-sm text-gray-600">Includes:</span>
                    <div className="flex flex-wrap gap-1">
                      {template.fields.slice(0, 3).map((field) => (
                        <Badge key={field} variant="secondary" className="text-xs">
                          {field}
                        </Badge>
                      ))}
                      {template.fields.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{template.fields.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {template.formats.map((format) => (
                      <Button key={format} size="sm" variant="outline">
                        {getFormatIcon(format)}
                        <span className="ml-1">{format}</span>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Exports</CardTitle>
              <CardDescription>View and download your recent data exports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentExports.map((exportItem) => (
                  <div key={exportItem.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      {getStatusIcon(exportItem.status)}
                      <div>
                        <p className="font-medium">{exportItem.name}</p>
                        <p className="text-sm text-gray-600">
                          {exportItem.date} • {exportItem.size}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="flex items-center gap-1">
                        {getFormatIcon(exportItem.format)}
                        {exportItem.format}
                      </Badge>
                      {exportItem.downloadUrl ? (
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline" disabled>
                          {exportItem.status === 'processing' ? 'Processing...' : 'Failed'}
                        </Button>
                      )}
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

export default DataExport