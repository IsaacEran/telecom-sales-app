import { NextResponse } from 'next/server';
import { testConnection } from '@/lib/db-client';
import { getCompanies } from '@/lib/db';

export async function GET() {
  // Test database connection
  const connectionTest = await testConnection();
  
  // Test companies data access
  let companiesResult = { success: false, count: 0, sample: [] };
  if (connectionTest.success) {
    try {
      const companies = await getCompanies();
      companiesResult = {
        success: true,
        count: companies.length,
        sample: companies.slice(0, 2) as never[] // Just return a few samples
      };
    } catch (error) {
      companiesResult = {
        success: false,
        count: 0,
        sample: []
      };
    }
  }
  
  // Return environment info (without sensitive data)
  const env = {
    host: process.env.POSTGRES_HOST?.substring(0, 12) + '...',
    database: process.env.POSTGRES_DATABASE,
    user: process.env.POSTGRES_USER?.split('@')[0],
    ssl: process.env.POSTGRES_SSL
  };
  
  return NextResponse.json({
    connectionTest,
    companiesResult,
    env
  });
}