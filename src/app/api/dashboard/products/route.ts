import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/mssql';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateRange = searchParams.get('dateRange') || 'all';
    const category = searchParams.get('category') || 'all';
    
    // Build date filter condition
    let dateCondition = '';
    if (dateRange !== 'all') {
      if (dateRange === '2014') {
        dateCondition = "AND YEAR(sod.ModifiedDate) = 2014";
      } else if (dateRange === '2013') {
        dateCondition = "AND YEAR(sod.ModifiedDate) = 2013";
      } else if (dateRange === '2012') {
        dateCondition = "AND YEAR(sod.ModifiedDate) = 2012";
      } else if (dateRange === '2011') {
        dateCondition = "AND YEAR(sod.ModifiedDate) = 2011";
      } else if (dateRange === '2011-2014') {
        dateCondition = "AND YEAR(sod.ModifiedDate) BETWEEN 2011 AND 2014";
      }
    }
    
    // Build category filter condition
    let categoryCondition = '';
    if (category !== 'all') {
      categoryCondition = `AND psc.Name = '${category}'`;
    }
    
    // Get product summary metrics
    const productSummaryQuery = `
      SELECT 
        COUNT(DISTINCT p.ProductID) AS TotalProducts,
        COUNT(DISTINCT p.ProductSubcategoryID) AS TotalSubcategories,
        COUNT(DISTINCT p.ProductCategoryID) AS TotalCategories,
        SUM(p.ListPrice) AS TotalInventoryValue,
        AVG(p.ListPrice) AS AverageProductPrice,
        COUNT(CASE WHEN p.ListPrice > 1000 THEN 1 END) AS HighValueProducts,
        COUNT(CASE WHEN p.ListPrice < 100 THEN 1 END) AS LowValueProducts
      FROM Production.Product p
      LEFT JOIN Production.ProductSubcategory psc ON p.ProductSubcategoryID = psc.ProductCategoryID
      WHERE p.FinishedGoodsFlag = 1
        ${categoryCondition}
    `;
    const productSummary = await executeQuery(productSummaryQuery);
    
    // Get products by category
    const productsByCategoryQuery = `
      SELECT 
        pc.Name AS CategoryName,
        COUNT(p.ProductID) AS ProductCount,
        AVG(p.ListPrice) AS AveragePrice,
        SUM(p.ListPrice) AS TotalValue,
        COUNT(CASE WHEN p.ListPrice > 1000 THEN 1 END) AS HighValueProducts
      FROM Production.Product p
      LEFT JOIN Production.ProductSubcategory psc ON p.ProductSubcategoryID = psc.ProductSubcategoryID
      LEFT JOIN Production.ProductCategory pc ON psc.ProductCategoryID = pc.ProductCategoryID
      WHERE p.FinishedGoodsFlag = 1
        ${categoryCondition}
      GROUP BY pc.Name
      ORDER BY ProductCount DESC
    `;
    const productsByCategory = await executeQuery(productsByCategoryQuery);
    
    // Get top selling products
    const topSellingProductsQuery = `
      SELECT TOP 10
        p.ProductID,
        p.Name AS ProductName,
        psc.Name AS SubcategoryName,
        pc.Name AS CategoryName,
        SUM(sod.OrderQty) AS TotalQuantitySold,
        SUM(sod.LineTotal) AS TotalRevenue,
        AVG(sod.UnitPrice) AS AverageUnitPrice,
        COUNT(DISTINCT sod.SalesOrderID) AS NumberOfOrders
      FROM Production.Product p
      JOIN Sales.SalesOrderDetail sod ON p.ProductID = sod.ProductID
      LEFT JOIN Production.ProductSubcategory psc ON p.ProductSubcategoryID = psc.ProductSubcategoryID
      LEFT JOIN Production.ProductCategory pc ON psc.ProductCategoryID = pc.ProductCategoryID
      WHERE 1=1
        ${dateCondition}
        ${categoryCondition}
      GROUP BY p.ProductID, p.Name, psc.Name, pc.Name
      ORDER BY TotalQuantitySold DESC
    `;
    const topSellingProducts = await executeQuery(topSellingProductsQuery);
    
    // Get top revenue products
    const topRevenueProductsQuery = `
      SELECT TOP 10
        p.ProductID,
        p.Name AS ProductName,
        psc.Name AS SubcategoryName,
        pc.Name AS CategoryName,
        SUM(sod.OrderQty) AS TotalQuantitySold,
        SUM(sod.LineTotal) AS TotalRevenue,
        AVG(sod.UnitPrice) AS AverageUnitPrice,
        COUNT(DISTINCT sod.SalesOrderID) AS NumberOfOrders
      FROM Production.Product p
      JOIN Sales.SalesOrderDetail sod ON p.ProductID = sod.ProductID
      LEFT JOIN Production.ProductSubcategory psc ON p.ProductSubcategoryID = psc.ProductSubcategoryID
      LEFT JOIN Production.ProductCategory pc ON psc.ProductCategoryID = pc.ProductCategoryID
      WHERE 1=1
        ${dateCondition}
        ${categoryCondition}
      GROUP BY p.ProductID, p.Name, psc.Name, pc.Name
      ORDER BY TotalRevenue DESC
    `;
    const topRevenueProducts = await executeQuery(topRevenueProductsQuery);
    
    // Get product inventory levels
    const productInventoryQuery = `
      SELECT TOP 10
        p.ProductID,
        p.Name AS ProductName,
        psc.Name AS SubcategoryName,
        pc.Name AS CategoryName,
        p.ListPrice,
        p.StandardCost,
        pi.Quantity AS InventoryQuantity,
        pi.Quantity * p.ListPrice AS InventoryValue
      FROM Production.Product p
      JOIN Production.ProductInventory pi ON p.ProductID = pi.ProductID
      LEFT JOIN Production.ProductSubcategory psc ON p.ProductSubcategoryID = psc.ProductSubcategoryID
      LEFT JOIN Production.ProductCategory pc ON psc.ProductCategoryID = pc.ProductCategoryID
      WHERE p.FinishedGoodsFlag = 1
        ${categoryCondition}
      ORDER BY pi.Quantity DESC
    `;
    const productInventory = await executeQuery(productInventoryQuery);
    
    return NextResponse.json({
      success: true,
      data: {
        summary: productSummary[0],
        productsByCategory,
        topSellingProducts,
        topRevenueProducts,
        productInventory
      }
    });
  } catch (error) {
    console.error('Product dashboard data error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to retrieve product dashboard data',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}