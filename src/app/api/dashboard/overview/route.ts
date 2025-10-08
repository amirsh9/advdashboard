import { NextResponse } from 'next/server'
import { executeQuery } from '@/lib/mssql'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const dateRange = searchParams.get('dateRange') || '2014'

    // Build date filter condition
    let dateCondition = ''
    if (dateRange !== '2011-2014') {
      if (dateRange === '2014') {
        dateCondition = "AND YEAR(soh.OrderDate) = 2014"
      } else if (dateRange === '2013') {
        dateCondition = "AND YEAR(soh.OrderDate) = 2013"
      } else if (dateRange === '2012') {
        dateCondition = "AND YEAR(soh.OrderDate) = 2012"
      } else if (dateRange === '2011') {
        dateCondition = "AND YEAR(soh.OrderDate) = 2011"
      }
    }

    // Get total sales
    const totalSalesQuery = `
      SELECT 
        SUM(soh.SubTotal) as TotalSales,
        COUNT(DISTINCT soh.SalesOrderID) as TotalOrders,
        COUNT(DISTINCT soh.CustomerID) as ActiveCustomers,
        COUNT(DISTINCT p.ProductID) as Products
      FROM Sales.SalesOrderHeader soh
      JOIN Sales.SalesOrderDetail sod ON soh.SalesOrderID = sod.SalesOrderID
      JOIN Production.Product p ON sod.ProductID = p.ProductID
      WHERE soh.Status IN (1, 2, 3, 4, 5)
        ${dateCondition}
    `

    // Get sales performance by region
    const salesPerformanceQuery = `
      SELECT 
        CASE 
          WHEN st.CountryRegionCode IN ('US', 'CA') THEN 'North America'
          WHEN st.CountryRegionCode IN ('GB', 'DE', 'FR') THEN 'Europe'
          WHEN st.CountryRegionCode IN ('AU') THEN 'Asia'
          ELSE 'Other'
        END as Region,
        SUM(soh.SubTotal) as Sales,
        SUM(st.SalesYTD) as Target
      FROM Sales.SalesTerritory st
      LEFT JOIN Sales.SalesOrderHeader soh ON st.TerritoryID = soh.TerritoryID
      WHERE soh.Status IN (1, 2, 3, 4, 5) OR soh.SalesOrderID IS NULL
        ${dateCondition}
      GROUP BY 
        CASE 
          WHEN st.CountryRegionCode IN ('US', 'CA') THEN 'North America'
          WHEN st.CountryRegionCode IN ('GB', 'DE', 'FR') THEN 'Europe'
          WHEN st.CountryRegionCode IN ('AU') THEN 'Asia'
          ELSE 'Other'
        END
    `

    // Get top products
    const topProductsQuery = `
      SELECT TOP 4
        p.Name as ProductName,
        SUM(sod.OrderQty) as TotalQuantity,
        SUM(sod.LineTotal) as Revenue
      FROM Sales.SalesOrderDetail sod
      JOIN Sales.SalesOrderHeader soh ON sod.SalesOrderID = soh.SalesOrderID
      JOIN Production.Product p ON sod.ProductID = p.ProductID
      WHERE soh.Status IN (1, 2, 3, 4, 5)
        ${dateCondition}
      GROUP BY p.Name
      ORDER BY Revenue DESC
    `

    // Get recent orders
    const recentOrdersQuery = `
      SELECT TOP 5
        soh.SalesOrderID,
        c.AccountNumber as Customer,
        soh.SubTotal as Amount,
        soh.Status,
        soh.OrderDate
      FROM Sales.SalesOrderHeader soh
      LEFT JOIN Sales.Customer c ON soh.CustomerID = c.CustomerID
      WHERE soh.Status IN (1, 2, 3, 4, 5)
        ${dateCondition}
      ORDER BY soh.OrderDate DESC
    `

    // Execute queries
    const totalSalesResult = await executeQuery(totalSalesQuery)
    const salesPerformanceResult = await executeQuery(salesPerformanceQuery)
    const topProductsResult = await executeQuery(topProductsQuery)
    const recentOrdersResult = await executeQuery(recentOrdersQuery)

    // Transform data
    const totalSalesData = totalSalesResult[0] || {}
    const salesPerformanceData = salesPerformanceResult || []
    const topProductsData = topProductsResult || []
    const recentOrdersData = recentOrdersResult || []

    // Format sales performance
    const salesPerformance = salesPerformanceData.map((row: any) => ({
      region: row.Region,
      sales: parseFloat(row.Sales) || 0,
      target: parseFloat(row.Target) || 0,
      percentage: row.Target > 0 ? ((parseFloat(row.Sales) || 0) / parseFloat(row.Target) * 100) : 0
    }))

    // Format top products
    const topProducts = topProductsData.map((row: any) => ({
      name: row.ProductName,
      sales: parseInt(row.TotalQuantity) || 0,
      revenue: parseFloat(row.Revenue) || 0,
      status: parseFloat(row.Revenue) > 150000 ? 'hot' : 'normal'
    }))

    // Format recent orders
    const recentOrders = recentOrdersData.map((row: any) => ({
      id: row.SalesOrderID,
      customer: row.Customer || 'Unknown',
      amount: parseFloat(row.Amount) || 0,
      status: row.Status === 5 ? 'completed' : row.Status === 3 ? 'processing' : 'pending',
      date: new Date(row.OrderDate).toISOString().split('T')[0]
    }))

    return NextResponse.json({
      summary: {
        totalSales: parseFloat(totalSalesData.TotalSales) || 0,
        totalOrders: parseInt(totalSalesData.TotalOrders) || 0,
        activeCustomers: parseInt(totalSalesData.ActiveCustomers) || 0,
        products: parseInt(totalSalesData.Products) || 0
      },
      salesPerformance,
      topProducts,
      recentOrders
    })

  } catch (error) {
    console.error('Error fetching overview data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch overview data' },
      { status: 500 }
    )
  }
}