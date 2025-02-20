'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { readJSON } from "@/lib/csvHandler"

interface Order {
  id: string;
  customerName: string;
  date: string;
  status: string;
  stage: string;
  items: Array<{
    productId: string;
    quantity: number;
    price: string;
  }>;
  totals: {
    OTC: number;
    Service: number;
    OneTime: number;
  };
}

export default function ActiveOrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersData = await readJSON("orders.json")
        // Filter only active/pending orders
        const activeOrders = ordersData.filter((order: Order) => 
          order.status === 'pending' || order.status === 'in-progress'
        )
        setOrders(activeOrders)
      } catch (error) {
        console.error('Error fetching orders:', error)
      }
    }
    fetchOrders()
  }, [])

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

      <main className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">הזמנות פעילות</h1>
        
        <div className="grid gap-4">
          {orders.map((order) => (
            <Card key={order.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">
                  {order.customerName}
                </CardTitle>
                <div className="text-sm text-muted-foreground">
                  {new Date(order.date).toLocaleDateString('he-IL')}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      מספר פריטים: {order.items.length}
                    </p>
                    <p className="text-sm font-medium">
                      סה"כ: ₪{(order.totals.OTC + order.totals.Service + order.totals.OneTime).toFixed(2)}
                    </p>
                  </div>
                  <Button 
                    variant="outline"
                    onClick={() => router.push(`/orders/${order.id}`)}
                  >
                    צפה בהזמנה
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
} 