'use client'

import { searchProducts, type Product } from '@/lib/db'
import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true)
        const data = await searchProducts(searchQuery)
        setProducts(data)
        setError(null)
      } catch (err) {
        setError('שגיאה בטעינת המוצרים')
        console.error('Error fetching products:', err)
      } finally {
        setLoading(false)
      }
    }
    
    // Debounce search
    const timeoutId = setTimeout(() => {
      fetchProducts()
    }, 300)
    
    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  if (loading && searchQuery === '') {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">קטלוג מוצרים</h1>
        <div className="flex items-center justify-center p-8">
          <div className="text-lg">טוען...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">קטלוג מוצרים</h1>
      
      <Input
        type="search"
        placeholder="חיפוש מוצרים..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-4 max-w-md"
      />
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {loading ? (
        <div className="flex items-center justify-center p-4">
          <div>מחפש...</div>
        </div>
      ) : (
        <>
          <div className="mb-4 text-sm text-gray-600">
            נמצאו {products.length} מוצרים
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <Card key={product.id || product.Name} className="hover:shadow-lg transition-shadow">
                {product["Product pic"] && (
                  <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                    <img
                      src={product["Product pic"]}
                      alt={product.Name}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-lg">{product.Name}</CardTitle>
                  {product["Product Category"] && (
                    <CardDescription>
                      {product["Product Category"]} - {product["Product Type"]}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {product.Price && (
                      <div className="font-semibold text-lg">
                        מחיר: ₪{product.Price}
                      </div>
                    )}
                    {product.Price36 && (
                      <div className="text-sm text-gray-600">
                        36 תשלומים: ₪{product.Price36}
                      </div>
                    )}
                    {product.Price48 && (
                      <div className="text-sm text-gray-600">
                        48 תשלומים: ₪{product.Price48}
                      </div>
                    )}
                    {product.Description && (
                      <p className="text-sm mt-2">{product.Description}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {products.length === 0 && !loading && (
            <div className="text-center py-8 text-gray-500">
              {searchQuery ? 'לא נמצאו מוצרים התואמים לחיפוש' : 'לא נמצאו מוצרים'}
            </div>
          )}
        </>
      )}
    </div>
  )
} 