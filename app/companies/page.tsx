import { getCompanies, type Company } from '@/lib/db'

export default function CompaniesPage() {
  const companies = getCompanies()

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Companies</h1>
      <div className="grid gap-4">
        {companies.map((company) => (
          <div 
            key={company["ח.פ. או ע.מ"]} 
            className="p-4 border rounded-lg"
          >
            <h2 className="font-bold">{company["שם העסק"]}</h2>
            <p>טלפון: {company["טלפון"]}</p>
            <p>כתובת: {company["כתובת מלאה"]}</p>
          </div>
        ))}
      </div>
    </div>
  )
} 