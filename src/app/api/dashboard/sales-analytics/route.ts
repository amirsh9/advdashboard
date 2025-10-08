import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/mssql';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateRange = searchParams.get('dateRange') || '2014';
    
    // Build date filter condition
    let dateCondition = '';
    if (dateRange !== 'all') {
      if (dateRange === '2014') {
        dateCondition = "AND YEAR(soh.OrderDate) = 2014";
      } else if (dateRange === '2013') {
        dateCondition = "AND YEAR(soh.OrderDate) = 2013";
      } else if (dateRange === '2012') {
        dateCondition = "AND YEAR(soh.OrderDate) = 2012";
      } else if (dateRange === '2011') {
        dateCondition = "AND YEAR(soh.OrderDate) = 2011";
      }
    }
    
    // Get sales analytics summary metrics
    const salesSummaryQuery = `
      SELECT
        COUNT(*) AS TotalOrders,
        SUM(SubTotal) AS TotalRevenue,
        AVG(SubTotal) AS AverageOrderValue,
        COUNT(DISTINCT CustomerID) AS TotalCustomers
      FROM Sales.SalesOrderHeader soh
      WHERE soh.Status IN (1, 2, 3, 4) -- Active orders
      ${dateCondition}
    `;
    const salesSummary = await executeQuery(salesSummaryQuery);
    
    // Get monthly sales trend for the selected year
    let monthlyTrendQuery = '';
    if (dateRange === 'all') {
      monthlyTrendQuery = `
        SELECT
          DATENAME(MONTH, OrderDate) AS Month,
          COUNT(*) AS Orders,
          SUM(SubTotal) AS Revenue,
          COUNT(DISTINCT CustomerID) AS Customers
        FROM Sales.SalesOrderHeader soh
        WHERE soh.Status IN (1, 2, 3, 4)
        GROUP BY YEAR(soh.OrderDate), MONTH(soh.OrderDate), DATENAME(MONTH, OrderDate)
        ORDER BY YEAR(soh.OrderDate), MONTH(soh.OrderDate)
      `;
    } else {
      monthlyTrendQuery = `
        SELECT
          DATENAME(MONTH, soh.OrderDate) AS Month,
          COUNT(*) AS Orders,
          SUM(soh.SubTotal) AS Revenue,
          COUNT(DISTINCT soh.CustomerID) AS Customers
        FROM Sales.SalesOrderHeader soh
        WHERE soh.Status IN (1, 2, 3, 4)
        ${dateCondition}
        GROUP BY MONTH(soh.OrderDate), DATENAME(MONTH, soh.OrderDate)
        ORDER BY MONTH(soh.OrderDate)
      `;
    }
    const monthlyTrend = await executeQuery(monthlyTrendQuery);
    
    // Get top products by revenue
    const topProductsQuery = `
      SELECT TOP 5
        p.Name AS ProductName,
        SUM(sod.LineTotal) AS Revenue,
        SUM(sod.OrderQty) AS Quantity,
        (
          SELECT SUM(LineTotal) 
          FROM Sales.SalesOrderDetail sod2 
          JOIN Sales.SalesOrderHeader soh2 ON sod2.SalesOrderID = soh2.SalesOrderID 
          WHERE sod2.ProductID = p.ProductID 
          AND YEAR(soh2.OrderDate) = YEAR(soh.OrderDate) - 1
        ) AS PreviousYearRevenue
      FROM Production.Product p
      JOIN Sales.SalesOrderDetail sod ON p.ProductID = sod.ProductID
      JOIN Sales.SalesOrderHeader soh ON sod.SalesOrderID = soh.SalesOrderID
      WHERE soh.Status IN (1, 2, 3, 4)
        ${dateCondition}
      GROUP BY p.Name, p.ProductID, YEAR(soh.OrderDate)
      ORDER BY Revenue DESC
    `;
    const topProducts = await executeQuery(topProductsQuery);
    
    // Calculate growth for top products
    const topProductsWithGrowth = topProducts.map(product => ({
      productName: product.ProductName,
      revenue: product.Revenue,
      quantity: product.Quantity,
      growth: product.PreviousYearRevenue > 0 
        ? ((product.Revenue - product.PreviousYearRevenue) / product.PreviousYearRevenue * 100)
        : 100 // If no previous data, show 100% growth
    }));
    
    // Get sales by region
    const salesByRegionQuery = `
      SELECT
        st.CountryRegionCode AS Region,
        COUNT(soh.SalesOrderID) AS Orders,
        SUM(soh.SubTotal) AS Revenue,
        (
          SELECT SUM(SubTotal) 
          FROM Sales.SalesOrderHeader soh2 
          WHERE soh2.TerritoryID = st.TerritoryID 
          AND YEAR(soh2.OrderDate) = YEAR(soh.OrderDate) - 1
        ) AS PreviousYearRevenue
      FROM Sales.SalesTerritory st
      JOIN Sales.SalesOrderHeader soh ON st.TerritoryID = soh.TerritoryID
      WHERE soh.Status IN (1, 2, 3, 4)
        ${dateCondition}
      GROUP BY st.CountryRegionCode, st.TerritoryID, YEAR(soh.OrderDate)
      ORDER BY Revenue DESC
    `;
    const salesByRegion = await executeQuery(salesByRegionQuery);
    
    // Calculate growth for regions
    const salesByRegionWithGrowth = salesByRegion.map(region => ({
      region: region.Region === 'US' ? 'North America' : 
             region.Region === 'CA' ? 'North America' :
             region.Region === 'GB' ? 'Europe' :
             region.Region === 'DE' ? 'Europe' :
             region.Region === 'FR' ? 'Europe' :
             region.Region === 'AU' ? 'Australia' : region.Region,
      revenue: region.Revenue,
      orders: region.Orders,
      growth: region.PreviousYearRevenue > 0 
        ? ((region.Revenue - region.PreviousYearRevenue) / region.PreviousYearRevenue * 100)
        : 100
    }));
    
    // Aggregate regions with the same name
    const aggregatedRegions = salesByRegionWithGrowth.reduce((acc, region) => {
      const existingRegion = acc.find(r => r.region === region.region);
      if (existingRegion) {
        existingRegion.revenue += region.revenue;
        existingRegion.orders += region.orders;
        existingRegion.growth = (existingRegion.growth + region.growth) / 2; // Average growth
      } else {
        acc.push(region);
      }
      return acc;
    }, [] as Array<{region: string, revenue: number, orders: number, growth: number}>);
    
    // Get customer segments
    const customerSegmentsQuery = `
      SELECT
        CASE
          WHEN c.PersonID IS NOT NULL THEN 'Individual'
          WHEN c.StoreID IS NOT NULL THEN 'Store'
          ELSE 'Other'
        END AS Segment,
        COUNT(DISTINCT c.CustomerID) AS Customers,
        SUM(soh.SubTotal) AS Revenue,
        AVG(soh.SubTotal) AS AverageOrderValue
      FROM Sales.Customer c
      JOIN Sales.SalesOrderHeader soh ON c.CustomerID = soh.CustomerID
      WHERE soh.Status IN (1, 2, 3, 4)
        ${dateCondition}
      GROUP BY
        CASE
          WHEN c.PersonID IS NOT NULL THEN 'Individual'
          WHEN c.StoreID IS NOT NULL THEN 'Store'
          ELSE 'Other'
        END
      ORDER BY Revenue DESC
    `;
    const customerSegments = await executeQuery(customerSegmentsQuery);
    
    return NextResponse.json({
      success: true,
      data: {
        summary: salesSummary[0],
        monthlyTrend: monthlyTrend.map(item => ({
          month: item.Month,
          revenue: item.Revenue,
          orders: item.Orders,
          customers: item.Customers
        })),
        topProducts: topProductsWithGrowth,
        salesByRegion: aggregatedRegions,
        customerSegments: customerSegments.map(item => ({
          segment: item.Segment,
          customers: item.Customers,
          revenue: item.Revenue,
          avgOrderValue: item.AverageOrderValue
        }))
      }
    });
  } catch (error) {
    console.error('Sales analytics dashboard data error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to retrieve sales analytics dashboard data',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}