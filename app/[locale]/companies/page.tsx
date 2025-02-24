'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { getCompanies } from "@/lib/db"
import { LoadingSkeleton } from '@/components/ui/loading'
import { useTranslations } from 'next-intl'
import { Link } from '@/navigation'

export default function CompaniesPage() {
  const router = useRouter()
  const t = useTranslations('Companies')
  // ... rest of your component

  return (
    <Link href="/">Back to Home</Link>
  )
} 