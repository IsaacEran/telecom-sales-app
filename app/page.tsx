
'use client'

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FileText, Users, Package, ClipboardList, FileCheck, Calendar } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function HomePage() {
  const menuItems = [
    {
      icon: <FileText className="h-5 w-5" />,
      title: "הזמנה חדשה",
      description: "יצירת הזמנה חדשה ללקוח קיים או חדש",
      href: "/new-order"
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: "לקוחות",
      description: "ניהול לקוחות וצפייה בפרטי לקוח",
      href: "/companies"
    },
    {
      icon: <Package className="h-5 w-5" />,
      title: "מוצרים",
      description: "ניהול מוצרים ומחירים",
      href: "/products"
    },
    {
      icon: <ClipboardList className="h-5 w-5" />,
      title: "הזמנות פעילות",
      description: "צפייה וניהול הזמנות פעילות",
      href: "/active-orders"
    },
    {
      icon: <FileCheck className="h-5 w-5" />,
      title: "הזמנות שהושלמו",
      description: "היסטוריית הזמנות שהושלמו",
      href: "/completed-orders"
    },
    {
      icon: <Calendar className="h-5 w-5" />,
      title: "התקנות",
      description: "ניהול לוח זמנים להתקנות",
      href: "/installations"
    }
  ]

  return (
    <div className="container mx-auto px-4 py-6 md:py-10">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">מערכת מכירות טלקום</h1>
        <p className="text-muted-foreground mt-2">ניהול הזמנות, לקוחות ומוצרים במקום אחד</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {menuItems.map((item, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {item.icon}
                {item.title}
              </CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href={item.href}>
                <Button variant="outline" className="w-full" size="lg">
                  {item.title === "הזמנה חדשה" ? "צור הזמנה" : "צפה"}
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
