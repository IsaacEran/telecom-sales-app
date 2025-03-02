import { NextResponse } from 'next/server';
import { getCompanies } from '@/lib/db';
import pool from '@/lib/db-client';

export async function GET() {
  try {
    // Test direct connection first
    let connectionTest;
    try {
      const client = await pool.connect();
      connectionTest = { success: true, message: 'Database connection successful' };
      client.release();
    } catch (connError) {
      connectionTest = { 
        success: false, 
        message: 'Database connection failed',
        error: connError instanceof Error ? connError.message : 'Unknown error',
        stack: connError instanceof Error ? connError.stack : null
      };
    }
    
    // Try to get companies
    let companiesResult;
    try {
      const companies = await getCompanies();
      companiesResult = { 
        success: true, 
        count: companies.length,
        sample: companies.slice(0, 2) // Return just first 2 for sample
      };
    } catch (compError) {
      companiesResult = { 
        success: false, 
        error: compError instanceof Error ? compError.message : 'Unknown error',
        stack: compError instanceof Error ? compError.stack : null
      };
    }
    
    return NextResponse.json({
      connectionTest,
      companiesResult,
      env: {
        host: process.env.POSTGRES_HOST?.substring(0, 10) + '...',
        database: process.env.POSTGRES_DATABASE,
        user: process.env.POSTGRES_USER,
        ssl: process.env.POSTGRES_SSL
      }
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : null
      }, 
      { status: 500 }
    );
  }
}