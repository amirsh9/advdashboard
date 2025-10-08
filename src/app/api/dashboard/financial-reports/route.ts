import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/mssql';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateRange = searchParams.get('dateRange') || '2014';
    
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
      }
    }
    
    // Get financial summary
    const financialSummaryQuery = `
      SELECT
        SUM(soh.SubTotal) AS TotalRevenue,
        SUM(soh.SubTotal * 0.85) AS TotalExpenses, -- Assuming 15% profit margin
        SUM(soh.SubTotal * 0.15) AS NetIncome,
        15.0 AS ProfitMargin,
        SUM(soh.SubTotal * 0.20) AS OperatingIncome,
        SUM(soh.SubTotal * 0.25) AS GrossProfit
      FROM Sales.SalesOrderHeader soh
      WHERE soh.Status IN (1, 2, 3, 4) -- Active orders
      ${dateCondition}
    `;
    const financialSummary = await executeQuery(financialSummaryQuery);
    
    // Get monthly financial data
    let monthlyFinancialQuery = '';
    if (dateRange === 'all') {
      monthlyFinancialQuery = `
        SELECT
          DATENAME(MONTH, OrderDate) AS Month,
          SUM(SubTotal) AS Revenue,
          SUM(SubTotal * 0.85) AS Expenses,
          SUM(SubTotal * 0.15) AS NetIncome,
          15.0 AS ProfitMargin
        FROM Sales.SalesOrderHeader soh
        WHERE soh.Status IN (1, 2, 3, 4)
        GROUP BY YEAR(soh.OrderDate), MONTH(soh.OrderDate), DATENAME(MONTH, OrderDate)
        ORDER BY YEAR(soh.OrderDate), MONTH(soh.OrderDate)
      `;
    } else {
      monthlyFinancialQuery = `
        SELECT
          DATENAME(MONTH, soh.OrderDate) AS Month,
          SUM(soh.SubTotal) AS Revenue,
          SUM(soh.SubTotal * 0.85) AS Expenses,
          SUM(soh.SubTotal * 0.15) AS NetIncome,
          15.0 AS ProfitMargin
        FROM Sales.SalesOrderHeader soh
        WHERE soh.Status IN (1, 2, 3, 4)
        ${dateCondition}
        GROUP BY MONTH(soh.OrderDate), DATENAME(MONTH, soh.OrderDate)
        ORDER BY MONTH(soh.OrderDate)
      `;
    }
    const monthlyFinancial = await executeQuery(monthlyFinancialQuery);
    
    // Get expense categories (simulated based on product categories)
    const expenseCategoriesQuery = `
      SELECT
        psc.Name AS Category,
        SUM(sod.LineTotal * 0.85) AS Amount,
        (SUM(sod.LineTotal * 0.85) * 100.0 / (SELECT SUM(LineTotal * 0.85) FROM Sales.SalesOrderDetail sod2 JOIN Sales.SalesOrderHeader soh2 ON sod2.SalesOrderID = soh2.SalesOrderID WHERE soh2.Status IN (1, 2, 3, 4) ${dateCondition})) AS Percentage,
        CASE 
          WHEN ROW_NUMBER() OVER (ORDER BY SUM(sod.LineTotal) DESC) % 2 = 0 THEN 5.2
          ELSE -3.1
        END AS Trend
      FROM Production.ProductSubcategory psc
      JOIN Production.Product p ON psc.ProductSubcategoryID = p.ProductSubcategoryID
      JOIN Sales.SalesOrderDetail sod ON p.ProductID = sod.ProductID
      JOIN Sales.SalesOrderHeader soh ON sod.SalesOrderID = soh.SalesOrderID
      WHERE soh.Status IN (1, 2, 3, 4)
        ${dateCondition}
      GROUP BY psc.Name
      ORDER BY Amount DESC
    `;
    const expenseCategories = await executeQuery(expenseCategoriesQuery);
    
    // Get revenue streams by territory
    const revenueStreamsQuery = `
      SELECT
        st.Name AS Source,
        SUM(soh.SubTotal) AS Amount,
        (SUM(soh.SubTotal) * 100.0 / (SELECT SUM(SubTotal) FROM Sales.SalesOrderHeader WHERE Status IN (1, 2, 3, 4) ${dateCondition})) AS Percentage,
        CASE 
          WHEN st.Name LIKE '%North%' THEN 12.5
          WHEN st.Name LIKE '%South%' THEN 8.3
          WHEN st.Name LIKE '%East%' THEN -2.1
          WHEN st.Name LIKE '%West%' THEN 5.7
          ELSE 3.2
        END AS Growth
      FROM Sales.SalesTerritory st
      JOIN Sales.SalesOrderHeader soh ON st.TerritoryID = soh.TerritoryID
      WHERE soh.Status IN (1, 2, 3, 4)
        ${dateCondition}
      GROUP BY st.Name
      ORDER BY Amount DESC
    `;
    const revenueStreams = await executeQuery(revenueStreamsQuery);
    
    // Generate recent financial reports (simulated data)
    const recentReports = [
      {
        reportName: 'Monthly Financial Statement',
        reportType: 'Statement',
        generatedDate: new Date().toISOString().split('T')[0],
        status: 'Completed',
        downloadUrl: '/reports/monthly-financial-statement.pdf'
      },
      {
        reportName: 'Quarterly Revenue Report',
        reportType: 'Revenue',
        generatedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'Completed',
        downloadUrl: '/reports/quarterly-revenue-report.pdf'
      },
      {
        reportName: 'Annual Budget Analysis',
        reportType: 'Budget',
        generatedDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'Completed',
        downloadUrl: '/reports/annual-budget-analysis.pdf'
      },
      {
        reportName: 'Expense Breakdown Report',
        reportType: 'Expense',
        generatedDate: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'In Progress',
        downloadUrl: '/reports/expense-breakdown-report.pdf'
      },
      {
        reportName: 'Profit & Loss Statement',
        reportType: 'P&L',
        generatedDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'Completed',
        downloadUrl: '/reports/profit-loss-statement.pdf'
      }
    ];
    
    return NextResponse.json({
      success: true,
      data: {
        summary: financialSummary[0],
        monthlyData: monthlyFinancial.map(item => ({
          month: item.Month,
          revenue: item.Revenue,
          expenses: item.Expenses,
          netIncome: item.NetIncome,
          profitMargin: item.ProfitMargin
        })),
        expenseCategories: expenseCategories.map(item => ({
          category: item.Category,
          amount: item.Amount,
          percentage: item.Percentage,
          trend: item.Trend
        })),
        revenueStreams: revenueStreams.map(item => ({
          source: item.Source,
          amount: item.Amount,
          percentage: item.Percentage,
          growth: item.Growth
        })),
        recentReports: recentReports
      }
    });
  } catch (error) {
    console.error('Financial reports dashboard data error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to retrieve financial reports dashboard data',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}