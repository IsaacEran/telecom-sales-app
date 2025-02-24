
import React from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface HeaderProps {
  title: string
  backUrl?: string
}

export function Header({ title, backUrl = "/" }: HeaderProps) {
  return (
    <header className="bg-primary text-primary-foreground p-4">
      <div className="container mx-auto flex items-center justify-between">
        <h1 className="text-2xl font-bold">{title}</h1>
        <Link href={backUrl} className="flex items-center">
          <ArrowLeft className="mr-2" />
          חזור
        </Link>
      </div>
    </header>
  )
}
