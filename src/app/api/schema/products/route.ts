import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/mssql';

export async function GET() {
  try {
    // Get column information for Production.Product table
    const columnsQuery = `
      SELECT COLUMN_NAME, DATA_TYPE
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = 'Production' AND TABLE_NAME = 'Product'
      ORDER BY ORDINAL_POSITION
    `;
    const columns = await executeQuery(columnsQuery);
    
    // Get sample data from Production.Product
    const sampleQuery = `
      SELECT TOP 5 *
      FROM Production.Product
    `;
    const sampleData = await executeQuery(sampleQuery);
    
    // Get column information for Production.ProductSubcategory table
    const subcategoryColumnsQuery = `
      SELECT COLUMN_NAME, DATA_TYPE
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = 'Production' AND TABLE_NAME = 'ProductSubcategory'
      ORDER BY ORDINAL_POSITION
    `;
    const subcategoryColumns = await executeQuery(subcategoryColumnsQuery);
    
    // Get column information for Production.ProductCategory table
    const categoryColumnsQuery = `
      SELECT COLUMN_NAME, DATA_TYPE
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = 'Production' AND TABLE_NAME = 'ProductCategory'
      ORDER BY ORDINAL_POSITION
    `;
    const categoryColumns = await executeQuery(categoryColumnsQuery);
    
    return NextResponse.json({
      success: true,
      data: {
        productColumns: columns,
        productSampleData: sampleData,
        subcategoryColumns,
        categoryColumns
      }
    });
  } catch (error) {
    console.error('Schema query error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to retrieve schema information',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}