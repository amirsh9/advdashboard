'use client'

import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { 
  Menu, 
  X, 
  ChevronLeft, 
  ChevronRight,
  Maximize2,
  Minimize2 
} from 'lucide-react'

interface ResponsiveContainerProps {
  children: React.ReactNode
  className?: string
  showSidebarToggle?: boolean
  sidebarCollapsed?: boolean
  onSidebarToggle?: () => void
}

export function ResponsiveContainer({ 
  children, 
  className,
  showSidebarToggle = true,
  sidebarCollapsed = false,
  onSidebarToggle
}: ResponsiveContainerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  return (
    <div className={cn(
      "min-h-screen bg-gray-50 transition-all duration-300",
      isFullscreen && "fixed inset-0 z-50 bg-white",
      className
    )}>
      {/* Mobile Action Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {showSidebarToggle && onSidebarToggle && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onSidebarToggle}
                className="p-2"
              >
                {sidebarCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
              </Button>
            )}
            <h1 className="text-lg font-semibold text-gray-900">AdventureWorks</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleFullscreen}
              className="p-2"
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop Action Bar */}
      <div className="hidden lg:flex fixed top-4 right-4 z-30 items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleFullscreen}
          className="shadow-sm"
        >
          {isFullscreen ? <Minimize2 className="h-4 w-4 mr-2" /> : <Maximize2 className="h-4 w-4 mr-2" />}
          {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        </Button>
      </div>

      {/* Main Content with Mobile Padding */}
      <div className="pt-14 lg:pt-0">
        {children}
      </div>

      {/* Mobile Bottom Navigation (Optional Enhancement) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-40">
        <div className="grid grid-cols-4 gap-1 p-2">
          {[
            { icon: Menu, label: 'Menu', action: onSidebarToggle },
            { icon: ChevronLeft, label: 'Back', action: () => window.history.back() },
            { icon: Maximize2, label: 'Full', action: toggleFullscreen },
            { icon: ChevronRight, label: 'Forward', action: () => window.history.forward() },
          ].map((item, index) => (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              onClick={item.action}
              className="flex flex-col items-center gap-1 h-16 p-2"
            >
              <item.icon className="h-4 w-4" />
              <span className="text-xs">{item.label}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}

interface ResponsiveGridProps {
  children: React.ReactNode
  className?: string
  cols?: {
    sm?: number
    md?: number
    lg?: number
    xl?: number
  }
  gap?: {
    sm?: string
    md?: string
    lg?: string
    xl?: string
  }
}

export function ResponsiveGrid({ 
  children, 
  className,
  cols = { sm: 1, md: 2, lg: 3, xl: 4 },
  gap = { sm: '4', md: '6', lg: '6', xl: '6' }
}: ResponsiveGridProps) {
  const gridClasses = [
    'grid',
    `grid-cols-${cols.sm || 1}`,
    cols.md && `md:grid-cols-${cols.md}`,
    cols.lg && `lg:grid-cols-${cols.lg}`,
    cols.xl && `xl:grid-cols-${cols.xl}`,
    `gap-${gap.sm || '4'}`,
    gap.md && `md:gap-${gap.md}`,
    gap.lg && `lg:gap-${gap.lg}`,
    gap.xl && `xl:gap-${gap.xl}`,
    className
  ].filter(Boolean).join(' ')

  return (
    <div className={gridClasses}>
      {children}
    </div>
  )
}

interface ResponsiveCardProps {
  children: React.ReactNode
  className?: string
  title?: string
  description?: string
  action?: React.ReactNode
  mobilePadding?: 'sm' | 'md' | 'lg'
}

export function ResponsiveCard({ 
  children, 
  className,
  title,
  description,
  action,
  mobilePadding = 'sm'
}: ResponsiveCardProps) {
  const paddingClasses = {
    sm: 'p-4 lg:p-6',
    md: 'p-6 lg:p-8',
    lg: 'p-8 lg:p-10'
  }

  return (
    <div className={cn(
      "bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200",
      className
    )}>
      {(title || description || action) && (
        <div className={cn(
          "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100",
          paddingClasses[mobilePadding]
        )}>
          <div className="flex-1 min-w-0">
            {title && (
              <h3 className="text-lg font-semibold text-gray-900 truncate">{title}</h3>
            )}
            {description && (
              <p className="text-sm text-gray-600 mt-1">{description}</p>
            )}
          </div>
          {action && (
            <div className="flex-shrink-0">
              {action}
            </div>
          )}
        </div>
      )}
      <div className={paddingClasses[mobilePadding]}>
        {children}
      </div>
    </div>
  )
}

interface MobileOptimizedTableProps {
  children: React.ReactNode
  className?: string
  title?: string
}

export function MobileOptimizedTable({ 
  children, 
  className,
  title
}: MobileOptimizedTableProps) {
  return (
    <div className={cn("bg-white rounded-lg border border-gray-200", className)}>
      {title && (
        <div className="px-4 py-3 border-b border-gray-100 lg:hidden">
          <h3 className="font-medium text-gray-900">{title}</h3>
        </div>
      )}
      <div className="overflow-x-auto">
        <div className="min-w-full">
          {children}
        </div>
      </div>
    </div>
  )
}