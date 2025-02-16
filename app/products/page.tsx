'use client'

import { searchProducts, type Product } from '@/lib/db'
import { useState } from 'react'

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const products = searchProducts(searchQuery)

  return (
    <div className="p-4">
      <input
        type="search"
        placeholder="Search products..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="p-2 border rounded mb-4"
      />
      
      <div className="grid gap-4">
        {products.map((product) => (
          <div key={product.Name} className="p-4 border rounded-lg">
            <h2 className="font-bold">{product.Name}</h2>
            <p>מחיר: {product.Price}</p>
            <p>{product.Description}</p>
          </div>
        ))}
      </div>
    </div>
  )
} 