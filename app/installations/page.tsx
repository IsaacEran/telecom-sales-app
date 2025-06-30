
'use client'

import { Header } from "@/components/Header"

export default function InstallationsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header title="התקנות" backUrl="/" />
      <main className="container mx-auto p-4">
        <div className="bg-card rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">לוח זמנים להתקנות</h2>
          {/* Content will be added in the future */}
          <p className="text-muted-foreground">טרם נקבעו התקנות</p>
        </div>
      </main>
    </div>
  )
}
