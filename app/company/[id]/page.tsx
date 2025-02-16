import { getCompany } from '@/lib/db'

export default function CompanyPage({ params }: { params: { id: string } }) {
  const company = getCompany(params.id)

  if (!company) {
    return <div>Company not found</div>
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{company["שם העסק"]}</h1>
      <div className="space-y-2">
        <p>ח.פ: {company["ח.פ. או ע.מ"]}</p>
        <p>טלפון: {company["טלפון"]}</p>
        <p>כתובת: {company["כתובת מלאה"]}</p>
        <p>ספק אינטרנט: {company["ספק אינטרנט"]}</p>
      </div>
    </div>
  )
} 