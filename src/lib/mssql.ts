import { config, ConnectionPool } from 'mssql';

// SQL Server configuration
const sqlConfig: config = {
  user: 'sa',
  password: '@mirPejman1',
  server: 'Shoaei-A', // You can use 'localhost' instead
  database: 'AdventureWorks2022',
  connectionTimeout: 60000, // 60 seconds
  requestTimeout: 60000, // 60 seconds
  options: {
    encrypt: false, // Use this if you're on Windows Azure
    trustServerCertificate: true // Change to true for local dev / self-signed certs
  }
};

// Create a connection pool
const pool = new ConnectionPool(sqlConfig);
const poolConnect = pool.connect();

// Function to execute queries
export async function executeQuery(query: string) {
  try {
    await poolConnect;
    const result = await pool.request().query(query);
    return result.recordset;
  } catch (error) {
    console.error('SQL Error:', error);
    throw error;
  }
}

// Test connection function
export async function testConnection() {
  try {
    await poolConnect;
    const result = await pool.request().query('SELECT @@VERSION as version');
    return result.recordset[0];
  } catch (error) {
    console.error('Connection Error:', error);
    throw error;
  }
}

export default pool;