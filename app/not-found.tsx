'use client'

import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404 - לא נמצא</h1>
        <p className="text-muted-foreground">הדף שחיפשת לא נמצא.</p>
        <Link href="/" className="mt-4 inline-block text-primary hover:underline">
          חזור לדף הבית
        </Link>
      </div>
    </div>
  )
} 