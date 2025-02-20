'use client'

import { useState, useEffect } from 'react'
import { Command } from 'cmdk'
import { getCompanies, type Company } from '@/lib/db'

export function CustomerSelect({ onSelect }: { onSelect: (company: Company) => void }) {
  const [companies, setCompanies] = useState<Company[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const data = await getCompanies()
        setCompanies(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error('Error fetching companies:', error)
        setCompanies([])
      }
    }
    fetchCompanies()
  }, [])

  const filteredCompanies = companies.filter(company => 
    company["שם העסק"].toLowerCase().includes(searchQuery.toLowerCase()) ||
    company["ח.פ. או ע.מ"].includes(searchQuery)
  )

  return (
    <div className="relative">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="חפש לקוח לפי שם או ח.פ..."
        className="w-full p-2 border rounded"
      />
      {searchQuery && (
        <div className="absolute w-full mt-1 bg-white border rounded shadow-lg max-h-60 overflow-auto">
          {filteredCompanies.map((company) => (
            <div
              key={company["ח.פ. או ע.מ"]}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                onSelect(company)
                setSearchQuery("")
              }}
            >
              <div className="font-medium">{company["שם העסק"]}</div>
              <div className="text-sm text-gray-600">{company["ח.פ. או ע.מ"]}</div>
            </div>
          ))}
          {filteredCompanies.length === 0 && (
            <div className="p-2 text-gray-500">לא נמצאו תוצאות</div>
          )}
        </div>
      )}
    </div>
  )
} 