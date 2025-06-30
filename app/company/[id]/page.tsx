'use client'

import { useEffect, useState } from 'react'
import { getCompany, type Company } from '@/lib/db'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

export default function CompanyPage({ params }: { params: { id: string } }) {
  const [company, setCompany] = useState<Company | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCompany() {
      try {
        setLoading(true)
        const data = await getCompany(params.id)
        setCompany(data)
        setError(null)
      } catch (err) {
        setError('שגיאה בטעינת החברה')
        console.error('Error fetching company:', err)
      } finally {
        setLoading(false)
      }
    }
    
    if (params.id) {
      fetchCompany()
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-center p-8">
          <div className="text-lg">טוען פרטי חברה...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    )
  }

  if (!company) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="text-center py-8">
          <h1 className="text-2xl font-bold mb-4">חברה לא נמצאה</h1>
          <p className="text-gray-600">חברה עם מספר {params.id} לא נמצאה במערכת</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{company["שם העסק"]}</h1>
        <Badge variant="secondary">{company["ח.פ. או ע.מ"]}</Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>פרטי העסק</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {company["סוג עסק"] && (
              <div>
                <span className="font-medium">סוג עסק:</span> {company["סוג עסק"]}
              </div>
            )}
            {company["טלפון"] && (
              <div>
                <span className="font-medium">טלפון:</span> {company["טלפון"]}
              </div>
            )}
            {company["כתובת מלאה"] && (
              <div>
                <span className="font-medium">כתובת:</span> {company["כתובת מלאה"]}
              </div>
            )}
            {company["מייל בית העסק"] && (
              <div>
                <span className="font-medium">מייל:</span> {company["מייל בית העסק"]}
              </div>
            )}
            {company["ספק אינטרנט"] && (
              <div>
                <span className="font-medium">ספק אינטרנט:</span> {company["ספק אינטרנט"]}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>מורשה חתימה</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {company["שם מורשה חתימה"] && (
              <div>
                <span className="font-medium">שם מלא:</span> {company["שם מורשה חתימה"]}
              </div>
            )}
            {company["נייד מורשה חתימה"] && (
              <div>
                <span className="font-medium">נייד:</span> {company["נייד מורשה חתימה"]}
              </div>
            )}
            {company["מייל מורשה חתימה"] && (
              <div>
                <span className="font-medium">מייל:</span> {company["מייל מורשה חתימה"]}
              </div>
            )}
          </CardContent>
        </Card>

        {(company["שם איש קשר"] || company["נייד איש קשר"] || company["מייל איש קשר"]) && (
          <Card>
            <CardHeader>
              <CardTitle>איש קשר</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {company["שם איש קשר"] && (
                <div>
                  <span className="font-medium">שם:</span> {company["שם איש קשר"]}
                </div>
              )}
              {company["נייד איש קשר"] && (
                <div>
                  <span className="font-medium">נייד:</span> {company["נייד איש קשר"]}
                </div>
              )}
              {company["מייל איש קשר"] && (
                <div>
                  <span className="font-medium">מייל:</span> {company["מייל איש קשר"]}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {company["הערות"] && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>הערות</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{company["הערות"]}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
} 