import { NextResponse } from 'next/server';
import { executeQuery, testConnection } from '@/lib/mssql';

export async function GET() {
  try {
    // Test connection
    const versionInfo = await testConnection();
    
    // Execute a simple SELECT query to get table information
    const tablesQuery = `
      SELECT TABLE_SCHEMA, TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_TYPE = 'BASE TABLE' 
      ORDER BY TABLE_NAME
    `;
    const tables = await executeQuery(tablesQuery);
    
    // Get some sample data from Person table if it exists
    let sampleData: any = null;
    try {
      // First, get column information for Person.Person table
      const columnsQuery = `
        SELECT COLUMN_NAME, DATA_TYPE
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = 'Person' AND TABLE_NAME = 'Person'
        ORDER BY ORDINAL_POSITION
      `;
      const columns = await executeQuery(columnsQuery);
      
      // Then get sample data using only the columns that exist
      const sampleQuery = `
        SELECT TOP 5 *
        FROM Person.Person
        ORDER BY BusinessEntityID
      `;
      sampleData = await executeQuery(sampleQuery);
      
      // Include column information in the response
      sampleData = {
        columns: columns,
        data: sampleData
      };
    } catch (error) {
      console.log('Person.Person table might not exist or is not accessible');
    }
    
    return NextResponse.json({
      success: true,
      message: 'Connected to SQL Server successfully!',
      version: versionInfo.version,
      tables: tables.slice(0, 10), // Return first 10 tables
      sampleData: sampleData
    });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to connect to SQL Server',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}