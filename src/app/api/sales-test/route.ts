import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/mssql';

export async function GET() {
  try {
    // Get sales order information
    const salesQuery = `
      SELECT TOP 10 
        SalesOrderID,
        OrderDate,
        DueDate,
        ShipDate,
        Status,
        SubTotal,
        TaxAmt,
        TotalDue
      FROM Sales.SalesOrderHeader
      ORDER BY OrderDate DESC
    `;
    const salesData = await executeQuery(salesQuery);
    
    // Get sales by year summary
    const salesByYearQuery = `
      SELECT 
        YEAR(OrderDate) AS SalesYear,
        COUNT(*) AS OrderCount,
        SUM(TotalDue) AS TotalSales
      FROM Sales.SalesOrderHeader
      GROUP BY YEAR(OrderDate)
      ORDER BY SalesYear DESC
    `;
    const salesByYear = await executeQuery(salesByYearQuery);
    
    // Get top products by sales
    const topProductsQuery = `
      SELECT TOP 5
        p.Name AS ProductName,
        p.ProductNumber,
        SUM(sod.OrderQty) AS TotalQuantity,
        SUM(sod.LineTotal) AS TotalRevenue
      FROM Sales.SalesOrderDetail sod
      JOIN Production.Product p ON sod.ProductID = p.ProductID
      GROUP BY p.Name, p.ProductNumber
      ORDER BY TotalRevenue DESC
    `;
    const topProducts = await executeQuery(topProductsQuery);
    
    return NextResponse.json({
      success: true,
      message: 'Sales data retrieved successfully!',
      recentOrders: salesData,
      salesByYear: salesByYear,
      topProducts: topProducts
    });
  } catch (error) {
    console.error('Sales data query error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to retrieve sales data',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}