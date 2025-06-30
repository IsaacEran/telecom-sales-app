'use client'

import { useEffect, useState } from 'react'
import { getCompanies, type Company } from '@/lib/db'

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCompanies() {
      try {
        setLoading(true)
        const data = await getCompanies()
        setCompanies(data)
        setError(null)
      } catch (err) {
        setError('שגיאה בטעינת החברות')
        console.error('Error fetching companies:', err)
      } finally {
        setLoading(false)
      }
    }
    
    fetchCompanies()
  }, [])

  if (loading) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">חברות</h1>
        <div className="flex items-center justify-center p-8">
          <div className="text-lg">טוען...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">חברות</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">חברות ({companies.length})</h1>
      <div className="grid gap-4">
        {companies.map((company) => (
          <div 
            key={company["ח.פ. או ע.מ"]} 
            className="p-4 border rounded-lg hover:shadow-lg transition-shadow"
          >
            <h2 className="font-bold text-lg">{company["שם העסק"]}</h2>
            <p className="text-gray-600">ח.פ./ע.מ: {company["ח.פ. או ע.מ"]}</p>
            {company["טלפון"] && <p>טלפון: {company["טלפון"]}</p>}
            {company["כתובת מלאה"] && <p>כתובת: {company["כתובת מלאה"]}</p>}
            {company["ספק אינטרנט"] && <p>ספק אינטרנט: {company["ספק אינטרנט"]}</p>}
          </div>
        ))}
      </div>
      {companies.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          לא נמצאו חברות
        </div>
      )}
    </div>
  )
} 