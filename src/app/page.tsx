'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DashboardFilters } from '@/components/ui/filters'
import { Sidebar } from '@/components/ui/sidebar'
import { ResponsiveContainer } from '@/components/ui/responsive-container'
import SalesTerritoryDashboard from '@/components/dashboard/SalesTerritoryDashboard'
import SalesDashboard from '@/components/dashboard/SalesDashboard'
import SalesAnalyticsDashboard from '@/components/dashboard/SalesAnalyticsDashboard'
import InventoryDashboard from '@/components/dashboard/InventoryDashboard'
import HRDashboard from '@/components/dashboard/HRDashboard'
import ProductDashboard from '@/components/dashboard/ProductDashboard'
import PurchasingDashboard from '@/components/dashboard/PurchasingDashboard'
import VendorsDashboard from '@/components/dashboard/VendorsDashboard'
import PurchaseOrdersDashboard from '@/components/dashboard/PurchaseOrdersDashboard'
import VendorPerformanceDashboard from '@/components/dashboard/VendorPerformanceDashboard'
import FinancialReportsDashboard from '@/components/dashboard/FinancialReportsDashboard'
import ProductListDashboard from '@/components/dashboard/ProductListDashboard'
import CategoriesDashboard from '@/components/dashboard/CategoriesDashboard'
import CustomerAnalyticsDashboard from '@/components/dashboard/CustomerAnalyticsDashboard'
import DataExport from '@/components/ui/data-export'
import NotificationCenter, { LiveIndicator } from '@/components/ui/notifications'
import {
  Users,
  ShoppingCart,
  Package,
  TrendingUp,
  DollarSign,
  Building,
  Truck,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Target,
  AlertCircle,
  CheckCircle,
  FileText,
  Menu,
  CreditCard,
  Wallet,
  Receipt,
  TrendingDown,
  Calculator,
  ArrowUpRight,
  ArrowDownRight,
  Percent,
  X,
  MapPin,
  Database,
  Bell,
  Star,
  Clock,
  UserCheck,
  UserPlus,
  UserSearch,
  Building2,
  Briefcase,
  Shield,
  ChevronDown
} from 'lucide-react'

