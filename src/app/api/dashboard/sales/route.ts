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
    
    // Get sales summary metrics
    const salesSummaryQuery = `
      SELECT
        COUNT(*) AS TotalOrders,
        SUM(SubTotal) AS TotalRevenue,
        AVG(SubTotal) AS AverageOrderValue,
        SUM(TaxAmt) AS TotalTax,
        SUM(Freight) AS TotalFreight,
        COUNT(DISTINCT CustomerID) AS TotalCustomers,
        COUNT(DISTINCT SalesPersonID) AS TotalSalesPeople
      FROM Sales.SalesOrderHeader soh
      WHERE soh.Status IN (1, 2, 3, 4) -- Active orders
      ${dateCondition}
    `;
    const salesSummary = await executeQuery(salesSummaryQuery);
    
    // Get monthly sales trend for the selected year
    let monthlySalesQuery = '';
    if (dateRange === 'all') {
      monthlySalesQuery = `
        SELECT
          YEAR(OrderDate) AS Year,
          MONTH(OrderDate) AS Month,
          COUNT(*) AS OrderCount,
          SUM(SubTotal) AS Revenue,
          AVG(SubTotal) AS AverageOrderValue
        FROM Sales.SalesOrderHeader soh
        WHERE soh.Status IN (1, 2, 3, 4)
        GROUP BY YEAR(soh.OrderDate), MONTH(soh.OrderDate)
        ORDER BY Year, Month
      `;
    } else {
      monthlySalesQuery = `
        SELECT
          YEAR(soh.OrderDate) AS Year,
          MONTH(soh.OrderDate) AS Month,
          COUNT(*) AS OrderCount,
          SUM(soh.SubTotal) AS Revenue,
          AVG(soh.SubTotal) AS AverageOrderValue
        FROM Sales.SalesOrderHeader soh
        WHERE soh.Status IN (1, 2, 3, 4)
        ${dateCondition}
        GROUP BY YEAR(soh.OrderDate), MONTH(soh.OrderDate)
        ORDER BY Year, Month
      `;
    }
    const monthlySales = await executeQuery(monthlySalesQuery);
    
    // Get top 10 customers by sales
    const topCustomersQuery = `
      SELECT TOP 10
        c.CustomerID,
        c.AccountNumber,
        p.FirstName + ' ' + p.LastName AS CustomerName,
        COUNT(soh.SalesOrderID) AS OrderCount,
        SUM(soh.SubTotal) AS TotalSpent,
        AVG(soh.SubTotal) AS AverageOrderValue
      FROM Sales.Customer c
      JOIN Sales.SalesOrderHeader soh ON c.CustomerID = soh.CustomerID
      JOIN Person.Person p ON c.PersonID = p.BusinessEntityID
      WHERE soh.Status IN (1, 2, 3, 4)
      ${dateCondition}
      GROUP BY c.CustomerID, c.AccountNumber, p.FirstName, p.LastName
      ORDER BY TotalSpent DESC
    `;
    const topCustomers = await executeQuery(topCustomersQuery);
    
    // Get top 10 products by sales
    const topProductsQuery = `
      SELECT TOP 10
        p.ProductID,
        p.Name AS ProductName,
        p.ProductNumber,
        SUM(sod.OrderQty) AS TotalQuantity,
        SUM(sod.LineTotal) AS TotalRevenue,
        COUNT(DISTINCT sod.SalesOrderID) AS OrderCount,
        AVG(sod.UnitPrice) AS AveragePrice
      FROM Production.Product p
      JOIN Sales.SalesOrderDetail sod ON p.ProductID = sod.ProductID
      JOIN Sales.SalesOrderHeader soh ON sod.SalesOrderID = soh.SalesOrderID
      WHERE soh.Status IN (1, 2, 3, 4)
      ${dateCondition}
      GROUP BY p.ProductID, p.Name, p.ProductNumber
      ORDER BY TotalRevenue DESC
    `;
    const topProducts = await executeQuery(topProductsQuery);
    
    // Get sales by territory
    const salesByTerritoryQuery = `
      SELECT
        st.TerritoryID,
        st.Name AS TerritoryName,
        st.CountryRegionCode,
        st.[Group],
        COUNT(soh.SalesOrderID) AS OrderCount,
        SUM(soh.SubTotal) AS TotalRevenue,
        AVG(soh.SubTotal) AS AverageOrderValue
      FROM Sales.SalesTerritory st
      JOIN Sales.SalesOrderHeader soh ON st.TerritoryID = soh.TerritoryID
      WHERE soh.Status IN (1, 2, 3, 4)
      ${dateCondition}
      GROUP BY st.TerritoryID, st.Name, st.CountryRegionCode, st.[Group]
      ORDER BY TotalRevenue DESC
    `;
    const salesByTerritory = await executeQuery(salesByTerritoryQuery);
    
    // Get recent orders
    const recentOrdersQuery = `
      SELECT TOP 20
        soh.SalesOrderID,
        soh.OrderDate,
        soh.DueDate,
        soh.ShipDate,
        soh.Status,
        soh.SubTotal,
        soh.TaxAmt,
        soh.Freight,
        soh.TotalDue,
        c.AccountNumber,
        p.FirstName + ' ' + p.LastName AS CustomerName,
        st.Name AS TerritoryName
      FROM Sales.SalesOrderHeader soh
      JOIN Sales.Customer c ON soh.CustomerID = c.CustomerID
      JOIN Person.Person p ON c.PersonID = p.BusinessEntityID
      LEFT JOIN Sales.SalesTerritory st ON soh.TerritoryID = st.TerritoryID
      WHERE soh.Status IN (1, 2, 3, 4)
      ${dateCondition}
      ORDER BY soh.OrderDate DESC
    `;
    const recentOrders = await executeQuery(recentOrdersQuery);
    
    return NextResponse.json({
      success: true,
      data: {
        summary: salesSummary[0],
        monthlySales,
        topCustomers,
        topProducts,
        salesByTerritory,
        recentOrders
      }
    });
  } catch (error) {
    console.error('Sales dashboard data error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to retrieve sales dashboard data',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}