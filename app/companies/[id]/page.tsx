'use client'

import { useState, useEffect } from 'react'
import { PageHeader } from '@/components/page-header'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getCompany, type Company } from "@/lib/db"
import { Building2, Phone, Mail, User, FileText } from 'lucide-react'

export default function CompanyDetailsPage({ params }: { params: { id: string } }) {
  const [company, setCompany] = useState<Company | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const data = await getCompany(params.id)
        setCompany(data || null)
      } catch (error) {
        console.error('Error fetching company:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchCompany()
  }, [params.id])

  if (isLoading) return <div>טוען...</div>
  if (!company) return <div>לקוח לא נמצא</div>

  return (
    <div className="min-h-screen bg-background">
      <PageHeader 
        title={company["שם העסק"]}
        description={`ח.פ./ע.מ: ${company["ח.פ. או ע.מ"]}`}
      />

      <main className="container mx-auto p-4">
        <Tabs defaultValue="details" className="space-y-4">
          <TabsList>
            <TabsTrigger value="details">פרטי לקוח</TabsTrigger>
            <TabsTrigger value="orders">היסטוריית הזמנות</TabsTrigger>
            <TabsTrigger value="installations">התקנות</TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    פרטי עסק
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p><strong>סוג עסק:</strong> {company["ע.מ. או חברה בעמ"]}</p>
                  <p><strong>כתובת:</strong> {company["כתובת מלאה"]}</p>
                  <p><strong>ספק אינטרנט:</strong> {company["ספק אינטרנט"]}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    איש קשר
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p><strong>שם:</strong> {company["שם מורשה"]}</p>
                  <p><strong>טלפון:</strong> {company["נייד מורשה"]}</p>
                  <p><strong>מייל:</strong> {company["מייל בית העסק לחשבוניות"]}</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>היסטוריית הזמנות</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Add orders history here */}
                <p className="text-muted-foreground">אין היסטוריית הזמנות</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="installations">
            <Card>
              <CardHeader>
                <CardTitle>התקנות</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Add installations here */}
                <p className="text-muted-foreground">אין התקנות מתוכננות</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
} 