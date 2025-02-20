'use client'

import { useState, useEffect } from 'react'
import { filterProductsByCategory, Product } from '@/lib/db'

export default function TestProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProducts() {
      try {
        console.log('Fetching products...')
        const data = await filterProductsByCategory('מוצרים') // Using a sample category
        console.log('Fetched products:', data)
        setProducts(data)
      } catch (err) {
        console.error('Error fetching products:', err)
        setError('Failed to fetch products: ' + (err instanceof Error ? err.message : String(err)))
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Products</h1>
      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <ul className="list-disc pl-5">
          {products.map(product => (
            <li key={product.id} className="mb-2">
              <strong>{product.Name}</strong> - Category: {product["Product Category"]}, Price: {product.Price}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}