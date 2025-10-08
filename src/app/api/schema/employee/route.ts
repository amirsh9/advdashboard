import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/mssql';

export async function GET() {
  try {
    // Get column information for Employee table
    const employeeSchemaQuery = `
      SELECT 
        COLUMN_NAME,
        DATA_TYPE,
        IS_NULLABLE,
        CHARACTER_MAXIMUM_LENGTH
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_NAME = 'Employee' AND TABLE_SCHEMA = 'HumanResources'
      ORDER BY ORDINAL_POSITION
    `;
    
    const employeeSchema = await executeQuery(employeeSchemaQuery);
    
    // Get some sample data to understand the structure
    const sampleDataQuery = `
      SELECT TOP 3 *
      FROM HumanResources.Employee
    `;
    
    const sampleData = await executeQuery(sampleDataQuery);
    
    // Check Person table structure for name fields
    const personSchemaQuery = `
      SELECT 
        COLUMN_NAME,
        DATA_TYPE,
        IS_NULLABLE,
        CHARACTER_MAXIMUM_LENGTH
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_NAME = 'Person' AND TABLE_SCHEMA = 'Person'
      ORDER BY ORDINAL_POSITION
    `;
    
    const personSchema = await executeQuery(personSchemaQuery);
    
    return NextResponse.json({
      success: true,
      data: {
        employeeSchema,
        employeeSampleData: sampleData,
        personSchema
      }
    });
  } catch (error) {
    console.error('Employee schema error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to retrieve employee schema',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}