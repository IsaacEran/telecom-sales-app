import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">מערכת מכירות טלקום</h1>
      
      <div className="grid gap-4">
        <Link href="/new-order">
          <Button className="w-full">הזמנה חדשה</Button>
        </Link>
        
        <Link href="/companies">
          <Button variant="outline" className="w-full">לקוחות</Button>
        </Link>
        
        <Link href="/products">
          <Button variant="outline" className="w-full">מוצרים</Button>
        </Link>
      </div>
    </div>
  )
} 