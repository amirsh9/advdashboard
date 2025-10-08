import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/mssql';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateRange = searchParams.get('dateRange') || 'all';
    const vendor = searchParams.get('vendor') || 'all';
    const status = searchParams.get('status') || 'all';
    
    // Build date filter condition
    let dateCondition = '';
    if (dateRange !== 'all') {
      if (dateRange === '2014') {
        dateCondition = "AND YEAR(ph.OrderDate) = 2014";
      } else if (dateRange === '2013') {
        dateCondition = "AND YEAR(ph.OrderDate) = 2013";
      } else if (dateRange === '2012') {
        dateCondition = "AND YEAR(ph.OrderDate) = 2012";
      } else if (dateRange === '2011') {
        dateCondition = "AND YEAR(ph.OrderDate) = 2011";
      } else if (dateRange === '2011-2014') {
        dateCondition = "AND YEAR(ph.OrderDate) BETWEEN 2011 AND 2014";
      }
    }
    
    // Build vendor filter condition
    let vendorCondition = '';
    if (vendor !== 'all') {
      vendorCondition = `AND v.Name = '${vendor}'`;
    }
    
    // Build status filter condition
    let statusCondition = '';
    if (status !== 'all') {
      statusCondition = `AND ph.Status = ${status}`;
    }
    
    // Get purchasing summary metrics
    const purchasingSummaryQuery = `
      SELECT 
        COUNT(DISTINCT ph.PurchaseOrderID) AS TotalPurchaseOrders,
        COUNT(DISTINCT v.VendorID) AS TotalVendors,
        SUM(ph.TotalDue) AS TotalPurchaseValue,
        AVG(ph.TotalDue) AS AverageOrderValue,
        COUNT(CASE WHEN ph.Status = 1 THEN 1 END) AS PendingOrders,
        COUNT(CASE WHEN ph.Status = 2 THEN 1 END) AS ApprovedOrders,
        COUNT(CASE WHEN ph.Status = 3 THEN 1 END) AS RejectedOrders,
        COUNT(CASE WHEN ph.Status = 4 THEN 1 END) AS CompletedOrders
      FROM Purchasing.PurchaseOrderHeader ph
      JOIN Purchasing.Vendor v ON ph.VendorID = v.VendorID
      WHERE 1=1
        ${dateCondition}
        ${vendorCondition}
        ${statusCondition}
    `;
    const purchasingSummary = await executeQuery(purchasingSummaryQuery);
    
    // Get vendors by performance
    const vendorPerformanceQuery = `
      SELECT 
        v.VendorID,
        v.Name AS VendorName,
        COUNT(ph.PurchaseOrderID) AS NumberOfOrders,
        SUM(ph.TotalDue) AS TotalPurchaseValue,
        AVG(ph.TotalDue) AS AverageOrderValue,
        COUNT(CASE WHEN ph.Status = 4 THEN 1 END) AS CompletedOrders,
        COUNT(CASE WHEN ph.Status = 3 THEN 1 END) AS RejectedOrders,
        AVG(CASE WHEN ph.Status = 4 THEN 1 ELSE 0 END) * 100 AS CompletionRate
      FROM Purchasing.Vendor v
      LEFT JOIN Purchasing.PurchaseOrderHeader ph ON v.VendorID = ph.VendorID
      WHERE 1=1
        ${dateCondition}
        ${vendorCondition}
        ${statusCondition}
      GROUP BY v.VendorID, v.Name
      HAVING COUNT(ph.PurchaseOrderID) > 0
      ORDER BY TotalPurchaseValue DESC
    `;
    const vendorPerformance = await executeQuery(vendorPerformanceQuery);
    
    // Get recent purchase orders
    const recentPurchaseOrdersQuery = `
      SELECT TOP 10
        ph.PurchaseOrderID,
        ph.OrderDate,
        ph.ShipDate,
        ph.Status,
        ph.TotalDue,
        v.Name AS VendorName,
        e.FirstName + ' ' + e.LastName AS EmployeeName
      FROM Purchasing.PurchaseOrderHeader ph
      JOIN Purchasing.Vendor v ON ph.VendorID = v.VendorID
      JOIN HumanResources.Employee e ON ph.EmployeeID = e.BusinessEntityID
      WHERE 1=1
        ${dateCondition}
        ${vendorCondition}
        ${statusCondition}
      ORDER BY ph.OrderDate DESC
    `;
    const recentPurchaseOrders = await executeQuery(recentPurchaseOrdersQuery);
    
    // Get top purchased products
    const topPurchasedProductsQuery = `
      SELECT TOP 10
        p.ProductID,
        p.Name AS ProductName,
        psc.Name AS SubcategoryName,
        pc.Name AS CategoryName,
        SUM(pod.OrderQty) AS TotalQuantityOrdered,
        SUM(pod.LineTotal) AS TotalPurchaseValue,
        AVG(pod.UnitPrice) AS AverageUnitPrice,
        COUNT(DISTINCT pod.PurchaseOrderID) AS NumberOfOrders
      FROM Purchasing.PurchaseOrderDetail pod
      JOIN Purchasing.PurchaseOrderHeader ph ON pod.PurchaseOrderID = ph.PurchaseOrderID
      JOIN Production.Product p ON pod.ProductID = p.ProductID
      LEFT JOIN Production.ProductSubcategory psc ON p.ProductSubcategoryID = psc.ProductSubcategoryID
      LEFT JOIN Production.ProductCategory pc ON psc.ProductCategoryID = pc.ProductCategoryID
      WHERE 1=1
        ${dateCondition}
        ${vendorCondition}
        ${statusCondition}
      GROUP BY p.ProductID, p.Name, psc.Name, pc.Name
      ORDER BY TotalQuantityOrdered DESC
    `;
    const topPurchasedProducts = await executeQuery(topPurchasedProductsQuery);
    
    // Get monthly purchasing trends
    const monthlyPurchasingTrendsQuery = `
      SELECT 
        YEAR(ph.OrderDate) AS Year,
        MONTH(ph.OrderDate) AS Month,
        COUNT(DISTINCT ph.PurchaseOrderID) AS NumberOfOrders,
        SUM(ph.TotalDue) AS TotalPurchaseValue,
        AVG(ph.TotalDue) AS AverageOrderValue
      FROM Purchasing.PurchaseOrderHeader ph
      WHERE 1=1
        ${dateCondition}
        ${vendorCondition}
        ${statusCondition}
      GROUP BY YEAR(ph.OrderDate), MONTH(ph.OrderDate)
      ORDER BY Year, Month
    `;
    const monthlyPurchasingTrends = await executeQuery(monthlyPurchasingTrendsQuery);
    
    return NextResponse.json({
      success: true,
      data: {
        summary: purchasingSummary[0],
        vendorPerformance,
        recentPurchaseOrders,
        topPurchasedProducts,
        monthlyPurchasingTrends
      }
    });
  } catch (error) {
    console.error('Purchasing dashboard data error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to retrieve purchasing dashboard data',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}