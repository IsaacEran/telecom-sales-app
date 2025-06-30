/**
 * Migration script to import JSON data to Supabase
 * Run with: node scripts/migrate-to-supabase.js
 */

import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function migrateCompanies() {
  console.log('Migrating companies...')
  
  try {
    const companiesPath = path.join(__dirname, '..', 'data', 'companies.json')
    const companiesData = JSON.parse(fs.readFileSync(companiesPath, 'utf8'))
    
    // Transform the data to match Supabase schema
    const transformedCompanies = companiesData.map(company => ({
      "שם העסק": company["שם העסק"],
      "ח.פ. או ע.מ": company["ח.פ. או ע.מ"],
      "טלפון": company["טלפון"] || null,
      "כתובת מלאה": company["כתובת מלאה"] || null,
      "ספק אינטרנט": company["ספק אינטרנט"] || null,
      "מייל בית העסק": company["מייל בית העסק לחשבוניות"] || null,
      "סוג עסק": company["ע.מ. או חברה בעמ"] || null,
      "שם מורשה חתימה": company["שם מורשה"] || null,
      "נייד מורשה חתימה": company["נייד מורשה"] || null,
      "מייל מורשה חתימה": company["מייל מורשה"] || null,
      "שם איש קשר": company["שם ומשפחה - איש קשר"] || null,
      "נייד איש קשר": company["נייד איש קשר"] || null,
      "מייל איש קשר": company["מייל איש קשר"] || null,
      "הערות": company["הערות"] || null,
      "מרובה סניפים": false, // Default value
      "סניפים": [] // Default empty array
    }))
    
    // Insert in batches to avoid hitting limits
    const batchSize = 100
    for (let i = 0; i < transformedCompanies.length; i += batchSize) {
      const batch = transformedCompanies.slice(i, i + batchSize)
      
      const { error } = await supabase
        .from('companies')
        .upsert(batch, { 
          onConflict: 'ח.פ. או ע.מ',
          ignoreDuplicates: false 
        })
      
      if (error) {
        console.error(`Error inserting companies batch ${i}:`, error)
      } else {
        console.log(`Inserted companies batch ${i + 1} - ${Math.min(i + batchSize, transformedCompanies.length)}`)
      }
    }
    
    console.log(`✅ Migrated ${transformedCompanies.length} companies`)
  } catch (error) {
    console.error('Error migrating companies:', error)
  }
}

async function migrateProducts() {
  console.log('Migrating products...')
  
  try {
    const productsPath = path.join(__dirname, '..', 'data', 'products.json')
    const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf8'))
    
    // Transform the data to match Supabase schema
    const transformedProducts = productsData.map(product => ({
      "Name": product["Name"],
      "Price": parseFloat(product["Price"]) || null,
      "Price36": parseFloat(product["price36"]) || null,
      "Price48": parseFloat(product["price48"]) || null,
      "Description": product["Description"] || null,
      "Product Type": product["Product Type"] || null,
      "Product Category": product["Product Category"] || null,
      "HOT Price base": parseFloat(product["HOT Price base"]) || null
    }))
    
    // Insert in batches
    const batchSize = 100
    for (let i = 0; i < transformedProducts.length; i += batchSize) {
      const batch = transformedProducts.slice(i, i + batchSize)
      
      const { error } = await supabase
        .from('products')
        .upsert(batch, { 
          onConflict: 'Name',
          ignoreDuplicates: false 
        })
      
      if (error) {
        console.error(`Error inserting products batch ${i}:`, error)
      } else {
        console.log(`Inserted products batch ${i + 1} - ${Math.min(i + batchSize, transformedProducts.length)}`)
      }
    }
    
    console.log(`✅ Migrated ${transformedProducts.length} products`)
  } catch (error) {
    console.error('Error migrating products:', error)
  }
}

async function testConnection() {
  console.log('Testing Supabase connection...')
  
  try {
    const { data, error } = await supabase.from('companies').select('count').single()
    
    if (error) {
      console.error('❌ Connection test failed:', error.message)
      return false
    }
    
    console.log('✅ Supabase connection successful')
    return true
  } catch (error) {
    console.error('❌ Connection test failed:', error.message)
    return false
  }
}

async function main() {
  console.log('🚀 Starting migration to Supabase...')
  
  // Test connection first
  const connectionOk = await testConnection()
  if (!connectionOk) {
    console.error('❌ Migration aborted due to connection issues')
    process.exit(1)
  }
  
  // Run migrations
  await migrateCompanies()
  await migrateProducts()
  
  console.log('🎉 Migration completed!')
}

main().catch((error) => {
  console.error('Migration failed:', error)
  process.exit(1)
})