'use client'

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export default function NewOrderPage() {
  const router = useRouter()

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
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">יצירת הזמנה חדשה - שלב 1 מתוך 3</h1>
          
          <Card className="p-6">
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-4">בחר לקוח קיים או צור לקוח חדש</h2>
                <RadioGroup defaultValue="existing" className="space-y-4">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <RadioGroupItem value="existing" id="existing" />
                    <Label htmlFor="existing">לקוח קיים</Label>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <RadioGroupItem value="new" id="new" />
                    <Label htmlFor="new">לקוח חדש</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="search">חפש לקוח לפי שם או ח.פ</Label>
                  <Input 
                    id="search"
                    type="text" 
                    placeholder="הקלד לחיפוש..."
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button>המשך</Button>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
} 