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
        dateCondition = "AND YEAR(pi.ModifiedDate) = 2014";
      } else if (dateRange === '2013') {
        dateCondition = "AND YEAR(pi.ModifiedDate) = 2013";
      } else if (dateRange === '2012') {
        dateCondition = "AND YEAR(pi.ModifiedDate) = 2012";
      } else if (dateRange === '2011') {
        dateCondition = "AND YEAR(pi.ModifiedDate) = 2011";
      } else if (dateRange === '2011-2014') {
        dateCondition = "AND YEAR(pi.ModifiedDate) BETWEEN 2011 AND 2014";
      }
    }
    
    // Build category filter condition
    let categoryCondition = '';
    if (category !== 'all') {
      categoryCondition = `AND pc.Name = '${category}'`;
    }
    
    // Get inventory summary metrics
    const inventorySummaryQuery = `
      SELECT
        COUNT(DISTINCT pi.ProductID) AS ProductsWithInventory,
        COUNT(DISTINCT pi.LocationID) AS TotalLocations,
        SUM(pi.Quantity) AS TotalQuantity,
        AVG(pi.Quantity) AS AverageQuantityPerLocation,
        COUNT(CASE WHEN pi.Quantity < 10 THEN 1 END) AS LowStockItems,
        COUNT(CASE WHEN pi.Quantity > 1000 THEN 1 END) AS HighStockItems
      FROM Production.ProductInventory pi
      JOIN Production.Product p ON pi.ProductID = p.ProductID
      LEFT JOIN Production.ProductSubcategory psc ON p.ProductSubcategoryID = psc.ProductSubcategoryID
      LEFT JOIN Production.ProductCategory pc ON psc.ProductCategoryID = pc.ProductCategoryID
      WHERE p.DiscontinuedDate IS NULL ${categoryCondition} ${dateCondition}
    `;
    const inventorySummary = await executeQuery(inventorySummaryQuery);
    
    // Get inventory by location
    const inventoryByLocationQuery = `
      SELECT
        l.Name AS LocationName,
        l.LocationID,
        COUNT(DISTINCT pi.ProductID) AS ProductCount,
        SUM(pi.Quantity) AS TotalQuantity,
        AVG(pi.Quantity) AS AverageQuantity,
        COUNT(CASE WHEN pi.Quantity < 10 THEN 1 END) AS LowStockCount
      FROM Production.ProductInventory pi
      JOIN Production.Location l ON pi.LocationID = l.LocationID
      JOIN Production.Product p ON pi.ProductID = p.ProductID
      LEFT JOIN Production.ProductSubcategory psc ON p.ProductSubcategoryID = psc.ProductSubcategoryID
      LEFT JOIN Production.ProductCategory pc ON psc.ProductCategoryID = pc.ProductCategoryID
      WHERE p.DiscontinuedDate IS NULL ${categoryCondition} ${dateCondition}
      GROUP BY l.Name, l.LocationID
      ORDER BY TotalQuantity DESC
    `;
    const inventoryByLocation = await executeQuery(inventoryByLocationQuery);
    
    // Get products with low inventory
    const lowInventoryQuery = `
      SELECT TOP 20
        p.ProductID,
        p.Name AS ProductName,
        p.ProductNumber,
        p.ListPrice,
        p.SafetyStockLevel,
        p.ReorderPoint,
        SUM(pi.Quantity) AS TotalQuantity,
        COUNT(DISTINCT pi.LocationID) AS LocationCount,
        STRING_AGG(l.Name, ', ') AS Locations
      FROM Production.Product p
      JOIN Production.ProductInventory pi ON p.ProductID = pi.ProductID
      JOIN Production.Location l ON pi.LocationID = l.LocationID
      LEFT JOIN Production.ProductSubcategory psc ON p.ProductSubcategoryID = psc.ProductSubcategoryID
      LEFT JOIN Production.ProductCategory pc ON psc.ProductCategoryID = pc.ProductCategoryID
      WHERE p.DiscontinuedDate IS NULL ${categoryCondition} ${dateCondition}
      GROUP BY p.ProductID, p.Name, p.ProductNumber, p.ListPrice, p.SafetyStockLevel, p.ReorderPoint
      HAVING SUM(pi.Quantity) < p.SafetyStockLevel
      ORDER BY TotalQuantity ASC
    `;
    const lowInventory = await executeQuery(lowInventoryQuery);
    
    // Get products with high inventory
    const highInventoryQuery = `
      SELECT TOP 20
        p.ProductID,
        p.Name AS ProductName,
        p.ProductNumber,
        p.ListPrice,
        p.SafetyStockLevel,
        p.ReorderPoint,
        SUM(pi.Quantity) AS TotalQuantity,
        COUNT(DISTINCT pi.LocationID) AS LocationCount,
        (SUM(pi.Quantity) * p.StandardCost) AS InventoryValue
      FROM Production.Product p
      JOIN Production.ProductInventory pi ON p.ProductID = pi.ProductID
      LEFT JOIN Production.ProductSubcategory psc ON p.ProductSubcategoryID = psc.ProductSubcategoryID
      LEFT JOIN Production.ProductCategory pc ON psc.ProductCategoryID = pc.ProductCategoryID
      WHERE p.DiscontinuedDate IS NULL ${categoryCondition} ${dateCondition}
      GROUP BY p.ProductID, p.Name, p.ProductNumber, p.ListPrice, p.SafetyStockLevel, p.ReorderPoint, p.StandardCost
      HAVING SUM(pi.Quantity) > p.SafetyStockLevel * 2
      ORDER BY TotalQuantity DESC
    `;
    const highInventory = await executeQuery(highInventoryQuery);
    
    // Get inventory by category
    const inventoryByCategoryQuery = `
      SELECT
        pc.Name AS CategoryName,
        COUNT(DISTINCT p.ProductID) AS ProductCount,
        SUM(pi.Quantity) AS TotalQuantity,
        AVG(pi.Quantity) AS AverageQuantity,
        COUNT(CASE WHEN pi.Quantity < 10 THEN 1 END) AS LowStockCount,
        SUM(pi.Quantity * p.StandardCost) AS TotalValue
      FROM Production.Product p
      JOIN Production.ProductInventory pi ON p.ProductID = pi.ProductID
      JOIN Production.ProductSubcategory psc ON p.ProductSubcategoryID = psc.ProductSubcategoryID
      JOIN Production.ProductCategory pc ON psc.ProductCategoryID = pc.ProductCategoryID
      WHERE p.DiscontinuedDate IS NULL ${dateCondition}
      GROUP BY pc.Name
      ORDER BY TotalQuantity DESC
    `;
    const inventoryByCategory = await executeQuery(inventoryByCategoryQuery);
    
    // Get inventory value by location
    const inventoryValueByLocationQuery = `
      SELECT
        l.Name AS LocationName,
        COUNT(DISTINCT pi.ProductID) AS ProductCount,
        SUM(pi.Quantity) AS TotalQuantity,
        SUM(pi.Quantity * p.StandardCost) AS TotalValue,
        AVG(pi.Quantity * p.StandardCost) AS AverageValuePerProduct
      FROM Production.ProductInventory pi
      JOIN Production.Location l ON pi.LocationID = l.LocationID
      JOIN Production.Product p ON pi.ProductID = p.ProductID
      LEFT JOIN Production.ProductSubcategory psc ON p.ProductSubcategoryID = psc.ProductSubcategoryID
      LEFT JOIN Production.ProductCategory pc ON psc.ProductCategoryID = pc.ProductCategoryID
      WHERE p.DiscontinuedDate IS NULL ${categoryCondition} ${dateCondition}
      GROUP BY l.Name
      ORDER BY TotalValue DESC
    `;
    const inventoryValueByLocation = await executeQuery(inventoryValueByLocationQuery);
    
    return NextResponse.json({
      success: true,
      data: {
        summary: inventorySummary[0],
        inventoryByLocation,
        lowInventory,
        highInventory,
        inventoryByCategory,
        inventoryValueByLocation
      }
    });
  } catch (error) {
    console.error('Inventory dashboard data error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to retrieve inventory dashboard data',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}