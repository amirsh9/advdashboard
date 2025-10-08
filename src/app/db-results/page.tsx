'use client';

import { useState, useEffect } from 'react';

interface TableInfo {
  TABLE_SCHEMA: string;
  TABLE_NAME: string;
}

interface ColumnInfo {
  COLUMN_NAME: string;
  DATA_TYPE: string;
}

interface PersonData {
  BusinessEntityID: number;
  PersonType: string;
  NameStyle: boolean;
  Title: string | null;
  FirstName: string;
  MiddleName: string | null;
  LastName: string;
  Suffix: string | null;
  EmailPromotion: number;
  AdditionalContactInfo: string | null;
  Demographics: string;
  rowguid: string;
  ModifiedDate: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  version: string;
  tables: TableInfo[];
  sampleData: {
    columns: ColumnInfo[];
    data: PersonData[];
  } | null;
}

export default function DbResultsPage() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/test-db');
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center text-red-600">Error: {error}</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">No data available</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">SQL Server Connection Results</h1>
      
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Connection Status</h2>
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {data.success ? '✅ Connected successfully!' : '❌ Connection failed'}
        </div>
        <p className="mt-2">{data.message}</p>
        <p className="text-sm text-gray-600 mt-1">Server Version: {data.version}</p>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Sample Tables</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 border-b">Schema</th>
                <th className="px-4 py-2 border-b">Table Name</th>
              </tr>
            </thead>
            <tbody>
              {data.tables.map((table, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">{table.TABLE_SCHEMA}</td>
                  <td className="px-4 py-2 border-b">{table.TABLE_NAME}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {data.sampleData && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Person.Person Table Structure</h2>
          <div className="overflow-x-auto mb-6">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 border-b">Column Name</th>
                  <th className="px-4 py-2 border-b">Data Type</th>
                </tr>
              </thead>
              <tbody>
                {data.sampleData.columns.map((column, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border-b">{column.COLUMN_NAME}</td>
                    <td className="px-4 py-2 border-b">{column.DATA_TYPE}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="text-xl font-semibold mb-4">Sample Data (First 5 Records)</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 border-b">BusinessEntityID</th>
                  <th className="px-4 py-2 border-b">PersonType</th>
                  <th className="px-4 py-2 border-b">FirstName</th>
                  <th className="px-4 py-2 border-b">MiddleName</th>
                  <th className="px-4 py-2 border-b">LastName</th>
                  <th className="px-4 py-2 border-b">Title</th>
                  <th className="px-4 py-2 border-b">ModifiedDate</th>
                </tr>
              </thead>
              <tbody>
                {data.sampleData.data.map((person, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border-b">{person.BusinessEntityID}</td>
                    <td className="px-4 py-2 border-b">{person.PersonType}</td>
                    <td className="px-4 py-2 border-b">{person.FirstName}</td>
                    <td className="px-4 py-2 border-b">{person.MiddleName || '-'}</td>
                    <td className="px-4 py-2 border-b">{person.LastName}</td>
                    <td className="px-4 py-2 border-b">{person.Title || '-'}</td>
                    <td className="px-4 py-2 border-b">{new Date(person.ModifiedDate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}