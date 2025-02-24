'use client'

import { Button } from "@/components/ui/button"
import { Link } from '@/navigation'
import { FileText, Users, Package, ClipboardList, FileCheck, Calendar } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslations } from 'next-intl'

export default function HomePage() {
  const t = useTranslations('Home')

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <div className="container mx-auto px-4 py-6 md:py-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{t('title')}</h1>
          <p className="text-muted-foreground mt-2">{t('description')}</p>
        </div>
        {/* Your existing cards */}
      </div>
    </div>
  )
} 