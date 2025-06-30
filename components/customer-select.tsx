'use client'

import * as React from "react"
import { Check, ChevronsUpDown, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getCompanies, searchCompanies, type Company, type Product } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Branch {
  name: string;
  address: string;
}

interface CustomerSelectProps {
  onSelect: (company: Company) => void;
  onBranchUpdate?: (branches: Branch[]) => void;
  selectedCompany?: Company | null;
}

export function CustomerSelect({ onSelect, onBranchUpdate, selectedCompany: propSelectedCompany }: CustomerSelectProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedCompany, setSelectedCompany] = React.useState<Company | null>(propSelectedCompany || null)
  const [isMultiBranch, setIsMultiBranch] = React.useState(false)
  const [branches, setBranches] = React.useState<Branch[]>([])
  const [companies, setCompanies] = React.useState<Company[]>([])
  const [loading, setLoading] = React.useState(true)

  // Fetch companies on component mount and when search query changes
  React.useEffect(() => {
    async function fetchCompanies() {
      try {
        setLoading(true)
        const data = searchQuery 
          ? await searchCompanies(searchQuery)
          : await getCompanies()
        setCompanies(data)
      } catch (error) {
        console.error('Error fetching companies:', error)
        setCompanies([])
      } finally {
        setLoading(false)
      }
    }
    
    // Debounce search
    const timeoutId = setTimeout(() => {
      fetchCompanies()
    }, 300)
    
    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  // Products are now passed as props from parent component


  const addBranch = () => {
    const newBranches = [...branches, { name: '', address: '' }]
    setBranches(newBranches)
    onBranchUpdate?.(newBranches)
  }

  const updateBranch = (index: number, field: keyof Branch, value: string) => {
    const newBranches = branches.map((branch, i) =>
      i === index ? { ...branch, [field]: value } : branch
    )
    setBranches(newBranches)
    onBranchUpdate?.(newBranches)
  }


  const filteredCompanies = companies.filter(company =>
    company["שם העסק"].toLowerCase().includes(searchQuery.toLowerCase()) ||
    company["ח.פ. או ע.מ"].includes(searchQuery)
  )

  return (
    <div className="relative">
      <div className="flex gap-2">
        <Input
          placeholder="חפש לקוח..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            setIsOpen(true)
          }}
          onClick={() => setIsOpen(true)}
        />
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
        >
          <ChevronsUpDown className="h-4 w-4" />
        </Button>
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
          {filteredCompanies.length === 0 ? (
            <div className="p-2 text-sm text-gray-500">לא נמצאו תוצאות</div>
          ) : (
            filteredCompanies.map((company) => (
              <div
                key={company["ח.פ. או ע.מ"]}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  setSelectedCompany(company)
                  onSelect(company)
                  setIsOpen(false)
                  setSearchQuery(company["שם העסק"])
                }}
              >
                <div className="font-medium">{company["שם העסק"]}</div>
                <div className="text-sm text-gray-500">
                  {company["ח.פ. או ע.מ"]} - {company["כתובת מלאה"]}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {selectedCompany && (
        <div className="mt-4">
          <div className="flex items-center space-x-2 space-x-reverse">
            <Switch
              id="isMultiBranch"
              checked={isMultiBranch}
              onCheckedChange={(checked) => setIsMultiBranch(checked)}
            />
            <Label htmlFor="isMultiBranch">לקוח מרובה סניפים</Label>
          </div>

          {isMultiBranch && (
            <div className="space-y-4 mt-4">
              {branches.map((branch, branchIndex) => (
                <Card key={branchIndex} className="p-4">
                  <CardHeader>
                    <CardTitle className="text-lg">סניף {branchIndex + 1}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Input
                        placeholder="שם הסניף"
                        value={branch.name}
                        onChange={(e) => updateBranch(branchIndex, 'name', e.target.value)}
                      />
                      <Input
                        placeholder="כתובת הסניף"
                        value={branch.address}
                        onChange={(e) => updateBranch(branchIndex, 'address', e.target.value)}
                      />
                    </div>

                  </CardContent>
                </Card>
              ))}
              <Button type="button" onClick={addBranch}>
                <Plus className="h-4 w-4 mr-2" /> הוסף סניף
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}