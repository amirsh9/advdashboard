import { NextRequest, NextResponse } from 'next/server'
import sql from '@/lib/mssql'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const dateRange = searchParams.get('dateRange') || '2014'
    const vendor = searchParams.get('vendor') || 'all'
    const status = searchParams.get('status') || 'all'
    
    // Build date filter condition
    let dateCondition = ''
    if (dateRange !== 'all') {
      if (dateRange === '2014') {
        dateCondition = "AND YEAR(ph.OrderDate) = 2014"
      } else if (dateRange === '2013') {
        dateCondition = "AND YEAR(ph.OrderDate) = 2013"
      } else if (dateRange === '2012') {
        dateCondition = "AND YEAR(ph.OrderDate) = 2012"
      } else if (dateRange === '2011') {
        dateCondition = "AND YEAR(ph.OrderDate) = 2011"
      }
    }
    
    // Build vendor filter condition
    let vendorCondition = ''
    if (vendor !== 'all') {
      if (vendor === 'preferred') {
        vendorCondition = "AND v.PreferredVendorStatus = 1"
      } else if (vendor === 'active') {
        vendorCondition = "AND v.ActiveFlag = 1"
      }
    }
    
    // Build status filter condition
    let statusCondition = ''
    if (status !== 'all') {
      if (status === 'active') {
        statusCondition = "AND v.ActiveFlag = 1"
      } else if (status === 'inactive') {
        statusCondition = "AND v.ActiveFlag = 0"
      }
    }

    // Fetch vendor data with performance metrics
    const vendorsQuery = `
      SELECT 
        v.VendorID,
        v.AccountNumber,
        v.Name,
        v.CreditRating,
        v.PreferredVendorStatus,
        v.ActiveFlag,
        v.PurchasingWebServiceURL,
        ISNULL(ph.OrderCount, 0) as OrderCount,
        ISNULL(ph.TotalOrderValue, 0) as TotalOrderValue,
        CASE 
          WHEN ISNULL(ph.OrderCount, 0) > 0 
          THEN ISNULL(ph.TotalOrderValue, 0) / ph.OrderCount 
          ELSE 0 
        END as AverageOrderValue,
        ISNULL(ph.LastOrderDate, NULL) as LastOrderDate,
        ISNULL(p.ProductCount, 0) as ProductCount,
        CASE 
          WHEN ISNULL(ph.OnTimeCount, 0) > 0 
          THEN (CAST(ISNULL(ph.OnTimeCount, 0) AS FLOAT) / ph.OrderCount) * 100 
          ELSE 0 
        END as OnTimeDeliveryRate
      FROM Purchasing.Vendor v
      LEFT JOIN (
        SELECT 
          po.VendorID,
          COUNT(DISTINCT po.PurchaseOrderID) as OrderCount,
          SUM(pod.LineTotal) as TotalOrderValue,
          MAX(po.OrderDate) as LastOrderDate,
          SUM(CASE 
            WHEN DATEDIFF(day, po.OrderDate, ph.ShipDate) <= 7 
            THEN 1 
            ELSE 0 
          END) as OnTimeCount
        FROM Purchasing.PurchaseOrderHeader po
        LEFT JOIN Purchasing.PurchaseOrderDetail pod ON po.PurchaseOrderID = pod.PurchaseOrderID
        LEFT JOIN Purchasing.ShipMethod ph ON po.ShipMethodID = ph.ShipMethodID
        WHERE 1=1 ${dateCondition}
        GROUP BY po.VendorID
      ) ph ON v.VendorID = ph.VendorID
      LEFT JOIN (
        SELECT 
          p.VendorID,
          COUNT(DISTINCT p.ProductID) as ProductCount
        FROM Production.Product p
        WHERE p.VendorID IS NOT NULL
        GROUP BY p.VendorID
      ) p ON v.VendorID = p.VendorID
      WHERE 1=1 ${vendorCondition} ${statusCondition}
      ORDER BY v.Name
    `
    
    // Fetch top performing vendors
    const topPerformersQuery = `
      SELECT TOP 10
        v.VendorID,
        v.Name as VendorName,
        ISNULL(ph.OrderCount, 0) as OrderCount,
        ISNULL(ph.TotalOrderValue, 0) as TotalAmount,
        CASE 
          WHEN ISNULL(ph.OrderCount, 0) > 0 
          THEN ISNULL(ph.TotalOrderValue, 0) / ph.OrderCount 
          ELSE 0 
        END as AvgOrderValue,
        CASE 
          WHEN ISNULL(ph.OrderCount, 0) > 0 
          THEN (CAST(ISNULL(ph.OnTimeCount, 0) AS FLOAT) / ph.OrderCount) * 100 
          ELSE 0 
        END as OnTimeDeliveryRate,
        85.0 + RAND() * 15 as ProductQuality, -- Simulated quality score
        ISNULL(ph.AvgDeliveryTime, 0) as AvgDeliveryTime,
        CASE 
          WHEN ISNULL(ph.PreviousOrders, 0) > 0 
          THEN ((ISNULL(ph.CurrentOrders, 0) - ISNULL(ph.PreviousOrders, 0)) / CAST(ISNULL(ph.PreviousOrders, 0) AS FLOAT)) * 100
          ELSE 0 
        END as GrowthRate
      FROM Purchasing.Vendor v
      LEFT JOIN (
        SELECT 
          po.VendorID,
          COUNT(DISTINCT po.PurchaseOrderID) as OrderCount,
          SUM(pod.LineTotal) as TotalOrderValue,
          AVG(DATEDIFF(day, po.OrderDate, ph.ShipDate)) as AvgDeliveryTime,
          SUM(CASE 
            WHEN DATEDIFF(day, po.OrderDate, ph.ShipDate) <= 7 
            THEN 1 
            ELSE 0 
          END) as OnTimeCount,
          SUM(CASE WHEN YEAR(po.OrderDate) = YEAR(GETDATE()) THEN 1 ELSE 0 END) as CurrentOrders,
          SUM(CASE WHEN YEAR(po.OrderDate) = YEAR(GETDATE()) - 1 THEN 1 ELSE 0 END) as PreviousOrders
        FROM Purchasing.PurchaseOrderHeader po
        LEFT JOIN Purchasing.PurchaseOrderDetail pod ON po.PurchaseOrderID = pod.PurchaseOrderID
        LEFT JOIN Purchasing.ShipMethod ph ON po.ShipMethodID = ph.ShipMethodID
        WHERE 1=1 ${dateCondition}
        GROUP BY po.VendorID
      ) ph ON v.VendorID = ph.VendorID
      WHERE v.ActiveFlag = 1
      ORDER BY OnTimeDeliveryRate DESC, TotalAmount DESC
    `
    
    // Fetch vendor categories
    const categoriesQuery = `
      SELECT 
        pc.Name as Category,
        COUNT(DISTINCT v.VendorID) as VendorCount,
        ISNULL(ph.OrderCount, 0) as TotalOrders,
        ISNULL(ph.TotalValue, 0) as TotalValue,
        CASE 
          WHEN ISNULL(ph.OrderCount, 0) > 0 
          THEN ISNULL(ph.TotalValue, 0) / ph.OrderCount 
          ELSE 0 
        END as AvgOrderValue
      FROM Production.ProductCategory pc
      LEFT JOIN Production.ProductSubcategory psc ON pc.ProductCategoryID = psc.ProductCategoryID
      LEFT JOIN Production.Product p ON psc.ProductSubcategoryID = p.ProductSubcategoryID
      LEFT JOIN Purchasing.Vendor v ON p.VendorID = v.VendorID
      LEFT JOIN (
        SELECT 
          pod.ProductID,
          COUNT(DISTINCT po.PurchaseOrderID) as OrderCount,
          SUM(pod.LineTotal) as TotalValue
        FROM Purchasing.PurchaseOrderHeader po
        LEFT JOIN Purchasing.PurchaseOrderDetail pod ON po.PurchaseOrderID = pod.PurchaseOrderID
        WHERE 1=1 ${dateCondition}
        GROUP BY pod.ProductID
      ) ph ON p.ProductID = ph.ProductID
      WHERE v.VendorID IS NOT NULL
      GROUP BY pc.Name
      ORDER BY TotalValue DESC
    `
    
    // Fetch monthly vendor data
    const monthlyDataQuery = `
      SELECT 
        FORMAT(po.OrderDate, 'MMM yyyy') as Month,
        COUNT(DISTINCT po.VendorID) as VendorCount,
        COUNT(DISTINCT po.PurchaseOrderID) as OrderCount,
        SUM(pod.LineTotal) as TotalValue,
        AVG(DATEDIFF(day, po.OrderDate, ph.ShipDate)) as AvgDeliveryTime,
        (SUM(CASE 
          WHEN DATEDIFF(day, po.OrderDate, ph.ShipDate) <= 7 
          THEN 1 
          ELSE 0 
        END) * 100.0 / COUNT(DISTINCT po.PurchaseOrderID)) as OnTimeRate
      FROM Purchasing.PurchaseOrderHeader po
      LEFT JOIN Purchasing.PurchaseOrderDetail pod ON po.PurchaseOrderID = pod.PurchaseOrderID
      LEFT JOIN Purchasing.ShipMethod ph ON po.ShipMethodID = ph.ShipMethodID
      WHERE po.OrderDate >= DATEADD(year, -2, GETDATE())
      GROUP BY FORMAT(po.OrderDate, 'MMM yyyy'), YEAR(po.OrderDate), MONTH(po.OrderDate)
      ORDER BY YEAR(po.OrderDate), MONTH(po.OrderDate)
    `
    
    const vendorsResult = await sql.query(vendorsQuery)
    const topPerformersResult = await sql.query(topPerformersQuery)
    const categoriesResult = await sql.query(categoriesQuery)
    const monthlyDataResult = await sql.query(monthlyDataQuery)
    
    return NextResponse.json({
      vendors: vendorsResult.recordset,
      topPerformers: topPerformersResult.recordset,
      categories: categoriesResult.recordset,
      monthlyData: monthlyDataResult.recordset
    })
  } catch (error) {
    console.error('Vendor dashboard error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch vendor data' },
      { status: 500 }
    )
  }
}