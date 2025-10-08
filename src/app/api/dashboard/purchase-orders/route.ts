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
      statusCondition = `AND po.Status = '${status}'`
    }

    // Fetch purchase orders with details
    const ordersQuery = `
      SELECT TOP 50
        po.PurchaseOrderID,
        v.Name as VendorName,
        po.OrderDate,
        po.ShipDate,
        po.Status,
        po.TotalDue,
        po.SubTotal,
        po.TaxAmt,
        po.Freight,
        SUM(pod.OrderQty) as OrderQty,
        SUM(pod.ReceivedQty) as ReceivedQty,
        SUM(pod.RejectedQty) as RejectedQty,
        SUM(pod.StockedQty) as StockedQty
      FROM Purchasing.PurchaseOrderHeader po
      INNER JOIN Purchasing.Vendor v ON po.VendorID = v.VendorID
      LEFT JOIN Purchasing.PurchaseOrderDetail pod ON po.PurchaseOrderID = pod.PurchaseOrderID
      WHERE 1=1 ${dateCondition} ${vendorCondition} ${statusCondition}
      GROUP BY po.PurchaseOrderID, v.Name, po.OrderDate, po.ShipDate, po.Status, po.TotalDue, po.SubTotal, po.TaxAmt, po.Freight
      ORDER BY po.OrderDate DESC
    `
    
    // Fetch order status distribution
    const statusesQuery = `
      SELECT 
        po.Status,
        COUNT(DISTINCT po.PurchaseOrderID) as Count,
        SUM(po.TotalDue) as TotalValue
      FROM Purchasing.PurchaseOrderHeader po
      INNER JOIN Purchasing.Vendor v ON po.VendorID = v.VendorID
      WHERE 1=1 ${dateCondition} ${vendorCondition} ${statusCondition}
      GROUP BY po.Status
      ORDER BY Count DESC
    `
    
    // Fetch monthly order data
    const monthlyDataQuery = `
      SELECT 
        FORMAT(po.OrderDate, 'MMM yyyy') as Month,
        COUNT(DISTINCT po.PurchaseOrderID) as OrderCount,
        SUM(po.TotalDue) as TotalValue,
        AVG(po.TotalDue) as AvgOrderValue,
        CASE 
          WHEN COUNT(DISTINCT po.PurchaseOrderID) > 0 
          THEN (SUM(CASE 
            WHEN DATEDIFF(day, po.OrderDate, po.ShipDate) <= 7 
            THEN 1 
            ELSE 0 
          END) * 100.0 / COUNT(DISTINCT po.PurchaseOrderID))
          ELSE 0 
        END as OnTimeDeliveryRate
      FROM Purchasing.PurchaseOrderHeader po
      INNER JOIN Purchasing.Vendor v ON po.VendorID = v.VendorID
      WHERE po.OrderDate >= DATEADD(year, -2, GETDATE())
        ${dateCondition} ${vendorCondition} ${statusCondition}
      GROUP BY FORMAT(po.OrderDate, 'MMM yyyy'), YEAR(po.OrderDate), MONTH(po.OrderDate)
      ORDER BY YEAR(po.OrderDate), MONTH(po.OrderDate)
    `
    
    // Fetch vendor order data
    const vendorDataQuery = `
      SELECT TOP 10
        v.Name as VendorName,
        COUNT(DISTINCT po.PurchaseOrderID) as OrderCount,
        SUM(po.TotalDue) as TotalValue,
        AVG(po.TotalDue) as AvgOrderValue,
        CASE 
          WHEN COUNT(DISTINCT po.PurchaseOrderID) > 0 
          THEN (SUM(CASE 
            WHEN DATEDIFF(day, po.OrderDate, po.ShipDate) <= 7 
            THEN 1 
            ELSE 0 
          END) * 100.0 / COUNT(DISTINCT po.PurchaseOrderID))
          ELSE 0 
        END as OnTimeDeliveryRate
      FROM Purchasing.PurchaseOrderHeader po
      INNER JOIN Purchasing.Vendor v ON po.VendorID = v.VendorID
      WHERE 1=1 ${dateCondition} ${vendorCondition} ${statusCondition}
      GROUP BY v.Name
      ORDER BY TotalValue DESC
    `
    
    const ordersResult = await sql.query(ordersQuery)
    const statusesResult = await sql.query(statusesQuery)
    const monthlyDataResult = await sql.query(monthlyDataQuery)
    const vendorDataResult = await sql.query(vendorDataQuery)
    
    // Calculate percentages for status distribution
    const totalOrders = statusesResult.recordset.reduce((sum: number, status: any) => sum + status.Count, 0)
    const statusesWithPercentage = statusesResult.recordset.map((status: any) => ({
      status: status.Status,
      count: status.Count,
      totalValue: status.TotalValue,
      percentage: totalOrders > 0 ? (status.Count / totalOrders) * 100 : 0
    }))
    
    return NextResponse.json({
      orders: ordersResult.recordset,
      statuses: statusesWithPercentage,
      monthlyData: monthlyDataResult.recordset,
      vendorData: vendorDataResult.recordset
    })
  } catch (error) {
    console.error('Purchase orders dashboard error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch purchase orders data' },
      { status: 500 }
    )
  }
}