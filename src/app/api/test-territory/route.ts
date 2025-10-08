import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/mssql';

export async function GET() {
  try {
    // Test simple query on Sales.SalesTerritory
    const testQuery = `
      SELECT TOP 5
        TerritoryID,
        Name,
        CountryRegionCode,
        [Group]
      FROM Sales.SalesTerritory
    `;
    
    const result = await executeQuery(testQuery);
    
    return NextResponse.json({
      success: true,
      message: "Territory data retrieved successfully!",
      data: result
    });
  } catch (error) {
    console.error('Territory test error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to retrieve territory data',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}