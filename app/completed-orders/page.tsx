
'use client'

import { Header } from "@/components/Header"

export default function CompletedOrdersPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header title="הזמנות שהושלמו" backUrl="/" />
      <main className="container mx-auto p-4">
        <div className="bg-card rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">רשימת הזמנות שהושלמו</h2>
          {/* Content will be added in the future */}
          <p className="text-muted-foreground">טרם נוספו הזמנות שהושלמו</p>
        </div>
      </main>
    </div>
  )
}
