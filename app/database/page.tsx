
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

export default function DatabaseViewer() {
  const [tables, setTables] = useState<string[]>([])
  const [selectedTable, setSelectedTable] = useState('')
  const [records, setRecords] = useState<any[]>([])

  useEffect(() => {
    async function fetchTables() {
      const { data, error } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')
      
      if (data) {
        setTables(data.map(t => t.table_name))
      }
    }
    fetchTables()
  }, [])

  async function viewTable(tableName: string) {
    setSelectedTable(tableName)
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
    
    if (data) {
      setRecords(data)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Database Records</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Tables</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-2">
              {tables.map(table => (
                <button 
                  key={table}
                  onClick={() => viewTable(table)}
                  className={`text-left p-2 rounded ${selectedTable === table ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'}`}
                >
                  {table}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>{selectedTable || 'Select a table'}</CardTitle>
          </CardHeader>
          <CardContent>
            {records.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      {Object.keys(records[0]).map(key => (
                        <th key={key} className="text-left p-2 border-b">{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((record, i) => (
                      <tr key={i}>
                        {Object.values(record).map((value: any, j) => (
                          <td key={j} className="p-2 border-b">
                            {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>Select a table to view records</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
