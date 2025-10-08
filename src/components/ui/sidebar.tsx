'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Package,
  Truck,
  BarChart3,
  Settings,
  Menu,
  X,
  ChevronDown,
  Building,
  TrendingUp,
  Target,
  FileText,
  Database,
  DollarSign,
  CreditCard,
  PieChart as PieChartIcon,
  Receipt,
  TrendingDown,
  Calculator,
  Wallet,
  Download
} from 'lucide-react'

interface SidebarItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
  children?: SidebarItem[]
}

const sidebarItems: SidebarItem[] = [
  {
    id: 'overview',
    label: 'Overview',
    icon: LayoutDashboard,
  },
  {
    id: 'sales',
    label: 'Sales',
    icon: ShoppingCart,
    badge: 'New',
    children: [
      { id: 'sales-analytics', label: 'Sales Analytics', icon: BarChart3 },
      { id: 'orders', label: 'Orders', icon: FileText },
      { id: 'customers', label: 'Customers', icon: Users },
      { id: 'territories', label: 'Territories', icon: Target },
    ]
  },
  {
    id: 'finance',
    label: 'Finance',
    icon: DollarSign,
    badge: 'Updated',
    children: [
      { id: 'revenue-analytics', label: 'Revenue Analytics', icon: TrendingUp },
      { id: 'expense-management', label: 'Expense Management', icon: CreditCard },
      { id: 'budget-vs-actual', label: 'Budget vs Actual', icon: PieChartIcon },
      { id: 'financial-reports', label: 'Financial Reports', icon: Receipt },
      { id: 'cash-flow', label: 'Cash Flow', icon: Wallet },
    ]
  },
  {
    id: 'employees',
    label: 'Human Resources',
    icon: Users,
    children: [
      { id: 'employees', label: 'Employees', icon: Users },
      { id: 'departments', label: 'Departments', icon: Building },
      { id: 'job-candidates', label: 'Job Candidates', icon: Target },
    ]
  },
  {
    id: 'products',
    label: 'Products',
    icon: Package,
    children: [
      { id: 'product-list', label: 'Product List', icon: Package },
      { id: 'inventory', label: 'Inventory', icon: Database },
      { id: 'categories', label: 'Categories', icon: BarChart3 },
    ]
  },
  {
    id: 'purchasing',
    label: 'Purchasing',
    icon: Truck,
    children: [
      { id: 'vendors', label: 'Vendors', icon: Building },
      { id: 'purchase-orders', label: 'Purchase Orders', icon: FileText },
      { id: 'vendor-performance', label: 'Vendor Performance', icon: TrendingUp },
    ]
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
  },
]

interface SidebarProps {
  activeItem: string
  onItemChange: (itemId: string) => void
  isCollapsed: boolean
  onToggleCollapse: () => void
}

export function Sidebar({ activeItem, onItemChange, isCollapsed, onToggleCollapse }: SidebarProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>(['sales', 'finance', 'employees', 'products', 'purchasing'])

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }

  const handleItemClick = (itemId: string) => {
    onItemChange(itemId)
    if (sidebarItems.find(item => item.id === itemId)?.children) {
      toggleExpanded(itemId)
    }
  }

  const renderSidebarItem = (item: SidebarItem, level: number = 0) => {
    const isActive = activeItem === item.id
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedItems.includes(item.id)

    return (
      <div key={item.id}>
        <Button
          variant={isActive ? 'secondary' : 'ghost'}
          className={cn(
            'w-full justify-start mb-1',
            level > 0 && 'ml-4',
            isActive && 'bg-primary text-primary-foreground',
            isCollapsed && level === 0 && 'justify-center px-2'
          )}
          onClick={() => handleItemClick(item.id)}
        >
          <item.icon className={cn('h-4 w-4', isCollapsed && level === 0 ? 'mr-0' : 'mr-2')} />
          {!isCollapsed && (
            <>
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && (
                <Badge variant="destructive" className="ml-2 text-xs">
                  {item.badge}
                </Badge>
              )}
              {hasChildren && (
                <ChevronDown
                  className={cn(
                    'h-4 w-4 transition-transform',
                    isExpanded && 'rotate-180'
                  )}
                />
              )}
            </>
          )}
        </Button>
        
        {hasChildren && !isCollapsed && isExpanded && (
          <div className="mt-1">
            {item.children!.map(child => renderSidebarItem(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={cn(
      'flex flex-col h-full bg-background border-r transition-all duration-300',
      isCollapsed ? 'w-16' : 'w-64'
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        {!isCollapsed && (
          <div>
            <h2 className="text-lg font-semibold">AdventureWorks</h2>
            <p className="text-xs text-muted-foreground">Management System</p>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          className="ml-auto"
        >
          {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-2">
          {sidebarItems.map(item => renderSidebarItem(item))}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t">
        <Button
          variant="ghost"
          className={cn(
            'w-full justify-start',
            isCollapsed && 'justify-center px-2'
          )}
        >
          <Settings className={cn('h-4 w-4', isCollapsed ? 'mr-0' : 'mr-2')} />
          {!isCollapsed && <span>Settings</span>}
        </Button>
      </div>
    </div>
  )
}