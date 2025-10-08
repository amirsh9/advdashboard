import { NextRequest, NextResponse } from 'next/server'
import { executeQuery } from '@/lib/mssql'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const dateRange = searchParams.get('dateRange') || '2014'
    
    // Build date filter condition
    let dateCondition = ''
    let previousYearCondition = ''
    
    if (dateRange !== 'all') {
      if (dateRange === '2014') {
        dateCondition = "AND YEAR(soh.OrderDate) = 2014"
        previousYearCondition = "AND YEAR(soh.OrderDate) = 2013"
      } else if (dateRange === '2013') {
        dateCondition = "AND YEAR(soh.OrderDate) = 2013"
        previousYearCondition = "AND YEAR(soh.OrderDate) = 2012"
      } else if (dateRange === '2012') {
        dateCondition = "AND YEAR(soh.OrderDate) = 2012"
        previousYearCondition = "AND YEAR(soh.OrderDate) = 2011"
      } else if (dateRange === '2011') {
        dateCondition = "AND YEAR(soh.OrderDate) = 2011"
        previousYearCondition = "AND YEAR(soh.OrderDate) = 2010"
      }
    }
    
    // Query for customer segments
    const segmentsQuery = `
      SELECT 
        'High Value' AS SegmentID,
        'High Value Customers' AS SegmentName,
        COUNT(DISTINCT c.CustomerID) AS CustomerCount,
        SUM(soh.TotalDue) AS TotalSales,
        AVG(soh.TotalDue) AS AverageOrderValue,
        0 AS GrowthRate,
        'North America' AS TopRegion
      FROM Sales.Customer c
      INNER JOIN Sales.SalesOrderHeader soh ON c.CustomerID = soh.CustomerID
      WHERE 1=1 ${dateCondition}
      AND c.CustomerID IN (
        SELECT TOP 20% CustomerID 
        FROM (
          SELECT CustomerID, SUM(TotalDue) AS TotalSpent
          FROM Sales.SalesOrderHeader
          WHERE 1=1 ${dateCondition}
          GROUP BY CustomerID
          ORDER BY TotalSpent DESC
        ) AS TopCustomers
      )
      
      UNION ALL
      
      SELECT 
        'Medium Value' AS SegmentID,
        'Medium Value Customers' AS SegmentName,
        COUNT(DISTINCT c.CustomerID) AS CustomerCount,
        SUM(soh.TotalDue) AS TotalSales,
        AVG(soh.TotalDue) AS AverageOrderValue,
        0 AS GrowthRate,
        'North America' AS TopRegion
      FROM Sales.Customer c
      INNER JOIN Sales.SalesOrderHeader soh ON c.CustomerID = soh.CustomerID
      WHERE 1=1 ${dateCondition}
      AND c.CustomerID IN (
        SELECT CustomerID 
        FROM (
          SELECT CustomerID, SUM(TotalDue) AS TotalSpent,
            ROW_NUMBER() OVER (ORDER BY SUM(TotalDue) DESC) AS Rank
          FROM Sales.SalesOrderHeader
          WHERE 1=1 ${dateCondition}
          GROUP BY CustomerID
        ) AS RankedCustomers
        WHERE Rank BETWEEN 21 AND 70
      )
      
      UNION ALL
      
      SELECT 
        'Low Value' AS SegmentID,
        'Low Value Customers' AS SegmentName,
        COUNT(DISTINCT c.CustomerID) AS CustomerCount,
        SUM(soh.TotalDue) AS TotalSales,
        AVG(soh.TotalDue) AS AverageOrderValue,
        0 AS GrowthRate,
        'North America' AS TopRegion
      FROM Sales.Customer c
      INNER JOIN Sales.SalesOrderHeader soh ON c.CustomerID = soh.CustomerID
      WHERE 1=1 ${dateCondition}
      AND c.CustomerID IN (
        SELECT CustomerID 
        FROM (
          SELECT CustomerID, SUM(TotalDue) AS TotalSpent,
            ROW_NUMBER() OVER (ORDER BY SUM(TotalDue) DESC) AS Rank
          FROM Sales.SalesOrderHeader
          WHERE 1=1 ${dateCondition}
          GROUP BY CustomerID
        ) AS RankedCustomers
        WHERE Rank > 70
      )
    `
    
    // Query for regional data
    const regionsQuery = `
      SELECT 
        st.CountryRegionCode,
        st.Name AS CountryName,
        COUNT(DISTINCT c.CustomerID) AS CustomerCount,
        SUM(soh.TotalDue) AS TotalSales,
        AVG(soh.TotalDue) AS AverageOrderValue,
        0 AS GrowthRate,
        TOP 1 a.City AS TopCity,
        COUNT(DISTINCT c.CustomerID) AS TopCityCustomers
      FROM Sales.Customer c
      INNER JOIN Sales.SalesOrderHeader soh ON c.CustomerID = soh.CustomerID
      INNER JOIN Sales.SalesTerritory st ON c.TerritoryID = st.TerritoryID
      INNER JOIN Person.Address a ON c.CustomerID = a.AddressID
      WHERE 1=1 ${dateCondition}
      GROUP BY st.CountryRegionCode, st.Name
      ORDER BY TotalSales DESC
    `
    
    // Query for top customers
    const topCustomersQuery = `
      SELECT TOP 20
        c.CustomerID,
        CASE 
          WHEN c.PersonID IS NOT NULL THEN 
            p.FirstName + ' ' + p.LastName
          ELSE 
            a.Name
        END AS CustomerName,
        SUM(soh.TotalDue) AS TotalSales,
        COUNT(DISTINCT soh.SalesOrderID) AS OrderCount,
        AVG(soh.TotalDue) AS AverageOrderValue,
        st.Name AS Region,
        a.City AS City,
        MAX(soh.OrderDate) AS LastOrderDate,
        CASE 
          WHEN c.PersonID IS NOT NULL THEN 'Individual'
          ELSE 'Store'
        END AS CustomerType
      FROM Sales.Customer c
      INNER JOIN Sales.SalesOrderHeader soh ON c.CustomerID = soh.CustomerID
      INNER JOIN Sales.SalesTerritory st ON c.TerritoryID = st.TerritoryID
      LEFT JOIN Person.Person p ON c.PersonID = p.BusinessEntityID
      LEFT JOIN Sales.Store s ON c.StoreID = s.BusinessEntityID
      LEFT JOIN Person.Address a ON s.SalesPersonID = a.AddressID
      WHERE 1=1 ${dateCondition}
      GROUP BY c.CustomerID, p.FirstName, p.LastName, a.Name, st.Name, a.City, c.PersonID, c.StoreID
      ORDER BY TotalSales DESC
    `
    
    // Summary data query
    const summaryQuery = `
      SELECT 
        COUNT(DISTINCT c.CustomerID) AS TotalCustomers,
        SUM(soh.TotalDue) AS TotalSales,
        AVG(soh.TotalDue) AS AverageOrderValue,
        0 AS CustomerGrowthRate,
        TOP 1 st.Name AS TopRegion,
        'High Value Customers' AS TopSegment
      FROM Sales.Customer c
      INNER JOIN Sales.SalesOrderHeader soh ON c.CustomerID = soh.CustomerID
      INNER JOIN Sales.SalesTerritory st ON c.TerritoryID = st.TerritoryID
      WHERE 1=1 ${dateCondition}
    `
    
    // Previous year summary for growth calculation
    const previousYearSummaryQuery = `
      SELECT 
        COUNT(DISTINCT c.CustomerID) AS PreviousCustomers,
        SUM(soh.TotalDue) AS PreviousSales
      FROM Sales.Customer c
      INNER JOIN Sales.SalesOrderHeader soh ON c.CustomerID = soh.CustomerID
      WHERE 1=1 ${previousYearCondition}
    `
    
    // Execute queries
    const segments = await executeQuery(segmentsQuery)
    const regions = await executeQuery(regionsQuery)
    const topCustomers = await executeQuery(topCustomersQuery)
    const summaryResult = await executeQuery(summaryQuery)
    const previousYearSummary = await executeQuery(previousYearSummaryQuery)
    
    // Calculate growth rates
    const summaryData = summaryResult[0] || {}
    const previousData = previousYearSummary[0] || {}
    
    const customerGrowthRate = previousData.PreviousCustomers > 0 
      ? ((summaryData.TotalCustomers - previousData.PreviousCustomers) / previousData.PreviousCustomers) * 100 
      : 0
    
    // Process segments with growth rates
    const processedSegments = segments.map((segment: any) => {
      // For this example, we'll use some mock growth rates
      const growthRates = { 'High Value': 15.2, 'Medium Value': 8.7, 'Low Value': 3.4 }
      return {
        ...segment,
        GrowthRate: growthRates[segment.SegmentID as keyof typeof growthRates] || 0
      }
    })
    
    // Process regions with growth rates
    const processedRegions = regions.map((region: any) => {
      // For this example, we'll use some mock growth rates
      const growthRates = { 'US': 12.5, 'CA': 9.3, 'GB': 7.8, 'AU': 11.2, 'FR': 5.4 }
      return {
        ...region,
        GrowthRate: growthRates[region.CountryRegionCode as keyof typeof growthRates] || 0
      }
    })
    
    // Process top customers with growth rates
    const processedTopCustomers = topCustomers.map((customer: any) => {
      // Format the date
      const lastOrderDate = customer.LastOrderDate ? new Date(customer.LastOrderDate).toISOString().split('T')[0] : ''
      
      return {
        ...customer,
        LastOrderDate: lastOrderDate
      }
    })
    
    const response = {
      segments: processedSegments,
      regions: processedRegions,
      topCustomers: processedTopCustomers,
      totalCustomers: parseInt(summaryData.TotalCustomers || 0),
      totalSales: parseFloat(summaryData.TotalSales || 0),
      averageOrderValue: parseFloat(summaryData.AverageOrderValue || 0),
      customerGrowthRate: customerGrowthRate,
      topRegion: summaryData.TopRegion || 'N/A',
      topSegment: summaryData.TopSegment || 'N/A'
    }
    
    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching customer analytics data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch customer analytics data' },
      { status: 500 }
    )
  }
}