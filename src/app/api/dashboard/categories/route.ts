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
    
    // Main query for categories with sales data
    const categoriesQuery = `
      SELECT 
        psc.ProductCategoryID,
        psc.Name,
        COUNT(DISTINCT p.ProductID) AS TotalProducts,
        ISNULL(cs.CurrentSales, 0) AS TotalSales,
        ISNULL(cs.CurrentQuantity, 0) AS TotalQuantity,
        ISNULL(cs.CurrentOrders, 0) AS OrderCount,
        ISNULL(p.ListPrice, 0) AS AveragePrice,
        ISNULL(
          CASE 
            WHEN cs.PreviousSales > 0 
            THEN ((cs.CurrentSales - cs.PreviousSales) / cs.PreviousSales) * 100 
            ELSE 0 
          END, 0
        ) AS GrowthRate,
        ISNULL(tp.TopProduct, 'N/A') AS TopProduct,
        ISNULL(tp.TopProductSales, 0) AS TopProductSales
      FROM Production.ProductCategory psc
      LEFT JOIN Production.ProductSubcategory psub ON psc.ProductCategoryID = psub.ProductSubcategoryID
      LEFT JOIN Production.Product p ON psub.ProductSubcategoryID = p.ProductSubcategoryID
      LEFT JOIN (
        SELECT 
          psc.ProductCategoryID,
          SUM(sod.LineTotal) AS CurrentSales,
          SUM(sod.OrderQty) AS CurrentQuantity,
          COUNT(DISTINCT sod.SalesOrderID) AS CurrentOrders,
          0 AS PreviousSales
        FROM Production.ProductCategory psc
        LEFT JOIN Production.ProductSubcategory psub ON psc.ProductCategoryID = psub.ProductSubcategoryID
        LEFT JOIN Production.Product p ON psub.ProductSubcategoryID = p.ProductSubcategoryID
        LEFT JOIN Sales.SalesOrderDetail sod ON p.ProductID = sod.ProductID
        LEFT JOIN Sales.SalesOrderHeader soh ON sod.SalesOrderID = soh.SalesOrderID
        WHERE 1=1 ${dateCondition}
        GROUP BY psc.ProductCategoryID
      ) cs ON psc.ProductCategoryID = cs.ProductCategoryID
      LEFT JOIN (
        SELECT 
          psc.ProductCategoryID,
          p.Name AS TopProduct,
          SUM(sod.LineTotal) AS TopProductSales
        FROM Production.ProductCategory psc
        LEFT JOIN Production.ProductSubcategory psub ON psc.ProductCategoryID = psub.ProductSubcategoryID
        LEFT JOIN Production.Product p ON psub.ProductSubcategoryID = p.ProductSubcategoryID
        LEFT JOIN Sales.SalesOrderDetail sod ON p.ProductID = sod.ProductID
        LEFT JOIN Sales.SalesOrderHeader soh ON sod.SalesOrderID = soh.SalesOrderID
        WHERE 1=1 ${dateCondition}
        GROUP BY psc.ProductCategoryID, p.Name, sod.LineTotal
      ) tp ON psc.ProductCategoryID = tp.ProductCategoryID
      GROUP BY psc.ProductCategoryID, psc.Name, cs.CurrentSales, cs.CurrentQuantity, 
               cs.CurrentOrders, tp.TopProduct, tp.TopProductSales
      ORDER BY TotalSales DESC
    `
    
    // Query for previous year sales to calculate growth
    const previousYearQuery = `
      SELECT 
        psc.ProductCategoryID,
        SUM(sod.LineTotal) AS PreviousSales
      FROM Production.ProductCategory psc
      LEFT JOIN Production.ProductSubcategory psub ON psc.ProductCategoryID = psub.ProductSubcategoryID
      LEFT JOIN Production.Product p ON psub.ProductSubcategoryID = p.ProductSubcategoryID
      LEFT JOIN Sales.SalesOrderDetail sod ON p.ProductID = sod.ProductID
      LEFT JOIN Sales.SalesOrderHeader soh ON sod.SalesOrderID = soh.SalesOrderID
      WHERE 1=1 ${previousYearCondition}
      GROUP BY psc.ProductCategoryID
    `
    
    // Query for subcategories
    const subcategoriesQuery = `
      SELECT 
        psc.ProductCategoryID,
        psub.ProductSubcategoryID,
        psub.Name,
        COUNT(DISTINCT p.ProductID) AS TotalProducts,
        ISNULL(cs.CurrentSales, 0) AS TotalSales,
        ISNULL(cs.CurrentQuantity, 0) AS TotalQuantity,
        ISNULL(cs.CurrentOrders, 0) AS OrderCount,
        ISNULL(p.ListPrice, 0) AS AveragePrice,
        ISNULL(
          CASE 
            WHEN cs.PreviousSales > 0 
            THEN ((cs.CurrentSales - cs.PreviousSales) / cs.PreviousSales) * 100 
            ELSE 0 
          END, 0
        ) AS GrowthRate
      FROM Production.ProductCategory psc
      LEFT JOIN Production.ProductSubcategory psub ON psc.ProductCategoryID = psub.ProductSubcategoryID
      LEFT JOIN Production.Product p ON psub.ProductSubcategoryID = p.ProductSubcategoryID
      LEFT JOIN (
        SELECT 
          psub.ProductSubcategoryID,
          SUM(sod.LineTotal) AS CurrentSales,
          SUM(sod.OrderQty) AS CurrentQuantity,
          COUNT(DISTINCT sod.SalesOrderID) AS CurrentOrders,
          0 AS PreviousSales
        FROM Production.ProductSubcategory psub
        LEFT JOIN Production.Product p ON psub.ProductSubcategoryID = p.ProductSubcategoryID
        LEFT JOIN Sales.SalesOrderDetail sod ON p.ProductID = sod.ProductID
        LEFT JOIN Sales.SalesOrderHeader soh ON sod.SalesOrderID = soh.SalesOrderID
        WHERE 1=1 ${dateCondition}
        GROUP BY psub.ProductSubcategoryID
      ) cs ON psub.ProductSubcategoryID = cs.ProductSubcategoryID
      GROUP BY psc.ProductCategoryID, psub.ProductSubcategoryID, psub.Name, 
               cs.CurrentSales, cs.CurrentQuantity, cs.CurrentOrders
      ORDER BY psc.ProductCategoryID, TotalSales DESC
    `
    
    // Summary data query
    const summaryQuery = `
      SELECT 
        COUNT(DISTINCT psc.ProductCategoryID) AS TotalCategories,
        COUNT(DISTINCT p.ProductID) AS TotalProducts,
        SUM(sod.LineTotal) AS TotalSales,
        AVG(
          CASE 
            WHEN cs.PreviousSales > 0 
            THEN ((cs.CurrentSales - cs.PreviousSales) / cs.PreviousSales) * 100 
            ELSE 0 
          END
        ) AS AverageGrowthRate,
        TOP 1 psc.Name AS TopCategory
      FROM Production.ProductCategory psc
      LEFT JOIN Production.ProductSubcategory psub ON psc.ProductCategoryID = psub.ProductSubcategoryID
      LEFT JOIN Production.Product p ON psub.ProductSubcategoryID = p.ProductSubcategoryID
      LEFT JOIN Sales.SalesOrderDetail sod ON p.ProductID = sod.ProductID
      LEFT JOIN Sales.SalesOrderHeader soh ON sod.SalesOrderID = soh.SalesOrderID
      LEFT JOIN (
        SELECT 
          psc.ProductCategoryID,
          SUM(sod.LineTotal) AS CurrentSales,
          0 AS PreviousSales
        FROM Production.ProductCategory psc
        LEFT JOIN Production.ProductSubcategory psub ON psc.ProductCategoryID = psub.ProductSubcategoryID
        LEFT JOIN Production.Product p ON psub.ProductSubcategoryID = p.ProductSubcategoryID
        LEFT JOIN Sales.SalesOrderDetail sod ON p.ProductID = sod.ProductID
        LEFT JOIN Sales.SalesOrderHeader soh ON sod.SalesOrderID = soh.SalesOrderID
        WHERE 1=1 ${dateCondition}
        GROUP BY psc.ProductCategoryID
      ) cs ON psc.ProductCategoryID = cs.ProductCategoryID
      WHERE 1=1 ${dateCondition}
    `
    
    // Execute queries
    const categories = await executeQuery(categoriesQuery)
    const previousYearData = await executeQuery(previousYearQuery)
    const subcategories = await executeQuery(subcategoriesQuery)
    const summaryResult = await executeQuery(summaryQuery)
    
    // Process categories and add previous year data
    const processedCategories = categories.map((category: any) => {
      const previousYear = previousYearData.find((py: any) => py.ProductCategoryID === category.ProductCategoryID)
      const previousSales = previousYear?.PreviousSales || 0
      
      // Calculate growth rate
      const growthRate = previousSales > 0 
        ? ((category.TotalSales - previousSales) / previousSales) * 100 
        : 0
      
      // Get subcategories for this category
      const categorySubcategories = subcategories
        .filter((sc: any) => sc.ProductCategoryID === category.ProductCategoryID)
        .map((sc: any) => ({
          ProductSubcategoryID: sc.ProductSubcategoryID,
          Name: sc.Name,
          TotalProducts: sc.TotalProducts,
          TotalSales: sc.TotalSales,
          TotalQuantity: sc.TotalQuantity,
          OrderCount: sc.OrderCount,
          AveragePrice: sc.AveragePrice,
          GrowthRate: sc.GrowthRate
        }))
      
      return {
        ...category,
        GrowthRate: growthRate,
        Subcategories: categorySubcategories
      }
    })
    
    // Calculate total sales for percentage calculations
    const totalSales = processedCategories.reduce((sum: number, cat: any) => sum + cat.TotalSales, 0)
    
    // Extract summary data
    const summaryData = summaryResult[0] || {}
    
    const response = {
      categories: processedCategories,
      totalCategories: parseInt(summaryData.TotalCategories || 0),
      totalProducts: parseInt(summaryData.TotalProducts || 0),
      totalSales: totalSales,
      topCategory: summaryData.TopCategory || 'N/A',
      averageGrowthRate: parseFloat(summaryData.AverageGrowthRate || 0)
    }
    
    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching categories data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories data' },
      { status: 500 }
    )
  }
}