// Settings Dashboard Component
const SettingsDashboard = () => {
  const [activeTab, setActiveTab] = useState('profile')
  const [settings, setSettings] = useState({
    profile: {
      name: 'Admin User',
      email: 'admin@adventureworks.com',
      role: 'System Administrator',
      department: 'IT',
      phone: '+1 (555) 123-4567',
      avatar: null
    },
    notifications: {
      emailAlerts: true,
      pushNotifications: true,
      weeklyReports: true,
      criticalAlerts: true,
      monthlySummary: false,
      marketingEmails: false
    },
    appearance: {
      theme: 'light',
      language: 'en',
      timezone: 'UTC-5',
      dateFormat: 'MM/DD/YYYY',
      currency: 'USD'
    },
    system: {
      autoRefresh: true,
      refreshInterval: 30,
      dataRetention: 365,
      backupFrequency: 'daily',
      maintenanceMode: false
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 60,
      passwordExpiry: 90,
      loginNotifications: true,
      apiAccess: false
    }
  })

  const handleSettingChange = (category: string, setting: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [setting]: value
      }
    }))
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: Users },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Database },
    { id: 'system', label: 'System', icon: Database },
    { id: 'security', label: 'Security', icon: Shield }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account and system preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Settings Menu</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary text-primary-foreground'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </CardContent>
        </Card>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          {activeTab === 'profile' && (
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>Update your personal information and profile details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                    <Users className="w-8 h-8 text-gray-500" />
                  </div>
                  <div>
                    <Button variant="outline">Change Avatar</Button>
                    <p className="text-sm text-gray-500 mt-1">JPG, PNG or GIF. Max size 2MB</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Full Name</label>
                    <input
                      type="text"
                      value={settings.profile.name}
                      onChange={(e) => handleSettingChange('profile', 'name', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary p-2 border"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      value={settings.profile.email}
                      onChange={(e) => handleSettingChange('profile', 'email', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary p-2 border"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Role</label>
                    <input
                      type="text"
                      value={settings.profile.role}
                      disabled
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-50 p-2 border"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Department</label>
                    <select
                      value={settings.profile.department}
                      onChange={(e) => handleSettingChange('profile', 'department', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary p-2 border"
                    >
                      <option value="IT">IT</option>
                      <option value="Sales">Sales</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Finance">Finance</option>
                      <option value="HR">Human Resources</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Phone</label>
                    <input
                      type="tel"
                      value={settings.profile.phone}
                      onChange={(e) => handleSettingChange('profile', 'phone', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary p-2 border"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <Button variant="outline">Cancel</Button>
                  <Button>Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'notifications' && (
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Choose how you want to receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Email Notifications</h3>
                  <div className="space-y-3">
                    {[
                      { key: 'emailAlerts', label: 'Email Alerts', description: 'Receive important updates via email' },
                      { key: 'weeklyReports', label: 'Weekly Reports', description: 'Get weekly performance summaries' },
                      { key: 'criticalAlerts', label: 'Critical Alerts', description: 'Immediate notifications for critical issues' },
                      { key: 'monthlySummary', label: 'Monthly Summary', description: 'Monthly business insights and reports' },
                      { key: 'marketingEmails', label: 'Marketing Emails', description: 'Product updates and announcements' }
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{item.label}</p>
                          <p className="text-sm text-gray-500">{item.description}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.notifications[item.key as keyof typeof settings.notifications]}
                            onChange={(e) => handleSettingChange('notifications', item.key, e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <Button variant="outline">Reset to Default</Button>
                  <Button>Save Preferences</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'appearance' && (
            <Card>
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
                <CardDescription>Customize the look and feel of your dashboard</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Theme</label>
                    <select
                      value={settings.appearance.theme}
                      onChange={(e) => handleSettingChange('appearance', 'theme', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary p-2 border"
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="auto">Auto</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Language</label>
                    <select
                      value={settings.appearance.language}
                      onChange={(e) => handleSettingChange('appearance', 'language', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary p-2 border"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                      <option value="zh">Chinese</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Timezone</label>
                    <select
                      value={settings.appearance.timezone}
                      onChange={(e) => handleSettingChange('appearance', 'timezone', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary p-2 border"
                    >
                      <option value="UTC-8">Pacific Time (UTC-8)</option>
                      <option value="UTC-5">Eastern Time (UTC-5)</option>
                      <option value="UTC+0">London (UTC+0)</option>
                      <option value="UTC+1">Paris (UTC+1)</option>
                      <option value="UTC+8">Beijing (UTC+8)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Date Format</label>
                    <select
                      value={settings.appearance.dateFormat}
                      onChange={(e) => handleSettingChange('appearance', 'dateFormat', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary p-2 border"
                    >
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Currency</label>
                    <select
                      value={settings.appearance.currency}
                      onChange={(e) => handleSettingChange('appearance', 'currency', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary p-2 border"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="JPY">JPY (¥)</option>
                      <option value="CNY">CNY (¥)</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <Button variant="outline">Reset to Default</Button>
                  <Button>Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'system' && (
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>Configure system behavior and data management</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Data Management</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Data Retention (days)</label>
                      <input
                        type="number"
                        value={settings.system.dataRetention}
                        onChange={(e) => handleSettingChange('system', 'dataRetention', parseInt(e.target.value))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary p-2 border"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Backup Frequency</label>
                      <select
                        value={settings.system.backupFrequency}
                        onChange={(e) => handleSettingChange('system', 'backupFrequency', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary p-2 border"
                      >
                        <option value="hourly">Hourly</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <Button variant="outline">Reset to Default</Button>
                  <Button>Save Settings</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'security' && (
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your account security and access controls</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Authentication</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Two-Factor Authentication</p>
                        <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.security.twoFactorAuth}
                          onChange={(e) => handleSettingChange('security', 'twoFactorAuth', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <Button variant="outline">Reset to Default</Button>
                  <Button>Save Settings</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

// HR Dashboard Components
const EmployeesDashboard = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Employee Management</h1>
      <p className="text-gray-600 mt-1">Comprehensive employee overview and management tools</p>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
          <Users className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">290</div>
          <p className="text-xs text-green-600">+2.1% from last month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Employees</CardTitle>
          <UserCheck className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">285</div>
          <p className="text-xs text-green-600">98.3% attendance</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">New Hires (YTD)</CardTitle>
          <UserPlus className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">24</div>
          <p className="text-xs text-green-600">+8.3% YoY</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg Tenure</CardTitle>
          <Clock className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">4.2 yrs</div>
          <p className="text-xs text-blue-600">Stable workforce</p>
        </CardContent>
      </Card>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Recent Employee Updates</CardTitle>
          <CardDescription>Latest employee changes and status updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: 'John Smith', action: 'Promoted to Senior Engineer', date: '2024-01-15', type: 'promotion' },
              { name: 'Sarah Johnson', action: 'Department transfer to Sales', date: '2024-01-14', type: 'transfer' },
              { name: 'Michael Chen', action: 'Completed certification program', date: '2024-01-13', type: 'training' },
              { name: 'Emily Davis', action: 'Salary review completed', date: '2024-01-12', type: 'review' },
              { name: 'Robert Wilson', action: 'Work anniversary - 5 years', date: '2024-01-10', type: 'anniversary' },
            ].map((update, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium">{update.name}</p>
                  <p className="text-sm text-gray-600">{update.action}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">{update.date}</p>
                  <Badge variant="outline" className="text-xs mt-1">
                    {update.type}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Employee Distribution</CardTitle>
          <CardDescription>Headcount analysis by department and level</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-3">By Department</h4>
              <div className="space-y-2">
                {[
                  { dept: 'Engineering', count: 85, percentage: 29.3 },
                  { dept: 'Sales', count: 67, percentage: 23.1 },
                  { dept: 'Marketing', count: 42, percentage: 14.5 },
                  { dept: 'Human Resources', count: 28, percentage: 9.7 },
                  { dept: 'Finance', count: 35, percentage: 12.1 },
                  { dept: 'Operations', count: 33, percentage: 11.3 },
                ].map((dept, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm">{dept.dept}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${dept.percentage * 3}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-12 text-right">{dept.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">By Level</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-lg font-bold">45</p>
                  <p className="text-xs text-gray-600">Senior Level</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-lg font-bold">156</p>
                  <p className="text-xs text-gray-600">Mid Level</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-lg font-bold">89</p>
                  <p className="text-xs text-gray-600">Junior Level</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-lg font-bold">0</p>
                  <p className="text-xs text-gray-600">Interns</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

const DepartmentsDashboard = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Department Management</h1>
      <p className="text-gray-600 mt-1">Departmental organization and performance metrics</p>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Departments</CardTitle>
          <Building2 className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">16</div>
          <p className="text-xs text-green-600">All active</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg Team Size</CardTitle>
          <Users className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">18.1</div>
          <p className="text-xs text-blue-600">Optimal range</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
          <DollarSign className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">$8.0M</div>
          <p className="text-xs text-green-600">Within budget</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Efficiency Score</CardTitle>
          <TrendingUp className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">87.3%</div>
          <p className="text-xs text-green-600">+3.2% improvement</p>
        </CardContent>
      </Card>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Department Performance Overview</CardTitle>
          <CardDescription>Key metrics and performance indicators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { 
                name: 'Engineering', 
                headcount: 85, 
                budget: '$2.1M', 
                utilization: 92.3, 
                satisfaction: 4.2,
                projects: 12,
                efficiency: 'A+'
              },
              { 
                name: 'Sales', 
                headcount: 67, 
                budget: '$1.8M', 
                utilization: 88.7, 
                satisfaction: 4.5,
                projects: 8,
                efficiency: 'A'
              },
              { 
                name: 'Marketing', 
                headcount: 42, 
                budget: '$1.2M', 
                utilization: 85.1, 
                satisfaction: 4.1,
                projects: 6,
                efficiency: 'B+'
              },
              { 
                name: 'Human Resources', 
                headcount: 28, 
                budget: '$0.8M', 
                utilization: 89.4, 
                satisfaction: 4.3,
                projects: 4,
                efficiency: 'A'
              },
              { 
                name: 'Finance', 
                headcount: 35, 
                budget: '$1.1M', 
                utilization: 91.2, 
                satisfaction: 4.0,
                projects: 5,
                efficiency: 'A'
              },
              { 
                name: 'Operations', 
                headcount: 33, 
                budget: '$1.0M', 
                utilization: 87.8, 
                satisfaction: 3.9,
                projects: 7,
                efficiency: 'B+'
              },
            ].map((dept, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">{dept.name}</h3>
                  <Badge variant={dept.efficiency.includes('A') ? 'default' : 'secondary'}>
                    {dept.efficiency}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">Headcount:</span>
                    <span className="ml-2 font-medium">{dept.headcount}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Budget:</span>
                    <span className="ml-2 font-medium">{dept.budget}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Utilization:</span>
                    <span className="ml-2 font-medium">{dept.utilization}%</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Satisfaction:</span>
                    <span className="ml-2 font-medium">{dept.satisfaction}/5.0</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Active Projects:</span>
                    <span className="ml-2 font-medium">{dept.projects}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Efficiency:</span>
                    <span className="ml-2 font-medium">{dept.efficiency}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Department Budget Analysis</CardTitle>
          <CardDescription>Budget allocation and spending patterns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-900">$8.0M</p>
              <p className="text-sm text-blue-700">Total Annual Budget</p>
              <p className="text-xs text-blue-600 mt-1">$2.67M avg per department</p>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">Budget Distribution</h4>
              <div className="space-y-2">
                {[
                  { dept: 'Engineering', budget: 2.1, percentage: 26.3 },
                  { dept: 'Sales', budget: 1.8, percentage: 22.5 },
                  { dept: 'Marketing', budget: 1.2, percentage: 15.0 },
                  { dept: 'Finance', budget: 1.1, percentage: 13.8 },
                  { dept: 'Operations', budget: 1.0, percentage: 12.5 },
                  { dept: 'Human Resources', budget: 0.8, percentage: 9.9 },
                ].map((dept, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm">{dept.dept}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${dept.percentage * 3}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-12 text-right">${dept.budget}M</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="pt-3 border-t">
              <h4 className="font-medium mb-3">Budget Health</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Under Budget:</span>
                  <span className="text-green-600 font-medium">12 departments</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>On Budget:</span>
                  <span className="text-blue-600 font-medium">3 departments</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Over Budget:</span>
                  <span className="text-red-600 font-medium">1 department</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

const JobCandidatesDashboard = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Job Candidates</h1>
      <p className="text-gray-600 mt-1">Recruitment pipeline and candidate management</p>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Candidates</CardTitle>
          <UserSearch className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">13</div>
          <p className="text-xs text-green-600">+3 this week</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Open Positions</CardTitle>
          <Briefcase className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">8</div>
          <p className="text-xs text-blue-600">4 urgent hires</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Interviews This Week</CardTitle>
          <Calendar className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">15</div>
          <p className="text-xs text-green-600">On schedule</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg Time to Hire</CardTitle>
          <Clock className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">28 days</div>
          <p className="text-xs text-green-600">-5 days improved</p>
        </CardContent>
      </Card>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Current Candidates Pipeline</CardTitle>
          <CardDescription>Candidates by recruitment stage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { stage: 'Phone Screen', count: 3, color: 'bg-blue-600', nextStep: 'Technical Interview' },
              { stage: 'Technical Interview', count: 5, color: 'bg-yellow-600', nextStep: 'On-site Interview' },
              { stage: 'On-site Interview', count: 4, color: 'bg-orange-600', nextStep: 'Final Review' },
              { stage: 'Final Review', count: 1, color: 'bg-green-600', nextStep: 'Offer Preparation' },
              { stage: 'Offer Extended', count: 0, color: 'bg-purple-600', nextStep: 'Acceptance' },
            ].map((stage, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{stage.stage}</h3>
                  <Badge variant="outline">{stage.count} candidates</Badge>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`${stage.color} h-2 rounded-full`}
                        style={{ width: `${(stage.count / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">{stage.nextStep}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Candidate Activity</CardTitle>
          <CardDescription>Latest updates in the recruitment process</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: 'Alex Thompson', position: 'Senior Developer', stage: 'Technical Interview', date: '2024-01-15', status: 'positive' },
              { name: 'Maria Garcia', position: 'UX Designer', stage: 'On-site Interview', date: '2024-01-14', status: 'pending' },
              { name: 'David Kim', position: 'Product Manager', stage: 'Final Review', date: '2024-01-13', status: 'positive' },
              { name: 'Lisa Anderson', position: 'Marketing Analyst', stage: 'Phone Screen', date: '2024-01-12', status: 'rejected' },
              { name: 'James Wilson', position: 'Sales Representative', stage: 'Technical Interview', date: '2024-01-11', status: 'pending' },
            ].map((candidate, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium">{candidate.name}</p>
                    <Badge 
                      variant={
                        candidate.status === 'positive' ? 'default' :
                        candidate.status === 'pending' ? 'secondary' : 'destructive'
                      }
                      className="text-xs"
                    >
                      {candidate.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{candidate.position}</p>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{candidate.stage}</span>
                    <span>{candidate.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Open Positions</CardTitle>
          <CardDescription>Current job openings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { title: 'Senior Software Engineer', department: 'Engineering', type: 'Full-time', urgency: 'High', applicants: 8 },
              { title: 'Sales Manager', department: 'Sales', type: 'Full-time', urgency: 'High', applicants: 12 },
              { title: 'Marketing Specialist', department: 'Marketing', type: 'Full-time', urgency: 'Medium', applicants: 6 },
              { title: 'HR Coordinator', department: 'Human Resources', type: 'Full-time', urgency: 'Medium', applicants: 4 },
              { title: 'Financial Analyst', department: 'Finance', type: 'Full-time', urgency: 'Low', applicants: 3 },
            ].map((position, index) => (
              <div key={index} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm">{position.title}</h4>
                  <Badge 
                    variant={position.urgency === 'High' ? 'destructive' : 'secondary'}
                    className="text-xs"
                  >
                    {position.urgency}
                  </Badge>
                </div>
                <div className="text-xs text-gray-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Department:</span>
                    <span>{position.department}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Type:</span>
                    <span>{position.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Applicants:</span>
                    <span>{position.applicants}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recruitment Metrics</CardTitle>
          <CardDescription>Key performance indicators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-900">76%</p>
              <p className="text-sm text-green-700">Offer Acceptance Rate</p>
              <p className="text-xs text-green-600 mt-1">Above industry average</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-lg font-bold">4.2</p>
                <p className="text-xs text-gray-600">Avg Interview Score</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-lg font-bold">$85K</p>
                <p className="text-xs text-gray-600">Avg Offer Salary</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-lg font-bold">18</p>
                <p className="text-xs text-gray-600">Days to First Interview</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-lg font-bold">92%</p>
                <p className="text-xs text-gray-600">Satisfaction Rate</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Source of Hire</CardTitle>
          <CardDescription>Where candidates come from</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { source: 'Employee Referral', count: 8, percentage: 61.5, quality: 'High' },
              { source: 'LinkedIn', count: 3, percentage: 23.1, quality: 'Medium' },
              { source: 'Company Website', count: 1, percentage: 7.7, quality: 'High' },
              { source: 'Job Board', count: 1, percentage: 7.7, quality: 'Low' },
            ].map((source, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{source.source}</span>
                  <span>{source.count} ({source.percentage}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      source.quality === 'High' ? 'bg-green-600' :
                      source.quality === 'Medium' ? 'bg-yellow-600' : 'bg-red-600'
                    }`}
                    style={{ width: `${source.percentage * 1.5}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

export default function AdventureWorksDashboard() {
  const [activeItem, setActiveItem] = useState('overview')
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [isYearFilterOpen, setIsYearFilterOpen] = useState(false)
  const [filters, setFilters] = useState({
    dateRange: '2014',
    department: 'all',
    territory: 'all',
    category: 'all',
    vendor: 'all',
    status: 'all'
  })
  const [overviewData, setOverviewData] = useState<any>(null)
  const [isLoadingOverview, setIsLoadingOverview] = useState(true)

  const handleFiltersChange = (newFilters: any) => {
    console.log('handleFiltersChange called with:', newFilters)
    setFilters(newFilters)
  }

  // Fetch overview data
  useEffect(() => {
    const fetchOverviewData = async () => {
      try {
        setIsLoadingOverview(true)
        const queryParams = new URLSearchParams()
        
        if (filters.dateRange && filters.dateRange !== 'all') {
          queryParams.append('dateRange', filters.dateRange)
        }
        
        const url = queryParams.toString()
          ? `/api/dashboard/overview?${queryParams.toString()}`
          : '/api/dashboard/overview'
          
        const response = await fetch(url)
        if (response.ok) {
          const data = await response.json()
          setOverviewData(data)
        }
      } catch (error) {
        console.error('Error fetching overview data:', error)
      } finally {
        setIsLoadingOverview(false)
      }
    }

    fetchOverviewData()
  }, [filters.dateRange])

  // Close year filter dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isYearFilterOpen) {
        setIsYearFilterOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isYearFilterOpen])

  // Format overview stats from API data
  const overviewStats = overviewData ? [
    {
      title: `Total Sales ${filters.dateRange === '2011-2014' ? '(2011-2014)' : `(${filters.dateRange})`}`,
      value: `$${(overviewData.summary.totalSales / 1000000).toFixed(1)}M`,
      change: '+18.3%',
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      title: 'Total Orders',
      value: overviewData.summary.totalOrders.toLocaleString(),
      change: '+22.1%',
      icon: ShoppingCart,
      color: 'text-blue-600'
    },
    {
      title: 'Active Customers',
      value: overviewData.summary.activeCustomers.toLocaleString(),
      change: '+15.7%',
      icon: Users,
      color: 'text-purple-600'
    },
    {
      title: 'Products',
      value: overviewData.summary.products.toLocaleString(),
      change: '+2.3%',
      icon: Package,
      color: 'text-orange-600'
    },
  ] : []

  const employeeStats = [
    { title: 'Total Employees', value: '290', change: '+3.1%', icon: Users, color: 'text-blue-600' },
    { title: 'Departments', value: '16', change: '0%', icon: Building, color: 'text-gray-600' },
    { title: 'Job Candidates', value: '13', change: '+15.4%', icon: Target, color: 'text-green-600' },
    { title: 'Avg Vacation Hours', value: '52', change: '+2.1%', icon: Calendar, color: 'text-purple-600' },
  ]

  const salesPerformance = overviewData?.salesPerformance || []
  const topProducts = overviewData?.topProducts || []
  const recentOrders = overviewData?.recentOrders || []

  const renderContent = () => {
    switch (activeItem) {
      case 'overview':
        return (
          <div className="space-y-6">
            <DashboardFilters
              onFiltersChange={handleFiltersChange}
              dashboardType={activeItem}
            />
            
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
                <p className="text-gray-600 mt-1">Comprehensive Business Management System {filters.dateRange === '2011-2014' ? '(2011-2014)' : `(${filters.dateRange})`}</p>
              </div>
              <div className="flex items-center space-x-4">
                <LiveIndicator />
                <Badge variant="outline" className="text-green-600 border-green-600">
                  <Activity className="w-4 h-4 mr-1" />
                  Live Data
                </Badge>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsNotificationsOpen(true)}
                  className="relative"
                >
                  <Bell className="w-4 h-4 mr-2" />
                  Notifications
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
                </Button>
                <div className="relative">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsYearFilterOpen(!isYearFilterOpen)}
                    className="flex items-center"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    {filters.dateRange === '2011-2014' ? 'All Years' : filters.dateRange}
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                  
                  {isYearFilterOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200">
                      <div className="py-1">
                        {[
                          { value: '2011-2014', label: 'All Years' },
                          { value: '2014', label: 'Year 2014' },
                          { value: '2013', label: 'Year 2013' },
                          { value: '2012', label: 'Year 2012' },
                          { value: '2011', label: 'Year 2011' },
                        ].map((option) => (
                          <button
                            key={option.value}
                            className={cn(
                              "w-full text-left px-4 py-2 text-sm hover:bg-gray-100",
                              filters.dateRange === option.value ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700"
                            )}
                            onClick={() => {
                              setFilters({ ...filters, dateRange: option.value });
                              setIsYearFilterOpen(false);
                            }}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            {isLoadingOverview ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {[...Array(4)].map((_, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow duration-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mb-2"></div>
                      <div className="h-3 w-20 bg-gray-200 rounded animate-pulse"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {overviewStats.map((stat, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow duration-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-600">
                        {stat.title}
                      </CardTitle>
                      <stat.icon className={`h-4 w-4 ${stat.color}`} />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <p className="text-xs text-green-600 mt-1">
                        {stat.change} from last month
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Charts Row */}
            {isLoadingOverview ? (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
                <Card className="hover:shadow-md transition-shadow duration-200">
                  <CardHeader>
                    <div className="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[...Array(4)].map((_, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between">
                            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="h-2 rounded-full bg-gray-300 animate-pulse" style={{ width: '70%' }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow duration-200">
                  <CardHeader>
                    <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[...Array(4)].map((_, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
                            <div>
                              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-1"></div>
                              <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse mb-1"></div>
                            <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
                <Card className="hover:shadow-md transition-shadow duration-200">
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                      <BarChart3 className="w-5 h-5 mr-2" />
                      Sales Performance by Region
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {salesPerformance.map((region, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">{region.region}</span>
                            <span className="text-gray-600">
                              ${(region.sales / 1000000).toFixed(1)}M / ${(region.target / 1000000).toFixed(1)}M
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                region.percentage >= 100 ? 'bg-green-600' :
                                region.percentage >= 80 ? 'bg-yellow-600' : 'bg-red-600'
                              }`}
                              style={{ width: `${Math.min(region.percentage, 100)}%` }}
                            />
                          </div>
                          <div className="text-xs text-gray-500">
                            {region.percentage.toFixed(1)}% of target
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow duration-200">
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                      <TrendingUp className="w-5 h-5 mr-2" />
                      Top Products
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {topProducts.map((product, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center text-sm font-medium">
                              {index + 1}
                            </div>
                            <div>
                              <p className="text-sm font-medium">{product.name}</p>
                              <p className="text-xs text-gray-500">{product.sales} units sold</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">${product.revenue.toLocaleString()}</p>
                            {product.status === 'hot' && (
                              <Badge variant="destructive" className="text-xs">Hot</Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Recent Orders */}
            {isLoadingOverview ? (
              <Card>
                <CardHeader>
                  <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[...Array(5)].map((_, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div>
                            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-1"></div>
                            <div className="h-3 w-32 bg-gray-200 rounded animate-pulse"></div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse mb-1"></div>
                          <div className="flex items-center justify-end space-x-2 mt-1">
                            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>Latest sales orders from the system</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentOrders.map((order, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div>
                            <p className="font-medium">{order.id}</p>
                            <p className="text-sm text-gray-600">{order.customer}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${order.amount.toFixed(2)}</p>
                          <div className="flex items-center justify-end space-x-2 mt-1">
                            <Badge
                              variant={
                                order.status === 'completed' ? 'default' :
                                order.status === 'processing' ? 'secondary' : 'outline'
                              }
                              className="text-xs"
                            >
                              {order.status}
                            </Badge>
                            <span className="text-xs text-gray-500">{order.date}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )

      case 'sales-analytics':
        return (
          <div className="space-y-6">
            <DashboardFilters
              onFiltersChange={handleFiltersChange}
              dashboardType={activeItem}
            />
            <SalesAnalyticsDashboard filters={filters} />
          </div>
        )

      case 'orders':
        return (
          <div className="space-y-6">
            <DashboardFilters 
              onFiltersChange={handleFiltersChange} 
              dashboardType={activeItem}
            />
            
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Sales Orders Management</h1>
              <p className="text-gray-600 mt-1">Track and manage all sales orders {filters.dateRange === '2011-2014' ? '(2011-2014)' : `(${filters.dateRange})`}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ShoppingCart className="w-5 h-5 mr-2 text-blue-600" />
                    Total Orders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">121,317</div>
                  <p className="text-sm text-blue-600 mt-2">2011-2014 total</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                    Completed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">108,245</div>
                  <p className="text-sm text-green-600 mt-2">89.3% completion</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2 text-yellow-600" />
                    Processing
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">8,942</div>
                  <p className="text-sm text-yellow-600 mt-2">7.4% in progress</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <X className="w-5 h-5 mr-2 text-red-600" />
                    Cancelled
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">4,130</div>
                  <p className="text-sm text-red-600 mt-2">3.4% cancelled</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Latest sales orders from the system</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { id: 'SO71874', customer: 'Professional Sales and Service', amount: 4789.25, status: 'completed', date: '2014-06-30', priority: 'high' },
                    { id: 'SO71873', customer: 'Riding Cycles', amount: 2344.50, status: 'processing', date: '2014-06-30', priority: 'medium' },
                    { id: 'SO71872', customer: 'Vigorous Sports Store', amount: 678.75, status: 'pending', date: '2014-06-29', priority: 'low' },
                    { id: 'SO71871', customer: 'Action Bicycle Specialists', amount: 3456.00, status: 'completed', date: '2014-06-29', priority: 'high' },
                    { id: 'SO71870', customer: 'Metro Sporting Goods', amount: 1234.50, status: 'processing', date: '2014-06-28', priority: 'medium' },
                  ].map((order, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="font-medium">{order.id}</p>
                          <p className="text-sm text-gray-600">{order.customer}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${order.amount.toFixed(2)}</p>
                        <div className="flex items-center justify-end space-x-2 mt-1">
                          <Badge 
                            variant={
                              order.status === 'completed' ? 'default' :
                              order.status === 'processing' ? 'secondary' : 'outline'
                            }
                            className="text-xs"
                          >
                            {order.status}
                          </Badge>
                          <Badge 
                            variant={
                              order.priority === 'high' ? 'destructive' :
                              order.priority === 'medium' ? 'secondary' : 'outline'
                            }
                            className="text-xs"
                          >
                            {order.priority}
                          </Badge>
                          <span className="text-xs text-gray-500">{order.date}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case 'human-resources':
        return (
          <div className="space-y-6">
            <DashboardFilters
              onFiltersChange={handleFiltersChange}
              dashboardType={activeItem}
            />
            <HRDashboard filters={filters} />
          </div>
        )

      case 'customers':
        return (
          <div className="space-y-6">
            <DashboardFilters 
              onFiltersChange={handleFiltersChange} 
              dashboardType={activeItem}
            />
            
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Customer Management</h1>
              <p className="text-gray-600 mt-1">Customer relationships and analytics {filters.dateRange === '2011-2014' ? '(2011-2014)' : `(${filters.dateRange})`}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="w-5 h-5 mr-2 text-blue-600" />
                    Total Customers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">19,820</div>
                  <p className="text-sm text-blue-600 mt-2">+15.7% growth</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Building className="w-5 h-5 mr-2 text-purple-600" />
                    Store Customers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">701</div>
                  <p className="text-sm text-purple-600 mt-2">3.5% of total</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="w-5 h-5 mr-2 text-green-600" />
                    Individual
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">19,119</div>
                  <p className="text-sm text-green-600 mt-2">96.5% of total</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-orange-600" />
                    New Customers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">2,847</div>
                  <p className="text-sm text-orange-600 mt-2">In 2014</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top Customers by Revenue</CardTitle>
                  <CardDescription>Highest revenue customers (2011-2014)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: 'Professional Sales and Service', type: 'Store', revenue: 2450000, orders: 1247 },
                      { name: 'Riding Cycles', type: 'Store', revenue: 1890000, orders: 892 },
                      { name: 'Vigorous Sports Store', type: 'Store', revenue: 1560000, orders: 743 },
                      { name: 'Action Bicycle Specialists', type: 'Store', revenue: 1230000, orders: 621 },
                    ].map((customer, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{customer.name}</p>
                          <p className="text-sm text-gray-600">{customer.type} • {customer.orders} orders</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${(customer.revenue / 1000000).toFixed(2)}M</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Customer Acquisition</CardTitle>
                  <CardDescription>New customers by year</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { year: '2014', newCustomers: 2847, totalCustomers: 19820, growth: 12.5 },
                      { year: '2013', newCustomers: 2531, totalCustomers: 16973, growth: 11.8 },
                      { year: '2012', newCustomers: 2264, totalCustomers: 14442, growth: 10.9 },
                      { year: '2011', newCustomers: 2178, totalCustomers: 12178, growth: 0 },
                    ].map((year, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <div>
                          <p className="font-medium">{year.year}</p>
                          <p className="text-sm text-gray-600">{year.newCustomers} new customers</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{year.totalCustomers.toLocaleString()}</p>
                          <p className="text-sm text-green-600">+{year.growth}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      case 'inventory':
        return (
          <div className="space-y-6">
            <DashboardFilters 
              onFiltersChange={handleFiltersChange} 
              dashboardType={activeItem}
            />
            
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
              <p className="text-gray-600 mt-1">Track inventory levels and warehouse operations {filters.dateRange === '2011-2014' ? '(2011-2014)' : `(${filters.dateRange})`}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Package className="w-5 h-5 mr-2 text-blue-600" />
                    Total Items
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">1,069</div>
                  <p className="text-sm text-blue-600 mt-2">SKUs tracked</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Building className="w-5 h-5 mr-2 text-green-600" />
                    Locations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">14</div>
                  <p className="text-sm text-green-600 mt-2">Warehouses</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2 text-yellow-600" />
                    Stock Value
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">$8.2M</div>
                  <p className="text-sm text-yellow-600 mt-2">Total value</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-purple-600" />
                    Turnover
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">4.2x</div>
                  <p className="text-sm text-purple-600 mt-2">Annual rate</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Warehouse Distribution</CardTitle>
                  <CardDescription>Inventory across locations (2014)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: 'Seattle Warehouse', items: 285, value: 2200000, percentage: 26.8 },
                      { name: 'Chicago Warehouse', items: 242, value: 1850000, percentage: 22.6 },
                      { name: 'New York Warehouse', items: 198, value: 1650000, percentage: 20.1 },
                      { name: 'Los Angeles Warehouse', items: 176, value: 1420000, percentage: 17.3 },
                      { name: 'Miami Warehouse', items: 168, value: 1100000, percentage: 13.2 },
                    ].map((warehouse, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{warehouse.name}</p>
                          <p className="text-sm text-gray-600">{warehouse.items} items</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${(warehouse.value / 1000000).toFixed(1)}M</p>
                          <div className="w-16 bg-gray-200 rounded-full h-2 mt-1">
                            <div 
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${warehouse.percentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Stock Status Overview</CardTitle>
                  <CardDescription>Current inventory health</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div>
                        <p className="font-medium text-green-800">Optimal Stock</p>
                        <p className="text-sm text-green-600">Healthy levels</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-800">724</p>
                        <p className="text-sm text-green-600">67.7%</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <div>
                        <p className="font-medium text-yellow-800">Low Stock</p>
                        <p className="text-sm text-yellow-600">Need reorder</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-yellow-800">234</p>
                        <p className="text-sm text-yellow-600">21.9%</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <div>
                        <p className="font-medium text-red-800">Out of Stock</p>
                        <p className="text-sm text-red-600">Critical shortage</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-red-800">89</p>
                        <p className="text-sm text-red-600">8.3%</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div>
                        <p className="font-medium text-blue-800">Overstock</p>
                        <p className="text-sm text-blue-600">Excess inventory</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-blue-800">22</p>
                        <p className="text-sm text-blue-600">2.1%</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Critical Inventory Items</CardTitle>
                <CardDescription>Items requiring immediate attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: 'Mountain-200 Silver', sku: 'BK-M68S-42', currentStock: 8, reorderPoint: 25, status: 'critical', location: 'Seattle' },
                    { name: 'Road-150 Red', sku: 'BK-R93R-58', currentStock: 12, reorderPoint: 30, status: 'low', location: 'Chicago' },
                    { name: 'Sport-100 Helmet', sku: 'HL-U509-R', currentStock: 45, reorderPoint: 50, status: 'low', location: 'New York' },
                    { name: 'Touring-1000 Yellow', sku: 'BK-T79Y-62', currentStock: 3, reorderPoint: 15, status: 'critical', location: 'Los Angeles' },
                    { name: 'Mountain Bike Socks', sku: 'SO-B909-M', currentStock: 78, reorderPoint: 100, status: 'low', location: 'Miami' },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-600">SKU: {item.sku} • {item.location}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <span className="font-medium">{item.currentStock}</span>
                          <span className="text-sm text-gray-500">/ {item.reorderPoint}</span>
                          <Badge 
                            variant={
                              item.status === 'critical' ? 'destructive' : 'secondary'
                            }
                            className="text-xs"
                          >
                            {item.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )


      case 'reports':
        return (
          <div className="space-y-6">
            <DashboardFilters
              onFiltersChange={handleFiltersChange}
              dashboardType={activeItem}
            />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
              <p className="text-gray-600 mt-1">Comprehensive business reports and insights</p>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Territory Performance (2011-2014)</CardTitle>
                <CardDescription>Sales performance by territory</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { name: 'United States', revenue: 28500000, growth: 18.5, salesStaff: 8, customers: 12500 },
                    { name: 'Canada', revenue: 8900000, growth: 22.3, salesStaff: 3, customers: 3200 },
                    { name: 'United Kingdom', revenue: 4200000, growth: 15.8, salesStaff: 2, customers: 1800 },
                    { name: 'France', revenue: 2100000, growth: 12.4, salesStaff: 1, customers: 950 },
                    { name: 'Germany', revenue: 1800000, growth: 14.2, salesStaff: 1, customers: 820 },
                    { name: 'Australia', revenue: 1500000, growth: 19.7, salesStaff: 1, customers: 550 },
                  ].map((territory, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">{territory.name}</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Revenue:</span>
                          <span className="font-medium">${(territory.revenue / 1000000).toFixed(1)}M</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Growth:</span>
                          <span className="text-green-600">+{territory.growth}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Staff:</span>
                          <span>{territory.salesStaff}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Customers:</span>
                          <span>{territory.customers.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case 'sales':
        return (
          <div className="space-y-6">
            <DashboardFilters
              onFiltersChange={handleFiltersChange}
              dashboardType={activeItem}
            />
            <SalesDashboard filters={filters} />
          </div>
        )

      case 'finance':
        return (
          <div className="space-y-6">
            <DashboardFilters 
              onFiltersChange={handleFiltersChange} 
              dashboardType={activeItem}
            />
            
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Financial Management</h1>
              <p className="text-gray-600 mt-1">Monitor financial performance and manage budgets {filters.dateRange === '2011-2014' ? '(2011-2014)' : `(${filters.dateRange})`}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$45.2M</div>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    +18.3% (2011-2014)
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                  <CreditCard className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$32.8M</div>
                  <p className="text-xs text-red-600 flex items-center mt-1">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    +12.7% (2011-2014)
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$12.4M</div>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    +28.4% (2011-2014)
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
                  <Percent className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">27.4%</div>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    +3.2% (2011-2014)
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Breakdown</CardTitle>
                  <CardDescription>Revenue by category (2011-2014)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { category: 'Product Sales', amount: 33400000, percentage: 73.9, color: 'bg-blue-600' },
                      { category: 'Service Revenue', amount: 5800000, percentage: 12.8, color: 'bg-green-600' },
                      { category: 'Licensing', amount: 3800000, percentage: 8.4, color: 'bg-purple-600' },
                      { category: 'Other Revenue', amount: 2200000, percentage: 4.9, color: 'bg-orange-600' },
                    ].map((item, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{item.category}</span>
                          <span className="text-gray-600">
                            ${(item.amount / 1000000).toFixed(1)}M ({item.percentage}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${item.color}`}
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Expense Categories</CardTitle>
                  <CardDescription>Major expense categories (2011-2014)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { category: 'Cost of Goods Sold', amount: 16100000, percentage: 49.1, color: 'bg-red-600' },
                      { category: 'Salaries & Benefits', amount: 9400000, percentage: 28.7, color: 'bg-yellow-600' },
                      { category: 'Operating Expenses', amount: 4300000, percentage: 13.1, color: 'bg-orange-600' },
                      { category: 'Marketing & Sales', amount: 3000000, percentage: 9.1, color: 'bg-purple-600' },
                    ].map((item, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{item.category}</span>
                          <span className="text-gray-600">
                            ${(item.amount / 1000000).toFixed(1)}M ({item.percentage}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${item.color}`}
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Yearly Financial Performance</CardTitle>
                <CardDescription>Revenue vs Expenses trend (2011-2014)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { year: '2014', revenue: 15800000, expenses: 11200000, profit: 4600000, margin: 29.1 },
                    { year: '2013', revenue: 13700000, expenses: 9900000, profit: 3800000, margin: 27.7 },
                    { year: '2012', revenue: 12150000, expenses: 8800000, profit: 3350000, margin: 27.6 },
                    { year: '2011', revenue: 11200000, expenses: 8200000, profit: 3000000, margin: 26.8 },
                  ].map((year, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{year.year}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-sm text-green-600">Revenue: ${(year.revenue / 1000000).toFixed(1)}M</span>
                          <span className="text-sm text-red-600">Expenses: ${(year.expenses / 1000000).toFixed(1)}M</span>
                          <span className="text-sm text-blue-600">Profit: ${(year.profit / 1000000).toFixed(1)}M</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-purple-600">{year.margin}%</p>
                        <p className="text-xs text-gray-500">Margin</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case 'revenue-analytics':
        return (
          <div className="space-y-6">
            <DashboardFilters
              onFiltersChange={handleFiltersChange}
              dashboardType={activeItem}
            />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Revenue Analytics</h1>
              <p className="text-gray-600 mt-1">Detailed analysis of revenue streams and performance</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                    YTD Revenue
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">$24.8M</div>
                  <p className="text-sm text-green-600 mt-2">+15.3% YoY growth</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <DollarSign className="w-5 h-5 mr-2 text-blue-600" />
                    Average Order Value
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">$787</div>
                  <p className="text-sm text-blue-600 mt-2">+5.2% from last year</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="w-5 h-5 mr-2 text-purple-600" />
                    Revenue per Customer
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">$1,252</div>
                  <p className="text-sm text-purple-600 mt-2">+8.7% from last year</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue by Product Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { category: 'Bikes', revenue: 12400000, growth: 18.2, orders: 8750 },
                      { category: 'Components', revenue: 6800000, growth: 12.5, orders: 15420 },
                      { category: 'Clothing', revenue: 3200000, growth: 8.3, orders: 12300 },
                      { category: 'Accessories', revenue: 2400000, growth: 15.7, orders: 18950 },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{item.category}</p>
                          <p className="text-sm text-gray-600">{item.orders.toLocaleString()} orders</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${(item.revenue / 1000000).toFixed(1)}M</p>
                          <p className="text-sm text-green-600">+{item.growth}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Revenue by Territory</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { territory: 'North America', revenue: 14200000, growth: 16.8, customers: 8950 },
                      { territory: 'Europe', revenue: 6800000, growth: 12.3, customers: 6230 },
                      { territory: 'Asia', revenue: 2800000, growth: 22.1, customers: 3120 },
                      { territory: 'South America', revenue: 1000000, growth: 8.5, customers: 1520 },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{item.territory}</p>
                          <p className="text-sm text-gray-600">{item.customers.toLocaleString()} customers</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${(item.revenue / 1000000).toFixed(1)}M</p>
                          <p className="text-sm text-green-600">+{item.growth}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      case 'expense-management':
        return (
          <div className="space-y-6">
            <DashboardFilters
              onFiltersChange={handleFiltersChange}
              dashboardType={activeItem}
            />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Expense Management</h1>
              <p className="text-gray-600 mt-1">Track and control organizational expenses</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="w-5 h-5 mr-2 text-red-600" />
                    Total Expenses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">$18.2M</div>
                  <p className="text-sm text-red-600 mt-2">+8.7% YoY</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingDown className="w-5 h-5 mr-2 text-green-600" />
                    Cost Savings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">$1.2M</div>
                  <p className="text-sm text-green-600 mt-2">+24.5% YoY</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Receipt className="w-5 h-5 mr-2 text-blue-600" />
                    Pending Expenses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">$342K</div>
                  <p className="text-sm text-blue-600 mt-2">47 approvals</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calculator className="w-5 h-5 mr-2 text-purple-600" />
                    Expense Ratio
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">73.4%</div>
                  <p className="text-sm text-green-600 mt-2">-2.1% YoY</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top Expense Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { category: 'Cost of Goods Sold', amount: 8900000, budget: 9200000, variance: -3.3, trend: 'down' },
                      { category: 'Salaries & Benefits', amount: 5200000, budget: 5100000, variance: 2.0, trend: 'up' },
                      { category: 'Operating Expenses', amount: 2400000, budget: 2500000, variance: -4.0, trend: 'down' },
                      { category: 'Marketing & Sales', amount: 1700000, budget: 1600000, variance: 6.3, trend: 'up' },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{item.category}</p>
                          <p className="text-sm text-gray-600">
                            Budget: ${(item.budget / 1000000).toFixed(1)}M
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${(item.amount / 1000000).toFixed(1)}M</p>
                          <p className={`text-sm flex items-center justify-end ${
                            item.variance < 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {item.variance < 0 ? <ArrowDownRight className="h-3 w-3 mr-1" /> : <ArrowUpRight className="h-3 w-3 mr-1" />}
                            {Math.abs(item.variance)}%
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Expense Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { id: 'EXP-2024-089', employee: 'John Smith', department: 'Sales', amount: 2450.00, status: 'approved', date: '2024-01-15' },
                      { id: 'EXP-2024-088', employee: 'Sarah Johnson', department: 'Marketing', amount: 1280.50, status: 'pending', date: '2024-01-14' },
                      { id: 'EXP-2024-087', employee: 'Michael Chen', department: 'Engineering', amount: 3875.25, status: 'rejected', date: '2024-01-14' },
                      { id: 'EXP-2024-086', employee: 'Emily Davis', department: 'HR', amount: 950.00, status: 'approved', date: '2024-01-13' },
                    ].map((expense, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <div>
                          <p className="font-medium">{expense.id}</p>
                          <p className="text-sm text-gray-600">{expense.employee} - {expense.department}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${expense.amount.toFixed(2)}</p>
                          <div className="flex items-center justify-end space-x-2 mt-1">
                            <Badge 
                              variant={
                                expense.status === 'approved' ? 'default' :
                                expense.status === 'pending' ? 'secondary' : 'destructive'
                              }
                              className="text-xs"
                            >
                              {expense.status}
                            </Badge>
                            <span className="text-xs text-gray-500">{expense.date}</span>
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

      case 'budget-vs-actual':
        return (
          <div className="space-y-6">
            <DashboardFilters
              onFiltersChange={handleFiltersChange}
              dashboardType={activeItem}
            />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Budget vs Actual</h1>
              <p className="text-gray-600 mt-1">Compare budgeted performance with actual results</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                    Budget Variance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">+$2.1M</div>
                  <p className="text-sm text-green-600 mt-2">8.5% under budget</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="w-5 h-5 mr-2 text-blue-600" />
                    Budget Achievement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">108.5%</div>
                  <p className="text-sm text-blue-600 mt-2">Revenue target exceeded</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calculator className="w-5 h-5 mr-2 text-purple-600" />
                    Remaining Budget
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">$3.8M</div>
                  <p className="text-sm text-purple-600 mt-2">15.2% of annual budget</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Department Budget Performance</CardTitle>
                <CardDescription>Year-to-date budget vs actual spending by department</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {[
                    { 
                      department: 'Sales', 
                      budget: 4500000, 
                      actual: 4200000, 
                      variance: -6.7, 
                      remaining: 300000,
                      status: 'good'
                    },
                    { 
                      department: 'Marketing', 
                      budget: 2800000, 
                      actual: 3100000, 
                      variance: 10.7, 
                      remaining: -300000,
                      status: 'warning'
                    },
                    { 
                      department: 'Engineering', 
                      budget: 6200000, 
                      actual: 5800000, 
                      variance: -6.5, 
                      remaining: 400000,
                      status: 'good'
                    },
                    { 
                      department: 'Operations', 
                      budget: 3500000, 
                      actual: 3400000, 
                      variance: -2.9, 
                      remaining: 100000,
                      status: 'good'
                    },
                    { 
                      department: 'HR', 
                      budget: 1800000, 
                      actual: 1700000, 
                      variance: -5.6, 
                      remaining: 100000,
                      status: 'good'
                    },
                  ].map((dept, index) => (
                    <div key={index} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">{dept.department}</h4>
                          <p className="text-sm text-gray-600">
                            Budget: ${(dept.budget / 1000000).toFixed(1)}M | 
                            Actual: ${(dept.actual / 1000000).toFixed(1)}M
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge 
                            variant={dept.status === 'good' ? 'default' : 'destructive'}
                            className="mb-1"
                          >
                            {dept.variance > 0 ? '+' : ''}{dept.variance}%
                          </Badge>
                          <p className="text-sm text-gray-600">
                            Remaining: ${(dept.remaining / 1000000).toFixed(1)}M
                          </p>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full ${
                            dept.status === 'good' ? 'bg-green-600' : 'bg-red-600'
                          }`}
                          style={{ width: `${Math.min((dept.actual / dept.budget) * 100, 100)}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>0%</span>
                        <span>{((dept.actual / dept.budget) * 100).toFixed(1)}% used</span>
                        <span>100%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Additional Budget Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PieChart className="w-5 h-5 mr-2 text-blue-600" />
                    Budget Allocation
                  </CardTitle>
                  <CardDescription>How the annual budget is distributed</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { category: 'Engineering', budget: 6200000, percentage: 35.2, color: 'bg-blue-600' },
                      { category: 'Sales', budget: 4500000, percentage: 25.6, color: 'bg-green-600' },
                      { category: 'Marketing', budget: 2800000, percentage: 15.9, color: 'bg-purple-600' },
                      { category: 'Operations', budget: 3500000, percentage: 19.9, color: 'bg-orange-600' },
                      { category: 'HR', budget: 1800000, percentage: 10.2, color: 'bg-pink-600' },
                    ].map((item, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{item.category}</span>
                          <span className="text-gray-600">${(item.budget / 1000000).toFixed(1)}M ({item.percentage}%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`${item.color} h-2 rounded-full`}
                            style={{ width: `${item.percentage * 2.5}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                    Monthly Budget Trend
                  </CardTitle>
                  <CardDescription>Budget vs actual over the last 6 months</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { month: 'Jun', budget: 1450000, actual: 1380000, variance: -4.8 },
                      { month: 'May', budget: 1450000, actual: 1420000, variance: -2.1 },
                      { month: 'Apr', budget: 1450000, actual: 1510000, variance: 4.1 },
                      { month: 'Mar', budget: 1450000, actual: 1390000, variance: -4.1 },
                      { month: 'Feb', budget: 1450000, actual: 1480000, variance: 2.1 },
                      { month: 'Jan', budget: 1450000, actual: 1430000, variance: -1.4 },
                    ].map((month, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-sm font-medium w-8">{month.month}</span>
                          <div className="flex-1">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  month.actual <= month.budget ? 'bg-green-600' : 'bg-red-600'
                                }`}
                                style={{ width: `${(month.actual / month.budget) * 80}%` }}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">${(month.actual / 1000000).toFixed(1)}M</p>
                          <p className={`text-xs ${month.variance < 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {month.variance > 0 ? '+' : ''}{month.variance}%
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Budget Forecast */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="w-5 h-5 mr-2 text-purple-600" />
                  Budget Forecast & Recommendations
                </CardTitle>
                <CardDescription>AI-powered budget analysis and recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Q3 2024 Forecast</h4>
                    <p className="text-2xl font-bold text-blue-900">$4.3M</p>
                    <p className="text-sm text-blue-700 mt-1">Expected spend based on trends</p>
                    <div className="mt-3 space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Engineering:</span>
                        <span>$1.5M</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>Sales:</span>
                        <span>$1.1M</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>Other Depts:</span>
                        <span>$1.7M</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">Savings Opportunities</h4>
                    <p className="text-2xl font-bold text-green-900">$340K</p>
                    <p className="text-sm text-green-700 mt-1">Potential annual savings</p>
                    <div className="mt-3 space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Marketing Opt:</span>
                        <span>$180K</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>Operations:</span>
                        <span>$95K</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>Cloud Services:</span>
                        <span>$65K</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <h4 className="font-semibold text-orange-800 mb-2">Budget Alerts</h4>
                    <p className="text-2xl font-bold text-orange-900">2</p>
                    <p className="text-sm text-orange-700 mt-1">Departments need attention</p>
                    <div className="mt-3 space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>⚠️ Marketing:</span>
                        <span>10.7% over</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>⚠️ Engineering Q4:</span>
                        <span>Risk of overrun</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case 'financial-reports':
        return (
          <div className="space-y-6">
            <DashboardFilters
              onFiltersChange={handleFiltersChange}
              dashboardType={activeItem}
            />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Financial Reports</h1>
              <p className="text-gray-600 mt-1">Generate and view comprehensive financial reports</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-blue-600" />
                    P&L Statement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Q4 2023</div>
                  <p className="text-sm text-blue-600 mt-2">Ready to view</p>
                  <Button size="sm" className="mt-2 w-full">Download PDF</Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Receipt className="w-5 h-5 mr-2 text-green-600" />
                    Balance Sheet
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Dec 2023</div>
                  <p className="text-sm text-green-600 mt-2">Updated today</p>
                  <Button size="sm" className="mt-2 w-full">Download PDF</Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-purple-600" />
                    Cash Flow
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">YTD 2023</div>
                  <p className="text-sm text-purple-600 mt-2">Positive flow</p>
                  <Button size="sm" className="mt-2 w-full">Download PDF</Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calculator className="w-5 h-5 mr-2 text-orange-600" />
                    Annual Report
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2023</div>
                  <p className="text-sm text-orange-600 mt-2">In progress</p>
                  <Button size="sm" className="mt-2 w-full" variant="outline">Coming Soon</Button>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Income Statement Summary</CardTitle>
                  <CardDescription>Year-to-date performance overview</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between pb-2 border-b">
                      <span className="font-medium">Total Revenue</span>
                      <span className="font-medium text-green-600">$24,800,000</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Cost of Goods Sold</span>
                      <span className="text-red-600">-$8,900,000</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Gross Profit</span>
                      <span className="text-green-600">$15,900,000</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Operating Expenses</span>
                      <span className="text-red-600">-$9,300,000</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Operating Income</span>
                      <span className="text-green-600">$6,600,000</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Taxes</span>
                      <span className="text-red-600">-$1,320,000</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t font-semibold">
                      <span>Net Income</span>
                      <span className="text-green-600">$5,280,000</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Key Financial Ratios</CardTitle>
                  <CardDescription>Important performance indicators</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { ratio: 'Gross Margin', value: '64.1%', benchmark: '60%', status: 'good' },
                      { ratio: 'Operating Margin', value: '26.6%', benchmark: '25%', status: 'good' },
                      { ratio: 'Net Profit Margin', value: '21.3%', benchmark: '20%', status: 'good' },
                      { ratio: 'Current Ratio', value: '2.4', benchmark: '2.0', status: 'good' },
                      { ratio: 'Debt-to-Equity', value: '0.3', benchmark: '0.5', status: 'excellent' },
                      { ratio: 'Return on Equity', value: '18.7%', benchmark: '15%', status: 'good' },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{item.ratio}</p>
                          <p className="text-xs text-gray-600">Benchmark: {item.benchmark}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{item.value}</p>
                          <Badge 
                            variant={item.status === 'excellent' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {item.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      case 'cash-flow':
        return (
          <div className="space-y-6">
            <DashboardFilters
              onFiltersChange={handleFiltersChange}
              dashboardType={activeItem}
            />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Cash Flow Management</h1>
              <p className="text-gray-600 mt-1">Monitor and manage cash flow across the organization</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Wallet className="w-5 h-5 mr-2 text-green-600" />
                    Cash Balance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">$8.7M</div>
                  <p className="text-sm text-green-600 mt-2">+12.5% this month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                    Cash Inflow
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">$3.2M</div>
                  <p className="text-sm text-blue-600 mt-2">This month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingDown className="w-5 h-5 mr-2 text-red-600" />
                    Cash Outflow
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">$2.1M</div>
                  <p className="text-sm text-red-600 mt-2">This month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <DollarSign className="w-5 h-5 mr-2 text-purple-600" />
                    Net Cash Flow
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">$1.1M</div>
                  <p className="text-sm text-green-600 mt-2">Positive this month</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Cash Flow Statement</CardTitle>
                  <CardDescription>Monthly cash flow breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-green-600">Operating Activities</h4>
                      <div className="pl-4 space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Net Income</span>
                          <span>+$5,280,000</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Depreciation</span>
                          <span>+$450,000</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Accounts Receivable</span>
                          <span>-$320,000</span>
                        </div>
                        <div className="flex justify-between text-sm font-semibold">
                          <span>Net Operating Cash</span>
                          <span className="text-green-600">+$5,410,000</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-semibold text-blue-600">Investing Activities</h4>
                      <div className="pl-4 space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Equipment Purchase</span>
                          <span>-$1,200,000</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Asset Sales</span>
                          <span>+$150,000</span>
                        </div>
                        <div className="flex justify-between text-sm font-semibold">
                          <span>Net Investing Cash</span>
                          <span className="text-red-600">-$1,050,000</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-semibold text-purple-600">Financing Activities</h4>
                      <div className="pl-4 space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Loan Repayment</span>
                          <span>-$500,000</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Dividends Paid</span>
                          <span>-$800,000</span>
                        </div>
                        <div className="flex justify-between text-sm font-semibold">
                          <span>Net Financing Cash</span>
                          <span className="text-red-600">-$1,300,000</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-2 border-t">
                      <div className="flex justify-between font-semibold">
                        <span>Net Cash Flow</span>
                        <span className="text-green-600">+$3,060,000</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Cash Requirements</CardTitle>
                  <CardDescription>Next 30 days cash outflow forecast</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { item: 'Payroll', amount: 850000, date: '2024-01-25', priority: 'high' },
                      { item: 'Vendor Payments', amount: 420000, date: '2024-01-28', priority: 'high' },
                      { item: 'Tax Payment', amount: 320000, date: '2024-01-30', priority: 'medium' },
                      { item: 'Rent & Utilities', amount: 125000, date: '2024-02-01', priority: 'medium' },
                      { item: 'Insurance Premium', amount: 78000, date: '2024-02-05', priority: 'low' },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <div>
                          <p className="font-medium">{item.item}</p>
                          <p className="text-sm text-gray-600">Due: {item.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${(item.amount / 1000).toFixed(0)}K</p>
                          <Badge 
                            variant={
                              item.priority === 'high' ? 'destructive' :
                              item.priority === 'medium' ? 'secondary' : 'outline'
                            }
                            className="text-xs"
                          >
                            {item.priority}
                          </Badge>
                        </div>
                      </div>
                    ))}
                    <div className="pt-2 border-t">
                      <div className="flex justify-between font-semibold">
                        <span>Total Required</span>
                        <span className="text-red-600">$1,793,000</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )

    case 'settings':
        return <SettingsDashboard />
      case 'employees':
        return (
          <div className="space-y-6">
            <DashboardFilters
              onFiltersChange={handleFiltersChange}
              dashboardType={activeItem}
            />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Human Resources</h1>
              <p className="text-gray-600 mt-1">Manage employees and organizational structure</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {employeeStats.map((stat, index) => (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </CardTitle>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-green-600 mt-1">
                      {stat.change} from last month
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Department Overview</CardTitle>
                  <CardDescription>Employee distribution across departments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { name: 'Engineering', employees: 85, budget: '$2.1M', growth: 8.3, avgSalary: 75000 },
                      { name: 'Sales', employees: 67, budget: '$1.8M', growth: 12.1, avgSalary: 68000 },
                      { name: 'Marketing', employees: 42, budget: '$1.2M', growth: 5.2, avgSalary: 62000 },
                      { name: 'Human Resources', employees: 28, budget: '$0.8M', growth: 3.1, avgSalary: 58000 },
                      { name: 'Finance', employees: 35, budget: '$1.1M', growth: 6.7, avgSalary: 70000 },
                      { name: 'Operations', employees: 33, budget: '$1.0M', growth: 9.4, avgSalary: 55000 },
                    ].map((dept, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-medium">{dept.name}</p>
                            <Badge variant="outline">{dept.employees} employees</Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                            <span>Budget: {dept.budget}</span>
                            <span>Avg Salary: ${(dept.avgSalary / 1000).toFixed(0)}K</span>
                            <span>Growth: +{dept.growth}%</span>
                            <span>Headcount: {dept.employees}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Hires</CardTitle>
                  <CardDescription>Latest team members joining AdventureWorks</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { name: 'John Smith', position: 'Software Engineer', department: 'Engineering', date: '2024-01-10', level: 'Senior', salary: 85000 },
                      { name: 'Sarah Johnson', position: 'Sales Manager', department: 'Sales', date: '2024-01-08', level: 'Senior', salary: 92000 },
                      { name: 'Michael Chen', position: 'Marketing Analyst', department: 'Marketing', date: '2024-01-05', level: 'Junior', salary: 58000 },
                      { name: 'Emily Davis', position: 'HR Specialist', department: 'Human Resources', date: '2024-01-03', level: 'Mid', salary: 65000 },
                      { name: 'Robert Wilson', position: 'DevOps Engineer', department: 'Engineering', date: '2024-01-02', level: 'Senior', salary: 88000 },
                    ].map((employee, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-medium">{employee.name}</p>
                            <Badge variant={employee.level === 'Senior' ? 'default' : 'secondary'} className="text-xs">
                              {employee.level}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">{employee.position}</p>
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>{employee.department}</span>
                            <span>${(employee.salary / 1000).toFixed(0)}K</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">{employee.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Additional HR Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                    Employee Retention
                  </CardTitle>
                  <CardDescription>Retention rates by department</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { department: 'Engineering', rate: 94.2, trend: '+2.1%' },
                      { department: 'Sales', rate: 88.7, trend: '+1.8%' },
                      { department: 'Marketing', rate: 91.3, trend: '+3.2%' },
                      { department: 'HR', rate: 96.1, trend: '+0.8%' },
                      { department: 'Finance', rate: 92.8, trend: '+1.5%' },
                    ].map((dept, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{dept.department}</span>
                          <span className="text-green-600">{dept.rate}% {dept.trend}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full"
                            style={{ width: `${dept.rate}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="w-5 h-5 mr-2 text-blue-600" />
                    Diversity Metrics
                  </CardTitle>
                  <CardDescription>Workforce diversity overview</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-2xl font-bold text-blue-900">42%</p>
                        <p className="text-xs text-blue-700">Female</p>
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg">
                        <p className="text-2xl font-bold text-green-900">58%</p>
                        <p className="text-xs text-green-700">Male</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Underrepresented Groups</span>
                        <span className="font-medium">28%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Veterans</span>
                        <span className="font-medium">12%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>International</span>
                        <span className="font-medium">35%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="w-5 h-5 mr-2 text-purple-600" />
                    Performance Distribution
                  </CardTitle>
                  <CardDescription>Employee performance ratings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { rating: 'Exceptional', count: 45, percentage: 15.5, color: 'bg-green-600' },
                      { rating: 'Exceeds Expectations', count: 98, percentage: 33.8, color: 'bg-blue-600' },
                      { rating: 'Meets Expectations', count: 110, percentage: 37.9, color: 'bg-gray-600' },
                      { rating: 'Needs Improvement', count: 28, percentage: 9.7, color: 'bg-yellow-600' },
                      { rating: 'Unsatisfactory', count: 9, percentage: 3.1, color: 'bg-red-600' },
                    ].map((perf, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{perf.rating}</span>
                          <span className="text-gray-600">{perf.count} ({perf.percentage}%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`${perf.color} h-2 rounded-full`}
                            style={{ width: `${perf.percentage * 2}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Salary Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="w-5 h-5 mr-2 text-orange-600" />
                  Salary Analysis & Benchmarking
                </CardTitle>
                <CardDescription>Comprehensive compensation analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900">$68,500</p>
                    <p className="text-sm text-gray-600 mt-1">Average Salary</p>
                    <p className="text-xs text-green-600 mt-1">+5.2% YoY</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900">$45,000</p>
                    <p className="text-sm text-gray-600 mt-1">Entry Level</p>
                    <p className="text-xs text-blue-600 mt-1">25th percentile</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900">$92,000</p>
                    <p className="text-sm text-gray-600 mt-1">Senior Level</p>
                    <p className="text-xs text-purple-600 mt-1">75th percentile</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900">$4.2M</p>
                    <p className="text-sm text-gray-600 mt-1">Annual Payroll</p>
                    <p className="text-xs text-orange-600 mt-1">+8.7% YoY</p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h4 className="font-semibold mb-3">Salary by Department (Average)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { dept: 'Engineering', avg: 75000, median: 72000, range: '$55K - $120K' },
                      { dept: 'Sales', avg: 68000, median: 65000, range: '$45K - $95K + commission' },
                      { dept: 'Marketing', avg: 62000, median: 60000, range: '$42K - $85K' },
                      { dept: 'Finance', avg: 70000, median: 68000, range: '$50K - $95K' },
                      { dept: 'HR', avg: 58000, median: 56000, range: '$40K - $75K' },
                      { dept: 'Operations', avg: 55000, median: 53000, range: '$38K - $70K' },
                    ].map((dept, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <h5 className="font-medium">{dept.dept}</h5>
                        <div className="text-sm text-gray-600 mt-1">
                          <div>Avg: ${(dept.avg / 1000).toFixed(0)}K</div>
                          <div>Median: ${(dept.median / 1000).toFixed(0)}K</div>
                          <div>Range: {dept.range}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case 'departments':
        return (
          <div className="space-y-6">
            <DashboardFilters
              onFiltersChange={handleFiltersChange}
              dashboardType={activeItem}
            />
            <DepartmentsDashboard />
          </div>
        )
      case 'job-candidates':
        return (
          <div className="space-y-6">
            <DashboardFilters
              onFiltersChange={handleFiltersChange}
              dashboardType={activeItem}
            />
            <JobCandidatesDashboard />
          </div>
        )
      case 'products':
        return (
          <div className="space-y-6">
            <DashboardFilters
              onFiltersChange={handleFiltersChange}
              dashboardType={activeItem}
            />
            <ProductDashboard filters={filters} />
          </div>
        )
      
      case 'product-list':
        return (
          <div className="space-y-6">
            <DashboardFilters
              onFiltersChange={handleFiltersChange}
              dashboardType={activeItem}
            />
            <ProductListDashboard filters={filters} />
          </div>
        )
      
      case 'categories':
        return (
          <div className="space-y-6">
            <DashboardFilters
              onFiltersChange={handleFiltersChange}
              dashboardType={activeItem}
            />
            <CategoriesDashboard filters={filters} />
          </div>
        )
      
      case 'customer-analytics':
        return (
          <div className="space-y-6">
            <DashboardFilters
              onFiltersChange={handleFiltersChange}
              dashboardType={activeItem}
            />
            <CustomerAnalyticsDashboard filters={filters} />
          </div>
        )

      case 'purchasing':
        return (
          <div className="space-y-6">
            <DashboardFilters
              onFiltersChange={handleFiltersChange}
              dashboardType={activeItem}
            />
            <PurchasingDashboard filters={filters} />
          </div>
        )
      case 'vendors':
        return (
          <div className="space-y-6">
            <DashboardFilters 
              onFiltersChange={handleFiltersChange} 
              dashboardType={activeItem}
            />
            
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Vendor Management</h1>
              <p className="text-gray-600 mt-1">Supplier relationships and performance tracking {filters.dateRange === '2011-2014' ? '(2011-2014)' : `(${filters.dateRange})`}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Building className="w-5 h-5 mr-2 text-blue-600" />
                    Total Vendors
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">104</div>
                  <p className="text-sm text-blue-600 mt-2">Active suppliers</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Truck className="w-5 h-5 mr-2 text-green-600" />
                    Active Vendors
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">89</div>
                  <p className="text-sm text-green-600 mt-2">86% of total</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-purple-600" />
                    Avg Lead Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">14</div>
                  <p className="text-sm text-purple-600 mt-2">Days</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <DollarSign className="w-5 h-5 mr-2 text-orange-600" />
                    Total Spend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">$18.5M</div>
                  <p className="text-sm text-orange-600 mt-2">2011-2014</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top Vendors by Spend</CardTitle>
                  <CardDescription>Highest-value supplier partnerships (2011-2014)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: 'International Components', spend: 2400000, orders: 890, rating: 4.7, leadTime: 12 },
                      { name: 'Global Bike Supplies', spend: 1850000, orders: 650, rating: 4.5, leadTime: 14 },
                      { name: 'Pro Manufacturing', spend: 1520000, orders: 420, rating: 4.8, leadTime: 10 },
                      { name: 'Quality Parts Inc', spend: 1280000, orders: 380, rating: 4.3, leadTime: 16 },
                      { name: 'Speed Components', spend: 980000, orders: 290, rating: 4.6, leadTime: 11 },
                    ].map((vendor, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{vendor.name}</p>
                          <p className="text-sm text-gray-600">{vendor.orders} orders • {vendor.leadTime} days lead time</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${(vendor.spend / 1000000).toFixed(1)}M</p>
                          <div className="flex items-center justify-end space-x-2 mt-1">
                            <span className="text-xs text-yellow-600">★ {vendor.rating}</span>
                            <Badge variant="outline" className="text-xs">Top {index + 1}</Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Vendor Performance Metrics</CardTitle>
                  <CardDescription>Key performance indicators for supplier evaluation</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <p className="text-xl font-bold text-green-800">96.2%</p>
                        <p className="text-sm text-green-600">On-Time Delivery</p>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <p className="text-xl font-bold text-blue-800">98.7%</p>
                        <p className="text-sm text-blue-600">Quality Score</p>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <p className="text-xl font-bold text-purple-800">14.2</p>
                        <p className="text-sm text-purple-600">Avg Lead Time (days)</p>
                      </div>
                      <div className="text-center p-3 bg-orange-50 rounded-lg">
                        <p className="text-xl font-bold text-orange-800">4.5</p>
                        <p className="text-sm text-orange-600">Avg Vendor Rating</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      case 'purchase-orders':
        return (
          <div className="space-y-6">
            <DashboardFilters 
              onFiltersChange={handleFiltersChange} 
              dashboardType={activeItem}
            />
            
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Purchase Orders</h1>
              <p className="text-gray-600 mt-1">Purchase order management and tracking {filters.dateRange === '2011-2014' ? '(2011-2014)' : `(${filters.dateRange})`}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-blue-600" />
                    Total POs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">4,012</div>
                  <p className="text-sm text-blue-600 mt-2">2011-2014</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                    Completed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">3,647</div>
                  <p className="text-sm text-green-600 mt-2">90.9% completion</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-yellow-600" />
                    Pending
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">234</div>
                  <p className="text-sm text-yellow-600 mt-2">Awaiting delivery</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <DollarSign className="w-5 h-5 mr-2 text-orange-600" />
                    Total Value
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">$18.5M</div>
                  <p className="text-sm text-orange-600 mt-2">Total spend</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Purchase Orders</CardTitle>
                <CardDescription>Latest purchase order activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { id: 'PO51234', vendor: 'International Components', amount: 45780.50, status: 'completed', date: '2024-01-15', items: 45 },
                    { id: 'PO51233', vendor: 'Global Bike Supplies', amount: 23450.25, status: 'pending', date: '2024-01-14', items: 28 },
                    { id: 'PO51232', vendor: 'Pro Manufacturing', amount: 67890.00, status: 'processing', date: '2024-01-14', items: 67 },
                    { id: 'PO51231', vendor: 'Quality Parts Inc', amount: 12340.75, status: 'completed', date: '2024-01-13', items: 19 },
                    { id: 'PO51230', vendor: 'Speed Components', amount: 34560.50, status: 'pending', date: '2024-01-13', items: 34 },
                  ].map((po, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-50 rounded flex items-center justify-center">
                          <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">{po.id}</p>
                          <p className="text-sm text-gray-600">{po.vendor} • {po.items} items</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${po.amount.toLocaleString()}</p>
                        <div className="flex items-center justify-end space-x-2 mt-1">
                          <Badge 
                            variant={
                              po.status === 'completed' ? 'default' :
                              po.status === 'processing' ? 'secondary' : 'outline'
                            }
                            className="text-xs"
                          >
                            {po.status}
                          </Badge>
                          <span className="text-xs text-gray-500">{po.date}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case 'vendor-performance':
        return (
          <div className="space-y-6">
            <DashboardFilters 
              onFiltersChange={handleFiltersChange} 
              dashboardType={activeItem}
            />
            
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Vendor Performance Analysis</h1>
              <p className="text-gray-600 mt-1">Comprehensive supplier performance metrics and analytics {filters.dateRange === '2011-2014' ? '(2011-2014)' : `(${filters.dateRange})`}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                    Performance Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">87.3</div>
                  <p className="text-sm text-green-600 mt-2">Out of 100</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2 text-blue-600" />
                    On-Time Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">94.2%</div>
                  <p className="text-sm text-blue-600 mt-2">+2.1% YoY</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="w-5 h-5 mr-2 text-purple-600" />
                    Quality Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">96.8%</div>
                  <p className="text-sm text-purple-600 mt-2">Excellent</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingDown className="w-5 h-5 mr-2 text-orange-600" />
                    Cost Savings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">$1.2M</div>
                  <p className="text-sm text-orange-600 mt-2">Annual savings</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Vendor Ranking</CardTitle>
                  <CardDescription>Top performing vendors by overall score</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: 'Pro Manufacturing', score: 94.5, onTime: 98.2, quality: 96.8, cost: 92.1 },
                      { name: 'International Components', score: 91.3, onTime: 95.7, quality: 94.2, cost: 88.9 },
                      { name: 'Speed Components', score: 89.7, onTime: 92.3, quality: 91.5, cost: 89.8 },
                      { name: 'Global Bike Supplies', score: 87.2, onTime: 90.8, quality: 89.3, cost: 86.4 },
                      { name: 'Quality Parts Inc', score: 85.8, onTime: 88.9, quality: 92.1, cost: 82.3 },
                    ].map((vendor, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{vendor.name}</p>
                          <div className="flex items-center space-x-3 mt-1">
                            <span className="text-xs text-gray-600">On-time: {vendor.onTime}%</span>
                            <span className="text-xs text-gray-600">Quality: {vendor.quality}%</span>
                            <span className="text-xs text-gray-600">Cost: {vendor.cost}%</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{vendor.score}</p>
                          <Badge 
                            variant={vendor.score >= 90 ? 'default' : vendor.score >= 85 ? 'secondary' : 'outline'}
                            className="text-xs"
                          >
                            {vendor.score >= 90 ? 'Excellent' : vendor.score >= 85 ? 'Good' : 'Average'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Trends</CardTitle>
                  <CardDescription>Quarterly performance metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { quarter: 'Q4 2014', score: 87.3, onTime: 94.2, quality: 96.8, issues: 12 },
                      { quarter: 'Q3 2014', score: 85.7, onTime: 92.8, quality: 95.2, issues: 18 },
                      { quarter: 'Q2 2014', score: 86.9, onTime: 93.5, quality: 94.7, issues: 15 },
                      { quarter: 'Q1 2014', score: 84.2, onTime: 91.3, quality: 93.8, issues: 22 },
                    ].map((quarter, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{quarter.quarter}</p>
                          <p className="text-sm text-gray-600">{quarter.issues} issues reported</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{quarter.score}</p>
                          <div className="flex items-center justify-end space-x-2 mt-1">
                            <span className="text-xs text-green-600">On-time: {quarter.onTime}%</span>
                            <span className="text-xs text-blue-600">Quality: {quarter.quality}%</span>
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

      case 'territories':
        return (
          <div className="space-y-6">
            <DashboardFilters
              onFiltersChange={handleFiltersChange}
              dashboardType={activeItem}
            />
            <SalesTerritoryDashboard filters={filters} />
          </div>
        )

      case 'inventory':
        return (
          <div className="space-y-6">
            <DashboardFilters
              onFiltersChange={handleFiltersChange}
              dashboardType={activeItem}
            />
            <InventoryDashboard filters={filters} />
          </div>
        )

      case 'data-export':
        return <DataExport />

      case 'customers':
        return (
          <div className="space-y-6">
            <DashboardFilters 
              onFiltersChange={handleFiltersChange} 
              dashboardType={activeItem}
            />
            
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Customer Management</h1>
              <p className="text-gray-600 mt-1">Manage customer relationships and analyze customer data {filters.dateRange === '2011-2014' ? '(2011-2014)' : `(${filters.dateRange})`}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="w-5 h-5 mr-2 text-blue-600" />
                    Total Customers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">19,820</div>
                  <p className="text-sm text-blue-600 mt-2">+15.7% growth</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ShoppingCart className="w-5 h-5 mr-2 text-green-600" />
                    Active Customers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">14,264</div>
                  <p className="text-sm text-green-600 mt-2">72% of total</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-purple-600" />
                    New Customers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">2,847</div>
                  <p className="text-sm text-purple-600 mt-2">This year</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <DollarSign className="w-5 h-5 mr-2 text-orange-600" />
                    Avg Customer Value
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">$2,280</div>
                  <p className="text-sm text-orange-600 mt-2">+8.3% YoY</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top Customers by Revenue</CardTitle>
                  <CardDescription>Highest-value customers (2011-2014)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: 'A Bike Store', revenue: 890000, orders: 450, location: 'New York' },
                      { name: 'Progressive Sports', revenue: 720000, orders: 380, location: 'Chicago' },
                      { name: 'Riding Cycles', revenue: 650000, orders: 320, location: 'Los Angeles' },
                      { name: 'The Bike Shop', revenue: 580000, orders: 290, location: 'Seattle' },
                      { name: 'Cycle Merchants', revenue: 520000, orders: 260, location: 'Boston' },
                    ].map((customer, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{customer.name}</p>
                          <p className="text-sm text-gray-600">{customer.location} • {customer.orders} orders</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${(customer.revenue / 1000).toFixed(0)}K</p>
                          <Badge variant="outline" className="text-xs">Top {index + 1}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Customer Distribution</CardTitle>
                  <CardDescription>Customers by region and type</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-3">By Region</h4>
                      <div className="space-y-2">
                        {[
                          { region: 'North America', customers: 8950, percentage: 45.1 },
                          { region: 'Europe', customers: 6230, percentage: 31.4 },
                          { region: 'Asia', customers: 3120, percentage: 15.7 },
                          { region: 'South America', customers: 1520, percentage: 7.8 },
                        ].map((region, index) => (
                          <div key={index} className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span className="font-medium">{region.region}</span>
                              <span className="text-gray-600">{region.customers.toLocaleString()} ({region.percentage}%)</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${region.percentage * 2}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )


      default:
        return (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-600 mb-2">Coming Soon</h2>
              <p className="text-gray-500">This section is under development</p>
            </div>
          </div>
        )
    }
  }

  return (
    <ResponsiveContainer
      showSidebarToggle={true}
      sidebarCollapsed={isSidebarCollapsed}
      onSidebarToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
    >
      <div className="flex h-screen bg-gray-50">
        {/* Mobile Sidebar Overlay */}
        {!isSidebarCollapsed && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsSidebarCollapsed(true)}
          />
        )}
        
        {/* Sidebar */}
        <div className={cn(
          "fixed lg:relative h-full z-50 transition-transform duration-300",
          isSidebarCollapsed ? "-translate-x-full lg:translate-x-0" : "translate-x-0"
        )}>
          <Sidebar
            activeItem={activeItem}
            onItemChange={setActiveItem}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          />
        </div>
        
        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-4 lg:p-6">
            {renderContent()}
          </div>
        </div>
      </div>
      
      {/* Notification Center */}
      <NotificationCenter 
        isOpen={isNotificationsOpen} 
        onClose={() => setIsNotificationsOpen(false)} 
      />
    </ResponsiveContainer>
  )
}