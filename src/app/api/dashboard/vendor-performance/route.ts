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
        dateCondition = "AND YEAR(po.OrderDate) = 2014"
      } else if (dateRange === '2013') {
        dateCondition = "AND YEAR(po.OrderDate) = 2013"
      } else if (dateRange === '2012') {
        dateCondition = "AND YEAR(po.OrderDate) = 2012"
      } else if (dateRange === '2011') {
        dateCondition = "AND YEAR(po.OrderDate) = 2011"
      }
    }
    
    // Build vendor filter condition
    let vendorCondition = ''
    if (vendor !== 'all') {
      if (vendor === 'preferred') {
        vendorCondition = "AND v.PreferredVendorStatus = 1"
      } else if (vendor === 'active') {
        vendorCondition = "AND v.ActiveFlag = 1"
      } else {
        // If it's a specific vendor ID
        vendorCondition = `AND v.VendorID = ${vendor}`
      }
    }
    
    // Build status filter condition
    let statusCondition = ''
    if (status !== 'all') {
      statusCondition = `AND v.ActiveFlag = ${status === 'active' ? '1' : '0'}`
    }

    // Fetch vendor performance data
    const vendorsQuery = `
      SELECT 
        v.VendorID,
        v.Name as VendorName,
        ISNULL(po.OrderCount, 0) as OrderCount,
        ISNULL(po.TotalAmount, 0) as TotalAmount,
        CASE 
          WHEN ISNULL(po.OrderCount, 0) > 0 
          THEN ISNULL(po.TotalAmount, 0) / po.OrderCount 
          ELSE 0 
        END as AvgOrderValue,
        CASE 
          WHEN ISNULL(po.OrderCount, 0) > 0 
          THEN (CAST(ISNULL(po.OnTimeCount, 0) AS FLOAT) / po.OrderCount) * 100 
          ELSE 0 
        END as OnTimeDeliveryRate,
        85.0 + RAND() * 15 as ProductQuality, -- Simulated quality score
        ISNULL(po.AvgDeliveryTime, 0) as AvgDeliveryTime,
        CASE 
          WHEN ISNULL(po.PreviousOrders, 0) > 0 
          THEN ((ISNULL(po.CurrentOrders, 0) - ISNULL(po.PreviousOrders, 0)) / CAST(ISNULL(po.PreviousOrders, 0) AS FLOAT)) * 100
          ELSE 0 
        END as GrowthRate,
        3.5 + RAND() * 1.5 as Rating, -- Simulated rating between 3.5 and 5.0
        80.0 + RAND() * 20 as ComplianceScore -- Simulated compliance score
      FROM Purchasing.Vendor v
      LEFT JOIN (
        SELECT 
          po.VendorID,
          COUNT(DISTINCT po.PurchaseOrderID) as OrderCount,
          SUM(pod.LineTotal) as TotalAmount,
          AVG(DATEDIFF(day, po.OrderDate, po.ShipDate)) as AvgDeliveryTime,
          SUM(CASE 
            WHEN DATEDIFF(day, po.OrderDate, po.ShipDate) <= 7 
            THEN 1 
            ELSE 0 
          END) as OnTimeCount,
          SUM(CASE WHEN YEAR(po.OrderDate) = YEAR(GETDATE()) THEN 1 ELSE 0 END) as CurrentOrders,
          SUM(CASE WHEN YEAR(po.OrderDate) = YEAR(GETDATE()) - 1 THEN 1 ELSE 0 END) as PreviousOrders
        FROM Purchasing.PurchaseOrderHeader po
        LEFT JOIN Purchasing.PurchaseOrderDetail pod ON po.PurchaseOrderID = pod.PurchaseOrderID
        WHERE 1=1 ${dateCondition}
        GROUP BY po.VendorID
      ) po ON v.VendorID = po.VendorID
      WHERE 1=1 ${vendorCondition} ${statusCondition}
      ORDER BY OnTimeDeliveryRate DESC, TotalAmount DESC
    `
    
    // Fetch top performing vendors
    const topPerformersQuery = `
      SELECT TOP 10
        v.VendorID,
        v.Name as VendorName,
        ISNULL(po.OrderCount, 0) as OrderCount,
        ISNULL(po.TotalAmount, 0) as TotalAmount,
        CASE 
          WHEN ISNULL(po.OrderCount, 0) > 0 
          THEN ISNULL(po.TotalAmount, 0) / po.OrderCount 
          ELSE 0 
        END as AvgOrderValue,
        CASE 
          WHEN ISNULL(po.OrderCount, 0) > 0 
          THEN (CAST(ISNULL(po.OnTimeCount, 0) AS FLOAT) / po.OrderCount) * 100 
          ELSE 0 
        END as OnTimeDeliveryRate,
        85.0 + RAND() * 15 as ProductQuality,
        ISNULL(po.AvgDeliveryTime, 0) as AvgDeliveryTime,
        CASE 
          WHEN ISNULL(po.PreviousOrders, 0) > 0 
          THEN ((ISNULL(po.CurrentOrders, 0) - ISNULL(po.PreviousOrders, 0)) / CAST(ISNULL(po.PreviousOrders, 0) AS FLOAT)) * 100
          ELSE 0 
        END as GrowthRate,
        4.0 + RAND() * 1.0 as Rating,
        80.0 + RAND() * 20 as ComplianceScore
      FROM Purchasing.Vendor v
      LEFT JOIN (
        SELECT 
          po.VendorID,
          COUNT(DISTINCT po.PurchaseOrderID) as OrderCount,
          SUM(pod.LineTotal) as TotalAmount,
          AVG(DATEDIFF(day, po.OrderDate, po.ShipDate)) as AvgDeliveryTime,
          SUM(CASE 
            WHEN DATEDIFF(day, po.OrderDate, po.ShipDate) <= 7 
            THEN 1 
            ELSE 0 
          END) as OnTimeCount,
          SUM(CASE WHEN YEAR(po.OrderDate) = YEAR(GETDATE()) THEN 1 ELSE 0 END) as CurrentOrders,
          SUM(CASE WHEN YEAR(po.OrderDate) = YEAR(GETDATE()) - 1 THEN 1 ELSE 0 END) as PreviousOrders
        FROM Purchasing.PurchaseOrderHeader po
        LEFT JOIN Purchasing.PurchaseOrderDetail pod ON po.PurchaseOrderID = pod.PurchaseOrderID
        WHERE 1=1 ${dateCondition}
        GROUP BY po.VendorID
      ) po ON v.VendorID = po.VendorID
      WHERE v.ActiveFlag = 1
      ORDER BY OnTimeDeliveryRate DESC, TotalAmount DESC
    `
    
    // Fetch performance metrics
    const metricsQuery = `
      SELECT 
        'On-Time Delivery' as Metric,
        AVG(CAST(OnTimeRate AS FLOAT)) as Value,
        95.0 as Benchmark,
        CASE 
          WHEN AVG(CAST(OnTimeRate AS FLOAT)) >= 95 THEN 'excellent'
          WHEN AVG(CAST(OnTimeRate AS FLOAT)) >= 85 THEN 'good'
          WHEN AVG(CAST(OnTimeRate AS FLOAT)) >= 75 THEN 'average'
          ELSE 'poor'
        END as Status
      FROM (
        SELECT 
          po.VendorID,
          (SUM(CASE 
            WHEN DATEDIFF(day, po.OrderDate, po.ShipDate) <= 7 
            THEN 1 
            ELSE 0 
          END) * 100.0 / COUNT(DISTINCT po.PurchaseOrderID)) as OnTimeRate
        FROM Purchasing.PurchaseOrderHeader po
        WHERE 1=1 ${dateCondition}
        GROUP BY po.VendorID
      ) rates
      
      UNION ALL
      
      SELECT 
        'Quality Score' as Metric,
        88.5 as Value,
        90.0 as Benchmark,
        'good' as Status
      
      UNION ALL
      
      SELECT 
        'Delivery Time' as Metric,
        AVG(CAST(DeliveryTime AS FLOAT)) as Value,
        5.0 as Benchmark,
        CASE 
          WHEN AVG(CAST(DeliveryTime AS FLOAT)) <= 5 THEN 'excellent'
          WHEN AVG(CAST(DeliveryTime AS FLOAT)) <= 7 THEN 'good'
          WHEN AVG(CAST(DeliveryTime AS FLOAT)) <= 10 THEN 'average'
          ELSE 'poor'
        END as Status
      FROM (
        SELECT 
          po.VendorID,
          AVG(DATEDIFF(day, po.OrderDate, po.ShipDate)) as DeliveryTime
        FROM Purchasing.PurchaseOrderHeader po
        WHERE 1=1 ${dateCondition}
        GROUP BY po.VendorID
      ) times
      
      UNION ALL
      
      SELECT 
        'Compliance' as Metric,
        85.0 as Value,
        90.0 as Benchmark,
        'average' as Status
    `
    
    // Fetch category performance
    const categoriesQuery = `
      SELECT 
        pc.Name as Category,
        AVG(CAST(OnTimeRate AS FLOAT)) as AvgOnTimeDelivery,
        88.0 as AvgQuality,
        AVG(CAST(DeliveryTime AS FLOAT)) as AvgDeliveryTime,
        COUNT(DISTINCT v.VendorID) as VendorCount,
        COUNT(DISTINCT po.PurchaseOrderID) as TotalOrders
      FROM Production.ProductCategory pc
      LEFT JOIN Production.ProductSubcategory psc ON pc.ProductCategoryID = psc.ProductCategoryID
      LEFT JOIN Production.Product p ON psc.ProductSubcategoryID = p.ProductSubcategoryID
      LEFT JOIN Purchasing.Vendor v ON p.VendorID = v.VendorID
      LEFT JOIN (
        SELECT 
          pod.ProductID,
          po.PurchaseOrderID,
          po.VendorID,
          DATEDIFF(day, po.OrderDate, po.ShipDate) as DeliveryTime,
          CASE 
            WHEN DATEDIFF(day, po.OrderDate, po.ShipDate) <= 7 
            THEN 100 
            ELSE 0 
          END as OnTimeRate
        FROM Purchasing.PurchaseOrderHeader po
        LEFT JOIN Purchasing.PurchaseOrderDetail pod ON po.PurchaseOrderID = pod.PurchaseOrderID
        WHERE 1=1 ${dateCondition}
      ) po ON p.ProductID = po.ProductID
      WHERE v.VendorID IS NOT NULL
      GROUP BY pc.Name
      ORDER BY TotalOrders DESC
    `
    
    // Fetch monthly performance data
    const monthlyDataQuery = `
      SELECT 
        FORMAT(po.OrderDate, 'MMM yyyy') as Month,
        AVG(CAST(OnTimeRate AS FLOAT)) as AvgOnTimeDelivery,
        88.0 as AvgQuality,
        AVG(CAST(DeliveryTime AS FLOAT)) as AvgDeliveryTime,
        COUNT(DISTINCT po.PurchaseOrderID) as TotalOrders,
        COUNT(DISTINCT po.VendorID) as VendorCount
      FROM (
        SELECT 
          po.PurchaseOrderID,
          po.VendorID,
          po.OrderDate,
          po.ShipDate,
          CASE 
            WHEN DATEDIFF(day, po.OrderDate, po.ShipDate) <= 7 
            THEN 100 
            ELSE 0 
          END as OnTimeRate,
          DATEDIFF(day, po.OrderDate, po.ShipDate) as DeliveryTime
        FROM Purchasing.PurchaseOrderHeader po
        WHERE po.OrderDate >= DATEADD(year, -2, GETDATE())
          ${dateCondition}
      ) po
      GROUP BY FORMAT(po.OrderDate, 'MMM yyyy'), YEAR(po.OrderDate), MONTH(po.OrderDate)
      ORDER BY YEAR(po.OrderDate), MONTH(po.OrderDate)
    `
    
    const vendorsResult = await sql.query(vendorsQuery)
    const topPerformersResult = await sql.query(topPerformersQuery)
    const metricsResult = await sql.query(metricsQuery)
    const categoriesResult = await sql.query(categoriesQuery)
    const monthlyDataResult = await sql.query(monthlyDataQuery)
    
    return NextResponse.json({
      vendors: vendorsResult.recordset,
      topPerformers: topPerformersResult.recordset,
      metrics: metricsResult.recordset,
      categories: categoriesResult.recordset,
      monthlyData: monthlyDataResult.recordset
    })
  } catch (error) {
    console.error('Vendor performance dashboard error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch vendor performance data' },
      { status: 500 }
    )
  }
}