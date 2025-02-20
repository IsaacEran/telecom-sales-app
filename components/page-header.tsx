import { Button } from "@/components/ui/button"
import { ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface PageHeaderProps {
  title: string
  description?: string
}

export function PageHeader({ title, description }: PageHeaderProps) {
  const router = useRouter()

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4">
        <Button 
          variant="ghost" 
          onClick={() => router.push('/')}
          className="flex items-center gap-2 mb-4"
        >
          <ArrowRight className="h-4 w-4" />
          חזור לדף הבית
        </Button>
        <h1 className="text-2xl font-bold">{title}</h1>
        {description && <p className="text-muted-foreground mt-1">{description}</p>}
      </div>
    </header>
  )
} 