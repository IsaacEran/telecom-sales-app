
'use client'

import { useState, useEffect } from 'react'
import { testConnection, getCompanies, getProducts, createCompany } from '@/lib/db'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function DatabasePage() {
  const [connectionStatus, setConnectionStatus] = useState<'testing' | 'connected' | 'failed'>('testing')
  const [stats, setStats] = useState({ companies: 0, products: 0 })
  const [loading, setLoading] = useState(false)

  const testDatabaseConnection = async () => {
    setConnectionStatus('testing')
    try {
      const isConnected = await testConnection()
      setConnectionStatus(isConnected ? 'connected' : 'failed')
      
      if (isConnected) {
        await loadStats()
      }
    } catch (error) {
      console.error('Connection test failed:', error)
      setConnectionStatus('failed')
    }
  }

  const loadStats = async () => {
    try {
      const [companies, products] = await Promise.all([
        getCompanies(),
        getProducts()
      ])
      
      setStats({
        companies: companies.length,
        products: products.length
      })
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  const createTestCompany = async () => {
    setLoading(true)
    try {
      const testCompany = {
        "שם העסק": "חברת בדיקה",
        "ח.פ. או ע.מ": `TEST-${Date.now()}`,
        "טלפון": "03-1234567",
        "כתובת מלאה": "רחוב הבדיקה 1, תל אביב",
        "ספק אינטרנט": "בזק",
        "מייל בית העסק": "test@example.com",
        "סוג עסק": "בדיקה",
        "שם מורשה חתימה": "ישראל ישראלי",
        "נייד מורשה חתימה": "052-1234567",
        "מייל מורשה חתימה": "signatory@example.com"
      }
      
      const result = await createCompany(testCompany)
      if (result) {
        alert('חברת בדיקה נוצרה בהצלחה!')
        await loadStats()
      } else {
        alert('שגיאה ביצירת חברת הבדיקה')
      }
    } catch (error) {
      console.error('Error creating test company:', error)
      alert('שגיאה ביצירת חברת הבדיקה')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    testDatabaseConnection()
  }, [])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">ניהול מסד נתונים</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              סטטוס חיבור
              <Badge 
                variant={connectionStatus === 'connected' ? 'default' : connectionStatus === 'failed' ? 'destructive' : 'secondary'}
              >
                {connectionStatus === 'connected' ? 'מחובר' : connectionStatus === 'failed' ? 'נכשל' : 'בודק...'}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={testDatabaseConnection}
              disabled={connectionStatus === 'testing'}
              variant="outline"
              className="w-full"
            >
              בדוק חיבור
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>חברות</CardTitle>
            <CardDescription>מספר החברות במערכת</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.companies}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>מוצרים</CardTitle>
            <CardDescription>מספר המוצרים בקטלוג</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.products}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>פעולות בדיקה</CardTitle>
          <CardDescription>פעולות לבדיקת תקינות המערכת</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={createTestCompany}
            disabled={loading || connectionStatus !== 'connected'}
            className="w-full md:w-auto"
          >
            {loading ? 'יוצר חברת בדיקה...' : 'צור חברת בדיקה'}
          </Button>
          
          <Button 
            onClick={loadStats}
            disabled={connectionStatus !== 'connected'}
            variant="outline"
            className="w-full md:w-auto md:ml-2"
          >
            רענן סטטיסטיקות
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>הוראות הגדרה</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">הגדרת משתני סביבה:</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm">
              <li>צור פרויקט Supabase חדש</li>
              <li>העתק את ה-URL וה-API key</li>
              <li>הוסף לקובץ .env.local:</li>
            </ol>
            <pre className="bg-gray-800 text-green-400 p-2 rounded mt-2 text-xs overflow-x-auto">
{`NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key`}
            </pre>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">הרצת migration:</h3>
            <pre className="bg-gray-800 text-green-400 p-2 rounded text-xs">
npm install && npm run migrate
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
