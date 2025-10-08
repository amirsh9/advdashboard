import { sql } from '@vercel/postgres'

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
        a.AccountNumber as Customer,
        soh.SubTotal as Amount,
        soh.Status,
        soh.OrderDate
      FROM Sales.SalesOrderHeader soh
      LEFT JOIN Sales.Customer c ON soh.CustomerID = c.CustomerID
      LEFT JOIN Person.Person p ON c.PersonID = p.BusinessEntityID
      LEFT JOIN Sales.Store s ON c.StoreID = s.BusinessEntityID
      LEFT JOIN Sales.SalesTerritory st ON soh.TerritoryID = st.TerritoryID
      LEFT JOIN Sales.CustomerAddress ca ON c.CustomerID = ca.CustomerID
      LEFT JOIN Person.Address a ON ca.AddressID = a.AddressID
      WHERE soh.Status IN (1, 2, 3, 4, 5)
        ${dateCondition}
      ORDER BY soh.OrderDate DESC
    `

    // Execute queries
    const totalSalesResult = await sql.query(totalSalesQuery)
    const salesPerformanceResult = await sql.query(salesPerformanceQuery)
    const topProductsResult = await sql.query(topProductsQuery)
    const recentOrdersResult = await sql.query(recentOrdersQuery)

    // Transform data
    const totalSalesData = totalSalesResult.rows[0]
    const salesPerformanceData = salesPerformanceResult.rows
    const topProductsData = topProductsResult.rows
    const recentOrdersData = recentOrdersResult.rows

    // Format sales performance
    const salesPerformance = salesPerformanceData.map((row: any) => ({
      region: row.region,
      sales: parseFloat(row.sales) || 0,
      target: parseFloat(row.target) || 0,
      percentage: row.target > 0 ? ((parseFloat(row.sales) || 0) / parseFloat(row.target) * 100) : 0
    }))

    // Format top products
    const topProducts = topProductsData.map((row: any) => ({
      name: row.productname,
      sales: parseInt(row.totalquantity) || 0,
      revenue: parseFloat(row.revenue) || 0,
      status: parseFloat(row.revenue) > 150000 ? 'hot' : 'normal'
    }))

    // Format recent orders
    const recentOrders = recentOrdersData.map((row: any) => ({
      id: row.salesorderid,
      customer: row.customer || 'Unknown',
      amount: parseFloat(row.amount) || 0,
      status: row.status === 5 ? 'completed' : row.status === 3 ? 'processing' : 'pending',
      date: new Date(row.orderdate).toISOString().split('T')[0]
    }))

    return new Response(JSON.stringify({
      summary: {
        totalSales: parseFloat(totalSalesData.totalsales) || 0,
        totalOrders: parseInt(totalSalesData.totalorders) || 0,
        activeCustomers: parseInt(totalSalesData.activecustomers) || 0,
        products: parseInt(totalSalesData.products) || 0
      },
      salesPerformance,
      topProducts,
      recentOrders
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Error fetching overview data:', error)
    return new Response(JSON.stringify({ error: 'Failed to fetch overview data' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}