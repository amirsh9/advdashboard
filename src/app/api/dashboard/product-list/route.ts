import { NextRequest, NextResponse } from 'next/server'
import { executeQuery } from '@/lib/mssql'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const dateRange = searchParams.get('dateRange') || '2014'
    const category = searchParams.get('category') || 'all'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const sortBy = searchParams.get('sortBy') || 'name'
    
    // Build date filter condition
    let dateCondition = ''
    if (dateRange !== 'all') {
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
    
    // Build category filter condition
    let categoryCondition = ''
    if (category !== 'all') {
      if (category === 'bikes') {
        categoryCondition = "AND psc.ProductCategoryID = 1"
      } else if (category === 'components') {
        categoryCondition = "AND psc.ProductCategoryID = 2"
      } else if (category === 'clothing') {
        categoryCondition = "AND psc.ProductCategoryID = 3"
      } else if (category === 'accessories') {
        categoryCondition = "AND psc.ProductCategoryID = 4"
      }
    }
    
    // Build search condition
    let searchCondition = ''
    if (search) {
      searchCondition = `AND (p.Name LIKE '%${search}%' OR p.ProductNumber LIKE '%${search}%')`
    }
    
    // Build sort condition
    let sortCondition = 'ORDER BY p.Name'
    if (sortBy === 'price') {
      sortCondition = 'ORDER BY p.ListPrice DESC'
    } else if (sortBy === 'sales') {
      sortCondition = 'ORDER BY TotalSales DESC'
    } else if (sortBy === 'quantity') {
      sortCondition = 'ORDER BY TotalQuantity DESC'
    }
    
    // Calculate offset for pagination
    const offset = (page - 1) * limit
    
    // Main query for products with sales data
    const productsQuery = `
      SELECT 
        p.ProductID,
        p.Name,
        p.ProductNumber,
        p.Color,
        p.StandardCost,
        p.ListPrice,
        p.Size,
        p.Weight,
        p.ProductLine,
        p.Class,
        p.Style,
        p.SellStartDate,
        ppsc.Name AS SubcategoryName,
        psc.Name AS CategoryName,
        ISNULL(sod.TotalSales, 0) AS TotalSales,
        ISNULL(sod.TotalQuantity, 0) AS TotalQuantity,
        ISNULL(sod.OrderCount, 0) AS OrderCount,
        ISNULL(p.ListPrice, 0) AS ReorderPoint,
        50 AS SafetyStockLevel
      FROM Production.Product p
      LEFT JOIN Production.ProductSubcategory ppsc ON p.ProductSubcategoryID = ppsc.ProductSubcategoryID
      LEFT JOIN Production.ProductCategory psc ON ppsc.ProductCategoryID = psc.ProductCategoryID
      LEFT JOIN (
        SELECT 
          sod.ProductID,
          SUM(sod.LineTotal) AS TotalSales,
          SUM(sod.OrderQty) AS TotalQuantity,
          COUNT(DISTINCT sod.SalesOrderID) AS OrderCount
        FROM Sales.SalesOrderDetail sod
        INNER JOIN Sales.SalesOrderHeader soh ON sod.SalesOrderID = soh.SalesOrderID
        WHERE 1=1 ${dateCondition}
        GROUP BY sod.ProductID
      ) sod ON p.ProductID = sod.ProductID
      WHERE 1=1 ${categoryCondition} ${searchCondition}
      ${sortCondition}
      OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY
    `
    
    // Count query for pagination
    const countQuery = `
      SELECT COUNT(*) AS TotalProducts
      FROM Production.Product p
      LEFT JOIN Production.ProductSubcategory ppsc ON p.ProductSubcategoryID = ppsc.ProductSubcategoryID
      LEFT JOIN Production.ProductCategory psc ON ppsc.ProductCategoryID = psc.ProductCategoryID
      WHERE 1=1 ${categoryCondition} ${searchCondition}
    `
    
    // Summary data query
    const summaryQuery = `
      SELECT 
        COUNT(DISTINCT p.ProductID) AS TotalProducts,
        SUM(p.ListPrice * ISNULL(sod.TotalQuantity, 0)) AS TotalValue,
        AVG(p.ListPrice) AS AveragePrice,
        TOP 1 psc.Name AS TopCategory,
        SUM(CASE WHEN ISNULL(sod.TotalQuantity, 0) <= ISNULL(p.ReorderPoint, 0) THEN 1 ELSE 0 END) AS LowStockCount
      FROM Production.Product p
      LEFT JOIN Production.ProductSubcategory ppsc ON p.ProductSubcategoryID = ppsc.ProductSubcategoryID
      LEFT JOIN Production.ProductCategory psc ON ppsc.ProductCategoryID = psc.ProductCategoryID
      LEFT JOIN (
        SELECT 
          sod.ProductID,
          SUM(sod.OrderQty) AS TotalQuantity
        FROM Sales.SalesOrderDetail sod
        INNER JOIN Sales.SalesOrderHeader soh ON sod.SalesOrderID = soh.SalesOrderID
        WHERE 1=1 ${dateCondition}
        GROUP BY sod.ProductID
      ) sod ON p.ProductID = sod.ProductID
      WHERE 1=1 ${categoryCondition}
    `
    
    // Execute queries
    const products = await executeQuery(productsQuery)
    const countResult = await executeQuery(countQuery)
    const summaryResult = await executeQuery(summaryQuery)
    
    // Calculate average order value for each product
    const productsWithAvgValue = products.map((product: any) => ({
      ...product,
      AverageOrderValue: product.OrderCount > 0 ? product.TotalSales / product.OrderCount : 0
    }))
    
    // Extract summary data
    const summaryData = summaryResult[0]
    
    const response = {
      products: productsWithAvgValue,
      totalProducts: parseInt(countResult[0].TotalProducts),
      totalValue: Math.round(summaryData.TotalValue || 0),
      averagePrice: parseFloat(summaryData.AveragePrice || 0),
      topCategory: summaryData.TopCategory || 'N/A',
      lowStockCount: parseInt(summaryData.LowStockCount || 0)
    }
    
    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching product list data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product list data' },
      { status: 500 }
    )
  }
}