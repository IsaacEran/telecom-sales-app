'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { getCompanies, type Company } from "@/lib/db"

export default function CompaniesPage() {
  const router = useRouter()
  const [companies, setCompanies] = useState<Company[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const data = await getCompanies()
        setCompanies(data)
      } catch (error) {
        console.error('Error fetching companies:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchCompanies()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <Button 
            variant="ghost" 
            onClick={() => router.push('/')}
            className="flex items-center gap-2"
          >
            <ArrowRight className="h-4 w-4" />
            חזור לדף הבית
          </Button>
        </div>
      </header>

      <main className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">לקוחות</h1>
          <Button onClick={() => router.push('/companies/new')}>
            <Plus className="h-4 w-4 mr-2" />
            לקוח חדש
          </Button>
        </div>

        {isLoading ? (
          <div>טוען...</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {companies.map((company) => (
              <Card 
                key={company["ח.פ. או ע.מ"]} 
                className="p-4 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => router.push(`/companies/${company["ח.פ. או ע.מ"]}`)}
              >
                <h2 className="font-bold text-lg">{company["שם העסק"]}</h2>
                <p className="text-sm text-muted-foreground">{company["ח.פ. או ע.מ"]}</p>
                <div className="mt-2 text-sm">
                  <p>{company["כתובת מלאה"]}</p>
                  <p>טלפון: {company["טלפון"]}</p>
                  <p>מייל: {company["מייל בית העסק לחשבוניות"]}</p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
} 