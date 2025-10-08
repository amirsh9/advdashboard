'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Database, CheckCircle, XCircle, Loader2 } from 'lucide-react'

interface TestResult {
  success: boolean
  message: string
  version?: string
  tables?: any[]
  sampleData?: any
  error?: string
}

export default function TestDatabasePage() {
  const [result, setResult] = useState<TestResult | null>(null)
  const [loading, setLoading] = useState(false)

  const testConnection = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/test-db')
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({
        success: false,
        message: 'Failed to fetch data',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">SQL Server Connection Test</h1>
          <p className="text-gray-600">
            Test connection to AdventureWorks2022 database on Shoaei-A server
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Database Connection Test
            </CardTitle>
            <CardDescription>
              Click the button below to test the connection to your SQL Server database
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={testConnection} 
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Testing Connection...
                </>
              ) : (
                'Test Database Connection'
              )}
            </Button>

            {result && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  {result.success ? (
                    <>
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <Badge variant="default" className="bg-green-600">
                        Connection Successful
                      </Badge>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-5 w-5 text-red-600" />
                      <Badge variant="destructive">
                        Connection Failed
                      </Badge>
                    </>
                  )}
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium mb-2">Message:</p>
                  <p className="text-sm">{result.message}</p>
                  
                  {result.error && (
                    <>
                      <p className="font-medium mt-3 mb-2">Error:</p>
                      <p className="text-sm text-red-600">{result.error}</p>
                    </>
                  )}
                </div>

                {result.success && result.version && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-medium mb-2">SQL Server Version:</p>
                    <p className="text-sm font-mono">{result.version}</p>
                  </div>
                )}

                {result.success && result.tables && result.tables.length > 0 && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-medium mb-2">Sample Tables (First 10):</p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {result.tables.map((table: any, index: number) => (
                        <div key={index} className="font-mono">
                          {table.TABLE_SCHEMA}.{table.TABLE_NAME}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {result.success && result.sampleData && result.sampleData.length > 0 && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-medium mb-2">Sample Data from Person.Person:</p>
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-2">BusinessEntityID</th>
                            <th className="text-left p-2">FirstName</th>
                            <th className="text-left p-2">LastName</th>
                            <th className="text-left p-2">EmailAddress</th>
                          </tr>
                        </thead>
                        <tbody>
                          {result.sampleData.map((row: any, index: number) => (
                            <tr key={index} className="border-b">
                              <td className="p-2">{row.BusinessEntityID}</td>
                              <td className="p-2">{row.FirstName}</td>
                              <td className="p-2">{row.LastName}</td>
                              <td className="p-2">{row.EmailAddress}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}