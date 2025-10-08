import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/mssql';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateRange = searchParams.get('dateRange') || '2014';
    const territory = searchParams.get('territory') || 'all';
    const status = searchParams.get('status') || 'all';
    const category = searchParams.get('category') || 'all';
    
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
      } else if (dateRange === '2011-2014') {
        dateCondition = "AND YEAR(soh.OrderDate) BETWEEN 2011 AND 2014";
      } else if (dateRange === 'q4-2014') {
        dateCondition = "AND YEAR(soh.OrderDate) = 2014 AND MONTH(soh.OrderDate) IN (10, 11, 12)";
      } else if (dateRange === 'q3-2014') {
        dateCondition = "AND YEAR(soh.OrderDate) = 2014 AND MONTH(soh.OrderDate) IN (7, 8, 9)";
      } else if (dateRange === 'q2-2014') {
        dateCondition = "AND YEAR(soh.OrderDate) = 2014 AND MONTH(soh.OrderDate) IN (4, 5, 6)";
      } else if (dateRange === 'q1-2014') {
        dateCondition = "AND YEAR(soh.OrderDate) = 2014 AND MONTH(soh.OrderDate) IN (1, 2, 3)";
      }
    }
    
    // Build territory filter condition
    let territoryCondition = '';
    if (territory !== 'all') {
      if (territory === 'north-america') {
        territoryCondition = "AND st.CountryRegionCode IN ('US', 'CA')";
      } else if (territory === 'europe') {
        territoryCondition = "AND st.CountryRegionCode IN ('GB', 'DE', 'FR')";
      } else if (territory === 'asia') {
        territoryCondition = "AND st.CountryRegionCode IN ('JP', 'CN', 'KR')";
      } else if (territory === 'south-america') {
        territoryCondition = "AND st.CountryRegionCode IN ('BR', 'AR', 'CL')";
      }
    }
    
    // Get sales territory summary metrics
    const territorySummaryQuery = `
      SELECT
        COUNT(DISTINCT st.TerritoryID) AS TotalTerritories,
        COUNT(DISTINCT st.CountryRegionCode) AS TotalCountries,
        COUNT(DISTINCT st.[Group]) AS TotalGroups,
        COUNT(DISTINCT soh.SalesPersonID) AS TotalSalesPeople,
        SUM(soh.SubTotal) AS TotalSales,
        AVG(soh.SubTotal) AS AverageSalePerTerritory
      FROM Sales.SalesTerritory st
      LEFT JOIN Sales.SalesOrderHeader soh ON st.TerritoryID = soh.TerritoryID
      WHERE 1=1 ${dateCondition} ${territoryCondition}
    `;
    const territorySummary = await executeQuery(territorySummaryQuery);
    
    // Get sales by territory
    const salesByTerritoryQuery = `
      SELECT
        st.TerritoryID,
        st.Name AS TerritoryName,
        st.CountryRegionCode,
        st.[Group],
        st.SalesYTD,
        st.SalesLastYear,
        COUNT(soh.SalesOrderID) AS OrderCount,
        SUM(soh.SubTotal) AS TotalSales,
        AVG(soh.SubTotal) AS AverageOrderValue,
        COUNT(DISTINCT soh.CustomerID) AS CustomerCount,
        COUNT(DISTINCT soh.SalesPersonID) AS SalesPersonCount
      FROM Sales.SalesTerritory st
      LEFT JOIN Sales.SalesOrderHeader soh ON st.TerritoryID = soh.TerritoryID
      WHERE 1=1 ${dateCondition} ${territoryCondition}
      GROUP BY st.TerritoryID, st.Name, st.CountryRegionCode, st.[Group], st.SalesYTD, st.SalesLastYear
      ORDER BY TotalSales DESC
    `;
    const salesByTerritory = await executeQuery(salesByTerritoryQuery);
    
    // Get sales by country/region
    const salesByCountryQuery = `
      SELECT
        st.CountryRegionCode,
        COUNT(DISTINCT st.TerritoryID) AS TerritoryCount,
        COUNT(soh.SalesOrderID) AS OrderCount,
        SUM(soh.SubTotal) AS TotalSales,
        AVG(soh.SubTotal) AS AverageOrderValue,
        COUNT(DISTINCT soh.CustomerID) AS CustomerCount
      FROM Sales.SalesTerritory st
      LEFT JOIN Sales.SalesOrderHeader soh ON st.TerritoryID = soh.TerritoryID
      WHERE 1=1 ${dateCondition} ${territoryCondition}
      GROUP BY st.CountryRegionCode
      ORDER BY TotalSales DESC
    `;
    const salesByCountry = await executeQuery(salesByCountryQuery);
    
    // Get sales by territory group
    const salesByGroupQuery = `
      SELECT
        st.[Group],
        COUNT(DISTINCT st.TerritoryID) AS TerritoryCount,
        COUNT(soh.SalesOrderID) AS OrderCount,
        SUM(soh.SubTotal) AS TotalSales,
        AVG(soh.SubTotal) AS AverageOrderValue,
        COUNT(DISTINCT soh.CustomerID) AS CustomerCount
      FROM Sales.SalesTerritory st
      LEFT JOIN Sales.SalesOrderHeader soh ON st.TerritoryID = soh.TerritoryID
      WHERE 1=1 ${dateCondition} ${territoryCondition}
      GROUP BY st.[Group]
      ORDER BY TotalSales DESC
    `;
    const salesByGroup = await executeQuery(salesByGroupQuery);
    
    // Get top performing territories
    const topTerritoriesQuery = `
      SELECT TOP 10
        st.TerritoryID,
        st.Name AS TerritoryName,
        st.CountryRegionCode,
        st.[Group],
        st.SalesYTD,
        st.SalesLastYear,
        (st.SalesYTD - st.SalesLastYear) AS YearOverYearChange,
        COUNT(soh.SalesOrderID) AS OrderCount,
        SUM(soh.SubTotal) AS TotalSales,
        COUNT(DISTINCT soh.CustomerID) AS CustomerCount
      FROM Sales.SalesTerritory st
      LEFT JOIN Sales.SalesOrderHeader soh ON st.TerritoryID = soh.TerritoryID
      WHERE 1=1 ${dateCondition} ${territoryCondition}
      GROUP BY st.TerritoryID, st.Name, st.CountryRegionCode, st.[Group], st.SalesYTD, st.SalesLastYear
      ORDER BY TotalSales DESC
    `;
    const topTerritories = await executeQuery(topTerritoriesQuery);
    
    // Get sales people performance by territory
    const salesPeopleByTerritoryQuery = `
      SELECT
        st.TerritoryID,
        st.Name AS TerritoryName,
        e.BusinessEntityID,
        p.FirstName + ' ' + p.LastName AS SalesPersonName,
        e.JobTitle,
        COUNT(soh.SalesOrderID) AS OrderCount,
        SUM(soh.SubTotal) AS TotalSales,
        AVG(soh.SubTotal) AS AverageOrderValue,
        COUNT(DISTINCT soh.CustomerID) AS CustomerCount
      FROM Sales.SalesTerritory st
      JOIN Sales.SalesPerson sp ON st.TerritoryID = sp.TerritoryID
      JOIN HumanResources.Employee e ON sp.BusinessEntityID = e.BusinessEntityID
      JOIN Person.Person p ON e.BusinessEntityID = p.BusinessEntityID
      LEFT JOIN Sales.SalesOrderHeader soh ON sp.BusinessEntityID = soh.SalesPersonID
      WHERE 1=1 ${dateCondition} ${territoryCondition}
      GROUP BY st.TerritoryID, st.Name, e.BusinessEntityID, p.FirstName, p.LastName, e.JobTitle
      ORDER BY TotalSales DESC
    `;
    const salesPeopleByTerritory = await executeQuery(salesPeopleByTerritoryQuery);
    
    return NextResponse.json({
      success: true,
      data: {
        summary: territorySummary[0],
        salesByTerritory,
        salesByCountry,
        salesByGroup,
        topTerritories,
        salesPeopleByTerritory
      }
    });
  } catch (error) {
    console.error('Sales territory dashboard data error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to retrieve sales territory dashboard data',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}