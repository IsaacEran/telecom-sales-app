import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FileText, Users, Package, ClipboardList, FileCheck, Calendar } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <div className="container mx-auto px-4 py-6 md:py-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">מערכת מכירות טלקום</h1>
          <p className="text-muted-foreground mt-2">ניהול הזמנות, לקוחות ומוצרים במקום אחד</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                הזמנה חדשה
              </CardTitle>
              <CardDescription>יצירת הזמנה חדשה ללקוח קיים או חדש</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/new-order">
                <Button variant="outline" className="w-full" size="lg">
                  צור הזמנה
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Add other action cards */}
        </div>
      </div>
    </div>
  )
} 