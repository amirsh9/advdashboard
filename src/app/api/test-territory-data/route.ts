import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/mssql';

export async function GET() {
  try {
    // Simple query to check if SalesTerritory table has data
    const territoryQuery = `
      SELECT TOP 5 *
      FROM Sales.SalesTerritory
    `;
    
    const territories = await executeQuery(territoryQuery);
    
    // Check if SalesOrderHeader has data
    const ordersQuery = `
      SELECT TOP 5 SalesOrderID, TerritoryID, Status, SubTotal
      FROM Sales.SalesOrderHeader
    `;
    
    const orders = await executeQuery(ordersQuery);
    
    // Check distinct status values
    const statusQuery = `
      SELECT DISTINCT Status, COUNT(*) as Count
      FROM Sales.SalesOrderHeader
      GROUP BY Status
    `;
    
    const statusValues = await executeQuery(statusQuery);
    
    return NextResponse.json({
      success: true,
      data: {
        territories,
        orders,
        statusValues
      }
    });
  } catch (error) {
    console.error('Territory data test error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to retrieve territory test data',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}